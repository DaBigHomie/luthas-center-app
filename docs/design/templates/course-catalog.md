# Course Catalog — Layout Spec

**Route:** `/courses`
**Template:** `course-catalog`
**Last updated:** 2026-06-08

---

## 1. Purpose

The Course Catalog is the primary discovery surface for Luthas Center's learning library (47 published courses as of extraction date). It must surface every course's title, category, and access type at a glance; support filtering by category and price_type; and deliver a search experience that does not require a page reload. The tone is empowering and low-friction — every visible course is free or open-access, so the UI should reinforce that zero-cost promise, not obscure it.

---

## 2. Responsive Layout — ASCII Wireframes

### 2a. Mobile (< 640 px)

```
┌─────────────────────────────────────────┐
│  [Logo]              [Menu ☰]           │  ← site header (sticky)
├─────────────────────────────────────────┤
│                                         │
│  HERO BAND                              │
│  h1: "Find Your Next Course"            │
│  [ Search input ________________ [Go] ] │
│                                         │
├─────────────────────────────────────────┤
│  FILTER BAR (horizontal scroll)         │
│  [All] [Mental Health] [Business] [+]   │
│  [Price: All ▾]                         │
├─────────────────────────────────────────┤
│  RESULTS LABEL                          │
│  "47 courses"                           │
├─────────────────────────────────────────┤
│  ┌───────────────────────────────────┐  │
│  │ [Cover image — 16:9]              │  │
│  │ Category chip                     │  │
│  │ Title (2-line clamp)              │  │
│  │ Excerpt (3-line clamp)            │  │
│  │ [Open / Free badge]  [Enroll →]   │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │ …repeat…                          │  │
│  └───────────────────────────────────┘  │
│                                         │
│  [Load more]  (or infinite scroll)      │
├─────────────────────────────────────────┤
│  site footer                            │
└─────────────────────────────────────────┘
```

### 2b. Desktop (≥ 1024 px)

```
┌────────────────────────────────────────────────────────────────┐
│  [Logo]     [Courses] [Resources] [About] [Donate]   [Sign in] │  ← sticky nav
├────────────────────────────────────────────────────────────────┤
│                                                                │
│   HERO BAND (full-width, color.primary bg, color.onPrimary fg) │
│   h1: "Find Your Next Course"                                  │
│   subhead: "Impossible to Inevitable — free for everyone."     │
│   [ Search input _________________________________ [Search] ]  │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│  FILTER + SORT TOOLBAR                                         │
│  Category: [All ▾] [Mental Health] [Business] [Wellness] …    │
│  Price:    [All ▾]                                             │
│  Sort:     [Newest ▾]                                          │
│  "47 courses found"                             [Grid | List]  │
├───────────────┬────────────────────────────────────────────────┤
│               │  COURSE GRID (3-col at 1024 px, 4-col at 1280)│
│  (no sidebar) │  ┌──────┐ ┌──────┐ ┌──────┐                  │
│               │  │ card │ │ card │ │ card │                   │
│               │  └──────┘ └──────┘ └──────┘                  │
│               │  ┌──────┐ ┌──────┐ ┌──────┐                  │
│               │  │ card │ │ card │ │ card │                   │
│               │  └──────┘ └──────┘ └──────┘                  │
│               │  [Load more / Pagination]                      │
└───────────────┴────────────────────────────────────────────────┘
│  site footer                                                   │
└────────────────────────────────────────────────────────────────┘
```

> No persistent left sidebar — category filtering lives in the toolbar so the full viewport width is available for cards.

---

## 3. Section-by-Section Table

