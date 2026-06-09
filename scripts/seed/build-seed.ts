/**
 * Luthas Center — Supabase seed generator.
 *
 * Reads data/extracted/_sanitized/*.json (+ taxonomy/media/profiles from
 * data/extracted/) and emits supabase/seed.sql with idempotent
 * `INSERT ... ON CONFLICT DO UPDATE` statements keyed on the natural WP id.
 *
 * Run:  npx tsx scripts/seed/build-seed.ts
 *
 * Insert order respects FK dependencies:
 *   profiles -> media -> terms
 *   -> courses -> lessons -> quizzes -> course_steps
 *   -> posts -> products -> product_attributes
 *   -> pages -> donation_forms -> donation_stats
 *   -> term_relationships -> seo_meta
 *
 * Missing media references (cover/featured/og ids absent from the manifest)
 * resolve to NULL and are logged, never fatal.
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { applyTransforms, WP_CLEAN_PIPELINE } from "../../src/shared/lib/wp-content/index.ts";
import { REDIRECT_MAP } from "../../src/shared/config/redirects.generated.ts";
import { slugify, isNumericSlug } from "../../src/shared/lib/slugify.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..");
const SAN = join(ROOT, "data", "extracted", "_sanitized");
const RAW = join(ROOT, "data", "extracted");
const OUT = join(ROOT, "supabase", "seed.sql");

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------
function load(dir: string, name: string): any {
  return JSON.parse(readFileSync(join(dir, `${name}.json`), "utf8"));
}
function records(env: any): any[] {
  return Array.isArray(env) ? env : env.records ?? [];
}

/** SQL literal escaping. Returns NULL for null/undefined. */
function lit(v: any): string {
  if (v === null || v === undefined) return "NULL";
  if (typeof v === "number") return Number.isFinite(v) ? String(v) : "NULL";
  if (typeof v === "boolean") return v ? "TRUE" : "FALSE";
  const s = String(v).replace(/'/g, "''");
  return `'${s}'`;
}
/** JSONB literal (escaped). */
function jsonb(v: any): string {
  if (v === null || v === undefined) return "NULL";
  return `'${JSON.stringify(v).replace(/'/g, "''")}'::jsonb`;
}
/** Numeric or NULL. */
function num(v: any): string {
  if (v === null || v === undefined || v === "") return "NULL";
  const n = Number(v);
  return Number.isFinite(n) ? String(n) : "NULL";
}
/** Timestamp literal from "YYYY-MM-DD HH:MM:SS" or ISO, else NULL. */
function ts(v: any): string {
  if (!v) return "NULL";
  return `'${String(v).replace(/'/g, "''")}'::timestamptz`;
}

// ---------------------------------------------------------------------------
// WP content cleaning
// ---------------------------------------------------------------------------
/**
 * Run raw WordPress HTML through the shared transform pipeline so the seed
 * stores already-clean HTML. Null/undefined values are passed through as-is
 * (the lit() helper will emit NULL for them).
 */
function cleanContent(html: any): any {
  if (html === null || html === undefined || html === "") return html;
  return applyTransforms(String(html), WP_CLEAN_PIPELINE, {
    redirectMap: REDIRECT_MAP,
  });
}

// Track media references that resolve to NULL.
const nullMediaRefs: { table: string; wp_id: number; field: string; image_id: number }[] = [];
function mediaRef(table: string, wp_id: number, field: string, imageId: any): string {
  if (imageId === null || imageId === undefined) return "NULL";
  const id = Number(imageId);
  if (!Number.isFinite(id) || id === 0) return "NULL";
  if (!mediaIds.has(id)) {
    nullMediaRefs.push({ table, wp_id, field, image_id: id });
    return "NULL";
  }
  return String(id);
}

// ---------------------------------------------------------------------------
// load all sources
// ---------------------------------------------------------------------------
const profiles = records(load(SAN, "profiles"));
const mediaEnv = load(RAW, "media");
const media = records(mediaEnv);
const taxonomy = load(RAW, "taxonomy");
const terms = taxonomy.terms ?? [];
const termRels = taxonomy.term_relationships ?? [];
const courses = records(load(SAN, "courses"));
const lessons = records(load(SAN, "lessons"));
const quizzes = records(load(SAN, "quizzes"));
const posts = records(load(SAN, "posts"));
const products = records(load(SAN, "products"));
const pages = records(load(SAN, "pages"));
const donationsEnv = load(SAN, "donations");
const donations = records(donationsEnv);

// Title-slugs for LMS content (courses/lessons store numeric wp_id as their
// slug). MUST match the JSON adapter (src/shared/lib/data-source.ts) so both
// data sources produce identical routes.
function buildTitleSlugMap(recs: any[]): Map<number, string> {
  const seen = new Map<string, number>();
  const result = new Map<number, string>();
  for (const r of [...recs].sort((a, b) => a.wp_id - b.wp_id)) {
    const base = slugify(String(r.title ?? r.wp_id));
    const count = seen.get(base) ?? 0;
    result.set(r.wp_id, count === 0 ? base : `${base}-${count + 1}`);
    seen.set(base, count + 1);
  }
  return result;
}
const courseSlugMap = buildTitleSlugMap(courses);
const lessonSlugMap = buildTitleSlugMap(lessons);
function resolveLmsSlug(r: any, map: Map<number, string>): string {
  if (!isNumericSlug(r.slug)) return r.slug as string;
  return map.get(r.wp_id) ?? slugify(String(r.title ?? r.wp_id));
}

const mediaIds = new Set<number>(media.map((m: any) => Number(m.wp_id ?? m.wp_attachment_id)));
const termIds = new Set<number>(terms.map((t: any) => Number(t.term_id)));

// object_type resolution for term_relationships
const courseIds = new Set<number>(courses.map((c: any) => Number(c.wp_id)));
const lessonIds = new Set<number>(lessons.map((l: any) => Number(l.wp_id)));
const postIds = new Set<number>(posts.map((p: any) => Number(p.wp_id)));
const productIds = new Set<number>(products.map((p: any) => Number(p.wp_id)));
const pageIds = new Set<number>(pages.map((p: any) => Number(p.wp_id)));
function objectType(id: number): string | null {
  if (courseIds.has(id)) return "course";
  if (lessonIds.has(id)) return "lesson";
  if (postIds.has(id)) return "post";
  if (productIds.has(id)) return "product";
  if (pageIds.has(id)) return "page";
  return null; // media / nav_menu / etc. — not migrated
}

// role mapping WP -> profile_role enum
function mapRole(p: any): string {
  const r = (p.primary_role || (p.roles && p.roles[0]) || "").toLowerCase();
  if (r === "administrator") return p.wp_id === 1 ? "owner" : "admin";
  if (r === "author" || r === "editor" || r === "contributor") return "author";
  return "student";
}

const out: string[] = [];
const counts: Record<string, number> = {};
function section(title: string) {
  out.push(`\n-- ${"=".repeat(74)}`);
  out.push(`-- ${title}`);
  out.push(`-- ${"=".repeat(74)}`);
}

out.push("-- Luthas Center — generated seed. DO NOT EDIT BY HAND.");
out.push("-- Source: data/extracted/_sanitized/*.json + data/extracted/{media,taxonomy}.json");
out.push(`-- Generated: ${new Date().toISOString()}`);
out.push("BEGIN;");

// ---------------------------------------------------------------------------
// 1. profiles
// ---------------------------------------------------------------------------
section("profiles");
counts.profiles = 0;
for (const p of profiles) {
  out.push(
    `INSERT INTO public.profiles (wp_user_id, username, display_name, email, role) VALUES (` +
      `${num(p.wp_id)}, ${lit(p.login || p.nicename)}, ${lit(p.display_name)}, ${lit(p.email)}, ${lit(mapRole(p))}::public.profile_role)` +
      ` ON CONFLICT (wp_user_id) DO UPDATE SET username = EXCLUDED.username, display_name = EXCLUDED.display_name, email = EXCLUDED.email, role = EXCLUDED.role, updated_at = now();`
  );
  counts.profiles++;
}

// ---------------------------------------------------------------------------
// 2. media
// ---------------------------------------------------------------------------
section("media");
counts.media = 0;
for (const m of media) {
  const wpId = Number(m.wp_id ?? m.wp_attachment_id);
  out.push(
    `INSERT INTO public.media (wp_attachment_id, source_url, attached_file, mime_type, width, height, alt_text, title, post_parent, sizes) VALUES (` +
      `${num(wpId)}, ${lit(m.guid ?? m.source_url)}, ${lit(m.attached_file)}, ${lit(m.mime_type)}, ${num(m.width)}, ${num(m.height)}, ${lit(m.alt)}, ${lit(m.title)}, ${num(m.post_parent)}, ${jsonb(m.sizes ?? null)})` +
      ` ON CONFLICT (wp_attachment_id) DO UPDATE SET source_url = EXCLUDED.source_url, attached_file = EXCLUDED.attached_file, mime_type = EXCLUDED.mime_type, width = EXCLUDED.width, height = EXCLUDED.height, alt_text = EXCLUDED.alt_text, title = EXCLUDED.title, post_parent = EXCLUDED.post_parent, sizes = EXCLUDED.sizes;`
  );
  counts.media++;
}

// ---------------------------------------------------------------------------
// 3. terms  (sorted parents-first not required: parent_id is a soft int ref)
// ---------------------------------------------------------------------------
section("terms");
counts.terms = 0;
for (const t of terms) {
  out.push(
    `INSERT INTO public.terms (wp_term_id, name, slug, taxonomy, parent_id, count) VALUES (` +
      `${num(t.term_id)}, ${lit(t.name)}, ${lit(t.slug)}, ${lit(t.taxonomy)}, ${num(t.parent)}, ${num(t.count)})` +
      ` ON CONFLICT (wp_term_id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug, taxonomy = EXCLUDED.taxonomy, parent_id = EXCLUDED.parent_id, count = EXCLUDED.count;`
  );
  counts.terms++;
}

// ---------------------------------------------------------------------------
// 4. courses
// ---------------------------------------------------------------------------
section("courses");
counts.courses = 0;
for (const c of courses) {
  const status = c.status === "publish" ? "publish" : "pending";
  out.push(
    `INSERT INTO public.courses (wp_id, status, slug, title, content, excerpt, short_description, price_type, price, access_mode, certificate_id, intro_video, materials_enabled, menu_order, steps_source, step_counts, featured_image_id, cover_image_id, old_path, new_path, published_at, modified_at) VALUES (` +
      `${num(c.wp_id)}, ${lit(status)}::public.course_status, ${lit(resolveLmsSlug(c, courseSlugMap))}, ${lit(c.title)}, ${lit(cleanContent(c.content))}, ${lit(c.excerpt)}, ${lit(c.short_description)}, ${lit(c.price_type)}, ${num(c.price)}, ${lit(c.access_mode)}, ${num(c.certificate_id)}, ${lit(c.intro_video)}, ${c.materials_enabled ? "TRUE" : "FALSE"}, ${num(c.menu_order)}, ${lit(c.steps_source)}, ${jsonb(c.step_counts ?? null)}, ${mediaRef("courses", c.wp_id, "featured_image_id", c.featured_image_id)}, ${mediaRef("courses", c.wp_id, "cover_image_id", c.cover_image_id)}, ${lit(c.old_path)}, ${lit(c.new_path)}, ${ts(c.date)}, ${ts(c.modified)})` +
      ` ON CONFLICT (wp_id) DO UPDATE SET status = EXCLUDED.status, slug = EXCLUDED.slug, title = EXCLUDED.title, content = EXCLUDED.content, excerpt = EXCLUDED.excerpt, short_description = EXCLUDED.short_description, price_type = EXCLUDED.price_type, price = EXCLUDED.price, access_mode = EXCLUDED.access_mode, certificate_id = EXCLUDED.certificate_id, intro_video = EXCLUDED.intro_video, materials_enabled = EXCLUDED.materials_enabled, menu_order = EXCLUDED.menu_order, steps_source = EXCLUDED.steps_source, step_counts = EXCLUDED.step_counts, featured_image_id = EXCLUDED.featured_image_id, cover_image_id = EXCLUDED.cover_image_id, old_path = EXCLUDED.old_path, new_path = EXCLUDED.new_path, published_at = EXCLUDED.published_at, modified_at = EXCLUDED.modified_at;`
  );
  counts.courses++;
}

// ---------------------------------------------------------------------------
// 5. lessons
// ---------------------------------------------------------------------------
section("lessons");
counts.lessons = 0;
function lmsStatus(s: any): string {
  const v = String(s || "publish").toLowerCase();
  return ["publish", "pending", "draft", "private"].includes(v) ? v : "publish";
}
for (const l of lessons) {
  const courseId = courseIds.has(Number(l.course_id)) ? num(l.course_id) : "NULL";
  out.push(
    `INSERT INTO public.lessons (wp_id, course_id, slug, title, content, excerpt, sort_order, status, video_url, featured_image_id, old_path, new_path, published_at, modified_at) VALUES (` +
      `${num(l.wp_id)}, ${courseId}, ${lit(resolveLmsSlug(l, lessonSlugMap))}, ${lit(l.title)}, ${lit(cleanContent(l.content))}, ${lit(l.excerpt)}, ${num(l.menu_order)}, ${lit(lmsStatus(l.status))}::public.lms_content_status, ${lit(l.video_url)}, ${mediaRef("lessons", l.wp_id, "featured_image_id", l.featured_image_id)}, ${lit(l.old_path)}, ${lit(l.new_path)}, ${ts(l.date)}, ${ts(l.modified)})` +
      ` ON CONFLICT (wp_id) DO UPDATE SET course_id = EXCLUDED.course_id, slug = EXCLUDED.slug, title = EXCLUDED.title, content = EXCLUDED.content, excerpt = EXCLUDED.excerpt, sort_order = EXCLUDED.sort_order, status = EXCLUDED.status, video_url = EXCLUDED.video_url, featured_image_id = EXCLUDED.featured_image_id, old_path = EXCLUDED.old_path, new_path = EXCLUDED.new_path, published_at = EXCLUDED.published_at, modified_at = EXCLUDED.modified_at;`
  );
  counts.lessons++;
}

// ---------------------------------------------------------------------------
// 6. quizzes
// ---------------------------------------------------------------------------
section("quizzes");
counts.quizzes = 0;
for (const q of quizzes) {
  const courseId = courseIds.has(Number(q.course_id)) ? num(q.course_id) : "NULL";
  const lessonId = lessonIds.has(Number(q.lesson_id)) ? num(q.lesson_id) : "NULL";
  out.push(
    `INSERT INTO public.quizzes (wp_id, course_id, lesson_id, slug, title, content, excerpt, status, pro_quiz_id, passing_percentage, featured_image_id, old_path, new_path, published_at, modified_at) VALUES (` +
      `${num(q.wp_id)}, ${courseId}, ${lessonId}, ${lit(q.slug)}, ${lit(q.title)}, ${lit(cleanContent(q.content))}, ${lit(q.excerpt)}, ${lit(lmsStatus(q.status))}::public.lms_content_status, ${num(q.pro_quiz_id)}, ${num(q.passing_percentage)}, ${mediaRef("quizzes", q.wp_id, "featured_image_id", q.featured_image_id)}, ${lit(q.old_path)}, ${lit(q.new_path)}, ${ts(q.date)}, ${ts(q.modified)})` +
      ` ON CONFLICT (wp_id) DO UPDATE SET course_id = EXCLUDED.course_id, lesson_id = EXCLUDED.lesson_id, slug = EXCLUDED.slug, title = EXCLUDED.title, content = EXCLUDED.content, excerpt = EXCLUDED.excerpt, status = EXCLUDED.status, pro_quiz_id = EXCLUDED.pro_quiz_id, passing_percentage = EXCLUDED.passing_percentage, featured_image_id = EXCLUDED.featured_image_id, old_path = EXCLUDED.old_path, new_path = EXCLUDED.new_path, published_at = EXCLUDED.published_at, modified_at = EXCLUDED.modified_at;`
  );
  counts.quizzes++;
}

// ---------------------------------------------------------------------------
// 7. course_steps  (only steps whose ref target was migrated)
// ---------------------------------------------------------------------------
section("course_steps");
counts.course_steps = 0;
for (const c of courses) {
  const steps = Array.isArray(c.course_steps) ? c.course_steps : [];
  steps.forEach((s: any, i: number) => {
    const type = String(s.type || s.step_type || "lesson");
    if (!["lesson", "quiz", "topic"].includes(type)) return;
    const refId = Number(s.id ?? s.step_ref_id);
    if (!Number.isFinite(refId)) return;
    const position = s.order ?? s.position ?? i;
    out.push(
      `INSERT INTO public.course_steps (course_id, step_type, step_ref_id, position) VALUES (` +
        `${num(c.wp_id)}, ${lit(type)}::public.course_step_type, ${num(refId)}, ${num(position)})` +
        ` ON CONFLICT (course_id, step_type, step_ref_id) DO UPDATE SET position = EXCLUDED.position;`
    );
    counts.course_steps++;
  });
}

// ---------------------------------------------------------------------------
// 8. posts
// ---------------------------------------------------------------------------
section("posts");
counts.posts = 0;
const profileWpIds = new Set<number>(profiles.map((p: any) => Number(p.wp_id)));
for (const p of posts) {
  const authorId = p.author && profileWpIds.has(Number(p.author.id)) ? num(p.author.id) : "NULL";
  const status = p.status === "publish" ? "publish" : "draft";
  out.push(
    `INSERT INTO public.posts (wp_id, slug, title, content, excerpt, status, author_id, featured_image_id, reading_time, old_path, new_path, published_at, modified_at) VALUES (` +
      `${num(p.wp_id)}, ${lit(p.slug)}, ${lit(p.title)}, ${lit(cleanContent(p.content))}, ${lit(p.excerpt)}, ${lit(status)}::public.post_status, ${authorId}, ${mediaRef("posts", p.wp_id, "featured_image_id", p.featured_image_id)}, ${num(p.reading_time_minutes)}, ${lit(p.old_path)}, ${lit(p.new_path)}, ${ts(p.date)}, ${ts(p.modified)})` +
      ` ON CONFLICT (wp_id) DO UPDATE SET slug = EXCLUDED.slug, title = EXCLUDED.title, content = EXCLUDED.content, excerpt = EXCLUDED.excerpt, status = EXCLUDED.status, author_id = EXCLUDED.author_id, featured_image_id = EXCLUDED.featured_image_id, reading_time = EXCLUDED.reading_time, old_path = EXCLUDED.old_path, new_path = EXCLUDED.new_path, published_at = EXCLUDED.published_at, modified_at = EXCLUDED.modified_at;`
  );
  counts.posts++;
}

// ---------------------------------------------------------------------------
// 9. products
// ---------------------------------------------------------------------------
section("products");
counts.products = 0;
for (const p of products) {
  out.push(
    `INSERT INTO public.products (wp_id, slug, title, description, short_description, status, sku, regular_price, sale_price, price, virtual, downloadable, download_limit, download_expiry, stock_status, average_rating, review_count, total_sales, featured_image_id, menu_order, old_path, new_path, published_at, modified_at) VALUES (` +
      `${num(p.wp_id)}, ${lit(p.slug)}, ${lit(p.title)}, ${lit(cleanContent(p.description))}, ${lit(p.short_description)}, ${lit(p.status || "publish")}, ${lit(p.sku)}, ${num(p.regular_price)}, ${num(p.sale_price)}, ${num(p.price)}, ${p.virtual ? "TRUE" : "FALSE"}, ${p.downloadable ? "TRUE" : "FALSE"}, ${num(p.download_limit)}, ${num(p.download_expiry)}, ${lit(p.stock_status || "instock")}, ${num(p.average_rating)}, ${num(p.review_count)}, ${num(p.total_sales)}, ${mediaRef("products", p.wp_id, "featured_image_id", p.featured_image_id)}, ${num(p.menu_order)}, ${lit(p.old_path)}, ${lit(p.new_path)}, ${ts(p.date)}, ${ts(p.modified)})` +
      ` ON CONFLICT (wp_id) DO UPDATE SET slug = EXCLUDED.slug, title = EXCLUDED.title, description = EXCLUDED.description, short_description = EXCLUDED.short_description, status = EXCLUDED.status, sku = EXCLUDED.sku, regular_price = EXCLUDED.regular_price, sale_price = EXCLUDED.sale_price, price = EXCLUDED.price, virtual = EXCLUDED.virtual, downloadable = EXCLUDED.downloadable, download_limit = EXCLUDED.download_limit, download_expiry = EXCLUDED.download_expiry, stock_status = EXCLUDED.stock_status, average_rating = EXCLUDED.average_rating, review_count = EXCLUDED.review_count, total_sales = EXCLUDED.total_sales, featured_image_id = EXCLUDED.featured_image_id, menu_order = EXCLUDED.menu_order, old_path = EXCLUDED.old_path, new_path = EXCLUDED.new_path, published_at = EXCLUDED.published_at, modified_at = EXCLUDED.modified_at;`
  );
  counts.products++;
}

// ---------------------------------------------------------------------------
// 10. pages
// ---------------------------------------------------------------------------
section("pages");
counts.pages = 0;
for (const p of pages) {
  const authorId = p.author && profileWpIds.has(Number(p.author.id ?? p.author)) ? num(p.author.id ?? p.author) : "NULL";
  out.push(
    `INSERT INTO public.pages (wp_id, slug, title, content, excerpt, status, parent_id, menu_order, page_template, author_id, featured_image_id, published_at, modified_at) VALUES (` +
      `${num(p.wp_id)}, ${lit(p.slug)}, ${lit(p.title)}, ${lit(cleanContent(p.content))}, ${lit(p.excerpt)}, ${lit(p.status || "publish")}, ${num(p.parent_id)}, ${num(p.menu_order)}, ${lit(p.page_template)}, ${authorId}, ${mediaRef("pages", p.wp_id, "featured_image_id", p.featured_image_id)}, ${ts(p.date)}, ${ts(p.modified)})` +
      ` ON CONFLICT (wp_id) DO UPDATE SET slug = EXCLUDED.slug, title = EXCLUDED.title, content = EXCLUDED.content, excerpt = EXCLUDED.excerpt, status = EXCLUDED.status, parent_id = EXCLUDED.parent_id, menu_order = EXCLUDED.menu_order, page_template = EXCLUDED.page_template, author_id = EXCLUDED.author_id, featured_image_id = EXCLUDED.featured_image_id, published_at = EXCLUDED.published_at, modified_at = EXCLUDED.modified_at;`
  );
  counts.pages++;
}

// ---------------------------------------------------------------------------
// 11. donation_forms + donation_stats
// ---------------------------------------------------------------------------
section("donation_forms");
counts.donation_forms = 0;
counts.donation_stats = 0;
for (const d of donations) {
  out.push(
    `INSERT INTO public.donation_forms (wp_id, slug, title, content, status, goal_enabled, goal_amount, goal_format, price_option, set_price, custom_amount, price_levels, image_id, published_at, modified_at) VALUES (` +
      `${num(d.wp_id)}, ${lit(d.slug)}, ${lit(d.title)}, ${lit(cleanContent(d.content))}, ${lit(d.status || "publish")}, ${d.goal_enabled ? "TRUE" : "FALSE"}, ${num(d.goal_amount)}, ${lit(d.goal_format)}, ${lit(d.price_option)}, ${num(d.set_price)}, ${d.custom_amount ? "TRUE" : "FALSE"}, ${jsonb(d.donation_levels ?? null)}, ${mediaRef("donation_forms", d.wp_id, "image_id", d.image_id)}, ${ts(d.date)}, ${ts(d.modified)})` +
      ` ON CONFLICT (wp_id) DO UPDATE SET slug = EXCLUDED.slug, title = EXCLUDED.title, content = EXCLUDED.content, status = EXCLUDED.status, goal_enabled = EXCLUDED.goal_enabled, goal_amount = EXCLUDED.goal_amount, goal_format = EXCLUDED.goal_format, price_option = EXCLUDED.price_option, set_price = EXCLUDED.set_price, custom_amount = EXCLUDED.custom_amount, price_levels = EXCLUDED.price_levels, image_id = EXCLUDED.image_id, published_at = EXCLUDED.published_at, modified_at = EXCLUDED.modified_at;`
  );
  counts.donation_forms++;
  out.push(
    `INSERT INTO public.donation_stats (form_id, total_earnings, total_sales) VALUES (` +
      `${num(d.wp_id)}, ${num(d.earnings)}, ${num(d.sales)})` +
      ` ON CONFLICT (form_id) DO UPDATE SET total_earnings = EXCLUDED.total_earnings, total_sales = EXCLUDED.total_sales, updated_at = now();`
  );
  counts.donation_stats++;
}

// ---------------------------------------------------------------------------
// 12. term_relationships  (only migrated objects + existing terms)
// ---------------------------------------------------------------------------
section("term_relationships");
counts.term_relationships = 0;
for (const r of termRels) {
  const objId = Number(r.object_id);
  const termId = Number(r.term_id);
  if (!termIds.has(termId)) continue;
  const otype = objectType(objId);
  if (!otype) continue;
  out.push(
    `INSERT INTO public.term_relationships (object_type, object_id, wp_term_id, taxonomy) VALUES (` +
      `${lit(otype)}, ${num(objId)}, ${num(termId)}, ${lit(r.taxonomy)})` +
      ` ON CONFLICT (object_type, object_id, wp_term_id) DO UPDATE SET taxonomy = EXCLUDED.taxonomy;`
  );
  counts.term_relationships++;
}

// ---------------------------------------------------------------------------
// 13. seo_meta  (posts/pages/courses with seo_title or seo_description)
// ---------------------------------------------------------------------------
section("seo_meta");
counts.seo_meta = 0;
function emitSeo(otype: string, wpId: any, title: any, desc: any, img: any) {
  if (!title && !desc) return;
  const ogImg = img && mediaIds.has(Number(img)) ? num(img) : "NULL";
  out.push(
    `INSERT INTO public.seo_meta (object_type, object_id, meta_title, meta_description, og_image_media_id) VALUES (` +
      `${lit(otype)}, ${num(wpId)}, ${lit(title)}, ${lit(desc)}, ${ogImg})` +
      ` ON CONFLICT (object_type, object_id) DO UPDATE SET meta_title = EXCLUDED.meta_title, meta_description = EXCLUDED.meta_description, og_image_media_id = EXCLUDED.og_image_media_id;`
  );
  counts.seo_meta++;
}
for (const p of posts) emitSeo("post", p.wp_id, p.seo_title, p.seo_description, p.featured_image_id);
for (const p of pages) emitSeo("page", p.wp_id, p.seo_title, p.seo_description, p.featured_image_id);

out.push("\nCOMMIT;");
out.push("");

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, out.join("\n"), "utf8");

console.log("Wrote", OUT);
console.log("Row counts emitted:");
for (const [k, v] of Object.entries(counts)) console.log(`  ${k.padEnd(20)} ${v}`);
console.log(`\nMedia refs resolved to NULL (missing from manifest): ${nullMediaRefs.length}`);
for (const r of nullMediaRefs) {
  console.log(`  ${r.table} wp_id=${r.wp_id} ${r.field} -> image_id ${r.image_id} (missing)`);
}
