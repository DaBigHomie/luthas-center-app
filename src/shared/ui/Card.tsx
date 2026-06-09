/**
 * Card — Luthas Center primitive
 *
 * Variants: default | flat | featured | horizontal | overlay
 * States:   default | hover (lift) | focus-within | selected
 *
 * Composed of named sub-components so pages can use Card.Root + Card.Media etc.
 */

import * as React from 'react'
import { cn } from '@/shared/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CardVariant = 'default' | 'flat' | 'featured' | 'horizontal' | 'overlay'

export interface CardRootProps extends React.HTMLAttributes<HTMLElement> {
  variant?: CardVariant
  selected?: boolean
  as?: 'article' | 'div' | 'li'
}

// ---------------------------------------------------------------------------
// CardRoot
// ---------------------------------------------------------------------------

function CardRoot({
  variant = 'default',
  selected = false,
  as: Tag = 'article',
  className,
  children,
  ...rest
}: CardRootProps) {
  const variantClasses: Record<CardVariant, string> = {
    default: 'bg-color-surface shadow-[var(--shadow-md)] rounded-radius-lg overflow-hidden',
    flat: 'bg-color-surface border border-color-border rounded-radius-lg overflow-hidden',
    featured:
      'bg-color-surface shadow-[var(--shadow-lg)] rounded-radius-lg overflow-hidden',
    horizontal:
      'bg-color-surface shadow-[var(--shadow-sm)] rounded-radius-lg overflow-hidden flex flex-row',
    overlay: 'relative shadow-[var(--shadow-lg)] rounded-radius-lg overflow-hidden',
  }

  return (
    <Tag
      className={cn(
        'group transition-all duration-[var(--duration-base)] ease-[var(--ease-default)]',
        'hover:-translate-y-0.5',
        'focus-within:outline-2 focus-within:outline-color-border-focus focus-within:outline-offset-1',
        variantClasses[variant],
        selected && 'ring-2 ring-color-primary',
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  )
}

// ---------------------------------------------------------------------------
// CardMedia — 16:9 figure
// ---------------------------------------------------------------------------

interface CardMediaProps {
  src: string
  alt: string
  className?: string
}

function CardMedia({ src, alt, className }: CardMediaProps) {
  return (
    <figure
      className={cn('relative w-full overflow-hidden aspect-video m-0', className)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="w-full h-full object-cover"
      />
    </figure>
  )
}

// ---------------------------------------------------------------------------
// CardBody — padded content area
// ---------------------------------------------------------------------------

function CardBody({ className, children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-spacing-4 flex flex-col gap-spacing-2', className)} {...rest}>
      {children}
    </div>
  )
}

// ---------------------------------------------------------------------------
// CardTitle
// ---------------------------------------------------------------------------

function CardTitle({ className, children, ...rest }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        'font-[var(--font-heading)] font-semibold text-lg text-color-text leading-[1.35]',
        className,
      )}
      {...rest}
    >
      {children}
    </h3>
  )
}

// ---------------------------------------------------------------------------
// CardMeta — muted small row
// ---------------------------------------------------------------------------

function CardMeta({ className, children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-center gap-spacing-2 text-sm text-color-text-muted', className)}
      {...rest}
    >
      {children}
    </div>
  )
}

// ---------------------------------------------------------------------------
// CardDivider
// ---------------------------------------------------------------------------

function CardDivider({ className }: { className?: string }) {
  return <hr className={cn('border-color-border my-spacing-2', className)} aria-hidden="true" />
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export const Card = Object.assign(CardRoot, {
  Media: CardMedia,
  Body: CardBody,
  Title: CardTitle,
  Meta: CardMeta,
  Divider: CardDivider,
})
