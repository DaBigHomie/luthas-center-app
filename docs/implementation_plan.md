# WordPress → React Migration: Luthas Portfolio Sites

Build React web apps for three WordPress sites, register as CORTEX tasks, create git repos, and deploy to `*.damieus.app` dev domains.

## Sites

| Site | Current Domain | WP Theme | Dev Domain | Repo Name | GitHub Slug |
|------|---------------|----------|------------|-----------|-------------|
| Luthas Center for Excellence | luthascenter.com | Unknown (LMS/Nonprofit) | luthas-center.damieus.app | `luthas-center-app` | `DaBigHomie/luthas-center-app` |
| Luthas.Org | luthas.org | Unknown (Content/Blog) | luthas-org.damieus.app | `luthas-org-app` | `DaBigHomie/luthas-org-app` |
| Dame Luthas | dameluthas.com | The Gem + Elementor | dame-luthas.damieus.app | `dame-luthas-app` | `DaBigHomie/dame-luthas-app` |

---

## User Review Required

> [!IMPORTANT]
> **UpdraftPlus Restores**: You mentioned the WordPress restores are in the UpdraftPlus Google Drive folder. To proceed with content extraction, we need:
> 1. Access to the UpdraftPlus backup files (SQL dumps + wp-content archives)
> 2. OR the ability to spin up local WordPress instances from those backups for GraphQL extraction

> [!IMPORTANT]
> **Repo Strategy**: Three separate repos (recommended) vs. a Turborepo monorepo? Separate repos follow existing workspace conventions (each site gets its own `~/management-git/` folder). A monorepo would maximize code sharing but adds complexity.

> [!IMPORTANT]
> **Stack Confirmation**: The plan uses **Next.js 15 + App Router + Supabase + Tailwind + shadcn/ui** (same stack as `michael-imani-hub` and `one4three-co-next-app`). Confirm this is desired, or if you'd prefer Vite + React Router (like `damieus-com-migration`).

---

## Open Questions

> [!WARNING]
> **Supabase Projects**: Do these three sites share one Supabase project or get individual projects? The `luthascenter.com` Stripe account (`acct_1KBVPUGuboIf7Jd3` / `donate@luthas.com`) already exists — does it stay?

> [!IMPORTANT]
> **Content Scope per Site**: What content from each WP site needs to migrate?
> - **luthascenter.com** — LMS courses? Blog posts? Mental health resources? Donation/payment flows?
> - **luthas.org** — Blog posts only? Pages? Projects (custom post type)?
> - **dameluthas.com** — Portfolio items? Case studies? Resume/CV? Services?

> [!NOTE]
> **Domain DNS**: The `*.damieus.app` wildcard is already configured via Cloudflare → Vercel. Subdomains just need Vercel project assignment.

---

## Existing Assets Inventory (Boilerplate Opportunities)

### Already in workspace — REUSE

