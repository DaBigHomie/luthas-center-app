/**
 * extract-donations.ts — GiveWP `give_forms` (status `publish` ONLY).
 *
 * Form config comes from the dedicated `wp_give_formmeta` table:
 *   goal `_give_set_goal`, levels `_give_donation_levels` (serialized),
 *   `_give_form_earnings`, `_give_form_sales`.
 *
 * Emits `donation_forms` + an aggregate `donation_stats`.
 *
 * PRIVACY: We NEVER read wp_give_donations / wp_give_donors / payment rows —
 * those are DEMO data with PII and are discarded entirely. Only form-level
 * config + the form's own rolled-up earnings/sales counters are extracted.
 *
 * Run: npx tsx scripts/extract/extract-donations.ts
 */
import {
  WP_PREFIX,
  query,
  closePool,
  unserialize,
  wpPermalinkPath,
  nextRoutePath,
  m,
  toNum,
  toInt,
} from './lib/wp-db.ts';
import { envelope, writeJson } from './lib/common.ts';
import type { RowDataPacket } from 'mysql2/promise';

interface PostRow extends RowDataPacket {
  ID: number;
  post_title: string;
  post_name: string;
  post_content: string;
  post_status: string;
  post_date: string;
  post_modified: string;
}

interface DonationLevel {
  level_id: string | null;
  amount: number | null;
  text: string | null;
  recurring: boolean;
  period: string | null;
  period_interval: number | null;
}

function parseLevels(raw: unknown): DonationLevel[] {
  const data = unserialize<unknown>(raw);
  if (!data || typeof data !== 'object') return [];
  const list = Array.isArray(data) ? data : Object.values(data as Record<string, unknown>);
  const out: DonationLevel[] = [];
  for (const lv of list) {
    if (!lv || typeof lv !== 'object') continue;
    const o = lv as Record<string, unknown>;
    const idObj = o['_give_id'] as Record<string, unknown> | undefined;
    out.push({
      level_id: idObj && typeof idObj === 'object' ? String(idObj['level_id'] ?? '') || null : null,
      amount: toNum(o['_give_amount']),
      text: (o['_give_text'] as string) || null,
      recurring: o['_give_recurring'] === 'yes',
      period: (o['_give_period'] as string) || null,
      period_interval: toInt(o['_give_period_interval']),
    });
  }
  return out;
}

export async function extractDonations() {
  const posts = await query<PostRow>(
    `SELECT ID, post_title, post_name, post_content, post_status,
            post_date, post_modified
       FROM ${WP_PREFIX}posts
      WHERE post_type='give_forms' AND post_status='publish'
      ORDER BY post_date`,
  );
  const ids = posts.map((p) => p.ID);

  // Form-level meta ONLY (no donations/donors tables touched).
  const formMeta = new Map<number, Record<string, string>>();
  if (ids.length) {
    const ph = ids.map(() => '?').join(',');
    const rows = await query<RowDataPacket & {
      form_id: number;
      meta_key: string;
      meta_value: string | null;
    }>(
      `SELECT form_id, meta_key, meta_value FROM ${WP_PREFIX}give_formmeta
        WHERE form_id IN (${ph})`,
      ids,
    );
    for (const r of rows) {
      const bag = formMeta.get(r.form_id) ?? {};
      bag[r.meta_key] = r.meta_value ?? '';
      formMeta.set(r.form_id, bag);
    }
  }

  const donation_forms = posts.map((p) => {
    const bag = formMeta.get(p.ID);
    const goal = toNum(m(bag, '_give_set_goal'));
    const earnings = toNum(m(bag, '_give_form_earnings'));
    const sales = toInt(m(bag, '_give_form_sales'));
    return {
      wp_id: p.ID,
      status: p.post_status,
      title: p.post_title,
      slug: p.post_name,
      content: p.post_content,
      date: p.post_date,
      modified: p.post_modified,
      goal_enabled: m(bag, '_give_goal_option') === 'enabled',
      goal_amount: goal,
      goal_format: m(bag, '_give_goal_format') || null,
      price_option: m(bag, '_give_price_option') || null,
      set_price: toNum(m(bag, '_give_set_price')),
      custom_amount: m(bag, '_give_custom_amount') === 'enabled',
      donation_levels: parseLevels(m(bag, '_give_donation_levels')),
      earnings,
      sales,
      old_path: wpPermalinkPath({ postType: 'give_forms', slug: p.post_name }),
      new_path: nextRoutePath({ postType: 'give_forms', slug: p.post_name }),
    };
  });

  const donation_stats = {
    form_count: donation_forms.length,
    total_earnings: donation_forms.reduce((s, f) => s + (f.earnings ?? 0), 0),
    total_sales: donation_forms.reduce((s, f) => s + (f.sales ?? 0), 0),
    note: 'Aggregate is from form-level rollup counters only. Individual donor/payment rows are DEMO PII and were intentionally NOT extracted.',
  };

  const file = await writeJson(
    'donations',
    envelope('donations', donation_forms, { donation_stats }),
  );
  return { file, count: donation_forms.length, donation_stats };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  extractDonations()
    .then((r) => {
      console.log(`donations -> ${r.count}; earnings=${r.donation_stats.total_earnings}, sales=${r.donation_stats.total_sales}`);
      console.log(r.file);
    })
    .catch((e) => {
      console.error(e);
      process.exitCode = 1;
    })
    .finally(closePool);
}
