/**
 * /about — Async Server Component
 *
 * Sections: Hero · Mission · Commitments · DEI Callout · Team · Contact CTA
 * Spec: docs/design/templates/about.md
 */

import type { Metadata } from 'next'
import { getPageBySlug, getMediaByWpId, listTeamProfiles } from '@/shared/lib/data-source'
import { resolveMediaUrl } from '@/shared/lib/data-source'
import { Avatar, Button, Separator } from '@/shared/ui'
import { AboutHeroWidget } from '@/widgets/about-hero'

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'About',
  description:
    'At the Luthas Center for Excellence, our exceptional strength lies in our wholehearted dedication to integrating life-transforming programs.',
}

// ---------------------------------------------------------------------------
// Static commitment data (parsed from VC shortcode content)
// ---------------------------------------------------------------------------

const COMMITMENTS = [
  {
    ordinal: '01',
    title: 'Unceasing Growth',
    body: 'We pledge to continuously evolve and improve, embracing growth as an ongoing journey.',
  },
  {
    ordinal: '02',
    title: 'Selflessness',
    body: 'Our actions are guided by selflessness, putting the needs of others at the forefront of our endeavors.',
  },
  {
    ordinal: '03',
    title: 'Pursuit of Excellence',
    body: 'We are dedicated to upholding a standard of excellence in all that we do, driving ourselves to achieve the highest levels of quality.',
  },
  {
    ordinal: '04',
    title: 'Passion Cultivation',
    body: 'We commit to nurturing and fostering passions, empowering individuals to realize their full potential.',
  },
  {
    ordinal: '05',
    title: 'Purpose Discovery',
    body: 'We are resolute in aiding individuals in identifying their purpose, guiding them towards meaningful paths.',
  },
  {
    ordinal: '06',
    title: 'Homelessness Support',
    body: 'We vow to provide essential resources and support to address homelessness and its associated challenges.',
  },
  {
    ordinal: '07',
    title: 'Poverty Alleviation',
    body: 'Our focus includes preventive measures to alleviate poverty, working towards a more equitable society.',
  },
  {
    ordinal: '08',
    title: 'Mental Health Advocacy',
    body: 'We advocate for mental health awareness and support, creating spaces that foster mental well-being.',
  },
  {
    ordinal: '09',
    title: 'Financial Empowerment',
    body: 'We provide comprehensive financial resources and training, empowering individuals with essential financial literacy skills.',
  },
  {
    ordinal: '10',
    title: 'Educational Empowerment',
    body: 'We are dedicated to delivering high-quality educational programs, resources, and tools that ensure equitable access to education and promote lifelong learning.',
  },
  {
    ordinal: '11',
    title: 'Startup Investment',
    body: 'Our commitment to fostering economic growth is reflected in our investments in startups, promoting inclusive and sustainable development.',
  },
  {
    ordinal: '12',
    title: 'Research & Innovation Promotion',
    body: 'We pledge to launch online platforms that champion science, technology, and innovation, paving the way for sustainable development and progress.',
  },
]

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function AboutPage() {
  // Fetch page data + hero media + profiles in parallel
  const [page, profiles] = await Promise.all([
    getPageBySlug('about'),
    listTeamProfiles(),
  ])

  const heroMedia = page?.featured_image_id
    ? await getMediaByWpId(page.featured_image_id)
    : null

  const heroUrl = heroMedia
    ? resolveMediaUrl(heroMedia)
    : '/placeholder-cover.svg'

  const heroAlt = heroMedia?.alt_text ?? 'Luthas Center for Excellence — About'

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* HERO                                                                */}
      {/* ------------------------------------------------------------------ */}
      <AboutHeroWidget
        title={page?.title ?? 'About'}
        excerpt={
          page?.excerpt ??
          'At the Luthas Center for Excellence, our exceptional strength lies in our wholehearted dedication to integrating life-transforming programs.'
        }
        heroImageUrl={heroUrl}
        heroImageAlt={heroAlt}
        heroImageWidth={heroMedia?.width ?? 1200}
        heroImageHeight={heroMedia?.height ?? 900}
      />

      {/* ------------------------------------------------------------------ */}
      {/* MISSION                                                             */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-label="Our mission"
        className="bg-color-surface py-spacing-16"
      >
        <div className="max-w-screen-xl mx-auto px-spacing-4">
          <h2 className="font-[var(--font-heading)] font-semibold text-3xl text-color-text mb-spacing-10 text-center">
            Our Mission
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-spacing-8">
            {/* Pillar 1 */}
            <div className="flex gap-spacing-4 items-start">
              <span
                className="shrink-0 size-12 rounded-radius-lg bg-color-accent/15 flex items-center justify-center"
                aria-hidden="true"
              >
                <svg
                  className="size-6 text-color-accent"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </span>
              <div>
                <h3 className="font-[var(--font-heading)] font-semibold text-xl text-color-text mb-spacing-2">
                  Transforming Lives
                </h3>
                <p className="text-color-text-muted leading-relaxed">
                  Integrating life-transforming programs that equip individuals with the knowledge,
                  skills, and mindset to move from impossible circumstances to inevitable outcomes.
                </p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="flex gap-spacing-4 items-start">
              <span
                className="shrink-0 size-12 rounded-radius-lg bg-color-accent/15 flex items-center justify-center"
                aria-hidden="true"
              >
                <svg
                  className="size-6 text-color-accent"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4l3 3" />
                  <path d="M3.6 9h16.8" />
                  <path d="M3.6 15h16.8" />
                </svg>
              </span>
              <div>
                <h3 className="font-[var(--font-heading)] font-semibold text-xl text-color-text mb-spacing-2">
                  Network Empowerment
                </h3>
                <p className="text-color-text-muted leading-relaxed">
                  Building and strengthening collaborative global mastermind networks that enable
                  multi-lateral empowerment of women, children, and underserved communities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* COMMITMENTS                                                         */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-label="Our commitments"
        className="bg-color-background py-spacing-16"
      >
        <div className="max-w-screen-xl mx-auto px-spacing-4">
          <h2 className="font-[var(--font-heading)] font-semibold text-3xl text-color-text mb-spacing-10 text-center">
            Our Commitments
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-spacing-6">
            {COMMITMENTS.map((c) => (
              <article
                key={c.ordinal}
                className="bg-color-surface border border-color-border rounded-radius-md shadow-[var(--shadow-sm)] p-spacing-5 flex flex-col gap-spacing-3"
              >
                <span
                  className="inline-flex items-center justify-center w-10 h-10 rounded-radius-md bg-color-accent text-color-text-inverse font-[var(--font-mono)] font-bold text-sm shrink-0 self-start"
                  aria-hidden="true"
                >
                  {c.ordinal}
                </span>
                <h3 className="font-[var(--font-heading)] font-semibold text-base text-color-text leading-snug">
                  {c.title}
                </h3>
                <p className="text-sm text-color-text-muted leading-relaxed">{c.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* DEI CALLOUT BAND                                                    */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-label="Diversity equity and inclusion"
        className="bg-color-surface-raised py-spacing-16"
      >
        <div className="max-w-screen-xl mx-auto px-spacing-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-spacing-6 lg:gap-spacing-12">
            <div className="flex-1">
              <h2 className="font-[var(--font-heading)] font-semibold text-3xl text-color-text mb-spacing-4">
                Diversity, Equity &amp; Inclusion
              </h2>
              <p className="text-lg text-color-text-muted leading-relaxed max-w-2xl">
                We embrace diversity as a fundamental pillar of our mission — creating an environment
                where every individual feels valued, respected, and has access to equal opportunities.
              </p>
            </div>
            <div className="shrink-0">
              <Button variant="ghost" size="lg" asChild={false}>
                <a href="/empowering-diverse-communities-dei-initiatives">
                  Learn More
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* TEAM                                                                */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-label="Meet the team"
        className="bg-color-background py-spacing-16"
      >
        <div className="max-w-screen-xl mx-auto px-spacing-4">
          <h2 className="font-[var(--font-heading)] font-semibold text-3xl text-color-text mb-spacing-10 text-center">
            Meet the Team
          </h2>

          {profiles.length === 0 ? (
            <p className="text-center text-color-text-muted">Team information coming soon.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-spacing-6">
              {profiles.map((member) => {
                const displayName = member.display_name ?? 'Team Member'
                const role =
                  member.role === 'admin' || member.role === 'owner'
                    ? 'Founder & Director'
                    : member.role === 'author'
                    ? 'Author'
                    : 'Team Member'
                const bio = member.bio
                  ? member.bio.slice(0, 160) + (member.bio.length > 160 ? '…' : '')
                  : null

                return (
                  <article
                    key={member.id}
                    className="bg-color-surface border border-color-border rounded-radius-lg shadow-[var(--shadow-sm)] p-spacing-6 flex flex-col items-center text-center gap-spacing-3"
                  >
                    <Avatar
                      src={null}
                      name={displayName}
                      size="lg"
                      aria-label={`${displayName}, ${role}`}
                    />
                    <div>
                      <h3 className="font-[var(--font-heading)] font-semibold text-base text-color-text">
                        {displayName}
                      </h3>
                      <p className="text-sm text-color-text-muted mt-0.5">{role}</p>
                    </div>
                    {bio && (
                      <p className="text-sm text-color-text-muted leading-relaxed line-clamp-3">
                        {bio}
                      </p>
                    )}
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* CONTACT CTA                                                         */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-label="Contact us"
        className="bg-color-surface py-spacing-16"
      >
        <div className="max-w-screen-xl mx-auto px-spacing-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-spacing-8 lg:gap-spacing-16">
            <div className="flex-1">
              <h2 className="font-[var(--font-heading)] font-semibold text-3xl text-color-text mb-spacing-3">
                Get in Touch
              </h2>
              <p className="text-lg text-color-text-muted">
                We&apos;d love to hear from you — whether you&apos;re a prospective student, donor,
                or community partner.
              </p>
            </div>

            <div className="flex flex-col gap-spacing-4">
              <address className="not-italic text-color-text-muted text-sm leading-relaxed">
                <strong className="text-color-text font-semibold block mb-spacing-1">
                  Luthas Center for Excellence
                </strong>
                San Francisco, CA, USA
                <br />
                <a
                  href="mailto:info@luthascenter.org"
                  className="text-color-accent underline underline-offset-2 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-color-border-focus rounded-sm"
                >
                  info@luthascenter.org
                </a>
              </address>
              <Separator />
              <Button variant="primary" size="md" asChild={false}>
                <a href="/contact">Contact Us</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
