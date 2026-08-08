---
name: code-review-standards
description: Standards for reviewing a diff or preparing code for review. Use when reviewing changes, self-checking before a PR, or evaluating generated code for quality, correctness, and standards compliance.
---

# Code Review Standards

Review order: correctness → [project-coding-standards]/[sonarqube-compliance] compliance →
[coding-standards] design & reuse → [testing-standards]/[documentation-standards] coverage.

## Review conduct
- Comment on **why**, suggest a concrete fix, distinguish blocking issues from nits (prefix
  nits with `nit:`).
- Never approve with an unaddressed blocking issue or a failing gate.

## Final gate
A change passes review only when [definition-of-done] is fully satisfied.

## Use the `code-reviewer` agent
The full, itemized checklist lives in `.claude/agents/code-reviewer.md` — delegate any actual
review there rather than re-deriving it here. It returns findings only, ordered most-severe
first, no fixes applied.
