/**
 * Post Detail — /blog/[slug]
 *
 * Spec: docs/design/templates/post-detail.md
 *
 * Layout:
 *   - Breadcrumb + category pills + H1 + byline
 *   - Featured image (16:9, eager LCP)
 *   - Two-column: article body (Prose) + sticky sidebar share bar (desktop)
 *   - Tags row
 *   - Mobile share bar (below tags)
 *   - Related posts grid (same primary category, limit 3)
 *
 * generateStaticParams: pre-renders up to 200 slugs (most recent).
 * dynamicParams = true so remaining posts are rendered on demand.
 */

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getPostBySlug, listPosts } from '@/shared/lib/data-source'
import { getMediaByWpId, getMediaByWpIds } from '@/shared/lib/data-source'
import { resolveCoverUrl } from '@/shared/lib/data-source'
import { Breadcrumb } from '@/shared/ui/Breadcrumb'
import { Badge } from '@/shared/ui/Badge'
import { Avatar } from '@/shared/ui/Avatar'
import { Prose } from '@/shared/ui/Prose'
import { PostCard } from '@/entities/post/ui/PostCard'
import { ShareBar } from '@/widgets/post-detail'
import type { PostSummary } from '@/entities/post/model'
import type { MediaRow } from '@/entities/media/model'
import path from 'node:path'
import { readFileSync } from 'node:fs'
import { SITE_URL } from '@/shared/config/site'

// ---------------------------------------------------------------------------
// Static params + dynamic fallback
// ---------------------------------------------------------------------------

/** Cap to 200 most-recent slugs; the rest render on demand. */
export const dynamicParams = true

export async function generateStaticParams() {
  const posts = await listPosts({ page: 1, pageSize: 200 })
  return posts.map((p) => ({ slug: p.slug }))
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
  const post = await getPostBySlug(slug)
  if (!post) return {}

  const description = post.excerpt ?? undefined
  const canonical = `${SITE_URL}/blog/${slug}`

  const ogMedia = post.featured_image_id ? await getMediaByWpId(Number(post.featured_image_id)) : null
  const ogImageUrl = resolveCoverUrl(ogMedia, 'post', slug)

  return {
    title: post.title ?? undefined,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      title: post.title ?? undefined,
      description,
      url: canonical,
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.modified_at ?? undefined,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title ?? 'Blog post cover',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title ?? undefined,
      description,
      images: [ogImageUrl],
    },
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(iso: string | null): string {
  if (!iso) return ''
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(iso))
}

/** Estimate reading time from HTML content (words ÷ 200). */
function estimateReadingTime(html: string | null): number {
  if (!html) return 1
  const text = html.replace(/<[^>]*>/g, ' ')
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

/** Raw post shape from JSON (categories/tags/author live on the raw record). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RawPost = Record<string, any>

interface CategoryTerm { term_id: number; name: string; slug: string }
interface TagTerm { term_id: number; name: string; slug: string }
interface Author { id: number; name: string }

/** Read raw JSON post record to access categories/tags/author JSONB. */
function loadRawPost(slug: string): RawPost | null {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'extracted', '_sanitized', 'posts.json')
    const raw = JSON.parse(readFileSync(dataPath, 'utf-8')) as { records: RawPost[] }
    return raw.records.find((r) => r.slug === slug && r.status === 'publish') ?? null
  } catch {
    return null
  }
}

/** Load up to 3 related posts from the same primary category, excluding current slug. */
async function loadRelatedPosts(
  primaryCategorySlug: string | null,
  excludeSlug: string,
): Promise<PostSummary[]> {
  if (!primaryCategorySlug) return []
  const posts = await listPosts({ page: 1, pageSize: 50, categorySlug: primaryCategorySlug })
  return posts
    .filter((p) => p.slug !== excludeSlug)
    .slice(0, 3)
}

