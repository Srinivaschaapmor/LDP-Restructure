// Seeds the Home page (Figma 4UxJeqzAVXcc2mtlwkTQKO, section 30:382) into Contentful.
// Copy is transcribed from the design via docs/03-content-model/home-page-entry-plan.md.
// Requires migration 020 to have run. Run: node contentful/seed/seed-home-page.mjs
//
// Idempotent: every entry is looked up by internalName and updated in place, so re-running
// after filling in a TODO below patches rather than duplicates.
//
// Publishing policy: an entry is published only when every required field is genuinely
// filled. Anything still carrying a TODO stays a DRAFT, and the run ends with a report of
// what is outstanding. The Home `page` entry is deliberately NEVER published by this script
// — it is already live, and publishing it while its sections are drafts would strip those
// sections from the CDA response and blank the page.
import contentful from "contentful-management";

const { CONTENTFUL_SPACE_ID, CONTENTFUL_ENVIRONMENT_ID = "master", CONTENTFUL_MANAGEMENT_ACCESS_TOKEN } = process.env;
if (!CONTENTFUL_MANAGEMENT_ACCESS_TOKEN) { console.error("Missing CONTENTFUL_MANAGEMENT_ACCESS_TOKEN"); process.exit(1); }

// ---------------------------------------------------------------------------
// TODO — values the design does not contain. Each one blocks publishing the
// entries listed beside it. Replace the null, re-run, and the entry publishes.
// ---------------------------------------------------------------------------
// PLACEHOLDERS IN USE. "#" means "destination not yet supplied by the content team" — it is
// not a real route. Every "#" here is a dead link in the rendered page and must be replaced
// before this page goes to production (SiteImprove will flag them, correctly).
const TODO = {
  hrefGetStarted: "#",         // hero CTA
  hrefShopPlans: "#",          // individual-and-family CTA
  hrefJoinNetwork: "#",        // provider CTA
  hrefGetQuote: "#",           // broker CTA
  hrefMoreNews: "#",           // news CTA -> the news listing route
  hrefScheduleNow: "#",        // teledentistry CTA
  hrefAppStore: "#",           // real value is an apps.apple.com absolute URL
  hrefGooglePlay: "#",         // real value is a play.google.com absolute URL
  // Internal routes we own, derived from the article titles — safe to settle now.
  newsArticle1Slug: "/news/tcu-lightning-complex-fires",
  newsArticle2Slug: "/news/2025-late-march-winter-storms",
  newsArticle3Slug: "/news/2025-february-storms",
  // Drafted to the model's length limits (63 and 140 chars). Marketing should review.
  metaTitle: "Liberty Dental Plan | Dental plans for individuals and families",
  metaDescription:
    "Explore Liberty Dental Plan's dental coverage for individuals and families, find a covered dentist near you, and access virtual dental care.",
};

const client = contentful.createClient({ accessToken: CONTENTFUL_MANAGEMENT_ACCESS_TOKEN });
const space = await client.getSpace(CONTENTFUL_SPACE_ID);
const env = await space.getEnvironment(CONTENTFUL_ENVIRONMENT_ID);
const locales = await env.getLocales();
const LOCALE = (locales.items.find((l) => l.default) || { code: "en-US" }).code;

const L = (v) => ({ [LOCALE]: v });
const link = (id) => ({ sys: { type: "Link", linkType: "Entry", id } });
const text = (value, marks = []) => ({ nodeType: "text", value, marks, data: {} });
const para = (...content) => ({ nodeType: "paragraph", data: {}, content });
const doc = (...content) => ({ nodeType: "document", data: {}, content });
const pDoc = (s) => doc(para(text(s)));
const li = (s) => ({ nodeType: "list-item", data: {}, content: [para(text(s))] });
const ulDoc = (...items) => doc({ nodeType: "unordered-list", data: {}, content: items.map(li) });

const drafts = [];
const published = [];

