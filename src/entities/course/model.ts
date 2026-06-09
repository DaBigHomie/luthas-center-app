import type { Tables } from '@/shared/types/database'
import type { LessonRow } from '@/entities/lesson/model'
import type { QuizRow } from '@/entities/quiz/model'

// ---------------------------------------------------------------------------
// Base row types derived from the Database schema
// ---------------------------------------------------------------------------

export type CourseRow = Tables<'courses'>
export type CourseStepRow = Tables<'course_steps'>
export type EnrollmentRow = Tables<'enrollments'>

// ---------------------------------------------------------------------------
// Enriched / composed types used in the application layer
// ---------------------------------------------------------------------------

/** A curriculum step resolved to its actual content row. */
export type ResolvedStep =
  | { step_type: 'lesson'; position: number; content: LessonRow }
  | { step_type: 'quiz'; position: number; content: QuizRow }
  | { step_type: 'topic'; position: number; content: LessonRow }

/** A course with its ordered curriculum steps resolved. */
export type CourseWithCurriculum = CourseRow & {
  lessons: LessonRow[]
  quizzes: QuizRow[]
  steps: CourseStepRow[]
}

/** Minimal course card — for list/catalog views. */
export type CourseSummary = Pick<
  CourseRow,
  | 'id'
  | 'wp_id'
  | 'slug'
  | 'title'
  | 'excerpt'
  | 'short_description'
  | 'price'
  | 'price_type'
  | 'access_mode'
  | 'featured_image_id'
  | 'published_at'
  | 'status'
>