/** Load author avatar URL from profiles JSON by wp_user_id. */
function loadAuthorAvatarUrl(wpUserId: number | null): string | null {
  if (!wpUserId) return null
  try {
    const profilesPath = path.join(process.cwd(), 'data', 'extracted', '_sanitized', 'profiles.json')
    const raw = JSON.parse(readFileSync(profilesPath, 'utf-8')) as { records: RawPost[] }
    const profile = raw.records.find((r) => r.wp_id === wpUserId)
    return (profile?.avatar_url as string) ?? null
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  // Raw record carries categories/tags/author JSONB which mapPostRow discards
  const raw = loadRawPost(slug)
  const categories: CategoryTerm[] = raw?.categories ?? []
  const tags: TagTerm[] = raw?.tags ?? []
  const author: Author | null = raw?.author ?? null

  const primaryCategory = categories[0] ?? null
  const readingTime = post.reading_time ?? estimateReadingTime(post.content)

  // Featured image
  let featuredMedia: MediaRow | null = null
  if (post.featured_image_id) {
    featuredMedia = await getMediaByWpId(Number(post.featured_image_id))
  }
  // Use per-item branded SVG when real cover is missing
  const featuredImageUrl = resolveCoverUrl(featuredMedia, 'post', slug)
  const imageAlt = featuredMedia?.alt_text || post.title || 'Post featured image'
  const imageWidth = featuredMedia?.width ?? 1200
  const imageHeight = featuredMedia?.height ?? 675

  // Author avatar (best-effort)
  const authorAvatarUrl = loadAuthorAvatarUrl(author?.id ?? null)

  // Canonical URL (used for share bar; must be a string on server)
  const canonicalUrl = `${SITE_URL}/blog/${slug}`

  // Related posts
  const relatedPosts = await loadRelatedPosts(primaryCategory?.slug ?? null, slug)
  const relatedMediaIds = relatedPosts
    .filter((p) => p.featured_image_id != null)
    .map((p) => Number(p.featured_image_id))
  const relatedMediaRows = await getMediaByWpIds(relatedMediaIds)
  const mediaMap = new Map(relatedMediaRows.map((m) => [m.wp_attachment_id, m]))

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    ...(primaryCategory ? [{ label: primaryCategory.name, href: `/blog/category/${primaryCategory.slug}` }] : []),
    { label: post.title ?? 'Post' },
  ]

  const BASE_URL = SITE_URL
  const absImageUrl = featuredImageUrl.startsWith('/')
    ? `${BASE_URL}${featuredImageUrl}`
    : featuredImageUrl

  // JSON-LD: Article (BlogPosting)
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title ?? '',
    description: post.excerpt ?? '',
    url: canonicalUrl,
    image: absImageUrl,
    ...(post.published_at ? { datePublished: post.published_at } : {}),
    ...(post.modified_at ? { dateModified: post.modified_at } : {}),
    ...(author ? { author: { '@type': 'Person', name: author.name } } : {
      author: { '@type': 'Organization', name: 'Luthas Center for Excellence' },
    }),
    publisher: {
      '@type': 'Organization',
      name: 'Luthas Center for Excellence',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/favicon.ico`,
      },
    },
  }

  // JSON-LD: BreadcrumbList
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE_URL}/blog` },
      ...(primaryCategory
        ? [{ '@type': 'ListItem', position: 3, name: primaryCategory.name, item: `${BASE_URL}/blog/category/${primaryCategory.slug}` }]
        : []),
      { '@type': 'ListItem', position: primaryCategory ? 4 : 3, name: post.title ?? 'Post', item: canonicalUrl },
    ],
  }

  return (
    <div className="bg-color-background">
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* ------------------------------------------------------------------ */}
      {/* Header zone: breadcrumb, category pills, title, byline              */}
      {/* ------------------------------------------------------------------ */}
      <div className="max-w-[1200px] mx-auto px-spacing-4 sm:px-spacing-6 lg:px-spacing-8 pt-spacing-6 pb-spacing-4">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} className="mb-spacing-4" />

        {/* Category pills */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-spacing-2 mb-spacing-3" role="list" aria-label="Post categories">
            {categories.map((cat) => (
              <Link
                key={cat.term_id}
                href={`/blog/category/${cat.slug}`}
                role="listitem"
                className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-color-border-focus rounded-radius-full"
              >
                <Badge variant="accent">{cat.name}</Badge>
              </Link>
            ))}
          </div>
        )}

        {/* Post title */}
        <h1 className="font-[var(--font-heading)] font-bold text-3xl lg:text-4xl text-color-text leading-[var(--leading-tight)] mb-spacing-4 max-w-[65ch]">
          {post.title}
        </h1>

        {/* Byline */}
        <div className="flex flex-wrap items-center gap-spacing-3 text-sm text-color-text-muted mb-spacing-6">
          <span className="flex items-center gap-spacing-2">
            <Avatar
              src={authorAvatarUrl}
              name={author?.name ?? undefined}
              size="sm"
            />
            {author?.name && (
              <span className="font-medium text-color-text">{author.name}</span>
            )}
          </span>

          {post.published_at && (
            <>
              <span aria-hidden="true">·</span>
              <time dateTime={post.published_at}>
                {formatDate(post.published_at)}
              </time>
            </>
          )}

          {readingTime && (
            <>
              <span aria-hidden="true">·</span>
              <span>{readingTime} min read</span>
            </>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Featured image                                                       */}
      {/* ------------------------------------------------------------------ */}
      <div className="max-w-[1200px] mx-auto px-spacing-4 sm:px-spacing-6 lg:px-spacing-8 mb-spacing-8">
        <figure>
          <div className="relative w-full aspect-video overflow-hidden rounded-[var(--radius-md)]">
            <Image
              src={featuredImageUrl}
              alt={imageAlt}
              width={imageWidth}
              height={imageHeight}
              priority
              loading="eager"
              className="object-cover w-full h-full"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
            />
          </div>
          {featuredMedia?.title && (
            <figcaption className="text-xs text-color-text-muted mt-spacing-2 text-center">
              {featuredMedia.title}
            </figcaption>
          )}
        </figure>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Article body + sidebar (desktop two-column)                         */}
      {/* ------------------------------------------------------------------ */}
      <div className="max-w-[1200px] mx-auto px-spacing-4 sm:px-spacing-6 lg:px-spacing-8">
        <div className="lg:grid lg:grid-cols-[1fr_200px] lg:gap-spacing-12">

          {/* Article body */}
          <article aria-label={post.title ?? 'Article'}>
            {post.content ? (
              <Prose
                html={post.content}
                className="max-w-[65ch]"
              />
            ) : (
              <p className="text-color-text-muted italic">Content not available.</p>
            )}

            {/* Tags row */}
            {tags.length > 0 && (
              <div className="mt-spacing-8 pt-spacing-6 border-t border-color-border">
                <ul
                  role="list"
                  aria-label="Post tags"
                  className="flex flex-wrap gap-spacing-2"
                >
                  {tags.map((tag) => (
                    <li key={tag.term_id}>
                      <Link
                        href={`/blog/tag/${tag.slug}`}
                        className="inline-flex items-center px-spacing-2 py-spacing-1 rounded-[var(--radius-sm)] bg-color-surface text-xs text-color-text-muted hover:text-color-primary transition-colors duration-[var(--duration-fast)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-color-border-focus"
                      >
                        #{tag.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Mobile share bar — visible below md */}
            <div className="mt-spacing-6 lg:hidden">
              <ShareBar
                url={canonicalUrl}
                title={post.title ?? ''}
                orientation="horizontal"
              />
            </div>
          </article>

          {/* Desktop sticky sidebar — hidden on mobile */}
          <aside
            aria-label="Share links"
            className="hidden lg:block"
          >
            <div className="sticky top-spacing-20">
              <ShareBar
                url={canonicalUrl}
                title={post.title ?? ''}
                orientation="vertical"
              />
            </div>
          </aside>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Related posts                                                        */}
      {/* ------------------------------------------------------------------ */}
      {relatedPosts.length > 0 && (
        <section
          aria-labelledby="related-heading"
          className="max-w-[1200px] mx-auto px-spacing-4 sm:px-spacing-6 lg:px-spacing-8 mt-spacing-16 pb-spacing-16"
        >
          <h2
            id="related-heading"
            className="font-[var(--font-heading)] font-semibold text-2xl text-color-text mb-spacing-8"
          >
            Related Posts
          </h2>

          <div className="grid gap-spacing-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((related) => {
              const relMedia = related.featured_image_id
                ? mediaMap.get(Number(related.featured_image_id)) ?? null
                : null
              const relImageUrl = resolveCoverUrl(relMedia, 'post', related.slug)

              // Raw record for related post categories
              const relRaw = loadRawPost(related.slug)
              const relCategories: CategoryTerm[] = relRaw?.categories ?? []
              const relPrimaryCategory = relCategories[0]?.name ?? null

              return (
                <PostCard
                  key={related.id}
                  post={related}
                  imageUrl={relImageUrl}
                  category={relPrimaryCategory}
                />
              )
            })}
          </div>
        </section>
      )}

      {/* Empty state: no related posts — no section rendered (by design) */}
    </div>
  )
}
