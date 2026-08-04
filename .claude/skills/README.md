# .claude/skills

Reusable Claude Skills. Each folder has a `SKILL.md` (name, description, instructions) that
Claude loads automatically when its `description` matches the task.

## Skills (batch 1 — grounded in Restructure_Docs.xlsx)
| Skill | Purpose |
|---|---|
| `enterprise-engineering-standards` | Umbrella index + non-negotiables; routes to the rest |
| `sonarqube-compliance` | The 20 real defect patterns to avoid while coding |
| `siteimprove-compliance` | Prevent the 165 SiteImprove issues (a11y/SEO/QA) |
| `accessibility` | WCAG 2.2 AA dev-time technique |
| `seo` | Technical SEO for Next.js |
| `coding-standards` | Shared-util extraction + naming + file structure |
| `code-review-standards` | How to review a diff / self-check |
| `testing-standards` | Unit/component test strategy + coverage |
| `documentation-standards` | The 4 required doc types |
| `git-workflow` | Commit format + branching strategy |
| `definition-of-done` | Final gate tying all standards together |
| `project-coding-standards` | Canonical mandatory standard: no comments, no console, `styles/` subfolder CSS Modules, `src/test/`, domain-grouped constants |

## Skills (batch 2 — tech-specific, created from real build lessons)
| Skill | Purpose |
|---|---|
| `nextjs-development` | App Router layout (`src/`), CMS-driven routing, section registry, tooling gotchas |
| `contentful-development` | Modeling, migrations, entries, assets, CDA fetching; key-by-`internalName` rule |
| `figma-mcp-workflow` | Build from Figma: inspect all breakpoints, tokens, asset handling, verify fidelity |

## Planned (batch 2 — not yet created)
`typescript-standards`, `bootstrap-development`, `performance-optimization`
(interim performance rules live in `docs/01-standards/performance.md`).
