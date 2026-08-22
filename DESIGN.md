---
name: Voltair Studio
description: A one-page startup web-dev studio site staged as a live deploy console.
colors:
  pane-bg: "#222831"
  amber-bright: "#FF5A36"
  amber-dim: "rgba(238,238,238,0.62)"
  cursor-flash: "#EEEEEE"
  led-green: "#45A947"
typography:
  display:
    fontFamily: "IBM Plex Mono, ui-monospace, Cascadia Code, Source Code Pro, Menlo, Consolas, DejaVu Sans Mono, monospace"
    fontSize: "clamp(1.0625rem, 7dvmin, 4rem); clamp(1.0625rem, 6.5dvw, 9rem) from 700px"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "normal"
  body:
    fontFamily: "IBM Plex Mono, ui-monospace, Cascadia Code, Source Code Pro, Menlo, Consolas, DejaVu Sans Mono, monospace"
    fontSize: "clamp(0.8125rem, 2dvmin, 1.5rem)"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "normal"
  label:
    fontFamily: "IBM Plex Mono, ui-monospace, Cascadia Code, Source Code Pro, Menlo, Consolas, DejaVu Sans Mono, monospace"
    fontSize: "clamp(0.625rem, 1.2dvmin, 0.8125rem)"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "normal"
spacing:
  1: "clamp(4px, 1dvmin, 8px)"
  2: "clamp(8px, 1.8dvmin, 16px)"
  3: "clamp(14px, 2.6dvmin, 28px)"
  4: "clamp(16px, 5dvmin, 64px)"
  5: "clamp(20px, 4dvmin, 48px)"
components:
  cta-prompt:
    backgroundColor: "transparent"
    textColor: "{colors.amber-bright}"
    padding: "0.4em 0"
  cta-prompt-hover:
    backgroundColor: "rgba(0,173,181,0.08)"
    textColor: "{colors.cursor-flash}"
  flag-link:
    backgroundColor: "transparent"
    textColor: "{colors.amber-bright}"
  flag-link-hover:
    backgroundColor: "rgba(0,173,181,0.08)"
    textColor: "{colors.cursor-flash}"
---

# Design System: Voltair Studio

## Overview

**Creative North Star: "Deploy Console"**

The whole page is staged as one live terminal pane — the studio's own daily material, not a category-default scrolling agency portfolio. A visitor reads it the way a developer reads a CI log: a boot line, a live prompt. The zero-scroll constraint isn't a limitation routed around; it's the concept. A terminal window is inherently a bounded pane, so committing to that world makes "one viewport, nothing more" the honest shape of the thing rather than a workaround.

The hero content is deliberately spare: `voltair_studio` label → one dominant headline → one tagline → the contact prompt, top-left anchored with the rest of the viewport left open to the skybox. A denser version (a three-line service manifest between tagline and CTA) was built, then cut — explicit direction, reference-informed: minimal text, generous negative space, over a fuller pitch. Content that gets added back here should earn its place against that bar, not just fit the available space.

Color originally shipped monochrome-phosphor (one amber family, no second hue); a direct request later replaced it wholesale with a four-color palette (dark navy/slate ground, teal accent, off-white highlight), then the accent alone was swapped again — teal to Warm Persimmon (`#FF5A36`) — chosen over three other offered candidates specifically for contrast against the actual skybox imagery (see Colors). What survives every repaint: the brand mark's green stays confined to exactly one place — the real logo image, now shown top-right in the chrome bar (it used to instead drive a simulated "online" LED dot, since retired) — never a background, never a second theme color, so the terminal's own-world stays uncontaminated by brand color, whatever the rest of the palette is doing around it.

No second display face, no serif/sans pairing: one monospace family carries the headline, the body copy, and the labels, because splitting fonts would dilute a concept built entirely on terminal authenticity.

**The console is a viewport, not a repaint.** A live, switchable 360° skybox (five equirectangular panoramas, slowly rotating) renders behind the terminal, added deliberately without changing the terminal's own materials: still flat, still no drop shadows on its components, whatever the active color palette is. The resolution that keeps this from contradicting the flat/no-photographic-material commitment: the sky isn't part of the terminal's material language, it's what the terminal is a HUD viewport onto — the same way a cockpit display stays flat and legible regardless of what's happening outside the glass.

