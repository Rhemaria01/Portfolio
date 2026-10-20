"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { fleet, flightRules, jamjam, juugo, profile, roles, sections, stooky, constellations } from "@/lib/data";
import { getLenis, travelTo, warp } from "@/lib/scroll";

type Line = { id: number; node: ReactNode };

const missions: Record<string, { kind: string; lede: string; stack: string[] }> = {
  stooky,
  juugo,
  jamjam,
  ...Object.fromEntries(fleet.map((f) => [f.name.toLowerCase(), { kind: f.kind, lede: f.role, stack: f.stack }])),
};

const HELP: [string, string][] = [
  ["whoami", "who is at the controls"],
  ["ls", "list missions"],
  ["cat <mission>", "mission dossier, e.g. cat stooky"],
  ["stack", "star chart, as text"],
  ["rules", "flight rules"],
  ["log", "career trajectory"],
  ["goto <sector>", "travel, e.g. goto missions"],
  ["warp", "engage hyperdrive"],
  ["clear / exit", "tidy up / close"],
];

let uid = 0;

// A small shell for people who'd rather type than scroll. Opens with ` or ~, or the >_ button.
export default function Console() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [value, setValue] = useState("");
  const history = useRef<string[]>([]);
  const cursor = useRef(-1);
  const input = useRef<HTMLInputElement>(null);
  const body = useRef<HTMLDivElement>(null);

  const print = (...nodes: ReactNode[]) => setLines((l) => [...l, ...nodes.map((node) => ({ id: uid++, node }))]);

  useEffect(() => {
    const toggle = () => setOpen((o) => !o);
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.closest("input, textarea");
      if ((e.key === "`" || e.key === "~") && !typing) {
        e.preventDefault();
        toggle();
      } else if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("rh:console", toggle);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("rh:console", toggle);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const wasOpen = useRef(false);
  useEffect(() => {
    if (open === wasOpen.current) return;
    wasOpen.current = open;
    if (open) {
      getLenis()?.stop();
      setTimeout(() => input.current?.focus(), 60);
      if (lines.length === 0)
        print(
          <span className="text-mute">REENAV.sys console · type <b className="text-plasma">help</b> to list commands</span>
        );
    } else getLenis()?.start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    body.current?.scrollTo({ top: body.current.scrollHeight });
  }, [lines]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    print(
      <span>
        <span className="text-flare">reenav@orbit</span>
        <span className="text-mute">:~$ </span>
        {cmd}
      </span>
    );
    if (!cmd) return;
    history.current.unshift(cmd);
    cursor.current = -1;
    const [name, ...args] = cmd.split(/\s+/);
    const arg = args.join(" ").toLowerCase();

    switch (name.toLowerCase()) {
      case "help":
        print(
          ...HELP.map(([c, d]) => (
            <span>
              <span className="inline-block w-36 text-plasma">{c}</span>
              <span className="text-haze">{d}</span>
            </span>
          ))
        );
        break;
      case "whoami":
        print(<span className="text-star">{profile.name} · {profile.role}</span>, <span className="text-haze">{profile.tagline}</span>);
        break;
      case "ls":
        print(
          ...Object.entries(missions).map(([k, m]) => (
            <span>
              <span className="inline-block w-24 text-plasma">{k}/</span>
              <span className="text-haze">{m.kind}</span>
            </span>
          ))
        );
        break;
      case "cat": {
        const m = missions[arg];
        if (!m) print(<span className="text-alert">cat: {arg || "<missing>"}: no such mission. try `ls`</span>);
        else print(<span className="text-star">{m.kind}</span>, <span className="text-haze">{m.lede}</span>, <span className="text-mute">stack: {m.stack.join(", ")}</span>);
        break;
      }
      case "stack":
        print(
          ...constellations.map((c) => (
            <span>
              <span className="inline-block w-28 text-solar">{c.name}</span>
              <span className="text-haze">{c.stars.join(" · ")}</span>
            </span>
          ))
        );
        break;
      case "rules":
        print(...flightRules.map((r, i) => <span className="text-haze"><span className="text-plasma">FR-{String(i + 1).padStart(2, "0")}</span> {r.t}</span>));
        break;
      case "log":
        print(...roles.map((r) => <span className="text-haze"><span className="inline-block w-44 text-plasma">{r.period}</span>{r.title} @ {r.company}</span>));
        break;
      case "goto":
      case "cd": {
        const s = sections.find((x) => x.id === arg || x.label.toLowerCase() === arg || x.code === arg);
        if (!s) {
          print(<span className="text-alert">unknown sector. options: {sections.map((x) => x.id).join(", ")}</span>);
          break;
        }
        print(<span className="text-go">plotting course → {s.label}</span>);
        setTimeout(() => {
          setOpen(false);
          warp(900);
          requestAnimationFrame(() => travelTo(s.id));
        }, 350);
        break;
      }
      case "warp":
        print(<span className="text-go">hyperdrive engaged. hold on.</span>);
        warp(2200);
        break;
      case "sudo":
        if (arg.includes("hire")) {
          print(<span className="text-go">permission granted. opening transmission channel…</span>);
          setTimeout(() => {
            setOpen(false);
            requestAnimationFrame(() => travelTo("transmit"));
          }, 600);
        } else print(<span className="text-alert">nice try. this incident will be reported to ground control.</span>);
        break;
      case "clear":
        setLines([]);
        break;
      case "exit":
        setOpen(false);
        break;
      case "rm":
        print(<span className="text-alert">refusing: production database is the source of truth.</span>);
        break;
      default:
        print(<span className="text-alert">{name}: command not found. try `help`</span>);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] flex items-end justify-center bg-void/60 p-3 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ y: 40, scale: 0.96 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 40, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="hud-panel w-full max-w-2xl overflow-hidden rounded-xl shadow-[0_0_80px_-20px_var(--color-nebula)]"
            role="dialog"
            aria-label="Console"
          >
            <div className="flex items-center justify-between border-b border-rim px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.25em] text-mute">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-go" /> uplink · rh-01
              </span>
              <button onClick={() => setOpen(false)} className="hover:text-star">esc ✕</button>
            </div>
            <div ref={body} data-lenis-prevent className="h-[52vh] space-y-1 overflow-y-auto p-4 font-mono text-[12.5px] leading-relaxed sm:h-[44vh]">
              {lines.map((l) => (
                <div key={l.id} className="break-words">{l.node}</div>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                run(value);
                setValue("");
              }}
              className="flex items-center gap-2 border-t border-rim px-4 py-3 font-mono text-[13px]"
            >
              <span className="text-flare">❯</span>
              <input
                ref={input}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                    e.preventDefault();
                    const h = history.current;
                    cursor.current = Math.max(-1, Math.min(h.length - 1, cursor.current + (e.key === "ArrowUp" ? 1 : -1)));
                    setValue(cursor.current === -1 ? "" : h[cursor.current]);
                  }
                }}
                autoCapitalize="off"
                autoComplete="off"
                spellCheck={false}
                className="flex-1 bg-transparent text-star outline-none placeholder:text-mute"
                placeholder="type a command…"
                aria-label="Console input"
              />
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
