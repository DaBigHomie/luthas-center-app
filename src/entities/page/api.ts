import 'server-only'
import { createClient } from '@/shared/lib/supabase/server'
import type { PageRow, PageSummary } from './model'

/** List all published pages, ordered by menu_order. */
export async function listPublishedPages(): Promise<PageSummary[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('pages')
    .select('id, wp_id, slug, title, excerpt, parent_id, menu_order, page_template, status')
    .eq('status', 'publish')
    .order('menu_order', { ascending: true })

  if (error) throw new Error(`listPublishedPages: ${error.message}`)
  return (data ?? []) as PageSummary[]
}

/** Fetch a single published page by slug. */
export async function getPageBySlug(slug: string): Promise<PageRow | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'publish')
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(`getPageBySlug: ${error.message}`)
  }
  return data
}

/** Fetch all published child pages for a given parent (by wp_id). */
export async function listChildPages(parentWpId: number): Promise<PageSummary[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('pages')
    .select('id, wp_id, slug, title, excerpt, parent_id, menu_order, page_template, status')
    .eq('parent_id', parentWpId)
    .eq('status', 'publish')
    .order('menu_order', { ascending: true })

  if (error) throw new Error(`listChildPages: ${error.message}`)
  return (data ?? []) as PageSummary[]
}