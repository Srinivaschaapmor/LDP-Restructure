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
| `figma-to-development-workflow` | Mandatory 8-step process (connect → design context → model mapping → author entries → fetch JSON → reuse + build → validate → review) for every Figma page |

## Planned (batch 2 — not yet created)
`typescript-standards`, `bootstrap-development`, `performance-optimization`
(interim performance rules live in `docs/01-standards/performance.md`).

## Agents (`.claude/agents/`)
Isolated, read-heavy analysis/audit tasks that would otherwise burn main-loop tokens holding a
whole skill's checklist or a large document in context. Each returns a report; none of them edit
files or make approval decisions.

| Agent | Step | Purpose | Skill it implements |
|---|---|---|---|
| `figma-design-analyst` | 2 | Extract complete design context for a Figma node, all breakpoints | [figma-to-development-workflow] |
| `content-model-analyst` | 3 | Map sections onto content types; produce migration specs + the authoring list | [figma-to-development-workflow], [contentful-development] rules 11–12 |
| `reuse-scout` | 6 | Reuse pass before writing — what exists, what extends, what's genuinely new | [figma-to-development-workflow], [figma-mcp-workflow] rule 6 |
| `figma-fidelity-auditor` | 7 | Post-build design-fidelity report, incl. empty/overflow states | [figma-to-development-workflow], [figma-mcp-workflow] rule 11 |
| `dod-auditor` | 7 | Independently checks a finished change against every Definition of Done item | [definition-of-done] |
| `code-reviewer` | 8 | Reviews a diff against the full standards stack, findings only | [code-review-standards] |

**Step 4 (author entries) is human** — it is not an agent, and it gates everything after it:
development cannot start until the page's content exists in Contentful. **Step 5 is a script**,
not an agent: `node contentful/scripts/fetch-page-json.mjs "<slug>"`.

> `technical-planner` was removed in ADR-0010. Its codebase-reuse analysis now runs as
> `reuse-scout` at the top of Step 6, where the decision is actually made, instead of as a
> separate planning phase behind an approval gate.

## Hooks (`.claude/settings.json` → `.claude/hooks/`)
Mechanically-checkable rules enforced automatically, at zero model-token cost, instead of relying
on the model to remember them:

| Hook | Event | Enforces |
|---|---|---|
| `check-write-standards.js` | `PostToolUse` on `Write\|Edit` | No `console.*`, no comments, `.module.css` in a `styles/` subfolder, no `__tests__` folder, no `.only`/`.skip` left in tests — all from [project-coding-standards] |
| `check-commit-message.js` | `PreToolUse` on `Bash` | Conventional Commits format on `git commit -m` — from [git-workflow] |

These are a backstop, not a replacement for the skills above — they catch what's mechanical;
everything requiring judgment still needs the skill loaded at generation time.
