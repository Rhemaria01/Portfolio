"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { jamjam, juugo, stooky } from "@/lib/data";
import { Chip, Reveal, Section, SectionHead, WordRise } from "./ui";
import StookySim from "./systems/StookySim";
import { QueryParse, StageRocket } from "./systems/JuugoStages";
import SchemaConstellation from "./systems/SchemaConstellation";

function MissionHeader({ designation, name, kind, lede, link, hue }: { designation: string; name: string; kind: string; lede: string; link?: string; hue: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["6%", "-10%"]);
  return (
    <div ref={ref} className="relative mb-10 md:mb-14">
      <motion.p
        aria-hidden
        style={{ x }}
        className="pointer-events-none absolute -top-10 left-0 select-none whitespace-nowrap font-display text-[clamp(5rem,20vw,16rem)] font-extrabold leading-none text-hollow opacity-30"
      >
        {name}
      </motion.p>
      <div className="relative">
        <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em]">
          <span className="rounded-sm px-2 py-0.5 text-void" style={{ background: hue }}>
            {designation}
          </span>
          <span className="text-haze">{kind}</span>
          {link && (
            <a href={link} target="_blank" rel="noreferrer" data-cursor="visit" className="text-plasma hover:text-star">
              {link.replace("https://", "")} ↗
            </a>
          )}
        </div>
        <h3 className="mt-4 font-display text-[clamp(2.8rem,8vw,6rem)] font-extrabold leading-none tracking-tight">
          <WordRise text={name} />
        </h3>
        <Reveal delay={0.1}>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-haze">{lede}</p>
        </Reveal>
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Reveal className="hud-panel rounded-2xl p-5 md:p-6">
      <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-mute">{title}</p>
      {children}
    </Reveal>
  );
}

function Stack({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((s) => (
        <Chip key={s}>{s}</Chip>
      ))}
    </div>
  );
}

export default function Missions() {
  return (
    <Section id="missions">
      <SectionHead
        code="03"
        label="Primary missions"
        title="Three systems,"
        accent="flown in production."
        kicker="The strongest evidence of how I work: an event-driven runtime, a search architecture rebuilt in five stages, and a data model built before the API. The first one is live below; break it on purpose."
      />

      {/* ── Stooky ── */}
      <article className="mb-32 md:mb-44">
        <MissionHeader designation={stooky.designation} name={stooky.name} kind={stooky.kind} lede={stooky.lede} link={stooky.url} hue="var(--color-plasma)" />
        <Reveal>
          <StookySim />
        </Reveal>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Panel title="Architecture decisions">
            <ol className="grid gap-5 sm:grid-cols-2">
              {stooky.decisions.map((d, i) => (
                <li key={d.t}>
                  <p className="font-mono text-[10px] text-plasma">AD-{String(i + 1).padStart(2, "0")}</p>
                  <p className="mt-1 font-display font-bold leading-snug">{d.t}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-haze">{d.d}</p>
                </li>
              ))}
            </ol>
          </Panel>
          <div className="grid gap-6">
            <Panel title="Process roles">
              <div className="grid grid-cols-3 gap-2">
                {stooky.roles.map((r) => (
                  <div key={r} className="rounded-md border border-rim bg-void/60 px-2 py-2 text-center font-mono text-[11px] text-haze">
                    <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-go" />
                    {r}
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-haze">{stooky.deploy}</p>
            </Panel>
            <Panel title="Operator dashboard · led">
              <p className="text-sm leading-relaxed text-haze">{stooky.dashboard}</p>
            </Panel>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Panel title="Built on top">
            <ul className="grid gap-x-6 gap-y-2.5 text-sm text-haze sm:grid-cols-2">
              {stooky.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="mt-[0.55em] h-1 w-1 shrink-0 rotate-45 bg-plasma" />
                  {f}
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="Stack">
            <Stack items={stooky.stack} />
          </Panel>
        </div>
      </article>

      {/* ── Juugo ── */}
      <article className="mb-32 md:mb-44">
        <MissionHeader designation={juugo.designation} name={juugo.name} kind={juugo.kind} lede={juugo.lede} hue="var(--color-flare)" />
        <Reveal>
          <StageRocket />
        </Reveal>
        <div className="mt-14 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <Reveal>
            <QueryParse />
          </Reveal>
          <div className="grid gap-6">
            <Panel title="Instrumentation">
              <p className="text-sm leading-relaxed text-haze">{juugo.bench}</p>
            </Panel>
            <Panel title="Embedding alignment">
              <p className="text-sm leading-relaxed text-haze">{juugo.embed}</p>
            </Panel>
          </div>
        </div>
        <div className="mt-6">
          <Panel title="Stack">
            <Stack items={juugo.stack} />
          </Panel>
        </div>
      </article>

      {/* ── JamJam ── */}
      <article>
        <MissionHeader designation={jamjam.designation} name={jamjam.name} kind={jamjam.kind} lede={jamjam.lede} hue="var(--color-solar)" />
        <Reveal>
          <SchemaConstellation />
        </Reveal>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Panel title="Patterns">
            <ul className="space-y-2.5 text-sm text-haze">
              {jamjam.extras.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="mt-[0.55em] h-1 w-1 shrink-0 rotate-45 bg-solar" />
                  {f}
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="Stack">
            <Stack items={jamjam.stack} />
          </Panel>
        </div>
      </article>
    </Section>
  );
}
