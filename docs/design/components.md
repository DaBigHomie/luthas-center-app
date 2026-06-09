# Component Library — Luthas Center Design System

**Platform:** luthas-center.damieus.app  
**Tagline:** Impossible to Inevitable  
**Last updated:** 2026-06-08  
**Token source:** WordPress `jnews` theme → `src/shared/design/tokens.ts`

Design tokens referenced throughout use semantic names only. Never substitute raw hex values.

---

## Token Reference Shorthand

| Token group | Examples |
|-------------|---------|
| Color | `color.primary`, `color.primary-hover`, `color.secondary`, `color.accent`, `color.surface`, `color.surface-raised`, `color.surface-overlay`, `color.text`, `color.text-muted`, `color.text-inverse`, `color.border`, `color.border-focus`, `color.error`, `color.success`, `color.warning`, `color.info` |
| Typography | `font.heading`, `font.body`, `font.mono`, `font.size.xs`, `font.size.sm`, `font.size.base`, `font.size.lg`, `font.size.xl`, `font.size.2xl`, `font.size.3xl`, `font.size.4xl`, `font.weight.normal`, `font.weight.medium`, `font.weight.semibold`, `font.weight.bold`, `font.leading.tight`, `font.leading.normal`, `font.leading.relaxed` |
| Spacing | `space.1` through `space.16` (4px increments), `space.20`, `space.24` |
| Radius | `radius.sm`, `radius.md`, `radius.lg`, `radius.xl`, `radius.full` |
| Shadow | `shadow.sm`, `shadow.md`, `shadow.lg`, `shadow.focus` |
| Transition | `transition.fast`, `transition.base`, `transition.slow` |
| Breakpoint | `bp.sm` (640px), `bp.md` (768px), `bp.lg` (1024px), `bp.xl` (1280px) |

---

## 1. Button

### Purpose

Primary interactive trigger for all key actions: course enrollment, donation, navigation CTA, form submit, and secondary link-style actions.

### Anatomy

```
[ leading-icon? ][ label ][ trailing-icon? ]
```

- **Root:** `<button>` or `<a>` with `role="button"` when rendered as link
- **Icon slot (optional):** 20px SVG, `aria-hidden="true"`
- **Label:** inline text node, never truncated

### Variants

| Variant | Background | Text | Border | Use |
|---------|-----------|------|--------|-----|
| `primary` | `color.primary` | `color.text-inverse` | none | Main CTA ("Enroll Now", "Donate") |
| `secondary` | `color.surface-raised` | `color.text` | `1px color.border` | Secondary actions ("Browse Courses") |
| `ghost` | transparent | `color.primary` | `1px color.primary` | Low-emphasis actions inside cards |
| `link` | transparent | `color.primary` | none | Inline prose links, breadcrumb actions |
| `danger` | `color.error` | `color.text-inverse` | none | Destructive confirmations |

### Sizes

| Size | Padding | Font size | Min height |
|------|---------|-----------|-----------|
| `sm` | `space.2 space.3` | `font.size.sm` | 32px |
| `md` (default) | `space.3 space.5` | `font.size.base` | 40px |
| `lg` | `space.4 space.6` | `font.size.lg` | 48px |

### States

- **Default:** as table above
- **Hover:** `primary` → `color.primary-hover`; `secondary/ghost` → `color.surface-overlay`
- **Focus-visible:** `outline: 2px solid color.border-focus; outline-offset: 2px`
- **Active:** 2px inset translate effect via `transform: translateY(1px)`
- **Disabled:** `opacity: 0.45`, `cursor: not-allowed`, `aria-disabled="true"`
- **Loading:** label replaced by spinner (24px), `aria-busy="true"`, width locked

### Token references

`color.primary`, `color.primary-hover`, `color.text-inverse`, `color.border-focus`, `shadow.focus`, `radius.md`, `transition.fast`, `font.weight.semibold`

### Accessibility

- All variants meet WCAG 2.1 AA contrast (4.5:1 for text, 3:1 for UI)
- Loading state announces via `aria-live="polite"` sibling
- Icon-only buttons carry `aria-label`
- `<a>` variant with `role="button"` also responds to `Space` keydown

### Stitch prompt

```
Generate a Button component set for a nonprofit education platform called "Luthas Center" (tagline: Impossible to Inevitable).
Variants: primary (filled, brand primary color), secondary (outlined, neutral), ghost (outlined, brand accent), link (text only), danger (filled, error color).
Sizes: sm (32px height), md (40px, default), lg (48px).
States for each: default, hover (slightly darker/lighter), focus (visible 2px ring offset 2), active (slight press), disabled (45% opacity), loading (spinner replaces label, width locked).
Style: rounded corners (medium radius), semibold labels, optional leading/trailing icon slots.
Tone: empowering, calm, accessible. No raw hex — use brand token color names.
Output a Figma-ready component with auto-layout, all states as variants.
```

---

## 2. Card

### Purpose

Flexible surface container used across courses, posts, products, and informational blocks. All card variants share the same structural shell.

### Anatomy

```
┌─────────────────────────────┐
│  [media slot — optional]    │
├─────────────────────────────┤
│  [badge/tag row — optional] │
│  [heading]                  │
│  [body / excerpt]           │
│  [meta row]                 │
│  [action row — optional]    │
└─────────────────────────────┘
```

