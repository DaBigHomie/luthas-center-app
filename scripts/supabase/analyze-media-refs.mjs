// Which processed images are actually referenced by published content?
import { readFileSync } from 'node:fs'
import path from 'node:path'
const ROOT = path.resolve(import.meta.dirname, '..', '..')
const j = (p) => JSON.parse(readFileSync(path.join(ROOT, p), 'utf8'))
const recs = (e) => (Array.isArray(e) ? e : e.records || [])

const man = recs(j('data/extracted/media-url-manifest.json'))
const media = recs(j('data/extracted/media.json'))
const manByPath = new Map(man.map((m) => [m.wp_path, m]))
const fileByAttId = new Map(media.map((m) => [Number(m.wp_id ?? m.wp_attachment_id), m.attached_file]))

const load = (f) => { try { return recs(j('data/extracted/_sanitized/' + f + '.json')) } catch { return [] } }
const courses = load('courses'), posts = load('posts').filter((p) => p.status === 'publish'), pages = load('pages')

const refIds = new Set()
const add = (id) => { if (id) refIds.add(Number(id)) }
courses.forEach((c) => { add(c.cover_image_id); add(c.featured_image_id) })
posts.forEach((p) => add(p.featured_image_id))
pages.forEach((p) => add(p.featured_image_id))

const inline = new Set()
const re = /\/wp-content\/uploads\/([^"'\s)]+\.(?:jpe?g|png|webp|gif))/gi
for (const set of [courses, posts, pages]) for (const r of set) {
  let m; const c = r.content || ''
  while ((m = re.exec(c))) inline.add(m[1])
}

let refFiles = 0, refBytes = 0, refMissing = 0
for (const id of refIds) {
  const f = fileByAttId.get(id); const e = f && manByPath.get(f)
  if (e && e.bytes_after) { refFiles++; refBytes += e.bytes_after } else refMissing++
}
let inFiles = 0, inBytes = 0
for (const f of inline) { const e = manByPath.get(f); if (e && e.bytes_after) { inFiles++; inBytes += e.bytes_after } }
const tot = man.reduce((s, m) => s + (m.bytes_after || 0), 0)
const mb = (b) => (b / 1e6).toFixed(0) + 'MB'
console.log('total processed:', man.length, '=', mb(tot))
console.log('content-referenced cover/featured ids:', refIds.size, '→ present:', refFiles, '(' + mb(refBytes) + '), orphan/missing:', refMissing)
console.log('inline body images present:', inFiles, '(' + mb(inBytes) + ')')
console.log('=> REFERENCED upload set ~', refFiles + inFiles, 'files,', mb(refBytes + inBytes), 'before re-optimization')
