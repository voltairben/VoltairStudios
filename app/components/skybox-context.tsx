"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

// Real daytime order, by direct request — the assets themselves were
// renamed to match (public/skyboxes/ + Skyboxes/ both now hold
// skybox-morning/day/dusk/night/midnight.png; the old
// skybox-alien.png/skybox-space.png are gone, relabeled to dusk/midnight
// respectively — same images, same file sizes, just renamed).
export const SKYBOXES = ["morning", "day", "dusk", "night", "midnight"] as const;
export type SkyboxName = (typeof SKYBOXES)[number];

// Local-hour boundaries for the chrono-aware default on load (see
// chronoSkyboxNow below) — the old binary day/space split can't work
// anymore now that "space" doesn't exist as a name; this maps all 24
// hours across the real 5-way cycle instead. Ordered by startHour;
// startHour: 0 always matches so every hour resolves to something.
const CHRONO_SCHEDULE: { name: SkyboxName; startHour: number }[] = [
  { name: "midnight", startHour: 0 },
  { name: "morning", startHour: 5 },
  { name: "day", startHour: 10 },
  { name: "dusk", startHour: 17 },
  { name: "night", startHour: 20 },
];

function chronoSkyboxNow(): SkyboxName {
  const hour = new Date().getHours();
  let result: SkyboxName = CHRONO_SCHEDULE[0].name;
  for (const entry of CHRONO_SCHEDULE) {
    if (hour >= entry.startHour) result = entry.name;
  }
  return result;
}

// Persists only a *manual* choice (the switcher, or the terminal's
// `skybox` command) — direct request ("remember their skyboxStyle
// choice"). Reading this on mount only ever wins over the chrono-aware
// default for a visitor who has actually touched the control once;
// anyone who never has still gets the real time-of-day pick exactly as
// before, not silently frozen on whatever the very first visitor's
// clock happened to say.
const STORAGE_KEY = "voltair-skybox";
function isSkyboxName(value: string | null): value is SkyboxName {
  return value !== null && (SKYBOXES as readonly string[]).includes(value);
}

type SkyboxContextValue = {
  active: SkyboxName;
  /** Cycles through all 5 SKYBOXES in order (see SkyboxSwitcher.tsx).
   *  Briefly narrowed to a space/day-only toggle for the chrono-aware
   *  feature; direct request reverted that — the chrono-awareness
   *  stays scoped to just the *initial* choice on load, below. */
  next: () => void;
  /** 0-100, real bytes-loaded progress of the FIRST skybox texture only —
   *  see LoadingScreen.tsx. Switching skyboxes afterward doesn't move this. */
  loadProgress: number;
  /** Flips true once the first texture has loaded (or failed) — the
   *  loading screen's cue to dismiss. Never flips back. */
  ready: boolean;
  reportLoadProgress: (percent: number) => void;
  reportReady: () => void;
};

const SkyboxContext = createContext<SkyboxContextValue | null>(null);

export function SkyboxProvider({ children }: { children: ReactNode }) {
  // Starts "morning" — a fixed, SSR-safe default (also the first entry
  // in SKYBOXES, so it's a sensible starting point either way) — then
  // corrects to the local-time-aware choice in the effect below.
  // Computing this from `new Date()` directly in the initial state
  // would run during SSR too, using the *server's* clock/timezone
  // rather than the visiting user's, risking a hydration mismatch; a
  // client-only effect avoids that entirely. In practice this
  // correction lands well before the loading screen's own ~2s minimum
  // display time elapses, so nobody actually sees the "wrong" initial
  // choice.
  const [active, setActive] = useState<SkyboxName>("morning");

  useEffect(() => {
    // A stored manual choice wins outright; otherwise the same one-time
    // chrono correction as before. Both are real external systems
    // (localStorage, the visitor's own clock) unavailable/unsafe to
    // read during SSR, not state derived from a prop.
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      // localStorage blocked (private mode, disabled) — falls through
      // to the chrono default below, same as never having one saved
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActive(isSkyboxName(stored) ? stored : chronoSkyboxNow());
  }, []);

  const next = useCallback(() => {
    setActive((current) => {
      const i = SKYBOXES.indexOf(current);
      const nextName = SKYBOXES[(i + 1) % SKYBOXES.length];
      try {
        localStorage.setItem(STORAGE_KEY, nextName);
      } catch {
        // not persisted this session, but the in-memory switch still works
      }
      return nextName;
    });
  }, []);

  const [loadProgress, setLoadProgress] = useState(0);
  const [ready, setReady] = useState(false);

  const reportLoadProgress = useCallback((percent: number) => {
    setLoadProgress(percent);
  }, []);

  const reportReady = useCallback(() => {
    setLoadProgress(100);
    setReady(true);
  }, []);

  return (
    <SkyboxContext.Provider
      value={{ active, next, loadProgress, ready, reportLoadProgress, reportReady }}
    >
      {children}
    </SkyboxContext.Provider>
  );
}

export function useSkybox() {
  const ctx = useContext(SkyboxContext);
  if (!ctx) throw new Error("useSkybox must be used within SkyboxProvider");
  return ctx;
}
