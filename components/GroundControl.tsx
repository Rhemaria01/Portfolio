"use client";

import { certifications, education, logbook, paper } from "@/lib/data";
import { Reveal, Section, SectionHead } from "./ui";

export default function GroundControl() {
  return (
    <Section id="ground">
      <SectionHead code="08" label="Ground control" title="Where the" accent="countdown started." />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Reveal className="hud-panel relative overflow-hidden rounded-2xl p-6 md:p-8">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-solar to-transparent" />
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-solar">Published · {paper.venue} · {paper.year}</p>
          <h3 className="mt-4 font-display text-2xl font-bold leading-snug md:text-3xl">“{paper.title}”</h3>
          <p className="mt-4 leading-relaxed text-haze">
            Research that grew out of Digicrowd, a decentralized crowdfunding platform on Ethereum built with Solidity, Thirdweb and IPFS.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="hud-panel rounded-2xl p-6 md:p-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-plasma">Education · {education.period}</p>
          <h3 className="mt-4 font-display text-2xl font-bold">{education.degree}</h3>
          <p className="mt-2 text-haze">{education.school}</p>
          <div className="mt-6 flex items-end gap-3">
            <span className="font-display text-5xl font-extrabold text-aurora">{education.score}</span>
            <span className="pb-2 font-mono text-[11px] uppercase tracking-wider text-mute">CGPI</span>
          </div>
        </Reveal>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Reveal className="rounded-2xl border border-rim p-6 md:p-8">
          <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.25em] text-mute">Logbook</p>
          <ul className="divide-y divide-rim">
            {logbook.map((l) => (
              <li key={l.t} className="grid grid-cols-[56px_1fr] gap-4 py-3">
                <span className="font-mono text-xs text-plasma">{l.y}</span>
                <span>
                  <span className="font-display font-bold">{l.t}</span>
                  <span className="mt-0.5 block text-sm text-haze">{l.d}</span>
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.1} className="rounded-2xl border border-rim p-6 md:p-8">
          <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.25em] text-mute">Certifications</p>
          <ul className="space-y-3">
            {certifications.map((c) => (
              <li key={c} className="flex items-center gap-3 text-sm text-haze">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-go/40 text-[10px] text-go">✓</span>
                {c}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}
