/**
 * Alert / CTA Banner — Luthas Center primitive
 *
 * Alert variants: success | error | warning | info
 * CTA Banner variants: campaign | enrollment | neutral
 *
 * Accessibility:
 * - Alert uses role="alert" (error) or role="status" (success/info/warning)
 * - CTA Banner: role="region" + aria-labelledby
 * - Color not the only signal — icon always present
 * - Dismiss: aria-label="Dismiss [title]"
 */

'use client'

import * as React from 'react'
import { cn } from '@/shared/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AlertVariant = 'success' | 'error' | 'warning' | 'info'
export type BannerVariant = 'campaign' | 'enrollment' | 'neutral'

export interface AlertProps {
  variant: AlertVariant
  title?: string
  message: React.ReactNode
  onDismiss?: () => void
  className?: string
}

export interface CtaBannerProps {
  variant?: BannerVariant
  eyebrow?: string
  headline: string
  body?: string
  cta?: { label: string; href: string }
  onDismiss?: () => void
  className?: string
}

// ---------------------------------------------------------------------------
// Alert variant config
// ---------------------------------------------------------------------------

const alertConfig: Record<
  AlertVariant,
  { bg: string; text: string; icon: React.ReactNode; role: 'alert' | 'status' }
> = {
  success: {
    bg: 'bg-color-success/12',
    text: 'text-color-success',
    role: 'status',
    icon: (
      <svg className="size-5 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
      </svg>
    ),
  },
  error: {
    bg: 'bg-color-error/12',
    text: 'text-color-error',
    role: 'alert',
    icon: (
      <svg className="size-5 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
      </svg>
    ),
  },
  warning: {
    bg: 'bg-color-warning/12',
    text: 'text-color-warning',
    role: 'status',
    icon: (
      <svg className="size-5 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
      </svg>
    ),
  },
  info: {
    bg: 'bg-color-info/12',
    text: 'text-color-info',
    role: 'status',
    icon: (
      <svg className="size-5 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 4a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1h-1z" clipRule="evenodd"/>
      </svg>
    ),
  },
}

// ---------------------------------------------------------------------------
// Alert
// ---------------------------------------------------------------------------

function Alert({ variant, title, message, onDismiss, className }: AlertProps) {
  const [dismissed, setDismissed] = React.useState(false)
  const config = alertConfig[variant]

  if (dismissed) return null

  function handleDismiss() {
    setDismissed(true)
    onDismiss?.()
  }

  return (
    <div
      role={config.role}
      className={cn(
        'flex items-start gap-spacing-3 rounded-radius-md p-spacing-3 border',
        config.bg,
        config.text,
        'border-current/20',
        className,
      )}
    >
      {config.icon}
      <div className="flex-1 min-w-0">
        {title && (
          <p className="font-semibold text-sm mb-0.5">{title}</p>
        )}
        <div className="text-sm opacity-90">{message}</div>
      </div>
      {onDismiss && (
        <button
          type="button"
          aria-label={`Dismiss${title ? ` ${title}` : ''}`}
          onClick={handleDismiss}
          className="shrink-0 size-5 flex items-center justify-center opacity-60 hover:opacity-100 rounded-radius-sm focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-current"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="size-4" aria-hidden="true">
            <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
          </svg>
        </button>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// CTA Banner
// ---------------------------------------------------------------------------

function CtaBanner({
  variant = 'neutral',
  eyebrow,
  headline,
  body,
  cta,
  onDismiss,
  className,
}: CtaBannerProps) {
  const [dismissed, setDismissed] = React.useState(false)
  const headlineId = React.useId()

  if (dismissed) return null

  const bannerClasses: Record<BannerVariant, string> = {
    campaign: 'bg-color-primary text-color-text-inverse',
    enrollment: 'bg-color-accent/20 text-color-text',
    neutral: 'bg-color-surface-raised text-color-text border border-color-border',
  }

  return (
    <section
      role="region"
      aria-labelledby={headlineId}
      className={cn(
        'relative flex flex-col sm:flex-row items-start sm:items-center gap-spacing-4 rounded-radius-md px-spacing-6 py-spacing-4',
        bannerClasses[variant],
        className,
      )}
    >
      <div className="flex-1 min-w-0">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-wide opacity-70 mb-0.5">
            {eyebrow}
          </p>
        )}
        <p id={headlineId} className="font-semibold text-base leading-snug">
          {headline}
        </p>
        {body && (
          <p className="text-sm opacity-80 mt-0.5">{body}</p>
        )}
      </div>

      {cta && (
        <a
          href={cta.href}
          className={cn(
            'shrink-0 inline-flex items-center justify-center rounded-radius-md px-spacing-5 py-spacing-2 text-sm font-semibold',
            'w-full sm:w-auto',
            'transition-all duration-[var(--duration-fast)]',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-color-border-focus',
            variant === 'campaign'
              ? 'bg-color-accent text-color-text-inverse hover:opacity-90'
              : variant === 'enrollment'
              ? 'bg-color-primary text-color-text-inverse hover:bg-color-primary-hover'
              : 'bg-color-primary text-color-text-inverse hover:bg-color-primary-hover',
          )}
        >
          {cta.label}
        </a>
      )}

      {onDismiss && (
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => { setDismissed(true); onDismiss() }}
          className="absolute top-spacing-3 right-spacing-3 size-6 flex items-center justify-center opacity-60 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-color-border-focus rounded-radius-sm"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="size-4" aria-hidden="true">
            <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
          </svg>
        </button>
      )}
    </section>
  )
}

Alert.displayName = 'Alert'
CtaBanner.displayName = 'CtaBanner'

export { Alert, CtaBanner }
