# ADR-0010 — Figma → Development workflow v2: entries-first, JSON-driven

- **Status:** Accepted
- **Date:** 2026-08-13
- **Supersedes:** the phase-gated workflow in ADR-0003's skill set (`figma-to-development-workflow` v1)

## Context

v1 ran seven phases with two human approval gates:

> design analysis → content-model analysis → **CMS approval** → technical planning →
> **development approval** → development → validation

Running it end-to-end on the Home page (Figma `4UxJeqzAVXcc2mtlwkTQKO`, node `30:382`) exposed
three problems.

**The content model was analysed but never exercised.** Phase 2 produced a migration-ready spec
and an entry inventory, both derived from documentation. Nothing validated that an editor could
actually author against the model, and nothing validated the shape the frontend would receive.
Development would have begun against an inferred payload.

**Technical planning sat behind an approval gate it didn't need.** Phase 4's real value was
codebase-reuse analysis, which is only actionable at the moment of writing. Gating it behind
Phase 3 meant the plan aged, and Phase 5 asked a human to approve a plan they could not verify
without the data.

**The gates cost more than they caught.** Two sign-offs on documents, for a team where the same
person authors the content and writes the code.

Separately, three practical failures recurred and were nowhere encoded: large Figma frames
time out on the root node; Figma layer names are generic and are not content; and a CDA
response silently omits unpopulated optional fields.

## Decision

Replace the phase-gated sequence with **eight steps**, with real content and its fetched JSON as
a required input to the build:

```
Figma ─┬─► 2 design context ──────────────┐
       │                                  ├─► 6 build ─► 7 validate ─► 8 review
       └─► 3 model mapping ─► 4 entries ─► 5 JSON ──────┘
```

1. Connect Figma MCP
2. Extract complete design context — every breakpoint (`figma-design-analyst`)
3. Map sections onto the content model (`content-model-analyst`)
4. **Author entries in Contentful** — human; gates everything after it
5. Fetch the page JSON — `contentful/scripts/fetch-page-json.mjs`
6. Reuse pass (`reuse-scout`), then build
7. Implement and validate (`figma-fidelity-auditor` + `dod-auditor`)
8. Code review (`code-reviewer`)

Governing constraint, stated in the skill:

> **The JSON never supplies a design value. The design never supplies a data shape.**

### Supporting rules added

- **contentful-development 12** — fields by migration, entries by hand; author **two fixtures per
  section type** (fully populated + minimal) so optional fields and empty states are exercised.
- **contentful-development 13** — fetch the page JSON as a dev input, but never derive types from
  it; a response shows only populated fields and only that page's variants.
- **figma-mcp-workflow 12** — drill into child nodes rather than pulling large root frames; layer
  names are not content; export assets during the build, since Figma URLs expire in ~7 days.

### Changes to `.claude/`

- **Removed** `technical-planner`. Its analysis now runs as `reuse-scout` at the top of Step 6.
- **Added** `reuse-scout`, which also cross-checks the design analysis against the fetched JSON
  and reports mismatches.
- **Added** `contentful/scripts/fetch-page-json.mjs` (`.cache/` is gitignored).
- **Updated** `figma-design-analyst` (Step 2 + extraction mechanics), `content-model-analyst`
  (Step 3 + the authoring list), `figma-fidelity-auditor` (empty/overflow-state check).

## Consequences

**Positive.** The build sees real data, so optionality, link resolution and null-shape bugs
surface before code rather than in QA. Authoring the entries stress-tests the model while it is
still cheap to change. Reuse is decided at the moment of writing instead of reviewed afterwards.
One less document to approve.

**Negative.** Step 4 is now a hard dependency — no content, no development. Migrations must be
settled before authoring, so open modeling questions block earlier than they used to. The
two-fixture rule roughly doubles authoring effort per section type.

**Accepted risk.** Removing the approval gates removes a checkpoint where a wrong content model
could be caught before entries exist. Mitigated by Step 3 still being an explicit, reported step —
the analysis survives; only the sign-off ceremony is gone. If model churn becomes a problem, a
gate can be reinstated at 3→4 without disturbing the rest.

**Note.** The CDA is reachable from scripts via `CONTENTFUL_DELIVERY_ACCESS_TOKEN`; ADR-0009
removed the Contentful **MCP server**, not delivery access. Step 5 depends on this and was
verified against `/providers/resource-library`.
