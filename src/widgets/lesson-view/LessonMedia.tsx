/**
 * LessonMedia — renders the lesson video embed, featured image, or placeholder.
 * Server component.
 */

import Image from 'next/image'
import type { MediaRow } from '@/entities/media/model'

interface LessonMediaProps {
  title: string
  videoUrl: string | null | undefined
  imageUrl: string | null
  imageRow: MediaRow | null
}

/** Convert a YouTube or Vimeo watch URL to embed URL. */
function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url)
    // YouTube
    const ytId =
      u.searchParams.get('v') ??
      (u.hostname === 'youtu.be' ? u.pathname.slice(1) : null)
    if (ytId) return `https://www.youtube-nocookie.com/embed/${ytId}?rel=0`
    // Vimeo
    if (u.hostname.includes('vimeo.com')) {
      const id = u.pathname.split('/').filter(Boolean).pop()
      if (id) return `https://player.vimeo.com/video/${id}`
    }
    return null
  } catch {
    return null
  }
}

export function LessonMedia({ title, videoUrl, imageUrl, imageRow }: LessonMediaProps) {
  const embedUrl = videoUrl ? toEmbedUrl(videoUrl) : null

  return (
    <div className="relative w-full aspect-video rounded-radius-md overflow-hidden bg-color-surface-raised">
      {embedUrl ? (
        <>
          <iframe
            src={embedUrl}
            title={`${title} — video`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
          {/* Accessible fallback */}
          <p className="sr-only">
            <a href={videoUrl ?? '#'} target="_blank" rel="noopener noreferrer">
              Watch on external site
            </a>
          </p>
        </>
      ) : imageUrl ? (
        <Image
          src={imageUrl}
          alt={imageRow?.alt_text || `Lesson image for ${title}`}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 60vw"
          width={imageRow?.width ?? undefined}
          height={imageRow?.height ?? undefined}
        />
      ) : (
        /* Branded placeholder */
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-spacing-3">
          <svg
            aria-hidden="true"
            viewBox="0 0 64 64"
            fill="currentColor"
            className="size-16 text-color-accent opacity-40"
          >
            <path d="M32 6C17.64 6 6 17.64 6 32s11.64 26 26 26 26-11.64 26-26S46.36 6 32 6zm-6 37V21l18 11-18 11z" />
          </svg>
          <p className="text-sm text-color-text-muted text-center px-spacing-4">{title}</p>
        </div>
      )}
    </div>
  )
}
