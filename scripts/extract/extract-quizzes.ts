/**
 * extract-quizzes.ts — LearnDash `sfwd-quiz` (publish).
 *
 * Run: npx tsx scripts/extract/extract-quizzes.ts
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
import { envelope, writeJson } from './lib/common.ts';
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

export async function extractQuizzes() {
  const posts = await query<PostRow>(
    `SELECT ID, post_title, post_name, post_content, post_excerpt,
            post_status, post_date, post_modified, menu_order
       FROM ${WP_PREFIX}posts
      WHERE post_type='sfwd-quiz' AND post_status='publish'
      ORDER BY menu_order, post_title`,
  );
  const ids = posts.map((p) => p.ID);
  const meta = await fetchMetaForPosts(ids);

  const records = posts.map((p) => {
    const bag = meta.get(p.ID);
    const settings = unserialize<Record<string, string>>(m(bag, '_sfwd-quiz')) ?? {};
    const courseMarker = Object.keys(bag ?? {}).find((k) => /^ld_course_\d+$/.test(k));
    const lessonMarker = Object.keys(bag ?? {}).find((k) => /^ld_lesson_\d+$/.test(k));

    return {
      wp_id: p.ID,
      status: p.post_status,
      title: p.post_title,
      slug: p.post_name,
      content: p.post_content,
      excerpt: p.post_excerpt,
      menu_order: p.menu_order,
      date: p.post_date,
      modified: p.post_modified,
      course_id: courseMarker ? toInt(courseMarker.replace('ld_course_', '')) : toInt(m(bag, 'course_id')),
      lesson_id: lessonMarker ? toInt(lessonMarker.replace('ld_lesson_', '')) : toInt(m(bag, 'lesson_id')),
      // LearnDash pro-quiz internal id, if present, links to wp_learndash_pro_quiz_* tables.
      pro_quiz_id: toInt(m(bag, 'quiz_pro_id') ?? settings['sfwd-quiz_quiz_pro']),
      passing_percentage: settings['sfwd-quiz_passingpercentage'] || null,
      featured_image_id: toInt(m(bag, '_thumbnail_id')),
      old_path: wpPermalinkPath({ postType: 'sfwd-quiz', slug: p.post_name }),
      new_path: nextRoutePath({ postType: 'sfwd-quiz', slug: p.post_name }),
    };
  });

  const file = await writeJson('quizzes', envelope('quizzes', records));
  return { file, count: records.length };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  extractQuizzes()
    .then((r) => {
      console.log(`quizzes -> ${r.count}`);
      console.log(r.file);
    })
    .catch((e) => {
      console.error(e);
      process.exitCode = 1;
    })
    .finally(closePool);
}
