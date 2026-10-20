"use client";

import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { jamjam } from "@/lib/data";

const STORE = {
  pg: { label: "PostgreSQL", dot: "bg-plasma", text: "text-plasma" },
  redis: { label: "Redis", dot: "bg-flare", text: "text-flare" },
  cassandra: { label: "Cassandra", dot: "bg-solar", text: "text-solar" },
} as const;

// JamJam's data model as a star chart: entities are stars, relations are the lines between them.
export default function SchemaConstellation() {
  const [sel, setSel] = useState("user");
  const [hover, setHover] = useState<string | null>(null);
  const focus = hover ?? sel;
  const ent = jamjam.entities.find((e) => e.id === focus)!;

  const neighbours = useMemo(() => {
    const set = new Set<string>();
    for (const [a, b] of jamjam.links) {
      if (a === focus) set.add(b);
      if (b === focus) set.add(a);
    }
    return set;
  }, [focus]);
  const pos = Object.fromEntries(jamjam.entities.map((e) => [e.id, e]));

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="hud-panel relative overflow-hidden rounded-2xl">
        <div className="dot-grid absolute inset-0 opacity-50" />
        <div className="relative mx-[9%] my-[7%] aspect-[4/5] sm:aspect-[16/11]">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
            {jamjam.links.map(([a, b], i) => {
              const live = a === focus || b === focus;
              return (
                <motion.line
                  key={a + b}
                  x1={pos[a].x}
                  y1={pos[a].y}
                  x2={pos[b].x}
                  y2={pos[b].y}
                  vectorEffect="non-scaling-stroke"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 + i * 0.05 }}
                  className={clsx("transition-[stroke] duration-300", live ? "stroke-plasma" : "stroke-rim")}
                  strokeWidth={live ? 1.6 : 1}
                />
              );
            })}
          </svg>
          {jamjam.entities.map((e, i) => {
            const isFocus = e.id === focus;
            const near = neighbours.has(e.id);
            return (
              <motion.button
                key={e.id}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.04, type: "spring", stiffness: 260, damping: 18 }}
                onClick={() => setSel(e.id)}
                onPointerEnter={(ev) => ev.pointerType === "mouse" && setHover(e.id)}
                onPointerLeave={() => setHover(null)}
                data-cursor="inspect"
                style={{ left: `${e.x}%`, top: `${e.y}%` }}
                className="group absolute -translate-x-1/2 -translate-y-1/2"
                aria-label={`${e.label} entity`}
                aria-pressed={sel === e.id}
              >
                <span className="relative flex flex-col items-center gap-1.5">
                  <span
                    className={clsx(
                      "block rounded-full transition-all duration-300",
                      STORE[e.store ?? "pg"].dot,
                      STORE[e.store ?? "pg"].text,
                      isFocus ? "h-3.5 w-3.5 shadow-[0_0_18px_4px_currentColor]" : near ? "h-2.5 w-2.5" : "h-2 w-2 opacity-60"
                    )}
                  />
                  {isFocus && <span className="absolute top-0 h-3.5 w-3.5 animate-beacon rounded-full border border-plasma" />}
                  <span
                    className={clsx(
                      "whitespace-nowrap font-mono text-[9px] tracking-wide transition-colors sm:text-[11px]",
                      isFocus ? "text-star" : near ? "text-haze" : "text-mute"
                    )}
                  >
                    {e.label}
                  </span>
                </span>
              </motion.button>
            );
          })}
        </div>
        <div className="relative flex flex-wrap gap-4 border-t border-rim px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-mute">
          {Object.values(STORE).map((s) => (
            <span key={s.label} className="flex items-center gap-2">
              <span className={clsx("h-2 w-2 rounded-full", s.dot)} />
              {s.label}
            </span>
          ))}
          <span className="ml-auto hidden sm:inline">tap a star</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={ent.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          className="brackets self-start p-5"
        >
          <p className={clsx("font-mono text-[10px] uppercase tracking-[0.25em]", STORE[ent.store ?? "pg"].text)}>
            entity · {STORE[ent.store ?? "pg"].label}
          </p>
          <h4 className="mt-2 font-display text-3xl font-bold">{ent.label}</h4>
          <ul className="mt-4 space-y-2 text-sm text-haze">
            {ent.notes.map((n) => (
              <li key={n} className="flex gap-2">
                <span className="mt-[0.55em] h-1 w-1 shrink-0 rotate-45 bg-plasma" />
                {n}
              </li>
            ))}
          </ul>
          {neighbours.size > 0 && (
            <p className="mt-5 font-mono text-[11px] leading-relaxed text-mute">
              relates to → <span className="text-haze">{[...neighbours].map((n) => pos[n].label).join(", ")}</span>
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
