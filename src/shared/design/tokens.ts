/**
 * Design Tokens — Luthas Center for Excellence
 * "Impossible to Inevitable"
 *
 * SSOT for all design decisions across the platform.
 * Category structure mirrors the proven MIH (Michael Imani Hub) pattern.
 *
 * RULES:
 * - No raw hex in components — import from here
 * - All exported color values are HSL strings
 * - Hex values appear in source-reference comments only
 * - CSS custom properties + Tailwind v4 @theme wired in globals.css
 *
 * Sources:
 *   • .wp-source/themes/jnews/data/import/education/style.json
 *   • .wp-source/backup_*-db  (live site theme_mods_jnews, 167-entry block)
 *   • .wp-source/themes/jnews/style-editor.css
 *   • .wp-source/themes/jnews/data/import/education/scheme.css
 *   • .wp-source/themes/jnews/assets/dist/frontend.min.css
 *   • .wp-source/uploads 4/yellow-pencil/custom-4.css
 *
 * Token names in the `color`, `font`, `space`, `radius`, `shadow`,
 * `transition`, and `bp` exports are the canonical semantic names referenced
 * throughout docs/design/components.md and docs/design/templates/*.md.
 * Do NOT rename them without updating those documents.
 */

// ---------------------------------------------------------------------------
// Colors — HSL strings only at export boundary
// ---------------------------------------------------------------------------

/**
 * Semantic color palette — calm, trustworthy nonprofit/education brand.
 * Light-mode base; no glassmorphism or nightlife values.
 */
export const colors = {
  /** hsl(0, 0%, 7%)      #121212  jnews_accent_color (live DB) */
  primary:         'hsl(0, 0%, 7%)',
  /** hsl(0, 0%, 32%)     #525252  jnews_btnhover_color (live DB) */
  primaryHover:    'hsl(0, 0%, 32%)',
  /** hsl(216, 72%, 21%)  #0F2E5E  jnews_header_midbar_border (education style.json) */
  secondary:       'hsl(216, 72%, 21%)',
  /** hsl(19, 94%, 55%)   #f86320  jnews_footer_button_bg (education style.json) */
  accent:          'hsl(19, 94%, 55%)',

  /** hsl(0, 0%, 100%)    #ffffff  page background */
  background:      'hsl(0, 0%, 100%)',
  /** hsl(0, 0%, 96%)     #f5f5f5  card / section background */
  surface:         'hsl(0, 0%, 96%)',
  /** hsl(0, 0%, 93%)     #eeeeee  slightly elevated surface */
  surfaceRaised:   'hsl(0, 0%, 93%)',
  /** hsl(0, 0%, 7%)      #121212  dark overlay / drawer backdrop */
  surfaceOverlay:  'hsl(0, 0%, 7%)',

  /** hsl(0, 0%, 24%)     #3d3d3d  primary body text */
  text:            'hsl(0, 0%, 24%)',
  /** hsl(0, 0%, 46%)     #757575  secondary / placeholder text */
  textMuted:       'hsl(0, 0%, 46%)',
  /** hsl(0, 0%, 100%)    #ffffff  text on dark backgrounds */
  textInverse:     'hsl(0, 0%, 100%)',

  /** hsl(0, 0%, 93%)     #eeeeee  default border / separator */
  border:          'hsl(0, 0%, 93%)',
  /** hsl(198, 61%, 51%)  #37a0ce  focus ring / active input border */
  borderFocus:     'hsl(198, 61%, 51%)',

  /** hsl(353, 94%, 51%)  #f70d28  error / destructive */
  error:           'hsl(353, 94%, 51%)',
  /** hsl(130, 48%, 34%)  #2d7f3a  success / completion (derived — harmonized accessible green) */
  success:         'hsl(130, 48%, 34%)',
  /** hsl(35, 79%, 54%)   #E6982E  warning / in-progress */
  warning:         'hsl(35, 79%, 54%)',
  /** hsl(198, 61%, 51%)  #37a0ce  info / tip (shares jnews alt color) */
  info:            'hsl(198, 61%, 51%)',
} as const;

