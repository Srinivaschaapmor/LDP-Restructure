# ADR-0003: Engineering standards are authored as skills, indexed by docs/01-standards

- **Status:** Accepted
- **Date:** 2026-07-07
- **Deciders:** sai_dev1@aapmor.com, Claude (mentor)

## Context
Phase 0 · Step 2 created 11 detailed engineering-standard **skills** in `.claude/skills/`.
Phase 0 · Step 5 was chartered to "finalize engineering standards in `docs/01-standards/`,
one file per concern." Those concern lists are the **same topics** — so producing full docs
would duplicate the skills, and duplication across two locations is the drift risk ADR-0001
explicitly forbids. A single source of truth must be chosen.

## Options considered
1. **Skills canonical; `docs/01-standards/` is a map** — skills stay the detailed source
   (already written, auto-loaded by Claude on task match); docs holds a concern→skill map plus
   items with no skill. Low churn, no duplication, no extra read per task. Slightly unconventional
   home for "human docs."
2. **Docs canonical; skills become thin activators** — move each skill body into
   `docs/01-standards/*.md`; rewrite the 11 skills as pointers. Matches the original wording
   literally, but ~22 files change and every skill-triggered task incurs an extra `Read`.
3. **Full content in both** — rejected outright; guaranteed drift.

## Decision
Adopt **Option 1**. The **skills in `.claude/skills/` are the canonical engineering standards.**
`docs/01-standards/README.md` is the human-facing **map** (concern → owning skill). The only
standalone doc is an **interim** one for a concern with no skill yet (`performance.md`), which a
future batch-2 skill will supersede.

## Rationale
- Skills are already authored and are the layer Claude **auto-loads** while working — keeping
  content there means the standard is in context exactly when it is applied, with no extra read.
- One source of truth eliminates drift (honors ADR-0001).
- Minimal churn; the map degrades gracefully (only needs edits when a concern/skill is added).

## Consequences
- Positive: no duplication; standards live where they are enforced; docs stay a thin, reviewable index.
- Negative / trade-offs: standards physically live under `.claude/` rather than `docs/`; contributors
  must follow the map to reach them. Mitigated by the map + this ADR.
- Follow-ups: when batch-2 skills land (`performance-optimization`, `nextjs-development`,
  `typescript-standards`, `bootstrap-development`, `contentful-development`, `figma-mcp-workflow`),
  add them to the map and retire `performance.md`.