- **Root:** `<article>` (semantic) or `<div role="region">` when not stand-alone content
- **Media slot:** 16:9 `<figure>` with `<img>` + `alt`; lazy-loaded
- **Body:** padding `space.4` on all sides

### Variants

| Variant | Media | Elevation | Use |
|---------|-------|-----------|-----|
| `default` | optional | `shadow.md` | General content |
| `flat` | optional | none, `border: 1px color.border` | Sidebar / list contexts |
| `featured` | required (large) | `shadow.lg` | Hero-adjacent featured post |
| `horizontal` | left-side thumbnail | `shadow.sm` | Mobile course list, search results |
| `overlay` | full-bleed bg + text overlay | `shadow.lg` | Hero cards, editorial |

### States

- **Hover:** `transform: translateY(-2px)`, shadow upgrades one level
- **Focus-within:** `outline: 2px solid color.border-focus` on root
- **Selected:** `border: 2px solid color.primary`

### Token references

`color.surface`, `color.surface-raised`, `color.text`, `color.text-muted`, `color.border`, `shadow.sm`, `shadow.md`, `shadow.lg`, `radius.lg`, `space.4`, `transition.base`

### Accessibility

- Root `<article>` wrapped in `<ul>` when in a grid — list semantics preserved
- Media `<img>` alt filled from CMS `seo_alt` or `title`; decorative images get `alt=""`
- Card heading is `<h2>`–`<h3>` depending on page hierarchy; never skip levels
- Interactive card (entire surface clickable): pseudo-element stretch technique to keep one focusable element; `aria-label` on root link = card title

### Stitch prompt

```
Generate a Card component set for Luthas Center (nonprofit LMS + mental health platform).
Variants: default (optional media top, shadow), flat (border only, no shadow), featured (large media, prominent), horizontal (thumbnail left), overlay (full-bleed image with text on top with dark gradient scrim).
States: default, hover (lift + deeper shadow), focus-within (focus ring), selected (primary border).
Media slot: 16:9 aspect ratio, lazy image, fallback gradient placeholder using brand accent color.
Body: badge row, heading (semibold), body text (muted), meta row (icon + label), optional action row with ghost button.
Rounded corners (large radius). Surfaces use brand surface token, not white. Tone: trustworthy, accessible.
```

---

## 3. NavBar + Mobile Drawer

### Purpose

Primary global navigation: site branding, main links, auth state, and search trigger. Adapts to a slide-in drawer on mobile.

### Anatomy — Desktop

```
┌──────────────────────────────────────────────────────────────┐
│ [Logo + wordmark]   [Nav links]          [Search] [CTA] [User]│
└──────────────────────────────────────────────────────────────┘
```

### Anatomy — Mobile Drawer

```
┌─────────────────────┐   ┌────────────────────┐
│ [Logo] [☰ Menu btn] │   │ [× Close]  [Logo]  │
└─────────────────────┘   ├────────────────────┤
                           │ [Nav item]         │
                           │ [Nav item]         │
                           │ [Nav item]         │
                           │  ↳ [Sub-item]      │
                           ├────────────────────┤
                           │ [CTA Button]       │
                           │ [Auth state]       │
                           └────────────────────┘
```

### Responsive layout

| Breakpoint | Behavior |
|------------|---------|
| < `bp.lg` | Logo + hamburger only; full drawer on open |
| >= `bp.lg` | Full horizontal nav; drawer not rendered |

### Nav link states

- **Default:** `color.text`, `font.weight.medium`
- **Hover:** `color.primary`, underline slide-in with `transition.fast`
- **Active / current page:** `color.primary`, `font.weight.semibold`, border-bottom `2px color.primary`
- **Focus-visible:** `color.border-focus` outline

### Sub-navigation (Mega menu / dropdown)

Courses, Programs, and Resources links open a dropdown panel at `bp.lg+`:

- Root `<nav>` with `aria-label="Main navigation"`
- Dropdown: `role="menu"`, children `role="menuitem"`
- Opened by `Enter`, `Space`, or `ArrowDown`; closed by `Escape`

### Drawer details

- `role="dialog"`, `aria-modal="true"`, `aria-label="Navigation menu"`
- Focus trap inside drawer when open
- Backdrop: `color.surface-overlay` at 60% opacity
- Slide in from left with `transition.base`
- Close on Escape or backdrop click

### Token references

`color.surface`, `color.surface-raised`, `color.text`, `color.text-muted`, `color.primary`, `color.border`, `color.border-focus`, `shadow.md`, `space.4`, `space.6`, `font.weight.medium`, `font.weight.semibold`, `font.size.base`, `transition.fast`, `transition.base`

### Accessibility

- `<nav aria-label="Main navigation">` wrapping entire bar
- Skip-to-content link as first focusable element on page
- Current page link carries `aria-current="page"`
- Hamburger button: `aria-expanded`, `aria-controls="nav-drawer"`, `aria-label="Open navigation menu"`
- All dropdown/drawer keyboard patterns follow ARIA Authoring Practices Guide (APG)

### Stitch prompt