| Asset | Location | Reuse For |
|-------|----------|-----------|
| **CSS Migration Tool** | [css-migration-tool](file:///Users/dame/management-git/damieus-workflow-agents/tools/css-migration-tool) | Extract WP styles → Tailwind tokens for all 3 sites |
| **Dame Luthas project config** | [dame-luthas.json](file:///Users/dame/management-git/damieus-workflow-agents/tools/css-migration-tool/projects/dame-luthas.json) | Pre-configured WP → Next.js migration for dameluthas.com |
| **WP GraphQL Extractor** | [extract-wordpress-content.ts](file:///Users/dame/management-git/damieus-workflow-agents/scripts/scripts/extract-wordpress-content.ts) | Content extraction pipeline (already targets `dameluthas-com-restore.local`) |
| **WP Content Scraper** | [extract-case-studies.ts](file:///Users/dame/management-git/damieus-workflow-agents/scripts/scripts/extract-case-studies.ts) | Portfolio/case study extraction |
| **WP Migration Prompts** | [AI Prompts for WordPress to React Migrat.md](file:///Users/dame/management-git/tmp/AI%20Prompts%20for%20WordPress%20to%20React%20Migrat.md) | Phase-by-phase migration playbook (covers all 3 sites!) |
| **Webapp Builder Plan** | [WEBAPP_BUILDER_IMPLEMENTATION_PLAN.md](file:///Users/dame/management-git/damieus-workflow-agents/WEBAPP_BUILDER_IMPLEMENTATION_PLAN.md) | Template system already has `wordpress-hybrid/` slots for all 3 sites |
| **043 Boilerplate (Next.js 15)** | [one4three-co-next-app](file:///Users/dame/management-git/one4three-co-next-app) | FSD architecture, auth, admin panel, checkout flow, e-commerce patterns |
| **MIH Boilerplate (Next.js 15)** | [michael-imani-hub](file:///Users/dame/management-git/michael-imani-hub) | Multi-brand routing, design tokens, email templates, client portal |
| **damieus-com-migration (Vite)** | [damieus-com-migration](file:///Users/dame/management-git/damieus-com-migration) | 55 Supabase migrations, persona system, e-commerce, WP migration tools |
| **GCP WordPress configs** | [archived repos](file:///Users/dame/management-git/_archived-repos/2025_main) | `luthascenter-com-nginx.php`, `luthascenter-com-wpconfig.php`, VM build scripts |
| **MASTER_TODO entries** | [MASTER_TODO.md:L323-349](file:///Users/dame/management-git/MASTER_TODO.md#L323-L349) | Pre-planned tasks for all 3 WP sites (already scoped) |

### Shared Boilerplate Package (New)

Extract common patterns into a shared package or template:

```
~/management-git/luthas-shared-lib/
├── src/
│   ├── components/       # Shared UI (header, footer, nav, CTA)
│   ├── design/           # Design tokens (Luthas brand palette)
│   ├── hooks/            # useSupabase, useCMS, useAuth
│   ├── lib/              # Supabase client, analytics, utils
│   └── types/            # Shared TypeScript types
├── package.json
└── tsconfig.json
```

---

## Proposed Changes

### Phase 0: CORTEX Task Registration + Planning Docs

Register all tasks in CORTEX knowledge base and create per-site planning docs.

#### CORTEX Tasks to Insert

```sql
-- Task group: WordPress → React Migration (Luthas Sites)
INSERT INTO tasks (id, session_id, repo, description, status, priority, output_blob) VALUES
  ('task_luthas_plan_001', '{SESSION}', 'luthas-center-app', 'Create luthas-center-app repo + Next.js 15 scaffold from 043 boilerplate', 'pending', 'P1', json('{"assigned_model":"antigravity","group":"wp-react-migration","site":"luthascenter.com"}')),
  ('task_luthas_plan_002', '{SESSION}', 'luthas-org-app', 'Create luthas-org-app repo + Next.js 15 scaffold from 043 boilerplate', 'pending', 'P1', json('{"assigned_model":"antigravity","group":"wp-react-migration","site":"luthas.org"}')),
  ('task_luthas_plan_003', '{SESSION}', 'dame-luthas-app', 'Create dame-luthas-app repo + Next.js 15 scaffold from 043 boilerplate', 'pending', 'P1', json('{"assigned_model":"antigravity","group":"wp-react-migration","site":"dameluthas.com"}')),
  ('task_luthas_wp_004', '{SESSION}', 'luthas-center-app', 'Extract WP content from UpdraftPlus backup — luthascenter.com', 'pending', 'P1', json('{"assigned_model":"antigravity","group":"wp-react-migration","depends_on":"task_luthas_plan_001"}')),
  ('task_luthas_wp_005', '{SESSION}', 'luthas-org-app', 'Extract WP content from UpdraftPlus backup — luthas.org', 'pending', 'P1', json('{"assigned_model":"antigravity","group":"wp-react-migration","depends_on":"task_luthas_plan_002"}')),
  ('task_luthas_wp_006', '{SESSION}', 'dame-luthas-app', 'Extract WP content from UpdraftPlus backup — dameluthas.com', 'pending', 'P1', json('{"assigned_model":"antigravity","group":"wp-react-migration","depends_on":"task_luthas_plan_003"}')),
  ('task_luthas_db_007', '{SESSION}', 'luthas-center-app', 'Design + create Supabase schema — LMS courses, resources, donations', 'pending', 'P1', json('{"assigned_model":"antigravity","group":"wp-react-migration","depends_on":"task_luthas_wp_004"}')),
  ('task_luthas_db_008', '{SESSION}', 'luthas-org-app', 'Design + create Supabase schema — posts, pages, projects', 'pending', 'P1', json('{"assigned_model":"antigravity","group":"wp-react-migration","depends_on":"task_luthas_wp_005"}')),
  ('task_luthas_db_009', '{SESSION}', 'dame-luthas-app', 'Design + create Supabase schema — portfolio, case studies, services', 'pending', 'P1', json('{"assigned_model":"antigravity","group":"wp-react-migration","depends_on":"task_luthas_wp_006"}')),
  ('task_luthas_ui_010', '{SESSION}', 'luthas-center-app', 'Build LMS frontend — course catalog, resource library, donation flow', 'pending', 'P2', json('{"assigned_model":"antigravity","group":"wp-react-migration","depends_on":"task_luthas_db_007"}')),
  ('task_luthas_ui_011', '{SESSION}', 'luthas-org-app', 'Build content frontend — blog, pages, navigation', 'pending', 'P2', json('{"assigned_model":"antigravity","group":"wp-react-migration","depends_on":"task_luthas_db_008"}')),
  ('task_luthas_ui_012', '{SESSION}', 'dame-luthas-app', 'Build portfolio frontend — projects, case studies, contact', 'pending', 'P2', json('{"assigned_model":"antigravity","group":"wp-react-migration","depends_on":"task_luthas_db_009"}')),
  ('task_luthas_deploy_013', '{SESSION}', 'luthas-center-app', 'Deploy luthas-center.damieus.app — Vercel + DNS', 'pending', 'P2', json('{"assigned_model":"antigravity","group":"wp-react-migration","depends_on":"task_luthas_ui_010"}')),
  ('task_luthas_deploy_014', '{SESSION}', 'luthas-org-app', 'Deploy luthas-org.damieus.app — Vercel + DNS', 'pending', 'P2', json('{"assigned_model":"antigravity","group":"wp-react-migration","depends_on":"task_luthas_ui_011"}')),
  ('task_luthas_deploy_015', '{SESSION}', 'dame-luthas-app', 'Deploy dame-luthas.damieus.app — Vercel + DNS', 'pending', 'P2', json('{"assigned_model":"antigravity","group":"wp-react-migration","depends_on":"task_luthas_ui_012"}'));
```

---

### Phase 1: Git Repos + Next.js Scaffolds (3 repos)

For each site, create a GitHub repo and scaffold from the 043 boilerplate:

#### [NEW] `luthas-center-app/`

LMS + Nonprofit site (luthascenter.com → Luthas Center for Excellence)

```bash
# Create GitHub repo
gh repo create DaBigHomie/luthas-center-app --public --description "Luthas Center for Excellence — React Web App (Next.js 15 + Supabase)"

# Clone and scaffold
cd ~/management-git
npx -y create-next-app@latest luthas-center-app --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm

# Copy FSD structure from 043
cp -r one4three-co-next-app/src/shared/ luthas-center-app/src/shared/
cp -r one4three-co-next-app/src/entities/ luthas-center-app/src/entities/
```

Features to scaffold:
- `/courses` — LMS course catalog
- `/resources` — Mental health resources
- `/donate` — Donation/payment page (reuse MIH Cash App/Zelle flow)
- `/blog` — Content from WP posts
- `/about` — About Luthas Center
- Admin panel (from 043 boilerplate)

#### [NEW] `luthas-org-app/`

Content/blog site (luthas.org)

Features:
- `/` — Homepage
- `/blog` — Blog listing + detail
- `/projects` — Project showcase (WP custom post type)
- `/about` — About page
- `/contact` — Contact form

#### [NEW] `dame-luthas-app/`

Personal portfolio (dameluthas.com)

Features:
- `/` — Portfolio homepage
- `/portfolio` — Project gallery
- `/case-studies` — Detailed case studies
- `/services` — Service offerings
- `/about` — Bio/resume
- `/contact` — Contact form

---

### Phase 2: WordPress Content Extraction

Use the existing tooling in `damieus-workflow-agents/`:

1. **Restore WP from UpdraftPlus** — Extract SQL + wp-content from Google Drive backups
2. **Spin up local WP** — Docker or local PHP for GraphQL extraction
3. **Run extraction scripts** — Adapt [extract-wordpress-content.ts](file:///Users/dame/management-git/damieus-workflow-agents/scripts/scripts/extract-wordpress-content.ts) per site
4. **Run CSS migration** — Use [css-migration-tool](file:///Users/dame/management-git/damieus-workflow-agents/tools/css-migration-tool) for style tokens

```bash
# Per-site extraction (adapt endpoint per restore)
cd ~/management-git/damieus-workflow-agents
npx tsx scripts/scripts/extract-wordpress-content.ts --endpoint=http://luthascenter-restore.local/graphql
npx tsx scripts/scripts/extract-wordpress-content.ts --endpoint=http://luthas-org-restore.local/graphql
npx tsx scripts/scripts/extract-wordpress-content.ts --endpoint=http://dameluthas-restore.local/graphql
```

---

### Phase 3: Supabase Schema + Data Migration

Per site, design schema based on extracted WP content:

| Site | Key Tables | Supabase Project |
|------|-----------|------------------|
| Luthas Center | `courses`, `resources`, `donations`, `posts`, `pages` | TBD (new or shared) |
| Luthas.Org | `posts`, `pages`, `projects`, `categories`, `menus` | TBD |
| Dame Luthas | `portfolio_items`, `case_studies`, `services`, `posts` | TBD |

---

### Phase 4: Frontend Build (per site)

Each site gets a full-stack Next.js 15 implementation using:
- **Design system**: Per-site brand tokens (extracted via CSS migration tool)
- **Components**: shadcn/ui + custom components
- **Data layer**: Supabase client + React Query
- **Auth**: Supabase Auth (if needed)
- **CMS**: Supabase as headless CMS (content tables + admin panel)

---

### Phase 5: Deploy to `*.damieus.app`

```bash
# Per repo
cd ~/management-git/luthas-center-app
vercel link
vercel domains add luthas-center.damieus.app

cd ~/management-git/luthas-org-app
vercel link
vercel domains add luthas-org.damieus.app

cd ~/management-git/dame-luthas-app
vercel link
vercel domains add dame-luthas.damieus.app
```

---

## Boilerplate Maximization Strategy

### What to fork from 043 (one4three-co-next-app)

| Pattern | Source Files | Why |
|---------|-------------|-----|
| FSD Architecture | `src/{app,entities,features,shared,widgets}` | Proven layer isolation |
| Auth Flow | `src/features/auth/` | Supabase auth, register, login, reset |
| Admin Panel | `src/app/admin/` | Dashboard, settings, CRUD |
| Blog/Content | `src/content/` | MDX or DB-backed posts |
| Contact Form | `src/features/contact/` | Form + Supabase Edge Function |
| Design Tokens | `src/shared/design/` | Token system (adapt per brand) |
| Checkout (Luthas Center only) | `src/features/shop/` | Donation/payment flow |

### What to fork from MIH (michael-imani-hub)

| Pattern | Source Files | Why |
|---------|-------------|-----|
| Multi-brand routing | `src/app/(brand)/` | If we combine Luthas sites later |
| Email templates | `src/shared/email/` | Transactional emails |
| Client portal | `src/app/client/` | If Luthas Center needs member area |
| Cash App/Zelle payment | `src/features/checkout/` | Manual payment (no PCI) for donations |

### What to fork from damieus-com-migration

| Pattern | Source Files | Why |
|---------|-------------|-----|
| Persona system | `src/features/personas/` | Audience-specific landing pages |
| Portfolio/Projects | `src/pages/portfolio/` | Portfolio showcase for dameluthas.com |
| Service pages | `src/features/services/` | Service offerings for both sites |
| Migration tooling | `tools/migration/` | WP content extraction pipeline |

---

## REPO-INDEX Updates

Add to [REPO-INDEX.md](file:///Users/dame/management-git/documentation-standards/docs/REPO-INDEX.md):

```markdown
| `luthas-center` | `luthas-center-app` | `DaBigHomie/luthas-center-app` | `main` |
| `luthas-org` | `luthas-org-app` | `DaBigHomie/luthas-org-app` | `main` |
| `dame-luthas` | `dame-luthas-app` | `DaBigHomie/dame-luthas-app` | `main` |
```

---

## Verification Plan

### Automated Tests
```bash
# Per repo
npx tsc --noEmit && npm run lint && npm run build
```

### Manual Verification
- Verify dev domains resolve: `curl -I https://luthas-center.damieus.app`
- Side-by-side comparison with WP originals using existing visual comparison tools
- Content parity check — ensure all WP pages/posts are represented
- Responsive testing — mobile/tablet/desktop viewports
