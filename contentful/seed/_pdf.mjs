// Shared dummy-PDF helpers for seed scripts (coding-standards §1: extract shared logic).

// kebab-case slug for internalName / filenames (ascii-only, no punctuation).
export const slug = (s) =>
  String(s).toLowerCase().replace(/\([^)]*\)/g, " ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

// Minimal single-page PDF (Helvetica) printing `title` — valid xref so Contentful accepts
// it as application/pdf. Placeholder only; swap the asset file for the real document later.
export function makeDummyPdf(title) {
  const safe = String(title).replace(/[\\()]/g, (c) => "\\" + c);
  const objs = [
    "<</Type/Catalog/Pages 2 0 R>>",
    "<</Type/Pages/Kids[3 0 R]/Count 1>>",
    "<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Resources<</Font<</F1 4 0 R>>>>/Contents 5 0 R>>",
    "<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>",
  ];
  const stream = `BT /F1 20 Tf 72 700 Td (${safe}) Tj 0 -28 Td /F1 12 Tf (Placeholder document - replace this file.) Tj ET`;
  objs.push(`<</Length ${Buffer.byteLength(stream)}>>\nstream\n${stream}\nendstream`);

  let pdf = "%PDF-1.4\n";
  const offsets = [];
  objs.forEach((body, i) => { offsets.push(Buffer.byteLength(pdf)); pdf += `${i + 1} 0 obj\n${body}\nendobj\n`; });
  const xrefStart = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
  offsets.forEach((o) => { pdf += String(o).padStart(10, "0") + " 00000 n \n"; });
  pdf += `trailer\n<</Size ${objs.length + 1}/Root 1 0 R>>\nstartxref\n${xrefStart}\n%%EOF`;
  return Buffer.from(pdf, "binary");
}
