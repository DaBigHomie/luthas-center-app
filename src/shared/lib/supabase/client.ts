'use client'
// Browser-side Supabase client for Client Components.
// Safe to import from 'use client' modules only.
// Constructed lazily — does not crash at import time if env is missing.

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/shared/types/database'

function getEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    throw new Error(
      '[supabase/client] NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set.',
    )
  }
  return { url, key }
}

/** Returns a browser Supabase client typed against the local Database schema. */
export function createClient() {
  const { url, key } = getEnv()
  return createBrowserClient<Database>(url, key)
}
