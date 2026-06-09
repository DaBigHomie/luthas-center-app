/**
 * InstructorCard — displays instructor name, avatar initials, and bio.
 * Server component.
 */

import { Avatar } from '@/shared/ui'

interface InstructorCardProps {
  displayName: string
  bio?: string | null
}

export function InstructorCard({ displayName, bio }: InstructorCardProps) {
  return (
    <section aria-labelledby="instructor-heading">
      <h2
        id="instructor-heading"
        className="font-[var(--font-heading)] font-semibold text-2xl text-color-text mb-spacing-4"
      >
        Your Instructor
      </h2>
      <div className="flex items-start gap-spacing-4 p-spacing-6 rounded-radius-md border border-color-border bg-color-surface">
        <Avatar name={displayName} size="lg" />
        <div className="flex-1 min-w-0">
          <p className="font-[var(--font-heading)] font-semibold text-lg text-color-text leading-tight">
            {displayName}
          </p>
          {bio && (
            <p className="mt-spacing-2 text-sm text-color-text-muted leading-relaxed line-clamp-3">
              {bio}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
