"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { getLenis, warp } from "@/lib/scroll";

const LINES = [
  ["mounting data model", "OK"],
  ["pgbouncer · transaction pool", "OK"],
  ["redis overlay warm", "OK"],
  ["kafka behavior bus", "OK"],
  ["weaviate index sync", "OK"],
  ["operator dashboard", "GO"],
] as const;

type W = Window & { __rhLaunched?: boolean };

export function onLaunched(cb: () => void) {
  if ((window as W).__rhLaunched) {
    cb();
    return () => {};
  }
  window.addEventListener("rh:launched", cb, { once: true });
  return () => window.removeEventListener("rh:launched", cb);
}

function markLaunched() {
  (window as W).__rhLaunched = true;
  window.dispatchEvent(new Event("rh:launched"));
}

// Pre-flight check + countdown. Runs once per browser session; click or any key skips it.
export default function Boot() {
  const [phase, setPhase] = useState<"checks" | "count" | "done">("checks");
  const [shown, setShown] = useState(0);
  const [count, setCount] = useState(3);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("rh-booted") === "1";
    } catch {}
    if (seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("done");
      markLaunched();
      return;
    }
    document.body.classList.add("locked");
    getLenis()?.stop();

    const timers: ReturnType<typeof setTimeout>[] = [];
    LINES.forEach((_, i) => timers.push(setTimeout(() => setShown(i + 1), 160 + i * 170)));
    const t0 = 160 + LINES.length * 170 + 150;
    timers.push(setTimeout(() => setPhase("count"), t0));
    timers.push(setTimeout(() => setCount(2), t0 + 420));
    timers.push(setTimeout(() => setCount(1), t0 + 840));
    timers.push(setTimeout(() => finish(), t0 + 1260));

    const skip = () => finish();
    window.addEventListener("keydown", skip, { once: true });
    window.addEventListener("pointerdown", skip, { once: true });

    function finish() {
      timers.forEach(clearTimeout);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
      try {
        sessionStorage.setItem("rh-booted", "1");
      } catch {}
      document.body.classList.remove("locked");
      getLenis()?.start();
      warp(1300);
      setPhase("done");
      markLaunched();
    }

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, []);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="boot"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          style={{ clipPath: "inset(0 0 0% 0)" }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-void px-6"
        >
          <div className="dot-grid absolute inset-0 opacity-60" />
          <div className="relative w-full max-w-md font-mono text-xs sm:text-sm">
            <div className="mb-6 flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-mute">
              <span>RH-01 · pre-flight</span>
              <span>tap to skip</span>
            </div>
            {phase === "checks" ? (
              <ul className="space-y-2">
                {LINES.slice(0, shown).map(([l, s]) => (
                  <motion.li key={l} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3">
                    <span className="text-mute">›</span>
                    <span className="flex-1 truncate text-haze">
                      {l} <span className="text-rim">{".".repeat(30)}</span>
                    </span>
                    <span className={s === "GO" ? "text-go" : "text-plasma"}>{s}</span>
                  </motion.li>
                ))}
                <li className="animate-blink text-plasma">▍</li>
              </ul>
            ) : (
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-[0.4em] text-mute">T minus</p>
                <AnimatePresence mode="popLayout">
                  <motion.p
                    key={count}
                    initial={{ opacity: 0, scale: 1.6, filter: "blur(10px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.35 }}
                    className="font-display text-[8rem] font-extrabold leading-none text-aurora"
                  >
                    {count}
                  </motion.p>
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
