# Luthas WP → React Migration — Architecture & Walkthrough

> **Agent Reference**: This document is the single source of truth for the WordPress-to-React migration across all three Luthas sites.
> **CORTEX Key**: `artifact:sess_luthas:walkthrough`
> **Session**: `sess_luthas_wp_react_20260607`
> **Last Updated**: 2026-06-07

---

## Sites Overview

| Site | WordPress Source | React Repo | Dev Domain | Type |
|------|-----------------|------------|------------|------|
| Luthas Center for Excellence | luthascenter.com | `luthas-center-app` | luthas-center.damieus.app | LMS + Nonprofit |
| Luthas.Org | luthas.org | `luthas-org-app` | luthas-org.damieus.app | Content/Blog |
| Dame Luthas | dameluthas.com | `dame-luthas-app` | dame-luthas.damieus.app | Portfolio |

---

## System Architecture

```mermaid
graph TB
    subgraph "WordPress Sources"
        WP1["luthascenter.com<br/>(UpdraftPlus backup)"]
        WP2["luthas.org<br/>(UpdraftPlus backup)"]
        WP3["dameluthas.com<br/>(UpdraftPlus backup)"]
    end

    subgraph "Extraction Layer"
        GD["Google Drive<br/>(UpdraftPlus backups)"]
        EXT["WP GraphQL Extractor<br/>extract-wordpress-content.ts"]
        CSS["CSS Migration Tool<br/>css-migration-tool/"]
    end

    subgraph "Data Layer"
        SB1["Supabase Project<br/>luthas-center"]
        SB2["Supabase Project<br/>luthas-org"]
        SB3["Supabase Project<br/>dame-luthas"]
    end

    subgraph "Application Layer"
        APP1["luthas-center-app<br/>Next.js 15 + App Router"]
        APP2["luthas-org-app<br/>Next.js 15 + App Router"]
        APP3["dame-luthas-app<br/>Next.js 15 + App Router"]
    end

    subgraph "Deployment"
        V1["Vercel<br/>luthas-center.damieus.app"]
        V2["Vercel<br/>luthas-org.damieus.app"]
        V3["Vercel<br/>dame-luthas.damieus.app"]
        CF["Cloudflare DNS<br/>*.damieus.app"]
    end

    WP1 --> GD
    WP2 --> GD
    WP3 --> GD
    GD --> EXT
    GD --> CSS
    EXT --> SB1
    EXT --> SB2
    EXT --> SB3
    CSS --> APP1
    CSS --> APP2
    CSS --> APP3
    SB1 --> APP1
    SB2 --> APP2
    SB3 --> APP3
    APP1 --> V1
    APP2 --> V2
    APP3 --> V3
    V1 --> CF
    V2 --> CF
    V3 --> CF
```

---

## Migration Workflow

```mermaid
flowchart LR
    subgraph "Phase 0: Planning"
        P0A["CORTEX Tasks<br/>Registered"] --> P0B["Repos Created<br/>on GitHub"]
        P0B --> P0C["Next.js 15<br/>Scaffolded"]
        P0C --> P0D["FSD Structure<br/>+ Agent Files"]
    end

    subgraph "Phase 1: Extraction"
        P1A["Google Drive MCP<br/>Locate Backups"] --> P1B["Restore WP<br/>Locally"]
        P1B --> P1C["GraphQL<br/>Extract Content"]
        P1C --> P1D["CSS Migration<br/>Extract Tokens"]
    end

    subgraph "Phase 2: Schema"
        P2A["Design Supabase<br/>Schema"] --> P2B["Create Tables<br/>+ RLS"]
        P2B --> P2C["Seed Data<br/>from WP Export"]
    end

    subgraph "Phase 3: Build"
        P3A["Build Pages<br/>+ Components"] --> P3B["Wire Data<br/>Layer"]
        P3B --> P3C["Design System<br/>Polish"]
    end

    subgraph "Phase 4: Deploy"
        P4A["Vercel Project<br/>Setup"] --> P4B["DNS Config<br/>*.damieus.app"]
        P4B --> P4C["Production<br/>Validation"]
    end

    P0D --> P1A
    P1D --> P2A
    P2C --> P3A
    P3C --> P4A

    style P0A fill:#22c55e,color:#fff
    style P0B fill:#22c55e,color:#fff
    style P0C fill:#22c55e,color:#fff
    style P0D fill:#22c55e,color:#fff
    style P1A fill:#f59e0b,color:#fff
    style P1B fill:#94a3b8,color:#fff
    style P1C fill:#94a3b8,color:#fff
    style P1D fill:#94a3b8,color:#fff
    style P2A fill:#94a3b8,color:#fff
    style P2B fill:#94a3b8,color:#fff
    style P2C fill:#94a3b8,color:#fff
    style P3A fill:#94a3b8,color:#fff
    style P3B fill:#94a3b8,color:#fff
    style P3C fill:#94a3b8,color:#fff
    style P4A fill:#94a3b8,color:#fff
    style P4B fill:#94a3b8,color:#fff
    style P4C fill:#94a3b8,color:#fff
```

