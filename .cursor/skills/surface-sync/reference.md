# surface-sync — reference

## Lane A vs B

```
documentation-standards/skills/{cap}/SKILL.md  (SSOT prose)
        │
        ├── sync-skills.mts ──► {repo}/.cursor/skills/{cap}/
        │                       {repo}/.gemini/skills/{cap}/
        │
        └── manual lane B ────► {repo}/.claude/commands/{cap}.md
                              {repo}/.cursor/rules/{cap}.mdc
                              {repo}/.github/instructions/{cap}.instructions.md
                              {repo}/.agents/skills/{cap}/SKILL.md
```

## Manifest registration

After lane B edits, update `{repo}/cortex/ide-capability-manifest.json`:

- `impl` paths must exist on disk
- `note` one-liner must match current domains
- `parity: "parity"` requires all four surfaces (commands) or documented exception (skills)

## T1 hub skills (auto-discovered by sync-skills)

`surface-sync`, `doc-forensic-inventory`, `warden`, `malfig-ship`, `forecast-scrutiny`, `scrutinize`, `repo-sync-guard`, `malfig`, `multi-model-task-assignment`, `exit`, `generate-workspace`

## Anti-patterns

| Mistake | Fix |
|---------|-----|
| Only ran sync-skills | Also run lane B for `/warden` commands |
| Updated Cursor rule only | Touch all four manifest `impl` paths |
| Hardcoded ATB paths in hub skill | Hub uses `<slug>`; repo files use concrete slug |
