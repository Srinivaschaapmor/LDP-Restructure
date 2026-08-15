# ADR-0011: Restore the Contentful MCP server via a `.env`-reading launcher

- **Status:** Accepted — supersedes [ADR-0009](ADR-0009-remove-contentful-mcp-migration-only.md)
- **Date:** 2026-08-15
- **Deciders:** sai_dev1@aapmor.com, Claude

## Context
[ADR-0009](ADR-0009-remove-contentful-mcp-migration-only.md) removed the `contentful` entry from
`.mcp.json` because it never authenticated: `"CONTENTFUL_MANAGEMENT_ACCESS_TOKEN":
"${CONTENTFUL_MANAGEMENT_ACCESS_TOKEN}"` was substituted from the environment the *host process*
was launched with, never from the project's `.env`, so the server started with an empty token and
every call returned 401. That ADR's own follow-up said the decision should be revisited — and
superseded, not ignored — if connectivity were fixed. The user has now asked for the connection
back.

## Decision
Restore the server, but stop relying on `${VAR}` substitution in `.mcp.json`. A launcher script,
`contentful/mcp-launch.mjs`, reads the project's `.env` itself, maps the project's variable names
onto the ones the server expects (`CONTENTFUL_SPACE_ID` → `SPACE_ID`, `CONTENTFUL_ENVIRONMENT_ID`
→ `ENVIRONMENT_ID`, `CONTENTFUL_DELIVERY_ACCESS_TOKEN` → `CONTENTFUL_DELIVERY_TOKEN`), and execs
`@contentful/mcp-server` over stdio. Real process-environment values still win over `.env`, so a
CI or shell-exported token overrides the file.

```json
"contentful": { "command": "node", "args": ["contentful/mcp-launch.mjs"] }
```

`@contentful/mcp-server@1.15.0` is now a pinned devDependency rather than an `npx -y` fetch, so
the server version is reproducible and start-up needs no network.

**The write path for the content model does not change.** `contentful-migration` scripts in
`contentful/migrations/` remain the only sanctioned way to create or modify content types and
fields ([contentful-development] rules 3/8/12, ADR-0003) — they are versioned, reviewable, and
replayable, which MCP tool calls are not. The MCP server is a **live read/inspection layer**: it
answers "what does the space actually contain right now", which previously required replaying 19+
migration files by hand.

## Rationale
- The root cause in ADR-0009 was a config-plumbing failure, not a problem with the server or the
  credentials — the same token in `.env` authenticates fine once it actually reaches the process.
- Reading the live space closes the exact gap ADR-0009 listed as its main cost: `content-model-analyst`
  and `figma-fidelity-auditor` had to infer the current schema from migration history and trust that
  the docs were current.
- Keeping migrations as the write path preserves ADR-0003's source-of-truth guarantee, so restoring
  a convenience layer costs nothing in reviewability.

## Consequences
- Positive: live verification of "does this type/field/entry already exist" before writing a
  migration; `.env` is the single place credentials live, matching every other Contentful script in
  the repo; no `${VAR}` substitution behavior to depend on.
- Negative / trade-offs: the launcher is one more moving part, and it only works when the session's
  cwd is the project root (how Claude Code launches project-scoped `.mcp.json` servers). The server
  exposes 70 tools including destructive ones (`delete_*`, `publish_*`); the migrations-only rule is
  a documented convention, not an enforced permission boundary.
- Follow-ups: if content-type writes via MCP are ever allowed, this ADR must be superseded — the
  agent definitions and [contentful-development] rule 3 are written assuming migrations-only.

## Verification
`node contentful/verify-mcp.mjs` (2026-08-15) — handshake OK, `serverInfo` `@contentful/mcp-server`,
70 tools listed, `get_initial_context` returned Space ID `rkr4g3dq1bbc`. Token value never surfaced.
