---
name: figma-mcp-workflow
description: How to build pages/components from Figma designs via the Figma MCP for this project. Use whenever implementing a design from a Figma URL/selection — reading structure, mapping to sections, pulling tokens, and verifying fidelity. Encodes real mistakes already hit.
---

# Figma → Code Workflow

## 1. Inspect ALL responsive frames before building
A Figma page usually has **desktop, tablet, and mobile** frames (often grouped in one
section). Call `get_metadata` on the parent and read **every** frame — then model/build for
the **richest** structure across all of them.
*(Real mistake: built a flat footer + wrapping nav from the desktop frame only, then had to
redo it as a grouped footer + hamburger once the tablet/mobile frames were considered.)*
Concretely: header collapses to a hamburger below `lg`; footers become grouped link columns.

## 2. Collapse variations into one component + variant enums
Do not create a content type / component per visual variation. Map the design family to one
component with design-system-bound **variant enums** (see the content-model spec and
[contentful-development]).

## 3. Pull design tokens once, bind to variables
Extract colours/type from `get_variable_defs` / design context and bind them to SCSS/DS
variables. **No free colour pickers or arbitrary widths** — constrained tokens only.

## 4. Handle assets correctly
Figma asset URLs are **short-lived (~7 days)**. Download promptly, then move images into
**Contentful** as real assets — never leave them as local `/public` binaries (see
[contentful-development] rule 2).

## 5. Verify against every breakpoint before "done"
Run the app and screenshot **desktop, tablet, AND mobile** (and open interactive elements like
the hamburger). The design isn't matched until all breakpoints match. Fold this into
[definition-of-done].

Servers: the Figma **plugin** MCP is primary (read+write, any URL); the local Dev Mode server
is the committed fallback (see ADR-0002 and `docs/06-runbooks/figma-mcp-connection.md`).
