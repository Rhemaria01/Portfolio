"use client";

import clsx from "clsx";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { orbits, owns, profile } from "@/lib/data";
import { Reveal, Section, SectionHead } from "./ui";

// Career as an expanding orbit: the craft climbs from the inner ring to the outer one as you scroll.
function OrbitClimb() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 30%"] });
  const [stage, setStage] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setStage(v < 0.33 ? 0 : v < 0.66 ? 1 : 2));
  const radius = useTransform(scrollYProgress, [0, 1], [22, 46]);
  const angle = useTransform(scrollYProgress, [0, 1], [-120, 260]);
  const cx = useTransform([radius, angle], ([r, a]: number[]) => 50 + r * Math.cos((a * Math.PI) / 180));
  const cy = useTransform([radius, angle], ([r, a]: number[]) => 50 + r * Math.sin((a * Math.PI) / 180));

  return (
    <div ref={ref} className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <div className="relative mx-auto aspect-square w-full max-w-[460px]">
        <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
          <defs>
            <radialGradient id="core" cx="40%" cy="35%">
              <stop offset="0%" stopColor="#ffe3a8" />
              <stop offset="60%" stopColor="#ffbf5a" />
              <stop offset="100%" stopColor="#ff4fa3" />
            </radialGradient>
          </defs>
          {[22, 34, 46].map((r, i) => (
            <circle
              key={r}
              cx="50"
              cy="50"
              r={r}
              fill="none"
              strokeWidth={stage === i ? 0.6 : 0.3}
              strokeDasharray={i === 1 ? "1 1.6" : undefined}
              className={clsx("transition-all duration-700", stage === i ? "stroke-plasma" : stage > i ? "stroke-nebula/60" : "stroke-rim")}
            />
          ))}
          <circle cx="50" cy="50" r="7" fill="url(#core)" />
          <circle cx="50" cy="50" r="11" fill="none" stroke="#ffbf5a" strokeOpacity="0.2" strokeWidth="0.4" />
          <motion.circle cx={cx} cy={cy} r="2.2" fill="#eef0ff" />
          <motion.circle cx={cx} cy={cy} r="4.5" fill="none" stroke="#5ef2ff" strokeOpacity="0.5" strokeWidth="0.3" />
          {["FE", "FS", "BE"].map((t, i) => (
            <text key={t} x="50" y={50 - [22, 34, 46][i] - 1.5} textAnchor="middle" className={clsx("font-mono text-[2.6px] tracking-widest transition-colors", stage >= i ? "fill-plasma" : "fill-mute")}>
              {t}
            </text>
          ))}
        </svg>
      </div>

      <ol className="space-y-4">
        {orbits.map((o, i) => (
          <li
            key={o.title}
            className={clsx(
              "hud-panel rounded-xl p-5 transition-all duration-700 md:p-6",
              stage === i ? "border-plasma/50 opacity-100 shadow-[0_0_40px_-18px_var(--color-plasma)]" : "opacity-45"
            )}
          >
            <div className="flex items-baseline justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.22em]">
              <span className={stage === i ? "text-plasma" : "text-mute"}>{o.ring}</span>
              <span className="text-mute">{o.era}</span>
            </div>
            <h3 className="mt-2 font-display text-2xl font-bold">{o.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-haze">{o.note}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {o.tech.map((t) => (
                <span key={t} className="rounded border border-rim px-2 py-0.5 font-mono text-[10.5px] text-haze">
                  {t}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function Origin() {
  return (
    <Section id="origin">
      <SectionHead code="01" label="Origin" title="Launched from the frontend," accent="settled in the backend." />

      <div className="mb-24 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        <Reveal>
          <p className="font-display text-2xl leading-snug text-star md:text-3xl">{profile.summary}</p>
          <p className="mt-6 max-w-xl leading-relaxed text-haze">
            The title on my badge says full stack. Most of my days go into owning the data model, the request path, asynchronous processing,
            and how the system behaves under fan-out or a partial dependency failure. The frontend years still show: I build operator tools
            and clients people actually use.
          </p>
        </Reveal>
        <div className="grid grid-cols-2 gap-3 self-start">
          {owns.map((o, i) => (
            <Reveal key={o.k} delay={i * 0.08}>
              <div className="brackets h-full p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-plasma">0{i + 1} · owns</p>
                <p className="mt-2 font-display text-lg font-bold leading-tight">{o.k}</p>
                <p className="mt-2 text-xs leading-relaxed text-haze">{o.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <OrbitClimb />
    </Section>
  );
}
