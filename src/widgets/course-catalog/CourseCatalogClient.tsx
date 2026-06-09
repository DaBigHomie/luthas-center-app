'use client'

/**
 * CourseCatalogClient — client-side filter, search, and sort over
 * the pre-fetched course set. All data is passed from the Server Component
 * so no fetch happens here.
 *
 * Filter state is URL-driven (?category=, ?price=, ?q=, ?sort=) so pages
 * are shareable/bookmark-able, but updates happen without a full navigation
 * by using useRouter + shallow replace.
 */

import * as React from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { CourseCard } from '@/entities/course/ui/CourseCard'
import { Skeleton } from '@/shared/ui/Skeleton'
import type { CourseSummary } from '@/entities/course/model'
import type { TermRow } from '@/entities/term/model'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CatalogCourse extends CourseSummary {
  imageUrl: string
  category: string | null
  /** wp_term_ids of categories assigned to this course */
  categoryTermIds: number[]
}

export interface CourseCatalogClientProps {
  courses: CatalogCourse[]
  categories: TermRow[]
  /** active searchParam values from SSR */
  initialCategory: string
  initialPrice: string
  initialQuery: string
  initialSort: string
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PRICE_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'free', label: 'Free' },
  { value: 'open', label: 'Open Access' },
]

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'az', label: 'A–Z' },
  { value: 'lessons', label: 'Most Lessons' },
]

const PAGE_SIZE = 12

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function stripHtml(html: string | null): string {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

function sortCourses(courses: CatalogCourse[], sort: string): CatalogCourse[] {
  const copy = [...courses]
  switch (sort) {
    case 'az':
      return copy.sort((a, b) => (a.title ?? '').localeCompare(b.title ?? ''))
    case 'lessons':
      // step_counts not in CourseSummary — order unchanged
      return copy
    case 'newest':
    default:
      return copy.sort(
        (a, b) =>
          new Date(b.published_at ?? 0).getTime() -
          new Date(a.published_at ?? 0).getTime(),
      )
  }
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SearchInput({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Esc clears
  React.useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        onChange('')
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onChange])

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <label htmlFor="course-search" className="sr-only">
        Search courses
      </label>
      <span
        aria-hidden="true"
        className="absolute left-spacing-4 top-1/2 -translate-y-1/2 text-color-text-muted pointer-events-none"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </span>
      <input
        ref={inputRef}
        id="course-search"
        type="search"
        role="searchbox"
        aria-label="Search courses"
        aria-controls="course-grid"
        placeholder="Search courses…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-spacing-10 pr-spacing-4 py-spacing-3 rounded-radius-md bg-color-surface text-color-text placeholder:text-color-text-muted border border-color-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-color-border-focus text-base"
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onChange('')}
          className="absolute right-spacing-3 top-1/2 -translate-y-1/2 text-color-text-muted hover:text-color-text focus-visible:outline-2 focus-visible:outline-color-border-focus rounded-full p-0.5"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}

function CategoryChips({
  categories,
  selected,
  onToggle,
}: {
  categories: TermRow[]
  selected: string[]
  onToggle: (slug: string) => void
}) {
  return (
    <div
      role="group"
      aria-label="Filter by category"
      className="flex flex-wrap gap-spacing-2"
    >
      <button
        type="button"
        aria-pressed={selected.length === 0}
        onClick={() => onToggle('__all__')}
        className={[
          'px-spacing-3 py-spacing-2 rounded-radius-full text-sm font-medium transition-colors duration-[var(--duration-fast)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-color-border-focus',
          selected.length === 0
            ? 'bg-color-primary text-color-text-inverse'
            : 'bg-color-surface-raised text-color-text hover:bg-color-surface-overlay hover:text-color-text-inverse',
        ].join(' ')}
      >
        All
      </button>
      {categories.map((term) => {
        const active = selected.includes(term.slug)
        return (
          <button
            key={term.wp_term_id}
            type="button"
            aria-pressed={active}
            onClick={() => onToggle(term.slug)}
            className={[
              'px-spacing-3 py-spacing-2 rounded-radius-full text-sm font-medium transition-colors duration-[var(--duration-fast)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-color-border-focus',
              active
                ? 'bg-color-accent text-color-text-inverse'
                : 'bg-color-surface-raised text-color-text hover:bg-color-surface-overlay hover:text-color-text-inverse',
            ].join(' ')}
          >
            {term.name}
          </button>
        )
      })}
    </div>
  )
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-spacing-20 gap-spacing-4 text-center">
      <svg
        aria-hidden="true"
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
        className="text-color-text-muted opacity-40"
      >
        <circle cx="28" cy="28" r="20" stroke="currentColor" strokeWidth="3" />
        <path
          d="M42 42L56 56"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M20 28h16M28 20v16"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      <p className="text-color-text-muted font-[var(--font-body)]">
        No courses match your filters.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="px-spacing-4 py-spacing-2 rounded-radius-md border border-color-border text-color-text text-sm font-medium hover:bg-color-surface-raised transition-colors duration-[var(--duration-fast)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-color-border-focus"
      >
        Clear filters
      </button>
    </div>
  )
}

