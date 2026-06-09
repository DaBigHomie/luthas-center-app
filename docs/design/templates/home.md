# Home Template — Layout Spec

**Route:** `/`
**Template ID:** `home`
**Last updated:** 2026-06-08
**Tagline:** "Impossible to Inevitable"
**Tone:** Empowering, calm, accessible, trustworthy.

---

## 1. Purpose

The Home route is the primary discovery surface for first-time visitors and returning learners. It establishes brand credibility, surfaces the most relevant courses, connects visitors to the mission + giving experience, and offers a low-friction newsletter entry point. Every section maps to a real Supabase data source or a static brand constant.

---

## 2. Responsive Layout — ASCII Wireframes

### 2a. Mobile (< 768 px)

```
┌─────────────────────────────────┐
│           SITE HEADER           │
│   [Logo]  [Nav toggle ☰]        │
├─────────────────────────────────┤
│                                 │
│         HERO SECTION            │
│   ┌─────────────────────────┐   │
│   │  [Full-bleed bg image]  │   │
│   │                         │   │
│   │  "Impossible to         │   │
│   │   Inevitable"           │   │
│   │  [Subhead / excerpt]    │   │
│   │  [Enroll Now] [Explore] │   │
│   └─────────────────────────┘   │
├─────────────────────────────────┤
│                                 │
│      FEATURED COURSES           │
│   [Section heading]             │
│   ┌───────────────────────┐     │
│   │ [Cover image]         │     │
│   │ Title                 │     │
│   │ Excerpt (2 lines)     │     │
│   │ [Free] / [Paid badge] │     │
│   │ [View Course →]       │     │
│   └───────────────────────┘     │
│   ┌───────────────────────┐     │
│   │ (repeat × 3 total)    │     │
│   └───────────────────────┘     │
│   [View all courses →]          │
├─────────────────────────────────┤
│                                 │
│      MISSION + DONATE CTA       │
│   ┌───────────────────────┐     │
│   │ Mission statement     │     │
│   │ Goal: $50,000         │     │
│   │ [Progress bar]        │     │
│   │ [$10] [$25] [$50]     │     │
│   │ [$100] [Custom]       │     │
│   │ [Donate Now]          │     │
│   └───────────────────────┘     │
├─────────────────────────────────┤
│                                 │
│      RECENT POSTS               │
│   [Section heading]             │
│   ┌───────────────────────┐     │
│   │ [Thumb] Title         │     │
│   │ Category · Date       │     │
│   └───────────────────────┘     │
│   ┌───────────────────────┐     │
│   │ (repeat × 3 total)    │     │
│   └───────────────────────┘     │
│   [Read the blog →]             │
├─────────────────────────────────┤
│                                 │
│      NEWSLETTER SIGNUP          │
│   [Heading]                     │
│   [Email input]                 │
│   [Subscribe]                   │
├─────────────────────────────────┤
│           SITE FOOTER           │
└─────────────────────────────────┘
```

### 2b. Desktop (>= 1024 px)

