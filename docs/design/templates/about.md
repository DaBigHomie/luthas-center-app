# About — Layout Spec

Route: `/about`  
Template type: Static CMS page (pages table, slug = `about`)  
Last authored: 2026-06-08

---

## 1. Purpose

Introduce the Luthas Center for Excellence to first-time visitors: who we are, what drives us, our 12 public commitments, and the founding team. The page must build instant trust and move a visitor toward donation or course enrollment. Tone: empowering, calm, accessible, trustworthy. Tagline anchor: "Impossible to Inevitable."

---

## 2. Responsive Layout — ASCII Wireframes

### 2a. Mobile (< 768 px)

```
┌─────────────────────────────────┐
│  [GlobalNav — hamburger + logo] │  (landmark: <header>)
├─────────────────────────────────┤
│                                 │
│   HERO                          │  <section aria-label="About hero">
│   ─────────────────────────     │
│   [Full-bleed featured image    │
│    wp_id 17596, 16:9 crop]      │
│                                 │
│   About                         │  <h1>
│   ─────────────────────────     │
│   "At the Luthas Center for     │
│    Excellence, our exceptional  │
│    strength lies in our         │
│    wholehearted dedication…"    │  (page.excerpt)
│                                 │
│   [CTA button: Donate Now]      │
│                                 │
├─────────────────────────────────┤
│                                 │
│   MISSION                       │  <section aria-label="Our mission">
│   ─────────────────────────     │
│   <h2> Our Mission              │
│                                 │
│   [Icon] Transforming Lives     │
│   "Integrating life-            │
│    transforming programs…"      │
│                                 │
│   [Icon] Inclusive Growth       │
│   "Creating spaces that         │
│    foster well-being…"          │
│                                 │
├─────────────────────────────────┤
│                                 │
│   COMMITMENTS                   │  <section aria-label="Our commitments">
│   ─────────────────────────     │
│   <h2> Our Commitments          │
│                                 │
│   ┌────────────────────────┐    │
│   │ 01  Unceasing Growth   │    │  (card × 12, stacked)
│   │ We pledge to           │    │
│   │ continuously evolve…   │    │
│   └────────────────────────┘    │
│   ┌────────────────────────┐    │
│   │ 02  Selflessness       │    │
│   │ Our actions are        │    │
│   │ guided by…             │    │
│   └────────────────────────┘    │
│   … (12 cards total, scroll)    │
│                                 │
├─────────────────────────────────┤
│                                 │
│   DEI CALLOUT                   │  <section aria-label="Diversity equity inclusion">
│   ─────────────────────────     │
│   <h2> Diversity, Equity        │
│        & Inclusion              │
│                                 │
│   "We embrace diversity as      │
│    a fundamental pillar…"       │
│                                 │
│   [Link → /empowering-          │
│   diverse-communities…]         │
│                                 │
├─────────────────────────────────┤
│                                 │
│   TEAM                          │  <section aria-label="Our team">
│   ─────────────────────────     │
│   <h2> Meet the Team            │
│                                 │
│   ┌────────────────────────┐    │
│   │ [Avatar circle]        │    │
│   │ Dame Luthas            │    │  (founder card)
│   │ Founder & Director     │    │
│   │ "For a decade, Dame    │    │
│   │  Luthas collaborated   │    │
│   │  with global UN orgs…" │    │
│   └────────────────────────┘    │
│                                 │
│   ┌────────────────────────┐    │
│   │ [Avatar circle]        │    │
│   │ Nasir Luthas           │    │
│   │ Team Member            │    │
│   └────────────────────────┘    │
│   … (additional members)        │
│                                 │
├─────────────────────────────────┤
│                                 │
│   CONTACT CTA                   │  <section aria-label="Contact us">
│   ─────────────────────────     │
│   <h2> Get in Touch             │
│   [rank_math contact info       │
│    rendered as address block]   │
│   [Button: Contact Us →]        │
│                                 │
├─────────────────────────────────┤
│  [GlobalFooter]                 │  (landmark: <footer>)
└─────────────────────────────────┘
```

### 2b. Desktop (>= 1024 px)

