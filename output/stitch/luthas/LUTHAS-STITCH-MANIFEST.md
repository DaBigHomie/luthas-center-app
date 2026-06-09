# Luthas Center for Excellence — Stitch Design Prompt Manifest

**Version:** 1.0 | **Wave:** `luthas-v1` | **Date:** 2026-06-08 | **Total Plates:** 18
**Design SSOT:** `src/shared/design/tokens.ts`
**Token SSOT:** `src/shared/design/tokens.ts` → `color`, `font`, `radius`, `shadow`, `space`
**Template SSOT:** `docs/design/templates/*.md`
**Component SSOT:** `docs/design/components.md`
**Strategy:** Adapted from MIH `STITCH-PROMPTING-STRATEGY.md` — 13-block composition

> These plates are the **design reference** for the Luthas Center for Excellence platform.
> They let you generate or regenerate any surface in Google Stitch for visual QA and stakeholder
> sign-off. Each prompt is self-contained (shared blocks inlined) so it can be pasted directly
> into Stitch without additional context.

---

# SHARED BLOCKS — Reference (inlined verbatim in every prompt below)

## BLOCK 1: BRAND PREAMBLE

```
BRAND: Luthas Center for Excellence — a nonprofit LMS and mental-health-resources platform.
Tagline: "Impossible to Inevitable". Mission: transforming lives through education, mental health
support, and community empowerment.
DEMOGRAPHIC: Adults 18–55 seeking education, career transformation, and mental-health resources.
Includes first-generation learners, single parents, career-changers, and community advocates.
PLATFORM: Mobile-first responsive web (Next.js 15 + App Router). Mobile 390px → Desktop 1280px.
VIBE: Calm, empowering, trustworthy. Editorial nonprofit energy — not a SaaS dashboard, not a
corporate website. Accessible, warm, credible. "The content transforms. The design serves the content."
COLORS (from src/shared/design/tokens.ts):
  color.primary hsl(0,0%,7%) — deep near-black (primary buttons, key text, CTA fills)
  color.primary-hover hsl(0,0%,32%) — mid-charcoal (button hover state)
  color.secondary hsl(216,72%,21%) — deep navy blue (headings, key UI accents)
  color.accent hsl(19,94%,55%) — warm orange #f86320 (badges, highlights, donation levels selected, newsletter band)
  color.background hsl(0,0%,100%) — white page base
  color.surface hsl(0,0%,96%) — off-white card backgrounds
  color.surface-raised hsl(0,0%,93%) — slightly deeper surface for cards and inputs
  color.surface-overlay hsl(0,0%,7%) — dark overlay for hero gradients and drawers
  color.text hsl(0,0%,24%) — near-black body text
  color.text-muted hsl(0,0%,46%) — secondary/meta text
  color.text-inverse hsl(0,0%,100%) — white text on dark backgrounds
  color.border hsl(0,0%,93%) — subtle light dividers
  color.border-focus hsl(198,61%,51%) — sky blue focus ring
  color.error hsl(353,94%,51%) — red
  color.success hsl(130,48%,34%) — accessible green
  color.warning hsl(35,79%,54%) — amber
  color.info hsl(198,61%,51%) — sky blue
FONTS: Heading: Montserrat 700 (h1–h3, wordmark, card titles) | Body: Lato 400/600/700 (all body, labels, nav)
RULES: Light mode (white/off-white backgrounds). Never dark-mode. Touch targets ≥ 44px. Card radius = radius.lg (8px). Section spacing = space.8 (32px) / space.16 (64px). No emoji in UI. Use SVG icons (Heroicons or Lucide, 20–24px). Warm orange accent = primary brand energy. Deep navy = trustworthy authority. No raw hex — token names only.
```

## BLOCK 2: LOCKED UI COMPONENTS

```
COMPONENTS:
- HEADER: Sticky 64px bar, color.surface bg, shadow.sm on scroll. Left: Luthas Center
  wordmark (Montserrat 700, 18px, color.primary). Right (desktop): nav links — Courses,
  Resources, Blog, About, Give — Lato 500 14px color.text. "Donate" CTA button (primary,
  radius.md, 40px height) far right. Mobile: wordmark left + hamburger icon right (44×44
  target); full-height drawer slides in from left, backdrop overlay color.surface-overlay 60%.
- FOOTER: color.surface-raised bg. Desktop: 4-column grid — col 1: logo + tagline + social
  icons (circular ghost 40px); cols 2–4: link groups Learn / Support / Community. Bottom bar:
  copyright + legal links. Mobile: stacked, nav groups in accordion, Donate CTA above copyright.
- CARDS: color.surface bg, radius.lg (8px), 1px color.border, shadow.md on hover + translateY(-2px).
  Heading: Montserrat 700. Body: Lato 400 color.text-muted.
- CTA PRIMARY: color.primary fill, color.text-inverse text, radius.md, 40–48px height, Lato 700.
  Hover: color.primary-hover.
- CTA SECONDARY / GHOST: transparent bg, 1px color.primary border, color.primary text, radius.md.
- DONATION LEVEL BUTTON: color.surface-raised bg, 1px color.border, Lato 700. Selected state:
  color.accent bg, color.text-inverse text, 1px color.accent border.
- PROGRESS BAR: track color.border, fill color.primary, radius.full, 8px height.
- BADGE/TAG PILL: radius.full, Lato 600 font.size.xs. Accent variant: color.accent @15% bg +
  color.accent text. Primary variant: color.primary @10% bg + color.primary text.
```

## BLOCK 3: STYLE DIRECTIVES

```
STYLE: High-fidelity responsive web UI mockup at Figma/Framer presentation quality.
Clean editorial nonprofit design language. Light backgrounds (white and off-white surfaces)
with warm orange (#f86320 / color.accent) as the energizing accent color and deep near-black
(color.primary) for authority. No gradients except subtle hero image overlays using
color.surface-overlay. Photography-forward hero sections with dark gradient scrim ensuring
text contrast. Generous whitespace (8px base grid, section padding space.8–space.16). Cards
with subtle border and shadow.md on hover. Montserrat for headings, Lato for body.
Typography hierarchy: H1 Montserrat 700 font.size.4xl / H2 Montserrat 700 font.size.3xl /
H3 Montserrat 700 font.size.2xl / Body Lato 400 font.size.base. Clean, accessible,
empowering — NOT a dark-mode SaaS tool, NOT a corporate brochure.
```

## BLOCK 4: NEGATIVE CONSTRAINTS

```
NEGATIVE: NO dark mode or dark backgrounds — this is a light-mode platform. NO raw hex
values anywhere — use token names. NO emoji in the UI chrome. NO neon or glowing accents.
NO gradient buttons (flat fills only). NO hamburger menus on desktop (full nav visible ≥ 1024px).
NO blue-on-white CTAs without sufficient contrast. NO decorative patterns or textures that
reduce readability. NO wireframes or lo-fi mockups — full-color high-fidelity only.
NO Lorem ipsum placeholder text — use realistic nonprofit education content.
NO Bootstrap or default component library styling — all colors from brand token palette.
NO pure black (#000000) on backgrounds — use color.primary hsl(0,0%,7%) for near-black.
NO Roboto or generic sans-serif substitutes — Montserrat for headings, Lato for body.
NO cluttered layouts — generous whitespace is a brand signal.
```

## BLOCK 5: BACKGROUND

```
BACKGROUND: Clean white color.background (#ffffff). Presentation on a neutral light gray
canvas outside the screen frame. Subtle color.border dividers between sections.
No ambient glow effects. Hero sections use full-bleed photography with
color.surface-overlay gradient scrim from bottom (transparent → hsl(0,0%,7%) at 60%
opacity) for text contrast. Section alternation: white bg sections interleave with
color.surface (hsl(0,0%,96%)) bg sections for visual rhythm.
```

