---
name: testing-standards
description: Unit and component testing strategy, coverage expectations, and test-quality rules. Use when writing tests or adding testable code.
---

# Testing Standards

> Framework and coverage target not yet fixed — recommended defaults below; confirm and update.

## Strategy
- **Unit tests** for utilities and pure logic (all the `*.utils.ts` modules).
- **Component tests** for React components (React Testing Library — test behavior, not
  implementation; query by role/label as a user would).
- **Integration tests** for data flows (Contentful fetch → render), mocking the CMS layer.
- Follow the testing pyramid: many unit, fewer integration, minimal E2E.

## Recommended tooling
- **Jest + React Testing Library** (via `next/jest`) — test behavior, not implementation.

## Coverage
- Recommended target: **≥ 80%** on statements/branches for non-trivial logic.
- Coverage is a floor, not a goal — a covered line still needs a **meaningful assertion**.
- Prioritize edge cases and error paths (null/empty Contentful data, failed fetches).

## Test quality rules
- One behavior per test; descriptive names (`it('returns null when fields are missing')`).
- No logic in tests; deterministic (no real network/time — mock them).
- Test the null-safety paths explicitly (matches the project's most common defect).
- Keep test files in `src/test/`, mirroring the source path they test; name `*.test.ts(x)`
  (see [project-coding-standards] §8 and [nextjs-development] rule 9).

## Issues found in test files
- Remove skipped/`.only` tests before merge; no dead or commented-out tests
  (aligns with [sonarqube-compliance]).
