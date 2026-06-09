# Contact — Layout Spec

Route: `/contact`  
Template: `contact`  
Tagline context: "Impossible to Inevitable" — tone is warm, accessible, trustworthy.

---

## 1. Purpose

Give visitors a frictionless way to reach the Luthas Center team. The page serves three audiences simultaneously: prospective students asking about courses, donors or partners making inquiries, and community members seeking mental-health resource referrals. The layout pairs a primary contact form (left/top) with a compact org-info sidebar (right/bottom), an embedded map for in-person orientation, and a soft CTA to the newsletter/donation flow so the page also contributes to retention.

---

## 2. Responsive Layout — ASCII Wireframes

### Mobile (< 768 px) — single column, top-to-bottom

```
┌─────────────────────────────────────┐
│  [PageHero]                          │
│  h1: "Get In Touch"                  │
│  sub: page.excerpt (if set)          │
│  bg: color.surface.alt              │
├─────────────────────────────────────┤
│  [OrgInfo Card]  ← full width        │
│  org name, address, phone, email     │
│  social links                        │
├─────────────────────────────────────┤
│  [ContactForm]   ← full width        │
│  name / email / subject / message    │
│  [Submit Button]                     │
│  success / error inline alert        │
├─────────────────────────────────────┤
│  [MapEmbed]      ← full width        │
│  aspect-ratio 4/3, border-radius md  │
├─────────────────────────────────────┤
│  [SoftCTA Strip]                     │
│  "Stay connected" → newsletter link  │
│  "Support our work" → /donate        │
├─────────────────────────────────────┤
│  [GlobalFooter]                      │
└─────────────────────────────────────┘
```

### Desktop (>= 1024 px) — two-column body

