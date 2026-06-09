/**
 * CourseMetaBar — horizontal bar with lesson/quiz/cert/materials counts.
 * Server component.
 */

import type { CourseRow } from '@/entities/course/model'

interface CourseMetaBarProps {
  course: CourseRow
  lessonCount: number
  quizCount: number
}

interface StepCounts {
  lessons?: number
  topics?: number
  quizzes?: number
}

export function CourseMetaBar({ course, lessonCount, quizCount }: CourseMetaBarProps) {
  // step_counts from the DB row may have more accurate counts
  const sc = course.step_counts as StepCounts | null
  const lessons = sc?.lessons ?? lessonCount
  const quizzes = sc?.quizzes ?? quizCount

  return (
    <div className="flex flex-wrap items-center gap-spacing-4 py-spacing-3 border-y border-color-border text-sm text-color-text-muted">
      {/* Lessons */}
      <span className="flex items-center gap-spacing-2">
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="size-4 text-color-primary shrink-0">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
        </svg>
        <span>
          <span className="font-semibold text-color-text">{lessons}</span>
          {' '}lesson{lessons !== 1 ? 's' : ''}
        </span>
      </span>

      {/* Quizzes */}
      {quizzes > 0 && (
        <span className="flex items-center gap-spacing-2">
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="size-4 text-color-accent shrink-0">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
          </svg>
          <span>
            <span className="font-semibold text-color-text">{quizzes}</span>
            {' '}quiz{quizzes !== 1 ? 'zes' : ''}
          </span>
        </span>
      )}

      {/* Certificate */}
      {course.certificate_id && (
        <span className="flex items-center gap-spacing-2">
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="size-4 text-color-accent shrink-0">
            <path d="M5.127 3.502L5.25 3.5h9.5c.041 0 .082 0 .123.002A2.251 2.251 0 0012.75 2h-5.5a2.25 2.25 0 00-2.123 1.502zM1 10.25A2.25 2.25 0 013.25 8h13.5A2.25 2.25 0 0119 10.25v5.5A2.25 2.25 0 0116.75 18H3.25A2.25 2.25 0 011 15.75v-5.5zM3.25 6.5c-.04 0-.082 0-.123.002A2.25 2.25 0 015.25 5h9.5c.98 0 1.814.627 2.123 1.502a3.819 3.819 0 00-.123-.002H3.25z" />
          </svg>
          <span>Certificate available</span>
        </span>
      )}

      {/* Materials */}
      {course.materials_enabled && (
        <span className="flex items-center gap-spacing-2">
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="size-4 text-color-info shrink-0">
            <path d="M2 3a1 1 0 00-1 1v1a1 1 0 001 1h16a1 1 0 001-1V4a1 1 0 00-1-1H2z" />
            <path fillRule="evenodd" d="M2 7.5h16l-.811 7.71a2 2 0 01-1.99 1.79H4.802a2 2 0 01-1.99-1.79L2 7.5zM7 11a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
          <span>Bonus materials</span>
        </span>
      )}
    </div>
  )
}