```
Generate a NavBar component for Luthas Center (nonprofit LMS + mental health).
Desktop (1024px+): horizontal bar — logo/wordmark left, nav links center-right (Courses, Programs, Resources, Blog, About), search icon, primary CTA button ("Donate"), user avatar/login right.
Mobile (<1024px): logo left, hamburger right; tapping hamburger opens a full-height slide-in drawer from the left with stacked nav links, CTA, and auth state. Backdrop overlay on open.
States: default link, hover (brand primary underline), active/current (primary color + bottom border), focus (2px focus ring).
Background: brand surface token. Shadow on scroll (shadow.md). Transition: smooth open/close.
Include responsive breakpoint variants in one component. Tone: trustworthy, calm.
```

---

## 4. Footer

### Purpose

Site-wide persistent footer with navigation groups, mission statement, social links, legal, and donation CTA.

### Anatomy

```
Desktop:
┌─────────────────────────────────────────────────────────────┐
│  [Logo + tagline + mission blurb]  [Nav col 1] [Nav col 2]  │
│                                    [Nav col 3] [Social row] │
├─────────────────────────────────────────────────────────────┤
│  [Copyright]          [Legal links]         [Back-to-top]   │
└─────────────────────────────────────────────────────────────┘

Mobile:
┌─────────────────┐
│ [Logo + tagline]│
│ [Nav col (acc.)]│
│ [Social row]    │
│ [Donate CTA]    │
│ [Copyright]     │
│ [Legal links]   │
└─────────────────┘
```

### Column groups (from pages.json nav / site structure)

| Column | Links |
|--------|-------|
| Learn | Courses, Programs, Certifications |
| Support | Mental Health, Homelessness Resources, Financial Empowerment |
| Community | Blog, Events, Donate |
| Organization | About, Contact, Careers |

### Token references

`color.surface-raised`, `color.text`, `color.text-muted`, `color.text-inverse`, `color.primary`, `color.border`, `space.6`, `space.8`, `space.12`, `font.size.sm`, `font.size.base`, `font.weight.semibold`

### Accessibility

- `<footer role="contentinfo">` landmark
- Column headings as `<h3>` inside `<nav aria-label="[Column name]">`
- Social links have `aria-label` with platform name
- Back-to-top triggers `focus()` on `<main>` first focusable element
- Mobile accordion columns: `aria-expanded`, `aria-controls` per APG pattern

### Stitch prompt

```
Generate a Footer component for Luthas Center (nonprofit LMS + mental health, tagline: Impossible to Inevitable).
Desktop: 4-column layout — col 1: logo, tagline, short mission blurb, social icons; cols 2-4: nav link groups (Learn, Support, Community). Bottom bar: copyright, legal links, back-to-top.
Mobile: stacked, nav columns collapse to accordion. Donate CTA button above copyright.
Background: slightly elevated brand surface token (not pure black). Text: muted for links, inverse for headings.
Social icons: circular ghost buttons, 40px. Tone: empowering, trustworthy, calm.
```

---

## 5. Hero

### Purpose

Full-width page header section appearing at the top of Home, Courses index, Programs, and landing pages. Conveys mission and drives primary CTA.

### Anatomy

```
Desktop:
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  [Eyebrow / tag]                  [Background media/image]  │
│  [H1 — large headline]                                      │
│  [Subheading / mission copy]                                │
│  [Primary CTA btn]  [Secondary CTA btn]                     │
│  [Social proof / stat strip — optional]                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Mobile:
┌──────────────────┐
│ [bg image/media] │
│ [Eyebrow]        │
│ [H1]             │
│ [Subheading]     │
│ [Primary CTA]    │
│ [Stat strip]     │
└──────────────────┘
```

### Variants

| Variant | Background | Use |
|---------|-----------|-----|
| `image` | Full-bleed hero image with dark gradient scrim | Home |
| `split` | Text left, image right | Course category pages |
| `centered` | Centered text, solid `color.primary` gradient | Campaign / donation pages |
| `minimal` | White/surface bg, no image | Internal pages (About, Blog) |

### Content source

- `pages.excerpt` (mission blurb), `pages.title`, `featured_image_id` → `media` table
- Home hero copy lives in CMS pages record `slug: home` or configurable in `seo_meta`

### Token references

`color.primary`, `color.text-inverse`, `color.accent`, `font.heading`, `font.size.4xl`, `font.size.3xl`, `font.weight.bold`, `font.leading.tight`, `space.12`, `space.16`, `shadow.lg`, `radius.none`

### Accessibility

- Background image carries `role="img"` with `aria-label` describing scene
- `<section aria-labelledby="hero-heading">`
- H1 must be present and unique per page
- Gradient scrim ensures text contrast ratio >= 4.5:1 over image
- Autoplay video (if used): muted, `prefers-reduced-motion` disables it

### Stitch prompt

```
Generate a Hero component for Luthas Center (nonprofit LMS + mental health platform, tagline: Impossible to Inevitable).
Variants: image (full-bleed photo + dark gradient scrim, text bottom-left), split (text left, image right, 50/50), centered (brand primary gradient bg, centered text), minimal (light surface bg, no image).
Content: eyebrow label (small caps, accent color), H1 (bold, large, inverse on dark bg), subheading (relaxed line height, muted), primary + secondary CTA buttons, optional stat strip (3 numbers with labels).
Mobile: image stacks above text; single column layout.
Tone: empowering, inspiring, accessible. Surface uses brand color tokens only.
```

