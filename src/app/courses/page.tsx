/**
 * /courses — Course Catalog page
 *
 * Async Server Component. Fetches all published courses + ld_course_category
 * terms, resolves cover images, attaches category metadata, then passes the
 * pre-hydrated data set to CourseCatalogClient for client-side filter/search/sort.
 *
 * URL params (also used for SSR initial state):
 *   ?category=slug1,slug2   — comma-separated category slugs
 *   ?price=free|open        — price_type filter
 *   ?q=<string>             — search query
 *   ?sort=newest|az|lessons — sort order
 */

import type { Metadata } from 'next'
import { Suspense } from 'react'
import {
  listPublishedCourses,
  listTermsByTaxonomy,
  getMediaByWpIds,
  resolveCoverUrl,
} from '@/shared/lib/data-source'
import { CourseCatalogClient } from '@/widgets/course-catalog'
import type { CatalogCourse } from '@/widgets/course-catalog'
import { SITE_URL } from '@/shared/config/site'

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Course Catalog | Luthas Center',
  description:
    'Browse all free and open-access courses at Luthas Center — empowering you from impossible to inevitable.',
  alternates: {
    canonical: `${SITE_URL}/courses`,
  },
  openGraph: {
    title: 'Course Catalog | Luthas Center for Excellence',
    description:
      'Browse all free and open-access courses at Luthas Center — empowering you from impossible to inevitable.',
    url: `${SITE_URL}/courses`,
    images: [
      {
        url: '/placeholder-cover.svg',
        width: 1200,
        height: 630,
        alt: 'Luthas Center Course Catalog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Course Catalog | Luthas Center for Excellence',
    description:
      'Browse all free and open-access courses at Luthas Center — empowering you from impossible to inevitable.',
    images: ['/placeholder-cover.svg'],
  },
}

// ---------------------------------------------------------------------------
// Search params type (Next.js 15+ passes as Promise)
// ---------------------------------------------------------------------------

interface CoursesPageProps {
  searchParams: Promise<{
    category?: string
    price?: string
    q?: string
    sort?: string
  }>
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const params = await searchParams

  const initialCategory = params.category ?? ''
  const initialPrice = params.price ?? ''
  const initialQuery = params.q ?? ''
  const initialSort = params.sort ?? 'newest'

  // --- Fetch in parallel ---
  const [courses, categories] = await Promise.all([
    listPublishedCourses(),
    listTermsByTaxonomy('ld_course_category'),
  ])

  // --- Build a lookup: course.featured_image_id → media rows ---
  const imageIds = [
    ...new Set(
      courses
        .map((c) => c.featured_image_id)
        .filter((id): id is number => id !== null && id !== undefined),
    ),
  ]
  const mediaRows = await getMediaByWpIds(imageIds)
  const mediaMap = new Map(mediaRows.map((m) => [m.wp_attachment_id, m]))

  // --- Build a lookup: course.wp_id → category term ids (from raw JSON) ---
  // The data-source JSON fallback embeds categories[] on each course record.
  // In Supabase mode we'd join term_relationships; here we use the embedded data.
  // Since CourseSummary doesn't carry categories[], we enrich via the
  // taxonomy TermRow set that's already loaded. Category terms with count > 0
  // won't give us the reverse mapping, so we attach empty arrays for Supabase
  // mode (where the category filter goes through URL + server re-fetch).
  // For JSON-fallback mode, the full data is embedded in raw JSON; we can't
  // access it via CourseSummary alone, so we do a lightweight re-read here.
  const categoryMap: Map<number, { termIds: number[]; firstName: string | null }> =
    new Map()

  // Attempt JSON mode enrichment (server-only)
  try {
    const { isSupabaseAvailable } = await import('@/shared/lib/data-source')
    if (!isSupabaseAvailable()) {
      // Re-read raw JSON to get embedded categories
      const path = await import('node:path')
      const fs = await import('node:fs')
      const dataPath = path.join(process.cwd(), 'data', 'extracted', '_sanitized', 'courses.json')
      const raw = fs.readFileSync(dataPath, 'utf-8')
      const parsed = JSON.parse(raw) as {
        records: Array<{
          wp_id: number
          categories?: Array<{ term_id: number; name: string; slug: string }>
        }>
      }
      for (const rec of parsed.records) {
        const cats = rec.categories ?? []
        categoryMap.set(rec.wp_id, {
          termIds: cats.map((c) => c.term_id),
          firstName: cats[0]?.name ?? null,
        })
      }
    }
  } catch {
    // Supabase mode or read error — categoryMap stays empty; chips still render
  }

  // Build wp_term_id → TermRow map for category name resolution
  const termIdByWpTermId = new Map(categories.map((t) => [t.wp_term_id, t]))

  // --- Assemble CatalogCourse[] ---
  const catalogCourses: CatalogCourse[] = courses.map((course) => {
    const media = course.featured_image_id
      ? mediaMap.get(course.featured_image_id) ?? null
      : null
    const imageUrl = resolveCoverUrl(media, 'course', course.slug)

    const catInfo = categoryMap.get(course.wp_id)
    const categoryTermIds = catInfo?.termIds ?? []

    // Resolve first category name: prefer termIds lookup (maps term_id → TermRow)
    let categoryName: string | null = catInfo?.firstName ?? null
    if (!categoryName && categoryTermIds.length > 0) {
      const termRow = termIdByWpTermId.get(categoryTermIds[0])
      categoryName = termRow?.name ?? null
    }

    return {
      ...course,
      imageUrl,
      category: categoryName,
      categoryTermIds,
    }
  })

  return (
    <>
      {/* Skip link — per a11y spec */}
      <a
        href="#course-grid"
        className="sr-only focus:not-sr-only focus:fixed focus:top-spacing-2 focus:left-spacing-4 focus:z-50 focus:px-spacing-4 focus:py-spacing-2 focus:bg-color-primary focus:text-color-text-inverse focus:rounded-radius-md focus:font-semibold focus:shadow-[var(--shadow-md)]"
      >
        Skip to courses
      </a>

      {/* Hero Band */}
      <section
        aria-label="Course catalog hero"
        className="bg-color-primary text-color-text-inverse py-spacing-12 md:py-spacing-16 px-spacing-5"
      >
        <div className="max-w-screen-xl mx-auto flex flex-col items-center gap-spacing-5 text-center">
          <h1 className="font-[var(--font-heading)] font-bold text-3xl md:text-4xl leading-tight">
            Find Your Next Course
          </h1>
          <p className="font-[var(--font-body)] text-base md:text-lg opacity-85 max-w-md">
            Free for everyone — impossible to inevitable.
          </p>
          {/* Search box inside hero (visible on mobile; duplicated in toolbar on desktop) */}
          <div className="w-full max-w-xl">
            <Suspense>
              <HeroSearch initialQuery={initialQuery} />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Filter + grid */}
      <Suspense fallback={<CatalogFallback />}>
        <CourseCatalogClient
          courses={catalogCourses}
          categories={categories}
          initialCategory={initialCategory}
          initialPrice={initialPrice}
          initialQuery={initialQuery}
          initialSort={initialSort}
        />
      </Suspense>
    </>
  )
}

