---
name: enterprise-engineering-standards
description: Master index of this project's engineering standards. Use at the start of ANY coding, refactoring, or review task to know which specialized skill applies. Routes to coding-standards, sonarqube-compliance, siteimprove-compliance, accessibility, seo, testing-standards, code-review-standards, git-workflow, and documentation-standards.
---

# Enterprise Engineering Standards (Index)

This is the umbrella skill. Its job is to **route** to the right specialized skill and to
enforce the non-negotiables that apply to every change.

## Non-negotiables (every change, no exceptions)
1. **Type-safe** — TypeScript `strict`; no `any` without a written reason.
2. **Null-safe on external data** — always optional-chain Contentful/API data (`a?.b?.c`).
   This was historically the single most frequent defect. See [sonarqube-compliance].
3. **Accessible** — WCAG 2.2 AA. See [accessibility] and [siteimprove-compliance].
4. **SEO-correct** — semantic HTML + metadata. See [seo].
5. **Clean-gate** — passes SonarQube with no new smells/hotspots. See [sonarqube-compliance].
6. **Documented** — update the relevant doc in the same change. See [documentation-standards].
7. **Tested** — meaningful unit tests. See [testing-standards].
8. **Design-system-exact** — when Figma is connected, match it pixel-for-pixel (tokens, type,
   spacing, radius, borders, shadows, icons, states, variants, responsive). Pull exact per-node
   values; never invent/approximate/substitute. Baseline: `docs/04-design-system/design-tokens.md`;
   process: [figma-mcp-workflow]. Missing value → STOP and ask.
9. **No assumed requirements** — if unclear, ask.

## Which skill to use when
| You are… | Use skill |
|---|---|
| Writing/refactoring any TS/React code | `project-coding-standards` + `coding-standards` + `sonarqube-compliance` |
| Building UI / markup | `accessibility` + `siteimprove-compliance` |
| Adding pages, metadata, links | `seo` + `siteimprove-compliance` |
| Reviewing a diff / opening a PR | `code-review-standards` + `definition-of-done` |
| Committing or branching | `git-workflow` |
| Writing tests | `testing-standards` |
| Writing docs | `documentation-standards` |
| Modeling / migrating / fetching Contentful | `contentful-development` |
| Scaffolding the app, routing, section renderer | `nextjs-development` |
| Building a page/component from a Figma design | `figma-mcp-workflow` |

## Definition of Done
No change is "done" until it passes [definition-of-done]. That checklist is the final gate.
