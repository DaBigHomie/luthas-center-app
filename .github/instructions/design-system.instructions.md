---
applyTo: "src/shared/design/**,src/shared/ui/**,**/*.css,**/*.tsx,**/*.ts"
---

# Design System — Royal Nightlife Token Rules

## Theme Identity
- **Aesthetic**: "Royal Nightlife" — deep black canvas, electric accent, premium feel
- **Primary accent**: Electric Blue (`--color-primary: #2563EB`)
- **Per-brand accents**: Wyze Ink purple, Ausome Angels teal
- **Gold**: `#D4AF37` — optional typography/chrome accent ONLY. Never a CTA or primary color.
- **SSOT**: `src/shared/design/tokens.ts` — all token definitions live here
- **Stitch spec**: `output/stitch/royal-nightlife/DESIGN.md`

## Token Reference

| Token | CSS Variable | Usage |
|-------|-------------|-------|
| Primary | `--color-primary` | CTAs, active states, links |
| Surface | `--color-surface` | Page background (near-black) |
| Surface card | `--color-surface-card` | Card backgrounds |
| Surface elevated | `--color-surface-elevated` | Modals, dropdowns |
| Text primary | `--color-text-primary` | Body copy |
| Text secondary | `--color-text-secondary` | Captions, metadata |
| Text inverse | `--color-text-inverse` | On dark/primary backgrounds |
| Border | `--color-border` | Dividers, card borders |
| Gold accent | `--color-gold` | Premium typography, chrome only |
| Wyze Ink purple | `--color-brand-wyze-ink` | Wyze Ink brand surfaces |
| Angels teal | `--color-brand-angels` | Ausome Angels brand surfaces |

## Rules

- ALWAYS use CSS variables via Tailwind tokens — never raw hex in components
- ALWAYS use `cn()` from `@/shared/utils/cn` for class conditionals [TODO — create: `clsx` + `twMerge` wrapper]
- ALWAYS include dark mode behavior (the app is dark-first, but maintain semantic contrast)
- ALWAYS respect `prefers-reduced-motion`
- ALWAYS add `focus-visible:ring-2 focus-visible:ring-primary` on interactive elements
- NEVER hardcode hex colors in components or stylesheets
- NEVER use inline styles for layout
- NEVER use `px` units — use Tailwind spacing scale

## Typography

| Role | Font | Token class |
|------|------|-------------|
| Heading | Cormorant Garamond / Inter | `font-heading` |
| Body | Inter / Montserrat | `font-body` |
| Mono | JetBrains Mono | `font-mono` |

## Component Standards

```typescript
// ✅ Correct — token-driven
<div className="bg-[var(--color-surface-card)] text-[var(--color-text-primary)]">

// ✅ Correct — Tailwind theme token
<div className="bg-surface-card text-text-primary">

// ❌ BLOCKED — raw hex
<div style={{ backgroundColor: '#0a0a0a', color: '#ffffff' }}>
```

## Brand Surface Overrides

When rendering brand-scoped sections, apply the per-brand CSS class at the section root:
```tsx
// Wyze Ink section
<section className="brand-wyze-ink"> ... </section>

// Ausome Angels section
<section className="brand-angels"> ... </section>
```

Brand classes will be defined in `src/shared/design/brand-overrides.css` [TODO — create when first brand section is implemented].

## Full Reference
- Token SSOT: `src/shared/design/tokens.ts`
- Design spec: `output/stitch/royal-nightlife/DESIGN.md`
