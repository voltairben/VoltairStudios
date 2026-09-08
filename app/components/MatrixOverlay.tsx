"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

// `matrix` terminal command — a full-viewport ASCII cascade, direct
// request. Plain 2D <canvas> + requestAnimationFrame, no library — the
// same "raw browser API, no dependency" precedent every other piece of
// motion/audio in this codebase already follows (SkyboxCanvas's raw
// WebGL, AudioProvider's raw Web Audio oscillators). A DOM grid (the
// page-transition overlay's own technique) doesn't fit here: that grid
// is a fixed ~160 blocks toggling opacity in place; a real cascade
// needs many more glyphs constantly repainting at different phases per
// column, which is what <canvas> is actually for.
//
// Theme-aware, not hardcoded: reads --color-amber-bright (the CSS
// custom property every accent-colored element on this site already
// routes through — despite the legacy name, it holds whichever of the
// 7 real palettes is currently live, see data/palette.ts) once at
// mount via getComputedStyle. Palette is a plain DOM attribute, not
// React state (applyPalette() just sets document.documentElement's
// dataset directly) — reading it once when this mounts is correct and
// sufficient for a brief, one-shot overlay; it doesn't need to react
// live to a theme change nobody can make while this is covering the
// screen anyway (the terminal underneath is covered too).
const CHAR_SIZE = 16;
const CHARSET = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*<>/\\|+=-_";
const FRAME_MS = 50; // ~20fps — a real cascade reads better slightly
// stuttered than perfectly smooth, and it's much cheaper to paint

export default function MatrixOverlay({ onDismiss }: { onDismiss: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const accent =
      getComputedStyle(document.documentElement).getPropertyValue("--color-amber-bright").trim() ||
      "#FF5A36";

    let columns: number[] = [];
    let cols = 0;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      cols = Math.ceil(canvas.width / CHAR_SIZE);
      // Recomputing on resize restarts every column at a random depth
      // rather than trying to preserve/rescale old ones — a resize
      // mid-cascade is rare enough (and this is decorative enough)
      // that a clean restart is the honest simple choice, not a bug.
      columns = Array.from({ length: cols }, () => Math.floor((Math.random() * canvas.height) / CHAR_SIZE));
    }
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    let lastFrame = 0;
    function draw(t: number) {
      raf = requestAnimationFrame(draw);
      if (t - lastFrame < FRAME_MS) return;
      lastFrame = t;
      if (!ctx || !canvas) return;

      // A translucent fill (not a hard clear) is what leaves the
      // fading-trail streak behind each glyph — the classic effect.
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = accent;
      ctx.font = `${CHAR_SIZE}px var(--font-mono, monospace)`;
      for (let i = 0; i < cols; i++) {
        const char = CHARSET[Math.floor(Math.random() * CHARSET.length)];
        const x = i * CHAR_SIZE;
        const y = columns[i] * CHAR_SIZE;
        ctx.fillText(char, x, y);
        // Past the bottom: reset to the top at a random delay so
        // columns don't all re-sync into visible bands over time.
        if (y > canvas.height && Math.random() > 0.975) {
          columns[i] = 0;
        } else {
          columns[i]++;
        }
      }
    }
    raf = requestAnimationFrame(draw);

    // Clean dismissal on any keypress (direct request) — also any
    // pointer press, the same "any input closes it" spirit. Window-
    // level, not just on the canvas: the terminal input is still
    // mounted (just visually covered) and still focused from whatever
    // ran `matrix`, so a window listener catches the dismiss key
    // regardless — paired with blurring that input below so the same
    // keystroke can't also leak a character into it.
    //
    // Attaching on the very next tick, not synchronously here, is
    // load-bearing — caught live, not theoretical: the Enter keydown
    // that ran the `matrix` command itself is still bubbling up the
    // real DOM tree when this effect runs (React commits and runs
    // effects before that native event finishes propagating), so an
    // immediately-attached listener catches that same keystroke and
    // closes the overlay in the same tick it opened. A one-tick defer
    // lets that original event finish bubbling first.
    (document.activeElement as HTMLElement | null)?.blur();
    function dismiss() {
      onDismiss();
    }
    const attachTimer = setTimeout(() => {
      window.addEventListener("keydown", dismiss);
      window.addEventListener("pointerdown", dismiss);
    }, 0);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(attachTimer);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", dismiss);
      window.removeEventListener("pointerdown", dismiss);
    };
    // Mount-only by design — onDismiss is a stable setState callback
    // from TerminalInput, re-running this on its identity isn't needed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Portaled to document.body, not rendered in place — TerminalInput's
  // own root element (.terminal-prompt) carries a real transform (its
  // own boot-in entrance animation, resolved to an identity matrix at
  // rest, still a non-`none` computed transform), which per spec makes
  // it the containing block for any position:fixed descendant. Caught
  // live: without the portal this canvas rendered fixed relative to
  // that small box instead of the viewport, not full-screen at all.
  return createPortal(
    <canvas
      ref={canvasRef}
      className="matrix-overlay"
      aria-hidden="true" // purely decorative, dismissible by anyone
      // via any key/click regardless of whether they can see it
    />,
    document.body,
  );
}
