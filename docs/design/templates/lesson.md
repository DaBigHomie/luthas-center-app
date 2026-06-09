# Lesson View — Layout Spec

**Route:** `/courses/[courseSlug]/lessons/[lessonId]`
**Template:** `lesson`
**Last updated:** 2026-06-08

---

## 1. Purpose

The Lesson view is the primary learning surface for a single lesson inside a course. It must render the lesson's rich HTML content (or embedded video), keep the learner oriented within the full course curriculum via a collapsible sidebar nav, surface clear previous/next navigation, and reflect the learner's enrollment progress in real time. Every enrolled user — including free-access learners — must be able to complete a lesson and see their progress advance without friction. The tone is calm, focused, and distraction-free: the content is the hero.

---

## 2. Responsive Layout — ASCII Wireframes

### 2a. Mobile (< 768 px)

```
┌──────────────────────────────────────────┐
│  [Logo]   [Back to course]   [Menu ☰]   │  ← sticky header (color.surface bg)
├──────────────────────────────────────────┤
│                                          │
│  PROGRESS STRIP (full-width)             │
│  [████████░░░░░░░░░░░░]  3 of 5 lessons  │  ← color.primary fill, color.muted track
│                                          │
├──────────────────────────────────────────┤
│  LESSON HEADER                           │
│  h1: "Recognizing Emotional Triggers"    │  ← font.heading, color.onSurface
│  Course: "Communicating with EQ"  ▸      │  ← breadcrumb link, font.body sm
│                                          │
├──────────────────────────────────────────┤
│  VIDEO / MEDIA ZONE (16:9, full-width)   │
│  ┌──────────────────────────────────┐    │
│  │  [Embedded video player          │    │
│  │   or featured image              │    │
│  │   or placeholder icon]           │    │
│  └──────────────────────────────────┘    │
│                                          │
├──────────────────────────────────────────┤
│  LESSON CONTENT                          │
│  [Rich HTML rendered — headings, lists,  │
│   paragraphs, blockquotes]               │
│                                          │
│  ─────────────────────────────────────   │
│                                          │
│  [Mark as complete  ✓]  (Button)         │
│                                          │
├──────────────────────────────────────────┤
│  PREV / NEXT NAV (sticky bottom bar)     │
│  [← Prev lesson]        [Next lesson →] │
├──────────────────────────────────────────┤
│  CURRICULUM DRAWER (collapsed by default)│
│  [Course outline  ▾]                     │
│  ├ 01. Introduction         ✓           │
│  ├ 02. What is EQ?          ✓           │
│  ► 03. Recognizing Triggers  (active)    │
│  ├ 04. Responding vs Reacting           │
│  └ 05. Building Resilience              │
│  [Close ✕]                               │
├──────────────────────────────────────────┤
│  site footer (minimal — links only)      │
└──────────────────────────────────────────┘
```

### 2b. Desktop (≥ 1024 px)

