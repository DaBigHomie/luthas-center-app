-- ============================================================================
-- Luthas Center — Content / Posts
-- ============================================================================

DO $$ BEGIN
  CREATE TYPE public.post_status AS ENUM ('publish', 'draft');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE public.posts (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wp_id              INTEGER UNIQUE NOT NULL,
  slug               TEXT NOT NULL,
  title              TEXT,
  content            TEXT,
  excerpt            TEXT,
  status             public.post_status NOT NULL DEFAULT 'draft',
  author_id          INTEGER REFERENCES public.profiles(wp_user_id) ON DELETE SET NULL,
  featured_image_id  INTEGER REFERENCES public.media(wp_attachment_id) ON DELETE SET NULL,
  reading_time       INTEGER,
  old_path           TEXT,
  new_path           TEXT,
  published_at       TIMESTAMPTZ,
  modified_at        TIMESTAMPTZ,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX posts_slug_idx        ON public.posts(slug);
CREATE INDEX posts_status_idx      ON public.posts(status);
CREATE INDEX posts_author_idx      ON public.posts(author_id);
CREATE INDEX posts_featured_idx    ON public.posts(featured_image_id);
CREATE INDEX posts_published_idx   ON public.posts(published_at DESC);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published posts are viewable by everyone"
  ON public.posts FOR SELECT USING (status = 'publish');
CREATE POLICY "Admins can view all posts"
  ON public.posts FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can insert posts"
  ON public.posts FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update posts"
  ON public.posts FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete posts"
  ON public.posts FOR DELETE USING (public.is_admin());
