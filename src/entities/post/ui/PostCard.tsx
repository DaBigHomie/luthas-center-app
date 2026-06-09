/**
 * PostCard — entity-level card for blog listing, editorial grids,
 * and "Related Articles" sections.
 *
 * Parent Server Components should call resolveMediaUrl(mediaRow) from
 * @/shared/lib/data-source and pass the result as `imageUrl`.
 * This component is pure presentational (no server imports).
 */

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card } from '@/shared/ui/Card'
import { Badge } from '@/shared/ui/Badge'
import { Avatar } from '@/shared/ui/Avatar'
import type { PostSummary } from '@/entities/post/model'

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface PostCardProps {
  post: PostSummary
  /** Pre-resolved featured image URL from parent Server Component. */
  imageUrl: string
  /** Author display name (resolved by parent from profiles). */
  authorName?: string | null
  /** Author avatar URL (pre-resolved by parent). */
  authorAvatarUrl?: string | null
  /** Category name (resolved by parent from term_relationships + terms). */
  category?: string | null
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(iso: string | null): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function readTimeLabel(minutes: number | null): string {
  if (!minutes) return ''
  return `${minutes} min read`
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PostCard({
  post,
  imageUrl,
  authorName,
  authorAvatarUrl,
  category,
}: PostCardProps) {
  const href = `/blog/${post.slug}`

  return (
    <Card
      as="article"
      variant="default"
      aria-label={post.title ?? undefined}
      className="flex flex-col min-w-[260px]"
    >
      {/* Featured image — 16:9 */}
      <Link href={href} tabIndex={-1} aria-hidden="true" className="block">
        <div className="relative w-full aspect-video overflow-hidden">
          <Image
            src={imageUrl}
            alt={post.title ?? 'Post cover'}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-[var(--duration-base)] group-hover:scale-[1.02]"
            loading="lazy"
          />
        </div>
      </Link>

      <Card.Body className="flex-1 flex flex-col gap-spacing-2">
        {/* Category tag */}
        {category && (
          <Badge variant="accent" className="self-start">
            {category}
          </Badge>
        )}

        {/* Title */}
        <Card.Title>
          <Link
            href={href}
            className="line-clamp-2 hover:text-color-primary transition-colors duration-[var(--duration-fast)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-color-border-focus rounded-sm"
          >
            {post.title ?? 'Untitled Post'}
          </Link>
        </Card.Title>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-sm text-color-text-muted line-clamp-3 leading-[var(--leading-relaxed)]">
            {post.excerpt}
          </p>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        <Card.Divider />

        {/* Author + meta row */}
        <Card.Meta className="flex-wrap gap-spacing-2">
          {/* Avatar + author name */}
          <span className="flex items-center gap-spacing-2">
            <Avatar
              src={authorAvatarUrl}
              name={authorName ?? undefined}
              size="sm"
            />
            {authorName && (
              <span className="text-sm text-color-text-muted font-medium truncate max-w-[120px]">
                {authorName}
              </span>
            )}
          </span>

          {/* Dot separator */}
          {(post.published_at || post.reading_time) && (
            <span aria-hidden="true" className="text-color-border">·</span>
          )}

          {/* Date */}
          {post.published_at && (
            <time
              dateTime={post.published_at}
              className="text-sm text-color-text-muted"
            >
              {formatDate(post.published_at)}
            </time>
          )}

          {/* Reading time */}
          {post.reading_time != null && post.reading_time > 0 && (
            <span className="text-sm text-color-text-muted">
              {readTimeLabel(post.reading_time)}
            </span>
          )}
        </Card.Meta>
      </Card.Body>
    </Card>
  )
}

PostCard.displayName = 'PostCard'