The content row (label, headline, tagline, CTA) carries no panel or scrim behind it at all — the sky shows through directly behind every glyph, by explicit request. Legibility instead comes from a per-glyph text-shadow halo (`--text-halo`, applied to every text element in `.content`), the same technique video subtitles use: a tight sharp ring right at each glyph, a wider soft glow a few px out, a slight downward drop for depth. This was a deliberate trade, not an oversight — a solid scrim (tried first) measured a guaranteed WCAG contrast ratio; a glyph halo does not have an equivalent flat-color metric, so its legibility was verified visually against all five skyboxes rather than pixel-computed. The window-chrome bar and status bar carried their own translucent background for a while (thin HUD strips, distinct from the open hero space) — later removed too, also by direct request: every text element on the page now floats directly on the skybox with no background of any kind, legibility entirely carried by the halo.

**Key Characteristics:**
- Dark navy/slate ground, one persimmon accent, off-white highlight — not the original amber-monochrome, and not the teal that followed it either (see Colors: every repaint here is a direct, explicit request, not a drift)
- Single monospace type family end to end, no display/body split
- Three-row bounded grid (chrome bar / content / status bar), never a scrolling page
- Motion is a one-shot boot sequence plus a persistent cursor blink, not scattered hover flourishes

## Colors

Replaced wholesale by direct request, exact hex values given: `#222831` / `#393E46` / `#00ADB5` / `#EEEEEE`. The original palette was amber-monochrome (one phosphor color only, no blue, no gray) — that constraint is superseded, not layered on top of. A second, narrower request then swapped the accent alone (`#00ADB5` teal → `#FF5A36` persimmon), picked from four offered candidates on a concrete functional basis: the skybox imagery is predominantly blue/navy, so a blue- or violet-leaning accent (two of the four options) would sit close in hue to its own background and lose contrast; a mint/green option was ruled out by "The One Green Rule" below; persimmon is blue's complement, giving the most actual contrast against every current sky. A third pass then moved the system from "persimmon everywhere" to a real hierarchy — a named, deliberate request, not a taste drift — introducing two genuine slate neutrals (not alpha tints of the accent) and confining persimmon to a short, explicit list of elements it's allowed to touch. Everything still routes through CSS custom properties; the token *names* below (`amber-bright`, `amber-dim`, `cursor-flash`) are legacy from the original phosphor system and now hold neither-amber values — a known naming/value mismatch, not a bug, flagged here so it isn't mistaken for one.

### Primary
- **Accent Persimmon** (`#FF5A36`, token `--color-amber-bright`): used selectively, by explicit rule, not as a general-purpose "the offer" color anymore. Its entire budget: the word "Designers" in the headline, the headline's blinking cursor, and the "Contact" link (both at rest and its own accent role). Everything that used to be persimmon by default — the tagline, the CTA at rest, the footer flags — moved to a neutral below instead.

### Secondary
- **Muted Slate** (`#94A3B8`, token `--color-amber-dim`): the tagline/sub-headline and all status-bar metadata (availability, timezone, copyright) and the "About" label — supporting text that shouldn't compete with the H1 or the CTA. A genuine named slate now, not an alpha tint of white the way earlier versions of this token were.
- **UI Muted** (`#64748B`, token `--color-ui-muted`, underline `rgba(100,115,139,0.35)`): the footer's real links only — `--github`, `--x`, `--linkedin`, the skybox switcher — at rest. Transitions to Accent Persimmon on hover/focus/active. A third, distinct neutral from Muted Slate because these are interactive (need a hover destination to transition *to*) where the tagline/metadata are static.

### Tertiary
- **Base Light** (`#F8FAFC`, token `--color-cursor-flash`): the studio's high-identity elements at rest — the chrome-bar wordmark, "Creative" (the headline's first word), and the email CTA — plus the shared hover/focus highlight for elements whose *rest* state is something else (flags, "Contact"). Two roles sharing one token because they're visually identical (near-white) and this system keeps to few tokens, many uses, as elsewhere.

