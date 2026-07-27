# Design Tokens — canonical reference (Figma: `for-devs`)

> **Figma is the single source of truth.** This file records the project's canonical
> ("Liberty") design system extracted from the Figma variables. When implementing, **pull the
> exact token bound to the specific node** with `get_variable_defs` / `get_design_context` and
> match it pixel-for-pixel. Never invent, approximate, or pick a lookalike.
>
> ⚠️ The Figma file also contains **imported/foreign libraries** (Inter, Roboto Mono, Material
> `M3/sys`, `Prime Indigo`, `Figr Brand`). These are **NOT** the project system — ignore them.
> The project uses **Avenir Next LT Pro** with the palette below.

## Typography — Avenir Next LT Pro
| Style | Size / line-height | Weight |
|---|---|---|
| H1 / Bold | 52 / 62 | Demi (600) |
| H2 / Bold | 44 / 54 | Demi (600) |
| H3 / Bold | 38 / 48 | Demi (600) |
| H4 / Bold | 28 / 38 | Demi (600) |
| H5 / Bold | 24 | Demi (600) |
| Paragraph1 / Regular | 18 / 26 | Regular (400) |
| Paragraph1 / Medium | 18 / 24 | Medium (500) |
| Body (B-2) / Regular | 16 / 24 | Regular (400) |
| Small / Regular | 14 / 22 | Regular (400) |
| Small / Medium | 14 / 22 | Medium (500) |
| Extra-small / Regular | 12 / 20 | Regular (400) |

Text colors: **H1 `#3352A3`**, **H2 `#4763AC`**, **Body `#4C4C67`**.

## Color palette
**Primary:** Foundation blue `#3352A3` · Deep blue `#1F1F4F` · Deep blue/400 `#414195` ·
Deep blue/200 `#9C9CD1` · Navigation blue `#0A86C3` · Calm blue `#83BACD` ·
Phase purple `#EBE2EF` · Cool gray `#E9EAEE`.
**Secondary:** Shine yellow `#FFD655` · Radiant red `#F2705E` · Bright green `#3BB143`.
**Neutral:** 100 `#FFFFFF` · 200 `#E8E8E8` · 300 `#D2D2D2` · 400 `#BBBBBB` · 500 `#A4A4A4` ·
600 `#8E8E8E` · 700 `#777777` · 800 `#606060` · 900 `#4A4A4A` · 1000 `#333333`.

## Spacing scale
`8 · 16 · 20 · 24 · 32 · 48` — named: **m = 16, ml = 24, l = 32, xl = 48** (also 8, 10, 12, 20 seen).

## Layout
- **Content column width:** 1140px (frame 1600 − 230 side margins). Cap Bootstrap `.container`
  at 1140 (it defaults to 1320 at ≥1400px).
- **Common content padding:** 60px top (below breadcrumbs) and 60px bottom (above footer), every page.
- **Breakpoints:** Bootstrap (`lg` = 992px is where the header collapses to a hamburger).

## Radius / borders / shadows
- **Radius:** 8px (inputs / boxes) · 12px (cards / accordion items) · 24px (layout blocks).
- **Border (subtle divider):** `1px rgba(51,82,163,.1)` · input border `rgba(15,16,66,.4)` ·
  strong border `#E5E5E5`.
- **Shadow / lg:** `0 4 3 rgba(0,0,0,.10)` + `0 10 8 rgba(0,0,0,.04)`.

## Component reference values (verified in build)
- **Breadcrumb bar:** full-width white, `12px` vertical padding, bottom divider
  `1px rgba(51,82,163,.1)`; links 14px Medium `#3352A3` underlined; current page `#4C4C67`.
- **Selector box:** bg `#f0f0f0`, `20px` padding, `8px` radius; prompt 24px Demi `#414195`;
  control 215px wide, `14/16px` padding, border `rgba(15,16,66,.4)`, `8px` radius.
- **PDF icon:** red page outline (`#FF2116`, folded corner) + red "PDF" chip (from Figma node,
  not hand-drawn).

## How to use this file
1. Read this before any Figma-driven implementation ([figma-mcp-workflow] rule 0).
2. For the specific screen, still pull the exact node values — this is the baseline, the node is
   authoritative for that element.
3. If a needed value is absent from both this file and the node, **STOP and ask** — do not guess.
