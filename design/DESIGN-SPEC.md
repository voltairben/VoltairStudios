# Voltair Studio — "Deploy Console" Design Spec

Implementation-ready handoff. Direction is locked (see brief); this document finalizes every value needed to build it: color, type, spacing, grid, motion, states, copy, accessibility. No further concept decisions are open — only the flagged placeholders at the bottom need client confirmation before launch.

Stack assumed: Next.js App Router, plain CSS, `next/font/google`. Root `html` font-size assumed unmodified at **16px** (`1rem = 16px`) — every `rem` bound below depends on this; if the engineer changes the root size, rescale all `rem` values proportionally.

---

## 1. Governing rule

**Bright amber = primary pitch content and anything interactive. Dim amber = everything else.**

- Bright (`--color-amber-bright`): headline, position statement, CTA, and all links (including footer flags).
- Dim (`--color-amber-dim`): window-chrome furniture (studio name, "online" label, traffic dots), the service manifest (supporting detail, not the pitch itself), and all status-bar meta text.
- Green (`--color-led-green`): reserved for exactly one element, the chrome-bar "online" LED dot. It never appears as background, border, text, or any other surface.

This rule resolves every color assignment below — it is stated once here so no component spec needs to re-argue it.

---

## 2. Design tokens

### 2.1 Color

| Token | Value | Role |
|---|---|---|
| `--color-pane-bg` | `#100E0B` | content-row background |
| `--color-chrome-bg` | `#17140F` | chrome-bar + status-bar background |
| `--color-amber-bright` | `#FFB300` | primary text, CTA, links |
| `--color-amber-dim` | `#B98A3A` | secondary/meta text |
| `--color-cursor-flash` | `#FFF3DC` | blink-block fill, hover/focus text, focus outline |
| `--color-led-green` | `#45A947` | "online" LED fill only |
| `--color-led-glow` | `rgba(69,169,71,0.55)` | LED box-shadow |
| `--color-amber-tint-08` | `rgba(255,179,0,0.08)` | link hover background |
| `--color-amber-tint-14` | `rgba(255,179,0,0.14)` | link active background |
| `--color-amber-tint-50` | `rgba(255,179,0,0.50)` | CTA border, resting state |
| `--color-underline-rest` | `rgba(255,179,0,0.35)` | link underline, resting state |
| `--color-dot` | `rgba(185,138,58,0.45)` | traffic-dot fill (dim amber, 45% alpha, no separate hex) |

`#45A947` and its darker companion `#26833D` were sampled directly from `Logo/3e3c5a99-524a-4fd8-88be-d24715bbdcf5.png` (dominant-pixel scan, 1024×1024 source). `#45A947` is the brighter of the logo's two tones and is used for the LED because it holds contrast at LED scale; `#26833D` is documented here for reference only and is not used anywhere in the UI — the direction permits exactly one green use, and that budget is spent on the LED.

**Contrast — WCAG 2.1 AA, computed via relative-luminance formula (`(L1+0.05)/(L2+0.05)`):**

| Pairing | Ratio | Text size in use | AA requirement | Result |
|---|---|---|---|---|
| `#FFB300` on `#100E0B` (headline/position/CTA on pane) | **10.74:1** | 15–44px | 4.5:1 (3:1 large) | Pass, exceeds AAA |
| `#FFB300` on `#17140F` (links on chrome/status) | **10.23:1** | 10–15px | 4.5:1 | Pass, exceeds AAA |
| `#B98A3A` on `#100E0B` (manifest on pane) | **6.20:1** | 12–20px | 4.5:1 | Pass |
| `#B98A3A` on `#17140F` (chrome/status meta) | **5.91:1** | 10–15px | 4.5:1 | Pass |
| `#FFF3DC` on `#100E0B` (hover text, cursor block) | **17.53:1** | any | 4.5:1 | Pass, exceeds AAA |
| `#FFF3DC` on `#17140F` (focus outline vs chrome/status bg) | **16.71:1** | non-text (3:1 min) | 3:1 | Pass |
| `#45A947` LED on `#17140F` | **6.14:1** | non-text (3:1 min) | 3:1 | Pass |
| `#45A947` LED on `#100E0B` | **6.44:1** | non-text (3:1 min) | 3:1 | Pass |
| CTA border `rgba(255,179,0,0.50)` composited on `#100E0B` → `#886106`ish | **3.45:1** | non-text (3:1 min) | 3:1 | Pass |
| CTA border resolved hover/focus (`#FFB300` solid) on `#100E0B` | **10.74:1** | non-text | 3:1 | Pass |

