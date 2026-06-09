/**
 * Data source adapter — Luthas Center
 *
 * Strategy:
 *   1. When NEXT_PUBLIC_SUPABASE_URL is set → use Supabase (call the existing api functions).
 *   2. When that env var is absent → read from local extracted JSON in
 *      data/extracted/_sanitized/*.json  (server-only, fs access via Node.js).
 *
 * This module is server-only. It MUST NOT be imported from 'use client' code.
 *
 * Each exported function keeps the same signature as the entity api.ts it replaces,
 * so callers swap `import from '@/entities/course/api'`
 * for    `import from '@/shared/lib/data-source'` with zero type changes.
 *
 * Media resolution:
 *   resolveMediaUrl(media) → processed_path from media-url-manifest.json if available,
 *   else the source_url from the media row.
 *   For the ~420 orphan images with no file, returns '/placeholder-cover.svg'.
 */

import 'server-only'
import path from 'node:path'
import { readFileSync } from 'node:fs'
import type { CourseSummary, CourseRow, CourseWithCurriculum } from '@/entities/course/model'
import type { PostSummary, PostRow, ListPostsParams } from '@/entities/post/model'
import type { LessonRow } from '@/entities/lesson/model'
import type { MediaRow } from '@/entities/media/model'
import type { TermRow } from '@/entities/term/model'
import type { PageRow, PageSummary } from '@/entities/page/model'
import type { DonationFormRow } from '@/entities/donation/model'
import type { ProductSummary } from '@/entities/product/model'
import type { ProfileRow } from '@/entities/profile/model'
import { slugify, isNumericSlug } from '@/shared/lib/slugify'

// ---------------------------------------------------------------------------
// Mode detection
// ---------------------------------------------------------------------------

export function isSupabaseAvailable(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  )
}

// ---------------------------------------------------------------------------
// JSON loader — cached in-memory per domain (module-level cache, reset on reload)
// ---------------------------------------------------------------------------

const DATA_DIR = path.join(process.cwd(), 'data', 'extracted', '_sanitized')
const MANIFEST_PATH = path.join(process.cwd(), 'data', 'extracted', 'media-url-manifest.json')
const TAXONOMY_PATH = path.join(process.cwd(), 'data', 'extracted', 'taxonomy.json')

const _cache = new Map<string, unknown>()

function loadJson<T>(filename: string): T {
  if (_cache.has(filename)) return _cache.get(filename) as T
  const full = path.join(DATA_DIR, filename)
  const raw = readFileSync(full, 'utf-8')
  const parsed = JSON.parse(raw) as { records: T }
  _cache.set(filename, parsed.records)
  return parsed.records as T
}

// Media manifest — keyed by wp_path for fast lookup
type ManifestRecord = {
  wp_path: string
  processed_path: string | null
  intended_storage_path: string | null
  bytes_before: number
}

let _manifest: Map<string, ManifestRecord> | null = null
function getManifest(): Map<string, ManifestRecord> {
  if (_manifest) return _manifest
  try {
    const raw = readFileSync(MANIFEST_PATH, 'utf-8')
    const parsed = JSON.parse(raw) as { records: ManifestRecord[] }
    _manifest = new Map(parsed.records.map((r) => [r.wp_path, r]))
  } catch {
    _manifest = new Map()
  }
  return _manifest
}

// ---------------------------------------------------------------------------
// Media URL resolution
// ---------------------------------------------------------------------------

/**
 * Resolve the best URL for a media record.
 * Priority: Supabase public_url → manifest processed_path → source_url → placeholder.
 */