---

# ═══════════════════════════════════════════════════
# SECTION 1 — HOME
# Plate LCE-01 | 2 Prompts (mobile + desktop)
# ═══════════════════════════════════════════════════

---

## PROMPT LCE-01-A — Home Page (Mobile 390px)

```
BRAND: Luthas Center for Excellence — nonprofit LMS and mental-health-resources platform.
Tagline: "Impossible to Inevitable". Mission: transforming lives through education, mental health
support, and community empowerment.
DEMOGRAPHIC: Adults 18–55 seeking education, career transformation, and mental-health resources.
Includes first-generation learners, single parents, career-changers, and community advocates.
PLATFORM: Mobile-first responsive web (Next.js 15 + App Router). Mobile 390px → Desktop 1280px.
VIBE: Calm, empowering, trustworthy. Editorial nonprofit energy — not a SaaS dashboard, not a
corporate website. Accessible, warm, credible.
COLORS: color.primary hsl(0,0%,7%) | color.secondary hsl(216,72%,21%) | color.accent hsl(19,94%,55%)
  color.background hsl(0,0%,100%) | color.surface hsl(0,0%,96%) | color.surface-raised hsl(0,0%,93%)
  color.text hsl(0,0%,24%) | color.text-muted hsl(0,0%,46%) | color.text-inverse hsl(0,0%,100%)
  color.border hsl(0,0%,93%) | color.border-focus hsl(198,61%,51%)
FONTS: Heading: Montserrat 700 | Body: Lato 400/600/700
RULES: Light mode only. Touch targets ≥ 44px. Card radius = 8px. No emoji. No raw hex.

SUBJECT: Luthas Center Home page — mobile 390px viewport. Full page scroll mockup.

STICKY HEADER (64px): White bar. Left: "Luthas Center" wordmark Montserrat 700 16px color.primary.
Right: hamburger icon 24px color.text (44×44 touch target).

HERO SECTION: Full-width 390px. Background: photo of a confident Black woman student at a
desk, laptop open, warm natural lighting, calm study environment. Dark gradient scrim from
bottom (transparent to hsl(0,0%,7%) at 55%). Overlay text center-aligned: "Impossible to
Inevitable" in Montserrat 700 32px color.text-inverse. Subheadline 2 lines in Lato 400 16px
color.text-inverse at 85% opacity: "Free courses, mental-health resources, and community
support — designed for your journey." Two buttons stacked: primary "Enroll Now" (color.primary
fill, color.text-inverse, 48px height, full width minus margins) and ghost "Explore Courses"
(transparent, 1px color.text-inverse border, same size).

FEATURED COURSES (color.surface bg section): h2 "Featured Courses" Montserrat 700 22px
color.primary. 3 course cards stacked vertically. Each card: color.background, radius.lg,
shadow.sm. Cover image 16:9 top. Below: "Mental Health" category pill (color.accent @15% bg,
color.accent text, radius.full, Lato 600 12px). Course title Montserrat 700 18px color.primary
(2-line clamp). Excerpt Lato 400 14px color.text-muted (2-line clamp). "Free" badge
(color.success @15% bg, color.success text). "View Course →" text link color.accent. Sample
courses: "Communicating with EQ", "Navigating Financial Freedom", "Mental Health First Aid".

MISSION + DONATE SECTION (white bg): h2 "Our Mission" Montserrat 700 22px color.primary.
Mission text Lato 400 16px color.text: "At the Luthas Center for Excellence, our exceptional
strength lies in our wholehearted dedication to transforming lives." 3 bullet points:
"Integrating life-transforming programs", "Creating spaces for well-being", "Championing
inclusive growth". "Learn about our work →" link in color.accent.
Below: Donation card (color.surface-raised bg, radius.xl, 1px color.border). h3 "Fund
Education Initiatives" Montserrat 700 18px. "$825 raised of $50,000" Lato 600 14px
color.text-muted. Progress bar (color.border track, color.primary fill, 8px height, radius.full).
Amount pills row: [$10] [$25] [$50] [$100] [Custom] — each color.surface-raised bg 1px
color.border radius.full Lato 700 14px. "$25" selected: color.accent bg, color.text-inverse text.
"Donate Now" primary button full-width.

RECENT POSTS (color.surface bg): h2 "From the Blog" Montserrat 700 22px. 3 post cards stacked.
Each: 16:9 thumbnail, category pill (color.accent variant), h3 title Montserrat 700 16px,
date Lato 400 12px color.text-muted.

NEWSLETTER BAND (color.accent @12% bg, radius.xl): h2 "Stay in the loop" Montserrat 700 20px.
Subtext Lato 400 14px. Email input full-width (color.surface-raised bg, 1px color.border,
radius.md, 44px). "Subscribe" primary button full-width.

FOOTER: color.surface-raised bg. Wordmark centered, social icons row (Instagram, Facebook,
LinkedIn — 40px ghost circles). "Learn" "Support" "Community" link groups stacked. Copyright
Lato 400 12px color.text-muted.

SCENE: The home page is the nonprofit's front door. The hero photo establishes empowerment and
aspiration. Course cards surface immediate value (all free). The donation panel communicates
mission without pressure. The warm orange accent appears on selected states and badges — never
overwhelming, always purposeful.

STYLE: High-fidelity light-mode responsive web UI mockup at Figma/Framer quality. Clean
editorial nonprofit design. White and off-white surfaces. Warm orange color.accent as energizing
highlight. Deep near-black color.primary for authority. Photography-forward hero with dark
gradient scrim. Generous whitespace. Montserrat headings, Lato body.
NEGATIVE: NO dark mode. NO raw hex. NO emoji in UI. NO gradient buttons. NO neon accents.
NO wireframes — full color, high-fidelity. NO Lorem ipsum. NO cluttered layouts.
BACKGROUND: Clean white canvas outside screen frame. Section alternation: white and
color.surface off-white. Hero uses full-bleed photo with dark scrim overlay.
```

---

## PROMPT LCE-01-B — Home Page (Desktop 1280px)

