"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

// Same minimal Context pattern audio-context.tsx / skybox-context.tsx
// already established — the CRT scanline+vignette overlay (globals.css,
// body::after) is plain CSS with nothing React-rendered to toggle
// directly, so this syncs its one boolean onto a real DOM attribute
// (document.body.dataset.crt) instead, which the CSS then reads.
const STORAGE_KEY = "voltair-crt-enabled";

type CrtContextValue = {
  enabled: boolean;
  setEnabled: (next: boolean) => void;
};

const Ctx = createContext<CrtContextValue | null>(null);

export function CrtProvider({ children }: { children: ReactNode }) {
  // Default ON — the CRT overlay shipped as an always-on baseline
  // commitment (see DESIGN.md), not an opt-in feature; a visitor who's
  // never touched the toggle should keep seeing exactly what always
  // rendered, not have it silently switched off under them.
  const [enabled, setEnabledState] = useState(true);

  // Reads any saved preference once, client-side only — same
  // hydration-safety shape as audio-context.tsx's own identical read.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      // One-time read of a real external system (localStorage,
      // unavailable during SSR) to correct a fixed SSR-safe default —
      // not state derived from a prop.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved !== null) setEnabledState(saved === "1");
    } catch {
      // localStorage blocked (private mode, disabled) — default stands
    }
  }, []);

  // Syncs the real DOM attribute the CSS actually reads
  // (body:not([data-crt="off"])::after — see globals.css) whenever
  // `enabled` changes, including the correction above.
  useEffect(() => {
    document.body.dataset.crt = enabled ? "on" : "off";
  }, [enabled]);

  const setEnabled = useCallback((next: boolean) => {
    setEnabledState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    } catch {
      // not persisted this session, but the in-memory toggle still works
    }
  }, []);

  return <Ctx.Provider value={{ enabled, setEnabled }}>{children}</Ctx.Provider>;
}

export function useCrt() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCrt must be used within CrtProvider");
  return ctx;
}
