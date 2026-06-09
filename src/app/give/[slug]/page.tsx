/**
 * /give/[slug] — Donation form page (async Server Component)
 *
 * Data: listDonationForms + getDonationFormWithStats via JSON-fallback adapter.
 * Rendering: GoalMeter + DonationWidget (client island) + FAQ Accordion + Sibling forms.
 * Spec: docs/design/templates/donate.md
 */

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { listDonationForms } from '@/shared/lib/data-source'
import { Prose } from '@/shared/ui/Prose'
import { Accordion } from '@/shared/ui'
import { Badge } from '@/shared/ui'
import { Card } from '@/shared/ui'
import type { AccordionItem } from '@/shared/ui'
import { DonationWidget } from '@/widgets/donate-form/DonationWidget'
import { GoalMeter } from '@/widgets/donate-form/GoalMeter'
import type { DonationLevel } from '@/widgets/donate-form/DonationWidget'
import type { Metadata } from 'next'
import { SITE_URL } from '@/shared/config/site'

// ---------------------------------------------------------------------------
// Types & helpers
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RawLevel = Record<string, any>

function parseDonationLevels(raw: unknown): DonationLevel[] {
  if (!Array.isArray(raw)) return []
  return (raw as RawLevel[]).flatMap((item) => {
    if (typeof item !== 'object' || item === null) return []
    const amount = typeof item['amount'] === 'number' ? item['amount'] : null
    if (amount === null) return []
    return [
      {
        level_id: String(item['level_id'] ?? amount),
        amount,
        text: typeof item['text'] === 'string' ? item['text'] : null,
        recurring: Boolean(item['recurring']),
        period: typeof item['period'] === 'string' ? item['period'] : 'month',
      },
    ]
  })
}

// ---------------------------------------------------------------------------
// Static params
// ---------------------------------------------------------------------------

export async function generateStaticParams() {
  const forms = await listDonationForms()
  return forms.map((f) => ({ slug: f.slug ?? String(f.wp_id) }))
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const forms = await listDonationForms()
  const form = forms.find((f) => f.slug === slug)
  if (!form) return { title: 'Donate' }

  const description =
    'Support The Luthas Center — an education and mental health nonprofit. Your gift makes the impossible, inevitable.'
  const canonical = `${SITE_URL}/give/${slug}`

  return {
    title: `${form.title ?? 'Donate'} | The Luthas Center`,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${form.title ?? 'Donate'} | The Luthas Center for Excellence`,
      description,
      url: canonical,
      images: [
        {
          url: '/placeholder-cover.svg',
          width: 1200,
          height: 630,
          alt: form.title ?? 'Donate to Luthas Center',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${form.title ?? 'Donate'} | The Luthas Center for Excellence`,
      description,
      images: ['/placeholder-cover.svg'],
    },
  }
}

// ---------------------------------------------------------------------------
// FAQ items (static copy)
// ---------------------------------------------------------------------------

