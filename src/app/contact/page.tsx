/**
 * /contact — Async Server Component
 *
 * Sections: Hero · 2-col (Form + OrgInfo/Map) · Soft CTA Strip
 * Spec: docs/design/templates/contact.md
 *
 * The contact form posts to a stub Server Action in src/widgets/contact-form/actions.ts
 * (Resend TODO inline).
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import { getPageBySlug } from '@/shared/lib/data-source'
import { Separator, Button } from '@/shared/ui'
import { ContactFormWidget } from '@/widgets/contact-form'
import { SITE_URL } from '@/shared/config/site'

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Contact',
  description:
    "Get in touch with the Luthas Center for Excellence. We'd love to hear from you.",
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
  openGraph: {
    title: 'Contact | Luthas Center for Excellence',
    description:
      "Get in touch with the Luthas Center for Excellence. We'd love to hear from you.",
    url: `${SITE_URL}/contact`,
    images: [
      {
        url: '/placeholder-cover.svg',
        width: 1200,
        height: 630,
        alt: 'Contact Luthas Center for Excellence',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact | Luthas Center for Excellence',
    description:
      "Get in touch with the Luthas Center for Excellence. We'd love to hear from you.",
    images: ['/placeholder-cover.svg'],
  },
}

// ---------------------------------------------------------------------------
// Org constants (used until CMS contact info is surfaced via DB)
// ---------------------------------------------------------------------------

const ORG = {
  name: 'Luthas Center for Excellence',
  address: 'San Francisco, CA, USA',
  phone: null as string | null,
  email: 'info@luthascenter.org',
  social: [
    {
      label: 'Facebook',
      href: 'https://www.facebook.com/LuthasCenter',
      icon: (
        <svg
          className="size-5"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
        </svg>
      ),
    },
    {
      label: 'Twitter / X',
      href: 'https://twitter.com/LuthasCenter',
      icon: (
        <svg
          className="size-5"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/LuthasCenter',
      icon: (
        <svg
          className="size-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
    },
  ],
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function ContactPage() {
  const page = await getPageBySlug('contact')

  const heroSubtitle =
    page?.excerpt?.trim() ||
    "We'd love to hear from you — whether you're a prospective student, donor, or community partner."

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* HERO BAND                                                           */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-label="Contact hero"
        className="bg-color-surface-raised py-spacing-16 text-center"
      >
        <div className="max-w-screen-xl mx-auto px-spacing-4">
          <h1 className="font-[var(--font-heading)] font-bold text-4xl lg:text-5xl text-color-text mb-spacing-4">
            Get In Touch
          </h1>
          {heroSubtitle && (
            <p className="text-lg text-color-text-muted max-w-2xl mx-auto leading-relaxed">
              {heroSubtitle}
            </p>
          )}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* MAIN 2-COL LAYOUT                                                   */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="contact-form-heading"
        className="bg-color-background py-spacing-16"
      >
        <div className="max-w-screen-xl mx-auto px-spacing-4">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-spacing-10 lg:gap-spacing-12 items-start">

            {/* LEFT — Contact Form */}
            <div>
              {/* hidden heading consumed by aria-labelledby on section */}
              <span id="contact-form-heading" className="sr-only">
                Contact form
              </span>
              <ContactFormWidget />
            </div>

            {/* RIGHT — Org Info + Map */}
            <aside
              aria-label="Organisation information"
              className="flex flex-col gap-spacing-6 lg:sticky lg:top-spacing-8"
            >
              {/* Info card */}
              <div className="bg-color-surface border border-color-border rounded-radius-md shadow-[var(--shadow-md)] p-spacing-6 flex flex-col gap-spacing-4">
                <h2 className="font-[var(--font-heading)] font-semibold text-xl text-color-text">
                  Contact Information
                </h2>
                <Separator />

                <address className="not-italic text-sm text-color-text-muted leading-relaxed flex flex-col gap-spacing-2">
                  <strong className="text-color-text font-semibold text-base">
                    {ORG.name}
                  </strong>
                  <span>{ORG.address}</span>

                  {ORG.phone && (
                    <a
                      href={`tel:${ORG.phone.replace(/\D/g, '')}`}
                      className="text-color-accent underline underline-offset-2 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-color-border-focus rounded-sm"
                    >
                      {ORG.phone}
                    </a>
                  )}
                  <a
                    href={`mailto:${ORG.email}`}
                    className="text-color-accent underline underline-offset-2 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-color-border-focus rounded-sm"
                  >
                    {ORG.email}
                  </a>
                </address>

                <Separator />

                {/* Social links */}
                <div className="flex gap-spacing-3">
                  {ORG.social.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="inline-flex items-center justify-center size-10 rounded-radius-md text-color-text-muted hover:text-color-text hover:bg-color-surface-raised transition-colors duration-[var(--duration-fast)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-color-border-focus"
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* Map embed */}
              <figure className="m-0">
                <div className="relative w-full aspect-video rounded-radius-lg overflow-hidden border border-color-border shadow-[var(--shadow-sm)]">
                  <iframe
                    title="Map showing Luthas Center location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6304.829986131271!2d-122.47469680330921!3d37.80374752160443!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808586e6302615a1%3A0x86bd13025175c00!2sStorey+Ave%2C+San+Francisco%2C+CA+94129!5e0!3m2!1sen!2sus!4v1435826432051"
                    className="absolute inset-0 w-full h-full border-0"
                    loading="lazy"
                    allowFullScreen
                    tabIndex={0}
                  />
                </div>
                <figcaption className="mt-spacing-2 text-xs text-color-text-muted text-center">
                  {ORG.address}
                </figcaption>
              </figure>
            </aside>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SOFT CTA STRIP                                                      */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-label="Stay connected"
        className="bg-color-surface-raised py-spacing-12"
      >
        <div className="max-w-screen-xl mx-auto px-spacing-4 flex flex-col sm:flex-row items-center justify-center gap-spacing-4 text-center sm:text-left">
          <p className="text-color-text-muted text-base">
            Stay connected — subscribe to updates &amp; impact stories.
          </p>
          <div className="flex items-center gap-spacing-3 shrink-0">
            <Button variant="ghost" size="md" asChild>
              <Link href="/#newsletter">Subscribe</Link>
            </Button>
            <span aria-hidden="true" className="text-color-border select-none hidden sm:inline">
              |
            </span>
            <Button variant="primary" size="md" asChild>
              <Link href="/donate">Support Our Work</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
