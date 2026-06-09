/**
 * Site-wide configuration constants.
 *
 * Override at build/runtime by setting environment variables:
 *   NEXT_PUBLIC_SITE_URL   — e.g. https://luthascenter.damieus.app
 *   NEXT_PUBLIC_SITE_NAME  — e.g. Luthas Center for Excellence
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://luthascenter.damieus.app'

export const SITE_NAME =
  process.env.NEXT_PUBLIC_SITE_NAME ?? 'Luthas Center for Excellence'