// Look up by internalName so re-runs patch instead of duplicating. `pending` lists the TODO
// keys this entry is waiting on; a non-empty list means "create/update but do not publish".
async function upsert(ctId, internalName, fields, pending = []) {
  const found = await env.getEntries({ content_type: ctId, "fields.internalName": internalName, limit: 1 });
  const payload = { internalName: L(internalName) };
  for (const [k, v] of Object.entries(fields)) if (v !== undefined) payload[k] = L(v);

  let entry;
  if (found.items.length) {
    entry = found.items[0];
    entry.fields = payload;
    entry = await entry.update();
  } else {
    entry = await env.createEntry(ctId, { fields: payload });
  }

  const blocked = pending.filter((k) => TODO[k] === null);
  if (blocked.length) {
    drafts.push(`${ctId}: ${internalName} — needs ${blocked.join(", ")}`);
    console.log(`  · ${ctId}: ${internalName} (draft)`);
    return entry.sys.id;
  }

  // A publish can still fail on a model rule this script cannot satisfy — decorative icons
  // legitimately want altText "", which required(true) rejects. Record and continue rather
  // than aborting the run half-seeded.
  try {
    await entry.publish();
    published.push(internalName);
    console.log(`  ✓ ${ctId}: ${internalName}`);
  } catch (err) {
    const detail = err?.message?.includes("{") ? JSON.parse(err.message)?.details?.errors?.[0] : null;
    const why = detail ? `${detail.path?.join(".")} ${detail.details || detail.name}` : "validation failed";
    drafts.push(`${ctId}: ${internalName} — ${why}`);
    console.log(`  · ${ctId}: ${internalName} (draft — ${why})`);
  }
  return entry.sys.id;
}

console.log(`Seeding Home into ${CONTENTFUL_SPACE_ID}/${CONTENTFUL_ENVIRONMENT_ID} (locale ${LOCALE})\n`);

// --- Media -----------------------------------------------------------------
// `asset` is deliberately not set: the binaries must be exported from Figma and uploaded by
// contentful/seed/upload-assets.mjs first (asset URLs in Figma expire ~7 days, so they are
// exported at build time). These entries carry the accessibility text and dimensions now;
// attaching the asset later is a field update, not a re-create.
console.log("Media:");
const mHero = await upsert("media", "global-media-home-hero", { altText: "", width: 1600, height: 644 });
const mProvider = await upsert("media", "global-media-provider-clinician", { altText: "Smiling dentist holding a clipboard", width: 555, height: 568 });
const mBroker = await upsert("media", "global-media-broker-meeting", { altText: "Broker meeting with a client", width: 703, height: 605 });
const mApp = await upsert("media", "global-media-app-mockup", { altText: "Liberty Dental Plan mobile app shown on a phone", width: 426, height: 449 });
const mSoc2 = await upsert("media", "global-media-logo-soc2", { altText: "AICPA SOC 2 certified", width: 120, height: 120 });
const mNcqa = await upsert("media", "global-media-logo-ncqa", { altText: "NCQA accredited", width: 120, height: 120 });
const mHitrust = await upsert("media", "global-media-logo-hitrust", { altText: "HITRUST certified", width: 120, height: 59 });
const mUrac = await upsert("media", "global-media-logo-urac", { altText: "URAC accredited", width: 120, height: 116 });
const mAppStore = await upsert("media", "global-media-badge-appstore", { altText: "Download on the App Store", width: 172, height: 57 });
const mGooglePlay = await upsert("media", "global-media-badge-googleplay", { altText: "Get it on Google Play", width: 171, height: 57 });
const mIconDeduct = await upsert("media", "global-media-icon-no-deductibles", { altText: "", width: 42, height: 42 });
const mIconWaiting = await upsert("media", "global-media-icon-no-waiting-period", { altText: "", width: 42, height: 42 });
const mIconEmergency = await upsert("media", "global-media-icon-emergency-coverage", { altText: "", width: 42, height: 42 });
const mIconClock = await upsert("media", "global-media-icon-clock", { altText: "", width: 64, height: 64 });
const mIconEye = await upsert("media", "global-media-icon-eye", { altText: "", width: 64, height: 64 });
const mIconCalendar = await upsert("media", "global-media-icon-calendar", { altText: "", width: 64, height: 64 });
const mCheck = await upsert("media", "global-media-icon-check", { altText: "", width: 24, height: 24 });

