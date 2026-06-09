/**
 * Design Recipes — Luthas Center
 *
 * CVA / string-map recipes composed from the token system (tokens.ts → @theme
 * vars → Tailwind v4 utility classes). Primitives in src/shared/ui/* and
 * widgets reuse these so variant logic lives in ONE place.
 *
 * RULES:
 * - Output is always a Tailwind utility class string (no inline styles, no raw
 *   hex, no runtime CSS-in-JS). Tree-shakeable, RSC-friendly.
 * - Every color/space/radius/shadow utility resolves to a token var defined in
 *   globals.css @theme.
 * - `cn` from '@/shared/lib/utils' (clsx + tailwind-merge) merges recipe output
 *   with caller overrides.
 */

import { cva, type VariantProps } from 'class-variance-authority';

// ---------------------------------------------------------------------------
// Surface / Card
// ---------------------------------------------------------------------------

export const surface = cva('rounded-radius-lg overflow-hidden', {
  variants: {
    variant: {
      /** Resting card — soft elevation. */
      raised:   'bg-color-surface shadow-[var(--shadow-md)]',
      /** Bordered, flat — no shadow. */
      flat:     'bg-color-surface border border-color-border',
      /** Featured — stronger elevation. */
      featured: 'bg-color-background shadow-[var(--shadow-lg)]',
      /** Subtle muted band. */
      muted:    'bg-color-muted',
    },
    interactive: {
      true: 'transition-all duration-[var(--duration-base)] ease-[var(--ease-default)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)] focus-within:outline-2 focus-within:outline-offset-1 focus-within:outline-color-ring',
      false: '',
    },
  },
  defaultVariants: { variant: 'raised', interactive: false },
});
export type SurfaceVariants = VariantProps<typeof surface>;

// ---------------------------------------------------------------------------
// Panel — padded content container (dashboards, sidebars, forms)
// ---------------------------------------------------------------------------

export const panel = cva(
  'rounded-radius-xl border border-color-border bg-color-background',
  {
    variants: {
      padding: {
        none: '',
        sm:   'p-spacing-4',
        md:   'p-spacing-6',
        lg:   'p-spacing-8',
      },
      tone: {
        default: '',
        muted:   'bg-color-muted border-transparent',
        raised:  'bg-color-surface shadow-[var(--shadow-sm)]',
      },
    },
    defaultVariants: { padding: 'md', tone: 'default' },
  },
);
export type PanelVariants = VariantProps<typeof panel>;

// ---------------------------------------------------------------------------
// Section container — centered max-width wrapper with responsive gutters
// ---------------------------------------------------------------------------

export const section = cva(
  'mx-auto w-full px-spacing-4 md:px-spacing-8 lg:px-spacing-12',
  {
    variants: {
      width: {
        prose: 'max-w-[var(--container-prose)]',
        sm:    'max-w-[var(--container-sm)]',
        md:    'max-w-[var(--container-md)]',
        lg:    'max-w-[var(--container-lg)]',
        xl:    'max-w-[var(--container-xl)]',
        full:  'max-w-none',
      },
      rhythm: {
        none: '',
        sm:   'py-spacing-8',
        md:   'py-spacing-12',
        lg:   'py-spacing-16',
      },
    },
    defaultVariants: { width: 'xl', rhythm: 'md' },
  },
);
export type SectionVariants = VariantProps<typeof section>;

// ---------------------------------------------------------------------------
// Button
// ---------------------------------------------------------------------------

