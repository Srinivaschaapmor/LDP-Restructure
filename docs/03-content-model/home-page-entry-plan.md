# Home page — Contentful entry plan

Complete inventory of the entries required to author the Home page, with **verbatim copy pulled
from Figma** (`4UxJeqzAVXcc2mtlwkTQKO`, section `30:382`).

- **Design analysis:** Phase 1 (figma-design-analyst), section `30:382`
- **Content model analysis:** Phase 2 (content-model-analyst) — zero new content types
- **Status:** ⛔ Not yet approved. Nothing here has been created in Contentful.
- **Blocked on:** migration `020` (7 new fields) must run before the fields marked 🆕 exist.

Naming follows `section-model-spec.md` §3: `‹scope›-‹type›-‹name›`, `global-*` for cross-page
reuse, `page-*` for single-page use.

**Totals:** 15 assets · 66 entries (15 `media`, 12 `richTextItem`, 11 `link`, 6 `button`,
13 `card`, 4 `cardCollection`, 3 `mediaContentBlock`, 1 `banner`, 1 `page`).

---

## 0. Assets to upload first

`contentful/seed/upload-assets.mjs` is the established pattern. Export from Figma at 2× and
run WebP conversion per the asset pipeline. **Do not** place these in `/public`.

| # | Asset | Figma node | Type | Notes |
|---|---|---|---|---|
| A1 | Hero background | `30:458` | PNG→WebP | Full-bleed, 1600×644 desktop crop |
| A2 | Provider photo | `30:526` | PNG→WebP | 555×568, flipped in design — export unflipped |
| A3 | Broker photo | `30:528` | PNG→WebP | 703×605, rotated 180° + mirrored in design |
| A4 | Phone app mockup | `30:638` | PNG→WebP | 426×449 |
| A5 | AICPA SOC 2 logo | `30:665` | PNG | 120×120 |
| A6 | NCQA logo | `30:668` | PNG | 120×120 |
| A7 | HITRUST logo | `30:671` | PNG | 120×59 |
| A8 | URAC accreditation seal | `30:675` | PNG | 120×115.86 |
| A9 | App Store badge | `30:644` | SVG | 172×57 |
| A10 | Google Play badge | `30:651` | SVG | 171×57 |
| A11 | Icon — no deductibles | `30:479` | SVG | 42×42 |
| A12 | Icon — no waiting period | `30:484` | SVG | 42×42 |
| A13 | Icon — emergency coverage | `30:493` | SVG | 42×42 |
| A14 | Icon — clock | `30:610` | SVG | 64×64 |
| A15 | Icon — eye | `30:617` | SVG | 64×64 |
| A16 | Icon — calendar | `30:627` | SVG | 64×64 |

> Figma asset URLs expire in ~7 days — export at build time, not in advance.
> The check-mark bullet glyph (`30:510`) and all chevron/search/globe/user icons are **inline
> SVG in code**, not assets. The phone mockup's login form is part of the raster image (A4).

**`media` entries** — one per asset above, `internalName: global-media-‹name›`,
`altText` **required**. Alt text below is a proposal; confirm with the content team.

| Entry | Asset | `altText` |
|---|---|---|
| `global-media-home-hero` | A1 | *(decorative background — see open question Q7)* |
| `global-media-provider-clinician` | A2 | "Smiling dentist holding a clipboard" |
| `global-media-broker-meeting` | A3 | "Broker meeting with a client" |
| `global-media-app-mockup` | A4 | "Liberty Dental Plan mobile app shown on a phone" |
| `global-media-logo-soc2` | A5 | "AICPA SOC 2 certified" |
| `global-media-logo-ncqa` | A6 | "NCQA accredited" |
| `global-media-logo-hitrust` | A7 | "HITRUST certified" |
| `global-media-logo-urac` | A8 | "URAC accredited" |
| `global-media-badge-appstore` | A9 | "Download on the App Store" |
| `global-media-badge-googleplay` | A10 | "Get it on Google Play" |
| `global-media-icon-no-deductibles` | A11 | "" (decorative — paired with visible label) |
| `global-media-icon-no-waiting-period` | A12 | "" |
| `global-media-icon-emergency-coverage` | A13 | "" |
| `global-media-icon-clock` | A14 | "" |
| `global-media-icon-eye` | A15 | "" |
| `global-media-icon-calendar` | A16 | "" |

---

## 1. Hero — `banner`

**`page-home-hero`** (node `30:458`)

| Field | Value |
|---|---|
| `internalName` | `page-home-hero` |
| `heading` | `Making members shine, one smile at a time` |
| `subheading` | → `page-home-hero-sub` |
| `backgroundImage` | → `global-media-home-hero` |
| `cta` | → `global-button-get-started` |
| `variant` | `image` |
| `overlay` | 🆕 `flat` *(migration 020 · field G)* |
| `overlayColor` | ⚠️ see Q1 — the design is `rgba(15,16,66,0.2)` and the field has no alpha channel |

