/**
 * Separator — Luthas Center primitive
 *
 * Thin horizontal or vertical dividing line.
 * Uses color.border token.
 */

import * as React from 'react'
import { cn } from '@/shared/lib/utils'

export interface SeparatorProps extends React.HTMLAttributes<HTMLHRElement> {
  orientation?: 'horizontal' | 'vertical'
}

function Separator({
  orientation = 'horizontal',
  className,
  ...rest
}: SeparatorProps) {
  return (
    <hr
      aria-hidden="true"
      role="separator"
      aria-orientation={orientation}
      className={cn(
        'border-0 bg-color-border shrink-0',
        orientation === 'horizontal' ? 'h-px w-full my-spacing-4' : 'w-px h-full mx-spacing-4',
        className,
      )}
      {...rest}
    />
  )
}

Separator.displayName = 'Separator'

export { Separator }
