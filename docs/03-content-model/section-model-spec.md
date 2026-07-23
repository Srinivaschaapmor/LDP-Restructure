# Dynamic Reusable Section Model — Content-Model Spec

> **Status:** Content-Modeling phase draft. This is the blueprint for the reusable-section
> architecture agreed after the [architecture review](./contentful-architecture-review.md).
> It defines every section type, its fields, variant options, reuse rules, and the
> Page → sections whitelist. Source of truth for the eventual Contentful migration scripts.

## 1. Principles
1. **Everything on a page body is a "section."** A `Page` holds an **ordered list of section
   references**; array order = render order.
2. **Sections are standalone entries** — not owned by a page — so any section can be referenced
   by (reused on) multiple pages. Edit once → updates everywhere it is referenced.
3. **Variation is expressed through controlled variant options** (enums bound to the design
   system), never by creating a new content type per look.
4. **Presentation is constrained, not free.** No colour pickers or arbitrary widths — only
   design-system-bound enums, so a reused section renders consistently everywhere.
5. **Every reference slot is whitelisted.** A section can go anywhere *valid*, not literally anywhere.
6. **The frontend renders dynamically** via a component registry keyed by content-type ID;
   unknown types fail gracefully (render nothing + log).

## 2. Layers
```
Primitives      Media · Link · Button · Meta · ContactInformation        (referenced everywhere)
Framework       Page · Header · Footer                                   (route + chrome)
Sections (~12)  Banner · MediaContentBlock · CardCollection · RichTextBlock · Accordion
                Tabs · Form · Embed · ContactSection · NotificationBanner · LayoutGroup
Item types      Card · AccordionItem · FormField · Tab                   (only inside a section)
```
`LayoutGroup` is itself a section that arranges **child sections** side-by-side (columns/grid) —
this is how we get multi-column layouts without a mandatory wrapper on every page, and how
"split" layouts (e.g. `SplitContentBlocks`, `BrushSection`) are expressed.

## 3. Reuse & naming rules
- Every entry has an **`internalName`** (Entry Key) used as the entry title and for search/reuse.
- **Naming convention:** `‹scope›-‹type›-‹name›`
  - `global-…` → intended for reuse across pages (edits propagate; check "where used" first).
  - `page-…` → used by a single page.
  - e.g. `global-banner-member-cta`, `page-oralhealth-tips-media`.
- **Per-placement differences** → set variant options on the section. **Never clone a type.**
- Contentful's incoming-references panel is the "where used" guard editors must check before
  editing a `global-*` entry.

## 4. Shared variant enums (design-system bound)
Each value MUST map to a design-system variant; a build test asserts every value has a renderer.

| Enum | Values |
|---|---|
| `tone` | `default` · `subtle` · `brand` · `inverse` |
| `spacing` | `none` · `sm` · `md` · `lg` |
| `mediaPlacement` | `left` · `right` · `top` · `background` |
| `collectionLayout` | `grid-2` · `grid-3` · `grid-4` · `list` · `carousel` · `split` |
| `buttonVariant` | `primary` · `secondary` · `tertiary` · `ghost` |
| `contentWidth` | `narrow` · `default` · `wide` · `full` |

## 5. Primitives

**Media** (replaces `GraphicAsset`)
| Field | Type | Notes |
|---|---|---|
| internalName | Short Text | required, entry title |
| asset | Media (Asset) | required |
| altText | Short Text | required (a11y) |
| ariaLabel | Short Text | optional |
| width / height | Number | for CLS-safe sizing |
| externalUrl | Short Text (URL) | optional (external image/doc) |

**Link**
| internalName | Short Text | required |
| label | Short Text | required |
| href | Short Text (URL) | required |
| isExternal | Boolean | controls `target`/`rel` |
| icon | Ref → Media | optional |

**Button**
| internalName | Short Text | required |
| label | Short Text | required |
| link | Ref → Link | required |
| variant | Enum `buttonVariant` | required |