| Section | Component | Content source field | Behavior |
|---|---|---|---|
| **Site Header** | `<SiteHeader>` (sticky) | — | Transparent over hero, solid `color.surface` after 60 px scroll; mobile collapses to hamburger |
| **Hero Band** | `<HeroBand>` | Static copy; `color.primary` background | Fixed height 220 px mobile / 300 px desktop; contains `<SearchInput>` |
| **Search Input** | `<SearchInput>` | User keystroke → filters `courses.title` + `courses.excerpt` client-side (≤ 47 rows); SSR fallback query param `?q=` | Debounced 250 ms; clears filter chips when query present; aria-label="Search courses" |
| **Filter Bar** | `<FilterBar>` | Category chips: `terms.name` where taxonomy = `course_category`; Price dropdown: distinct `courses.price_type` values (`open`, `free`) | Chips are toggle buttons; multi-select category; single-select price; updates grid without navigation; active chip uses `color.accent` bg |
| **Sort / View Controls** | `<SortSelect>` + `<ViewToggle>` | Static options: Newest, A–Z, Most Lessons | Sort applied client-side on fetched set; view toggle persists to localStorage |
| **Results Label** | `<ResultsLabel>` | Derived: filtered count | Live region (`aria-live="polite"`) announces count changes |
| **Course Grid** | `<CourseGrid>` | `catalog_items` view (courses) | Responsive CSS Grid; renders `<CourseCard>` per row; empty state shows `<EmptyState>` illustration + "No courses match your filters." |
| **Course Card** | `<CourseCard>` | `courses.title`, `courses.excerpt`, `courses.cover_image_id` → `media.url`, `courses.price_type`, `terms.name` (category) | Cover image 16:9, lazy loaded; title 2-line clamp; excerpt 3-line clamp hidden on mobile < 380 px; badge shows "Free" for `price_type=free`, "Open Access" for `price_type=open`; entire card is a link to `/courses/[slug]` |
| **Access Badge** | `<AccessBadge>` | `courses.price_type` | `open` → "Open Access" (color.accent); `free` → "Free" (color.success); future paid value → price string |
| **Category Chip on Card** | `<CategoryChip>` | `terms.name` (first category in `categories[]`) | Clicking chip sets Filter Bar to that category |
| **Step Count** | `<StepCount>` | `courses.step_counts.lessons` (from `course_steps` join) | Shows "N lesson(s)"; hidden if 0 |
| **Load More / Pagination** | `<Pagination>` | Cursor-based; page size 12 | "Load more" pattern on mobile; numbered pagination on desktop; URL param `?page=N` for shareability |
| **Empty State** | `<EmptyState>` | Static copy | Shown when filtered result set is empty; includes "Clear filters" action |
| **Site Footer** | `<SiteFooter>` | — | Consistent with other templates |

---

## 4. Primitives Used

| Primitive | Token(s) applied | Notes |
|---|---|---|
| `<Heading>` level 1 | `font.heading`, `color.onPrimary`, `space.6` | Hero h1 |
| `<Heading>` level 2 (card) | `font.heading`, `color.text`, `space.2` | Card title |
| `<Body>` | `font.body`, `color.textMuted` | Excerpt text |
| `<Card>` | `color.surface`, `radius.md`, `shadow.sm` | Course card container |
| `<Badge>` | `color.accent` / `color.success`, `radius.full`, `font.body` | Access badge |
| `<Button>` variant="primary" | `color.primary`, `color.onPrimary`, `radius.md`, `space.3 space.5` | "Enroll →" CTA |
| `<Button>` variant="ghost" | `color.text`, `radius.md` | "Load more" |
| `<Input>` | `color.surface`, `color.border`, `radius.md`, `font.body` | Search field |
| `<Chip>` / `<ToggleChip>` | `color.surfaceAlt`, `color.accent` (active), `radius.full` | Filter chips |
| `<Select>` | `color.surface`, `color.border`, `radius.md` | Price + Sort dropdowns |
| `<Skeleton>` | `color.surfaceAlt` | Loading state for cards |
| `<Image>` | — | Lazy, with `cover_image_id`-derived src; explicit `width`/`height` for CLS prevention |
| `<EmptyState>` | `color.textMuted`, `font.body` | Zero results messaging |
| `<LiveRegion>` | — | Results count announcer |

---

## 5. Data Requirements

### Primary query — `catalog_items` view (aggregates `courses` + `term_relationships` + `terms`)

```
catalog_items
  id                  — courses.id (PK)
  title               — courses.title
  slug                — courses.slug
  excerpt             — courses.excerpt        (strip HTML, truncate 200 chars)
  cover_image_id      — courses.cover_image_id → join media ON media.id = cover_image_id → media.url
  price_type          — courses.price_type     (enum: 'open' | 'free')
  price               — courses.price          (NULL for all current records)
  status              — courses.status         (filter: status = 'publish')
  created_at          — courses.date
  lesson_count        — COUNT(course_steps) WHERE type = 'lesson'
```

### Category join — `terms` + `term_relationships`

```
terms
  term_id
  name
  slug
  taxonomy            (filter: taxonomy = 'course_category')

term_relationships
  object_id           → courses.id
  term_id             → terms.term_id
```

### Filter parameters mapped to Supabase query

| UI filter | Supabase predicate |
|---|---|
| Category chip(s) selected | `term_relationships.term_id = IN (selected_term_ids)` |
| Price type | `courses.price_type = 'open'` or `'free'` |
| Search query | `courses.title.ilike('%q%')` OR `courses.excerpt.ilike('%q%')` |
| Sort: Newest | `ORDER BY courses.date DESC` |
| Sort: A–Z | `ORDER BY courses.title ASC` |
| Sort: Most Lessons | `ORDER BY lesson_count DESC` |

### SEO meta (optional, for `<head>`)

```
seo_meta
  object_id           (NULL for catalog-level = use static defaults)
  meta_title
  meta_description
  og_image_id
```

