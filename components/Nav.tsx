"use client";

import clsx from "clsx";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useActiveSection } from "@/lib/hooks";
import { getLenis, travelTo, warp } from "@/lib/scroll";
import { profile, sections } from "@/lib/data";
import { ease } from "./ui";

const ids = sections.map((s) => s.id);
const primary = ["origin", "trajectory", "missions", "star-chart", "transmit"];

export default function Nav() {
  const active = useActiveSection(ids);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const wasOpen = useRef(false);
  useEffect(() => {
    // Only touch scrolling on real open/close transitions so we never undo the boot sequence's lock.
    if (open === wasOpen.current) return;
    wasOpen.current = open;
    if (open) getLenis()?.stop();
    else getLenis()?.start();
    document.body.classList.toggle("locked", open);
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    warp(900);
    // wait a frame for lenis to restart after the menu closes
    requestAnimationFrame(() => travelTo(id));
  };

  const current = sections.find((s) => s.id === active) ?? sections[0];

  return (
    <>
      <header
        className={clsx(
          "fixed inset-x-0 top-0 z-50 transition-[background,border-color] duration-500",
          scrolled ? "border-b border-rim/70 bg-void/90" : "border-b border-transparent"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 md:px-10">
          <button onClick={() => go("launch")} className="group flex items-center gap-3" aria-label="Back to launch">
            <span className="relative grid h-8 w-8 place-items-center">
              <span className="absolute inset-0 animate-orbit rounded-full border border-dashed border-nebula/60" />
              <span className="h-3 w-3 rounded-full bg-plasma shadow-[0_0_14px_var(--color-plasma)] transition-transform group-hover:scale-125" />
            </span>
            <span className="font-display text-sm font-bold tracking-wide">
              REENAV<span className="text-mute">.sys</span>
            </span>
          </button>

          <nav className="hidden items-center gap-1 lg:flex">
            {sections
              .filter((s) => primary.includes(s.id))
              .map((s) => (
                <button
                  key={s.id}
                  onClick={() => go(s.id)}
                  className={clsx(
                    "relative rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors",
                    active === s.id ? "text-void" : "text-haze hover:text-star"
                  )}
                >
                  {active === s.id && (
                    <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-plasma" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                  )}
                  <span className="relative">{s.label}</span>
                </button>
              ))}
          </nav>

          <div className="flex items-center gap-2">
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-mute sm:block md:hidden xl:block">
              SEC {current.code}
            </span>
            {profile.email ? (
              <a
                href={`mailto:${profile.email}`}
                data-cursor="transmit"
                className="hidden h-9 items-center rounded-full border border-rim px-3 font-mono text-[11px] uppercase tracking-[0.15em] text-haze transition-colors hover:border-plasma hover:text-plasma sm:inline-flex"
              >
                Email
              </a>
            ) : null}
            <button
              onClick={() => window.dispatchEvent(new Event("rh:console"))}
              data-cursor="console"
              className="grid h-9 place-items-center rounded-full border border-rim px-3 font-mono text-xs text-plasma transition-colors hover:border-plasma"
              aria-label="Open console"
            >
              &gt;_
            </button>
            <button
              onClick={() => setOpen((o) => !o)}
              className="relative grid h-9 w-9 place-items-center rounded-full border border-rim lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              <span className={clsx("absolute h-px w-4 bg-star transition-transform", open ? "rotate-45" : "-translate-y-1")} />
              <span className={clsx("absolute h-px w-4 bg-star transition-transform", open ? "-rotate-45" : "translate-y-1")} />
            </button>
          </div>
        </div>
        <motion.div style={{ scaleX: progress }} className="h-px origin-left bg-gradient-to-r from-plasma via-nebula to-flare" />
      </header>

      {/* Mobile: full-screen star map menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.7, ease }}
            className="fixed inset-0 z-40 overflow-y-auto bg-void/95 px-6 pb-10 pt-24 backdrop-blur-xl lg:hidden"
          >
            <div className="dot-grid pointer-events-none absolute inset-0 opacity-50" />
            <ol className="relative space-y-1 border-l border-rim pl-6">
              {sections.map((s, i) => (
                <motion.li
                  key={s.id}
                  className="relative"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.04, ease }}
                >
                  <button onClick={() => go(s.id)} className="group flex w-full items-baseline gap-4 py-2 text-left">
                    <span
                      className={clsx(
                        "absolute -left-[30px] top-1/2 h-2.5 -translate-y-1/2 w-2.5 rounded-full border",
                        active === s.id ? "border-plasma bg-plasma shadow-[0_0_12px_var(--color-plasma)]" : "border-rim bg-void"
                      )}
                    />
                    <span className="font-mono text-[11px] text-mute">{s.code}</span>
                    <span className={clsx("font-display text-3xl font-bold", active === s.id ? "text-plasma" : "text-star")}>{s.label}</span>
                  </button>
                </motion.li>
              ))}
            </ol>
            <div className="relative mt-10 flex flex-col gap-3 font-mono text-xs uppercase tracking-[0.2em] text-haze">
              {profile.email ? (
                <a href={`mailto:${profile.email}`} className="transition-colors hover:text-plasma">
                  mail / {profile.email} ↗
                </a>
              ) : null}
              <a href={profile.github} target="_blank" rel="noreferrer" className="transition-colors hover:text-plasma">
                github / {profile.githubUser} ↗
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