**Meta** (SEO)
| title | Short Text | validation: 40–75 chars |
| description | Long Text | validation: 110–160 chars |
| keywords | Short Text | optional |
| ogImage | Ref → Media | optional |
| canonicalUrl | Short Text (URL) | optional |
| noindex | Boolean | default false |

**ContactInformation** (replaces CommunicationChannels / Icon Text / Contact column / Contact Address)
| type | Enum: `phone`·`email`·`fax`·`address` | required |
| label | Short Text | e.g. "Member services" |
| value | Short Text | phone/email/etc. |
| richValue | Rich Text | optional (multi-line address) |
| icon | Ref → Media | optional |

## 6. Framework

**Page**
| Field | Type | Notes |
|---|---|---|
| internalName | Short Text | required |
| slug | Short Text | **full path**, e.g. `/members/oral-health-education/everyday-oral-health`; unique per locale; regex-validated |
| title | Short Text | H1 default |
| meta | Ref → Meta | required |
| header | Ref → Header | required |
| footer | Ref → Footer | required |
| breadcrumbsOverride | Ref → Link (many) | optional; breadcrumbs are **auto-derived from the slug path** unless overridden |
| sections | **Ref (many) → [whitelisted sections]** | ordered page body (see §8) |

`Header` / `Footer` keep their current composition (logo, nav links, utility bar, social) but
reuse the primitives above; they are page chrome, referenced by every `Page`.

## 7. Section catalog (~12)

> Each maps one Contentful type → one frontend component. "Covers" = old types it replaces.

### 7.1 Banner
Hero/banner. **Covers:** `Banner`.
| heading | Short Text | required |
| subheading | Rich Text | optional |
| backgroundImage | Ref → Media | optional |
| logo | Ref → Media | optional |
| cta | Ref → Button | optional |
| variant | Enum: `image`·`gradient`·`plain` | |
| height | Enum: `sm`·`md`·`lg` | |

### 7.2 MediaContentBlock
Image/icon + copy + optional CTA. **Covers:** ImageWithContent, BackgroundImageWithContent,
ImageDescriptionCard, IconWithContentCard, ImageWithContentCTA, ImageWithCTACard,
InfoContentCard, ContentWithPDFCard, ContentWithBackgroundColor, generic `Content`, TeleDentistry.
| eyebrow | Short Text | optional |
| heading | Short Text | optional |
| body | Rich Text | optional (embed links/assets inline) |
| bullets | Rich Text | optional |
| media | Ref → Media | optional |
| ctas | Ref (many) → Button | optional |
| mediaPlacement | Enum `mediaPlacement` | |
| tone | Enum `tone` | replaces background-colour picker |

### 7.3 CardCollection (+ Card)
Grid/list/carousel of cards. **Covers:** CardsCollection, BaseCardComponent, BrushCard/BrushSection,
LeadershipCard (+Person), NewsArticles/Collection, PdfLinkCollection (card variant), Accrediations.
| heading | Short Text | optional |
| intro | Rich Text | optional |
| layout | Enum `collectionLayout` | |
| cards | Ref (many) → **Card** | required |

**Card** (item type)
| media | Ref → Media | optional |
| title | Short Text | |
| subtitle | Short Text | optional (e.g. person designation) |
| body | Rich Text | optional |
| links | Ref (many) → Link | optional (incl. PDF links) |
| cta | Ref → Button | optional |
| order | Number | optional manual ordering |

### 7.4 RichTextBlock
Standalone formatted copy. **Covers:** RichTextItem/RichTextItemCollection usage.
| content | Rich Text | required (embed entries/assets) |
| width | Enum `contentWidth` | |

### 7.5 Accordion (+ AccordionItem)
Expandable list; emits FAQ structured data. **Covers:** AccordionList, Accordion.
| heading | Short Text | optional |
| items | Ref (many) → **AccordionItem** | required |
| allowMultipleOpen | Boolean | default false |

**AccordionItem:** `title` (Short Text) · `content` (Rich Text; may embed sections).

### 7.6 Tabs (+ Tab)
Tabbed content. **Covers:** DynamicTabs, Tab.
| selectorStyle | Enum: `tabs`·`dropdown` | |
| tabs | Ref (many) → **Tab** | required |

