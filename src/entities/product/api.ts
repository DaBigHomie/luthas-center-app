import 'server-only'
import { createPublicClient } from '@/shared/lib/supabase/server'
import type { ProductRow, ProductAttributeRow, ProductWithAttributes, ProductSummary } from './model'

/** List all published products, ordered by menu_order. */
export async function listPublishedProducts(): Promise<ProductSummary[]> {
  const supabase = await createPublicClient()
  const { data, error } = await supabase
    .from('products')
    .select(
      'id, wp_id, slug, title, short_description, price, regular_price, sale_price, featured_image_id, status, virtual, downloadable',
    )
    .eq('status', 'publish')
    .order('menu_order', { ascending: true })

  if (error) throw new Error(`listPublishedProducts: ${error.message}`)
  return (data ?? []) as ProductSummary[]
}

/** Fetch a published product by slug. */
export async function getProductBySlug(slug: string): Promise<ProductRow | null> {
  const supabase = await createPublicClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'publish')
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(`getProductBySlug: ${error.message}`)
  }
  return data
}

/** Fetch a product by slug with all its attributes. */
export async function getProductWithAttributes(
  slug: string,
): Promise<ProductWithAttributes | null> {
  const product = await getProductBySlug(slug)
  if (!product) return null

  const supabase = await createPublicClient()
  const { data: attrs, error } = await supabase
    .from('product_attributes')
    .select('*')
    .eq('product_id', product.wp_id)
    .order('position', { ascending: true })

  if (error) throw new Error(`getProductWithAttributes(attrs): ${error.message}`)
  return { ...product, attributes: (attrs ?? []) as ProductAttributeRow[] }
}

/** List product attributes for a given product (by wp_id). */
export async function listProductAttributes(productWpId: number): Promise<ProductAttributeRow[]> {
  const supabase = await createPublicClient()
  const { data, error } = await supabase
    .from('product_attributes')
    .select('*')
    .eq('product_id', productWpId)
    .order('position', { ascending: true })

  if (error) throw new Error(`listProductAttributes: ${error.message}`)
  return data ?? []
}