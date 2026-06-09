/**
 * Blog List — /blog
 *
 * Async Server Component. Reads ?page= and ?category= from searchParams,
 * fetches posts + categories + media/author data through the JSON-fallback
 * adapter, then renders the full blog list layout.
 *
 * Client interactivity (filter pills, pagination) lives in widgets that wrap
 * Suspense boundaries so they can safely use useSearchParams.
 */

import * as React from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import {
  listPosts,
  countPosts,
  listTermsByTaxonomy,
  getMediaByWpIds,
  resolveCoverUrl,
} from '@/shared/lib/data-source'
import { PostCard } from '@/entities/post/ui/PostCard'
import { Skeleton } from '@/shared/ui'
import { BlogFilterBar } from '@/widgets/blog-filter-bar'
import { BlogPagination } from '@/widgets/blog-pagination'

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Blog — Luthas Center for Excellence',
  description:
    'Stories, guides, and community — from mental health to business. Impossible to Inevitable.',
  alternates: {
    canonical: 'https://luthascenter.damieus.app/blog',
  },
  openGraph: {
    title: 'Blog — Luthas Center for Excellence',
    description:
      'Stories, guides, and community — from mental health to business. Impossible to Inevitable.',
    url: 'https://luthascenter.damieus.app/blog',
    images: [
      {
        url: '/placeholder-cover.svg',
        width: 1200,
        height: 630,
        alt: 'Luthas Center Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog — Luthas Center for Excellence',
    description:
      'Stories, guides, and community — from mental health to business. Impossible to Inevitable.',
    images: ['/placeholder-cover.svg'],
  },
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PAGE_SIZE = 12

// ---------------------------------------------------------------------------
// Loading fallback for client filter/pagination widgets
// ---------------------------------------------------------------------------

function FilterBarSkeleton() {
  return (
    <div className="sticky top-0 z-20 bg-color-background border-b border-color-border">
      <div className="max-w-7xl mx-auto px-spacing-4 sm:px-spacing-8 py-spacing-3 flex gap-spacing-2 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-radius-full shrink-0" />
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

interface BlogPageProps {
  searchParams: Promise<{ page?: string; category?: string }>
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams
  const page = Math.max(1, parseInt(params.page ?? '1', 10) || 1)
  const categorySlug = params.category ?? ''

  // Parallel data fetches
  const [posts, total, categories] = await Promise.all([
    listPosts({ page, pageSize: PAGE_SIZE, categorySlug: categorySlug || undefined }),
    countPosts(categorySlug || undefined),
    listTermsByTaxonomy('category'),
  ])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  // Resolve featured images in one batched call
  const imageIds = posts
    .map((p) => p.featured_image_id)
    .filter((id): id is number => typeof id === 'number' && id > 0)

  const mediaRows = imageIds.length > 0 ? await getMediaByWpIds(imageIds) : []
  const mediaById = new Map(mediaRows.map((m) => [m.wp_attachment_id ?? Number(m.id), m]))

  // Build enriched card data (author resolution is omitted for now — posts
  // store author_id as a WP user id but profiles are Supabase auth; in JSON
  // mode posts embed author display_name on the raw record which mapPostSummary
  // doesn't surface — so we omit authorName gracefully as PostCard handles null)

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* PAGE HERO                                                            */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="blog-heading"
        className="bg-color-surface border-b border-color-border"
      >
        <div className="max-w-7xl mx-auto px-spacing-4 sm:px-spacing-8 py-spacing-12 text-center">
          <h1
            id="blog-heading"
            className="font-[var(--font-heading)] font-bold text-4xl sm:text-5xl text-color-primary leading-tight mb-spacing-3"
          >
            Blog
          </h1>
          <p className="text-base sm:text-lg text-color-text-muted max-w-2xl mx-auto leading-relaxed">
            Stories, guides, and community — from mental health to business.
            Impossible to Inevitable.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* CATEGORY FILTER BAR (client — Suspense for useSearchParams)         */}
      {/* ------------------------------------------------------------------ */}
      <React.Suspense fallback={<FilterBarSkeleton />}>
        <BlogFilterBar categories={categories} />
      </React.Suspense>

      {/* ------------------------------------------------------------------ */}
      {/* MAIN CONTENT                                                         */}
      {/* ------------------------------------------------------------------ */}
      <main
        id="main-content"
        aria-label="Blog posts"
        className="max-w-7xl mx-auto px-spacing-4 sm:px-spacing-8 py-spacing-8"
      >
        {/* Live region for screen readers to announce result count */}
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {posts.length > 0
            ? `Showing ${posts.length} of ${total} post${total === 1 ? '' : 's'}${categorySlug ? ` in category ${categorySlug}` : ''}`
            : `No posts found${categorySlug ? ` for category ${categorySlug}` : ''}.`}
        </div>

        {/* Empty state */}
        {posts.length === 0 && (
          <div
            role="status"
            className="flex flex-col items-center justify-center py-spacing-20 text-center"
          >
            {/* Placeholder illustration */}
            <Image
              src="/placeholder-cover.svg"
              alt=""
              width={120}
              height={120}
              className="mb-spacing-6 opacity-40"
              aria-hidden="true"
            />
            <p className="text-xl font-semibold text-color-text mb-spacing-2">
              No posts found
            </p>
            <p className="text-color-text-muted max-w-sm">
              {categorySlug
                ? `No posts matched the category "${categorySlug}". Try selecting a different filter.`
                : 'No posts are available right now. Check back soon.'}
            </p>
          </div>
        )}

        {/* Post card grid */}
        {posts.length > 0 && (
          <div
            aria-busy="false"
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-spacing-6"
          >
            {posts.map((post) => {
              const mediaRow = post.featured_image_id
                ? (mediaById.get(post.featured_image_id) ?? null)
                : null
              const imageUrl = resolveCoverUrl(mediaRow, 'post', post.slug)

              return (
                <PostCard
                  key={post.id}
                  post={post}
                  imageUrl={imageUrl}
                  authorName={null}
                  authorAvatarUrl={null}
                  category={null}
                />
              )
            })}
          </div>
        )}

        {/* Pagination (client — Suspense for useSearchParams) */}
        {totalPages > 1 && (
          <React.Suspense fallback={null}>
            <BlogPagination
              currentPage={page}
              totalPages={totalPages}
            />
          </React.Suspense>
        )}
      </main>
    </>
  )
}