The line break after "shine," is a soft wrap in Figma, not a hard break — the H1 is one string.
The **™** (`30:465`) is positioned absolutely after "shine" — see Q2.

**`page-home-hero-sub`** (`richTextItem`, node `30:462`)

> Are you a Liberty Dental Plan member?
> Explore helpful resources to get the most from your plan.

*(Two lines separated by a `<br>` in Figma. Model as a single paragraph unless the break is
load-bearing — see Q3.)*

**`global-button-get-started`** (`button`, node `30:463`) → label `Get started`,
`variant: primary`, `link` → `global-link-get-started` (href **TBD**)

---

## 2. Individual and family dental plans — `cardCollection`

**`page-home-individual-family`** (node `30:468`)

| Field | Value |
|---|---|
| `internalName` | `page-home-individual-family` |
| `heading` | `Individual and family dental plans` |
| `intro` | → `page-home-individual-family-intro` |
| `layout` | 🆕 `chips` *(migration 020 · field E)* |
| `cards` | → the 3 chip cards below |
| `cta` | 🆕 → `global-button-shop-plans` *(migration 020 · field B)* |

**`page-home-individual-family-intro`** (`richTextItem`, node `30:476`)

> Liberty helps you find a covered dentist near you. You also get valuable benefits like:

**Chip cards** (`card`) — title only, icon in `media`:

| Entry | `title` | `media` | Node |
|---|---|---|---|
| `global-card-benefit-no-deductibles` | `No deductibles` | `global-media-icon-no-deductibles` | `30:482` |
| `global-card-benefit-no-waiting-period` | `No waiting period` | `global-media-icon-no-waiting-period` | `30:491` |
| `global-card-benefit-emergency-coverage` | `Emergency coverage` | `global-media-icon-emergency-coverage` | `30:500` |

**`global-button-shop-plans`** (`button`, node `30:501`) → label `Shop plans`,
`variant: primary`, `link` → `global-link-shop-plans` (href **TBD**)

---

## 3. Become a Liberty provider — `mediaContentBlock`

**`page-home-provider`** (node `30:503`)

| Field | Value |
|---|---|
| `internalName` | `page-home-provider` |
| `heading` | `Become a Liberty provider` |
| `body` | → `page-home-provider-body` |
| `bullets` | → `page-home-provider-bullets` |
| `media` | → `global-media-provider-clinician` |
| `mediaPlacement` | `right` |
| `tone` | `subtle` — ⚠️ design bg is `rgba(114,172,194,0.2)`, see Q4 |
| `ctas` | `[global-button-join-network]` — **field already exists**, unwired in the frontend |

**`page-home-provider-body`** (`richTextItem`, node `30:507`)

> Join our network and see how we make your business easier.

**`page-home-provider-bullets`** (`richTextItem`, unordered list — nodes `30:513/518/523`)

- Efficient claims processing
- Engaged Provider Relations representatives
- Easy-to-use Provider Portal

**`global-button-join-network`** (`button`, node `30:524`) → label `Join our network`,
`variant: primary`, `link` → `global-link-join-network` (href **TBD**)

---

## 4. Become a Liberty broker — `mediaContentBlock`

**`page-home-broker`** (node `30:527`)

| Field | Value |
|---|---|
| `internalName` | `page-home-broker` |
| `heading` | `Become a Liberty broker` |
| `body` | → `page-home-broker-body` |
| `bullets` | → `page-home-broker-bullets` |
| `media` | → `global-media-broker-meeting` |
| `mediaPlacement` | `left` |
| `tone` | `brand` (solid `#3352A3`) |
| `ctas` | `[global-button-get-quote]` |

**`page-home-broker-body`** (`richTextItem`, node `30:533`)

> Give your clients access to the quality dental benefits they need.

**`page-home-broker-bullets`** (`richTextItem`, unordered list — nodes `30:539/544/549/554`)

- Network of more than 5,000 dentists
- Competitive offerings
- Low costs
- Easy member experience

**`global-button-get-quote`** (`button`, node `30:555`) → label `Get a quote`,
`variant: secondary` (white on brand), `link` → `global-link-get-quote` (href **TBD**)

---

## 5. Liberty news — `cardCollection`

**`page-home-news`** (node `30:557`)

| Field | Value |
|---|---|
| `internalName` | `page-home-news` |
| `heading` | `Liberty news` |
| `intro` | → `page-home-news-intro` |
| `layout` | `grid-3` — ⚠️ or `carousel`, see Q5 |
| `cards` | the 3 news cards below |
| `cta` | 🆕 → `global-button-more-news` |