// Alias: hyphenated keys re-exported as the canonical `color` object so
// docs/design/components.md references (`color.primary`, `color['text-muted']`,
// `color['surface-raised']`, etc.) resolve correctly.
export const color = {
  primary:          colors.primary,
  'primary-hover':  colors.primaryHover,
  secondary:        colors.secondary,
  accent:           colors.accent,
  background:       colors.background,
  surface:          colors.surface,
  'surface-raised':  colors.surfaceRaised,
  'surface-overlay': colors.surfaceOverlay,
  text:             colors.text,
  'text-muted':     colors.textMuted,
  'text-inverse':   colors.textInverse,
  border:           colors.border,
  'border-focus':   colors.borderFocus,
  error:            colors.error,
  success:          colors.success,
  warning:          colors.warning,
  info:             colors.info,
} as const;

export type ColorToken = keyof typeof color;

// ---------------------------------------------------------------------------
// Fonts
// ---------------------------------------------------------------------------

export const fonts = {
  /**
   * Heading font family.
   * source: jnews_h1_font + jnews_block_heading_font (live DB theme_mods_jnews)
   */
  heading: "'Montserrat', sans-serif",
  /**
   * Body font family.
   * source: jnews_body_font (live DB) — Lato with regular/italic/700/700italic/900.
   */
  body: "'Lato', sans-serif",
  /**
   * Monospace font.
   * source: style-editor.css code/pre/.wp-block code blocks
   */
  mono: "'Lucida Console', Monaco, monospace",
} as const;

// Alias for components.md `font.heading`, `font.body`, `font.mono` references.
export const font = {
  heading: fonts.heading,
  body:    fonts.body,
  mono:    fonts.mono,

  size: {
    /** 0.75rem / 12px */
    xs:    '0.75rem',
    /** 0.875rem / 14px — source: jnews_topbar font-size (education scheme.css) */
    sm:    '0.875rem',
    /** 1rem / 16px — source: jnews_body_font size (education style.json) */
    base:  '1rem',
    /** 1.125rem / 18px */
    lg:    '1.125rem',
    /** 1.25rem / 20px — source: jnews_footer p font-size (education scheme.css) */
    xl:    '1.25rem',
    /** 1.5rem / 24px */
    '2xl': '1.5rem',
    /** 1.875rem / 30px */
    '3xl': '1.875rem',
    /** 2.25rem / 36px — maps to style-editor.css h1 (2.25em) */
    '4xl': '2.25rem',
  },

  weight: {
    /** 400 */
    normal:   '400',
    /** 500 */
    medium:   '500',
    /** 600 */
    semibold: '600',
    /** 700 — source: jnews_body_font variant 700 (live DB) */
    bold:     '700',
  },

  leading: {
    /** 1.25 — source: style-editor.css h1 line-height */
    tight:   '1.25',
    /** 1.6 — source: jnews_body_font line-height (education style.json) */
    normal:  '1.6',
    /** 1.75 */
    relaxed: '1.75',
  },
} as const;

// ---------------------------------------------------------------------------
// Typography Scale (MIH-pattern: named steps from display-lg → label-sm)
// ---------------------------------------------------------------------------

