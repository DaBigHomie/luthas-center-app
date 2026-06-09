/**
 * CurriculumAccordion — renders the ordered list of lessons and quizzes
 * using the Accordion primitive.  Client component (Accordion uses state).
 *
 * CourseStepRow uses: step_type ('lesson'|'quiz'|'topic'), step_ref_id (wp_id ref), position.
 */

import { Accordion } from '@/shared/ui'
import type { AccordionItem } from '@/shared/ui'
import type { CourseStepRow } from '@/entities/course/model'
import type { LessonRow } from '@/entities/lesson/model'
import type { QuizRow } from '@/entities/quiz/model'

interface CurriculumAccordionProps {
  courseSlug: string
  steps: CourseStepRow[]
  lessons: LessonRow[]
  quizzes: QuizRow[]
}

/** Resolve a step to its content row using step_ref_id → wp_id. */
function resolveStep(
  step: CourseStepRow,
  lessons: LessonRow[],
  quizzes: QuizRow[],
): { type: 'lesson' | 'quiz' | 'topic'; title: string; slug: string } | null {
  if (step.step_type === 'lesson' || step.step_type === 'topic') {
    const lesson = lessons.find((l) => l.wp_id === step.step_ref_id)
    if (!lesson) return null
    return { type: step.step_type, title: lesson.title ?? lesson.slug, slug: lesson.slug }
  }
  if (step.step_type === 'quiz') {
    const quiz = quizzes.find((q) => q.wp_id === step.step_ref_id)
    if (!quiz) return null
    return { type: 'quiz', title: quiz.title ?? quiz.slug ?? String(quiz.wp_id), slug: quiz.slug ?? String(quiz.wp_id) }
  }
  return null
}

function LessonIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="size-4 text-color-primary shrink-0">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
    </svg>
  )
}

function QuizIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="size-4 text-color-accent shrink-0">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
    </svg>
  )
}

export function CurriculumAccordion({
  courseSlug,
  steps,
  lessons,
  quizzes,
}: CurriculumAccordionProps) {
  if (steps.length === 0 && lessons.length === 0) {
    return (
      <section aria-labelledby="curriculum-heading">
        <h2
          id="curriculum-heading"
          className="font-[var(--font-heading)] font-semibold text-2xl text-color-text mb-spacing-4"
        >
          Curriculum
        </h2>
        <p className="text-color-text-muted text-sm py-spacing-4">
          No curriculum steps available yet.
        </p>
      </section>
    )
  }

  // Build ordered item list
  const orderedItems: Array<{
    id: string
    index: number
    type: 'lesson' | 'quiz' | 'topic'
    title: string
    slug: string
  }> = []

  if (steps.length > 0) {
    // Use explicit step ordering
    const sorted = [...steps].sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    sorted.forEach((step, i) => {
      const resolved = resolveStep(step, lessons, quizzes)
      if (!resolved) return
      orderedItems.push({ id: `step-${step.id ?? i}`, index: i + 1, ...resolved })
    })
  } else {
    // Fallback: list lessons by sort_order, then quizzes
    lessons.forEach((lesson, i) => {
      orderedItems.push({
        id: `lesson-${lesson.id}`,
        index: i + 1,
        type: 'lesson',
        title: lesson.title ?? lesson.slug,
        slug: lesson.slug,
      })
    })
    quizzes.forEach((quiz, i) => {
      orderedItems.push({
        id: `quiz-${quiz.id}`,
        index: lessons.length + i + 1,
        type: 'quiz',
        title: quiz.title ?? quiz.slug ?? String(quiz.wp_id),
        slug: quiz.slug ?? String(quiz.wp_id),
      })
    })
  }

  const totalCount = orderedItems.length
  const accordionItems: AccordionItem[] = [
    {
      id: 'curriculum',
      defaultOpen: true,
      trigger: (
        <span className="font-[var(--font-heading)] font-semibold text-base text-color-text">
          Course Content &mdash; {totalCount} step{totalCount !== 1 ? 's' : ''}
        </span>
      ),
      content: (
        <ol className="divide-y divide-color-border" aria-label="Course steps">
          {orderedItems.map((item) => (
            <li key={item.id} className="flex items-center gap-spacing-3 py-spacing-3">
              {item.type === 'quiz' ? <QuizIcon /> : <LessonIcon />}
              <span className="font-mono text-xs text-color-text-muted w-6 shrink-0">
                {String(item.index).padStart(2, '0')}
              </span>
              {item.slug ? (
                <a
                  href={`/courses/${courseSlug}/lessons/${item.slug}`}
                  className="flex-1 text-sm text-color-text hover:text-color-primary transition-colors duration-[var(--duration-fast)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-color-border-focus rounded-sm"
                >
                  {item.title}
                </a>
              ) : (
                <span className="flex-1 text-sm text-color-text">{item.title}</span>
              )}
              {item.type === 'quiz' && (
                <span className="text-xs text-color-text-muted">Quiz</span>
              )}
            </li>
          ))}
        </ol>
      ),
    },
  ]

  return (
    <section aria-labelledby="curriculum-heading">
      <h2
        id="curriculum-heading"
        className="font-[var(--font-heading)] font-semibold text-2xl text-color-text mb-spacing-4"
      >
        Curriculum
      </h2>
      <Accordion items={accordionItems} type="single" style="contained" />
    </section>
  )
}