**`page-home-news-intro`** (`richTextItem`, node `30:563`) → `See the latest updates.`

**News cards** (`card`) — `date` is 🆕 *(migration 020 · field A)*; "Read more" uses the
**existing** `links` field, so it needs no migration.

| Entry | `date` | `title` | Node |
|---|---|---|---|
| `global-card-news-tcu-lightning-complex-fires` | `2025-09-02` | Liberty Dental Plan Creates a Dedicated Toll-Free Number for the State of Emergency Proclamation for the TCU Lightning Complex Fires | `30:572` |
| `global-card-news-2025-late-march-winter-storms` | `2025-07-29` | Liberty Dental Plan Creates a Dedicated Toll-Free Number for the State of Emergency Proclamation for the 2025 Late March Winter Storms | `30:582` |
| `global-card-news-2025-february-storms` | `2025-07-29` | Liberty Dental Plan Creates a Dedicated Toll-Free Number for the State of Emergency Proclamation for the 2025 February Storms Issued | `30:592` |

Each card's `links[0]` → a `link` entry with label `Read more` and href **TBD** (the article
URLs do not exist yet — see Q6).

**`global-button-more-news`** (`button`, node `30:602`) → label `More news`,
`variant: tertiary` (outline), `link` → `global-link-more-news` (href **TBD**)

> Dates render as `MM/DD/YYYY` in the design. Store as ISO `dateonly`; format in code.
> Note cards 2 and 3 share the same date (`07/29/2025`) — confirm that is correct, not a
> copy-paste artifact in the design.

---

## 6. Teledentistry — `cardCollection`

**`page-home-teledentistry`** (node `30:604`)

| Field | Value |
|---|---|
| `internalName` | `page-home-teledentistry` |
| `heading` | `Virtual dental care and emergency dental services with teledentistry` |
| `intro` | → `page-home-teledentistry-intro` |
| `layout` | `grid-3` |
| `tone` | 🆕 `brand` *(migration 020 · field C)* |
| `cards` | the 3 cards below |
| `cta` | 🆕 → `global-button-schedule-now` |

**`page-home-teledentistry-intro`** (`richTextItem`, node `30:607`)

> Liberty members can consult with a dentist at no cost from a computer or mobile device.

**Cards** (`card`):

| Entry | `title` | `body` | `media` | Node |
|---|---|---|---|---|
| `global-card-teledentistry-247-access` | `24/7 access` | Get virtual dental care whenever you need it. | icon-clock | `30:609` |
| `global-card-teledentistry-anywhere` | `Anywhere` | Consult with a dentist while traveling or from the comfort of your home. | icon-eye | `30:616` |
| `global-card-teledentistry-flexible` | `Flexible` | No need to take time off work. | icon-calendar | `30:626` |

> The "24/7 access" body (`30:615`) begins with a stray **tab character** in Figma. Strip it.

Each `body` is its own `richTextItem`: `page-home-teledentistry-card-{1,2,3}-body`.

**`global-button-schedule-now`** (`button`, node `30:633`) → label `Schedule now`,
`variant: tertiary` (white outline on brand), `link` → `global-link-schedule-now` (href **TBD**)

---

## 7. Manage your plan on the go — `mediaContentBlock`

**`page-home-mobile-app`** (node `30:635`)

| Field | Value |
|---|---|
| `internalName` | `page-home-mobile-app` |
| `heading` | `Manage your plan on the go` |
| `body` | → `page-home-mobile-app-body` |
| `media` | → `global-media-app-mockup` |
| `mediaPlacement` | `left` |
| `tone` | 🆕 `brandSubtle` — ⚠️ pending Q4 |
| `links` | 🆕 `[global-link-appstore, global-link-googleplay]` *(migration 020 · field F)* |

**`page-home-mobile-app-body`** (`richTextItem`, node `30:642`) → `Download our mobile app.`

**Store badge links** (`link`) — image links, using the existing `link.icon → media`:

| Entry | `label` | `icon` | `href` |
|---|---|---|---|
| `global-link-appstore` | `Download on the App Store` | `global-media-badge-appstore` | **TBD** |
| `global-link-googleplay` | `Get it on Google Play` | `global-media-badge-googleplay` | **TBD** |

---

## 8. Accreditations — `cardCollection`

**`page-home-accreditations`** (node `30:660`)

| Field | Value |
|---|---|
| `internalName` | `page-home-accreditations` |
| `heading` | `Liberty Dental Plan is accredited and certified by` |
| `layout` | `grid-4` |
| `cards` | the 4 logo cards below |

*(No `intro`, no `cta`. Heading has trailing whitespace in Figma — trim it.)*

**Logo cards** (`card`) — `media` only:

