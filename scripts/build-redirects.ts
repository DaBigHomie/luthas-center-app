/**
 * scripts/build-redirects.ts
 *
 * Reads data/extracted/redirects.json and
 * data/extracted/_sanitized/{courses,lessons}.json to produce a redirect
 * lookup map that Next.js middleware can use at request time.
 *
 * Output: src/shared/config/redirects.generated.ts
 *
 * Run:
 *   npx tsx scripts/build-redirects.ts
 *
 * The generated file is committed so deployments don't need Node FS access.
 * Re-run whenever redirects.json or course/lesson titles change.
 */

import * as fs from 'node:fs'
import * as path from 'node:path'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function isNumericSlug(slug: string | null | undefined): boolean {
  if (!slug) return true
  return /^\d+$/.test(slug)
}

// ---------------------------------------------------------------------------
// Load source data
// ---------------------------------------------------------------------------

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname), '..')
const SANITIZED = path.join(ROOT, 'data', 'extracted', '_sanitized')

type RawRecord = Record<string, unknown>

function loadJson<T>(filePath: string): T {
  const raw = fs.readFileSync(filePath, 'utf-8')
  const parsed = JSON.parse(raw) as { records: T }
  return parsed.records
}

interface RawCourse {
  wp_id: number
  title: string
  slug?: string
}

interface RawLesson {
  wp_id: number
  title: string
  slug?: string
  course_id?: number
}

interface RedirectEntry {
  type: string
  wp_id: number
  slug: string
  old_path: string
  new_path: string
  reason: string
}

const courses = loadJson<RawCourse[]>(path.join(SANITIZED, 'courses.json'))
const lessons = loadJson<RawLesson[]>(path.join(SANITIZED, 'lessons.json'))

const redirectsRaw = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'data', 'extracted', 'redirects.json'), 'utf-8'),
) as { redirects: RedirectEntry[] }

// ---------------------------------------------------------------------------
// Build title-slug maps (same algorithm as data-source.ts mappers)
// ---------------------------------------------------------------------------

/** Deduplicate slugs: first occurrence keeps base slug; ties get -2, -3 … */
function buildSlugMap(
  records: Array<{ wp_id: number; title: string }>,
): Map<number, string> {
  const seen = new Map<string, number>() // slug -> next suffix counter
  const result = new Map<number, string>()

  // Sort by wp_id for deterministic assignment (same as adapter)
  const sorted = [...records].sort((a, b) => a.wp_id - b.wp_id)

  for (const r of sorted) {
    const base = slugify(r.title)
    const count = seen.get(base) ?? 0
    const final = count === 0 ? base : `${base}-${count + 1}`
    seen.set(base, count + 1)
    result.set(r.wp_id, final)
  }

  return result
}

const courseSlugMap = buildSlugMap(courses)
const lessonSlugMap = buildSlugMap(lessons)

// ---------------------------------------------------------------------------
// Build the course wp_id look-up (for lesson new_path rewriting)
// ---------------------------------------------------------------------------

const lessonCourseMap = new Map<number, number>()
for (const l of lessons) {
  if (l.course_id != null) lessonCourseMap.set(l.wp_id, l.course_id)
}

// ---------------------------------------------------------------------------
// Build redirect map: old_path (no trailing slash) → new_path
// ---------------------------------------------------------------------------

const redirectMap: Record<string, string> = {}

for (const entry of redirectsRaw.redirects) {
  const oldPath = entry.old_path.replace(/\/$/, '')
  if (!oldPath) continue

  let newPath = entry.new_path.replace(/\/$/, '')

  // Rewrite new_path to use title-slug where the stored slug is numeric
  if (entry.type === 'course') {
    const titleSlug = courseSlugMap.get(entry.wp_id)
    if (titleSlug) {
      newPath = `/courses/${titleSlug}`
    }
  } else if (entry.type === 'lesson') {
    const lessonTitleSlug = lessonSlugMap.get(entry.wp_id)
    const courseWpId = lessonCourseMap.get(entry.wp_id)
    const courseTitleSlug = courseWpId ? courseSlugMap.get(courseWpId) : undefined

    if (lessonTitleSlug && courseTitleSlug) {
      newPath = `/courses/${courseTitleSlug}/lessons/${lessonTitleSlug}`
    } else if (lessonTitleSlug) {
      // Lesson not linked to a course — keep /lessons/[slug] as a fallback
      newPath = `/lessons/${lessonTitleSlug}`
    }
  }

  redirectMap[oldPath] = newPath
}

// ---------------------------------------------------------------------------
// Write generated file
// ---------------------------------------------------------------------------

const CONFIG_DIR = path.join(ROOT, 'src', 'shared', 'config')
fs.mkdirSync(CONFIG_DIR, { recursive: true })

const outPath = path.join(CONFIG_DIR, 'redirects.generated.ts')

const lines = [
  '/**',
  ' * AUTO-GENERATED — do not edit by hand.',
  ' * Re-generate with: npx tsx scripts/build-redirects.ts',
  ' *',
  ` * Generated: ${new Date().toISOString()}`,
  ` * Entries: ${Object.keys(redirectMap).length}`,
  ' */',
  '',
  '/**',
  ' * Redirect lookup: old path (no trailing slash) → new path.',
  ' * Used by src/middleware.ts at request time.',
  ' */',
  'export const REDIRECT_MAP: Readonly<Record<string, string>> = {',
]

for (const [from, to] of Object.entries(redirectMap).sort()) {
  lines.push(`  ${JSON.stringify(from)}: ${JSON.stringify(to)},`)
}

lines.push('}', '')

fs.writeFileSync(outPath, lines.join('\n'), 'utf-8')

const count = Object.keys(redirectMap).length
console.log(`Wrote ${count} redirect entries to src/shared/config/redirects.generated.ts`)

// Print a summary of course/lesson rewrites
const courseRewrites = redirectsRaw.redirects.filter((e) => e.type === 'course').length
const lessonRewrites = redirectsRaw.redirects.filter((e) => e.type === 'lesson').length
console.log(`  Course entries: ${courseRewrites}`)
console.log(`  Lesson entries: ${lessonRewrites}`)
