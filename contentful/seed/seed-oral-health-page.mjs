// Seeds the "5 toothbrush tips" page into Contentful (entries, in dependency order).
// Media entries use externalUrl -> local /images (served by Next) as a demo shortcut;
// production would upload real Contentful assets. Run: node contentful/seed/seed-oral-health-page.mjs
import contentful from "contentful-management";

const { CONTENTFUL_SPACE_ID, CONTENTFUL_ENVIRONMENT_ID = "master", CONTENTFUL_MANAGEMENT_ACCESS_TOKEN } = process.env;
if (!CONTENTFUL_MANAGEMENT_ACCESS_TOKEN) { console.error("Missing CONTENTFUL_MANAGEMENT_ACCESS_TOKEN"); process.exit(1); }

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
const hyperlink = (uri, label) => ({ nodeType: "hyperlink", data: { uri }, content: [text(label)] });

async function make(ctId, internalName, fields) {
  const f = { internalName: L(internalName) };
  for (const [k, v] of Object.entries(fields)) f[k] = L(v);
  const entry = await env.createEntry(ctId, { fields: f });
  await entry.publish();
  console.log(`  ✓ ${ctId}: ${internalName}`);
  return entry.sys.id;
}

console.log(`Seeding into ${CONTENTFUL_SPACE_ID}/${CONTENTFUL_ENVIRONMENT_ID} (locale ${LOCALE})`);

// --- Media ---
const mHero = await make("media", "media-hero", { altText: "A parent and child smiling together outdoors", externalUrl: "/images/hero.png" });
const mBrush = await make("media", "media-brushing", { altText: "Close-up of a person brushing their teeth", externalUrl: "/images/brushing.png" });
const mLogo = await make("media", "media-logo", { altText: "Liberty Dental Plan logo", externalUrl: "/images/logo.png" });

// --- Links ---
const navMembers = await make("link", "nav-members", { label: "Members", href: "/members" });
const navProviders = await make("link", "nav-providers", { label: "Providers", href: "/providers" });
const navBrokers = await make("link", "nav-brokers", { label: "Brokers", href: "/brokers" });
const navAbout = await make("link", "nav-about", { label: "About us", href: "/about" });
const ftFind = await make("link", "ft-find-dentist", { label: "Find a dentist", href: "/find-a-dentist" });
const ftLogin = await make("link", "ft-member-login", { label: "Member login", href: "/login" });
const ctaFindLink = await make("link", "link-find-dentist", { label: "Find a dentist", href: "/find-a-dentist" });

// --- Button ---
const btnFind = await make("button", "btn-find-dentist", { label: "Find a dentist", link: link(ctaFindLink), variant: "primary" });

// --- Meta ---
const meta = await make("meta", "meta-oral-health", {
  title: "5 toothbrush tips for a healthy mouth | Liberty Dental Plan",
  description: "Five dentist-approved toothbrush tips for a healthier mouth — choosing bristles, going electric, replacing your brush, and the 2-2-2 rule.",
  canonicalUrl: "https://example.com/members/oral-health-education/everyday-oral-health",
});

// --- Chrome ---
const header = await make("header", "global-header-member", {
  logo: link(mLogo), navLinks: [navMembers, navProviders, navBrokers, navAbout].map(link), cta: link(btnFind),
});
const footer = await make("footer", "global-footer", {
  logo: link(mLogo), linkColumns: [navMembers, navProviders, navBrokers, ftFind, ftLogin].map(link),
  legalText: "© 2026 Liberty Dental Plan. All Rights Reserved.",
});

// --- Sections ---
const banner = await make("banner", "banner-oral-health", { backgroundImage: link(mHero), variant: "image", height: "md" });
const mcb = await make("mediaContentBlock", "mcb-oral-health", {
  heading: "5 toothbrush tips for a healthy mouth", media: link(mBrush), mediaPlacement: "top", tone: "default",
});

const tips = [
  ["Get a toothbrush with soft bristles", "Dentists recommend brushes with soft bristles for most people. These are gentle on your teeth and gums."],
  ["For easier brushing, go electric", "An electric toothbrush does the work for you! Just hold the brush for a few seconds on each tooth."],
  ["Make sure your brush is approved by dentists", "When you get a new toothbrush, make sure it's high quality. Look for the American Dental Association (ADA) Seal of Acceptance on the package."],
  ["Replace your toothbrush often", "Replace your toothbrush every three to four months. Replace it sooner if the bristles get worn. For an electric toothbrush, replace the brush head."],
  ["Use the 2-2-2 rule", "For a healthy smile, brush for two minutes, two times a day. And visit your dentist two times a year!"],
];
const cardIds = [];
for (let i = 0; i < tips.length; i++) {
  cardIds.push(await make("card", `card-tip-${i + 1}`, { title: tips[i][0], body: pDoc(tips[i][1]), order: i + 1 }));
}
const collection = await make("cardCollection", "cc-oral-health-tips", { layout: "list", cards: cardIds.map(link) });

const source = await make("richTextBlock", "rt-oral-health-source", {
  width: "default",
  content: doc(para(text("Source: American Dental Association (ADA): "), hyperlink("https://mouthhealthy.org", "mouthhealthy.org."))),
});

// --- Page (last) ---
const page = await make("page", "page-members-oral-health-everyday", {
  slug: "/members/oral-health-education/everyday-oral-health",
  title: "5 toothbrush tips for a healthy mouth",
  meta: link(meta), header: link(header), footer: link(footer),
  sections: [banner, mcb, collection, source].map(link),
});

console.log(`\n🎉 Done. Page entry: ${page}`);
console.log("URL: /members/oral-health-education/everyday-oral-health");
