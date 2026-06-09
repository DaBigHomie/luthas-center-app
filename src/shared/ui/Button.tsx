/**
 * Button — Luthas Center primitive
 *
 * Variants: primary | secondary | ghost | link | danger
 * Sizes:    sm | md (default) | lg
 * States:   default | hover | focus | active | disabled | loading
 *
 * Token classes used: bg-color-primary, text-color-text-inverse, etc.
 * All values resolve through globals.css @theme — no raw hex.
 */

import * as React from 'react'
import { cn } from '@/shared/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'link' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  asChild?: boolean
  /** Icon rendered before label */
  leadingIcon?: React.ReactNode
  /** Icon rendered after label */
  trailingIcon?: React.ReactNode
}

// ---------------------------------------------------------------------------
// Variant + size class maps
// ---------------------------------------------------------------------------

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-color-primary text-color-primary-foreground border border-transparent hover:bg-color-primary-hover active:bg-color-primary-hover',
  secondary:
    'bg-color-secondary text-color-secondary-foreground border border-transparent hover:opacity-90 active:opacity-80',
  ghost:
    'bg-transparent text-color-foreground border border-transparent hover:bg-color-muted active:bg-color-surface-raised',
  link: 'bg-transparent text-color-primary border-transparent underline-offset-4 hover:underline',
  danger:
    'bg-color-error text-color-error-foreground border border-transparent hover:opacity-90 active:opacity-80',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-spacing-3 py-spacing-2 text-sm min-h-[36px]',
  md: 'px-spacing-5 py-spacing-3 text-base min-h-[44px]',
  lg: 'px-spacing-6 py-spacing-4 text-lg min-h-[52px]',
}

// ---------------------------------------------------------------------------
// Spinner (used in loading state)
// ---------------------------------------------------------------------------

function Spinner() {
  return (
    <svg
      className="animate-spin size-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Button component
// ---------------------------------------------------------------------------

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled,
    className,
    children,
    leadingIcon,
    trailingIcon,
    onClick,
    ...rest
  },
  ref,
) {
  const isDisabled = disabled || loading

  return (
    <>
      {/* aria-live region for loading announcement */}
      {loading && (
        <span className="sr-only" aria-live="polite">
          Loading
        </span>
      )}
      <button
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled || undefined}
        aria-busy={loading || undefined}
        onClick={isDisabled ? undefined : onClick}
        className={cn(
          // Base
          'inline-flex items-center justify-center gap-spacing-2 rounded-radius-md font-semibold',
          'transition-all duration-[var(--duration-fast)] ease-[var(--ease-default)]',
          // Focus
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-color-ring',
          'focus-visible:shadow-[var(--shadow-focus)]',
          // Active
          'active:translate-y-px',
          // Disabled
          'disabled:opacity-45 disabled:cursor-not-allowed',
          // Variant + size
          variantClasses[variant],
          sizeClasses[size],
          // Loading: lock width via min-w
          loading && 'pointer-events-none',
          className,
        )}
        {...rest}
      >
        {loading ? (
          <Spinner />
        ) : (
          <>
            {leadingIcon && (
              <span aria-hidden="true" className="shrink-0 size-5 flex items-center">
                {leadingIcon}
              </span>
            )}
            {children}
            {trailingIcon && (
              <span aria-hidden="true" className="shrink-0 size-5 flex items-center">
                {trailingIcon}
              </span>
            )}
          </>
        )}
      </button>
    </>
  )
})

Button.displayName = 'Button'

export { Button }
