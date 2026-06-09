/**
 * upload-media.mjs
 *
 * Uploads only the content-referenced images to Supabase Storage bucket "media".
 * Referenced = featured/cover images from courses/posts(publish)/pages + inline
 * wp-content/uploads images found in published content.
 *
 * Steps:
 *  1. Compute the referenced set (same logic as analyze-media-refs.mjs)
 *  2. Re-optimize each with sharp (max 1600px/1200px for covers, webp q72, strip metadata)
 *  3. Upload to Supabase Storage with upsert
 *  4. UPDATE public.media SET public_url, storage_path WHERE wp_attachment_id = <id>
 *  5. Idempotent — safe to re-run
 */

import { readFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { createClient } from '@supabase/supabase-js'
import ws from 'ws'
import { loadEnv, makePool, ROOT } from './db.mjs'

// ── helpers ────────────────────────────────────────────────────────────────
const j = (p) => JSON.parse(readFileSync(path.join(ROOT, p), 'utf8'))
const recs = (e) => (Array.isArray(e) ? e : e.records || [])
const mb = (b) => (b / 1_000_000).toFixed(2) + ' MB'
const extToWebp = (wp_path) =>
  wp_path.replace(/\.(jpe?g|png|gif|webp)$/i, '.webp')

// ── load data ─────────────────────────────────────────────────────────────
console.log('Loading manifests and content data…')

const man = recs(j('data/extracted/media-url-manifest.json'))
const media = recs(j('data/extracted/media.json'))

const manByPath = new Map(man.map((m) => [m.wp_path, m]))
// media.json uses wp_id as the attachment id
const fileByAttId = new Map(
  media.map((m) => [Number(m.wp_id ?? m.wp_attachment_id), m.attached_file])
)
// reverse: attached_file → wp_id
const attIdByFile = new Map(
  media.map((m) => [m.attached_file, Number(m.wp_id ?? m.wp_attachment_id)])
)

const load = (f) => {
  try {
    return recs(j('data/extracted/_sanitized/' + f + '.json'))
  } catch {
    return []
  }
}
const courses = load('courses')
const posts = load('posts').filter((p) => p.status === 'publish')
const pages = load('pages')

// ── step 1: compute referenced set ────────────────────────────────────────

// Collect referenced attachment IDs (cover + featured)
const refIds = new Set()
const addId = (id) => {
  if (id) refIds.add(Number(id))
}
courses.forEach((c) => {
  addId(c.cover_image_id)
  addId(c.featured_image_id)
})
posts.forEach((p) => addId(p.featured_image_id))
pages.forEach((p) => addId(p.featured_image_id))

// Collect inline body image paths
const inlinePaths = new Set()
const re = /\/wp-content\/uploads\/([^"'\s)]+\.(?:jpe?g|png|webp|gif))/gi
for (const set of [courses, posts, pages]) {
  for (const r of set) {
    let m
    const c = r.content || ''
    const reCopy = new RegExp(re.source, re.flags)
    while ((m = reCopy.exec(c))) inlinePaths.add(m[1])
  }
}

// Build the work list: { wp_attachment_id|null, wp_path, processed_path, isCover }
// isCover → use 1200px cap; others → 1600px
const workList = []
const seenPaths = new Set()

// Cover/featured by ID
for (const id of refIds) {
  const f = fileByAttId.get(id)
  const entry = f && manByPath.get(f)
  if (!entry || !entry.processed_path || !entry.bytes_after) continue
  const fullProcessed = path.join(ROOT, entry.processed_path)
  if (!existsSync(fullProcessed)) continue
  if (seenPaths.has(entry.wp_path)) continue
  seenPaths.add(entry.wp_path)
  workList.push({
    wp_attachment_id: id,
    wp_path: entry.wp_path,
    processed_path: fullProcessed,
    isCover: true,
  })
}

// Inline body images (may not have a wp_attachment_id)
for (const f of inlinePaths) {
  const entry = manByPath.get(f)
  if (!entry || !entry.processed_path || !entry.bytes_after) continue
  const fullProcessed = path.join(ROOT, entry.processed_path)
  if (!existsSync(fullProcessed)) continue
  if (seenPaths.has(entry.wp_path)) continue
  seenPaths.add(entry.wp_path)
  const wp_attachment_id = attIdByFile.get(f) ?? null
  workList.push({
    wp_attachment_id,
    wp_path: entry.wp_path,
    processed_path: fullProcessed,
    isCover: false,
  })
}

console.log(`Referenced set: ${workList.length} files`)

// ── step 2: re-optimize with sharp ────────────────────────────────────────
console.log('Re-optimizing with sharp…')

let totalBefore = 0
let totalAfter = 0
const optimized = [] // { ...item, buffer, storageKey }

for (const item of workList) {
  const raw = readFileSync(item.processed_path)
  totalBefore += raw.length

  const maxWidth = item.isCover ? 1200 : 1600

  let buf
  try {
    buf = await sharp(raw)
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality: 72 })
      .withMetadata(false) // strip EXIF/IPTC
      .toBuffer()
  } catch (err) {
    console.warn(`  SKIP (sharp error) ${item.wp_path}: ${err.message}`)
    continue
  }

  totalAfter += buf.length
  const storageKey = extToWebp(item.wp_path) // no leading slash
  optimized.push({ ...item, buffer: buf, storageKey })
}

console.log(
  `Re-optimization: ${mb(totalBefore)} → ${mb(totalAfter)} ` +
    `(${(((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1)}% saved)`
)

// ── step 3: upload to Supabase Storage ────────────────────────────────────
const env = loadEnv()
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY
const BUCKET = 'media'

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
  realtime: { transport: ws },
})

