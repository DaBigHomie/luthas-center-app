/**
 * Root layout — Luthas Center
 *
 * - Loads Montserrat (heading) and Lato (body) via next/font
 * - Sets html lang="en", skip-link, accessible landmarks
 * - SiteHeader + SiteFooter wrap all page content
 */

import type { Metadata } from 'next'
import { Montserrat, Lato } from 'next/font/google'
import './globals.css'
import { SiteHeader } from '@/widgets/site-header'
import { SiteFooter } from '@/widgets/site-footer'

// ---------------------------------------------------------------------------
// Fonts
// ---------------------------------------------------------------------------

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
  weight: ['400', '500', '600', '700'],
})

const lato = Lato({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
  weight: ['400', '700'],
  style: ['normal', 'italic'],
})

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: {
    default: 'Luthas Center for Excellence',
    template: '%s | Luthas Center for Excellence',
  },
  description:
    'Impossible to Inevitable — education, mental health support, and community empowerment through the Luthas Center for Excellence.',
  metadataBase: new URL('https://luthas-center.damieus.app'),
  openGraph: {
    type: 'website',
    siteName: 'Luthas Center for Excellence',
  },
}

// ---------------------------------------------------------------------------
// Root Layout
// ---------------------------------------------------------------------------

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${lato.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-color-background text-color-text font-[var(--font-body)] antialiased">
        {/* Skip navigation link — first focusable element on the page */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-spacing-4 focus:py-spacing-2 focus:bg-color-primary focus:text-color-text-inverse focus:rounded-radius-md focus:font-semibold"
        >
          Skip to main content
        </a>

        <SiteHeader />

        <main id="main-content" className="flex-1 w-full" tabIndex={-1}>
          {children}
        </main>

        <SiteFooter />
      </body>
    </html>
  )
}