---

## 6. CourseCard

### Purpose

Specialized card for browsing and enrolling in courses. Surfaces key decision-making information: title, category, duration, access mode, and enrollment CTA. Extends the base Card component.

### Anatomy

```
┌──────────────────────────────┐
│  [cover image 16:9]          │
│  [price badge — top-right]   │
├──────────────────────────────┤
│  [category tag]              │
│  [title — h3]                │
│  [excerpt — 2 lines max]     │
│  ─────────────────────────── │
│  [step count] [access badge] │
│  [Enroll / Continue btn]     │
└──────────────────────────────┘
```

### States

| State | Indicator |
|-------|----------|
| Not enrolled | "Enroll Now" primary button |
| Enrolled / in progress | Progress bar (color.primary), "Continue" ghost button, percent label |
| Completed | Checkmark badge (color.success), "Review" link button |
| Locked / premium | Lock icon, disabled button, upgrade prompt badge |

### Content source fields

- `courses.title`, `courses.excerpt`, `courses.price_type`, `courses.price`, `courses.access_mode`
- `courses.step_counts.lessons`, `courses.categories[0].name`
- `media.url` via `courses.cover_image_id`
- Enrollment state from `enrollments.status`, `enrollments.progress_percent`

### Data requirements

| Table | Columns |
|-------|---------|
| `courses` | `id`, `title`, `slug`, `excerpt`, `price`, `price_type`, `access_mode`, `cover_image_id`, `step_counts` |
| `enrollments` | `course_id`, `user_id`, `status`, `progress_percent` |
| `media` | `id`, `url`, `alt` |
| `terms` | `name` (category) |

### Token references

`color.surface`, `color.primary`, `color.success`, `color.warning`, `color.text`, `color.text-muted`, `color.border`, `shadow.md`, `radius.lg`, `space.4`, `font.size.sm`, `font.size.base`, `font.size.lg`, `font.weight.semibold`, `transition.base`

### Accessibility

- `<article>` root with `aria-label` = course title
- Progress bar: `role="progressbar"`, `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`, `aria-label="Course progress"`
- Enrollment state change announces via `aria-live="polite"`
- Price badge not decorative — included in accessible name or described via `aria-describedby`

### Stitch prompt

```
Generate a CourseCard component for Luthas Center LMS.
Layout: card with 16:9 cover image top, optional price badge (top-right corner, brand accent), then body: category tag (small, pill), course title (h3, semibold, 2-line clamp), excerpt (muted, 2-line clamp), divider, meta row (lesson count icon + number, access mode badge), CTA button.
States: not enrolled (primary "Enroll Now" button), in progress (linear progress bar + "Continue" ghost button + percent), completed (success checkmark badge + "Review" link), locked (lock icon + disabled button + upgrade prompt).
Hover: card lifts (translateY -2px), shadow deepens.
Use brand tokens only. Rounded corners (large radius). Grid-ready: 280px min width.
```

---

## 7. LessonListItem

### Purpose

Row-level item inside a course curriculum accordion. Shows lesson title, type, duration, and personal completion state at a glance.

### Anatomy

```
┌────────────────────────────────────────────────────┐
│ [completion icon] [title]          [duration] [type]│
└────────────────────────────────────────────────────┘
```

- **Completion icon:** unchecked circle / filled check (`color.success`) / lock icon
- **Title:** `font.size.base`, truncated to one line
- **Duration:** `font.size.sm`, `color.text-muted`
- **Type badge:** small pill — "Video", "Reading", "Quiz"

### States

| State | Icon | Text style | Background |
|-------|------|-----------|-----------|
| Not started | Empty circle | `color.text` | transparent |
| In progress | Partial ring (color.primary) | `color.text` | `color.surface-raised` subtle tint |
| Completed | Filled checkmark | `color.text-muted`, strikethrough optional | transparent |
| Locked | Lock icon (`color.text-muted`) | `color.text-muted` | transparent |
| Active (current) | Arrow right | `color.primary`, `font.weight.semibold` | `color.surface-raised` |

### Content source fields

- `lessons.title`, `lessons.type`, `lessons.duration_seconds`
- `course_steps.order`
- Completion from `enrollments` / user progress (future `lesson_completions` table)

### Data requirements

| Table | Columns |
|-------|---------|
| `lessons` | `id`, `title`, `type`, `duration_seconds`, `course_id` |
| `course_steps` | `course_id`, `lesson_id`, `order` |

### Token references

`color.text`, `color.text-muted`, `color.primary`, `color.success`, `color.surface-raised`, `color.border`, `space.3`, `space.4`, `font.size.sm`, `font.size.base`, `font.weight.semibold`, `radius.full`, `transition.fast`

### Accessibility

- `role="listitem"` inside `role="list"` (within accordion panel)
- Completion icon: `aria-label="Completed"` / `"Not started"` / `"Locked"` — not relying on color alone
- Active item: `aria-current="step"`
- Keyboard: `Enter` or `Space` navigates to lesson; no pointer events required