```
┌────────────────────────────────────────────────────────────────────────────┐
│  [Logo]  [Courses] [Resources] [About] [Donate]          [Account ▾]       │  ← sticky nav
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  BREADCRUMB: Courses › Communicating with EQ › Lesson 3                   │
│                                                                            │
├──────────────────────────────────────┬─────────────────────────────────────┤
│                                      │  CURRICULUM SIDEBAR (sticky, 280px) │
│  LESSON MAIN COLUMN (fluid)          │                                     │
│                                      │  h2: "Course Outline"               │
│  PROGRESS BAR                        │  [████████░░░░░]  3 / 5  60%        │
│  [████████░░░░░░░░░░] 3 / 5          │                                     │
│                                      │  ┌─────────────────────────────┐    │
│  h1: "Recognizing Emotional          │  │ ✓ 01. Introduction          │    │
│        Triggers"                     │  │ ✓ 02. What is EQ?           │    │
│                                      │  │ ► 03. Recognizing Triggers  │    │  ← active: color.primary left border
│  ┌────────────────────────────────┐  │  │   04. Responding vs React.  │    │
│  │  VIDEO / MEDIA ZONE (16:9)     │  │  │   05. Building Resilience   │    │
│  │  [Embedded player or image]    │  │  └─────────────────────────────┘    │
│  └────────────────────────────────┘  │                                     │
│                                      │  [Back to course overview →]        │
│  LESSON CONTENT                      │                                     │
│  [Rendered HTML — h2/h3 headings,    │                                     │
│   paragraphs, lists, blockquotes,    │                                     │
│   embedded media shortcodes]         │                                     │
│                                      │                                     │
│  ────────────────────────────────    │                                     │
│                                      │                                     │
│  [  Mark as complete  ✓  ] (Button)  │                                     │
│                                      │                                     │
│  ┌─────────────────────────────────┐ │                                     │
│  │ [← Prev: What is EQ?]           │ │                                     │
│  │             [Next: Responding →]│ │                                     │
│  └─────────────────────────────────┘ │                                     │
│                                      │                                     │
├──────────────────────────────────────┴─────────────────────────────────────┤
│  site footer                                                               │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Section-by-Section Table

| Section | Component | Content source field | Behavior |
|---|---|---|---|
| Sticky site header | `<SiteHeader>` | Site-wide | Collapses to icon-only on scroll-down; reappears on scroll-up. Mobile: hamburger opens full-screen nav drawer. |
| Breadcrumb | `<Breadcrumb>` | `courses.title`, `lessons.title`, `lessons.menu_order` | Three levels: Courses / [course title] / Lesson [N]. Each crumb is a link except the last. |
| Progress bar (main column) | `<ProgressBar>` | `enrollments.completed_steps` count ÷ `course_steps` total count | Animated fill on mount. Shows "N of M lessons" label beside bar. Hidden for unauthenticated visitors. |
| Lesson header | `<PageHeading>` | `lessons.title` | Renders as `<h1>`. Max 2 lines; truncates with ellipsis only in sidebar nav, never on main column. |
| Video / media zone | `<LessonMedia>` | `lessons.video_url`, `lessons.featured_image_id` → `media.src_url` | If `video_url` is present: embed iframe (YouTube/Vimeo) or render video player for hosted mp4 shortcode. If absent but `featured_image_id` is set: render 16:9 aspect-ratio image with `alt` from `media.alt_text`. If both absent: render a branded placeholder with the lesson title and a play-circle icon in `color.accent`. |
| Lesson content | `<RichContent>` | `lessons.content` (HTML string) | Sanitize and render HTML. Apply typography scale: `font.heading` on `h2`/`h3`, `font.body` on `p`/`li`. Code blocks use monospace. External links open in new tab with `rel="noopener noreferrer"`. wp-block shortcode wrappers stripped server-side; useyourdrive shortcodes resolved to iframes via a server action. |
| Mark-complete button | `<CompleteButton>` | `enrollments.completed_steps[]`, `course_steps.lesson_id` | Visible only to enrolled users. Shows "Mark as complete" (hollow) when step is not complete; shows "Completed ✓" (filled, `color.success` bg) when done. On click: calls `PATCH /api/enrollments/[id]/steps` which upserts into `enrollments.completed_steps`. Triggers progress bar re-animation. |
| Prev / Next navigation | `<LessonNav>` | `course_steps` ordered by `lessons.menu_order` | Derives previous and next lesson IDs by sorting `course_steps` by `order` and finding the adjacent entries. Links show sibling lesson `title` truncated at 40 chars. If no prev, hides Prev button. If no next and all lessons complete, shows "Finish course →" linking to course overview. |
| Curriculum sidebar nav | `<CurriculumSidebar>` | `course_steps` (ordered by `order`), `lessons.title` per step, `enrollments.completed_steps[]` | Lists all steps in `order` sequence. Each item shows: completion checkmark (`color.success`), lesson number, `lessons.title`. Active lesson has `color.primary` left border. Completed lessons show filled check. Incomplete show empty circle. Mobile: toggled via "Course outline" drawer button; uses `<dialog>` with slide-up animation. Desktop: sticky column, scrolls independently. |
| Back-to-course link | `<TextLink>` | `courses.title`, `courses.new_path` | Inside sidebar footer on desktop; above curriculum drawer on mobile. Navigates to `/courses/[courseSlug]`. |
| Minimal site footer | `<SiteFooter variant="minimal">` | Site-wide | Links only — no newsletter band on lesson pages to minimize distraction. |

---

## 4. Primitives Used

| Primitive | Usage in this template |
|---|---|
| `<PageHeading>` | Lesson `h1` in main column |
| `<SectionHeading>` | `h2` inside rendered `<RichContent>`, sidebar "Course Outline" label |
| `<RichContent>` | Rendered `lessons.content` HTML |
| `<ProgressBar>` | Enrollment progress; `color.primary` fill, `color.muted` track, `radius.full` |
| `<LessonMedia>` | 16:9 video embed or featured image; `radius.md` corners |
| `<CompleteButton>` | Primary action; `color.primary` → `color.success` state transition |
| `<LessonNav>` | Prev/Next control; `radius.md`, `space.4` padding, `color.surface` bg on hover |
| `<CurriculumSidebar>` | Ordered step list; active item `color.primary` left border `2px`; `space.2` row gap |
| `<Breadcrumb>` | Three-level trail; `font.body` sm, `color.muted` separators |
| `<Chip>` | Category tags on lesson (if rendered); `color.surface`, `radius.full` |
| `<TextLink>` | Back-to-course; inline underline on focus |
| `<SiteHeader>` | Global sticky nav |
| `<SiteFooter variant="minimal">` | Distraction-free footer |
| `<Skeleton>` | Loading state for content, sidebar, and progress bar |
| `<Toast>` | Success feedback on "Mark as complete" action |

---

## 5. Data Requirements

### Primary query — lesson detail

**Table:** `lessons`

| Column | Used for |
|---|---|
| `id` | Route param; used as FK in `course_steps` and `enrollments.completed_steps` |
| `title` | `<h1>` heading, breadcrumb tail, sidebar nav item label, prev/next button label |
| `content` | Rendered lesson body (`<RichContent>`) |
| `course_id` | FK → `courses` for sidebar nav and breadcrumb |
| `menu_order` | Sort key for prev/next computation (fallback if `course_steps.order` absent) |
| `video_url` | Primary media embed when non-null |
| `featured_image_id` | FK → `media` for fallback lesson image |
| `excerpt` | Not rendered on lesson view; may be used in `<head>` `og:description` |

### Course and curriculum

**Table:** `courses`

| Column | Used for |
|---|---|
| `id` | FK match from `lessons.course_id` |
| `title` | Breadcrumb second level, back-to-course link text |
| `slug` (derived from `new_path`) | Back-to-course link href |

**Table:** `course_steps`

| Column | Used for |
|---|---|
| `course_id` | Filter to current course |
| `lesson_id` | FK → `lessons.title` for each sidebar item |
| `order` | Sort order for sidebar list and prev/next computation |
| `type` | Distinguish lesson vs quiz step (quiz steps show quiz icon) |

### Enrollment and progress

**Table:** `enrollments`

| Column | Used for |
|---|---|
| `id` | PATCH target for marking step complete |
| `user_id` | Scoped to authenticated user |
| `course_id` | Filter to current course |
| `completed_steps` | JSON/array of completed step IDs; drives progress bar, checkmarks, CompleteButton state |
| `status` | If `completed`: show "Finish course" instead of Next on last lesson |

### Media

**Table:** `media`

| Column | Used for |
|---|---|
| `id` | Match `lessons.featured_image_id` |
| `src_url` | `<img>` src in `<LessonMedia>` |
| `alt_text` | `alt` attribute on lesson image |
| `width`, `height` | Aspect-ratio preservation; prevents layout shift |

### SEO

**Table:** `seo_meta`

| Column | Used for |
|---|---|
| `object_id` | Match `lessons.id` |
| `title` | `<title>` tag override |
| `description` | `<meta name="description">`, `og:description` |
| `og_image` | `og:image` meta tag |

---

## 6. Accessibility Notes

### Landmarks
- `<header role="banner">` — site header.
- `<nav aria-label="Breadcrumb">` — breadcrumb trail.
- `<main>` — lesson heading, media, content, complete button, prev/next nav.
- `<nav aria-label="Course curriculum">` — curriculum sidebar (both mobile drawer and desktop column).
- `<footer>` — site footer.

### Heading order
```
h1 — lessons.title                          (main column)
  h2 — headings inside lessons.content      (via RichContent)
    h3 — sub-headings inside lessons.content
