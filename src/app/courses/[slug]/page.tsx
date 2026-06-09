/**
 * Course Detail page — /courses/[slug]
 *
 * Async Server Component. Data via JSON-fallback adapter (data-source.ts).
 * Layout: two-column on desktop (main 60% + sticky sidebar 40%).
 *
 * Spec: docs/design/templates/course-detail.md
 */

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Breadcrumb, Prose } from '@/shared/ui'
import {
  getCourseWithCurriculum,
  listPublishedCourses,
  getMediaByWpId,
  getMediaByWpIds,
  resolveMediaUrl,
} from '@/shared/lib/data-source'
import { CourseHero } from '@/widgets/course-detail/CourseHero'
import { CourseMetaBar } from '@/widgets/course-detail/CourseMetaBar'
import { CurriculumAccordion } from '@/widgets/course-detail/CurriculumAccordion'
import { InstructorCard } from '@/widgets/course-detail/InstructorCard'
import { CourseCtaCard } from '@/widgets/course-detail/CourseCtaCard'
import { RelatedCourses } from '@/widgets/course-detail/RelatedCourses'
import type { MediaRow } from '@/entities/media/model'

// ---------------------------------------------------------------------------
// Static params
// ---------------------------------------------------------------------------

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const courses = await listPublishedCourses()
  return courses.map((c) => ({ slug: c.slug }))
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const course = await getCourseWithCurriculum(slug)
  if (!course) return {}
  return {
    title: `${course.title} | Luthas Center`,
    description: course.excerpt ?? course.short_description ?? undefined,
  }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const course = await getCourseWithCurriculum(slug)
  if (!course) notFound()

  const { lessons, quizzes, steps } = course

  // Resolve cover image
  let coverImage: MediaRow | null = null
  let coverImageUrl: string | null = null
  const imageId = course.featured_image_id ?? course.cover_image_id
  if (imageId) {
    coverImage = await getMediaByWpId(imageId)
    if (coverImage) coverImageUrl = resolveMediaUrl(coverImage)
  }

  // Resolve related course images (different course, max 4)
  const allCourses = await listPublishedCourses()
  const related = allCourses
    .filter((c) => c.slug !== course.slug)
    .slice(0, 4)

  const relatedImageIds = related
    .map((c) => c.featured_image_id)
    .filter((id): id is number => id != null)
  const relatedMediaRows = await getMediaByWpIds(relatedImageIds)
  const relatedMediaMap: Record<number, string> = {}
  relatedMediaRows.forEach((m) => {
    if (m.wp_attachment_id) {
      relatedMediaMap[m.wp_attachment_id] = resolveMediaUrl(m)
    }
  })

  // Instructor — best-effort; falls back to platform name
  const instructorName = 'Luthas Center'

  const breadcrumbItems = [
    { label: 'Courses', href: '/courses' },
    { label: course.title ?? course.slug },
  ]

  return (
    <main className="min-h-screen bg-color-background">
      {/* Breadcrumb */}
      <div className="max-w-screen-xl mx-auto px-spacing-4 lg:px-spacing-8 pt-spacing-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Two-column layout */}
      <div className="max-w-screen-xl mx-auto px-spacing-4 lg:px-spacing-8 py-spacing-6 lg:py-spacing-8">
        <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-spacing-10 items-start">

          {/* ── Left: main content ── */}
          <div className="flex flex-col gap-spacing-8">

            {/* Mobile hero: video/image + title + tags */}
            <div className="lg:hidden">
              <CourseHero
                course={course}
                coverImageUrl={coverImageUrl}
                coverImage={coverImage}
              />
            </div>

            {/* Desktop: title only (video lives in sidebar) */}
            <div className="hidden lg:block">
              <h1 className="font-[var(--font-heading)] font-bold text-4xl text-color-text leading-tight mb-spacing-3">
                {course.title}
              </h1>
            </div>

            {/* Meta bar */}
            <CourseMetaBar
              course={course}
              lessonCount={lessons.length}
              quizCount={quizzes.length}
            />

            {/* Description */}
            {course.content && (
              <section aria-label="Course description">
                <Prose html={course.content} />
              </section>
            )}

            {/* Curriculum */}
            <CurriculumAccordion
              courseSlug={course.slug}
              steps={steps}
              lessons={lessons}
              quizzes={quizzes}
            />

            {/* Instructor */}
            <InstructorCard displayName={instructorName} />

            {/* Mobile inline CTA — hidden on desktop (sidebar handles it) */}
            <CourseCtaCard course={course} inline />
          </div>

          {/* ── Right: sticky sidebar (desktop only) ── */}
          <aside
            aria-label="Enroll in this course"
            className="hidden lg:flex flex-col gap-spacing-4 sticky top-spacing-6"
          >
            {/* Video / cover image */}
            <div className="rounded-radius-lg border border-color-border overflow-hidden bg-color-surface-raised">
              <CourseHero
                course={course}
                coverImageUrl={coverImageUrl}
                coverImage={coverImage}
              />
            </div>

            {/* Sidebar CTA card (non-inline = desktop variant) */}
            <CourseCtaCard course={course} />
          </aside>
        </div>

        {/* Related Courses — full width below both columns */}
        <RelatedCourses courses={related} mediaMap={relatedMediaMap} />
      </div>
    </main>
  )
}
