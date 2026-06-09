'use client'

/**
 * BlogFilterBar — horizontally scrollable category pill filter.
 *
 * Reads current category from the URL (?category=slug) and pushes a new URL
 * when a pill is selected. Built as a Client Component so it can call
 * useRouter/useSearchParams without suspense boundaries on the server.
 *
 * Accessibility: role="radiogroup" + role="radio" pills, arrow-key navigation.
 */

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/shared/lib/utils'
import type { TermRow } from '@/entities/term/model'

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface BlogFilterBarProps {
  categories: TermRow[]
  /** Base path to push to (default: "/blog"). */
  basePath?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function BlogFilterBar({ categories, basePath = '/blog' }: BlogFilterBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category') ?? ''

  const pills: Array<{ name: string; slug: string }> = [
    { name: 'All', slug: '' },
    ...categories.map((t) => ({ name: t.name, slug: t.slug })),
  ]

  function handleSelect(slug: string) {
    const params = new URLSearchParams(searchParams.toString())
    // Always reset page to 1 when changing category
    params.delete('page')
    if (slug) {
      params.set('category', slug)
    } else {
      params.delete('category')
    }
    const qs = params.toString()
    router.push(`${basePath}${qs ? `?${qs}` : ''}`)
  }

  // Arrow-key navigation within the radiogroup
  function handleKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, idx: number) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      const next = (idx + 1) % pills.length
      ;(e.currentTarget.parentElement?.parentElement?.children[next] as HTMLElement)
        ?.querySelector('button')
        ?.focus()
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      const prev = (idx - 1 + pills.length) % pills.length
      ;(e.currentTarget.parentElement?.parentElement?.children[prev] as HTMLElement)
        ?.querySelector('button')
        ?.focus()
    }
  }

  return (
    <nav aria-label="Blog categories" className="sticky top-0 z-20 bg-color-background border-b border-color-border">
      <div className="max-w-7xl mx-auto px-spacing-4 sm:px-spacing-8">
        <div
          role="radiogroup"
          aria-label="Filter posts by category"
          className="flex gap-spacing-2 overflow-x-auto py-spacing-3 scrollbar-none"
          style={{ scrollbarWidth: 'none' }}
        >
          {pills.map((pill, idx) => {
            const isActive = pill.slug === currentCategory
            return (
              <div key={pill.slug || 'all'} role="none" className="shrink-0">
                <button
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  onClick={() => handleSelect(pill.slug)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  className={cn(
                    'inline-flex items-center justify-center rounded-radius-full px-spacing-4 py-spacing-2',
                    'text-sm font-medium whitespace-nowrap border transition-colors',
                    'duration-[var(--duration-fast)]',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-color-border-focus',
                    '@media (prefers-reduced-motion: reduce) { transition: none }',
                    isActive
                      ? 'bg-color-accent text-color-text-inverse border-color-accent'
                      : 'bg-color-background text-color-primary border-color-border hover:border-color-primary',
                  )}
                >
                  {pill.name}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

BlogFilterBar.displayName = 'BlogFilterBar'