```
┌──────────────────────────────────────────────────────────────────────┐
│                           SITE HEADER                                │
│   [Logo]          [Courses] [Blog] [About] [Give]    [Sign In]       │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│                         HERO SECTION                                 │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  [Full-viewport-width background image / video overlay]        │  │
│  │                                                                │  │
│  │    "Impossible to Inevitable"                                  │  │
│  │    [Site subheadline — About page excerpt, max 2 sentences]    │  │
│  │    [Enroll Now]   [Explore Courses]                            │  │
│  └────────────────────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│                       FEATURED COURSES                               │
│  [Section heading]                                  [View all →]     │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                     │
│  │[Cover img] │  │[Cover img] │  │[Cover img] │                     │
│  │ Title      │  │ Title      │  │ Title      │                     │
│  │ Excerpt…   │  │ Excerpt…   │  │ Excerpt…   │                     │
│  │ [Free]     │  │ [Free]     │  │ [Free]     │                     │
│  │ [View →]   │  │ [View →]   │  │ [View →]   │                     │
│  └────────────┘  └────────────┘  └────────────┘                     │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│                     MISSION + DONATE CTA                             │
│  ┌───────────────────────────┐  ┌──────────────────────────────┐    │
│  │  [Mission statement text] │  │  "Fund education initiatives" │    │
│  │  [About page commitments  │  │  Goal: $50,000               │    │
│  │   — 2-3 bullet summary]   │  │  [Progress bar]              │    │
│  │  [Learn about our work →] │  │  [$10] [$25] [$50] [$100]    │    │
│  │                           │  │  [Custom amount input]       │    │
│  │                           │  │  [Donate Now]                │    │
│  └───────────────────────────┘  └──────────────────────────────┘    │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│                         RECENT POSTS                                 │
│  [Section heading]                                [Read the blog →]  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐     │
│  │  [Thumb image]  │  │  [Thumb image]  │  │  [Thumb image]  │     │
│  │  Category       │  │  Category       │  │  Category       │     │
│  │  Post title     │  │  Post title     │  │  Post title     │     │
│  │  Date           │  │  Date           │  │  Date           │     │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘     │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│                        NEWSLETTER SIGNUP                             │
│         "Stay in the loop — resources, stories, and more"           │
│                  [Email address input]  [Subscribe]                  │
├──────────────────────────────────────────────────────────────────────┤
│                           SITE FOOTER                                │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 3. Section-by-Section Table

| Section | Component | Content source field | Behavior |
|---|---|---|---|
| **Site Header** | `<Header>` | Static nav links + `profiles` (auth state) | Sticky. Collapses to hamburger below 768 px. "Sign In" becomes avatar dropdown when authenticated. |
| **Hero** | `<HeroSection>` | Static brand constant: tagline "Impossible to Inevitable"; `pages.excerpt` (About, wp_id 17603) for subheadline | Full-bleed background uses `media` table image resolved from `cover_image_id` on a featured course or a designated hero media record. Buttons: primary "Enroll Now" → `/courses`; ghost "Explore Courses" → `/courses`. Fades in on mount. |
| **Featured Courses — Heading** | `<SectionHeading>` | Static copy: "Featured Courses" | Paired with `<TextLink>` "View all courses →" → `/courses` |
| **Featured Courses — Card × 3** | `<CourseCard>` | `courses.title`, `courses.excerpt` (trimmed to ~160 chars), `courses.cover_image_id` → resolved via `media.url`, `courses.price_type` | Horizontal scroll on mobile; 3-col grid ≥ 1024 px. `price_type = "open"` renders `<Badge>Free</Badge>`. Cards link to `/courses/[slug]`. Images lazy-loaded. |
| **Mission — Text panel** | `<MissionPanel>` | `pages.excerpt` (About, wp_id 17603); static commitments summary (3 bullets) | Static/CMS-driven. "Learn about our work →" links to `/about`. |
| **Mission — Donate CTA panel** | `<DonatePanel>` | `donation_forms.title` ("Fund education initiatives", wp_id 17317), `donation_forms.goal_amount` (50000), `donation_forms.donation_levels[].amount`, `donation_stats.total_donated` (for progress) | Goal progress bar: `(total_donated / goal_amount) * 100` clamped 0–100. Donation level buttons are toggles; custom amount input shown when "Custom" is selected. "Donate Now" → `/give/fund-education-initiatives`. |
| **Recent Posts — Heading** | `<SectionHeading>` | Static copy: "From the Blog" | Paired with "Read the blog →" → `/blog` |
| **Recent Posts — Card × 3** | `<PostCard>` | `posts.title`, `posts.date`, `posts.featured_image_id` → `media.url`, `terms.name` (category via `term_relationships`) | Sorted by `posts.date DESC`, limit 3. Category pill above title. Links to `/blog/[slug]`. Thumbnail aspect-ratio 16:9. |
| **Newsletter Signup** | `<NewsletterSection>` | Static heading copy; email collected client-side (no Supabase table in schema — submit to external ESP or edge function) | Inline validation on email format. Success state replaces form with confirmation message. Background uses `color.accent` surface variant. |
| **Site Footer** | `<Footer>` | Static nav groups + social links | Links: Courses, Blog, About, Give, Contact. |

---

## 4. Primitives Used

| Primitive | Usage in this template |
|---|---|
| `<Button variant="primary">` | Hero "Enroll Now"; Donate "Donate Now"; Newsletter "Subscribe" |
| `<Button variant="ghost">` | Hero "Explore Courses" |
| `<TextLink>` | "View all courses →", "Read the blog →", "Learn about our work →" |
| `<SectionHeading>` | "Featured Courses", "From the Blog" section labels |
| `<CourseCard>` | Featured courses grid; contains `<CourseCardImage>`, `<Badge>`, heading, excerpt, CTA link |
| `<PostCard>` | Recent posts grid; contains thumbnail, category pill, title, date |
| `<Badge>` | Free / Paid label on CourseCard |
| `<ProgressBar>` | Donation goal progress inside DonatePanel |
| `<DonationLevelButton>` | Selectable amount tiles ($10, $25, $50, $100, Custom) |
| `<Input type="text">` | Custom donation amount; newsletter email |
| `<MissionPanel>` | Full-width split panel (text + donate form) |
| `<HeroSection>` | Full-bleed hero with background image layer + overlay |
| `<NewsletterSection>` | Centered band; contains heading, `<Input>`, `<Button>` |
| `<Header>` | Sticky top nav |
| `<Footer>` | Bottom nav + social |

**Token references (no raw hex):**

| Token | Applied to |
|---|---|
| `color.primary` | Primary buttons, links, progress bar fill |
| `color.surface` | Card backgrounds, newsletter band |
| `color.accent` | Newsletter section background variant, donation level selected state |
| `color.background` | Page base |
| `color.text.primary` | Body copy |
| `color.text.secondary` | Post card meta (date, category) |
| `color.text.inverse` | Hero headline over dark overlay |
| `color.border` | Card borders, input borders |
| `font.heading` | Section headings, hero tagline, card titles |
| `font.body` | Excerpt copy, form labels, nav links |
| `radius.md` | Cards, buttons, inputs |
| `radius.lg` | Donate panel, newsletter band |
| `space.4` | Baseline grid unit throughout |
| `space.8` | Section vertical padding |
| `space.16` | Hero top/bottom padding |

---

## 5. Data Requirements

### 5a. Featured Courses

**Table:** `courses`
**Query:** `SELECT id, title, excerpt, cover_image_id, price_type, slug FROM courses WHERE status = 'publish' ORDER BY created_at DESC LIMIT 3`

| Column | Use |
|---|---|
| `id` | Key, link to `/courses/[slug]` |
| `title` | Card heading |
| `excerpt` | Card body copy (strip HTML, truncate 160 chars) |
| `cover_image_id` | FK → `media.id`; resolve `media.url` for `<img src>` |
| `price_type` | `"open"` → "Free" badge; other values → suppress or show price |
| `slug` | Route param for card link |

**Joined table:** `media` — columns `id`, `url`, `alt_text`

---

### 5b. Donation / Mission Panel

**Table:** `donation_forms`
**Query:** `SELECT id, title, goal_amount, goal_enabled, donation_levels, slug FROM donation_forms WHERE id = '<fund-education-initiatives-id>'`

| Column | Use |
|---|---|
| `title` | Panel heading ("Fund education initiatives") |
| `goal_amount` | Denominator for progress bar (50000) |
| `goal_enabled` | Show/hide progress bar |
| `donation_levels` | JSONB array — each `amount` renders a `<DonationLevelButton>` |

**Table:** `donation_stats`
**Query:** `SELECT form_id, total_donated FROM donation_stats WHERE form_id = '<id>'`

| Column | Use |
|---|---|
| `total_donated` | Numerator for progress bar |

---

### 5c. Recent Posts

**Table:** `posts`
**Query:** `SELECT id, title, slug, date, featured_image_id FROM posts WHERE status = 'publish' ORDER BY date DESC LIMIT 3`

| Column | Use |
|---|---|
| `title` | Card heading |
| `slug` | Route param for card link → `/blog/[slug]` |
| `date` | Formatted display date |
| `featured_image_id` | FK → `media.id`; resolve `media.url` for thumbnail |

**Table:** `term_relationships` + `terms`
**Query (join):** `SELECT t.name, t.taxonomy FROM term_relationships tr JOIN terms t ON tr.term_id = t.id WHERE tr.post_id = posts.id AND t.taxonomy = 'category' LIMIT 1`

| Column | Use |
|---|---|
| `terms.name` | Category pill label on PostCard |

---

### 5d. Hero Background Image

**Table:** `media`
**Query:** `SELECT url, alt_text FROM media WHERE id = <designated-hero-media-id>`

Hero media ID is a site-level config constant stored in `seo_meta` or a hard-coded seed value until a CMS setting is added.

---

### 5e. About Excerpt (Mission Panel)

**Table:** `pages`
**Query:** `SELECT excerpt FROM pages WHERE slug = 'about' LIMIT 1`

| Column | Use |
|---|---|
| `excerpt` | Mission panel subheading ("At the Luthas Center for Excellence…") |

---

## 6. Accessibility Notes

| Concern | Requirement |
|---|---|
| **Landmarks** | `<header role="banner">`, `<main>`, `<footer role="contentinfo">`. Each major section wrapped in `<section aria-labelledby="[section-heading-id]">`. Newsletter section uses `<section aria-label="Newsletter signup">`. |
| **Heading order** | `<h1>` — hero tagline "Impossible to Inevitable". `<h2>` — each section heading (Featured Courses, From the Blog, etc.). `<h3>` — individual card titles within sections. No heading levels skipped. |
| **Focus management** | Tab order: Header nav → Hero buttons → Course cards → Mission panel → Donation level buttons → Donate button → Post cards → Newsletter input → Subscribe → Footer. Skip-to-content link at top of `<body>` targets `<main>`. |
| **Images** | `cover_image_id` images include `media.alt_text`; hero background image treated as decorative (`aria-hidden="true"`, CSS background or `<img role="presentation" alt="">`). |
| **Keyboard — Donation levels** | Donation level buttons implement `role="radio"` + `aria-checked` in a `role="radiogroup"` with label "Select donation amount". Arrow keys cycle options. |
| **Progress bar** | `<div role="progressbar" aria-valuenow="{pct}" aria-valuemin="0" aria-valuemax="100" aria-label="Fundraising progress toward $50,000 goal">`. |
| **Color contrast** | All text on `color.surface` and `color.accent` backgrounds must meet WCAG AA (4.5:1 for body, 3:1 for large text). Hero overlay must darken background sufficiently for `color.text.inverse`. |
| **Motion** | Hero fade-in and any parallax effects respect `prefers-reduced-motion: reduce` — disable animations entirely. |
| **Form — Newsletter** | `<label for="newsletter-email">Email address</label>` explicitly associated. Error message uses `aria-live="polite"` region. Success confirmation receives focus after submission. |
| **Links** | All "View →" / "Read →" links include visually hidden context: e.g. `View course <span class="sr-only">: Agile Foundations</span>`. |

---

## 7. Stitch Prompt

```
Design the Home page for "luthas-center.damieus.app" — a nonprofit LMS and mental-health-resources platform.
Tagline: "Impossible to Inevitable". Tone: empowering, calm, accessible, trustworthy.