// --- Rich text -------------------------------------------------------------
console.log("\nRich text:");
const rtHeroSub = await upsert("richTextItem", "page-home-hero-sub", { content: pDoc("Are you a Liberty Dental Plan member? Explore helpful resources to get the most from your plan.") });
const rtIndividualIntro = await upsert("richTextItem", "page-home-individual-family-intro", { content: pDoc("Liberty helps you find a covered dentist near you. You also get valuable benefits like:") });
const rtProviderBody = await upsert("richTextItem", "page-home-provider-body", { content: pDoc("Join our network and see how we make your business easier.") });
const rtProviderBullets = await upsert("richTextItem", "page-home-provider-bullets", { content: ulDoc("Efficient claims processing", "Engaged Provider Relations representatives", "Easy-to-use Provider Portal") });
const rtBrokerBody = await upsert("richTextItem", "page-home-broker-body", { content: pDoc("Give your clients access to the quality dental benefits they need.") });
const rtBrokerBullets = await upsert("richTextItem", "page-home-broker-bullets", { content: ulDoc("Network of more than 5,000 dentists", "Competitive offerings", "Low costs", "Easy member experience") });
const rtNewsIntro = await upsert("richTextItem", "page-home-news-intro", { content: pDoc("See the latest updates.") });
const rtTeleIntro = await upsert("richTextItem", "page-home-teledentistry-intro", { content: pDoc("Liberty members can consult with a dentist at no cost from a computer or mobile device.") });
// The Figma source for this string starts with a stray tab character — stripped here.
const rtTele1 = await upsert("richTextItem", "page-home-teledentistry-card-1-body", { content: pDoc("Get virtual dental care whenever you need it.") });
const rtTele2 = await upsert("richTextItem", "page-home-teledentistry-card-2-body", { content: pDoc("Consult with a dentist while traveling or from the comfort of your home.") });
const rtTele3 = await upsert("richTextItem", "page-home-teledentistry-card-3-body", { content: pDoc("No need to take time off work.") });
const rtAppBody = await upsert("richTextItem", "page-home-mobile-app-body", { content: pDoc("Download our mobile app.") });
const rtNoticeBody = await upsert("richTextItem", "global-external-link-notice-body", { content: pDoc("You are being redirected to an external website.") });

// --- Links -----------------------------------------------------------------
console.log("\nLinks:");
const lnGetStarted = await upsert("link", "global-link-get-started", { label: "Get started", href: TODO.hrefGetStarted }, ["hrefGetStarted"]);
const lnShopPlans = await upsert("link", "global-link-shop-plans", { label: "Shop plans", href: TODO.hrefShopPlans }, ["hrefShopPlans"]);
const lnJoinNetwork = await upsert("link", "global-link-join-network", { label: "Join our network", href: TODO.hrefJoinNetwork }, ["hrefJoinNetwork"]);
const lnGetQuote = await upsert("link", "global-link-get-quote", { label: "Get a quote", href: TODO.hrefGetQuote }, ["hrefGetQuote"]);
const lnMoreNews = await upsert("link", "global-link-more-news", { label: "More news", href: TODO.hrefMoreNews }, ["hrefMoreNews"]);
const lnScheduleNow = await upsert("link", "global-link-schedule-now", { label: "Schedule now", href: TODO.hrefScheduleNow }, ["hrefScheduleNow"]);
const lnAppStore = await upsert("link", "global-link-appstore", { label: "Download on the App Store", href: TODO.hrefAppStore, isExternal: true, icon: link(mAppStore) }, ["hrefAppStore"]);
const lnGooglePlay = await upsert("link", "global-link-googleplay", { label: "Get it on Google Play", href: TODO.hrefGooglePlay, isExternal: true, icon: link(mGooglePlay) }, ["hrefGooglePlay"]);

// --- Buttons ---------------------------------------------------------------
// A button inherits its parent section's `tone` for inverse/outline treatment, so `variant`
// stays a two-value semantic choice rather than encoding colour (ADR-0012, decision M4).
console.log("\nButtons:");
const btnGetStarted = await upsert("button", "global-button-get-started", { label: "Get started", link: link(lnGetStarted), variant: "primary" }, ["hrefGetStarted"]);
const btnShopPlans = await upsert("button", "global-button-shop-plans", { label: "Shop plans", link: link(lnShopPlans), variant: "primary" }, ["hrefShopPlans"]);
const btnJoinNetwork = await upsert("button", "global-button-join-network", { label: "Join our network", link: link(lnJoinNetwork), variant: "primary" }, ["hrefJoinNetwork"]);
const btnGetQuote = await upsert("button", "global-button-get-quote", { label: "Get a quote", link: link(lnGetQuote), variant: "secondary" }, ["hrefGetQuote"]);
const btnMoreNews = await upsert("button", "global-button-more-news", { label: "More news", link: link(lnMoreNews), variant: "secondary" }, ["hrefMoreNews"]);
const btnScheduleNow = await upsert("button", "global-button-schedule-now", { label: "Schedule now", link: link(lnScheduleNow), variant: "secondary" }, ["hrefScheduleNow"]);

