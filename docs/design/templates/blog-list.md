# Blog List — Layout Spec

Route: `/blog` (and `/blog/category/[slug]`)
Template type: list / archive

---

## 1. Purpose

Display a paginated, filterable grid of published posts from the `posts` table. Allows visitors to browse editorial content (mental health resources, founders stories, lifestyle, business) and drill into individual posts. Supports category filtering via `terms` + `term_relationships`. The page establishes editorial credibility and drives organic discovery.

---

## 2. Responsive Layout — ASCII Wireframes

### Mobile (< 640 px)

```
┌─────────────────────────────────┐
│  SITE HEADER / NAV              │  (global)
├─────────────────────────────────┤
│  PAGE HERO                      │
│  ┌───────────────────────────┐  │
│  │  "Blog" (h1)              │  │
│  │  Tagline: Impossible to   │  │
│  │  Inevitable               │  │
│  └───────────────────────────┘  │
├─────────────────────────────────┤
│  CATEGORY FILTER BAR            │
│  [All] [Mental Health] [Business│
│   ...] → horizontal scroll      │
├─────────────────────────────────┤
│  POST CARD (full-width)         │
│  ┌───────────────────────────┐  │
│  │  [Featured Image 16:9]    │  │
│  │  [Category pill]          │  │
│  │  Title (h2)               │  │
│  │  Excerpt (2 lines clamp)  │  │
│  │  Author · Date · ⏱ read  │  │
│  └───────────────────────────┘  │
│  POST CARD                      │
│  POST CARD                      │
│  POST CARD  (repeats, 1-col)    │
├─────────────────────────────────┤
│  PAGINATION                     │
│  ← Prev  [1] [2] [3]  Next →   │
├─────────────────────────────────┤
│  SITE FOOTER                    │
└─────────────────────────────────┘
```

### Desktop (≥ 1024 px)

```
┌────────────────────────────────────────────────────────────────┐
│  SITE HEADER / NAV                                             │
├────────────────────────────────────────────────────────────────┤
│  PAGE HERO (full-width band)                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  "Blog"  (h1, font.heading, centered)                    │  │
│  │  "Impossible to Inevitable — stories, guides, community" │  │
│  └──────────────────────────────────────────────────────────┘  │
├────────────────────────────────────────────────────────────────┤
│  CATEGORY FILTER BAR  (sticky on scroll)                       │
│  [All] [Mental Health] [Business] [Founders Corner]            │
│        [Parenting] [Finance] [Lifestyle] ...                   │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────────────┐  ┌──────────────────────┐          │
│  │  POST CARD           │  │  POST CARD           │  ← col 1 │
│  │  [Image 16:9]        │  │  [Image 16:9]        │    col 2 │
│  │  [Category pill]     │  │  [Category pill]     │          │
│  │  Title (h2)          │  │  Title (h2)          │          │
│  │  Excerpt (3-line)    │  │  Excerpt (3-line)    │          │
│  │  Author · Date · ⏱  │  │  Author · Date · ⏱  │          │
│  └──────────────────────┘  └──────────────────────┘          │
│  ┌──────────────────────┐  ┌──────────────────────┐          │
│  │  POST CARD           │  │  POST CARD           │          │
│  └──────────────────────┘  └──────────────────────┘          │
│  (2-col grid, 12 cards per page, auto-fill rows)              │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│  PAGINATION                                                    │
│  ← Previous       [1]  [2]  [3]  …  [N]       Next →         │
├────────────────────────────────────────────────────────────────┤
│  SITE FOOTER                                                   │
└────────────────────────────────────────────────────────────────┘
```

> At ≥ 1280 px the grid may expand to 3 columns if the design token `grid.blog-columns` resolves to 3; default is 2.

---

## 3. Section-by-Section Table