### Neutral
- **Dark Navy** (`#222831`, token `--color-pane-bg`): the base ground the whole palette is built from. Shows directly only where no skybox-facing surface sits; also the color the content row's text-halo is built from.
- ~~Chrome Glass~~ **retired**: the window-chrome bar and status bar used to carry a translucent `#393E46`-based background (`backdrop-filter: blur(6px)`). Removed by direct request — both bars are now fully transparent, their text (wordmark, nav, status text, flag links) floating directly on the sky like `.content`'s, protected by the same `--text-halo`, not a background.
- ~~LED Green~~ **retired**: `#45A947` used to drive a simulated "online" status LED, the studio logo's color borrowed for a decorative dot. Removed by direct request along with the LED itself.

### Named Rules
~~The One Green Rule~~ **retired, superseded rather than broken**: the logo mark itself (top-right in the chrome bar) is now recolored to Accent Persimmon via `mask-image` — the source PNG's green survives only in the file on disk and the browser favicon, not anywhere the visitor's eye actually lands on the rendered page. A direct, explicit request, not a drift: this system now has zero green on-page, which technically satisfies "green never becomes a site color" even more completely than the rule's own original mechanism did, but the rule's premise (the logo shows its real color *somewhere*) no longer holds, so it's retired rather than left standing on a foundation that's gone.

~~The One Phosphor Rule~~ **retired** — it described the amber-only constraint this repaint superseded. No replacement single-hue rule stands in for it; the four given colors (plus alpha variants of them) are the complete budget, and nothing else should be introduced without the same kind of explicit direction this repaint came with.

## Typography

**Display Font:** IBM Plex Mono (with `ui-monospace, Cascadia Code, Source Code Pro, Menlo, Consolas, DejaVu Sans Mono, monospace`)
**Body Font:** IBM Plex Mono — same family, no second face
**Label/Mono Font:** IBM Plex Mono — same family throughout; this system has no non-mono face

**Character:** IBM Plex Mono was commissioned as IBM's own systems/console face — a literal match for a deploy-console world, not a generic code font pressed into decorative service. Open counters and a taller x-height than most monospace alternatives keep the 10–12px status-bar floor legible, and its ligature-free rendering guarantees `--` prefixes and CLI-style copy display as written rather than merging into a glyph.