Brand tokens to apply:
- color.primary (primary buttons, links, progress fill)
- color.surface (card and page backgrounds)
- color.accent (newsletter band background, selected donation level)
- color.background (base page)
- color.text.primary / color.text.secondary / color.text.inverse
- color.border (card and input borders)
- font.heading (headings and card titles)
- font.body (body copy, labels, meta)
- radius.md (buttons, cards, inputs)
- radius.lg (hero overlay pill, donate panel)
- space.4 as base grid unit; space.8 for section padding; space.16 for hero padding

Sections from top to bottom:

1. STICKY HEADER — Logo left, nav links center (Courses, Blog, About, Give), Sign In button right. Collapses to hamburger on mobile.

2. HERO — Full-viewport-width background image with dark overlay. Large h1 "Impossible to Inevitable" in font.heading, color.text.inverse. Two-line subheadline below in font.body. Two buttons: primary "Enroll Now" and ghost "Explore Courses". Center-aligned text on mobile, left-aligned on desktop.

3. FEATURED COURSES — Section h2 "Featured Courses" with "View all courses →" link right-aligned. 3-column card grid on desktop, single-column scroll on mobile. Each card: cover image (16:9, radius.md), h3 title, 2-line excerpt, "Free" badge (color.accent), "View Course →" text link.

