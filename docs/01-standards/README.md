# 01 · Engineering Standards (Map)

> **Finalized in Phase 0 · Step 5.**
> **Where standards actually live:** the authoritative, detailed standards are authored as
> **Claude Skills** in [`.claude/skills/`](../../.claude/skills/). This folder is the
> **human-facing map** — it says *which skill owns each concern* so there is exactly one
> source of truth and no duplication (see [ADR-0003](../05-decisions/ADR-0003-standards-live-in-skills.md)).
> To **change a standard, edit its skill** — this map stays valid automatically.

## Non-negotiables (every change)
The umbrella skill [`enterprise-engineering-standards`](../../.claude/skills/enterprise-engineering-standards/SKILL.md)
holds the canonical list and routing. In short:
type-safe (`strict`, no unjustified `any`) · null-safe on all external/Contentful data ·
WCAG 2.2 AA · semantic HTML + metadata · passes SonarQube (no new smells/hotspots) ·
SiteImprove-clean · tested · documented in the same change · **ask when unclear**.

## Concern → canonical skill

| Concern | Owning skill (source of truth) |
|---|---|
| Overall index + non-negotiables + routing | [`enterprise-engineering-standards`](../../.claude/skills/enterprise-engineering-standards/SKILL.md) |
| Code organization, naming, "why" comments | [`coding-standards`](../../.claude/skills/coding-standards/SKILL.md) |
| SonarQube clean-code / defect patterns | [`sonarqube-compliance`](../../.claude/skills/sonarqube-compliance/SKILL.md) |
| SiteImprove issues (a11y / SEO / QA) | [`siteimprove-compliance`](../../.claude/skills/siteimprove-compliance/SKILL.md) |
| Accessibility (WCAG 2.2 AA technique) | [`accessibility`](../../.claude/skills/accessibility/SKILL.md) |
| Technical SEO (Next.js) | [`seo`](../../.claude/skills/seo/SKILL.md) |
| Testing strategy + coverage | [`testing-standards`](../../.claude/skills/testing-standards/SKILL.md) |
| Diff review / self-check | [`code-review-standards`](../../.claude/skills/code-review-standards/SKILL.md) |
| Commit format + branching + PR standards | [`git-workflow`](../../.claude/skills/git-workflow/SKILL.md) |
| Required documentation types | [`documentation-standards`](../../.claude/skills/documentation-standards/SKILL.md) |
| Final quality gate (ties all together) | [`definition-of-done`](../../.claude/skills/definition-of-done/SKILL.md) |

## By task (quick routing)
- **Writing/refactoring TS/React** → `coding-standards` + `sonarqube-compliance`
- **Building UI / markup** → `accessibility` + `siteimprove-compliance`
- **Pages / metadata / links** → `seo` + `siteimprove-compliance`
- **Reviewing a diff / opening a PR** → `code-review-standards` + `definition-of-done`
- **Committing / branching** → `git-workflow`
- **Writing tests** → `testing-standards`
- **Writing docs** → `documentation-standards`

## Gaps & deferrals (deliberate — not oversights)
- **Performance** — no dedicated skill yet (`performance-optimization` is planned in skills
  batch 2). Interim standard: [`performance.md`](./performance.md). It will be **superseded**
  by the skill when that lands; until then it is the single source for performance rules.
- **Folder / app structure** — deferred to the **Architecture** phase; will be owned by
  [`docs/02-architecture/`](../02-architecture/) once the Next.js app is scaffolded (it does
  not exist yet). `coding-standards` already covers the `lib/utils/` categorized-utilities rule.
- **PR template artifact** (`.github/PULL_REQUEST_TEMPLATE.md`) — follow-up when the Git repo
  is initialized; the *rules* it will enforce live in `git-workflow`.

## How to change a standard
1. Edit the owning **skill** (`.claude/skills/<name>/SKILL.md`) — that is the source of truth.
2. If the change is significant, record an **ADR** in [`docs/05-decisions/`](../05-decisions/).
3. This map only needs editing if a *new concern/skill* is added or one is renamed.
