/**
 * Design Tokens — Luthas Center for Excellence
 * "Impossible to Inevitable"
 *
 * SSOT for all design decisions across the platform.
 *
 * This is a MODERN, production-grade token system for a fresh Next.js 16 /
 * React 19 / Tailwind v4 webapp — NOT a port of the legacy WordPress `jnews`
 * magazine theme. Identity is preserved (warm-orange accent, calm neutral
 * foreground, education + mental-health nonprofit tone) but the execution is
 * contemporary: semantic color ROLES, a fluid type scale, an 8pt spacing grid,
 * soft layered elevation, and a motion system.
 *
 * RULES:
 * - No raw hex in components — import from here (HSL strings at the boundary).
 * - Hex values appear in source-reference comments only.
 * - CSS custom properties + Tailwind v4 @theme are wired in globals.css.
 *
 * NON-BREAKING CONTRACT:
 * Every token NAME, CSS var, and Tailwind utility class already in use across
 * the codebase keeps resolving. Only VALUES were refined to the modern palette,
 * and new semantic roles were ADDED. Legacy names (primary-hover, surface,
 * surface-raised, surface-overlay, text, text-muted, text-inverse, border,
 * border-focus, footer-*, heading, text-secondary, accent-hover,
 * border-separator, surface-code, rating, *-bg, etc.) all remain valid and map
 * onto the new role system.
 *
 * MODERN PALETTE SEED:
 * - Brand accent: warm orange ~hsl(20 92% 52%) (refined from #f86320).
 * - Neutral ramp: a clean cool-slate scale (hue 222, low saturation) for
 *   foreground/surfaces — modern, accessible (WCAG AA on white), not pure grey.
 * - Primary (interactive brand): the warm orange — the trustworthy, energetic
 *   "Impossible to Inevitable" CTA color.
 * - Secondary: deep navy ~hsl(216 64% 24%) — structural / supportive brand.
 */

// ---------------------------------------------------------------------------
// Colors — HSL strings only at export boundary
// ---------------------------------------------------------------------------

/**
 * Semantic color palette — modern, accessible (WCAG AA) light theme.
 * Seeded from the brand orange + a clean cool-slate neutral ramp.
 *
 * Legacy key compatibility is preserved: every previously-exported key still
 * exists with a modernized value. New role keys are additive.
 */
