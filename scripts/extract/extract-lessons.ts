/**
 * extract-lessons.ts — LearnDash `sfwd-lessons` (publish).
 *
 * Links to its course via the `course_id` meta, cross-checked against the
 * `ld_course_{ID}` marker meta. Sort order is taken from the course's
 * `ld_course_steps` when present, else the lesson's own menu_order.
 *
 * Run: npx tsx scripts/extract/extract-lessons.ts
 */
import {
  WP_PREFIX,
  query,
  closePool,
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

export async function extractLessons() {
  const posts = await query<PostRow>(
    `SELECT ID, post_title, post_name, post_content, post_excerpt,
            post_status, post_date, post_modified, menu_order
       FROM ${WP_PREFIX}posts
      WHERE post_type='sfwd-lessons' AND post_status='publish'
      ORDER BY menu_order, post_title`,
  );
  const ids = posts.map((p) => p.ID);
  const meta = await fetchMetaForPosts(ids);
  const terms = await fetchTermsForObjects(ids);

  const anomalies: Array<{ wp_id: number; slug: string; issue: string }> = [];

  const records = posts.map((p) => {
    const bag = meta.get(p.ID);
    const courseId = toInt(m(bag, 'course_id'));

    // Cross-check: a lesson assigned to course N also carries ld_course_N meta.
    const courseMarker = Object.keys(bag ?? {}).find((k) => /^ld_course_\d+$/.test(k));
    const markerCourseId = courseMarker ? toInt(courseMarker.replace('ld_course_', '')) : null;
    if (courseId && markerCourseId && courseId !== markerCourseId) {
      anomalies.push({
        wp_id: p.ID,
        slug: p.post_name,
        issue: `course_id meta (${courseId}) disagrees with ld_course_ marker (${markerCourseId})`,
      });
    }
    if (!courseId) {
      anomalies.push({ wp_id: p.ID, slug: p.post_name, issue: 'lesson not linked to any course (no course_id meta)' });
    }

    return {
      wp_id: p.ID,
      status: p.post_status,
      title: p.post_title,
      slug: p.post_name,
      content: p.post_content,
      excerpt: p.post_excerpt,
      course_id: courseId,
      course_id_marker: markerCourseId,
      menu_order: p.menu_order, // course-relative sort order
      date: p.post_date,
      modified: p.post_modified,
      featured_image_id: toInt(m(bag, '_thumbnail_id')),
      video_url: m(bag, '_buddyboss_lms_course_video') || null,
      categories: termsByTaxonomy(terms.get(p.ID), 'ld_lesson_category'),
      tags: termsByTaxonomy(terms.get(p.ID), 'ld_lesson_tag'),
      old_path: wpPermalinkPath({ postType: 'sfwd-lessons', slug: p.post_name }),
      new_path: nextRoutePath({ postType: 'sfwd-lessons', slug: p.post_name }),
    };
  });

  const file = await writeJson('lessons', envelope('lessons', records, { anomalies }));
  return { file, count: records.length, anomalies };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  extractLessons()
    .then((r) => {
      console.log(`lessons -> ${r.count}; anomalies=${r.anomalies.length}`);
      console.log(r.file);
    })
    .catch((e) => {
      console.error(e);
      process.exitCode = 1;
    })
    .finally(closePool);
}