### Hierarchy
- **Display** (700, two-tier, line-height 1.3): the headline — the hero's dominant lead element, now two stacked short lines ("Creative" / "Designers", ≤9 chars each) rather than one long line. Below 700px viewport width: `clamp(1.0625rem, 6dvmin, 3.5rem)`. From 700px: `clamp(1.0625rem, 5.5dvw, 7.5rem)`. Raised twice earlier in this system's life, then trimmed back down by direct request ("too big") to the current slope/ceiling — the floor (`1.0625rem`) has stayed untouched through every pass since it's the safety-critical end (320px fit); only the ceiling/slope move, and shrinking them can only reduce overflow risk, never add it, unlike raising them. Each raise was re-verified with real `getBoundingClientRect()` checks against the viewport, not just a scrollbar-presence check, per the lesson below. **The dvw switch (wide tier) is load-bearing, not a preference**: an earlier single-formula version used `dvmin` at a steeper slope for reference-matching scale everywhere, and it silently clipped the headline at 768×1024 — a tall-narrow viewport where `dvmin` resolves to the width, but a `dvmin`-based formula doesn't know this particular text's overflow axis is specifically width. `dvw` ties the size directly to the dimension that actually constrains a `nowrap` line; `dvmin` remains correct for elements whose constraint is genuinely the smaller of the two axes. Every clip failure here was invisible to a scrollbar check (`overflow: hidden` on ancestors hides them) — caught only by comparing the element's own `getBoundingClientRect()` against the viewport, or by opening the screenshot. Any future increase to this token should get the same check, not just a scrollbar-presence test — and note that the *safe* slope for this token is directly tied to the longest line's character count: it got measurably safer to raise once the combined 18-char line split into two lines of ≤9 chars, and would need re-verifying downward if the copy ever gets longer again.
- **Headline entrance (`ScrambleText.tsx`):** both words decode in on mount — random glyphs from a fixed character set (`!<>-_\/[]{}—=+*^?#`) resolve left-to-right into the real text over ~450ms, "Designers" staggered 150ms behind "Creative". A client component; SSR/first paint renders the real text plainly, the scramble is a client-only enhancement layered on after mount (never the only way to read the words), and it checks `prefers-reduced-motion` itself and skips straight to final text — no separate reduced-motion override needed elsewhere for it. `aria-label` on the outer span holds the stable text throughout; the scrambling inner span is `aria-hidden`.
- **Hover distortion:** while the pointer stays over either word, its glyphs continuously re-roll from the same scramble character set (~55ms per tick, independent per word — hovering "Creative" never touches "Designers"), reverting to the real text the instant the pointer leaves. Same `prefers-reduced-motion` gate as the mount decode — no effect at all when that's set. Not a hover state a keyboard/focus user gets an equivalent of; flag if that parity is ever wanted, this is mouse-only by nature (a decode "distortion" isn't a meaningful focus-ring substitute).
- **"Creative" fill:** vertical gradient, white (`#ffffff`) to light slate (`#cbd5e1`), via `background-clip: text` on the ScrambleText inner span (`.type-target .scramble-glyphs` — targeting the inner span specifically, since `background`/`background-clip` don't inherit through elements the way `color` does). "Designers" stays solid Accent Persimmon with its ambient glow (see Colors) — the gradient is exclusive to "Creative," a one-time exception to "no gradients" below, scoped to this single element.
- ~~Micro Label (`.hero-label`)~~ **retired**: a duplicate `voltair_studio` byline once sat directly above the headline, distinct from the chrome-bar's own wordmark. Removed when the chrome-bar's decorative dots were replaced by that same wordmark moved to the top-left — the two occurrences would otherwise have sat stacked right on top of each other. One `voltair_studio` now, top-left of the chrome bar, at `--fs-chrome` size.
- **Title** (600, `clamp(0.9375rem, 2.2dvmin, 1.75rem)`, line-height 1.3): the CTA prompt — the page's single button-like element.
- **Body** (500, `clamp(0.8125rem, 2dvmin, 1.5rem)`, line-height 1.3): the one-line position/tagline statement.
- **Micro** (400/500, `clamp(0.75rem, 1.6dvmin, 1rem)`, line-height 1.3): status-bar text (chrome-bar text is its own, slightly larger tier just below). Raised from `clamp(0.625rem, 1.2dvmin, 0.8125rem)` (10px→13px) by direct request — read as "really small." Chrome-bar text (`--fs-chrome`) similarly raised, `clamp(0.8125rem, 1.8dvmin, 1.125rem)` (13px→18px), up from `clamp(0.6875rem, 1.4dvmin, 0.9375rem)` (11px→15px).

### Named Rules
**The dvmin Rule.** Every fluid size is `clamp(floor, N·dvmin, ceiling)`, never a `vw`-only or `vh`-only formula. `dvmin = min(dvw, dvh)` is what lets one token stay overflow-safe whether a phone is portrait (width-bound) or landscape (height-bound) — the mechanism that makes the zero-scroll constraint hold without a breakpoint table.

## Layout

A fixed three-row CSS Grid filling `100dvw` × `100dvh` exactly — `grid-template-rows: var(--chrome-h) 1fr var(--status-h)` — with `overflow: hidden` on `html`, `body`, and the grid root as a backstop, and `overscroll-behavior: none` to suppress iOS Safari's rubber-band bounce (which can visually reveal an edge even with zero real overflow). `env(safe-area-inset-*)` padding on the grid root handles notched devices, gated by the `viewport-fit=cover` viewport export.

The content row anchors its contents to the top-left via flexbox (`align-items/justify-content: flex-start`), not centered — a deliberate match to the reference's composition: the text block sits at the top, the rest of the viewport stays open to the skybox. No max-width cap: every line is short and `nowrap` by design, so at very wide viewports the block simply keeps its top-left position with more open sky to its right and below, rather than stretching or re-centering.

Three content-swap breakpoints (`380px`, `480px`, `720px`) govern only the status bar's secondary detail — the one row allowed to drop content under width pressure. Narrowest first: only the skybox switcher shows below 380px; `--github`/`--x` join from 380px (added when raising `--fs-status` made the previous fixed set overflow 320px — see the Grid Blowout Lesson's sibling note below); copyright joins from 480px; timezone and `--linkedin` join from 720px. The headline and CTA never compress below their type-scale floor; the fit budget was solved against the narrowest supported viewport (320×568) first.