export const colors = {
  // --- Brand / interactive roles ---
  /** hsl(20, 92%, 42%)   #ce4a09  brand orange — primary CTA / interactive (WCAG AA 4.56:1 on white) */
  primary:         'hsl(20, 92%, 42%)',
  /** hsl(20, 92%, 35%)   #ab3e07  primary hover (darkened, WCAG AA 6.12:1 on white) */
  primaryHover:    'hsl(20, 92%, 35%)',
  /** hsl(0, 0%, 100%)    #ffffff  text/icon on primary */
  primaryForeground: 'hsl(0, 0%, 100%)',
  /** hsl(216, 64%, 24%)  #163e6b  deep navy — structural / secondary brand */
  secondary:       'hsl(216, 64%, 24%)',
  /** hsl(0, 0%, 100%)    #ffffff  text on secondary navy */
  secondaryForeground: 'hsl(0, 0%, 100%)',
  /** hsl(20, 92%, 42%)   #ce4a09  brand orange accent (== primary hue; WCAG AA with white) */
  accent:          'hsl(20, 92%, 42%)',
  /** hsl(20, 92%, 35%)   #ab3e07  accent hover */
  accentHover:     'hsl(20, 92%, 35%)',
  /** hsl(0, 0%, 100%)    #ffffff  text on accent */
  accentForeground: 'hsl(0, 0%, 100%)',

  // --- Surfaces ---
  /** hsl(0, 0%, 100%)    #ffffff  page background */
  background:      'hsl(0, 0%, 100%)',
  /** hsl(222, 14%, 99%)  #fbfcfd  base surface — cards, sections */
  surface:         'hsl(222, 14%, 99%)',
  /** hsl(222, 16%, 96%)  #f3f5f8  elevated surface — panels, hover */
  surfaceRaised:   'hsl(222, 16%, 96%)',
  /** hsl(222, 30%, 12%)  #161e2e  dark overlay / drawer backdrop */
  surfaceOverlay:  'hsl(222, 30%, 12%)',
  /** hsl(222, 18%, 97%)  #f6f8fa  near-white code/pre surface */
  surfaceCode:     'hsl(222, 18%, 97%)',

  // --- Foreground / text ---
  /** hsl(222, 32%, 16%)  #1b2436  primary foreground / body text (AA on bg) */
  foreground:      'hsl(222, 32%, 16%)',
  /** hsl(222, 32%, 16%)  #1b2436  legacy alias of foreground */
  text:            'hsl(222, 32%, 16%)',
  /** hsl(222, 14%, 46%)  #677183  muted / secondary text (AA on bg) */
  textMuted:       'hsl(222, 14%, 46%)',
  /** hsl(222, 14%, 38%)  #535c6b  slightly stronger secondary text */
  textSecondary:   'hsl(222, 16%, 38%)',
  /** hsl(0, 0%, 100%)    #ffffff  text on dark / colored backgrounds */
  textInverse:     'hsl(0, 0%, 100%)',
  /** hsl(222, 28%, 22%)  #28324a  heading color (slightly deeper than body) */
  heading:         'hsl(222, 28%, 22%)',

  // --- Muted role (subtle fills + their foreground) ---
  /** hsl(222, 16%, 95%)  #eff1f5  muted fill — chips, subtle bands */
  muted:           'hsl(222, 16%, 95%)',
  /** hsl(222, 14%, 42%)  #5d6675  text on muted fill */
  mutedForeground: 'hsl(222, 14%, 42%)',

  // --- Borders / inputs / ring ---
  /** hsl(222, 16%, 90%)  #e2e6ed  default border / separator */
  border:          'hsl(222, 16%, 90%)',
  /** hsl(222, 16%, 84%)  #cfd5e0  stronger separator — dividers, nav borders */
  borderSeparator: 'hsl(222, 16%, 84%)',
  /** hsl(222, 16%, 88%)  #dadfe8  input border (== border family) */
  input:           'hsl(222, 16%, 88%)',
  /** hsl(20, 92%, 42%)   #ce4a09  focus ring — brand orange (WCAG AA 4.56:1) */
  ring:            'hsl(20, 92%, 42%)',
  /** hsl(20, 92%, 42%)   #ce4a09  legacy focus-ring alias (brand orange) */
  borderFocus:     'hsl(20, 92%, 42%)',

  // --- Semantic status (AA text-on-white) ---
  /** hsl(353, 78%, 47%)  #d61530  error / destructive */
  error:           'hsl(353, 78%, 47%)',
  /** hsl(0, 0%, 100%)    #ffffff  text on error */
  errorForeground: 'hsl(0, 0%, 100%)',
  /** hsl(151, 60%, 30%)  #1f7a4d  success / completion */
  success:         'hsl(151, 60%, 30%)',
  /** hsl(0, 0%, 100%)    #ffffff  text on success */
  successForeground: 'hsl(0, 0%, 100%)',
  /** hsl(33, 90%, 42%)   #cc7a0a  warning / in-progress (AA on white) */
  warning:         'hsl(33, 90%, 42%)',
  /** hsl(0, 0%, 100%)    #ffffff  text on warning */
  warningForeground: 'hsl(0, 0%, 100%)',
  /** hsl(205, 78%, 40%)  #1675b6  info / tip */
  info:            'hsl(205, 78%, 40%)',
  /** hsl(0, 0%, 100%)    #ffffff  text on info */
  infoForeground:  'hsl(0, 0%, 100%)',

  /** hsl(41, 96%, 50%)   #f9b104  star/rating + highlight */
  rating:          'hsl(41, 96%, 50%)',

  // --- Footer roles (legacy names; modernized to the navy/slate system) ---
  /** hsl(222, 30%, 12%)  #161e2e  footer background (== surface-overlay) */
  footerBg:        'hsl(222, 30%, 12%)',
  /** hsl(222, 22%, 72%)  #a6afc2  footer link color */
  footerLink:      'hsl(222, 22%, 72%)',
  /** hsl(222, 18%, 64%)  #909bb0  footer body text */
  footerText:      'hsl(222, 18%, 64%)',
  /** hsl(222, 16%, 56%)  #7d8799  footer copyright text */
  footerCopyright: 'hsl(222, 16%, 56%)',

  // --- Tinted semantic surfaces (bg/text pairs for alerts & badges) ---
  /** error tint surface */
  errorBg:         'hsl(353, 78%, 47%, 0.12)',
  /** success tint surface */
  successBg:       'hsl(151, 60%, 30%, 0.12)',
  /** warning tint surface */
  warningBg:       'hsl(33, 90%, 42%, 0.14)',
  /** info tint surface */
  infoBg:          'hsl(205, 78%, 40%, 0.12)',
} as const;