```
BRAND: Luthas Center for Excellence — nonprofit LMS and mental-health-resources platform.
Tagline: "Impossible to Inevitable". Mission: transforming lives through education, mental health
support, and community empowerment.
DEMOGRAPHIC: Adults 18–55 seeking education, career transformation, and mental-health resources.
PLATFORM: Mobile-first responsive web (Next.js 15 + App Router). Desktop 1280px viewport.
VIBE: Calm, empowering, trustworthy. Editorial nonprofit. Accessible, warm, credible.
COLORS: color.primary hsl(0,0%,7%) | color.secondary hsl(216,72%,21%) | color.accent hsl(19,94%,55%)
  color.background hsl(0,0%,100%) | color.surface hsl(0,0%,96%) | color.surface-raised hsl(0,0%,93%)
  color.text hsl(0,0%,24%) | color.text-muted hsl(0,0%,46%) | color.text-inverse hsl(0,0%,100%)
FONTS: Heading: Montserrat 700 | Body: Lato 400/600/700
RULES: Light mode only. No raw hex. No emoji.

SUBJECT: Luthas Center Home page — desktop 1280px viewport.

TOP NAV (64px sticky): color.background, shadow.sm. Left: "Luthas Center" wordmark Montserrat 700
18px color.primary. Center: nav links "Courses" "Resources" "Blog" "About" "Give" — Lato 500 14px
color.text, hover → color.accent underline. Right: "Sign In" Lato 500 14px color.text-muted +
"Donate" primary button 40px height.

HERO (full-width, 520px height): Full-bleed photo — diverse group of adult learners around a
table, warm collaborative lighting, notebooks and laptops visible. Dark gradient scrim from left
(transparent 50% to hsl(0,0%,7%) 70%). Left-aligned text content over image: eyebrow "Nonprofit
Education + Mental Health" Lato 600 13px color.accent small-caps. h1 "Impossible to Inevitable"
Montserrat 700 48px color.text-inverse leading.tight. Subheadline 2 sentences Lato 400 18px
color.text-inverse @85%. Two buttons side by side: "Enroll Now" primary (48px) +
"Explore Courses" ghost (same size, white border, white text). Stat strip below buttons: 3
items — "47 Courses" | "Free Access" | "501(c)(3) Nonprofit" — Lato 600 14px color.text-inverse.

FEATURED COURSES (color.surface bg, full-width): h2 "Featured Courses" Montserrat 700 28px
color.primary left-aligned + "View all courses →" text link color.accent right. 3-column card
grid 32px gap. Each card: color.background, radius.lg, shadow.sm → shadow.md on hover, translateY(-2px).
Cover image 16:9, category pill (color.accent @15% bg, color.accent text), h3 title Montserrat 700
20px color.primary (2-line clamp), excerpt Lato 400 14px color.text-muted (2 lines), "Free" badge
color.success @15%, "View Course →" link color.accent.

MISSION + DONATE (white bg, 2-column 50/50): Left panel: h2 "Our Mission" Montserrat 700 28px
color.primary. Mission excerpt Lato 16px color.text. 3 bullet points with color.accent check icons.
"Learn about our work →" link. Right panel: Donation card color.surface-raised, radius.xl, padding
space.6. h3 "Fund Education Initiatives" Montserrat 700 20px. Goal progress row + progress bar.
Amount pills row: [$10][$25 — selected/accent][$50][$100][Custom]. "Donate Now" full-width primary btn.

RECENT POSTS (color.surface bg): h2 "From the Blog" Montserrat 700 28px + "Read the blog →" link.
3-column PostCard grid. Each: 16:9 image, category pill, h3 Montserrat 700 18px, date/author Lato
400 12px color.text-muted.

NEWSLETTER BAND (color.accent @12% tint, centered): h2 "Stay in the loop" Montserrat 700 24px.
Subtext Lato 16px. Inline row: email input (280px, radius.md) + "Subscribe" primary btn adjacent.

FOOTER (color.surface-raised): 4-column desktop grid. Wordmark + tagline + social icons col 1.
Link groups: Learn, Support, Community cols 2–4. Bottom bar: copyright + Privacy + Terms.

SCENE: Desktop layout expands hero to cinematic width with left-aligned editorial typography.
The 3-column grid immediately communicates depth of course library. The 2-column mission/donate
section balances story (left) with action (right). The orange accent energy appears sparingly —
selected states, badges, CTA hover — keeping the layout calm and professional.

STYLE: High-fidelity light-mode responsive web UI at Figma quality. Clean editorial nonprofit.
White and off-white surfaces, warm orange accent, deep near-black authority. Photography-forward.
Generous whitespace. Montserrat headings, Lato body.
NEGATIVE: NO dark mode. NO raw hex. NO emoji. NO gradient buttons. NO neon. NO wireframes.
BACKGROUND: Neutral light gray presentation canvas. Screen shown as 1280px browser window.
```

---

# ═══════════════════════════════════════════════════
# SECTION 2 — ABOUT
# Plate LCE-02 | 1 Prompt (desktop — representative)
# ═══════════════════════════════════════════════════

---

## PROMPT LCE-02-A — About Page (Desktop 1280px)

```
BRAND: Luthas Center for Excellence — nonprofit LMS + mental-health platform. Tagline: "Impossible to Inevitable."
DEMOGRAPHIC: Adults 18–55 — learners, donors, community advocates.
PLATFORM: Next.js 15 responsive web. Desktop 1280px.
VIBE: Calm, empowering, trustworthy.
COLORS: color.primary hsl(0,0%,7%) | color.secondary hsl(216,72%,21%) | color.accent hsl(19,94%,55%)
  color.background hsl(0,0%,100%) | color.surface hsl(0,0%,96%) | color.surface-raised hsl(0,0%,93%)
  color.text hsl(0,0%,24%) | color.text-muted hsl(0,0%,46%) | color.text-inverse hsl(0,0%,100%)
FONTS: Montserrat 700 headings | Lato 400/600/700 body
RULES: Light mode only. No raw hex. No emoji. WCAG AA contrast.

SUBJECT: About page — desktop 1280px.

HERO (full-width, 420px): Photo — a community gathering, diverse adults listening attentively in
a well-lit classroom or event space, warm empowering atmosphere. Dark gradient scrim center-left.
Overlaid h1 "About" Montserrat 700 48px color.text-inverse. Below: page.excerpt text "At the
Luthas Center for Excellence, our exceptional strength lies in our wholehearted dedication to
transforming lives." Lato 400 18px color.text-inverse @85%. "Donate Now" primary CTA 48px.

MISSION SECTION (color.surface bg, 2-column): Left: h2 "Our Mission" Montserrat 700 28px color.primary.
Two mission pillars each with a large SVG icon (graduation cap / heart): "Transforming Lives" —
"Integrating life-transforming programs…" + "Inclusive Growth" — "Creating spaces that foster
well-being…". Right: full-height photograph — a mentor and student at a whiteboard, warm lighting.
Photo radius.lg overflow-hidden.

COMMITMENTS (white bg): h2 "Our Commitments" Montserrat 700 28px color.primary centered.
4-column grid of commitment cards (color.surface bg, radius.lg, shadow.sm). 12 cards total
(first 4 visible in row 1, rows 2–3 below). Each card: large number "01" Montserrat 700 36px
color.accent @30% (decorative), h3 commitment title Montserrat 700 16px color.primary, body
Lato 400 14px color.text-muted. Commitments: "Unceasing Growth", "Selflessness",
"Transparency", "Non-Judgment", "Servant Leadership", "Intentional Community", "Radical
Inclusion", "Healing-Centered", "Financial Stewardship", "Continuous Learning",
"Advocacy", "Accountability".

DEI CALLOUT (color.accent @10% tint bg, full-width centered band): h2 "Diversity, Equity &
Inclusion" Montserrat 700 28px color.primary. Body text Lato 400 16px color.text. "Read our
DEI statement →" link color.accent.

TEAM SECTION (color.surface bg): h2 "Meet the Team" Montserrat 700 28px. 3-column grid.
Founder card (featured — spans or is largest): avatar circle 80px color.surface-raised,
"Dame Luthas" Montserrat 700 18px, "Founder & Director" Lato 600 14px color.accent, bio
2–3 lines Lato 400 14px color.text-muted. Second team member: "Nasir Luthas", "Co-Director".
Third: placeholder for a third team member. Each card: color.background, radius.lg, shadow.sm,
center-aligned.

SCENE: The About page builds trust through human photography, specific commitments (12 named
ones), and transparent team profiles. The warm orange accent decorates commitment numbers and
role labels — a signal of energy within a calm layout.

STYLE: High-fidelity light-mode web UI. Clean editorial nonprofit. White/off-white surfaces,
warm orange accent, near-black authority. Photography-forward. Generous whitespace.
NEGATIVE: NO dark mode. NO raw hex. NO emoji. NO neon. NO wireframes. NO Lorem ipsum.
BACKGROUND: Neutral presentation canvas. 1280px browser window.
```

---

