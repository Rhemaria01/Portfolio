"use client";

import clsx from "clsx";
import { motion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { education, roles } from "@/lib/data";
import { Chip, Reveal, Section, SectionHead } from "./ui";

export default function Trajectory() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const burn = useSpring(scrollYProgress, { stiffness: 90, damping: 22 });

  const stops = [...roles, { company: "St. John College of Engineering", title: education.degree, period: education.period, kind: `CGPI ${education.score}`, summary: "Where it started: React, Firebase, Flask, Solidity and a published paper.", points: [], tags: [] }];

  return (
    <Section id="trajectory">
      <SectionHead
        code="02"
        label="Trajectory"
        title="Flight log,"
        accent="newest burn first."
        kicker="Each stop raised the orbit: from interfaces, to whole products, to the systems underneath them."
      />

      <div ref={ref} className="relative">
        {/* Trajectory rail */}
        <div className="absolute bottom-0 left-[11px] top-0 w-px bg-rim md:left-1/2 md:-translate-x-1/2">
          <motion.div style={{ scaleY: burn }} className="absolute inset-0 origin-top bg-gradient-to-b from-plasma via-flare to-solar" />
        </div>

        <ol className="space-y-14 md:space-y-20">
          {stops.map((r, i) => {
            const right = i % 2 === 0;
            const current = i === 0;
            return (
              <li key={r.title + r.period} className="relative grid md:grid-cols-2 md:gap-16">
                <span
                  className={clsx(
                    "absolute left-[11px] top-2 z-10 grid h-6 w-6 -translate-x-1/2 place-items-center rounded-full border bg-void md:left-1/2",
                    current ? "border-plasma" : "border-rim"
                  )}
                >
                  <span className={clsx("h-2 w-2 rounded-full", current ? "bg-plasma" : "bg-mute")} />
                  {current && <span className="absolute inset-0 animate-beacon rounded-full border border-plasma" />}
                </span>

                <Reveal className={clsx("pl-10 md:pl-0", right ? "md:col-start-2" : "md:col-start-1 md:row-start-1 md:text-right")}>
                  <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-plasma">{r.period}</p>
                  <h3 className="mt-2 font-display text-2xl font-bold md:text-3xl">{r.title}</h3>
                  <p className="mt-1 text-haze">
                    {r.company} <span className="text-mute">· {r.kind}</span>
                  </p>
                  <p className="mt-4 leading-relaxed text-haze">{r.summary}</p>
                  {r.points.length > 0 && (
                    <ul className={clsx("mt-4 space-y-2 text-sm leading-relaxed text-haze/90", !right && "md:ml-auto")}>
                      {r.points.map((p) => (
                        <li key={p} className={clsx("flex gap-2", !right && "md:flex-row-reverse")}>
                          <span className="mt-[0.55em] h-1 w-1 shrink-0 rotate-45 bg-flare" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {r.tags.length > 0 && (
                    <div className={clsx("mt-5 flex flex-wrap gap-1.5", !right && "md:justify-end")}>
                      {r.tags.map((t) => (
                        <Chip key={t}>{t}</Chip>
                      ))}
                    </div>
                  )}
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
