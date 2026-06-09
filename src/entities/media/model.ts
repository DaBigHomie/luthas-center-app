import type { Tables, Json } from '@/shared/types/database'

export type MediaRow = Tables<'media'>

/** Typed representation of the `sizes` JSONB column (WP image sizes map). */
export interface MediaSizes {
  [sizeName: string]: {
    file?: string
    width?: number
    height?: number
    mime_type?: string
    source_url?: string
  }
}

/**
 * Parse the sizes JSONB column into a typed map.
 * Returns an empty object if the column is null or malformed.
 */
export function parseMediaSizes(raw: Json | null): MediaSizes {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return {}
  return raw as unknown as MediaSizes
}

/**
 * Return the best available URL for a media row:
 * - public_url (Supabase Storage, set after upload)
 * - source_url (original WP guid, used until files are migrated)
 */
export function resolveMediaUrl(media: MediaRow): string | null {
  return media.public_url ?? media.source_url ?? null
}
