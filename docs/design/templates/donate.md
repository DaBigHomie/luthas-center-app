# Donate — Layout Spec

Route: `/give/[slug]`  
Applies to all three donation forms: `fund-education-initiatives`, `operational-expenses`, `mental-health-services-program`.

---

## 1. Purpose

The Donate template converts site visitors into financial supporters of The Luthas Center. It must communicate mission impact clearly, reduce friction to giving, and reassure donors about trust and security — all within the brand's empowering, calm, accessible tone. In v1 there is no native payment collection; the primary CTA is an external redirect to the hosted GiveWP / Stripe checkout link.

---

## 2. Responsive Layout — ASCII Wireframes

### Mobile (< 768 px)

```
┌─────────────────────────────┐
│  [GlobalHeader / nav]       │
├─────────────────────────────┤
│  HERO BANNER                │
│  ┌─────────────────────┐   │
│  │  title (h1)         │   │
│  │  tagline            │   │
│  │  [Donate Now] btn   │   │  ← anchor-scrolls to #give-form
│  └─────────────────────┘   │
├─────────────────────────────┤
│  GOAL PROGRESS              │
│  ┌─────────────────────┐   │
│  │  $825 raised of     │   │
│  │  $50,000 goal       │   │
│  │  [progress bar]     │   │
│  │  2% funded          │   │
│  └─────────────────────┘   │
├─────────────────────────────┤
│  IMPACT STATEMENT           │
│  "Your gift makes it        │
│   possible to…"             │
│  (2-3 short paragraphs      │
│   pulled from form.content) │
├─────────────────────────────┤
│  GIVING LEVELS              │  id="give-form"
│  ┌─────────────────────┐   │
│  │  [$10/mo] pill      │   │
│  │  [$25/mo] pill ★    │   │  ← default selected
│  │  [$50/mo] pill      │   │
│  │  [$100/mo] pill     │   │
│  │  [$250/mo] pill     │   │
│  │  [Custom $____]     │   │
│  └─────────────────────┘   │
│  level description text     │
│  (price_levels[n].text)     │
├─────────────────────────────┤
│  FREQUENCY TOGGLE           │
│  [Monthly] [One-time]       │
├─────────────────────────────┤
│  PRIMARY CTA                │
│  ┌─────────────────────┐   │
│  │  [Donate $25/month] │   │  ← external link, opens in new tab
│  │  Secure · GiveWP    │   │
│  └─────────────────────┘   │
├─────────────────────────────┤
│  TRUST SIGNALS              │
│  🔒 SSL  |  501(c)3  |      │
│  GiveWP logo                │
├─────────────────────────────┤
│  OTHER FORMS                │
│  (if slug ≠ current form)   │
│  [Education] [Mental Health]│
├─────────────────────────────┤
│  FAQ ACCORDION              │
│  Is my donation tax-deduct? │
│  Can I cancel monthly?      │
│  How are funds used?        │
├─────────────────────────────┤
│  [GlobalFooter]             │
└─────────────────────────────┘
```

### Desktop (≥ 1024 px)

```
┌──────────────────────────────────────────────────────────────┐
│  [GlobalHeader / nav — full width]                           │
├──────────────────────────────────────────────────────────────┤
│                      HERO BANNER                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  h1 title                        [Donate Now] btn   │    │
│  │  tagline / subtitle                                  │    │
│  └─────────────────────────────────────────────────────┘    │
├────────────────────────────┬─────────────────────────────────┤
│  LEFT COLUMN (55%)         │  RIGHT COLUMN (45%, sticky)     │
│                            │                                  │
│  GOAL PROGRESS             │  ┌───────────────────────────┐  │
│  [progress bar]            │  │  GIVING LEVELS  id=give   │  │
│  $825 raised · 2% funded   │  │  [$10] [$25]★ [$50]       │  │
│                            │  │  [$100] [$250]            │  │
│  IMPACT STATEMENT          │  │  [Custom $____]           │  │
│  form.content paragraphs   │  │                           │  │
│                            │  │  [Monthly] [One-time]     │  │
│  TRUST SIGNALS             │  │                           │  │
│  🔒 SSL  501(c)3  GiveWP   │  │  [Donate $25/month]  CTA  │  │
│                            │  │  Secure checkout →        │  │
│  FAQ ACCORDION             │  └───────────────────────────┘  │
│  (3–4 items collapsible)   │                                  │
│                            │  OTHER FORMS (card links)        │
│                            │  [Education] [Mental Health]     │
├────────────────────────────┴─────────────────────────────────┤
│  [GlobalFooter — full width]                                 │
└──────────────────────────────────────────────────────────────┘
```

