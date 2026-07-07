---
name: siteimprove-compliance
description: Prevent the 165 SiteImprove issues this project tracks across Accessibility, SEO, and Quality Assurance. Use when building pages, markup, links, images, forms, metadata, or content so scanned issues never appear.
---

# SiteImprove Compliance

SiteImprove scans production for issues in three modules. Prevent them at author time.
This skill is the **prevention checklist**; deep guidance lives in [accessibility] and [seo].

## Accessibility module (WCAG-aligned)
**Text alternatives** — every image, image-button, `<object>`, vector/SVG, `<iframe>`, and
menu item needs a meaningful `alt`/accessible name; decorative images use `alt=""` (and are
NOT exposed to AT). File names are never valid alt text.

**Media** — `<video>` needs captions (`<track kind="captions">`) and audio-description;
audio needs a transcript; video-with-audio needs an accessible alternative. No auto-playing
audio without an off switch.

**Structure & headings** — page starts with a single `<h1>`; headings are structured
(no skipped levels), descriptive, and non-empty; content follows its heading.

**ARIA** — only valid roles; required ARIA attributes present; valid states/properties;
roles used in the required context; no unsupported/prohibited attributes.

**Forms** — every field has a label; grouped controls have an accessible name; input errors
are announced in full; autocomplete works.

**Keyboard & focus** — visible focus indicator; no focusable content inside hidden elements;
scrollable regions reachable by keyboard.

**Text & readability** — respect minimum line-height, letter-spacing, word-spacing; don't
fix font-size/line-height; avoid all-caps and italics overuse; adequate contrast (min + enhanced).

**Page-level** — descriptive `<title>`; `lang` set and valid; orientation not locked; zoom
not restricted; landmarks/regions named; a working "skip to main content" link; no
deprecated/obsolete HTML; no unexpected refresh/redirect.

**Tables** — header cells have header role; headers referenced correctly; cells have context.

**Touch targets** — meet minimum size and spacing (and enhanced where required).

## SEO module
**Meta** — exactly one non-empty `<title>` per page, unique, correct length; one meta
description, unique, correct length; no duplicates/multiples.

**Headings** — one non-empty `<h1>`; no missing/empty/multiple H1.

**Crawlability** — `robots.txt` present; sitemap present and pages included; correct use of
`noindex`/`nofollow`; canonical URLs; Open Graph + structured data present.

**Links & status** — no broken links (any level); correct 404 (not soft-200); no 500s; avoid
redirect chains / mixed redirect chains; no links to unsafe domains or HTTP content.

**Images** — `alt` present and non-empty; `width`/`height` set; each image < 1 MB.

**Performance/health** — GZIP enabled; HTML < 1 MB; good mobile & desktop speed; mobile
viewport + mobile-friendly; nav depth ≤ 5; not too many internal links; healthy
text-to-code ratio.

**URLs** — no underscores, no raw dynamic params, not too long.

**Freshness & readability** — content/media updated within a year; reasonable sentence length
and reading ease.

## Quality Assurance module
- No broken links at any page level; no links to unsafe domains.
- No misspellings (homepage and overall).
- No images > 1 MB.
- No publicly exposed personal ID numbers.
- Documents only in PDF/XML formats; keep documents/media updated.
- Avoid overly long sentences / hard-to-read pages.

## Author-time checklist (per page)
- [ ] Single descriptive H1; logical heading order; page `<title>` + meta description
- [ ] All images: alt + dimensions + < 1 MB
- [ ] All links resolve; no HTTP/unsafe targets; no redirect chains
- [ ] Forms labelled; focus visible; contrast passes
- [ ] Media has captions/transcripts; no autoplay audio
- [ ] No misspellings; no exposed PII
