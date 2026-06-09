-- ============================================================================
-- Luthas Center — LMS
-- ============================================================================
-- courses, lessons, quizzes, course_steps (ordered curriculum), enrollments.
-- FKs point at the shared media table via wp_attachment_id.
-- ============================================================================

DO $$ BEGIN
  CREATE TYPE public.course_status AS ENUM ('publish', 'pending');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.lms_content_status AS ENUM ('publish', 'pending', 'draft', 'private');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.course_step_type AS ENUM ('lesson', 'quiz', 'topic');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ----------------------------------------------------------------------------
-- courses
-- ----------------------------------------------------------------------------
CREATE TABLE public.courses (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wp_id              INTEGER UNIQUE NOT NULL,
  status             public.course_status NOT NULL DEFAULT 'pending',
  slug               TEXT NOT NULL,
  title              TEXT,
  content            TEXT,
  excerpt            TEXT,
  short_description  TEXT,
  price_type         TEXT,          -- open | free | paid | closed
  price              DECIMAL(10,2),
  access_mode        TEXT,
  certificate_id     INTEGER,
  intro_video        TEXT,
  materials_enabled  BOOLEAN DEFAULT false,
  menu_order         INTEGER DEFAULT 0,
  steps_source       TEXT,
  step_counts        JSONB,
  featured_image_id  INTEGER REFERENCES public.media(wp_attachment_id) ON DELETE SET NULL,
  cover_image_id     INTEGER REFERENCES public.media(wp_attachment_id) ON DELETE SET NULL,
  old_path           TEXT,
  new_path           TEXT,
  published_at       TIMESTAMPTZ,
  modified_at        TIMESTAMPTZ,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX courses_slug_idx          ON public.courses(slug);
CREATE INDEX courses_status_idx        ON public.courses(status);
CREATE INDEX courses_featured_img_idx  ON public.courses(featured_image_id);
CREATE INDEX courses_cover_img_idx     ON public.courses(cover_image_id);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published courses are viewable by everyone"
  ON public.courses FOR SELECT USING (status = 'publish');
CREATE POLICY "Admins can view all courses"
  ON public.courses FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can insert courses"
  ON public.courses FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update courses"
  ON public.courses FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete courses"
  ON public.courses FOR DELETE USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- lessons
-- ----------------------------------------------------------------------------
CREATE TABLE public.lessons (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wp_id              INTEGER UNIQUE NOT NULL,
  course_id          INTEGER REFERENCES public.courses(wp_id) ON DELETE SET NULL,
  slug               TEXT NOT NULL,
  title              TEXT,
  content            TEXT,
  excerpt            TEXT,
  sort_order         INTEGER DEFAULT 0,
  status             public.lms_content_status NOT NULL DEFAULT 'publish',
  video_url          TEXT,
  featured_image_id  INTEGER REFERENCES public.media(wp_attachment_id) ON DELETE SET NULL,
  old_path           TEXT,
  new_path           TEXT,
  published_at       TIMESTAMPTZ,
  modified_at        TIMESTAMPTZ,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX lessons_slug_idx      ON public.lessons(slug);
CREATE INDEX lessons_status_idx    ON public.lessons(status);
CREATE INDEX lessons_course_id_idx ON public.lessons(course_id);

ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published lessons are viewable by everyone"
  ON public.lessons FOR SELECT USING (status = 'publish');
CREATE POLICY "Admins can view all lessons"
  ON public.lessons FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can insert lessons"
  ON public.lessons FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update lessons"
  ON public.lessons FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete lessons"
  ON public.lessons FOR DELETE USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- quizzes
-- ----------------------------------------------------------------------------
CREATE TABLE public.quizzes (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wp_id              INTEGER UNIQUE NOT NULL,
  course_id          INTEGER REFERENCES public.courses(wp_id) ON DELETE SET NULL,
  lesson_id          INTEGER REFERENCES public.lessons(wp_id) ON DELETE SET NULL,
  slug               TEXT NOT NULL,
  title              TEXT,
  content            TEXT,
  excerpt            TEXT,
  status             public.lms_content_status NOT NULL DEFAULT 'publish',
  pro_quiz_id        INTEGER,
  passing_percentage INTEGER,
  featured_image_id  INTEGER REFERENCES public.media(wp_attachment_id) ON DELETE SET NULL,
  old_path           TEXT,
  new_path           TEXT,
  published_at       TIMESTAMPTZ,
  modified_at        TIMESTAMPTZ,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX quizzes_slug_idx      ON public.quizzes(slug);
CREATE INDEX quizzes_status_idx    ON public.quizzes(status);
CREATE INDEX quizzes_course_id_idx ON public.quizzes(course_id);
CREATE INDEX quizzes_lesson_id_idx ON public.quizzes(lesson_id);

ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published quizzes are viewable by everyone"
  ON public.quizzes FOR SELECT USING (status = 'publish');
CREATE POLICY "Admins can view all quizzes"
  ON public.quizzes FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can insert quizzes"
  ON public.quizzes FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update quizzes"
  ON public.quizzes FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete quizzes"
  ON public.quizzes FOR DELETE USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- course_steps — ordered curriculum (lesson|quiz|topic) per course.
-- step_ref_id is the WP id of the referenced lesson/quiz/topic.
-- ----------------------------------------------------------------------------
CREATE TABLE public.course_steps (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id   INTEGER NOT NULL REFERENCES public.courses(wp_id) ON DELETE CASCADE,
  step_type   public.course_step_type NOT NULL,
  step_ref_id INTEGER NOT NULL,
  position    INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (course_id, step_type, step_ref_id)
);

CREATE INDEX course_steps_course_idx ON public.course_steps(course_id);

ALTER TABLE public.course_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Course steps are viewable by everyone"
  ON public.course_steps FOR SELECT USING (true);
CREATE POLICY "Admins can insert course steps"
  ON public.course_steps FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update course steps"
  ON public.course_steps FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete course steps"
  ON public.course_steps FOR DELETE USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- enrollments — schema only (no seed in v1).
-- ----------------------------------------------------------------------------
CREATE TABLE public.enrollments (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id    INTEGER NOT NULL REFERENCES public.courses(wp_id) ON DELETE CASCADE,
  progress     DECIMAL(5,2) NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ,
  enrolled_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, course_id)
);

CREATE INDEX enrollments_user_idx   ON public.enrollments(user_id);
CREATE INDEX enrollments_course_idx ON public.enrollments(course_id);

ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own enrollments"
  ON public.enrollments FOR SELECT
  USING (user_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid()));
CREATE POLICY "Admins can view all enrollments"
  ON public.enrollments FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can insert enrollments"
  ON public.enrollments FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update enrollments"
  ON public.enrollments FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete enrollments"
  ON public.enrollments FOR DELETE USING (public.is_admin());
