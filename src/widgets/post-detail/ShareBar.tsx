/**
 * ShareBar — horizontal (mobile) and vertical (desktop sidebar) share widget.
 *
 * Client component: uses window.location + navigator.share / clipboard.
 * Renders icon buttons for Copy Link, Facebook, X (Twitter), and LinkedIn.
 * An aria-live region announces clipboard success per spec a11y requirements.
 */

'use client'

import * as React from 'react'
import { cn } from '@/shared/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ShareBarProps {
  /** The canonical URL to share (passed from server; avoids SSR/client mismatch). */
  url: string
  /** Post title used in share text. */
  title: string
  /** 'horizontal' (mobile, below tags) or 'vertical' (desktop sticky sidebar). */
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

// ---------------------------------------------------------------------------
// Icon SVGs (inline, design-token colours via currentColor)
// ---------------------------------------------------------------------------

function IconLink() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}

function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function IconX() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.261 5.633 5.903-5.633zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Share button
// ---------------------------------------------------------------------------

interface ShareButtonProps {
  href?: string
  onClick?: () => void
  ariaLabel: string
  children: React.ReactNode
}

function ShareButton({ href, onClick, ariaLabel, children }: ShareButtonProps) {
  const cls = cn(
    'flex items-center justify-center size-10 rounded-[var(--radius-md)]',
    'bg-color-surface-raised text-color-accent',
    'hover:bg-color-accent hover:text-color-text-inverse',
    'transition-colors duration-[var(--duration-fast)]',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-color-border-focus',
  )

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className={cls}
      >
        {children}
      </a>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={cls}
    >
      {children}
    </button>
  )
}

// ---------------------------------------------------------------------------
// ShareBar
// ---------------------------------------------------------------------------

export function ShareBar({ url, title, orientation = 'horizontal', className }: ShareBarProps) {
  const [copied, setCopied] = React.useState(false)

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const fbHref = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
  const xHref = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`
  const liHref = `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`

  async function handleCopy() {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(url)
      } else {
        // Fallback for older browsers
        const el = document.createElement('textarea')
        el.value = url
        document.body.appendChild(el)
        el.select()
        document.execCommand('copy')
        document.body.removeChild(el)
      }
    } catch {
      // silent — clipboard may be blocked
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const isVertical = orientation === 'vertical'

  return (
    <aside
      aria-label="Share links"
      className={cn('flex gap-spacing-2', isVertical ? 'flex-col items-center' : 'flex-row flex-wrap items-center', className)}
    >
      {/* Label */}
      <span className={cn('text-xs font-medium text-color-text-muted uppercase tracking-wide select-none', isVertical ? 'mb-spacing-1' : 'mr-spacing-1')}>
        Share
      </span>

      <ShareButton onClick={handleCopy} ariaLabel={copied ? 'Link copied to clipboard' : 'Copy link'}>
        <IconLink />
      </ShareButton>

      <ShareButton href={fbHref} ariaLabel="Share on Facebook">
        <IconFacebook />
      </ShareButton>

      <ShareButton href={xHref} ariaLabel="Share on X (Twitter)">
        <IconX />
      </ShareButton>

      <ShareButton href={liHref} ariaLabel="Share on LinkedIn">
        <IconLinkedIn />
      </ShareButton>

      {/* Accessible live announcement for copy action */}
      <span
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {copied ? 'Link copied to clipboard' : ''}
      </span>
    </aside>
  )
}

ShareBar.displayName = 'ShareBar'
