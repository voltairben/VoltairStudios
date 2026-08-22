"use client";

import { useEffect, useRef } from "react";

// A flow-field WebGL shader for the loading screen background — the
// same genre as the 21st.dev "Oceanic Currents" reference the user
// picked, but built from scratch in this project's own palette rather
// than the reference's blue/cyan one: their exact source is behind
// 21st.dev's authenticated registry API (confirmed 403 when checked),
// so this is an equivalent flow-field shader (fBm + domain warp, the
// standard technique for that look), recolored to
// pane-bg → amber-dim → amber-bright → cursor-flash from the start.
// Raw WebGL1, no dependency — a single full-screen triangle, matching
// the "zero-dependency" spirit of the reference component; three.js
// would be overkill for one fragment shader.

const VERTEX_SRC = `
attribute vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const FRAGMENT_SRC = `
precision highp float;
uniform vec2 uResolution;
uniform float uTime;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  vec2 p = uv * 2.6;
  p.x *= uResolution.x / uResolution.y;

  // Domain-warped fBm — two layers of noise steering a third, the
  // standard trick for the flowing-current look, animated by uTime.
  vec2 q = vec2(
    fbm(p + uTime * 0.045),
    fbm(p + vec2(5.2, 1.3) + uTime * 0.045)
  );
  vec2 r = vec2(
    fbm(p + 3.6 * q + vec2(1.7, 9.2) + uTime * 0.03),
    fbm(p + 3.6 * q + vec2(8.3, 2.8) + uTime * 0.03)
  );
  float f = fbm(p + 3.6 * r);

  // Design-system palette, darkest to brightest — see globals.css tokens.
  vec3 colorPaneBg = vec3(0.1333, 0.1569, 0.1922);   /* #222831 */
  vec3 colorAmberDim = vec3(0.5804, 0.6392, 0.6784);  /* #94a3b8 */
  vec3 colorAmberBright = vec3(1.0, 0.3529, 0.2118);  /* #ff5a36 */
  vec3 colorFlash = vec3(0.9725, 0.9804, 0.9843);     /* #f8fafc */

  vec3 color = mix(colorPaneBg, colorAmberDim, clamp(f * 1.3, 0.0, 1.0));
  color = mix(color, colorAmberBright, clamp((f - 0.4) * 2.2, 0.0, 1.0));
  color = mix(color, colorFlash, clamp(pow(r.x, 5.0), 0.0, 1.0) * 0.35);

  // Vignette: keeps a real region around the logo/percentage — not
  // just the exact center pixel — reliably dark, so legibility doesn't
  // depend on where the flow happens to be at any given moment. Tuned
  // by direct pixel-sampled contrast measurement against the actual
  // percent-text position (not just the geometric center), the same
  // methodology this project uses everywhere else — a raw worst-case
  // background contrast under 3:1 measured before this pass.
  float dist = length(uv - vec2(0.5, 0.54));
  float vignette = smoothstep(0.0, 0.4, dist);
  color *= mix(0.16, 1.0, vignette);

  gl_FragColor = vec4(color, 1.0);
}
`;

function compileShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Failed to create shader");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Shader compile error: ${info}`);
  }
  return shader;
}

export default function LoadingShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) return; // .loading-screen's own background-color is the fallback

    let program: WebGLProgram | null = null;
    let vertexShader: WebGLShader | null = null;
    let fragmentShader: WebGLShader | null = null;
    let buffer: WebGLBuffer | null = null;
    let raf = 0;

    try {
      vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SRC);
      fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SRC);
      program = gl.createProgram();
      if (!program) throw new Error("Failed to create program");
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(`Program link error: ${gl.getProgramInfoLog(program)}`);
      }
      gl.useProgram(program);

      // One full-screen triangle, clipped to the viewport — cheaper
      // than a quad, standard technique for a single fragment shader.
      buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 3, -1, -1, 3]),
        gl.STATIC_DRAW,
      );
      const aPosition = gl.getAttribLocation(program, "aPosition");
      gl.enableVertexAttribArray(aPosition);
      gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

      const uResolution = gl.getUniformLocation(program, "uResolution");
      const uTime = gl.getUniformLocation(program, "uTime");

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio, 2);
        const width = canvas.clientWidth * dpr;
        const height = canvas.clientHeight * dpr;
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
          gl.viewport(0, 0, width, height);
        }
      };
      resize();
      window.addEventListener("resize", resize);

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const start = performance.now();
      const draw = (now: number) => {
        gl.uniform2f(uResolution, canvas.width, canvas.height);
        gl.uniform1f(uTime, reducedMotion ? 0 : (now - start) / 1000);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        if (!reducedMotion) raf = requestAnimationFrame(draw);
      };
      raf = requestAnimationFrame(draw);

      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", resize);
        if (buffer) gl.deleteBuffer(buffer);
        if (program) gl.deleteProgram(program);
        if (vertexShader) gl.deleteShader(vertexShader);
        if (fragmentShader) gl.deleteShader(fragmentShader);
      };
    } catch {
      // Compile/link failure (unlikely, but WebGL support varies) —
      // fail silently to the flat background-color fallback.
      if (buffer) gl.deleteBuffer(buffer);
      if (program) gl.deleteProgram(program);
      if (vertexShader) gl.deleteShader(vertexShader);
      if (fragmentShader) gl.deleteShader(fragmentShader);
      return undefined;
    }
  }, []);

  return <canvas ref={canvasRef} className="loading-shader-canvas" aria-hidden="true" />;
}