export const typography = {
  'display-lg': {
    family:     fonts.heading,
    size:       '3rem',      // 48px — source: jnews_h1_font (education style.json)
    weight:     700,
    lineHeight: '1.2',
    use:        'Hero headline, page H1',
  },
  'headline-lg': {
    family:     fonts.heading,
    size:       '1.875rem',  // 30px
    weight:     700,
    lineHeight: '1.35',
    use:        'Section titles, H2',
  },
  'headline-md': {
    family:     fonts.heading,
    size:       '1.5rem',    // 24px
    weight:     700,
    lineHeight: '1.4',
    use:        'Card titles, H3',
  },
  'headline-sm': {
    family:     fonts.heading,
    size:       '1.25rem',   // 20px
    weight:     600,
    lineHeight: '1.5',
    use:        'Sub-section headings, H4',
  },
  'title-lg': {
    family:     fonts.body,
    size:       '1.125rem',  // 18px
    weight:     700,
    lineHeight: '1.5',
    use:        'Course names, nav items',
  },
  'body-lg': {
    family:     fonts.body,
    size:       '1rem',      // 16px
    weight:     400,
    lineHeight: '1.6',
    use:        'Primary body copy',
  },
  'body-md': {
    family:     fonts.body,
    size:       '0.875rem',  // 14px
    weight:     400,
    lineHeight: '1.6',
    use:        'Descriptions, captions',
  },
  'label-md': {
    family:     fonts.body,
    size:       '0.75rem',   // 12px
    weight:     600,
    lineHeight: '1.4',
    use:        'Chips, badges, meta',
  },
  'label-sm': {
    family:     fonts.body,
    size:       '0.625rem',  // 10px
    weight:     600,
    lineHeight: '1.4',
    use:        'Micro text, status labels',
  },
} as const;

// ---------------------------------------------------------------------------
// Spacing — 4px base grid
// space.N = N × 4px
// ---------------------------------------------------------------------------

export const spacing = {
  1:  '0.25rem',  //  4px
  2:  '0.5rem',   //  8px
  3:  '0.75rem',  // 12px
  4:  '1rem',     // 16px
  5:  '1.25rem',  // 20px
  6:  '1.5rem',   // 24px
  8:  '2rem',     // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
} as const;

// Alias: components.md uses `space.4`, `space.6`, etc.
export const space = spacing;

// ---------------------------------------------------------------------------
// Breakpoints
// ---------------------------------------------------------------------------

export const breakpoints = {
  /** 640px — small mobile→tablet threshold */
  sm:  '640px',
  /** 768px — tablet portrait */
  md:  '768px',
  /** 1024px — desktop */
  lg:  '1024px',
  /** 1280px — wide desktop */
  xl:  '1280px',
} as const;

// Alias: components.md uses `bp.sm`, `bp.md`, etc.
export const bp = breakpoints;

// ---------------------------------------------------------------------------
// Elevation / Depth
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
  },
  elevated: {
    bg:     colors.surfaceRaised,
    shadow: '0 8px 24px hsl(0 0% 0% / 0.16)',
  },
} as const;

// ---------------------------------------------------------------------------
// Border Radii
// ---------------------------------------------------------------------------

export const radii = {
  /** 0.125rem / 2px — near-flush (education scheme loadmore) */
  sm:   '0.125rem',
  /** 0.25rem / 4px — inputs, buttons, pagination */
  md:   '0.25rem',
  /** 0.5rem / 8px — cards, modals, dropdowns */
  lg:   '0.5rem',
  /** 0.75rem / 12px — larger surfaces */
  xl:   '0.75rem',
  /** 9999px — pills, avatars, tags */
  full: '9999px',
} as const;

// Alias: components.md uses `radius.sm`, `radius.md`, etc.
export const radius = radii;

// ---------------------------------------------------------------------------
// Motion
// ---------------------------------------------------------------------------

export const motion = {
  /** 150ms — button hover, icon spin */
  fastDuration:  '150ms',
  fastEasing:    'ease-in-out',
  /** 250ms — card hover, drawer open */
  baseDuration:  '250ms',
  baseEasing:    'ease-in-out',
  /** 400ms — page transitions, hero animations */
  slowDuration:  '400ms',
  slowEasing:    'ease-in-out',
  /** Card hover lift */
  cardHoverTransform: 'translateY(-2px)',
} as const;