---

## 3. Section-by-Section Table

| Section | Component | Content source field | Behavior |
|---|---|---|---|
| **GlobalHeader** | `<Header>` shared shell | Static nav links | Sticky top; transparent over hero, opaque on scroll |
| **Hero Banner** | `<PageHero variant="donate">` | `donation_forms.title` (h1); static tagline fallback "Your gift makes impossible, inevitable." | Anchor CTA `#give-form` smooth-scrolls; background uses `color.primary` gradient |
| **Goal Progress** | `<GoalMeter>` | `donation_stats.total_earnings` (numerator); `donation_forms.goal_amount` (denominator) | Progress bar fills proportionally; percentage computed client-side; animated fill on mount |
| **Impact Statement** | `<RichText>` | `donation_forms.content` (HTML, sanitized) | Falls back to mission copy if content is empty string; max 3 paragraphs shown, "Read more" collapses the rest |
| **Giving Levels** | `<DonationLevelPicker>` | `donation_forms.price_levels` jsonb array: `amount`, `text`, `recurring`, `period` | Pill buttons; default selected = `set_price` (25); selecting a pill updates CTA label; custom amount shows free-text input validated as positive integer |
| **Level Description** | `<Text variant="caption">` | `price_levels[n].text` | Appears below selected pill; empty for levels with null text |
| **Frequency Toggle** | `<SegmentedControl>` | `price_levels[n].recurring`, `period` | Monthly / One-time; Monthly pre-selected when `recurring: true`; toggling updates CTA label and external URL params |
| **Primary CTA** | `<Button variant="primary" size="lg">` | Static label template: "Donate $\{amount\}/\{period\}" | `href` = external GiveWP/Stripe URL; `target="_blank" rel="noopener noreferrer"`; disabled state while no amount selected |
| **Trust Signals** | `<TrustBar>` | Static: SSL badge, "501(c)3 nonprofit", GiveWP logo SVG | Horizontal flex row; icons from `media` table or inline SVG; no external image requests |
| **Other Forms** | `<CardGrid cols={2}>` of `<DonationFormCard>` | `donation_forms.title`, `donation_forms.slug`; excludes current slug | Links to `/give/[slug]`; shown only when siblings exist |
| **FAQ Accordion** | `<Accordion>` | Static copy (3–4 items authored in component, not CMS) | One item open at a time; aria-expanded on trigger |
| **GlobalFooter** | `<Footer>` shared shell | Static | Standard site footer |

---

## 4. Primitives Used

From `src/shared/components/primitives/` (component library):

