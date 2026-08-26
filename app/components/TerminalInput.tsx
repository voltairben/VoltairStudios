"use client";

import { useRef, useState } from "react";
import { useTransitionRouter } from "next-view-transitions";
import { useSkybox, SKYBOXES } from "./skybox-context";
import { useAudio } from "./audio-context";
import { PROJECTS } from "../data/projects";

// Real, functional command line — direct request ("Terminal Command
// History & Auto-Completion"). No parser library: commands are a fixed
// word set, split on whitespace and switched on directly, matching the
// brief's own "no heavy external parser libraries" constraint. The two
// --audio= entries are full literal tokens (no space to split on), not
// single words like the rest — Tab-completion/help just treat them the
// same way regardless.
const COMMANDS = [
  "about",
  "clear",
  "contact",
  "help",
  "skybox",
  "work",
  "--audio=on",
  "--audio=off",
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

type LogLine = { id: number; text: string };

export default function TerminalInput() {
  const [value, setValue] = useState("");
  const [log, setLog] = useState<LogLine[]>([]);
  const historyRef = useRef<string[]>([]);
  // null = live draft line; otherwise an index into historyRef.current.
  const historyCursorRef = useRef<number | null>(null);
  const draftRef = useRef("");
  const logIdRef = useRef(0);
  // A real, invisible mailto: link — the `contact` command clicks it
  // programmatically instead of assigning window.location.href, so
  // there's exactly one way this app ever triggers a mailto: (a real
  // <a>), not two different code paths for the same action.
  const mailtoLinkRef = useRef<HTMLAnchorElement>(null);

  const { active: activeSkybox, next: nextSkybox } = useSkybox();
  const { setEnabled: setAudioEnabled, playClick } = useAudio();
  const router = useTransitionRouter();

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

    const [name] = trimmed.toLowerCase().split(/\s+/);
    pushLog(trimmed);

    switch (name) {
      case "help":
        pushLog(`commands: ${COMMANDS.join(" · ")}`);
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
        pushLog(`→ ${CONTACT_EMAIL} copied — opening mail client`);
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
        pushLog(`→ projects: ${PROJECTS.map((p) => p.name).join(", ")}`);
        focusFirstProject();
        break;
      case "--audio=on":
        setAudioEnabled(true);
        pushLog("→ sound: on");
        break;
      case "--audio=off":
        setAudioEnabled(false);
        pushLog("→ sound: off");
        break;
      case "clear":
        setLog([]);
        break;
      default:
        pushLog(`command not found: ${name} — try 'help'`);
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
      <div className="terminal-log" role="status" aria-live="polite">
        {log.map((entry) => (
          <p key={entry.id} className="terminal-log-line">
            {entry.text}
          </p>
        ))}
      </div>
      {/* Never shown, never reachable by keyboard on its own — the
          `contact` command's only way of triggering a real mailto:
          navigation (see runCommand above). */}
      <a ref={mailtoLinkRef} href={`mailto:${CONTACT_EMAIL}`} hidden aria-hidden="true" tabIndex={-1} />
    </div>
  );
}
