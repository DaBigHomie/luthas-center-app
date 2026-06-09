# Design System Overview — Luthas Center

**Platform:** luthas-center.damieus.app
**Tagline:** "Impossible to Inevitable"
**Mission tone:** Empowering, calm, accessible, trustworthy
**Last updated:** 2026-06-08
**Token source:** WordPress `jnews` theme extracted into `src/shared/design/tokens.ts`

---

## 1. Token System

All visual decisions throughout the app flow from a single canonical file:

```
src/shared/design/tokens.ts
```

Tokens are sourced from the `jnews` WordPress theme via `data/extracted/theme-options-raw.json` and mapped to semantic names. No raw hex values appear in any component, template, or spec. Every token reference in this directory uses the names below.

### 1a. Color

| Category | Token names |
|----------|------------|
| Brand | `color.primary`, `color.primary-hover`, `color.secondary`, `color.accent` |
| Surface | `color.surface`, `color.surface-raised`, `color.surface-overlay` |
| Text | `color.text`, `color.text-muted`, `color.text-inverse` |
| Border | `color.border`, `color.border-focus` |
| Semantic | `color.error`, `color.success`, `color.warning`, `color.info` |

Usage conventions:
- `color.primary` — buttons, links, progress bar fill, active nav states
- `color.accent` — newsletter band, donation level selected state, category pills
- `color.surface` — page base and card backgrounds
- `color.surface-raised` — elevated panels, footer, hover states
- `color.surface-overlay` — modal/drawer backdrop (60% opacity)
- `color.text-inverse` — text on dark/primary-color backgrounds (hero, banners)
- `color.border-focus` — always used for focus rings; never suppress

Semantic colors follow a tinted-bg + matching-text pattern for badges and alerts:
`color.[semantic] @ 12–15% opacity` background, `color.[semantic]` text.

### 1b. Typography

| Category | Token names |
|----------|------------|
| Font families | `font.heading`, `font.body`, `font.mono` |
| Size scale | `font.size.xs`, `font.size.sm`, `font.size.base`, `font.size.lg`, `font.size.xl`, `font.size.2xl`, `font.size.3xl`, `font.size.4xl` |
| Weight | `font.weight.normal`, `font.weight.medium`, `font.weight.semibold`, `font.weight.bold` |
| Line height | `font.leading.tight`, `font.leading.normal`, `font.leading.relaxed` |

Usage conventions:
- `font.heading` + `font.weight.bold` + `font.leading.tight` — all `<h1>` through `<h3>`
- `font.body` + `font.weight.normal` + `font.leading.relaxed` — body prose
- `font.size.4xl` / `font.size.3xl` — hero headlines only
- `font.size.xs` — badge/tag labels, breadcrumb
- `font.weight.semibold` — card titles, button labels, nav active state

### 1c. Spacing

4 px base unit. Tokens: `space.1` (4px) through `space.16` (64px), plus `space.20` (80px) and `space.24` (96px).

| Usage pattern | Token |
|---------------|-------|
| Component inner padding | `space.2` – `space.4` |
| Card body padding | `space.4` |
| Nav / footer horizontal gutters | `space.6` – `space.8` |
| Section vertical padding | `space.8` – `space.12` |
| Hero top / bottom padding | `space.16` – `space.20` |

### 1d. Radius

| Token | Size | Use |
|-------|------|-----|
| `radius.sm` | 4px | Small inputs, tight UI |
| `radius.md` | 8px | Buttons, form fields, pagination items |
| `radius.lg` | 16px | Cards, panels, donate widget |
| `radius.xl` | 24px | Feature callout blocks |
| `radius.full` | 9999px | Badges, tags, avatars, progress pill |

### 1e. Elevation, Motion, and Breakpoints

| Group | Tokens |
|-------|--------|
| Shadow | `shadow.sm`, `shadow.md`, `shadow.lg`, `shadow.focus` |
| Transition | `transition.fast`, `transition.base`, `transition.slow` |
| Breakpoint | `bp.sm` (640px), `bp.md` (768px), `bp.lg` (1024px), `bp.xl` (1280px) |

