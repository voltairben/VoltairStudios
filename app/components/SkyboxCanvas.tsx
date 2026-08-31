"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
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

/** The About page's floating 3D logo — direct request ("in the center
 *  of the skybox floating behind the about text"). Lives in this same
 *  scene/renderer rather than a second canvas: .skybox-canvas is
 *  position:fixed at z-index 0 under everything (see globals.css), so
 *  a world-space object here shows through behind the page's real
 *  content exactly the same way regardless of scroll position — /about
 *  became a real scrolling page later (see globals.css's own About
 *  page section), and this fixed canvas doesn't scroll with it, so the
 *  logo stays visible behind whichever part of the essay is currently
 *  on screen rather than only the first viewport. Loaded on demand
 *  (the file is ~6MB) rather than eagerly at mount — most visits never
 *  reach /about, and this canvas is shared by every route. */
const LOGO_MODEL_URL = "/models/voltair-logo.glb";
// Decoder for Draco-compressed geometry — the logo model is Draco-
// compressed (a direct request to shrink its ~70MB source export; see
// DESIGN.md), and GLTFLoader can't read Draco meshes at all without
// this attached — not a quality/perf tweak, a hard requirement, or the
// load fails outright. Decoder files copied from three's own bundled
// copy (node_modules/three/examples/jsm/libs/draco/) into public/draco/
// so they're served from this app's own origin rather than three's
// default of fetching them from a Google-hosted CDN at runtime.
const DRACO_DECODER_PATH = "/draco/";
const LOGO_DISTANCE = 30; // world units in front of the camera (well
  // inside the 500-radius sky sphere, comfortably past the near clip plane)
const LOGO_TARGET_RADIUS = 18; // half-extent after normalizing the
  // model's own (unknown/arbitrary) export scale. 4.5 → 2.6 → 9 → 13 →
  // this, each a direct follow-up. At LOGO_DISTANCE 30 and the camera's
  // 75° vertical fov, the visible half-height there is ~23 units — 18
  // is deliberately still under that ceiling (the flame shape's own
  // bounding sphere isn't a tight fit around a squat/wide silhouette,
  // so its actual top-to-bottom extent has some slack below the
  // theoretical radius-23 clip point), checked live at both a desktop
  // and a mobile viewport rather than solved on paper (fov is vertical,
  // so portrait width doesn't change the vertical headroom the object
  // has to clip into). --text-halo is what keeps the paragraph legible
  // over it at this size, the same mechanism
  // already carrying every other piece of text on the open sky.
const LOGO_SPIN_PERIOD_MS = 40_000; // its own slower drift, distinct
  // from the sky's 150s rotation so it reads as a separate floating object
const LOGO_BOB_AMPLITUDE = 0.6;
const LOGO_BOB_SPEED = 0.6; // rad/s

/** Recursively frees GPU resources for a loaded glTF (or any Object3D
 *  subtree) — geometries, materials, and any textures each material
 *  holds. Needed for the same reason the sphere's own geometry/material
 *  are disposed in the main effect's cleanup: without this, a Strict
 *  Mode double-invoke (dev) or a real unmount leaks GPU memory instead
 *  of freeing it. */
function disposeObject3D(root: THREE.Object3D) {
  root.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return;
    obj.geometry?.dispose();
    const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
    for (const mat of materials) {
      for (const value of Object.values(mat)) {
        if (value instanceof THREE.Texture) value.dispose();
      }
      mat.dispose();
    }
  });
}

/** Centers the model on its own local origin and scales it to a fixed
 *  target size — a GLB's export scale/pivot is never something to trust
 *  (Blender units, arbitrary pivot points, ...), so this measures the
 *  real geometry instead of assuming either. Returns a wrapper group
 *  positioned in world space; the model itself only carries the
 *  centering offset + scale. */
