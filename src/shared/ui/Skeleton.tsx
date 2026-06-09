/**
 * Skeleton — Luthas Center primitive
 *
 * Use for loading placeholders. Renders an animated pulse block.
 * Pass width/height via className or inline style.
 */

import * as React from 'react'
import { cn } from '@/shared/lib/utils'

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional shape override: 'rect' (default) | 'circle' | 'text' */
  shape?: 'rect' | 'circle' | 'text'
}

function Skeleton({ shape = 'rect', className, style, ...rest }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'animate-pulse bg-color-surface-raised',
        shape === 'circle' && 'rounded-radius-full',
        shape === 'rect' && 'rounded-radius-md',
        shape === 'text' && 'rounded-radius-sm h-[1em]',
        className,
      )}
      style={style}
      {...rest}
    />
  )
}

Skeleton.displayName = 'Skeleton'

export { Skeleton }
