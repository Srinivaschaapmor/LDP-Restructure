# Runbook · Building a page, start to finish

The operating manual for [figma-to-development-workflow] — what to type, what to run, and what
you get back at each of the 8 steps. Process rationale lives in
`docs/05-decisions/ADR-0010-figma-to-development-workflow-v2.md`; this file is the how.

**Placeholders used below:** `<FIGMA_URL>` · `<SLUG>` · `<PAGE_NAME>`

---

## The shape of it

```
Figma ─┬─► 2 design context ──────────────┐
       │                                  ├─► 6 build ─► 7 validate ─► 8 review
       └─► 3 model mapping ─► 4 entries ─► 5 JSON ──────┘
```

Two inputs converge at Step 6. Everything before it exists to make both trustworthy.

> **The one rule that governs everything:**
> The JSON never supplies a design value. The design never supplies a data shape.
> Structure and content come from Contentful. Every pixel comes from Figma.

## At a glance

| Step | What | Who | Output |
|---|---|---|---|
| 1 | Connect Figma MCP | you | a healthy server |
| 2 | Extract design context | `figma-design-analyst` | design report |
| 3 | Map onto content model | `content-model-analyst` | field specs + authoring list |
| 4 | **Author entries** | **you** | content live in Contentful |
| 5 | Fetch page JSON | script | `.cache/page-<slug>.json` |
| 6 | Reuse pass, then build | `reuse-scout` → Claude | working page |
| 7 | Validate | `figma-fidelity-auditor` + `dod-auditor` | PASS/FAIL |
| 8 | Review | `code-reviewer` | findings |

Steps 2 → 3 → 6 are strictly sequential; each consumes the previous report. The two Step 7
auditors run in parallel.

---

## Step 1 · Connect Figma MCP

Open the Figma **desktop app** with your file. Confirm Preferences → *Enable Dev Mode MCP server*.
The server only runs while the desktop app is open — there is no cloud endpoint.

Verify:

```bash
curl -s -o /dev/null -w "%{http_code}\n" -X POST http://127.0.0.1:3845/mcp -H "Content-Type: application/json" -H "Accept: application/json, text/event-stream" -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"verify","version":"1.0"}}}'
```

`200` = healthy. Anything else → `docs/06-runbooks/figma-mcp-connection.md`.

---

## Step 2 · Extract design context

Say to Claude:

> Run the figma-design-analyst agent on `<FIGMA_URL>`. Read every breakpoint frame and return
> the full Step 2 report.

**You get back:** ordered section list with node IDs, exact tokens (color, type, spacing, radius),
responsive behavior per breakpoint, repeated patterns worth componentizing, a CMS-vs-static
recommendation, and open questions.

**Expect this to be slow** on a large page — it is many small MCP calls by design. Big root frames
time out, so the agent drills into children.

**Do not export assets yet.** Figma URLs expire in about a week; assets come out during Step 6.

---

## Step 3 · Map onto the content model

> Run the content-model-analyst agent using the Step 2 report above.

**You get back:** each section mapped to an existing content type (or justified as genuinely new),
migration-ready field specs, the entry authoring list, and open questions.

> ⚠️ **Settle every question the report flags as *"changes the migration"* before Step 4.**
> Reworking a field is minutes now and hours once entries reference each other.

**The guardrail:** one type plus variants, never a type per visual variation. A `newsCard` next to
a `card` is the failure mode this step exists to prevent.

---

## Step 4 · Author entries · **you** · ⛔ gates everything after

### 4a — Fields, by migration only

Never add fields through the Contentful web UI. That desyncs the live model from
`contentful/migrations/`, and the next environment can't be rebuilt from code.

```bash
set -a; . ./.env; set +a; node_modules/.bin/contentful-migration -s "$CONTENTFUL_SPACE_ID" -e "$CONTENTFUL_ENVIRONMENT_ID" -a "$CONTENTFUL_MANAGEMENT_ACCESS_TOKEN" -y contentful/migrations/0XX-your-migration.js
```

Run from **Git Bash**. `npm run cf:migrate` fails on Windows — npm uses cmd.exe, which doesn't
expand `$VAR`, so the token arrives literally and auth fails.

### 4b — Entries, by hand

Author in dependency order, or references won't resolve:

```
media · link · richTextItem   →   button · card   →   sections   →   page
```

**Author two fixtures per section type:**

