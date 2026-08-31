"use client";

import { useEffect, useRef, useState } from "react";
import { useTransitionRouter } from "next-view-transitions";
import { useSkybox, SKYBOXES } from "./skybox-context";
import { useAudio } from "./audio-context";
import { useCrt } from "./crt-context";
import { useLang } from "./lang-context";
import { t, type Lang } from "../data/i18n";
import { PROJECTS, getProject } from "../data/projects";
import {
  PALETTES,
  PALETTE_PREVIEW_COLORS,
  isPaletteName,
  applyPalette,
  persistPalette,
} from "../data/palette";
import logo from "../../Logo/3e3c5a99-524a-4fd8-88be-d24715bbdcf5.png";

// Real, functional command line — direct request ("Terminal Command
// History & Auto-Completion"). No parser library: commands are a fixed
// word set, split on whitespace and switched on directly, matching the
// brief's own "no heavy external parser libraries" constraint. Flag-
// style and multi-word entries (--audio=on, theme cobalt, ...) are full
// literal tokens, not single words like the rest — Tab-completion/help
// just treat them the same way regardless (COMMANDS.filter(startsWith)
// doesn't care whether an entry has a space in it).
const COMMANDS = [
  "about",
  "clear",
  "contact",
  "help",
  "skybox",
  "work",
  "systeminfo",
  "--audio=on",
  "--audio=off",
  "--crt=on",
  "--crt=off",
  "theme persimmon",
  "theme cobalt",
  "theme amber",
  "theme ambergris",
  "theme turbo-blue",
  "theme phosphor-decay",
  "theme stealth-obsidian",
  "theme vapor-comm",
] as const;
const CONTACT_EMAIL = "contact@voltairstudio.com";
const HISTORY_LIMIT = 50;
// Only the latest command's own output — this sits inside .content,
// inside .page's zero-scroll grid, which the rest of this system goes
// to real lengths to keep clip/scrollbar-free; a running multi-command
// log would need its own internal scroll area, and a scrolled box with
// no visible "more above" affordance just reads as clipped/broken text
// (caught in an actual screenshot, not assumed). One command's worth
// is enough feedback and never needs scrolling to show in full.
const LOG_LIMIT = 2;

// The fold-out theme picker's own list — direct request, a real
// visual control this time (an earlier round deliberately kept `theme`
// terminal-only, reasoning a visible switcher would be the "bloated
// configuration panel" a different brief warned against; a direct ask
// for one supersedes that). Every real PALETTES entry except
// "ambergris" — it's a pure alias of "amber" (same exact color), and
// a picker showing two visually-identical swatches would just look
// broken, not like a shortcut the way it is as a typed command.
const PALETTE_PICKER_ITEMS = PALETTES.filter((name) => name !== "ambergris");

// theme <name> — the terminal command still exists too, unchanged —
// swaps a handful of the site's real CSS custom properties via a
// data-palette attribute on <html>; every component already reads
// --color-amber-* through var(), so nothing else needs to change for
// the whole site to recolor. The full PALETTES list, validation, and
// apply/persist logic live in ../data/palette.ts now, shared with
// PaletteRestorer.tsx and the picker below — see that file for why
// this used to all live here, until a fresh load of /about or a
// case-study page (this component doesn't render there) turned out to
// never restore a saved theme at all.
//
// Deliberately accent-only — a later request asked for each new
// theme's own named *background* too (e.g. "royal blue #000033"), not
// just its accent. Not built: --color-pane-bg turned out to be load-
// bearing for --text-halo/--text-halo-small (the per-glyph legibility
// ring used on every piece of text on the page, partly hardcoded
// rgba() rather than fully var()-driven — a gradient/shadow can't take
// a var() inside its own alpha slot). Re-theming that safely across 5
// new colors without risking text legibility against the actual sky
// (which never changes color, only the accent does) is real, separate
// work, not something to fold in silently alongside an accent swap.
// persimmon/cobalt/amber never touched the background either, so this
// keeps every theme consistent with itself rather than only the
// newest ones getting a half-finished background.

