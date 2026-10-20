"use client";

import { motion } from "motion/react";
import { profile } from "@/lib/data";
import { travelTo, warp } from "@/lib/scroll";
import { Reveal, WordRise } from "./ui";

export default function Transmit() {
  const channels = [
    profile.email && { k: "Email", v: profile.email, href: `mailto:${profile.email}` },
    { k: "GitHub", v: `@${profile.githubUser}`, href: profile.github },
    profile.linkedin && { k: "LinkedIn", v: "in/" + profile.linkedin.split("/in/")[1]?.replace(/\/$/, ""), href: profile.linkedin },
    profile.resume && { k: "Resume", v: "download.pdf", href: profile.resume },
  ].filter(Boolean) as { k: string; v: string; href: string }[];

  return (
    <section id="transmit" className="relative overflow-hidden">
      {/* Radio dish sweep */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2">
        {[0, 1, 2, 3].map((i) => (
          <motion.span
            key={i}
            className="absolute left-1/2 top-1/2 block h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-plasma/20"
            animate={{ scale: [0.2, 2], opacity: [0.6, 0] }}
            transition={{ duration: 6, repeat: Infinity, delay: i * 1.5, ease: "easeOut" }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-28 sm:px-6 md:px-10 md:pt-40">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-plasma">Sector 09 // Transmit</p>
        <h2 className="mt-6 font-display text-[clamp(3rem,11vw,9.5rem)] font-extrabold leading-[0.88] tracking-tighter">
          <WordRise text="Open a" />
          <br />
          <WordRise text="channel." className="text-aurora" delay={0.1} />
        </h2>
        <Reveal delay={0.2}>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-haze">
            Backend-heavy product work, system design, or something that needs a data model before it needs a UI: the signal is open.
          </p>
        </Reveal>

        <ul className="mt-14 divide-y divide-rim border-y border-rim">
          {channels.map((c, i) => (
            <li key={c.k}>
              <Reveal delay={i * 0.06}>
                <a
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  data-cursor="transmit"
                  className="group flex items-center justify-between gap-4 py-6 md:py-8"
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-mute">{c.k}</span>
                  <span className="flex items-center gap-4 font-display text-2xl font-bold transition-colors group-hover:text-plasma sm:text-4xl md:text-5xl">
                    {c.v}
                    <span className="inline-block transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1">↗</span>
                  </span>
                </a>
              </Reveal>
            </li>
          ))}
        </ul>

        <footer className="mt-24 flex flex-col gap-6 font-mono text-[10px] uppercase tracking-[0.25em] text-mute md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} {profile.name} · hand-built, no template</span>
          <span className="hidden md:inline">` opens the console · try “sudo hire reenav”</span>
          <button
            onClick={() => {
              warp(1600);
              travelTo("launch");
            }}
            data-cursor="liftoff"
            className="self-start text-plasma hover:text-star md:self-auto"
          >
            ↑ Return to launch
          </button>
        </footer>
      </div>
    </section>
  );
}
