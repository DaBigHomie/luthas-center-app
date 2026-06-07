# Luthas Center for Excellence — Copilot Instructions

Read `AGENTS.md` for full project context.

## Stack
Next.js 15 + App Router + Supabase + Tailwind CSS + shadcn/ui

## Architecture
Feature-Sliced Design (FSD): `app` → `widgets` → `features` → `entities` → `shared`

## Conventions
- No raw hex colors — use design tokens from `src/shared/design/tokens.ts`
- No cross-feature imports
- All components must be TypeScript (.tsx)
- Use `@/` import alias

## Pre-Commit
```bash
npx tsc --noEmit && npm run lint && npm run build
```
