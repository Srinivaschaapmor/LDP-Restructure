---
name: accessibility
description: WCAG 2.2 AA accessibility practices for building UI and markup. Use whenever creating components, pages, forms, media, or interactive elements. Complements siteimprove-compliance with dev-time technique.
---

# Accessibility (WCAG 2.2 AA)

Build accessible by default. This covers *technique*; [siteimprove-compliance] lists the
specific scanned issues to avoid.

## Semantic HTML first
Use the right element before reaching for ARIA. `<button>` for actions, `<a>` for navigation,
`<nav>/<main>/<header>/<footer>` landmarks, `<fieldset>`/`<legend>` for grouped inputs,
proper heading levels. **ARIA is a last resort**, not a substitute for semantics.

## Text alternatives
- Meaningful `alt` on informative images; `alt=""` on decorative (and hide from AT).
- Accessible names for icon buttons, SVGs, iframes, objects, image buttons.
- Never use a file name as alt text.

## Keyboard & focus
- Everything operable by keyboard; logical tab order.
- Visible focus indicator (never remove outlines without a replacement).
- No keyboard traps; scrollable regions reachable by keyboard.

## Forms
- Every control has a programmatic label (`<label htmlFor>` or `aria-label`).
- Errors announced (`aria-live`, `aria-describedby`), described in full text.
- Support `autocomplete`; visible label matches accessible name.

## Media
- Captions on video (`<track kind="captions">`), transcripts for audio, audio-description.
- No autoplaying audio without a control to stop it.

## Structure
- One `<h1>`; no skipped heading levels; descriptive headings; content after headings.
- "Skip to main content" link; named landmarks/regions.

## Text & contrast
- Meet contrast minimums (4.5:1 body text). Support zoom to 200% and user text-spacing.
- Don't fix font-size/line-height in px that blocks user scaling.

## Target sizes (WCAG 2.2)
- Interactive targets meet minimum size and spacing.

## Verify
- Keyboard-only pass, screen-reader smoke test, and automated axe/Lighthouse check before done.
