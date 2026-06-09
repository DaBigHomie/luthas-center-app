-- ============================================================================
-- Luthas Center — Commerce (schema now, unused in v1)
-- ============================================================================
-- WooCommerce products + product_attributes. Catalog of digital/virtual goods.
-- ============================================================================

CREATE TABLE public.products (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wp_id              INTEGER UNIQUE NOT NULL,
  slug               TEXT NOT NULL,
  title              TEXT,
  description        TEXT,
  short_description  TEXT,
  status             TEXT NOT NULL DEFAULT 'publish',
  sku                TEXT,
  regular_price      DECIMAL(10,2),
  sale_price         DECIMAL(10,2),
  price              DECIMAL(10,2),
  virtual            BOOLEAN DEFAULT false,
  downloadable       BOOLEAN DEFAULT false,
  download_limit     INTEGER,
  download_expiry    INTEGER,
  stock_status       TEXT DEFAULT 'instock',
  average_rating     DECIMAL(3,2) DEFAULT 0,
  review_count       INTEGER DEFAULT 0,
  total_sales        INTEGER DEFAULT 0,
  featured_image_id  INTEGER REFERENCES public.media(wp_attachment_id) ON DELETE SET NULL,
  menu_order         INTEGER DEFAULT 0,
  old_path           TEXT,
  new_path           TEXT,
  published_at       TIMESTAMPTZ,
  modified_at        TIMESTAMPTZ,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX products_slug_idx     ON public.products(slug);
CREATE INDEX products_status_idx   ON public.products(status);
CREATE INDEX products_featured_idx ON public.products(featured_image_id);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published products are viewable by everyone"
  ON public.products FOR SELECT USING (status = 'publish');
CREATE POLICY "Admins can view all products"
  ON public.products FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can insert products"
  ON public.products FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update products"
  ON public.products FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete products"
  ON public.products FOR DELETE USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- product_attributes — pa_color / pa_size style WooCommerce attributes.
-- ----------------------------------------------------------------------------
CREATE TABLE public.product_attributes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  INTEGER NOT NULL REFERENCES public.products(wp_id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  value       TEXT,
  position    INTEGER DEFAULT 0,
  is_variation BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX product_attributes_product_idx ON public.product_attributes(product_id);

ALTER TABLE public.product_attributes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Product attributes are viewable by everyone"
  ON public.product_attributes FOR SELECT USING (true);
CREATE POLICY "Admins can insert product attributes"
  ON public.product_attributes FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update product attributes"
  ON public.product_attributes FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete product attributes"
  ON public.product_attributes FOR DELETE USING (public.is_admin());
