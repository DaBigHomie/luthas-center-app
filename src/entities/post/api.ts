import 'server-only'
import { createPublicClient } from '@/shared/lib/supabase/server'
import type { PostRow, PostSummary, ListPostsParams } from './model'

/** List published posts with optional category or tag filter, paginated. */
export async function listPosts(params: ListPostsParams = {}): Promise<PostSummary[]> {
  const { page = 1, pageSize = 12, categorySlug, tagSlug } = params
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const supabase = await createPublicClient()

  // If filtering by a term slug, resolve its wp_term_id then fetch related post ids
  let wpIds: number[] | null = null
  const termSlug = categorySlug ?? tagSlug ?? null
  const termTaxonomy = categorySlug ? 'category' : tagSlug ? 'post_tag' : null
  if (termSlug && termTaxonomy) {
    const { data: term, error: termError } = await supabase
      .from('terms')
      .select('wp_term_id')
      .eq('slug', termSlug)
      .eq('taxonomy', termTaxonomy)
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
  const supabase = await createPublicClient()
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

/** Count total published posts, optionally scoped to a category or tag slug. */
export async function countPosts(categorySlug?: string, tagSlug?: string): Promise<number> {
  const supabase = await createPublicClient()

  let wpIds: number[] | null = null
  const termSlug = categorySlug ?? tagSlug ?? null
  const termTaxonomy = categorySlug ? 'category' : tagSlug ? 'post_tag' : null
  if (termSlug && termTaxonomy) {
    const { data: term } = await supabase
      .from('terms')
      .select('wp_term_id')
      .eq('slug', termSlug)
      .eq('taxonomy', termTaxonomy)
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