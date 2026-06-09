// Server-side Supabase client for Server Components, Server Actions, and
// Route Handlers in the App Router.
// MUST NOT be imported from 'use client' modules.
// Always create a new instance per request — never share across requests.
// Constructed lazily — does not crash at import time if env is missing.

import { createServerClient as _createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/shared/types/database'

function getEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    throw new Error(
      '[supabase/server] NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set.',
    )
  }
  return { url, key }
}

/**
 * Returns a server Supabase client for use in Server Components (read-only
 * cookie access — setAll is intentionally omitted here; session writes are
 * handled by middleware).
 *
 * For Route Handlers or Server Actions that need to write auth cookies, use
 * createActionClient() instead.
 */
export async function createClient() {
  const { url, key } = getEnv()
  const cookieStore = await cookies()

  return _createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      // setAll omitted — Server Components cannot write response cookies.
      // Middleware handles session refresh writes.
    },
  })
}

/**
 * Returns a server Supabase client that can also write auth cookies.
 * Use in Route Handlers and Server Actions where response headers are writable.
 */
export async function createActionClient() {
  const { url, key } = getEnv()
  const cookieStore = await cookies()

  return _createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          )
        } catch {
          // setAll called from a context where response headers cannot be set.
          // Middleware must handle session refresh in that case.
        }
      },
    },
  })
}