Every text/background pairing used anywhere in the design clears AA at its actual rendered size (most clear AAA). The single ratio that needed tuning was the CTA's resting border alpha — 28% alpha only reached 1.85:1, so it's set to 50% alpha to clear 3:1 (math in §6).

### 2.2 Type

**Family: IBM Plex Mono**, loaded via `next/font/google`, weights `400 500 600 700`.

Justification (over JetBrains Mono, the other reasonable candidate):
1. IBM Plex Mono was commissioned as IBM's own systems/console face — literal match for a "deploy console" own-world, not just a generic code font pressed into service.
2. Open counters and taller x-height than JetBrains Mono at small sizes, which matters here specifically: the status bar floor is 10px and the manifest floor is 12px — legibility at that floor is a hard requirement, not a nicety.
3. No code-ligature glyph substitution. JetBrains Mono's ligature table can silently merge `--` into a single glyph — and the manifest's copy is literally `--design` / `--build` / `--ship`. A ligature-free face guarantees the double-hyphen renders as written.
4. Ships 400/500/600/700 on Google Fonts, which is exactly the 4-weight hierarchy this design needs (see weight map in §4) — no second family, no synthetic bold.

```ts
// app/layout.tsx
import { IBM_Plex_Mono } from "next/font/google";

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});
```

```css
--font-mono-stack: var(--font-mono), "IBM Plex Mono", ui-monospace,
  "Cascadia Code", "Source Code Pro", Menlo, Consolas, "DejaVu Sans Mono", monospace;
```

**Type scale** — every size is `clamp(floor, Ndvmin, ceiling)`. `dvmin` = 1% of `min(dvw, dvh)`, so the SAME token stays safe whether the phone is portrait (width-bound) or landscape (height-bound), and scales the tighter of the two dimensions on desktop too. This is the mechanism that satisfies "tied to vh/vw, not fixed breakpoints."

| Token | Formula | Floor (px) | Ceiling (px) | Used by |
|---|---|---|---|---|
| `--fs-headline` | `clamp(1.0625rem, 3.6dvmin, 2.75rem)` | 17 | 44 | headline |
| `--fs-cta` | `clamp(0.9375rem, 2.2dvmin, 1.75rem)` | 15 | 28 | contact prompt |
| `--fs-position` | `clamp(0.8125rem, 2dvmin, 1.5rem)` | 13 | 24 | positioning statement |
| `--fs-manifest` | `clamp(0.75rem, 1.7dvmin, 1.25rem)` | 12 | 20 | service manifest |
| `--fs-chrome` | `clamp(0.6875rem, 1.4dvmin, 0.9375rem)` | 11 | 15 | studio name, "online" label |
| `--fs-status` | `clamp(0.625rem, 1.2dvmin, 0.8125rem)` | 10 | 13 | status-bar text, flags |

`--lh-tight: 1.3` (headline, position, CTA, chrome/status). `--lh-relaxed: 1.5` (manifest — a 3-line list reads better slightly open). `letter-spacing: normal` everywhere — no manual tracking; at these weights and sizes IBM Plex Mono doesn't need it, and adding it would be an untied design variable with no stated reason.

**Weight map:**

| Element | Weight |
|---|---|
| Headline | 700 |
| CTA | 600 |
| Position statement | 400 |
| Manifest `dt` (flag) | 500 |
| Manifest `dd` (description) | 400 |
| Chrome studio name | 500 |
| Chrome "online" label | 400 |
| Status-bar text | 400 |
| Status-bar flag links | 500 |

### 2.3 Spacing