export function resolveMediaUrl(media: MediaRow): string {
  // Already has a Supabase public URL
  if (media.public_url) return media.public_url

  // Try to find the processed path from the manifest using attached_file
  if (media.attached_file) {
    const manifest = getManifest()
    const entry = manifest.get(media.attached_file)
    if (entry && entry.bytes_before > 0 && entry.processed_path) {
      // Local dev: public/media is symlinked → .wp-source/_processed, so the
      // processed file is served at /media/<relative>. In production this same
      // relative path is served from the Supabase `media` bucket public URL.
      const rel = entry.processed_path.replace(/^\.wp-source\/_processed\//, '')
      return `/media/${rel}`
    }
  }

  // No local processed file (orphan / Google-Drive-offloaded / unmatched).
  // The WP source_url points at the unreachable dev host (luthascenter.local),
  // which would break next/image — so use the branded placeholder instead.
  return '/placeholder-cover.svg'
}

// ---------------------------------------------------------------------------
// JSON-mode type adapters
//
// The sanitized JSON records don't perfectly match the database row types
// (different field names, extra fields, etc.).  These functions map
// JSON-extracted records to the types used by the entity layer.
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RawCourse = Record<string, any>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RawPost = Record<string, any>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RawLesson = Record<string, any>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RawMedia = Record<string, any>

// ---------------------------------------------------------------------------
// Title-slug tables (built once per process from the full record set)
//
// Courses and lessons are extracted with numeric wp_id as their slug, so we
// generate stable, human-readable slugs from the title and cache the mapping.
// ---------------------------------------------------------------------------

let _courseSlugMap: Map<number, string> | null = null
let _lessonSlugMap: Map<number, string> | null = null

/**
 * Build a wp_id → title-slug map with suffix-based deduplication.
 * Records are processed sorted by wp_id so the assignment is deterministic.
 */
function buildTitleSlugMap(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  records: Array<Record<string, any>>,
): Map<number, string> {
  const seen = new Map<string, number>()
  const result = new Map<number, string>()
  const sorted = [...records].sort((a, b) => a.wp_id - b.wp_id)
  for (const r of sorted) {
    const base = slugify(String(r.title ?? r.wp_id))
    const count = seen.get(base) ?? 0
    result.set(r.wp_id, count === 0 ? base : `${base}-${count + 1}`)
    seen.set(base, count + 1)
  }
  return result
}

function getCourseSlugMap(): Map<number, string> {
  if (_courseSlugMap) return _courseSlugMap
  const records = loadJson<RawCourse[]>('courses.json')
  _courseSlugMap = buildTitleSlugMap(records)
  return _courseSlugMap
}

function getLessonSlugMap(): Map<number, string> {
  if (_lessonSlugMap) return _lessonSlugMap
  const records = loadJson<RawLesson[]>('lessons.json')
  _lessonSlugMap = buildTitleSlugMap(records)
  return _lessonSlugMap
}

/**
 * Resolve the best slug for a course record.
 * Falls back to slugify(title) whenever the stored slug is absent or numeric.
 */
function resolveCourseSlug(r: RawCourse): string {
  const raw = r.slug as string | undefined
  if (!isNumericSlug(raw)) return raw!
  return getCourseSlugMap().get(r.wp_id as number) ?? slugify(String(r.title ?? r.wp_id))
}

/**
 * Resolve the best slug for a lesson record.
 */
function resolveLessonSlug(r: RawLesson): string {
  const raw = r.slug as string | undefined
  if (!isNumericSlug(raw)) return raw!
  return getLessonSlugMap().get(r.wp_id as number) ?? slugify(String(r.title ?? r.wp_id))
}

function mapCourseRow(r: RawCourse): CourseRow {
  return {
    id: String(r.wp_id),
    wp_id: r.wp_id,
    slug: resolveCourseSlug(r),
    title: r.title ?? '',
    content: r.content ?? null,
    excerpt: r.excerpt ?? null,
    short_description: r.short_description ?? null,
    status: r.status ?? 'publish',
    menu_order: r.menu_order ?? 0,
    price: r.price ?? null,
    price_type: r.price_type ?? 'open',
    access_mode: r.access_mode ?? 'open',
    certificate_id: r.certificate_id ?? null,
    featured_image_id: r.featured_image_id ?? null,
    cover_image_id: r.cover_image_id ?? null,
    intro_video: r.intro_video ?? null,
    materials_enabled: r.materials_enabled ?? false,
    steps_source: null,
    step_counts: r.step_counts ?? null,
    old_path: r.old_path ?? null,
    new_path: r.new_path ?? null,
    published_at: r.date ?? null,
    modified_at: r.modified ?? null,
    created_at: r.date ?? new Date().toISOString(),
  } as CourseRow
}

function mapCourseSummary(r: RawCourse): CourseSummary {
  return {
    id: String(r.wp_id),
    wp_id: r.wp_id,
    slug: resolveCourseSlug(r),
    title: r.title ?? '',
    excerpt: r.excerpt ?? null,
    short_description: r.short_description ?? null,
    price: r.price ?? null,
    price_type: r.price_type ?? 'open',
    featured_image_id: r.featured_image_id ?? null,
    access_mode: r.access_mode ?? null,
    published_at: r.date ?? null,
    status: r.status ?? 'publish',
  }
}

function mapPostRow(r: RawPost): PostRow {
  // Posts use post_name (stored as r.slug) — fall back to slugify(title) only if blank
  const rawPostSlug = r.slug as string | undefined
  const resolvedPostSlug = rawPostSlug?.trim()
    ? rawPostSlug
    : slugify(String(r.title ?? r.wp_id))
  return {
    id: String(r.wp_id),
    wp_id: r.wp_id,
    slug: resolvedPostSlug,
    title: r.title ?? '',
    content: r.content ?? null,
    excerpt: r.excerpt ?? null,
    status: r.status ?? 'publish',
    author_id: r.author?.id ?? null,
    featured_image_id: r.featured_image_id ?? null,
    reading_time: r.reading_time_minutes ?? null,
    old_path: r.old_path ?? null,
    new_path: r.new_path ?? null,
    published_at: r.date ?? null,
    modified_at: r.modified ?? null,
    created_at: r.date ?? new Date().toISOString(),
  } as PostRow
}

function mapPostSummary(r: RawPost): PostSummary {
  const rawPostSlug = r.slug as string | undefined
  const resolvedPostSlug = rawPostSlug?.trim()
    ? rawPostSlug
    : slugify(String(r.title ?? r.wp_id))
  return {
    id: String(r.wp_id),
    wp_id: r.wp_id,
    slug: resolvedPostSlug,
    title: r.title ?? '',
    excerpt: r.excerpt ?? null,
    author_id: r.author?.id ?? null,
    featured_image_id: r.featured_image_id ?? null,
    reading_time: r.reading_time_minutes ?? null,
    published_at: r.date ?? null,
    status: r.status ?? 'publish',
  }
}

function mapLessonRow(r: RawLesson): LessonRow {
  return {
    id: String(r.wp_id),
    wp_id: r.wp_id,
    slug: resolveLessonSlug(r),
    title: r.title ?? '',
    content: r.content ?? null,
    excerpt: r.excerpt ?? null,
    status: r.status ?? 'publish',
    course_id: r.course_id ?? null,
    video_url: r.video_url ?? null,
    featured_image_id: r.featured_image_id ?? null,
    sort_order: r.menu_order ?? 0,
    old_path: r.old_path ?? null,
    new_path: r.new_path ?? null,
    published_at: r.date ?? null,
    modified_at: r.modified ?? null,
    created_at: r.date ?? new Date().toISOString(),
  } as LessonRow
}

function mapMediaRow(r: RawMedia): MediaRow {
  return {
    id: String(r.wp_id),
    wp_attachment_id: r.wp_id,
    title: r.title ?? null,
    storage_path: null,
    source_url: r.guid ?? null,
    public_url: null,
    mime_type: r.mime_type ?? null,
    alt_text: r.alt ?? null,
    attached_file: r.attached_file ?? null,
    post_parent: r.post_parent ?? null,
    width: r.width ?? null,
    height: r.height ?? null,
    sizes: r.sizes ?? null,
    created_at: r.date ?? new Date().toISOString(),
  } as MediaRow
}

// ---------------------------------------------------------------------------
// Course functions
// ---------------------------------------------------------------------------

export async function listPublishedCourses(): Promise<CourseSummary[]> {
  if (isSupabaseAvailable()) {
    const { listPublishedCourses: dbFn } = await import('@/entities/course/api')
    return dbFn()
  }
  const records = loadJson<RawCourse[]>('courses.json')
  return records
    .filter((r) => r.status === 'publish')
    .sort((a, b) => (a.menu_order ?? 0) - (b.menu_order ?? 0))
    .map(mapCourseSummary)
}

export async function getCourseBySlug(slug: string): Promise<CourseRow | null> {
  if (isSupabaseAvailable()) {
    const { getCourseBySlug: dbFn } = await import('@/entities/course/api')
    return dbFn(slug)
  }
  const records = loadJson<RawCourse[]>('courses.json')
  // Match against the resolved title-slug (r.slug may be numeric/empty)
  const found = records.find(
    (r) => resolveCourseSlug(r) === slug && r.status === 'publish',
  )
  return found ? mapCourseRow(found) : null
}

export async function getCourseWithCurriculum(slug: string): Promise<CourseWithCurriculum | null> {
  if (isSupabaseAvailable()) {
    const { getCourseWithCurriculum: dbFn } = await import('@/entities/course/api')
    return dbFn(slug)
  }
  const course = await getCourseBySlug(slug)
  if (!course) return null
  const lessons = await listLessonsByCourse(course.wp_id)
  return { ...course, lessons, quizzes: [], steps: [] }
}

export async function listCoursesByTerm(wpTermId: number): Promise<CourseSummary[]> {
  if (isSupabaseAvailable()) {
    const { listCoursesByTerm: dbFn } = await import('@/entities/course/api')
    return dbFn(wpTermId)
  }
  const records = loadJson<RawCourse[]>('courses.json')
  return records
    .filter(
      (r) =>
        r.status === 'publish' &&
        Array.isArray(r.categories) &&
        r.categories.some(
          (c: { term_id?: number }) => c.term_id === wpTermId,
        ),
    )
    .map(mapCourseSummary)
}

// ---------------------------------------------------------------------------
// Post functions
// ---------------------------------------------------------------------------

export async function listPosts(params: ListPostsParams = {}): Promise<PostSummary[]> {
  if (isSupabaseAvailable()) {
    const { listPosts: dbFn } = await import('@/entities/post/api')
    return dbFn(params)
  }
  const { page = 1, pageSize = 12, categorySlug } = params
  const records = loadJson<RawPost[]>('posts.json')
  let filtered = records.filter((r) => r.status === 'publish')
  if (categorySlug) {
    filtered = filtered.filter(
      (r) =>
        Array.isArray(r.categories) &&
        r.categories.some(
          (c: { slug?: string }) => c.slug === categorySlug,
        ),
    )
  }
  filtered.sort((a, b) =>
    new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime(),
  )
  const from = (page - 1) * pageSize
  return filtered.slice(from, from + pageSize).map(mapPostSummary)
}

export async function getPostBySlug(slug: string): Promise<PostRow | null> {
  if (isSupabaseAvailable()) {
    const { getPostBySlug: dbFn } = await import('@/entities/post/api')
    return dbFn(slug)
  }
  const records = loadJson<RawPost[]>('posts.json')
  // Use the resolved slug (falls back to slugify(title) for blank post_name)
  const found = records.find((r) => {
    const rawPostSlug = r.slug as string | undefined
    const resolvedPostSlug = rawPostSlug?.trim()
      ? rawPostSlug
      : slugify(String(r.title ?? r.wp_id))
    return resolvedPostSlug === slug && r.status === 'publish'
  })
  return found ? mapPostRow(found) : null
}

export async function countPosts(categorySlug?: string): Promise<number> {
  if (isSupabaseAvailable()) {
    const { countPosts: dbFn } = await import('@/entities/post/api')
    return dbFn(categorySlug)
  }
  const records = loadJson<RawPost[]>('posts.json')
  let filtered = records.filter((r) => r.status === 'publish')
  if (categorySlug) {
    filtered = filtered.filter(
      (r) =>
        Array.isArray(r.categories) &&
        r.categories.some((c: { slug?: string }) => c.slug === categorySlug),
    )
  }
  return filtered.length
}

// ---------------------------------------------------------------------------
// Lesson functions
// ---------------------------------------------------------------------------

export async function listLessonsByCourse(courseWpId: number): Promise<LessonRow[]> {
  if (isSupabaseAvailable()) {
    const { listLessonsByCourse: dbFn } = await import('@/entities/lesson/api')
    return dbFn(courseWpId)
  }
  const records = loadJson<RawLesson[]>('lessons.json')
  return records
    .filter((r) => r.status === 'publish' && r.course_id === courseWpId)
    .sort((a, b) => (a.menu_order ?? 0) - (b.menu_order ?? 0))
    .map(mapLessonRow)
}

export async function getLessonBySlug(slug: string): Promise<LessonRow | null> {
  if (isSupabaseAvailable()) {
    const { getLessonBySlug: dbFn } = await import('@/entities/lesson/api')
    return dbFn(slug)
  }
  const records = loadJson<RawLesson[]>('lessons.json')
  // Match against the resolved title-slug (r.slug may be numeric)
  const found = records.find(
    (r) => resolveLessonSlug(r) === slug && r.status === 'publish',
  )
  return found ? mapLessonRow(found) : null
}

// ---------------------------------------------------------------------------
// Media functions
// ---------------------------------------------------------------------------

export async function getMediaByWpId(wpAttachmentId: number): Promise<MediaRow | null> {
  if (isSupabaseAvailable()) {
    const { getMediaByWpId: dbFn } = await import('@/entities/media/api')
    return dbFn(wpAttachmentId)
  }
  const records = loadJson<RawMedia[]>('media.json')
  const found = records.find((r) => r.wp_id === wpAttachmentId)
  return found ? mapMediaRow(found) : null
}

export async function getMediaByWpIds(wpAttachmentIds: number[]): Promise<MediaRow[]> {
  if (isSupabaseAvailable()) {
    const { getMediaByWpIds: dbFn } = await import('@/entities/media/api')
    return dbFn(wpAttachmentIds)
  }
  if (wpAttachmentIds.length === 0) return []
  const records = loadJson<RawMedia[]>('media.json')
  const idSet = new Set(wpAttachmentIds)
  return records.filter((r) => idSet.has(r.wp_id)).map(mapMediaRow)
}

// ---------------------------------------------------------------------------
// Page functions
// ---------------------------------------------------------------------------

export async function listPublishedPages(): Promise<PageSummary[]> {
  if (isSupabaseAvailable()) {
    const { listPublishedPages: dbFn } = await import('@/entities/page/api')
    return dbFn()
  }
  const records = loadJson<Array<Record<string, unknown>>>('pages.json')
  return records
    .filter((r) => r.status === 'publish')
    .sort((a, b) => ((a.menu_order as number) ?? 0) - ((b.menu_order as number) ?? 0))
    .map(
      (r): PageSummary => ({
        id: String(r.wp_id),
        wp_id: r.wp_id as number,
        slug: (r.slug as string) ?? String(r.wp_id),
        title: (r.title as string) ?? null,
        excerpt: (r.excerpt as string) ?? null,
        parent_id: (r.parent_id as number) ?? null,
        menu_order: (r.menu_order as number) ?? 0,
        page_template: (r.page_template as string) ?? null,
        status: 'publish',
      }),
    )
}

export async function getPageBySlug(slug: string): Promise<PageRow | null> {
  if (isSupabaseAvailable()) {
    const { getPageBySlug: dbFn } = await import('@/entities/page/api')
    return dbFn(slug)
  }
  const records = loadJson<Array<Record<string, unknown>>>('pages.json')
  const found = records.find((r) => r.slug === slug && r.status === 'publish')
  if (!found) return null
  return {
    id: String(found.wp_id),
    wp_id: found.wp_id as number,
    slug: (found.slug as string) ?? String(found.wp_id),
    title: (found.title as string) ?? null,
    content: (found.content as string) ?? null,
    excerpt: (found.excerpt as string) ?? null,
    parent_id: (found.parent_id as number) ?? null,
    menu_order: (found.menu_order as number) ?? 0,
    page_template: (found.page_template as string) ?? null,
    status: 'publish',
    author_id: (found.author_id as number) ?? null,
    featured_image_id: (found.featured_image_id as number) ?? null,
    published_at: (found.date as string) ?? null,
    modified_at: (found.modified as string) ?? null,
    created_at: (found.date as string) ?? new Date().toISOString(),
  } as PageRow
}

// ---------------------------------------------------------------------------
// Donation functions
// ---------------------------------------------------------------------------

export async function listDonationForms(): Promise<DonationFormRow[]> {
  if (isSupabaseAvailable()) {
    const { listDonationForms: dbFn } = await import('@/entities/donation/api')
    return dbFn()
  }
  const records = loadJson<Array<Record<string, unknown>>>('donations.json')
  return records
    .filter((r) => r.status === 'publish')
    .map(
      (r): DonationFormRow => ({
        id: String(r.wp_id ?? r.id),
        wp_id: (r.wp_id as number) ?? 0,
        slug: (r.slug as string) ?? null,
        title: (r.title as string) ?? null,
        content: (r.content as string) ?? null,
        status: 'publish',
        goal_enabled: false,
        goal_amount: (r.goal_amount as number) ?? null,
        goal_format: null,
        price_option: null,
        set_price: null,
        custom_amount: false,
        price_levels: null,
        image_id: null,
        published_at: (r.date as string) ?? null,
        modified_at: (r.modified as string) ?? null,
        created_at: (r.date as string) ?? new Date().toISOString(),
      }),
    )
}

// ---------------------------------------------------------------------------
// Product functions
// ---------------------------------------------------------------------------

export async function listPublishedProducts(): Promise<ProductSummary[]> {
  if (isSupabaseAvailable()) {
    const { listPublishedProducts: dbFn } = await import('@/entities/product/api')
    return dbFn()
  }
  const records = loadJson<Array<Record<string, unknown>>>('products.json')
  return records
    .filter((r) => r.status === 'publish')
    .map(
      (r): ProductSummary => ({
        id: String(r.wp_id ?? r.id),
        wp_id: (r.wp_id as number) ?? 0,
        slug: (r.slug as string) ?? String(r.wp_id),
        title: (r.title as string) ?? null,
        short_description: (r.short_description as string) ?? null,
        price: typeof r.price === 'string' ? parseFloat(r.price as string) || null : (r.price as number) ?? null,
        regular_price: typeof r.regular_price === 'string' ? parseFloat(r.regular_price as string) || null : (r.regular_price as number) ?? null,
        sale_price: typeof r.sale_price === 'string' ? parseFloat(r.sale_price as string) || null : (r.sale_price as number) ?? null,
        featured_image_id: (r.featured_image_id as number) ?? null,
        status: 'publish',
        virtual: (r.virtual as boolean) ?? false,
        downloadable: (r.downloadable as boolean) ?? false,
      }),
    )
}

// ---------------------------------------------------------------------------
// Profile / team functions
// ---------------------------------------------------------------------------

export async function listTeamProfiles(): Promise<ProfileRow[]> {
  if (isSupabaseAvailable()) {
    const { createClient } = await import('@/shared/lib/supabase/server')
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .not('display_name', 'is', null)
      .order('wp_user_id', { ascending: true })
    if (error) throw new Error(`listTeamProfiles: ${error.message}`)
    return (data ?? []) as ProfileRow[]
  }
  const records = loadJson<Array<Record<string, unknown>>>('profiles.json')
  return records
    .filter((r) => r.display_name != null && r.display_name !== '')
    .sort((a, b) => ((a.wp_id as number) ?? 999) - ((b.wp_id as number) ?? 999))
    .map(
      (r): ProfileRow => ({
        id: String(r.id ?? r.wp_id),
        auth_user_id: null,
        wp_user_id: (r.wp_id as number) ?? null,
        username: (r.username as string) ?? null,
        display_name: (r.display_name as string) ?? null,
        email: null,
        bio: (r.description as string) ?? (r.bio as string) ?? null,
        role: 'student',
        avatar_media_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }),
    )
}

// ---------------------------------------------------------------------------
// Term functions
// ---------------------------------------------------------------------------

export async function listTermsByTaxonomy(
  taxonomy: string,
): Promise<TermRow[]> {
  if (isSupabaseAvailable()) {
    const { listTermsByTaxonomy: dbFn } = await import('@/entities/term/api')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return dbFn(taxonomy as any)
  }
  // taxonomy.json lives one level up from _sanitized
  let records: Array<Record<string, unknown>> = []
  try {
    const raw = readFileSync(TAXONOMY_PATH, 'utf-8')
    const parsed = JSON.parse(raw) as {
      terms?: Array<Record<string, unknown>>
      records?: Array<Record<string, unknown>>
    }
    records = parsed.terms ?? parsed.records ?? []
  } catch {
    records = []
  }
  return records
    .filter((r) => r.taxonomy === taxonomy)
    .sort((a, b) => String(a.name ?? '').localeCompare(String(b.name ?? '')))
    .map(
      (r): TermRow => ({
        id: String(r.term_id ?? r.wp_term_id ?? r.id),
        wp_term_id: (r.term_id as number) ?? (r.wp_term_id as number) ?? 0,
        name: (r.name as string) ?? '',
        slug: (r.slug as string) ?? '',
        taxonomy: (r.taxonomy as string) ?? taxonomy,
        parent_id: (r.parent as number) ?? null,
        count: (r.count as number) ?? 0,
        created_at: new Date().toISOString(),
      }),
    )
}
