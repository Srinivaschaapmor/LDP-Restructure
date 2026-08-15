# Glossary

> Shared vocabulary so humans and Claude use terms consistently. Add entries as they arise.

## Domain terms
- _`<TBD>`_ — business-specific terms go here once the charter is filled.

## Technical terms (starter set)
- **ADR** — Architecture Decision Record; a short, numbered note capturing a decision and its rationale (`docs/05-decisions/`).
- **App Router** — Next.js routing model based on the `app/` directory (Server Components by default).
- **Content model** — The set of Contentful content types and their fields.
- **Design token** — A named design value (color, spacing, type scale) shared between Figma and code.
- **MCP** — Model Context Protocol; how Claude connects to external tools. Two servers:
  `figma-dev-mode` and `contentful` (restored in ADR-0011 via `contentful/mcp-launch.mjs`).
  The Contentful server is for **reading** the live space; content types are still created and
  modified only via `contentful-migration` CLI scripts.
- **WCAG 2.2 AA** — Accessibility conformance level we target.
