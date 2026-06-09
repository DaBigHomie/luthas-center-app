/**
 * Accordion — Luthas Center primitive
 *
 * Variants: single (one panel at a time) | multi (multiple open)
 * Style:    flush (edge-to-edge) | contained (card shell)
 *
 * Accessibility:
 * - trigger: <button aria-expanded aria-controls="panel-id">
 * - panel: id + role="region" + aria-labelledby="trigger-id"
 * - chevron: aria-hidden (direction from aria-expanded)
 * - keyboard: Enter/Space toggles; ArrowDown/ArrowUp moves between triggers
 */

'use client'

import * as React from 'react'
import { cn } from '@/shared/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AccordionItem {
  id: string
  trigger: React.ReactNode
  content: React.ReactNode
  defaultOpen?: boolean
}

export interface AccordionProps {
  items: AccordionItem[]
  type?: 'single' | 'multi'
  style?: 'flush' | 'contained'
  className?: string
}

// ---------------------------------------------------------------------------
// Accordion
// ---------------------------------------------------------------------------

function Accordion({ items, type = 'single', style = 'contained', className }: AccordionProps) {
  const [openIds, setOpenIds] = React.useState<Set<string>>(
    () => new Set(items.filter((i) => i.defaultOpen).map((i) => i.id)),
  )
  const triggerRefs = React.useRef<Record<string, HTMLButtonElement | null>>({})

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        if (type === 'single') next.clear()
        next.add(id)
      }
      return next
    })
  }

  function handleKeyDown(e: React.KeyboardEvent, currentIndex: number) {
    const ids = items.map((i) => i.id)
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = ids[(currentIndex + 1) % ids.length]
      triggerRefs.current[next]?.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prev = ids[(currentIndex - 1 + ids.length) % ids.length]
      triggerRefs.current[prev]?.focus()
    }
  }

  return (
    <div
      className={cn(
        style === 'contained' && 'rounded-radius-md border border-color-border bg-color-surface overflow-hidden',
        className,
      )}
    >
      {items.map((item, index) => {
        const isOpen = openIds.has(item.id)
        const triggerId = `accordion-trigger-${item.id}`
        const panelId = `accordion-panel-${item.id}`

        return (
          <div
            key={item.id}
            className={cn(
              style === 'flush' && index > 0 && 'border-t border-color-border',
              style === 'contained' && index > 0 && 'border-t border-color-border',
            )}
          >
            {/* Trigger */}
            <button
              id={triggerId}
              ref={(el) => { triggerRefs.current[item.id] = el }}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggle(item.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={cn(
                'w-full flex items-center justify-between gap-spacing-3 px-spacing-4 py-spacing-4',
                'text-left font-semibold text-base text-color-text',
                'hover:bg-color-surface-raised',
                'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-color-border-focus',
                'transition-colors duration-[var(--duration-fast)]',
              )}
            >
              <span>{item.trigger}</span>
              {/* Chevron */}
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="currentColor"
                className={cn(
                  'size-5 shrink-0 text-color-text-muted transition-transform duration-[var(--duration-base)]',
                  isOpen && 'rotate-180',
                )}
              >
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd"/>
              </svg>
            </button>

            {/* Panel */}
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              hidden={!isOpen}
              className={cn(
                'overflow-hidden transition-all duration-[var(--duration-base)]',
                isOpen ? 'block' : 'hidden',
              )}
            >
              <div className="px-spacing-4 pb-spacing-4 text-color-text">
                {item.content}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

Accordion.displayName = 'Accordion'

export { Accordion }
