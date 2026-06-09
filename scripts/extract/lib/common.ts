/**
 * Shared helpers across extractors: JSON writing, term-relationship lookups,
 * author lookups, and ancestor-slug resolution for hierarchical pages.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  EXTRACT_DIR,
  WP_PREFIX,
  query,
  type PermalinkOpts,
} from './wp-db.ts';
import type { RowDataPacket } from 'mysql2/promise';

export interface ExtractEnvelope<T> {
  domain: string;
  source: string;
  blog_id: 1;
  extracted_at: string;
  count: number;
  records: T[];
  [extra: string]: unknown;
}

export async function writeJson(
  domain: string,
  payload: Record<string, unknown>,
): Promise<string> {
  await fs.mkdir(EXTRACT_DIR, { recursive: true });
  const file = path.join(EXTRACT_DIR, `${domain}.json`);
  await fs.writeFile(file, JSON.stringify(payload, null, 2) + '\n', 'utf8');
  return file;
}

export function envelope<T>(
  domain: string,
  records: T[],
  extra: Record<string, unknown> = {},
): ExtractEnvelope<T> {
  return {
    domain,
    source: 'luthascenter.com (wp_ / blog_id=1)',
    blog_id: 1,
    extracted_at: new Date().toISOString(),
    count: records.length,
    records,
    ...extra,
  };
}

export interface TermRow {
  term_id: number;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
}

/** All term-relationships for the given object ids, grouped by object id. */
export async function fetchTermsForObjects(
  ids: number[],
): Promise<Map<number, TermRow[]>> {
  const out = new Map<number, TermRow[]>();
  if (ids.length === 0) return out;
  const CHUNK = 500;
  for (let i = 0; i < ids.length; i += CHUNK) {
    const slice = ids.slice(i, i + CHUNK);
    const ph = slice.map(() => '?').join(',');
    const rows = await query<RowDataPacket & TermRow & { object_id: number }>(
      `SELECT tr.object_id, t.term_id, t.name, t.slug, tt.taxonomy, tt.parent
         FROM ${WP_PREFIX}term_relationships tr
         JOIN ${WP_PREFIX}term_taxonomy tt ON tt.term_taxonomy_id = tr.term_taxonomy_id
         JOIN ${WP_PREFIX}terms t ON t.term_id = tt.term_id
        WHERE tr.object_id IN (${ph})`,
      slice,
    );
    for (const r of rows) {
      let bag = out.get(r.object_id);
      if (!bag) {
        bag = [];
        out.set(r.object_id, bag);
      }
      bag.push({
        term_id: r.term_id,
        name: r.name,
        slug: r.slug,
        taxonomy: r.taxonomy,
        parent: r.parent,
      });
    }
  }
  return out;
}

export function termsByTaxonomy(
  terms: TermRow[] | undefined,
  taxonomy: string,
): Array<{ term_id: number; name: string; slug: string }> {
  return (terms ?? [])
    .filter((t) => t.taxonomy === taxonomy)
    .map(({ term_id, name, slug }) => ({ term_id, name, slug }));
}

export interface AuthorRow {
  id: number;
  display_name: string;
  user_login: string;
  user_nicename: string;
}

export async function fetchAuthors(): Promise<Map<number, AuthorRow>> {
  const rows = await query<RowDataPacket & AuthorRow>(
    `SELECT ID AS id, display_name, user_login, user_nicename
       FROM ${WP_PREFIX}users`,
  );
  return new Map(rows.map((r) => [r.id, r]));
}

/**
 * Resolve full ancestor slug chains for hierarchical posts (pages).
 * Returns a map post_id -> [rootSlug, ..., selfSlug].
 */
export async function resolveAncestorSlugs(
  posts: Array<{ ID: number; post_name: string; post_parent: number }>,
): Promise<Map<number, string[]>> {
  const byId = new Map(posts.map((p) => [p.ID, p]));
  // Pull any parents not already in the set.
  const need = new Set<number>();
  for (const p of posts) {
    if (p.post_parent && !byId.has(p.post_parent)) need.add(p.post_parent);
  }
  while (need.size) {
    const ids = [...need];
    need.clear();
    const ph = ids.map(() => '?').join(',');
    const rows = await query<RowDataPacket & {
      ID: number;
      post_name: string;
      post_parent: number;
    }>(
      `SELECT ID, post_name, post_parent FROM ${WP_PREFIX}posts WHERE ID IN (${ph})`,
      ids,
    );
    for (const r of rows) {
      if (!byId.has(r.ID)) {
        byId.set(r.ID, r);
        if (r.post_parent && !byId.has(r.post_parent)) need.add(r.post_parent);
      }
    }
  }
  const out = new Map<number, string[]>();
  for (const p of posts) {
    const chain: string[] = [];
    let cur: { ID: number; post_name: string; post_parent: number } | undefined = p;
    const seen = new Set<number>();
    while (cur && !seen.has(cur.ID)) {
      seen.add(cur.ID);
      chain.unshift(cur.post_name);
      cur = cur.post_parent ? byId.get(cur.post_parent) : undefined;
    }
    out.set(p.ID, chain);
  }
  return out;
}

export type { PermalinkOpts };
