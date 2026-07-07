# Enterprise Web Application (Test Scaffold)

> **Status:** Phase 0 · Step 3 complete (scaffold + skills + Figma MCP verified).
> Next: Step 4. This is a validation scaffold to test the mentored enterprise workflow. Not production.

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
_App does not exist yet — we are still in Phase 0 (Initialization). Setup steps will be
added here once the Architecture phase scaffolds the Next.js app._

## Phase roadmap
Phase 0 (Initialization) → Planning → Architecture → Content Modeling → Design System →
Components → Page Templates → API Layer → Performance → Accessibility → Testing →
Documentation → Deployment → Production Readiness Review.
