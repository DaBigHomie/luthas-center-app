# Course Detail — Layout Spec

**Route:** `/courses/[slug]`
**Template role:** Primary learning landing page; converts visitor to enrolled learner or donor.
**Last updated:** 2026-06-08

---

## 1. Purpose

The Course Detail template gives a prospective learner everything they need to decide to start — and a returning learner a quick path back in. It surfaces the course title, a preview video (`intro_video`), a rich description (`content` HTML), the full curriculum (`course_steps[]` of ordered lessons and quizzes), the price/access model (`price_type`, `price`, `access_mode`), a certificate badge when offered (`certificate_id`), and an instructor bio pulled from `profiles`. The primary CTA is "Enroll" (free/open courses) or "Purchase" (paid). A secondary soft CTA invites donation for open courses, consistent with the platform's nonprofit mission.

---

## 2. Responsive Layout — ASCII Wireframes

### Mobile (< 640 px — single column)

```
┌─────────────────────────────────────────┐
│  [GlobalNav — collapsed burger]         │
├─────────────────────────────────────────┤
│  HERO / VIDEO BANNER                    │
│  ┌─────────────────────────────────┐    │
│  │  16:9 video embed / poster img  │    │
│  │  (intro_video or featured_image)│    │
│  └─────────────────────────────────┘    │
│  [Breadcrumb: Courses > {category}]     │
│  H1: {title}                            │
│  Tags: {categories} • {tags}            │
├─────────────────────────────────────────┤
│  STICKY CTA STRIP (top of viewport)     │
│  ┌───────────────────────────────────┐  │
│  │ "Free" / "$xx.xx"  [Enroll Now ▶] │  │
│  └───────────────────────────────────┘  │
├─────────────────────────────────────────┤
│  COURSE META BAR                        │
│  [Lessons n] [Quizzes n] [Certificate?] │
├─────────────────────────────────────────┤
│  DESCRIPTION                            │
│  {content HTML — rendered prose}        │
├─────────────────────────────────────────┤
│  CURRICULUM                             │
│  ▼ Section / lesson list                │
│    ├─ [▶ icon] 01. Lesson title         │
│    ├─ [▶ icon] 02. Lesson title         │
│    └─ [? icon] Chapter Quiz             │
│  (accordion, one section open at load)  │
├─────────────────────────────────────────┤
│  INSTRUCTOR                             │
│  [Avatar]  Display Name                 │
│  [description bio — 2–3 lines clamped]  │
│  [Read more ↓]                          │
├─────────────────────────────────────────┤
│  ENROLL / BUY BLOCK                     │
│  Price badge  +  [Enroll Now]           │
│  (open courses: soft donate nudge)      │
├─────────────────────────────────────────┤
│  RELATED COURSES (horizontal scroll)    │
│  [Card] [Card] [Card]                   │
├─────────────────────────────────────────┤
│  [Footer]                               │
└─────────────────────────────────────────┘
```

### Desktop (≥ 1024 px — two-column sidebar)

```
┌──────────────────────────────────────────────────────────────────┐
│  [GlobalNav — full links]                                        │
├──────────────────────────────────────────────────────────────────┤
│  [Breadcrumb: Courses > {category} > {title}]                    │
├───────────────────────────────────┬──────────────────────────────┤
│  LEFT MAIN (60 %)                 │  RIGHT SIDEBAR (40 %)        │
│                                   │  ┌────────────────────────┐  │
│  H1: {title}                      │  │ Video / poster         │  │
│  Tags                             │  │ (sticky until bottom   │  │
│                                   │  │  of curriculum)        │  │
│  COURSE META BAR                  │  ├────────────────────────┤  │
│  Lessons · Quizzes · Certificate  │  │ Price badge            │  │
│                                   │  │ access_mode label      │  │
│  DESCRIPTION                      │  │ [Enroll Now] primary   │  │
│  {content HTML}                   │  │ [Donate] ghost btn     │  │
│                                   │  │ ── cert badge (if any) │  │
│  CURRICULUM ACCORDION             │  │ ── materials_enabled   │  │
│  All sections expanded by default │  └────────────────────────┘  │
│                                   │                              │
│  INSTRUCTOR CARD                  │                              │
│  [Avatar] Name + bio              │                              │
├───────────────────────────────────┴──────────────────────────────┤
│  RELATED COURSES (4-up grid)                                     │
├──────────────────────────────────────────────────────────────────┤
│  [Footer]                                                        │
└──────────────────────────────────────────────────────────────────┘
```

---

## 3. Section-by-Section Table

