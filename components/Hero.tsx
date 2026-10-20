"use client";

import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { profile } from "@/lib/data";
import { travelTo, warp } from "@/lib/scroll";
import { onLaunched } from "./Boot";
import { MOONS } from "@/lib/moons";
import { ease } from "./ui";

const Planet3D = dynamic(() => import("./Planet3D"), { ssr: false });

function useMissionClock(since: string) {
  const [t, setT] = useState<string | null>(null);
  useEffect(() => {
    const start = new Date(since).getTime();
    const tick = () => {
      const s = Math.floor((Date.now() - start) / 1000);
      const d = Math.floor(s / 86400);
      const hh = String(Math.floor((s % 86400) / 3600)).padStart(2, "0");
      const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
      const ss = String(s % 60).padStart(2, "0");
      setT(`T+${d}d ${hh}:${mm}:${ss}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [since]);
  return t;
}

const ORBIT_KM = 35786; // geostationary altitude — where the descent starts

export default function Hero() {
  const [ready, setReady] = useState(false);
  const [planetReady, setPlanetReady] = useState(false);
  const clock = useMissionClock(profile.firstLaunch);
  const ref = useRef<HTMLElement>(null);
  const labels = useRef<(HTMLDivElement | null)[]>([]);

  // The section is taller than the screen; its inner stage is pinned while the camera descends.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const textFade = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const textLift = useTransform(scrollYProgress, [0, 0.3], [0, -120]);
  const planetFade = useTransform(scrollYProgress, [0.82, 1], [1, 0]);
  const captionFade = useTransform(scrollYProgress, [0.3, 0.45, 0.8, 0.95], [0, 1, 1, 0]);
  const hintFade = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  // Write the altitude straight into the DOM so scrolling never re-renders the hero.
  const altRefs = useRef<(HTMLElement | null)[]>([]);
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const e = p * p * (3 - 2 * p);
    const km = `${Math.max(0, Math.round(ORBIT_KM * Math.pow(1 - e, 2.2))).toLocaleString("en-US")} km`;
    for (const n of altRefs.current) if (n && n.textContent !== km) n.textContent = km;
  });

  useEffect(() => onLaunched(() => setReady(true)), []);
  const onPlanetReady = useCallback(() => setPlanetReady(true), []);

  const letters = (word: string, offset: number, cls: string) =>
    word.split("").map((c, i) => (
      <motion.span
        key={i}
        className={`inline-block ${cls}`}
        initial={{ y: "-120%", opacity: 0, rotateX: 90 }}
        animate={ready ? { y: "0%", opacity: 1, rotateX: 0 } : undefined}
        transition={{ duration: 1, delay: 0.1 + (offset + i) * 0.045, ease }}
      >
        {c}
      </motion.span>
    ));

  const alt = ORBIT_KM.toLocaleString("en-US");

  return (
    <section ref={ref} id="launch" className="relative h-[260svh] touch-pan-y">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* 3D planet stage */}
        <motion.div
          style={{ opacity: planetFade }}
          initial={{ scale: 0.7 }}
          animate={ready && planetReady ? { scale: 1 } : undefined}
          transition={{ duration: 1.8, ease }}
          className="absolute inset-0"
        >
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: ready && planetReady ? 1 : 0 }} transition={{ duration: 1.4 }} className="absolute inset-0">
            <Planet3D progress={scrollYProgress} labels={labels} onReady={onPlanetReady} />
            {MOONS.map((m, i) => (
              <div
                key={m.name}
                ref={(el) => {
                  labels.current[i] = el;
                }}
                className="pointer-events-none absolute left-0 top-0 will-change-transform"
                style={{ opacity: 0 }}
              >
                <span
                  className="ml-3 -mt-2.5 block whitespace-nowrap rounded-sm border bg-void/70 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] sm:text-[10px]"
                  style={{ borderColor: `${m.color}55`, color: m.color }}
                >
                  {m.name}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Descent caption, shown while diving */}
        <motion.div style={{ opacity: captionFade }} className="pointer-events-none absolute inset-x-0 bottom-[12%] z-10 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-plasma">Descent in progress</p>
          <p className="mt-3 font-display text-[clamp(2.2rem,7vw,5rem)] font-extrabold leading-none tabular-nums" ref={(n) => { altRefs.current[0] = n; }}>{alt} km</p>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.3em] text-haze">landing at sector 01 · origin</p>
        </motion.div>

        <motion.div
          style={{ y: textLift, opacity: textFade }}
          className="relative mx-auto flex h-full max-w-7xl select-none flex-col justify-end px-4 pb-10 pt-28 sm:px-6 md:px-10 md:pb-14"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : undefined}
            transition={{ delay: 0.2 }}
            className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] uppercase tracking-[0.25em] text-haze"
          >
            <span className="rounded-full border border-go/40 bg-go/10 px-3 py-1 text-go">● In orbit @ Stuvio</span>
            <span>{profile.callsign} · {profile.role}</span>
          </motion.div>

          <h1 className="font-display font-extrabold leading-[0.82] tracking-tighter [perspective:800px] [text-shadow:0_4px_40px_rgba(4,5,12,0.6)]">
            <span className="block text-[clamp(2.6rem,10.4vw,8.6rem)]">{letters(profile.first.toUpperCase(), 0, "")}</span>
            <span className="block text-[clamp(2.6rem,10.4vw,8.6rem)]">{letters(profile.last.toUpperCase(), 6, "text-hollow")}</span>
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ delay: 0.8, duration: 0.9, ease }}
            className="mt-8 grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-end"
          >
            <p className="max-w-xl text-lg leading-relaxed text-haze md:text-xl">
              <span className="text-star">{profile.tagline.split(",")[0]},</span>
              {profile.tagline.slice(profile.tagline.indexOf(",") + 1)}
            </p>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <button
                onClick={() => {
                  warp(700);
                  travelTo("missions");
                }}
                data-cursor="engage"
                className="group relative overflow-hidden rounded-full bg-star px-6 py-3 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-void"
              >
                <span className="relative z-10">View missions</span>
                <span className="absolute inset-0 -translate-x-full bg-plasma transition-transform duration-500 group-hover:translate-x-0" />
              </button>
              <button
                onClick={() => travelTo("transmit")}
                className="rounded-full border border-rim bg-void/60 px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-star transition-colors hover:border-plasma hover:text-plasma"
              >
                Open channel
              </button>
            </div>
          </motion.div>

          {/* Telemetry strip */}
          <motion.dl
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : undefined}
            transition={{ delay: 1.1 }}
            className="mt-12 hidden grid-cols-2 gap-px overflow-hidden rounded-lg border border-rim bg-rim font-mono sm:grid text-[10px] uppercase tracking-[0.18em] md:grid-cols-4"
          >
            {[
              ["Mission elapsed", clock ?? "T+ —", "text-plasma"],
              ["Altitude", `${alt} km`, "text-star"],
              ["Primary systems", "Stooky · Juugo · JamJam", "text-star"],
              ["Specialty", "Data · Events · Search", "text-star"],
            ].map(([k, v, c]) => (
              <div key={k} className="bg-void/80 px-4 py-3">
                <dt className="text-mute">{k}</dt>
                <dd
                  className={`mt-1 truncate text-[11px] tabular-nums ${c}`}
                  ref={k === "Altitude" ? (n) => { altRefs.current[1] = n; } : undefined}
                >
                  {v}
                </dd>
              </div>
            ))}
          </motion.dl>

          <motion.div style={{ opacity: hintFade }} className="mt-8 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-mute">
            <span className="flex items-center gap-3">
              <span className="relative block h-8 w-px overflow-hidden bg-rim">
                <span className="absolute inset-x-0 top-0 h-1/2 animate-scan bg-gradient-to-b from-transparent to-plasma" />
              </span>
              Scroll to descend
            </span>
            <span>
              <span className="hidden md:inline">Drag the planet to spin it</span>
              <span className="md:hidden">Swipe to spin</span>
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
