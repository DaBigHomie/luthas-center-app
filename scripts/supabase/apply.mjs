/**
 * Apply migrations + seed to the remote Supabase project, then parity-check.
 *   node scripts/supabase/apply.mjs              # migrations + seed + parity
 *   node scripts/supabase/apply.mjs --migrations # migrations only
 *   node scripts/supabase/apply.mjs --seed       # seed only
 *   node scripts/supabase/apply.mjs --verify     # parity only
 */
import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { makePool, ROOT } from './db.mjs'

const args = process.argv.slice(2)
const only = (f) => args.includes(f)
const doMig = args.length === 0 || only('--migrations')
const doSeed = args.length === 0 || only('--seed')
const doVerify = args.length === 0 || only('--verify')

const EXPECT = {
  profiles: 8, media: 5669, terms: 360, courses: 47, lessons: 57, quizzes: 5,
  posts: 668, pages: 14, products: 15, donation_forms: 3, donation_stats: 3,
}

async function runFile(pool, file, label) {
  const sql = readFileSync(file, 'utf-8')
  const t0 = Date.now()
  try {
    await pool.query(sql)
    console.log(`  ✓ ${label} (${(Date.now() - t0) / 1000}s)`)
    return true
  } catch (e) {
    console.error(`  ✗ ${label} — ${e.message}`)
    return false
  }
}

const pool = makePool()
try {
  await pool.query('select 1')
  console.log('connected to remote Supabase (direct).')

  if (doMig) {
    console.log('\n[migrations]')
    const dir = path.join(ROOT, 'supabase', 'migrations')
    const files = readdirSync(dir).filter((f) => f.endsWith('.sql')).sort()
    let ok = 0
    for (const f of files) {
      if (await runFile(pool, path.join(dir, f), f)) ok++
    }
    console.log(`  ${ok}/${files.length} migrations applied`)
    if (ok !== files.length) {
      console.error('  ! migration failures — stopping before seed.')
      process.exit(1)
    }
  }

  if (doSeed) {
    console.log('\n[seed]')
    await runFile(pool, path.join(ROOT, 'supabase', 'seed.sql'), 'seed.sql')
  }

  if (doVerify) {
    console.log('\n[parity]')
    let allOk = true
    for (const [table, expect] of Object.entries(EXPECT)) {
      try {
        const r = await pool.query(`select count(*)::int n from public.${table}`)
        const n = r.rows[0].n
        const mark = n === expect ? '✓' : n >= expect ? '~' : '✗'
        if (n < expect) allOk = false
        console.log(`  ${mark} ${table}: ${n} (expected ${expect})`)
      } catch (e) {
        allOk = false
        console.error(`  ✗ ${table}: ${e.message}`)
      }
    }
    console.log(allOk ? '\nPARITY OK' : '\nPARITY MISMATCH')
    if (!allOk) process.exitCode = 1
  }
} catch (e) {
  console.error('FATAL:', e.message)
  process.exitCode = 1
} finally {
  await pool.end()
}