h2 — "Course Outline"                       (sidebar/drawer)
```
Never skip levels. The site header nav does not use a heading.

### Focus management
- Mobile curriculum drawer: when opened, focus moves to the drawer's close button. On close, focus returns to the "Course outline" toggle button.
- After "Mark as complete" is activated: focus stays on the button (now in completed state); a `<Toast>` announces success via `aria-live="polite"`.
- Prev/Next nav: both buttons are visible and focusable even when one is hidden — the hidden one uses `aria-hidden="true"` and `tabindex="-1"`, not `display:none`, so the layout is stable.

### Images and media
- `lessons.featured_image_id` → `media.alt_text` populates `alt`. If `alt_text` is empty, derive from `lessons.title` ("Lesson image for [title]").
- Video iframes must have `title="[lessons.title] — video"`.
- Decorative placeholder icons use `aria-hidden="true"`.

### Progress bar
- `<ProgressBar>` renders as `<div role="progressbar" aria-valuenow="{pct}" aria-valuemin="0" aria-valuemax="100" aria-label="Course progress: {n} of {m} lessons complete">`.

### Keyboard navigation
- Sidebar nav items are `<a>` elements — fully keyboard reachable in DOM order.
- CompleteButton is a `<button>` — responds to `Enter` and `Space`.
- Prev/Next are `<a>` elements with visible focus rings (`outline: 2px solid color.focus`).
- No mouse-only interactions; hover states have equivalent focus states.

### Color contrast
- All text on `color.surface`: minimum 4.5:1 against `color.onSurface`.
- Progress bar fill `color.primary` on `color.muted` track: decorative — label text carries the information.
- Active sidebar item left border is decorative; active state also communicated via `aria-current="page"` on the `<a>`.

### Reduced motion
- Progress bar fill animation and CompleteButton state transition wrapped in `@media (prefers-reduced-motion: reduce)` — instant swap, no animation.

---

## 7. Stitch Prompt

```
Create a Lesson View screen for "Luthas Center" (luthas-center.damieus.app),
a nonprofit LMS with the tagline "Impossible to Inevitable."
Brand tokens: color.primary (brand teal), color.surface (light off-white),
color.onSurface (near-black), color.accent (warm highlight), color.muted
(light gray), color.success (green), font.heading (display sans-serif),
font.body (readable sans-serif), radius.md (8px), radius.full (9999px),
space.4 (16px).