| Section | Component | Content source field | Behavior |
|---|---|---|---|
| Global nav | `<GlobalNav>` | Static routes + auth state | Sticky; collapses to burger < 640 px |
| Breadcrumb | `<Breadcrumb>` | `courses.categories[0].name`, `courses.title` | Auto-generated from slug chain; hidden on mobile below hero |
| Hero video / banner | `<VideoEmbed>` or `<AspectRatioBox>` + `<Image>` | `courses.intro_video` (YouTube/Vimeo URL); fallback `courses.featured_image_id` → `media` | If `intro_video` is present, renders embedded player (16:9). Fallback renders cover image with play-icon overlay that links to `intro_video`. If neither, solid `color.surface` with decorative pattern. |
| Course title | `<Heading level="h1">` | `courses.title` | `font.heading`, responsive size scale `text.3xl` → `text.4xl`. Max 2 lines; overflow ellipsis. |
| Taxonomy tags | `<TagList>` + `<Chip>` | `courses.categories[]`, `courses.tags[]` | Chips link to `/courses?category={slug}`; `color.accent` variant. Hidden when empty. |
| Sticky CTA strip (mobile) | `<StickyBar>` | `courses.price_type`, `courses.price` | Appears after user scrolls past hero. Collapses on scroll-up. Shows price or "Free". Single primary button. Unmounts ≥ 1024 px. |
| Course meta bar | `<MetaBar>` | `courses.step_counts.lessons`, `courses.step_counts.quizzes`, `courses.certificate_id`, `courses.materials_enabled` | Icon + count for lessons; icon + count for quizzes; certificate badge if `certificate_id` is non-null; "Bonus materials" badge if `materials_enabled`. |
| Description | `<RichContent>` | `courses.content` (WordPress block HTML) | Sanitized and rendered as HTML. `font.body`, `space.4` vertical rhythm. Long content collapses to 320 px with "Show more" expand toggle on mobile. |
| Curriculum accordion | `<Accordion>` + `<CurriculumItem>` | `courses.course_steps[]` joined to `lessons` (`title`, `video_url`, `menu_order`) and `quizzes` (`title`, `passing_percentage`) ordered by `order` | Each step is a row: icon (lesson = play triangle, quiz = check-circle), `lessons.title` or `quizzes.title`, duration if available. Enrolled users see completion checkmark. Non-enrolled users see lock icon on content rows if `access_mode` is not `open`. Keyboard navigable; arrow keys move focus. |
| Sidebar CTA card | `<CourseCtaCard>` | `courses.price_type`, `courses.price`, `courses.access_mode`, `courses.certificate_id`, `courses.materials_enabled` | Sticky on desktop (position: sticky, top: space.6). Displays formatted price or "Free" / "Open Access" label. Primary button label: "Enroll Now" (free/open) or "Purchase — \${price}" (paid). Ghost button "Support this course" → donation page when `price_type === 'open'`. Cert badge shown below buttons. |
| Instructor card | `<InstructorCard>` | `profiles.display_name`, `profiles.first_name`, `profiles.last_name`, `profiles.description` | Avatar initials fallback if no media. Bio clamped to 3 lines with expand toggle. Heading level `h2`. Linked `display_name` if profile has a URL. |
| Enroll / buy block (mobile inline) | `<EnrollBlock>` | Same as Sidebar CTA card | Full-width block below Instructor on mobile. Hidden ≥ 1024 px (sidebar takes over). |
| Related courses | `<CourseCardGrid>` | `catalog_items` view: filter same `categories[0].slug`, exclude current `wp_id` | Horizontal scroll < 768 px; 4-column grid ≥ 1024 px. Max 4 items. If no related, section omitted. |
| Footer | `<Footer>` | Static + donation links | Full-width; `color.surface` background |

---

## 4. Primitives Used

From the shared component library (`src/shared/ui/`):

| Primitive | Usage in this template |
|---|---|
| `<Heading>` | H1 course title; H2 section headings (Curriculum, Instructor, Related) |
| `<Text>` | Body copy, meta labels, price display |
| `<Chip>` | Category and tag pills |
| `<Button variant="primary">` | "Enroll Now" / "Purchase" CTA |
| `<Button variant="ghost">` | "Support this course" donation nudge |
| `<AspectRatioBox ratio="16/9">` | Video embed container |
| `<VideoEmbed>` | YouTube / Vimeo iframe wrapper with lazy-load |
| `<Image>` | Course featured image with `alt` from `courses.title` |
| `<Accordion>` | Curriculum section; accessible open/close |
| `<AccordionItem>` | Single lesson or quiz row |
| `<Icon>` | Play, check-circle, lock, certificate, materials icons |
| `<Badge>` | Certificate badge; materials badge; "Free" / price badge |
| `<Breadcrumb>` | Category > course title trail |
| `<StickyBar>` | Mobile-only enroll strip |
| `<InstructorCard>` | Avatar + name + bio block |
| `<CourseCtaCard>` | Sticky sidebar purchase/enroll card |
| `<MetaBar>` | Horizontal row of lesson/quiz/cert counts |
| `<RichContent>` | Sanitized WordPress block HTML renderer |
| `<CourseCard>` | Related courses grid item |
| `<SkeletonBlock>` | Loading placeholder for all async sections |

