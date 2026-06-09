-- ============================================================================
-- Luthas Center — Storage Buckets
-- ============================================================================
-- Creates the public-read `media` bucket for later image upload. Writes are
-- restricted to admins via public.is_admin() (defined in 20260608000001).
-- ============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('media', 'media', true, 26214400,
    ARRAY['image/webp','image/jpeg','image/png','image/svg+xml','image/gif','image/avif'])
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public read for media bucket"   ON storage.objects;
DROP POLICY IF EXISTS "Admin insert to media bucket"   ON storage.objects;
DROP POLICY IF EXISTS "Admin update in media bucket"   ON storage.objects;
DROP POLICY IF EXISTS "Admin remove from media bucket" ON storage.objects;

CREATE POLICY "Public read for media bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media');

CREATE POLICY "Admin insert to media bucket"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'media' AND public.is_admin());

CREATE POLICY "Admin update in media bucket"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'media' AND public.is_admin())
  WITH CHECK (bucket_id = 'media' AND public.is_admin());

CREATE POLICY "Admin remove from media bucket"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'media' AND public.is_admin());
