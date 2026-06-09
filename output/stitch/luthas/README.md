# Luthas Center — Google Stitch Design Prompts

**Wave:** `luthas-v1` | **Plates:** 18 | **Created:** 2026-06-08
**Token SSOT:** `src/shared/design/tokens.ts`
**Template SSOT:** `docs/design/templates/`

---

## What is this?

This folder contains the complete Google Stitch prompt manifest and execution ledger for the
Luthas Center for Excellence platform. Every prompt is a self-contained 13-block composition
(Brand Preamble, Locked Components, Style, Negative, Background, Subject, Scene) that can be
pasted directly into Google Stitch without extra context.

The manifest covers 9 screens across 18 plates (mobile + desktop per screen where both matter):

| Plate | Screen | Viewport |
|-------|--------|----------|
| LCE-01-A | Home | Mobile 390px |
| LCE-01-B | Home | Desktop 1280px |
| LCE-02-A | About | Desktop 1280px |
| LCE-03-A | Contact | Desktop 1280px |
| LCE-04-A | Donate | Mobile 390px |
| LCE-04-B | Donate | Desktop 1280px |
| LCE-05-A | Blog List | Mobile 390px |
| LCE-05-B | Blog List | Desktop 1280px |
| LCE-06-A | Post Detail | Desktop 1280px |
| LCE-07-A | Course Catalog | Mobile 390px |
| LCE-07-B | Course Catalog | Desktop 1280px |
| LCE-08-A | Course Detail | Mobile 390px |
| LCE-08-B | Course Detail | Desktop 1280px |
| LCE-09-A | Lesson View | Mobile 390px |
| LCE-09-B | Lesson View | Desktop 1280px |

---

## How to run a prompt in Google Stitch

1. Open [Google Stitch](https://stitch.withgoogle.com).
2. Open `LUTHAS-STITCH-MANIFEST.md` in this folder.
3. Copy the full prompt block for the plate you want (everything inside the triple-backtick
   block under the plate heading).
4. Paste into the Stitch prompt field. Click Generate.
5. Iterate: if a detail is missing or off-brand, add a clarifying instruction and regenerate.
   Do not start a new session — refine in the same thread so Stitch retains context.

---

## Where to put outputs

Drop Stitch outputs into the subdirectories under `downloads/`:

```
output/stitch/luthas/downloads/
  images/      ← exported PNG/JPG screenshots (named LCE-01-A.png etc.)
  code/        ← Stitch-exported HTML/CSS files (named LCE-01-A.html etc.)
  json/        ← any Stitch JSON design exports
```

Then update `stitch-execution-ledger.json` for each plate:

```json
{
  "status": "generated",
  "output_png": "output/stitch/luthas/downloads/images/LCE-01-A.png",
  "output_html": "output/stitch/luthas/downloads/code/LCE-01-A.html",
  "stitch_url": "https://stitch.withgoogle.com/..."
}
```

---

## Regenerating a plate

Stitch prompts are self-contained. To regenerate after a token or content change:

1. Update the relevant section in `LUTHAS-STITCH-MANIFEST.md`.
2. Update `stitch-execution-ledger.json` — set `status` back to `"pending"` and clear
   `output_png` / `output_html`.
3. Paste the updated prompt into a fresh Stitch session and generate.

---

## Brand token reference (quick lookup)

All colors use semantic token names from `src/shared/design/tokens.ts`:

| Token | Resolved value | Use |
|-------|---------------|-----|
| `color.primary` | hsl(0,0%,7%) — near-black | Primary buttons, headings |
| `color.accent` | hsl(19,94%,55%) — warm orange | Badges, selected states, links |
| `color.secondary` | hsl(216,72%,21%) — deep navy | Sub-headings, authority accents |
| `color.background` | hsl(0,0%,100%) — white | Page base |
| `color.surface` | hsl(0,0%,96%) — off-white | Section bands, card bg |
| `color.surface-raised` | hsl(0,0%,93%) — light gray | Form inputs, elevated cards |
| `color.text` | hsl(0,0%,24%) — near-black | Body copy |
| `color.text-muted` | hsl(0,0%,46%) — mid-gray | Meta text, placeholders |
| `color.text-inverse` | hsl(0,0%,100%) — white | Text on dark backgrounds |
| `color.success` | hsl(130,48%,34%) — green | Free badge, completion states |

Fonts: **Montserrat 700** (headings) / **Lato 400/600/700** (body, labels, nav).

---

*This manifest was authored to mirror the pattern established in
`michael-imani-hub/output/stitch/royal-nightlife/MIH-40X-STITCH-MANIFEST.md`.*
