---
name: figma-to-development-workflow
description: Mandatory process for building any application page from a Figma design — design extraction, content-model mapping, entry authoring, page-JSON fetch, reuse pass, build, validation, review. Use whenever starting work on a new Figma page/frame, before touching design tokens or writing any code. Complements figma-mcp-workflow (fidelity technique) and contentful-development (modeling + authoring rules) — this skill governs the sequence.
---

# Figma → Development Workflow

Acting as Solution Architect, UI Developer, and CMS Architect. Always start from the selected
Figma page or frame — confirm the selection is a real page/frame (not a single layer) before
Step 2 begins; if unclear, ask for the Figma URL/node link rather than guess.

Never assume a content type/field/entry exists — verify. Always reuse existing components and
content types wherever possible.

**Two inputs converge at Step 6.** Everything before it exists to make both trustworthy:

```
Figma ─┬─► 2 design context ──────────────┐
       │                                  ├─► 6 build ─► 7 validate ─► 8 review
       └─► 3 model mapping ─► 4 entries ─► 5 JSON ──────┘
```

## The standing rule
**The JSON never supplies a design value. The design never supplies a data shape.**
Structure, content, and field shape come from Contentful. Every pixel — spacing, color,
typography, radius, states, responsive behavior — comes from Figma. This is easy to blur with
both open at once; when in doubt, go back to the source that owns that decision.

---

## Step 1 — Connect Figma MCP
Confirm the server is reachable and the target frame is selected. Runbook:
`docs/06-runbooks/figma-mcp-connection.md`.

## Step 2 — Extract complete design context
Read **every breakpoint frame**, not just desktop ([figma-mcp-workflow] rule 5). Anything
skipped here gets invented later, which rule 0 forbids.

**Run via the `figma-design-analyst` agent** (`.claude/agents/figma-design-analyst.md`) — an
isolated, read-heavy task; only its report returns to the main conversation.

Mechanics that matter ([figma-mcp-workflow] rule 12): drill into child nodes rather than
pulling a large root frame, and **do not export assets yet** — Figma URLs expire in ~7 days.
Record node IDs; export during Step 6.

**Output:** design analysis with exact per-node values, responsive behavior, and open questions
for anything the design does not answer. **No code.**

## Step 3 — Map sections onto the content model
Before anything is authored, decide which sections map to **existing** content types, what
genuinely needs a **new type** vs. just a **new field or variant**, and what is CMS-driven vs.
a static design-system concern.

**Run via the `content-model-analyst` agent** (`.claude/agents/content-model-analyst.md`),
per [contentful-development] rules 7 and 11.

> **Guardrail:** never create a type per visual variation. One type + variants. This is the
> hardest decision in the process to reverse once entries exist and reference each other.

**Output:** section → content type mapping, plus any field additions needed. **No code.**

## Step 4 — Author entries in Contentful *(human)*
New **fields** are added by **migration**, never the UI ([contentful-development] rules 3, 8,
12) — hand-editing the model desyncs it from `contentful/migrations/` and breaks environment
rebuilds. **Entries** may be authored by hand.

Author **two fixtures per section type** ([contentful-development] rule 12): one with every
optional field populated, one deliberately minimal. A single fixture hides optional fields from
Step 5 entirely.

This step gates the rest — development cannot proceed until the content exists.

## Step 5 — Fetch the page JSON
```bash
node contentful/scripts/fetch-page-json.mjs "/your/slug"
```
Writes the fully-resolved response (`include: 10`) to `.cache/page-<slug>.json` and prints a
section-type summary. This is the data contract for Step 6 — read it, don't guess the shape.

Uses `CONTENTFUL_SPACE_ID` + `CONTENTFUL_DELIVERY_ACCESS_TOKEN` from `.env`. The CDA serves
**published** entries only — a draft page returns no result. On Git Bash, prefix the command with
`MSYS_NO_PATHCONV=1`, or the leading `/` is rewritten into a Windows path.

**Do not derive types from this response** ([contentful-development] rule 13). It only shows
fields that are *populated*; types come from the content model.

## Step 6 — Reuse pass, then build
**Before writing anything:** what already exists that can be extended? Components, utilities,
patterns, variants. **Run via the `reuse-scout` agent** (`.claude/agents/reuse-scout.md`).
Reusability is decided here — Step 8 can only complain about it afterward.

Then build following the existing architecture ([nextjs-development],
[project-coding-standards]): modular, duplicate-free, accessible ([accessibility]), responsive,
performant, production-ready. Export Figma assets now ([figma-mcp-workflow] rule 7); store them
in Contentful, never `/public` ([contentful-development] rule 2).

## Step 7 — Implement and validate
Verify against **computed** values, not "looks right":

- **Design fidelity** — measured spacing, colors, type ramp vs. Figma, at every breakpoint
- **CMS mapping** — every field renders; nothing hardcoded that should be authored
- **Accessibility** — semantics, contrast, keyboard, focus
- **Empty and overflow states** — this is what the minimal fixture from Step 4 is for

**Run via the `figma-fidelity-auditor` agent** (design fidelity) **and the `dod-auditor` agent**
(general standards) — both report PASS/FAIL rather than self-grading inline.

## Step 8 — Code review
Code quality, standards, reusability, performance, accessibility, maintainability.
**Run via the `code-reviewer` agent** ([code-review-standards]).

---

## Sequence, every time
Connect → extract design → map model → author entries → fetch JSON → reuse pass + build →
validate → review.

Steps 2, 3, 6, 7 and 8 each have a dedicated agent. Step 4 is human. Never write implementation
code before the page's content exists and its JSON has been read.