// --- News articles ---------------------------------------------------------
// Real articles rather than hand-authored teaser cards, so the section can pull the latest N.
console.log("\nNews articles:");
await upsert("newsArticle", "news-tcu-lightning-complex-fires", {
  title: "Liberty Dental Plan Creates a Dedicated Toll-Free Number for the State of Emergency Proclamation for the TCU Lightning Complex Fires",
  slug: TODO.newsArticle1Slug, publishDate: "2025-09-02",
}, ["newsArticle1Slug"]);
await upsert("newsArticle", "news-2025-late-march-winter-storms", {
  title: "Liberty Dental Plan Creates a Dedicated Toll-Free Number for the State of Emergency Proclamation for the 2025 Late March Winter Storms",
  slug: TODO.newsArticle2Slug, publishDate: "2025-07-29",
}, ["newsArticle2Slug"]);
await upsert("newsArticle", "news-2025-february-storms", {
  title: "Liberty Dental Plan Creates a Dedicated Toll-Free Number for the State of Emergency Proclamation for the 2025 February Storms Issued",
  slug: TODO.newsArticle3Slug, publishDate: "2025-07-29",
}, ["newsArticle3Slug"]);

// --- Cards -----------------------------------------------------------------
console.log("\nCards:");
const cardDeduct = await upsert("card", "global-card-benefit-no-deductibles", { title: "No deductibles", media: link(mIconDeduct), order: 1 });
const cardWaiting = await upsert("card", "global-card-benefit-no-waiting-period", { title: "No waiting period", media: link(mIconWaiting), order: 2 });
const cardEmergency = await upsert("card", "global-card-benefit-emergency-coverage", { title: "Emergency coverage", media: link(mIconEmergency), order: 3 });
const cardTele1 = await upsert("card", "global-card-teledentistry-247-access", { title: "24/7 access", media: link(mIconClock), body: link(rtTele1), order: 1 });
const cardTele2 = await upsert("card", "global-card-teledentistry-anywhere", { title: "Anywhere", media: link(mIconEye), body: link(rtTele2), order: 2 });
const cardTele3 = await upsert("card", "global-card-teledentistry-flexible", { title: "Flexible", media: link(mIconCalendar), body: link(rtTele3), order: 3 });
const cardSoc2 = await upsert("card", "global-card-accreditation-soc2", { media: link(mSoc2), order: 1 });
const cardNcqa = await upsert("card", "global-card-accreditation-ncqa", { media: link(mNcqa), order: 2 });
const cardHitrust = await upsert("card", "global-card-accreditation-hitrust", { media: link(mHitrust), order: 3 });
const cardUrac = await upsert("card", "global-card-accreditation-urac", { media: link(mUrac), order: 4 });

// --- Sections --------------------------------------------------------------
console.log("\nSections:");
const secHero = await upsert("hero", "page-home-hero", {
  heading: "Making members shine, one smile at a time",
  subheading: link(rtHeroSub), backgroundImage: link(mHero), cta: link(btnGetStarted),
  variant: "image", height: "lg", overlay: "flat", overlayColor: "#0F1042",
}, ["hrefGetStarted"]);

const secIndividual = await upsert("cardCollection", "page-home-individual-family", {
  heading: "Individual and family dental plans", intro: link(rtIndividualIntro),
  layout: "chips", source: "manual", cta: link(btnShopPlans),
  cards: [cardDeduct, cardWaiting, cardEmergency].map(link),
}, ["hrefShopPlans"]);

const secProvider = await upsert("mediaContentBlock", "page-home-provider", {
  heading: "Become a Liberty provider", body: link(rtProviderBody), bullets: link(rtProviderBullets),
  bulletIcon: link(mCheck), media: link(mProvider), mediaPlacement: "right", tone: "subtle",
  ctas: [btnJoinNetwork].map(link),
}, ["hrefJoinNetwork"]);

const secBroker = await upsert("mediaContentBlock", "page-home-broker", {
  heading: "Become a Liberty broker", body: link(rtBrokerBody), bullets: link(rtBrokerBullets),
  bulletIcon: link(mCheck), media: link(mBroker), mediaPlacement: "left", tone: "brand",
  ctas: [btnGetQuote].map(link),
}, ["hrefGetQuote"]);

// source=latestNews, so `cards` is intentionally empty — the renderer pulls newsArticle
// entries ordered by publishDate. This is why migration 020 relaxed `cards` to optional.
const secNews = await upsert("cardCollection", "page-home-news", {
  heading: "Liberty news", intro: link(rtNewsIntro), layout: "carousel",
  source: "latestNews", limit: 3, cta: link(btnMoreNews),
}, ["hrefMoreNews"]);

