/**
 * extract-courses.ts — LearnDash `sfwd-courses`.
 *
 * The hard one. We:
 *  - keep publish (30) and pending (17), tagging each with status
 *  - unserialize `ld_course_steps` to reconstruct the ordered lesson/topic/
 *    quiz hierarchy -> `course_steps`
 *  - read `_sfwd-courses` settings for price_type / certificate, with
 *    `_ld_price_type` / `_ld_certificate` as authoritative overrides
 *  - resolve cover image (`_thumbnail_id`,
 *    `sfwd-courses_course-cover-image_thumbnail_id`) and intro video
 *    (`_buddyboss_lms_course_video`)
 *  - attach ld_course_category / ld_course_tag terms
 *
 * Run: npx tsx scripts/extract/extract-courses.ts
 */
import {
  WP_PREFIX,
  query,
  closePool,
  unserialize,
  fetchMetaForPosts,
  wpPermalinkPath,
  nextRoutePath,
  m,
  toInt,
} from './lib/wp-db.ts';
import {
  envelope,
  writeJson,
  fetchTermsForObjects,
  termsByTaxonomy,
} from './lib/common.ts';
import type { RowDataPacket } from 'mysql2/promise';

interface PostRow extends RowDataPacket {
  ID: number;
  post_title: string;
  post_name: string;
  post_content: string;
  post_excerpt: string;
  post_status: string;
  post_date: string;
  post_modified: string;
  menu_order: number;
}

export interface CourseStep {
  type: 'lesson' | 'topic' | 'quiz';
  id: number;
  order: number;
  children?: CourseStep[];
}

const TYPE_MAP: Record<string, CourseStep['type']> = {
  'sfwd-lessons': 'lesson',
  'sfwd-topic': 'topic',
  'sfwd-quiz': 'quiz',
};

/**
 * Walk the LearnDash steps tree. Shape:
 *   { steps: { h: { 'sfwd-lessons': { <id>: { 'sfwd-topic': {...}, 'sfwd-quiz': {...} } }, 'sfwd-quiz': {...} } } }
 * Keys at each level are post-type buckets; under each bucket, numeric keys are
 * the ordered post ids. PHP preserves insertion order, which our unserializer
 * keeps for object key order.
 */
function buildSteps(node: unknown): CourseStep[] {
  if (!node || typeof node !== 'object') return [];
  const out: CourseStep[] = [];
  let order = 0;
  for (const [bucket, idsObj] of Object.entries(node as Record<string, unknown>)) {
    const type = TYPE_MAP[bucket];
    if (!type) continue; // skip non-step keys (e.g. 'sfwd-quiz' empty handled below)
    if (!idsObj || typeof idsObj !== 'object') continue;
    for (const [idKey, childNode] of Object.entries(idsObj as Record<string, unknown>)) {
      const id = Number(idKey);
      if (!Number.isFinite(id)) continue;
      const children = buildSteps(childNode);
      const step: CourseStep = { type, id, order: order++ };
      if (children.length) step.children = children;
      out.push(step);
    }
  }
  return out;
}

function countSteps(steps: CourseStep[]): { lessons: number; topics: number; quizzes: number } {
  const acc = { lessons: 0, topics: 0, quizzes: 0 };
  const walk = (arr: CourseStep[]) => {
    for (const s of arr) {
      if (s.type === 'lesson') acc.lessons++;
      else if (s.type === 'topic') acc.topics++;
      else if (s.type === 'quiz') acc.quizzes++;
      if (s.children) walk(s.children);
    }
  };
  walk(steps);
  return acc;
}

