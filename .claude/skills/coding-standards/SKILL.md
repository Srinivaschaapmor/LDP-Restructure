---
name: coding-standards
description: Core code-organization and readability standards for this project. Use whenever writing or refactoring code — covers shared-utility extraction, naming, and file structure.
---

# Coding Standards

## 1. Extract shared logic into categorized utilities
Any function used across multiple files/components must live in a shared utility module,
**grouped by purpose** — not in one giant `utils.ts`. Suggested split:
```
lib/utils/
├─ auth.utils.ts        # auth/session/token helpers
├─ common.utils.ts      # generic helpers (clamp, isEmpty, etc.)
├─ time.utils.ts        # timestamps, durations, formatting
├─ calendar.utils.ts    # date/calendar logic
├─ conversion.utils.ts  # unit/format/type conversions
└─ ...                  # add categories as they emerge
```
Rule of thumb: if the same logic appears in **two** places, extract it. One category per
concern; never mix (e.g. don't put date logic in `auth.utils.ts`).

## 2. No code comments — see [project-coding-standards]
Code must be self-explanatory through naming and structure; no inline comments anywhere in
application source. Rationale that would otherwise go in a comment lives in
`docs/02-architecture/code-notes.md` or the relevant ADR/doc instead. *(This reverses the
former "comment the why" rule — see [project-coding-standards] §2 for the current, canonical
rule and its rationale.)*

## 3. Naming
- Files: `PascalCase.tsx` for components, `camelCase.ts` for utils/hooks (`useX.ts`).
- Constants: `UPPER_SNAKE_CASE`. Booleans read as predicates (`isOpen`, `hasError`).
- No abbreviations that aren't domain-standard; names reveal intent.

## 4. File / function size
- One primary responsibility per file. Extract helpers rather than growing a function.
- Prefer pure functions; isolate side effects.

## 5. Constants over magic values
No hardcoded URLs, keys, or repeated strings inline — extract to a `constants/` module
(see [sonarqube-compliance] rule 7).

## Relationship to other skills
This skill governs **organization & readability**. Defect-level rules live in
[sonarqube-compliance]; accessibility/SEO markup rules live in [accessibility] and [seo].
