# Post Detail — Layout Spec

**Route:** `/blog/[slug]`
**Template ID:** `post-detail`
**Platform:** luthas-center.damieus.app — "Impossible to Inevitable"
**Last updated:** 2026-06-08

---

## 1. Purpose

Display a single long-form article in full. Content spans mental health resources,
nonprofit causes, founder perspective, and educational topics. The template must
build reader trust (clean typography, clear authorship), support sharing and
discoverability (share bar, category links, related posts), and preserve
accessibility at every breakpoint.

---

## 2. Responsive Layout — ASCII Wireframes

### Mobile (< 640 px)

```
┌─────────────────────────────────┐
│  [SiteHeader / GlobalNav]       │  landmark: <header>
├─────────────────────────────────┤
│  Breadcrumb                     │  Blog › Mental Health
│  Category pill(s)               │  [Mental Health] [Depression]
│  H1 title                       │  The Health and Well-being of
│                                 │  Single Mothers
│  Byline row                     │  Dame Luthas · Sep 19 2023
│                                 │  · 5 min read
├─────────────────────────────────┤
│  ┌─────────────────────────┐    │
│  │   Featured Image        │    │  16:9, full-width
│  └─────────────────────────┘    │
├─────────────────────────────────┤
│  Article body                   │  prose column, max-width token
│  (HTML content rendered)        │
│  …                              │
├─────────────────────────────────┤
│  Tags row                       │  #Entrepreneur  #who-we-are
├─────────────────────────────────┤
│  Share bar (horizontal)         │  [Copy link] [Facebook] [X]
│                                 │  [LinkedIn]
├─────────────────────────────────┤
│  ── Related Posts ──            │  heading H2
│  ┌──────────┐  title excerpt    │
│  │ thumb    │  Category · time  │  card stacked
│  └──────────┘                   │
│  ┌──────────┐  title excerpt    │
│  │ thumb    │  Category · time  │
│  └──────────┘                   │
├─────────────────────────────────┤
│  [SiteFooter]                   │  landmark: <footer>
└─────────────────────────────────┘
```

### Desktop (≥ 1024 px)

```
┌──────────────────────────────────────────────────────────────────┐
│  [SiteHeader / GlobalNav]                                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Breadcrumb                       Blog › Mental Health           │
│  Category pill(s)                 [Mental Health]  [Depression]  │
│                                                                  │
│  H1 title ─────────────────────────────────────────────────────  │
│  The Health and Well-being of Single Mothers                     │
│                                                                  │
│  Byline row                       Dame Luthas · Sep 19 2023      │
│                                   · 5 min read                  │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                  Featured Image (16:9)                   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────┐  ┌────────────────────┐    │
│  │  Article body (prose)           │  │  Sticky sidebar    │    │
│  │                                 │  │                    │    │
│  │  Rendered content HTML …        │  │  Share (vertical)  │    │
│  │                                 │  │  [Copy]            │    │
│  │  …                              │  │  [FB]              │    │
│  │                                 │  │  [X]               │    │
│  │                                 │  │  [LI]              │    │
│  │  Tags row                       │  │                    │    │
│  └─────────────────────────────────┘  └────────────────────┘    │
│                                                                  │
│  ── Related Posts ──────────────────────────────────────────     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  thumb       │  │  thumb       │  │  thumb       │          │
│  │  title       │  │  title       │  │  title       │          │
│  │  excerpt     │  │  excerpt     │  │  excerpt     │          │
│  │  Cat · time  │  │  Cat · time  │  │  Cat · time  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│  [SiteFooter]                                                    │
└──────────────────────────────────────────────────────────────────┘
```

---

## 3. Section-by-Section Table

| Section | Component | Content source field | Behavior |
|---|---|---|---|
| Global nav | `SiteHeader` | Static / CMS nav links | Sticky on scroll; mobile hamburger |
| Breadcrumb | `Breadcrumb` | Derived: "Blog" > `categories[0].name` | Links; aria-label="breadcrumb" |
| Category pills | `CategoryPill` (list) | `posts.categories[]` — each `{name, slug}` | Each pill links to `/blog/category/[slug]`; color token `color.accent` |
| Post heading | `PageHeading` (`<h1>`) | `posts.title` | Single H1; font token `font.heading`; max 2 lines on mobile |
| Byline row | `AuthorByline` | `posts.author.name`, `posts.date`, `posts.reading_time_minutes` | `reading_time_minutes` null → compute from content length client-side; format date with `Intl.DateTimeFormat` |
| Featured image | `HeroImage` | `posts.featured_image_id` → join `media.id`, `media.url`, `media.alt_text` | 16:9 aspect-ratio container; `object-fit: cover`; `loading="eager"` (LCP candidate); radius token `radius.md` |
| Article body | `ProseRenderer` | `posts.content` (raw HTML) | Sanitized HTML via DOMPurify; typography scale uses `font.body`; inline images lazy-loaded; heading hierarchy preserved (H2–H4 in body only) |
| Tags row | `TagList` | `posts.tags[]` — each `{name, slug}` | Links to `/blog/tag/[slug]`; color token `color.surface`; smaller type than category pills |
| Share bar (mobile) | `ShareBar` (horizontal) | Derived from `window.location.href` + `posts.title` | Copy-to-clipboard + Web Share API fallback; icons only on mobile (with `aria-label`); positioned below tags |
| Share bar (desktop sidebar) | `ShareBar` (vertical, sticky) | Same derivation | Sticky within article column; becomes fixed at bottom threshold; `position: sticky; top: space.20` |
| Related posts | `PostCardGrid` + `PostCard` | Query: posts sharing `categories[]` slugs, excluding current, limit 3; fields: `title`, `slug`, `featured_image_id`, `date`, `categories[0].name`, `reading_time_minutes` | 1-col on mobile, 3-col on desktop; lazy-loaded images; card hover: subtle shadow lift using `color.primary` tint |
| Site footer | `SiteFooter` | Static | Standard landmark `<footer>` |