| Fixture | Contains | Why |
|---|---|---|
| **Fully populated** | every optional field filled | otherwise optional fields are invisible in Step 5 and never get built |
| **Minimal** | required fields only | proves empty-state handling in Step 7 |

**Publish everything.** The delivery API does not serve drafts — an unpublished page returns
nothing in Step 5, and it looks like a credentials error.

---

## Step 5 · Fetch the page JSON

```bash
MSYS_NO_PATHCONV=1 node contentful/scripts/fetch-page-json.mjs "<SLUG>"
```

Drop the `MSYS_NO_PATHCONV=1` prefix in PowerShell — it exists because Git Bash rewrites a leading
`/` into a Windows path.

Writes `.cache/page-<slug>.json` (gitignored) and prints a section-type summary:

```
wrote .cache/page-providers-resource-library.json
sections: 2
  banner: 1
  resourceLibrary: 1
```

**How it works:** the API returns the page with references as flat link stubs, plus a bag of every
referenced entry and asset. The SDK stitches them into a nested object graph. `include: 10` (the
API maximum) controls how deep. Anything deeper stays a stub — the script warns if it sees any.

**Read the JSON. Don't derive types from it.** It only contains fields that are *populated* and
only the variant values this page uses. Types come from the content model.

---

## Step 6 · Reuse pass, then build

### 6a — Reuse pass

> Run the reuse-scout agent for `<PAGE_NAME>` using `.cache/page-<SLUG>.json` and the Step 2
> design report.

**You get back:** reuse as-is / extend / genuinely new, each with a target file path, the decisions
to make before writing (Server vs. Client Component, image sizing, heading levels, responsive
approach), and any design↔JSON mismatches.

This runs **before** any code. Reusability is decided here — Step 8 can only complain about it
afterwards.

### 6b — Build

> Build `<PAGE_NAME>` following the reuse-scout plan. Use the JSON for data shape and
> `<FIGMA_URL>` for every visual value.

Export Figma assets now, and store them in Contentful — never `/public`.

---

## Step 7 · Validate

Run both auditors together:

> Run the figma-fidelity-auditor agent on `<FIGMA_URL>` against the files just built, and the
> dod-auditor agent on the same change. Run both in parallel.

| Agent | Checks |
|---|---|
| `figma-fidelity-auditor` | computed spacing/color/type vs. Figma at every breakpoint · CMS mapping · real Figma assets · **empty and overflow states** against your minimal fixture |
| `dod-auditor` | the full Definition of Done — code quality, a11y, SEO, tests, docs, commit hygiene |

Both return PASS/FAIL per item plus an overall verdict. Neither fixes anything.

---

## Step 8 · Review

> Run the code-reviewer agent on the diff for `<PAGE_NAME>`.

```bash
git diff --stat
```

Findings only — no fixes applied.

---

## Shortcut

Rather than driving each step:

> /figma-to-development-workflow

Then: *"start Step 2 on `<FIGMA_URL>`"*. Claude follows the sequence and stops at Step 4 for you.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| MCP call times out or drops | root frame too large | drill into child nodes; go one level deeper rather than retrying |
| Metadata looks suspiciously shallow | silent truncation | assume truncation, not an empty node |
| Copy reads `Typography` / `Large Title (34/40)` | those are layer names, not content | pull real text via `get_design_context` |
| `no page entry found for slug` | entry unpublished, or Git Bash ate the leading `/` | publish it; add `MSYS_NO_PATHCONV=1` |
| Section summary shows `unresolved` | a referenced entry is unpublished, or nesting exceeds include depth | publish it; check nesting depth |
| Migration: *"space does not exist or you do not have access"* | `npm run` on Windows didn't expand `$VAR` | run the binary directly from Git Bash (Step 4a) |
| Assets 404 mid-build | Figma URLs expired (~7 days) | re-export from Figma |
| Write blocked by a standards hook | `console.*`, a code comment, or CSS outside `styles/` | fix it — the hook is enforcing `project-coding-standards` |

---

## Related

- [figma-to-development-workflow] — the process itself
- [figma-mcp-workflow] — design-fidelity technique · rule 12 = extraction mechanics
- [contentful-development] — rules 12 (fixtures) and 13 (JSON as a dev input)
- `docs/05-decisions/ADR-0010-figma-to-development-workflow-v2.md` — why the process changed
- `docs/06-runbooks/figma-mcp-connection.md` — MCP connection troubleshooting
