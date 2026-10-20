"use client";

import clsx from "clsx";
import { useInView } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

type NodeDef = { id: string; label: string; sub: string; x: number; y: number; w?: number };

const NODES: NodeDef[] = [
  { id: "client", label: "Client", sub: "app", x: 70, y: 250, w: 110 },
  { id: "nginx", label: "Nginx", sub: "edge", x: 205, y: 250, w: 110 },
  { id: "api", label: "API", sub: "NestJS", x: 355, y: 250, w: 120 },
  { id: "redis", label: "Redis", sub: "overlay", x: 555, y: 80 },
  { id: "pgb", label: "PgBouncer", sub: "txn pool", x: 555, y: 190 },
  { id: "pg", label: "PostgreSQL", sub: "source of truth", x: 770, y: 190, w: 150 },
  { id: "kafka", label: "Kafka", sub: "engage | exposure", x: 555, y: 370, w: 150 },
  { id: "counter", label: "counter", sub: "consumer", x: 770, y: 310 },
  { id: "notifier", label: "notifier", sub: "consumer", x: 770, y: 410 },
  { id: "connect", label: "Kafka Connect", sub: "sink", x: 770, y: 500, w: 150 },
  { id: "push", label: "FCM · in-app", sub: "realtime", x: 940, y: 410, w: 120 },
  { id: "cass", label: "Cassandra", sub: "→ Spark", x: 940, y: 500, w: 120 },
  { id: "recon", label: "reconcile", sub: "job", x: 940, y: 190, w: 120 },
];
const H = 50;
const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));

const EDGES = [
  "client>nginx", "nginx>api", "api>redis", "api>pgb", "pgb>pg", "api>kafka",
  "kafka>counter", "counter>pg", "counter>redis", "kafka>notifier", "notifier>push",
  "kafka>connect", "connect>cass", "recon>pg",
];

function edgePath(id: string) {
  const [a, b] = id.split(">").map((k) => byId[k]);
  const mx = (a.x + b.x) / 2;
  if (id === "counter>redis") return `M${a.x},${a.y} C${a.x - 60},${a.y - 140} ${b.x + 120},${b.y + 10} ${b.x},${b.y}`;
  if (id === "recon>pg") return `M${a.x},${a.y} L${b.x},${b.y}`;
  return `M${a.x},${a.y} C${mx},${a.y} ${mx},${b.y} ${b.x},${b.y}`;
}

const COLORS = { like: "#5ef2ff", exposure: "#8b6cff", read: "#ffbf5a", repair: "#6dffb0", fail: "#ff5d5d" };

type Log = { id: number; t: string; msg: string; tone: "ok" | "warn" | "err" | "info" };
let logId = 0;