# ═══════════════════════════════════════════════════
# SECTION 3 — CONTACT
# Plate LCE-03 | 1 Prompt (desktop)
# ═══════════════════════════════════════════════════

---

## PROMPT LCE-03-A — Contact Page (Desktop 1280px)

```
BRAND: Luthas Center for Excellence — nonprofit LMS + mental-health platform. Tagline: "Impossible to Inevitable."
DEMOGRAPHIC: Prospective students, donors, community members, resource seekers.
PLATFORM: Next.js 15 responsive web. Desktop 1280px.
VIBE: Warm, approachable, trustworthy.
COLORS: color.primary hsl(0,0%,7%) | color.accent hsl(19,94%,55%) | color.background hsl(0,0%,100%)
  color.surface hsl(0,0%,96%) | color.surface-raised hsl(0,0%,93%)
  color.text hsl(0,0%,24%) | color.text-muted hsl(0,0%,46%) | color.border hsl(0,0%,93%)
FONTS: Montserrat 700 headings | Lato 400/600/700 body
RULES: Light mode only. No raw hex. No emoji. WCAG AA. Touch targets ≥ 44px.

SUBJECT: Contact page — desktop 1280px.

PAGE HERO (full-width, 240px, color.surface bg): h1 "Get In Touch" Montserrat 700 36px color.primary
centered. Subtext "We're here to help — reach out for courses, partnerships, or mental health
referrals." Lato 400 16px color.text-muted centered.

TWO-COLUMN BODY (white bg):
LEFT (65%): ContactForm card (color.surface-raised bg, radius.xl, shadow.md, padding space.6).
h2 "Send Us a Message" Montserrat 700 22px. Form fields (each: label above Lato 600 12px
color.text-muted, input color.background bg 1px color.border radius.md 44px height Lato 400 16px):
Row 1: Name (50%) + Email (50%). Subject (full width). Message textarea (full width, 140px min-height,
auto-grow). Subject select shows options: "Course Inquiry", "Donate / Partner", "Mental Health
Resource", "Other". "Send Message" primary button full-width 48px. Below button: success alert
(color.success @12% bg, check icon, "Message sent — we'll be in touch within 2 business days.")
shown as example.

RIGHT (35%): OrgInfo card (color.surface-raised bg, radius.xl, shadow.sm, padding space.5).
"Luthas Center for Excellence" Montserrat 700 16px. Address block Lato 400 14px color.text-muted.
Phone + email rows (SVG phone/mail icon 16px color.accent, value Lato 400 14px). Social links:
Instagram, Facebook, LinkedIn icons in 40px ghost circles with color.accent on hover.
Below org card: MapEmbed placeholder (color.surface-raised bg, radius.lg, 240px height, centered
"map" icon 32px color.text-muted + "Location coming soon" text — representing embedded Google Map).

SOFT CTA STRIP (color.accent @10% bg, full-width): "Stay connected" → newsletter link +
"Support our work" → /donate. Both as outlined buttons, color.accent text.

SCENE: The contact form is primary — 65% of page width, immediately visible. The org-info sidebar
gives a human, welcoming presence. The warm orange accent appears on icon highlights and the soft
CTA strip. Form states are shown with a success example to communicate responsiveness.

STYLE: High-fidelity light-mode web UI. Clean, accessible, warm. White/off-white surfaces.
Warm orange accent on icons, links, selected states. Generous whitespace.
NEGATIVE: NO dark mode. NO raw hex. NO emoji. NO neon. NO wireframes. NO Lorem ipsum.
BACKGROUND: Neutral presentation canvas. 1280px browser window.
```

---

# ═══════════════════════════════════════════════════
# SECTION 4 — DONATE
# Plate LCE-04 | 2 Prompts (mobile + desktop)
# ═══════════════════════════════════════════════════

---

## PROMPT LCE-04-A — Donate Page (Mobile 390px)

```
BRAND: Luthas Center for Excellence — nonprofit LMS + mental-health platform. Tagline: "Impossible to Inevitable."
DEMOGRAPHIC: Existing supporters, mission-aligned donors, first-time visitors moved by the cause.
PLATFORM: Next.js 15 responsive web. Mobile 390px.
VIBE: Warm, mission-driven, trustworthy. Calm urgency — generosity feels good here.
COLORS: color.primary hsl(0,0%,7%) | color.accent hsl(19,94%,55%) | color.background hsl(0,0%,100%)
  color.surface hsl(0,0%,96%) | color.surface-raised hsl(0,0%,93%)
  color.text hsl(0,0%,24%) | color.text-muted hsl(0,0%,46%) | color.text-inverse hsl(0,0%,100%)
  color.border hsl(0,0%,93%) | color.success hsl(130,48%,34%)
FONTS: Montserrat 700 headings | Lato 400/600/700 body
RULES: Light mode. No raw hex. No emoji. Touch targets ≥ 44px.

SUBJECT: Donate page /give/fund-education-initiatives — mobile 390px full scroll.

STICKY HEADER: "Donate" Montserrat 700 16px color.primary centered. Back arrow left (44×44).

HERO BANNER (color.primary bg): h1 "Fund Education Initiatives" Montserrat 700 28px
color.text-inverse centered. "Your gift makes it possible to serve communities in need."
Lato 400 15px color.text-inverse @80%. "Donate Now" ghost button (1px color.text-inverse border)
that anchor-scrolls to #give-form.

GOAL PROGRESS (white bg, padding space.6): "$825 raised of $50,000 goal" row — amount Lato 700
20px color.primary + label Lato 400 14px color.text-muted. Progress bar: color.border track,
color.primary fill at ~1.7%, radius.full 10px height. "2% funded" Lato 600 12px color.text-muted.

IMPACT STATEMENT (color.surface bg): h2 "Your Impact" Montserrat 700 20px. 3 short paragraphs
Lato 400 15px color.text. Content: how donations fund courses, mental health resources,
and community programs.

GIVING LEVELS (white bg, id="give-form"): h2 "Choose Your Gift" Montserrat 700 20px.
Frequency toggle: [Monthly] [One-time] — pill toggle, active = color.primary bg color.text-inverse.
Amount pills grid (2×3 + custom): [$10/mo] [$25/mo ★ default — color.accent bg] [$50/mo] [$100/mo]
[$250/mo] [Custom $____]. Each pill: full-width, 52px height, radius.md, Lato 700 16px.
Selected: color.accent bg, color.text-inverse text. Custom input expands below when selected.
Level description text Lato 400 14px color.text-muted below selected pill.

PRIMARY CTA: "Donate $25/month" primary button full-width 52px radius.md Lato 700. Below:
"Secure giving via GiveWP · Opens in new tab" Lato 400 12px color.text-muted.

TRUST SIGNALS (color.surface-raised bg, centered): SSL lock icon + "Secure" | shield icon +
"501(c)(3)" | GiveWP logo. Lato 400 12px color.text-muted. Horizontal row with color.border
dividers.

OTHER FORMS (white bg): "Other Ways to Give" h3 Montserrat 700 16px. Two cards side by side:
"Operational Expenses" + "Mental Health Services" — color.surface-raised, radius.md, Lato 600
14px color.primary.

FAQ ACCORDION: 3 questions (color.surface-raised bg, radius.md, chevron icon): "Is my donation
tax-deductible?", "Can I cancel monthly giving?", "How are funds used?".

SCENE: Mobile donation flow is conversion-focused. The goal progress creates social proof through
transparency. Amount pills are large touch targets with clear selected state. The trust signals
(SSL, 501c3, GiveWP) reduce hesitation. The warm orange selected state on $25 default signals
"this is the right amount."

STYLE: High-fidelity light-mode mobile UI. Clean, trustworthy, warm. White and off-white surfaces.
Color.accent on selected states and key trust elements. Near-black CTAs.
NEGATIVE: NO dark mode. NO raw hex. NO emoji. NO neon. NO wireframes.
BACKGROUND: Light gray canvas. Mobile 390px screen frame.
```

