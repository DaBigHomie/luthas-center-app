/**
 * LessonNav — prev/next navigation between lessons.
 * Server component.
 */

interface LessonNavProps {
  courseSlug: string
  prevLesson: { slug: string; title: string } | null
  nextLesson: { slug: string; title: string } | null
}

const TITLE_MAX = 40

function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max - 1) + '…' : str
}

export function LessonNav({ courseSlug, prevLesson, nextLesson }: LessonNavProps) {
  return (
    <nav aria-label="Lesson navigation" className="grid grid-cols-2 gap-spacing-3 mt-spacing-8">
      {/* Previous */}
      <div>
        {prevLesson ? (
          <a
            href={`/courses/${courseSlug}/lessons/${prevLesson.slug}`}
            className={[
              'flex flex-col items-start gap-spacing-1 rounded-radius-md',
              'border border-color-border bg-color-surface px-spacing-4 py-spacing-3',
              'hover:bg-color-surface-raised transition-colors duration-[var(--duration-fast)]',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-color-border-focus',
            ].join(' ')}
          >
            <span className="text-xs text-color-text-muted">&larr; Previous</span>
            <span className="text-sm font-semibold text-color-text leading-snug">
              {truncate(prevLesson.title, TITLE_MAX)}
            </span>
          </a>
        ) : (
          /* Invisible placeholder to keep grid stable */
          <span aria-hidden="true" tabIndex={-1} />
        )}
      </div>

      {/* Next */}
      <div className="flex justify-end">
        {nextLesson ? (
          <a
            href={`/courses/${courseSlug}/lessons/${nextLesson.slug}`}
            className={[
              'flex flex-col items-end gap-spacing-1 rounded-radius-md',
              'border border-color-border bg-color-surface px-spacing-4 py-spacing-3',
              'hover:bg-color-surface-raised transition-colors duration-[var(--duration-fast)]',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-color-border-focus',
              'w-full text-right',
            ].join(' ')}
          >
            <span className="text-xs text-color-text-muted">Next &rarr;</span>
            <span className="text-sm font-semibold text-color-text leading-snug">
              {truncate(nextLesson.title, TITLE_MAX)}
            </span>
          </a>
        ) : (
          <a
            href={`/courses/${courseSlug}`}
            className={[
              'flex flex-col items-end gap-spacing-1 rounded-radius-md',
              'border border-color-primary bg-color-primary px-spacing-4 py-spacing-3',
              'text-right w-full',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-color-border-focus',
            ].join(' ')}
          >
            <span className="text-xs text-color-text-inverse opacity-75">Finished?</span>
            <span className="text-sm font-semibold text-color-text-inverse">
              Finish course &rarr;
            </span>
          </a>
        )}
      </div>
    </nav>
  )
}
