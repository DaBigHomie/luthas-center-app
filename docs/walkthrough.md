# Walkthrough — Luthas WP → React Migration Setup

## Session ID
`sess_luthas_wp_react_20260607` | Agent: 181 (Antigravity)

---

## Sites Delivered

| Site | GitHub | Dev Domain | Commits |
|------|--------|------------|---------|
| [Luthas Center for Excellence](https://github.com/DaBigHomie/luthas-center-app) | `DaBigHomie/luthas-center-app` | luthas-center.damieus.app | 3 |
| [Luthas.Org](https://github.com/DaBigHomie/luthas-org-app) | `DaBigHomie/luthas-org-app` | luthas-org.damieus.app | 3 |
| [Dame Luthas](https://github.com/DaBigHomie/dame-luthas-app) | `DaBigHomie/dame-luthas-app` | dame-luthas.damieus.app | 3 |

---

## Work Completed

### 1. Research & Boilerplate Audit
- Audited `management-git/` for existing WP migration tooling
- Found: CSS migration tool, WP GraphQL extractor, AI migration prompts, webapp builder plan, GCP WordPress configs
- Identified boilerplate from 043 (FSD architecture) and MIH (multi-brand, payments, email)
- Mapped existing `MASTER_TODO.md` entries (L323–349) already scoping these sites

### 2. CORTEX Task Registration
- 15 tasks registered in `agent_kb.sqlite` under session `sess_luthas_wp_react_20260607`
- 5 phases: scaffold (P1) → WP extraction (P1) → Supabase schema (P1) → frontend (P2) → deploy (P2)
- Scaffold tasks (`task_luthas_plan_001..003`) marked **complete**
- Walkthrough seeded: `artifact:sess_luthas:walkthrough` for all 3 repos

### 3. GitHub Repos + Next.js 15 Scaffolds
- 3 repos created via `gh repo create`
- Scaffolded with `create-next-app@latest --typescript --tailwind --eslint --app --src-dir --agents-md`
- Git remotes set, initial commits pushed (required `unset GITHUB_TOKEN` — stale env var)

### 4. Workspace Setup Script
Created [setup-luthas-workspace.mts](file:///Users/dame/management-git/damieus-workflow-agents/scripts/setup-luthas-workspace.mts) — generated **75 files** and **54 directories** across 3 repos:

| Category | Per-Repo Files |
|----------|---------------|
| Agent governance | `AGENTS.md`, `GEMINI.md`, `CLAUDE.md` |
| Manifest | `.codebase-manifest.json` |
| MALFIG agents (from MIH) | `malfig-gatekeeper`, `forge-orchestrator`, `code-review` |
| Instructions (from MIH) | `commit-quality`, `core-directives`, `typescript`, `design-system`, `supabase`, `app-router` |
| FSD source structure | `features/{site-specific}/`, `shared/{design,lib,ui,hooks,types}/`, `entities/`, `widgets/` |
| Design tokens | `src/shared/design/tokens.ts` (HSL-based, no raw hex) |
| Supabase | `supabase/config.toml`, `supabase/migrations/` |
| Docs | `PROJECT-OVERVIEW.md`, `WP-MIGRATION.md`, `MIGRATION-WALKTHROUGH.md` |
| Config | `.env.example`, `.gitignore` (agent entries), `.github/copilot-instructions.md` |

### 5. Architecture & Workflow Diagrams
Created [docs/MIGRATION-WALKTHROUGH.md](file:///Users/dame/management-git/luthas-center-app/docs/MIGRATION-WALKTHROUGH.md) with 7 Mermaid diagrams:
- **System Architecture** — WP → Extraction → Supabase → Next.js → Vercel → Cloudflare
- **Migration Workflow** — 5-phase pipeline, color-coded (green/yellow/gray)
- **FSD Architecture** — layer hierarchy per repo
- **Site-Specific Features** — unique feature slices per site
- **Data Flow Sequence** — WP GraphQL extraction pipeline
- **Agent Governance** — CORTEX/ANVIL/MALFIG/FORGE ecosystem
- **Boilerplate Reuse Map** — 043/MIH/DCM/DWA → target repos
- **Deployment Architecture** — GitHub → Vercel → Cloudflare

### 6. Google Drive & GCP MCP Integration
- Enabled `drive.googleapis.com` + `drivemcp.googleapis.com` on GCP `dame-494916`
- Added `gdrive` MCP server to Antigravity config (remote: `drivemcp.googleapis.com/mcp/v1`)
- Created and improved [refresh-gdrive-token.mts](file:///Users/dame/management-git/damieus-workflow-agents/scripts/refresh-gdrive-token.mts) to update access tokens for **all 7 Google Cloud MCP servers** in `mcp_config.json` (such as `gdrive`, `bigquery`, `alloydb`, etc.)
- Auth: ADC bearer token via `gcloud auth application-default print-access-token`
- Created **`/` shell function shortcut** in `~/.zshrc` so running `/` in the terminal instantly refreshes all GCP MCP tokens
- **Requires session restart** to load the `gdrive` MCP tools

### 7. Workspace Integration
- [luthas-wp-migration_antigravity.code-workspace](file:///Users/dame/management-git/luthas-wp-migration_antigravity.code-workspace) — 6 folders (3 sites + docs + migration tools + workflow agents)
- [session-startup.mts](file:///Users/dame/management-git/scripts/session-startup.mts) — 3 aliases added (`luthas-center`, `luthas-org`, `dame-luthas`)
- [REPO-INDEX.md](file:///Users/dame/management-git/documentation-standards/docs/REPO-INDEX.md) — 3 entries added

### 8. Root Cleanup
Moved scripts out of root `management-git/scripts/` into `damieus-workflow-agents/scripts/`:
- `setup-luthas-workspace.mts` → `damieus-workflow-agents/scripts/`
- `refresh-gdrive-token.mts` → `damieus-workflow-agents/scripts/`
- Updated all path references in `MIGRATION-WALKTHROUGH.md` across 3 repos

### 9. Document Rendering & Editor Parity Workflow
- Relocated the session planning files (`task.md`, `implementation_plan.md`, `walkthrough.md`) into the git-tracked [luthas-center-app/docs/](file:///Users/dame/management-git/luthas-center-app/docs/) folder and created symbolic links in the IDE's brain directory to keep the IDE and your workspace files in sync.
- Created [render-docs.mts](file:///Users/dame/management-git/damieus-workflow-agents/scripts/render-docs.mts) to parse custom IDE Markdown syntax (carousels, callout alerts, file badges, checklists) and compile them to beautiful, self-contained HTML files matching the "Royal Nightlife" dark theme.
- Added a `render-docs` shell function in `~/.zshrc`, `~/.bashrc`, and `~/.bash_profile` to compile and automatically launch preview documents in your browser.

---

## Files Created/Modified

### New files (in repo subfolders)
| Repo | Files |
|------|-------|
| `luthas-center-app` | 29 files (scaffold + FSD + agents + docs + planning files) |
| `luthas-org-app` | 24 files |
| `dame-luthas-app` | 25 files |
| `damieus-workflow-agents` | 3 scripts (`setup-luthas-workspace.mts`, `refresh-gdrive-token.mts`, `render-docs.mts`) |

### Modified files
| File | Change |
|------|--------|
| `scripts/session-startup.mts` | Added 3 repo aliases |
| `documentation-standards/docs/REPO-INDEX.md` | Added 3 repo entries |
| `~/.gemini/antigravity-ide/mcp_config.json` | Removed unused GCP servers, keeping only stitch and gdrive |
| `~/.zshrc` | Added `/` and `render-docs` shortcuts, and `.env.mcp` sourcing block |
| `~/.bashrc` | Added `render-docs` shortcut and `.env.mcp` sourcing block |
| `~/.bash_profile` | Added `render-docs` shortcut and `.env.mcp` sourcing block |
| `~/management-git/.env.mcp` | Fixed hyphenated variable syntax error |

---

## Next Session Checklist

1. **Restart Antigravity** — loads `gdrive` MCP tools
2. Run: `/` in the terminal to refresh Google Drive & GCP tokens
3. Search Google Drive for UpdraftPlus backups
4. Extract WP content (`task_luthas_wp_004..006`)
5. Design Supabase schemas (`task_luthas_db_007..009`)
6. Build frontends (`task_luthas_ui_010..012`)
7. Deploy to `*.damieus.app` (`task_luthas_deploy_013..015`)
