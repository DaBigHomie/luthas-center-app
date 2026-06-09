/**
 * Prose — renders trusted WordPress HTML via dangerouslySetInnerHTML.
 *
 * Server Component. Content is sanitized server-side with sanitize-html and
 * internal links/images are rewritten to new routes before rendering.
 *
 * Typography is built from design tokens (no raw hex, no Tailwind Typography
 * plugin dependency). Headings use font-heading; links use text-accent.
 */

import 'server-only'
import * as React from 'react'
import sanitizeHtml from 'sanitize-html'
import { cn } from '@/shared/lib/utils'
import { REDIRECT_MAP } from '@/shared/config/redirects.generated'

// ---------------------------------------------------------------------------
// Internal-URL patterns for luthascenter.local (dev WP host) and
// absolute old-WP paths that should be rewritten to new routes.
// ---------------------------------------------------------------------------

const INTERNAL_ORIGINS = [
  'https://luthascenter.local',
  'http://luthascenter.local',
  'https://www.luthascenter.local',
  'http://www.luthascenter.local',
  'https://luthascenter.com',
  'http://luthascenter.com',
  'https://www.luthascenter.com',
  'http://www.luthascenter.com',
]

/**
 * Strip any known internal origin from an absolute URL, returning a root-
 * relative path (e.g. "/courses/agile-foundations"). Returns null when the URL
 * cannot be matched to an internal origin.
 */
function toInternalPath(href: string): string | null {
  for (const origin of INTERNAL_ORIGINS) {
    if (href.startsWith(origin + '/') || href === origin) {
      return href.slice(origin.length) || '/'
    }
  }
  return null
}

/**
 * Lookup a path in the redirect map (normalise trailing slash first).
 * Returns the mapped new path or the original path if not found.
 */
function resolveInternalPath(rawPath: string): string {
  const normalised = rawPath.length > 1 ? rawPath.replace(/\/$/, '') : rawPath
  return REDIRECT_MAP[normalised] ?? normalised
}

// ---------------------------------------------------------------------------
// sanitize-html configuration
// ---------------------------------------------------------------------------

const ALLOWED_TAGS = [
  // Structure
  'p', 'br', 'hr', 'div', 'span', 'section', 'article', 'header', 'footer',
  'main', 'aside', 'nav',
  // Headings
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  // Inline
  'a', 'abbr', 'acronym', 'b', 'bdo', 'big', 'blockquote', 'cite', 'code',
  'del', 'dfn', 'em', 'i', 'ins', 'kbd', 'mark', 'q', 's', 'samp', 'small',
  'strong', 'sub', 'sup', 'time', 'tt', 'u', 'var',
  // Lists
  'dd', 'dl', 'dt', 'li', 'ol', 'ul',
  // Tables
  'caption', 'col', 'colgroup', 'table', 'tbody', 'td', 'tfoot', 'th',
  'thead', 'tr',
  // Media
  'figure', 'figcaption', 'img', 'picture', 'source',
  // Pre / code
  'pre',
  // Misc
  'details', 'summary',
]

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ALLOWED_TAGS,
  allowedAttributes: {
    '*': ['class', 'id', 'style', 'aria-label', 'aria-hidden', 'role',
          'data-*', 'tabindex'],
    a: ['href', 'title', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height', 'loading', 'decoding',
          'srcset', 'sizes'],
    source: ['src', 'srcset', 'type', 'media'],
    td: ['colspan', 'rowspan'],
    th: ['colspan', 'rowspan', 'scope'],
    time: ['datetime'],
    blockquote: ['cite'],
    del: ['datetime'],
    ins: ['datetime'],
  },
  allowedSchemes: ['https', 'http', 'mailto', 'tel'],
  // Rewrite internal links and drop unreachable .local image sources
  transformTags: {
    a(tagName, attribs) {
      const href = attribs.href ?? ''
      const internalPath = toInternalPath(href)
      if (internalPath !== null) {
        return {
          tagName,
          attribs: {
            ...attribs,
            href: resolveInternalPath(internalPath),
          },
        }
      }
      // External links — ensure safe rel
      if (href.startsWith('http')) {
        return {
          tagName,
          attribs: {
            ...attribs,
            target: '_blank',
            rel: 'noopener noreferrer',
          },
        }
      }
      return { tagName, attribs }
    },
    img(tagName, attribs) {
      const src = attribs.src ?? ''
      const internalPath = toInternalPath(src)
      if (internalPath !== null) {
        // Internal image from .local host — replace with placeholder
        return {
          tagName,
          attribs: {
            ...attribs,
            src: '/placeholder-cover.svg',
            srcset: '',
            sizes: '',
          },
        }
      }
      // External image: pass through unchanged (src may be a CDN or Supabase URL)
      return { tagName, attribs }
    },
  },
}

