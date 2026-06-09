-- ============================================================================
-- Luthas Center — Catalog View
-- ============================================================================
-- catalog_items = UNION of purchasable courses + products with a `kind` enum.
-- "Purchasable" courses are those with a non-open/free price_type or a price;
-- to keep the catalog inclusive of published learning content, all published
-- courses are surfaced (price may be NULL for open/free).
-- ============================================================================

DO $$ BEGIN
  CREATE TYPE public.catalog_kind AS ENUM ('course', 'product');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE OR REPLACE VIEW public.catalog_items
WITH (security_invoker = true) AS
  SELECT
    c.id,
    'course'::public.catalog_kind AS kind,
    c.wp_id,
    c.slug,
    c.title,
    c.short_description AS summary,
    c.price,
    c.featured_image_id AS image_id,
    c.status::text      AS status,
    c.published_at
  FROM public.courses c
  WHERE c.status = 'publish'

  UNION ALL

  SELECT
    p.id,
    'product'::public.catalog_kind AS kind,
    p.wp_id,
    p.slug,
    p.title,
    p.short_description AS summary,
    p.price,
    p.featured_image_id AS image_id,
    p.status            AS status,
    p.published_at
  FROM public.products p
  WHERE p.status = 'publish';

COMMENT ON VIEW public.catalog_items IS 'Unified purchasable catalog: published courses + products, security_invoker so row RLS applies.';
