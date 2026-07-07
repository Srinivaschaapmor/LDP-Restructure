---
name: seo
description: Technical SEO practices for Next.js pages. Use when creating routes, metadata, links, images, or structured data. Complements siteimprove-compliance's SEO issue list.
---

# SEO (Technical)

## Metadata (Next.js App Router)
- Use the `metadata` export / `generateMetadata` for every route.
- Exactly one non-empty, unique `<title>` (correct length) and one meta description per page.
- Add Open Graph + Twitter tags; add JSON-LD structured data where relevant.
- Set `canonical` URLs; use `noindex`/`nofollow` intentionally, never by accident.

## Headings & content
- One non-empty `<h1>` per page; logical heading hierarchy.
- Sufficient, readable content; reasonable sentence length; healthy text-to-code ratio.

## Crawlability
- `robots.txt` present and correct; XML sitemap generated and pages included in it.
- Avoid orphan/dead-end pages; keep navigation depth ≤ 5.

## Links & status codes
- No broken links; correct 404 status (not soft-200); no 500s.
- Avoid redirect chains and mixed HTTP/HTTPS redirects; prefer direct links.
- Don't link to unsafe domains or HTTP content; serve everything over HTTPS.

## Images & performance
- `alt`, `width`, `height` on every image; each < 1 MB; use `next/image`.
- Enable GZIP/Brotli; keep HTML < 1 MB; strong mobile & desktop speed (Core Web Vitals).
- Mobile viewport meta + mobile-friendly, touch-ready layout.

## URL hygiene
- Lowercase, hyphenated (no underscores), no raw dynamic params, not overly long.

## Freshness
- Keep pages and media updated; stale-content flags hurt ranking.
