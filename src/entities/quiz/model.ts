import type { Tables } from '@/shared/types/database'

export type QuizRow = Tables<'quizzes'>

export type QuizSummary = Pick<
  QuizRow,
  'id' | 'wp_id' | 'slug' | 'title' | 'course_id' | 'lesson_id' | 'status' | 'passing_percentage'
>
