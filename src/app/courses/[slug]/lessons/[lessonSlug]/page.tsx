/**
 * Lesson page — /courses/[slug]/lessons/[lessonSlug]
 *
 * Async Server Component. Data via JSON-fallback adapter (data-source.ts).
 * Layout: two-column on desktop (fluid main + 280px sticky sidebar).
 *
 * Spec: docs/design/templates/lesson.md
 */

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Breadcrumb } from '@/shared/ui'
import { Prose } from '@/shared/ui/Prose'
import {
  getLessonBySlug,
  getCourseBySlug,
  listLessonsByCourse,
  getMediaByWpId,
  resolveMediaUrl,
  listPublishedCourses,
} from '@/shared/lib/data-source'
import { LessonMedia } from '@/widgets/lesson-view/LessonMedia'
import { CurriculumSidebar, buildSidebarSteps } from '@/widgets/lesson-view/CurriculumSidebar'
import { LessonNav } from '@/widgets/lesson-view/LessonNav'
import type { MediaRow } from '@/entities/media/model'
import type { LessonRow } from '@/entities/lesson/model'

// ---------------------------------------------------------------------------
// Static params
// ---------------------------------------------------------------------------

export async function generateStaticParams(): Promise<
  Array<{ slug: string; lessonSlug: string }>
> {
  const courses = await listPublishedCourses()
  const pairs: Array<{ slug: string; lessonSlug: string }> = []

  // Fetch lessons for each course in parallel (chunked to avoid overload)
  await Promise.all(
    courses.map(async (course) => {
      const lessons = await listLessonsByCourse(course.wp_id)
      lessons.forEach((lesson) => {
        pairs.push({ slug: course.slug, lessonSlug: lesson.slug })
      })
    }),
  )

  return pairs
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; lessonSlug: string }>
}): Promise<Metadata> {
  const { lessonSlug, slug } = await params
  const lesson = await getLessonBySlug(lessonSlug)
  const course = await getCourseBySlug(slug)
  if (!lesson) return {}
  return {
    title: `${lesson.title}${course ? ` | ${course.title}` : ''} | Luthas Center`,
    description: lesson.excerpt ?? undefined,
  }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonSlug: string }>
}) {
  const { slug, lessonSlug } = await params

  // Fetch lesson + course in parallel
  const [lesson, course] = await Promise.all([
    getLessonBySlug(lessonSlug),
    getCourseBySlug(slug),
  ])

  if (!lesson) notFound()
  if (!course) notFound()

  // All lessons for this course (for sidebar + prev/next)
  const allLessons = await listLessonsByCourse(course.wp_id)
  const currentIndex = allLessons.findIndex((l) => l.slug === lessonSlug)
  const prevLesson: LessonRow | null = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLesson: LessonRow | null =
    currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

  // Resolve lesson featured image
  let imageRow: MediaRow | null = null
  let imageUrl: string | null = null
  if (lesson.featured_image_id) {
    imageRow = await getMediaByWpId(lesson.featured_image_id)
    if (imageRow) imageUrl = resolveMediaUrl(imageRow)
  }

  // Sidebar steps
  const sidebarSteps = buildSidebarSteps(allLessons)

  const breadcrumbItems = [
    { label: 'Courses', href: '/courses' },
    { label: course.title ?? course.slug, href: `/courses/${course.slug}` },
    { label: lesson.title ?? lesson.slug },
  ]

  return (
    <main className="min-h-screen bg-color-background">
      {/* Breadcrumb */}
      <div className="max-w-screen-xl mx-auto px-spacing-4 lg:px-spacing-8 pt-spacing-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Two-column layout */}
      <div className="max-w-screen-xl mx-auto px-spacing-4 lg:px-spacing-8 py-spacing-6 lg:py-spacing-8">
        <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-spacing-10 items-start">

          {/* ── Left: lesson content ── */}
          <div className="flex flex-col gap-spacing-6">
            {/* Lesson heading */}
            <h1 className="font-[var(--font-heading)] font-bold text-3xl lg:text-4xl text-color-text leading-tight">
              {lesson.title}
            </h1>

            {/* Media zone */}
            <LessonMedia
              title={lesson.title ?? lesson.slug}
              videoUrl={lesson.video_url}
              imageUrl={imageUrl}
              imageRow={imageRow}
            />

            {/* Rich content */}
            {lesson.content ? (
              <section aria-label="Lesson content">
                <Prose html={lesson.content} />
              </section>
            ) : (
              <p className="text-color-text-muted text-sm py-spacing-4">
                No lesson content available.
              </p>
            )}

            {/* Lesson navigation */}
            <LessonNav
              courseSlug={course.slug}
              prevLesson={
                prevLesson
                  ? { slug: prevLesson.slug, title: prevLesson.title ?? prevLesson.slug }
                  : null
              }
              nextLesson={
                nextLesson
                  ? { slug: nextLesson.slug, title: nextLesson.title ?? nextLesson.slug }
                  : null
              }
            />
          </div>

          {/* ── Right: curriculum sidebar (desktop) ── */}
          <aside
            aria-label="Course curriculum"
            className="hidden lg:flex flex-col sticky top-spacing-6 h-[calc(100vh-3rem)] border border-color-border rounded-radius-md bg-color-surface overflow-hidden"
          >
            <CurriculumSidebar
              courseSlug={course.slug}
              courseTitle={course.title ?? 'Course Overview'}
              steps={sidebarSteps}
              activeLessonSlug={lessonSlug}
            />
          </aside>
        </div>

        {/* Mobile curriculum drawer trigger + list */}
        <div className="lg:hidden mt-spacing-8">
          <details className="rounded-radius-md border border-color-border bg-color-surface overflow-hidden">
            <summary className="flex items-center justify-between px-spacing-4 py-spacing-4 font-semibold text-color-text cursor-pointer select-none hover:bg-color-surface-raised list-none focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-color-border-focus">
              <span>Course outline</span>
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-color-text-muted">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </summary>
            <CurriculumSidebar
              courseSlug={course.slug}
              courseTitle={course.title ?? 'Course Overview'}
              steps={sidebarSteps}
              activeLessonSlug={lessonSlug}
            />
          </details>
        </div>
      </div>
    </main>
  )
}
