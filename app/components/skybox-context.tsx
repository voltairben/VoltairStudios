"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

export const SKYBOXES = ["space", "night", "morning", "day", "alien"] as const;
export type SkyboxName = (typeof SKYBOXES)[number];

type SkyboxContextValue = {
  active: SkyboxName;
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
  const [active, setActive] = useState<SkyboxName>("space");
  const [loadProgress, setLoadProgress] = useState(0);
  const [ready, setReady] = useState(false);

  const next = useCallback(() => {
    setActive((current) => {
      const i = SKYBOXES.indexOf(current);
      return SKYBOXES[(i + 1) % SKYBOXES.length];
    });
  }, []);

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
