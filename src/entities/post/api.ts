import 'server-only'
import { createClient } from '@/shared/lib/supabase/server'
import type { PostRow, PostSummary, ListPostsParams } from './model'

/** List published posts with optional category filter, paginated. */
export async function listPosts(params: ListPostsParams = {}): Promise<PostSummary[]> {
  const { page = 1, pageSize = 12, categorySlug } = params
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const supabase = await createClient()

  // If filtering by category, first resolve the term's wp_term_id
  let wpIds: number[] | null = null
  if (categorySlug) {
    const { data: term, error: termError } = await supabase
      .from('terms')
      .select('wp_term_id')
      .eq('slug', categorySlug)
      .in('taxonomy', ['category', 'post_tag'])
      .single()

    if (termError) {
      if (termError.code === 'PGRST116') return []
      throw new Error(`listPosts(term): ${termError.message}`)
    }

    const { data: rels, error: relError } = await supabase
      .from('term_relationships')
      .select('object_id')
      .eq('object_type', 'post')
      .eq('wp_term_id', term.wp_term_id)

    if (relError) throw new Error(`listPosts(rels): ${relError.message}`)
    if (!rels || rels.length === 0) return []
    wpIds = rels.map((r) => r.object_id)
  }

  let query = supabase
    .from('posts')
    .select(
      'id, wp_id, slug, title, excerpt, author_id, featured_image_id, reading_time, published_at, status',
    )
    .eq('status', 'publish')
    .order('published_at', { ascending: false })
    .range(from, to)

  if (wpIds !== null) {
    query = query.in('wp_id', wpIds)
  }

  const { data, error } = await query
  if (error) throw new Error(`listPosts: ${error.message}`)
  return (data ?? []) as PostSummary[]
}

/** Fetch a single published post by slug (full content). */
export async function getPostBySlug(slug: string): Promise<PostRow | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'publish')
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(`getPostBySlug: ${error.message}`)
  }
  return data
}

/** Count total published posts, optionally scoped to a category slug. */
export async function countPosts(categorySlug?: string): Promise<number> {
  const supabase = await createClient()

  let wpIds: number[] | null = null
  if (categorySlug) {
    const { data: term } = await supabase
      .from('terms')
      .select('wp_term_id')
      .eq('slug', categorySlug)
      .in('taxonomy', ['category', 'post_tag'])
      .single()

    if (!term) return 0

    const { data: rels } = await supabase
      .from('term_relationships')
      .select('object_id')
      .eq('object_type', 'post')
      .eq('wp_term_id', term.wp_term_id)

    if (!rels || rels.length === 0) return 0
    wpIds = rels.map((r) => r.object_id)
  }

  let query = supabase
    .from('posts')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'publish')

  if (wpIds !== null) {
    query = query.in('wp_id', wpIds)
  }

  const { count, error } = await query
  if (error) throw new Error(`countPosts: ${error.message}`)
  return count ?? 0
}