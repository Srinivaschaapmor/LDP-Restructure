# CLAUDE.md — Project Instructions (Index)

> This file is read automatically by Claude Code at the start of every session.
> Keep it **thin**: it is a router/index, not a dumping ground. Detailed standards
> live in `/docs` so each concern can be owned and reviewed independently.

## Mission
Build a production-ready enterprise web application using **Next.js (App Router) +
TypeScript + Bootstrap 5 + SCSS**, with content from **Contentful** and designs from
**Figma**, meeting enterprise standards for accessibility, SEO, performance, and code quality.

> ⚠️ TEST SCAFFOLD — placeholder mission. Replace once the real charter is filled in
> `docs/00-overview/project-charter.md`.

## Non-negotiables (apply to every change)
- **Accessibility:** WCAG 2.2 AA. No merge if it regresses a11y.
- **SEO:** Semantic HTML, metadata, structured data where relevant.
- **Code quality:** Must pass SonarQube gates; no new code smells or security hotspots.
- **Content compliance:** SiteImprove clean (broken links, a11y, misspellings).
- **Type safety:** `strict` TypeScript. No `any` without a written justification.
- **Reusability first:** Prefer composable, single-responsibility components.
- **No assumed requirements:** If a requirement is unclear, ask — do not guess.

## Where things live (single source of truth = this repo)
- Project charter & scope → `docs/00-overview/project-charter.md`
- Glossary / domain terms → `docs/00-overview/glossary.md`
- Engineering standards → authored as skills in `.claude/skills/`; mapped in `docs/01-standards/` (see ADR-0003)
- Architecture → `docs/02-architecture/`
- Content model → `docs/03-content-model/`
- Design system → `docs/04-design-system/`
- Decision records (ADRs) → `docs/05-decisions/`
- Runbooks / ops → `docs/06-runbooks/`
- Reusable Claude Skills → `.claude/skills/` (created in Phase 0 · Step 2)

## Working agreement
- Work **one phase at a time**; wait for explicit approval before advancing.
- **Before writing or changing code, load the _relevant_ skill(s)** via the routing table in
  `enterprise-engineering-standards` (not all of them — just the ones that apply to the task).
- **Run `definition-of-done`** before declaring any change complete or ready for PR.
- When a mistake recurs, encode it as a rule in the **owning skill** so it can't happen again.
- Record every significant decision as an **ADR** in `docs/05-decisions/`.
- Update the relevant doc in the **same change** that alters behavior.
