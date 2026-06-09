/**
 * Next.js Edge Middleware — redirect handler
 *
 * Performs 301 redirects for all WP legacy paths using the pre-generated
 * REDIRECT_MAP from src/shared/config/redirects.generated.ts.
 *
 * Strategy: strip trailing slash, look up in the map, redirect if found.
 * Paths not in the map pass through untouched.
 *
 * The map is generated at build time (or manually) by:
 *   npx tsx scripts/build-redirects.ts
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { REDIRECT_MAP } from '@/shared/config/redirects.generated'

export function middleware(request: NextRequest): NextResponse | undefined {
  // DORMANT by default (Option B). luthascenter.com/.org are unregistered, so
  // there is no external inbound traffic / SEO equity to preserve and the
  // legacy-path 301s are turned OFF. Flip them on in one step by setting
  // ENABLE_WP_REDIRECTS=1 once a legacy domain is bought + pointed here.
  if (process.env.ENABLE_WP_REDIRECTS !== '1') return undefined

  const { pathname, search } = request.nextUrl

  // Normalise: strip trailing slash (except root "/")
  const normalised = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname

  const newPath = REDIRECT_MAP[normalised]
  if (newPath) {
    // Preserve any query-string from the original URL
    const destination = newPath + (search ?? '')
    return NextResponse.redirect(new URL(destination, request.url), {
      status: 301,
    })
  }

  return undefined
}

export const config = {
  /**
   * Run on every path except Next.js internals and static files.
   * Regex: skip /_next/*, /favicon.ico, /placeholder-*, /media/*
   */
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|placeholder[^/]*|media/).*)',
  ],
}