| Primitive | Token(s) applied | Notes |
|---|---|---|
| `<Button variant="primary" size="lg">` | `color.primary`, `color.onPrimary`, `radius.md`, `space.4`, `font.body` | Donate CTA |
| `<Button variant="ghost">` | `color.surface`, `color.primary` | "Read more" toggle |
| `<ProgressBar>` | `color.accent` (fill), `color.surfaceSubtle` (track), `radius.sm` | Goal meter fill |
| `<SegmentedControl>` | `color.surface`, `color.primary`, `radius.sm` | Monthly/One-time |
| `<PillButton selected / unselected>` | `color.primary` (selected bg), `color.surfaceBorder` (unselected border), `radius.full` | Giving level pills |
| `<TextInput>` | `color.surface`, `color.surfaceBorder`, `radius.sm`, `font.body` | Custom amount field |
| `<Accordion>` | `color.surface`, `color.surfaceBorder`, `radius.md` | FAQ |
| `<Card>` | `color.surface`, `radius.md`, `space.4`, shadow token | Other forms cards |
| `<RichText>` | `font.body`, `color.onSurface` | Sanitized HTML body |
| `<Text variant="heading-1">` | `font.heading` | h1 |
| `<Text variant="caption">` | `font.body`, `color.onSurfaceSubtle` | Level description |
| `<Badge>` | `color.accent`, `color.onAccent` | "Most popular" on $25 pill |

---

## 5. Data Requirements

### `donation_forms` table

| Column | Type | Used by |
|---|---|---|
| `id` | uuid | Row key; URL param lookup |
| `slug` | text | Route match `/give/[slug]` |
| `title` | text | `<PageHero>` h1 |
| `content` | text (HTML) | Impact Statement `<RichText>` |
| `goal_amount` | numeric | `<GoalMeter>` denominator |
| `price_levels` | jsonb | `donation_levels[].amount`, `.text`, `.recurring`, `.period` — drives `<DonationLevelPicker>` |
| `set_price` | numeric | Default selected level amount |
| `custom_amount` | boolean | Controls visibility of custom amount `<TextInput>` |
| `status` | text | Filter: `status = 'publish'` only |

### `donation_stats` table

| Column | Type | Used by |
|---|---|---|
| `form_id` | uuid | Join to `donation_forms.id` |
| `total_earnings` | numeric | `<GoalMeter>` numerator |
| `total_sales` | integer | Social proof label "X donors so far" |

### Supabase query pattern (pseudo-SQL)

```sql
-- Single form page
SELECT
  df.id, df.slug, df.title, df.content,
  df.goal_amount, df.price_levels, df.set_price, df.custom_amount,
  ds.total_earnings, ds.total_sales
FROM donation_forms df
LEFT JOIN donation_stats ds ON ds.form_id = df.id
WHERE df.slug = $1
  AND df.status = 'publish';

-- Sibling forms for "Other Forms" section
SELECT id, title, slug
FROM donation_forms
WHERE status = 'publish'
  AND slug <> $1;
```

---

## 6. Accessibility Notes

| Concern | Implementation |
|---|---|
| **Landmark regions** | `<header>`, `<main>`, `<footer>` semantic elements; giving widget wrapped in `<section aria-labelledby="give-heading">` |
| **Heading order** | h1 = form title (hero); h2 = "Your Impact", "Make a Gift", "Frequently Asked"; h3 = individual FAQ questions — no skipped levels |
| **Progress bar** | `role="progressbar" aria-valuenow="{earnings}" aria-valuemin="0" aria-valuemax="{goal_amount}" aria-label="Fundraising progress"` |
| **Giving level pills** | Rendered as `<button type="button">` with `aria-pressed` toggled; group wrapped in `<fieldset><legend>Choose a giving level</legend>` |
| **Custom amount input** | `<label for="custom-amount">Enter a custom amount</label>` visible label; `aria-describedby` points to error message span |
| **Frequency toggle** | `role="group" aria-label="Donation frequency"` on `<SegmentedControl>`; each option is a radio-equivalent button with `aria-pressed` |
| **Primary CTA** | Button label updates dynamically; `aria-live="polite"` region announces updated label to screen readers |
| **Focus management** | Tab order: hero CTA → goal meter (skip with Tab) → level picker → frequency toggle → CTA button → trust bar → other forms → FAQ |
| **Keyboard** | Pill buttons and accordion triggers fully keyboard operable (Enter/Space activate); accordion arrow-key navigation per ARIA APG disclosure pattern |
| **Colour contrast** | All text/bg pairs meet WCAG AA 4.5:1 using semantic tokens; do not override with raw values |
| **Alt text** | GiveWP logo: `alt="Powered by GiveWP"`; SSL badge: `alt="SSL Secured"`; 501(c)3 badge: `alt="IRS-recognised 501(c)(3) nonprofit"` |
| **Motion** | Progress bar fill animation respects `prefers-reduced-motion`; wrap in CSS `@media (prefers-reduced-motion: no-preference)` |
| **External link** | CTA `<a>` includes `<span class="sr-only">(opens in new tab)</span>` inside button text |