```
┌─────────────────────────────────────────────────────────────────────┐
│  [GlobalNav — full horizontal, logo left, nav links + CTA right]    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   HERO                                                              │
│   ──────────────────────────────────────────────────────────────   │
│   ┌──────────────────────────────┐  ┌───────────────────────────┐  │
│   │                              │  │  About                    │  │
│   │  [Featured image             │  │  ───────────────────────  │  │
│   │   wp_id 17596,               │  │  "At the Luthas Center    │  │
│   │   media.file_path,           │  │   for Excellence, our     │  │
│   │   1:1 or 4:3 crop,           │  │   exceptional strength    │  │
│   │   60% column width]          │  │   lies in our             │  │
│   │                              │  │   wholehearted            │  │
│   │                              │  │   dedication to           │  │
│   │                              │  │   integrating life-       │  │
│   └──────────────────────────────┘  │   transforming programs." │  │
│                                      │                           │  │
│                                      │  [Donate Now]  [Courses →]│  │
│                                      └───────────────────────────┘  │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   MISSION (full-width, 2-col icon list)                             │
│   ──────────────────────────────────────────────────────────────   │
│   Our Mission                                                       │
│   ┌───────────────────────────┐  ┌───────────────────────────┐     │
│   │ [Icon] Transforming Lives │  │ [Icon] Inclusive Growth   │     │
│   │  …                        │  │  …                        │     │
│   └───────────────────────────┘  └───────────────────────────┘     │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   COMMITMENTS (3-col grid)                                          │
│   ──────────────────────────────────────────────────────────────   │
│   Our Commitments                                                   │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│   │ 01 Unceasing │  │ 02 Selfless- │  │ 03 Pursuit   │            │
│   │    Growth    │  │    ness      │  │    of Excel.  │            │
│   └──────────────┘  └──────────────┘  └──────────────┘            │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│   │ 04 Passion   │  │ 05 Purpose   │  │ 06 Homeless. │            │
│   │    Cultiv.   │  │    Discovery │  │    Support   │            │
│   └──────────────┘  └──────────────┘  └──────────────┘            │
│   … (rows of 3, 4 rows total)                                       │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   DEI CALLOUT (accent band, full-width)                             │
│   ──────────────────────────────────────────────────────────────   │
│   Diversity, Equity & Inclusion     [Learn more →]                  │
│   "We embrace diversity as a fundamental pillar of our mission…"   │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   TEAM (4-col card row)                                             │
│   ──────────────────────────────────────────────────────────────   │
│   Meet the Team                                                     │
│   ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐     │
│   │ [Avatar]  │  │ [Avatar]  │  │ [Avatar]  │  │ [Avatar]  │     │
│   │ Dame      │  │ Nasir     │  │ Abijah    │  │ Jason     │     │
│   │ Luthas    │  │ Luthas    │  │ Alston    │  │ Cordner   │     │
│   │ Founder   │  │ Team      │  │ Team      │  │ Team      │     │
│   └───────────┘  └───────────┘  └───────────┘  └───────────┘     │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   CONTACT CTA (2-col: text left, address+button right)              │
│   Get in Touch            │  [address block]  [Contact Us →]        │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│  [GlobalFooter]                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Section-by-Section Table

| Section | Component | Content source field | Behavior |
|---|---|---|---|
| **GlobalNav** | `<Nav>` primitive | Static config | Sticky on scroll; hamburger below 768 px; "Donate" CTA button in nav uses `color.cta` |
| **Hero** | `<HeroSplit>` | `pages.title` → `<h1>`; `pages.excerpt` → lead paragraph; `media.file_path` (where `media.wp_id = pages.featured_image_id = 17596`) → hero image; `pages.new_path` for canonical URL | Image left / text right on desktop, stacked on mobile; image lazy-loaded with `loading="eager"` as above-fold; two CTAs: primary "Donate Now" links to `/donate`, secondary "Explore Courses" links to `/courses` |
| **Mission** | `<IconList>` inside `<Section>` | Derived from `pages.excerpt` + curated brand copy (two pillars: life-transforming programs + network empowerment) | 1-col on mobile, 2-col on desktop; icons from design-system icon set; no external images |
| **Commitments** | `<CardGrid>` of `<CommitmentCard>` | `pages.content` (parsed from Visual Composer shortcodes, stripped to plain list) — 12 items with ordinal + title + body | 1-col mobile, 2-col tablet (≥ 640 px), 3-col desktop (≥ 1024 px); ordinal badge uses `color.accent`; card background `color.surface`; radius `radius.md` |
| **DEI Callout** | `<CalloutBand>` | `pages` (slug = `empowering-diverse-communities-dei-initiatives`): `pages.title`, `pages.excerpt` | Full-width accent background (`color.accent` at low opacity or dedicated `color.surface.alt`); text + single "Learn More" link; links to `/empowering-diverse-communities-dei-initiatives` |
| **Team** | `<CardGrid>` of `<TeamCard>` | `profiles` table: `display_name`, `first_name`, `last_name`, `description`, `primary_role`; avatar via `media` table (keyed by profile `wp_id`, fallback to initials avatar) | 1-col mobile, 2-col tablet, 4-col desktop; only profiles with non-null `display_name` rendered; founder card (wp_id = 1) always first |
| **Contact CTA** | `<ContactBlock>` | Static site config (org address, email, phone) rendered from `seo_meta` table (`page_slug = 'about'`) or static constant | Two-col on desktop; address uses `<address>` element; CTA links to `/contact` |
| **GlobalFooter** | `<Footer>` primitive | Static config + site nav | `<footer>` landmark; includes social links, copyright, privacy/terms links |

---

## 4. Primitives Used

All primitives are drawn from `src/shared/ui/` (component library):

| Primitive | Usage in this template |
|---|---|
| `<Nav>` | Global sticky navigation |
| `<HeroSplit>` | Hero section — image + text two-column layout |
| `<Section>` | Semantic section wrapper; accepts `aria-label` prop |
| `<Heading>` | Enforces heading hierarchy; props: `level` (1–6), `font` token ref |
| `<Text>` | Body copy; `font.body` token |
| `<Button>` | CTA buttons; variants: `primary`, `secondary`, `ghost` |
| `<IconList>` | Mission pillars list with icon + label + body |
| `<CardGrid>` | Responsive grid shell; props: `cols` per breakpoint |
| `<CommitmentCard>` | Card variant: ordinal badge + title + body; uses `color.surface`, `radius.md` |
| `<TeamCard>` | Card variant: avatar circle + name + role + bio excerpt |
| `<CalloutBand>` | Full-width accent band: headline + body + optional CTA link |
| `<ContactBlock>` | Address + email + phone + CTA |
| `<Avatar>` | Circular image with initials fallback; sizes: `sm`, `md`, `lg` |
| `<Footer>` | Global footer |
| `<SkipLink>` | "Skip to main content" accessibility anchor |
| `<Divider>` | Horizontal rule using `color.border` token |

---

## 5. Data Requirements

### Primary query — page content

```
table: pages
columns: id, title, slug, content, excerpt, featured_image_id, seo_title, seo_description, new_path
filter: slug = 'about'
```

### Featured image

```
table: media
columns: id, wp_id, file_path, alt_text, mime_type, width, height
filter: wp_id = 17596   -- pages.featured_image_id
```

### SEO meta

```
table: seo_meta
columns: page_slug, meta_title, meta_description, og_image_id
filter: page_slug = 'about'
```

### Team members

```
table: profiles
columns: id, wp_id, display_name, first_name, last_name, description, primary_role, email (excluded from render)
filter: display_name IS NOT NULL
order: wp_id ASC   -- founder (wp_id=1) first; then registered order
```

### Team member avatars

```
table: media
columns: id, wp_id, file_path, alt_text
join hint: media.wp_id matched against profiles.wp_id via a dedicated avatar_media_id column
           (if column absent: generate initials avatar client-side from first_name + last_name)
