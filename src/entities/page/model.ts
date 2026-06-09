import type { Tables } from '@/shared/types/database'

export type PageRow = Tables<'pages'>

export type PageSummary = Pick<
  PageRow,
  | 'id'
  | 'wp_id'
  | 'slug'
  | 'title'
  | 'excerpt'
  | 'parent_id'
  | 'menu_order'
  | 'page_template'
  | 'status'
>