Motion rule: All transitions and animations must be disabled when `prefers-reduced-motion: reduce` is active.

---

## 2. Global App Shell

### 2a. Header / NavBar

**Component:** `<Header>` (renders `<NavBar>` + optional `<MobileDrawer>`)
**Landmark:** `<header role="banner">`

| Breakpoint | Behavior |
|------------|---------|
| `< bp.lg` (< 1024px) | Logo left, hamburger `☰` right. Tap opens full-height slide-in drawer from left. |
| `>= bp.lg` | Logo left, horizontal nav links center-right, Search icon, "Donate" primary CTA, user avatar/login right. |

**Nav links:** Courses, Blog, About, Give, Contact
**Sticky on scroll:** Yes. `shadow.md` added on scroll.
**First focusable element on every page:** Skip-to-content link targeting `<main>`.
**Auth state:** "Sign In" link when unauthenticated; avatar dropdown when authenticated (from `profiles.display_name`, `profiles.avatar_url`).
**Current page:** `aria-current="page"` on active link; `color.primary` + `font.weight.semibold` + 2px bottom border.

Drawer keyboard: Focus trapped inside drawer when open. Closed by `Escape` or backdrop click. `role="dialog"`, `aria-modal="true"`, `aria-label="Navigation menu"`.

### 2b. Footer

**Component:** `<Footer>`
**Landmark:** `<footer role="contentinfo">`

Desktop: 4-column grid + bottom bar. Mobile: stacked; nav columns collapse to accordion.

| Column | Links |
|--------|-------|
| Learn | Courses, Programs, Certifications |
| Support | Mental Health, Homelessness Resources, Financial Empowerment |
| Community | Blog, Events, Donate |
| Organization | About, Contact, Careers |

Bottom bar: copyright text left, legal links center, back-to-top right.
Background: `color.surface-raised`. Text: `color.text-muted` for links, `color.text` for column headings.
Social icons: 40px circular ghost buttons with `aria-label` per platform.

### 2c. Layout Grid

The layout grid is a centered max-width container applied via `<PageLayout>`:

```
max-width: 1280px (bp.xl)
horizontal padding: space.4 (mobile), space.8 (bp.md+), space.12 (bp.lg+)
column gap: space.6
```

Section-level wrappers use `<section aria-labelledby="[heading-id]">` or `<section aria-label="[description]">` for landmark coverage.

Standard section rhythm:
- Section heading `<h2>` + optional link row
- Content grid (1 col mobile → 2 col bp.md → 3 col bp.lg)
- `padding-block: space.12` per section

### 2d. Breakpoints Summary

| Name | Value | Typical behavior |
|------|-------|-----------------|
| `bp.sm` | 640px | Single-column to 2-column transitions |
| `bp.md` | 768px | 2-column grids; full header visible |
| `bp.lg` | 1024px | 3-column grids; desktop nav replaces drawer |
| `bp.xl` | 1280px | Container max-width cap |

---

## 3. Route to Template Map

| Route | Template file | Template ID | Notes |
|-------|--------------|-------------|-------|
| `/` | `templates/home.md` | `home` | Full discovery surface; hero + courses + donate + blog + newsletter |
| `/about` | `templates/about.md` | `about` | Static CMS page; `pages` table `slug = about` |
| `/contact` | `templates/contact.md` | `contact` | Contact form + org info sidebar + map |
| `/give/[slug]` | `templates/donate.md` | `donate` | Dynamic per `donation_forms.slug`; 3 forms |
| `/blog` | `templates/blog-list.md` | `blog-list` | Paginated + filterable post grid |
| `/blog/[slug]` | `templates/post-detail.md` | `post-detail` | Single article; `posts` table |
| `/courses` | `templates/course-catalog.md` | `course-catalog` | Filterable course grid; 47 published courses |
| `/courses/[slug]` | `templates/course-detail.md` | `course-detail` | Course landing + curriculum accordion + enroll CTA |
| `/courses/[course]/lessons/[lesson]` | `templates/lesson.md` | `lesson` | Distraction-free lesson reader + sidebar nav |

### Supabase data by route

