/**
 * Content page — /[pageSlug]
 *
 * Renders any published WordPress page that doesn't have a bespoke route.
 * Examples: /privacy-policy, /terms-and-conditions, /empowering-diverse-communities-dei-initiatives
 *
 * Static params: emitted for all published content pages (bespoke routes
 * excluded). dynamicParams = true so any other published slug resolves on demand.
 */

import 'server-only'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPageBySlug, listPublishedPages } from '@/shared/lib/data-source'
import { Prose } from '@/shared/ui/Prose'
import { SITE_URL } from '@/shared/config/site'

// ---------------------------------------------------------------------------
// Slugs that have bespoke app routes — never emit static params for these
// ---------------------------------------------------------------------------

const BESPOKE_SLUGS = new Set([
  'home',
  'about',
  'contact',
  'cart',
  'checkout',
  'my-account',
  'donor-dashboard',
  'give-receipt',
  'donation-failed',
  'blog',
  // Static routes that take precedence over this dynamic segment
  'courses',
  'donate',
])

// ---------------------------------------------------------------------------
// Static params — pre-render content pages at build time
// ---------------------------------------------------------------------------

export const dynamicParams = true

export async function generateStaticParams() {
  const pages = await listPublishedPages()
  return pages
    .filter((p) => !BESPOKE_SLUGS.has(p.slug))
    .map((p) => ({ pageSlug: p.slug }))
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

const BASE_URL = SITE_URL

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pageSlug: string }>
}): Promise<Metadata> {
  const { pageSlug } = await params
  const page = await getPageBySlug(pageSlug)
  if (!page) return {}

  const title = page.title ?? undefined
  const description = page.excerpt ?? undefined
  const canonical = `${BASE_URL}/${pageSlug}`

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: title ? `${title} | Luthas Center for Excellence` : 'Luthas Center for Excellence',
      description,
      url: canonical,
    },
    twitter: {
      card: 'summary',
      title: title ? `${title} | Luthas Center for Excellence` : 'Luthas Center for Excellence',
      description,
    },
  }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function ContentPage({
  params,
}: {
  params: Promise<{ pageSlug: string }>
}) {
  const { pageSlug } = await params
  const page = await getPageBySlug(pageSlug)
  if (!page) notFound()

  return (
    <div className="bg-color-background min-h-screen">
      <div className="max-w-[900px] mx-auto px-spacing-4 sm:px-spacing-6 lg:px-spacing-8 py-spacing-12">
        {page.title && (
          <h1 className="font-[var(--font-heading)] font-bold text-3xl lg:text-4xl text-color-text leading-[var(--leading-tight)] mb-spacing-8">
            {page.title}
          </h1>
        )}
        {page.content ? (
          <Prose html={page.content} />
        ) : (
          <p className="text-color-text-muted italic">Content not available.</p>
        )}
      </div>
    </div>
  )
}