console.log(`Uploading ${optimized.length} files to Supabase Storage bucket "${BUCKET}"…`)

let uploadOk = 0
let uploadErr = 0
const uploaded = [] // items that succeeded

for (let i = 0; i < optimized.length; i++) {
  const item = optimized[i]
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(item.storageKey, item.buffer, {
      contentType: 'image/webp',
      upsert: true,
      cacheControl: '31536000',
    })

  if (error) {
    console.error(`  [${i + 1}/${optimized.length}] ERROR ${item.storageKey}: ${error.message}`)
    uploadErr++
  } else {
    if ((i + 1) % 25 === 0 || i === optimized.length - 1) {
      console.log(`  [${i + 1}/${optimized.length}] uploaded`)
    }
    uploadOk++
    uploaded.push(item)
  }
}

console.log(`Upload complete: ${uploadOk} ok, ${uploadErr} errors`)

// ── step 4: UPDATE public.media rows ─────────────────────────────────────
const withId = uploaded.filter((item) => item.wp_attachment_id != null)
console.log(`Updating ${withId.length} media rows with public_url / storage_path…`)

const pool = makePool()
const client = await pool.connect()

try {
  await client.query('BEGIN')

  let dbUpdated = 0
  for (const item of withId) {
    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${item.storageKey}`
    const result = await client.query(
      `UPDATE public.media
         SET public_url   = $1,
             storage_path = $2
       WHERE wp_attachment_id = $3`,
      [publicUrl, item.storageKey, item.wp_attachment_id]
    )
    if (result.rowCount > 0) dbUpdated++
  }

  await client.query('COMMIT')
  console.log(`DB updated: ${dbUpdated} rows received public_url`)
} catch (err) {
  await client.query('ROLLBACK')
  throw err
} finally {
  client.release()
  await pool.end()
}

// ── summary ───────────────────────────────────────────────────────────────
console.log('\n=== SUMMARY ===')
console.log(`Referenced files computed:    ${workList.length}`)
console.log(`Files successfully optimized: ${optimized.length}`)
console.log(`  bytes before:               ${mb(totalBefore)}`)
console.log(`  bytes after:                ${mb(totalAfter)}`)
console.log(`Files uploaded:               ${uploadOk}`)
console.log(`Upload errors:                ${uploadErr}`)
console.log(`Media rows updated (public_url): ${withId.length}`)
