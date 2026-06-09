/**
 * LessonListItem — row-level item inside a course curriculum accordion.
 *
 * Shows: order number, title, type badge (Lesson / Quiz / Topic), and a
 * completion placeholder icon. Designed as a compact 48–52px list row.
 *
 * Completion state is a UI placeholder — full persistence wires up when
 * lesson_completions table is active. Currently all items render as "not started".
 */

import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/shared/lib/utils'
import { Badge } from '@/shared/ui/Badge'
import type { LessonSummary } from '@/entities/lesson/model'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type LessonItemType = 'lesson' | 'quiz' | 'topic'

export type CompletionState = 'not_started' | 'in_progress' | 'completed' | 'locked'

export interface LessonListItemProps {
  lesson: LessonSummary
  /** Display order number (1-based). */
  order: number
  /** Type of the step — lesson, quiz, or topic. */
  type?: LessonItemType
  /** Completion state (defaults to not_started until auth/progress loads). */
  completionState?: CompletionState
  /** Whether this is the currently active lesson. */
  isActive?: boolean
  /** Route to navigate to when clicked. */
  href: string
}

// ---------------------------------------------------------------------------
// Helpers — completion icon
// ---------------------------------------------------------------------------

function CompletionIcon({ state }: { state: CompletionState }) {
  if (state === 'completed') {
    return (
      <span
        aria-label="Completed"
        className="shrink-0 size-6 rounded-radius-full bg-color-success/20 flex items-center justify-center"
      >
        <svg
          className="size-3.5 text-color-success"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M2 8l4 4 8-8" />
        </svg>
      </span>
    )
  }

  if (state === 'locked') {
    return (
      <span
        aria-label="Locked"
        className="shrink-0 size-6 rounded-radius-full border border-color-border flex items-center justify-center"
      >
        <svg
          className="size-3 text-color-text-muted"
          viewBox="0 0 16 16"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 7H4a1 1 0 00-1 1v5a1 1 0 001 1h8a1 1 0 001-1V8a1 1 0 00-1-1zM8 10a1.5 1.5 0 110 2 1.5 1.5 0 010-2zM5.5 7V5a2.5 2.5 0 015 0v2" />
        </svg>
      </span>
    )
  }

  if (state === 'in_progress') {
    return (
      <span
        aria-label="In progress"
        className="shrink-0 size-6 rounded-radius-full border-2 border-color-primary flex items-center justify-center"
      >
        <span className="size-1.5 rounded-full bg-color-primary" aria-hidden="true" />
      </span>
    )
  }

  // not_started
  return (
    <span
      aria-label="Not started"
      className="shrink-0 size-6 rounded-radius-full border-2 border-color-border flex items-center justify-center"
      aria-hidden={undefined}
    />
  )
}

// ---------------------------------------------------------------------------
// Badge variant per type
// ---------------------------------------------------------------------------

function typeBadgeLabel(type: LessonItemType): string {
  switch (type) {
    case 'quiz': return 'Quiz'
    case 'topic': return 'Topic'
    default: return 'Lesson'
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function LessonListItem({
  lesson,
  order,
  type = 'lesson',
  completionState = 'not_started',
  isActive = false,
  href,
}: LessonListItemProps) {
  const isLocked = completionState === 'locked'

  const rowClasses = cn(
    'group flex items-center gap-spacing-3 px-spacing-4 py-spacing-3',
    'min-h-[48px] w-full text-left',
    'border-b border-color-border last:border-b-0',
    'transition-colors duration-[var(--duration-fast)]',
    isActive
      ? 'bg-color-surface-raised'
      : 'hover:bg-color-surface-raised',
    isLocked && 'cursor-not-allowed opacity-70',
  )

  const content = (
    <>
      {/* Order number */}
      <span
        className="shrink-0 size-6 flex items-center justify-center text-xs text-color-text-muted font-medium tabular-nums"
        aria-hidden="true"
      >
        {order}
      </span>

      {/* Completion icon */}
      <CompletionIcon state={completionState} />

      {/* Title — fills available space */}
      <span
        className={cn(
          'flex-1 truncate text-sm leading-[var(--leading-normal)]',
          isActive
            ? 'text-color-primary font-semibold'
            : completionState === 'completed'
              ? 'text-color-text-muted'
              : 'text-color-text',
        )}
      >
        {lesson.title ?? 'Untitled Lesson'}
      </span>

      {/* Type badge */}
      <Badge
        variant={type === 'quiz' ? 'warning' : 'secondary'}
        className="shrink-0"
      >
        {typeBadgeLabel(type)}
      </Badge>

      {/* Active indicator arrow */}
      {isActive && (
        <svg
          className="shrink-0 size-4 text-color-primary"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 4l4 4-4 4" />
        </svg>
      )}
    </>
  )

  if (isLocked) {
    return (
      <div
        role="listitem"
        aria-label={`${lesson.title ?? 'Lesson'} — Locked`}
        className={rowClasses}
      >
        {content}
      </div>
    )
  }

  return (
    <Link
      href={href}
      role="listitem"
      aria-current={isActive ? 'step' : undefined}
      aria-label={lesson.title ?? undefined}
      className={rowClasses}
    >
      {content}
    </Link>
  )
}

LessonListItem.displayName = 'LessonListItem'
