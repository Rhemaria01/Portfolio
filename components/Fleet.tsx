"use client";

import clsx from "clsx";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import type { PointerEvent as RPointerEvent } from "react";
import { fleet } from "@/lib/data";
import { Chip, Reveal, Section, SectionHead } from "./ui";

const HUE: Record<string, { ring: string; dot: string; text: string; glow: string }> = {
  amber: { ring: "border-solar/30", dot: "bg-solar", text: "text-solar", glow: "rgba(255,191,90,0.18)" },
  cyan: { ring: "border-plasma/30", dot: "bg-plasma", text: "text-plasma", glow: "rgba(94,242,255,0.16)" },
  violet: { ring: "border-nebula/40", dot: "bg-nebula", text: "text-nebula", glow: "rgba(139,108,255,0.2)" },
};

function Craft({ f, i }: { f: (typeof fleet)[number]; i: number }) {
  const h = HUE[f.hue];
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotX = useSpring(useTransform(my, [0, 1], [6, -6]), { stiffness: 160, damping: 18 });
  const rotY = useSpring(useTransform(mx, [0, 1], [-8, 8]), { stiffness: 160, damping: 18 });
  const glow = useTransform([mx, my], ([x, y]: number[]) => `radial-gradient(420px circle at ${x * 100}% ${y * 100}%, ${h.glow}, transparent 60%)`);

  const onMove = (e: RPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };

  return (
    <Reveal delay={i * 0.1} className="h-full">
      <motion.div
        onPointerMove={onMove}
        onPointerLeave={() => {
          mx.set(0.5);
          my.set(0.5);
        }}
        style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 1000 }}
        className="hud-panel group relative flex h-full flex-col overflow-hidden rounded-2xl p-6"
      >
        <motion.div style={{ background: glow }} className="pointer-events-none absolute inset-0" />
        {/* decorative orbit in the corner */}
        <div className={clsx("absolute -right-16 -top-16 h-44 w-44 rounded-full border", h.ring)}>
          <div className="absolute inset-0 animate-orbit" style={{ animationDuration: `${14 + i * 5}s` }}>
            <span className={clsx("absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full", h.dot)} />
          </div>
          <div className={clsx("absolute inset-10 rounded-full opacity-70", h.dot)} style={{ filter: "blur(18px)" }} />
        </div>

        <div className="relative">
          <p className={clsx("font-mono text-[10px] uppercase tracking-[0.25em]", h.text)}>SAT-0{i + 4} · {f.kind}</p>
          <h3 className="mt-3 font-display text-4xl font-extrabold">{f.name}</h3>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-star/80">{f.role}</p>
          <ul className="mt-5 space-y-2.5 text-sm leading-relaxed text-haze">
            {f.points.map((p) => (
              <li key={p} className="flex gap-2">
                <span className={clsx("mt-[0.55em] h-1 w-1 shrink-0 rotate-45", h.dot)} />
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative mt-auto flex flex-wrap gap-1.5 pt-6">
          {f.stack.map((s) => (
            <Chip key={s}>{s}</Chip>
          ))}
        </div>
      </motion.div>
    </Reveal>
  );
}

export default function Fleet() {
  return (
    <Section id="fleet">
      <SectionHead
        code="04"
        label="Fleet"
        title="Supporting craft,"
        accent="each with a clear owner."
        kicker="Three more Stuvio products. The ownership on each is stated exactly: what I led, what I stood up, and which slice I contributed."
      />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {fleet.map((f, i) => (
          <Craft key={f.name} f={f} i={i} />
        ))}
      </div>
    </Section>
  );
}