// Alias: components.md uses `transition.fast`, `transition.base`, `transition.slow`.
export const transition = {
  fast: `all ${motion.fastDuration} ${motion.fastEasing}`,
  base: `all ${motion.baseDuration} ${motion.baseEasing}`,
  slow: `all ${motion.slowDuration} ${motion.slowEasing}`,
} as const;

// ---------------------------------------------------------------------------
// Shadow Tokens
// ---------------------------------------------------------------------------

export const shadow = {
  /** Subtle card border-shadow */
  sm:    '0 1px 3px hsl(0 0% 0% / 0.08)',
  /** Standard card elevation */
  md:    '0 4px 12px hsl(0 0% 0% / 0.12)',
  /** Featured / hero elevation */
  lg:    '0 8px 24px hsl(0 0% 0% / 0.16)',
  /** Focus ring — uses color.border-focus (hsl 198 61% 51%) */
  focus: '0 0 0 3px hsl(198 61% 51% / 0.35)',
} as const;

// ---------------------------------------------------------------------------
// Status Colors (MIH-pattern category)
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
  // Colors
  'color-primary':         '--color-primary',
  'color-primary-hover':   '--color-primary-hover',
  'color-secondary':       '--color-secondary',
  'color-accent':          '--color-accent',
  'color-background':      '--color-background',
  'color-surface':         '--color-surface',
  'color-surface-raised':  '--color-surface-raised',
  'color-surface-overlay': '--color-surface-overlay',
  'color-text':            '--color-text',
  'color-text-muted':      '--color-text-muted',
  'color-text-inverse':    '--color-text-inverse',
  'color-border':          '--color-border',
  'color-border-focus':    '--color-border-focus',
  'color-error':           '--color-error',
  'color-success':         '--color-success',
  'color-warning':         '--color-warning',
  'color-info':            '--color-info',
} as const;

// ---------------------------------------------------------------------------
// CSS custom property declaration block
// Kept for compatibility; the canonical wiring is now the @theme block in
// globals.css.  Components should use Tailwind utility classes that resolve
// to the @theme vars rather than inline-style cssCustomProperties where
// possible.
// ---------------------------------------------------------------------------

export const cssCustomProperties = `
  /* Luthas Center Design Tokens — generated from jnews WordPress theme */

  /* Colors */
  --color-primary:         ${color.primary};
  --color-primary-hover:   ${color['primary-hover']};
  --color-secondary:       ${color.secondary};
  --color-accent:          ${color.accent};
  --color-background:      ${color.background};
  --color-surface:         ${color.surface};
  --color-surface-raised:  ${color['surface-raised']};
  --color-surface-overlay: ${color['surface-overlay']};
  --color-text:            ${color.text};
  --color-text-muted:      ${color['text-muted']};
  --color-text-inverse:    ${color['text-inverse']};
  --color-border:          ${color.border};
  --color-border-focus:    ${color['border-focus']};
  --color-error:           ${color.error};
  --color-success:         ${color.success};
  --color-warning:         ${color.warning};
  --color-info:            ${color.info};

  /* Typography */
  --font-heading: ${font.heading};
  --font-body:    ${font.body};
  --font-mono:    ${font.mono};

  /* Radius */
  --radius-sm:   ${radius.sm};
  --radius-md:   ${radius.md};
  --radius-lg:   ${radius.lg};
  --radius-xl:   ${radius.xl};
  --radius-full: ${radius.full};

  /* Shadows */
  --shadow-sm:    ${shadow.sm};
  --shadow-md:    ${shadow.md};
  --shadow-lg:    ${shadow.lg};
  --shadow-focus: ${shadow.focus};
` as const;

// ---------------------------------------------------------------------------
// Flat tokens — convenience export for tests and Stitch utilities
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
  elevation,
  radii,
  radius,
  motion,
  transition,
  shadow,
  statusColors,
} as const;

export type Tokens = typeof tokens;