```
┌──────────────────────────────────────────────────────────────────┐
│  [GlobalHeader / Nav]                                             │
├──────────────────────────────────────────────────────────────────┤
│  [PageHero — full width]                                          │
│   h1: "Get In Touch"    sub: page.excerpt                         │
│   bg: color.surface.alt   py: space.16                            │
├───────────────────────────────────┬──────────────────────────────┤
│  [ContactForm — 2/3 width]        │  [OrgInfo Card — 1/3 width]  │
│                                   │                              │
│  ┌──────────┐  ┌───────────────┐  │  Luthas Center               │
│  │ Name     │  │ Email         │  │  ─────────────               │
│  └──────────┘  └───────────────┘  │  Address block               │
│  ┌──────────────────────────────┐ │  Phone / Fax                 │
│  │ Subject                      │ │  Email                       │
│  └──────────────────────────────┘ │  ─────────────               │
│  ┌──────────────────────────────┐ │  Social icons (linked)       │
│  │ Message                      │ │  ─────────────               │
│  │   (textarea, min 6 rows)     │ │  [MapEmbed]                  │
│  └──────────────────────────────┘ │  (16/9 aspect, sticky top)   │
│  [Submit Button — full row width] │                              │
│  [InlineAlert success / error]    │                              │
├───────────────────────────────────┴──────────────────────────────┤
│  [SoftCTA Strip — full width]                                     │
│  "Stay connected — subscribe to updates"  |  "Support our work"  │
├──────────────────────────────────────────────────────────────────┤
│  [GlobalFooter]                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 3. Section-by-Section Table

| Section | Component | Content source field | Behavior |
|---|---|---|---|
| PageHero | `<PageHero>` | `pages.title` ("Contact"), `pages.excerpt` (fallback: "We'd love to hear from you.") | Static render; no image required; bg uses `color.surface.alt`; heading level h1 |
| ContactForm | `<ContactForm>` | POST to `contact_submissions(name, email, subject, message, created_at)` | Client-side required-field validation before submit; optimistic disable of submit button on send; show `<InlineAlert variant="success">` on 200 or `<InlineAlert variant="error">` on failure; all fields persist if submission fails; `created_at` set server-side |
| — Name field | `<InputField>` | user input → `contact_submissions.name` | `type="text"`, required, `autocomplete="name"`, maxLength 120 |
| — Email field | `<InputField>` | user input → `contact_submissions.email` | `type="email"`, required, `autocomplete="email"`, pattern validation |
| — Subject field | `<InputField>` | user input → `contact_submissions.subject` | `type="text"`, required, maxLength 200 |
| — Message field | `<TextareaField>` | user input → `contact_submissions.message` | required, minRows 6, maxLength 2000, character counter shown at 80 % capacity |
| — Submit | `<Button variant="primary">` | static label "Send Message" | disabled while submitting; aria-busy during pending state |
| OrgInfo Card | `<InfoCard>` | org constants (name, address, phone, email from env / CMS config) | Static; phone renders as `<a href="tel:…">`; email renders as `<a href="mailto:…">`; social links render as icon buttons |
| MapEmbed | `<MapEmbed>` (iframe wrapper) | Google Maps embed URL from `pages.content` shortcode param or env var `NEXT_PUBLIC_MAP_EMBED_URL` | Lazy-loaded (`loading="lazy"`); `title` attribute set for accessibility; wrapped in `<figure>` with `<figcaption>` showing address; aspect-ratio enforced via CSS |
| SoftCTA Strip | `<CtaStrip>` | Static copy: "Stay connected" / "Support our work"; hrefs: `/newsletter`, `/donate` | Minimal bg (`color.primary` tint); two `<Button>` elements side by side |
| GlobalHeader | `<GlobalHeader>` | nav links, logo | Shared layout component |
| GlobalFooter | `<GlobalFooter>` | org info, links | Shared layout component |

---

## 4. Primitives Used

All primitives are drawn from the shared component library (`src/shared/ui/`).

| Primitive | Usage in this template |
|---|---|
| `<PageHero>` | Top hero band with h1 + subtitle |
| `<InputField>` | Name, email, subject text inputs |
| `<TextareaField>` | Message body with row/char constraints |
| `<Button variant="primary">` | Form submit; SoftCTA actions |
| `<Button variant="ghost">` | Alternate SoftCTA link style |
| `<InlineAlert variant="success|error">` | Post-submit feedback |
| `<InfoCard>` | Org info sidebar card |
| `<MapEmbed>` | Iframe wrapper with aspect-ratio + figcaption |
| `<CtaStrip>` | Full-width two-action band |
| `<Divider>` | Visual separator inside OrgInfo Card |
| `<Icon>` | Social link icons (email, phone, map-pin) |
| `<Stack>` | Vertical spacing utility |
| `<Grid cols={3}>` | Desktop two-column (2fr + 1fr) layout |

---

## 5. Data Requirements

### Tables / Columns Used

| Table | Columns read | Purpose |
|---|---|---|
| `pages` | `slug`, `title`, `excerpt`, `content`, `seo_title`, `seo_description`, `status` | Page metadata, hero copy, raw content (map embed URL extraction) |
| `seo_meta` | `title`, `description`, `og_image_id`, `canonical` | `<head>` SEO tags; join on `pages.wp_id` → `seo_meta.object_id` |

### Table Written

| Table | Columns written | Notes |
|---|---|---|
| `contact_submissions` | `id` (uuid PK, default gen_random_uuid()), `name` (text not null), `email` (text not null), `subject` (text not null), `message` (text not null), `created_at` (timestamptz default now()), `status` (text default 'new') | This table does not exist in the current schema and must be created via migration. No auth required — public insert with RLS policy allowing anon insert only; select/update restricted to service role. |

### Query Pattern (pages fetch)

```sql
SELECT title, excerpt, content, seo_title, seo_description
FROM pages
WHERE slug = 'contact'
  AND status = 'publish'
