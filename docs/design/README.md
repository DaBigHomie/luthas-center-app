# Design System Overview — Luthas Center

**Platform:** luthas-center.damieus.app
**Tagline:** "Impossible to Inevitable"
**Mission tone:** Empowering, calm, accessible, trustworthy
**Last updated:** 2026-06-09
**Token source (SSOT):** `src/shared/design/tokens.ts` → wired as CSS custom properties in the `@theme` block of `src/app/globals.css` (Tailwind v4) → consumed via recipes in `src/shared/design/recipes.ts`.

This is a **modern, production-grade** design system for a fresh Next.js 16 / React 19 / Tailwind v4 app. It keeps the Luthas identity (warm-orange brand, calm neutral foreground, trustworthy education + mental-health tone) but the execution is contemporary: **semantic color roles**, a **fluid type scale**, an **8pt spacing grid**, **soft layered elevation**, and a **motion system**. No raw hex appears in any component — colors are HSL via tokens; hex lives only in source-reference comments.

> **Non-breaking contract:** every legacy token name, CSS var, and Tailwind utility class still resolves. Values were modernized and new roles were added; nothing was renamed or removed.

---

## 1. Token System

All visual decisions flow from one canonical file: `src/shared/design/tokens.ts`. It is wired to Tailwind v4 utilities through the `@theme` block in `globals.css`. There is **no `tailwind.config.ts`** — tokens are CSS custom properties.

Pipeline: `tokens.ts` (typed SSOT) → `@theme` custom properties (`globals.css`) → Tailwind utility classes (e.g. `bg-color-primary`, `text-color-foreground`, `rounded-radius-lg`, `shadow-[var(--shadow-md)]`) → `recipes.ts` (CVA variant maps) → primitives & widgets.

### 1a. Color — semantic roles

Components reference **roles**, never raw palette. Each role is `color.<name>` in TS and `--color-<name>` / `bg-color-<name>` etc. in CSS/Tailwind. All foreground-on-surface pairings meet WCAG AA.

**Role palette (name → HSL):**

| Role | HSL | Notes |
|------|-----|-------|
| `background` | `hsl(0 0% 100%)` | Page background |
| `foreground` | `hsl(222 32% 16%)` | Primary body text (AA on background) |
| `surface` | `hsl(222 14% 99%)` | Cards, sections |
| `surface-raised` | `hsl(222 16% 96%)` | Elevated panels, hover |
| `surface-overlay` | `hsl(222 30% 12%)` | Drawer/modal backdrop |
| `muted` | `hsl(222 16% 95%)` | Subtle fills, chips, bands |
| `muted-foreground` | `hsl(222 14% 42%)` | Text on muted fills |
| `primary` | `hsl(20 92% 52%)` | Brand orange — CTA / interactive |
| `primary-foreground` | `hsl(0 0% 100%)` | Text/icon on primary |
| `primary-hover` | `hsl(20 90% 45%)` | Primary hover |
| `accent` | `hsl(20 92% 52%)` | Brand orange accent (== primary hue) |
| `accent-foreground` | `hsl(0 0% 100%)` | Text on accent |
| `secondary` | `hsl(216 64% 24%)` | Deep navy — structural brand |
| `border` | `hsl(222 16% 90%)` | Default border / separator |
| `input` | `hsl(222 16% 88%)` | Form-control border |
| `ring` | `hsl(20 92% 52%)` | Focus ring (brand orange) |
| `success` (+ `-foreground`) | `hsl(151 60% 30%)` / `hsl(0 0% 100%)` | Completion |
| `warning` (+ `-foreground`) | `hsl(33 90% 42%)` / `hsl(0 0% 100%)` | In-progress |
| `error` (+ `-foreground`) | `hsl(353 78% 47%)` / `hsl(0 0% 100%)` | Destructive |
| `info` (+ `-foreground`) | `hsl(205 78% 40%)` / `hsl(0 0% 100%)` | Tip |

Legacy aliases still resolve and map onto roles: `text` → `foreground`, `text-muted`, `text-secondary`, `text-inverse`, `heading`, `border-focus` (now == `ring`, brand orange), `surface-code`, `rating`, `footer-{bg,link,text,copyright}`, and the tinted surfaces `{error,success,warning,info}-bg`.

Usage conventions:
- `primary` / `accent` — CTAs, links, donation/enroll actions, active nav, progress fill.
- `secondary` — structural navy accents, supportive headings.
- `surface` / `surface-raised` — card & panel backgrounds and their hover.
- `muted` — quiet bands, disabled fills, chips.
- `*-foreground` — always pair a foreground role with its background role for contrast.
- `ring` — focus rings (brand orange); never suppress.

Semantic badges/alerts: `color.[semantic] @ 12–15% opacity` background + `color.[semantic]` text (e.g. `bg-color-success/15 text-color-success`).

### 1b. Typography — fluid scale

| Category | Tokens |
|----------|--------|
| Font families | `font.heading` (Montserrat), `font.body` (Lato), `font.mono` (system mono) |
| Static size scale | `font.size.xs`…`6xl` (12 → 60px) |
| Weight | `font.weight.{light,normal,medium,semibold,bold,extrabold}` |
| Line height | `font.leading.{none,tight,snug,heading,normal,relaxed}` |
| Tracking | `font.tracking.{tighter,tight,normal,wide,wider}` |