### Stitch prompt

```
Generate a LessonListItem component for Luthas Center LMS curriculum.
Layout: full-width row — leading completion icon (40px circle), lesson title (truncated 1 line, base font), trailing duration (small, muted) + type pill (Video / Reading / Quiz).
States: not-started (empty circle), in-progress (partial ring, brand primary), completed (filled check, success color), locked (lock icon, muted), active/current (arrow icon, primary text, elevated background).
Compact: 48–52px row height. Hover: subtle background tint. Use brand tokens only.
Design as a list row, not a card.
```

---

## 8. PostCard

### Purpose

Blog post entry card used in listing pages, editorial grids, and "Related Articles" sections. Surfaces headline, category, author, date, and excerpt.

### Anatomy

```
┌──────────────────────────────┐
│  [featured image 16:9]       │
├──────────────────────────────┤
│  [category tag]              │
│  [title — h3]                │
│  [excerpt — 3 lines max]     │
│  ─────────────────────────── │
│  [avatar] [author] [date]    │
│  [read time]                 │
└──────────────────────────────┘
```

### Variants

| Variant | Description |
|---------|-------------|
| `default` | Standard grid card (above anatomy) |
| `horizontal` | Thumbnail left (120px), content right; used in sidebar and mobile |
| `featured` | Full-bleed image with text overlay gradient scrim; used for lead story |
| `minimal` | No image; text-only list row |

### Content source fields

- `posts.title`, `posts.excerpt`, `posts.date`, `posts.slug`
- `posts.author_id` → `profiles.display_name`, `profiles.avatar_url`
- `posts.featured_image_id` → `media.url`, `media.alt`
- `terms.name` (category via `term_relationships`)

### Data requirements

| Table | Columns |
|-------|---------|
| `posts` | `id`, `title`, `slug`, `excerpt`, `date`, `author_id`, `featured_image_id` |
| `profiles` | `id`, `display_name`, `avatar_url` |
| `media` | `id`, `url`, `alt` |
| `term_relationships` | `post_id`, `term_id` |
| `terms` | `id`, `name`, `slug`, `taxonomy` |

### Token references

`color.surface`, `color.text`, `color.text-muted`, `color.primary`, `color.accent`, `color.border`, `shadow.sm`, `shadow.md`, `radius.lg`, `space.3`, `space.4`, `font.size.sm`, `font.size.base`, `font.size.lg`, `font.weight.semibold`, `font.leading.relaxed`

### Accessibility

- `<article>` element per post card
- Category tag and read time not relied upon solely by color
- Author avatar: `alt="[Author Name]"` or `alt=""` if display name adjacent
- Entire card link via stretched pseudo-element (one `<a>` per card = no nested interactive elements)

### Stitch prompt

```
Generate a PostCard component for Luthas Center blog (topics: mental health, education, business inspiration, relationships).
Variants: default (image top, category tag, title h3, excerpt 3-line clamp, author avatar+name+date row, read time), horizontal (thumbnail left 120px, content right), featured (full-bleed image, gradient overlay, text bottom), minimal (no image, text row).
Hover: lift effect. Category tag: small pill, accent color. Author avatar: 32px circle.
Layout: grid-ready, min 260px wide. Tone: calm, accessible, editorial. Brand tokens only.
```

---

## 9. Badge / Tag

### Purpose

Small inline label for categorization, status, access mode, pricing, and content type across cards, list items, and detail pages.

### Anatomy

```
[ icon? ] [ label text ]
```

- **Root:** `<span>` (non-interactive) or `<button>` (filterable tags)
- **Padding:** `space.1 space.2`
- **Font:** `font.size.xs`, `font.weight.medium`
- **Shape:** `radius.full` (pill)

### Variants

| Variant | Background | Text | Use |
|---------|-----------|------|-----|
| `primary` | `color.primary` @ 15% | `color.primary` | Category, main label |
| `secondary` | `color.surface-raised` | `color.text-muted` | Neutral metadata |
| `accent` | `color.accent` @ 15% | `color.accent` | Featured, highlight |
| `success` | `color.success` @ 15% | `color.success` | Completed, free |
| `warning` | `color.warning` @ 15% | `color.warning` | In progress, limited |
| `error` | `color.error` @ 15% | `color.error` | Expired, locked |
| `info` | `color.info` @ 15% | `color.info` | New, tip |
| `outline` | transparent | `color.text-muted` | `border: 1px color.border` |

### Token references

`color.primary`, `color.accent`, `color.success`, `color.warning`, `color.error`, `color.info`, `color.surface-raised`, `color.text-muted`, `color.border`, `radius.full`, `space.1`, `space.2`, `font.size.xs`, `font.weight.medium`

### Accessibility

- Not relying on color alone — icon or text label always present
- Interactive (filter) tag: `role="checkbox"`, `aria-checked`, keyboard toggle with `Space`
- Decorative tag used inside a card: `aria-hidden="true"` if title already conveys info

### Stitch prompt

