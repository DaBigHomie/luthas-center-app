import 'server-only'
import { createPublicClient } from '@/shared/lib/supabase/server'
import type { QuizRow } from './model'

/** Fetch all published quizzes for a given course (by wp_id). */
export async function listQuizzesByCourse(courseWpId: number): Promise<QuizRow[]> {
  const supabase = await createPublicClient()
  const { data, error } = await supabase
    .from('quizzes')
    .select('*')
    .eq('course_id', courseWpId)
    .eq('status', 'publish')
    .order('created_at', { ascending: true })

  if (error) throw new Error(`listQuizzesByCourse: ${error.message}`)
  return data ?? []
}

/** Fetch a single published quiz by slug. */
export async function getQuizBySlug(slug: string): Promise<QuizRow | null> {
  const supabase = await createPublicClient()
  const { data, error } = await supabase
    .from('quizzes')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'publish')
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // not found
    throw new Error(`getQuizBySlug: ${error.message}`)
  }
  return data
}