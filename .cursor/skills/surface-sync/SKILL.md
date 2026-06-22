---
name: surface-sync
description: >-
  Keep a capability consistent across ALL IDE surfaces when SSOT changes — not
  tied to one IDE format. Use when WARDEN domains change, new skills ship,
  sync-skills ran but commands are stale, or ide-parity-audit fails. Triggers:
  surface sync, surface parity, multi-surface, update warden commands, drift.
disable-model-invocation: true
---

# surface-sync

When **behavior** changes in scripts or hub skills, **every trigger surface**
must reflect it — not just one IDE. This skill is surface-agnostic; it routes
work to the right artifact type per surface.

**Playbook:** `documentation-standards/docs/MULTI-SURFACE-CAPABILITY-DEPLOYMENT.md`  
**Manifest SSOT:** `{repo}/cortex/ide-capability-manifest.json`

## Two lanes (do not conflate)

| Lane | What syncs | Tool | Surfaces affected |
|------|------------|------|-------------------|
| **A — Hub skills** | Full `SKILL.md` trees | `sync-skills.mts` | `.cursor/skills/`, `.gemini/skills/` on enrolled repos |
| **B — Capability triggers** | Commands, rules, instructions | **Manual** per matrix below | `.claude/commands/`, `.cursor/rules/`, `.github/instructions/`, `.agents/skills/` |

`sync-skills.mts` does **not** update lane B. Lane B drift is the #1 cause of
"supabase not shipped" in `/warden` while hub skill is correct.

## Surface matrix (lane B)

| Surface | Path pattern | SSOT body lives in |
|---------|--------------|-------------------|
| Claude Code | `.claude/commands/{cap}.md` | Hub skill + repo-specific `repo` slug |
| Cursor | `.cursor/rules/{cap}.mdc` | Same domain table as hub |
| Antigravity | `.github/instructions/{cap}.instructions.md` | Same |
| Claude Mac | `.agents/skills/{cap}/SKILL.md` | Copy from `documentation-standards/skills/{cap}/` |

**Canonical domain tables** for WARDEN: `documentation-standards/skills/warden/SKILL.md` § Domains.

## Workflow (any capability change)

### 1. Identify SSOT delta

Read the shipped script/skill header — not the oldest command file.

### 2. Update hub skill (documentation-standards/skills/)

Edit once; this is the prose SSOT for Claude Mac + sync-skills source.

### 3. Lane A — T1 skill fan-out

```bash
cd documentation-standards
npx tsx scripts/sync-skills.mts --dry-run --tier=T1
npx tsx scripts/sync-skills.mts --tier=T1
```

Scope: `workspace-rules/maximus-prime-repo-scope.json` repos with `tier: T1`.

### 4. Lane B — Per-repo trigger sync

For each capability in `ide-capability-manifest.json` with `parity: "parity"`:

1. Open all `impl.*` paths listed in manifest.
2. Align **Domains**, **Usage**, **Verdicts** with hub skill (repo slug in commands only).
3. Update manifest `note` if behavior summary changed.
4. Copy hub → `.agents/skills/{cap}/SKILL.md` on product repos (not automated by sync-skills today).

```bash
# Drift check (ATB example)
rg "supabase|not shipped" .claude/commands/warden.md .cursor/rules/warden.mdc \
  .github/instructions/warden.instructions.md .agents/skills/warden/SKILL.md
```

### 5. Parity audit

```bash
cd atl-table-booking-app   # or target repo
npx tsx scripts/cortex/ide-parity-audit.mts
```

### 6. malfig-ship

Branch per repo; WARDEN doc-place on doc-only changes.

## T1 rollout — WARDEN supabase + doc-forensic-inventory

| Step | Repo | Action |
|------|------|--------|
| 1 | documentation-standards | Hub skills current (`warden`, `doc-forensic-inventory`, `surface-sync`) |
| 2 | All T1 | `sync-skills.mts --tier=T1` |
| 3 | atl-table-booking-app | Lane B: update 4 `/warden` triggers + manifest |
| 4 | atl-table-booking-app | Register `/doc-forensic-inventory` in manifest |
| 5 | maximus-ai | `WARDEN-ARCHITECTURE.md` script index |

## WARDEN domain canon (copy into lane B files)

```markdown
| Domain | Check | In `--domain all`? |
|--------|-------|---------------------|
| `doc-place` | Banned names, nesting, duplicates, Change Log | Yes |
| `quality-gate` | `.workspace.config.json` → tsc | Yes |
| `supabase` | schema-guard, migration-gate, advisors stamp (ATB) | No — opt-in |
```

## Pairs with

`doc-forensic-inventory`, `sync-skills.mts`, `ide-parity-audit.mts`, `/warden`, `/malfig-ship`
