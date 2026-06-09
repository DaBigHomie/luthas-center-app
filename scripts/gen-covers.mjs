/**
 * gen-covers.mjs — Branded SVG cover generator for Luthas Center
 *
 * Generates a distinct branded cover SVG for each course/post that lacks a
 * real processed image. Uses design tokens from src/shared/design/tokens.ts
 * (accessed via the compiled tokens.json for Node.js use without transpiling).
 *
 * Output: public/covers/<type>-<slug>.svg
 * Deterministic — no Date/random. Safe to re-run.
 *
 * Usage:
 *   node scripts/gen-covers.mjs
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DATA_DIR = path.join(ROOT, 'data', 'extracted', '_sanitized')
const MANIFEST_PATH = path.join(ROOT, 'data', 'extracted', 'media-url-manifest.json')
const TOKENS_PATH = path.join(ROOT, 'src', 'shared', 'design', 'tokens.json')
const OUT_DIR = path.join(ROOT, 'public', 'covers')

// ---------------------------------------------------------------------------
// Design tokens — read from tokens.json (written at build time; mirrors tokens.ts)
// ---------------------------------------------------------------------------

let tokenColors = {
  primary:   'hsl(0, 0%, 7%)',
  secondary: 'hsl(216, 72%, 21%)',
  accent:    'hsl(19, 94%, 55%)',
  textInverse: 'hsl(0, 0%, 100%)',
  surface:   'hsl(0, 0%, 96%)',
  textMuted: 'hsl(0, 0%, 46%)',
}

try {
  const raw = readFileSync(TOKENS_PATH, 'utf-8')
  const parsed = JSON.parse(raw)
  // tokens.json may store colors as plain HSL strings OR as objects {hex, hsl, ...}
  const c = parsed?.color ?? parsed?.colors ?? null
  if (c) {
    function extractColor(v) {
      if (!v) return null
      if (typeof v === 'string') return v
      // Object form: prefer hsl, fallback hex
      return v.hsl ?? v.hex ?? null
    }
    tokenColors = {
      primary:     extractColor(c.primary)              ?? tokenColors.primary,
      secondary:   extractColor(c.secondary)            ?? tokenColors.secondary,
      accent:      extractColor(c.accent)               ?? tokenColors.accent,
      textInverse: extractColor(c['text-inverse'] ?? c.textInverse) ?? tokenColors.textInverse,
      surface:     extractColor(c.surface)              ?? tokenColors.surface,
      textMuted:   extractColor(c['text-muted'] ?? c.textMuted)     ?? tokenColors.textMuted,
    }
  }
} catch {
  // tokens.json may not exist yet; fall back to hardcoded token values above
}

// ---------------------------------------------------------------------------
// Slugify — mirrors src/shared/lib/slugify.ts
// ---------------------------------------------------------------------------

function slugify(s) {
  return String(s)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function isNumericSlug(slug) {
  if (!slug) return true
  return /^\d+$/.test(slug)
}

// ---------------------------------------------------------------------------
// Media manifest — keyed by attached_file (wp_path)
// ---------------------------------------------------------------------------

function loadManifest() {
  try {
    const raw = readFileSync(MANIFEST_PATH, 'utf-8')
    const parsed = JSON.parse(raw)
    return new Map(parsed.records.map((r) => [r.wp_path, r]))
  } catch {
    return new Map()
  }
}

function loadJson(filename) {
  const raw = readFileSync(path.join(DATA_DIR, filename), 'utf-8')
  return JSON.parse(raw).records
}

// ---------------------------------------------------------------------------
// Determine if an item has a real (non-placeholder) media file
// ---------------------------------------------------------------------------

function hasRealMedia(mediaRecord, manifest) {
  if (!mediaRecord) return false
  if (!mediaRecord.attached_file) return false
  const entry = manifest.get(mediaRecord.attached_file)
  return Boolean(entry && entry.bytes_before > 0 && entry.processed_path)
}

// ---------------------------------------------------------------------------
// Title-slug map (same dedup logic as data-source.ts)
// ---------------------------------------------------------------------------

function buildTitleSlugMap(records) {
  const seen = new Map()
  const result = new Map()
  const sorted = [...records].sort((a, b) => a.wp_id - b.wp_id)
  for (const r of sorted) {
    const base = slugify(String(r.title ?? r.wp_id))
    const count = seen.get(base) ?? 0
    result.set(r.wp_id, count === 0 ? base : `${base}-${count + 1}`)
    seen.set(base, count + 1)
  }
  return result
}

// ---------------------------------------------------------------------------
// Deterministic accent selector — hash of slug mod accent palette length
// ---------------------------------------------------------------------------

// Gradient pairs: [topLeft, bottomRight] — all token values, no raw hex
const GRADIENT_PAIRS = [
  [tokenColors.primary,   tokenColors.secondary],
  [tokenColors.secondary, tokenColors.accent],
  [tokenColors.accent,    tokenColors.primary],
  [tokenColors.secondary, tokenColors.primary],
]

function hashSlug(slug) {
  let h = 0
  for (let i = 0; i < slug.length; i++) {
    h = ((h << 5) - h + slug.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

function gradientForSlug(slug) {
  return GRADIENT_PAIRS[hashSlug(slug) % GRADIENT_PAIRS.length]
}

// ---------------------------------------------------------------------------
// Text wrapper — splits title into lines of ~22 chars each (SVG has no native wrapping)
// ---------------------------------------------------------------------------

function wrapTitle(title, maxCharsPerLine = 22) {
  const words = title.split(/\s+/)
  const lines = []
  let current = ''
  for (const word of words) {
    if (current.length === 0) {
      current = word
    } else if (current.length + 1 + word.length <= maxCharsPerLine) {
      current += ' ' + word
    } else {
      lines.push(current)
      current = word
    }
  }
  if (current) lines.push(current)
  // Cap at 4 lines; ellipsis on last if truncated
  if (lines.length > 4) {
    lines.splice(4)
    lines[3] = lines[3].slice(0, maxCharsPerLine - 1) + '…'
  }
  return lines
}

// ---------------------------------------------------------------------------
// SVG generator — 1200 × 630 (OG image aspect)
// ---------------------------------------------------------------------------

function generateSvg(title, type, slug) {
  const [gradStart, gradEnd] = gradientForSlug(slug)
  const lines = wrapTitle(title)
  const lineHeight = 52
  // Center the text block vertically: midpoint 315 − (block height / 2)
  const blockHeight = lines.length * lineHeight
  const startY = Math.round((630 - blockHeight) / 2) + 36 // +36 to account for cap-height offset

  // Badge label
  const badge = type === 'course' ? 'COURSE' : 'ARTICLE'
  const badgeColor = type === 'course' ? tokenColors.accent : tokenColors.secondary

  // Escape XML special chars in text
  function esc(s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  }

  const textLines = lines
    .map((line, i) => {
      const y = startY + i * lineHeight
      return `  <text x="600" y="${y}" text-anchor="middle" font-family="Montserrat,Arial,sans-serif" font-weight="700" font-size="38" fill="${esc(tokenColors.textInverse)}" opacity="0.97">${esc(line)}</text>`
    })
    .join('\n')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="${esc(title)}">
  <defs>
    <linearGradient id="bg-${esc(slug)}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${esc(gradStart)};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${esc(gradEnd)};stop-opacity:1" />
    </linearGradient>
  </defs>
  <!-- Background gradient -->
  <rect width="1200" height="630" fill="url(#bg-${esc(slug)})" />
  <!-- Subtle texture overlay -->
  <rect width="1200" height="630" fill="${esc(tokenColors.textInverse)}" opacity="0.04" />
  <!-- Bottom bar with brand name -->
  <rect x="0" y="558" width="1200" height="72" fill="${esc(tokenColors.primary)}" opacity="0.55" />
  <text x="60" y="602" font-family="Montserrat,Arial,sans-serif" font-weight="700" font-size="22" fill="${esc(tokenColors.textInverse)}" opacity="0.90">Luthas Center for Excellence</text>
  <!-- Type badge -->
  <rect x="60" y="48" width="${badge.length * 14 + 28}" height="34" rx="4" fill="${esc(badgeColor)}" opacity="0.90" />
  <text x="${60 + (badge.length * 14 + 28) / 2}" y="70" text-anchor="middle" font-family="Montserrat,Arial,sans-serif" font-weight="700" font-size="14" fill="${esc(tokenColors.textInverse)}" letter-spacing="2">${esc(badge)}</text>
  <!-- Title text -->
${textLines}
</svg>`
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

mkdirSync(OUT_DIR, { recursive: true })

const manifest = loadManifest()
const mediaRecords = loadJson('media.json')
const mediaMap = new Map(mediaRecords.map((m) => [m.wp_id, m]))

const courses = loadJson('courses.json')
const posts = loadJson('posts.json')

// Build slug maps for courses (same logic as data-source.ts)
const courseSlugMap = buildTitleSlugMap(courses)

function resolveCourseSlug(r) {
  const raw = r.slug
  if (!isNumericSlug(raw)) return raw
  return courseSlugMap.get(r.wp_id) ?? slugify(String(r.title ?? r.wp_id))
}

let generated = 0
let skipped = 0

// --- Courses ---
const publishedCourses = courses.filter((r) => r.status === 'publish')
for (const course of publishedCourses) {
  const slug = resolveCourseSlug(course)
  const imageId = course.featured_image_id ?? course.cover_image_id ?? null
  const mediaRow = imageId ? mediaMap.get(imageId) ?? null : null

  if (hasRealMedia(mediaRow, manifest)) {
    skipped++
    continue
  }

  const outPath = path.join(OUT_DIR, `course-${slug}.svg`)
  const svg = generateSvg(course.title ?? 'Untitled Course', 'course', slug)
  writeFileSync(outPath, svg, 'utf-8')
  generated++
}

// --- Posts ---
const publishedPosts = posts.filter((r) => r.status === 'publish')
for (const post of publishedPosts) {
  const rawSlug = post.slug
  const slug = rawSlug?.trim() ? rawSlug : slugify(String(post.title ?? post.wp_id))
  const mediaRow = post.featured_image_id ? mediaMap.get(post.featured_image_id) ?? null : null

  if (hasRealMedia(mediaRow, manifest)) {
    skipped++
    continue
  }

  const outPath = path.join(OUT_DIR, `post-${slug}.svg`)
  const svg = generateSvg(post.title ?? 'Untitled Post', 'post', slug)
  writeFileSync(outPath, svg, 'utf-8')
  generated++
}

console.log(`[gen-covers] Generated ${generated} SVG covers → public/covers/`)
console.log(`[gen-covers] Skipped ${skipped} items (real image present)`)
