"use client";

import type { MotionValue } from "motion/react";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { MOONS } from "@/lib/moons";

const NOISE = /* glsl */ `
  vec3 hash3(vec3 p) {
    p = vec3(dot(p, vec3(127.1, 311.7, 74.7)), dot(p, vec3(269.5, 183.3, 246.1)), dot(p, vec3(113.5, 271.9, 124.6)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }
  float gnoise(vec3 p) {
    vec3 i = floor(p), f = fract(p);
    vec3 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(dot(hash3(i + vec3(0,0,0)), f - vec3(0,0,0)), dot(hash3(i + vec3(1,0,0)), f - vec3(1,0,0)), u.x),
                   mix(dot(hash3(i + vec3(0,1,0)), f - vec3(0,1,0)), dot(hash3(i + vec3(1,1,0)), f - vec3(1,1,0)), u.x), u.y),
               mix(mix(dot(hash3(i + vec3(0,0,1)), f - vec3(0,0,1)), dot(hash3(i + vec3(1,0,1)), f - vec3(1,0,1)), u.x),
                   mix(dot(hash3(i + vec3(0,1,1)), f - vec3(0,1,1)), dot(hash3(i + vec3(1,1,1)), f - vec3(1,1,1)), u.x), u.y), u.z);
  }
  float fbm(vec3 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 6; i++) { v += a * gnoise(p); p *= 2.03; a *= 0.5; }
    return v;
  }
`;

// ── One-time bake: the expensive noise runs once into equirectangular textures ──
const BAKE_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

// Matches three's SphereGeometry UV layout so the textures wrap without a seam.
const BAKE_FRAG = /* glsl */ `
  uniform int uMode;
  varying vec2 vUv;
  ${NOISE}
  void main() {
    float u = vUv.x, v = 1.0 - vUv.y;
    vec3 p = vec3(-cos(6.2831853 * u) * sin(3.1415926 * v), cos(3.1415926 * v), sin(6.2831853 * u) * sin(3.1415926 * v));
    float h = fbm(p * 1.7 + 3.1) + 0.12 * fbm(p * 7.0) + 0.05 * fbm(p * 22.0);
    float land = smoothstep(0.02, 0.06, h);
    if (uMode == 0) {
      float coast = smoothstep(-0.06, 0.03, h) * (1.0 - land);
      vec3 ocean = mix(vec3(0.02, 0.07, 0.20), vec3(0.03, 0.30, 0.52), coast);
      float lat = abs(p.y);
      vec3 ground = mix(vec3(0.10, 0.36, 0.22), vec3(0.55, 0.45, 0.28), smoothstep(0.1, 0.35, fbm(p * 3.0 + 9.0)) * (1.0 - smoothstep(0.45, 0.75, lat)));
      ground = mix(ground, vec3(0.30, 0.30, 0.28), smoothstep(0.18, 0.32, h));
      vec3 col = mix(ocean, ground, land);
      col = mix(col, vec3(0.92, 0.96, 1.0), smoothstep(0.80, 0.90, lat + 0.05 * fbm(p * 5.0)));
      gl_FragColor = vec4(col, 1.0 - land); // alpha = water mask for the glint
    } else {
      float cities = smoothstep(0.55, 0.85, gnoise(p * 60.0) * 0.5 + 0.5) * smoothstep(0.1, 0.5, fbm(p * 8.0) + 0.3) * land;
      float cloud = smoothstep(0.05, 0.35, fbm(p * 2.6 + 11.0));
      gl_FragColor = vec4(cities, cloud, 0.0, 1.0);
    }
  }
`;

