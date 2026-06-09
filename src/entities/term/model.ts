import type { Tables } from '@/shared/types/database'

export type TermRow = Tables<'terms'>
export type TermRelationshipRow = Tables<'term_relationships'>

/** Valid WP taxonomy values used in this project. */
export type Taxonomy =
  | 'category'
  | 'post_tag'
  | 'ld_course_category'
  | 'ld_course_tag'
  | 'product_cat'
  | 'product_tag'
  | (string & Record<never, never>) // allow arbitrary strings for future taxonomies