---

## PROMPT LCE-04-B — Donate Page (Desktop 1280px)

```
BRAND: Luthas Center for Excellence — nonprofit LMS + mental-health platform. Tagline: "Impossible to Inevitable."
PLATFORM: Next.js 15 responsive web. Desktop 1280px.
VIBE: Warm, mission-driven, trustworthy.
COLORS: color.primary hsl(0,0%,7%) | color.accent hsl(19,94%,55%) | color.background hsl(0,0%,100%)
  color.surface hsl(0,0%,96%) | color.surface-raised hsl(0,0%,93%)
  color.text hsl(0,0%,24%) | color.text-muted hsl(0,0%,46%) | color.text-inverse hsl(0,0%,100%)
FONTS: Montserrat 700 headings | Lato 400/600/700 body
RULES: Light mode. No raw hex. No emoji.

SUBJECT: Donate page — desktop 1280px two-column layout.

HERO BANNER (color.primary bg, full-width, 280px): h1 "Fund Education Initiatives" Montserrat
700 40px color.text-inverse. Tagline Lato 400 18px color.text-inverse @80%.
"Donate Now" ghost button (1px white border).

MAIN BODY (2-column: 60% left, 40% right sticky sidebar):
LEFT COLUMN:
  Goal progress card (color.surface-raised, radius.xl). "$825 raised of $50,000" large type
  Montserrat 700 24px color.primary. Progress bar 12px height. "2% funded" label.
  Impact Statement section: h2 Montserrat 700 24px + 3 paragraphs Lato 400 16px.
  FAQ accordion (3 items): color.surface-raised bg, radius.md.
  Other Forms section: 2 outline cards side by side.

RIGHT SIDEBAR (sticky on scroll, 40%):
  Giving card (color.surface-raised, radius.xl, shadow.md, padding space.6):
    "Choose Your Gift" Montserrat 700 20px.
    Frequency toggle [Monthly] | [One-time].
    6 amount pills in 2-col grid, [$25 default — color.accent selected]. Custom input.
    Level description text.
    "Donate $25/month" primary button full-width 52px.
    "Secure · GiveWP · 501(c)(3)" trust row with icons.

SCENE: Desktop separates the story (left) from the action (right). Sticky sidebar keeps the
CTA always reachable as the donor reads impact content. The 2-column layout mirrors proven
nonprofit fundraising page patterns.

STYLE: High-fidelity light-mode web UI. Clean editorial. White/off-white surfaces. Warm orange accent.
NEGATIVE: NO dark mode. NO raw hex. NO emoji. NO wireframes.
BACKGROUND: Neutral canvas. 1280px browser window.
```

---

# ═══════════════════════════════════════════════════
# SECTION 5 — BLOG LIST
# Plate LCE-05 | 2 Prompts (mobile + desktop)
# ═══════════════════════════════════════════════════

---

## PROMPT LCE-05-A — Blog List (Mobile 390px)

```
BRAND: Luthas Center for Excellence — nonprofit LMS + mental-health platform. Tagline: "Impossible to Inevitable."
PLATFORM: Next.js 15 responsive web. Mobile 390px.
VIBE: Editorial, calm, accessible. The blog is a credibility engine.
COLORS: color.primary hsl(0,0%,7%) | color.accent hsl(19,94%,55%) | color.background hsl(0,0%,100%)
  color.surface hsl(0,0%,96%) | color.surface-raised hsl(0,0%,93%)
  color.text hsl(0,0%,24%) | color.text-muted hsl(0,0%,46%) | color.border hsl(0,0%,93%)
FONTS: Montserrat 700 headings | Lato 400/600/700 body
RULES: Light mode. No raw hex. No emoji.

SUBJECT: Blog list /blog — mobile 390px.

PAGE HERO (color.surface bg, 200px): h1 "Blog" Montserrat 700 32px color.primary centered.
Subtext "Impossible to Inevitable — stories, guides, and community" Lato 400 15px color.text-muted.

CATEGORY FILTER BAR (sticky on scroll, white bg, horizontal scroll): Pill filter row — [All]
[Mental Health] [Business] [Founders Corner] [Parenting] [Finance] [Lifestyle]. Active "All":
color.primary bg, color.text-inverse text, radius.full. Inactive: color.surface-raised bg,
color.text-muted text, 1px color.border. Lato 600 13px.

POST CARDS (full-width, white bg, 16px page margins): 4 cards stacked. Each PostCard:
color.surface-raised bg, radius.lg, shadow.sm. Featured image 16:9 top (radius.lg overflow-hidden
on top corners). Category pill (color.accent @15% bg, color.accent text, radius.full, Lato 600 11px).
h2 title Montserrat 700 18px color.primary (2-line clamp). Excerpt Lato 400 14px color.text-muted
(2 lines). Byline row: avatar 32px circle, "Dame Luthas" Lato 600 13px color.text, "·" separator,
date Lato 400 12px color.text-muted, "5 min read" Lato 400 12px color.text-muted.
Sample post titles: "The Health and Well-being of Single Mothers",
"Navigating Depression in Everyday Life", "How to Start a Business with No Money",
"Homelessness: Understanding Root Causes".

PAGINATION (white bg, centered): [← Prev] [1] [2] [3] [Next →] — each item 40px square,
radius.md. Active page: color.primary bg, color.text-inverse. Others: color.surface-raised bg.

SCENE: The blog is the community voice of Luthas Center. Post cards are editorial — photography
leads, typography breathes. Category pills provide immediate filtering orientation. The byline
row humanizes each post with a face and name.

STYLE: High-fidelity light-mode mobile editorial UI. Clean, readable. White/off-white surfaces.
Orange accent on category pills and active filter.
NEGATIVE: NO dark mode. NO raw hex. NO emoji. NO neon. NO wireframes.
BACKGROUND: Light gray canvas. 390px mobile screen.
```

---

## PROMPT LCE-05-B — Blog List (Desktop 1280px)

```
BRAND: Luthas Center for Excellence — nonprofit LMS + mental-health platform. Tagline: "Impossible to Inevitable."
PLATFORM: Next.js 15 responsive web. Desktop 1280px.
VIBE: Editorial, calm, credible.
COLORS: color.primary hsl(0,0%,7%) | color.accent hsl(19,94%,55%) | color.background hsl(0,0%,100%)
  color.surface hsl(0,0%,96%) | color.surface-raised hsl(0,0%,93%)
  color.text hsl(0,0%,24%) | color.text-muted hsl(0,0%,46%) | color.border hsl(0,0%,93%)
FONTS: Montserrat 700 headings | Lato 400/600/700 body
RULES: Light mode. No raw hex. No emoji.

SUBJECT: Blog list /blog — desktop 1280px.

PAGE HERO (color.surface bg, full-width, 200px): h1 "Blog" Montserrat 700 40px color.primary
centered. "Impossible to Inevitable — stories, guides, and community" Lato 400 18px color.text-muted.

CATEGORY FILTER BAR (sticky, white bg): Horizontal pill row centered. Same categories as mobile.
Sort dropdown right side: "Newest ▾" Lato 400 14px color.text. Results label: "Showing 12 of
47 posts" Lato 400 14px color.text-muted right.

POST GRID (white bg): 2-column grid, 24px gap. Each PostCard identical anatomy as mobile but
expanded — image taller, excerpt shows 3 lines. 4 rows visible (8 posts).
Featured post at top (spans full width, featured variant): large 16:9 image left (60%), content
right (40%) — category pill, large h2 Montserrat 700 28px, excerpt 4 lines, byline row. This is
"The Health and Well-being of Single Mothers" as the lead editorial piece.

PAGINATION: Centered below grid. Full numbered: [← Prev] [1] [2] … [4] [Next →].

SCENE: Desktop blog layout leads with one featured story at full width, then drops into the
2-column grid. The sticky category filter keeps navigation accessible as the user scrolls.
The warm orange accent on active filters and category pills is the only color punctuation in
an otherwise black-and-white editorial palette.

STYLE: High-fidelity light-mode editorial web UI. Clean, readable, credible.
NEGATIVE: NO dark mode. NO raw hex. NO emoji. NO wireframes.
BACKGROUND: Neutral canvas. 1280px browser window.
```