| Section | Component | Content source field | Behavior |
|---|---|---|---|
| **Site Header** | `<Header>` global shell | Site title, nav links | Sticky; collapses to hamburger at < 768 px |
| **Page Hero** | `<PageHero variant="blog">` | Hard-coded label "Blog"; SEO description from `seo_meta.description` (page record slug = `blog`) | Full-width band; background uses `color.surface-alt`; h1 uses `font.heading`; no featured image |
| **Category Filter Bar** | `<CategoryFilterBar>` | `terms.name`, `terms.slug` where `terms.taxonomy = 'category'`; joined via `term_relationships` | Horizontal scroll on mobile; pill-style toggle buttons; "All" selected by default; selecting a category pushes `?category=[slug]` to URL; active pill uses `color.accent` |
| **Post Card Grid** | `<PostCardGrid>` wrapping `<PostCard>` | `posts.title`, `posts.excerpt`, `posts.featured_image_id` → resolved to `media.file_path` or `media.cdn_url`, `posts.author_id` → `profiles.display_name`, `posts.date`, `posts.reading_time` (column), `posts.categories` (joined via `terms`) | Responsive CSS grid (1 → 2 → 3 col); cards link to `/blog/[slug]`; featured image lazy-loaded with 16:9 aspect-ratio placeholder using `color.surface-alt`; image fallback shows brand logomark |
| **Post Card — image** | `<AspectRatioBox ratio="16/9">` + `<Image>` | `media.cdn_url` or `media.file_path` for `featured_image_id`; `media.alt_text` for alt | Object-cover; lazy loading; fallback to `color.surface-alt` bg + centered icon |
| **Post Card — category pill** | `<CategoryPill>` | First item in `posts.categories[]` → `terms.name`, `terms.slug` | Links to `/blog/category/[slug]`; `color.accent` background; `font.label` size |
| **Post Card — title** | `<h2>` inside card | `posts.title` | `font.heading` scale step 4; 2-line clamp on mobile, 3-line on desktop; links to `/blog/[slug]` |
| **Post Card — excerpt** | `<p>` | `posts.excerpt` | `font.body`; 2-line clamp mobile, 3-line desktop; falls back to truncated `posts.content` (plain text, first 160 chars) if excerpt is empty |
| **Post Card — meta row** | `<PostMeta>` | `profiles.display_name` (via `posts.author_id`), `posts.date` (formatted `MMM D, YYYY`), `posts.reading_time` formatted as "N min read" | Inline flex, `font.caption`, `color.text-muted`; reading_time hidden if null |
| **Pagination** | `<Pagination>` | Derived: total row count from Supabase `.count()`, current page from `?page=` query param, `pageSize = 12` | Previous / Next + numbered pages; current page button uses `color.primary`; disabled state on first/last; keyboard-navigable |
| **Site Footer** | `<Footer>` global shell | Static links, social, copyright | — |

---

## 4. Primitives Used

| Primitive | Usage |
|---|---|
| `<PageHero>` | Hero band with title + subtitle |
| `<CategoryFilterBar>` | Scrollable pill toggle group |
| `<CategoryPill>` | Single category label / link |
| `<PostCardGrid>` | Responsive CSS grid wrapper |
| `<PostCard>` | Article preview card (image, pill, title, excerpt, meta) |
| `<AspectRatioBox>` | 16:9 image container |
| `<Image>` | Lazy image with fallback |
| `<PostMeta>` | Author + date + reading time inline strip |
| `<Pagination>` | Page navigation with ellipsis |
| `<SkeletonCard>` | Loading placeholder matching `<PostCard>` layout |
| `<EmptyState>` | "No posts found" message when filtered result is empty |
| `<Button variant="ghost">` | Prev / Next pagination controls |
| `<Badge>` | Reused as category pill |

Design tokens consumed: `color.primary`, `color.surface`, `color.surface-alt`, `color.accent`, `color.text`, `color.text-muted`, `color.border`, `font.heading`, `font.body`, `font.caption`, `font.label`, `radius.sm`, `radius.md`, `space.2`, `space.4`, `space.6`, `space.8`, `shadow.card`.

---

## 5. Data Requirements

### Primary query — post list

Table: `posts`

| Column | Usage |
|---|---|
| `id` | Card key; link to `/blog/[slug]` |
| `slug` | URL path segment |
| `title` | Card heading |
| `excerpt` | Card body text (fallback to truncated `content`) |
| `featured_image_id` | FK → `media.id` |
| `author_id` | FK → `profiles.id` |
| `date` | Display date; default sort `date DESC` |
| `reading_time` | "N min read" label (nullable — hide when null) |
| `status` | Filter: `status = 'publish'` only |

### Category filter

Table: `terms` joined via `term_relationships`

| Column | Usage |
|---|---|
| `terms.id` | Filter term |
| `terms.name` | Pill label |
| `terms.slug` | URL param `?category=[slug]` and link `/blog/category/[slug]` |
| `terms.taxonomy` | Filter: `taxonomy = 'category'` |
| `term_relationships.object_id` | Maps `posts.id` → `terms.id` |
| `term_relationships.term_id` | — |

### Media resolution

Table: `media`

| Column | Usage |
|---|---|
| `id` | Matched via `posts.featured_image_id` |
| `cdn_url` | Primary image src |
| `file_path` | Fallback image src |
| `alt_text` | `<img alt>` |
| `width`, `height` | Intrinsic dimensions for layout shift prevention |

### Author

Table: `profiles`

| Column | Usage |
|---|---|
| `id` | Matched via `posts.author_id` |
| `display_name` | Shown in meta row |
| `avatar_url` | Optional author avatar (display in meta if present) |

### SEO

Table: `seo_meta`

| Column | Usage |
|---|---|
| `entity_type = 'page'`, `entity_id` = pages.id for slug `blog` | `seo_meta.title` → `<title>`; `seo_meta.description` → `<meta name="description">` and hero subtitle |