---

## 7. Stitch Prompt

```
Design a Donate page for "The Luthas Center" — a nonprofit education and mental-health platform with the tagline "Impossible to Inevitable." Tone: empowering, calm, accessible, trustworthy.

Brand tokens (use these names — do not invent hex values):
- Backgrounds: color.surface, color.surfaceSubtle
- Brand: color.primary, color.onPrimary, color.accent, color.onAccent
- Text: color.onSurface, color.onSurfaceSubtle
- Border: color.surfaceBorder
- Typography: font.heading (headings), font.body (body + labels)
- Radius: radius.sm, radius.md, radius.full
- Spacing scale: space.2, space.4, space.6, space.8, space.12

Page sections (top to bottom):
1. HERO BANNER — full-width color.primary gradient background; h1 "Donate to The Luthas Center" in font.heading color.onPrimary; subtitle "Your gift makes the impossible, inevitable."; a single large primary Button "Donate Now" (color.primary, radius.md) that anchor-scrolls to the giving widget.

2. GOAL PROGRESS — centered card (color.surface, radius.md, space.6 padding); label "$825 raised of $50,000 goal"; horizontal ProgressBar (color.accent fill, color.surfaceSubtle track, radius.sm); "2% funded · 6 donors so far" caption in font.body color.onSurfaceSubtle.

3. TWO-COLUMN LAYOUT (desktop) / stacked (mobile):
   LEFT: Impact Statement in font.body color.onSurface — 2 paragraphs about counseling sessions, wellness workshops, telehealth services. Trust bar below: SSL badge + "501(c)3 Nonprofit" + "Powered by GiveWP" — horizontal flex, color.onSurfaceSubtle.
   RIGHT (sticky card, color.surface, radius.md, shadow): 
     - Section heading h2 "Make a Gift" font.heading
     - Giving level pills in a flex-wrap grid: [$10/mo], [$25/mo — "Most Popular" badge in color.accent], [$50/mo], [$100/mo], [$250/mo] — pills use PillButton style: selected = color.primary bg color.onPrimary text, unselected = color.surface bg color.surfaceBorder border, radius.full
     - Below $25 pill (selected state): caption "Helps fund one counseling session for an individual in need"
     - Custom amount TextInput: label "Or enter a custom amount", color.surface bg, color.surfaceBorder border, radius.sm
     - Frequency SegmentedControl: [Monthly] [One-time] — Monthly pre-selected
     - Primary CTA Button full-width: "Donate $25/month" — color.primary bg, color.onPrimary text, radius.md, font.body bold, size large; sub-label "Secure checkout via GiveWP →" in color.onSurfaceSubtle caption

4. FAQ ACCORDION — color.surface cards, radius.md, color.surfaceBorder dividers; 3 items: "Is my donation tax-deductible?", "Can I cancel my monthly donation?", "How are funds used?" — chevron icon rotates on expand.

5. OTHER DONATION FORMS — 2-column card grid (color.surface, radius.md, color.surfaceBorder border): "Fund Education Initiatives" card, "Mental Health Services Program" card — each with title, one-line description, ghost Button "Give to this fund".

Responsive: single-column stack on mobile (<768px), two-column layout (55/45 split) on desktop (≥1024px) with the giving widget sticky on desktop. Generous whitespace using space.8 between sections. No raw hex values anywhere — only the token names listed above.
```
