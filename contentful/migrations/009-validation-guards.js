// Migration 009 — validation guards (Contentful content-model review, Joe Meersman 07-21-26).
// Addresses: #2 constrain RichText, #10 URL-format regex, #15 asset MIME groups.
// All RichText is restricted to a minimal inline set: bold / italic / underline marks and
// ordered-list / unordered-list / hyperlink nodes — NO headings, blockquote, hr, tables,
// code, or embeds (paragraph + text are always implicitly allowed).
module.exports = function (migration) {
  const RICH = [
    { enabledMarks: ["bold", "italic", "underline"], message: "Only bold, italic and underline are allowed." },
    { enabledNodeTypes: ["ordered-list", "unordered-list", "hyperlink"], message: "Only lists and hyperlinks are allowed — no headings, quotes, tables, or embeds." },
  ];
  const rx = (pattern, message) => [{ regexp: { pattern, flags: "" }, message }];
  // Nav hrefs may be an absolute URL, a root-relative path, or mailto:/tel:/#anchor.
  const NAV = "^(https?://|/|mailto:|tel:|#).+";
  const ABS = "^https?://.+";            // absolute URL only
  const REL_OR_ABS = "^(https?://|/).+"; // absolute URL or root-relative path

  // ---- RichText constraints ----
  migration.editContentType("accordionItem").editField("content").validations(RICH);
  migration.editContentType("cardCollection").editField("intro").validations(RICH);
  migration.editContentType("richTextBlock").editField("content").validations(RICH);
  migration.editContentType("banner").editField("subheading").validations(RICH);
  migration.editContentType("card").editField("body").validations(RICH);
  const mcb = migration.editContentType("mediaContentBlock");
  mcb.editField("body").validations(RICH);
  mcb.editField("bullets").validations(RICH);

  // ---- URL-format regex + asset MIME groups ----
  const link = migration.editContentType("link");
  link.editField("href").validations(rx(NAV, "Enter a URL, a /path, or mailto:/tel:/#anchor."));

  migration.editContentType("linkGroup").editField("href")
    .validations(rx(NAV, "Enter a URL, a /path, or mailto:/tel:/#anchor."));

  migration.editContentType("meta").editField("canonicalUrl")
    .validations(rx(ABS, "Enter an absolute http(s) URL."));

  const media = migration.editContentType("media");
  media.editField("externalUrl").validations(rx(REL_OR_ABS, "Enter an absolute URL or a /path."));
  media.editField("asset").validations([{ linkMimetypeGroup: ["image"] }]);

  const documentCt = migration.editContentType("document");
  documentCt.editField("externalUrl").validations(rx(ABS, "Enter an absolute http(s) URL."));
  documentCt.editField("file").validations([{ linkMimetypeGroup: ["pdfdocument"] }]);
};