**Tab:** `label` (Short Text) · `content` **Ref (many) → [whitelisted sections]** (generic — not
hard-coded to grievance types).

### 7.7 Form (+ FormField)
Data-driven forms with conditional fields. **Covers:** DynamicForms, GrievanceAddress/Links,
GlobalSearch, SecureDocumentPortal (form part), InputForms/SelectorForms.
| heading | Short Text | optional |
| intro | Rich Text | optional |
| fields | Ref (many) → **FormField** | required |
| submitButton | Ref → Button | required |
| successMessage / failureMessage | Rich Text | |
| action | Short Text | endpoint/handler key |

**FormField**
| type | Enum: text·number·email·textarea·phone·select·date·radio·checkbox·multiselect·toggle·password·file | required |
| label · placeholder · errorMessage | Short Text | |
| required | Boolean | |
| validation | Short Text | pattern/rule key |
| options | Short Text (list) | for select/radio/checkbox |
| minLength / maxLength / width | Number / Enum | |
| dependsOnField · operator · visibilityValue | Short Text | conditional rendering |

### 7.8 Embed
External/iframe/video/QR. **Covers:** IFrameContent, ContentWithQR, video.
| title | Short Text | optional |
| embedType | Enum: `iframe`·`video`·`qr`·`map` | |
| url | Short Text (URL) | required |
| aspectRatio | Enum: `16-9`·`4-3`·`1-1` | |
| caption | Short Text | optional |

### 7.9 ContactSection
Grouped contact details. **Covers:** CommunicationChannels, StateContactInfo,
StateSitesCommunicationChannels.
| heading | Short Text | optional |
| groups | Ref (many) → ContactInformation | required |
| tone | Enum `tone` | |

### 7.10 NotificationBanner
Timed/dismissible banner. **Covers:** BannerNotification.
| message | Rich Text | required |
| tone | Enum: `info`·`warn`·`success` | |
| icon | Ref → Media | optional |
| showFrom / showTo | Date & time | optional |
| dismissible | Boolean | default true |

### 7.11 LayoutGroup
Arranges child sections into columns/grid. **Covers:** SplitContentBlocks, BrushSection, side-by-side.
| layout | Enum: `two-col`·`three-col`·`split`·`grid` | required |
| spacing | Enum `spacing` | |
| tone | Enum `tone` | |
| items | Ref (many) → **[sections except LayoutGroup]** | required (one nesting level only) |

### 7.12 Complex flows (model separately — Phase 2)
`StateSelector`, `SecureDocumentPortal` (full secure flow), `GlobalSearch` results,
`BackgroundSurvey`/`AccessibilitySurvey`, `DynamicDropdown`-driven filtering. Per governance rule,
document each before implementation; most reduce to a specialized `Form` or `Embed` + a small
dedicated type. Not part of the core reusable set.

## 8. Reference whitelists (guardrails)
| Slot | Accepts |
|---|---|
| `Page.sections` | Banner, MediaContentBlock, CardCollection, RichTextBlock, Accordion, Tabs, Form, Embed, ContactSection, NotificationBanner, LayoutGroup |
| `LayoutGroup.items` | all of the above **except** LayoutGroup |
| `Tab.content` | same as `Page.sections` except Tabs, LayoutGroup |
| `CardCollection.cards` | Card only |
| `Accordion.items` | AccordionItem only |
| `Form.fields` | FormField only |
Plus: slug `unique` + regex; `Media.altText` required; `Meta` char-range validations; all enums use `in`-list validation.

## 9. Localization matrix
| Localized | Not localized |
|---|---|
| heading, subheading, body, bullets, intro, labels, card/tab/accordion text | all enums (variant/tone/layout/placement) |
| CTA/link labels, form labels/placeholders/messages | booleans, numbers, structural references |
| `slug` (per-locale, with fallback) | `internalName` (Entry Key) |
| Media alt text; Media asset **only if it contains text** | Media asset (shared by default) |

Fallback chain: requested locale → **default `en-US`**.

