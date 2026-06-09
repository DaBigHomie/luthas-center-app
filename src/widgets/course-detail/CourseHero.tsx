/**
 * CourseHero — hero banner for a course detail page.
 * Renders intro_video embed (YouTube) or featured image, course title, and taxonomy tags.
 * Server component — receives resolved data as props.
 */

import Image from 'next/image'
import { Badge } from '@/shared/ui'
import type { CourseRow } from '@/entities/course/model'
import type { MediaRow } from '@/entities/media/model'

interface CourseHeroProps {
  course: CourseRow
  coverImageUrl: string | null
  coverImage: MediaRow | null
}

/** Convert a YouTube watch URL to a nocookie embed URL. */
function toYouTubeEmbed(url: string): string | null {
  try {
    const u = new URL(url)
    const id =
      u.searchParams.get('v') ??
      (u.hostname === 'youtu.be' ? u.pathname.slice(1) : null)
    if (!id) return null
    return `https://www.youtube-nocookie.com/embed/${id}?rel=0`
  } catch {
    return null
  }
}

export function CourseHero({ course, coverImageUrl }: CourseHeroProps) {
  const embedUrl = course.intro_video ? toYouTubeEmbed(course.intro_video) : null

  return (
    <div className="w-full">
      {/* Video or image */}
      <div className="relative w-full aspect-video rounded-radius-lg overflow-hidden bg-color-surface-raised">
        {embedUrl ? (
          <>
            <iframe
              src={embedUrl}
              title={`Course preview: ${course.title}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
            {/* Fallback link for assistive tech */}
            <p className="sr-only">
              <a
                href={course.intro_video ?? '#'}
                target="_blank"
                rel="noopener noreferrer"
              >
                Watch preview on YouTube
              </a>
            </p>
          </>
        ) : coverImageUrl ? (
          <Image
            src={coverImageUrl}
            alt={`${course.title} — course cover`}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 60vw"
            priority
          />
        ) : (
          /* Decorative placeholder */
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              aria-hidden="true"
              viewBox="0 0 64 64"
              className="size-16 text-color-text-muted opacity-30"
              fill="currentColor"
            >
              <path d="M32 6C17.64 6 6 17.64 6 32s11.64 26 26 26 26-11.64 26-26S46.36 6 32 6zm-6 37V21l18 11-18 11z" />
            </svg>
          </div>
        )}
      </div>

      {/* Title */}
      <h1 className="font-[var(--font-heading)] font-bold text-3xl lg:text-4xl text-color-text leading-tight mt-spacing-6 mb-spacing-3">
        {course.title}
      </h1>

      {/* Taxonomy placeholder — categories/tags embedded in course content in JSON mode */}
      {course.price_type && (
        <div className="flex flex-wrap gap-spacing-2 mt-spacing-2">
          <Badge variant="accent">
            {course.price_type === 'open' ? 'Open Access' : course.price_type === 'free' ? 'Free' : 'Paid'}
          </Badge>
          {course.access_mode && course.access_mode !== course.price_type && (
            <Badge variant="outline">{course.access_mode}</Badge>
          )}
        </div>
      )}
    </div>
  )
}