---

## 4. Primitives Used

| Primitive | Token(s) applied | Notes |
|---|---|---|
| `PageHeading` | `font.heading`, `color.primary`, `space.6` | Renders as `<h1>` |
| `CategoryPill` | `color.accent`, `color.surface`, `radius.full`, `font.body`, `space.2` | Inline-flex chip |
| `AuthorByline` | `font.body`, `color.muted`, `space.2` | Avatar optional (from `profiles.avatar_url`) |
| `HeroImage` | `radius.md`, `space.0` top margin | `<figure>` wrapper; `<figcaption>` from `media.caption` if present |
| `ProseRenderer` | `font.body`, `color.primary` (text), `color.accent` (links), `space.4` (paragraph gap), `radius.sm` (code blocks), `color.surface` (blockquote bg) | Scoped CSS class `prose` |
| `TagList` | `color.surface`, `radius.sm`, `font.body`, `space.1` | `<ul>` with `role="list"` |
| `ShareBar` | `color.accent`, `color.surface`, `radius.md`, `space.3` | Icon buttons; tooltip on focus/hover |
| `PostCard` | `color.surface`, `radius.md`, `space.4`, `font.heading` (card title), `font.body` (excerpt) | Focusable card; entire card is link target |
| `PostCardGrid` | `space.8` (section gap), grid layout | CSS Grid; responsive via breakpoint tokens |
| `Breadcrumb` | `font.body`, `color.muted`, `space.1` | `<nav aria-label="breadcrumb">` with `<ol>` |

---

## 5. Data Requirements

### Primary query — post by slug

**Table:** `posts`

| Column | Usage |
|---|---|
| `id` | Record key |
| `title` | H1, `<title>` tag, share text |
| `slug` | URL segment; also used to derive canonical URL |
| `content` | Full HTML body rendered in `ProseRenderer` |
| `excerpt` | OG description fallback; used in related post cards |
| `featured_image_id` | Foreign key → `media.id` |
| `author` | JSONB with `{id, name, login, nicename}` — renders in byline |
| `date` | Publish date in byline |
| `modified` | Passed to `<meta name="last-modified">` |
| `reading_time_minutes` | Byline; null → client-side estimate (words / 200) |
| `categories` | JSONB array `[{term_id, name, slug}]` — pills + breadcrumb |
| `tags` | JSONB array `[{term_id, name, slug}]` — tag row |
| `seo_title` | `<title>` override; fallback to `title` |
| `seo_description` | `<meta name="description">` + OG description |
| `status` | Gate render: only `status = 'publish'` (status_code = 30) served |

### Featured image join

**Table:** `media`

| Column | Usage |
|---|---|
| `id` | Matched against `posts.featured_image_id` |
| `url` | `<img src>` |
| `alt_text` | `<img alt>` (required; fallback to post title) |
| `width` | `<img width>` for CLS prevention |
| `height` | `<img height>` for CLS prevention |
| `caption` | `<figcaption>` if non-null |

### SEO meta (optional override)

**Table:** `seo_meta`

| Column | Usage |
|---|---|
| `entity_type` | `'post'` |
| `entity_id` | `posts.id` |
| `og_title` | Open Graph title |
| `og_description` | Open Graph description |
| `og_image_url` | OG image; fallback to `media.url` |

### Related posts query

**Table:** `posts`

```sql
SELECT id, title, slug, excerpt, featured_image_id, date,
       reading_time_minutes, categories
FROM   posts
WHERE  status_code = 30
  AND  id != :current_post_id
  AND  categories @> ANY(
         ARRAY(
           SELECT jsonb_build_array(cat)
           FROM   jsonb_array_elements(:current_categories) AS cat
         )
       )
ORDER BY date DESC
LIMIT  3;
```

