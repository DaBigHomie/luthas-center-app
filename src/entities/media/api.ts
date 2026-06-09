import 'server-only'
import { createPublicClient } from '@/shared/lib/supabase/server'
import type { MediaRow } from './model'

/** Fetch a media record by its WP attachment id. */
export async function getMediaByWpId(wpAttachmentId: number): Promise<MediaRow | null> {
  const supabase = await createPublicClient()
  const { data, error } = await supabase
    .from('media')
    .select('*')
    .eq('wp_attachment_id', wpAttachmentId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(`getMediaByWpId: ${error.message}`)
  }
  return data
}

/** Fetch multiple media records by their WP attachment ids. */
export async function getMediaByWpIds(wpAttachmentIds: number[]): Promise<MediaRow[]> {
  if (wpAttachmentIds.length === 0) return []
  const supabase = await createPublicClient()
  const { data, error } = await supabase
    .from('media')
    .select('*')
    .in('wp_attachment_id', wpAttachmentIds)

  if (error) throw new Error(`getMediaByWpIds: ${error.message}`)
  return data ?? []
}

/** List all media records for a given MIME type prefix (e.g. 'image/'). */
export async function listMediaByMimePrefix(mimePrefix: string): Promise<MediaRow[]> {
  const supabase = await createPublicClient()
  const { data, error } = await supabase
    .from('media')
    .select('*')
    .like('mime_type', `${mimePrefix}%`)
    .order('created_at', { ascending: false })

  if (error) throw new Error(`listMediaByMimePrefix: ${error.message}`)
  return data ?? []
}