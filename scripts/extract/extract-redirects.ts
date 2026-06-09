/**
 * extract-redirects.ts — Next.js redirect map (functional-parity).
 *
 * For every published post / page / course / product (and the 17 pending
 * courses, tagged), emit { type, old_path, new_path, wp_id, slug }. Also pull
 * historical slugs from `_wp_old_slug` meta so old permalinks keep resolving.
 *
 * There is no live WP to crawl; this map is derived purely from the DB.
 *
 * Run: npx tsx scripts/extract/extract-redirects.ts
 */
import {
  WP_PREFIX,
  query,
  closePool,
  wpPermalinkPath,
  nextRoutePath,
} from './lib/wp-db.ts';
import { writeJson, resolveAncestorSlugs } from './lib/common.ts';
import type { RowDataPacket } from 'mysql2/promise';

interface PostRow extends RowDataPacket {
  ID: number;
  post_type: string;
  post_name: string;
  post_parent: number;
  post_status: string;
}

interface Redirect {
  type: string;
  wp_id: number;
  slug: string;
  old_path: string;
  new_path: string;
  status?: string;
  reason?: 'canonical' | 'historical_slug';
}

const TYPE_LABEL: Record<string, string> = {
  post: 'post',
  page: 'page',
  'sfwd-courses': 'course',
  'sfwd-lessons': 'lesson',
  'sfwd-quiz': 'quiz',
  product: 'product',
  give_forms: 'donation_form',
};

export async function extractRedirects() {
  const posts = await query<PostRow>(
    `SELECT ID, post_type, post_name, post_parent, post_status
       FROM ${WP_PREFIX}posts
      WHERE (post_type IN ('post','page','sfwd-lessons','sfwd-quiz','product','give_forms') AND post_status='publish')
         OR (post_type='sfwd-courses' AND post_status IN ('publish','pending'))
      ORDER BY post_type, ID`,
  );

  // Ancestor chains for pages only.
  const pages = posts.filter((p) => p.post_type === 'page');
  const ancestry = await resolveAncestorSlugs(
    pages.map((p) => ({ ID: p.ID, post_name: p.post_name, post_parent: p.post_parent })),
  );

  // Historical slugs.
  const ids = posts.map((p) => p.ID);
  const oldSlugs = new Map<number, string[]>();
  if (ids.length) {
    const CHUNK = 500;
    for (let i = 0; i < ids.length; i += CHUNK) {
      const slice = ids.slice(i, i + CHUNK);
      const ph = slice.map(() => '?').join(',');
      const rows = await query<RowDataPacket & { post_id: number; meta_value: string }>(
        `SELECT post_id, meta_value FROM ${WP_PREFIX}postmeta
          WHERE meta_key='_wp_old_slug' AND post_id IN (${ph})`,
        slice,
      );
      for (const r of rows) {
        const arr = oldSlugs.get(r.post_id) ?? [];
        if (r.meta_value && !arr.includes(r.meta_value)) arr.push(r.meta_value);
        oldSlugs.set(r.post_id, arr);
      }
    }
  }

  const redirects: Redirect[] = [];
  for (const p of posts) {
    const ancestorSlugs = p.post_type === 'page' ? ancestry.get(p.ID) ?? [p.post_name] : undefined;
    const canonicalOld = wpPermalinkPath({ postType: p.post_type, slug: p.post_name, ancestorSlugs });
    const canonicalNew = nextRoutePath({ postType: p.post_type, slug: p.post_name, ancestorSlugs });
    const label = TYPE_LABEL[p.post_type] ?? p.post_type;

    redirects.push({
      type: label,
      wp_id: p.ID,
      slug: p.post_name,
      old_path: canonicalOld,
      new_path: canonicalNew,
      ...(p.post_status !== 'publish' ? { status: p.post_status } : {}),
      reason: 'canonical',
    });

    // Historical slug -> canonical new route.
    for (const old of oldSlugs.get(p.ID) ?? []) {
      const histAncestors =
        p.post_type === 'page' && ancestorSlugs
          ? [...ancestorSlugs.slice(0, -1), old]
          : undefined;
      redirects.push({
        type: label,
        wp_id: p.ID,
        slug: old,
        old_path: wpPermalinkPath({ postType: p.post_type, slug: old, ancestorSlugs: histAncestors }),
        new_path: canonicalNew,
        reason: 'historical_slug',
      });
    }
  }

  const payload = {
    domain: 'redirects',
    source: 'luthascenter.com (wp_ / blog_id=1)',
    blog_id: 1 as const,
    extracted_at: new Date().toISOString(),
    note: 'Functional-parity redirect map derived from the DB (no live WP crawl).',
    count: redirects.length,
    canonical_count: redirects.filter((r) => r.reason === 'canonical').length,
    historical_count: redirects.filter((r) => r.reason === 'historical_slug').length,
    redirects,
  };

  const file = await writeJson('redirects', payload);
  return {
    file,
    count: redirects.length,
    canonical: payload.canonical_count,
    historical: payload.historical_count,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  extractRedirects()
    .then((r) => {
      console.log(`redirects -> ${r.count} (canonical=${r.canonical}, historical=${r.historical})`);
      console.log(r.file);
    })
    .catch((e) => {
      console.error(e);
      process.exitCode = 1;
    })
    .finally(closePool);
}
