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
| `figma-to-development-workflow` | Mandatory phase-gated process (design → content model → CMS approval → plan → dev approval → build → validate) for every Figma page |

## Planned (batch 2 — not yet created)
`typescript-standards`, `bootstrap-development`, `performance-optimization`
(interim performance rules live in `docs/01-standards/performance.md`).

## Agents (`.claude/agents/`)
Isolated, read-heavy analysis/audit tasks that would otherwise burn main-loop tokens holding a
whole skill's checklist or a large document in context. Each returns a report; none of them edit
files or make approval decisions.

| Agent | Purpose | Skill it implements |
|---|---|---|
| `code-reviewer` | Reviews a diff against the full standards stack, findings only | [code-review-standards] |
| `dod-auditor` | Independently checks a finished change against every Definition of Done item | [definition-of-done] |
| `figma-design-analyst` | Phase 1 (Design Analysis) for a Figma node | [figma-to-development-workflow] |
| `content-model-analyst` | Phase 2 (Content Model Analysis) + the reference-doc mapping task | [figma-to-development-workflow], [contentful-development] rule 11 |
| `technical-planner` | Phase 4 (Technical Planning) — codebase reuse analysis | [figma-to-development-workflow] |
| `figma-fidelity-auditor` | Post-build design-fidelity report / Final Validation Checklist | [figma-to-development-workflow], [figma-mcp-workflow] rule 11 |

Phases 3 (CMS Approval) and 5 (Development Approval) are **not** agents — they're approval gates
that must stay in the main conversation, since only it can wait for and act on your confirmation.

## Hooks (`.claude/settings.json` → `.claude/hooks/`)
Mechanically-checkable rules enforced automatically, at zero model-token cost, instead of relying
on the model to remember them:

| Hook | Event | Enforces |
|---|---|---|
| `check-write-standards.js` | `PostToolUse` on `Write\|Edit` | No `console.*`, no comments, `.module.css` in a `styles/` subfolder, no `__tests__` folder, no `.only`/`.skip` left in tests — all from [project-coding-standards] |
| `check-commit-message.js` | `PreToolUse` on `Bash` | Conventional Commits format on `git commit -m` — from [git-workflow] |

These are a backstop, not a replacement for the skills above — they catch what's mechanical;
everything requiring judgment still needs the skill loaded at generation time.