> **Legend**: 🟢 Green = Complete | 🟡 Yellow = In Progress | ⬜ Gray = Pending

---

## FSD Architecture (Per Repo)

```mermaid
graph TB
    subgraph "app/ (Routes + Pages)"
        A1["layout.tsx"]
        A2["page.tsx"]
        A3["(feature)/page.tsx"]
        A4["admin/"]
    end

    subgraph "widgets/ (Composed UI Blocks)"
        W1["Header"]
        W2["Footer"]
        W3["Sidebar"]
    end

    subgraph "features/ (Business Logic)"
        F1["auth/"]
        F2["blog/"]
        F3["contact/"]
        F4["admin/"]
        F5["site-specific/*"]
    end

    subgraph "entities/ (Domain Models)"
        E1["post/"]
        E2["page/"]
        E3["profile/"]
        E4["site-specific/*"]
    end

    subgraph "shared/ (Cross-Cutting)"
        S1["design/tokens.ts"]
        S2["lib/supabase.ts"]
        S3["ui/ (shadcn components)"]
        S4["hooks/"]
        S5["types/"]
    end

    A1 --> W1
    A1 --> W2
    A3 --> F5
    A4 --> F4
    W1 --> F1
    F1 --> E3
    F2 --> E1
    F5 --> E4
    E1 --> S2
    E3 --> S2
    F5 --> S3
    S3 --> S1

    style S1 fill:#2563eb,color:#fff
    style S2 fill:#2563eb,color:#fff
```

### Site-Specific Features

```mermaid
graph LR
    subgraph "luthas-center-app"
        LC1["courses/"]
        LC2["resources/"]
        LC3["donate/"]
    end

    subgraph "luthas-org-app"
        LO1["blog/"]
        LO2["projects/"]
    end

    subgraph "dame-luthas-app"
        DL1["portfolio/"]
        DL2["case-studies/"]
        DL3["services/"]
    end
```

---

## Data Flow: WP Content Extraction

```mermaid
sequenceDiagram
    participant GD as Google Drive
    participant WP as WordPress (Local)
    participant EXT as Extractor Script
    participant SB as Supabase
    participant APP as Next.js App

    GD->>WP: UpdraftPlus SQL + wp-content restore
    WP->>WP: Enable WPGraphQL plugin
    EXT->>WP: GraphQL queries (pages, posts, media, menus)
    WP-->>EXT: JSON content payload
    EXT->>EXT: Transform WP HTML → MDX/structured data
    EXT->>SB: INSERT into content tables
    SB-->>APP: Real-time data via Supabase client
    APP->>APP: ISR/SSG page rendering
```

---

## Agent Governance Architecture

```mermaid
graph TB
    subgraph "CORTEX Ecosystem"
        CORTEX["CORTEX<br/>Task Registry"]
        ANVIL["ANVIL<br/>Session Lifecycle"]
        MALFIG["MALFIG<br/>Quality Gates"]
        FORGE["FORGE<br/>Model Routing"]
    end

    subgraph "Agent Governance (Per Repo)"
        AG1[".github/agents/malfig-gatekeeper.agent.md"]
        AG2[".github/agents/forge-orchestrator.agent.md"]
        AG3[".github/agents/code-review.agent.md"]
    end

    subgraph "Instruction Files (Per Repo)"
        I1["commit-quality"]
        I2["core-directives"]
        I3["typescript"]
        I4["design-system"]
        I5["supabase"]
        I6["app-router"]
    end

    subgraph "Session Flow"
        S1["cortex-boot.mts<br/>→ .cortex-boot.json"] --> S2["Task Execution"]
        S2 --> S3["checkpoint.mts"]
        S3 --> S4["close.mts"]
    end

    CORTEX --> ANVIL
    ANVIL --> S1
    MALFIG --> AG1
    FORGE --> AG2
    AG1 --> I1
    AG1 --> I2
```

---

## Boilerplate Reuse Map

```mermaid
graph LR
    subgraph "Source Repos"
        O43["one4three-co-next-app<br/>(043)"]
        MIH["michael-imani-hub<br/>(MIH)"]
        DCM["damieus-com-migration"]
        DWA["damieus-workflow-agents"]
    end

    subgraph "Shared Patterns"
        BP1["FSD Architecture"]
        BP2["Auth Flow"]
        BP3["Admin Panel"]
        BP4["Design Tokens"]
        BP5["Email Templates"]
        BP6["Payment Flow"]
        BP7["WP Extractor"]
        BP8["CSS Migrator"]
    end

    subgraph "Target Repos"
        LC["luthas-center-app"]
        LO["luthas-org-app"]
        DL["dame-luthas-app"]
    end

    O43 --> BP1
    O43 --> BP2
    O43 --> BP3
    O43 --> BP4
    MIH --> BP5
    MIH --> BP6
    DCM --> BP7
    DWA --> BP7
    DWA --> BP8

    BP1 --> LC
    BP1 --> LO
    BP1 --> DL
    BP2 --> LC
    BP3 --> LC
    BP4 --> LC
    BP4 --> LO
    BP4 --> DL
    BP6 --> LC
    BP7 --> LC
    BP7 --> LO
    BP7 --> DL
    BP8 --> LC
    BP8 --> LO
    BP8 --> DL
```

