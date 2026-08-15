# ADR-0012: Derived interaction states — hover, focus, active, disabled

- **Status:** Accepted (provisional) — **awaiting designer ratification**
- **Date:** 2026-08-15
- **Deciders:** sai_dev1@aapmor.com, Claude

## Context
The Home design (Figma `4UxJeqzAVXcc2mtlwkTQKO`, node `30:382`) specifies **no interaction states
anywhere** — no hover, focus, active, pressed, disabled, loading, or error. Across all three
breakpoint boards and ~25 overlay-state screens, the only state variant that exists is the skip
link's "Focused" board. `docs/04-design-system/design-tokens.md` does not define them either.

Meanwhile `src/styles/globals.css` has **no `:hover`, `:focus`, `:focus-visible`, or `:active`
rules at all**. That is a live WCAG 2.2 AA failure independent of this page: SC 2.4.7 Focus Visible
requires a visible focus indicator on every keyboard-operable control, and SC 1.4.11 Non-text
Contrast requires that indicator to reach **3:1** against adjacent colors.

The project's non-negotiable is "if a required design value is missing, STOP and ask". That was
done; the user's ruling was to derive a consistent system and document every invented value here
for the designer to ratify or override.

## Decision
Derive states arithmetically from the existing palette rather than inventing new hues. Every value
below is computed, and every contrast claim was measured (not estimated).

### Buttons — solid variants
| State | Background | Ratio vs white label |
|---|---|---|
| Base | `#3352A3` (Foundation blue) | 7.30:1 ✅ |
| Hover | `#2E4A93` — base × 0.90 | 8.34:1 ✅ |
| Active / pressed | `#2B4589` — base × 0.84 | 9.07:1 ✅ |
| Disabled | base at 40% opacity, `cursor: not-allowed`, `aria-disabled` | — (see below) |

### Buttons — outline variants
Hover fills with the border color and flips the label to white, landing on the same measured pairs
as the solid variants. Active uses the × 0.84 step.

### Focus indicator — a double ring, not a single one
A single deep-blue ring **fails** on the primary button: `#1F1F4F` on `#3352A3` measures **2.10:1**,
below the 3:1 floor. A single white ring conversely fails on any white surface. The system therefore
uses two concentric rings so at least one edge always clears 3:1 against whatever sits behind it:

```css
:focus-visible {
  outline: 2px solid #FFFFFF;      /* inner — 7.30:1 on the primary button */
  outline-offset: 0;
  box-shadow: 0 0 0 4px #1F1F4F;   /* outer — 15.36:1 on any white surface */
}
```

Measured: white ring on `#3352A3` = **7.30:1**; deep-blue ring on `#FFFFFF` = **15.36:1**; deep-blue
ring on the `#1F1F4F` header = the white inner ring carries it at **15.36:1**.

`:focus-visible` (not `:focus`) so pointer users never see the ring. Radius follows the host control.

### Other states
- **Links** ("Read more", footer, utility bar): already underlined at rest per the design, so hover
  darkens to `#2B4589` and thickens to `text-decoration-thickness: 2px`. Color alone is never the
  only hover signal (SC 1.4.1 Use of Color).
- **Cards** (news, teledentistry, logo): hover raises `box-shadow` to the page's one existing shadow
  token `0 2px 8px rgba(67,72,105,0.2)`. No transform, no scale — nothing in the design implies motion.
- **Disabled:** 40% opacity + `aria-disabled="true"`, never the `disabled` attribute on links.
  Disabled controls are exempt from contrast minimums (SC 1.4.3), so the reduced ratio is conformant.
- **Transitions:** 150ms ease-out on color/shadow only, wrapped in
  `@media (prefers-reduced-motion: reduce) { transition: none }`.

### Body-color ruling (related)
Both body colors the design uses pass AA on white — `#4C4C67` = 8.28:1, `#434869` = 8.86:1 — so
reproducing Figma verbatim per section (the user's ruling) carries no accessibility cost. Recorded
here so the choice is not re-litigated later.

## Rationale
- Multiplicative darkening keeps every state on the brand hue; no new colors enter the palette.
- Deriving from measured contrast rather than visual judgement means the a11y claim is verifiable
  and survives a SonarQube/SiteImprove pass.
- The double ring is the only construction that satisfies 3:1 on **both** the white page background
  and the blue button/header surfaces, which a single ring provably cannot.

## Consequences
- Positive: closes an existing WCAG 2.2 AA gap; every interactive element behaves consistently;
  the values are reproducible from the palette by anyone.
- Negative / trade-offs: these are **invented values**. If the designer later specifies different
  states, this ADR is superseded and the implementation changes with it. The `box-shadow` focus
  technique means a control with its own `box-shadow` must compose the two rather than overwrite.
- **Follow-up (required):** designer to ratify or replace. Until then, treat every value here as
  provisional and flag it in the implementation report.

## Verification
Contrast ratios computed with the WCAG 2.x relative-luminance formula on 2026-08-15. Every pairing
in this ADR was measured; the 2.10:1 single-ring failure is what drove the double-ring design.