// One-time boot flavor text on first-ever visit (direct request) —
// real facts about what's actually already on screen by the time this
// mounts (the skybox has genuinely finished loading — LoadingScreen
// already gated on that — and this terminal genuinely is now
// interactive), not fabricated subsystem names. Rides the same
// LOG_LIMIT-capped log every command already uses instead of a
// separate full-screen gate — this is NOT a second loading screen,
// LoadingScreen.tsx already owns the real asset-loading gate; this is
// just the terminal's own shell announcing itself, purely decorative,
// never blocks real typing/input while it plays.
const BOOT_SEEN_KEY = "voltair-boot-seen";
// First line is a literal product banner, not prose — real CLIs don't
// localize their own name line, so it's identical in both languages
// (same policy as command tokens, see data/i18n.ts's own header
// comment). The rest translate via the current lang at boot time.
function bootLines(lang: Lang) {
  return [
    "voltair_studio deploy console",
    `skybox engine ... ${t(lang, "terminal.bootReady")}`,
    `terminal shell ... ${t(lang, "terminal.bootReady")}`,
    t(lang, "terminal.typeHelp"),
  ];
}
const BOOT_LINE_DELAY_MS = 120;

type LogLine = { id: number; text: string };

// Best-effort real UA parse for systeminfo's "engine" row — checked in
// order of specificity (Edge's UA also contains "Chrome/", Chrome's
// also contains a trailing "Safari/xxx" compatibility token, so the
// rarer/more specific tokens have to be tested first or they'd never
// match). Not a guaranteed-precise browser ID, just an honest reading
// of navigator.userAgent — no fabricated value if nothing matches.
function detectEngine(ua: string): string {
  if (ua.includes("Edg/")) return `Edge ${ua.match(/Edg\/(\d+)/)?.[1] ?? ""}`.trim();
  if (ua.includes("Firefox/")) return `Firefox ${ua.match(/Firefox\/(\d+)/)?.[1] ?? ""}`.trim();
  if (ua.includes("Chrome/")) return `Chrome ${ua.match(/Chrome\/(\d+)/)?.[1] ?? ""}`.trim();
  // Real Safari UAs carry the actual browser version in "Version/x",
  // not "Safari/x" (that's the WebKit build number instead).
  if (ua.includes("Safari/")) return `Safari ${ua.match(/Version\/(\d+)/)?.[1] ?? ""}`.trim();
  return "unknown";
}

