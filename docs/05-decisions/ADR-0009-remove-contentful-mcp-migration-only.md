# ADR-0009: Remove the Contentful MCP server — content types are created via migrations only

- **Status:** Accepted
- **Date:** 2026-08-07
- **Deciders:** sai_dev1@aapmor.com, Claude (mentor)

## Context
The Contentful MCP server (`@contentful/mcp-server`, configured in `.mcp.json` per the now-
deprecated `docs/06-runbooks/contentful-mcp-connection.md`) never reached a working connection —
every `get_space` call returned a 401, traced to the management token substitution
(`${CONTENTFUL_MANAGEMENT_ACCESS_TOKEN}`) never resolving because the harness only substitutes
`.mcp.json` placeholders from the process environment the host was launched with, not from the
project's `.env` file. The user has decided not to pursue fixing this and to work without a
live Contentful MCP connection going forward.

## Decision
Remove the `contentful` entry from `.mcp.json`. Content types, fields, validations, and entries
are created and modified **exclusively** through the existing, already-proven workflow:
`contentful-migration` CLI scripts in `contentful/migrations/*.js` and seed scripts in
`contentful/seed/*.mjs`, per [contentful-development] rules 3 (dependency order + `-a` auth
flag + reference whitelists), 8 (Windows/Git Bash env-sourcing gotcha), and 9 (constrain every
new field at creation time).

The `content-model-analyst` agent (Phase 2 of [figma-to-development-workflow]) no longer claims
any live-CMS tool access. It now works entirely from `docs/03-content-model/section-model-spec.md`
and the full migration history, and its output includes a migration-ready field/type spec (in the
same shape as an existing migration file) rather than just a prose proposal — this is what a human
turns directly into the next `contentful/migrations/0XX-*.js` file.

## Rationale
- The migration-based workflow was already the project's real source of truth (ADR-0003: "Keep
  migrations versioned in `contentful/migrations/` — they are the source of truth") — the MCP
  server was always a read/convenience layer on top of it, never the only way to model content.
- 19 migrations already exist and demonstrably work; nothing about content modeling was actually
  blocked by the MCP token failure.
- Removing a non-functional, never-connected server from `.mcp.json` keeps the repo's committed
  config honest (ADR-0001: repo is source of truth) — a listed-but-broken server is worse than no
  server.

## Consequences
- Positive: one clear, already-battle-tested path to create/modify content types; no ambiguity
  about which mechanism is authoritative; removes a dead, misleading config entry.
- Negative / trade-offs: no live read of the actual Contentful space from within a session —
  verifying "does this type/field already exist" now requires reading the migration history
  (`contentful/migrations/*.js` in order) rather than a single live query. `content-model-analyst`
  and `figma-fidelity-auditor` agents must rely on the migration history + docs being kept
  current, since they can no longer cross-check against the live schema.
- Follow-ups: if Contentful MCP connectivity is fixed later (a correctly-scoped management
  token, sourced from an environment the host process itself inherits), revisit whether to
  re-add it as a read-only convenience layer — this ADR would need to be superseded, not just
  ignored, since the current agents are written assuming it doesn't exist.
