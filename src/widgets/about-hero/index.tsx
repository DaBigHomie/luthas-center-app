/**
 * AboutHeroWidget — hero split for the /about page.
 *
 * Desktop: image left (55%), text right (45%).
 * Mobile: stacked (image above, text below).
 */

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/shared/ui'

interface AboutHeroWidgetProps {
  title: string
  excerpt: string | null
  heroImageUrl: string
  heroImageAlt: string
  heroImageWidth: number
  heroImageHeight: number
}

export function AboutHeroWidget({
  title,
  excerpt,
  heroImageUrl,
  heroImageAlt,
  heroImageWidth,
  heroImageHeight,
}: AboutHeroWidgetProps) {
  return (
    <section
      aria-label="About hero"
      className="w-full bg-color-background"
    >
      <div className="max-w-screen-xl mx-auto px-spacing-4 py-spacing-12 lg:py-spacing-16">
        <div className="flex flex-col lg:flex-row gap-spacing-8 lg:gap-spacing-12 items-center">
          {/* Image column — left on desktop */}
          <div className="w-full lg:w-[55%] shrink-0">
            <div className="relative w-full aspect-[4/3] lg:aspect-[4/3] rounded-radius-lg overflow-hidden shadow-[var(--shadow-lg)]">
              <Image
                src={heroImageUrl}
                alt={heroImageAlt}
                fill
                className="object-cover"
                loading="eager"
                sizes="(max-width: 1024px) 100vw, 55vw"
                width={heroImageWidth || undefined}
                height={heroImageHeight || undefined}
              />
            </div>
          </div>

          {/* Text column — right on desktop */}
          <div className="w-full lg:w-[45%] flex flex-col gap-spacing-6">
            <h1 className="font-[var(--font-heading)] font-bold text-4xl lg:text-5xl text-color-text leading-tight">
              {title}
            </h1>
            {excerpt && (
              <p className="text-lg text-color-text-muted leading-relaxed">
                {excerpt}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-spacing-3">
              <Button
                variant="primary"
                size="lg"
                asChild={false}
              >
                <a href="/donate">Donate Now</a>
              </Button>
              <Link
                href="/courses"
                className="inline-flex items-center justify-center gap-spacing-2 rounded-radius-md font-semibold px-spacing-6 py-spacing-4 text-lg min-h-[48px] bg-transparent text-color-primary border border-color-primary hover:bg-color-surface-overlay hover:text-color-text-inverse transition-all duration-[var(--duration-fast)] ease-[var(--ease-default)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-color-border-focus focus-visible:shadow-[var(--shadow-focus)] active:translate-y-px"
              >
                Explore Courses
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
