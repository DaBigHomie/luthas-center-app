/**
 * Design Tokens — Luthas Center for Excellence
 * 
 * SSOT for all colors, spacing, typography.
 * No raw hex values anywhere else in the codebase.
 */

export const tokens = {
  colors: {
    primary: {
      DEFAULT: 'hsl(220, 90%, 56%)',     // Blue
      foreground: 'hsl(0, 0%, 100%)',
      50: 'hsl(220, 90%, 96%)',
      100: 'hsl(220, 90%, 90%)',
      500: 'hsl(220, 90%, 56%)',
      600: 'hsl(220, 90%, 48%)',
      700: 'hsl(220, 90%, 40%)',
      900: 'hsl(220, 90%, 20%)',
    },
    background: {
      DEFAULT: 'hsl(0, 0%, 100%)',
      dark: 'hsl(220, 20%, 10%)',
      muted: 'hsl(220, 10%, 96%)',
    },
    text: {
      DEFAULT: 'hsl(220, 20%, 15%)',
      muted: 'hsl(220, 10%, 45%)',
      inverse: 'hsl(0, 0%, 100%)',
    },
    border: {
      DEFAULT: 'hsl(220, 10%, 90%)',
      dark: 'hsl(220, 10%, 30%)',
    },
    accent: {
      success: 'hsl(145, 70%, 45%)',
      warning: 'hsl(40, 95%, 55%)',
      error: 'hsl(0, 80%, 55%)',
      info: 'hsl(200, 85%, 55%)',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  typography: {
    fontFamily: {
      sans: "'Inter', system-ui, -apple-system, sans-serif",
      mono: "'JetBrains Mono', 'Fira Code', monospace",
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
} as const;
