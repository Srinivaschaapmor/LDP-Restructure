// Migration 020 — content-model gaps found mapping the Home page design
// (Figma 4UxJeqzAVXcc2mtlwkTQKO, section 30:382) onto the existing model.
// NO new section types: all 8 Home body sections map onto banner /
// mediaContentBlock / cardCollection + card, so `page.sections` is untouched.
// This migration closes field-level gaps plus two new leaf types.
// Order: leaf types -> item types -> sections -> chrome.
module.exports = function (migration) {
  // ---- 0. News articles ------------------------------------------------------
  // "Liberty news" pulls the latest N articles rather than three hand-authored
  // cards, so news needs its own authorable type with a real publish date. The
  // date lives here, NOT on the shared `card` — a teaser is a projection of an
  // article, and putting the date on `card` would invite every other collection
  // to grow a meaningless date.
  const news = migration.createContentType("newsArticle").name("News article")
    .description("A dated news item. Surfaced as teasers by a cardCollection with source=latestNews.")
    .displayField("internalName");
  news.createField("internalName").name("Internal name").type("Symbol").required(true);
  news.createField("title").name("Title").type("Symbol").required(true);
  news.createField("slug").name("Slug").type("Symbol").required(true)
    .validations([{ unique: true }, { regexp: { pattern: "^/.*$" } }]);
  news.createField("publishDate").name("Publish date").type("Date").required(true);
  news.createField("excerpt").name("Excerpt").type("Text");
  news.createField("media").name("Media").type("Link").linkType("Entry")
    .validations([{ linkContentType: ["media"] }]);
  news.createField("body").name("Body").type("Link").linkType("Entry")
    .validations([{ linkContentType: ["richTextItem"] }]);
  // Date-only picker: the design shows MM/DD/YYYY, so a time component would be
  // meaningless data the frontend has to strip.
  news.changeFieldControl("publishDate", "builtin", "datePicker", { format: "dateonly" });

  // ---- 1. External-link interstitial copy ------------------------------------
  // The "Leaving Liberty Dental plan.com" dialog. Neither `banner` (no cancel
  // action) nor `card` (cancel is not a link, and a card outside a cardCollection
  // is unreachable) fits. Label-only by design: neither action navigates anywhere
  // new — Proceed reuses the href the user clicked, Cancel closes — so no
  // `button`/`link` entries are involved.
  const notice = migration.createContentType("externalLinkNotice")
    .name("External link notice")
    .description("Copy for the interstitial shown before sending a user to an external site. One global entry, referenced by header.")
    .displayField("internalName");
  notice.createField("internalName").name("Internal name").type("Symbol").required(true);
  notice.createField("heading").name("Heading").type("Symbol").required(true);
  // ADR-0007: rich text always arrives by reference to richTextItem, which already
  // carries the locked-down marks/nodes validation from migration 015.
  notice.createField("body").name("Body").type("Link").linkType("Entry").required(true)
    .validations([{ linkContentType: ["richTextItem"] }]);
  notice.createField("proceedLabel").name("Proceed label").type("Symbol").required(true);
  notice.createField("cancelLabel").name("Cancel label").type("Symbol").required(true);
  notice.createField("closeLabel").name("Close button aria-label").type("Symbol").required(true);

  // ---- 2. Section: mediaContentBlock -----------------------------------------
  const mcb = migration.editContentType("mediaContentBlock");
  // The 24px check glyph on the provider/broker bullet lists. `bullets` is a
  // richTextItem whose node types are locked down (015), so the icon cannot live
  // inside it. One icon per block, not per bullet.
  mcb.createField("bulletIcon").name("Bullet icon").type("Link").linkType("Entry")
    .validations([{ linkContentType: ["media"] }]);
  // Image links (the app-store badges) — distinct from `ctas`, which are text
  // buttons. `link` already carries label + href + icon->media.
  mcb.createField("links").name("Links").type("Array")
    .items({ type: "Link", linkType: "Entry", validations: [{ linkContentType: ["link"] }] });

  // ---- 3. Section: cardCollection --------------------------------------------
  const cc = migration.editContentType("cardCollection");
  // Section-level CTA: "Shop plans", "More news", "Schedule now".
  cc.createField("cta").name("CTA").type("Link").linkType("Entry")
    .validations([{ linkContentType: ["button"] }]);
  // Band colour, same enum and same values as mediaContentBlock.tone — never a
  // colour picker (section-model-spec §1.4).
  cc.createField("tone").name("Tone").type("Symbol")
    .validations([{ in: ["default", "subtle", "brand", "inverse"] }]);
  // Where the cards come from. Absent = manual, so every existing entry keeps
  // its current meaning without a backfill.
  cc.createField("source").name("Source").type("Symbol")
    .validations([{ in: ["manual", "latestNews"] }]);
  cc.createField("limit").name("Limit").type("Integer")
    .validations([{ range: { min: 1, max: 24 } }]);
  // `cards` was required(true), which a source=latestNews collection can never
  // satisfy — it has no hand-authored cards at all. Relaxed to optional; the
  // renderer enforces "manual collections need cards" instead.
  cc.editField("cards").required(false);
  // editField().validations() REPLACES the list, so every existing value is re-listed.
  // + "chips" : centred icon+label row (Individual and family), no card chrome
  // + "logos" : logo strip (accreditations), image-only, no card chrome
  cc.editField("layout").validations([{
    in: ["grid-2", "grid-3", "grid-4", "list", "carousel", "split", "chips", "logos"],
  }]);

  // ---- 4. Section: banner ----------------------------------------------------
  // `overlay` is the scrim DIRECTION (none/left/right = gradient). The Home hero
  // uses a uniform wash, which none of the three current values can express.
  migration.editContentType("banner").editField("overlay")
    .validations([{ in: ["none", "left", "right", "flat"] }]);

  // ---- 5. Chrome: header -----------------------------------------------------
  // The interstitial is global chrome — every page's external links use it — so it
  // hangs off `header`, the entry every Page already references.
  migration.editContentType("header").createField("externalLinkNotice")
    .name("External link notice").type("Link").linkType("Entry")
    .validations([{ linkContentType: ["externalLinkNotice"] }]);
};
