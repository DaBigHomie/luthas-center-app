import 'server-only'
import { createClient } from '@/shared/lib/supabase/server'
import type { ProfileRow, ProfilePublic, EnrollmentRow } from './model'

/** Fetch a public profile by username. */
export async function getProfileByUsername(username: string): Promise<ProfilePublic | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, display_name, avatar_media_id, bio, role')
    .eq('username', username)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(`getProfileByUsername: ${error.message}`)
  }
  return data as ProfilePublic
}

/** Fetch a profile by WP user id (for migration/admin use). */
export async function getProfileByWpUserId(wpUserId: number): Promise<ProfileRow | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('wp_user_id', wpUserId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(`getProfileByWpUserId: ${error.message}`)
  }
  return data
}

/**
 * Fetch the currently authenticated user's full profile.
 * Returns null if not authenticated or no profile exists.
 */
export async function getCurrentProfile(): Promise<ProfileRow | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('auth_user_id', user.id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(`getCurrentProfile: ${error.message}`)
  }
  return data
}

/** Fetch enrollments for the current authenticated user. */
export async function getCurrentUserEnrollments(): Promise<EnrollmentRow[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('auth_user_id', user.id)
    .single()

  if (!profile) return []

  const { data, error } = await supabase
    .from('enrollments')
    .select('*')
    .eq('user_id', profile.id)
    .order('enrolled_at', { ascending: false })

  if (error) throw new Error(`getCurrentUserEnrollments: ${error.message}`)
  return data ?? []
}