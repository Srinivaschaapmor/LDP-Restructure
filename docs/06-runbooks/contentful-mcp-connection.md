# Runbook · Contentful MCP connection

How to configure and verify the **Contentful MCP server** used to read/write the content
model and entries from Claude Code. Configured in `.mcp.json` (project root).

## Server
Official **`@contentful/mcp-server`** (npm, maintained by Contentful), run via `npx`.
Repo: https://github.com/contentful/contentful-mcp-server

Exposes tools for content types, entries, assets, locales, tags, spaces/environments,
and AI actions — e.g. `get_initial_context`, `list_spaces`, `list_content_types`,
`search_entries`, `create_entry`, `publish_entry`.

## Configuration (`.mcp.json`)
```json
"contentful": {
  "command": "npx",
  "args": ["-y", "@contentful/mcp-server"],
  "env": {
    "CONTENTFUL_MANAGEMENT_ACCESS_TOKEN": "${CONTENTFUL_MANAGEMENT_ACCESS_TOKEN}",
    "SPACE_ID": "${CONTENTFUL_SPACE_ID}",
    "ENVIRONMENT_ID": "${CONTENTFUL_ENVIRONMENT_ID:-master}"
  }
}
```
**Secrets never live in the repo.** Every value is an env-var reference. The committed
file contains no token and no space ID — those come from your environment at runtime.

| Env var | Required | Secret? | Notes |
|---|---|---|---|
| `CONTENTFUL_MANAGEMENT_ACCESS_TOKEN` | ✅ | 🔒 **Yes** | Contentful **Content Management API** personal access token |
| `CONTENTFUL_SPACE_ID` | ✅ | No | Your Space ID (Contentful → Settings → General) |
| `CONTENTFUL_ENVIRONMENT_ID` | ❌ | No | Defaults to `master` |

## Set the environment variables (you do this — never paste the token into chat or a file)
Create the CMA token: Contentful → **Settings → API keys → Content management tokens →
Generate personal token**. Then, in **PowerShell**, persist them for future processes:
```powershell
setx CONTENTFUL_MANAGEMENT_ACCESS_TOKEN "<your-CMA-token>"
setx CONTENTFUL_SPACE_ID "<your-space-id>"
# optional: setx CONTENTFUL_ENVIRONMENT_ID "master"
```
`setx` affects **new** processes only — open a fresh terminal (and restart Claude Code)
afterward. Treat the token like a password; rotate it in Contentful if it ever leaks.

## Verify the connection
### A. Credential smoke-test (no Claude Code needed)
In a shell where the env vars are set, confirm the token+space reach the CMA API. This
prints the space name on success and never echoes the token:
```bash
curl -s -H "Authorization: Bearer $CONTENTFUL_MANAGEMENT_ACCESS_TOKEN" \
  "https://api.contentful.com/spaces/$CONTENTFUL_SPACE_ID" | grep -i '"name"'
```
`200` + your space name = credentials good. `401` = bad/expired token. `404` = wrong space ID.

### B. Inside Claude Code (the real integration check)
1. Ensure the env vars are set (step above) and `npx`/Node are on PATH.
2. Start Claude Code in the **project root** so it reads `.mcp.json`; approve the trust
   prompt for the `contentful` server.
3. Confirm with `/mcp` (interactive) — `contentful` should be **connected**, exposing
   `mcp__contentful__*` tools.
4. Call `get_initial_context` (the server asks you to run this first), then `list_spaces`
   or `list_content_types` to confirm live reads.

## Common failures
- **`connection closed` / server won't start** — Node/`npx` not on PATH, or first `npx`
  run still downloading the package. Retry after it caches.
- **`401 Unauthorized`** — token missing, wrong, or expired. Re-generate; re-run `setx`;
  open a new terminal.
- **`404` / empty results** — wrong `SPACE_ID` or `ENVIRONMENT_ID`.
- **Env var not picked up** — set with `setx` but reusing an old terminal. `setx` only
  affects new processes; restart the terminal and Claude Code.

## Verification log
- **2026-07-07** — Server configured in `.mcp.json` (env-var based, no secrets committed).
- **2026-07-07 — Credential smoke-test (check A) PASSED.** Sourced `.env` and called the CMA
  API: `GET /spaces/{id}` → `200`, space name **"Development"**; environments `master` + `ready`
  present; `master` currently has **0 content types** (empty content model — expected pre-modeling).
  CMA token + Space ID + environment confirmed reachable. Token value never surfaced.
  STILL PENDING (check B): loading the server *inside Claude Code* — requires the env vars in
  Claude Code's process environment AND a session launched in the project root so `.mcp.json`
  loads. Not yet exercised (this session's cwd is the Desktop).
