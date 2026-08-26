"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useSkybox } from "./skybox-context";
import { useAudio } from "./audio-context";

/** One full revolution every 150s — slow enough to read as ambient drift, never distracting. */
const ROTATION_PERIOD_MS = 150_000;
/** Tuning for the camera's mouse-drift + ambient sine wobble ("oil-smooth"
 *  physics) — one place for every constant that shapes it, rather than a
 *  scatter of individually-named ones. maxTilt in radians: 0.1 ≈ 5.7°,
 *  still comfortably subtle (the sky is a legibility backdrop for text
 *  floating over it, not a focal point, and the sphere's 500-unit radius
 *  means clipping isn't a real risk at this tilt regardless). lerpFactor
 *  is the per-frame smoothing toward the current target. ambientSpeed
 *  scales a continuous sin/cos drift layered under the mouse tilt, so
 *  the sky keeps a faint living motion even with the mouse still. */
const physicsConfig = {
  maxTiltX: 0.1,
  maxTiltY: 0.1,
  lerpFactor: 0.04,
  ambientSpeedX: 0.02,
  ambientSpeedY: 0.03,
};
/** Failsafe: dismiss the loading screen even if the first texture never
 *  resolves (offline, blocked request) rather than hang on it forever. */
const LOAD_TIMEOUT_MS = 8_000;
/** How long the canvas dips toward transparent before a skybox *switch*
 *  (not the first load — that's already covered by the loading screen,
 *  a fade there would never actually be seen) — long enough to read as
 *  a deliberate transition, short enough to still feel snappy. Applied
 *  to the canvas's own transitionDuration in JS (not hardcoded in
 *  globals.css too) so there's one source of truth, not two values
 *  that have to be kept in sync by hand. */
const SWITCH_FADE_MS = 220;

/** Fetches the texture manually (instead of THREE.TextureLoader, whose
 *  default ImageLoader never fires onProgress) so the loading screen can
 *  show real bytes-loaded progress, matching the reference's own behavior. */
