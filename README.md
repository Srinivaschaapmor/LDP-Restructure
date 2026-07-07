# Enterprise Web Application (Test Scaffold)

> **Status:** Phase 0 · Step 5 complete — scaffold + skills + Figma MCP + Contentful MCP + standards map.
> Phase 0 (Initialization) essentially done; next is the Planning phase (starting with the project charter).
> This is a validation scaffold to test the mentored enterprise workflow. Not production.

## What this is
A production-grade enterprise web app built with:

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript (strict) |
| Styling | Bootstrap 5 + SCSS |
| CMS | Contentful (via MCP) |
| Design | Figma (via MCP) |
| Quality | SonarQube, SiteImprove, WCAG 2.2 AA |

## Repository layout
```
.
├─ CLAUDE.md          # Project instructions (Claude reads this automatically)
├─ README.md          # You are here — human entry point
├─ .claude/           # Claude Code config + reusable skills
├─ docs/              # Single source of truth for all standards & decisions
│  ├─ 00-overview/    # Charter, glossary
│  ├─ 01-standards/   # Coding, a11y, SEO, perf, testing standards
│  ├─ 02-architecture/
│  ├─ 03-content-model/
│  ├─ 04-design-system/
│  ├─ 05-decisions/   # ADRs — why decisions were made
│  └─ 06-runbooks/    # Ops, deploy, incident guides
```

## Getting started
```bash
npm install --ignore-scripts        # install deps
npm run cf:migrate contentful/migrations/001-oral-health-page-types.js   # create content types
npm run cf:seed                     # create the oral-health page entries
npm run dev                         # http://localhost:3000
```
Requires env vars in `.env` (see `.env.example`): `CONTENTFUL_SPACE_ID`,
`CONTENTFUL_ENVIRONMENT_ID`, `CONTENTFUL_MANAGEMENT_ACCESS_TOKEN` (migrate/seed),
`CONTENTFUL_DELIVERY_ACCESS_TOKEN` (runtime). First page:
`/members/oral-health-education/everyday-oral-health`.

**Images/assets live in Contentful, not in the repo.** `npm run cf:assets`
(`contentful/seed/upload-assets.mjs`) was the one-time upload that moved the page images
into Contentful and re-linked the `media` entries. To move content+assets between
environments, use `contentful space export/import` — not git.

## Structure
Application code lives under `src/` (`src/app`, `src/components`, `src/lib`); project
scaffolding stays at the root (`contentful/`, `docs/`, config, `.env`).

## Phase roadmap
Phase 0 (Initialization) → Planning → Architecture → Content Modeling → Design System →
Components → Page Templates → API Layer → Performance → Accessibility → Testing →
Documentation → Deployment → Production Readiness Review.
