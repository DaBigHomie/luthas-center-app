#!/usr/bin/env node
/**
 * Runtime smoke test — the gate that tsc/lint/build miss.
 *
 * tsc/lint/build verify the code compiles and SSG pages prerender, but they
 * never EXECUTE the dynamic (ƒ) routes or exercise client/runtime paths, so
 * request-time 500s (bad data access, server/client boundary, next/image
 * misuse) slip through. This boots a real server and hits every route.
 *
 * Modes:
 *   node scripts/smoke.mjs          → production: `next build` must have run; spawns `next start`
 *   node scripts/smoke.mjs --dev    → dev server (catches dev-only strict errors too, e.g. next/image)
 *
 * Exit non-zero on any route that returns >=400 or whose body shows a
 * server/render error. Routes are discovered from /sitemap.xml plus explicit
 * dynamic-param variants that the sitemap can't cover.
 */
import { spawn } from 'node:child_process'

const DEV = process.argv.includes('--dev')
const PORT = process.env.SMOKE_PORT || '3100'
const BASE = `http://localhost:${PORT}`
const ERROR_MARKERS = [
  'Internal Server Error',
  'Application error: a server-side exception',
  'class="next-error-h1"',
  '__next_error__',
]

function startServer() {
  const cmd = DEV ? ['dev', '-p', PORT] : ['start', '-p', PORT]
  const proc = spawn('npx', ['next', ...cmd], {
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env },
  })
  let log = ''
  proc.stdout.on('data', (d) => (log += d))
  proc.stderr.on('data', (d) => (log += d))
  return { proc, getLog: () => log }
}

async function waitReady(timeoutMs = 90_000) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    try {
      const r = await fetch(BASE, { method: 'HEAD' })
      if (r.status > 0) return true
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 1000))
  }
  return false
}

async function discoverRoutes() {
  const paths = new Set([
    '/',
    '/about',
    '/contact',
    '/courses',
    '/blog',
    '/donate',
    // dynamic list pages WITH params (exercise the per-request code path)
    '/blog?page=2',
    '/courses?category=mental-health',
  ])
  let locs = []
  try {
    const xml = await fetch(`${BASE}/sitemap.xml`).then((r) => r.text())
    locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
      .map((m) => {
        try {
          return new URL(m[1]).pathname || '/'
        } catch {
          return null
        }
      })
      .filter(Boolean)
  } catch {
    console.warn('! could not read sitemap.xml — testing static route list only')
  }

  if (DEV) {
    // Dev compiles per-route on demand, so testing all 500+ is too slow and
    // redundant — one route per template exercises every component. Bucket the
    // sitemap by shape and take the first of each.
    const buckets = new Map()
    for (const p of locs) {
      const key = p
        .replace(/^\/courses\/[^/]+\/lessons\/[^/]+$/, '/courses/:c/lessons/:l')
        .replace(/^\/courses\/[^/]+$/, '/courses/:slug')
        .replace(/^\/blog\/[^/]+$/, '/blog/:slug')
        .replace(/^\/give\/[^/]+$/, '/give/:slug')
      if (!buckets.has(key)) buckets.set(key, p)
    }
    for (const p of buckets.values()) paths.add(p)
  } else {
    for (const p of locs) paths.add(p)
  }
  return [...paths]
}

async function checkRoute(path) {
  try {
    const res = await fetch(`${BASE}${path}`, { redirect: 'manual' })
    const status = res.status
    // 2xx/3xx ok; >=400 is a failure
    if (status >= 400) return { path, status, ok: false, reason: `HTTP ${status}` }
    const body = status < 300 ? await res.text() : ''
    const marker = ERROR_MARKERS.find((m) => body.includes(m))
    if (marker) return { path, status, ok: false, reason: `error marker: "${marker}"` }
    return { path, status, ok: true, body }
  } catch (e) {
    return { path, status: 0, ok: false, reason: `fetch failed: ${e.message}`, body: '' }
  }
}

/**
 * Extract internal hrefs from HTML — returns paths starting with '/'.
 * Skips: external URLs (http/https), mailto:, tel:, fragment-only (#),
 * Next.js internals (/_next), /media, /covers.
 */
function extractInternalLinks(html) {
  const hrefs = []
  // Match href="..." or href='...'
  const re = /href=["']([^"']+)["']/gi
  let m
  while ((m = re.exec(html)) !== null) {
    const raw = m[1].trim()
    if (!raw.startsWith('/')) continue                         // external / relative
    if (raw.startsWith('//')) continue                        // protocol-relative
    if (raw.startsWith('/_next')) continue                    // Next.js assets
    if (raw.startsWith('/media')) continue                    // uploaded media
    if (raw.startsWith('/covers')) continue                   // generated cover SVGs
    if (raw === '#' || raw.startsWith('#')) continue          // fragments
    // Strip query string and fragment for the href we store
    const path = raw.split('?')[0].split('#')[0] || '/'
    hrefs.push(path)
  }
  return hrefs
}

