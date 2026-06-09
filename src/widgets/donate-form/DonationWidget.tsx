/**
 * DonationWidget — interactive giving-level picker, frequency toggle, and CTA.
 *
 * This is a 'use client' component; the parent Server Component passes
 * resolved data down as props. No real payment processing in v1 — the CTA
 * surfaces Cash App / Zelle-style manual payment instructions.
 *
 * Accessibility:
 * - Level pills in a <fieldset><legend> as button group with aria-pressed
 * - Frequency toggle is role="group" with aria-label
 * - Custom amount has <label> + aria-describedby
 * - aria-live region announces updated CTA label to screen readers
 */

'use client'

import * as React from 'react'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui'
import { Badge } from '@/shared/ui'
import { FormField } from '@/shared/ui'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DonationLevel {
  level_id: string
  amount: number
  text: string | null
  recurring: boolean
  period: string
}

export interface DonationWidgetProps {
  formSlug: string
  formTitle: string
  setPrice: number | null
  customAmountEnabled: boolean
  levels: DonationLevel[]
  /** Cash App / Zelle handle for manual payment CTA */
  cashAppHandle?: string
  zelleHandle?: string
}

type Frequency = 'monthly' | 'once'

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function DonationWidget({
  formTitle,
  setPrice,
  customAmountEnabled,
  levels,
  cashAppHandle = '$LuthasCenter',
  zelleHandle = 'donate@luthascenter.org',
}: DonationWidgetProps) {
  const defaultLevel = levels.find((l) => l.amount === setPrice) ?? levels[0] ?? null

  const [selectedLevelId, setSelectedLevelId] = React.useState<string | null>(
    defaultLevel?.level_id ?? null,
  )
  const [customAmount, setCustomAmount] = React.useState('')
  const [customError, setCustomError] = React.useState('')
  const [frequency, setFrequency] = React.useState<Frequency>('monthly')
  const [showInstructions, setShowInstructions] = React.useState(false)

  const selectedLevel = levels.find((l) => l.level_id === selectedLevelId) ?? null
  const isCustom = selectedLevelId === '__custom__'

  const resolvedAmount = isCustom
    ? customAmount !== '' && !Number.isNaN(Number(customAmount))
      ? Number(customAmount)
      : null
    : selectedLevel?.amount ?? null

  const periodLabel = frequency === 'monthly' ? '/month' : ' one-time'
  const ctaLabel =
    resolvedAmount != null
      ? `Donate $${resolvedAmount}${periodLabel}`
      : 'Select an amount'
  const canDonate = resolvedAmount != null && resolvedAmount > 0

  function handleCustomChange(val: string) {
    setCustomAmount(val)
    const n = Number(val)
    if (val !== '' && (Number.isNaN(n) || n <= 0)) {
      setCustomError('Please enter a positive dollar amount.')
    } else {
      setCustomError('')
    }
  }

  function handleSelectLevel(id: string) {
    setSelectedLevelId(id)
    if (id !== '__custom__') {
      setCustomAmount('')
      setCustomError('')
    }
  }

  return (
    <div
      id="give-form"
      className="bg-color-surface rounded-radius-lg shadow-[var(--shadow-md)] p-spacing-6 flex flex-col gap-spacing-5"
    >
      {/* Heading */}
      <h2
        id="give-heading"
        className="font-[var(--font-heading)] font-semibold text-xl text-color-text leading-tight"
      >
        Make a Gift
      </h2>

      {/* Level picker */}
      <fieldset className="border-none p-0 m-0 flex flex-col gap-spacing-3">
        <legend className="font-semibold text-sm text-color-text-muted mb-spacing-1">
          Choose a giving level
        </legend>
        <div className="flex flex-wrap gap-spacing-2" role="group">
          {levels.map((level) => {
            const isSelected = selectedLevelId === level.level_id
            const isDefault = level.amount === setPrice
            return (
              <button
                key={level.level_id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => handleSelectLevel(level.level_id)}
                className={cn(
                  'relative inline-flex items-center gap-spacing-1 rounded-radius-full px-spacing-4 py-spacing-2',
                  'text-sm font-semibold transition-all duration-[var(--duration-fast)]',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-color-border-focus',
                  isSelected
                    ? 'bg-color-primary text-color-text-inverse border-2 border-color-primary'
                    : 'bg-color-background text-color-text border-2 border-color-border hover:border-color-primary hover:text-color-primary',
                )}
              >
                ${level.amount}/mo
                {isDefault && !isSelected && (
                  <Badge variant="accent" className="ml-spacing-1 text-xs">
                    Popular
                  </Badge>
                )}
                {isDefault && isSelected && (
                  <Badge variant="secondary" className="ml-spacing-1 text-xs">
                    Popular
                  </Badge>
                )}
              </button>
            )
          })}

          {customAmountEnabled && (
            <button
              type="button"
              aria-pressed={isCustom}
              onClick={() => handleSelectLevel('__custom__')}
              className={cn(
                'inline-flex items-center rounded-radius-full px-spacing-4 py-spacing-2',
                'text-sm font-semibold transition-all duration-[var(--duration-fast)]',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-color-border-focus',
                isCustom
                  ? 'bg-color-primary text-color-text-inverse border-2 border-color-primary'
                  : 'bg-color-background text-color-text border-2 border-color-border hover:border-color-primary hover:text-color-primary',
              )}
            >
              Custom
            </button>
          )}
        </div>

        {/* Level description */}
        {selectedLevel?.text && (
          <p className="text-sm text-color-text-muted leading-relaxed mt-spacing-1">
            {selectedLevel.text}
          </p>
        )}
      </fieldset>

      {/* Custom amount input */}
      {isCustom && (
        <div>
          <FormField
            id="custom-amount"
            label="Enter a custom amount ($)"
            type="number"
            value={customAmount}
            onChange={handleCustomChange}
            placeholder="e.g. 35"
            errorMessage={customError || undefined}
          />
        </div>
      )}

      {/* Frequency toggle */}
      <div
        role="group"
        aria-label="Donation frequency"
        className="flex rounded-radius-md overflow-hidden border border-color-border"
      >
        {(
          [
            { value: 'monthly', label: 'Monthly' },
            { value: 'once', label: 'One-time' },
          ] as { value: Frequency; label: string }[]
        ).map(({ value, label }) => (
          <button
            key={value}
            type="button"
            aria-pressed={frequency === value}
            onClick={() => setFrequency(value)}
            className={cn(
              'flex-1 py-spacing-2 text-sm font-semibold transition-colors duration-[var(--duration-fast)]',
              'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-color-border-focus',
              frequency === value
                ? 'bg-color-primary text-color-text-inverse'
                : 'bg-color-background text-color-text hover:bg-color-surface',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* aria-live for CTA label announcements */}
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {ctaLabel}
      </span>

      {/* Primary CTA */}
      {!showInstructions ? (
        <div className="flex flex-col gap-spacing-2">
          <Button
            variant="primary"
            size="lg"
            className="w-full justify-center"
            disabled={!canDonate}
            onClick={() => canDonate && setShowInstructions(true)}
            aria-disabled={!canDonate}
          >
            {ctaLabel}
            <span className="sr-only">(opens payment instructions)</span>
          </Button>
          <p className="text-center text-xs text-color-text-muted">
            Secure giving via Cash App or Zelle
          </p>
        </div>
      ) : (
        <ManualPaymentInstructions
          amount={resolvedAmount!}
          frequency={frequency}
          formTitle={formTitle}
          cashAppHandle={cashAppHandle}
          zelleHandle={zelleHandle}
          onBack={() => setShowInstructions(false)}
        />
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Manual payment instructions block (v1 — no live payment processing)
// ---------------------------------------------------------------------------

interface ManualPaymentInstructionsProps {
  amount: number
  frequency: Frequency
  formTitle: string
  cashAppHandle: string
  zelleHandle: string
  onBack: () => void
}

function ManualPaymentInstructions({
  amount,
  frequency,
  formTitle,
  cashAppHandle,
  zelleHandle,
  onBack,
}: ManualPaymentInstructionsProps) {
  const periodLabel = frequency === 'monthly' ? '/month' : ' (one-time)'

  return (
    <div
      role="region"
      aria-label="Payment instructions"
      className="flex flex-col gap-spacing-4 rounded-radius-md border border-color-border bg-color-background p-spacing-5"
    >
      <div className="flex items-start justify-between gap-spacing-3">
        <div>
          <p className="font-semibold text-base text-color-text">
            Donate ${amount}{periodLabel}
          </p>
          <p className="text-sm text-color-text-muted mt-spacing-1">
            {formTitle}
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-color-text-muted underline underline-offset-2 hover:text-color-text focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-color-border-focus rounded-sm shrink-0"
          aria-label="Go back to amount selection"
        >
          Change
        </button>
      </div>

      <div className="flex flex-col gap-spacing-3">
        {/* Cash App */}
        <div className="flex items-start gap-spacing-3 p-spacing-3 rounded-radius-md bg-color-surface border border-color-border">
          <div
            className="shrink-0 size-8 rounded-radius-full bg-color-success flex items-center justify-center"
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" fill="white" className="size-4">
              <path d="M13.5 2C13.5 2 14.5 2 15 3L16 6H18C19.1 6 20 6.9 20 8V16C20 17.1 19.1 18 18 18H6C4.9 18 4 17.1 4 16V8C4 6.9 4.9 6 6 6H8L9 3C9.5 2 10.5 2 10.5 2H13.5ZM12 9C10.3 9 9 10.3 9 12C9 13.7 10.3 15 12 15C13.7 15 15 13.7 15 12C15 10.3 13.7 9 12 9Z"/>
            </svg>
          </div>
          <div className="flex flex-col gap-spacing-1">
            <p className="text-sm font-semibold text-color-text">Cash App</p>
            <p className="text-sm text-color-text-muted">
              Send to{' '}
              <span className="font-mono font-semibold text-color-text">
                {cashAppHandle}
              </span>
            </p>
            <p className="text-xs text-color-text-muted">
              Note: <em>&ldquo;{formTitle}&rdquo;</em>
            </p>
          </div>
        </div>

        {/* Zelle */}
        <div className="flex items-start gap-spacing-3 p-spacing-3 rounded-radius-md bg-color-surface border border-color-border">
          <div
            className="shrink-0 size-8 rounded-radius-full bg-color-secondary flex items-center justify-center"
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" fill="white" className="size-4">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div className="flex flex-col gap-spacing-1">
            <p className="text-sm font-semibold text-color-text">Zelle</p>
            <p className="text-sm text-color-text-muted">
              Send to{' '}
              <span className="font-mono font-semibold text-color-text">
                {zelleHandle}
              </span>
            </p>
            <p className="text-xs text-color-text-muted">
              Note: <em>&ldquo;{formTitle}&rdquo;</em>
            </p>
          </div>
        </div>
      </div>

      <p className="text-xs text-color-text-muted leading-relaxed">
        After sending, email{' '}
        <a
          href="mailto:donate@luthascenter.org"
          className="underline underline-offset-2 text-color-accent hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-color-border-focus rounded-sm"
        >
          donate@luthascenter.org
        </a>{' '}
        with your name and amount so we can send your tax receipt. The Luthas
        Center is a 501(c)(3) nonprofit — your gift may be tax-deductible.
      </p>

      <button
        type="button"
        onClick={onBack}
        className="self-start text-sm text-color-text-muted underline underline-offset-2 hover:text-color-text focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-color-border-focus rounded-sm"
      >
        Back to amount selection
      </button>
    </div>
  )
}
