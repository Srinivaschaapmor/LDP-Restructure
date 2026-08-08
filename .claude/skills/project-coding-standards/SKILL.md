---
name: project-coding-standards
description: Mandatory project-wide coding standards covering comments, naming, constants, logging, styling, TypeScript, testing, and content management. Use whenever writing, refactoring, or reviewing any code in this repo — this is the canonical, enforced standard and supersedes conflicting rules in other skills (noted inline below).
---

# Project Coding Standards

These standards are **mandatory for every implementation, without exception**. Every PR and
code review must validate compliance before approval. Any deviation must be justified and
explicitly approved during review.

## 1. General

- Followed strictly for every implementation, no exceptions.
- Every PR/review validates compliance before approval.

## 2. Code Quality

- **No code comments, anywhere in application source.** Code must be self-explanatory through
  naming and structure. *(Supersedes [coding-standards] rule 2, which previously asked for
  "why" comments — that rationale now lives in `docs/`, not inline. `contentful/migrations/`
  and `contentful/seed/` ops scripts are exempt — see rationale in
  `docs/02-architecture/code-notes.md`.)*
- Business logic stays simple, modular, easy to follow. Avoid deep nesting/complex branching.
- Follow SOLID principles wherever applicable.
- No duplicate code — extract into shared utilities, hooks, or components once reuse appears
  (or is clearly imminent).
- One responsibility per file.

## 3. Naming Conventions

- Class/component names clearly indicate purpose.
- Function, variable, constant, and file names in clear, readable English.
- No abbreviations unless universally accepted (`id`, `url`, `props`).
- Method/variable names describe exactly what they do.

## 4. Constants and Configuration

No hardcoded strings, labels, routes, URLs, configuration values, or reusable literals.
Dedicated constants files per domain/module — never one large catch-all file. Configuration
values are externalized to constants or fetched from Contentful.

Categories that must be centralized (non-exhaustive — apply the same discipline to any new
category that emerges): routes/URLs, API/backend config, error/validation messages, UI
labels/display text, storage keys, enum-like values, regex patterns, limits/timeouts,
CSS/theme/sizing tokens, form field names/query keys, date formats, keyboard/mouse/DOM event
names, security/CSP config, localization data, static domain reference data.

**Scoping note for this project:** framework utility class-name strings (Bootstrap's
`"container-xxl"`, `"d-flex"`, etc.) and SVG path `d` geometry are not "configuration" in this
sense and are not extracted — they're neither business values nor editor-configurable.

Any hardcoded value found in review is a standards violation and must be refactored before
merge.

## 5. Logging

- No `console.log`/`console.error`/`console.warn`/`console.info` (or any console statement) in
  application source.
- No logging framework introduced at this stage.
- `src/lib/logger/log.ts` is a placeholder with the final call-site shape already wired in
  (e.g. `SectionRenderer`'s unknown-section-type path) — its methods are no-ops until the
  backend logging API is provided, at which point they get implemented for real. *(Supersedes
  [sonarqube-compliance] rule 5, which previously allowed "a proper logger" — no console output
  at all is permitted now, including through a logger.)*

## 6. Styling

- CSS Modules for all component styling.
- Every `.module.css` lives in a `styles/` subfolder inside its component category folder
  (e.g. `src/components/sections/styles/Banner.module.css`, imported as
  `@/components/sections/styles/Banner.module.css`) — never colocated directly beside the
  `.tsx` file. *(Supersedes the colocated-`.module.css` convention implied elsewhere.)*
- Avoid inline styles unless technically unavoidable (e.g. a CMS-driven dynamic color already
  validated at the content layer).
- Consistent CSS class naming (camelCase keys inside each module).

## 7. TypeScript

- No `interface`/`type` declarations inside a component file — every shared shape lives in
  `src/types/`, imported via `import type { X } from "@/types"`. *(Already the case per
  [nextjs-development] rule 8 — no change needed there.)*
- No `any`. Prefer strongly typed models and utility types.

## 8. Testing

- Cover positive, negative, edge, and error scenarios.
- Zero failing tests, ever.
- Test folder is `src/test/`, not `src/__tests__/`. *(Supersedes the folder name in
  [nextjs-development] rule 9 and [testing-standards].)*
- Test reusable utilities, hooks, helpers, and shared components directly.
- Maintain high coverage for all reusable code.

## 9. Content Management

- Static assets — including the favicon — are managed through Contentful, not committed to the
  repo, unless technically required (e.g. a local source file an upload script needs to read
  once).
- Images, icons, metadata, banners, and other configurable assets live in the CMS.
- Frequently-changing content is always CMS-managed, never hardcoded.

## 10. Final Standards

- No exceptions without an explicit, reviewed justification.
- This skill is part of the project's mandatory engineering guidelines.
- PRs/reviews verify compliance before approval.
- Goal: a clean, scalable, reusable, maintainable, enterprise-grade codebase throughout the
  project's lifecycle.

## Relationship to other skills

This skill is the canonical standard for the rules above. Where it conflicts with
[coding-standards], [sonarqube-compliance], [nextjs-development], or [testing-standards], this
skill wins — those files have been updated to point here rather than duplicate or contradict it.
Rules those skills own that this one doesn't touch (accessibility, SEO, Contentful modeling,
Figma fidelity, git workflow) are unaffected.

## Automated enforcement

§2 (no comments), §5 (no console), §6 (CSS Module `styles/` location), and §8 (test folder name,
no `.only`/`.skip`) are enforced automatically by a `PostToolUse` hook
(`.claude/hooks/check-write-standards.js`, wired in `.claude/settings.json`) that runs after every
`Write`/`Edit` on a file under `src/` and feeds a violation back to the model immediately — this
skill's job is to avoid triggering it in the first place, not to be the only line of defense.
For a full standards review beyond what the hook catches (duplication, naming, complexity), use
the `code-reviewer` agent.
