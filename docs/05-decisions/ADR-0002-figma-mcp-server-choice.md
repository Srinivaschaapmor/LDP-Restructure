# ADR-0002: Figma MCP server — plugin server is primary, Dev Mode server is committed fallback

- **Status:** Accepted
- **Date:** 2026-07-07
- **Deciders:** sai_dev1@aapmor.com, Claude (mentor)

## Context
Phase 0 · Step 3 verified that Claude Code can reach Figma over MCP. Verification
surfaced **two** distinct Figma MCP servers available to the workflow, configured in
different places and with different capabilities:

1. **Official Figma plugin server** (`mcp__plugin_figma_figma__*`) — installed as a
   Claude Code **plugin** (per-user, *not* captured in the repo). Cloud-authenticated
   (verified via `whoami` as shaikshanawazh@aapmor.com, AAPMOR Team). Rich surface:
   read **and** write (`use_figma`, `generate_figma_design`, `create_new_file`),
   Code Connect, design-system search, plus all read tools. Works from any
   `figma.com` URL and does **not** require the Figma desktop app to be open.
2. **Figma Dev Mode server** (`figma-dev-mode`, `http://127.0.0.1:3845/mcp`) —
   declared in the repo's **`.mcp.json`** (project-committed, portable to teammates).
   Local-only, **read-only** (`get_design_context`, `get_variable_defs`,
   `get_screenshot`, `get_metadata`, `get_figjam`). Requires the Figma **desktop app**
   open with Dev Mode MCP enabled. Uniquely can read the **current desktop selection**
   with no URL.

We must decide which is canonical for day-to-day design→code work, and what the repo
commits, without silently depending on a per-user plugin install.

## Options considered
1. **Plugin server only; remove `figma-dev-mode` from `.mcp.json`** — simplest tool
   surface, but leaves the repo with *zero* committed Figma config; every teammate/CI
   session depends on having the plugin installed. Loses current-selection reads.
2. **Dev Mode server only (repo config), ignore the plugin** — fully committed and
   portable, but read-only and desktop-app-dependent; forfeits code→design (write),
   Code Connect, and URL-based reads that the plugin already provides and that the
   roadmap (Design System, Components) will want.
3. **Plugin primary + Dev Mode retained as committed fallback** — use the plugin for
   day-to-day work; keep `figma-dev-mode` in `.mcp.json` as the portable, committed
   fallback and for its unique current-selection reads. Slight overlap in read tools,
   but namespaces differ (`mcp__plugin_figma_figma__*` vs `mcp__figma-dev-mode__*`) so
   there is no collision.

## Decision
Adopt **Option 3**. The **official Figma plugin server is the primary** integration for
design→code and code→design work. The **`figma-dev-mode` server stays in `.mcp.json`**
as a documented, optional fallback (portable committed config + current-selection reads).
`.mcp.json` requires **no structural change** as a result of this decision.

## Rationale
- The plugin is verified working and is the only option offering **write / code→design**,
  Code Connect, and desktop-independent URL reads — capabilities the Design System and
  Components phases depend on.
- Keeping a **committed** `.mcp.json` entry honors ADR-0001 (repo is source of truth):
  the repo still carries a working Figma configuration and does not silently rely on a
  per-user plugin install.
- The two servers are complementary, not redundant; namespaced tool names prevent any
  ambiguity about which server served a call.

## Consequences
- Positive: full read+write design workflow available now; repo remains self-describing
  for Figma; current-selection reads still possible via Dev Mode when the desktop app is open.
- Negative / trade-offs: two servers can expose overlapping read tools — contributors must
  know the plugin is primary (documented in the runbook). Dev Mode fallback only functions
  while the Figma desktop app is running.
- Follow-ups: none blocking. If the team standardizes on the plugin org-wide, revisit
  whether to drop the `figma-dev-mode` entry (would supersede this ADR).