**Design token references (all semantic):**

| Token | Applied to |
|---|---|
| `color.primary` | Primary CTA button background, active accordion item indicator |
| `color.primary-foreground` | Button label on `color.primary` |
| `color.accent` | Chip/tag background, certificate badge |
| `color.surface` | Page background, sidebar card background |
| `color.surface-raised` | Meta bar background, accordion row hover |
| `color.muted` | Secondary text, locked step labels |
| `color.border` | Accordion dividers, card outlines |
| `color.destructive` | Error/unavailable states |
| `font.heading` | H1, H2, H3 |
| `font.body` | Body prose, label text |
| `font.mono` | Step order numbers |
| `radius.md` | Cards, chips, CTA card |
| `radius.lg` | Video embed container |
| `space.2` – `space.8` | Component internal padding and gaps |
| `shadow.card` | Sidebar CTA card elevation |
| `transition.base` | Accordion expand, sticky bar reveal |

---

## 5. Data Requirements

### Primary query — single course

```
Table: courses
Columns needed:
  id, wp_id, slug, title, content, excerpt, short_description,
  intro_video, price_type, price, access_mode, certificate_id,
  featured_image_id, cover_image_id, materials_enabled,
  step_counts  (jsonb: {lessons, topics, quizzes}),
  course_steps (jsonb array: [{type, id, order}])
```

### Steps expansion — lessons

```
Table: lessons
Columns: id, wp_id, title, slug, menu_order, video_url,
         featured_image_id, course_id
Filter: wp_id IN (course_steps where type='lesson' → id values)
Order:  match course_steps[].order
```

### Steps expansion — quizzes

```
Table: quizzes
Columns: id, wp_id, title, slug, menu_order, passing_percentage,
         course_id
Filter: wp_id IN (course_steps where type='quiz' → id values)
```

### Taxonomy — categories and tags

```
Table: term_relationships
  JOIN terms ON terms.term_id = term_relationships.term_id
Filter: object_id = courses.wp_id
Columns: terms.term_id, terms.name, terms.slug, terms.taxonomy
```

### Media — featured image

```
Table: media
Columns: id, wp_id, source_url, alt_text, width, height
Filter: wp_id = courses.featured_image_id
```

### Instructor lookup

```
Table: profiles
Columns: id, wp_id, display_name, first_name, last_name,
         description, primary_role
Note: Instructor association is currently denormalized (name embedded
in courses.content HTML). Future: add courses.instructor_id FK to
profiles.wp_id. For v1, parse "Instructor(s):" text from content
or use a static mapping in seed data.
```

### Enrollment state (authenticated user)

```
Table: enrollments
Columns: id, user_id, course_id, status, enrolled_at, completed_at
Filter: user_id = auth.uid(), course_id = courses.id
Used to: show "Continue Learning" vs "Enroll", mark completed steps
```

### Related courses

```
View: catalog_items   (or Table: courses)
Filter: categories overlap current course categories, id != current
Limit: 4
Columns: id, slug, title, featured_image_id, price_type, price,
         step_counts
```

### SEO

```
Table: seo_meta
Columns: object_id, title, description, og_image_id
Filter: object_id = courses.wp_id, object_type = 'course'
```

---

## 6. Accessibility Notes

### Landmarks

- `<header>` wraps GlobalNav.
- `<main>` wraps everything from hero to related courses.
- `<aside>` wraps the sticky sidebar CTA card on desktop.
- `<footer>` wraps the global footer.
- Breadcrumb inside a `<nav aria-label="Breadcrumb">`.
- Curriculum accordion inside a `<section aria-labelledby="curriculum-heading">`.

### Heading order

```
h1 — Course title (once, above the fold)
  h2 — "Curriculum"
  h2 — "Your Instructor"
  h2 — "Related Courses"
```

No heading levels are skipped. The sidebar CTA card does not introduce its own heading.

### Focus management

- On mobile, when the sticky CTA bar mounts, do not steal focus; it is a `role="complementary"` region.
- Accordion items use `<button>` triggers; `aria-expanded` toggles; `aria-controls` points to content panel id.
- "Show more / Show less" description toggle: `aria-expanded` on trigger; live region `aria-live="polite"` announces state change.
- "Enroll Now" button receives focus first after page load if user arrived via a "Start learning" link (use `autofocus` or managed focus).

### Video embed

- Wrap iframe in a container with `title="Course preview: {title}"`.
- Provide a visible link fallback below the embed: "Watch preview on YouTube →" for users who cannot access iframes (CSP, older assistive tech).
- `intro_video` from the data is a full YouTube URL (e.g. `https://www.youtube.com/watch?v=QHXoFX52xUQ`); convert to `https://www.youtube-nocookie.com/embed/{id}?rel=0` on render.

