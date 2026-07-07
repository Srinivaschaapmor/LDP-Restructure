---
name: documentation-standards
description: What documentation to produce and how to structure it. Use when documenting architecture, Contentful, code flow, or components. Covers the four required document types for this project.
---

# Documentation Standards

Docs are code — Markdown, versioned in `/docs`, updated in the same change as the code.
Four required document types (from the project's documentation requirements):

## 1. Contentful Architecture
- Content types and their relationships (diagram + table).
- Spaces, environments, localization strategy, publishing/preview flow.
- Where lives: `docs/03-content-model/contentful-architecture.md`.

## 2. Contentful Usage Guide
- How editors create/edit content; field-by-field guidance and validations.
- How the app fetches and renders each content type; gotchas (null-safety on `fields`).
- Where lives: `docs/03-content-model/contentful-usage-guide.md`.

## 3. Code Flow — High-Level & Low-Level
- **HL flow:** request → routing → data fetch → render (diagram of the system).
- **LL flow:** key modules, data transforms, utility layers, error handling.
- Where lives: `docs/02-architecture/code-flow.md`.

## 4. Component-wise Documentation
For each component: **what it is**, **why it exists** (the problem it solves), and **its
functionality/props/usage**. Keep it next to the component or in `docs/04-design-system/`.
```md
## <ComponentName>
- **Purpose:** why this component exists
- **Props:** table of props + types
- **Usage:** minimal example
- **Notes:** accessibility, edge cases, dependencies
```

## Style rules
- Explain the **why**, not just the what (mirrors [coding-standards] comment rule).
- Keep each doc single-responsibility; link related docs.
- Update `README.md` / `CLAUDE.md` index when adding a new doc.