---

# ═══════════════════════════════════════════════════
# SECTION 6 — POST DETAIL
# Plate LCE-06 | 1 Prompt (desktop)
# ═══════════════════════════════════════════════════

---

## PROMPT LCE-06-A — Post Detail (Desktop 1280px)

```
BRAND: Luthas Center for Excellence — nonprofit LMS + mental-health platform. Tagline: "Impossible to Inevitable."
PLATFORM: Next.js 15 responsive web. Desktop 1280px.
VIBE: Long-form editorial — calm, focused, distraction-free reading environment.
COLORS: color.primary hsl(0,0%,7%) | color.accent hsl(19,94%,55%) | color.background hsl(0,0%,100%)
  color.surface hsl(0,0%,96%) | color.surface-raised hsl(0,0%,93%)
  color.text hsl(0,0%,24%) | color.text-muted hsl(0,0%,46%) | color.border hsl(0,0%,93%)
FONTS: Montserrat 700 headings | Lato 400/600/700 body
RULES: Light mode. No raw hex. No emoji. Prose max-width ~700px for readability.

SUBJECT: Post detail /blog/the-health-and-wellbeing-of-single-mothers — desktop 1280px.

HEADER AREA (white bg): Breadcrumb "Blog › Mental Health" Lato 400 13px color.text-muted.
Category pills: [Mental Health] [Parenting] — color.accent @15% bg, color.accent text, radius.full.
h1 "The Health and Well-being of Single Mothers" Montserrat 700 36px color.primary (max-width 800px).
Byline row: avatar 40px circle + "Dame Luthas" Lato 600 14px color.text + "·" + "Sep 19, 2023" +
"·" + "5 min read" — all color.text-muted Lato 400 14px.

FEATURED IMAGE (full-width up to 1000px, radius.lg): Warm editorial photo — a focused woman
working at a desk, calm home environment, natural light.

2-COLUMN LAYOUT (prose + sidebar):
LEFT (70%, max-width 700px):
  Article body: Lato 400 17px color.text, leading.relaxed. Rendered HTML — paragraphs, h2 section
  headings Montserrat 700 22px color.primary, blockquotes (left border 4px color.accent, bg
  color.surface, padding space.4, italic Lato 400 17px color.text), ordered/unordered lists.
  Tags row below body: #mental-health #parenting #wellness — color.surface-raised pills.
  Share bar: [Copy link] [Facebook] [X (Twitter)] [LinkedIn] — icon + label ghost buttons
  40px height, color.surface-raised bg, radius.md.

RIGHT SIDEBAR (30%, sticky to top of page):
  "Related Posts" h3 Montserrat 700 16px. 3 horizontal PostCard items stacked:
  thumbnail 80px square left + title Montserrat 700 14px 2-line clamp right + category Lato
  400 12px color.text-muted. Subtle color.border dividers between.
  "Support Our Mission" CTA card (color.accent @10% bg, radius.lg, padding space.4):
    "Your donation changes lives" Montserrat 700 16px. "Donate Now →" primary button 40px.

RELATED POSTS (color.surface bg, full-width below article): h2 "Related Articles" Montserrat 700
24px. 3-column PostCard grid (standard variant, not horizontal).

SCENE: The reading experience is the hero. Maximum prose width ~700px keeps lines legible.
The sidebar provides wayfinding (related posts) and a soft mission CTA without interrupting
flow. The share bar enables organic distribution. Typography is editorial — warm, human, clear.

STYLE: High-fidelity light-mode editorial web UI. Clean, focused, readable. Warm orange accent
on blockquote borders, category pills, share CTA. Generous line spacing.
NEGATIVE: NO dark mode. NO raw hex. NO emoji. NO wireframes. NO cluttered layouts.
BACKGROUND: White canvas. 1280px browser window.
```

---

# ═══════════════════════════════════════════════════
# SECTION 7 — COURSE CATALOG
# Plate LCE-07 | 2 Prompts (mobile + desktop)
# ═══════════════════════════════════════════════════

---

## PROMPT LCE-07-A — Course Catalog (Mobile 390px)

```
BRAND: Luthas Center for Excellence — nonprofit LMS + mental-health platform. Tagline: "Impossible to Inevitable."
PLATFORM: Next.js 15 responsive web. Mobile 390px.
VIBE: Empowering, low-friction. The library of free courses communicates abundance and generosity.
COLORS: color.primary hsl(0,0%,7%) | color.accent hsl(19,94%,55%) | color.background hsl(0,0%,100%)
  color.surface hsl(0,0%,96%) | color.surface-raised hsl(0,0%,93%)
  color.text hsl(0,0%,24%) | color.text-muted hsl(0,0%,46%) | color.border hsl(0,0%,93%)
  color.success hsl(130,48%,34%)
FONTS: Montserrat 700 headings | Lato 400/600/700 body
RULES: Light mode. No raw hex. No emoji.

SUBJECT: Course catalog /courses — mobile 390px.

HERO BAND (color.primary bg, 180px): h1 "Find Your Next Course" Montserrat 700 28px color.text-inverse
centered. Search input full-width (color.surface-raised bg, radius.full 44px, search icon left 20px,
"Search courses…" placeholder Lato 400 15px, "Go" button right color.accent bg 44px).

FILTER BAR (white bg sticky, horizontal scroll): Category pills [All ▾] [Mental Health] [Business]
[Wellness] [Finance] [Parenting] [+more]. Active: color.primary bg. Price filter: [All ▾] dropdown.

RESULTS LABEL: "47 courses" Lato 600 14px color.text-muted.

COURSE CARDS (full-width stacked, 16px margins): 4 cards visible. Each CourseCard:
color.surface-raised bg, radius.lg, shadow.sm. Cover image 16:9. Category chip (color.secondary
@15% bg, color.secondary text, radius.full, Lato 600 11px). Title Montserrat 700 18px color.primary
(2-line clamp). Excerpt Lato 400 14px color.text-muted (3 lines). "Free" badge (color.success
@15%, color.success text) + "Enroll →" primary button 40px. Sample courses: "Communicating with
EQ", "Mental Health First Aid: Awareness", "Navigating Financial Freedom",
"Goal Setting That Works".

LOAD MORE (centered): "Load more courses" outlined button (1px color.border, radius.md, 44px
height, Lato 600 14px color.text).

SCENE: The catalog is a discovery surface. Search + filter guide the experience. All courses
are free — the "Free" badge and open enrollment CTA are the conversion signal. Cards show
just enough to earn the click.

STYLE: High-fidelity light-mode mobile web UI. Clean, empowering. White/off-white. Orange
accent on search CTA and selected filters.
NEGATIVE: NO dark mode. NO raw hex. NO emoji. NO wireframes.
BACKGROUND: Light canvas. 390px mobile screen.
```

