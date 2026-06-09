/**
 * sitemap.ts — Luthas Center for Excellence
 *
 * Emits all public URLs:
 *   - Static pages: /, /about, /contact, /courses, /blog, /donate
 *   - Dynamic courses:  /courses/[slug]
 *   - Dynamic lessons:  /courses/[slug]/lessons/[lessonSlug]
 *   - Dynamic posts:    /blog/[slug]
 *   - Donation forms:   /give/[slug]
 *
 * Uses the JSON-fallback data adapter so it works offline (no Supabase).
 * server-only — this file is a Next.js special Route Handler.
 */

import 'server-only'
import type { MetadataRoute } from 'next'
import {
  listPublishedCourses,
  listLessonsByCourse,
  listPosts,
  listDonationForms,
} from '@/shared/lib/data-source'

const BASE_URL = 'https://luthascenter.damieus.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // ---------------------------------------------------------------------------
  // 1. Static routes
  // ---------------------------------------------------------------------------

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/courses`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/donate`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // ---------------------------------------------------------------------------
  // 2. Published courses + lessons
  // ---------------------------------------------------------------------------

  const courses = await listPublishedCourses()

  const courseRoutes: MetadataRoute.Sitemap = courses.map((course) => ({
    url: `${BASE_URL}/courses/${course.slug}`,
    lastModified: course.published_at ? new Date(course.published_at) : now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Lessons per course — fetched in parallel
  const lessonRouteArrays = await Promise.all(
    courses.map(async (course) => {
      const lessons = await listLessonsByCourse(course.wp_id)
      return lessons.map(
        (lesson): MetadataRoute.Sitemap[number] => ({
          url: `${BASE_URL}/courses/${course.slug}/lessons/${lesson.slug}`,
          lastModified: lesson.published_at ? new Date(lesson.published_at) : now,
          changeFrequency: 'monthly',
          priority: 0.6,
        }),
      )
    }),
  )
  const lessonRoutes = lessonRouteArrays.flat()

  // ---------------------------------------------------------------------------
  // 3. Published posts (all — no pageSize cap for sitemap)
  // ---------------------------------------------------------------------------

  const posts = await listPosts({ page: 1, pageSize: 9999 })

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.published_at ? new Date(post.published_at) : now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // ---------------------------------------------------------------------------
  // 4. Donation forms
  // ---------------------------------------------------------------------------

  const forms = await listDonationForms()

  const donationRoutes: MetadataRoute.Sitemap = forms.map((form) => ({
    url: `${BASE_URL}/give/${form.slug ?? String(form.wp_id)}`,
    lastModified: form.published_at ? new Date(form.published_at) : now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [
    ...staticRoutes,
    ...courseRoutes,
    ...lessonRoutes,
    ...postRoutes,
    ...donationRoutes,
  ]
}
