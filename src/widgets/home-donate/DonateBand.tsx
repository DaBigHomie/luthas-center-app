/**
 * DonateBand — Mission + Donate CTA section for the home page.
 *
 * Left panel: mission statement (About excerpt + static bullets).
 * Right panel: donation form card with goal progress, amount tiles, donate link.
 *
 * This is a Client Component so the donation level radio group is interactive.
 */

'use client'

import * as React from 'react'
import Link from 'next/link'
import type { DonationFormRow } from '@/entities/donation/model'
import { parsePriceLevels } from '@/entities/donation/model'

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface DonateBandProps {
  /** About page excerpt for the mission statement (or null → default copy). */
  missionExcerpt?: string | null
  /** First matching donation form from listDonationForms(). */
  donationForm?: DonationFormRow | null
  /** Total donated so far (from donation_stats). */
  totalDonated?: number | null
}

// ---------------------------------------------------------------------------
// Progress bar (accessible)
// ---------------------------------------------------------------------------

function GoalProgressBar({
  totalDonated,
  goalAmount,
}: {
  totalDonated: number
  goalAmount: number
}) {
  const pct = Math.min(100, Math.round((totalDonated / goalAmount) * 100))
  const formattedGoal = goalAmount.toLocaleString('en-US')
  const formattedTotal = totalDonated.toLocaleString('en-US')

  return (
    <div className="flex flex-col gap-spacing-2">
      <div className="flex justify-between text-sm text-color-text-muted font-[var(--font-body)]">
        <span>${formattedTotal} raised</span>
        <span>Goal: ${formattedGoal}</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Fundraising progress toward $${formattedGoal} goal`}
        className="w-full h-2.5 rounded-radius-full bg-color-surface-raised overflow-hidden"
      >
        <div
          className="h-full rounded-radius-full bg-color-primary transition-all duration-[var(--duration-slow,400ms)]"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-color-text-muted">{pct}% of goal reached</p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Donation level tiles (radio group)
// ---------------------------------------------------------------------------

const DEFAULT_LEVELS = [10, 25, 50, 100]

function DonationLevels({
  levels,
  selected,
  onSelect,
  customAmount,
  onCustomChange,
}: {
  levels: number[]
  selected: number | 'custom'
  onSelect: (v: number | 'custom') => void
  customAmount: string
  onCustomChange: (v: string) => void
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Select donation amount"
      className="flex flex-col gap-spacing-3"
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-spacing-2">
        {levels.map((amount) => {
          const isSelected = selected === amount
          return (
            <button
              key={amount}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(amount)}
              className={[
                'rounded-radius-md border px-spacing-3 py-spacing-3 text-sm font-semibold transition-all duration-[var(--duration-fast)]',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-color-border-focus',
                isSelected
                  ? 'bg-color-primary text-color-text-inverse border-color-primary'
                  : 'bg-color-surface text-color-text border-color-border hover:border-color-primary hover:text-color-primary',
              ].join(' ')}
            >
              ${amount}
            </button>
          )
        })}
      </div>

      {/* Custom option */}
      <button
        type="button"
        role="radio"
        aria-checked={selected === 'custom'}
        onClick={() => onSelect('custom')}
        className={[
          'rounded-radius-md border px-spacing-3 py-spacing-3 text-sm font-semibold transition-all duration-[var(--duration-fast)] text-left',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-color-border-focus',
          selected === 'custom'
            ? 'bg-color-primary text-color-text-inverse border-color-primary'
            : 'bg-color-surface text-color-text border-color-border hover:border-color-primary hover:text-color-primary',
        ].join(' ')}
      >
        Custom amount
      </button>

      {selected === 'custom' && (
        <div className="flex flex-col gap-spacing-1">
          <label
            htmlFor="custom-donation-amount"
            className="text-sm font-medium text-color-text"
          >
            Enter amount ($)
          </label>
          <input
            id="custom-donation-amount"
            type="number"
            min="1"
            step="1"
            value={customAmount}
            onChange={(e) => onCustomChange(e.target.value)}
            placeholder="e.g. 75"
            className="w-full rounded-radius-md border border-color-border bg-color-background px-spacing-3 py-spacing-2 text-base text-color-text placeholder:text-color-text-muted focus:outline-none focus:border-color-border-focus focus:shadow-[var(--shadow-focus)]"
          />
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// DonateBand component
// ---------------------------------------------------------------------------

export function DonateBand({
  missionExcerpt,
  donationForm,
  totalDonated,
}: DonateBandProps) {
  const [selectedLevel, setSelectedLevel] = React.useState<number | 'custom'>(25)
  const [customAmount, setCustomAmount] = React.useState('')

  const goalAmount = donationForm?.goal_amount ?? 50000
  const donated = totalDonated ?? 0
  const formTitle = donationForm?.title ?? 'Fund Education Initiatives'
  const formSlug = donationForm?.slug ?? 'fund-education-initiatives'

  const priceLevels = parsePriceLevels(donationForm?.price_levels ?? null)
  const levelAmounts =
    priceLevels.length > 0 ? priceLevels.map((l) => l.amount) : DEFAULT_LEVELS

  const donateAmount =
    selectedLevel === 'custom'
      ? customAmount
        ? Number(customAmount)
        : null
      : selectedLevel

  const donateHref = donateAmount
    ? `/give/${formSlug}?amount=${donateAmount}`
    : `/give/${formSlug}`

  return (
    <section
      aria-labelledby="mission-heading"
      className="w-full bg-color-surface py-spacing-16 px-spacing-6 md:px-spacing-8"
    >
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-spacing-12">
        {/* Left — Mission statement */}
        <div className="flex flex-col gap-spacing-6">
          <h2
            id="mission-heading"
            className="font-[var(--font-heading)] font-bold text-2xl md:text-3xl text-color-text"
          >
            Our Mission
          </h2>

          {missionExcerpt ? (
            <p className="text-base text-color-text-muted leading-relaxed">
              {missionExcerpt}
            </p>
          ) : (
            <p className="text-base text-color-text-muted leading-relaxed">
              At the Luthas Center for Excellence, we believe that every
              individual—regardless of background—has the potential to transform
              their life. We provide the tools, community, and support to make
              that transformation real.
            </p>
          )}

          <ul className="flex flex-col gap-spacing-3" role="list">
            {[
              'Evidence-based education programs accessible to all',
              'Mental health resources and peer support networks',
              'Community partnerships that create lasting opportunity',
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-spacing-3 text-sm text-color-text"
              >
                <span
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 size-5 rounded-radius-full bg-color-primary/15 text-color-primary flex items-center justify-center"
                >
                  <svg
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="size-3"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 4.293a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L7 8.586l4.293-4.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>

          <Link
            href="/about"
            className="inline-flex items-center gap-spacing-1 text-sm font-semibold text-color-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-color-border-focus rounded-sm"
          >
            Learn about our work
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Right — Donation form card */}
        <div className="bg-color-background rounded-radius-lg border border-color-border shadow-[var(--shadow-md)] p-spacing-6 flex flex-col gap-spacing-6">
          <div>
            <h3
              id="donate-panel-heading"
              className="font-[var(--font-heading)] font-bold text-xl text-color-text mb-spacing-1"
            >
              {formTitle}
            </h3>
            <p className="text-sm text-color-text-muted">
              Help us reach our ${goalAmount.toLocaleString('en-US')} goal.
            </p>
          </div>

          <GoalProgressBar totalDonated={donated} goalAmount={goalAmount} />

          <DonationLevels
            levels={levelAmounts}
            selected={selectedLevel}
            onSelect={setSelectedLevel}
            customAmount={customAmount}
            onCustomChange={setCustomAmount}
          />

          <Link
            href={donateHref}
            className="inline-flex items-center justify-center w-full rounded-radius-md px-spacing-6 py-spacing-4 text-lg font-semibold bg-color-primary text-color-text-inverse hover:bg-color-primary-hover transition-all duration-[var(--duration-fast)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-color-border-focus"
          >
            Donate Now
            {donateAmount ? ` — $${donateAmount}` : ''}
          </Link>
        </div>
      </div>
    </section>
  )
}

DonateBand.displayName = 'DonateBand'
