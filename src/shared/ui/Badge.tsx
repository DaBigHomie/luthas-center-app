/**
 * Badge / Tag — Luthas Center primitive
 *
 * Variants: primary | secondary | accent | success | warning | error | info | outline
 * Shape: pill (radius-full). Optional leading icon + optional close button.
 * Non-interactive: <span>. Interactive (filter): <button role="checkbox">.
 */

import * as React from 'react'
import { cn } from '@/shared/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type BadgeVariant =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'outline'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  icon?: React.ReactNode
  onRemove?: () => void
}

// ---------------------------------------------------------------------------
// Variant classes (tinted bg + matching text, per spec)
// ---------------------------------------------------------------------------

const variantClasses: Record<BadgeVariant, string> = {
  primary:   'bg-color-primary/15 text-color-primary',
  secondary: 'bg-color-surface-raised text-color-text-muted',
  accent:    'bg-color-accent/15 text-color-accent',
  success:   'bg-color-success/15 text-color-success',
  warning:   'bg-color-warning/15 text-color-warning',
  error:     'bg-color-error/15 text-color-error',
  info:      'bg-color-info/15 text-color-info',
  outline:   'bg-transparent text-color-text-muted border border-color-border',
}

// ---------------------------------------------------------------------------
// Badge component
// ---------------------------------------------------------------------------

function Badge({
  variant = 'secondary',
  icon,
  onRemove,
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-spacing-1 rounded-radius-full px-spacing-2 py-spacing-1',
        'text-xs font-medium leading-none whitespace-nowrap',
        variantClasses[variant],
        className,
      )}
      {...rest}
    >
      {icon && (
        <span aria-hidden="true" className="shrink-0 size-4 flex items-center justify-center">
          {icon}
        </span>
      )}
      {children}
      {onRemove && (
        <button
          type="button"
          aria-label="Remove"
          onClick={onRemove}
          className="shrink-0 size-3.5 flex items-center justify-center opacity-60 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-color-ring rounded-full ml-0.5"
        >
          <svg viewBox="0 0 12 12" fill="currentColor" className="size-2.5" aria-hidden="true">
            <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      )}
    </span>
  )
}

Badge.displayName = 'Badge'

export { Badge }
