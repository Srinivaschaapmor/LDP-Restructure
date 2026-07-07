---
name: nextjs-development
description: Next.js App Router conventions for this project — project layout, CMS-driven routing, the section registry, rendering strategy, and install/tooling gotchas. Use when scaffolding the app, adding routes, wiring data fetching, or building the dynamic page renderer.
---

# Next.js Development (App Router)

## 1. Use the `src/` layout from the start
Application code goes under **`src/`** (`src/app`, `src/components`, `src/lib`); config,
`contentful/`, `docs/`, `public/`, and `.env` stay at the repo root. Set the alias
`"@/*": ["./src/*"]` in `tsconfig.json`. *(Don't default to root `app/` — moving later is churn.)*

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

See also: [contentful-development] (data layer), [coding-standards], [sonarqube-compliance]
(`window`→`globalThis` SSR safety, hooks before early returns).
