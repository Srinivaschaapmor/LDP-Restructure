# Code Notes

Rationale that used to live as inline comments in `src/`, relocated here per
[project-coding-standards] §2 (no code comments — code must be self-explanatory through naming
and structure; non-obvious rationale lives in docs instead). Organized by area. Comments that
only restated the code, or duplicated something already in a skill/ADR, were simply deleted —
not relocated — since that knowledge already lives elsewhere.

## Routing & page shell (`src/app/[[...slug]]/page.tsx`)

- A leading `banner` section is treated specially: if the first section on a page is a `banner`,
  it renders full-bleed *above* the breadcrumbs (per design); every other section renders below
  the breadcrumbs, inside the shared `.ld-content` padding.
- The JSON-LD `<script>` tag emits `Article` structured data for search engines (see [seo]).

## Layout & Navigation (`src/components/layout/`, `src/components/navigation/`)

- **`Header.tsx`**: `NavItem` is a real discriminated union (see `src/types/content.ts`), so
  `isLinkGroup(it)` narrows both ternary branches with no cast needed, anywhere it's used.
  The primary nav renders plain links with the active one underlined; the contextual sub-bar
  and mobile drawer are both driven by the same `primaryNav` data, keyed off the active route.
- **`DesktopMenu.tsx`**: `SubLink` is exported so other dropdown-style menus (`UtilityBar`)
  reuse the same group/link rendering instead of duplicating it. Its optional
  `sublinkClassName` prop lets a container (e.g. `UtilityBar`'s panel) layer on a contextual
  style override without `SubLink` itself needing to know about that context.
- **`UtilityBar.tsx`**: language options are flat links (never groups); the trigger already
  shows the active choice's label, so a match marks the current selection the same
  "active via typography" way the header's current nav item does — no separate icon needed.
  `UtilityMenu` is exported so `MenuDrawer` can reuse the identical Language/Login dropdown
  behavior on mobile rather than a separate, simpler flat-link treatment.
- **`MenuDrawer.tsx`**: Language/Login rows in the drawer are inline-expanding (push content
  down), never a floating `position:absolute` panel — the desktop `UtilityBar` dropdown works
  fine in a wide horizontal bar, but that treatment is fragile in a narrow, scrollable drawer
  (can render clipped or off-screen depending on trigger position). The drawer instead reuses
  the same guaranteed-visible inline-expand pattern as every other drilldown row.

## Sections (`src/components/sections/`)

- **`Accordion.tsx`**: the disclosure-button-controlling-a-labelled-region structure follows
  the WCAG accordion pattern. All groups start collapsed on mount; the `useState` hook runs
  before any early return (`sonarqube-compliance` rule 2). Heading levels are kept valid: if
  the accordion has its own heading (h2), group titles become h3; without one, groups sit
  directly under the page h1, so they're h2. The optional `className` prop lets a container
  (`ResourceLibrary`, which nests this section) zero out its own top/bottom padding via a
  higher-specificity contextual override.
- **`Banner.tsx`**: `hexToRgb`/`overlayGradient` exist because `Banner.overlayColor` is a
  scoped, Contentful-regex-validated exception to "no free color pickers" (see ADR-0006) — the
  hex is validated at the content layer, and this parse still falls back safely if an invalid
  value ever slips through. The overlay direction otherwise matches the `.overlayLeft`/
  `.overlayRight` CSS Module gradients; only the color is dynamic. On mobile, a banner swaps to
  a lightweight solid-color band (logo, or heading, never both) instead of the hero photo, to
  avoid shipping a large image as the mobile LCP element — it only swaps in when there's
  actually something to show instead, so a plain photo banner still shows its photo on mobile.
- **`CardCollection.tsx`**: same heading-level-validity pattern as `Accordion` — an h2
  collection heading pushes card titles to h3; without one, cards sit under the page h1 and are
  h2.
- **`ResourceLibrary.tsx`**: the dropdown option for a state is that state's accordion heading
  (e.g. "Alabama"). An empty-string select value means no state is chosen yet — the page opens
  on the placeholder with no accordion shown. The rendered `Accordion`'s `key` changes with the
  selected state so it fully remounts (and starts collapsed again) on every selection change.

## Media & Documents (`src/components/media/`)

- **`MediaImg.tsx`**: the optional `transform` param maps to Contentful's Images API
  (`?w=&q=&fm=`) and is only meaningful for fixed, non-responsive images (logos/icons) —
  shrinking the origin payload before `next/image`'s own optimizer fetches it. Never apply a
  `width` transform to a `fill` image whose `sizes` varies by viewport (hero/banner photos): that
  would cap every responsive variant `next/image` generates to one fixed origin width and
  undermine its own `srcset` logic. `quality`/`format` don't have that conflict (`next/image`
  re-encodes regardless), so those are always safe to pass through. `fill` is for
  background/cover images whose parent is positioned; non-fill images require intrinsic
  width/height so layout reserves space up front (no CLS). `priority` and `loading="lazy"` are
  contradictory to `next/image` (priority forces eager) — `loading` is only passed through when
  the image isn't marked `priority`.
