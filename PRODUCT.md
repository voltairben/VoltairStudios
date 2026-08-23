# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router) on Vercel — user's explicit choice, originally for a single static page with no backend, no data fetching, no API routes; now a small multi-page site (see Operating Context) still with no backend/data-fetching/API routes — every route is static, `generateStaticParams`-prerendered. One client-side dependency was added deliberately for the hero's 360° skybox background: `three` (WebGL), a real cost accepted knowingly, not incidentally. No other dependencies (no Tailwind, no Framer Motion, no animation/carousel libraries) — checked directly before ever reaching for one; plain CSS tokens and native browser APIs cover everything built so far. The project reel specifically went through several mechanisms (real scroll with `IntersectionObserver`/`scrollIntoView`/Pointer Events/CSS scroll-snap, among others) before landing on a plain CSS `translateY` loop, matching the reference's own actual (checked directly) behavior: continuous, non-interactive autoplay.

## Users

Early-stage startup founders who need an MVP/launch website fast, evaluating Voltair Studio as their build partner.

## Product Purpose

A homepage that gets a founder to email Voltair Studio, plus a small set of real project-index pages (`/work/[slug]`) it links out to — the homepage still carries the actual pitch; the sub-pages are honest "case study in progress" placeholders, not a populated portfolio (pre-launch, no case studies yet).

## Positioning

[Assumption, flagged for confirmation] A small, senior web-dev team that ships startup sites with the speed and visible rigor of a CI pipeline — not a generalist agency.

## Operating Context

The homepage (`/`) is a single viewport, no scroll, any device — that constraint is specific to the homepage, not the whole site. `/work/[slug]` case-study pages are real, normally-scrolling sub-pages (a real case study doesn't fit one fixed viewport) — added once the homepage's project reel/index needed a real destination to link to, matching how the reference site's own project tiles work (they're real links to case-study pages, confirmed directly, not decorative). The skybox background and the loading-screen intro are homepage-only chrome, not site-wide.

## Capabilities and Constraints

No backend, no forms, no CMS. Contact is a direct email link (address is a placeholder, see flag below). No real client work exists yet — no testimonials, logos, or case studies may be fabricated; the `/work/[slug]` pages say so honestly ("Case study in progress") rather than inventing content to fill them.

## Brand Commitments

Logo: `Logo/3e3c5a99-524a-4fd8-88be-d24715bbdcf5.png`, a two-tone green flame/koru mark. Explicit constraint: the logo's green must not become the site's palette.

## Evidence on Hand

Logo file only. No copy, testimonials, or case studies exist — none will be invented.

## Product Principles

- Craft over content volume — one flawless viewport beats a scrolling page of filler.
- Never fabricate proof (clients, stats, testimonials) — positioning carries the page instead.
- The homepage's zero-scroll constraint is load-bearing, not a rule to route around with tiny type — it's specific to the homepage, not a blanket rule for every route the site ever grows (a real case-study page is real content a normal page suits).

## Accessibility & Inclusion

WCAG 2.1 AA minimum: contrast, full keyboard operability, screen-reader-sane semantics under the terminal skin, `prefers-reduced-motion` respected.

## Open Placeholders

- Contact email is `contact@voltairstudio.com`, provided directly. Not independently verified that this inbox/domain is live — confirm before launch.