| Entry | `media` | Node |
|---|---|---|
| `global-card-accreditation-soc2` | `global-media-logo-soc2` | `30:663` |
| `global-card-accreditation-ncqa` | `global-media-logo-ncqa` | `30:666` |
| `global-card-accreditation-hitrust` | `global-media-logo-hitrust` | `30:669` |
| `global-card-accreditation-urac` | `global-media-logo-urac` | `30:672` |

> Each card contains a hidden text layer reading "Schedule Your Service" (`30:664/667/670/673`).
> Confirmed design debris — **do not model**. If the logos should link out, `card.links`
> already exists and needs no migration.

---

## 9. Page entry

**`page-home`** (`page`)

| Field | Value |
|---|---|
| `internalName` | `page-home` |
| `title` | `Home` |
| `slug` | `/` (valid against the `^/.*$` regex from migration 001) |
| `sections` | ordered: hero → individual-family → provider → broker → news → teledentistry → mobile-app → accreditations |
| `header` | → existing `global-header-main` |
| `footer` | → existing `global-footer-main` |
| `primaryNav` | → existing navigation menu |
| `meta` | → **new** `page-home-meta` (title/description **TBD** — not in the design) |

---

## 10. Existing chrome — verify against Figma, do not recreate

Header, footer and navigation are already seeded. The Figma copy below is what they **must**
match; treat any difference as a content bug to fix, not a new entry.

**Utility bar** — `English` (globe icon) · `Secure Documents` ⚠️ `opacity: 0` in the design,
see Q8 · `Login` (user icon)
**Login dropdown** (`30:384`) — `Member` · `Group` · `Office or vendor`
**Language dropdown** (`30:391`) — `English` · `Spanish`
**Primary nav** (`30:437`) — `Members` · `Providers` · `Brokers` · `About us`
**Search** (`30:447`) — placeholder `Search` *(currently the static `UI_TEXT.searchPlaceholder`)*
**Header CTA** (`30:451`) — `Find a dentist`

**Footer** (`30:1669`):

| Column | Links |
|---|---|
| `Explore` | Members · Providers · Brokers |
| `Helpful links` | Find a dentist · Member login · File grievance or appeal |
| `About us` | About Liberty · Careers · Compliance · Interoperability API · Trust center · Prior auth reporting · Contact us |

- Back to top: `Back to top`
- Copyright: `© 2026 Liberty Dental Plan. All Rights Reserved.` ⚠️ the **mobile** footer reads
  © 2025 — one is stale
- Legal links: `Sitemap` · `Privacy notice` · `Nondiscrimination and language assistance`

---

## 11. Not covered by any entry above

**External-link interstitial modal** (`30:396`) — real editorial copy with no home in the model:

> **Leaving Liberty Dental plan.com**
> You are being redirected to an external website.

Two buttons (`30:407`, `30:409`) whose labels could not be read from the design — likely
"Continue" / "Cancel", **unconfirmed**. Phase 2 flagged this as needing a modeling decision
(a `richTextItem` + two `button`s on `footer`, or a small global `interstitial` type).
No modal primitive exists in `src/components/` today either.

---

## 12. Open questions blocking authoring

| # | Question | Blocks |
|---|---|---|
| Q1 | Hero scrim is `rgba(15,16,66,0.2)`; `overlayColor` is a 6-digit hex with no alpha. Token in code, or a new `overlayOpacity` field? | hero |
| Q2 | Is the ™ part of the `heading` string, or rendered separately? Rule 10 blocks rich text in headings. | hero |
| Q3 | Is the hero subcopy line break load-bearing, or a soft wrap? | hero |
| Q4 | Three band tints in the design (`rgba(114,172,194,0.2)`, `#3352A3`, `rgba(51,82,163,0.1)`) but a 4-value `tone` enum. Add `brandSubtle`, or is one tint design drift? | provider, app |
| Q5 | Liberty news: 3/2/1 cards per breakpoint with a hidden prev/next pair. Carousel (no new field) or truncating grid (needs `itemLimit`)? | news |
| Q6 | News article URLs don't exist — no `article`/`news` content type in the space. Cards now and migrate later, or model articles first? | news |
| Q7 | Hero image alt text — decorative, or does it need a description? | hero |
| Q8 | "Secure Documents" is `opacity: 0`. Ship behind a flag, or out of scope? | header |
| Q9 | Modal button labels unreadable from the design; modal has no content type. | modal |
| Q10 | Page meta title/description are not in the design. | page |
| Q11 | Every CTA href is **TBD** — 11 `link` entries need real URLs. | all sections |

---

**Nothing here has been created in Contentful.** There is no live Contentful connection
(ADR-0009); entries are created by seed scripts under `contentful/seed/`, which is a human step
after CMS approval. Migration `020` must run first — the fields marked 🆕 do not exist yet.