```

### DEI callout

```
table: pages
columns: title, excerpt, new_path
filter: slug = 'empowering-diverse-communities-dei-initiatives'
```

### Supabase view (catalog reference — read-only)

```
view: catalog_items
purpose: not directly used on About; referenced only if a "Featured Courses" teaser
         section is added in a future iteration.
```

---

## 6. Accessibility Notes

### Landmarks

| HTML element | `aria-label` | Purpose |
|---|---|---|
| `<header>` | (implicit) | Site header / nav |
| `<main>` | (implicit) | Page main content |
| `<section>` | "About hero" | Hero |
| `<section>` | "Our mission" | Mission pillars |
| `<section>` | "Our commitments" | 12 commitments grid |
| `<section>` | "Diversity equity and inclusion" | DEI callout |
| `<section>` | "Meet the team" | Team grid |
| `<section>` | "Contact us" | Contact CTA |
| `<footer>` | (implicit) | Site footer |

### Heading order

```
h1 — page.title ("About")
  h2 — "Our Mission"
  h2 — "Our Commitments"
    h3 — Each commitment title (e.g. "Unceasing Growth")
  h2 — "Diversity, Equity & Inclusion"
  h2 — "Meet the Team"
    h3 — Each team member name
  h2 — "Get in Touch"
```

No heading levels may be skipped. `<Heading level={n}>` primitive enforces this via prop validation.

### Focus management

- `<SkipLink>` is the first focusable element; target is `<main id="main-content">`.
- All `<Button>` and `<a>` elements have visible focus rings using `outline: 2px solid var(--color-focus-ring)`.
- Commitment cards are `<article>` elements, not interactive; do not receive focus unless a "read more" control is present.
- Team cards: if a bio is truncated with a "read more" toggle, the toggle button label is `"Read more about {display_name}"`.

### Images and alt text

- Hero image: `alt` sourced from `media.alt_text`; fallback `"Luthas Center for Excellence — About"`.
- Team avatars: `alt="{display_name}, {role}"`.
- Decorative icons in mission section: `aria-hidden="true"`.
- Initials avatar (SVG): `aria-label="{display_name} — profile photo not available"`.

### Keyboard navigation

- All interactive controls operable by keyboard (Tab / Shift+Tab / Enter / Space).
- No keyboard traps.
- Card grids scroll into view naturally; no carousel (no roving tabindex required).

### Color contrast

- Body text on `color.surface`: minimum 4.5:1 (WCAG AA).
- Ordinal badge on `color.accent`: verify badge text color meets 4.5:1 against `color.accent` background.
- DEI callout band: ensure text on `color.surface.alt` meets 4.5:1.

### ARIA live regions

- No async data mutations on this page; no live regions required.

---

## 7. Stitch Prompt

```
Design a full-page layout for the "About" page of the Luthas Center for Excellence
(luthas-center.damieus.app) — a nonprofit education, LMS, and mental-health-resources
platform. Tagline: "Impossible to Inevitable." Tone: empowering, calm, accessible,
trustworthy.