export async function extractCourses() {
  const posts = await query<PostRow>(
    `SELECT ID, post_title, post_name, post_content, post_excerpt,
            post_status, post_date, post_modified, menu_order
       FROM ${WP_PREFIX}posts
      WHERE post_type='sfwd-courses' AND post_status IN ('publish','pending')
      ORDER BY menu_order, post_title`,
  );
  const ids = posts.map((p) => p.ID);
  const meta = await fetchMetaForPosts(ids);
  const terms = await fetchTermsForObjects(ids);

  // Fallback curriculum source: the LearnDash `ld_course_steps` blobs on these
  // courses were left empty by a plugin version migration (course_id inside
  // the blob != post ID). The authoritative linkage now lives on the lesson
  // side via the lesson's `course_id` meta. Build a course_id -> lessons map.
  const lessonLinks = await query<RowDataPacket & {
    lesson_id: number;
    course_id: number;
    menu_order: number;
    post_status: string;
  }>(
    `SELECT p.ID AS lesson_id, CAST(pm.meta_value AS UNSIGNED) AS course_id,
            p.menu_order, p.post_status
       FROM ${WP_PREFIX}posts p
       JOIN ${WP_PREFIX}postmeta pm
         ON pm.post_id = p.ID AND pm.meta_key = 'course_id'
      WHERE p.post_type='sfwd-lessons' AND p.post_status IN ('publish','pending')
      ORDER BY p.menu_order, p.post_title`,
  );
  const lessonsByCourse = new Map<number, Array<{ id: number; order: number; status: string }>>();
  for (const l of lessonLinks) {
    if (!l.course_id) continue;
    const arr = lessonsByCourse.get(l.course_id) ?? [];
    arr.push({ id: l.lesson_id, order: l.menu_order, status: l.post_status });
    lessonsByCourse.set(l.course_id, arr);
  }

  const anomalies: Array<{ wp_id: number; slug: string; issue: string }> = [];

  const records = posts.map((p) => {
    const bag = meta.get(p.ID);

    const stepsRaw = unserialize<Record<string, unknown>>(m(bag, 'ld_course_steps'));
    const stepsTree = (stepsRaw as { steps?: { h?: unknown } } | null)?.steps?.h;
    let course_steps = buildSteps(stepsTree);
    let steps_source: 'ld_course_steps' | 'lesson_course_id_fallback' | 'none' =
      course_steps.length ? 'ld_course_steps' : 'none';
    const declaredCount = toInt((stepsRaw as { steps_count?: unknown } | null)?.steps_count);

    // Fallback: rebuild ordered lesson steps from the lesson->course links.
    if (course_steps.length === 0) {
      const linked = lessonsByCourse.get(p.ID) ?? [];
      if (linked.length) {
        course_steps = linked
          .sort((a, b) => a.order - b.order)
          .map((l, i): CourseStep => ({ type: 'lesson', id: l.id, order: i }));
        steps_source = 'lesson_course_id_fallback';
      }
    }
    const stepCounts = countSteps(course_steps);

    if (course_steps.length === 0) {
      anomalies.push({
        wp_id: p.ID,
        slug: p.post_name,
        issue: 'empty ld_course_steps and no lessons link via course_id (no curriculum)',
      });
    } else if (steps_source === 'lesson_course_id_fallback') {
      anomalies.push({
        wp_id: p.ID,
        slug: p.post_name,
        issue: `ld_course_steps empty (stale LearnDash migration); curriculum rebuilt from ${course_steps.length} lesson course_id link(s)`,
      });
    }

    const settings = unserialize<Record<string, string>>(m(bag, '_sfwd-courses')) ?? {};
    const priceType =
      m(bag, '_ld_price_type') ||
      settings['sfwd-courses_course_price_type'] ||
      null;
    const certificateRaw =
      m(bag, '_ld_certificate') ||
      settings['sfwd-courses_certificate'] ||
      '';
    const certificate_id = toInt(certificateRaw);

    const thumbnailId = toInt(m(bag, '_thumbnail_id'));
    const coverImageId = toInt(m(bag, 'sfwd-courses_course-cover-image_thumbnail_id'));
    const video = m(bag, '_buddyboss_lms_course_video') || null;

    return {
      wp_id: p.ID,
      status: p.post_status, // 'publish' (30) | 'pending' (17)
      status_code: p.post_status === 'publish' ? 30 : 17,
      needs_review: p.post_status === 'pending',
      title: p.post_title,
      slug: p.post_name,
      content: p.post_content,
      excerpt: p.post_excerpt,
      menu_order: p.menu_order,
      date: p.post_date,
      modified: p.post_modified,
      price_type: priceType,
      price: settings['sfwd-courses_course_price'] || null,
      access_mode: settings['sfwd-courses_course_access_list'] ? 'restricted' : (priceType ?? null),
      certificate_id,
      featured_image_id: thumbnailId,
      cover_image_id: coverImageId,
      intro_video: video,
      short_description: settings['sfwd-courses_course_short_description'] || null,
      materials_enabled: settings['sfwd-courses_course_materials_enabled'] === 'on',
      categories: termsByTaxonomy(terms.get(p.ID), 'ld_course_category'),
      tags: termsByTaxonomy(terms.get(p.ID), 'ld_course_tag'),
      step_counts: stepCounts,
      declared_step_count: declaredCount,
      steps_source,
      course_steps,
      old_path: wpPermalinkPath({ postType: 'sfwd-courses', slug: p.post_name }),
      new_path: nextRoutePath({ postType: 'sfwd-courses', slug: p.post_name }),
    };
  });

  const publishCount = records.filter((r) => r.status === 'publish').length;
  const pendingCount = records.filter((r) => r.status === 'pending').length;

  const file = await writeJson(
    'courses',
    envelope('courses', records, {
      status_breakdown: { publish: publishCount, pending: pendingCount },
      anomalies,
    }),
  );
  return { file, count: records.length, publishCount, pendingCount, anomalies };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  extractCourses()
    .then((r) => {
      console.log(`courses -> ${r.count} (publish=${r.publishCount}, pending=${r.pendingCount}); anomalies=${r.anomalies.length}`);
      console.log(r.file);
    })
    .catch((e) => {
      console.error(e);
      process.exitCode = 1;
    })
    .finally(closePool);
}
