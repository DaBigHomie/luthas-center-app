/**
 * HomeHero — full-bleed hero section for the home page.
 *
 * Server Component: receives all props from the page-level data fetch.
 * No client state required here; animations are CSS-only and respect
 * prefers-reduced-motion.
 */

import Link from 'next/link'

export interface HomeHeroProps {
  /** Optional background image URL (already resolved, or undefined → CSS gradient). */
  bgImageUrl?: string | null
  subheadline?: string | null
}

export function HomeHero({ bgImageUrl, subheadline }: HomeHeroProps) {
  const fallbackGradient =
    'linear-gradient(135deg, hsl(0 0% 7%) 0%, hsl(216 72% 21%) 100%)'

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative w-full overflow-hidden min-h-[480px] md:min-h-[600px] flex items-center"
    >
      {/* Background layer — decorative, hidden from AT */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: bgImageUrl
            ? `url('${bgImageUrl}')`
            : fallbackGradient,
        }}
      />
      {/* Dark overlay for contrast */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-color-surface-overlay/70"
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-spacing-6 md:px-spacing-8 py-spacing-16 motion-safe:animate-[fadeInUp_0.6s_ease_both]">
        <h1
          id="hero-heading"
          className="font-[var(--font-heading)] font-bold text-4xl md:text-5xl lg:text-6xl text-color-text-inverse leading-tight mb-spacing-4 max-w-3xl"
        >
          Impossible to Inevitable
        </h1>

        {subheadline && (
          <p className="text-lg md:text-xl text-color-text-inverse/85 max-w-2xl mb-spacing-8 leading-relaxed font-[var(--font-body)]">
            {subheadline}
          </p>
        )}

        {!subheadline && (
          <p className="text-lg md:text-xl text-color-text-inverse/85 max-w-2xl mb-spacing-8 leading-relaxed font-[var(--font-body)]">
            Empowering individuals through education, mental health support, and
            community programs at the Luthas Center for Excellence.
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-spacing-4">
          <Link
            href="/courses"
            className="inline-flex items-center justify-center rounded-radius-md px-spacing-6 py-spacing-4 text-lg font-semibold bg-color-primary text-color-text-inverse hover:bg-color-primary-hover transition-all duration-[var(--duration-fast)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-color-border-focus"
          >
            Enroll Now
          </Link>
          <Link
            href="/courses"
            className="inline-flex items-center justify-center rounded-radius-md px-spacing-6 py-spacing-4 text-lg font-semibold bg-transparent border border-color-primary text-color-text-inverse hover:bg-color-surface-overlay hover:text-color-text-inverse transition-all duration-[var(--duration-fast)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-color-border-focus"
          >
            Explore Courses
          </Link>
        </div>
      </div>

      {/* keyframe for fade-in (Tailwind v4 arbitrary animation) */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .motion-safe\\:animate-\\[fadeInUp_0\\.6s_ease_both\\] {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  )
}

HomeHero.displayName = 'HomeHero'