/**
 * Canonical hyphenated `color` object. Docs + Tailwind utility classes
 * (`bg-color-primary`, `text-color-text-muted`, etc.) resolve against these
 * keys. Every legacy key is preserved; new semantic roles are additive.
 */
export const color = {
  // Brand / interactive
  primary:               colors.primary,
  'primary-hover':       colors.primaryHover,
  'primary-foreground':  colors.primaryForeground,
  secondary:             colors.secondary,
  'secondary-foreground': colors.secondaryForeground,
  accent:                colors.accent,
  'accent-hover':        colors.accentHover,
  'accent-foreground':   colors.accentForeground,

  // Surfaces
  background:        colors.background,
  surface:           colors.surface,
  'surface-raised':  colors.surfaceRaised,
  'surface-overlay': colors.surfaceOverlay,
  'surface-code':    colors.surfaceCode,

  // Foreground / text
  foreground:        colors.foreground,
  text:              colors.text,
  'text-muted':      colors.textMuted,
  'text-secondary':  colors.textSecondary,
  'text-inverse':    colors.textInverse,
  heading:           colors.heading,

  // Muted role
  muted:             colors.muted,
  'muted-foreground': colors.mutedForeground,

  // Borders / inputs / ring
  border:            colors.border,
  'border-separator': colors.borderSeparator,
  'border-focus':    colors.borderFocus,
  input:             colors.input,
  ring:              colors.ring,

  // Semantic
  error:               colors.error,
  'error-foreground':  colors.errorForeground,
  success:             colors.success,
  'success-foreground': colors.successForeground,
  warning:             colors.warning,
  'warning-foreground': colors.warningForeground,
  info:                colors.info,
  'info-foreground':   colors.infoForeground,
  rating:              colors.rating,

  // Footer
  'footer-bg':        colors.footerBg,
  'footer-link':      colors.footerLink,
  'footer-text':      colors.footerText,
  'footer-copyright': colors.footerCopyright,

  // Tinted semantic surfaces
  'error-bg':         colors.errorBg,
  'success-bg':       colors.successBg,
  'warning-bg':       colors.warningBg,
  'info-bg':          colors.infoBg,
} as const;

export type ColorToken = keyof typeof color;

// ---------------------------------------------------------------------------
// Fonts
// ---------------------------------------------------------------------------

export const fonts = {
  /** Heading font family (next/font: Montserrat). */
  heading: "'Montserrat', sans-serif",
  /** Body font family (next/font: Lato). */
  body: "'Lato', sans-serif",
  /** Monospace font — modern system mono stack. */
  mono: "ui-monospace, 'SF Mono', SFMono-Regular, Menlo, Monaco, 'Cascadia Code', monospace",
} as const;

