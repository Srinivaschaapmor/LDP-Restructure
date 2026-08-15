# Runbook · Contentful MCP connection

How to configure and verify the **Contentful MCP server** used to read the live content model and
entries from Claude Code. Configured in `.mcp.json` (project root).

> **Read-only by convention (ADR-0011).** The server exposes write tools (`create_content_type`,
> `delete_entry`, `publish_*`, …). Do not use them for the content model: content types and fields
> are created and changed **exclusively** through `contentful-migration` scripts in
> `contentful/migrations/` and seed scripts in `contentful/seed/*.mjs` — see
> [contentful-development] rules 3/8/12 and ADR-0009, which still binds.

## Server
Official **`@contentful/mcp-server`** (npm, maintained by Contentful), pinned as a devDependency
at **1.15.0**. Repo: https://github.com/contentful/contentful-mcp-server

Exposes 70 tools across content types, entries, assets, locales, tags, spaces/environments and AI
actions — e.g. `get_initial_context` (call this first; the server asks for it), `list_content_types`,
`search_entries`, `get_entry`.

## Configuration (`.mcp.json`)
```json
"contentful": {
  "command": "node",
  "args": ["contentful/mcp-launch.mjs"]
}
```

**No secrets in the committed config, and no `${VAR}` substitution.** The launcher
(`contentful/mcp-launch.mjs`) reads the gitignored `.env` at the project root itself. This is the
fix for the failure recorded in ADR-0009: Claude Code substitutes `${VAR}` in `.mcp.json` only from
the environment the host process was launched with — never from `.env` — so the old config started
the server with an empty token and every call returned 401.

The launcher maps this project's variable names onto the ones the server expects. Real
process-environment values take precedence over `.env`, so an exported/CI value still wins.

| `.env` variable | Passed to server as | Required | Secret? |
|---|---|---|---|
| `CONTENTFUL_MANAGEMENT_ACCESS_TOKEN` | same | ✅ | 🔒 **Yes** — CMA personal access token |
| `CONTENTFUL_SPACE_ID` | `SPACE_ID` | ✅ | No |
| `CONTENTFUL_ENVIRONMENT_ID` | `ENVIRONMENT_ID` | ❌ (defaults `master`) | No |
| `CONTENTFUL_DELIVERY_ACCESS_TOKEN` | `CONTENTFUL_DELIVERY_TOKEN` | ❌ | 🔒 Yes |

Create the CMA token at Contentful → **Settings → API keys → Content management tokens → Generate
personal token**, and put it in `.env` (already gitignored). Treat it like a password; rotate it in
Contentful if it ever leaks. Never paste it into chat, `.mcp.json`, or any tracked file.

## Verify the connection
### A. Credential smoke-test (no Claude Code needed)
Confirms the token + space reach the CMA API. Prints the space name; never echoes the token:
```bash
set -a && . ./.env && set +a && curl -s -H "Authorization: Bearer $CONTENTFUL_MANAGEMENT_ACCESS_TOKEN" "https://api.contentful.com/spaces/$CONTENTFUL_SPACE_ID" | grep -i '"name"'
```
`200` + your space name = credentials good. `401` = bad/expired token. `404` = wrong space ID.

### B. Server handshake (the real integration check)
```bash
node contentful/verify-mcp.mjs
```
Spawns the server through the same launcher `.mcp.json` uses, performs the JSON-RPC `initialize`
handshake, lists tools, and calls `get_initial_context`. Success prints `serverInfo`, the tool
count, the resolved Space ID, and `✅ Contentful MCP server started and authenticated.`

### C. Inside Claude Code
1. Start Claude Code in the **project root** so `.mcp.json` loads (the launcher's `args` path is
   relative to the project root).
2. Approve the trust prompt for the `contentful` server on first run. It is listed in
   `.claude/settings.json` → `enabledMcpjsonServers`.
3. A session started before the server was added will not see it — **restart the session**.
4. Confirm with `/mcp` (interactive) — `contentful` should be **connected**, exposing
   `mcp__contentful__*` tools. Call `get_initial_context` first, then `list_content_types`.

## Common failures
- **Tools absent in an existing session** — `.mcp.json` is read at session start. Restart Claude Code.
- **`missing CONTENTFUL_MANAGEMENT_ACCESS_TOKEN, …`** — the launcher found no `.env` or no value.
  Check the project root `.env`; confirm the cwd is the project root.
- **`Cannot find module .../@contentful/mcp-server/dist/index.js`** — dependencies not installed.
  Run `npm install`.
- **`401 Unauthorized`** — token wrong, expired, or scoped to another org. Re-generate and update `.env`.
- **`404` / empty results** — wrong `CONTENTFUL_SPACE_ID` or `CONTENTFUL_ENVIRONMENT_ID`.

## Verification log
- **2026-07-07** — Server configured in `.mcp.json` (env-var references). Credential smoke-test
  (check A) PASSED: `GET /spaces/{id}` → `200`, space **"Development"**; environments `master` +
  `ready`. Check B never passed — see ADR-0009.
- **2026-08-07** — Server removed from `.mcp.json` (ADR-0009); `${VAR}` substitution never resolved,
  every call 401'd.
- **2026-08-15** — Server restored via `contentful/mcp-launch.mjs` (ADR-0011). **Check B PASSED:**
  `@contentful/mcp-server` handshake OK, **70 tools** listed, `get_initial_context` returned Space ID
  `rkr4g3dq1bbc`. Token value never surfaced. Check C pending a session restart by the user.