// ── Per-frame shaders: just texture lookups + lighting ──
const VERT = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vViewDir;
  void main() {
    vUv = uv;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vViewDir = normalize(cameraPosition - world.xyz);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const EARTH_FRAG = /* glsl */ `
  uniform vec3 uSun;
  uniform sampler2D uAlbedo;
  uniform sampler2D uExtra;
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vViewDir;
  void main() {
    vec4 albedo = texture2D(uAlbedo, vUv);
    float cities = texture2D(uExtra, vUv).r;
    float diff = dot(vNormalW, uSun);
    float day = smoothstep(-0.15, 0.25, diff);
    vec3 lit = albedo.rgb * (0.06 + 1.1 * max(diff, 0.0));
    vec3 halfV = normalize(uSun + vViewDir);
    lit += vec3(0.55, 0.8, 1.0) * pow(max(dot(vNormalW, halfV), 0.0), 120.0) * albedo.a * day * 0.35;
    lit += vec3(1.0, 0.72, 0.38) * cities * (1.0 - day) * 1.4;
    float rim = pow(1.0 - max(dot(vNormalW, vViewDir), 0.0), 3.0);
    lit += vec3(0.25, 0.7, 1.0) * rim * (0.12 + 0.4 * day);
    gl_FragColor = vec4(lit, 1.0);
  }
`;

const CLOUD_FRAG = /* glsl */ `
  uniform vec3 uSun;
  uniform sampler2D uExtra;
  uniform float uShift;
  varying vec2 vUv;
  varying vec3 vNormalW;
  void main() {
    float a = texture2D(uExtra, vUv + vec2(uShift, 0.0)).g * 0.85;
    float diff = max(dot(vNormalW, uSun), 0.0);
    gl_FragColor = vec4(vec3(0.95) * (0.08 + diff), a * (0.15 + 0.85 * smoothstep(-0.1, 0.3, diff)));
  }
`;

const ATMO_FRAG = /* glsl */ `
  uniform vec3 uSun;
  varying vec3 vNormalW;
  varying vec3 vViewDir;
  void main() {
    float f = pow(max(0.62 - dot(vNormalW, vViewDir), 0.0), 3.0) * 1.6;
    float day = smoothstep(-0.4, 0.6, dot(vNormalW, uSun));
    vec3 col = mix(vec3(0.55, 0.42, 1.0), vec3(0.37, 0.95, 1.0), day);
    gl_FragColor = vec4(col, 1.0) * f * (0.25 + 0.6 * day);
  }
`;

function bake(renderer: THREE.WebGLRenderer, size: number) {
  const make = () =>
    new THREE.WebGLRenderTarget(size, size / 2, {
      generateMipmaps: true,
      minFilter: THREE.LinearMipmapLinearFilter,
      magFilter: THREE.LinearFilter,
      wrapS: THREE.RepeatWrapping,
      wrapT: THREE.ClampToEdgeWrapping,
    });
  const albedo = make();
  const extra = make();
  const mat = new THREE.ShaderMaterial({ vertexShader: BAKE_VERT, fragmentShader: BAKE_FRAG, uniforms: { uMode: { value: 0 } } });
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
  const scene = new THREE.Scene();
  scene.add(quad);
  const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  for (const [rt, mode] of [[albedo, 0], [extra, 1]] as const) {
    mat.uniforms.uMode.value = mode;
    renderer.setRenderTarget(rt);
    renderer.render(scene, cam);
  }
  renderer.setRenderTarget(null);
  quad.geometry.dispose();
  mat.dispose();
  return { albedo, extra };
}

type Props = {
  progress: MotionValue<number>;
  labels: React.RefObject<(HTMLDivElement | null)[]>;
  onReady?: () => void;
};

// A procedural Earth: drag to spin, pointer to tilt, scroll to descend toward it.
export default function Planet3D({ progress, labels, onReady }: Props) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.innerWidth < 768;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: !small, alpha: true, powerPreference: "high-performance" });
    } catch {
      return; // no WebGL — the hero still reads fine without the planet
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.5 : 1.25));
    el.appendChild(renderer.domElement);

    const { albedo, extra } = bake(renderer, small ? 1024 : 2048);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    const sun = new THREE.Vector3(-0.6, 0.35, 0.75).normalize();

    const system = new THREE.Group(); // positioned on screen; moons orbit inside it
    const spin = new THREE.Group(); // tilted axis + drag rotation
    spin.rotation.z = 0.41; // Earth's axial tilt
    system.add(spin);
    scene.add(system);

    const geo = new THREE.SphereGeometry(1, small ? 64 : 96, small ? 48 : 64);
    const earth = new THREE.Mesh(
      geo,
      new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: EARTH_FRAG, uniforms: { uSun: { value: sun }, uAlbedo: { value: albedo.texture }, uExtra: { value: extra.texture } } })
    );
    const cloudMat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: CLOUD_FRAG,
      uniforms: { uSun: { value: sun }, uExtra: { value: extra.texture }, uShift: { value: 0 } },
      transparent: true,
      depthWrite: false,
    });
    const clouds = new THREE.Mesh(geo, cloudMat);
    clouds.scale.setScalar(1.015);
    spin.add(earth, clouds);

    const atmo = new THREE.Mesh(
      geo,
      new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: ATMO_FRAG,
        uniforms: { uSun: { value: sun } },
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      })
    );
    atmo.scale.setScalar(1.1);
    system.add(atmo);

    // Moons and their faint orbit lines
    const moonMeshes = MOONS.map((m) => {
      const plane = new THREE.Group();
      plane.rotation.x = Math.PI / 2 - 0.25;
      plane.rotation.y = m.tilt;
      const pts = Array.from({ length: 129 }, (_, i) => {
        const a = (i / 128) * Math.PI * 2;
        return new THREE.Vector3(Math.cos(a) * m.radius, Math.sin(a) * m.radius, 0);
      });
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color: m.color, transparent: true, opacity: 0.16 })
      );
      const moon = new THREE.Mesh(new THREE.SphereGeometry(m.size, 16, 16), new THREE.MeshBasicMaterial({ color: m.color }));
      const glow = new THREE.Mesh(
        new THREE.SphereGeometry(m.size * 2.4, 12, 12),
        new THREE.MeshBasicMaterial({ color: m.color, transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending, depthWrite: false })
      );
      moon.add(glow);
      plane.add(line, moon);
      system.add(plane);
      return { moon, line, m };
    });

    // Interaction state
    let dragging = false, lastX = 0, lastY = 0;
    let velY = 0, velX = 0, rotY = 0, rotX = 0;
    const tilt = { x: 0, y: 0, tx: 0, ty: 0 };
    let w = 1, h = 1, raf = 0, visible = true, ready = false;
    const start = performance.now();

    const resize = () => {
      w = el.clientWidth;
      h = el.clientHeight;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    const tmp = new THREE.Vector3();
    const frame = (now: number) => {
      const t = (now - start) / 1000;
      const p = progress.get();
      const narrow = w / h < 0.9;

      // Scroll: drift from the side to centre, then dive in until the planet fills the view.
      const e = p * p * (3 - 2 * p);
      const z0 = narrow ? 11 : 6.4;
      camera.position.set(0, 0, z0 + (1.75 - z0) * e);
      camera.lookAt(0, 0, 0);
      const offX = narrow ? 0 : 1.45;
      const offY = narrow ? 1.5 : 0;
      system.position.set(offX * (1 - e), offY * (1 - e), 0);

      // Spin: idle rotation + scroll-boost + drag inertia
      if (!dragging) {
        velY *= 0.95;
        velX *= 0.9;
      }
      rotY += velY + (reduced ? 0 : 0.0016 + p * 0.004);
      rotX = THREE.MathUtils.clamp(rotX + velX, -0.6, 0.6);
      rotX *= dragging ? 1 : 0.97;
      earth.rotation.y = rotY;
      clouds.rotation.y = rotY;
      cloudMat.uniforms.uShift.value = reduced ? 0 : t * 0.0015;
      tilt.x += (tilt.tx - tilt.x) * 0.05;
      tilt.y += (tilt.ty - tilt.y) * 0.05;
      spin.rotation.x = rotX + tilt.y * 0.18;
      system.rotation.y = tilt.x * 0.25;

      // Moons orbit, fade out as we descend, and drive their HTML labels
      moonMeshes.forEach(({ moon, line, m }, i) => {
        const a = m.phase + t * m.speed * (reduced ? 0 : 1);
        moon.position.set(Math.cos(a) * m.radius, Math.sin(a) * m.radius, 0);
        const fade = 1 - THREE.MathUtils.smoothstep(p, 0.15, 0.45);
        (line.material as THREE.LineBasicMaterial).opacity = 0.16 * fade;
        moon.visible = fade > 0.01;

        const label = labels.current?.[i];
        if (label) {
          moon.getWorldPosition(tmp);
          const behind = tmp.z < system.position.z - 0.2 && Math.hypot(tmp.x - system.position.x, tmp.y - system.position.y) < 1.05;
          tmp.project(camera);
          const sx = (tmp.x * 0.5 + 0.5) * w;
          const sy = (-tmp.y * 0.5 + 0.5) * h;
          label.style.transform = `translate3d(${sx.toFixed(1)}px, ${sy.toFixed(1)}px, 0)`;
          label.style.opacity = String(fade * (behind ? 0.15 : 1));
        }
      });

      renderer.render(scene, camera);
      if (!ready) {
        ready = true;
        onReady?.();
      }
      if (visible) raf = requestAnimationFrame(frame);
    };

    const onDown = (ev: PointerEvent) => {
      if ((ev.target as HTMLElement).closest("a, button")) return;
      dragging = true;
      lastX = ev.clientX;
      lastY = ev.clientY;
    };
    const onMove = (ev: PointerEvent) => {
      tilt.tx = ev.clientX / window.innerWidth - 0.5;
      tilt.ty = ev.clientY / window.innerHeight - 0.5;
      if (!dragging) return;
      velY = (ev.clientX - lastX) * 0.004;
      if (ev.pointerType === "mouse") velX = (ev.clientY - lastY) * 0.002;
      lastX = ev.clientX;
      lastY = ev.clientY;
    };
    const onUp = () => (dragging = false);

    const zone = el.closest("section") ?? el;
    zone.addEventListener("pointerdown", onDown as EventListener);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();

    // Only render while the hero is on screen and the tab is visible.
    const io = new IntersectionObserver(([entry]) => {
      const was = visible;
      visible = entry.isIntersecting && !document.hidden;
      if (visible && !was) raf = requestAnimationFrame(frame);
    });
    io.observe(el);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      zone.removeEventListener("pointerdown", onDown as EventListener);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh || o instanceof THREE.Line) {
          o.geometry.dispose();
          (o.material as THREE.Material).dispose();
        }
      });
      albedo.dispose();
      extra.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [progress, labels, onReady]);

  return <div ref={host} className="absolute inset-0" />;
}
