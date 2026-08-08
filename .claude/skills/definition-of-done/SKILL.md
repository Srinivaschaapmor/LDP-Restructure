---
name: definition-of-done
description: The final quality gate before any change is considered complete or ready for PR. Use to self-verify a change against every project standard. This is the checklist that ties all other skills together.
---

# Definition of Done

A change is **not done** until it passes every category below — the enforceable summary of the
project's standards. Categories: design fidelity ([figma-mcp-workflow]), code quality
([project-coding-standards], [sonarqube-compliance], [coding-standards]), accessibility
([accessibility], [siteimprove-compliance]), SEO ([seo]), tests ([testing-standards]), docs
([documentation-standards]), commit/PR ([git-workflow]).

Some code-quality and commit-message items are already caught live, at zero token cost, by the
`PostToolUse`/`PreToolUse` hooks in `.claude/settings.json` — this checklist is the complete
picture; the hooks are just a backstop for its mechanical subset.

## Use the `dod-auditor` agent
The full, itemized checklist (every box to check, per category) lives in
`.claude/agents/dod-auditor.md` — delegate the actual audit there for an independent, cold
PASS/FAIL per item and an overall READY/NOT READY verdict, rather than self-grading inline.