**Fluid role steps** (`typography.<step>` — size uses `clamp()` for zero-shift scaling):

| Step | Size (min → max) | Weight / leading / tracking | Use |
|------|------------------|------------------------------|-----|
| `display` | 40 → 60px | 800 / 1.05 / -0.025em | Oversized hero |
| `h1` | 32 → 48px | 700 / 1.12 / -0.02em | Page H1 |
| `h2` | 26 → 36px | 700 / 1.2 / -0.015em | Section titles |
| `h3` | 22 → 28px | 700 / 1.3 / -0.01em | Card titles, sub-sections |
| `h4` | 22px | 600 / 1.35 | Block headings |
| `h5` | 18px | 600 / 1.4 | Minor headings |
| `h6` | 16px | 600 / 1.4 | Eyebrow titles |
| `body-lg` | 18px | 400 / 1.7 | Lead paragraphs |
| `body-base` | 16px | 400 / 1.65 | Primary body |
| `body-sm` | 14px | 400 / 1.6 | Secondary copy |
| `caption` | 13px | 400 / 1.5 | Fine print |
| `label` | 12px | 600 / 0.04em | Chips, badges, form labels |

`globals.css` base layer applies these defaults to bare `h1`–`h6`/`p` (with `text-wrap: balance` on headings, `pretty` on paragraphs), so semantic HTML is styled without utility soup. The fluid steps are also exposed as `--text-display`, `--text-h1`, `--text-h2`, `--text-h3`.

### 1c. Spacing — 8pt grid

`space.2` (8px) is the grid base; 4px sub-steps (`space.1`, `space.0.5`, `space.px`) remain for fine control. Tokens `space.0`…`space.32`.

| Usage | Token |
|-------|-------|
| Component inner padding | `space.2` – `space.4` |
| Card body padding | `space.4` – `space.6` |
| Nav / footer gutters | `space.6` – `space.8` |
| Section vertical rhythm | `space.12` – `space.16` |
| Hero padding | `space.16` – `space.20` |

### 1d. Radius (modernized — rounder)

| Token | Size | Use |
|-------|------|-----|
| `radius.sm` | 6px | Small inputs, tight UI, focus-ring corner |
| `radius.md` | 8px | Buttons, form fields |
| `radius.lg` | 12px | Cards, dropdowns |
| `radius.xl` | 16px | Panels, large surfaces |
| `radius.2xl` | 24px | Feature callouts, modals |
| `radius.full` | 9999px | Badges, avatars, pills |

### 1e. Elevation, Motion, Breakpoints, Layout

| Group | Tokens |
|-------|--------|
| Shadow (soft, layered) | `shadow.xs`, `shadow.sm`, `shadow.md`, `shadow.lg`, `shadow.xl`, `shadow.focus` |
| Transition | `transition.{fast,base,slow}` (120 / 220 / 360ms) |
| Easings | `--ease-{default,standard,entrance,exit,emphasis}` |
| Breakpoint | `bp.sm` 640 · `bp.md` 768 · `bp.lg` 1024 · `bp.xl` 1280 · `bp.2xl` 1536 |
| Container max-width | `container.{prose,sm,md,lg,xl,2xl}` (`--container-*`) |
| Z-index | `zIndex.{base,raised,dropdown,sticky,overlay,modal,popover,toast,tooltip}` |

Motion rule: all transitions/animations are disabled under `prefers-reduced-motion: reduce` (enforced globally in the `globals.css` base layer).

Accessible interaction baseline (global, from `globals.css`):
- `:focus-visible` → 2px solid `ring` outline, 2px offset.
- `::selection` → brand-orange tint.
- `scroll-behavior: smooth` (auto under reduced-motion).

---

## 1f. Recipes (`src/shared/design/recipes.ts`)

CVA / string-map recipes compose tokens into reusable variant class strings. Primitives and widgets import these instead of hand-rolling variant maps. Output is always a Tailwind utility string (tree-shakeable, RSC-friendly, no runtime CSS-in-JS).

| Recipe | Variants | Purpose |
|--------|----------|---------|
| `surface` | `variant`: raised \| flat \| featured \| muted · `interactive`: bool | Cards / surfaces |
| `panel` | `padding`: none \| sm \| md \| lg · `tone`: default \| muted \| raised | Padded containers |
| `section` | `width`: prose \| sm \| md \| lg \| xl \| full · `rhythm`: none \| sm \| md \| lg | Centered max-width section wrapper |
| `buttonBase` | `variant`: primary \| secondary \| accent \| outline \| ghost \| link \| danger · `size`: sm \| md \| lg \| icon | Buttons |
| `inputBase` | `state`: default \| error \| success · `size`: sm \| md \| lg | Form controls |
| `badge` | `variant`: primary \| secondary \| accent \| success \| warning \| error \| info \| outline \| solid | Badges / tags |
| `link` | `variant`: inline \| nav \| quiet \| footer | Links |

Usage:

```ts
import { buttonBase } from '@/shared/design/recipes'
import { cn } from '@/shared/lib/utils'

<button className={cn(buttonBase({ variant: 'primary', size: 'lg' }), className)} />
```

`VariantProps<typeof buttonBase>` etc. are exported for typing component props.

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