/** Re-shades every mesh in the model from flat to smooth — checked live
 *  against a close-up screenshot after the first load (direct report:
 *  "smoothen the glb ... so it looks smoother"), which showed real
 *  faceting: visible flat polygon patches breaking up what should be a
 *  continuous curved surface, not a stylistic choice worth keeping.
 *  The root cause is the export itself, not the renderer: a
 *  flat-shaded GLB duplicates each triangle's vertices so every face
 *  can carry its own single normal, which is exactly what defeats a
 *  plain geometry.computeVertexNormals() call on its own — there's
 *  nothing shared to average across yet. Normals are stripped first so
 *  mergeVertices() welds purely on position (not also requiring the
 *  old, deliberately-mismatched per-face normals to already agree),
 *  then fresh smooth normals are computed from that welded topology.
 *  flatShading on the material is the same knob from the other
 *  direction (some exporters set it directly) — cleared too, in case
 *  either cause is present. */
function smoothLogoSurfaces(root: THREE.Object3D) {
  root.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return;
    obj.geometry.deleteAttribute("normal");
    const smoothed = mergeVertices(obj.geometry);
    smoothed.computeVertexNormals();
    obj.geometry.dispose();
    obj.geometry = smoothed;

    const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
    for (const mat of materials) {
      const standard = mat as THREE.MeshStandardMaterial;
      if (standard.flatShading) {
        standard.flatShading = false;
        standard.needsUpdate = true;
      }
    }
  });
}