async function loadTextureWithProgress(
  url: string,
  onProgress: (loaded: number, total: number) => void,
): Promise<THREE.Texture> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.status}`);

  let blob: Blob;
  const total = Number(response.headers.get("content-length")) || 0;
  if (response.body && total > 0) {
    const reader = response.body.getReader();
    const chunks: BlobPart[] = [];
    let loaded = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      // Copy into a plain ArrayBuffer-backed view — the reader's own
      // Uint8Array<ArrayBufferLike> isn't assignable to BlobPart under
      // strict lib.dom types (ArrayBufferLike admits SharedArrayBuffer).
      chunks.push(new Uint8Array(value));
      loaded += value.length;
      onProgress(loaded, total);
    }
    blob = new Blob(chunks);
  } else {
    // No stream or no content-length (e.g. chunked encoding) — can't
    // report incremental progress, just await the full body.
    blob = await response.blob();
  }

  const objectUrl = URL.createObjectURL(blob);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to decode ${url}`));
      img.src = objectUrl;
    });
    const texture = new THREE.Texture(image);
    texture.needsUpdate = true;
    return texture;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export default function SkyboxCanvas() {
  const { active, reportLoadProgress, reportReady } = useSkybox();
  const { playSweep } = useAudio();
  // playSweep's identity changes whenever the audio on/off toggle
  // flips (see audio-context.tsx — it's memoized on `enabled`). The
  // texture-swap effect below must NOT re-run just because someone
  // toggled audio — that would re-fetch/re-fade the *current* texture
  // and fire a phantom sweep on every toggle, not an actual switch. A
  // ref always holding the latest function, updated in its own tiny
  // effect, lets the real effect call the current playSweep without
  // depending on it.
  const playSweepRef = useRef(playSweep);
  useEffect(() => {
    playSweepRef.current = playSweep;
  }, [playSweep]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sphereRef = useRef<THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial> | null>(null);
  const hasLoadedOnceRef = useRef(false);
  // Normalized (-1..1) cursor position and the camera's current lerp
  // target — refs, not state, so mousemove/animate never trigger a
  // React re-render (there's nothing here React needs to know about;
  // the camera object is mutated directly every frame).
  const mousePosRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0, y: 0 });

  // Mount-only: scene, camera, renderer, render loop, resize handling.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Radius-500 sphere, texture on the inside (camera sits at the origin, inside it).
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);
    const material = new THREE.MeshBasicMaterial();
    const sphere = new THREE.Mesh(geometry, material);
    sphereRef.current = sphere;
    scene.add(sphere);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Mouse-drift: a window-level listener, not one on the canvas
    // itself — .skybox-canvas keeps pointer-events:none (the sky
    // stays a HUD backdrop, never a click target, unchanged from
    // before), this just reads cursor position ambiently.
    // window.innerWidth/Height (not the canvas's own size) for
    // normalization, matching how the renderer/camera below are
    // already sized from the same values.
    const onMouseMove = (e: MouseEvent) => {
      mousePosRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePosRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    if (!reduceMotion) window.addEventListener("mousemove", onMouseMove);

    // Touch-drag drift — the mobile analog of the mouse-drift above,
    // reusing the exact same mousePosRef (and so the exact same
    // physics/lerp) rather than a second parallel implementation.
    // .skybox-canvas itself still keeps pointer-events:none — "never a
    // click target" is unchanged — this listens at the window level
    // and only acts when a touch both (a) didn't start on real
    // interactive content (a link, button, the mockup carousel, an
    // input) and (b) isn't on a page that actually scrolls, so it can
    // never hijack a tap meant for something real or a drag meant to
    // scroll a case-study/about page. Only tracks mousePosRef while the
    // finger is down; on release it simply stops updating, exactly
    // like the mouse does when it stops moving — no separate "spring
    // back" logic needed, the existing lerp already eases toward
    // wherever it was last pointed.
    let isDraggingSky = false;
    const isPageScrollable = () =>
      document.documentElement.scrollHeight > document.documentElement.clientHeight;
    const onTouchStart = (e: TouchEvent) => {
      const target = e.target as Element | null;
      if (target?.closest('a, button, input, textarea, [role="dialog"], [role="region"]')) {
        isDraggingSky = false;
        return;
      }
      isDraggingSky = !isPageScrollable();
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingSky) return;
      const touch = e.touches[0];
      if (!touch) return;
      mousePosRef.current.x = (touch.clientX / window.innerWidth) * 2 - 1;
      mousePosRef.current.y = (touch.clientY / window.innerHeight) * 2 - 1;
    };
    const onTouchEnd = () => {
      isDraggingSky = false;
    };
    if (!reduceMotion) {
      // passive: true throughout — this never calls preventDefault, so
      // it can never block a real scroll or tap even on a page it
      // decides not to act on.
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchmove", onTouchMove, { passive: true });
      window.addEventListener("touchend", onTouchEnd, { passive: true });
      window.addEventListener("touchcancel", onTouchEnd, { passive: true });
    }

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      if (!reduceMotion) {
        sphere.rotation.y += (dt / ROTATION_PERIOD_MS) * Math.PI * 2;

        // "Oil-smooth" physics: mouse tilt plus a continuous sin/cos
        // ambient wobble, combined into one target, then the camera's
        // actual rotation eases toward that target each frame (never
        // snaps straight to it) — the lerp is what makes both the
        // mouse response and the ambient drift itself feel viscous
        // rather than jittery, which is what reads well refracted
        // through the project reel's backdrop-filter glass tiles.
        // Y-mouse drives X-rotation (pitch) and vice versa — standard
        // convention, moving the mouse up/down tilts the view
        // vertically. cos (not sin) on the Y axis is a deliberate
        // phase offset from X's sin: driving both axes with the same
        // wave would trace a straight diagonal line; the quarter-cycle
        // offset traces a lazy ellipse instead, which is what actually
        // reads as organic rather than mechanical.
        const time = Date.now() * 0.001;
        targetRotationRef.current.x =
          mousePosRef.current.y * physicsConfig.maxTiltX +
          Math.sin(time) * physicsConfig.ambientSpeedX;
        targetRotationRef.current.y =
          mousePosRef.current.x * physicsConfig.maxTiltY +
          Math.cos(time) * physicsConfig.ambientSpeedY;

        camera.rotation.x +=
          (targetRotationRef.current.x - camera.rotation.x) * physicsConfig.lerpFactor;
        camera.rotation.y +=
          (targetRotationRef.current.y - camera.rotation.y) * physicsConfig.lerpFactor;
      }
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      geometry.dispose();
      material.map?.dispose();
      material.dispose();
      renderer.dispose();
      sphereRef.current = null;
    };
  }, []);

  // Re-runs whenever the selected skybox changes; swaps the texture in place.
  useEffect(() => {
    const sphere = sphereRef.current;
    if (!sphere) return;

    let cancelled = false;
    const isFirstLoad = !hasLoadedOnceRef.current;
    const applyTexture = (texture: THREE.Texture) => {
      if (cancelled) {
        texture.dispose();
        return;
      }
      texture.colorSpace = THREE.SRGBColorSpace;
      const previous = sphere.material.map;
      sphere.material.map = texture;
      sphere.material.needsUpdate = true;
      previous?.dispose();
    };
    const finishFirstLoad = () => {
      if (!isFirstLoad || hasLoadedOnceRef.current) return;
      hasLoadedOnceRef.current = true;
      reportReady();
    };

    if (isFirstLoad) {
      // The loading screen needs real progress, so the first texture
      // fetches manually instead of going through THREE.TextureLoader
      // (its default ImageLoader never calls onProgress).
      const timeout = setTimeout(finishFirstLoad, LOAD_TIMEOUT_MS);
      loadTextureWithProgress(`/skyboxes/skybox-${active}.png`, (loaded, total) => {
        reportLoadProgress(Math.min(99, Math.round((loaded / total) * 100)));
      })
        .then((texture) => {
          applyTexture(texture);
        })
        .catch(() => {
          // Missing/blocked texture shouldn't hang the loading screen forever.
        })
        .finally(() => {
          clearTimeout(timeout);
          finishFirstLoad();
        });
      return () => {
        cancelled = true;
        clearTimeout(timeout);
      };
    }

    // A subsequent switch (not the first load): dip the canvas toward
    // transparent, swap the texture while it's dim (hiding the abrupt
    // pop), then fade back up once the new frame has actually painted.
    // Not a true GPU-side crossfade between old/new textures (that
    // would need a custom shader blending two texture uniforms — real
    // extra complexity) — a plain opacity dip on the whole canvas is
    // the simpler option the request itself offered as equally valid,
    // and it fully delivers the actual ask: no abrupt snap.
    const canvas = canvasRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (canvas && !reducedMotion) {
      canvas.style.transition = `opacity ${SWITCH_FADE_MS}ms ease`;
      canvas.style.opacity = "0.15";
    }
    // Right here specifically (not the first-load branch above, and
    // not inside SkyboxSwitcher/the terminal's `skybox` command) so
    // every real switch plays it exactly once regardless of which of
    // the two triggers caused it — no-op silently if audio is off.
    playSweepRef.current();

    const loader = new THREE.TextureLoader();
    loader.load(`/skyboxes/skybox-${active}.png`, (texture) => {
      applyTexture(texture);
      if (canvas && !reducedMotion) {
        // Wait a frame so the browser has actually painted the new
        // texture before fading back up — otherwise the fade-in can
        // start against the still-stale frame for one tick.
        requestAnimationFrame(() => {
          if (!cancelled) canvas.style.opacity = "1";
        });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [active, reportLoadProgress, reportReady]);

  return <canvas ref={canvasRef} className="skybox-canvas" aria-hidden="true" />;
}
