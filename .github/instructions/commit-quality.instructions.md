---
applyTo: "**"
---

# Commit Quality Rules — michael-imani-hub

## Format
```
{type}({scope}): {description}
```

## Types
| Type | Usage |
|------|-------|
| `feat` | New feature or capability |
| `fix` | Bug fix |
| `chore` | Build, config, dependency updates |
| `docs` | Documentation only |
| `refactor` | Code restructure without behavior change |
| `style` | Formatting, CSS, token changes |
| `test` | Test additions or fixes |
| `perf` | Performance improvements |

## Scopes (MIH-specific)
| Scope | Files |
|-------|-------|
| `clothing` | `src/features/clothing/**` |
| `music` | `src/features/music/**` |
| `angels` | `src/features/angels/**` |
| `checkout` | `src/features/checkout/**` |
| `admin` | `src/features/admin/**` |
| `shared` | `src/shared/**` |
| `entities` | `src/entities/**` |
| `widgets` | `src/widgets/**` |
| `app` | `src/app/**` |
| `design` | `src/shared/design/**`, `output/stitch/**` |
| `docs` | `docs/**`, `*.md` |
| `agents` | `.github/agents/**`, `.github/instructions/**` |
| `config` | `next.config.ts`, `tsconfig.json`, `package.json`, etc. |

## Examples
```
feat(clothing): add product grid with infinite scroll
fix(checkout): correct total calculation on quantity change
style(design): update primary accent token to Electric Blue
docs(agents): add malfig-gatekeeper agent spec for MIH
chore(config): update Supabase client to @supabase/ssr 0.5
```

## Pre-Commit Gate (MANDATORY)
```bash
npx tsc --noEmit && npm run lint && npm run build 2>&1 | tail -10
```
Never commit if any gate fails. If lint auto-fixes, re-stage only the fixed files.

## Staging Discipline
```bash
# CORRECT — explicit staging
git add src/features/clothing/ui/ProductCard.tsx src/features/clothing/index.ts

# BLOCKED — mass staging
git add -A
git commit -a
```
