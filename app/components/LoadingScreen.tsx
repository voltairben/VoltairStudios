"use client";

import { useEffect, useRef, useState } from "react";
import { useSkybox } from "./skybox-context";
import LoadingShader from "./LoadingShader";
import logo from "../../Logo/3e3c5a99-524a-4fd8-88be-d24715bbdcf5.png";

// Matches .loading-screen-done's transition duration in globals.css —
// the shader (a live WebGL context + rAF loop) unmounts once the fade
// finishes, rather than running forever hidden behind the real page.
const FADE_MS = 400;

// Reference: https://segerman.dev/ shows a full-screen loader (centered
// mark + a real bytes-loaded percentage) while its own 3D scene assets
// load, then dismisses once ready. This mirrors that for the same
// functional reason — the skybox texture is a real asset worth covering,
// not just a decorative flourish. Real page content underneath is
// unaffected; this is a temporary overlay, not a gate before hydration.

// On a fast/local connection the real fetch (see skybox-context.tsx /
// SkyboxCanvas.tsx) finishes in well under a second, which made the
// whole screen just flash — direct request: "make it slower so it
// actually loads." This paces the DISPLAYED percentage to a minimum
// floor duration; it still never shows progress ahead of what's really
// been received (min() below), it just refuses to rush a fast load
// past a perceivable minimum.
const MIN_DISPLAY_MS = 2000;

export default function LoadingScreen() {
  const { ready: realReady, loadProgress: realProgress } = useSkybox();
  const [displayProgress, setDisplayProgress] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [shaderMounted, setShaderMounted] = useState(true);
  const realProgressRef = useRef(realProgress);
  const realReadyRef = useRef(realReady);

  // Keep refs current so the rAF loop below always reads live values
  // without needing to restart itself on every progress update.
  useEffect(() => {
    realProgressRef.current = realProgress;
    realReadyRef.current = realReady;
  }, [realProgress, realReady]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const start = performance.now();
    let cancelled = false;
    const tick = (now: number) => {
      if (cancelled) return;
      const elapsed = now - start;
      const timeCeiling = Math.min(100, (elapsed / MIN_DISPLAY_MS) * 100);
      setDisplayProgress(Math.min(realProgressRef.current, timeCeiling));
      if (realReadyRef.current && elapsed >= MIN_DISPLAY_MS) {
        setDisplayProgress(100);
        setDismissed(true);
        return;
      }
      requestAnimationFrame(tick);
    };
    const raf = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, []);

  // Reduced-motion path: no artificial pacing, just mirror real state.
  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setDisplayProgress(realProgress);
    if (realReady) setDismissed(true);
  }, [realProgress, realReady]);

  // Free the WebGL context once the fade-out has actually finished —
  // no point keeping a live shader running behind a hidden overlay.
  useEffect(() => {
    if (!dismissed) return;
    const timeout = setTimeout(() => setShaderMounted(false), FADE_MS);
    return () => clearTimeout(timeout);
  }, [dismissed]);

  return (
    <div
      className={`loading-screen${dismissed ? " loading-screen-done" : ""}`}
      aria-hidden="true"
    >
      {shaderMounted && <LoadingShader />}
      <span
        className="loading-screen-logo"
        style={{ WebkitMaskImage: `url(${logo.src})`, maskImage: `url(${logo.src})` }}
      />
      <span className="loading-screen-percent">{Math.round(displayProgress)}%</span>
    </div>
  );
}
