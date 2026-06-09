/**
 * Prose — renders trusted WordPress HTML via dangerouslySetInnerHTML.
 *
 * Server Component. Content is run through the WP_CLEAN_PIPELINE first
 * (strip Gutenberg comments, unwrap shortcodes, rewrite internal links,
 * replace unreachable images), then sanitized with sanitize-html as the
 * final safety net before rendering.
 *
 * Typography is built from design tokens (no raw hex, no Tailwind Typography
 * plugin dependency). Headings use font-heading; links use text-accent.
 */

import 'server-only'
import * as React from 'react'
import sanitizeHtml from 'sanitize-html'
import { cn } from '@/shared/lib/utils'
import { REDIRECT_MAP } from '@/shared/config/redirects.generated'
import { applyTransforms, WP_CLEAN_PIPELINE } from '@/shared/lib/wp-content'

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
  // External links — ensure safe rel/target attributes.
  // Internal link rewriting and unreachable image replacement are handled
  // upstream by WP_CLEAN_PIPELINE before sanitize-html runs.
  transformTags: {
    a(tagName, attribs) {
      const href = attribs.href ?? ''
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
  },
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export interface ProseProps {
  html: string
  className?: string
}

export function Prose({ html, className }: ProseProps) {
  // Step 1: run the WP transform pipeline (strips comments, shortcodes,
  //         rewrites internal links, replaces unreachable images).
  const pipelined = applyTransforms(html, WP_CLEAN_PIPELINE, {
    redirectMap: REDIRECT_MAP,
  })
  // Step 2: sanitize-html as the final safety net.
  const clean = sanitizeHtml(pipelined, SANITIZE_OPTIONS)

  return (
    <div
      className={cn(
        // Base text
        'text-color-text leading-[var(--leading-relaxed)] text-base',
        // Headings
        '[&_h1]:font-[var(--font-heading)] [&_h1]:font-bold [&_h1]:text-3xl [&_h1]:text-color-heading [&_h1]:leading-[var(--leading-tight)] [&_h1]:mt-spacing-8 [&_h1]:mb-spacing-3',
        '[&_h2]:font-[var(--font-heading)] [&_h2]:font-semibold [&_h2]:text-2xl [&_h2]:text-color-heading [&_h2]:leading-[var(--leading-tight)] [&_h2]:mt-spacing-8 [&_h2]:mb-spacing-3',
        '[&_h3]:font-[var(--font-heading)] [&_h3]:font-semibold [&_h3]:text-xl [&_h3]:text-color-heading [&_h3]:leading-[var(--leading-tight)] [&_h3]:mt-spacing-6 [&_h3]:mb-spacing-2',
        '[&_h4]:font-[var(--font-heading)] [&_h4]:font-semibold [&_h4]:text-lg [&_h4]:text-color-heading [&_h4]:mt-spacing-6 [&_h4]:mb-spacing-2',
        '[&_h5]:font-semibold [&_h5]:text-base [&_h5]:text-color-heading [&_h5]:mt-spacing-4 [&_h5]:mb-spacing-1',
        '[&_h6]:font-semibold [&_h6]:text-sm [&_h6]:text-color-text-muted [&_h6]:mt-spacing-4 [&_h6]:mb-spacing-1',
        // Paragraphs
        '[&_p]:my-spacing-4',
        // Links
        '[&_a]:text-color-accent [&_a]:underline [&_a]:underline-offset-2 [&_a]:transition-[color,opacity] [&_a]:duration-[var(--duration-fast)]',
        '[&_a:hover]:opacity-80',
        '[&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-2 [&_a:focus-visible]:outline-color-ring [&_a:focus-visible]:rounded-sm',
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