export default function StookySim() {
  const wrap = useRef<HTMLDivElement>(null);
  const inView = useInView(wrap, { once: true, margin: "-120px" });
  const paths = useRef(new Map<string, SVGPathElement>());
  const nodes = useRef(new Map<string, SVGGElement>());
  const layer = useRef<SVGGElement>(null);
  const t0 = useRef(0);
  const alive = useRef(true);

  const [down, setDown] = useState({ kafka: false, redis: false });
  const downRef = useRef(down);
  downRef.current = down;
  const [stats, setStats] = useState({ rows: 128, counter: 128, cache: 128, buffer: 0, impressions: 2040 });
  const statsRef = useRef(stats);
  statsRef.current = stats;
  const [logs, setLogs] = useState<Log[]>([]);

  const patch = (p: Partial<typeof stats>) => alive.current && setStats((s) => ({ ...s, ...p }));
  const log = useCallback((msg: string, tone: Log["tone"] = "info") => {
    if (!alive.current) return;
    const ms = Math.round(performance.now() - t0.current);
    setLogs((l) => [{ id: logId++, t: `+${String(ms).padStart(5, "0")}ms`, msg, tone }, ...l].slice(0, 7));
  }, []);

  useEffect(() => {
    alive.current = true;
    t0.current = performance.now();
    return () => {
      alive.current = false;
    };
  }, []);

  // Move one packet along one edge. Resolves false if it was dropped at a dead node.
  const hop = useCallback((edge: string, color: string, fail = false) => {
    return new Promise<boolean>((resolve) => {
      const path = paths.current.get(edge);
      const g = layer.current;
      if (!path || !g || !alive.current) return resolve(false);
      const len = path.getTotalLength();
      const ns = "http://www.w3.org/2000/svg";
      const p = document.createElementNS(ns, "g");
      const halo = document.createElementNS(ns, "circle");
      halo.setAttribute("r", "11");
      halo.setAttribute("fill", color);
      halo.setAttribute("opacity", "0.22");
      const core = document.createElementNS(ns, "circle");
      core.setAttribute("r", "4.5");
      core.setAttribute("fill", color);
      p.append(halo, core);
      g.appendChild(p);
      path.classList.add("edge-live");
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const dur = reduced ? 1 : 560;
      const start = performance.now();
      const stopAt = fail ? 0.62 : 1;

      const step = (now: number) => {
        const raw = Math.min(1, (now - start) / dur);
        const t = Math.min(stopAt, raw < 0.5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2);
        const pt = path.getPointAtLength(len * t);
        p.setAttribute("transform", `translate(${pt.x},${pt.y})`);
        if (t >= stopAt) {
          path.classList.remove("edge-live");
          if (fail) {
            core.setAttribute("fill", COLORS.fail);
            halo.setAttribute("fill", COLORS.fail);
            const boom = performance.now();
            const burst = (n: number) => {
              const k = Math.min(1, (n - boom) / 380);
              halo.setAttribute("r", String(11 + k * 26));
              p.setAttribute("opacity", String(1 - k));
              if (k < 1) requestAnimationFrame(burst);
              else p.remove();
            };
            requestAnimationFrame(burst);
            return resolve(false);
          }
          p.remove();
          const target = nodes.current.get(edge.split(">")[1]);
          target?.classList.add("node-hit");
          setTimeout(() => target?.classList.remove("node-hit"), 380);
          return resolve(true);
        }
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, []);

  const route = async (edges: string[], color: string) => {
    for (const e of edges) if (!(await hop(e, color))) return false;
    return true;
  };

  const like = async () => {
    log("POST /posts/4821/like", "info");
    await route(["client>nginx", "nginx>api", "api>pgb", "pgb>pg"], COLORS.like);
    patch({ rows: statsRef.current.rows + 1 });
    log("like row committed in PostgreSQL · 201 sent. Client never waits on the broker", "ok");

    if (downRef.current.kafka) {
      await hop("api>kafka", COLORS.like, true);
      log("broker unreachable: request already succeeded, counter is now stale", "warn");
      return;
    }
    await hop("api>kafka", COLORS.like);
    await Promise.all([
      (async () => {
        await route(["kafka>counter", "counter>pg"], COLORS.like);
        patch({ counter: statsRef.current.counter + 1 });
        log("counter += 1 with watermark in the same txn · replay-safe", "ok");
        if (downRef.current.redis) {
          await hop("counter>redis", COLORS.like, true);
          log("redis down: compensation skipped, TTL is the backstop", "warn");
        } else {
          await hop("counter>redis", COLORS.like);
          patch({ cache: statsRef.current.counter });
          log("redis overlay compensated after commit", "info");
        }
      })(),
      (async () => {
        await route(["kafka>notifier", "notifier>push"], COLORS.like);
        log("notifier → push to author (quiet hours respected)", "info");
      })(),
      route(["kafka>connect", "connect>cass"], COLORS.like),
    ]);
  };

  const impression = async () => {
    await route(["client>nginx", "nginx>api"], COLORS.exposure);
    if (downRef.current.kafka) {
      await hop("api>kafka", COLORS.exposure, true);
      log("exposure event lost to outage; the feed keeps serving", "warn");
      return;
    }
    await route(["api>kafka", "kafka>counter"], COLORS.exposure);
    const buffer = statsRef.current.buffer + 1;
    if (buffer < 4) {
      patch({ buffer });
      log(`exposure lane: buffered ${buffer}/4 in the consumer`, "info");
      return;
    }
    patch({ buffer: 0 });
    await hop("counter>pg", COLORS.exposure);
    patch({ impressions: statsRef.current.impressions + 4 });
    log("batch of 4 impressions flushed in one write", "ok");
  };

  const read = async () => {
    log("GET /users/ava/profile", "info");
    await route(["client>nginx", "nginx>api"], COLORS.read);
    if (downRef.current.redis) {
      await hop("api>redis", COLORS.read, true);
      log("redis unavailable → fall through to PostgreSQL", "warn");
      await route(["api>pgb", "pgb>pg"], COLORS.read);
      log("served from source of truth · slower, still correct", "ok");
      return;
    }
    await hop("api>redis", COLORS.read);
    log("cache hit: profile snapshot from the overlay", "ok");
  };

  const reconcile = async () => {
    await hop("recon>pg", COLORS.repair);
    const s = statsRef.current;
    patch({ counter: s.rows, cache: downRef.current.redis ? s.cache : s.rows });
    log(s.counter === s.rows ? "reconcile: counters already consistent" : `reconcile: counter repaired ${s.counter} → ${s.rows}`, "ok");
  };

  const toggle = (k: "kafka" | "redis") => {
    const next = !down[k];
    setDown((d) => ({ ...d, [k]: next }));
    log(`${k} ${next ? "OFFLINE (simulated outage)" : "back online"}`, next ? "err" : "ok");
  };

  // Play one like automatically the first time the diagram comes into view.
  useEffect(() => {
    if (inView) setTimeout(() => like(), 400);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  const stale = stats.counter !== stats.rows;

  return (
    <div ref={wrap} className="hud-panel overflow-hidden rounded-2xl !bg-deep">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rim px-4 py-3 md:px-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-mute">
          live sim · stooky runtime <span className="hidden sm:inline">· click to send traffic</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {(["kafka", "redis"] as const).map((k) => (
            <button
              key={k}
              onClick={() => toggle(k)}
              data-cursor={down[k] ? "restore" : "kill"}
              className={clsx(
                "flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-wider transition-colors",
                down[k] ? "border-alert/60 bg-alert/15 text-alert" : "border-rim text-haze hover:border-alert/60 hover:text-alert"
              )}
            >
              <span className={clsx("h-1.5 w-1.5 rounded-full", down[k] ? "bg-alert" : "bg-go")} />
              {down[k] ? `restore ${k}` : `kill ${k}`}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="relative min-w-0">
          <div data-lenis-prevent-touch className="no-scrollbar overflow-x-auto">
            <svg viewBox="0 0 1010 550" className="block w-full min-w-[760px]" role="img" aria-label="Stooky architecture: client to Nginx to API; API writes PostgreSQL through PgBouncer, uses Redis as an overlay, and emits events to Kafka consumed by counter, notifier and Kafka Connect.">
              <defs>
                <pattern id="sim-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="0.8" fill="#232a4d" />
                </pattern>
              </defs>
              <rect width="1010" height="550" fill="url(#sim-grid)" />
              <g fill="none" strokeWidth="1.4">
                {EDGES.map((e) => (
                  <path
                    key={e}
                    ref={(el) => {
                      if (el) paths.current.set(e, el);
                    }}
                    d={edgePath(e)}
                    className={clsx("sim-edge", e.includes("kafka") && down.kafka && "sim-edge-dead", e.includes("redis") && down.redis && "sim-edge-dead")}
                    strokeDasharray={e === "api>kafka" || e === "recon>pg" ? "5 5" : undefined}
                  />
                ))}
              </g>
              <g ref={layer} />
              {NODES.map((n) => {
                const w = n.w ?? 130;
                const dead = (n.id === "kafka" && down.kafka) || (n.id === "redis" && down.redis);
                return (
                  <g
                    key={n.id}
                    ref={(el) => {
                      if (el) nodes.current.set(n.id, el);
                    }}
                    className={clsx("sim-node", dead && "sim-node-dead", n.id === "pg" && "sim-node-truth")}
                    transform={`translate(${n.x - w / 2},${n.y - H / 2})`}
                  >
                    <rect width={w} height={H} rx="10" />
                    <text x={w / 2} y="22" textAnchor="middle" className="fill-star font-display text-[14px] font-bold">
                      {n.label}
                    </text>
                    <text x={w / 2} y="38" textAnchor="middle" className={clsx("font-mono text-[9.5px] uppercase tracking-wider", dead ? "fill-alert" : "fill-mute")}>
                      {dead ? "offline" : n.sub}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <p className="pointer-events-none absolute bottom-2 right-3 font-mono text-[9px] uppercase tracking-widest text-mute sm:hidden">swipe ⇆</p>
        </div>

        <aside className="flex flex-col gap-4 border-t border-rim p-4 lg:border-l lg:border-t-0">
          <div className="grid grid-cols-3 gap-2 lg:grid-cols-1">
            <button onClick={like} data-cursor="send" className="rounded-lg border border-plasma/40 bg-plasma/10 px-3 py-2.5 text-left font-mono text-[11px] uppercase tracking-wider text-plasma transition-colors hover:bg-plasma/20">
              ♥ like <span className="hidden text-plasma/60 lg:inline">· engagement</span>
            </button>
            <button onClick={impression} data-cursor="send" className="rounded-lg border border-nebula/50 bg-nebula/10 px-3 py-2.5 text-left font-mono text-[11px] uppercase tracking-wider text-nebula transition-colors hover:bg-nebula/20">
              ◉ impression <span className="hidden text-nebula/60 lg:inline">· exposure</span>
            </button>
            <button onClick={read} data-cursor="send" className="rounded-lg border border-solar/40 bg-solar/10 px-3 py-2.5 text-left font-mono text-[11px] uppercase tracking-wider text-solar transition-colors hover:bg-solar/20">
              ⌕ read <span className="hidden text-solar/60 lg:inline">· profile</span>
            </button>
          </div>

          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-rim bg-rim font-mono text-[10px] uppercase tracking-wider">
            {[
              ["like rows", stats.rows, "text-star"],
              ["pg counter", stats.counter, stale ? "text-solar" : "text-go"],
              ["redis overlay", stats.cache, stats.cache !== stats.rows ? "text-solar" : "text-go"],
              ["impressions", `${stats.impressions}${stats.buffer ? ` +${stats.buffer}` : ""}`, "text-nebula"],
            ].map(([k, v, c]) => (
              <div key={k as string} className="bg-void/80 px-3 py-2">
                <dt className="text-mute">{k}</dt>
                <dd className={clsx("mt-0.5 text-sm", c as string)}>{v}</dd>
              </div>
            ))}
          </dl>

          <button
            onClick={reconcile}
            className={clsx(
              "rounded-lg border px-3 py-2 font-mono text-[11px] uppercase tracking-wider transition-colors",
              stale ? "border-go/60 bg-go/10 text-go" : "border-rim text-mute hover:text-haze"
            )}
          >
            ↻ run reconciliation {stale && "· counters stale"}
          </button>

          <ol aria-live="polite" className="min-h-[150px] space-y-1.5 font-mono text-[10.5px] leading-snug">
            {logs.map((l) => (
              <li key={l.id} className="flex gap-2">
                <span className="shrink-0 text-mute">{l.t}</span>
                <span className={clsx(l.tone === "ok" && "text-go", l.tone === "warn" && "text-solar", l.tone === "err" && "text-alert", l.tone === "info" && "text-haze")}>{l.msg}</span>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </div>
  );
}