- **`DocumentLink.tsx`**: `resolveDocHref` prefers the uploaded PDF asset URL (protocol-relative
  from Contentful, prefixed to `https:`), falling back to an external URL — optional-chained
  throughout since the CDA reference tree is never guaranteed. External docs get a trailing
  `↗` glyph (decorative, `aria-hidden`) plus visually-hidden "(opens in a new tab)" text, since
  that's what actually carries the meaning for assistive tech.

## Contentful data layer (`src/contentful/`)

- `client.ts` is a single CDA client reading published content; env vars come from `.env(.local)`.
- `page.queries.ts`'s `getPageBySlug` passes `include: 10` to resolve the full
  Page → sections → cards → media reference tree in one call.

## Types (`src/types/`)

- `content.ts` deliberately hand-rolls CMS payload shapes instead of using the Contentful SDK's
  own generics — the CDA response is cast once at the boundary (`getPageBySlug`), then optional
  chaining is used everywhere downstream, since external data is never guaranteed.
- `TaggedNode` exists so a node's content-type id is a literal at the type level, not just
  `string`. Without it, unions like `NavItem` (`Link | LinkGroup`) structurally overlap (both
  have all-optional `fields`), so TypeScript can't tell them apart without an `as X` cast at
  every use site. Tagging the discriminant makes it a real discriminated union, so a
  type-predicate guard (`isLinkGroup`) narrows both branches correctly with zero casts.
  `isLinkGroup`/`isLink` are written as direct predicate references (not `!isLinkGroup`)
  specifically so `Array.filter` can infer a narrowed array type — TS only does that from a
  direct predicate, not a negated call wrapped in an arrow function.
- `richTextItem` (ADR-0007) is modeled as a standalone, referenceable entry rather than an
  inline field, so the same rich-text block can be shared across multiple entries/pages.
  `LinkGroup.links` is recursive (a group can contain links AND nested groups, for multi-level
  menus); `LinkGroup.href` makes a group itself navigable (a section label that also owns a
  sub-menu).
- `DocumentEntry` covers both an uploaded PDF Asset (`file`) and an external doc link
  (`externalUrl`) in one type; `kind`/`isExternal` drive the icon and new-tab behavior.
  `AccordionItem`'s `content` and `documents` are both optional so one type covers
  documents-only, content-only, and combined groups.
- `asFields<T>()` in `content.ts` is the single, deliberate boundary cast for the CDA's
  loosely-typed `fields` — each section component knows its own shape, so the cast happens once
  here (with this documented justification) instead of scattering `as unknown as` across
  components.

## Testing (`src/test/`)

- **`registry.test.tsx`**: the expected-section-types list is a contract check (content-model
  spec §11) — every section content-type id that can appear in `Page.sections` must have a
  renderer, or the page silently drops it. Keep this list in sync with the `Page.sections`
  whitelist enforced in the Contentful migrations.
- **`setup.ts`**: `next/image` is mocked to render a plain `<img>` in jsdom so component tests
  can assert on it — forwarding only the props tests actually check
  (`className`/`style`/`sizes`/`loading`) and dropping `next/image`-only props that would warn
  as invalid DOM attributes (`fill`/`priority`/`fetchPriority`). The mock needs an explicit
  `__esModule: true` flag: Jest's CommonJS interop reads that flag to unwrap `.default`
  correctly for an `import Image from "next/image"` consumer — without it, the component
  receives the whole mock module object instead of the function itself (this broke 5 tests
  during the Vitest → Jest migration until the flag was added).

## Logging (`src/lib/logger/log.ts`)

The logger is a placeholder: `logger.error` (and any sibling methods) currently do nothing.
The call sites (e.g. `SectionRenderer`'s unknown-section-type path) are wired in for when a
backend logging API is provided — per [project-coding-standards] §5, no `console.*` output is
permitted at this stage, including through a logging wrapper.
