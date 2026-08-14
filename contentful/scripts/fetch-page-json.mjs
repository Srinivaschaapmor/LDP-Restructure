#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import contentful from "contentful";

const { createClient } = contentful;

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const OUT_DIR = resolve(ROOT, ".cache");

const REQUIRED = ["CONTENTFUL_SPACE_ID", "CONTENTFUL_DELIVERY_ACCESS_TOKEN"];

async function loadEnv() {
  let raw;
  try {
    raw = await readFile(resolve(ROOT, ".env"), "utf8");
  } catch {
    return;
  }
  for (const line of raw.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/i);
    if (!match) continue;
    const value = match[2].trim().replace(/^["'](.*)["']$/, "$1");
    if (!(match[1] in process.env)) process.env[match[1]] = value;
  }
}

function slugToFilename(slug) {
  const cleaned = slug.replace(/^\/+|\/+$/g, "").replace(/[^a-z0-9]+/gi, "-");
  return `page-${cleaned || "home"}.json`;
}

await loadEnv();

const slug = process.argv[2];
if (!slug) {
  process.stderr.write("usage: node contentful/scripts/fetch-page-json.mjs <slug>\n");
  process.stderr.write('example: node contentful/scripts/fetch-page-json.mjs "/"\n');
  process.stderr.write("note: on Git Bash, prefix with MSYS_NO_PATHCONV=1 or the leading / is rewritten to a Windows path\n");
  process.exit(1);
}

const missing = REQUIRED.filter((key) => !process.env[key]);
if (missing.length) {
  process.stderr.write(`missing env: ${missing.join(", ")}\n`);
  process.exit(1);
}

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_DELIVERY_ACCESS_TOKEN,
  environment: process.env.CONTENTFUL_ENVIRONMENT_ID || "master",
});

const res = await client.getEntries({
  content_type: "page",
  "fields.slug": slug,
  include: 10,
  limit: 1,
});

if (!res.items.length) {
  process.stderr.write(`no page entry found for slug "${slug}"\n`);
  process.stderr.write("check the slug exists and the entry is PUBLISHED (CDA hides drafts)\n");
  process.exit(2);
}

await mkdir(OUT_DIR, { recursive: true });
const outPath = resolve(OUT_DIR, slugToFilename(slug));
await writeFile(outPath, JSON.stringify(res.items[0], null, 2), "utf8");

const sections = res.items[0]?.fields?.sections ?? [];
const byType = sections.reduce((acc, s) => {
  const id = s?.sys?.contentType?.sys?.id ?? "unresolved";
  acc[id] = (acc[id] || 0) + 1;
  return acc;
}, {});

process.stdout.write(`wrote ${outPath}\n`);
process.stdout.write(`sections: ${sections.length}\n`);
for (const [type, count] of Object.entries(byType)) {
  process.stdout.write(`  ${type}: ${count}\n`);
}
if (byType.unresolved) {
  process.stdout.write("warning: unresolved links present — raise include depth or check publish state\n");
}
