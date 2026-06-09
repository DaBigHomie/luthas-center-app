/**
 * Shared DB + PHP helpers for the Luthas Center WordPress extraction pipeline.
 *
 * Data source: local Docker MySQL 8 container.
 *   host 127.0.0.1, port 33061, user root, pass root, db `local`.
 *
 * SCOPE: default `wp_` table prefix only (blog_id = 1, luthascenter.com).
 * All other prefixes (bdgucn_, bhrouf_, wp_19_, wp_37_, ...) are IGNORED.
 */
import mysql, { type Pool, type RowDataPacket } from 'mysql2/promise';
import { unserialize as phpLibUnserialize } from 'php-unserialize';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// --------------------------------------------------------------------------
// Connection pool
// --------------------------------------------------------------------------
export const WP_PREFIX = 'wp_';

export const DB_CONFIG = {
  host: process.env.WP_DB_HOST ?? '127.0.0.1',
  port: Number(process.env.WP_DB_PORT ?? 33061),
  user: process.env.WP_DB_USER ?? 'root',
  password: process.env.WP_DB_PASSWORD ?? 'root',
  database: process.env.WP_DB_NAME ?? 'local',
} as const;

let _pool: Pool | null = null;

export function getPool(): Pool {
  if (!_pool) {
    _pool = mysql.createPool({
      ...DB_CONFIG,
      waitForConnections: true,
      connectionLimit: 8,
      // WordPress meta routinely exceeds the default max packet for big
      // serialized blobs; keep results as plain strings so our unserializer
      // sees raw PHP rather than driver-coerced values.
      dateStrings: true,
      charset: 'utf8mb4',
    });
  }
  return _pool;
}

export async function query<T extends RowDataPacket = RowDataPacket>(
  sql: string,
  params: unknown[] = [],
): Promise<T[]> {
  const [rows] = await getPool().query<T[]>(sql, params);
  return rows;
}

export async function closePool(): Promise<void> {
  if (_pool) {
    await _pool.end();
    _pool = null;
  }
}

// --------------------------------------------------------------------------
// PHP unserialize — robust helper
// --------------------------------------------------------------------------
/**
 * Unserialize a PHP-serialized string.
 *
 * Strategy:
 *  1. Try the `php-unserialize` library (handles the common cases well).
 *  2. Fall back to our own byte-accurate parser, which copes with the
 *     UTF-8 / multibyte length quirks LearnDash & Give blobs sometimes carry
 *     (string lengths in serialize() are BYTE lengths, not char lengths).
 *
 * Returns `fallback` (default null) when the value is empty / unparseable.
 */
export function unserialize<T = unknown>(
  value: unknown,
  fallback: T | null = null,
): T | null {
  if (value == null) return fallback;
  if (typeof value !== 'string') return value as T;
  const s = value.trim();
  if (s === '') return fallback;
  // Not actually serialized — return as-is.
  if (!/^[abdiOs]:/.test(s) && s !== 'N;') {
    return value as unknown as T;
  }
  try {
    return phpLibUnserialize(s) as T;
  } catch {
    try {
      return phpParse<T>(s);
    } catch {
      return fallback;
    }
  }
}

/**
 * Byte-accurate PHP unserialize implementation (fallback path).
 * Operates over a UTF-8 byte buffer so `s:<bytelen>:"..."` is honored exactly.
 */
function phpParse<T>(input: string): T {
  const buf = Buffer.from(input, 'utf8');
  let pos = 0;

  const peek = () => buf[pos];
  const expect = (ch: string) => {
    if (buf[pos] !== ch.charCodeAt(0)) {
      throw new Error(`Expected '${ch}' at byte ${pos}`);
    }
    pos += 1;
  };
  const readUntil = (ch: string): string => {
    const start = pos;
    const code = ch.charCodeAt(0);
    while (pos < buf.length && buf[pos] !== code) pos += 1;
    const out = buf.toString('utf8', start, pos);
    pos += 1; // consume delimiter
    return out;
  };

  function parseValue(): unknown {
    const type = String.fromCharCode(peek());
    switch (type) {
      case 'N': // N;
        pos += 2;
        return null;
      case 'b': {
        pos += 2; // b:
        const v = buf[pos] === '1'.charCodeAt(0);
        pos += 2; // value + ;
        return v;
      }
      case 'i': {
        pos += 2; // i:
        return parseInt(readUntil(';'), 10);
      }
      case 'd': {
        pos += 2; // d:
        return parseFloat(readUntil(';'));
      }
      case 's': {
        pos += 2; // s:
        const len = parseInt(readUntil(':'), 10); // BYTE length
        expect('"');
        const str = buf.toString('utf8', pos, pos + len);
        pos += len; // advance exactly `len` bytes
        expect('"');
        expect(';');
        return str;
      }
      case 'a': {
        pos += 2; // a:
        const count = parseInt(readUntil(':'), 10);
        expect('{');
        const entries: Array<[unknown, unknown]> = [];
        for (let i = 0; i < count; i += 1) {
          const k = parseValue();
          const v = parseValue();
          entries.push([k, v]);
        }
        expect('}');
        return toArrayOrObject(entries);
      }
      case 'O': {
        pos += 2; // O:
        const nameLen = parseInt(readUntil(':'), 10);
        expect('"');
        pos += nameLen;
        expect('"');
        expect(':');
        const count = parseInt(readUntil(':'), 10);
        expect('{');
        const obj: Record<string, unknown> = {};
        for (let i = 0; i < count; i += 1) {
          const k = parseValue();
          const v = parseValue();
          obj[String(k)] = v;
        }
        expect('}');
        return obj;
      }
      default:
        throw new Error(`Unknown PHP token '${type}' at byte ${pos}`);
    }
  }

  return parseValue() as T;
}