// Alias for components.md `font.heading`, `font.body`, `font.mono` references.
export const font = {
  heading: fonts.heading,
  body:    fonts.body,
  mono:    fonts.mono,

  size: {
    /** 0.75rem / 12px */
    xs:    '0.75rem',
    /** 0.875rem / 14px */
    sm:    '0.875rem',
    /** 1rem / 16px — body base */
    base:  '1rem',
    /** 1.125rem / 18px */
    lg:    '1.125rem',
    /** 1.25rem / 20px */
    xl:    '1.25rem',
    /** 1.5rem / 24px */
    '2xl': '1.5rem',
    /** 1.875rem / 30px */
    '3xl': '1.875rem',
    /** 2.25rem / 36px */
    '4xl': '2.25rem',
    /** 3rem / 48px */
    '5xl': '3rem',
    /** 3.75rem / 60px — oversized hero display */
    '6xl': '3.75rem',
  },

  weight: {
    /** 300 — light display weight */
    light:    '300',
    /** 400 */
    normal:   '400',
    /** 500 */
    medium:   '500',
    /** 600 */
    semibold: '600',
    /** 700 */
    bold:     '700',
    /** 800 — heavy display */
    extrabold: '800',
  },

  leading: {
    /** 1.1 — tight display headlines */
    none:    '1.1',
    /** 1.2 — display */
    tight:   '1.2',
    /** 1.35 — headings */
    snug:    '1.35',
    /** 1.4 — sub-headings */
    heading: '1.4',
    /** 1.6 — body copy */
    normal:  '1.6',
    /** 1.75 — relaxed long-form prose */
    relaxed: '1.75',
  },

  /** Letter-spacing / tracking scale. */
  tracking: {
    /** -0.025em — large display headlines */
    tighter: '-0.025em',
    /** -0.015em — headings */
    tight:   '-0.015em',
    /** 0 */
    normal:  '0',
    /** 0.05em — small uppercase labels */
    wide:    '0.05em',
    /** 0.1em — eyebrows / category labels */
    wider:   '0.1em',
  },
} as const;

// ---------------------------------------------------------------------------
// Typography Scale — fluid, role-named steps (clamp() for zero-shift scaling)
// Each step pairs a fluid size with line-height, weight, tracking, and family.
// ---------------------------------------------------------------------------

export const typography = {
  /** Oversized hero display. */
  display: {
    family:        fonts.heading,
    size:          'clamp(2.5rem, 1.6rem + 4.5vw, 3.75rem)', // 40 → 60px
    lineHeight:    '1.05',
    weight:        800,
    letterSpacing: '-0.025em',
    use:           'Oversized hero headline',
  },
  h1: {
    family:        fonts.heading,
    size:          'clamp(2rem, 1.4rem + 3vw, 3rem)',        // 32 → 48px
    lineHeight:    '1.12',
    weight:        700,
    letterSpacing: '-0.02em',
    use:           'Page H1, hero headline',
  },
  h2: {
    family:        fonts.heading,
    size:          'clamp(1.625rem, 1.25rem + 1.9vw, 2.25rem)', // 26 → 36px
    lineHeight:    '1.2',
    weight:        700,
    letterSpacing: '-0.015em',
    use:           'Section titles',
  },
  h3: {
    family:        fonts.heading,
    size:          'clamp(1.375rem, 1.15rem + 1.1vw, 1.75rem)', // 22 → 28px
    lineHeight:    '1.3',
    weight:        700,
    letterSpacing: '-0.01em',
    use:           'Sub-sections, card titles',
  },
  h4: {
    family:        fonts.heading,
    size:          '1.375rem', // 22px
    lineHeight:    '1.35',
    weight:        600,
    letterSpacing: '-0.005em',
    use:           'Block headings, widget titles',
  },
  h5: {
    family:        fonts.heading,
    size:          '1.125rem', // 18px
    lineHeight:    '1.4',
    weight:        600,
    letterSpacing: '0',
    use:           'Minor headings',
  },
  h6: {
    family:        fonts.heading,
    size:          '1rem', // 16px
    lineHeight:    '1.4',
    weight:        600,
    letterSpacing: '0',
    use:           'Smallest headings, eyebrow titles',
  },
  'body-lg': {
    family:        fonts.body,
    size:          '1.125rem', // 18px
    lineHeight:    '1.7',
    weight:        400,
    letterSpacing: '0',
    use:           'Lead paragraphs, intros',
  },
  'body-base': {
    family:        fonts.body,
    size:          '1rem', // 16px
    lineHeight:    '1.65',
    weight:        400,
    letterSpacing: '0',
    use:           'Primary body copy',
  },
  'body-sm': {
    family:        fonts.body,
    size:          '0.875rem', // 14px
    lineHeight:    '1.6',
    weight:        400,
    letterSpacing: '0',
    use:           'Descriptions, secondary copy',
  },
  caption: {
    family:        fonts.body,
    size:          '0.8125rem', // 13px
    lineHeight:    '1.5',
    weight:        400,
    letterSpacing: '0',
    use:           'Captions, fine print, footnotes',
  },
  label: {
    family:        fonts.body,
    size:          '0.75rem', // 12px
    lineHeight:    '1.4',
    weight:        600,
    letterSpacing: '0.04em',
    use:           'Chips, badges, meta, form labels',
  },
} as const;

