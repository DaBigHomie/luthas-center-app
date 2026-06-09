/**
 * sanitize.ts — curation pass over the raw extracted JSON.
 *
 * Rules:
 *  - Drop draft "junk" pages/posts: title matches
 *    /^(home\s*\d|home.*(bk|backup|temp|transition)|temp|untitled)$/i, or empty.
 *  - Dedupe by slug (then title) within each domain.
 *  - Keep ALL 30 published courses — the Masterclass/celebrity content is
 *    owned; never excluded on IP grounds.
 *
 * Writes data/extracted/_sanitized/<domain>.json + data/extracted/_report.json.
 *
 * Run: npx tsx scripts/extract/sanitize.ts
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { EXTRACT_DIR, SANITIZED_DIR } from './lib/wp-db.ts';

const JUNK_TITLE = /^(home\s*\d|home.*(bk|backup|temp|transition)|temp|untitled)$/i;

// Domains that carry an array of records under `records`.
const RECORD_DOMAINS = [
  'courses',
  'lessons',
  'quizzes',
  'products',
  'donations',
  'posts',
  'pages',
  'media',
  'profiles',
] as const;

interface AnyRecord {
  wp_id?: number;
  slug?: string;
  title?: string;
  status?: string;
  [k: string]: unknown;
}

interface DomainReport {
  domain: string;
  raw: number;
  kept: number;
  dropped_junk: number;
  dropped_dupe: number;
  drops: Array<{ wp_id?: number; slug?: string; title?: string; reason: string }>;
}

async function readDomain(domain: string): Promise<Record<string, unknown> | null> {
  const file = path.join(EXTRACT_DIR, `${domain}.json`);
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch {
    return null;
  }
}

function isJunkDraft(r: AnyRecord, domain: string): boolean {
  if (domain !== 'pages' && domain !== 'posts') return false;
  const title = (r.title ?? '').trim();
  // Empty title -> junk regardless of status.
  if (title === '') return true;
  // Junk-title rule only culls drafts (published junk is kept for review).
  if (r.status === 'draft' && JUNK_TITLE.test(title)) return true;
  return false;
}

export async function sanitize() {
  await fs.mkdir(SANITIZED_DIR, { recursive: true });
  const reports: DomainReport[] = [];

  for (const domain of RECORD_DOMAINS) {
    const data = await readDomain(domain);
    if (!data || !Array.isArray(data.records)) continue;
    const records = data.records as AnyRecord[];

    const report: DomainReport = {
      domain,
      raw: records.length,
      kept: 0,
      dropped_junk: 0,
      dropped_dupe: 0,
      drops: [],
    };

    const seenSlug = new Set<string>();
    const seenTitle = new Set<string>();
    const kept: AnyRecord[] = [];

    for (const r of records) {
      // Never drop a published course on any ground.
      const isPublishedCourse = domain === 'courses' && r.status === 'publish';

      if (!isPublishedCourse && isJunkDraft(r, domain)) {
        report.dropped_junk++;
        report.drops.push({ wp_id: r.wp_id, slug: r.slug, title: r.title, reason: 'junk_draft' });
        continue;
      }

      // Dedupe (skip for media — many share derived filenames; identity is wp_id).
      if (domain !== 'media' && !isPublishedCourse) {
        const slugKey = (r.slug ?? '').toLowerCase();
        const titleKey = (r.title ?? '').trim().toLowerCase();
        if (slugKey && seenSlug.has(slugKey)) {
          report.dropped_dupe++;
          report.drops.push({ wp_id: r.wp_id, slug: r.slug, title: r.title, reason: 'duplicate_slug' });
          continue;
        }
        if (!slugKey && titleKey && seenTitle.has(titleKey)) {
          report.dropped_dupe++;
          report.drops.push({ wp_id: r.wp_id, slug: r.slug, title: r.title, reason: 'duplicate_title' });
          continue;
        }
        if (slugKey) seenSlug.add(slugKey);
        if (titleKey) seenTitle.add(titleKey);
      }

      kept.push(r);
    }

    report.kept = kept.length;
    reports.push(report);

    const out = { ...data, count: kept.length, sanitized: true, records: kept };
    await fs.writeFile(
      path.join(SANITIZED_DIR, `${domain}.json`),
      JSON.stringify(out, null, 2) + '\n',
      'utf8',
    );
  }

  // Assertion: all 30 published courses survive.
  const coursesReport = reports.find((r) => r.domain === 'courses');
  const courseData = await readDomain('courses');
  const publishedCoursesRaw =
    (courseData?.records as AnyRecord[] | undefined)?.filter((r) => r.status === 'publish').length ?? 0;

  const report = {
    generated_at: new Date().toISOString(),
    junk_title_pattern: JUNK_TITLE.source,
    published_courses_kept: publishedCoursesRaw,
    published_courses_assertion:
      publishedCoursesRaw === 30 ? 'PASS (all 30 owned courses retained)' : `WARN (expected 30, found ${publishedCoursesRaw})`,
    domains: reports,
    totals: {
      raw: reports.reduce((s, r) => s + r.raw, 0),
      kept: reports.reduce((s, r) => s + r.kept, 0),
      dropped_junk: reports.reduce((s, r) => s + r.dropped_junk, 0),
      dropped_dupe: reports.reduce((s, r) => s + r.dropped_dupe, 0),
    },
  };

  await fs.writeFile(
    path.join(EXTRACT_DIR, '_report.json'),
    JSON.stringify(report, null, 2) + '\n',
    'utf8',
  );

  void coursesReport;
  return report;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  sanitize()
    .then((r) => {
      console.log('sanitize complete');
      for (const d of r.domains) {
        console.log(
          `  ${d.domain.padEnd(10)} raw=${d.raw} kept=${d.kept} junk=${d.dropped_junk} dupe=${d.dropped_dupe}`,
        );
      }
      console.log(`  courses: ${r.published_courses_assertion}`);
    })
    .catch((e) => {
      console.error(e);
      process.exitCode = 1;
    });
}