---

## Deployment Architecture

```mermaid
graph TB
    subgraph "GitHub (DaBigHomie)"
        GH1["luthas-center-app"]
        GH2["luthas-org-app"]
        GH3["dame-luthas-app"]
    end

    subgraph "Vercel"
        VP1["Project: luthas-center"]
        VP2["Project: luthas-org"]
        VP3["Project: dame-luthas"]
        VB["Vercel Build<br/>(next build)"]
        VE["Edge Network<br/>(CDN)"]
    end

    subgraph "Supabase"
        SP1["DB: luthas-center"]
        SP2["DB: luthas-org"]
        SP3["DB: dame-luthas"]
        SA["Auth Service"]
        SS["Storage (Media)"]
    end

    subgraph "Cloudflare"
        DNS["DNS: *.damieus.app"]
        SSL["SSL/TLS"]
    end

    GH1 -->|push to main| VP1
    GH2 -->|push to main| VP2
    GH3 -->|push to main| VP3
    VP1 --> VB --> VE
    VP2 --> VB
    VP3 --> VB
    VE --> DNS --> SSL
    VP1 -.->|env vars| SP1
    VP2 -.->|env vars| SP2
    VP3 -.->|env vars| SP3
    SP1 --> SA
    SP2 --> SA
    SP3 --> SA
    SP1 --> SS
```

---

## CORTEX Task Status

| Task ID | Repo | Description | Status |
|---------|------|-------------|--------|
| `task_luthas_plan_001` | luthas-center-app | Create repo + scaffold | ✅ Complete |
| `task_luthas_plan_002` | luthas-org-app | Create repo + scaffold | ✅ Complete |
| `task_luthas_plan_003` | dame-luthas-app | Create repo + scaffold | ✅ Complete |
| `task_luthas_wp_004` | luthas-center-app | Extract WP content | ⏳ Pending |
| `task_luthas_wp_005` | luthas-org-app | Extract WP content | ⏳ Pending |
| `task_luthas_wp_006` | dame-luthas-app | Extract WP content | ⏳ Pending |
| `task_luthas_db_007` | luthas-center-app | Supabase schema | ⏳ Pending |
| `task_luthas_db_008` | luthas-org-app | Supabase schema | ⏳ Pending |
| `task_luthas_db_009` | dame-luthas-app | Supabase schema | ⏳ Pending |
| `task_luthas_ui_010` | luthas-center-app | Build frontend | ⏳ Pending |
| `task_luthas_ui_011` | luthas-org-app | Build frontend | ⏳ Pending |
| `task_luthas_ui_012` | dame-luthas-app | Build frontend | ⏳ Pending |
| `task_luthas_deploy_013` | luthas-center-app | Deploy to Vercel | ⏳ Pending |
| `task_luthas_deploy_014` | luthas-org-app | Deploy to Vercel | ⏳ Pending |
| `task_luthas_deploy_015` | dame-luthas-app | Deploy to Vercel | ⏳ Pending |

---

## Key Files & Scripts

| File | Purpose |
|------|---------|
| `~/management-git/damieus-workflow-agents/scripts/setup-luthas-workspace.mts` | Setup/regenerate repo structure |
| `~/management-git/damieus-workflow-agents/scripts/refresh-gdrive-token.mts` | Refresh Google Drive MCP OAuth token |
| `~/management-git/scripts/session-startup.mts` | CORTEX session bootstrap (aliases registered) |
| `~/management-git/luthas-wp-migration_antigravity.code-workspace` | VS Code workspace |
| `~/management-git/damieus-workflow-agents/scripts/scripts/extract-wordpress-content.ts` | WP GraphQL extractor |
| `~/management-git/damieus-workflow-agents/tools/css-migration-tool/` | CSS → Tailwind token migration |
| `~/management-git/tmp/AI Prompts for WordPress to React Migrat.md` | 5-phase migration playbook |

---

## GCP / Google Drive Setup

| Item | Value |
|------|-------|
| GCP Project | `dame-494916` |
| Active Account | `dameluthas@gmail.com` |
| APIs Enabled | `drive.googleapis.com`, `drivemcp.googleapis.com` |
| MCP Endpoint | `https://drivemcp.googleapis.com/mcp/v1` |
| Auth | ADC bearer token (1hr expiry, refresh via script) |
