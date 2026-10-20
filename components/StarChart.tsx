"use client";

import clsx from "clsx";
import { motion } from "motion/react";
import { useState } from "react";
import { constellations, starUsage } from "@/lib/data";
import { Reveal, Section, SectionHead } from "./ui";

// Deterministic, roughly-gridded star positions so labels never collide but still look scattered.
function layout(n: number) {
  const cols = 3;
  const rows = Math.ceil(n / cols);
  return Array.from({ length: n }, (_, i) => {
    const row = Math.floor(i / cols);
    const col = row % 2 === 0 ? i % cols : cols - 1 - (i % cols); // snake so lines read as one figure
    const jx = Math.sin(i * 12.9898) * 5;
    const jy = Math.cos(i * 78.233) * 4;
    return { x: 18 + col * 32 + jx, y: rows === 1 ? 50 : 16 + (row * 68) / (rows - 1) + jy };
  });
}

function Constellation({ name, stars, idx, focus, setFocus }: { name: string; stars: string[]; idx: number; focus: string | null; setFocus: (s: string | null) => void }) {
  const pts = layout(stars.length);
  const mine = focus && stars.includes(focus) ? focus : null;
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p.x},${p.y}`).join(" ");

  return (
    <Reveal delay={(idx % 3) * 0.08} className="h-full">
      <div className="hud-panel flex h-full flex-col overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between px-5 pt-4 font-mono text-[10px] uppercase tracking-[0.25em]">
          <span className="text-solar">{name}</span>
          <span className="text-mute">{String(stars.length).padStart(2, "0")} stars</span>
        </div>
        <div className="relative mx-4 aspect-[4/3]">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
            <motion.path
              d={d}
              fill="none"
              stroke="var(--color-nebula)"
              strokeOpacity="0.45"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              strokeDasharray="3 4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, delay: 0.3 }}
            />
          </svg>
          {stars.map((s, i) => {
            const on = s === mine;
            const used = Boolean(starUsage[s]);
            return (
              <button
                key={s}
                onPointerEnter={(e) => e.pointerType === "mouse" && setFocus(s)}
                onPointerLeave={(e) => e.pointerType === "mouse" && setFocus(null)}
                onClick={() => setFocus(on ? null : s)}
                data-cursor="scan"
                style={{ left: `${pts[i].x}%`, top: `${pts[i].y}%` }}
                className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
              >
                <span
                  className={clsx(
                    "block rounded-full transition-all duration-300",
                    on ? "h-3 w-3 bg-plasma shadow-[0_0_16px_4px_rgba(94,242,255,0.6)]" : used ? "h-2 w-2 bg-star" : "h-1.5 w-1.5 bg-haze/70"
                  )}
                />
                <span className={clsx("whitespace-nowrap font-mono text-[10px] transition-colors sm:text-[11px]", on ? "text-plasma" : "text-haze")}>{s}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-auto min-h-[52px] border-t border-rim px-5 py-3 font-mono text-[11px]">
          {mine ? (
            starUsage[mine] ? (
              <span className="text-haze">
                <span className="text-plasma">{mine}</span> → {starUsage[mine].join(", ")}
              </span>
            ) : (
              <span className="text-haze">
                <span className="text-plasma">{mine}</span> → part of the wider toolkit
              </span>
            )
          ) : (
            <span className="text-mute">hover or tap a star to see where it flew</span>
          )}
        </div>
      </div>
    </Reveal>
  );
}

export default function StarChart() {
  const [focus, setFocus] = useState<string | null>(null);
  return (
    <Section id="star-chart">
      <SectionHead
        code="07"
        label="Star chart"
        title="The toolkit,"
        accent="mapped to missions."
        kicker="Brighter stars have shipped in the projects above. Pick one to see which missions it flew on."
      />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {constellations.map((c, i) => (
          <Constellation key={c.name} name={c.name} stars={c.stars} idx={i} focus={focus} setFocus={setFocus} />
        ))}
      </div>
    </Section>
  );
}
