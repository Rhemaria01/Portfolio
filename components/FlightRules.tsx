"use client";

import clsx from "clsx";
import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import { flightRules } from "@/lib/data";
import { Section, SectionHead } from "./ui";

function Rule({ r, i }: { r: (typeof flightRules)[number]; i: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const checked = useInView(ref, { once: true, margin: "-25% 0px -25% 0px" });
  const [open, setOpen] = useState(false);

  return (
    <li ref={ref} className="border-b border-rim">
      <button onClick={() => setOpen((o) => !o)} className="group flex w-full items-start gap-4 py-5 text-left md:gap-6 md:py-6" aria-expanded={open}>
        <span className="mt-1 font-mono text-[11px] text-mute">FR-{String(i + 1).padStart(2, "0")}</span>
        <span
          className={clsx(
            "mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-sm border transition-colors duration-500",
            checked ? "border-go bg-go/15" : "border-rim"
          )}
        >
          <svg viewBox="0 0 12 12" className="h-3 w-3">
            <motion.path
              d="M2 6.5l2.5 2.5L10 3"
              fill="none"
              stroke="var(--color-go)"
              strokeWidth="1.8"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: checked ? 1 : 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            />
          </svg>
        </span>
        <span className="flex-1">
          <span className="block font-display text-xl font-bold leading-snug transition-colors group-hover:text-plasma md:text-2xl">{r.t}</span>
          <motion.span
            initial={false}
            animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
            className="block overflow-hidden"
          >
            <span className="block pt-3 leading-relaxed text-haze">{r.d}</span>
          </motion.span>
        </span>
        <span className={clsx("mt-1 font-mono text-lg text-mute transition-transform", open && "rotate-45 text-plasma")}>+</span>
      </button>
    </li>
  );
}

export default function FlightRules() {
  const half = Math.ceil(flightRules.length / 2);
  return (
    <Section id="rules">
      <SectionHead
        code="05"
        label="Flight rules"
        title="The pre-flight checklist"
        accent="I run on every system."
        kicker="Principles pulled from the work above. Each one is checked off as you scroll past; open any of them for the reasoning."
      />
      <div className="grid gap-x-12 md:grid-cols-2">
        {[flightRules.slice(0, half), flightRules.slice(half)].map((col, c) => (
          <ol key={c} className="border-t border-rim">
            {col.map((r, i) => (
              <Rule key={r.t} r={r} i={i + c * half} />
            ))}
          </ol>
        ))}
      </div>
    </Section>
  );
}
