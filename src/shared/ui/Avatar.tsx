/**
 * Avatar — Luthas Center primitive
 *
 * Sizes: xs (24) | sm (32) | md (40, default) | lg (56) | xl (80)
 * Variants: image | initials | icon | with-status | group
 *
 * Accessibility: img alt="[Display Name]"; initials aria-label="[Display Name]"
 */

import * as React from 'react'
import { cn } from '@/shared/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface AvatarProps {
  src?: string | null
  name?: string | null
  size?: AvatarSize
  statusOnline?: boolean
  className?: string
}

// ---------------------------------------------------------------------------
// Size classes
// ---------------------------------------------------------------------------

const sizeClasses: Record<AvatarSize, { root: string; text: string }> = {
  xs: { root: 'size-6', text: 'text-xs' },
  sm: { root: 'size-8', text: 'text-sm' },
  md: { root: 'size-10', text: 'text-base' },
  lg: { root: 'size-14', text: 'text-lg' },
  xl: { root: 'size-20', text: 'text-xl' },
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
}

// ---------------------------------------------------------------------------
// Avatar
// ---------------------------------------------------------------------------

function Avatar({ src, name, size = 'md', statusOnline, className }: AvatarProps) {
  const { root: rootSize, text: textSize } = sizeClasses[size]
  const initials = name ? getInitials(name) : null

  return (
    <span className={cn('relative inline-flex shrink-0', className)}>
      <span
        aria-label={name ?? undefined}
        className={cn(
          rootSize,
          'rounded-radius-full overflow-hidden flex items-center justify-center',
          'border border-color-surface-raised shadow-[var(--shadow-sm)]',
          !src && 'bg-color-primary',
        )}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={name ?? ''}
            className="size-full object-cover"
          />
        ) : initials ? (
          <span
            aria-hidden="true"
            className={cn(textSize, 'font-semibold text-color-text-inverse select-none')}
          >
            {initials}
          </span>
        ) : (
          // Generic user icon fallback
          <svg
            className="size-[60%] text-color-text-inverse"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-5.33 0-8 2.67-8 4v2h16v-2c0-1.33-2.67-4-8-4z"/>
          </svg>
        )}
      </span>

      {/* Status dot */}
      {statusOnline !== undefined && (
        <span
          aria-label={statusOnline ? 'Online' : 'Offline'}
          className={cn(
            'absolute bottom-0 right-0 size-2.5 rounded-radius-full border-2 border-color-background',
            statusOnline ? 'bg-color-success' : 'bg-color-text-muted',
          )}
        />
      )}
    </span>
  )
}

Avatar.displayName = 'Avatar'

export { Avatar }