// ---------------------------------------------------------------------------
// HeroSearch — thin client wrapper so the search input can be inside a
// Suspense boundary (needed for useSearchParams) while the hero stays SSR.
// ---------------------------------------------------------------------------

// We inline a minimal hero search as a small client component here so we
// avoid an extra file for a one-liner. The full search logic lives in the
// CourseCatalogClient.

function HeroSearch({ initialQuery }: { initialQuery: string }) {
  // This is a Server Component wrapper — the input is controlled in
  // CourseCatalogClient. Here we render a static decorative input for SSR
  // (non-functional without JS) that matches the hero design.
  return (
    <div className="relative w-full">
      <label htmlFor="hero-search-hint" className="sr-only">
        Search courses
      </label>
      <span className="absolute left-spacing-4 top-1/2 -translate-y-1/2 text-color-text-muted pointer-events-none">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </span>
      <input
        id="hero-search-hint"
        type="search"
        disabled
        defaultValue={initialQuery}
        placeholder="Search courses…"
        aria-hidden="true"
        className="w-full pl-spacing-10 pr-spacing-4 py-spacing-3 rounded-radius-md bg-color-surface/90 text-color-text placeholder:text-color-text-muted border border-transparent text-base cursor-pointer opacity-80"
        onClick={() => {
          // JS: scroll to the toolbar search which is the functional one
          document.getElementById('course-search')?.focus()
        }}
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Loading fallback
// ---------------------------------------------------------------------------

function CatalogFallback() {
  return (
    <div className="max-w-screen-xl mx-auto px-spacing-5 py-spacing-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-spacing-5">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="rounded-radius-lg overflow-hidden shadow-[var(--shadow-md)] animate-pulse">
            <div className="w-full aspect-video bg-color-surface-raised" />
            <div className="p-spacing-4 flex flex-col gap-spacing-3">
              <div className="h-4 bg-color-surface-raised rounded-radius-sm w-1/3" />
              <div className="h-5 bg-color-surface-raised rounded-radius-sm w-full" />
              <div className="h-4 bg-color-surface-raised rounded-radius-sm w-4/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