```
Generate a Badge/Tag component set for Luthas Center.
Variants (semantic color pairs — tinted bg + matching text): primary, secondary (neutral), accent, success, warning, error, info, outline (border only).
Sizes: xs (for card metadata), sm (default).
Shape: full pill. Optional leading icon (16px). Optional close/remove button (for filter tags).
Interactive state: hover (slightly darker bg), selected/active (solid fill), focus ring.
Use brand semantic color tokens only. No raw hex.
```

---

## 10. FormField

### Purpose

Standardized wrapper for all form inputs: text, email, password, textarea, select, checkbox, and radio. Includes label, input, helper text, and error message slots.

### Anatomy

```
[label]              ← <label for="id">
[input / textarea]   ← focusable element
[helper text]        ← optional description
[error message]      ← shown on invalid state
```

### Input types covered

`text`, `email`, `password` (with show/hide toggle), `number`, `tel`, `url`, `textarea`, `select`, `checkbox`, `radio`, `file`

### States

| State | Border | Label | Helper/Error |
|-------|--------|-------|-------------|
| Default | `color.border` | `color.text` | `color.text-muted` |
| Focus | `color.border-focus`, `shadow.focus` | `color.primary` | `color.text-muted` |
| Valid | `color.success` | `color.text` | success icon + message |
| Error | `color.error` | `color.error` | error icon + message |
| Disabled | `color.border` @ 50% | `color.text-muted` | — |
| Read-only | `color.surface-raised` bg | `color.text-muted` | — |

### Token references

`color.text`, `color.text-muted`, `color.primary`, `color.border`, `color.border-focus`, `color.error`, `color.success`, `color.surface`, `color.surface-raised`, `shadow.focus`, `radius.md`, `space.2`, `space.3`, `font.size.sm`, `font.size.base`, `font.body`, `transition.fast`

### Accessibility

- `<label>` is always rendered (never `placeholder` as substitute)
- `aria-describedby` points to helper text and/or error message `id`
- `aria-invalid="true"` on input when in error state
- `aria-required="true"` on required fields (plus visible asterisk with `aria-hidden="true"`)
- Error messages use `role="alert"` on dynamic injection
- Password toggle: `aria-label="Show password"` / `"Hide password"`
- Checkbox/radio groups: `<fieldset>` + `<legend>`

### Stitch prompt

```
Generate a FormField component set for Luthas Center (forms: donation, enrollment, contact, login, signup).
Components: text input, email input, password input (with show/hide toggle), textarea (auto-grow), select dropdown, checkbox, radio button, file upload.
Each has: label (above), optional helper text (below, muted), error state (red border + error icon + message), success state (green border), disabled state.
States: default, focus (brand primary border + focus glow), valid, error, disabled, read-only.
Label placement: always above input. Consistent 4px gap system. Use brand tokens only. Accessible contrast ratios.
```

---

## 11. Pagination

### Purpose

Navigation control for multi-page content lists: courses, blog posts, search results, and product listings.

### Anatomy

```
[← Prev]  [1]  [2]  [...]  [7]  [8]  [9]  [Next →]
```

- **Root:** `<nav aria-label="Pagination">`
- **List:** `<ol>` of page items
- **Current page:** `<span aria-current="page">` (not a link)
- **Ellipsis:** `<li aria-hidden="true">…</li>`

### Variants

| Variant | Use |
|---------|-----|
| `default` | Full numbered pagination |
| `simple` | Prev / Next only (mobile default) |
| `load-more` | Single "Load more" button (infinite-style) |
| `cursor` | Prev / Next with count label "Page 3 of 12" |

### Token references

`color.primary`, `color.text`, `color.text-muted`, `color.border`, `color.surface-raised`, `color.border-focus`, `radius.md`, `space.2`, `space.3`, `font.size.sm`, `font.weight.medium`, `transition.fast`

### Accessibility

- `<nav aria-label="Pagination">` landmark
- Current page: `aria-current="page"` and visually distinct (no link)
- Page number links: `aria-label="Go to page [n]"`
- Disabled prev/next: `aria-disabled="true"` not removed from DOM
- Focus management: after page change, focus moves to new content region `<main>`

### Stitch prompt

```
Generate a Pagination component for Luthas Center.
Variants: full numbered (1 2 ... 7 8 9 with prev/next arrows), simple (prev/next only), load-more button, cursor (prev/next + "Page X of Y" label).
States: default page item, hover, active/current (brand primary fill, inverse text, not a link), disabled prev/next (muted, no pointer).
Ellipsis item (non-interactive). Consistent 40px touch targets. Rounded corners (medium radius). Use brand tokens only.
```

---

## 12. Accordion

### Purpose

Collapsible panel set used primarily for course curriculum display (chapters and lessons), FAQ sections, and resource lists.

### Anatomy

```
┌─────────────────────────────────────────────────────┐
│ [Chapter title / trigger]              [▼ / ▲ icon] │
├─────────────────────────────────────────────────────┤ ← expanded
│  [LessonListItem]                                   │
│  [LessonListItem]                                   │
│  [LessonListItem]                                   │
│  [step summary: X lessons · Y min total]            │
└─────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────┐
│ [Chapter 2 title]                      [▼ icon]     │ ← collapsed
└─────────────────────────────────────────────────────┘
```

### Variants

