/**
 * Breadcrumb — Luthas Center primitive
 *
 * Accessibility: <nav aria-label="Breadcrumb"><ol>
 * - Ancestor items: links with hover underline
 * - Current item: aria-current="page", not a link
 * - Separators: aria-hidden
 * - Mobile truncation: show first + last, ellipsis for middle
 */

import * as React from 'react'
import { cn } from '@/shared/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  separator?: React.ReactNode
  className?: string
}

// ---------------------------------------------------------------------------
// Breadcrumb
// ---------------------------------------------------------------------------

function Breadcrumb({ items, separator = '/', className }: BreadcrumbProps) {
  if (items.length === 0) return null

  return (
    <nav aria-label="Breadcrumb" className={cn('text-sm', className)}>
      <ol className="flex flex-wrap items-center gap-spacing-1 list-none p-0 m-0">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          const isMiddle = !isLast && index > 0 && items.length > 3

          return (
            <React.Fragment key={item.label + index}>
              <li
                className={cn(
                  // Mobile truncation: hide middle items on small screens
                  isMiddle && 'hidden sm:flex',
                  'flex items-center',
                )}
              >
                {isLast ? (
                  <span
                    aria-current="page"
                    className="text-color-text font-medium"
                  >
                    {item.label}
                  </span>
                ) : (
                  <a
                    href={item.href ?? '#'}
                    className={cn(
                      'text-color-text-muted hover:text-color-primary',
                      'transition-colors duration-[var(--duration-fast)]',
                      'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-color-ring rounded-radius-sm',
                    )}
                  >
                    {item.label}
                  </a>
                )}
              </li>

              {!isLast && (
                <li aria-hidden="true" className={cn('text-color-text-muted select-none', isMiddle && 'hidden sm:flex')}>
                  {separator}
                </li>
              )}
            </React.Fragment>
          )
        })}
      </ol>
    </nav>
  )
}

Breadcrumb.displayName = 'Breadcrumb'

export { Breadcrumb }
