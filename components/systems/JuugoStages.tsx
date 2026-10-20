"use client";

import clsx from "clsx";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { juugo } from "@/lib/data";
import { Chip, ease } from "../ui";

const HUES = ["#ff4fa3", "#ff7f7f", "#ffbf5a", "#8b6cff", "#5ef2ff"];

// Each retrieval approach is a rocket stage: earlier ones are jettisoned as the next one ignites.
export function StageRocket() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-150px" });
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);
  const stages = juugo.stages;

  useEffect(() => {
    if (!inView || touched) return;
    const id = setInterval(() => setActive((a) => (a + 1) % stages.length), 4200);
    return () => clearInterval(id);
  }, [inView, touched, stages.length]);

  const pick = (i: number) => {
    setTouched(true);
    setActive(i);
  };
  const s = stages[active];

  return (
    <div ref={ref} className="grid gap-8 md:grid-cols-[180px_1fr] md:gap-12">
      {/* The rocket: stage 1 at the bottom, payload on top */}
      <div className="relative mx-auto hidden h-[440px] w-[120px] md:block">
        <div className="absolute inset-x-0 bottom-0 flex flex-col-reverse items-center">
          {stages.map((st, i) => {
            const gone = i < active;
            const isTop = i === stages.length - 1;
            return (
              <motion.button
                key={st.n}
                onClick={() => pick(i)}
                animate={gone ? { y: 160, x: i % 2 ? 40 : -40, rotate: i % 2 ? 24 : -24, opacity: 0 } : { y: 0, x: 0, rotate: 0, opacity: 1 }}
                transition={{ duration: 0.9, ease }}
                style={{ borderColor: HUES[i], width: 64 + (stages.length - i) * 8 }}
                className={clsx(
                  "relative -mt-px flex h-[62px] items-center justify-center border bg-hull/80 font-mono text-xs",
                  isTop ? "rounded-t-[999px] rounded-b-md" : "rounded-md",
                  i === active ? "text-star" : "text-mute"
                )}
                aria-label={`Stage ${st.n}: ${st.title}`}
              >
                {st.n}
                {i === active && <span className="absolute inset-0 rounded-[inherit]" style={{ boxShadow: `0 0 26px -6px ${HUES[i]}` }} />}
              </motion.button>
            );
          })}
        </div>
        {/* Exhaust under the lowest live stage */}
        <motion.div
          key={active}
          initial={{ scaleY: 0.2, opacity: 0 }}
          animate={{ scaleY: [0.7, 1, 0.8], opacity: 1 }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "mirror" }}
          className="absolute left-1/2 h-20 w-8 origin-top -translate-x-1/2 rounded-b-full blur-[2px]"
          style={{ bottom: active * 62 - 80, background: `linear-gradient(${HUES[active]}, transparent)` }}
        />
      </div>

      <div>
        <div className="no-scrollbar -mx-1 mb-6 flex gap-1.5 overflow-x-auto px-1 pb-1">
          {stages.map((st, i) => (
            <button
              key={st.n}
              onClick={() => pick(i)}
              className={clsx(
                "relative shrink-0 rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors",
                i === active ? "border-transparent text-void" : i < active ? "border-rim text-mute line-through decoration-mute/50" : "border-rim text-haze hover:text-star"
              )}
            >
              {i === active && <motion.span layoutId="stage-pill" className="absolute inset-0 rounded-full" style={{ background: HUES[i] }} />}
              <span className="relative">{st.n}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={s.n} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.45, ease }}>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em]" style={{ color: HUES[active] }}>
              Stage {active + 1} of {stages.length} {active === stages.length - 1 && "· current payload"}
            </p>
            <h4 className="mt-2 font-display text-3xl font-bold md:text-4xl">{s.title}</h4>
            <p className="mt-4 max-w-2xl leading-relaxed text-haze">{s.body}</p>
            <div className="mt-5 flex flex-wrap gap-1.5">
              {s.tech.map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
            </div>
            {s.jettison && (
              <p className="mt-6 flex max-w-2xl gap-3 border-l-2 border-flare/60 pl-4 text-sm leading-relaxed text-haze">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-flare">Jettisoned</span>
                {s.jettison}
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// Types an example query, then lights up the parsed fields one by one.
export function QueryParse() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [typed, setTyped] = useState("");
  const [shown, setShown] = useState(0);
  const [run, setRun] = useState(0);
  const q = juugo.sampleQuery;

  useEffect(() => {
    if (!inView) return;
    setTyped("");
    setShown(0);
    let i = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const type = setInterval(() => {
      i++;
      setTyped(q.slice(0, i));
      if (i >= q.length) {
        clearInterval(type);
        juugo.parse.forEach((_, k) => timers.push(setTimeout(() => setShown(k + 1), 350 + k * 380)));
      }
    }, 34);
    return () => {
      clearInterval(type);
      timers.forEach(clearTimeout);
    };
  }, [inView, run, q]);

  return (
    <div ref={ref} className="hud-panel rounded-2xl p-5 md:p-6">
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-mute">
        <span>query understanding · illustrative</span>
        <button onClick={() => setRun((r) => r + 1)} className="text-plasma hover:text-star">
          ↻ replay
        </button>
      </div>
      <div className="mt-4 rounded-lg border border-rim bg-void/70 px-4 py-3 font-mono text-sm text-star">
        <span className="text-flare">“</span>
        {typed}
        <span className="animate-blink text-plasma">▍</span>
        <span className="text-flare">”</span>
      </div>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {juugo.parse.map((p, i) => (
          <motion.li
            key={p.k}
            initial={false}
            animate={{ opacity: i < shown ? 1 : 0.15, y: i < shown ? 0 : 6 }}
            transition={{ duration: 0.4, ease }}
            className="flex items-center justify-between gap-3 rounded-lg border border-rim bg-hull/50 px-3 py-2"
          >
            <span className="font-mono text-[11px]">
              <span className="text-mute">{p.k}:</span> <span className="text-plasma">{p.v}</span>
            </span>
            <span className="text-right font-mono text-[9.5px] uppercase tracking-wider text-mute">{p.via}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
