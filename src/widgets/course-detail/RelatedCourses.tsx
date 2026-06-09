/**
 * RelatedCourses — horizontal scroll (mobile) / 4-column grid (desktop).
 * Server component.
 */

import Image from 'next/image'
import { Badge } from '@/shared/ui'
import type { CourseSummary } from '@/entities/course/model'

interface RelatedCoursesProps {
  courses: CourseSummary[]
  mediaMap: Record<number, string>
}

function formatPrice(price: number | null | undefined, priceType: string | null): string {
  if (!price || priceType === 'open' || priceType === 'free') return 'Free'
  return `$${price.toFixed(2)}`
}

export function RelatedCourses({ courses, mediaMap }: RelatedCoursesProps) {
  if (courses.length === 0) return null

  return (
    <section aria-labelledby="related-heading" className="mt-spacing-12">
      <h2
        id="related-heading"
        className="font-[var(--font-heading)] font-semibold text-2xl text-color-text mb-spacing-6"
      >
        Related Courses
      </h2>
      <div className="flex gap-spacing-4 overflow-x-auto pb-spacing-2 lg:grid lg:grid-cols-4 lg:overflow-visible snap-x snap-mandatory">
        {courses.map((course) => {
          const imgUrl = course.featured_image_id ? mediaMap[course.featured_image_id] : null
          const priceLabel = formatPrice(course.price, course.price_type)
          return (
            <a
              key={course.id}
              href={`/courses/${course.slug}`}
              className="flex-none w-64 lg:w-auto snap-start rounded-radius-md border border-color-border bg-color-surface shadow-[var(--shadow-sm)] overflow-hidden hover:shadow-[var(--shadow-md)] transition-shadow duration-[var(--duration-fast)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-color-border-focus"
            >
              {/* Cover image */}
              <div className="relative aspect-video bg-color-surface-raised">
                {imgUrl ? (
                  <Image
                    src={imgUrl}
                    alt={`${course.title} — course cover`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 256px, 25vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg aria-hidden="true" viewBox="0 0 40 40" fill="currentColor" className="size-10 text-color-text-muted opacity-20">
                      <path d="M20 4C11.163 4 4 11.163 4 20s7.163 16 16 16 16-7.163 16-16S28.837 4 20 4zm-4 22V14l11 6-11 6z" />
                    </svg>
                  </div>
                )}
              </div>
              {/* Card body */}
              <div className="p-spacing-4">
                <p className="font-[var(--font-heading)] font-semibold text-sm text-color-text leading-snug line-clamp-2 mb-spacing-2">
                  {course.title}
                </p>
                <Badge variant="accent">{priceLabel}</Badge>
              </div>
            </a>
          )
        })}
      </div>
    </section>
  )
}
