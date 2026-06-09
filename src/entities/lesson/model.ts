import type { Tables } from '@/shared/types/database'

export type LessonRow = Tables<'lessons'>

export type LessonSummary = Pick<
  LessonRow,
  | 'id'
  | 'wp_id'
  | 'slug'
  | 'title'
  | 'course_id'
  | 'sort_order'
  | 'status'
  | 'video_url'
  | 'featured_image_id'
>
