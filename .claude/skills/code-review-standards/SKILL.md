---
name: code-review-standards
description: Standards for reviewing a diff or preparing code for review. Use when reviewing changes, self-checking before a PR, or evaluating generated code for quality, correctness, and standards compliance.
---

# Code Review Standards

Review in this order — stop and fix before moving on.

## 1. Correctness
- Does it do what was asked? Edge cases and error paths handled?
- External data optional-chained; hooks above early returns (see [sonarqube-compliance]).
- No obvious runtime/SSR hazards (`window` on server, unguarded async).

## 2. Standards compliance
- [sonarqube-compliance]: no `any`, no dead code, no `console.log`, no hardcoded strings,
  no nested ternaries, complexity kept low.
- [coding-standards]: shared logic extracted to categorized utils; "why" comments present.
- [accessibility] + [seo] + [siteimprove-compliance] for any UI/markup/metadata.

## 3. Design & reuse
- Any duplication extracted into a shared component/util?
- Single responsibility; sensible naming; no leaky abstractions.

## 4. Tests & docs
- Meaningful tests added/updated ([testing-standards]).
- Relevant docs updated in the same change ([documentation-standards]).

## Review conduct
- Comment on **why**, suggest a concrete fix, distinguish blocking issues from nits (prefix
  nits with `nit:`).
- Never approve with an unaddressed blocking issue or a failing gate.

## Final gate
A change passes review only when [definition-of-done] is fully satisfied.
