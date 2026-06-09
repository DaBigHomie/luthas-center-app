/**
 * extract-products.ts — WooCommerce `product` (publish).
 *
 * Run: npx tsx scripts/extract/extract-products.ts
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
  toNum,
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

const yn = (v: string | undefined): boolean => v === 'yes';

export async function extractProducts() {
  const posts = await query<PostRow>(
    `SELECT ID, post_title, post_name, post_content, post_excerpt,
            post_status, post_date, post_modified, menu_order
       FROM ${WP_PREFIX}posts
      WHERE post_type='product' AND post_status='publish'
      ORDER BY menu_order, post_title`,
  );
  const ids = posts.map((p) => p.ID);
  const meta = await fetchMetaForPosts(ids);
  const terms = await fetchTermsForObjects(ids);

  const records = posts.map((p) => {
    const bag = meta.get(p.ID);
    return {
      wp_id: p.ID,
      status: p.post_status,
      title: p.post_title,
      slug: p.post_name,
      description: p.post_content,
      short_description: p.post_excerpt,
      menu_order: p.menu_order,
      date: p.post_date,
      modified: p.post_modified,
      sku: m(bag, '_sku') || null,
      regular_price: toNum(m(bag, '_regular_price')),
      sale_price: toNum(m(bag, '_sale_price')),
      price: toNum(m(bag, '_price')),
      virtual: yn(m(bag, '_virtual')),
      downloadable: yn(m(bag, '_downloadable')),
      download_limit: toInt(m(bag, '_download_limit')),
      download_expiry: toInt(m(bag, '_download_expiry')),
      stock_status: m(bag, '_stock_status') || null,
      average_rating: toNum(m(bag, '_wc_average_rating')),
      review_count: toInt(m(bag, '_wc_review_count')),
      total_sales: toInt(m(bag, 'total_sales')),
      featured_image_id: toInt(m(bag, '_thumbnail_id')),
      categories: termsByTaxonomy(terms.get(p.ID), 'product_cat'),
      tags: termsByTaxonomy(terms.get(p.ID), 'product_tag'),
      old_path: wpPermalinkPath({ postType: 'product', slug: p.post_name }),
      new_path: nextRoutePath({ postType: 'product', slug: p.post_name }),
    };
  });

  const file = await writeJson('products', envelope('products', records));
  return { file, count: records.length };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  extractProducts()
    .then((r) => {
      console.log(`products -> ${r.count}`);
      console.log(r.file);
    })
    .catch((e) => {
      console.error(e);
      process.exitCode = 1;
    })
    .finally(closePool);
}
