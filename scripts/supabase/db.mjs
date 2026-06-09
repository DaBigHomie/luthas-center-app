/**
 * Supabase connection helper for migration/seed scripts.
 *
 * Connects through the SESSION POOLER (IPv4-reachable; the direct
 * db.<ref>.supabase.co host is IPv6-only). Uses discrete params so the DB
 * password's special chars need no URL-encoding.
 *
 * Reads credentials from .env.local (parsed manually so a '#' inside the
 * password isn't treated as a comment).
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import pg from 'pg'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')

export function loadEnv() {
  const raw = readFileSync(path.join(ROOT, '.env.local'), 'utf-8')
  const env = {}
  for (const line of raw.split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const i = t.indexOf('=')
    if (i === -1) continue
    const key = t.slice(0, i).trim()
    let val = t.slice(i + 1) // everything after first '=' — do NOT strip inline '#'
    val = val.replace(/\r$/, '')
    env[key] = val
  }
  return env
}

export function makePool() {
  const env = loadEnv()
  const ref = env.SUPABASE_PROJECT_REF || env.SUPABASE_PROJECT_ID
  const password = env.SUPABASE_DB_PASSWORD
  if (!ref || !password) {
    throw new Error('Missing SUPABASE_PROJECT_REF / SUPABASE_DB_PASSWORD in .env.local')
  }
  // Direct host (IPv6) — region-independent, full session privileges for DDL+seed.
  return new pg.Pool({
    host: `db.${ref}.supabase.co`,
    port: 5432,
    user: 'postgres',
    password,
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
    max: 1,
    statement_timeout: 600_000,
    connectionTimeoutMillis: 15_000,
  })
}

export { ROOT }
