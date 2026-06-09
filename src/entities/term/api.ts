import 'server-only'
import { createClient } from '@/shared/lib/supabase/server'
import type { TermRow, TermRelationshipRow, Taxonomy } from './model'

/** List all terms for a given taxonomy, ordered by name. */
export async function listTermsByTaxonomy(taxonomy: Taxonomy): Promise<TermRow[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('terms')
    .select('*')
    .eq('taxonomy', taxonomy)
    .order('name', { ascending: true })

  if (error) throw new Error(`listTermsByTaxonomy: ${error.message}`)
  return data ?? []
}

/** Fetch a term by slug within a taxonomy. */
export async function getTermBySlug(slug: string, taxonomy: Taxonomy): Promise<TermRow | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('terms')
    .select('*')
    .eq('slug', slug)
    .eq('taxonomy', taxonomy)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(`getTermBySlug: ${error.message}`)
  }
  return data
}

/** List all term relationships for a given object. */
export async function listTermsForObject(
  objectType: string,
  objectId: number,
): Promise<TermRelationshipRow[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('term_relationships')
    .select('*')
    .eq('object_type', objectType)
    .eq('object_id', objectId)

  if (error) throw new Error(`listTermsForObject: ${error.message}`)
  return data ?? []
}

/**
 * Fetch the full term rows for a given object, joining through term_relationships.
 * Optionally filter by taxonomy.
 */
export async function getTermsForObject(
  objectType: string,
  objectId: number,
  taxonomy?: Taxonomy,
): Promise<TermRow[]> {
  const supabase = await createClient()

  let query = supabase
    .from('term_relationships')
    .select('wp_term_id')
    .eq('object_type', objectType)
    .eq('object_id', objectId)

  if (taxonomy) {
    query = query.eq('taxonomy', taxonomy)
  }

  const { data: rels, error: relError } = await query
  if (relError) throw new Error(`getTermsForObject(rels): ${relError.message}`)
  if (!rels || rels.length === 0) return []

  const termIds = rels.map((r) => r.wp_term_id)
  const { data: terms, error: termsError } = await supabase
    .from('terms')
    .select('*')
    .in('wp_term_id', termIds)
    .order('name', { ascending: true })

  if (termsError) throw new Error(`getTermsForObject(terms): ${termsError.message}`)
  return terms ?? []
}