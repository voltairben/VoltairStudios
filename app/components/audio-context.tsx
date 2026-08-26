"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

// Same minimal Context pattern skybox-context.tsx already established
// for a cross-component synced value — needed here because sound has
// to be triggerable from places that share nothing else: the terminal
// (keydown clicks, the --audio= command), StatusBar (the toggle
// itself), and route changes (this file's own pathname effect below).
//
// Both sounds are synthesized directly via the Web Audio API — no
// audio files, no library. "No heavy external audio libraries" was
// explicit in the brief, and there's nothing real to source or
// fabricate an mp3 from anyway; a couple of oscillator nodes with a
// short gain envelope is both the lightest and the most honest way to
// get a "mechanical click" and a "holographic sweep."
const STORAGE_KEY = "voltair-audio-enabled";
const CLICK_DURATION_S = 0.03;
const SWEEP_DURATION_S = 0.4;

type AudioContextValue = {
  enabled: boolean;
  setEnabled: (next: boolean) => void;
  playClick: () => void;
  playSweep: () => void;
};

const Ctx = createContext<AudioContextValue | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  // Default OFF — a visitor never asked for click/sweep sound effects
  // just by loading the page; --audio=on in the terminal and the
  // StatusBar flag both make it a deliberate opt-in, not an ambush.
  const [enabled, setEnabledState] = useState(false);
  const webAudioCtxRef = useRef<InstanceType<typeof window.AudioContext> | null>(null);

  // Reads any saved preference once, client-side only — a plain
  // useState initializer would run during SSR too, where localStorage
  // doesn't exist (same hydration-safety shape skybox-context.tsx
  // already uses for its own chrono-aware default).
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      // One-time read of a real external system (localStorage,
      // unavailable during SSR) to correct a fixed SSR-safe default —
      // not state derived from a prop, no external-store subscription
      // applies.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved !== null) setEnabledState(saved === "1");
    } catch {
      // localStorage blocked (private mode, disabled) — default stands
    }
  }, []);

  const setEnabled = useCallback((next: boolean) => {
    setEnabledState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    } catch {
      // not persisted this session, but the in-memory toggle still works
    }
  }, []);

  // Lazily created on first real play — browsers block audio (and
  // sometimes AudioContext construction itself) before a genuine user
  // gesture; every trigger point here (typing, clicking the skybox
  // switcher, navigating) already is one, so this never needs a
  // separate "tap to enable sound" prompt.
  const getWebAudioCtx = (): InstanceType<typeof window.AudioContext> | null => {
    try {
      if (!webAudioCtxRef.current) {
        const Ctor =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof window.AudioContext })
            .webkitAudioContext;
        if (!Ctor) return null;
        webAudioCtxRef.current = new Ctor();
      }
      if (webAudioCtxRef.current.state === "suspended") {
        webAudioCtxRef.current.resume().catch(() => {});
      }
      return webAudioCtxRef.current;
    } catch {
      return null; // audio genuinely unavailable — never break the
      // real interaction (typing, navigating) this is only garnish for
    }
  };

  const playClick = useCallback(() => {
    if (!enabled) return;
    const ctx = getWebAudioCtx();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      // Slight per-key pitch variance — a real mechanical keyboard
      // doesn't click at one exact frequency either.
      osc.frequency.value = 1800 + Math.random() * 400;
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + CLICK_DURATION_S);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + CLICK_DURATION_S);
    } catch {
      // synthesis failed on this call — not worth surfacing over typing
    }
  }, [enabled]);

  const playSweep = useCallback(() => {
    if (!enabled) return;
    const ctx = getWebAudioCtx();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + SWEEP_DURATION_S * 0.85);
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.045, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + SWEEP_DURATION_S);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + SWEEP_DURATION_S);
    } catch {
      // synthesis failed on this call — navigation/skybox swap still happened
    }
  }, [enabled]);

  // Route-change sweep — usePathname() updates on any client-side
  // navigation regardless of which Link triggered it (next/link and
  // next-view-transitions' Link both go through the same App Router).
  // Skips the very first render so loading the site doesn't itself
  // play a sound before anyone's touched anything.
  const pathname = usePathname();
  const isFirstPathRef = useRef(true);
  useEffect(() => {
    if (isFirstPathRef.current) {
      isFirstPathRef.current = false;
      return;
    }
    playSweep();
    // playSweep intentionally omitted: it's stable in effect (memoized
    // on `enabled`, and re-running this effect only on `enabled`
    // changing would replay a sweep just from toggling audio, which
    // isn't a navigation) — only pathname should retrigger this.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Ctx.Provider value={{ enabled, setEnabled, playClick, playSweep }}>{children}</Ctx.Provider>
  );
}

export function useAudio() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAudio must be used within AudioProvider");
  return ctx;
}