Related post card images also require a join to `media` on `featured_image_id`.

### Profiles (author avatar, optional)

**Table:** `profiles`

| Column | Usage |
|---|---|
| `id` | Matched against `posts.author->>'id'` |
| `avatar_url` | Author avatar in byline (if present) |
| `display_name` | Fallback display name |

---

## 6. Accessibility Notes

| Area | Requirement |
|---|---|
| Landmark structure | `<header>`, `<nav aria-label="site navigation">`, `<main>`, `<aside aria-label="share links">` (sidebar), `<section aria-labelledby="related-heading">`, `<footer>` |
| Heading order | `<h1>` post title only; body content HTML may contain `<h2>`–`<h4>`; related posts section heading is `<h2 id="related-heading">`; no heading skips |
| Featured image | `alt` from `media.alt_text`; if empty string is stored, use post title as fallback; never `alt=""` for a content image |
| Category / tag links | Each `<a>` has descriptive text (category name); no "click here" |
| Share bar buttons | Each icon button has `aria-label` e.g. `aria-label="Share on LinkedIn"`; tooltip text matches label |
| Copy-to-clipboard | On success, announce via `aria-live="polite"` region: "Link copied to clipboard" |
| Focus management | No focus traps on this page; ensure skip-to-content link reaches `<main>` |
| Keyboard | All interactive elements reachable by Tab; share buttons, category pills, post cards, tag links all have visible `:focus-visible` outlines using `color.accent` |
| Color contrast | All text on `color.surface` background must meet WCAG AA (4.5:1 for body text); category pills checked against `color.accent` background |
| Reduced motion | Hero image parallax (if any) and card hover transitions must respect `prefers-reduced-motion: reduce` |
| Reading column width | Prose column constrained to `65ch` max to support readability for users with cognitive or reading disabilities |
| Language | `<html lang="en">` set at document level; no per-section override needed |

---

## 7. Stitch Prompt

```
You are generating a high-fidelity screen for luthas-center.damieus.app, a nonprofit
education and mental-health-resources platform. Tagline: "Impossible to Inevitable."
Tone: empowering, calm, accessible, trustworthy.

SCREEN: Post Detail — /blog/[slug]

BRAND TOKENS (reference by name only — never use raw hex):
  Background: color.surface
  Primary text: color.primary
  Accent (links, pills, focus rings): color.accent
  Muted / secondary text: color.muted
  Heading typeface: font.heading
  Body / UI typeface: font.body
  Border radius (cards, images): radius.md
  Border radius (pills, tags): radius.full (pills) / radius.sm (tags)
  Section vertical gap: space.8
  Component padding: space.4
  Inline gap: space.2

LAYOUT (desktop, 1280 px canvas, 12-col grid):
  - Full-width sticky site header (cols 1–12)
  - Breadcrumb bar below header: "Blog > Mental Health" in color.muted font.body
  - Hero content block (cols 2–11):
      • Category pills row (color.accent background, radius.full, font.body small)
        Labels: "Mental Health"  "Depression"
      • H1 in font.heading large: "The Health and Well-being of Single Mothers"
      • Byline: avatar circle + "Dame Luthas  ·  Sep 19 2023  ·  5 min read"
        (color.muted, font.body small)
  - Featured image (cols 2–11, 16:9, radius.md, object-fit cover)
    Placeholder: warm, editorial photography of a mother and child, soft natural light
  - Two-column below image:
      • Article body (cols 2–8): prose text in font.body, line-height generous,
        max-width 65ch. Show 3 paragraphs of placeholder copy about mental wellness
        and single-parent resilience. Include one H2 subheading "Barriers to Care"
        and one blockquote (color.surface tinted background, left border color.accent).
      • Sticky sidebar (cols 9–11): vertical share bar — label "Share" in font.body
        small color.muted; then four icon buttons (link, Facebook, X/Twitter,
        LinkedIn) each color.accent on color.surface background, radius.md,
        space.3 padding, with visible focus ring.
  - Tags row (cols 2–8): small chips with labels "#Entrepreneur" "#who-we-are"
    color.surface background, radius.sm, font.body x-small, space.1 padding
  - Related Posts section (cols 2–11):
      • H2 "Related Posts" font.heading medium color.primary
      • 3-column card grid (radius.md cards, color.surface bg, space.4 padding)
        Each card: thumbnail image (4:3, radius.md), category pill, title in
        font.heading small, 2-line excerpt in font.body color.muted, date + read time.
        Card hover: subtle box-shadow lift.
  - Full-width site footer

ACCESSIBILITY: include visible focus rings (color.accent), sufficient contrast,
aria-labels on icon buttons.

OUTPUT: Single desktop artboard, clean and editorial. No decorative emoji or
illustrations unless they appear within the article body. Spacing feels generous
and calm — not crowded.
```