const secTele = await upsert("cardCollection", "page-home-teledentistry", {
  heading: "Virtual dental care and emergency dental services with teledentistry",
  intro: link(rtTeleIntro), layout: "grid-3", tone: "brand", source: "manual",
  cta: link(btnScheduleNow), cards: [cardTele1, cardTele2, cardTele3].map(link),
}, ["hrefScheduleNow"]);

const secApp = await upsert("mediaContentBlock", "page-home-mobile-app", {
  heading: "Manage your plan on the go", body: link(rtAppBody), media: link(mApp),
  mediaPlacement: "left", tone: "subtle", links: [lnAppStore, lnGooglePlay].map(link),
}, ["hrefAppStore", "hrefGooglePlay"]);

const secAccreditations = await upsert("cardCollection", "page-home-accreditations", {
  heading: "Liberty Dental Plan is accredited and certified by",
  layout: "logos", source: "manual",
  cards: [cardSoc2, cardNcqa, cardHitrust, cardUrac].map(link),
});

// --- Chrome + meta ---------------------------------------------------------
console.log("\nChrome:");
await upsert("externalLinkNotice", "global-external-link-notice", {
  heading: "Leaving Liberty Dental plan.com", body: link(rtNoticeBody),
  proceedLabel: "Proceed", cancelLabel: "Cancel", closeLabel: "Close",
});

const meta = await upsert("meta", "page-home-meta", {
  title: TODO.metaTitle, description: TODO.metaDescription,
}, ["metaTitle", "metaDescription"]);

// --- Page ------------------------------------------------------------------
// The Home page entry ALREADY EXISTS and is published (slug "/"), so it is patched, never
// created — `slug` is unique and a second entry would be rejected. It is deliberately left
// unpublished: publishing it now, while its sections are drafts, would drop those links from
// the CDA and blank the live page. Publish it by hand once the report below is clear.
console.log("\nPage:");
const homeEntries = await env.getEntries({ content_type: "page", "fields.slug": "/", limit: 1 });
if (!homeEntries.items.length) { console.error("No page entry with slug '/' — expected the existing home-page entry."); process.exit(1); }
const home = homeEntries.items[0];
home.fields.title = L("Home");
home.fields.header = L(link("5UDoqb258t1Xhvvo1HbSbj"));      // global-header-member
home.fields.primaryNav = L(link("5yUXtij0Gss4nOG181Ikff"));  // nav-sections
home.fields.meta = L(link(meta));
home.fields.sections = L([
  secHero, secIndividual, secProvider, secBroker, secNews, secTele, secApp, secAccreditations,
].map(link));
const updatedHome = await home.update();
// Publish only once every section it links to is itself published — publishing earlier would
// drop the unresolved links from the CDA response and render a blank page.
if (drafts.length) {
  console.log("  · page: home-page updated, NOT published (sections still draft)");
} else {
  await updatedHome.publish();
  console.log("  ✓ page: home-page published");
}

// The hero moved from `banner` to the dedicated `hero` type (migration 021). An earlier run
// of this script created a `banner` entry under the same internalName; it is now orphaned,
// so retire it rather than leave a published look-alike in the space.
const staleHero = await env.getEntries({ content_type: "banner", "fields.internalName": "page-home-hero", limit: 1 });
if (staleHero.items.length) {
  const stale = staleHero.items[0];
  if (stale.isPublished()) await stale.unpublish();
  await stale.delete();
  console.log("  · banner: page-home-hero removed (superseded by the hero type)");
}

// --- Report ----------------------------------------------------------------
console.log(`\n${"=".repeat(70)}`);
console.log(`Published: ${published.length}   Drafts blocked on TODO: ${drafts.length}`);
if (drafts.length) {
  console.log("\nStill blocked:");
  for (const d of drafts) console.log(`  - ${d}`);
  console.log("\nFill the TODO block at the top of this file and re-run.");
}
console.log("\nAlso outstanding, outside this script:");
console.log("  - 17 image assets: export from Figma, upload via contentful/seed/upload-assets.mjs,");
console.log("    then attach to the media entries above (the `asset` field is currently empty).");
console.log("  - Decorative icons carry altText \"\" (correct for a11y — they sit beside a visible");
console.log("    label). Confirm with the content team that this is intended, not unfilled.");
console.log("  - Publish the home-page entry by hand once nothing above is outstanding.");
