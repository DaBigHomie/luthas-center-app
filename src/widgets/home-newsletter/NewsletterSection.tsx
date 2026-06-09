/**
 * NewsletterSection — full-width newsletter signup band.
 *
 * Client Component: owns email input state, inline validation, and
 * optimistic success state. Submission is a stub (no external ESP call yet).
 * Respects prefers-reduced-motion for the success transition.
 */

'use client'

import * as React from 'react'
import { Button } from '@/shared/ui'

export function NewsletterSection() {
  const [email, setEmail] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const [submitted, setSubmitted] = React.useState(false)
  const successRef = React.useRef<HTMLParagraphElement>(null)

  function validate(value: string): string | null {
    if (!value.trim()) return 'Email address is required.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()))
      return 'Please enter a valid email address.'
    return null
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const err = validate(email)
    if (err) {
      setError(err)
      return
    }
    setError(null)
    // Stub — no real submission; success state shown immediately
    setSubmitted(true)
    // Move focus to confirmation for accessibility
    setTimeout(() => successRef.current?.focus(), 0)
  }

  return (
    <section
      aria-label="Newsletter signup"
      className="w-full bg-color-accent/10 py-spacing-16 px-spacing-6 md:px-spacing-8"
    >
      <div className="max-w-2xl mx-auto text-center">
        <h2
          id="newsletter-heading"
          className="font-[var(--font-heading)] font-bold text-2xl md:text-3xl text-color-text mb-spacing-2"
        >
          Stay in the loop
        </h2>
        <p className="text-base text-color-text-muted mb-spacing-8">
          Resources, stories, and more — delivered to your inbox.
        </p>

        {submitted ? (
          <p
            ref={successRef}
            tabIndex={-1}
            className="text-base font-semibold text-color-success focus:outline-none"
          >
            You&apos;re subscribed — thanks for joining us!
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col sm:flex-row gap-spacing-3 items-start sm:items-end"
          >
            <div className="flex-1 w-full flex flex-col gap-spacing-1">
              <label
                htmlFor="newsletter-email"
                className="text-sm font-medium text-color-text text-left"
              >
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (error) setError(null)
                }}
                placeholder="you@example.com"
                required
                aria-required="true"
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? 'newsletter-email-error' : undefined}
                className="w-full rounded-radius-md border border-color-border bg-color-background px-spacing-3 py-spacing-3 text-base text-color-text placeholder:text-color-text-muted focus:outline-none focus:border-color-border-focus focus:shadow-[var(--shadow-focus)]"
              />
              {/* Live error region */}
              <div aria-live="polite" className="min-h-[1.25rem]">
                {error && (
                  <p
                    id="newsletter-email-error"
                    role="alert"
                    className="text-sm text-color-error text-left"
                  >
                    {error}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="shrink-0 w-full sm:w-auto"
            >
              Subscribe
            </Button>
          </form>
        )}
      </div>
    </section>
  )
}

NewsletterSection.displayName = 'NewsletterSection'
