/**
 * run-all.ts — full extraction pipeline for the Luthas Center WP migration.
 *
 *   1. connectivity check (blog 1 / wp_ prefix)
 *   2. run every per-domain extractor
 *   3. run sanitize (curated set + report)
 *   4. validate RAW counts against the known-good expectations; print raw vs
 *      curated counts. Fails loudly (exit 1) on any mismatch.
 *
 * Run: npx tsx scripts/extract/run-all.ts
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { WP_PREFIX, query, closePool, EXTRACT_DIR, SANITIZED_DIR } from './lib/wp-db.ts';
import { extractCourses } from './extract-courses.ts';
import { extractLessons } from './extract-lessons.ts';
import { extractQuizzes } from './extract-quizzes.ts';
import { extractProducts } from './extract-products.ts';
import { extractDonations } from './extract-donations.ts';
import { extractPosts } from './extract-posts.ts';
import { extractPages } from './extract-pages.ts';
import { extractMediaManifest } from './extract-media-manifest.ts';
import { extractTaxonomy } from './extract-taxonomy.ts';
import { extractRedirects } from './extract-redirects.ts';
import { extractProfiles } from './extract-profiles.ts';
import { sanitize } from './sanitize.ts';
import type { RowDataPacket } from 'mysql2/promise';

// Expected RAW counts (per spec / verified against the container).
const EXPECTED: Array<{ label: string; sql: string; expect: number }> = [
  { label: 'courses.publish', expect: 30, sql: `post_type='sfwd-courses' AND post_status='publish'` },
  { label: 'courses.pending', expect: 17, sql: `post_type='sfwd-courses' AND post_status='pending'` },
  { label: 'lessons.publish', expect: 57, sql: `post_type='sfwd-lessons' AND post_status='publish'` },
  { label: 'quizzes.publish', expect: 5, sql: `post_type='sfwd-quiz' AND post_status='publish'` },
  { label: 'products.publish', expect: 15, sql: `post_type='product' AND post_status='publish'` },
  { label: 'give_forms.publish', expect: 3, sql: `post_type='give_forms' AND post_status='publish'` },
  { label: 'posts.publish', expect: 446, sql: `post_type='post' AND post_status='publish'` },
  { label: 'posts.draft', expect: 222, sql: `post_type='post' AND post_status='draft'` },
  { label: 'pages.publish', expect: 14, sql: `post_type='page' AND post_status='publish'` },
];

async function dbCount(where: string): Promise<number> {
  const rows = await query<RowDataPacket & { n: number }>(
    `SELECT COUNT(*) AS n FROM ${WP_PREFIX}posts WHERE ${where}`,
  );
  return Number(rows[0]?.n ?? 0);
}

async function fileCount(domain: string, dir: string): Promise<number> {
  try {
    const data = JSON.parse(await fs.readFile(path.join(dir, `${domain}.json`), 'utf8'));
    if (Array.isArray(data.records)) return data.records.length;
    if (typeof data.count === 'number') return data.count;
    return 0;
  } catch {
    return -1;
  }
}

async function main() {
  console.log('=== Luthas Center WP extraction pipeline (blog_id=1, wp_ prefix) ===\n');

  // 1. Connectivity.
  const total = await dbCount(`1=1`);
  console.log(`[connectivity] wp_posts total rows: ${total}\n`);
  if (total <= 0) throw new Error('Connectivity check failed: wp_posts is empty/unreachable.');

  // 2. Extractors.
  console.log('[extract] running per-domain extractors...');
  const c = await extractCourses();
  console.log(`  courses    raw=${c.count} (publish=${c.publishCount}, pending=${c.pendingCount}) anomalies=${c.anomalies.length}`);
  const l = await extractLessons();
  console.log(`  lessons    raw=${l.count} anomalies=${l.anomalies.length}`);
  const q = await extractQuizzes();
  console.log(`  quizzes    raw=${q.count}`);
  const pr = await extractProducts();
  console.log(`  products   raw=${pr.count}`);
  const d = await extractDonations();
  console.log(`  donations  raw=${d.count} (earnings=${d.donation_stats.total_earnings}, sales=${d.donation_stats.total_sales})`);
  const po = await extractPosts();
  console.log(`  posts      raw=${po.count} (publish=${po.publishCount}, draft=${po.draftCount})`);
  const pg = await extractPages();
  console.log(`  pages      raw=${pg.count}`);
  const md = await extractMediaManifest();
  console.log(`  media      raw=${md.count}`);
  const tx = await extractTaxonomy();
  console.log(`  taxonomy   terms=${tx.termCount} rels=${tx.relationshipCount} taxonomies=${tx.taxonomyCount}`);
  const rd = await extractRedirects();
  console.log(`  redirects  raw=${rd.count} (canonical=${rd.canonical}, historical=${rd.historical})`);
  const pf = await extractProfiles();
  console.log(`  profiles   raw=${pf.count}\n`);

  // 3. Sanitize.
  console.log('[sanitize] applying curation rules...');
  const report = await sanitize();
  console.log(`  ${report.published_courses_assertion}\n`);

  // 4. Validation.
  console.log('[validate] asserting RAW counts against DB + extracted files...');
  const failures: string[] = [];
  for (const e of EXPECTED) {
    const got = await dbCount(e.sql);
    const status = got === e.expect ? 'OK ' : 'FAIL';
    if (got !== e.expect) failures.push(`${e.label}: expected ${e.expect}, db has ${got}`);
    console.log(`  [${status}] ${e.label.padEnd(20)} expected=${e.expect} db=${got}`);
  }

  // Cross-check extracted file counts for the multi-status domains.
  const courseFile = await fileCount('courses', EXTRACT_DIR);
  if (courseFile !== 47) failures.push(`courses.json count: expected 47, got ${courseFile}`);
  const postsFile = await fileCount('posts', EXTRACT_DIR);
  if (postsFile !== 668) failures.push(`posts.json count: expected 668, got ${postsFile}`);

  console.log('\n[counts] RAW vs CURATED (post-sanitization):');
  console.log(`  ${'domain'.padEnd(10)} ${'raw'.padStart(6)} ${'curated'.padStart(8)}`);
  for (const dom of report.domains) {
    const curated = await fileCount(dom.domain, SANITIZED_DIR);
    console.log(`  ${dom.domain.padEnd(10)} ${String(dom.raw).padStart(6)} ${String(curated).padStart(8)}`);
  }

  console.log('');
  if (failures.length) {
    console.error('[validate] VALIDATION FAILED:');
    for (const f of failures) console.error(`  - ${f}`);
    throw new Error(`${failures.length} validation failure(s).`);
  }
  console.log('[validate] PASS — all raw counts match expectations.');
  console.log('\nOutputs: data/extracted/*.json + data/extracted/_sanitized/*.json + data/extracted/_report.json');
}

main()
  .catch((e) => {
    console.error('\nPIPELINE FAILED:', e.message);
    process.exitCode = 1;
  })
  .finally(closePool);