### Named Rules
**The Grid Blowout Lesson.** `.page`'s `display: grid` declares `grid-template-rows` but must also pin `grid-template-columns: minmax(0, 1fr)`. Without it, the single implicit column auto-sizes to its children's *max-content* contribution (nowrap flex-row text), which can exceed the grid container's own fixed `100dvw`/`100dvh` box — caught at 320×568, where the chrome bar, content row, and status bar all measured 336px inside a 320px viewport even though no individual child actually needed the extra 16px. `.page`'s own `overflow: hidden` clipped the paint silently instead of producing a scrollbar, so `document.documentElement.scrollWidth` read a clean 320 the whole time — invisible to a scrollbar-presence check, caught only by comparing a real child's `getBoundingClientRect()` against the viewport. `minmax(0, 1fr)` floors the column at 0 instead of content size, letting the container's real width win. Any future `display: grid` added to this system should set an explicit column track for the same reason.

## Elevation & Depth

Flat by design — this is a terminal skin, and terminals don't have drop shadows. `box-shadow` isn't used anywhere anymore: its one prior use, the "online" LED's soft green pulse, was retired along with the LED itself. `text-shadow` (the `--text-halo` token) is the system's one non-flat device — functional, not decorative: it's what keeps every text element legible with no background of any kind behind it. No card, panel, bar, or button in this system casts a shadow of any kind, and nothing has a background.

### Named Rules
**The No-Shadow Rule.** `box-shadow` has no live use in this system; `text-shadow` is load-bearing only for glyph legibility over open sky, never decorative elevation. Nothing in this system frames itself with a background — legibility is carried entirely by the text halo.

**The Gradient-Text Halo Lesson.** `text-shadow` and `background-clip: text` don't compose safely: `text-shadow` paints from the glyph's pre-clip shape, so even a reduced-opacity halo visibly muddies a light gradient fill underneath it (measured directly on "Creative" — any `--text-halo`-derived `text-shadow` value dulled the white/slate gradient to grey; only removing `text-shadow` entirely restored a crisp fill). `filter: drop-shadow()` operates on the already-clipped, post-composite pixels instead, so it shadows behind the visible glyph without touching its fill color — that's what `--text-halo-filter` on `.type-target .scramble-glyphs` uses, and it's the correct tool for legibility shadows on any future gradient-filled text in this system, not `text-shadow`.

## Shapes

No radius token exists in this system, and no `border-radius: 50%` circle either now that the "online" LED (the only one) is gone — every remaining element is a hard-edged rectangle or the logo's own imported shape. No border, either: the CTA carried a bordered-button treatment earlier in this system's life, removed deliberately (a direct request, not a regression) in favor of the same color-wash affordance the status-bar flags already used. There is no card, box, or soft/rounded language anywhere in this system.

## Components