### Pagination derived values

```
pageSize = 12
offset   = (page - 1) * pageSize
totalPages = ceil(totalCount / pageSize)
```

Supabase call pattern:
```ts
supabase
  .from('posts')
  .select('id, slug, title, excerpt, featured_image_id, author_id, date, reading_time, categories:term_relationships!inner(terms!inner(id,name,slug,taxonomy))', { count: 'exact' })
  .eq('status', 'publish')
  .order('date', { ascending: false })
  .range(offset, offset + pageSize - 1)
```

Category filter clause appended when `?category` param is present:
```ts
.eq('term_relationships.terms.slug', categorySlug)
```

---

## 6. Accessibility Notes

| Concern | Implementation |
|---|---|
| **Landmark regions** | `<header>` (site nav), `<main>` (hero + filter + grid + pagination), `<footer>`; filter bar inside `<nav aria-label="Blog categories">` |
| **Heading order** | `<h1>` in hero ("Blog"); each `<PostCard>` title is `<h2>`; no heading skipped |
| **Category filter keyboard** | Filter pills are `<button role="radio">` inside `role="radiogroup"`; arrow keys move between pills; Enter/Space activates |
| **Post card focus** | Entire card is not a link; the title `<a>` is the primary focus target; image and excerpt are `aria-hidden` or linked via `aria-labelledby` on the card |
| **Images** | `alt` from `media.alt_text`; if null, use `posts.title` as fallback alt; decorative fallback placeholder has `alt=""` |
| **Pagination** | `<nav aria-label="Pagination">` wrapping; current page button has `aria-current="page"`; Prev/Next have descriptive `aria-label` e.g. `aria-label="Go to previous page"` |
| **Loading states** | `<SkeletonCard>` has `aria-busy="true"` on grid container; `aria-live="polite"` region announces "Showing N posts" after filter/page change |
| **Empty state** | `role="status"` on `<EmptyState>` message; "No posts found for [category]. Try a different filter." |
| **Color contrast** | All text on `color.surface` and `color.surface-alt` must meet WCAG AA (4.5:1 for body, 3:1 for large text); category pills on `color.accent` bg must be verified at token generation time |
| **Motion** | Filter transition and card hover lift respect `prefers-reduced-motion`; disable translate/scale animations when set |
| **Reading time** | Rendered as `<span aria-label="5 minute read">5 min read</span>` |

---

## 7. Stitch Prompt

```
Design a Blog List page for "Luthas Center for Excellence" — a nonprofit LMS and mental health platform with the tagline "Impossible to Inevitable". The tone is empowering, calm, accessible, and trustworthy.

Use only semantic design tokens — no raw hex values. Tokens: color.primary, color.surface, color.surface-alt, color.accent, color.text, color.text-muted, color.border, font.heading, font.body, font.caption, font.label, radius.sm, radius.md, space.2, space.4, space.6, space.8, shadow.card.

Layout sections (top to bottom):

1. GLOBAL HEADER — sticky navigation bar using color.surface, font.heading for brand name.

2. PAGE HERO — full-width band in color.surface-alt. Centered h1 "Blog" in font.heading. Subtitle in font.body, color.text-muted: "Stories, guides, and community — from mental health to business."

3. CATEGORY FILTER BAR — horizontally scrollable row of pill-shaped toggle buttons. Pills use radius.md, font.label. Active pill: color.accent background, color.surface text. Inactive: color.surface background, color.primary text, color.border border. Categories include: All, Mental Health, Business, Founders Corner, Parenting, Finance & Investing, Lifestyle, Causes.

4. POST CARD GRID — responsive CSS grid: 1 column on mobile, 2 columns on tablet/desktop. Each card has:
   - 16:9 aspect-ratio featured image, object-cover, radius.md on top corners, lazy-loaded, color.surface-alt placeholder.
   - Category pill (color.accent, font.label, radius.sm) overlaid on image bottom-left.
   - Title in font.heading step 4, color.text, 2-line clamp, links to post.
   - Excerpt in font.body, color.text-muted, 3-line clamp.
   - Meta row: author display name · formatted date · reading time. font.caption, color.text-muted. Horizontal flex with space.2 gap.
   - Card background color.surface, radius.md, shadow.card. Hover: subtle lift (translate-y -2px, shadow increase). Respect prefers-reduced-motion.

5. PAGINATION — centered row below grid. Previous (←) and Next (→) ghost buttons in color.primary. Numbered page buttons; active page in color.primary background, color.surface text, radius.sm. Space.4 between controls.

6. GLOBAL FOOTER — color.surface-alt background, font.caption links.

Mobile-first. WCAG AA contrast. Heading order: h1 in hero, h2 in each post card title. No decorative emoji in UI text. Output as a full-page Figma frame at 1440px desktop width and a 390px mobile frame.
```
