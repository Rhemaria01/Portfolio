"use client";

import { useEffect, useRef } from "react";

const TINTS = ["238,240,255", "238,240,255", "238,240,255", "200,220,255", "94,242,255", "139,108,255"];
const LAYERS = [
  { depth: 0.02, count: 0.55, size: [0.4, 0.9], alpha: 0.45 },
  { depth: 0.05, count: 0.3, size: [0.7, 1.2], alpha: 0.65 },
  { depth: 0.1, count: 0.15, size: [1.0, 1.6], alpha: 0.9 },
];

// A quiet sky. Stars are painted once into three layer canvases; scrolling only moves those layers
// with GPU transforms, so the page never repaints the background while you read.
export default function Starfield() {
  const root = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLCanvasElement | null)[]>([]);

  useEffect(() => {
    const wrap = root.current!;
    const canvases = layerRefs.current as HTMLCanvasElement[];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, raf = 0, pending = false;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

    const paint = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      const total = Math.round(Math.min(w < 768 ? 140 : 320, (w * h) / 4200));
      canvases.forEach((c, i) => {
        const L = LAYERS[i];
        // Each canvas is two screens tall with the same stars repeated, so it can wrap seamlessly.
        c.width = w;
        c.height = h * 2;
        c.style.width = `${w}px`;
        c.style.height = `${h * 2}px`;
        const ctx = c.getContext("2d")!;
        ctx.clearRect(0, 0, w, h * 2);
        for (let n = 0; n < total * L.count; n++) {
          const x = Math.random() * w;
          const y = Math.random() * h;
          const r = L.size[0] + Math.random() * (L.size[1] - L.size[0]);
          ctx.fillStyle = `rgba(${TINTS[(Math.random() * TINTS.length) | 0]},${L.alpha * (0.6 + Math.random() * 0.4)})`;
          for (const yy of [y, y + h]) {
            ctx.beginPath();
            ctx.arc(x, yy, r, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });
      place();
    };

    const place = () => {
      pending = false;
      const sy = window.scrollY;
      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;
      canvases.forEach((c, i) => {
        const off = (sy * LAYERS[i].depth) % h;
        c.style.transform = `translate3d(${(-mouse.x * (i + 1) * 6).toFixed(1)}px, ${(-off - mouse.y * (i + 1) * 6).toFixed(1)}px, 0)`;
      });
      wrap.classList.toggle("sky-dim", sy > h * 0.8);
      // keep easing toward the mouse target without a permanent loop
      if (Math.abs(mouse.tx - mouse.x) > 0.002 || Math.abs(mouse.ty - mouse.y) > 0.002) schedule();
    };
    const schedule = () => {
      if (pending) return;
      pending = true;
      raf = requestAnimationFrame(place);
    };

    let lastW = 0;
    const onResize = () => {
      // Mobile address bars resize the viewport constantly; only repaint on real size changes.
      if (Math.abs(window.innerWidth - lastW) < 2 && Math.abs(window.innerHeight - h) < 120) return;
      lastW = window.innerWidth;
      paint();
    };
    const onMove = (e: PointerEvent) => {
      if (reduced || e.pointerType !== "mouse") return;
      mouse.tx = e.clientX / w - 0.5;
      mouse.ty = e.clientY / h - 0.5;
      schedule();
    };
    const onWarp = () => {
      if (reduced) return;
      wrap.classList.add("sky-warp");
      setTimeout(() => wrap.classList.remove("sky-warp"), 500);
    };

    lastW = window.innerWidth;
    paint();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("rh:warp", onWarp);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("rh:warp", onWarp);
    };
  }, []);

  return (
    <div aria-hidden className="nebula pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div ref={root} className="sky absolute inset-0">
        {LAYERS.map((_, i) => (
          <canvas
            key={i}
            ref={(el) => {
              layerRefs.current[i] = el;
            }}
            className={`absolute left-0 top-0 will-change-transform ${i === 2 ? "animate-twinkle" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}