### Images

- Course featured image: `alt="{courses.title} — course cover"`.
- Instructor avatar: `alt="{profiles.display_name}"` or `alt=""` if decorative initials fallback.
- Certificate badge icon: `alt="Certificate of completion available"`.
- All `<Icon>` instances: `aria-hidden="true"` + adjacent visible or `sr-only` label text.

### Color / contrast

- Price / "Free" label must meet 4.5:1 on `color.surface` background.
- CTA button: `color.primary-foreground` on `color.primary` must be verified at token generation time.
- Locked step rows: use `color.muted` text + lock icon; do not rely on color alone — include the icon.

### Keyboard

- Tab order (mobile): Nav > Hero > CTA strip > Meta > Description "Show more" > Curriculum accordion rows > Instructor "Read more" > Enroll block > Related course cards > Footer.
- Tab order (desktop): Nav > Breadcrumb > Meta > Description > Curriculum > Instructor > Related > Footer. Sidebar CTA card is reachable by its natural DOM order (placed after `<main>` content in reading order, visually floated via CSS).
- Accordion: `Space`/`Enter` to toggle; `Down`/`Up` arrow to move between items; `Home`/`End` to jump to first/last.

### Reduced motion

- Accordion expand and sticky bar slide-in respect `prefers-reduced-motion: reduce`: replace transitions with instant show/hide.

---

## 7. Stitch Prompt

```
You are generating a high-fidelity screen for the Luthas Center web app
(https://luthas-center.damieus.app), a nonprofit education and
mental-health-resources platform. Tagline: "Impossible to Inevitable."
Tone: empowering, calm, accessible, trustworthy.

Generate the Course Detail screen. Use only semantic design tokens —
never raw hex colors. Token names follow the format shown below.

--- BRAND TOKENS ---
Background page:    color.surface
Raised card:        color.surface-raised
Primary action:     color.primary  /  color.primary-foreground
Accent (tags/chips):color.accent
Muted text:         color.muted
Border lines:       color.border
Heading font:       font.heading
Body font:          font.body
Border radius card: radius.md
Border radius video:radius.lg
Card shadow:        shadow.card
Base transition:    transition.base

--- LAYOUT (desktop 1280 px, two-column) ---
Left column (60 %):
  1. Breadcrumb: "Courses > Technical Certifications > AWS Certified Cloud Practitioner Training"
  2. H1: "AWS Certified Cloud Practitioner Training"
  3. Tag chips: "AWS", "Technical Certifications", "Certification"
  4. MetaBar row: [▶ 1 lesson] [✓ 0 quizzes] [📄 Bonus materials]
  5. Description: 3–4 lines of rendered prose (font.body, color.surface background)
  6. "Curriculum" H2 heading
  7. Accordion list with 1 lesson row:
     Row: [▶] "01. AWS Cloud Practitioner Introduction" — no lock (open access)
  8. "Your Instructor" H2 heading
  9. InstructorCard: initials avatar "DL", display name "Dame Luthas",
     3-line bio excerpt: "For a decade, Dame Luthas collaborated with
     global United Nations Organizations on pressing challenges..."

Right column (40 %, sticky):
  CourseCtaCard (radius.md, shadow.card, color.surface-raised):
    - 16:9 video preview thumbnail (color.surface placeholder with play icon)
    - Large "Free" badge (color.accent)
    - "Open Access" label in color.muted
    - Primary button full-width: "Enroll Now →" (color.primary bg, font.heading)
    - Ghost button full-width: "Support this course" (color.border outline)
    - Divider line (color.border)
    - Small row: [🏅 icon] "Certificate available upon completion"
    - Small row: [📁 icon] "Bonus materials included"

Below both columns (full width):
  "Related Courses" H2
  4-up grid of CourseCards (radius.md, shadow.card):
    Each card: cover image, title (font.heading), "Free" chip, "1 lesson" label

--- MOBILE VIEW (375 px, single column) ---
  Sticky top strip: "Free  [Enroll Now →]" (color.primary button)
  Stack all left-column sections in order.
  InstructorCard and EnrollBlock before Related Courses.
  Related Courses: horizontal scroll row of 3 cards (partially visible).

--- PLATFORM NOTES ---
  - No raw hex. Token names only.
  - All icon labels have sr-only text or aria-label.
  - Accordion items use button triggers with aria-expanded.
  - Video iframe title: "Course preview: AWS Certified Cloud Practitioner Training"
  - Breadcrumb nav: aria-label="Breadcrumb"
  - Page main landmark: <main>
  - Sidebar: <aside aria-label="Enroll in this course">

Render desktop and mobile side by side if possible. Keep the layout
clean, spacious, and optimistic — learners arriving here should feel
capable and ready to start.
```
