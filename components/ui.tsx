"use client";

import clsx from "clsx";
import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

export const ease = [0.16, 1, 0.3, 1] as const;

export function Reveal({ children, delay = 0, y = 28, className }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const GLYPHS = "!<>-_\\/[]{}—=+*^?#01ΔΣΩ";

// Text that "decrypts" from noise the first time it scrolls into view.
export function Decrypt({ text, className, speed = 28 }: { text: string; className?: string; speed?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [out, setOut] = useState(text);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const total = text.length + 10;
    const id = setInterval(() => {
      frame++;
      setOut(
        text
          .split("")
          .map((c, i) => (c === " " || i < frame - 10 ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
          .join("")
      );
      if (frame >= total) {
        clearInterval(id);
        setOut(text);
      }
    }, speed);
    return () => clearInterval(id);
  }, [inView, text, speed]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden>{out}</span>
    </span>
  );
}

export function SectionHead({ code, label, title, accent, kicker }: { code: string; label: string; title: string; accent?: string; kicker?: string }) {
  return (
    <header className="mb-14 md:mb-20">
      <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-plasma">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-beacon rounded-full bg-plasma" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-plasma" />
        </span>
        <Decrypt text={`Sector ${code} // ${label}`} />
        <span className="hidden h-px flex-1 bg-gradient-to-r from-plasma/40 to-transparent sm:block" />
      </div>
      <h2 className="mt-6 max-w-4xl font-display text-[clamp(2.3rem,6.4vw,5.4rem)] font-bold leading-[0.95] tracking-tight">
        <WordRise text={title} />
        {accent && (
          <>
            {" "}
            <WordRise text={accent} className="text-aurora" delay={0.15} />
          </>
        )}
      </h2>
      {kicker && (
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-haze md:text-lg">{kicker}</p>
        </Reveal>
      )}
    </header>
  );
}

export function WordRise({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <span className={clsx("inline", className)}>
      {text.split(" ").map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "110%", rotate: 4 }}
            whileInView={{ y: "0%", rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.95, delay: delay + i * 0.06, ease }}
          >
            {word}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function Chip({ children, tone = "default", className }: { children: ReactNode; tone?: "default" | "plasma" | "flare" | "solar"; className?: string }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-wider",
        tone === "default" && "border-rim bg-hull/60 text-haze",
        tone === "plasma" && "border-plasma/40 bg-plasma/10 text-plasma",
        tone === "flare" && "border-flare/40 bg-flare/10 text-flare",
        tone === "solar" && "border-solar/40 bg-solar/10 text-solar",
        className
      )}
    >
      {children}
    </span>
  );
}

export function Section({ id, children, className }: { id: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={clsx("relative mx-auto w-full max-w-7xl scroll-mt-20 px-4 py-24 sm:px-6 md:px-10 md:py-36", className)}>
      {children}
    </section>
  );
}