function normalizeLogo(root: THREE.Object3D): THREE.Group {
  const box = new THREE.Box3().setFromObject(root);
  const size = new THREE.Vector3();
  box.getSize(size);
  const center = new THREE.Vector3();
  box.getCenter(center);
  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  root.position.sub(center);
  root.scale.setScalar((LOGO_TARGET_RADIUS * 2) / maxDim);

  const group = new THREE.Group();
  group.add(root);
  group.position.set(0, 0, -LOGO_DISTANCE);
  return group;
}

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
  const pathname = usePathname();
  // Always the latest pathname, readable from inside the GLTFLoader's
  // async callback below without that callback closing over a stale
  // value from whenever the load actually started — same shape as
  // playSweepRef just below (a ref, corrected in its own tiny effect
  // after render, not written during render itself).
  const pathnameRef = useRef(pathname);
  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);
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
  const sceneRef = useRef<THREE.Scene | null>(null);
  const logoGroupRef = useRef<THREE.Group | null>(null);
  const dracoLoaderRef = useRef<DRACOLoader | null>(null);
  // Guards against loading the model twice for the *same* scene — reset
  // to false right when a scene is (re)created below, not in cleanup,
  // so a Strict Mode double-invoke (which builds a whole new scene) still
  // gets its own fresh load rather than skipping it because the previous,
  // now-discarded scene's request already flipped this true.
  const logoRequestedRef = useRef(false);
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
    sceneRef.current = scene;
    logoGroupRef.current = null;
    logoRequestedRef.current = false; // fresh scene, fresh load-once guard
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(DRACO_DECODER_PATH);
    dracoLoaderRef.current = dracoLoader;
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

    // Lighting for the About page's logo model below — harmless to the
    // sky sphere itself (MeshBasicMaterial is unlit by design, immune to
    // any light in the scene), but real PBR materials (what a glTF
    // export normally carries) render solid black with none at all.
    // Added unconditionally at scene setup, not only once the logo is
    // about to show — two lights cost nothing to render against an
    // otherwise-unlit scene, and it's simpler than threading a second
    // conditional add/remove alongside the logo's own visibility toggle.
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const keyLight = new THREE.DirectionalLight(0xffffff, 0.8);
    keyLight.position.set(4, 6, 8);
    scene.add(keyLight);

    // Environment reflections — checked the logo's actual material live
    // (metalness: 1, roughness: 1, but hasEnvMap: false) before touching
    // this: metalness:1 means it has almost no diffuse response at all,
    // so with nothing to reflect, direct lights alone could only ever
    // produce one thin specular highlight sweeping across the surface —
    // which is exactly the flat, dull look a "polish the lighting"
    // request was about. RoomEnvironment is three.js's own standard
    // fix for precisely this (a small procedural studio backdrop meant
    // to light PBR/metal previews, not a real scene object) — reused
    // as-is rather than reaching for a real HDRI asset or hand-rolling
    // a fake environment. PMREMGenerator pre-filters it into properly
    // blurred mip levels per roughness value, which a raw texture
    // assigned directly to scene.environment wouldn't get. Generated
    // once, not tied to the active skybox — a generic studio reflection
    // reads fine regardless of which sky theme is showing, and avoids
    // regenerating this (a real render pass) on every skybox switch.
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envRenderTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRenderTarget.texture;

    // Filmic tone mapping — a metal:1 material leans almost entirely on
    // its specular highlights for shape, and without this those blow out
    // to flat white instead of rolling off. Renderer-wide by necessity
    // (tone mapping is a renderer setting, not per-object), but the sky
    // sphere is explicitly exempted (toneMapped = false) so its own raw
    // texture colors — the actual skybox artwork — render exactly as
    // before, unaffected.
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    material.toneMapped = false;

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

        // About page's logo — its own slow spin (distinct period from
        // the sky's) plus a gentle vertical bob, the "floating" the
        // request asked for. No-op until the model's actually loaded
        // (logoGroupRef starts null); reuses the same `time` this frame
        // already computed above rather than a second Date.now() call.
        const logo = logoGroupRef.current;
        if (logo) {
          logo.rotation.y += (dt / LOGO_SPIN_PERIOD_MS) * Math.PI * 2;
          logo.position.y = Math.sin(time * LOGO_BOB_SPEED) * LOGO_BOB_AMPLITUDE;
        }
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
      if (logoGroupRef.current) disposeObject3D(logoGroupRef.current);
      envRenderTarget.dispose();
      pmremGenerator.dispose();
      dracoLoader.dispose(); // frees the decoder's worker threads/WASM instance
      renderer.dispose();
      sphereRef.current = null;
      sceneRef.current = null;
      logoGroupRef.current = null;
      dracoLoaderRef.current = null;
    };
  }, []);

  // Loads the logo model on demand, the first time the visitor actually
  // reaches /about — not at mount, since this canvas (and so this
  // effect) is shared by every route and the file is a real ~6MB. Once
  // loaded it stays in the scene for the rest of the session (leaving
  // and returning to /about just re-toggles `.visible`, no re-fetch).
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    if (logoGroupRef.current) {
      logoGroupRef.current.visible = pathname === "/about";
      return;
    }
    if (pathname !== "/about" || logoRequestedRef.current) return;
    logoRequestedRef.current = true;

    const loader = new GLTFLoader();
    if (dracoLoaderRef.current) loader.setDRACOLoader(dracoLoaderRef.current);
    loader.load(
      LOGO_MODEL_URL,
      (gltf) => {
        // The scene this load was for may already be gone by the time a
        // ~6MB fetch resolves — a real unmount, or Strict Mode's dev-only
        // double-invoke rebuilding the whole scene out from under this
        // still-in-flight request. sceneRef identity (not a boolean) is
        // the check: if it still points at the exact scene this closure
        // captured, that scene is still live and gets the model; if not,
        // free what was just decoded instead of adding it to a scene
        // nothing will ever render again.
        if (sceneRef.current !== scene) {
          disposeObject3D(gltf.scene);
          return;
        }
        smoothLogoSurfaces(gltf.scene);
        const group = normalizeLogo(gltf.scene);
        // Reads the *current* pathname, not the value this effect closed
        // over when the fetch started — a visitor could have already
        // navigated away during the load.
        group.visible = pathnameRef.current === "/about";
        scene.add(group);
        logoGroupRef.current = group;
      },
      undefined,
      () => {
        // Missing/blocked/malformed model — same tone as the skybox
        // texture's own catches: the rest of the page (and the sky
        // itself) works fine without it, not worth surfacing to a visitor.
      },
    );
  }, [pathname]);

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
