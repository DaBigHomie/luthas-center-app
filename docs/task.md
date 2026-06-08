# Luthas WP → React Migration — Task Tracker

## Phase 0: CORTEX + Planning
- [x] Register 15 CORTEX tasks in agent_kb.sqlite
- [x] Update REPO-INDEX.md with new repos
- [x] Register aliases in session-startup.mts
- [x] Relocate session planning files to git repository (docs/task.md, docs/walkthrough.md, docs/implementation_plan.md)
- [x] Create `render-docs.mts` compiler and `render-docs` shell command shortcut

## Phase 0.5: Google Drive MCP (for UpdraftPlus backups)
- [x] Enable Google Drive API in GCP project `dame-494916`
- [x] Enable Drive MCP service (`drivemcp.googleapis.com`)
- [x] Add `gdrive` MCP server to Antigravity config
- [x] Create token refresh script: `~/management-git/damieus-workflow-agents/scripts/refresh-gdrive-token.mts`
- [x] Create `/` zsh function shortcut to run refresh script
- [x] Add sourcing block for `.env.mcp` in `.zshrc`, `.bashrc`, and `.bash_profile`
- [ ] **Restart Antigravity session** to load `gdrive` MCP tools
- [ ] Search for UpdraftPlus backup folder in Google Drive
- [ ] Download/extract WP backup SQL dumps

## Phase 1: Git Repos + Scaffolds
- [x] Create GitHub repo: `DaBigHomie/luthas-center-app`
- [x] Create GitHub repo: `DaBigHomie/luthas-org-app`
- [x] Create GitHub repo: `DaBigHomie/dame-luthas-app`
- [x] Scaffold Next.js 15 app: `luthas-center-app`
- [x] Scaffold Next.js 15 app: `luthas-org-app`
- [x] Scaffold Next.js 15 app: `dame-luthas-app`
- [x] Add git remote: all 3 repos → GitHub
- [x] Create workspace file: `luthas-wp-migration_antigravity.code-workspace`
- [x] Create setup script: `scripts/setup-luthas-workspace.mts`
- [x] Generate standard files (75 files, 54 dirs):
  - [x] AGENTS.md, GEMINI.md, CLAUDE.md per repo
  - [x] .codebase-manifest.json per repo
  - [x] .github/agents/ (malfig, forge, code-review) per repo
  - [x] .github/instructions/ (6 instruction files) per repo
  - [x] .github/copilot-instructions.md per repo
  - [x] FSD src/ structure (shared/, entities/, features/, widgets/) per repo
  - [x] Design tokens (src/shared/design/tokens.ts) per repo
  - [x] Supabase client stub per repo
  - [x] docs/ (PROJECT-OVERVIEW.md, WP-MIGRATION.md) per repo
  - [x] supabase/ config per repo
  - [x] .env.example per repo
  - [x] .gitignore agent entries per repo
- [ ] Push initial commits to GitHub

## Phase 2: WP Content Extraction (needs Google Drive MCP)
- [ ] Locate UpdraftPlus backups via Google Drive MCP
- [ ] Download/restore WP backups
- [ ] Run extraction scripts per site
- [ ] Run CSS migration tool per site

## Phase 3: Supabase Schema (deferred — needs extracted content)
- [ ] Design schema per site
- [ ] Create Supabase projects
- [ ] Apply migrations

## Phase 4: Frontend Build (deferred)
- [ ] Build UI per site

## Phase 5: Deploy (deferred)
- [ ] Deploy to *.damieus.app
