import 'server-only'
import { createPublicClient } from '@/shared/lib/supabase/server'
import type { CourseRow, CourseStepRow, CourseWithCurriculum, CourseSummary } from './model'
import { listLessonsByCourse } from '@/entities/lesson/api'
import { listQuizzesByCourse } from '@/entities/quiz/api'

/** List all published courses, ordered by menu_order then published_at. */
export async function listPublishedCourses(): Promise<CourseSummary[]> {
  const supabase = await createPublicClient()
  const { data, error } = await supabase
    .from('courses')
    .select(
      'id, wp_id, slug, title, excerpt, short_description, price, price_type, featured_image_id, published_at, status',
    )
    .eq('status', 'publish')
    .order('menu_order', { ascending: true })
    .order('published_at', { ascending: false })

  if (error) throw new Error(`listPublishedCourses: ${error.message}`)
  return (data ?? []) as CourseSummary[]
}

/** Fetch a single published course by slug. */
export async function getCourseBySlug(slug: string): Promise<CourseRow | null> {
  const supabase = await createPublicClient()
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'publish')
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(`getCourseBySlug: ${error.message}`)
  }
  return data
}

/** Fetch a course by slug WITH its ordered curriculum (lessons + quizzes + steps). */
export async function getCourseWithCurriculum(
  slug: string,
): Promise<CourseWithCurriculum | null> {
  const supabase = await createPublicClient()
  const { data: course, error } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'publish')
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(`getCourseWithCurriculum(course): ${error.message}`)
  }

  const { data: steps, error: stepsError } = await supabase
    .from('course_steps')
    .select('*')
    .eq('course_id', course.wp_id)
    .order('position', { ascending: true })

  if (stepsError) throw new Error(`getCourseWithCurriculum(steps): ${stepsError.message}`)

  const [lessons, quizzes] = await Promise.all([
    listLessonsByCourse(course.wp_id),
    listQuizzesByCourse(course.wp_id),
  ])

  return {
    ...course,
    lessons,
    quizzes,
    steps: (steps ?? []) as CourseStepRow[],
  }
}

/** Fetch all courses for a given term (by wp_term_id). */
export async function listCoursesByTerm(wpTermId: number): Promise<CourseSummary[]> {
  const supabase = await createPublicClient()
  // term_relationships uses wp_id (integer) as object_id
  const { data: rels, error: relError } = await supabase
    .from('term_relationships')
    .select('object_id')
    .eq('object_type', 'course')
    .eq('wp_term_id', wpTermId)

  if (relError) throw new Error(`listCoursesByTerm(rels): ${relError.message}`)
  if (!rels || rels.length === 0) return []

  const wpIds = rels.map((r) => r.object_id)
  const { data, error } = await supabase
    .from('courses')
    .select(
      'id, wp_id, slug, title, excerpt, short_description, price, price_type, featured_image_id, published_at, status',
    )
    .in('wp_id', wpIds)
    .eq('status', 'publish')
    .order('menu_order', { ascending: true })

  if (error) throw new Error(`listCoursesByTerm(courses): ${error.message}`)
  return (data ?? []) as CourseSummary[]
}