"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useSkybox } from "./skybox-context";

/** One full revolution every 150s — slow enough to read as ambient drift, never distracting. */
const ROTATION_PERIOD_MS = 150_000;
/** Failsafe: dismiss the loading screen even if the first texture never
 *  resolves (offline, blocked request) rather than hang on it forever. */
const LOAD_TIMEOUT_MS = 8_000;

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sphereRef = useRef<THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial> | null>(null);
  const hasLoadedOnceRef = useRef(false);

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

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      if (!reduceMotion) {
        sphere.rotation.y += (dt / ROTATION_PERIOD_MS) * Math.PI * 2;
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

    const loader = new THREE.TextureLoader();
    loader.load(`/skyboxes/skybox-${active}.png`, applyTexture);
    return () => {
      cancelled = true;
    };
  }, [active, reportLoadProgress, reportReady]);

  return <canvas ref={canvasRef} className="skybox-canvas" aria-hidden="true" />;
}