---

## PROMPT LCE-07-B — Course Catalog (Desktop 1280px)

```
BRAND: Luthas Center for Excellence — nonprofit LMS + mental-health platform. Tagline: "Impossible to Inevitable."
PLATFORM: Next.js 15 responsive web. Desktop 1280px.
VIBE: Empowering, abundant. 47 free courses visible at a glance.
COLORS: color.primary hsl(0,0%,7%) | color.accent hsl(19,94%,55%) | color.background hsl(0,0%,100%)
  color.surface hsl(0,0%,96%) | color.surface-raised hsl(0,0%,93%)
  color.text hsl(0,0%,24%) | color.text-muted hsl(0,0%,46%) | color.success hsl(130,48%,34%)
FONTS: Montserrat 700 headings | Lato 400/600/700 body
RULES: Light mode. No raw hex. No emoji.

SUBJECT: Course catalog — desktop 1280px.

HERO BAND (color.primary bg, full-width, 260px): h1 "Find Your Next Course" Montserrat 700 40px
color.text-inverse centered. Subhead "Impossible to Inevitable — free for everyone." Lato 400 18px
color.text-inverse @80%. Search input 640px centered (same anatomy as mobile but wider).

FILTER + SORT TOOLBAR (white bg sticky): Left: category pills. Center: "47 courses found"
label. Right: sort dropdown + grid/list toggle icon buttons.

3-COLUMN COURSE GRID (white bg, 1280px max-width): 24px gap. 6 course cards visible (2 rows × 3).
Each CourseCard expanded: 16:9 cover image, category chip, h3 Montserrat 700 20px, excerpt 3
lines, meta row (lesson count icon + number + access badge), "Enroll Now" primary button 40px
full-width. "In progress" state shown on one card: linear progress bar color.primary fill 45%,
"Continue" ghost button.

SCENE: The desktop catalog is a library. 3 columns communicate depth. The search + filter bar
makes 47 courses navigable. The in-progress card variant shows returning learners their path
back in.

STYLE: High-fidelity light-mode web UI. Clean, empowering, open. Course grid is the centerpiece.
NEGATIVE: NO dark mode. NO raw hex. NO emoji. NO wireframes.
BACKGROUND: Neutral canvas. 1280px browser window.
```

---

# ═══════════════════════════════════════════════════
# SECTION 8 — COURSE DETAIL
# Plate LCE-08 | 2 Prompts (mobile + desktop)
# ═══════════════════════════════════════════════════

---

## PROMPT LCE-08-A — Course Detail (Mobile 390px)

```
BRAND: Luthas Center for Excellence — nonprofit LMS + mental-health platform. Tagline: "Impossible to Inevitable."
PLATFORM: Next.js 15 responsive web. Mobile 390px.
VIBE: Empowering, conversion-focused. This page turns a visitor into an enrolled learner.
COLORS: color.primary hsl(0,0%,7%) | color.accent hsl(19,94%,55%) | color.background hsl(0,0%,100%)
  color.surface hsl(0,0%,96%) | color.surface-raised hsl(0,0%,93%)
  color.text hsl(0,0%,24%) | color.text-muted hsl(0,0%,46%) | color.success hsl(130,48%,34%)
FONTS: Montserrat 700 headings | Lato 400/600/700 body
RULES: Light mode. No raw hex. No emoji. Touch targets ≥ 44px.

SUBJECT: Course detail /courses/communicating-with-eq — mobile 390px full scroll.

VIDEO BANNER (16:9, full-width): Course intro video embed placeholder — color.surface-raised bg,
centered play button 60px circle color.primary bg color.text-inverse icon, "Play intro" Lato
600 14px below.

META HEADER (white bg, padding space.4): Breadcrumb "Courses › Mental Health". h1 "Communicating
with EQ" Montserrat 700 24px color.primary. Category chips: [Mental Health] [Communication].

STICKY CTA STRIP (white bg, shadow.md, 64px): "Free" badge color.success @15% bg left +
"Enroll Now" primary button right (44px height, flex 1).

COURSE META BAR (color.surface-raised bg): Icon + label row — "12 Lessons" | "2 Quizzes" |
"Certificate". Each: SVG icon 16px color.accent, Lato 600 13px color.text.

DESCRIPTION (white bg): Lato 400 15px color.text. 3–4 paragraphs. "Read more" expand link
if text is long.

CURRICULUM ACCORDION (color.surface-raised bg): h2 "Curriculum" Montserrat 700 20px. 3 chapter
sections. Each chapter: trigger button full-width Lato 700 15px color.primary + lesson count
+ chevron. Expanded chapter shows lesson list rows: check circle icon (completed: color.success,
not started: color.border), lesson title Lato 400 15px, duration Lato 400 12px color.text-muted
right, type pill (Video/Reading). Chapter 1 expanded — 4 lessons visible.

INSTRUCTOR SECTION (white bg): "Your Instructor" h2 Montserrat 700 18px. Avatar 64px circle +
"Dame Luthas" Montserrat 700 16px + "Founder & Director" Lato 600 13px color.accent. Bio 2 lines
Lato 400 14px color.text-muted. "Read more ↓" link.

ENROLL BLOCK (color.accent @10% bg, radius.xl): "This course is free" Lato 600 14px color.success.
"Enroll Now" primary button full-width 52px. "Support our mission → Donate" soft link below in
color.accent Lato 400 14px.

RELATED COURSES (horizontal scroll, color.surface bg): 2.5 cards visible. Each compact CourseCard:
cover image, title, category chip.

SCENE: The course detail is the enrollment gateway. Sticky CTA keeps "Enroll" always reachable.
The curriculum accordion lets visitors preview content depth. The instructor bio builds personal
trust. The soft donate nudge at enrollment converts supporters without pressure.

STYLE: High-fidelity light-mode mobile web UI. Clean, empowering. Warm orange accent on meta
icons, category chips, soft CTA link.
NEGATIVE: NO dark mode. NO raw hex. NO emoji. NO wireframes.
BACKGROUND: Light canvas. 390px mobile screen.
```

---

## PROMPT LCE-08-B — Course Detail (Desktop 1280px)

```
BRAND: Luthas Center for Excellence — nonprofit LMS + mental-health platform. Tagline: "Impossible to Inevitable."
PLATFORM: Next.js 15 responsive web. Desktop 1280px.
VIBE: Empowering, credible, conversion-focused.
COLORS: color.primary hsl(0,0%,7%) | color.accent hsl(19,94%,55%) | color.background hsl(0,0%,100%)
  color.surface hsl(0,0%,96%) | color.surface-raised hsl(0,0%,93%)
  color.text hsl(0,0%,24%) | color.text-muted hsl(0,0%,46%) | color.success hsl(130,48%,34%)
FONTS: Montserrat 700 headings | Lato 400/600/700 body
RULES: Light mode. No raw hex. No emoji.

SUBJECT: Course detail — desktop 1280px two-column layout.

BREADCRUMB: "Courses › Mental Health › Communicating with EQ" Lato 400 13px color.text-muted.

2-COLUMN LAYOUT (60% main / 40% sticky sidebar):
LEFT MAIN:
  h1 "Communicating with EQ" Montserrat 700 36px color.primary.
  Category chips + meta bar (12 Lessons, 2 Quizzes, Certificate).
  Description: Lato 400 16px color.text, generous line height.
  Curriculum: full accordion, all chapters collapsed except first. Lesson list visible in
  Chapter 1. Chapters 1–3 visible with lesson counts.
  Instructor card (color.surface-raised, radius.lg): avatar 64px + name + role + bio.

RIGHT SIDEBAR (sticky):
  Video embed 16:9 (color.surface-raised placeholder).
  "Free" large badge Montserrat 700 20px color.success.
  "Enroll Now" primary button full-width 52px Lato 700.
  Bullet list: "12 lessons", "Self-paced", "Certificate included", "Free forever".
  Soft donate nudge below button.

RELATED COURSES (color.surface bg, full-width, 3-column grid below main content).

SCENE: Desktop two-column layout keeps the enrollment sidebar visible while the learner reads
course content. The sticky sidebar mirrors proven online learning platform patterns (Udemy, Coursera)
but in the calm, nonprofit brand aesthetic.

STYLE: High-fidelity light-mode web UI. Clean, credible, empowering.
NEGATIVE: NO dark mode. NO raw hex. NO emoji. NO wireframes.
BACKGROUND: Neutral canvas. 1280px browser window.
```