## 10. Old → new mapping (≈70 → ≈12 + primitives)
| Old types | New home |
|---|---|
| GraphicAsset | **Media** (primitive) |
| Link, Button, Meta | **Link / Button / Meta** (primitives) |
| RichTextItem, RichTextItemCollection, Heading | **Rich Text fields** directly / heading on block |
| ImageWithContent, BackgroundImageWithContent, ImageDescriptionCard, IconWithContentCard, ImageWithContentCTA, ImageWithCTACard, InfoContentCard, ContentWithPDFCard, ContentWithBackgroundColor, Content, TeleDentistry | **MediaContentBlock** (variants) |
| CardsCollection, BaseCardComponent, BrushCard, LeadershipCard(+Person), NewsArticles(+Collection), PdfLinkCollection(+PdfLinkCard), Accrediations(+ImageWithLink) | **CardCollection + Card** (variants) |
| AccordionList, Accordion | **Accordion + AccordionItem** |
| DynamicTabs, Tab | **Tabs + Tab** |
| DynamicForms, GrievanceAddress, GrievanceLinks, GlobalSearch, InputForms, SelectorForms | **Form + FormField** |
| IFrameContent, ContentWithQR | **Embed** |
| CommunicationChannels, Icon Text, StateContactInfo, Contact column, Contact Address, ContactInformation | **ContactSection + ContactInformation** |
| BannerNotification | **NotificationBanner** |
| SplitContentBlocks, BrushSection | **LayoutGroup** |
| Banner | **Banner** |
| Component, ComponentCollection, BaseCardComponent (empty placeholders) | **removed** |
| StateSelector, SecureDocumentPortal, Surveys, DynamicDropdown | **Phase-2 complex flows** (§7.12) |

## 11. Frontend contract (summary — detail in Architecture phase)
- **Registry** `Record<contentTypeId, ReactComponent>`; `<SectionRenderer sections={page.sections} />`
  maps each entry → component in array order; unknown id → `null` + telemetry.
- **Type safety:** generated TS types per content type; `zod` validation at the CMS boundary.
- **Contract test:** every content-type id and every enum value has a matching renderer/variant.

## 12a. Navigation menu (migrations 003 + 004)
A multi-level, responsive nav menu, reusing existing primitives (no per-variation types):
- **`navigationMenu`** = `{ internalName, title?, items[] }`; each item is a **`link`** or a
  **`linkGroup`**. **`linkGroup.links` is recursive** (`[link, linkGroup]`) → multi-level menus.
- **Contextual, per-section (migrations 005 + 006).** One `Page.primaryNav` → `navigationMenu`.
  Each item is a **section** — a `linkGroup` with a **`href`** (navigable label) that **owns its
  sub-menu** (its `links`). `linkGroup.href` (migration 006) lets a group be a link too; the old
  separate `subNav` field was removed.
- **Rendering** (chrome, not the section registry), all driven by the current route (`usePathname`):
  - **Desktop header** = the section labels as **plain links, no dropdowns**; the link whose href
    matches the route is **underlined** (`is-active`).
  - **Desktop sub-bar** = the **active section's** children, on a solid light band (dropdowns for
    grandchildren). It is contextual — Members shows Member's sub-menu, Providers shows Provider's, etc.
  - **Tablet/mobile** (< `lg`) = hamburger **drawer**: sections **drill down** (slide) into their
    sub-menus; deeper groups expand inline. The header CTA ("Find a dentist") stays visible.
- Item type is branched by `isLinkGroup()` (content-type id, never `sys.id`). Because `link`/
  `linkGroup` fields are all-optional they overlap structurally, so the plain-link branch casts
  `as Link` (documented at each site).

## 12. Open decisions
1. **Header/Footer** — confirm they stay page-chrome refs on `Page` (vs sections). *(recommend: chrome)*
2. **Card vs Person** — fold people into `Card` (title=name, subtitle=designation)? *(recommend: yes)*
3. **PDF documents** — as `Card` links, or a dedicated `DocumentList`? *(recommend: Card links first)*
4. **Nesting depth** — cap `LayoutGroup` at one level? *(recommend: yes, to bound payloads)*
