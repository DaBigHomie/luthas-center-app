/**
 * GoalMeter — fundraising progress bar.
 *
 * Renders a progress bar with accessible ARIA attributes.
 * Animation honours prefers-reduced-motion via CSS.
 * Pure display — no interactivity.
 */

import * as React from 'react'
import { cn } from '@/shared/lib/utils'

export interface GoalMeterProps {
  raised: number
  goal: number
  donorCount?: number | null
  className?: string
}

export function GoalMeter({ raised, goal, donorCount, className }: GoalMeterProps) {
  const safeRaised = Math.max(0, raised)
  const safeGoal = Math.max(1, goal)
  const pct = Math.min(100, Math.round((safeRaised / safeGoal) * 100))

  const fmt = (n: number) =>
    n >= 1000
      ? `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`
      : `$${n.toLocaleString()}`

  return (
    <div className={cn('flex flex-col gap-spacing-3', className)}>
      {/* Labels */}
      <div className="flex items-baseline justify-between gap-spacing-2 flex-wrap">
        <span className="font-semibold text-xl text-color-text">
          {fmt(safeRaised)}{' '}
          <span className="font-normal text-base text-color-text-muted">
            raised of {fmt(safeGoal)} goal
          </span>
        </span>
        <span className="text-sm text-color-text-muted">{pct}% funded</span>
      </div>

      {/* Progress bar */}
      <div
        role="progressbar"
        aria-valuenow={safeRaised}
        aria-valuemin={0}
        aria-valuemax={safeGoal}
        aria-label="Fundraising progress"
        className="relative w-full h-3 rounded-radius-full bg-color-surface-raised overflow-hidden"
      >
        <div
          className={cn(
            'absolute inset-y-0 left-0 rounded-radius-full bg-color-accent',
            '@media (prefers-reduced-motion: no-preference) { transition: width 0.8s ease-out }',
          )}
          style={{ width: `${pct}%` }}
          aria-hidden="true"
        />
      </div>

      {/* Donor count */}
      {donorCount != null && donorCount > 0 && (
        <p className="text-sm text-color-text-muted">
          {donorCount} {donorCount === 1 ? 'donor' : 'donors'} so far
        </p>
      )}
    </div>
  )
}