/**
 * If every key is a sequential integer 0..n-1, return a plain array
 * (matching how PHP would present a list). Otherwise return an object.
 */
function toArrayOrObject(entries: Array<[unknown, unknown]>): unknown {
  const isList =
    entries.length > 0 &&
    entries.every(([k], i) => typeof k === 'number' && k === i);
  if (isList) return entries.map(([, v]) => v);
  const obj: Record<string, unknown> = {};
  for (const [k, v] of entries) obj[String(k)] = v;
  return obj;
}

// --------------------------------------------------------------------------
// Permalink / URL helper
// --------------------------------------------------------------------------
/**
 * Map the WP site origin → a relative path we can attach to the new domain.
 * The WP permalink_structure is `/%postname%/`, so for most public types the
 * old path is `/<slug>/`. Hierarchical pages can nest under their parent.
 */
export const WP_SITE_ORIGIN = 'http://luthascenter.local';
export const PRODUCTION_ORIGIN = 'https://luthascenter.com';

export interface PermalinkOpts {
  postType: string;
  slug: string;
  /** Full ancestor slug chain for hierarchical pages, root → self. */
  ancestorSlugs?: string[];
}

/**
 * WordPress front-end permalink path (leading + trailing slash) for blog 1.
 * Mirrors LearnDash / WooCommerce / Give default rewrite bases.
 */
export function wpPermalinkPath({ postType, slug, ancestorSlugs }: PermalinkOpts): string {
  const seg = (s: string) => encodeURIComponent(s).replace(/%2F/gi, '/');
  switch (postType) {
    case 'page':
      return `/${(ancestorSlugs ?? [slug]).map(seg).join('/')}/`;
    case 'post':
      return `/${seg(slug)}/`;
    case 'sfwd-courses':
      return `/courses/${seg(slug)}/`;
    case 'sfwd-lessons':
      return `/lessons/${seg(slug)}/`;
    case 'sfwd-quiz':
      return `/quizzes/${seg(slug)}/`;
    case 'product':
      return `/product/${seg(slug)}/`;
    case 'give_forms':
      return `/donations/${seg(slug)}/`;
    default:
      return `/${seg(slug)}/`;
  }
}

/** Proposed Next.js route for a given WP post type + slug. */
export function nextRoutePath({ postType, slug, ancestorSlugs }: PermalinkOpts): string {
  const seg = (s: string) => encodeURIComponent(s).replace(/%2F/gi, '/');
  switch (postType) {
    case 'page':
      return `/${(ancestorSlugs ?? [slug]).map(seg).join('/')}`;
    case 'post':
      return `/blog/${seg(slug)}`;
    case 'sfwd-courses':
      return `/courses/${seg(slug)}`;
    case 'sfwd-lessons':
      return `/lessons/${seg(slug)}`;
    case 'sfwd-quiz':
      return `/quizzes/${seg(slug)}`;
    case 'product':
      return `/shop/${seg(slug)}`;
    case 'give_forms':
      return `/give/${seg(slug)}`;
    default:
      return `/${seg(slug)}`;
  }
}

// --------------------------------------------------------------------------
// Output path helpers + small utilities
// --------------------------------------------------------------------------
const __dirname = path.dirname(fileURLToPath(import.meta.url));
/** repo-root/data/extracted */
export const EXTRACT_DIR = path.resolve(__dirname, '../../../data/extracted');
export const SANITIZED_DIR = path.join(EXTRACT_DIR, '_sanitized');

export const POST_STATUS_CODE: Record<string, number> = {
  publish: 30,
  pending: 17,
  draft: 1,
};

/** Build a meta lookup map: post_id -> { meta_key -> meta_value }. */
export async function fetchMetaForPosts(
  ids: number[],
  table = `${WP_PREFIX}postmeta`,
  idCol = 'post_id',
): Promise<Map<number, Record<string, string>>> {
  const out = new Map<number, Record<string, string>>();
  if (ids.length === 0) return out;
  const CHUNK = 500;
  for (let i = 0; i < ids.length; i += CHUNK) {
    const slice = ids.slice(i, i + CHUNK);
    const placeholders = slice.map(() => '?').join(',');
    const rows = await query<RowDataPacket & {
      pid: number;
      meta_key: string;
      meta_value: string | null;
    }>(
      `SELECT ${idCol} AS pid, meta_key, meta_value FROM ${table}
       WHERE ${idCol} IN (${placeholders})`,
      slice,
    );
    for (const r of rows) {
      let bag = out.get(r.pid);
      if (!bag) {
        bag = {};
        out.set(r.pid, bag);
      }
      // Last write wins (WP allows duplicate keys; rare for these).
      bag[r.meta_key] = r.meta_value ?? '';
    }
  }
  return out;
}

export const m = (
  bag: Record<string, string> | undefined,
  key: string,
): string | undefined => bag?.[key];

export const toInt = (v: unknown): number | null => {
  if (v == null || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : null;
};

export const toNum = (v: unknown): number | null => {
  if (v == null || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};
