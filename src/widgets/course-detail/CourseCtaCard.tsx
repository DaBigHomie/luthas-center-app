/**
 * CourseCtaCard — enrollment/purchase card content.
 *
 * Two rendering positions:
 *   inline=false (default) — desktop sidebar variant: full flex column, no outer shell
 *   inline=true            — mobile inline block: lg:hidden wrapper
 *
 * Server component.
 */

import Link from 'next/link'
import { Button, Badge } from '@/shared/ui'
import type { CourseRow } from '@/entities/course/model'

interface CourseCtaCardProps {
  course: CourseRow
  /** Render in mobile inline position — hidden on lg+ (sidebar takes over). */
  inline?: boolean
}

function formatPrice(price: number | null | undefined): string {
  if (!price || price === 0) return 'Free'
  return `$${price.toFixed(2)}`
}

function CtaContent({ course }: { course: CourseRow }) {
  const isFree =
    !course.price ||
    course.price === 0 ||
    course.price_type === 'open' ||
    course.price_type === 'free'
  const priceLabel = isFree ? 'Free' : formatPrice(course.price)
  const enrollLabel = isFree ? 'Enroll Now' : `Purchase — ${formatPrice(course.price)}`

  return (
    <div className="rounded-radius-md border border-color-border bg-color-surface-raised shadow-[var(--shadow-md)] p-spacing-6 flex flex-col gap-spacing-4">
      {/* Price badge + access mode */}
      <div className="flex items-center gap-spacing-3">
        <Badge
          variant={isFree ? 'accent' : 'primary'}
          className="text-base px-spacing-3 py-spacing-2"
        >
          {priceLabel}
        </Badge>
        {course.access_mode && (
          <span className="text-sm text-color-text-muted capitalize">
            {course.access_mode.replace('_', ' ')}
          </span>
        )}
      </div>

      {/* Primary CTA */}
      <Button variant="primary" size="lg" className="w-full justify-center">
        {enrollLabel}
      </Button>

      {/* Soft donate nudge for open/free courses */}
      {isFree && (
        <Link
          href="/donate"
          className="w-full flex items-center justify-center rounded-radius-md border border-color-primary px-spacing-5 py-spacing-3 text-base font-semibold text-color-primary hover:bg-color-surface-overlay hover:text-color-text-inverse transition-colors duration-[var(--duration-fast)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-color-border-focus"
        >
          Support this course
        </Link>
      )}

      {/* Divider */}
      <hr className="border-color-border" />

      {/* Certificate */}
      {course.certificate_id && (
        <div className="flex items-center gap-spacing-2 text-sm text-color-text-muted">
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-4 text-color-accent shrink-0"
          >
            <path d="M5.127 3.502L5.25 3.5h9.5c.041 0 .082 0 .123.002A2.251 2.251 0 0012.75 2h-5.5a2.25 2.25 0 00-2.123 1.502zM1 10.25A2.25 2.25 0 013.25 8h13.5A2.25 2.25 0 0119 10.25v5.5A2.25 2.25 0 0116.75 18H3.25A2.25 2.25 0 011 15.75v-5.5zM3.25 6.5c-.04 0-.082 0-.123.002A2.25 2.25 0 015.25 5h9.5c.98 0 1.814.627 2.123 1.502a3.819 3.819 0 00-.123-.002H3.25z" />
          </svg>
          <span>Certificate available upon completion</span>
        </div>
      )}

      {/* Bonus materials */}
      {course.materials_enabled && (
        <div className="flex items-center gap-spacing-2 text-sm text-color-text-muted">
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-4 text-color-info shrink-0"
          >
            <path d="M2 3a1 1 0 00-1 1v1a1 1 0 001 1h16a1 1 0 001-1V4a1 1 0 00-1-1H2z" />
            <path
              fillRule="evenodd"
              d="M2 7.5h16l-.811 7.71a2 2 0 01-1.99 1.79H4.802a2 2 0 01-1.99-1.79L2 7.5zM7 11a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>Bonus materials included</span>
        </div>
      )}
    </div>
  )
}

export function CourseCtaCard({ course, inline = false }: CourseCtaCardProps) {
  if (inline) {
    return (
      <div className="lg:hidden">
        <CtaContent course={course} />
      </div>
    )
  }
  return <CtaContent course={course} />
}