| Route | Primary tables |
|-------|---------------|
| `/` | `courses`, `posts`, `donation_forms`, `donation_stats`, `media`, `pages`, `terms`, `term_relationships` |
| `/about` | `pages` (slug=about), `media` |
| `/contact` | Static — no Supabase query (form posts to edge function) |
| `/give/[slug]` | `donation_forms`, `donation_stats`, `pages` |
| `/blog` | `posts`, `terms`, `term_relationships`, `media`, `profiles` |
| `/blog/[slug]` | `posts`, `profiles`, `media`, `terms`, `term_relationships`, `seo_meta` |
| `/courses` | `courses`, `media`, `terms`, `catalog_items` (view) |
| `/courses/[slug]` | `courses`, `lessons`, `course_steps`, `quizzes`, `media`, `profiles`, `enrollments`, `seo_meta` |
| `/courses/[course]/lessons/[lesson]` | `lessons`, `course_steps`, `courses`, `enrollments`, `media` |

---

## 4. Component Library Index

All components are documented in `docs/design/components.md`.

| # | Component | Primary templates |
|---|-----------|------------------|
| 1 | Button | All |
| 2 | Card | home, blog-list, course-catalog |
| 3 | NavBar + Mobile Drawer | All (via app shell) |
| 4 | Footer | All (via app shell) |
| 5 | Hero | home, about, blog-list, course-catalog, donate |
| 6 | CourseCard | home, course-catalog |
| 7 | LessonListItem | course-detail, lesson |
| 8 | PostCard | home, blog-list |
| 9 | Badge / Tag | All card contexts |
| 10 | FormField | contact, donate |
| 11 | Pagination | blog-list, course-catalog |
| 12 | Accordion | course-detail, lesson |
| 13 | Avatar | post-detail, blog-list, lesson |
| 14 | Breadcrumb | course-detail, lesson, post-detail |
| 15 | Alert / CTA Banner | All (system feedback + donation prompts) |

---

## 5. Stitch MASTER Brief

The block below is a paste-ready prompt to use at the start of any Google Stitch session for this project. Every screen generated in Stitch must open with this brief so all outputs share a consistent brand, token vocabulary, layout grid, and shell.

