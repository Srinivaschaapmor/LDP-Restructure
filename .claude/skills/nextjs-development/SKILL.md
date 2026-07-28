---
name: nextjs-development
description: Next.js App Router conventions for this project — project layout, CMS-driven routing, the section registry, rendering strategy, and install/tooling gotchas. Use when scaffolding the app, adding routes, wiring data fetching, or building the dynamic page renderer.
---

# Next.js Development (App Router)

## 1. Use the `src/` layout from the start — one folder per concern, no exceptions
Application code goes under **`src/`**; config, `contentful/`, `docs/`, `public/`, and `.env` stay
at the repo root. Set the alias `"@/*": ["./src/*"]` in `tsconfig.json`.
*(Don't default to root `app/` — moving later is churn.)*

```
src/
├─ app/            # routes only (page.tsx, layout.tsx, not-found.tsx)
├─ components/
│  ├─ layout/       # page chrome: Header, Footer, DesktopMenu, MenuDrawer, Breadcrumbs
│  ├─ ui/           # small reusable building blocks: Heading, MediaImg, RichText, DocumentLink
│  └─ sections/     # one file per content-type-id section (Banner, Accordion, …) + registry.tsx
├─ types/           # EVERY type in the project, no exceptions — rule 8
├─ lib/             # non-component logic: contentful.ts, constants.ts, log.ts
└─ __tests__/       # EVERY test file, mirroring the src/ path it tests — rule 9
```
Generic folder names only — never name a folder after implementation detail or house style
(e.g. not `chrome`, not `primitives`); `layout`/`ui`/`sections` read the same to any new
contributor regardless of which project they came from.

## 2. One catch-all route renders every CMS page
`src/app/[locale]/[[...slug]]/page.tsx` (optional catch-all matches `/` too):
- Resolve the **full-path** slug (`"/" + slug.join("/")`), fetch the `Page`, `notFound()` on miss.
- `generateStaticParams` (from all page slugs) + `export const revalidate` = **SSG + ISR**.
- `generateMetadata` reads the `Meta` reference.
- Reserve SSR (no `generateStaticParams`) for authenticated/dynamic pages only.

## 3. Dynamic section registry
Render page bodies via a registry keyed by **`contentType.sys.id`** → React component. Unknown
type → render `null` + `console.error` (never crash the page). Adding a section = one registry line.
A build/CI test should assert every content-type id and every variant enum value has a renderer.

## 4. Match `params` sync/async to the Next version
- **Next 14**: `params` is a plain object — read directly.
- **Next 15+**: `params`/`searchParams` are Promises — `await params`.
Check the installed major before writing the route, or it fails at runtime.

## 5. Server vs client components
Server Components by default. Add `"use client"` only for interactivity (e.g. a hamburger
toggle, form state). Client components receive **serializable** props — passing resolved
Contentful `fields` objects is fine.

## 6. Install / tooling gotcha
If `npm install` aborts on a dependency's `patch-package` postinstall
(`'patch-package' is not recognized`), reinstall with **`npm install --ignore-scripts`**
(safe for pure-JS deps).

## 7. Icons are Contentful assets — never hand-drawn SVG/JSX in code
No inline `<svg>` icon markup, and no hardcoded SVG-path lookup tables (e.g. keyed by
`internalName`), anywhere in a component. An icon is always a **Media** reference resolved from
Contentful and rendered via `MediaImg`/`next/image` — the same way `Link.icon` already works.
*(Real bug this fixed: `Footer.tsx` had a hardcoded `SOCIAL` SVG-path map keyed by
`link.internalName`, completely ignoring the already-modeled `Link.icon` field — always prefer
the existing content-model field over inventing a code-side lookup.)* For icons that have no
natural per-entry home (e.g. a hamburger toggle that isn't "content"), extend the owning chrome
entry (`header`, `footer`) with an icon field — never fall back to inline SVG. See
[contentful-development] for the field/upload pattern; **stop and ask** before adding new icon
fields to a content type, since it changes the model everyone shares.

## 8. All types live in `src/types/`, never inline in a component
No `interface FooFields { ... }` inside a component file — every type (CMS field shapes,
UI-only shapes) is defined in `src/types/` and imported via `import type { X } from "@/types"`.
Organize by category (`content.ts` = CMS primitives, `sections.ts` = per-section field shapes,
`ui.ts` = non-CMS shapes), barrel-exported from `src/types/index.ts`. One file per component
importing its own private type defeats the purpose — a new contributor must be able to find
every shape in one place.

## 9. All tests AND test config live in `src/__tests__/` — one folder, no second one
`Foo.test.tsx` is never colocated with `Foo.tsx`. It lives at
`src/__tests__/<same-relative-path>/Foo.test.tsx`. Vitest's `include: ["src/**/*.test.{ts,tsx}"]`
already discovers tests anywhere under `src/`, so this is a pure organization convention, not a
config requirement — keep it anyway so the whole suite is browsable from one directory.
**Test setup/config lives in `src/__tests__/setup.ts` too** (referenced by
`vitest.config.ts`'s `setupFiles`) — don't create a second, differently-named test-related
folder (e.g. a bare `src/test/`); that's confusing to have alongside `__tests__/` and defeats
"one folder for tests."

See also: [contentful-development] (data layer), [coding-standards], [sonarqube-compliance]
(`window`→`globalThis` SSR safety, hooks before early returns).
