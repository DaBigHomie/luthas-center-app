/**
 * CurriculumSidebar — ordered list of all course steps with active highlighting.
 * Renders as <nav aria-label="Course curriculum">.
 * Server component (pure rendering, no state).
 */

import type { LessonRow } from '@/entities/lesson/model'

interface SidebarStep {
  id: string
  index: number
  title: string
  slug: string | null
  type: 'lesson' | 'quiz' | 'topic'
}

interface CurriculumSidebarProps {
  courseSlug: string
  courseTitle: string
  steps: SidebarStep[]
  activeLessonSlug: string
}

export function CurriculumSidebar({
  courseSlug,
  courseTitle,
  steps,
  activeLessonSlug,
}: CurriculumSidebarProps) {
  return (
    <nav aria-label="Course curriculum" className="flex flex-col h-full">
      <h2 className="font-[var(--font-heading)] font-semibold text-base text-color-text mb-spacing-4 px-spacing-4 pt-spacing-4">
        Course Outline
      </h2>

      <ol className="flex-1 overflow-y-auto divide-y divide-color-border" role="list">
        {steps.map((step) => {
          const isActive = step.slug === activeLessonSlug
          const href = step.slug
            ? `/courses/${courseSlug}/lessons/${step.slug}`
            : `/courses/${courseSlug}`

          return (
            <li key={step.id}>
              <a
                href={href}
                aria-current={isActive ? 'page' : undefined}
                className={[
                  'flex items-center gap-spacing-3 px-spacing-4 py-spacing-3',
                  'text-sm transition-colors duration-[var(--duration-fast)]',
                  'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-color-border-focus',
                  isActive
                    ? 'border-l-2 border-color-primary bg-color-surface font-semibold text-color-primary'
                    : 'border-l-2 border-transparent text-color-text hover:bg-color-surface hover:text-color-primary',
                ].join(' ')}
              >
                {/* Step type icon */}
                {step.type === 'quiz' ? (
                  <svg aria-hidden="true" viewBox="0 0 16 16" fill="currentColor" className="size-4 shrink-0 text-color-accent">
                    <path fillRule="evenodd" d="M8 15A7 7 0 108 1a7 7 0 000 14zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg aria-hidden="true" viewBox="0 0 16 16" fill="currentColor" className="size-4 shrink-0 text-color-primary">
                    <path fillRule="evenodd" d="M8 15A7 7 0 108 1a7 7 0 000 14zM7.555 5.168A1 1 0 006 6v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                )}

                {/* Step number */}
                <span className="font-mono text-xs text-color-text-muted w-5 shrink-0">
                  {String(step.index).padStart(2, '0')}
                </span>

                {/* Title */}
                <span className="flex-1 leading-snug line-clamp-2">{step.title}</span>
              </a>
            </li>
          )
        })}
      </ol>

      {/* Back to course */}
      <div className="p-spacing-4 border-t border-color-border">
        <a
          href={`/courses/${courseSlug}`}
          className="text-sm text-color-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-color-border-focus rounded-sm"
        >
          Back to {courseTitle} overview &rarr;
        </a>
      </div>
    </nav>
  )
}

// ---------------------------------------------------------------------------
// Helper exported for use in the lesson page
// ---------------------------------------------------------------------------

export function buildSidebarSteps(
  lessons: LessonRow[],
): SidebarStep[] {
  return lessons.map((lesson, i) => ({
    id: `lesson-${lesson.id}`,
    index: i + 1,
    title: lesson.title ?? lesson.slug,
    slug: lesson.slug,
    type: 'lesson' as const,
  }))
}