LIMIT 1;
```

### Contact Submission Insert

```sql
INSERT INTO contact_submissions (name, email, subject, message)
VALUES ($1, $2, $3, $4);
```

Executed via a Next.js Route Handler (`app/contact/submit/route.ts`) so the Supabase service-role key is never exposed to the client.

---

## 6. Accessibility Notes

| Concern | Implementation |
|---|---|
| Landmark regions | `<header role="banner">`, `<main>`, `<section aria-labelledby="contact-form-heading">`, `<aside aria-label="Organisation information">`, `<footer role="contentinfo">` |
| Heading order | h1 in PageHero ("Get In Touch"); h2 inside ContactForm section ("Send a Message"); h2 inside OrgInfo Card ("Contact Information"); no heading levels skipped |
| Form labels | Every `<InputField>` and `<TextareaField>` has an associated `<label>` via `htmlFor` + `id` pairing; no placeholder-only labels |
| Error announcements | `<InlineAlert>` rendered with `role="alert"` and `aria-live="assertive"` so screen readers announce submission outcome without focus movement |
| Field errors | Inline per-field error messages linked via `aria-describedby`; invalid fields marked `aria-invalid="true"` |
| Submit state | Button has `aria-busy="true"` and `aria-label="Sending…"` while the request is in flight |
| Map embed | `<iframe title="Map showing Luthas Center location">` with `tabIndex={0}` and keyboard-focusable; wrapped in `<figure>` with visible `<figcaption>` |
| Focus management | On successful submit, focus moves to the InlineAlert success message (`tabIndex={-1}` + `focus()`) |
| Skip link | `<a href="#contact-form">Skip to contact form</a>` at page top (visible on focus) |
| Color contrast | All text on `color.surface.alt` and `color.primary` backgrounds must meet WCAG AA (4.5 : 1 for normal text); verified during token generation |
| Touch targets | Submit button minimum 44 × 44 px on mobile; icon link buttons minimum 44 × 44 px touch area via padding |
| Reduced motion | Map embed transition and any fade-in animations wrapped in `@media (prefers-reduced-motion: reduce)` |

---

## 7. Stitch Prompt

```
Design a Contact page for "Luthas Center" — a nonprofit education and mental-health resources platform with the tagline "Impossible to Inevitable". Tone: empowering, calm, accessible, trustworthy.

Brand tokens to apply:
- Background: color.surface (page), color.surface.alt (hero band)
- Primary action: color.primary (button fill), color.primary.foreground (button text)
- Accent: color.accent (focus rings, inline success state)
- Typography: font.heading (h1, h2 headings), font.body (body copy, labels, inputs)
- Spacing unit: space.4 (base), scaled via multiples (space.2, space.6, space.8, space.16)
- Border radius: radius.md (cards, inputs), radius.lg (map embed container)
- Shadow: shadow.card (OrgInfo card elevation)

Layout — desktop (1280 px canvas):
1. Full-width hero band (color.surface.alt bg, py space.16): h1 "Get In Touch" in font.heading/3xl, subtitle "We'd love to hear from you." in font.body/lg, color.text.secondary.
2. Two-column content area (max-width 1120 px, centered, gap space.8):
   - LEFT column (2/3 width): h2 "Send a Message" in font.heading/xl. Contact form with four fields stacked — Name (text input), Email (email input), Subject (text input), Message (textarea, 6 rows). Each field has a visible label above it (font.body/sm, color.text.secondary), input border color.border, radius.md, focus ring color.accent. Primary submit button full width, color.primary fill, font.heading/sm, radius.md, label "Send Message". Below button: reserved space for success (color.accent tint bg, checkmark icon) or error (color.error tint bg, warning icon) inline alert.
   - RIGHT column (1/3 width, sticky top): InfoCard (bg color.surface, shadow.card, radius.md, padding space.6). h2 "Contact Information" in font.heading/lg. Address block (org name bold, street, city/state/zip), phone link, email link, horizontal divider, social icon row (3 icons). Below InfoCard: Google Maps embed in rounded container (radius.md), 16/9 aspect ratio.
3. Full-width soft CTA strip (bg color.primary at 8% opacity, py space.8): centered text "Stay connected — subscribe to updates" with ghost button "Subscribe", divider "|", "Support our work" with ghost button "Donate". Both buttons use color.primary outline, radius.md.
4. Standard global footer (color.surface.alt bg).

Mobile (390 px canvas): single column. Hero → OrgInfo Card (full width) → Form → Map → CTA Strip → Footer. All paddings halved. Textarea shrinks to 4 rows.

Ensure WCAG AA contrast on all text. No raw hex — reference only the token names listed above.
```
