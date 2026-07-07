# Runbook · Figma MCP connection

How to verify and (re)connect the Figma MCP integration used to pull design context,
variables, and screenshots into Claude Code (and to push code→design).

## Which server do we use? (see ADR-0002)
Two Figma MCP servers are available, and they are **complementary**:

| Server | Configured in | Auth | Capabilities | Needs desktop app? |
|---|---|---|---|---|
| **Figma plugin** (`mcp__plugin_figma_figma__*`) — **PRIMARY** | Claude Code plugin (per-user, not in repo) | Cloud (`whoami`) | Read **+ write**, Code Connect, design-system search | No — works from any `figma.com` URL |
| **Dev Mode** (`figma-dev-mode`) — committed fallback | `.mcp.json` (repo) | Local | Read-only; unique **current-selection** read w/o URL | Yes |

**Day-to-day: use the plugin server.** The `figma-dev-mode` entry stays in `.mcp.json`
as the portable committed fallback (and for current-selection reads). Decision + rationale:
`docs/05-decisions/ADR-0002-figma-mcp-server-choice.md`.

## Dev Mode fallback configuration

## Configuration
`.mcp.json` (project root):
```json
{ "mcpServers": { "figma-dev-mode": { "type": "http", "url": "http://127.0.0.1:3845/mcp" } } }
```
The server is **local** — it runs inside the Figma **desktop app** (Dev Mode MCP
server must be enabled: Figma → Preferences → *Enable Dev Mode MCP server*). It only
listens while the Figma desktop app is open. There is no remote/cloud endpoint.

## Verify the server is up (transport level)
The endpoint speaks JSON-RPC over streamable HTTP. A bare `GET` returns `HTTP 400`
(expected). To confirm it is truly functional, run an `initialize` handshake:

```bash
curl -s -X POST http://127.0.0.1:3845/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"verify","version":"1.0"}}}'
```
Healthy response: `200 OK`, an `mcp-session-id` header, and
`serverInfo.name = "Figma Dev Mode MCP Server"`.

## Tools exposed (as of 2026-07-06)
- `get_design_context` — structured design data for the current selection/node
- `get_variable_defs` — variables/design tokens (colors, spacing, type)
- `get_screenshot` — image of the selection/node
- `get_metadata` — node metadata
- `get_figjam` — FigJam board content

## Connect it inside Claude Code
The `curl` check only proves the *server* is healthy. Claude Code loads project
`.mcp.json` servers only after you **trust** them, and only if `.mcp.json` existed
when the session started. There are two ways to grant that trust:

**Declarative (repo-first — what this project uses).** `.claude/settings.json` (committed)
pre-approves the server so no interactive prompt ever appears:
```json
{ "enabledMcpjsonServers": ["figma-dev-mode"] }
```
This is versioned and reviewable per ADR-0001 — every teammate/session that starts in the
project root gets the server trusted automatically. `.gitignore` deliberately excludes only
`.claude/settings.local.json`, so this file is committed.

**Interactive (fallback).** Without the setting, Claude Code shows a one-time trust prompt
per machine on first use — not versioned.

Either way, the tools only load in a session that **starts in the project root** (settings
and `.mcp.json` are both read at startup):
1. Ensure the Figma desktop app is open with the target file and Dev Mode MCP enabled.
2. Start a fresh Claude Code session with the project root as the working directory
   (`cd` into `enterprise-app-test` first, or launch it there) so it reads `.mcp.json`
   **and** `.claude/settings.json`. A session started elsewhere (e.g. the Desktop or home
   folder) will not load either.
3. With `enabledMcpjsonServers` set, no trust prompt appears; otherwise approve it once.
4. Confirm with `claude mcp list` (or `/mcp` in an interactive terminal) — status should be
   *connected*, exposing `mcp__figma-dev-mode__*` tools.

## Verification log
- **2026-07-06** — Transport check PASSED: `initialize` handshake returned `200 OK`,
  `mcp-session-id` header, `serverInfo.name = "Figma Dev Mode MCP Server"` (v1.0.0),
  advertising tools/resources/prompts. Figma desktop + Dev Mode MCP confirmed running.
  Claude Code integration NOT yet active: `mcp__figma-dev-mode__*` tools absent because
  the session predated `.mcp.json` (written 16:14). Remedy: restart session in project
  root + approve trust prompt (see below). Re-verify tools load after restart.
- **2026-07-06 (re-check)** — Transport re-confirmed and extended: `initialize` PASSED
  (`200 OK`, `mcp-session-id`, `serverInfo.name = "Figma Dev Mode MCP Server"` v1.0.0),
  port 3845 LISTENING. Went one step further than the prior check — a `tools/list` call
  with the returned session id enumerated all 5 tools (`get_design_context`,
  `get_variable_defs`, `get_screenshot`, `get_metadata`, `get_figjam`), matching the list
  above. Server side fully green. Claude Code integration still pending the same remedy:
  this session's cwd is the Desktop, not the project root, so `.mcp.json` was not loaded
  and no `mcp__figma-dev-mode__*` tools are present.
- **2026-07-07 — STEP 3 CLOSED (via plugin server).** The official Figma **plugin**
  server is connected and fully exercised end-to-end: `whoami` PASSED (authenticated as
  shaikshanawazh@aapmor.com, AAPMOR Team); `get_metadata`, `get_design_context`, and
  `get_screenshot` all returned real data for file `4UxJeqzAVXcc2mtlwkTQKO` (the
  "5 toothbrush tips" responsive page, nodes `2:139`/`2:140`). Design→code round-trip
  confirmed working. Canonical-server decision recorded in ADR-0002 (plugin primary,
  Dev Mode retained as committed fallback). `.mcp.json` unchanged by design. **Phase 0 ·
  Step 3 is complete.** The Dev Mode fallback itself was NOT loaded this session (cwd is
  the Desktop, not the project root); to exercise it, relaunch in the project root per the
  steps above.
- **2026-07-06 (approval configured)** — Root cause of the client-side gap refined:
  `claude mcp list` now shows `figma-dev-mode … ⏸ Pending approval`, i.e. `.mcp.json` **is**
  discovered; the only remaining blocker was trust. Fixed the repo-first way: created
  `.claude/settings.json` with `enabledMcpjsonServers: ["figma-dev-mode"]` (committed, valid
  JSON verified). This pre-approves the server with no interactive prompt. Note: `claude mcp
  list` still reported *Pending approval* immediately after, because settings are read at
  **session start** — the running CLI/session predates the new file and its cwd is not the
  project root. Verification pending: launch a fresh session in the project root and confirm
  `mcp__figma-dev-mode__*` tools load with no prompt.

## Common failures
- **Connection refused / no response on 3845** — Figma desktop app not running, or Dev Mode MCP server not enabled in Preferences.
- **`HTTP 400` on GET** — normal; use the `initialize` POST above instead.
- **Server healthy but no `mcp__figma-dev-mode__*` tools in Claude Code** — the session didn't start in the project root, or started before `.mcp.json`/`.claude/settings.json` existed. Start a fresh session with the project root as cwd; approval is already handled by `enabledMcpjsonServers` in `.claude/settings.json`.
- **`claude mcp list` says `⏸ Pending approval` even though `enabledMcpjsonServers` is set** — expected if the file was added after the current session/CLI started; settings are read at startup. Start a fresh session in the project root; it should then show *connected*.