---

## 6. Accessibility Notes

| Concern | Implementation |
|---|---|
| **Landmark regions** | `<header role="banner">`, `<main>`, `<nav aria-label="Site navigation">`, `<search>` (HTML5 landmark wrapping search input + filter bar), `<footer role="contentinfo">` |
| **Heading order** | `h1` in hero; card titles are `h2` (within `<article>`); section headings (if added) are `h2` with cards demoted to `h3` |
| **Focus management** | After filter/search change, focus moves to results label (programmatic `.focus()` on `<ResultsLabel ref>`); `<FilterBar>` chips receive visible focus ring using `color.focusRing` outline |
| **Search input** | `role="searchbox"`, `aria-label="Search courses"`, `aria-controls="course-grid"` |
| **Filter chips** | `role="group"` wrapper with `aria-label="Filter by category"`; each chip is `<button aria-pressed="true|false">` |
| **Price select** | `<label>` explicitly associated via `htmlFor` |
| **Card link** | Entire `<article>` card has a single `<a>` wrapping the title; avoid duplicate links — "Enroll →" is `aria-hidden` decorative text inside the same anchor, OR a distinct button with `aria-label="Enroll in [title]"` |
| **Cover image** | `alt="[title] course cover"` where title comes from `courses.title`; if `cover_image_id` is NULL, render a themed SVG placeholder with `aria-hidden="true"` and `role="presentation"` |
| **Live region** | `<div aria-live="polite" aria-atomic="true">` for results count; update text on filter change |
| **Keyboard navigation** | Filter chips navigable with arrow keys inside the group (roving tabindex pattern); `Esc` clears search input |
| **Reduced motion** | Skeleton pulse animation and card hover lift respect `prefers-reduced-motion: reduce` |
| **Color contrast** | All text on `color.primary` hero must meet WCAG AA (4.5:1 for normal text); badge text on `color.accent` background must be verified at token-generation time |
| **Skip link** | `<a href="#course-grid" class="skip-link">Skip to courses</a>` at top of `<body>` |

---

## 7. Stitch Prompt

```stitch
Design a Course Catalog page for "Luthas Center" — a nonprofit LMS and mental-health-resources platform. Tagline: "Impossible to Inevitable." Tone: empowering, calm, accessible, trustworthy.

BRAND TOKENS (use these names; never raw hex):
  color.primary, color.onPrimary, color.surface, color.surfaceAlt,
  color.accent, color.success, color.text, color.textMuted, color.border,
  color.focusRing
  font.heading (display weight), font.body (regular)
  radius.md (cards/inputs), radius.full (chips/badges)
  space.2 space.3 space.4 space.5 space.6 (padding/gap scale)
  shadow.sm (card elevation)

LAYOUT — Desktop (1280 px wide):
1. Sticky site header: logo left, nav links center (Courses, Resources, About, Donate), Sign In button right. Background color.surface. Bottom border color.border.
2. Hero band (full-width, color.primary background, color.onPrimary text):
   - h1 "Find Your Next Course" in font.heading, large.
   - Subhead "Free for everyone — impossible to inevitable." in font.body.
   - Centered search input (width 560 px, color.surface bg, radius.md, placeholder "Search courses…") with a color.primary search button.
3. Filter toolbar (color.surface bg, bottom border color.border, sticky below header):
   - "Category:" label then horizontal scrolling toggle chips (radius.full); active chip bg color.accent, text color.onPrimary; inactive bg color.surfaceAlt.
   - "Price:" select dropdown, radius.md.
   - "Sort:" select dropdown.
   - Right-aligned: results count label in font.body color.textMuted + grid/list view toggle icons.
4. Course grid (4 columns at 1280 px, gap space.4, padding space.5 horizontal):
   Each card (color.surface bg, radius.md, shadow.sm):
     - 16:9 cover image (lazy, object-fit cover) with top radius.md clipping.
     - Inside padding space.4.
     - Category chip (radius.full, color.surfaceAlt, font.body small) — top left.
     - h2 title in font.heading, 2-line clamp.
     - Excerpt in font.body color.textMuted, 3-line clamp.
     - Bottom row: access badge left ("Open Access" in color.accent or "Free" in color.success, radius.full, font.body small), lesson count center (font.body color.textMuted), "Enroll →" link right (color.primary, font.body semi-bold).
5. Pagination row: centered "Load more" ghost button (color.text, radius.md, border color.border).
6. Footer: dark band, color.surface bg variant, links in font.body color.textMuted.

MOBILE (375 px): Single column. Filter bar becomes horizontal scroll strip. Hero reduces height. Cards full-width. Same token names.

Produce: desktop + mobile artboards. Use auto-layout. Apply all named tokens as Figma variable references, not literal values.
```
