/**
 * Blog Tag — /blog/tag/[tagSlug]
 *
 * Async Server Component. Mirrors the /blog/category/[categorySlug] UI but
 * filtered to a single post_tag term. The tag slug comes from the dynamic path
 * segment; ?page= still controls pagination via searchParams.
 *
 * generateStaticParams pre-renders every post_tag slug at build time.
 * dynamicParams = true covers any slug added after build.
 */

import * as React from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
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
import { Breadcrumb } from '@/shared/ui/Breadcrumb'

// ---------------------------------------------------------------------------
// Static params + dynamic fallback
// ---------------------------------------------------------------------------

export const dynamicParams = true

export async function generateStaticParams() {
  const tags = await listTermsByTaxonomy('post_tag')
  return tags.map((term) => ({ tagSlug: term.slug }))
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PAGE_SIZE = 12
const SITE_URL = 'https://luthascenter.damieus.app'

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tagSlug: string }>
}): Promise<Metadata> {
  const { tagSlug } = await params
  const tags = await listTermsByTaxonomy('post_tag')
  const term = tags.find((t) => t.slug === tagSlug)
  if (!term) return {}

  const title = `${term.name} — Blog | Luthas Center for Excellence`
  const description = `Browse all posts tagged "${term.name}" — from mental health to business. Impossible to Inevitable.`
  const canonical = `${SITE_URL}/blog/tag/${tagSlug}`

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      images: [
        {
          url: '/placeholder-cover.svg',
          width: 1200,
          height: 630,
          alt: `${term.name} — Luthas Center Blog`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/placeholder-cover.svg'],
    },
  }
}

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

interface BlogTagPageProps {
  params: Promise<{ tagSlug: string }>
  searchParams: Promise<{ page?: string }>
}

export default async function BlogTagPage({
  params,
  searchParams,
}: BlogTagPageProps) {
  const { tagSlug } = await params
  const sp = await searchParams
  const page = Math.max(1, parseInt(sp.page ?? '1', 10) || 1)

  // Parallel data fetches — resolve tag name alongside posts
  const [posts, total, tags, categories] = await Promise.all([
    listPosts({ page, pageSize: PAGE_SIZE, tagSlug }),
    countPosts(undefined, tagSlug),
    listTermsByTaxonomy('post_tag'),
    listTermsByTaxonomy('category'),
  ])

  // Look up the term — 404 for unknown slugs
  const term = tags.find((t) => t.slug === tagSlug)
  if (!term) notFound()

  const totalPages = Math.ceil(total / PAGE_SIZE)

  // Resolve featured images in one batched call
  const imageIds = posts
    .map((p) => p.featured_image_id)
    .filter((id): id is number => typeof id === 'number' && id > 0)

  const mediaRows = imageIds.length > 0 ? await getMediaByWpIds(imageIds) : []
  const mediaById = new Map(mediaRows.map((m) => [m.wp_attachment_id ?? Number(m.id), m]))

  // Breadcrumb: Home / Blog / <Tag>
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: term.name },
  ]

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* PAGE HERO                                                            */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="tag-heading"
        className="bg-color-surface border-b border-color-border"
      >
        <div className="max-w-7xl mx-auto px-spacing-4 sm:px-spacing-8 pt-spacing-6 pb-spacing-12">
          <Breadcrumb items={breadcrumbItems} className="mb-spacing-4" />
          <div className="text-center">
            <h1
              id="tag-heading"
              className="font-[var(--font-heading)] font-bold text-4xl sm:text-5xl text-color-primary leading-tight mb-spacing-3"
            >
              #{term.name}
            </h1>
            <p className="text-base sm:text-lg text-color-text-muted max-w-2xl mx-auto leading-relaxed">
              {total} post{total === 1 ? '' : 's'} tagged with this topic
            </p>
          </div>
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
        aria-label={`${term.name} blog posts`}
        className="max-w-7xl mx-auto px-spacing-4 sm:px-spacing-8 py-spacing-8"
      >
        {/* Live region for screen readers */}
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {posts.length > 0
            ? `Showing ${posts.length} of ${total} post${total === 1 ? '' : 's'} tagged ${term.name}`
            : `No posts found tagged ${term.name}.`}
        </div>

        {/* Empty state */}
        {posts.length === 0 && (
          <div
            role="status"
            className="flex flex-col items-center justify-center py-spacing-20 text-center"
          >
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
              No posts are tagged with &ldquo;{term.name}&rdquo; yet. Check back
              soon.
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
              basePath={`/blog/tag/${tagSlug}`}
            />
          </React.Suspense>
        )}
      </main>
    </>
  )
}