// ---------------------------------------------------------------------------
// Spacing — 8pt grid (4px sub-steps preserved for fine control)
// ---------------------------------------------------------------------------

export const spacing = {
  0:    '0',        //   0px
  px:   '1px',      //   1px — hairline
  0.5:  '0.125rem', //   2px
  1:    '0.25rem',  //   4px
  2:    '0.5rem',   //   8px   ← 8pt grid base
  3:    '0.75rem',  //  12px
  4:    '1rem',     //  16px
  5:    '1.25rem',  //  20px
  6:    '1.5rem',   //  24px
  7:    '1.75rem',  //  28px
  8:    '2rem',     //  32px
  10:   '2.5rem',   //  40px
  12:   '3rem',     //  48px
  14:   '3.5rem',   //  56px
  16:   '4rem',     //  64px
  18:   '4.5rem',   //  72px
  20:   '5rem',     //  80px
  24:   '6rem',     //  96px
  32:   '8rem',     // 128px
} as const;

// Alias: components.md uses `space.4`, `space.6`, etc.
export const space = spacing;

// ---------------------------------------------------------------------------
// Breakpoints
// ---------------------------------------------------------------------------

export const breakpoints = {
  /** 640px */
  sm:  '640px',
  /** 768px */
  md:  '768px',
  /** 1024px */
  lg:  '1024px',
  /** 1280px */
  xl:  '1280px',
  /** 1536px — ultra-wide */
  '2xl': '1536px',
} as const;

// Alias: components.md uses `bp.sm`, `bp.md`, etc.
export const bp = breakpoints;

// ---------------------------------------------------------------------------
// Container max-widths
// ---------------------------------------------------------------------------

export const container = {
  /** Reading-width prose */
  prose: '68ch',
  /** Narrow content column */
  sm:    '40rem',  //  640px
  /** Standard content column */
  md:    '48rem',  //  768px
  /** Wide content */
  lg:    '64rem',  // 1024px
  /** Default page container cap */
  xl:    '80rem',  // 1280px
  /** Ultra-wide */
  '2xl': '90rem',  // 1440px
} as const;

// ---------------------------------------------------------------------------
// Z-index scale
// ---------------------------------------------------------------------------

export const zIndex = {
  base:     '0',
  raised:   '10',
  dropdown: '1000',
  sticky:   '1100',
  overlay:  '1200',
  modal:    '1300',
  popover:  '1400',
  toast:    '1500',
  tooltip:  '1600',
} as const;

// ---------------------------------------------------------------------------
// Border Radii — modern, slightly rounder than the legacy magazine theme
// ---------------------------------------------------------------------------

export const radii = {
  /** 0.375rem / 6px — small inputs, tight UI */
  sm:   '0.375rem',
  /** 0.5rem / 8px — buttons, form fields */
  md:   '0.5rem',
  /** 0.75rem / 12px — cards, dropdowns */
  lg:   '0.75rem',
  /** 1rem / 16px — large surfaces, panels */
  xl:   '1rem',
  /** 1.5rem / 24px — feature callouts, modals */
  '2xl': '1.5rem',
  /** 9999px — pills, avatars, tags */
  full: '9999px',
} as const;