### Buttons
- **Primary (`.cta`):** no border, no fill, no bracket glyphs — Base Light text at rest (`contact@voltairstudio.com`, a real address, given directly — not the earlier placeholder), reading as "distinctly clickable" against the surrounding Muted Slate tagline through brightness alone, not a persimmon default anymore. `min-height: 44px` held via padding alone at every font-size floor for the WCAG 2.5.5 touch-target minimum.
- **Hover/Focus/Active:** text shifts Base Light→Accent Persimmon (the inverse of most links on this page, since the CTA's *rest* state is already the bright one) — `rgba(255,90,54,0.08)`/`14%` background wash, focus-visible outline in persimmon.

### Links (status-bar flags: `--github` / `--x` / `--linkedin` / skybox switcher)
- **Style:** UI Muted text at rest, `rgba(100,115,139,0.35)` underline at 1px, `text-underline-offset: 0.15em` — deliberately quiet until touched, so the footer doesn't compete with the hero for the visitor's one persimmon-trained eye.
- **Hover/Focus/Active:** text and underline shift UI-Muted→Accent Persimmon, with a three-tier persimmon background wash; `transition: 120ms ease` on color/background/underline-color only — no transform, no scale (a terminal doesn't do 3D press effects).

### Nav Link (`.chrome-nav-link`, "Contact")
A third pattern, distinct from both above: Accent Persimmon at rest (explicitly named as one of persimmon's three permitted uses), shifting to Base Light on hover/focus/active — the one nav element meant to already draw the eye before any interaction.

### Navigation
The window-chrome bar now carries the page's only real navigation: `voltair_studio` wordmark top-left (the decorative traffic-light dots that used to sit there were removed by direct request — no function, they never did anything — and the wordmark took that spot instead of its earlier center placement); top-right, the studio logo — recolored to Accent Persimmon via CSS mask, not its native green, matching "Contact" beside it by direct request (see Colors) — an "About" label (non-interactive — there's no About section on this one-page site to link to, flagged as a placeholder — underlined to match "Contact" beside it by direct request, but in Muted Slate's own underline tone rather than persimmon, since it isn't actually clickable), and a "Contact" link (real `mailto:`, reusing the same address as the hero CTA). The "online" status LED this replaced is retired — see Colors. Five real interactive elements now: the CTA, "Contact", and up to three status-bar flags, in visual reading order, left to right, top to bottom.

### Project Reel (`ProjectReel.tsx`, placeholder content)
A vertically auto-looping column of project thumbnails beside the hero text, positioned toward the screen's middle third rather than pinned to either edge — adapted from a reference (a similar site's own center image column). `.hero-row` (a new `grid-row: 2` flex wrapper, replacing `.content`'s direct grid placement) holds `.content` and `.project-reel` side by side, separated by a fluid `gap: clamp(24px, 8dvw, 140px)` — the gap plus the reel's own `clamp(200px, 24dvw, 380px)` width (broadened from `clamp(160px, 20dvw, 320px)` by direct request) is what lands it near-center instead of flush against either the text or the viewport edge (an earlier version used `margin-left: auto` to push it flush right; direct request moved it inward). `.content`'s own internals are unchanged. Hidden below 700px (the same tier the headline's `dvw` formula switches on) — no real room for a second column next to the hero text at narrower widths without risking the zero-scroll fit budget, so mobile keeps the single-column hero unchanged.

**Autoplay-only, matching the reference exactly**: the item list is duplicated once and `.project-reel-track` animates `translateY(0 → -50%)` on a 26s linear loop, landing back on an identical frame with no visible seam; a `mask-image` fades the top/bottom edges instead of a hard clip line. This went through two other states before settling here — a real `overflow-y: auto` user-scroll version was built on request ("its just looping over the page, i want it scrollable"), then reverted back to autoplay-only on a later request to match the reference's actual behavior. That second request was checked directly rather than assumed: segerman.dev's image column doesn't respond to scroll/wheel input at all — no scrollable container exists anywhere on that page, and simulated wheel events produced no DOM movement — so autoplay-only is a faithful match, not a guess. `prefers-reduced-motion` stops the loop (frozen on whatever frame it's on), same pattern as the skybox rotation and cursor pulse.

**Placeholders, not fabricated content**: no real project screenshots exist yet, so each tile is a diagonal-stripe pattern (`repeating-linear-gradient`, pane-bg/persimmon-tint) with a `project_NN` monospace label — reads as "content goes here," not a finished tile standing in for real work (PRODUCT.md: no fabricated case studies). `aria-hidden` on the whole component for now, since the labels carry no real information; swap to a real semantic list (with links, real alt text) once actual project images and case pages exist — don't carry the `aria-hidden` forward onto real content by accident.