Design a desktop (1280px) and mobile (390px) layout with these zones:

DESKTOP: Two-column layout. Left main column (fluid) contains:
1. Breadcrumb — "Courses › Communicating with Emotional Intelligence › Lesson 3"
   in font.body sm, color.muted separators.
2. Progress bar — teal fill (color.primary), gray track (color.muted),
   radius.full, label "3 of 5 lessons".
3. h1 heading — "Recognizing Emotional Triggers" in font.heading, color.onSurface.
4. 16:9 video player zone — rounded corners radius.md, dark bg, play button
   centered in color.accent.
5. Rich text content area — h2/h3 subheadings in font.heading, body in font.body,
   comfortable line-height, max-width 680px.
6. "Mark as complete ✓" — primary button, color.primary bg, full-width on mobile,
   auto-width on desktop.
7. Prev/Next nav bar — two ghost buttons side-by-side, "← Prev: What is EQ?"
   and "Next: Responding vs Reacting →", color.surface bg, radius.md.

Right sticky sidebar (280px, color.surface bg, subtle border-left):
- "Course Outline" h2 in font.heading sm.
- Progress bar repeated, compact.
- Ordered list of 5 lessons: completed items show color.success filled checkmark;
  active item (lesson 3) has a color.primary 2px left border and bold title;
  incomplete items show empty circle. Each item is a clickable link.
- "Back to course overview →" text link at sidebar bottom.

MOBILE: Single column. Sticky header with logo and back link. Progress bar
full-width. h1. 16:9 media zone. Rich content. Mark-complete button.
Sticky bottom bar with Prev/Next. Collapsed "Course outline ▾" drawer trigger
above footer.

Tone: calm, focused, distraction-free. No sidebar on mobile. Clean white
content area, generous padding (space.4), accessible focus rings.
```