// Alias: components.md uses `radius.sm`, `radius.md`, etc.
export const radius = radii;

// ---------------------------------------------------------------------------
// Motion — durations + easings + composed transitions
// ---------------------------------------------------------------------------

export const motion = {
  /** 120ms — micro interactions (hover tint, icon) */
  fastDuration:  '120ms',
  fastEasing:    'cubic-bezier(0.4, 0, 0.2, 1)',
  /** 220ms — standard (card hover, drawer) */
  baseDuration:  '220ms',
  baseEasing:    'cubic-bezier(0.4, 0, 0.2, 1)',
  /** 360ms — emphatic (page/hero, slide-in) */
  slowDuration:  '360ms',
  slowEasing:    'cubic-bezier(0.22, 1, 0.36, 1)',

  /** Named easings */
  easeStandard: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeEntrance: 'cubic-bezier(0, 0, 0.2, 1)',
  easeExit:     'cubic-bezier(0.4, 0, 1, 1)',
  easeEmphasis: 'cubic-bezier(0.22, 1, 0.36, 1)',

  /** Card hover lift */
  cardHoverTransform: 'translateY(-3px)',
} as const;

// Alias: components.md uses `transition.fast`, `transition.base`, `transition.slow`.
export const transition = {
  fast: `all ${motion.fastDuration} ${motion.fastEasing}`,
  base: `all ${motion.baseDuration} ${motion.baseEasing}`,
  slow: `all ${motion.slowDuration} ${motion.slowEasing}`,
} as const;

// ---------------------------------------------------------------------------
// Shadow Tokens — modern soft, layered elevation
// ---------------------------------------------------------------------------

export const shadow = {
  /** Hairline elevation — chips, subtle separation */
  xs:    '0 1px 2px hsl(222 32% 16% / 0.06)',
  /** Resting card */
  sm:    '0 1px 2px hsl(222 32% 16% / 0.06), 0 2px 6px hsl(222 32% 16% / 0.06)',
  /** Standard card / dropdown */
  md:    '0 2px 4px hsl(222 32% 16% / 0.06), 0 6px 16px hsl(222 32% 16% / 0.10)',
  /** Featured / hero / modal */
  lg:    '0 4px 8px hsl(222 32% 16% / 0.08), 0 16px 32px hsl(222 32% 16% / 0.14)',
  /** Floating popover / large modal */
  xl:    '0 8px 16px hsl(222 32% 16% / 0.10), 0 28px 56px hsl(222 32% 16% / 0.18)',
  /** Focus ring — brand orange (42% lightness matches primary) */
  focus: '0 0 0 3px hsl(20 92% 42% / 0.35)',
} as const;

// ---------------------------------------------------------------------------
// Elevation / Depth — composed surface tokens
// ---------------------------------------------------------------------------

export const elevation = {
  canvas: {
    bg: colors.background,
  },
  surface: {
    bg:     colors.surface,
    border: `1px solid ${colors.border}`,
  },
  raised: {
    bg:     colors.surfaceRaised,
    border: `1px solid ${colors.border}`,
    shadow: shadow.sm,
  },
  elevated: {
    bg:     colors.background,
    shadow: shadow.md,
  },
  floating: {
    bg:     colors.background,
    shadow: shadow.lg,
  },
} as const;

// ---------------------------------------------------------------------------
// Status Colors
// ---------------------------------------------------------------------------

export const statusColors = {
  /** Pending / awaiting action */
  pending:    colors.warning,
  /** Confirmed / completed */
  confirmed:  colors.success,
  /** Error / cancelled */
  cancelled:  colors.error,
  /** In progress / processing */
  processing: colors.info,
} as const;

export type StatusKey = keyof typeof statusColors;

// ---------------------------------------------------------------------------
// CSS custom property names (Tailwind v4 / global CSS injection reference)
// ---------------------------------------------------------------------------

