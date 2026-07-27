---
name: definition-of-done
description: The final quality gate before any change is considered complete or ready for PR. Use to self-verify a change against every project standard. This is the checklist that ties all other skills together.
---

# Definition of Done

A change is **not done** until every box below is checked. This is the enforceable summary of
the project's standards — run it before finishing or opening a PR.

## Before starting
- [ ] Loaded the relevant skills for the task (e.g. [contentful-development], [nextjs-development],
      [figma-mcp-workflow]) — don't build from memory when a skill exists.

## Design fidelity (see [figma-mcp-workflow])
- [ ] **Exact Figma tokens** applied — font-size, line-height, font-weight, colors, padding,
      margins, gap, border, radius, widths (pulled from Figma, not approximated)
- [ ] **Real Figma icons/assets** used (exported SVG/image), not hand-drawn approximations
- [ ] **Content width + common page padding** match the design (container capped to the design
      column; shared 60px content padding below breadcrumbs / above footer)
- [ ] **Whole page wired**: header + `primaryNav` (contextual sub-menu/drawer) + breadcrumbs +
      banner + footer — not just the named section
- [ ] Correct **default/initial states** (e.g. selector on its placeholder; accordions collapsed)
- [ ] Verified against **every breakpoint** — desktop, tablet, AND mobile
- [ ] Interactive states checked (dropdown open, accordion toggle, mobile drawer, variant switch)
- [ ] Built from all responsive frames, not just desktop; superseded pages/entries/files removed

## Code quality (see [sonarqube-compliance], [coding-standards])
- [ ] External/Contentful data is optional-chained everywhere
- [ ] React hooks are above all early returns
- [ ] No `any` (or justified in a comment); no unused imports/vars/params
- [ ] No `console.log`, no commented-out/dead code
- [ ] No hardcoded/duplicated strings — extracted to constants
- [ ] Complex functions split into named helpers; no nested ternaries
- [ ] Shared logic lives in categorized utils; "why" comments present
- [ ] SSR-safe (`globalThis`, no unguarded `window`)

## Accessibility (see [accessibility], [siteimprove-compliance])
- [ ] Semantic HTML; single H1; logical headings
- [ ] Alt text / accessible names on images, buttons, icons, media
- [ ] Keyboard operable; visible focus; forms labelled; contrast passes
- [ ] Media has captions/transcripts; no autoplay audio

## SEO (see [seo])
- [ ] Unique title + meta description; canonical set
- [ ] Images have alt + dimensions and are < 1 MB
- [ ] No broken links / redirect chains; HTTPS only

## Tests (see [testing-standards])
- [ ] Meaningful tests added/updated, including null/error paths
- [ ] Coverage meets target; no `.only`/skipped tests left

## Docs (see [documentation-standards])
- [ ] Relevant docs updated in this same change
- [ ] Index (`README`/`CLAUDE.md`) updated if a doc was added

## Commit/PR (see [git-workflow])
- [ ] Conventional commit message(s); focused, single-purpose change
- [ ] All CI/scanner gates green (SonarQube, SiteImprove)