function CardSkeleton() {
  return (
    <div className="rounded-radius-lg overflow-hidden shadow-[var(--shadow-md)]">
      <Skeleton className="w-full aspect-video" />
      <div className="p-spacing-4 flex flex-col gap-spacing-3">
        <Skeleton shape="text" className="w-1/3" />
        <Skeleton shape="text" className="w-full" />
        <Skeleton shape="text" className="w-4/5" />
        <Skeleton shape="text" className="w-2/3" />
        <div className="flex justify-between mt-spacing-2">
          <Skeleton className="w-16 h-7 rounded-radius-full" />
          <Skeleton className="w-24 h-8 rounded-radius-md" />
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function CourseCatalogClient({
  courses,
  categories,
  initialCategory,
  initialPrice,
  initialQuery,
  initialSort,
}: CourseCatalogClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Local state — initialised from SSR params
  const [query, setQueryRaw] = React.useState(initialQuery)
  const [selectedCats, setSelectedCats] = React.useState<string[]>(
    initialCategory ? initialCategory.split(',').filter(Boolean) : [],
  )
  const [price, setPrice] = React.useState(initialPrice)
  const [sort, setSort] = React.useState(initialSort || 'newest')
  const [page, setPage] = React.useState(1)
  const [isPending, startTransition] = React.useTransition()

  // Debounce search query — effect only sets debouncedQuery (an external "timer" system)
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const [debouncedQuery, setDebouncedQuery] = React.useState(query)
  React.useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setDebouncedQuery(query), 250)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])

  // Sync URL when filters change — this effect only talks to the router (external system)
  React.useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (selectedCats.length) {
      params.set('category', selectedCats.join(','))
    } else {
      params.delete('category')
    }
    if (price) {
      params.set('price', price)
    } else {
      params.delete('price')
    }
    if (debouncedQuery) {
      params.set('q', debouncedQuery)
    } else {
      params.delete('q')
    }
    if (sort && sort !== 'newest') {
      params.set('sort', sort)
    } else {
      params.delete('sort')
    }
    params.delete('page')
    const qs = params.toString()
    startTransition(() => {
      router.replace(pathname + (qs ? `?${qs}` : ''), { scroll: false })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCats, price, debouncedQuery, sort])

  // Results label ref for focus management (external DOM interaction — valid effect)
  const resultsLabelRef = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    resultsLabelRef.current?.focus()
  }, [selectedCats, price, debouncedQuery])

  // --- Filter ---
  let filtered = courses

  if (selectedCats.length > 0) {
    // Build slug→wp_term_id map from categories list
    const slugToTermId = new Map(categories.map((t) => [t.slug, t.wp_term_id]))
    const selectedTermIds = selectedCats
      .map((s) => slugToTermId.get(s))
      .filter((id): id is number => id !== undefined)
    filtered = filtered.filter((c) =>
      c.categoryTermIds.some((tid) => selectedTermIds.includes(tid)),
    )
  }

  if (price) {
    filtered = filtered.filter(
      (c) => (c.price_type ?? '').toLowerCase() === price,
    )
  }

  if (debouncedQuery.trim()) {
    const q = debouncedQuery.trim().toLowerCase()
    filtered = filtered.filter(
      (c) =>
        (c.title ?? '').toLowerCase().includes(q) ||
        stripHtml(c.excerpt).toLowerCase().includes(q),
    )
  }

  filtered = sortCourses(filtered, sort)

  // --- Pagination ---
  const totalCount = filtered.length
  const paginated = filtered.slice(0, page * PAGE_SIZE)
  const hasMore = paginated.length < totalCount

  // --- Handlers — each resets page to 1 ---
  function handleCatToggle(slug: string) {
    setPage(1)
    if (slug === '__all__') {
      setSelectedCats([])
      return
    }
    setSelectedCats((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    )
  }

  function handlePriceChange(val: string) {
    setPrice(val)
    setPage(1)
  }

  function handleSortChange(val: string) {
    setSort(val)
    setPage(1)
  }

  function handleQueryChange(val: string) {
    setQueryRaw(val)
    setPage(1)
  }

  function clearAll() {
    setQueryRaw('')
    setSelectedCats([])
    setPrice('')
    setSort('newest')
    setPage(1)
  }

  return (
    <div>
      {/* ── Filter Toolbar ─────────────────────────────────────────── */}
      <div className="sticky top-0 z-10 bg-color-background border-b border-color-border">
        <div className="max-w-screen-xl mx-auto px-spacing-5 py-spacing-4 flex flex-col gap-spacing-3">
          {/* Search — hidden on mobile (hero search scrolls here); shown md+ in toolbar */}
          <div className="hidden md:block">
            <SearchInput value={query} onChange={handleQueryChange} />
          </div>
          {/* Category chips */}
          <CategoryChips
            categories={categories}
            selected={selectedCats}
            onToggle={handleCatToggle}
          />

          {/* Mobile search (shown below chips on small screens) */}
          <div className="md:hidden">
            <SearchInput value={query} onChange={handleQueryChange} />
          </div>

          {/* Price + Sort + Results count row */}
          <div className="flex flex-wrap items-center gap-spacing-3">
            {/* Price filter */}
            <div className="flex items-center gap-spacing-2">
              <label
                htmlFor="price-filter"
                className="text-sm font-medium text-color-text-muted whitespace-nowrap"
              >
                Price:
              </label>
              <select
                id="price-filter"
                value={price}
                onChange={(e) => handlePriceChange(e.target.value)}
                className="text-sm rounded-radius-md border border-color-border bg-color-surface text-color-text px-spacing-3 py-spacing-2 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-color-border-focus"
              >
                {PRICE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-spacing-2">
              <label
                htmlFor="sort-select"
                className="text-sm font-medium text-color-text-muted whitespace-nowrap"
              >
                Sort:
              </label>
              <select
                id="sort-select"
                value={sort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="text-sm rounded-radius-md border border-color-border bg-color-surface text-color-text px-spacing-3 py-spacing-2 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-color-border-focus"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Results count — live region */}
            <div
              ref={resultsLabelRef}
              id="results-label"
              aria-live="polite"
              aria-atomic="true"
              tabIndex={-1}
              className="ml-auto text-sm text-color-text-muted focus:outline-none"
            >
              {isPending ? (
                <span className="sr-only">Updating…</span>
              ) : (
                <>
                  <span className="font-semibold text-color-text">{totalCount}</span>{' '}
                  {totalCount === 1 ? 'course' : 'courses'}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Course Grid ─────────────────────────────────────────────── */}
      <main
        id="course-grid"
        aria-labelledby="results-label"
        className="max-w-screen-xl mx-auto px-spacing-5 py-spacing-8"
      >
        {isPending ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-spacing-5"
            aria-label="Loading courses"
          >
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : paginated.length === 0 ? (
          <div className="grid grid-cols-1">
            <EmptyState onClear={clearAll} />
          </div>
        ) : (
          <>
            <ul
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-spacing-5 list-none p-0 m-0"
              aria-label={`${totalCount} courses`}
            >
              {paginated.map((course) => (
                <li key={course.id}>
                  <CourseCard
                    course={course}
                    imageUrl={course.imageUrl}
                    category={course.category}
                  />
                </li>
              ))}
            </ul>

            {/* Load more */}
            {hasMore && (
              <div className="flex justify-center mt-spacing-10">
                <button
                  type="button"
                  onClick={() => setPage((p) => p + 1)}
                  className="px-spacing-8 py-spacing-3 rounded-radius-md border border-color-border text-color-text font-semibold text-sm hover:bg-color-surface-raised transition-colors duration-[var(--duration-fast)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-color-border-focus"
                >
                  Load more ({totalCount - paginated.length} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

CourseCatalogClient.displayName = 'CourseCatalogClient'