| Variant | Behavior |
|---------|---------|
| `single` | Only one panel open at a time (FAQ) |
| `multi` | Multiple panels open simultaneously (curriculum) |
| `flush` | No outer border/card shell; edge-to-edge (mobile) |
| `contained` | Card shell with border radius |

### States

- **Collapsed:** chevron points down, panel `hidden` (height: 0), `aria-expanded="false"`
- **Expanded:** chevron rotates 180°, panel visible, `aria-expanded="true"`
- **Trigger hover:** `color.surface-raised` background
- **Trigger focus-visible:** `color.border-focus` outline

### Content source fields

Course curriculum context:
- `course_steps.order`, `lessons.title`, `lessons.type`, `lessons.duration_seconds`
- Chapter grouping from `course_steps` meta or lesson `section` field

### Token references

`color.surface`, `color.surface-raised`, `color.text`, `color.text-muted`, `color.border`, `color.border-focus`, `color.primary`, `radius.md`, `space.4`, `space.3`, `font.size.base`, `font.size.sm`, `font.weight.semibold`, `transition.base`

### Accessibility

- Each trigger: `<button aria-expanded="true/false" aria-controls="panel-id">`
- Panel: `id` matching `aria-controls`, `role="region"`, `aria-labelledby="trigger-id"`
- Chevron icon: `aria-hidden="true"` (direction conveyed by `aria-expanded`)
- Keyboard: `Enter`/`Space` toggles; optionally `ArrowDown`/`ArrowUp` moves between triggers (APG pattern)

### Stitch prompt

```
Generate an Accordion component for Luthas Center.
Use cases: course curriculum (chapters with lesson list inside), FAQ, resource lists.
Variants: single-open (one panel at a time), multi-open, flush (edge-to-edge), contained (card shell).
Trigger: full-width button row, chapter/section title (semibold), trailing chevron (rotates 180° on open).
Expanded panel: list of lesson rows (using LessonListItem pattern), footer summary ("X lessons · Y min").
States: collapsed, expanded (smooth height transition), trigger hover (tinted bg), trigger focus (brand focus ring).
Use brand tokens only. Support deep nesting (lesson inside chapter).
```

---

## 13. Avatar

### Purpose

Circular user identity element for author bylines, nav user menu, comment attribution, and instructor profiles.

### Anatomy

```
  ┌──────┐
  │ img  │  ← circular crop
  └──────┘
  [fallback initials if no image]
```

### Sizes

| Size | Diameter | Font size (initials) | Use |
|------|---------|---------------------|-----|
| `xs` | 24px | `font.size.xs` | Dense list meta |
| `sm` | 32px | `font.size.sm` | Post card byline |
| `md` | 40px (default) | `font.size.base` | Nav user menu |
| `lg` | 56px | `font.size.lg` | Instructor profile |
| `xl` | 80px | `font.size.xl` | Profile page |

### Variants

| Variant | Description |
|---------|-------------|
| `image` | `<img>` inside circle, `object-fit: cover` |
| `initials` | Colored bg (`color.primary` or `color.accent`) + initials (inverse text) |
| `icon` | Generic user icon (fallback when neither image nor name available) |
| `with-status` | Small status dot (online/offline) bottom-right |
| `group` | Stacked overlapping avatars (+N label) for multi-author |

### Content source fields

- `profiles.avatar_url`, `profiles.display_name` (initials derived)
- `posts.author_id` → `profiles`

### Token references

`color.primary`, `color.accent`, `color.text-inverse`, `color.surface-raised`, `color.success`, `color.text-muted`, `color.border`, `radius.full`, `shadow.sm`, `font.weight.semibold`

### Accessibility

- `<img>` with `alt="[Display Name]"`; initials fallback: `aria-label="[Display Name]"`
- Status dot: `aria-label="Online"` / `"Offline"` not relying on color alone
- Group avatar: `aria-label="[Name 1], [Name 2], and 3 others"`

### Stitch prompt

```
Generate an Avatar component set for Luthas Center.
Sizes: xs (24px), sm (32px), md (40px, default), lg (56px), xl (80px).
Variants: image (circular crop), initials (brand primary or accent bg + inverse text initials), icon fallback (generic user icon), with-status (small dot bottom-right, success for online), group (overlapping stack + "+N" label).
All: circular, border (1px surface-raised for contrast on backgrounds), subtle shadow.
Use brand tokens only. Consistent initials generation from display name.
```

---

## 14. Breadcrumb

### Purpose

Hierarchical navigation trail showing the user's location within site structure: Home > Courses > Project Management > Agile Foundations.

### Anatomy

```
[Home] / [Courses] / [Project Management] / [Current page — not a link]
```

- **Root:** `<nav aria-label="Breadcrumb">` wrapping `<ol>`
- **Separators:** CSS `::after` pseudo-element, `aria-hidden="true"`
- **Current item:** `<span aria-current="page">` — not `<a>`

### Token references

`color.text-muted`, `color.primary`, `color.text`, `color.border-focus`, `font.size.sm`, `font.weight.normal`, `font.weight.medium`, `space.1`, `space.2`, `transition.fast`

### Truncation (mobile)

At `< bp.md`: show only first and last items with `...` in between. Middle items hidden with `aria-hidden="true"` and a visually hidden "navigation" description.

### Content source fields

