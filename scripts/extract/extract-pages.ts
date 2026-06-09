/**
 * extract-pages.ts — `page` (status `publish`, 14).
 *
 * Resolves hierarchical ancestor slug chains so old/new paths nest correctly.
 *
 * Run: npx tsx scripts/extract/extract-pages.ts
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
  fetchAuthors,
  resolveAncestorSlugs,
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
  post_parent: number;
  post_date: string;
  post_modified: string;
  menu_order: number;
}

export async function extractPages() {
  const posts = await query<PostRow>(
    `SELECT ID, post_author, post_title, post_name, post_content, post_excerpt,
            post_status, post_parent, post_date, post_modified, menu_order
       FROM ${WP_PREFIX}posts
      WHERE post_type='page' AND post_status='publish'
      ORDER BY menu_order, post_title`,
  );
  const ids = posts.map((p) => p.ID);
  const meta = await fetchMetaForPosts(ids);
  const authors = await fetchAuthors();
  const ancestry = await resolveAncestorSlugs(
    posts.map((p) => ({ ID: p.ID, post_name: p.post_name, post_parent: p.post_parent })),
  );

  const records = posts.map((p) => {
    const bag = meta.get(p.ID);
    const author = authors.get(p.post_author);
    const ancestorSlugs = ancestry.get(p.ID) ?? [p.post_name];
    return {
      wp_id: p.ID,
      status: p.post_status,
      title: p.post_title,
      slug: p.post_name,
      content: p.post_content,
      excerpt: p.post_excerpt,
      parent_id: p.post_parent || null,
      ancestor_slugs: ancestorSlugs,
      menu_order: p.menu_order,
      date: p.post_date,
      modified: p.post_modified,
      author: author ? { id: author.id, name: author.display_name } : { id: p.post_author, name: null },
      featured_image_id: toInt(m(bag, '_thumbnail_id')),
      page_template: m(bag, '_wp_page_template') || null,
      seo_title: m(bag, '_yoast_wpseo_title') || null,
      seo_description: m(bag, '_yoast_wpseo_metadesc') || null,
      old_path: wpPermalinkPath({ postType: 'page', slug: p.post_name, ancestorSlugs }),
      new_path: nextRoutePath({ postType: 'page', slug: p.post_name, ancestorSlugs }),
    };
  });

  const file = await writeJson('pages', envelope('pages', records));
  return { file, count: records.length };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  extractPages()
    .then((r) => {
      console.log(`pages -> ${r.count}`);
      console.log(r.file);
    })
    .catch((e) => {
      console.error(e);
      process.exitCode = 1;
    })
    .finally(closePool);
}