```
MASTER BRIEF — Luthas Center Design System
Platform: luthas-center.damieus.app
Product type: Nonprofit LMS + mental health resources platform
Tagline: "Impossible to Inevitable"
Tone: Empowering, calm, accessible, trustworthy

=== BRAND TOKEN VOCABULARY ===
Use ONLY the token names below — never raw hex, rgb(), or hsl() values.

COLOR TOKENS
  Surfaces:     color.surface · color.surface-raised · color.surface-overlay
  Brand:        color.primary · color.primary-hover · color.secondary · color.accent
  Text:         color.text · color.text-muted · color.text-inverse
  Border:       color.border · color.border-focus
  Semantic:     color.success · color.warning · color.error · color.info

TYPOGRAPHY TOKENS
  Families:     font.heading · font.body · font.mono
  Sizes (small → large): font.size.xs · sm · base · lg · xl · 2xl · 3xl · 4xl
  Weights:      font.weight.normal · medium · semibold · bold
  Leading:      font.leading.tight · normal · relaxed

SPACING TOKENS
  4px base unit: space.1 (4px) through space.16 (64px); also space.20, space.24
  Component padding: space.2–space.4
  Section padding: space.8–space.12
  Hero padding: space.16–space.20

RADIUS TOKENS
  radius.sm (4px) · radius.md (8px) · radius.lg (16px) · radius.xl (24px) · radius.full (pill)

ELEVATION + MOTION
  shadow.sm · shadow.md · shadow.lg · shadow.focus
  transition.fast · transition.base · transition.slow
  All animation respects prefers-reduced-motion: reduce

BREAKPOINTS
  bp.sm = 640px · bp.md = 768px · bp.lg = 1024px · bp.xl = 1280px (container max-width)

=== GLOBAL APP SHELL ===

HEADER (sticky, <header role="banner">)
  Desktop (bp.lg+): Logo left → nav links center (Courses, Blog, About, Give, Contact)
    → Search icon → "Donate" primary CTA button → user avatar/login right.
    Background: color.surface. Shadow shadow.md on scroll. Active link: color.primary,
    font.weight.semibold, 2px bottom border.
  Mobile (<bp.lg): Logo left, hamburger (☰) right. Tap opens full-height slide-in drawer
    from left: stacked nav links, CTA button, auth state. Backdrop: color.surface-overlay
    60% opacity. Drawer: role="dialog", aria-modal="true". Closed by Escape or backdrop.
  First focusable element on every screen: skip-to-content link targeting <main>.

FOOTER (<footer role="contentinfo">)
  Background: color.surface-raised.
  Desktop: 4-column grid. Col 1: Logo + tagline + mission blurb + social icons.
    Cols 2–4: nav link groups (Learn / Support / Community / Organization).
    Bottom bar: copyright | legal links | back-to-top.
  Mobile: stacked. Nav columns as accordion (aria-expanded/aria-controls). Donate CTA above
    copyright. Social icons: 40px circular ghost buttons with aria-label.

LAYOUT GRID
  Container max-width: 1280px (bp.xl). Centered, horizontal padding scales:
    space.4 (mobile) → space.8 (bp.md) → space.12 (bp.lg+).
  Section rhythm: <section aria-labelledby="[id]"> · padding-block space.12 ·
    h2 section heading · content grid (1 col → 2 col bp.md → 3 col bp.lg).

=== HEADING HIERARCHY (per screen) ===
  H1: unique, present on every page (hero tagline or page title)
  H2: section-level headings (Featured Courses, From the Blog, etc.)
  H3: individual item headings within sections (card titles, FAQ questions)
  Never skip heading levels.

=== ACCESSIBILITY BASELINE ===
  All text meets WCAG 2.1 AA (4.5:1 body, 3:1 large/UI).
  Focus rings: 2px solid color.border-focus, outline-offset 2px — never suppressed.
  Color is never the sole signal — icons or labels always accompany semantic color.
  Interactive elements: min 40px touch target.
  aria-current="page" on active nav. aria-expanded on drawers/accordions.
  Images: alt from CMS alt field; decorative images alt="".

=== COMPONENT DEFAULTS ===
  Buttons: radius.md, font.weight.semibold. Primary: color.primary bg, color.text-inverse text.
    Focus: shadow.focus + color.border-focus outline.
  Cards: radius.lg, shadow.md, color.surface bg, color.border border.
    Hover: translateY(-2px), shadow.lg.
  Badges/Tags: radius.full, font.size.xs, font.weight.medium.
    Tinted bg (semantic color @ 15%) + matching semantic text color.
  Form fields: radius.md, border color.border. Focus: border color.border-focus + shadow.focus.
    Error: border color.error + color.error message. Label always above input.
  Breadcrumb: font.size.sm, color.text-muted for ancestors, color.primary on hover,
    aria-current="page" on final item.

=== SCREEN-SPECIFIC INSTRUCTIONS ===
When generating any individual screen from this system, apply this shell and these tokens
first, then follow the screen's own spec for sections, content sources, and layout details.
Always output: desktop variant (bp.lg+), mobile variant (<bp.md), and interactive states
(hover, focus, active, disabled) for every interactive element.
No raw hex anywhere in the output.
```

---

## 6. Files in This Directory

```
docs/design/
├── README.md                      ← this file (design system overview)
├── components.md                  ← full component library (15 components)
└── templates/
    ├── home.md                    ← route: /
    ├── about.md                   ← route: /about
    ├── contact.md                 ← route: /contact
    ├── donate.md                  ← route: /give/[slug]
    ├── blog-list.md               ← route: /blog
    ├── post-detail.md             ← route: /blog/[slug]
    ├── course-catalog.md          ← route: /courses
    ├── course-detail.md           ← route: /courses/[slug]
    └── lesson.md                  ← route: /courses/[course]/lessons/[lesson]
```

Each template file contains: Purpose, ASCII wireframes (mobile + desktop), section-by-section table, primitives, Supabase data requirements, accessibility notes, and a Stitch prompt for that specific screen.

---

*End of design system overview.*