Page hierarchy derived from `pages.ancestor_slugs`, `courses.categories`, route structure.

### Accessibility

- `<nav aria-label="Breadcrumb"><ol>` pattern (ARIA Authoring Practices)
- Separators: `aria-hidden="true"` on CSS pseudo or `<span>` character
- Current page: `aria-current="page"` on final `<li>` inner element
- All ancestor links have descriptive text (no "click here")

### Stitch prompt

```
Generate a Breadcrumb component for Luthas Center.
Layout: horizontal row of links separated by "/" or ">" chevron.
States: ancestor items (primary color link, hover underline), current page item (muted text, not a link), separator (muted, aria-hidden).
Mobile truncation: show first + last item with ellipsis for middle.
Font: small (sm), single line. Separator: CSS pseudo-element.
Use brand tokens only. Clean, minimal. Output with all states visible.
```

---

## 15. Alert / CTA Banner

### Purpose

Full-width or inline message strip for actionable announcements, system feedback, donation campaigns, and enrollment prompts. Two sub-types: **Alert** (feedback, transient) and **CTA Banner** (persistent promotion).

### Anatomy — Alert

```
┌──────────────────────────────────────────────────────────┐
│ [icon]  [title]  [message]                    [× close]  │
└──────────────────────────────────────────────────────────┘
```

### Anatomy — CTA Banner

```
┌──────────────────────────────────────────────────────────┐
│ [eyebrow]  [headline]  [supporting copy]  [CTA button]  │
│                                            [dismiss ×]  │
└──────────────────────────────────────────────────────────┘
```

### Alert Variants

| Variant | Background | Icon | Use |
|---------|-----------|------|-----|
| `success` | `color.success` @ 12% | checkmark | Enrollment confirmed, donation received |
| `error` | `color.error` @ 12% | exclamation | Form error, payment failed |
| `warning` | `color.warning` @ 12% | warning triangle | Session expiring, incomplete profile |
| `info` | `color.info` @ 12% | info circle | Tips, announcements |

### CTA Banner Variants

| Variant | Background | Use |
|---------|-----------|-----|
| `campaign` | `color.primary` gradient | Donation drives |
| `enrollment` | `color.accent` @ 20% | Course enrollment prompts |
| `neutral` | `color.surface-raised` | General announcements |

### Token references

`color.success`, `color.error`, `color.warning`, `color.info`, `color.primary`, `color.accent`, `color.surface-raised`, `color.text`, `color.text-muted`, `color.text-inverse`, `color.border`, `radius.md`, `space.3`, `space.4`, `font.size.sm`, `font.size.base`, `font.weight.medium`, `font.weight.semibold`, `shadow.sm`

### Accessibility

- Alert uses `role="alert"` (assertive) for errors; `role="status"` (polite) for success/info
- CTA Banner: `role="region"`, `aria-labelledby` pointing to headline
- Dismiss button: `aria-label="Dismiss [alert title]"`
- Color not the only signal — icon always accompanies semantic variant
- High-contrast mode: border added to supplement background color distinction

### Stitch prompt

```
Generate an Alert + CTA Banner component set for Luthas Center.
Alert variants: success (green tint, checkmark icon), error (red tint, exclamation icon), warning (amber tint, triangle icon), info (blue tint, info icon). Each has: icon left, title (semibold), message, optional dismiss X right. Inline + full-width modes.
CTA Banner variants: campaign (brand primary gradient bg, inverse text, "Donate Now" button), enrollment (accent tint, "Enroll Free" button), neutral (surface-raised, general announcement, optional CTA).
States: default, dismissed (slide/fade out), with close button (always visible, not just on hover).
Mobile: stacks text vertically, button full-width. Tone: empowering, calm, action-oriented.
Use brand tokens only.
```

---

## Appendix: Token Usage Summary Matrix

| Component | Core tokens |
|-----------|------------|
| Button | `color.primary`, `color.border-focus`, `radius.md`, `font.weight.semibold` |
| Card | `color.surface`, `shadow.md`, `radius.lg`, `color.border` |
| NavBar | `color.surface`, `color.primary`, `shadow.md`, `transition.base` |
| Footer | `color.surface-raised`, `color.text-muted`, `space.8` |
| Hero | `color.primary`, `font.heading`, `font.size.4xl`, `font.weight.bold` |
| CourseCard | `color.primary`, `color.success`, `enrollments.progress_percent` |
| LessonListItem | `color.success`, `color.primary`, `radius.full`, `font.size.sm` |
| PostCard | `color.accent`, `shadow.sm`, `font.leading.relaxed` |
| Badge/Tag | `radius.full`, `font.size.xs`, semantic color @ 15% tint |
| FormField | `color.border-focus`, `shadow.focus`, `color.error`, `aria-invalid` |
| Pagination | `color.primary`, `radius.md`, `font.weight.medium` |
| Accordion | `color.border`, `transition.base`, `aria-expanded` |
| Avatar | `radius.full`, `color.primary`, `font.weight.semibold` |
| Breadcrumb | `color.text-muted`, `font.size.sm`, `aria-current="page"` |
| Alert/Banner | semantic color @ 12%, `role="alert"`, `color.text-inverse` |

---

*End of component library specification.*
