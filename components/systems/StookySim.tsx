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
  { id: "counter", label: "counter", sub: "consumer", x: 770, y: 288, w: 142 },
  { id: "notifier", label: "notifier", sub: "consumer", x: 770, y: 408, w: 142 },
  { id: "connect", label: "Kafka Connect", sub: "sink", x: 770, y: 528, w: 150 },
  { id: "push", label: "FCM · in-app", sub: "realtime", x: 940, y: 408, w: 120 },
  { id: "cass", label: "Cassandra", sub: "→ Spark", x: 940, y: 528, w: 120 },
  { id: "recon", label: "reconcile", sub: "job", x: 940, y: 190, w: 120 },
];
const SIM_H = 580;
const CONSUMER_NODES = new Set(["counter", "notifier", "connect"]);
const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));

const NODE_LAYOUT = {
  padX: 16,
  padTop: 12,
  titleY: 26,
  subY: 42,
  subToMetrics: 12,
  metricRow: 18,
  padBottom: 14,
  standardH: 54,
};

function consumerHud(
  id: string,
  likePending: number,
  exposureBuffer: number,
  flushLeftMs: number | null
): {
  h: number;
  sub: string;
  metricsY: number;
  metrics: { label: string; value: string; tone: "plasma" | "nebula" | "solar" }[];
} | null {
  if (!CONSUMER_NODES.has(id)) return null;
  const timer =
    likePending > 0 && flushLeftMs !== null ? `${(flushLeftMs / 1000).toFixed(1)}s` : null;
  const metrics: { label: string; value: string; tone: "plasma" | "nebula" | "solar" }[] = [
    { label: "♥ buf", value: String(likePending), tone: "plasma" },
  ];
  if (id === "counter") metrics.push({ label: "◉ buf", value: `${exposureBuffer}/4`, tone: "nebula" });
  if (timer) metrics.push({ label: "flush", value: timer, tone: "solar" });
  const metricsY = NODE_LAYOUT.subY + NODE_LAYOUT.subToMetrics;
  const h = metricsY + metrics.length * NODE_LAYOUT.metricRow + NODE_LAYOUT.padBottom;
  return { h, sub: "consumer", metricsY, metrics };
}

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
const LIKE_FLUSH_MS = 2600;

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
  const [stats, setStats] = useState({ rows: 128, counter: 128, cache: 128, buffer: 0, likePending: 0, impressions: 2040 });
  const statsRef = useRef(stats);
  statsRef.current = stats;
  const [logs, setLogs] = useState<Log[]>([]);
  const likeBatch = useRef({ counter: 0, notifier: 0, sink: 0 });
  const likeFlushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const likeFlushing = useRef(false);
  const flushLikeBatchRef = useRef<() => Promise<void>>(async () => {});
  const [likeFlushEndsAt, setLikeFlushEndsAt] = useState<number | null>(null);
  const [flushLeftMs, setFlushLeftMs] = useState<number | null>(null);

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
      if (likeFlushTimer.current) clearTimeout(likeFlushTimer.current);
    };
  }, []);

  useEffect(() => {
    if (likeFlushEndsAt === null) {
      setFlushLeftMs(null);
      return;
    }
    let frame = 0;
    const tick = () => {
      const left = Math.max(0, likeFlushEndsAt - performance.now());
      setFlushLeftMs(left);
      if (left > 0 && alive.current) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [likeFlushEndsAt]);

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

  const scheduleLikeFlush = useCallback(() => {
    if (likeFlushTimer.current) return;
    setLikeFlushEndsAt(performance.now() + LIKE_FLUSH_MS);
    likeFlushTimer.current = setTimeout(() => {
      void flushLikeBatchRef.current();
    }, LIKE_FLUSH_MS);
  }, []);

  const flushLikeBatch = useCallback(async () => {
    likeFlushTimer.current = null;
    const n = likeBatch.current.counter;
    if (n === 0 || likeFlushing.current) return;

    likeFlushing.current = true;
    likeBatch.current = { counter: 0, notifier: 0, sink: 0 };
    patch({ likePending: 0 });
    setLikeFlushEndsAt(null);

    log(`consumer window closed · flushing batch of ${n} like(s)`, "info");

    await Promise.all([
      (async () => {
        await route(["counter>pg"], COLORS.like);
        const next = statsRef.current.counter + n;
        patch({ counter: next });
        log(`counter += ${n} with watermark in the same txn · replay-safe`, "ok");
        if (downRef.current.redis) {
          await hop("counter>redis", COLORS.like, true);
          log("redis down: overlay compensation skipped, TTL is the backstop", "warn");
        } else {
          await hop("counter>redis", COLORS.like);
          patch({ cache: next });
          log("redis overlay compensated after batch commit", "info");
        }
      })(),
      (async () => {
        await route(["notifier>push"], COLORS.like);
        log(`notifier → ${n} push(es) to author (quiet hours respected)`, "info");
      })(),
      route(["connect>cass"], COLORS.like).then((ok) => {
        if (ok) log(`connect sink · ${n} engagement row(s) landed in Cassandra`, "info");
      }),
    ]);

    likeFlushing.current = false;
    if (likeBatch.current.counter > 0) scheduleLikeFlush();
  }, [hop, log, route, scheduleLikeFlush]);

  flushLikeBatchRef.current = flushLikeBatch;

  const like = async () => {
    log("POST /posts/4821/like", "info");
    await route(["client>nginx", "nginx>api"], COLORS.like);

    const [pgOk, kafkaOk] = await Promise.all([
      route(["api>pgb", "pgb>pg"], COLORS.like),
      downRef.current.kafka ? hop("api>kafka", COLORS.like, true).then(() => false) : hop("api>kafka", COLORS.like),
    ]);

    if (pgOk) {
      patch({ rows: statsRef.current.rows + 1 });
      log("like row committed in PostgreSQL · 201 sent (parallel with broker emit)", "ok");
    }

    if (!kafkaOk) {
      log("broker unreachable: row committed, counter/notifier/sink will catch up on replay", "warn");
      return;
    }

    await Promise.all([hop("kafka>counter", COLORS.like), hop("kafka>notifier", COLORS.like), hop("kafka>connect", COLORS.like)]);

    likeBatch.current = {
      counter: likeBatch.current.counter + 1,
      notifier: likeBatch.current.notifier + 1,
      sink: likeBatch.current.sink + 1,
    };
    patch({ likePending: likeBatch.current.counter });
    log(
      `counter · notifier · sink buffering ${likeBatch.current.counter} in-window · flush in ≤${LIKE_FLUSH_MS}ms`,
      "info"
    );
    scheduleLikeFlush();
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
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rim px-4 py-3.5 md:px-6">
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
          <div data-lenis-prevent-touch className="no-scrollbar overflow-x-auto p-4 md:p-5">
            <svg viewBox={`0 0 1010 ${SIM_H}`} className="block w-full min-w-[760px]" role="img" aria-label="Stooky architecture: client to Nginx to API; API writes PostgreSQL through PgBouncer, uses Redis as an overlay, and emits events to Kafka consumed by counter, notifier and Kafka Connect.">
              <defs>
                <pattern id="sim-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="0.8" fill="#232a4d" />
                </pattern>
              </defs>
              <rect width="1010" height={SIM_H} fill="url(#sim-grid)" />
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
                const hud = consumerHud(n.id, stats.likePending, stats.buffer, flushLeftMs);
                const boxH = hud?.h ?? NODE_LAYOUT.standardH;
                const batching = hud && (stats.likePending > 0 || (n.id === "counter" && stats.buffer > 0));
                const metricTone = { plasma: "fill-plasma", nebula: "fill-nebula", solar: "fill-solar" } as const;
                const { padX, titleY, subY } = NODE_LAYOUT;
                return (
                  <g
                    key={n.id}
                    ref={(el) => {
                      if (el) nodes.current.set(n.id, el);
                    }}
                    className={clsx(
                      "sim-node",
                      dead && "sim-node-dead",
                      n.id === "pg" && "sim-node-truth",
                      batching && "sim-node-batching"
                    )}
                    transform={`translate(${n.x - w / 2},${n.y - boxH / 2})`}
                  >
                    <rect width={w} height={boxH} rx="10" />
                    <text x={w / 2} y={titleY} textAnchor="middle" className="fill-star font-display text-[14px] font-bold">
                      {n.label}
                    </text>
                    <text x={w / 2} y={subY} textAnchor="middle" className={clsx("font-mono text-[9px] uppercase tracking-wider", dead ? "fill-alert" : "fill-mute")}>
                      {dead ? "offline" : hud?.sub ?? n.sub}
                    </text>
                    {hud && (
                      <line
                        x1={padX}
                        y1={hud.metricsY - 6}
                        x2={w - padX}
                        y2={hud.metricsY - 6}
                        className="sim-node-divider"
                      />
                    )}
                    {hud?.metrics.map((m, i) => (
                      <g key={m.label}>
                        <text
                          x={padX}
                          y={hud.metricsY + i * NODE_LAYOUT.metricRow + 12}
                          className="font-mono text-[8.5px] uppercase tracking-wide fill-mute"
                        >
                          {m.label}
                        </text>
                        <text
                          x={w - padX}
                          y={hud.metricsY + i * NODE_LAYOUT.metricRow + 12}
                          textAnchor="end"
                          className={clsx("font-mono text-[10px] tabular-nums", metricTone[m.tone])}
                        >
                          {m.value}
                        </text>
                      </g>
                    ))}
                  </g>
                );
              })}
            </svg>
          </div>
          <p className="pointer-events-none absolute bottom-2 right-3 font-mono text-[9px] uppercase tracking-widest text-mute sm:hidden">swipe ⇆</p>
        </div>

        <aside className="flex flex-col gap-5 border-t border-rim p-4 md:p-5 lg:gap-6 lg:border-l lg:border-t-0 lg:p-6">
          <div className="grid grid-cols-3 gap-2.5 lg:grid-cols-1 lg:gap-2">
            <button onClick={like} data-cursor="send" className="rounded-lg border border-plasma/40 bg-plasma/10 px-3.5 py-3 text-left font-mono text-[11px] uppercase tracking-wider text-plasma transition-colors hover:bg-plasma/20">
              ♥ like <span className="hidden text-plasma/60 lg:inline">· engagement</span>
            </button>
            <button onClick={impression} data-cursor="send" className="rounded-lg border border-nebula/50 bg-nebula/10 px-3.5 py-3 text-left font-mono text-[11px] uppercase tracking-wider text-nebula transition-colors hover:bg-nebula/20">
              ◉ impression <span className="hidden text-nebula/60 lg:inline">· exposure</span>
            </button>
            <button onClick={read} data-cursor="send" className="rounded-lg border border-solar/40 bg-solar/10 px-3.5 py-3 text-left font-mono text-[11px] uppercase tracking-wider text-solar transition-colors hover:bg-solar/20">
              ⌕ read <span className="hidden text-solar/60 lg:inline">· profile</span>
            </button>
          </div>

          <dl className="grid grid-cols-2 gap-2 font-mono text-[10px] uppercase tracking-wider">
            {[
              ["like rows", stats.rows, "text-star"],
              ["pg counter", `${stats.counter}${stats.likePending ? ` +${stats.likePending}` : ""}`, stale ? "text-solar" : "text-go"],
              ["redis overlay", stats.cache, stats.cache !== stats.rows ? "text-solar" : "text-go"],
              ["impressions", `${stats.impressions}${stats.buffer ? ` +${stats.buffer}` : ""}`, "text-nebula"],
            ].map(([k, v, c]) => (
              <div key={k as string} className="rounded-lg border border-rim bg-void/80 px-3.5 py-2.5">
                <dt className="text-mute">{k}</dt>
                <dd className={clsx("mt-1 text-sm", c as string)}>{v}</dd>
              </div>
            ))}
          </dl>

          <button
            onClick={reconcile}
            className={clsx(
              "rounded-lg border px-3.5 py-2.5 font-mono text-[11px] uppercase tracking-wider transition-colors",
              stale ? "border-go/60 bg-go/10 text-go" : "border-rim text-mute hover:text-haze"
            )}
          >
            ↻ run reconciliation {stale && "· counters stale"}
          </button>

          <ol aria-live="polite" className="min-h-[150px] space-y-2 rounded-lg border border-rim bg-void/40 p-3.5 font-mono text-[10.5px] leading-relaxed">
            {logs.map((l) => (
              <li key={l.id} className="flex gap-2.5">
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