const FAQ_ITEMS: AccordionItem[] = [
  {
    id: 'tax-deductible',
    trigger: 'Is my donation tax-deductible?',
    content: (
      <p className="text-base text-color-text leading-relaxed">
        Yes. The Luthas Center is a registered 501(c)(3) nonprofit organization.
        Contributions are tax-deductible to the extent permitted by law. You will
        receive a receipt via email after your gift is confirmed.
      </p>
    ),
    defaultOpen: true,
  },
  {
    id: 'cancel-monthly',
    trigger: 'Can I cancel my monthly donation?',
    content: (
      <p className="text-base text-color-text leading-relaxed">
        Yes — email us at{' '}
        <a
          href="mailto:donate@luthascenter.org"
          className="text-color-accent underline underline-offset-2"
        >
          donate@luthascenter.org
        </a>{' '}
        at any time and we will cancel your recurring gift within one business day,
        no questions asked.
      </p>
    ),
  },
  {
    id: 'funds-used',
    trigger: 'How are funds used?',
    content: (
      <p className="text-base text-color-text leading-relaxed">
        Every dollar goes directly toward our programs: mental health counseling
        sessions, wellness workshops, educational materials, and telehealth
        services for individuals who cannot attend in person. We publish an annual
        impact report on our website.
      </p>
    ),
  },
  {
    id: 'secure',
    trigger: 'Is my gift secure?',
    content: (
      <p className="text-base text-color-text leading-relaxed">
        All manual payments are sent through trusted peer-to-peer networks (Cash
        App and Zelle). We never store your payment credentials. For questions
        about security, contact us at{' '}
        <a
          href="mailto:donate@luthascenter.org"
          className="text-color-accent underline underline-offset-2"
        >
          donate@luthascenter.org
        </a>
        .
      </p>
    ),
  },
]

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function DonateSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // Fetch all published forms — used for current form + siblings
  const allForms = await listDonationForms()
  const form = allForms.find((f) => f.slug === slug)
  if (!form) notFound()

  const siblings = allForms.filter((f) => f.slug !== slug)

  // Derive earnings/sales from the JSON record (data-source maps these)
  // The JSON has `earnings` and `sales` at the top level; the adapter maps
  // them to the DonationFormRow shape without a stats join. We access them
  // via the raw record cast here.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawForm = form as Record<string, any>
  const earned: number = rawForm['earnings'] ?? rawForm['total_earnings'] ?? 0
  const sales: number = rawForm['sales'] ?? rawForm['total_sales'] ?? 0
  const goalAmount: number = form.goal_amount ?? 50000

  // Parse levels — data-source puts price_levels (null for JSON fallback)
  // so we also look at donation_levels on the raw record
  const levels = parseDonationLevels(
    form.price_levels ?? rawForm['donation_levels'] ?? [],
  )

  const hasContent = Boolean(form.content && form.content.trim().length > 0)

  // Default impact copy when content is empty
  const fallbackContent = `
    <p>Your gift to The Luthas Center directly funds counseling sessions,
    wellness workshops, and telehealth services for individuals and families
    who could not otherwise afford care.</p>
    <p>Together we turn impossible situations into inevitable triumphs — one
    person, one session, one community at a time. Thank you for believing in
    that mission.</p>
  `

  return (
    <main>
      {/* ------------------------------------------------------------------ */}
      {/* Hero banner                                                         */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="donate-hero-heading"
        className="bg-color-primary text-color-text-inverse"
      >
        <div className="max-w-5xl mx-auto px-spacing-6 py-spacing-16 lg:py-spacing-20">
          <div className="flex flex-col gap-spacing-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-spacing-3 max-w-xl">
              <h1
                id="donate-hero-heading"
                className="font-[var(--font-heading)] font-bold text-3xl lg:text-4xl leading-tight"
              >
                {form.title ?? 'Donate to The Luthas Center'}
              </h1>
              <p className="text-lg opacity-90 leading-relaxed">
                Your gift makes the impossible, inevitable.
              </p>
            </div>
            <a
              href="#give-form"
              className="self-start inline-flex items-center justify-center rounded-radius-md px-spacing-6 py-spacing-4 bg-color-accent text-color-text-inverse font-semibold text-lg hover:opacity-90 transition-opacity duration-[var(--duration-fast)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-color-border-focus lg:shrink-0"
            >
              Donate Now
            </a>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Two-column content area                                             */}
      {/* ------------------------------------------------------------------ */}
      <div className="max-w-5xl mx-auto px-spacing-6 py-spacing-12">
        <div className="grid grid-cols-1 gap-spacing-10 lg:grid-cols-[55fr_45fr] lg:items-start">

          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-spacing-8">

            {/* Goal progress */}
            <section aria-labelledby="goal-heading">
              <h2 id="goal-heading" className="sr-only">Fundraising goal</h2>
              <div className="bg-color-surface rounded-radius-lg p-spacing-6 shadow-[var(--shadow-sm)]">
                <GoalMeter
                  raised={earned}
                  goal={goalAmount}
                  donorCount={sales > 0 ? sales : null}
                />
              </div>
            </section>

            {/* Impact statement */}
            <section aria-labelledby="impact-heading">
              <h2
                id="impact-heading"
                className="font-[var(--font-heading)] font-semibold text-2xl text-color-text mb-spacing-4"
              >
                Your Impact
              </h2>
              {hasContent ? (
                <Prose html={form.content!} />
              ) : (
                <Prose html={fallbackContent} />
              )}
            </section>

            {/* Trust signals */}
            <div
              role="list"
              aria-label="Trust signals"
              className="flex flex-wrap items-center gap-spacing-4 text-sm text-color-text-muted"
            >
              <span role="listitem" className="flex items-center gap-spacing-2">
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
                <span>SSL Secured</span>
              </span>
              <span role="listitem" className="flex items-center gap-spacing-2">
                <Badge variant="accent">501(c)(3)</Badge>
                <span>Tax-deductible nonprofit</span>
              </span>
              <span role="listitem" className="flex items-center gap-spacing-2">
                <svg
                  aria-label="Powered by GiveWP"
                  className="h-5"
                  viewBox="0 0 80 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <text
                    x="0"
                    y="15"
                    fontFamily="sans-serif"
                    fontSize="13"
                    fill="currentColor"
                    opacity="0.7"
                  >
                    GiveWP
                  </text>
                </svg>
              </span>
            </div>

            {/* FAQ Accordion */}
            <section aria-labelledby="faq-heading">
              <h2
                id="faq-heading"
                className="font-[var(--font-heading)] font-semibold text-2xl text-color-text mb-spacing-4"
              >
                Frequently Asked
              </h2>
              <Accordion items={FAQ_ITEMS} type="single" style="contained" />
            </section>
          </div>

          {/* RIGHT COLUMN — sticky on desktop */}
          <div className="flex flex-col gap-spacing-6 lg:sticky lg:top-spacing-8">

            {/* Giving widget */}
            <section aria-labelledby="give-heading">
              <DonationWidget
                formSlug={slug}
                formTitle={form.title ?? 'Donate'}
                setPrice={form.set_price ?? 25}
                customAmountEnabled={Boolean(form.custom_amount)}
                levels={levels}
              />
            </section>

            {/* Sibling forms */}
            {siblings.length > 0 && (
              <section aria-labelledby="other-forms-heading">
                <h2
                  id="other-forms-heading"
                  className="font-[var(--font-heading)] font-semibold text-lg text-color-text mb-spacing-3"
                >
                  Other Ways to Give
                </h2>
                <div className="grid grid-cols-1 gap-spacing-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {siblings.map((s) => (
                    <Card key={s.id} variant="flat" as="div">
                      <Card.Body className="gap-spacing-3">
                        <Card.Title className="text-base">{s.title}</Card.Title>
                        <Link
                          href={`/give/${s.slug}`}
                          className="self-start inline-flex items-center justify-center rounded-radius-md px-spacing-3 py-spacing-2 text-sm font-semibold bg-transparent text-color-primary border border-color-primary hover:bg-color-surface-overlay hover:text-color-text-inverse transition-all duration-[var(--duration-fast)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-color-border-focus"
                        >
                          Give to this fund
                        </Link>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