// ---------------------------------------------------------------------------
// Sanitize helper
// ---------------------------------------------------------------------------

function sanitize(html: string): string {
  return sanitizeHtml(html, SANITIZE_OPTIONS)
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export interface ProseProps {
  html: string
  className?: string
}

export function Prose({ html, className }: ProseProps) {
  const clean = sanitize(html)

  return (
    <div
      className={cn(
        // Base text
        'text-color-text leading-[var(--leading-relaxed)] text-base',
        // Headings
        '[&_h1]:font-[var(--font-heading)] [&_h1]:font-bold [&_h1]:text-3xl [&_h1]:text-color-text [&_h1]:leading-[var(--leading-tight)] [&_h1]:mt-spacing-8 [&_h1]:mb-spacing-3',
        '[&_h2]:font-[var(--font-heading)] [&_h2]:font-semibold [&_h2]:text-2xl [&_h2]:text-color-text [&_h2]:leading-[var(--leading-tight)] [&_h2]:mt-spacing-8 [&_h2]:mb-spacing-3',
        '[&_h3]:font-[var(--font-heading)] [&_h3]:font-semibold [&_h3]:text-xl [&_h3]:text-color-text [&_h3]:leading-[var(--leading-tight)] [&_h3]:mt-spacing-6 [&_h3]:mb-spacing-2',
        '[&_h4]:font-[var(--font-heading)] [&_h4]:font-semibold [&_h4]:text-lg [&_h4]:text-color-text [&_h4]:mt-spacing-6 [&_h4]:mb-spacing-2',
        '[&_h5]:font-semibold [&_h5]:text-base [&_h5]:text-color-text [&_h5]:mt-spacing-4 [&_h5]:mb-spacing-1',
        '[&_h6]:font-semibold [&_h6]:text-sm [&_h6]:text-color-text-muted [&_h6]:mt-spacing-4 [&_h6]:mb-spacing-1',
        // Paragraphs
        '[&_p]:my-spacing-4',
        // Links
        '[&_a]:text-color-accent [&_a]:underline [&_a]:underline-offset-2 [&_a]:transition-[color,opacity] [&_a]:duration-[var(--duration-fast)]',
        '[&_a:hover]:opacity-80',
        '[&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-2 [&_a:focus-visible]:outline-color-border-focus [&_a:focus-visible]:rounded-sm',
        // Lists
        '[&_ul]:my-spacing-4 [&_ul]:list-disc [&_ul]:pl-spacing-6',
        '[&_ol]:my-spacing-4 [&_ol]:list-decimal [&_ol]:pl-spacing-6',
        '[&_li]:my-spacing-1',
        // Blockquote
        '[&_blockquote]:border-l-4 [&_blockquote]:border-color-accent [&_blockquote]:pl-spacing-4 [&_blockquote]:my-spacing-6 [&_blockquote]:text-color-text-muted [&_blockquote]:italic',
        // Code
        '[&_code]:bg-color-surface-raised [&_code]:text-color-text [&_code]:text-sm [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-[var(--radius-sm)] [&_code]:font-mono',
        '[&_pre]:bg-color-surface-raised [&_pre]:rounded-[var(--radius-md)] [&_pre]:p-spacing-4 [&_pre]:my-spacing-6 [&_pre]:overflow-x-auto',
        '[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-sm',
        // Images
        '[&_img]:rounded-[var(--radius-md)] [&_img]:my-spacing-6 [&_img]:max-w-full [&_img]:h-auto',
        // Horizontal rule
        '[&_hr]:border-color-border [&_hr]:my-spacing-8',
        // Tables
        '[&_table]:w-full [&_table]:my-spacing-6 [&_table]:border-collapse [&_table]:text-sm',
        '[&_th]:text-left [&_th]:font-semibold [&_th]:text-color-text [&_th]:border-b [&_th]:border-color-border [&_th]:pb-spacing-2 [&_th]:pr-spacing-4',
        '[&_td]:border-b [&_td]:border-color-border [&_td]:py-spacing-2 [&_td]:pr-spacing-4 [&_td]:text-color-text-muted',
        // First/last child spacing reset
        '[&>*:first-child]:mt-0 [&>*:last-child]:mb-0',
        className,
      )}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  )
}

Prose.displayName = 'Prose'
