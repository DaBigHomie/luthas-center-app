/**
 * Home page — Luthas Center for Excellence
 *
 * Async Server Component. Fetches all data in parallel and delegates
 * rendering to purpose-built widgets under src/widgets/.
 *
 * Sections:
 *   1. Hero         — tagline + CTAs
 *   2. Featured Courses — first 6 published courses
 *   3. Mission + Donate — about excerpt + donation form CTA
 *   4. Recent Posts — latest 3 blog posts
 *   5. Newsletter   — email signup stub
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import {
  listPublishedCourses,
  listPosts,
  listDonationForms,
  getPageBySlug,
  resolveCoverUrl,
} from '@/shared/lib/data-source'
import { CourseCard } from '@/entities/course/ui/CourseCard'
import { PostCard } from '@/entities/post/ui/PostCard'
import { HomeHero } from '@/widgets/home-hero/HomeHero'
import { DonateBand } from '@/widgets/home-donate/DonateBand'
import { NewsletterSection } from '@/widgets/home-newsletter/NewsletterSection'
import { SITE_URL } from '@/shared/config/site'

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Impossible to Inevitable — discover courses, resources, and community at Luthas Center for Excellence.',
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: 'Luthas Center for Excellence',
    description:
      'Impossible to Inevitable — discover courses, resources, and community at Luthas Center for Excellence.',
    url: SITE_URL,
    images: [
      {
        url: '/placeholder-cover.svg',
        width: 1200,
        height: 630,
        alt: 'Luthas Center for Excellence',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luthas Center for Excellence',
    description:
      'Impossible to Inevitable — discover courses, resources, and community at Luthas Center for Excellence.',
    images: ['/placeholder-cover.svg'],
  },
}

export default async function HomePage() {
  // -------------------------------------------------------------------------
  // Parallel data fetches
  // -------------------------------------------------------------------------
  const [allCourses, recentPosts, donationForms, aboutPage] = await Promise.all([
    listPublishedCourses(),
    listPosts({ page: 1, pageSize: 3 }),
    listDonationForms(),
    getPageBySlug('about'),
  ])

  const featuredCourses = allCourses.slice(0, 6)

  // Resolve course cover images
  const courseImageIds = featuredCourses
    .map((c) => c.featured_image_id)
    .filter((id): id is number => typeof id === 'number')

  const postImageIds = recentPosts
    .map((p) => p.featured_image_id)
    .filter((id): id is number => typeof id === 'number')

  const allImageIds = [...new Set([...courseImageIds, ...postImageIds])]

  // Batch-load media rows
  const { getMediaByWpIds } = await import('@/shared/lib/data-source')
  const mediaRows = await getMediaByWpIds(allImageIds)
  const mediaMap = new Map(mediaRows.map((m) => [m.wp_attachment_id, m]))

  function getCourseImageUrl(course: (typeof featuredCourses)[number]): string {
    const m = course.featured_image_id ? mediaMap.get(course.featured_image_id) ?? null : null
    return resolveCoverUrl(m, 'course', course.slug)
  }

  function getPostImageUrl(post: (typeof recentPosts)[number]): string {
    const m = post.featured_image_id ? mediaMap.get(post.featured_image_id) ?? null : null
    return resolveCoverUrl(m, 'post', post.slug)
  }

  // Donation form — use first one (the education fund)
  const donationForm = donationForms[0] ?? null

  // About excerpt for hero subheadline and mission panel
  const aboutExcerpt = aboutPage?.excerpt ?? null

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* 1. HERO                                                             */}
      {/* ------------------------------------------------------------------ */}
      <HomeHero subheadline={aboutExcerpt} />

      {/* ------------------------------------------------------------------ */}
      {/* 2. FEATURED COURSES                                                 */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="featured-courses-heading"
        className="w-full py-spacing-16 px-spacing-6 md:px-spacing-8 bg-color-background"
      >
        <div className="max-w-5xl mx-auto">
          {/* Section header row */}
          <div className="flex items-center justify-between mb-spacing-8 gap-spacing-4">
            <h2
              id="featured-courses-heading"
              className="font-[var(--font-heading)] font-bold text-2xl md:text-3xl text-color-text"
            >
              Featured Courses
            </h2>
            <Link
              href="/courses"
              className="shrink-0 text-sm font-semibold text-color-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-color-border-focus rounded-sm"
            >
              View all courses
              <span aria-hidden="true"> →</span>
            </Link>
          </div>

          {featuredCourses.length === 0 ? (
            <p className="text-color-text-muted text-center py-spacing-12">
              No courses available yet. Check back soon.
            </p>
          ) : (
            /* Horizontal scroll on mobile, 3-col grid on desktop */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-spacing-6">
              {featuredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  imageUrl={getCourseImageUrl(course)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 3. MISSION + DONATE                                                 */}
      {/* ------------------------------------------------------------------ */}
      <DonateBand
        missionExcerpt={aboutExcerpt}
        donationForm={donationForm}
        totalDonated={null}
      />

      {/* ------------------------------------------------------------------ */}
      {/* 4. RECENT POSTS                                                     */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="recent-posts-heading"
        className="w-full py-spacing-16 px-spacing-6 md:px-spacing-8 bg-color-background"
      >
        <div className="max-w-5xl mx-auto">
          {/* Section header row */}
          <div className="flex items-center justify-between mb-spacing-8 gap-spacing-4">
            <h2
              id="recent-posts-heading"
              className="font-[var(--font-heading)] font-bold text-2xl md:text-3xl text-color-text"
            >
              From the Blog
            </h2>
            <Link
              href="/blog"
              className="shrink-0 text-sm font-semibold text-color-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-color-border-focus rounded-sm"
            >
              Read the blog
              <span aria-hidden="true"> →</span>
            </Link>
          </div>

          {recentPosts.length === 0 ? (
            <p className="text-color-text-muted text-center py-spacing-12">
              No posts yet. Check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-spacing-6">
              {recentPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  imageUrl={getPostImageUrl(post)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 5. NEWSLETTER                                                       */}
      {/* ------------------------------------------------------------------ */}
      <NewsletterSection />
    </>
  )
}
