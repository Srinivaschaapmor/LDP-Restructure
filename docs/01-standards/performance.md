# Performance Standards (interim)

> **Status:** interim single source of truth. There is no `performance-optimization` skill
> yet (planned in skills batch 2). When that skill lands, it becomes canonical and this file
> is reduced to a pointer. Until then, **these rules apply to every change.**

## Targets (Core Web Vitals, field/p75)
| Metric | Budget |
|---|---|
| Largest Contentful Paint (LCP) | ≤ 2.5 s |
| Interaction to Next Paint (INP) | ≤ 200 ms |
| Cumulative Layout Shift (CLS) | ≤ 0.1 |
| Total Blocking Time (lab) | ≤ 200 ms |

A change must not regress these. Measure with Lighthouse (lab) and treat field data as truth.

## Rules (Next.js App Router + Bootstrap 5)
1. **Server Components by default.** Add `"use client"` only when interactivity requires it;
   keep client bundles small and pushed to the leaves of the tree.
2. **Images via `next/image`** — always set `width`/`height` (or `fill` + sized container) to
   reserve space and prevent CLS. Serve modern formats; lazy-load below-the-fold; mark the LCP
   image `priority`.
3. **Fonts via `next/font`** — self-host, subset, and reserve metrics to avoid layout shift and
   render-blocking font requests.
4. **No layout shift.** Reserve space for images, embeds, and async content. No content that
   pushes the page down after paint.
5. **Code-split** heavy/rarely-used client code with `next/dynamic`; avoid shipping large libs
   to first load. Watch the route's first-load JS budget.
6. **Data fetching** — fetch on the server; cache and revalidate deliberately (ISR/route cache).
   Never waterfall requests that can run in parallel.
7. **Ship only the CSS you use.** With Bootstrap 5 + SCSS, import only the needed components
   rather than the full bundle; purge/avoid dead styles.
8. **Third-party scripts** load via `next/script` with the correct strategy (`lazyOnload` /
   `afterInteractive`); none block first paint.

## Self-check before finishing
- [ ] LCP image is `priority` and correctly sized; no other image lacks dimensions
- [ ] No new render-blocking fonts/scripts
- [ ] New client component is justified (couldn't be a Server Component)
- [ ] Route first-load JS didn't jump; heavy deps dynamically imported
- [ ] No layout shift introduced (CLS check)

## See also
`sonarqube-compliance` (`window` → `globalThis` SSR safety), `seo` (metadata/rendering),
`accessibility` (motion/repaint), and — once created — the `performance-optimization` skill.
