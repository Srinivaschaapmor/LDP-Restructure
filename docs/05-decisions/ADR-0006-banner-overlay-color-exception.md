# ADR-0006: Banner overlay color — a validated-hex exception to "no free color pickers"

- **Status:** Accepted
- **Date:** 2026-07-28
- **Deciders:** sai_dev1@aapmor.com, Claude (mentor)

## Context
`docs/04-design-system/design-tokens.md` and the `figma-mcp-workflow` skill establish "no
free color pickers or arbitrary sizes" — editors set only constrained, design-system-bound
enums, never an open-ended value, so pages can't drift off-brand. The `Banner.overlay` field
already followed this (`none`/`left`/`right`, a direction enum mapped to one fixed navy tint).

A reference Banner implementation was reviewed (a sibling project's component, offered as
inspiration) that lets editors supply an arbitrary hex color for the overlay, validated and
turned into a gradient at render time. Adopting this reopens exactly the risk the no-free-
color-picker rule exists to prevent: an editor can now pick any color for a banner.

## Options considered
1. **Reject it — keep the fixed navy tint.** Zero brand-drift risk, but section-specific
   banners (e.g. a page that wants a brand-secondary tint instead of navy) have no way to
   express that without a code change.
2. **Free-form hex field, no guardrails.** Matches the reference exactly, but is the literal
   thing the existing rule forbids — any hex, no relationship to the design system's palette.
3. **Validated-hex field with a safe fallback (adopted).** `Banner.overlayColor` is a Short
   Text field with a **Contentful-enforced regex** (`^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$`) — an
   editor cannot save an invalid value at all. The frontend additionally re-validates and
   falls back to the default navy tint if a value is ever missing or malformed. Direction
   (`overlay`) and color (`overlayColor`) stay separate, orthogonal fields.

## Decision
Adopt **Option 3**, per explicit user sign-off (this ADR exists specifically because it
deviates from the standing design-tokens rule — flagged and confirmed, not assumed).

## Rationale
- The user explicitly chose this after being shown the tension with the existing rule.
- A regex-validated field is meaningfully different from a truly free color picker: it can't
  produce arbitrary values behavior-wise (still a real string of the editor's choosing, but
  format-constrained), and the frontend never trusts it blindly — invalid/missing always
  degrades to the existing default-navy behavior, so this can never break a page.
- Scoped to exactly one field on one content type — not a precedent for color pickers
  elsewhere without an equivalent explicit decision.

## Consequences
- Positive: banners can carry a per-entry accent color when a page genuinely needs one,
  without any code change; the default (no color set) is unaffected.
- Negative / trade-offs: an editor can still pick a color that clashes with the brand palette
  — the regex only enforces *shape* (valid hex), not *which* colors are acceptable. If brand
  drift becomes a real problem, the follow-up is a constrained swatch list (enum of approved
  hex values) rather than a fully free field.
- Follow-ups: if another component wants a similar capability, treat it as a new decision
  (don't cite this ADR as blanket precedent) — confirm with the user first, same as here.
