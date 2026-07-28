# Restructure source — verified analysis notes

Derived by parsing `restructure-source.xlsx` programmatically (not by re-reading the SA's PDF
summary). 69 content types, 256 field rows, 6 columns (`Count, Content Type, Field, Type,
Reference, Description`). This confirms and sharpens ADR-0005's findings against the literal data.

## Truly missing content types (referenced, never defined — confirmed dangling)
No name variant (case/spacing) resolves these:
- **Button** — referenced 5×  (Header.CTA, ImageWithContent.CTA, Content.CTA, ImageWithCTACard.CTA, ActionCard.CTA)
- **breadcrumbs** — referenced by Page.Breadcrumbs
- **Cards Collection** — referenced by TeleDentistry.Cards collection (distinct from the existing `Component Collection` / `New Articles Collection` / `Selection Collection` / `PdfLinkCollection`)
- **Bullet Points** — referenced by ImageWithContent.Bullet Points, Content.Bullet Points
- **ComponentConfiguration** — referenced by ActionCollection.Configuration
- **Theme** — referenced by ActionCollection.Theme
- **LinkSelector** — referenced by SubNavBar.Links, UtilityBar.Login Dropdown
- **SelectorForms** — referenced by UtilityBar.Language Dropdown, DynamicDropdown.Dropdown, DynamicTabs.Dropdowns

## Naming/case/spacing mismatches (type exists, reference string doesn't match it)
The type is defined but under a different-cased or differently-spaced name than how it's
referenced elsewhere — these will fail to resolve as literal Contentful API IDs:
| Referenced as | Actually defined as |
|---|---|
| Contact Column | Contact column (#30) |
| Login Card | LoginCard (#36) |
| Rich text Item / richtext item / richtextitem | RichText Item (#8) |
| Sub nav bar | SubNavBar (#4) |
| content item | Content Item (#34) |
| footer | Footer (#5) |
| graphicAsset | GraphicAsset (#10) |
| heading | Heading (#70) |
| link | Link (#11) |
| richtext | RichText (#7) |
| InputForms / inputForms / inputforms | `InputForms (Text, Number, Email, Text Area, Phone)` (#12) — the CT's own name carries a parenthetical, so no bare reference to "InputForms" matches it literally |
| AccordionList | Accordian List (#16) — also a misspelling |

## Not real issues (false positives in a naive reference scan)
- **Address / Email / Fax / Phone** — these are the enum *options* inside `ContactInformation.Type`'s description ("Phone / Email / Fax / Address"), not references to missing content types.
- **Asset** (Document Asset.File) — resolves to Contentful's **native Asset** link type, not a custom content type. Correct as-is.
- **"all the components"** (Page.Component) — this is prose in the description documenting the *open reference* problem (ADR-0005-equivalent finding #4: no `linkContentType` restriction), not a literal missing type named that.
- **Dropdown** (MobileAppDownload.Image Type ref, InputForms.Width) — appears to be a data-entry inconsistency in the source sheet (the field's *data type* value "Dropdown" leaking into the Reference column), not a reference to a missing "Dropdown" content type.

## Duplicate content-type name
- **Tab** appears twice: **#65** (0 fields, stub) and **#69** (3 fields: implies the real definition). The stub at #65 should be removed/merged.

## Empty content types (0 fields defined)
`BackgroundSurvey` (#60), `AccessibilitySurvey` (#61), `DynamicForms` (#62), `GrievanceAddress`
(#63), `GrievanceLinks` (#64), `Tab` (#65, stub), `BaseCardComponent` (#66).

## Gap in the source numbering
The `Count` column jumps from **37 to 39** — **#38 is missing entirely** from the source
spreadsheet (not a parsing artifact; confirmed against the raw `Count` column). Whatever content
type was meant to be #38 is absent. Flag to the source-of-truth owner before treating the sheet
as complete.

## Field-type vocabulary used in this sheet
`Reference` (117×, by far the most common) · `Short Text` (29×) · `Number` (4×) · `Dropdown` (4×,
select/enum) · `Text` (4×, long-form) · `Long Text` (3×) · `Boolean` (3×) · `Rich text` (3×) ·
`Reference (one)` (2×) · `Color Picker` (2×) · `Reference (multiple)` (2×) · `Asset Media` (1×).
Several rows have an empty `Type` cell (76×) — the type must be inferred from the field's
description/reference when consulting this sheet.

## Relationship to ADR-0005 and the SA review
This is the exact spreadsheet the SA reviewed. This programmatic analysis **independently
confirms** every structural finding from that review (dangling Button/breadcrumbs, naming
mismatches, duplicate Tab, empty stubs) with more precision (exact field-level locations for every
occurrence) — nothing here contradicts ADR-0005; it's the source data behind it.
