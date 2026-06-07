---
applyTo: "**"
---

# Core Coding Directives

> Managed by DaBigHomie/documentation-standards — do not edit in target repos.

## Automation First
Prioritize creating automation scripts over suggesting manual terminal commands.

## FSD Architecture (Enforced)
```
src/
├── app/          # Next.js App Router (thin route shells only)
├── widgets/      # Composed page sections (import from features/entities/shared)
├── features/     # Isolated business logic per brand / domain
├── entities/     # Domain models (product, user, order, track)
└── shared/       # Shared utilities, constants, types, design tokens
```
Import direction is one-way: `app → widgets → features → entities → shared`.
Cross-feature imports are BLOCKED. Each feature exports through its `index.ts` barrel.

## Portable Paths
- NEVER: `/Users/dame/...` or any hard-coded user path
- ALWAYS: `cd ../`, `./`, `$(pwd)`, `~`

## Research Before Planning
Use a research subagent (Plan agent) before creating implementation plans.

## Syntax Safety
Validate that all quotes (single/double) are closed before running shell commands.

## Workspace File Boundary
- NEVER create files outside the workspace directory (no `/tmp/`, `~/Desktop/`, etc.)
- ALL generated files (scripts, configs, logs, exports) MUST live inside the project repo
- If no suitable directory exists, extend the FSD structure: `scripts/`, `docs/`, or a new feature folder

## Token-Efficient Scripting
- ALWAYS create portable `.mts` scripts for repetitive or complex tasks
- Store scripts in the project's `scripts/` directory
- Prefer a single script execution over multiple manual chat-based file reads/edits

## No Hardcoded Colors
- NEVER use static hardcoded color values (hex, rgb, hsl) directly in components or stylesheets
- ALWAYS use CSS variables, Tailwind theme colors, or design token references from `src/shared/design/tokens.ts`
- Colors MUST come from a single source of truth

## Brand Spelling (Canonical — Zero Exceptions)
- Non-profit: **Ausome Angels** (A-U-S-O-M-E, never "Awesome")
- Music label: **Wyze Ink** (I-N-K, never "Inc")
- Apparel brand: **Michael Imani** (no variations)
