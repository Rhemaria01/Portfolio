"use client";

import clsx from "clsx";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useActiveSection } from "@/lib/hooks";
import { travelTo } from "@/lib/scroll";
import { sections } from "@/lib/data";

const ids = sections.map((s) => s.id);

// Right-edge altitude rail: one waypoint per section, with a craft riding the scroll position.
export default function FlightPath() {
  const active = useActiveSection(ids);
  const { scrollYProgress } = useScroll();
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  const top = useTransform(p, [0, 1], ["0%", "100%"]);

  return (
    <aside aria-label="Section waypoints" className="fixed right-6 top-1/2 z-40 hidden h-[56vh] -translate-y-1/2 xl:block">
      <div className="relative h-full w-px bg-rim">
        <motion.div style={{ height: top }} className="absolute left-0 top-0 w-px bg-gradient-to-b from-plasma to-nebula" />
        <motion.div style={{ top }} className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2">
          <svg width="14" height="18" viewBox="0 0 14 18" className="rotate-180 drop-shadow-[0_0_6px_var(--color-plasma)]">
            <path d="M7 0c3 3 4 6 4 10l2 4-3-1-1 3H5l-1-3-3 1 2-4c0-4 1-7 4-10z" fill="var(--color-star)" />
          </svg>
        </motion.div>
        {sections.map((s, i) => (
          <button
            key={s.id}
            onClick={() => travelTo(s.id)}
            style={{ top: `${(i / (sections.length - 1)) * 100}%` }}
            className="group absolute left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center"
            aria-label={`Go to ${s.label}`}
          >
            <span
              className={clsx(
                "block h-2 w-2 rotate-45 border transition-all",
                active === s.id ? "scale-125 border-plasma bg-plasma" : "border-mute bg-void group-hover:border-star"
              )}
            />
            <span
              className={clsx(
                "pointer-events-none absolute right-5 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.2em] transition-all",
                "translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100", active === s.id ? "text-plasma" : "text-haze"
              )}
            >
              {s.code} · {s.label}
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
}
