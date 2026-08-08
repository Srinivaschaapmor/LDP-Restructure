---
name: figma-mcp-workflow
description: How to build pages/components from Figma designs via the Figma MCP for this project. Use whenever implementing a design from a Figma URL/selection — reading structure, mapping to sections, pulling tokens, and verifying fidelity. Encodes real mistakes already hit.
---

# Figma → Code Workflow

> **Process note:** the phase order and approval gates (design analysis → content-model analysis
> → CMS approval → technical plan → dev approval → build → validate) live in
> [figma-to-development-workflow] — that skill governs *when* to do each step below; this skill
> governs *how* to do the design-fidelity parts correctly.

## 0. Strict design-system fidelity — when Figma is connected, match it EXACTLY
Every visual value MUST come from the design — never eyeballed or "close enough".
That means **font-size, line-height, font-weight, color, padding, margin, gap, border,
radius, and width/height**. Pull them with `get_variable_defs` and `get_design_context` on
the specific node, then apply the exact values (bound to SCSS/DS variables — no free colour
pickers or arbitrary sizes). If a value isn't in a named token, read it off the CSS that
`get_design_context` generates for that node.
Examples of "exact" from this project: H1 = Avenir Next Demi **52/62 #3352A3**; body =
**16/24**; selector box = **#f0f0f0, 20px pad, 8px radius**; control = **215px wide, 14/16 pad,
border rgba(15,16,66,.4)**; breadcrumb divider = **1px rgba(51,82,163,.1)**.
Baseline token library: **`docs/04-design-system/design-tokens.md`** — but the **node is
authoritative**; pull per-node with `get_variable_defs`/`get_design_context` and match it.
The Figma file contains foreign token libraries (Inter, Roboto Mono, M3, Prime Indigo, Figr
Brand) — **never** pick one of those; use the Avenir Next "Liberty" set.
**If a required design value is absent from both the tokens doc and the node, STOP and ask — do
not invent, approximate, simplify, or substitute an icon/colour.**
*(Real mistakes: shipped a flat "PDF" text chip and approximate sizes; had to redo to the exact
Figma page-outline icon, 52px H1, 24px prompt, etc.)*
**One narrow, explicit exception:** `Banner.overlayColor` — a Contentful-regex-validated hex
field with a safe fallback to the default navy — per user sign-off, see ADR-0006. This is a
one-off, not a precedent; a new "let the CMS pick a color" request is still a fresh decision
to confirm, not something this exception pre-approves elsewhere.

## 1. Content width & page padding come from the frame, not Bootstrap defaults — and must be
## fluid, not fixed
Use **`.container-xxl`**, never plain `.container`: Bootstrap's `.container` snaps to a new fixed
max-width at *every* sm/md/lg/xl/xxl tier, which freezes the content box at one width and leaves
an uncontrolled, viewport-dependent gutter beyond it — "too much padding" on common desktop
widths, "no padding" on mobile (only the 12px default gutter). `.container-xxl` has none of
Bootstrap's smaller tiers, so it stays fluid (padding-only) until it hits its own max-width.
Side padding must **interpolate continuously** between the Figma reference frames (not a single
fixed value, not a hard breakpoint jump): e.g. this project's 440/834/1600px frames → 16/60/230px
padding, implemented as two `clamp()` segments meeting exactly at the middle frame width so there
is no visible jump at that boundary. `max-width` on the container = the desktop reference frame
width (here 1600), so the content column keeps growing right up to that width instead of freezing
early. Common page rhythm: the content area (below breadcrumbs, above footer) also uses a shared
vertical padding on **every** page (this project: **60px** top & bottom via `.ld-content`); zero
the first/last section's edge padding so it isn't doubled.
*(Real feedback: "padding around the page — make it exactly"; "60px is common below breadcrumbs
and above footer for all pages"; "container should be xxl size... padding too high in desktop and
no padding in mobile... should be responsive not fixed" — the original `.container{max-width:
1140px}` approach was exactly this bug: a fixed box, not a fluid one.)*

## 2. Build the WHOLE page, not just the named section
A page is header + contextual nav + breadcrumbs + (banner) + sections + footer. When asked to
build "the accordion", still wire the shell:
- Attach the page's **`primaryNav`** so the header primary nav + contextual sub-bar dropdowns +
  mobile drawer render (they are route-driven — a page without `primaryNav` shows no menu).
- **Breadcrumbs** derive from slug + page title (Home › … › current), in a full-width bar with
  the Figma divider below it.
- A leading **banner** is a full-bleed hero **above** the breadcrumbs.
*(Real mistake: reused a stripped header with no `primaryNav` → the entire sub-menu/dropdown/
drawer was missing.)*

## 3. Model the page as the design intends — one page, swappable content
Don't create a page per data variant (e.g. per US state). If the design is "one page + a
selector that swaps content", build ONE page with a selector section composing reusable entries
(each variant = one reusable entry; reuse existing section types). See [contentful-development].
*(Real mistake: built `/resource-library/alabama` per state; correct model is one
`/resource-library` with a state dropdown that swaps the accordion.)*

## 4. Match default / initial states to the design
Ship the exact initial state: e.g. a selector starts on a **"Select …" placeholder** with no
content shown until chosen; accordions **start collapsed**. Don't auto-open or pre-select unless
the design does.

## 5. Inspect ALL responsive frames before building
A Figma page usually has **desktop, tablet, and mobile** frames. Call `get_metadata` on the
parent and read **every** frame, then build for the **richest** structure. Header collapses to a
hamburger below `lg`; footers become grouped link columns.

## 6. Collapse variations into one component + variant enums
Do not create a content type / component per visual variation. Map the design family to one
component with design-system-bound **variant enums** (see the content-model spec).

## 7. Use the real Figma icons/assets — don't hand-draw
Export the actual icon from Figma (`get_design_context` on the icon node → download the SVG
asset) and inline it, instead of approximating with a hand-drawn SVG or CSS. Figma asset URLs
are **short-lived (~7 days)** — download promptly; move photos/images into **Contentful** as
real assets (never local `/public` binaries; see [contentful-development] rule 2).

## 8. Remove superseded work completely
When the model/approach changes, delete the old pages/entries/files — unpublish+delete in
Contentful, remove dead seed scripts — so nothing stale lingers.

## 9. Verify against every breakpoint AND state before "done"
Run the app; check **desktop, tablet, mobile** and every interactive state (dropdown open,
accordion toggle, mobile drawer, variant switch). Verify **computed** values match the Figma
tokens (font-size, line-height, padding, colors, widths, radii) — not just "looks right". Fold
into [definition-of-done].

## 10. Pre-flight check (do this mentally before writing any UI)
Color · Typography (family/size/line-height/weight/letter-spacing) · Spacing · Radius · Border ·
Shadow · Icon · Component state (hover/active/focus/disabled/loading/error/success) · Responsive
rules · Accessibility · Design token · Variant · Auto-layout. Any unknown → STOP and ask.

## 11. Report every implementation
When you finish a Figma-driven build, state: (1) components used, (2) design tokens used,
(3) spacing values, (4) typography values, (5) colors used, (6) responsive behavior,
(7) accessibility considerations, (8) any unavoidable assumptions. This is the proof of
compliance, verified against **computed** values (not "looks right"). **Delegation:** run this
report via the `figma-fidelity-auditor` agent — it independently compares the finished build
against the Figma node and returns this exact report format with a PASS/FAIL per item.

Servers: the Figma **plugin** MCP is primary (read+write, any URL); the local Dev Mode server
is the committed fallback (see ADR-0002 and `docs/06-runbooks/figma-mcp-connection.md`).