| Token | Formula | Floor | Ceiling | Used for |
|---|---|---|---|---|
| `--space-1` | `clamp(4px, 1dvmin, 8px)` | 4px | 8px | manifest row-gap |
| `--space-2` | `clamp(8px, 1.8dvmin, 16px)` | 8px | 16px | gap between headline / position / manifest / CTA; manifest column-gap |
| `--space-3` | `clamp(14px, 2.6dvmin, 28px)` | 14px | 28px | chrome/status-bar internal gaps (LED-to-label, dot cluster) |
| `--space-4` | `clamp(16px, 5dvmin, 64px)` | 16px | 64px | content-row horizontal padding; chrome/status horizontal padding |
| `--space-5` | `clamp(20px, 4dvmin, 48px)` | 20px | 48px | content-row vertical padding |

### 2.4 Size / radius / motion tokens

```css
--chrome-h: clamp(40px, 8dvmin, 56px);
--status-h: clamp(36px, 7dvmin, 48px);
--led-size: clamp(6px, 1dvmin, 9px);
--dot-size: clamp(8px, 1.6dvmin, 12px);
--radius-sm: 4px;
--cta-border-w: 1.5px;
--focus-outline-w: 2px;
--focus-outline-offset: 2px;

--dur-type: 800ms;
--dur-fade: 200ms;
--dur-blink: 1000ms;
--dur-led-pulse: 2400ms;
```

---

## 3. Layout — 3-row grid

```css
html, body {
  margin: 0;
  height: 100%;
  overflow: hidden;          /* belt-and-suspenders: math below guarantees no overflow, this is the hard backstop */
  overscroll-behavior: none; /* kills iOS Safari rubber-band bounce, which can reveal edges even with no real overflow */
  background: #100E0B;
}

.page {
  display: grid;
  grid-template-rows: var(--chrome-h) 1fr var(--status-h);
  width: 100vw; width: 100dvw;
  height: 100vh; height: 100dvh;   /* vh is the fallback line; dvh overrides where supported */
  overflow: hidden;
  padding: env(safe-area-inset-top) env(safe-area-inset-right)
           env(safe-area-inset-bottom) env(safe-area-inset-left);
  background: var(--color-pane-bg);
}

.chrome-bar {
  grid-row: 1;
  display: grid;
  grid-template-columns: 1fr auto 1fr;   /* dots | wordmark | LED — true-centers the wordmark regardless of side widths */
  align-items: center;
  padding-inline: var(--space-4);
  background: var(--color-chrome-bg);
}

.content {
  grid-row: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-5) var(--space-4);
  background: var(--color-pane-bg);
  overflow: hidden;
  text-align: center;
}

.status-bar {
  grid-row: 3;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-inline: var(--space-4);
  background: var(--color-chrome-bg);
}
```

**Required in `app/layout.tsx`** (Next.js App Router `viewport` export, separate from `metadata`): `viewport-fit=cover` is what makes `env(safe-area-inset-*)` resolve to nonzero on notched devices at all — without it the insets silently stay `0` and the safe-area requirement no-ops.

```ts
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};
```

No bordered "pane" box is drawn around `.content` — the background-color step between `#17140F` (chrome/status) and `#100E0B` (content) already frames it. Adding a border would be a redundant second framing device.

No max-width cap on the content column either: every line is intentionally short and `nowrap` (see §4 fit math), so at very wide viewports the short lines simply center in more negative space — a small console window in a big dark browser viewport, which is the intended look, not an oversight.