4. MISSION + DONATE — Full-width 2-column section on desktop (stacked on mobile). Left panel: "Our Mission" h2, About page excerpt, 3 commitment bullets, "Learn about our work →" link. Right panel: donation form card — "Fund education initiatives" h3, goal amount "$50,000", progress bar (color.primary fill), donation level buttons ($10 $25 $50 $100 Custom) as radio tiles in color.surface with color.primary selected state, "Donate Now" primary button.

5. RECENT POSTS — Section h2 "From the Blog" with "Read the blog →" link. 3-column card grid on desktop, single-column on mobile. Each card: 16:9 thumbnail, category pill (color.accent, radius.md), h3 title, formatted date.

6. NEWSLETTER SIGNUP — Full-width centered band with color.accent background, radius.lg. h2 "Stay in the loop", subtext "Resources, stories, and more — delivered to your inbox." Inline email input + "Subscribe" primary button. Success state: confirmation message replaces form.

7. FOOTER — Dark surface. 4-column link groups (Courses, Blog, About, Give) + social icons row. Copyright line.

Constraints:
- No raw hex values — token names only.
- WCAG AA color contrast on all text.
- Respect prefers-reduced-motion: no animations when set.
- Skip-to-content link at top targeting main.
- All card CTAs include visually hidden context for screen readers.
```