export const buttonBase = cva(
  [
    'inline-flex items-center justify-center gap-spacing-2 whitespace-nowrap',
    'rounded-radius-md font-semibold',
    'transition-all duration-[var(--duration-fast)] ease-[var(--ease-default)]',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-color-ring',
    'focus-visible:shadow-[var(--shadow-focus)]',
    'active:translate-y-px',
    'disabled:opacity-45 disabled:pointer-events-none disabled:cursor-not-allowed',
  ].join(' '),
  {
    variants: {
      variant: {
        primary:   'bg-color-primary text-color-primary-foreground border border-transparent hover:bg-color-primary-hover',
        secondary: 'bg-color-secondary text-color-secondary-foreground border border-transparent hover:opacity-90',
        accent:    'bg-color-accent text-color-accent-foreground border border-transparent hover:bg-color-accent-hover',
        outline:   'bg-transparent text-color-foreground border border-color-border hover:bg-color-muted',
        ghost:     'bg-transparent text-color-foreground border border-transparent hover:bg-color-muted',
        link:      'bg-transparent text-color-primary border-transparent underline-offset-4 hover:underline',
        danger:    'bg-color-error text-color-error-foreground border border-transparent hover:opacity-90',
      },
      size: {
        sm: 'px-spacing-3 py-spacing-2 text-sm min-h-[36px]',
        md: 'px-spacing-5 py-spacing-3 text-base min-h-[44px]',
        lg: 'px-spacing-6 py-spacing-4 text-lg min-h-[52px]',
        icon: 'p-spacing-2 min-h-[44px] min-w-[44px]',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);
export type ButtonRecipeVariants = VariantProps<typeof buttonBase>;

// ---------------------------------------------------------------------------
// Input / form control
// ---------------------------------------------------------------------------

export const inputBase = cva(
  [
    'w-full rounded-radius-md bg-color-background text-color-foreground',
    'border border-color-input',
    'px-spacing-3 py-spacing-2 text-base',
    'placeholder:text-color-text-muted',
    'transition-all duration-[var(--duration-fast)] ease-[var(--ease-default)]',
    'focus-visible:outline-none focus-visible:border-color-ring focus-visible:shadow-[var(--shadow-focus)]',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-color-muted',
  ].join(' '),
  {
    variants: {
      state: {
        default: '',
        error:   'border-color-error focus-visible:border-color-error focus-visible:shadow-[0_0_0_3px_hsl(353_78%_47%/0.30)]',
        success: 'border-color-success',
      },
      size: {
        sm: 'py-spacing-1 text-sm',
        md: 'py-spacing-2 text-base',
        lg: 'py-spacing-3 text-lg',
      },
    },
    defaultVariants: { state: 'default', size: 'md' },
  },
);
export type InputRecipeVariants = VariantProps<typeof inputBase>;

// ---------------------------------------------------------------------------
// Badge / Tag — tinted bg + matching foreground
// ---------------------------------------------------------------------------

export const badge = cva(
  [
    'inline-flex items-center gap-spacing-1 rounded-radius-full',
    'px-spacing-2 py-spacing-1 text-xs font-medium leading-none whitespace-nowrap',
  ].join(' '),
  {
    variants: {
      variant: {
        primary:   'bg-color-primary/15 text-color-primary',
        secondary: 'bg-color-surface-raised text-color-text-muted',
        accent:    'bg-color-accent/15 text-color-accent',
        success:   'bg-color-success/15 text-color-success',
        warning:   'bg-color-warning/15 text-color-warning',
        error:     'bg-color-error/15 text-color-error',
        info:      'bg-color-info/15 text-color-info',
        outline:   'bg-transparent text-color-text-muted border border-color-border',
        solid:     'bg-color-primary text-color-primary-foreground',
      },
    },
    defaultVariants: { variant: 'secondary' },
  },
);
export type BadgeRecipeVariants = VariantProps<typeof badge>;

// ---------------------------------------------------------------------------
// Link
// ---------------------------------------------------------------------------

export const link = cva(
  'rounded-radius-sm transition-colors duration-[var(--duration-fast)] ease-[var(--ease-default)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-color-ring',
  {
    variants: {
      variant: {
        /** Inline prose link — underlined, brand-colored. */
        inline:  'text-color-primary underline underline-offset-4 decoration-color-primary/40 hover:decoration-color-primary',
        /** Nav link — color shift only. */
        nav:     'text-color-text-muted hover:text-color-foreground aria-[current=page]:text-color-foreground aria-[current=page]:font-semibold',
        /** Quiet — inherits color, underline on hover. */
        quiet:   'text-color-foreground no-underline hover:underline underline-offset-4',
        /** Footer link — muted on dark. */
        footer:  'text-color-footer-link hover:text-color-text-inverse',
      },
    },
    defaultVariants: { variant: 'inline' },
  },
);
export type LinkRecipeVariants = VariantProps<typeof link>;

// ---------------------------------------------------------------------------
// Aggregate export
// ---------------------------------------------------------------------------

export const recipes = {
  surface,
  panel,
  section,
  buttonBase,
  inputBase,
  badge,
  link,
} as const;
