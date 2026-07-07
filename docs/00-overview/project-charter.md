# Project Charter

> **Purpose:** Define *what* we are building and *why*, so no requirement is ever assumed.
> This is a **real-product** charter (not the test placeholder). Fields marked **`‹CONFIRM›`**
> are the only ones I could not derive from decisions already made — fill them or tell me and
> I'll finalize. Everything else reflects confirmed choices (stack, audiences, scope, gates).

## 1. Project identity
- **Project name:** ‹CONFIRM› — the product/brand name (Figma shows "Liberty Dental Plan"; confirm whether that is the real product or a design reference)
- **Owner / sponsor:** ‹CONFIRM›
- **Primary contact:** sai_dev1@aapmor.com
- **Date started:** 2026-07-06

## 2. Business goal
- **Problem being solved:** ‹CONFIRM› — the core member/provider/broker problem this site addresses
- **Primary business outcome:** ‹CONFIRM› (e.g. reduce support calls, grow plan enrolments, improve member self-service)
- **Success metrics (KPIs):**
  - **Quality gates (confirmed, non-negotiable):** Core Web Vitals green (LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1) · WCAG 2.2 AA · SonarQube clean (no new smells/hotspots) · SiteImprove clean.
  - **Business KPIs:** ‹CONFIRM› (e.g. find-a-dentist completion rate, member-login adoption, organic traffic)

## 3. Audience & scope
- **Target users (confirmed):** Members (patients), Providers (dentists), Brokers, and Public / prospects (unauthenticated).
- **Type of product (confirmed):** Hybrid — public marketing/content site **and** authenticated member web app.
- **In scope — first release (confirmed "complete"):**
  1. **Content / article pages** — Contentful-driven education & article pages (e.g. the "5 toothbrush tips" template), with header, hero, breadcrumbs, footer; fully responsive (desktop/tablet/mobile per Figma).
  2. **Find a dentist** — search/directory for in-network dentists.
  3. **Member login / account** — authentication + basic member account area.
  4. **Marketing / plans pages** — public marketing and plan/shop information.
- **Explicitly out of scope (proposed — ‹CONFIRM›):** native mobile apps · online payments / billing · claims processing · provider credentialing workflows · live chat. *(Confirm or move any of these into scope.)*

## 4. Markets & localization
- **Primary locale(s):** en-US (Figma header shows an "English" switcher).
- **Additional locales:** ‹CONFIRM› (Figma implies multi-language is anticipated — list target languages or "none for release 1")
- **RTL support required:** ‹CONFIRM› (default assumption: no)

## 5. Constraints
- **Tech stack (fixed):** Next.js (App Router), TypeScript (strict), Bootstrap 5 + SCSS, Contentful (content), Figma (design). MCP-connected: Figma ✅ verified, Contentful ✅ configured (space "Development").
- **Compliance (fixed):** WCAG 2.2 AA · SEO · SonarQube gates · SiteImprove. Standards mapped in `docs/01-standards/`.
- **Timeline / milestones:** ‹CONFIRM›
- **Budget / team size:** ‹CONFIRM›

## 6. Stakeholders
| Role | Name | Responsibility |
|---|---|---|
| Product owner | ‹CONFIRM› | Requirements, priorities |
| Engineering | ‹CONFIRM› | Delivery |
| Design | ‹CONFIRM› | Figma design system |
| Content | ‹CONFIRM› | Contentful authoring |

## 7. Assumptions & open questions
- **Product identity unconfirmed** — is "Liberty Dental Plan" the real brand, or a reference design? Blocks §1.
- **"Complete" first release is large** — four feature areas (content, find-a-dentist, auth, marketing) in release 1 is ambitious. Recommend confirming priority order in case it needs phasing; flagged as a delivery risk, not a blocker.
- **Localization intent** — Figma shows a language switcher; need the actual locale list (§4).
- **Business KPIs** — quality gates are set, but business success metrics are not yet defined (§2).
- **Auth provider** — member login implies an identity source (existing IdP? new?). To resolve in the Architecture phase.
