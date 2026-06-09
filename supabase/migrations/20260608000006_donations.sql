-- ============================================================================
-- Luthas Center — Donations (aggregate only, NO PII)
-- ============================================================================
-- donation_forms (GiveWP forms) + donation_stats (aggregate earnings/sales).
-- No donor records are migrated.
-- ============================================================================

CREATE TABLE public.donation_forms (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wp_id        INTEGER UNIQUE NOT NULL,
  slug         TEXT,
  title        TEXT,
  content      TEXT,
  status       TEXT NOT NULL DEFAULT 'publish',
  goal_enabled BOOLEAN DEFAULT false,
  goal_amount  DECIMAL(12,2),
  goal_format  TEXT,
  price_option TEXT,
  set_price    DECIMAL(12,2),
  custom_amount BOOLEAN DEFAULT false,
  price_levels JSONB,          -- donation_levels array
  image_id     INTEGER REFERENCES public.media(wp_attachment_id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ,
  modified_at  TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX donation_forms_status_idx ON public.donation_forms(status);

ALTER TABLE public.donation_forms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published donation forms are viewable by everyone"
  ON public.donation_forms FOR SELECT USING (status = 'publish');
CREATE POLICY "Admins can view all donation forms"
  ON public.donation_forms FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can insert donation forms"
  ON public.donation_forms FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update donation forms"
  ON public.donation_forms FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete donation forms"
  ON public.donation_forms FOR DELETE USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- donation_stats — aggregate totals per form (no donor PII).
-- ----------------------------------------------------------------------------
CREATE TABLE public.donation_stats (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id        INTEGER UNIQUE NOT NULL REFERENCES public.donation_forms(wp_id) ON DELETE CASCADE,
  total_earnings DECIMAL(12,2) NOT NULL DEFAULT 0,
  total_sales    INTEGER NOT NULL DEFAULT 0,
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.donation_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Donation stats are viewable by everyone"
  ON public.donation_stats FOR SELECT USING (true);
CREATE POLICY "Admins can insert donation stats"
  ON public.donation_stats FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update donation stats"
  ON public.donation_stats FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete donation stats"
  ON public.donation_stats FOR DELETE USING (public.is_admin());