export const cssVars = {
  // Colors — legacy set preserved
  'color-primary':           '--color-primary',
  'color-primary-hover':     '--color-primary-hover',
  'color-primary-foreground': '--color-primary-foreground',
  'color-secondary':         '--color-secondary',
  'color-secondary-foreground': '--color-secondary-foreground',
  'color-accent':            '--color-accent',
  'color-accent-hover':      '--color-accent-hover',
  'color-accent-foreground': '--color-accent-foreground',
  'color-background':        '--color-background',
  'color-foreground':        '--color-foreground',
  'color-surface':           '--color-surface',
  'color-surface-raised':    '--color-surface-raised',
  'color-surface-overlay':   '--color-surface-overlay',
  'color-muted':             '--color-muted',
  'color-muted-foreground':  '--color-muted-foreground',
  'color-text':              '--color-text',
  'color-text-muted':        '--color-text-muted',
  'color-text-inverse':      '--color-text-inverse',
  'color-border':            '--color-border',
  'color-border-focus':      '--color-border-focus',
  'color-input':             '--color-input',
  'color-ring':              '--color-ring',
  'color-error':             '--color-error',
  'color-success':           '--color-success',
  'color-warning':           '--color-warning',
  'color-info':              '--color-info',
} as const;

// ---------------------------------------------------------------------------
// CSS custom property declaration block
// Kept for compatibility; the canonical wiring is the @theme block in
// globals.css. Prefer Tailwind utility classes that resolve to @theme vars.
// ---------------------------------------------------------------------------

export const cssCustomProperties = `
  /* Luthas Center Design Tokens — modern role system */

  /* Colors */
  --color-primary:            ${color.primary};
  --color-primary-hover:      ${color['primary-hover']};
  --color-primary-foreground: ${color['primary-foreground']};
  --color-secondary:          ${color.secondary};
  --color-secondary-foreground: ${color['secondary-foreground']};
  --color-accent:             ${color.accent};
  --color-accent-hover:       ${color['accent-hover']};
  --color-accent-foreground:  ${color['accent-foreground']};
  --color-background:         ${color.background};
  --color-foreground:         ${color.foreground};
  --color-surface:            ${color.surface};
  --color-surface-raised:     ${color['surface-raised']};
  --color-surface-overlay:    ${color['surface-overlay']};
  --color-muted:              ${color.muted};
  --color-muted-foreground:   ${color['muted-foreground']};
  --color-text:               ${color.text};
  --color-text-muted:         ${color['text-muted']};
  --color-text-inverse:       ${color['text-inverse']};
  --color-border:             ${color.border};
  --color-border-focus:       ${color['border-focus']};
  --color-input:              ${color.input};
  --color-ring:               ${color.ring};
  --color-error:              ${color.error};
  --color-success:            ${color.success};
  --color-warning:            ${color.warning};
  --color-info:               ${color.info};

  /* Typography */
  --font-heading: ${font.heading};
  --font-body:    ${font.body};
  --font-mono:    ${font.mono};

  /* Radius */
  --radius-sm:   ${radius.sm};
  --radius-md:   ${radius.md};
  --radius-lg:   ${radius.lg};
  --radius-xl:   ${radius.xl};
  --radius-2xl:  ${radius['2xl']};
  --radius-full: ${radius.full};

  /* Shadows */
  --shadow-xs:    ${shadow.xs};
  --shadow-sm:    ${shadow.sm};
  --shadow-md:    ${shadow.md};
  --shadow-lg:    ${shadow.lg};
  --shadow-xl:    ${shadow.xl};
  --shadow-focus: ${shadow.focus};
` as const;

// ---------------------------------------------------------------------------
// Flat tokens — convenience export for tests and utilities
// ---------------------------------------------------------------------------

export const tokens = {
  color,
  colors,
  fonts,
  font,
  typography,
  spacing,
  space,
  breakpoints,
  bp,
  container,
  zIndex,
  elevation,
  radii,
  radius,
  motion,
  transition,
  shadow,
  statusColors,
} as const;

export type Tokens = typeof tokens;
