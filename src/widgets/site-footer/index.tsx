/**
 * SiteFooter widget — Luthas Center
 *
 * Desktop: 4-column layout — logo+tagline+mission, 3 nav groups
 * Mobile: stacked, nav columns collapse to accordion
 * Bottom bar: copyright, legal links, back-to-top
 *
 * Column groups:
 *   Learn:       Courses, Programs, Certifications
 *   Support:     Mental Health, Homelessness Resources, Financial Empowerment
 *   Community:   Blog, Events, Donate
 *   Organization:About, Contact, Careers
 *
 * Accessibility:
 * - <footer role="contentinfo"> landmark
 * - Column headings as <h3> inside <nav aria-label="[Column name]">
 * - Social links: aria-label with platform name
 * - Back-to-top: focuses #main-content
 * - Mobile accordion: aria-expanded + aria-controls per APG
 */

'use client'

import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/shared/lib/utils'

// ---------------------------------------------------------------------------
// Footer column data
// ---------------------------------------------------------------------------

const FOOTER_COLUMNS = [
  {
    heading: 'Learn',
    links: [
      { label: 'Courses', href: '/courses' },
      { label: 'Programs', href: '/programs' },
      { label: 'Certifications', href: '/certifications' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { label: 'Mental Health', href: '/mental-health' },
      { label: 'Homelessness Resources', href: '/homelessness-resources' },
      { label: 'Financial Empowerment', href: '/financial-empowerment' },
    ],
  },
  {
    heading: 'Community',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'Events', href: '/events' },
      { label: 'Donate', href: '/donate' },
    ],
  },
  {
    heading: 'Organization',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Careers', href: '/careers' },
    ],
  },
] as const

const SOCIAL_LINKS = [
  { label: 'Facebook', href: '#', icon: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
  { label: 'Twitter / X', href: '#', icon: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' },
  { label: 'Instagram', href: '#', icon: 'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01M7.5 2h9A5.5 5.5 0 0122 7.5v9a5.5 5.5 0 01-5.5 5.5h-9A5.5 5.5 0 012 16.5v-9A5.5 5.5 0 017.5 2z' },
  { label: 'YouTube', href: '#', icon: 'M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.4a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z' },
] as const

// ---------------------------------------------------------------------------
// Mobile accordion for footer columns
// ---------------------------------------------------------------------------

function FooterAccordionColumn({ heading, links }: { heading: string; links: readonly { label: string; href: string }[] }) {
  const [open, setOpen] = React.useState(false)
  const panelId = `footer-col-${heading.toLowerCase().replace(/\s+/g, '-')}`
  const triggerId = `${panelId}-trigger`

  return (
    <div className="border-b border-color-border/30 sm:border-0">
      {/* Trigger (mobile only) */}
      <button
        id={triggerId}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="sm:hidden w-full flex items-center justify-between py-spacing-3 font-semibold text-sm text-color-text-inverse focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-color-border-focus"
      >
        {heading}
        <svg
          aria-hidden="true"
          className={cn('size-4 shrink-0 transition-transform duration-[var(--duration-base)]', open && 'rotate-180')}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd"/>
        </svg>
      </button>

      {/* Heading (desktop only) */}
      <h3 className="hidden sm:block text-sm font-semibold text-color-text-inverse mb-spacing-3">
        {heading}
      </h3>

      {/* Links panel */}
      <div
        id={panelId}
        role={undefined}
        aria-labelledby={triggerId}
        className={cn('sm:block', !open && 'hidden')}
      >
        <ul className="flex flex-col gap-spacing-2 pb-spacing-3 sm:pb-0">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm text-color-text-muted hover:text-color-text-inverse transition-colors duration-[var(--duration-fast)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-color-border-focus rounded-radius-sm"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// SiteFooter
// ---------------------------------------------------------------------------

export function SiteFooter() {
  function handleBackToTop() {
    const main = document.getElementById('main-content')
    main?.focus()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer
      role="contentinfo"
      className="bg-color-surface-raised border-t border-color-border"
    >
      {/* Main footer body */}
      <div className="mx-auto max-w-7xl px-spacing-4 sm:px-spacing-6 lg:px-spacing-8 py-spacing-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-spacing-8 lg:gap-spacing-12">

          {/* Brand column */}
          <div className="lg:col-span-2 sm:col-span-2">
            <Link
              href="/"
              aria-label="Luthas Center for Excellence — Home"
              className="inline-block font-[var(--font-heading)] font-bold text-xl text-color-primary mb-spacing-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-color-border-focus rounded-radius-sm"
            >
              Luthas<span className="text-color-accent">Center</span>
            </Link>
            <p className="text-sm text-color-text-muted italic mb-spacing-2">
              Impossible to Inevitable
            </p>
            <p className="text-sm text-color-text leading-relaxed max-w-xs">
              Luthas Center for Excellence empowers individuals through education, mental
              health support, and community programs that turn aspiration into achievement.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-spacing-2 mt-spacing-4">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className={cn(
                    'flex items-center justify-center size-10 rounded-radius-full',
                    'border border-color-border text-color-text-muted',
                    'hover:bg-color-primary hover:text-color-text-inverse hover:border-color-primary',
                    'transition-colors duration-[var(--duration-fast)]',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-color-border-focus',
                  )}
                >
                  <svg
                    className="size-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {FOOTER_COLUMNS.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <FooterAccordionColumn heading={col.heading} links={col.links} />
            </nav>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-color-border/30">
        <div className="mx-auto max-w-7xl px-spacing-4 sm:px-spacing-6 lg:px-spacing-8 py-spacing-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-spacing-3">

            {/* Copyright */}
            <p className="text-xs text-color-text-muted order-2 sm:order-1">
              &copy; {new Date().getFullYear()} Luthas Center for Excellence. All rights reserved.
            </p>

            {/* Legal links */}
            <div className="flex items-center gap-spacing-4 order-1 sm:order-2">
              {[
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Use', href: '/terms' },
                { label: 'Accessibility', href: '/accessibility' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs text-color-text-muted hover:text-color-text transition-colors duration-[var(--duration-fast)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-color-border-focus rounded-radius-sm"
                >
                  {link.label}
                </Link>
              ))}

              {/* Back to top */}
              <button
                type="button"
                onClick={handleBackToTop}
                className="text-xs text-color-text-muted hover:text-color-text transition-colors duration-[var(--duration-fast)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-color-border-focus rounded-radius-sm"
                aria-label="Back to top of page"
              >
                Back to top ↑
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
