---
name: sonarqube-compliance
description: Enforce SonarQube clean-code rules while writing or refactoring TypeScript/React/Next.js code. Use whenever generating or editing code. Encodes the exact defect patterns this project has had to fix before — apply them proactively so they never recur.
---

# SonarQube Compliance

Apply these rules **as you write** — do not wait for the scanner. Each rule below is a real
recurring fix. The goal is zero new smells, bugs, or security hotspots.

## High-priority rules (most frequent — always check)

### 1. Null-safety / optional chaining (S6582) — TOP priority
External data (Contentful, APIs) is never guaranteed. Always optional-chain.
```ts
// ❌ obj.fields.title
// ✅ obj?.fields?.title
```
This was historically the **most frequent fix in the entire codebase.** Treat every access
into `.fields`, API responses, or nested objects as nullable.

### 2. React Hooks before early returns
All hooks must run before any conditional `return`. Never call a hook after a guard.
```tsx
// ❌ if (!data) return null;  useEffect(...)
// ✅ useEffect(...);  if (!data) return null;
```

### 3. Cognitive Complexity (S3776)
Split large/branchy functions into small, **named** helper functions. If a function needs
scrolling to read, extract helpers with intention-revealing names.

### 4. No unused vars / imports / dead code (S1481 / S1128)
Remove unused imports, variables, and unreachable callbacks before finishing.

### 5. No `console.*` in application code — not even through a logger
No `console.log`/`console.error`/`console.warn`/`console.info` anywhere, including inside a
logging utility. `src/lib/logger/log.ts` is a no-op placeholder until the backend logging API
exists (see [project-coding-standards] §5) — this supersedes the earlier "use a proper logger"
guidance, which implied console output was acceptable via a wrapper.

### 6. No commented-out code (S125)
Delete dead comment blocks. Git is the history — don't keep code in comments.

### 7. No hardcoded / duplicated string literals (S1192)
Extract magic URLs, env-var keys, and CSS selectors into named constants (e.g. `constants/`).

## Medium-priority rules

### 8. Avoid credential-like identifier names (S2068 false positive)
Don't name non-secret identifiers `...ByPassword`; prefer `...BySecret` / neutral names.

### 9. No inefficient / backtracking regex
Avoid super-linear patterns. Rewrite risky regex as explicit string loops when clearer.

### 10. No nested ternaries
Replace nested `a ? b : c ? d : e` with `if / else if / else`.

### 11. `window` → `globalThis` for SSR safety
Never assume `window` exists on the server. Use `globalThis` and guard access.

### 12. Prefer `??=` for lazy init
Replace redundant `if (!x) x = …` guards with `x ??= …`.

### 13. Remove unnecessary type assertions
Drop `as number` / `as string` where the type already holds.

### 14. Replace `any` with explicit interfaces
Define an interface (e.g. `ButtonConfig`) instead of `any`.

### 15. Remove unused function parameters
Drop trailing unused args.

## Accessibility rules Sonar also flags (see also [accessibility])
- **Video captions:** add `<track kind="captions">` to every `<video>`.
- **Semantic grouping:** use `<fieldset role="group">`, not `<div role="group">`.

## Structural cleanups
- **Decompose components** with duplication into shared pieces (e.g. `LinkItem`, `ErrorMessage`).
- **Delete duplicate/dead API routes** rather than leaving them.

## Quick self-check before finishing any file
- [ ] All external data optional-chained
- [ ] Hooks above early returns
- [ ] No `any`, no unused imports, no `console.log`, no commented code
- [ ] No hardcoded strings; constants extracted
- [ ] Complex functions split into named helpers
