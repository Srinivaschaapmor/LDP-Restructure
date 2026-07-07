---
name: git-workflow
description: Commit message format and branching strategy for this project. Use when creating branches, committing, or opening pull requests. (Recommended defaults — confirm/adjust to team preference.)
---

# Git Workflow

> These are recommended defaults since no team convention was specified yet. Adjust if the
> team prefers otherwise, then update this skill.

## Commit messages — Conventional Commits
Format: `type(scope): short imperative summary`
```
feat(header): add locale switcher
fix(contentful): optional-chain nullable rich-text nodes
refactor(utils): split date logic into calendar.utils.ts
docs(readme): document local setup
```
Types: `feat` `fix` `refactor` `docs` `test` `chore` `perf` `style` `build` `ci`.
- Subject ≤ ~72 chars, imperative mood, no trailing period.
- Body (optional) explains **why**; reference issues (`Refs #123`).
- One logical change per commit; keep commits focused and reviewable.

## Branching — trunk-based with short-lived branches
- `main` is always releasable and protected (no direct pushes).
- Branch names: `type/short-description` → `feat/locale-switcher`, `fix/broken-nav-links`.
- Keep branches short-lived; rebase/update on `main` frequently; delete after merge.
- (If the team prefers GitFlow with `develop`/`release/*`, switch here and document why.)

## Pull requests
- Small, single-purpose, with a clear description of what and why.
- Passes CI + all gates ([definition-of-done]) before review.
- At least one approving review; no merge with unresolved blocking comments.
- Squash-merge to keep `main` history clean (unless team decides otherwise).