Brand tokens to apply throughout (never use raw hex — reference token names only):
  color.primary, color.surface, color.surface.alt, color.accent, color.cta,
  color.border, color.text, color.text.muted, color.focus-ring
  font.heading (display weight), font.body (regular), font.mono (ordinal badges)
  radius.sm, radius.md, radius.lg
  space.2, space.4, space.6, space.8, space.12, space.16

Sections to include, top to bottom:

1. GLOBAL NAV — sticky header, logo left, horizontal links center/right on desktop,
   hamburger on mobile. "Donate" button uses color.cta.

2. HERO — split layout (image left 55%, text right 45%) on desktop; stacked on mobile.
   Left: full-bleed featured photograph of the Luthas Center, object-fit cover, rounded
   with radius.lg. Right: h1 "About" in font.heading, lead paragraph "At the Luthas
   Center for Excellence, our exceptional strength lies in our wholehearted dedication
   to integrating life-transforming programs.", two CTAs — primary "Donate Now"
   (color.cta) and secondary "Explore Courses" (color.primary outline).

3. MISSION — full-width section on color.surface, h2 "Our Mission", two icon+text
   columns. Pillar 1: icon + "Transforming Lives" heading + brief body. Pillar 2: icon
   + "Network Empowerment" heading + brief body. Icons use color.accent.

4. COMMITMENTS — h2 "Our Commitments", 3-column card grid on desktop, 2-col tablet,
   1-col mobile. Each of the 12 cards shows: an ordinal badge (01–12) in font.mono on
   color.accent background, commitment title in font.heading size sm, body text in
   font.body size sm. Card background color.surface, border color.border, radius.md,
   shadow-sm. The 12 titles are: Unceasing Growth, Selflessness, Pursuit of Excellence,
   Passion Cultivation, Purpose Discovery, Homelessness Support, Poverty Alleviation,
   Mental Health Advocacy, Financial Empowerment, Educational Empowerment,
   Startup Investment, Research & Innovation Promotion.

5. DEI CALLOUT BAND — full-width band using color.surface.alt as background.
   h2 "Diversity, Equity & Inclusion" in font.heading. Subtext: "We embrace diversity
   as a fundamental pillar of our mission — creating an environment where every
   individual feels valued, respected, and has access to equal opportunities."
   A ghost/outline link button "Learn More" aligned right of text on desktop.

6. TEAM — h2 "Meet the Team", 4-column card grid on desktop, 2-col tablet, 1-col
   mobile. Each card: circular avatar (64px, color.surface with initials fallback,
   radius.lg), name in font.heading size sm, role label in font.body size xs
   color.text.muted, two-line bio excerpt. Founder card (Dame Luthas — "For a decade,
   Dame Luthas collaborated with global United Nations Organizations…") appears first.

7. CONTACT CTA — 2-col on desktop: left column h2 "Get in Touch" + one sentence;
   right column address block + "Contact Us" primary button. Use font.body and
   color.text.muted for address details.

8. GLOBAL FOOTER — dark background (color.primary), site links in two columns, social
   icons, copyright line, links to Privacy Policy and Terms & Conditions.

Responsive breakpoints: mobile < 640px, tablet 640–1023px, desktop >= 1024px.
Ensure all text has sufficient contrast against its background. Heading hierarchy:
h1 in hero, h2 per section, h3 for card titles within sections.
```
