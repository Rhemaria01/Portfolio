"use client";

import clsx from "clsx";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";

type Ping = { id: number; x: number; y: number };

// Targeting reticle with a comet tail. Interactive elements make it "lock on";
// a data-cursor attribute supplies the lock label.
export default function Cursor() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const rx = useSpring(x, { stiffness: 260, damping: 26, mass: 0.6 });
  const ry = useSpring(y, { stiffness: 260, damping: 26, mass: 0.6 });
  const [enabled, setEnabled] = useState(false);
  const [lock, setLock] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [pings, setPings] = useState<Ping[]>([]);
  const trailRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    setEnabled(true);
    document.body.classList.add("has-cursor");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = (e.target as HTMLElement | null)?.closest<HTMLElement>("a, button, [data-cursor]");
      setLock(Boolean(t));
      setLabel(t?.dataset.cursor ?? null);
    };
    const down = (e: PointerEvent) => {
      const id = performance.now();
      setPings((p) => [...p.slice(-3), { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => setPings((p) => p.filter((q) => q.id !== id)), 700);
    };
    const leave = () => {
      x.set(-200);
      y.set(-200);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", down);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      document.body.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [x, y]);

  // Comet tail: a short history of pointer positions drawn as a fading ribbon.
  useEffect(() => {
    if (!enabled) return;
    const canvas = trailRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const pts: { x: number; y: number }[] = [];
    let raf = 0;
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    let cleared = false;
    const tick = () => {
      pts.push({ x: x.get(), y: y.get() });
      if (pts.length > 22) pts.shift();
      // Pointer at rest: the tail has collapsed, so skip the full-canvas clear/redraw.
      const still = pts.every((q) => q.x === pts[0].x && q.y === pts[0].y);
      if (still && cleared) {
        raf = requestAnimationFrame(tick);
        return;
      }
      cleared = still;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (let i = 1; i < pts.length; i++) {
        const t = i / pts.length;
        ctx.strokeStyle = `rgba(${Math.round(139 + (94 - 139) * t)},${Math.round(108 + (242 - 108) * t)},255,${t * 0.55})`;
        ctx.lineWidth = t * 3;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(pts[i - 1].x, pts[i - 1].y);
        ctx.lineTo(pts[i].x, pts[i].y);
        ctx.stroke();
      }
      raf = requestAnimationFrame(tick);
    };
    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <>
      <canvas ref={trailRef} aria-hidden className="pointer-events-none fixed inset-0 z-[98] h-screen w-screen" />

      {/* Core dot tracks the pointer exactly */}
      <motion.div style={{ x, y }} className="pointer-events-none fixed left-0 top-0 z-[100]">
        <div className={clsx("h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors", lock ? "bg-flare" : "bg-plasma")} />
      </motion.div>

      {/* Reticle lags behind on a spring */}
      <motion.div style={{ x: rx, y: ry }} className="pointer-events-none fixed left-0 top-0 z-[99]">
        <motion.div
          className="relative -translate-x-1/2 -translate-y-1/2"
          animate={{ width: lock ? 46 : 34, height: lock ? 46 : 34, rotate: lock ? 45 : 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 20 }}
        >
          <svg viewBox="0 0 40 40" className={clsx("absolute inset-0 h-full w-full transition-colors", lock ? "text-flare" : "animate-orbit text-plasma/70")}>
            {lock ? (
              <g fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 11V2h9M29 2h9v9M38 29v9h-9M11 38H2v-9" />
              </g>
            ) : (
              <g fill="none" stroke="currentColor" strokeWidth="1">
                <circle cx="20" cy="20" r="15" strokeDasharray="3 5" />
                <path d="M20 0v6M20 34v6M0 20h6M34 20h6" strokeWidth="1.4" />
              </g>
            )}
          </svg>
        </motion.div>
        <AnimatePresence>
          {label && (
            <motion.span
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 30 }}
              exit={{ opacity: 0, x: 18 }}
              className="absolute left-0 top-0 -translate-y-1/2 whitespace-nowrap rounded-sm border border-flare/50 bg-void/80 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-flare"
            >
              ◆ {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Click pings: sonar rings */}
      {pings.map((p) => (
        <motion.span
          key={p.id}
          initial={{ scale: 0.2, opacity: 0.9 }}
          animate={{ scale: 2.6, opacity: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          style={{ left: p.x, top: p.y }}
          className="pointer-events-none fixed z-[97] -ml-5 -mt-5 h-10 w-10 rounded-full border border-plasma"
        />
      ))}
    </>
  );
}