/**
 * After the main route sweep, collect all internal hrefs found in the fetched
 * bodies, dedupe, remove already-checked paths, then verify each returns <400.
 *
 * Returns an array of broken-link objects: { href, status, linkedFrom }.
 */
async function crawlInternalLinks(routeResults) {
  // Build href → Set<sourcePage> map
  const linkMap = new Map()
  for (const r of routeResults) {
    if (!r.ok || !r.body) continue
    const found = extractInternalLinks(r.body)
    for (const href of found) {
      if (!linkMap.has(href)) linkMap.set(href, new Set())
      linkMap.get(href).add(r.path)
    }
  }

  if (linkMap.size === 0) return []

  // Dedupe against already-checked paths
  const checkedPaths = new Set(routeResults.map((r) => r.path))
  const toCheck = [...linkMap.keys()].filter((h) => !checkedPaths.has(h))

  if (toCheck.length === 0) return []

  console.log(`[smoke] crawling ${toCheck.length} unique internal links found in pages...`)

  const broken = []
  const queue = [...toCheck]
  const workers = Array.from({ length: 6 }, async () => {
    while (queue.length) {
      const href = queue.shift()
      try {
        const res = await fetch(`${BASE}${href}`, { redirect: 'manual' })
        if (res.status >= 400) {
          const sources = [...linkMap.get(href)].join(', ')
          broken.push({ href, status: res.status, linkedFrom: sources })
        }
      } catch (e) {
        const sources = [...linkMap.get(href)].join(', ')
        broken.push({ href, status: 0, linkedFrom: sources, reason: e.message })
      }
    }
  })
  await Promise.all(workers)
  return broken
}

async function main() {
  console.log(`[smoke] ${DEV ? 'dev' : 'production'} server on :${PORT}`)
  const { proc, getLog } = startServer()
  const cleanup = () => {
    try {
      proc.kill('SIGTERM')
    } catch {
      /* ignore */
    }
  }
  process.on('exit', cleanup)
  process.on('SIGINT', () => {
    cleanup()
    process.exit(130)
  })

  if (!(await waitReady())) {
    console.error('[smoke] server never became ready. Log tail:')
    console.error(getLog().split('\n').slice(-20).join('\n'))
    cleanup()
    process.exit(1)
  }

  const routes = await discoverRoutes()
  console.log(`[smoke] testing ${routes.length} routes...`)
  const results = []
  // small concurrency to keep dev mode honest
  const queue = [...routes]
  const workers = Array.from({ length: 6 }, async () => {
    while (queue.length) {
      const p = queue.shift()
      results.push(await checkRoute(p))
    }
  })
  await Promise.all(workers)

  const failures = results.filter((r) => !r.ok)
  const okCount = results.length - failures.length
  console.log(`[smoke] ${okCount}/${results.length} OK`)

  // -------------------------------------------------------------------------
  // Link crawl — check every internal href found in the fetched pages
  // -------------------------------------------------------------------------
  const brokenLinks = await crawlInternalLinks(results)
  if (brokenLinks.length) {
    console.error(`\n[smoke] ${brokenLinks.length} BROKEN LINK(S):`)
    for (const b of brokenLinks.sort((a, c) => a.href.localeCompare(c.href))) {
      console.error(`  BROKEN LINK ${b.href} (${b.status}) — linked from ${b.linkedFrom}`)
    }
  } else {
    console.log('[smoke] link crawl: no broken internal links')
  }

  if (failures.length || brokenLinks.length) {
    if (failures.length) {
      console.error(`\n[smoke] ${failures.length} ROUTE FAILURES:`)
      for (const f of failures.sort((a, b) => a.path.localeCompare(b.path))) {
        console.error(`  ✗ ${f.path} — ${f.reason}`)
      }
    }
    const log = getLog()
    const errLines = log
      .split('\n')
      .filter((l) => /error|exception|⨯|cannot read|undefined|is not a function/i.test(l))
      .filter((l) => !/deprecated|favicon/i.test(l))
      .slice(-15)
    if (errLines.length) {
      console.error('\n[smoke] server error lines:')
      console.error(errLines.join('\n'))
    }
    cleanup()
    process.exit(1)
  }
  console.log('[smoke] PASS')
  cleanup()
  process.exit(0)
}

main()
