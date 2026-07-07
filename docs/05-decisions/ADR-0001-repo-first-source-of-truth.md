# ADR-0001: Repository is the single source of truth

- **Status:** Accepted
- **Date:** 2026-07-06
- **Deciders:** praveensaik@aapmor.com, Claude (mentor)

## Context
Project instructions, knowledge, and standards could live either in a Claude.ai Project
(web UI text boxes + uploaded files) or in the Git repository. Enterprise work requires
that standards be versioned, reviewable, and auditable.

## Options considered
1. **Claude.ai Project only** — easy to start, but not versioned, not PR-reviewable, lost on offboarding, drifts from code.
2. **Repo-first** — `CLAUDE.md` + `/docs` + `.claude/skills` versioned in Git; optional Claude.ai Project only *references* the repo.
3. **Both, unsynchronized** — highest drift risk; two conflicting sources of truth.

## Decision
Adopt **repo-first**. The repository is canonical. Any Claude.ai Project is a thin pointer to it.

## Rationale
Auditability, reviewability, onboarding, and drift-prevention outweigh the small convenience
of web text boxes. Aligns with docs-as-code and the project's maintainability goals.

## Consequences
- Positive: single source of truth; everything reviewable via PR; new engineers/Claude sessions productive from the repo alone.
- Negative / trade-offs: requires discipline to keep docs updated alongside code.
- Follow-ups: none for the test run. For the real project, initialize Git and enforce the working agreement in `CLAUDE.md`.
