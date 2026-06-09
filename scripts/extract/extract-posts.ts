/**
 * extract-posts.ts — `post` (publish=446 + draft=222), each tagged with status.
 *
 * Author from post_author -> wp_users. Featured image `_thumbnail_id`.
 * Categories/tags via term_relationships. Reading time from the Yoast meta
 * `_yoast_wpseo_estimated-reading-time-minutes`.
 *
 * Run: npx tsx scripts/extract/extract-posts.ts
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
  POST_STATUS_CODE,
} from './lib/wp-db.ts';
import {
  envelope,
  writeJson,
  fetchTermsForObjects,
  termsByTaxonomy,
  fetchAuthors,
} from './lib/common.ts';
import type { RowDataPacket } from 'mysql2/promise';

interface PostRow extends RowDataPacket {
  ID: number;
  post_author: number;
  post_title: string;
  post_name: string;
  post_content: string;
  post_excerpt: string;
  post_status: string;
  post_date: string;
  post_modified: string;
}

export async function extractPosts() {
  const posts = await query<PostRow>(
    `SELECT ID, post_author, post_title, post_name, post_content, post_excerpt,
            post_status, post_date, post_modified
       FROM ${WP_PREFIX}posts
      WHERE post_type='post' AND post_status IN ('publish','draft')
      ORDER BY post_date DESC`,
  );
  const ids = posts.map((p) => p.ID);
  const meta = await fetchMetaForPosts(ids);
  const terms = await fetchTermsForObjects(ids);
  const authors = await fetchAuthors();

  const records = posts.map((p) => {
    const bag = meta.get(p.ID);
    const author = authors.get(p.post_author);
    return {
      wp_id: p.ID,
      status: p.post_status, // 'publish' (30) | 'draft' (1)
      status_code: POST_STATUS_CODE[p.post_status] ?? null,
      title: p.post_title,
      slug: p.post_name,
      content: p.post_content,
      excerpt: p.post_excerpt,
      date: p.post_date,
      modified: p.post_modified,
      author: author
        ? { id: author.id, name: author.display_name, login: author.user_login, nicename: author.user_nicename }
        : { id: p.post_author, name: null, login: null, nicename: null },
      featured_image_id: toInt(m(bag, '_thumbnail_id')),
      reading_time_minutes: toInt(m(bag, '_yoast_wpseo_estimated-reading-time-minutes')),
      seo_title: m(bag, '_yoast_wpseo_title') || null,
      seo_description: m(bag, '_yoast_wpseo_metadesc') || null,
      categories: termsByTaxonomy(terms.get(p.ID), 'category'),
      tags: termsByTaxonomy(terms.get(p.ID), 'post_tag'),
      old_path: wpPermalinkPath({ postType: 'post', slug: p.post_name }),
      new_path: nextRoutePath({ postType: 'post', slug: p.post_name }),
    };
  });

  const publishCount = records.filter((r) => r.status === 'publish').length;
  const draftCount = records.filter((r) => r.status === 'draft').length;

  const file = await writeJson(
    'posts',
    envelope('posts', records, { status_breakdown: { publish: publishCount, draft: draftCount } }),
  );
  return { file, count: records.length, publishCount, draftCount };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  extractPosts()
    .then((r) => {
      console.log(`posts -> ${r.count} (publish=${r.publishCount}, draft=${r.draftCount})`);
      console.log(r.file);
    })
    .catch((e) => {
      console.error(e);
      process.exitCode = 1;
    })
    .finally(closePool);
}
