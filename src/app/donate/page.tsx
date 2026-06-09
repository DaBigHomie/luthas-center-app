/**
 * /donate — Donation landing page (async Server Component)
 *
 * Lists all published donation forms with goal progress and a CTA
 * to each /give/[slug] route.
 *
 * Spec: docs/design/templates/donate.md
 * Data: listDonationForms via JSON-fallback adapter
 */

import Link from 'next/link'
import { listDonationForms } from '@/shared/lib/data-source'
import { Card } from '@/shared/ui'
import { Badge } from '@/shared/ui'
import { GoalMeter } from '@/widgets/donate-form/GoalMeter'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Donate | The Luthas Center',
  description:
    'Support The Luthas Center education and mental health programs. Choose a fund and make a gift today.',
  alternates: {
    canonical: 'https://luthascenter.damieus.app/donate',
  },
  openGraph: {
    title: 'Donate | The Luthas Center for Excellence',
    description:
      'Support The Luthas Center education and mental health programs. Choose a fund and make a gift today.',
    url: 'https://luthascenter.damieus.app/donate',
    images: [
      {
        url: '/placeholder-cover.svg',
        width: 1200,
        height: 630,
        alt: 'Donate to Luthas Center for Excellence',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Donate | The Luthas Center for Excellence',
    description:
      'Support The Luthas Center education and mental health programs. Choose a fund and make a gift today.',
    images: ['/placeholder-cover.svg'],
  },
}

export default async function DonatePage() {
  const forms = await listDonationForms()

  return (
    <main>
      {/* ------------------------------------------------------------------ */}
      {/* Hero                                                                */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="donate-page-heading"
        className="bg-color-primary text-color-text-inverse"
      >
        <div className="max-w-4xl mx-auto px-spacing-6 py-spacing-16 text-center flex flex-col gap-spacing-4">
          <h1
            id="donate-page-heading"
            className="font-[var(--font-heading)] font-bold text-3xl lg:text-4xl leading-tight"
          >
            Support The Luthas Center
          </h1>
          <p className="text-lg opacity-90 leading-relaxed max-w-xl mx-auto">
            Your gift makes the impossible, inevitable. Choose a fund below and
            give today.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Form cards grid                                                     */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="funds-heading"
        className="max-w-4xl mx-auto px-spacing-6 py-spacing-12"
      >
        <h2
          id="funds-heading"
          className="font-[var(--font-heading)] font-semibold text-2xl text-color-text mb-spacing-8"
        >
          Choose a Fund
        </h2>

        {forms.length === 0 ? (
          <p className="text-color-text-muted">No donation forms available right now.</p>
        ) : (
          <div className="grid grid-cols-1 gap-spacing-6 md:grid-cols-2 lg:grid-cols-3">
            {forms.map((form) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const raw = form as Record<string, any>
              const earned: number = raw['earnings'] ?? raw['total_earnings'] ?? 0
              const sales: number = raw['sales'] ?? raw['total_sales'] ?? 0
              const goal: number = form.goal_amount ?? 50000
              const formSlug = form.slug ?? String(form.wp_id)

              return (
                <Card key={form.id} variant="default" as="article">
                  <Card.Body className="gap-spacing-4">
                    <div className="flex items-start justify-between gap-spacing-2">
                      <Card.Title>{form.title}</Card.Title>
                      {form.goal_enabled && (
                        <Badge variant="accent" className="shrink-0">
                          Active
                        </Badge>
                      )}
                    </div>

                    <GoalMeter
                      raised={earned}
                      goal={goal}
                      donorCount={sales > 0 ? sales : null}
                    />

                    <Link
                      href={`/give/${formSlug}`}
                      className="mt-auto self-start inline-flex items-center justify-center rounded-radius-md px-spacing-5 py-spacing-3 bg-color-primary text-color-text-inverse font-semibold text-base hover:bg-color-primary-hover transition-colors duration-[var(--duration-fast)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-color-border-focus"
                    >
                      Give to this fund
                    </Link>
                  </Card.Body>
                </Card>
              )
            })}
          </div>
        )}
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Trust bar                                                           */}
      {/* ------------------------------------------------------------------ */}
      <div className="border-t border-color-border">
        <div className="max-w-4xl mx-auto px-spacing-6 py-spacing-6 flex flex-wrap items-center justify-center gap-spacing-6 text-sm text-color-text-muted">
          <span className="flex items-center gap-spacing-2">
            <svg
              aria-hidden="true"
              className="size-5 text-color-success shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                clipRule="evenodd"
              />
            </svg>
            SSL Secured
          </span>
          <span className="flex items-center gap-spacing-2">
            <Badge variant="accent">501(c)(3)</Badge>
            IRS-recognised nonprofit
          </span>
          <span>Powered by GiveWP</span>
        </div>
      </div>
    </main>
  )
}