**Content-priority order when space is tight** (per the brief's requirement): headline and CTA are never allowed to compress below their floor — floors were sized to the 320px case first (§3.1). The manifest and chrome bar sit at their floors alongside them with comfortable margin. The status bar (footer) is the one row with content that's dropped, not shrunk, under width pressure — see §5.3's two breakpoints.

### 3.1 Verified checkpoints

`dvmin = min(width, height)`. "Content needed" sums line-heights at that checkpoint's actual (possibly floor-clamped) font sizes plus the 3 inter-block gaps and the manifest's 2 internal row-gaps. "Longest line" is the headline, `$ voltair deploy --launch` (25 characters incl. cursor), at that checkpoint's headline font size, using IBM Plex Mono's ≈0.6em average advance width.

| Viewport | dvmin | chrome+status h | content row h avail | content needed | vertical slack | width avail | longest line w | horizontal slack |
|---|---|---|---|---|---|---|---|---|
| 320×568 (floor case) | 320 | 76px | 452px | ~144.5px | **307.5px** | 288px | 265px | **23px** |
| 375×812 | 375 | 76px | 696px | ~150px (fonts just above floor) | 546px | 335px | ~285px | 50px |
| 1440×900 | 900 | 104px | 724px | ~210px | 514px | 1350px | 486px | 864px |
| 2560×1440 (ceiling case) | 1440 | 104px | 1240px | 278.8px | **961.2px** | 2432px | 660px | **1772px** |

The tightest margin in the whole layout is the manifest's description column at the 320px floor: flag column `9ch` + `--space-2` gap leaves 215px for the description, and the longest description (`production Next.js front-end`, 28 characters) needs ~202px at the 12px floor — **~13px / 2 characters of slack.** Every other line has ≥23px of slack at the narrowest tested viewport. This is the one number worth eyeballing in-browser before sign-off; everything else has generous margin.

Chrome/status bar heights are pinned to their px floors (40px / 36px) below dvmin≈500 and their px ceilings (56px / 48px) above dvmin≈700 — they don't grow linearly across the whole range, by design, so they stay proportionally small next to the content row at every size.

---

## 4. Copy (final)

All copy is original positioning language, not a claim of fact beyond what's true today — no client names, stats, or testimonials, per `PRODUCT.md`.

### Headline (typed, one-shot animation, `<h1>`)

```
$ voltair deploy --launch
```
25 characters including the leading `$ ` and cursor position. The `$ ` is a static, always-present prompt glyph (not part of the type-in animation); `voltair deploy --launch` (23 characters) is what types in.

### Position statement (`<p>`, one line)

```
MVP sites for startup founders.
```
32 characters incl. period. Directly restates `PRODUCT.md`'s Product Purpose ("MVP/launch websites for early-stage startup founders") rather than inventing new positioning language.

### Service manifest (`<dl>`, 3 rows, `dt`/`dd` pairs)

| Flag (`dt`) | Description (`dd`) | Row length |
|---|---|---|
| `--design` | `brand-true UI, from scratch` | 27 |
| `--build` | `production Next.js front-end` | 28 |
| `--ship` | `live in days, launch-ready` | 26 |

### Contact prompt (`<a href="mailto:...">`, blinking cursor, the CTA)

```
$ hello@voltairstudio.dev
```
**PLACEHOLDER — this is the same placeholder address already flagged in `PRODUCT.md`** (`hello@voltairstudio.dev`, no real inbox/domain confirmed). Swap before launch; nothing else in the design depends on the string length changing meaningfully.

### Status bar (footer)

Left cluster, three responsive tiers (see §5.3 for the breakpoints):

| Tier | Width | Text |
|---|---|---|
| A | <480px | `open for new projects` |
| B | 480–719px | `open for new projects · © 2026` |
| C | ≥720px | `open for new projects · UTC · © 2026` |

**"open for new projects" is a placeholder capacity claim** — not a fabricated stat/client, but an operational status that needs real confirmation before launch, same category as the email. **"UTC" is a placeholder timezone** — no studio location was provided in `PRODUCT.md`; swap for the real one (or drop the timezone segment entirely) once known.

Right cluster, social flags (2 always, 3rd progressive):

| Flag | Tier shown | href (placeholder) |
|---|---|---|
| `--github` | always | `https://github.com/voltairstudio` — **placeholder, unconfirmed account** |
| `--x` | always | `https://x.com/voltairstudio` — **placeholder, unconfirmed account** |
| `--linkedin` | ≥720px only | `https://linkedin.com/company/voltairstudio` — **placeholder, unconfirmed account** |

Two flags (`--github`, `--x`) satisfy the brief's "2–3" on their own and are the most dev-audience-appropriate; `--linkedin` is the one that's allowed to disappear first, consistent with "footer meta detail is the first thing allowed to compress."

### Window chrome bar

- Studio wordmark (center column): `voltair_studio` — lowercase, underscore, deliberate env-var/CLI branding treatment local to this one label. (Prose references elsewhere, e.g. the footer's `© 2026`, don't need the studio name repeated at all — chrome bar already carries it.)
- Status label (right column, next to LED): `online`
- Traffic dots (left column): 3 decorative circles, no text, `aria-hidden="true"`

**No logo image renders anywhere on the page.** The locked direction's own content list for the chrome bar is "traffic-light dots + green online LED + studio name" — a typographic wordmark, not a logo mark. Putting the actual (green, two-tone) logo PNG anywhere in the page body would spend the "one green use" budget on the wrong element. The PNG's only two roles in this build are (1) source of the sampled `--color-led-green` hex, and (2) optionally the browser-tab favicon — favicon is chrome metadata, not "the site," so a true-color favicon doesn't violate the "never the theme color" constraint. Flagging this as an assumption since the brief doesn't explicitly rule on favicon use; confirm with the client if in doubt.

---

## 5. Components

### 5.1 Chrome bar

- Traffic dots: 3 filled circles, `background: var(--color-dot)`, diameter `var(--dot-size)`, `gap: var(--space-1)`, `border-radius: 50%`. Purely decorative — not real window controls, not focusable, `aria-hidden="true"`, no `tabindex`.
- Studio wordmark: `color: var(--color-amber-dim); font-size: var(--fs-chrome); font-weight: 500;` — centered column.
- Online status (right column): a flex row, `gap: var(--space-1)` — LED dot (`width/height: var(--led-size); border-radius: 50%; background: var(--color-led-green); box-shadow: 0 0 4px 1px var(--color-led-glow);`, `aria-hidden="true"`) followed by the text `online` (`color: var(--color-amber-dim); font-size: var(--fs-chrome); font-weight: 400;`). The dot is decorative; "online" is the accessible content — never rely on the dot's color alone to convey status (WCAG 1.4.1).

### 5.2 Content (terminal pane)

Semantic order: `<h1>` headline → `<p>` position → `<dl>` manifest → `<a>` CTA. Landmark: everything in this row lives inside `<main>`.

**Headline** — `color: var(--color-amber-bright); font-size: var(--fs-headline); font-weight: 700; line-height: var(--lh-tight); white-space: nowrap;`. Structure:
```html
<h1><span aria-hidden="true">$ </span><span class="type-target">voltair deploy --launch</span><span class="cursor" aria-hidden="true">█</span></h1>
```

**Position** — `color: var(--color-amber-bright); font-size: var(--fs-position); font-weight: 400; line-height: var(--lh-tight);`

**Manifest** — `<dl>` as a 2-column grid: `grid-template-columns: 9ch 1fr; column-gap: var(--space-2); row-gap: var(--space-1);`. Both `dt` and `dd`: `color: var(--color-amber-dim); font-size: var(--fs-manifest); line-height: var(--lh-relaxed); white-space: nowrap;` — `dt` at weight 500, `dd` at weight 400. `9ch` reservation covers the longest flag (`--design`, 8 characters) with a 1-character buffer.

**CTA** — the one bordered, button-like element on the page (everything else is plain text or a plain underlined link):
```html
<a href="mailto:hello@voltairstudio.dev" class="cta">
  <span aria-hidden="true">$ </span>hello@voltairstudio.dev<span class="cursor" aria-hidden="true">█</span>
</a>
```
```css
.cta {
  display: inline-flex;
  align-items: center;
  min-height: 44px;                 /* WCAG 2.5.5/2.5.8 target size, held even at the smallest font floor */
  padding: 0.4em 0.7em;
  border: var(--cta-border-w) solid var(--color-amber-tint-50);
  border-radius: var(--radius-sm);
  color: var(--color-amber-bright);
  font-size: var(--fs-cta);
  font-weight: 600;
  text-decoration: none;            /* the border is this element's affordance, not an underline */
}
```
No explicit `aria-label` — the visible text (`hello@voltairstudio.dev`) is already the correct accessible name; the decorative `$ ` and cursor glyph are `aria-hidden`.

### 5.3 Status bar

Left cluster and right cluster, `justify-content: space-between` (already set on `.status-bar`). All text `font-size: var(--fs-status); color: var(--color-amber-dim); font-weight: 400;` except flag links, which are `color: var(--color-amber-bright); font-weight: 500;` (they're links — bright per §1).

Two breakpoints, both plain `min-width` media queries (deliberately not tied to `dvmin` — these are content-swap thresholds, not continuous scaling, so a fixed breakpoint is the correct tool):

```css
.status-tz, .status-copyright, .flag-linkedin { display: none; }

@media (min-width: 480px) {
  .status-copyright { display: inline; }
}
@media (min-width: 720px) {
  .status-tz { display: inline; }
  .flag-linkedin { display: inline; }
}
```

---

## 6. Component states — hover / focus / active

### Generic links (footer flags)

| State | Color | Underline | Background | Outline |
|---|---|---|---|---|
| Rest | `#FFB300` | `1px solid var(--color-underline-rest)`, `text-underline-offset: 0.15em` | none | none |
| Hover | `#FFF3DC` | solid, full opacity | `var(--color-amber-tint-08)` | none |
| Focus-visible | `#FFF3DC` | solid, full opacity | `var(--color-amber-tint-08)` | `var(--focus-outline-w) solid #FFF3DC`, offset `var(--focus-outline-offset)` |
| Active | `#FFF3DC` | solid, full opacity | `var(--color-amber-tint-14)` | none |

`transition: color 120ms ease, background-color 120ms ease, text-decoration-color 120ms ease;` — fast and flat, no transform/scale (a terminal doesn't do 3D press effects).

Focus outline contrast: `#FFF3DC` vs `#17140F` (the only background this outline ever sits on, since flags only live in the status bar) = **16.71:1**, far past the 3:1 non-text minimum.

### CTA

| State | Border | Background | Text | Outline |
|---|---|---|---|---|
| Rest | `1.5px solid rgba(255,179,0,0.50)` → **3.45:1** vs `#100E0B` | transparent | `#FFB300` | none |
| Hover | `1.5px solid #FFB300` → 10.74:1 | `var(--color-amber-tint-08)` | `#FFF3DC` | none |
| Focus-visible | `1.5px solid #FFB300` | `var(--color-amber-tint-08)` | `#FFF3DC` | `2px solid #FFF3DC`, offset 2px |
| Active | `1.5px solid #FFF3DC` | `var(--color-amber-tint-14)` | `#FFF3DC` | none |

The rest-state border needed tuning: at 28% alpha (a value that looked reasonable by eye) it only reaches 1.85:1 against `#100E0B`. 50% alpha was the value solved to clear 3:1 (landed at 3.45:1) — see the alpha sweep in the working notes below.

| Border alpha | Composited RGB | Ratio vs `#100E0B` |
|---|---|---|
| 0.28 | `(83, 60, 8)` | 1.85 |
| 0.42 | `(116, 83, 6)` | 2.74 |
| **0.50** | `(136, 97, 6)` | **3.45** ✓ |
| 0.60 | `(159, 113, 4)` | 4.44 |

---

## 7. Motion

### 7.1 Headline type-in (one-shot)

```css
.type-target {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  width: 0ch;
  animation: type-in var(--dur-type) steps(23, end) forwards;
}
@keyframes type-in {
  to { width: 23ch; }
}
```
23 = character count of `voltair deploy --launch` (the animated portion; the leading `$ ` is static). 800ms ÷ 23 ≈ 34.8ms per character — fast, "already shipped" pacing, not a slow dramatic reveal (matches the "no ceremony" thesis).

### 7.2 Cursor blink

```css
@keyframes cursor-blink {
  0%, 49.9% { opacity: 1; }
  50%, 100% { opacity: 0; }
}
.cursor { animation: cursor-blink var(--dur-blink) step-end infinite; }
```
`step-end` (hard cut, no fade) because real terminal cursors snap, they don't fade. Both cursors (headline and CTA) use the identical animation — infinite, no special stop-after-N-blinks logic. An idle terminal prompt just keeps blinking; matching that is both more authentic and simpler than adding an iteration-count/fill-mode special case to make the headline cursor "settle."

Timing offsets so cursors don't blink through content that hasn't appeared yet:
- Headline cursor: `animation-delay: 800ms` (starts exactly when type-in finishes).
- CTA cursor: `animation-delay: 1200ms` (starts when the CTA's own fade-in, below, completes).

### 7.3 Position / manifest / CTA reveal

Only the headline is "typed" per the brief's own wording. The other three blocks simply fade in, staggered, once typing completes — no slide, no easing flourish:

```css
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
.position { animation: fade-in var(--dur-fade) ease-out 800ms both; }
.manifest { animation: fade-in var(--dur-fade) ease-out 900ms both; }
.cta      { animation: fade-in var(--dur-fade) ease-out 1000ms both; }
```
`both` fill-mode holds `opacity: 0` before the delay elapses and `opacity: 1` after the animation ends. Total sequence from page load to fully-settled page: 1200ms (CTA fade ends) + cursors continuing to blink indefinitely after.

### 7.4 LED pulse

```css
@keyframes led-pulse {
  0%, 100% { opacity: 1;    box-shadow: 0 0 3px 1px rgba(69,169,71,0.45); }
  50%      { opacity: 0.75; box-shadow: 0 0 6px 2px rgba(69,169,71,0.70); }
}
.led { animation: led-pulse var(--dur-led-pulse) ease-in-out infinite; }
```

### 7.5 `prefers-reduced-motion` — single override block

```css
@media (prefers-reduced-motion: reduce) {
  .type-target { animation: none; width: 23ch; }
  .cursor      { animation: none; opacity: 1; }   /* static solid block, never fully hidden, never flashing */
  .position, .manifest, .cta { animation: none; opacity: 1; }
  .led         { animation: none; opacity: 1; box-shadow: 0 0 4px 1px var(--color-led-glow); }
}
```
Every animated property gets an explicit static final-state value in the same rule — no property is left mid-transition. Nothing on this page flashes faster than 1Hz to begin with (the blink cycle is 1s), so this block is about comfort/vestibular preference, not seizure-threshold compliance, and a fully static fallback is the simplest correct response to that preference.

---

## 8. Accessibility notes

- Landmarks: `<header>` (chrome bar) → `<main>` (content row) → `<footer>` (status bar).
- Headline is a real `<h1>` — the terminal skin is presentational, the document structure underneath is a normal single-heading page.
- Manifest is a `<dl>`, not a styled `<ul>` — it's genuinely label/value data (flag → description), and `<dl>` is the correct element for that, not just a visual convenience.
- All decorative glyphs (`$ ` prompts, `█` cursor blocks, traffic dots, LED dot) are `aria-hidden="true"`; the LED's meaning is carried by the adjacent visible text "online," never by color/shape alone (WCAG 1.4.1).
- Focus order is short and linear: CTA → `--github` → `--x` → (`--linkedin` if present). Four focusable elements on the entire page, in visual reading order — no skip-link needed at that length.
- Every interactive element gets a `:focus-visible` outline (§6) at ≥16.7:1 contrast against whichever background it appears on.
- This is a fixed dark-only brand skin, not a light/dark-switchable app — no `prefers-color-scheme: light` branch is defined, that's a deliberate scope boundary of the locked "own-world" direction, not an oversight.
- `overscroll-behavior: none` plus the `overflow: hidden` backstop (§3) is what makes "zero scroll, ever" hold on iOS Safari specifically, where rubber-band bounce can visually reveal viewport edges even when there's no real overflow to scroll.

---

## 9. Open placeholders (confirm before launch)

| Item | Current placeholder | Source |
|---|---|---|
| Contact email | `hello@voltairstudio.dev` | Already flagged in `PRODUCT.md` |
| Availability text | `open for new projects` | New — needs real capacity confirmation |
| Timezone | `UTC` | New — no studio location given |
| `--github` href | `https://github.com/voltairstudio` | New — unconfirmed account |
| `--x` href | `https://x.com/voltairstudio` | New — unconfirmed account |
| `--linkedin` href | `https://linkedin.com/company/voltairstudio` | New — unconfirmed account |
| Favicon = true-color logo | Assumed, not explicit in brief | Flagged in §4 |

Nothing above changes any layout or contrast math in this document if the strings swap — the fit budgets in §3.1 were computed against the current copy's character counts; if a replacement string is meaningfully longer (e.g. a longer confirmed email domain), re-check its row against the slack column in §3.1 before shipping.
