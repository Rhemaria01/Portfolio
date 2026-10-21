"use client";

import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { archive, archiveGroups } from "@/lib/data";
import { Section, SectionHead } from "./ui";

const GROUP_TONE = { agency: "text-plasma", college: "text-solar", side: "text-flare", oss: "text-go", client: "text-nebula" } as const;
const GROUP_NAME = { agency: "Code Rustlers", college: "College", side: "Side quest", oss: "Open source", client: "Client" } as const;

export default function DeepField() {
  const [filter, setFilter] = useState<(typeof archiveGroups)[number]["id"]>("all");
  const items = archive.filter((a) => filter === "all" || a.group === filter);

  return (
    <Section id="deep-field">
      <SectionHead
        code="06"
        label="Deep field"
        title="Older light,"
        accent="still worth seeing."
        kicker="Open-source work, client sites, agency SaaS builds, college projects and side quests from before the backend years. Most of the frontend instincts come from here."
      />

      <div className="no-scrollbar -mx-4 mb-10 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {archiveGroups.map((g) => {
          const count = g.id === "all" ? archive.length : archive.filter((a) => a.group === g.id).length;
          return (
            <button
              key={g.id}
              onClick={() => setFilter(g.id)}
              className={clsx(
                "relative shrink-0 rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-wider transition-colors",
                filter === g.id ? "border-transparent text-void" : "border-rim text-haze hover:text-star"
              )}
            >
              {filter === g.id && <motion.span layoutId="field-pill" className="absolute inset-0 rounded-full bg-star" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
              <span className="relative">
                {g.label} <span className={filter === g.id ? "text-void/60" : "text-mute"}>{count}</span>
              </span>
            </button>
          );
        })}
      </div>

      <motion.ul layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {items.map((a) => (
            <motion.li
              layout
              key={a.name}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.35 }}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-rim bg-deep/70 p-5 transition-colors hover:border-plasma/40"
            >
              <span className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-plasma/0 blur-2xl transition-colors duration-500 group-hover:bg-plasma/20" />
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em]">
                <span className={GROUP_TONE[a.group]}>{GROUP_NAME[a.group]}</span>
                <span className="text-mute">{a.year}</span>
              </div>
              <h3 className="mt-3 font-display text-2xl font-bold">{a.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-haze">{a.blurb}</p>
              {a.outcome && (
                <p className="mt-4 inline-flex items-center gap-2 self-start rounded-md border border-go/30 bg-go/10 px-2.5 py-1 font-mono text-[11px] text-go">
                  ▲ {a.outcome}
                </p>
              )}
              <p className="mt-4 font-mono text-[11px] text-mute">{a.stack.join(" · ")}</p>
              {a.links && (
                <div className="mt-auto flex gap-4 pt-4">
                  {a.links.map((l) => (
                    <a key={l.href} href={l.href} target="_blank" rel="noreferrer" data-cursor="open" className="font-mono text-[11px] uppercase tracking-wider text-plasma hover:text-star">
                      {l.label} ↗
                    </a>
                  ))}
                </div>
              )}
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <p className="mt-8 font-mono text-[11px] leading-relaxed text-mute">
        Also in the archive: Pest Solutions site, Tailcall website sections, a weather client, Pokedex, a candle-pattern chatbot, an
        image-expansion UI with a Python API, Hinglish subtitles, a video highlighter and more.
      </p>
    </Section>
  );
}
