---
name: figma-to-development-workflow
description: Mandatory phase-gated process for building any application page from a Figma design — design analysis, content-model analysis, CMS approval, technical planning, development approval, development, validation. Use whenever starting work on a new Figma page/frame, before touching design tokens or writing any code. Complements figma-mcp-workflow (fidelity technique) and contentful-development (modeling rules) — this skill governs the sequence and approval gates around them.
---

# Figma → Development Workflow

Acting as Solution Architect, UI Developer, and CMS Architect. **Never skip a phase. Never
generate implementation code before the explicit approval each phase requires.** Always start
from the selected Figma page or frame — confirm the selection is a real page/frame (not a single
layer) before Phase 1 begins; if unclear, ask for the Figma URL/node link rather than guess.

Never assume a content type/field/entry already exists — verify against the CMS. Always reuse
existing components and content models wherever possible.

## Phase 1 — Design Analysis
Identify the page structure, sections, reusable components, and CMS-vs-static content from the
selected Figma node. **Run via the `figma-design-analyst` agent** (full instructions in
`.claude/agents/figma-design-analyst.md`) — it's an isolated, read-heavy task; only its report and
the approval gate stay in the main conversation. **No code. Wait for approval before Phase 2.**

## Phase 2 — Content Model Analysis
Map the Phase 1 report onto existing/new Contentful content types, per [contentful-development]'s
consolidation discipline. **Run via the `content-model-analyst` agent**
(`.claude/agents/content-model-analyst.md`). **No code. Wait for approval before Phase 3.**

## Phase 3 — CMS Approval
Wait for explicit confirmation that the proposed content model has actually been created in the
CMS (types + fields + validations live in Contentful) before proceeding. Do not continue on the
assumption that the model "will be" created — verify it exists. *(Human gate — no agent.)*

## Phase 4 — Technical Planning
After CMS approval, plan component reuse/creation, data mapping, and folder/file changes. **Run
via the `technical-planner` agent** (`.claude/agents/technical-planner.md`). **No code. Wait for
approval before Phase 5.**

## Phase 5 — Development Approval
Wait for explicit approval of the implementation plan itself before writing any code. *(Human
gate — no agent.)*

## Phase 6 — Development
Only after Phase 5 approval: build following the existing project architecture
([nextjs-development], [project-coding-standards]), reusing existing components wherever
possible, modular and duplicate-free, accessible ([accessibility]), responsive, performant, using
project naming conventions, production-ready.

## Final Validation Checklist
Verify against the Figma reference using **computed** values (not "looks right"), confirm CMS
mapping and no unnecessary hardcoding, and confirm [definition-of-done] in full. **Run via the
`figma-fidelity-auditor` agent** (design fidelity, `.claude/agents/figma-fidelity-auditor.md`)
**and the `dod-auditor` agent** (general standards) — both report PASS/FAIL and an overall
verdict rather than self-grading inline.

## Mandatory sequence, every time
Analyze design → analyze content model → wait for CMS approval → plan implementation → wait for
development approval → develop → validate. **Never skip a step or generate code before its
required approval.**
