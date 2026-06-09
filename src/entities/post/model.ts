import type { Tables } from '@/shared/types/database'

export type PostRow = Tables<'posts'>

export type PostSummary = Pick<
  PostRow,
  | 'id'
  | 'wp_id'
  | 'slug'
  | 'title'
  | 'excerpt'
  | 'author_id'
  | 'featured_image_id'
  | 'reading_time'
  | 'published_at'
  | 'status'
>

export interface ListPostsParams {
  /** 1-based page number (default: 1). */
  page?: number
  /** Number of posts per page (default: 12). */
  pageSize?: number
  /** Filter by term slug (category). */
  categorySlug?: string
}
