import type { Tables } from '@/shared/types/database'

export type ProductRow = Tables<'products'>
export type ProductAttributeRow = Tables<'product_attributes'>

/** A product with its attributes. */
export type ProductWithAttributes = ProductRow & {
  attributes: ProductAttributeRow[]
}

export type ProductSummary = Pick<
  ProductRow,
  | 'id'
  | 'wp_id'
  | 'slug'
  | 'title'
  | 'short_description'
  | 'price'
  | 'regular_price'
  | 'sale_price'
  | 'featured_image_id'
  | 'status'
  | 'virtual'
  | 'downloadable'
>
