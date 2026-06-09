-- ============================================================================
-- Luthas Center — Auth / Profiles
-- ============================================================================
-- profiles extends auth.users with WP user mapping + roles.
-- is_admin() / is_owner() SECURITY DEFINER helpers drive admin write RLS.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Role enum: student | author | admin | owner
DO $$ BEGIN
  CREATE TYPE public.profile_role AS ENUM ('student', 'author', 'admin', 'owner');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE public.profiles (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wp_user_id    INTEGER UNIQUE,
  username      TEXT UNIQUE,
  display_name  TEXT,
  email         TEXT,
  role          public.profile_role NOT NULL DEFAULT 'student',
  avatar_media_id INTEGER, -- FK added after media table exists (migration 2)
  bio           TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Link profile.id to auth.users when a real auth user exists. Seeded WP
-- profiles have no auth.users row yet, so the FK is deferred/optional: we
-- model the relationship via a nullable auth_user_id rather than PK = users.id
-- so seeding does not require pre-creating auth rows.
ALTER TABLE public.profiles
  ADD COLUMN auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX profiles_wp_user_id_idx ON public.profiles(wp_user_id);
CREATE INDEX profiles_role_idx       ON public.profiles(role);
CREATE INDEX profiles_username_idx   ON public.profiles(username);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Public read of profiles (author bylines are public).
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

-- ----------------------------------------------------------------------------
-- Role-checking helpers (SECURITY DEFINER — safe for use inside RLS)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE auth_user_id = auth.uid()
      AND role IN ('admin', 'owner')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_owner()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE auth_user_id = auth.uid()
      AND role = 'owner'
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.is_owner() TO authenticated, anon;

-- Admins manage profiles; users update their own.
CREATE POLICY "Admins can insert profiles"
  ON public.profiles FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update profiles"
  ON public.profiles FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete profiles"
  ON public.profiles FOR DELETE USING (public.is_admin());
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = auth_user_id);

COMMENT ON TABLE  public.profiles            IS 'User profiles; maps WP users (wp_user_id) to optional auth.users (auth_user_id).';
COMMENT ON COLUMN public.profiles.role       IS 'student | author | admin | owner';
COMMENT ON FUNCTION public.is_admin          IS 'True when current auth user is admin or owner.';
COMMENT ON FUNCTION public.is_owner          IS 'True when current auth user is owner.';
