/**
 * CourseCard — entity-level card for course catalog/listing pages.
 *
 * Parent Server Components should call resolveMediaUrl(mediaRow) from
 * @/shared/lib/data-source and pass the result as `imageUrl`.
 * This component is a pure presentational Client-safe component (no server
 * imports) so it can be used inside both Server and Client trees.
 */

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card } from '@/shared/ui/Card'
import { Badge } from '@/shared/ui/Badge'
import type { BadgeVariant } from '@/shared/ui/Badge'
import type { CourseSummary } from '@/entities/course/model'

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface CourseCardProps {
  course: CourseSummary
  /** Pre-resolved image URL from parent Server Component. */
  imageUrl: string
  /** Category name (resolved by parent from terms). */
  category?: string | null
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function priceTypeBadgeVariant(priceType: string | null): BadgeVariant {
  switch (priceType?.toLowerCase()) {
    case 'free':
      return 'success'
    case 'paid':
      return 'accent'
    case 'subscription':
      return 'warning'
    default:
      return 'secondary'
  }
}

function priceTypeLabel(priceType: string | null, price: number | null): string {
  if (!priceType) return 'Course'
  if (priceType.toLowerCase() === 'free') return 'Free'
  if (priceType.toLowerCase() === 'paid' && price != null) {
    return `$${price % 1 === 0 ? price.toFixed(0) : price.toFixed(2)}`
  }
  return priceType.charAt(0).toUpperCase() + priceType.slice(1)
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CourseCard({ course, imageUrl, category }: CourseCardProps) {
  const href = `/courses/${course.slug}`
  const badgeVariant = priceTypeBadgeVariant(course.price_type)
  const badgeLabel = priceTypeLabel(course.price_type, course.price)

  return (
    <Card
      as="article"
      variant="default"
      aria-label={course.title ?? undefined}
      className="flex flex-col min-w-[280px]"
    >
      {/* Cover image — 16:9 */}
      <Link href={href} tabIndex={-1} aria-hidden="true" className="block relative">
        <div className="relative w-full aspect-video overflow-hidden">
          <Image
            src={imageUrl}
            alt={course.title ?? 'Course cover'}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
            loading="lazy"
          />
          {/* Price badge — top-right overlay */}
          <span className="absolute top-spacing-2 right-spacing-2">
            <Badge variant={badgeVariant}>{badgeLabel}</Badge>
          </span>
        </div>
      </Link>

      <Card.Body className="flex-1 flex flex-col gap-spacing-2">
        {/* Category tag */}
        {category && (
          <Badge variant="primary" className="self-start">
            {category}
          </Badge>
        )}

        {/* Title */}
        <Card.Title>
          <Link
            href={href}
            className="line-clamp-2 hover:text-color-primary transition-colors duration-[var(--duration-fast)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-color-border-focus rounded-sm"
          >
            {course.title ?? 'Untitled Course'}
          </Link>
        </Card.Title>

        {/* Excerpt */}
        {course.excerpt && (
          <p className="text-sm text-color-text-muted line-clamp-2 leading-[var(--leading-relaxed)]">
            {course.excerpt}
          </p>
        )}

        {/* Spacer pushes action row to bottom */}
        <div className="flex-1" />

        <Card.Divider />

        {/* Meta + action row */}
        <div className="flex items-center justify-between gap-spacing-2">
          <Card.Meta>
            {course.access_mode && (
              <Badge variant="outline" className="text-xs">
                {course.access_mode}
              </Badge>
            )}
          </Card.Meta>

          <Link
            href={href}
            className="inline-flex items-center justify-center px-spacing-4 py-spacing-2 text-sm font-semibold rounded-[var(--radius-md)] bg-color-primary text-color-text-inverse transition-colors duration-[var(--duration-fast)] hover:bg-color-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-color-border-focus"
          >
            Enroll Now
          </Link>
        </div>
      </Card.Body>
    </Card>
  )
}

CourseCard.displayName = 'CourseCard'