export default function TerminalInput() {
  const [value, setValue] = useState("");
  const [log, setLog] = useState<LogLine[]>([]);
  // systeminfo's own output — deliberately not routed through the
  // regular LOG_LIMIT-capped log above. A real ~8-row diagnostic table
  // needs more than the 2 lines that log stays bounded to on purpose
  // (see LOG_LIMIT's own comment); rather than reopen that already-
  // fixed clipped-log problem, this gets its own separate, fully-sized
  // block that replaces the regular log display while it's showing,
  // and clears on any other command (including clear itself).
  const [systemInfo, setSystemInfo] = useState<{ key: string; value: string }[] | null>(null);
  const historyRef = useRef<string[]>([]);
  // null = live draft line; otherwise an index into historyRef.current.
  const historyCursorRef = useRef<number | null>(null);
  const draftRef = useRef("");
  const logIdRef = useRef(0);
  const mountTimeRef = useRef(0);
  // A real, invisible mailto: link — the `contact` command clicks it
  // programmatically instead of assigning window.location.href, so
  // there's exactly one way this app ever triggers a mailto: (a real
  // <a>), not two different code paths for the same action.
  const mailtoLinkRef = useRef<HTMLAnchorElement>(null);

  const { active: activeSkybox, next: nextSkybox } = useSkybox();
  const { enabled: audioEnabled, setEnabled: setAudioEnabled, playClick } = useAudio();
  const { enabled: crtEnabled, setEnabled: setCrtEnabled } = useCrt();
  const { lang } = useLang();
  const router = useTransitionRouter();

  // Real uptime (time since this terminal mounted), not a fabricated
  // number — systeminfo reads this. useRef(performance.now()) instead
  // of useState: this is never meant to trigger a re-render on its
  // own, only to be read at the moment systeminfo actually runs.
  if (mountTimeRef.current === 0) mountTimeRef.current = performance.now();

  // Palette restore-on-mount now lives in PaletteRestorer.tsx (root
  // layout, every page) instead of here — this component only mounts
  // on the homepage, which is exactly why the old version of this
  // effect never ran on /about or a case-study page. Nothing to do
  // here anymore beyond the `theme` command itself, below.

  // One-time boot flavor text on first-ever visit — see BOOT_LINES'
  // own comment above for why this is real, not fabricated, and why
  // it's not a second loading screen. Skipped entirely under reduced
  // motion (purely decorative, nothing here is essential information)
  // and after the very first time, via the same localStorage-gate
  // shape every other persisted preference in this file already uses.
  //
  // The "should this play" decision is made once here, during render,
  // guarded the same lazy-init-ref way mountTimeRef above is — not
  // inside the effect below. React 18 Strict Mode runs a mount effect,
  // its cleanup, then the same effect again on every real mount (dev
  // only) specifically to catch effects that don't survive that; an
  // earlier version checked *and set* the localStorage flag inside the
  // effect itself, which is exactly the shape that dance breaks: the
  // first invocation set the flag and scheduled the timeouts, its
  // cleanup cleared every one of them before any could fire, and the
  // second invocation then saw the flag already set and skipped
  // entirely — net result, the sequence never actually played, caught
  // by reading it back live rather than assuming the effect worked
  // once it compiled. Deciding "should play" once up front means both
  // Strict-Mode invocations agree, so the one that actually survives
  // still gets to schedule and finish the sequence. Confirmed this was
  // dev-only (Strict Mode doesn't double-invoke in production — a real
  // `next build && next start` played the sequence correctly even
  // with the old code), but an effect that only works by accident of
  // which environment happens to run it once isn't something worth
  // leaving as "well, production was fine."
  const shouldPlayBootRef = useRef<boolean | null>(null);
  if (shouldPlayBootRef.current === null) {
    let seen = false;
    try {
      seen = localStorage.getItem(BOOT_SEEN_KEY) === "1";
    } catch {
      // localStorage blocked — treat as unseen; worst case it can
      // replay on a later visit too, which is harmless
    }
    shouldPlayBootRef.current = !seen;
  }
  useEffect(() => {
    if (!shouldPlayBootRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    try {
      localStorage.setItem(BOOT_SEEN_KEY, "1");
    } catch {
      // not persisted, but still plays once for this visit
    }
    // Mount-only by design (shouldPlayBootRef guards the once-ever
    // replay), so `lang` here is whatever it is at that instant — the
    // same one-tick "SSR-safe default, corrected shortly after" gap
    // every other persisted preference in this app already has (CRT
    // briefly renders "on" before its own saved-off correction lands,
    // etc.); not worth deferring a one-time decorative banner to close.
    const lines = bootLines(lang);
    const timeouts = lines.map((line, i) =>
      setTimeout(() => pushLog(line), i * BOOT_LINE_DELAY_MS),
    );
    return () => timeouts.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function pushLog(text: string) {
    // Snapshot the id into a local const *before* the updater closure —
    // a command like `xyz` calls pushLog twice synchronously (the echoed
    // "xyz" line, then "command not found"), and React doesn't run
    // either updater until after this handler returns. Reading
    // `logIdRef.current` directly inside the updater (as this used to)
    // meant both closures read the same already-fully-incremented ref
    // value at that later point, handing out one id to two lines — a
    // real duplicate-key bug (confirmed via React's own warning plus
    // corrupted log output), not a display quirk.
    const id = ++logIdRef.current;
    setLog((prev) => [...prev, { id, text }].slice(-LOG_LIMIT));
  }

  function runCommand(raw: string) {
    const trimmed = raw.trim();
    if (!trimmed) return;

    const hist = historyRef.current;
    hist.push(trimmed);
    if (hist.length > HISTORY_LIMIT) hist.shift();
    historyCursorRef.current = null;
    draftRef.current = "";
    setValue("");

    const [name, arg] = trimmed.toLowerCase().split(/\s+/);
    // Any command other than systeminfo itself drops back to the
    // regular log display — systeminfo's own case below re-sets this
    // right after, so it still wins when that's the command that ran.
    setSystemInfo(null);
    pushLog(trimmed);

    switch (name) {
      case "help":
        pushLog(`${t(lang, "terminal.commandsLabel")}: ${COMMANDS.join(" · ")}`);
        break;
      case "about":
        pushLog("→ /about");
        // /about is a real route (see app/about/page.tsx) — useTransitionRouter
        // instead of a plain router.push so this still gets a real
        // browser view transition, matching every <Link> navigation
        // elsewhere in this app (there's no JSX element here to wrap in
        // next-view-transitions' own Link, so its router hook is the
        // equivalent for a programmatic navigation).
        router.push("/about");
        break;
      case "contact":
        pushLog(`→ ${CONTACT_EMAIL} ${t(lang, "terminal.contactCopied")}`);
        if (navigator.clipboard) {
          navigator.clipboard.writeText(CONTACT_EMAIL).catch(() => {});
        }
        // Real navigation, not just a clipboard courtesy — matches
        // ChromeBar's Contact link (copy + still actually opens mail).
        // A real, momentary <a> click instead of assigning
        // window.location.href directly — same effect, but matches how
        // every other mailto: link in this app already works (ChromeBar,
        // the case-study CTA) instead of a second, different code path.
        mailtoLinkRef.current?.click();
        break;
      case "skybox": {
        const nextName = SKYBOXES[(SKYBOXES.indexOf(activeSkybox) + 1) % SKYBOXES.length];
        pushLog(`→ skybox: ${nextName}`);
        nextSkybox();
        break;
      }
      case "work":
        // Bare `work` keeps its existing behavior (list + focus the
        // reel) unchanged; `work <slug>` is new — direct request to
        // navigate straight to a case study from the command line, the
        // same real router.push + view-transition pattern `about`
        // already uses below, not a second, different navigation path.
        if (arg) {
          const project = getProject(arg);
          if (project) {
            pushLog(`→ /work/${project.slug}`);
            router.push(`/work/${project.slug}`);
          } else {
            pushLog(`${t(lang, "terminal.projectNotFound")} ${arg}`);
          }
        } else {
          pushLog(`→ ${t(lang, "terminal.projectsLabel")}: ${PROJECTS.map((p) => p.name).join(", ")}`);
          focusFirstProject();
        }
        break;
      case "--audio=on":
        setAudioEnabled(true);
        pushLog(t(lang, "terminal.soundOn"));
        break;
      case "--audio=off":
        setAudioEnabled(false);
        pushLog(t(lang, "terminal.soundOff"));
        break;
      case "--crt=on":
        setCrtEnabled(true);
        pushLog(t(lang, "terminal.crtOn"));
        break;
      case "--crt=off":
        setCrtEnabled(false);
        pushLog(t(lang, "terminal.crtOff"));
        break;
      case "theme": {
        if (arg && isPaletteName(arg)) {
          applyPalette(arg);
          persistPalette(arg);
          pushLog(`→ ${t(lang, "terminal.paletteLabel")}: ${arg}`);
        } else {
          // Direct request: an invalid name lists every real option,
          // not just a bare "usage" hint — built off the one real
          // PALETTES array so this can't drift from what actually works.
          pushLog(`${t(lang, "terminal.invalidPalette")} ${PALETTES.join(", ")}`);
        }
        break;
      }
      case "systeminfo": {
        const uptimeSec = Math.floor((performance.now() - mountTimeRef.current) / 1000);
        const mm = String(Math.floor(uptimeSec / 60)).padStart(2, "0");
        const ss = String(uptimeSec % 60).padStart(2, "0");
        const canvas = document.querySelector<HTMLCanvasElement>(".skybox-canvas");
        setSystemInfo([
          { key: "uptime", value: `${mm}:${ss}` },
          { key: "viewport", value: `${window.innerWidth}×${window.innerHeight}` },
          { key: "dpr", value: String(window.devicePixelRatio) },
          { key: "engine", value: detectEngine(navigator.userAgent) },
          { key: "skybox", value: activeSkybox },
          { key: "canvas", value: canvas ? `${canvas.width}×${canvas.height}` : "n/a" },
          { key: "audio", value: audioEnabled ? t(lang, "terminal.on") : t(lang, "terminal.off") },
          { key: "crt", value: crtEnabled ? t(lang, "terminal.on") : t(lang, "terminal.off") },
        ]);
        break;
      }
      case "clear":
        setLog([]);
        break;
      default:
        pushLog(`${t(lang, "terminal.commandNotFound")} ${name} — ${t(lang, "terminal.tryHelp")}`);
    }
  }

  function focusFirstProject() {
    const first = document.querySelector<HTMLAnchorElement>(".project-index-item");
    first?.focus();
    first?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    // Every real keypress gets the same mechanical click regardless of
    // what it does — a real keyboard clacks on Backspace and Enter too,
    // not just letters. No-op silently when audio is off (see
    // audio-context.tsx's own enabled check inside playClick).
    playClick();
    if (e.key === "ArrowUp") {
      const hist = historyRef.current;
      if (hist.length === 0) return;
      e.preventDefault();
      if (historyCursorRef.current === null) draftRef.current = value;
      const nextIndex =
        historyCursorRef.current === null
          ? hist.length - 1
          : Math.max(0, historyCursorRef.current - 1);
      historyCursorRef.current = nextIndex;
      setValue(hist[nextIndex]);
      return;
    }
    if (e.key === "ArrowDown") {
      if (historyCursorRef.current === null) return;
      e.preventDefault();
      const hist = historyRef.current;
      const nextIndex = historyCursorRef.current + 1;
      if (nextIndex >= hist.length) {
        historyCursorRef.current = null;
        setValue(draftRef.current);
      } else {
        historyCursorRef.current = nextIndex;
        setValue(hist[nextIndex]);
      }
      return;
    }
    if (e.key === "Tab") {
      const current = value.trim().toLowerCase();
      if (!current) return; // nothing to complete — let Tab move focus on
      const matches = COMMANDS.filter((c) => c.startsWith(current));
      if (matches.length === 1 && matches[0] !== current) {
        e.preventDefault();
        setValue(matches[0]);
      } else if (matches.length > 1) {
        e.preventDefault();
        pushLog(matches.join("  "));
      }
      // 0 matches, or already an exact command name: default Tab
      // behavior (move focus on) is left alone, per the brief —
      // never trap a key that has nothing useful to do here.
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      runCommand(value);
    }
  }

  return (
    <div className="terminal-prompt">
      {/* Marks this row as a real text box (an earlier direct request,
          after removing the $ prefix and the cursor glyph left it with
          zero visible affordance at rest) — now also a real fold-out
          theme picker, direct request. Pure CSS hover/focus reveal
          (opacity + pointer-events, .palette-picker:hover/:focus-within
          .palette-picker-menu in globals.css), the same technique
          .mockup-carousel-arrow/-dots already use elsewhere in this
          codebase, not new JS open/close state — the menu's items stay
          real, individually focusable buttons the whole time, so
          Tab-ing onto the trigger reveals the menu and the very next
          Tab already lands inside it, in visual order, for free.
          Escape below just blurs whatever's focused, which naturally
          closes the menu the same way moving the mouse away does. */}
      <div
        className="palette-picker"
        onKeyDown={(e) => {
          if (e.key === "Escape" && document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }
        }}
      >
        <button
          type="button"
          className="terminal-prompt-logo"
          aria-haspopup="true"
          aria-label="Change color theme"
          style={{ WebkitMaskImage: `url(${logo.src})`, maskImage: `url(${logo.src})` }}
        />
        <div className="palette-picker-menu" role="menu" aria-label="Color theme">
          {PALETTE_PICKER_ITEMS.map((name) => (
            <button
              key={name}
              type="button"
              role="menuitem"
              className="palette-picker-item"
              onClick={(e) => {
                applyPalette(name);
                persistPalette(name);
                // A clicked button keeps browser focus by default,
                // which would otherwise leave the menu open via
                // :focus-within even once the mouse moves away —
                // caught live (the menu stayed open after a real
                // click), not the intended "pick one and it closes"
                // feel a normal dropdown has. Blurring hands focus
                // back to nothing in particular, matching :hover's own
                // close-on-leave behavior instead of fighting it.
                e.currentTarget.blur();
              }}
            >
              <span
                className="palette-picker-swatch"
                aria-hidden="true"
                style={{ backgroundColor: PALETTE_PREVIEW_COLORS[name] }}
              />
              {name}
            </button>
          ))}
        </div>
      </div>
      <span className="terminal-prompt-text" aria-hidden="true">
        {value}
      </span>
      <input
        type="text"
        className="terminal-prompt-input"
        aria-label="Terminal command input. Try help."
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {systemInfo ? (
        // Its own fully-sized block, not the LOG_LIMIT-capped log below
        // — a real ~8-row table needs more than the 2 lines that cap
        // was deliberately set to (see LOG_LIMIT's comment), and every
        // row here is a known, fixed count, so it never needs internal
        // scroll to show in full either.
        <div className="terminal-systeminfo" role="status" aria-live="polite">
          <p className="terminal-log-line">systeminfo:</p>
          {systemInfo.map((row) => (
            <div key={row.key} className="terminal-systeminfo-row">
              <span className="terminal-systeminfo-key">{row.key}</span>
              <span className="terminal-systeminfo-value">{row.value}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="terminal-log" role="status" aria-live="polite">
          {log.map((entry) => (
            <p key={entry.id} className="terminal-log-line">
              {entry.text}
            </p>
          ))}
        </div>
      )}
      {/* Never shown, never reachable by keyboard on its own — the
          `contact` command's only way of triggering a real mailto:
          navigation (see runCommand above). */}
      <a ref={mailtoLinkRef} href={`mailto:${CONTACT_EMAIL}`} hidden aria-hidden="true" tabIndex={-1} />
    </div>
  );
}