---

# ═══════════════════════════════════════════════════
# SECTION 9 — LESSON VIEW
# Plate LCE-09 | 2 Prompts (mobile + desktop)
# ═══════════════════════════════════════════════════

---

## PROMPT LCE-09-A — Lesson View (Mobile 390px)

```
BRAND: Luthas Center for Excellence — nonprofit LMS + mental-health platform. Tagline: "Impossible to Inevitable."
PLATFORM: Next.js 15 responsive web. Mobile 390px.
VIBE: Focused, distraction-free. The content is the hero. Learning happens here.
COLORS: color.primary hsl(0,0%,7%) | color.accent hsl(19,94%,55%) | color.background hsl(0,0%,100%)
  color.surface hsl(0,0%,96%) | color.surface-raised hsl(0,0%,93%)
  color.text hsl(0,0%,24%) | color.text-muted hsl(0,0%,46%) | color.success hsl(130,48%,34%)
FONTS: Montserrat 700 headings | Lato 400/600/700 body
RULES: Light mode. No raw hex. No emoji. Touch targets ≥ 44px.

SUBJECT: Lesson view /courses/communicating-with-eq/lessons/3 — mobile 390px.

STICKY LESSON HEADER (56px, white bg, shadow.sm): Left: back arrow 44×44 "← Course". Center:
"Communicating with EQ" Lato 500 14px color.text truncated. Right: outline icon for curriculum
drawer (44×44).

PROGRESS STRIP (full-width): [████████░░░░░░░░░░░░] Lato 600 12px color.text-muted right:
"3 of 5 lessons". Bar: color.surface-raised track, color.primary fill, 6px height.

LESSON HEADER (white bg, padding space.4): h1 "Recognizing Emotional Triggers" Montserrat 700
22px color.primary. "Course: Communicating with EQ ▸" breadcrumb Lato 400 13px color.accent.

VIDEO ZONE (16:9, full-width): Embedded video player — dark video frame placeholder with play
button 56px circle color.primary bg. Time scrubber bar at bottom of video (color.primary fill).

LESSON CONTENT (white bg, padding space.4): Rich HTML — Lato 400 16px color.text leading.relaxed.
h2 subheadings Montserrat 700 18px color.primary. Blockquote: left 4px color.accent border,
color.surface bg, padding space.3, italic. Bullet list items with color.accent disc markers.
3 paragraphs of content visible.

MARK COMPLETE (color.surface bg, centered, padding space.5): "Mark as complete" primary button
full-width 52px (color.success bg when marked, check icon added, "Completed ✓" label).

STICKY BOTTOM NAV (56px, color.surface bg, shadow.md, 1px top color.border): [← Prev lesson]
Lato 600 14px color.text-muted left | [Next lesson →] Lato 700 14px color.primary right.

CURRICULUM DRAWER (collapsed by default, shown here open for reference): Full-height overlay
from right, color.background bg, shadow.lg. "Course Outline" h3 Montserrat 700 16px. Progress
"3 / 5 lessons · 60%". Lesson list: 01 completed (check color.success), 02 completed, 03 active
(color.primary text, color.surface-raised bg row), 04 not started, 05 not started. Close X
top-right 44×44.

SCENE: The lesson view is a reading + watching environment. Every distraction-reducing decision
is visible: minimal sticky header, full-width video, generous content typography, clear prev/next
navigation. The progress strip and mark-complete button close the feedback loop on learning.

STYLE: High-fidelity light-mode mobile learning UI. Focused, calm, accessible. Minimal chrome.
Warm orange on blockquote accents and breadcrumbs. Progress in color.primary near-black.
NEGATIVE: NO dark mode. NO raw hex. NO emoji. NO wireframes. NO cluttered chrome.
BACKGROUND: Light gray canvas. 390px mobile screen.
```

---

## PROMPT LCE-09-B — Lesson View (Desktop 1280px)

```
BRAND: Luthas Center for Excellence — nonprofit LMS + mental-health platform. Tagline: "Impossible to Inevitable."
PLATFORM: Next.js 15 responsive web. Desktop 1280px.
VIBE: Focused, distraction-free learning environment.
COLORS: color.primary hsl(0,0%,7%) | color.accent hsl(19,94%,55%) | color.background hsl(0,0%,100%)
  color.surface hsl(0,0%,96%) | color.surface-raised hsl(0,0%,93%)
  color.text hsl(0,0%,24%) | color.text-muted hsl(0,0%,46%) | color.success hsl(130,48%,34%)
FONTS: Montserrat 700 headings | Lato 400/600/700 body
RULES: Light mode. No raw hex. No emoji.

SUBJECT: Lesson view — desktop 1280px.

STICKY TOP NAV (56px, white bg, shadow.sm): Left: "← Communicating with EQ" breadcrumb link
color.accent Lato 600 14px. Center: "Lesson 3 of 5" Lato 400 14px color.text-muted. Progress
bar inline next to label (300px, 8px height). Right: "Account ▾" avatar Lato 500 14px.

2-COLUMN LAYOUT (content 70% / sidebar 30%):
MAIN COLUMN:
  h1 "Recognizing Emotional Triggers" Montserrat 700 32px color.primary.
  Video embed 16:9 (max-width 800px, shadow.lg, radius.lg).
  Lesson content: Lato 400 17px color.text leading.relaxed, max-width 700px. Full article length
  visible — h2 sections, blockquotes, bullet lists, paragraphs.
  "Mark as complete" button below content: 48px, full width of prose column, color.primary →
  color.success when toggled.
  Prev/Next navigation row: [← Lesson 2: What is EQ?] left | [Lesson 4: Responding vs Reacting →] right.
  Both: outlined buttons 40px height, Lato 600 14px.

SIDEBAR (sticky, 280px, color.surface-raised bg, radius.xl, shadow.sm):
  h2 "Course Outline" Montserrat 700 16px.
  Progress "[████████░░░░░] 3 / 5 · 60%" progress bar 8px color.primary fill.
  Lesson list (full course): each row 48px — completion icon 20px (check/circle/lock) + title
  Lato 600 14px color.text + duration Lato 400 12px color.text-muted right. Active row (lesson 3):
  color.surface bg highlight + color.primary arrow icon. Scrollable if > 6 lessons.

SCENE: Desktop lesson view gives learners the full content experience with the course outline
always visible. The main content column is narrow enough for comfortable reading while the sidebar
prevents disorientation in a multi-lesson curriculum.

STYLE: High-fidelity light-mode learning web UI. Focused, clean, accessible.
NEGATIVE: NO dark mode. NO raw hex. NO emoji. NO wireframes.
BACKGROUND: Neutral canvas. 1280px browser window.
```

---

*End of Luthas Center Stitch Design Prompt Manifest — 18 plates across 9 screens.*
