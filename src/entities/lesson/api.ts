import 'server-only'
import { createClient } from '@/shared/lib/supabase/server'
import type { LessonRow } from './model'

/** Fetch all published lessons for a given course (by wp_id), ordered by sort_order. */
export async function listLessonsByCourse(courseWpId: number): Promise<LessonRow[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', courseWpId)
    .eq('status', 'publish')
    .order('sort_order', { ascending: true })

  if (error) throw new Error(`listLessonsByCourse: ${error.message}`)
  return data ?? []
}

/** Fetch a single published lesson by slug. */
export async function getLessonBySlug(slug: string): Promise<LessonRow | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'publish')
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(`getLessonBySlug: ${error.message}`)
  }
  return data
}

/** Fetch a lesson by wp_id (any status — admin use). */
export async function getLessonByWpId(wpId: number): Promise<LessonRow | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('wp_id', wpId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(`getLessonByWpId: ${error.message}`)
  }
  return data
}