### Project Index (`ProjectIndex.tsx`, placeholder content)
The reference's far-right "Index" list — project names, right-aligned, vertically centered in the hero row (`justify-content: center`; started top-aligned under the nav to match the reference exactly, moved to center by direct request) — pushed to the row's far edge via `margin-left: auto` in `.hero-row` (the exact technique `.project-reel` used before it was moved inward; the two components now split that role). Six placeholder names (`Placeholder 1`…`6`, same count as the reel's tiles) since no real project names exist yet, same non-fabrication stance as the reel.

**Clickable, by direct request**: each item is a real `<button>` now (was a plain decorative span) — clicking one sets it as the highlighted/active item and restarts the auto-advance cycle from there, so the click actually sticks instead of the next automatic tick immediately overriding it. State moved from CSS `animation-delay` math to plain React (`activeIndex` + a `setInterval` in `ProjectIndex.tsx`) — the old fixed-loop technique only worked for something non-interactive. There's no real per-project destination yet (no case pages exist), so a click's payoff is the highlight state itself, not navigation — the honest amount of interactivity available until real project content exists to link to; no longer `aria-hidden`, since it's real functional content now, though the labels are still generic placeholders. `.is-active` (bright Base Light, bold) is the auto-cycling/clicked state; hover/focus-visible reuse the same Accent Persimmon + tint-wash pattern as `.flag`/`.chrome-nav-link` elsewhere, so it reads as clickable the same way everything else interactive on the page does. One item auto-advances every `26s / 6 items` (≈4.3s), matching `.project-reel-track`'s own loop period, as a loose approximation of the reference's real behavior (its list highlights whichever project is actually centered in the scrolling column) — there's no real scroll-position link between the two components, just a matched timing period. `prefers-reduced-motion` skips starting the auto-advance interval entirely (checked in JS, same media query every other motion element on the page uses) — item 1 stays statically active, but clicking still works, since a manual click is a deliberate user action, not ambient decoration. Same 700px reveal tier as the reel.

### Loading Screen (`LoadingScreen.tsx`, `LoadingShader.tsx`, `skybox-context.tsx`)
A full-viewport overlay (`--color-pane-bg`, `z-index: 10`, above everything else) shown on first paint: the studio logo, masked to Accent Persimmon (same technique and color as `.chrome-logo` — one recolored mark, not a second rendering of it), centered, with a real bytes-loaded percentage beneath it — adapted from a reference (a similar site's own full-screen loader: centered mark + live percentage while its 3D scene assets load). The percentage isn't simulated: `SkyboxCanvas.tsx` fetches the *first* skybox texture manually (`fetch` + `ReadableStream` reader, tracking `loaded`/`content-length`) instead of going through `THREE.TextureLoader` — whose default `ImageLoader` never fires `onProgress` — specifically so this screen can show genuine progress the way the reference's own does. Subsequent skybox switches (via the status-bar switcher) go back through the plain `TextureLoader` path and never re-trigger this screen; it's gated by a `hasLoadedOnceRef`, one-time only. An 8s failsafe timeout dismisses the screen even if the fetch never resolves (offline, blocked request) rather than hang on it forever. Verified end-to-end with real network-throttle tracing (CDP `Network.emulateNetworkConditions`): on a slow connection, the percentage sits honestly at 0% until JS hydration completes enough for the fetch to even start, then climbs smoothly in step with real received bytes to 100% and fades — confirmed correct, not a hang, by tracing actual `dataReceived` events alongside the on-screen text. `prefers-reduced-motion` keeps the screen functional (still covers the loading skybox) but drops the fade — it pops instead of animating out.

**Minimum display duration**: on a fast/local connection the real fetch finished in well under a second, which made the whole screen just flash — direct request: "make it slower so it actually loads." A `MIN_DISPLAY_MS` (2000ms) floor in `LoadingScreen.tsx` paces the *displayed* percentage toward the real one via a `requestAnimationFrame` loop, computed as `Math.min(realProgress, timeElapsed/MIN_DISPLAY_MS * 100)` — it can never show progress ahead of what's actually been received (a real slow connection still displays its own real, slower pace), it only refuses to let a fast load rush past a perceivable minimum. The screen only actually dismisses once both the real fetch is done AND the floor duration has elapsed. Skipped under `prefers-reduced-motion`, which mirrors real progress directly with no pacing.

**Shader background (`LoadingShader.tsx`)**: a flow-field WebGL shader behind the mark and percentage, added on direct request after evaluating two 21st.dev candidates (recommended "Oceanic Currents" over an Aurora-style cursor-reactive one — its blue-black base was tonally closer to this system's own palette, and its ambient flow-field motion matched this project's established "calm, continuous, never gimmicky" motion stance better than the other's interactive ripple). 21st.dev's own component source sits behind an authenticated registry endpoint (confirmed `403 authentication_required` when checked directly) — this is an equivalent flow-field shader built from scratch (fBm + domain warp, the standard public technique for that look) in this system's own tokens from the start, not a recolor of borrowed proprietary source. Raw WebGL1, one full-screen triangle, no dependency — matches the reference's own "zero-dependency" framing; three.js would be overkill for a single fragment shader. Unmounts (frees the GL context, stops its `requestAnimationFrame` loop) once the fade-out transition actually finishes, rather than running forever hidden behind the real page. `prefers-reduced-motion` freezes it on one static frame instead of removing it.

**Instant first frame**: the WebGL shader can only start once React mounts and compiles it, which — a cold dev-server compile especially — is a perceptible moment during which the screen previously sat on a flat color; direct request: "make it directly visible when opening the page." `.loading-screen::before` is a pure-CSS radial-gradient drift (same palette, `blur(70px)`) that paints from the very first frame with no JS dependency at all, sitting at `z-index: -1` behind the canvas; the instant the real shader starts drawing (opaque, no alpha), it naturally covers this placeholder with no crossfade needed. `prefers-reduced-motion` freezes its drift, same as everywhere else.

**Legibility over a genuinely busy background**: the flow field's own palette can produce bright persimmon/near-white patches anywhere, unlike the mostly-dark skybox photography the rest of the site's `--text-halo` was tuned against — so this needed its own verification, not an assumption that the halo pattern would just carry over. A shader-side vignette (`smoothstep`, centered slightly below the true middle to match where the percentage actually sits, not just the geometric center) darkens a real region around the mark and text on top of the halo/drop-shadow the elements already carry. Measured directly (not assumed): sampling a ring of true background pixels just outside the percent text's real, measured `getBoundingClientRect()` — not the geometric center, and not overlapping the glyphs themselves, an early sampling pass that did overlap the glyphs produced a meaningless near-1:1 "white-on-white" reading — across 10 animation frames gave a worst-case raw background contrast of 12.25:1, comfortably above WCAG AA even before the halo's own extra separation.

### Skybox Background (signature component)
A full-viewport, fixed `<canvas>` (`app/components/SkyboxCanvas.tsx`, `three` — the one real runtime dependency this project carries) rendering an inverted sphere textured with one of five equirectangular panoramas (`public/skyboxes/`), camera fixed at the sphere's center. The sphere's own Y rotation advances continuously — one full revolution per 150s, `requestAnimationFrame`-driven — which is what reads as "the camera panning" without the extra complexity of animating the camera's look vector instead. `prefers-reduced-motion` freezes the rotation (static frame, sky still renders) rather than removing the feature. Active skybox is shared client state (`app/components/skybox-context.tsx`, React Context — the minimal tool for two components five tree-levels apart needing one synced value) and switched via `SkyboxSwitcher.tsx`, a status-bar button styled identically to the `--github`/`--x` flags (`--skybox=<name>`, click to cycle). Textures load lazily per selection, not all five upfront. `pointer-events: none` on the canvas — it's backdrop, never a click target.

## Do's and Don'ts

### Do:
- **Do** keep all body/label text in the amber family (bright or dim) — never introduce a gray neutral for "de-emphasized" text.
- **Do** compute any future `ch`-based grid track in the same `font-size` context as the text it sizes for — a real, recurring bug class in this system (a service-manifest component that once lived here hit exactly this, before it was cut for density; the lesson outlives the component).
- **Do** hold interactive touch targets at a real 44px `min-height`, not just adequate padding, so it survives the smallest type-scale floor.
- **Do** theme browser-default surfaces (`::selection` is themed to the amber-tint/cursor-flash pairing) rather than leaving them at browser defaults — the cheapest signal a page was actually built for this world.

- **Do** re-check `.content`'s text against every skybox (visually, since it has no flat-color background to contrast-compute) whenever a new skybox is added or `--text-halo` changes.
- **Do** remember the edge-pixel contrast lesson if any element ever gets a background again: an 0.86-alpha scrim (an earlier version of this system, since retired) looked fine by eye and measured as low as 2.65:1 at a real edge — only pixel sampling caught it.

### Don't:
- **Don't** let the logo's green appear anywhere but the real logo image itself — it is a brand-asset color, not a site accent, and simulating it with a CSS color token (as the old "online" LED did) or using it a second place anywhere spends a budget this system only has once.
- **Don't** add a second type family for "contrast" or "hierarchy" — every hierarchy step in this system is weight and size within one monospace family.
- **Don't** add drop shadows, gradients, or rounded cards to extend this system — it is flat, hard-edged, and monochrome-phosphor by commitment, not by omission. One scoped exception exists by direct request: the white→slate gradient text fill on "Creative" (see Typography → Headline entrance). Don't generalize that exception to other elements without the same kind of explicit direction it came with.
- **Don't** let any new element grow the page past `100dvh`/`100dvw` — the fluid `dvmin`-based scale exists specifically so nothing needs a scrollbar, ever.
- **Don't** let the skybox touch the terminal's own material language — it stays a backdrop the console is a viewport onto, never a texture, gradient, or lighting cue applied to the terminal's own components.
