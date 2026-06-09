/**
 * Pagination — Luthas Center primitive
 *
 * Variants: default (full numbered) | simple (prev/next only) | cursor (prev/next + "Page X of Y")
 *
 * Accessibility:
 * - <nav aria-label="Pagination"> wraps <ol>
 * - Current page: aria-current="page" (not a link)
 * - aria-disabled on disabled prev/next (not removed from DOM)
 * - Page links: aria-label="Go to page N"
 */

import * as React from 'react'
import { cn } from '@/shared/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PaginationVariant = 'default' | 'simple' | 'cursor'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  variant?: PaginationVariant
  className?: string
}

// ---------------------------------------------------------------------------
// Shared page item classes
// ---------------------------------------------------------------------------

const itemBase =
  'inline-flex items-center justify-center size-10 rounded-radius-md text-sm font-medium ' +
  'transition-colors duration-[var(--duration-fast)] ' +
  'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-color-ring'

const itemDefault =
  'text-color-text hover:bg-color-surface-raised border border-color-border hover:border-color-primary'

const itemActive = 'bg-color-primary text-color-text-inverse border border-color-primary'

const itemDisabled = 'text-color-text-muted opacity-50 cursor-not-allowed pointer-events-none border border-color-border'

// ---------------------------------------------------------------------------
// Helper: generate page range with ellipsis
// ---------------------------------------------------------------------------

function getPageRange(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const range: (number | '...')[] = []
  range.push(1)
  if (current > 3) range.push('...')
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
    range.push(p)
  }
  if (current < total - 2) range.push('...')
  range.push(total)
  return range
}

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  variant = 'default',
  className,
}: PaginationProps) {
  const hasPrev = currentPage > 1
  const hasNext = currentPage < totalPages

  const prevButton = (
    <li>
      <button
        type="button"
        onClick={hasPrev ? () => onPageChange(currentPage - 1) : undefined}
        disabled={!hasPrev}
        aria-disabled={!hasPrev}
        aria-label="Previous page"
        className={cn(itemBase, hasPrev ? itemDefault : itemDisabled)}
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="size-4" aria-hidden="true">
          <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd"/>
        </svg>
      </button>
    </li>
  )

  const nextButton = (
    <li>
      <button
        type="button"
        onClick={hasNext ? () => onPageChange(currentPage + 1) : undefined}
        disabled={!hasNext}
        aria-disabled={!hasNext}
        aria-label="Next page"
        className={cn(itemBase, hasNext ? itemDefault : itemDisabled)}
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="size-4" aria-hidden="true">
          <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd"/>
        </svg>
      </button>
    </li>
  )

  return (
    <nav aria-label="Pagination" className={cn('flex items-center justify-center', className)}>
      <ol className="flex items-center gap-spacing-1 list-none p-0 m-0">
        {prevButton}

        {variant === 'default' && totalPages > 1 && (
          <>
            {getPageRange(currentPage, totalPages).map((p, idx) =>
              p === '...' ? (
                <li key={`ellipsis-${idx}`} aria-hidden="true">
                  <span className={cn(itemBase, 'text-color-text-muted cursor-default')}>
                    &hellip;
                  </span>
                </li>
              ) : (
                <li key={p}>
                  {p === currentPage ? (
                    <span
                      aria-current="page"
                      className={cn(itemBase, itemActive)}
                    >
                      {p}
                    </span>
                  ) : (
                    <button
                      type="button"
                      aria-label={`Go to page ${p}`}
                      onClick={() => onPageChange(p as number)}
                      className={cn(itemBase, itemDefault)}
                    >
                      {p}
                    </button>
                  )}
                </li>
              ),
            )}
          </>
        )}

        {variant === 'cursor' && (
          <li>
            <span className="px-spacing-3 text-sm text-color-text-muted whitespace-nowrap">
              Page {currentPage} of {totalPages}
            </span>
          </li>
        )}

        {nextButton}
      </ol>
    </nav>
  )
}

Pagination.displayName = 'Pagination'

export { Pagination }
