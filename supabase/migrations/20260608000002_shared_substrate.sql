-- ============================================================================
-- Luthas Center — Shared Substrate
-- ============================================================================
-- media library, taxonomy (terms + polymorphic term_relationships),
-- seo_meta (polymorphic), and pages. These tables are referenced by every
-- content domain — never duplicate taxonomy or media downstream.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- media — WP attachment manifest. storage_path / public_url stay NULL until
-- the actual files are uploaded to the storage bucket later. source_url is
-- the original WP guid so content can render against the live origin meanwhile.
-- ----------------------------------------------------------------------------
CREATE TABLE public.media (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wp_attachment_id  INTEGER UNIQUE NOT NULL,
  storage_path      TEXT,
  public_url        TEXT,
  source_url        TEXT,          -- WP guid
  attached_file     TEXT,          -- relative wp-content/uploads path
  mime_type         TEXT,
  width             INTEGER,
  height            INTEGER,
  alt_text          TEXT,
  title             TEXT,
  post_parent       INTEGER,
  sizes             JSONB,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX media_wp_attachment_id_idx ON public.media(wp_attachment_id);
CREATE INDEX media_mime_type_idx        ON public.media(mime_type);

ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Media is viewable by everyone"
  ON public.media FOR SELECT USING (true);
CREATE POLICY "Admins can insert media"
  ON public.media FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update media"
  ON public.media FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete media"
  ON public.media FOR DELETE USING (public.is_admin());

-- Now that media exists, wire the profiles.avatar_media_id FK.
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_avatar_media_fk
  FOREIGN KEY (avatar_media_id) REFERENCES public.media(wp_attachment_id) ON DELETE SET NULL;

-- ----------------------------------------------------------------------------
-- terms — WP taxonomy terms (category, post_tag, ld_course_category, etc.)
-- ----------------------------------------------------------------------------
CREATE TABLE public.terms (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wp_term_id INTEGER UNIQUE NOT NULL,
  name       TEXT NOT NULL,
  slug       TEXT NOT NULL,
  taxonomy   TEXT NOT NULL,
  parent_id  INTEGER,            -- references terms.wp_term_id (0 = none)
  count      INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX terms_taxonomy_idx ON public.terms(taxonomy);
CREATE INDEX terms_slug_idx     ON public.terms(slug);
CREATE INDEX terms_parent_idx   ON public.terms(parent_id);

ALTER TABLE public.terms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Terms are viewable by everyone"
  ON public.terms FOR SELECT USING (true);
CREATE POLICY "Admins can insert terms"
  ON public.terms FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update terms"
  ON public.terms FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete terms"
  ON public.terms FOR DELETE USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- term_relationships — polymorphic link from any object to a term.
-- object_type: course | lesson | post | product | page | media | profile ...
-- object_id is the WP id of the object (wp_id / wp_attachment_id).
-- ----------------------------------------------------------------------------
CREATE TABLE public.term_relationships (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  object_type TEXT NOT NULL,
  object_id   INTEGER NOT NULL,
  wp_term_id  INTEGER NOT NULL REFERENCES public.terms(wp_term_id) ON DELETE CASCADE,
  taxonomy    TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (object_type, object_id, wp_term_id)
);

CREATE INDEX term_relationships_object_idx ON public.term_relationships(object_type, object_id);
CREATE INDEX term_relationships_term_idx   ON public.term_relationships(wp_term_id);

ALTER TABLE public.term_relationships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Term relationships are viewable by everyone"
  ON public.term_relationships FOR SELECT USING (true);
CREATE POLICY "Admins can insert term relationships"
  ON public.term_relationships FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update term relationships"
  ON public.term_relationships FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete term relationships"
  ON public.term_relationships FOR DELETE USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- seo_meta — polymorphic SEO per object.
-- ----------------------------------------------------------------------------
CREATE TABLE public.seo_meta (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  object_type      TEXT NOT NULL,
  object_id        INTEGER NOT NULL,
  meta_title       TEXT,
  meta_description TEXT,
  og_image_media_id INTEGER REFERENCES public.media(wp_attachment_id) ON DELETE SET NULL,
  focus_keyword    TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (object_type, object_id)
);

CREATE INDEX seo_meta_object_idx ON public.seo_meta(object_type, object_id);

ALTER TABLE public.seo_meta ENABLE ROW LEVEL SECURITY;
CREATE POLICY "SEO meta is viewable by everyone"
  ON public.seo_meta FOR SELECT USING (true);
CREATE POLICY "Admins can insert seo meta"
  ON public.seo_meta FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update seo meta"
  ON public.seo_meta FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete seo meta"
  ON public.seo_meta FOR DELETE USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- pages
-- ----------------------------------------------------------------------------
CREATE TABLE public.pages (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wp_id             INTEGER UNIQUE NOT NULL,
  slug              TEXT NOT NULL,
  title             TEXT,
  content           TEXT,
  excerpt           TEXT,
  status            TEXT NOT NULL DEFAULT 'publish',
  parent_id         INTEGER,
  menu_order        INTEGER DEFAULT 0,
  page_template     TEXT,
  author_id         INTEGER REFERENCES public.profiles(wp_user_id) ON DELETE SET NULL,
  featured_image_id INTEGER REFERENCES public.media(wp_attachment_id) ON DELETE SET NULL,
  published_at      TIMESTAMPTZ,
  modified_at       TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX pages_slug_idx   ON public.pages(slug);
CREATE INDEX pages_status_idx ON public.pages(status);

ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published pages are viewable by everyone"
  ON public.pages FOR SELECT USING (status = 'publish');
CREATE POLICY "Admins can view all pages"
  ON public.pages FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can insert pages"
  ON public.pages FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update pages"
  ON public.pages FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete pages"
  ON public.pages FOR DELETE USING (public.is_admin());

COMMENT ON TABLE public.media              IS 'WP attachment manifest; storage_path/public_url NULL until files uploaded.';
COMMENT ON TABLE public.terms              IS 'WP taxonomy terms; shared across all content domains.';
COMMENT ON TABLE public.term_relationships IS 'Polymorphic object<->term links keyed by WP ids.';
COMMENT ON TABLE public.seo_meta           IS 'Polymorphic SEO metadata per object.';
