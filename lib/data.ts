// Mission manifest — every word on the site is sourced from Reenav's engineering context document.
// Accuracy rules: no invented team sizes, traffic, latency or impact numbers; ownership verbs are deliberate.

export const profile = {
  name: "Reenav Hemaria",
  first: "Reenav",
  last: "Hemaria",
  callsign: "RH-01",
  role: "Backend-heavy Product Engineer",
  github: "https://github.com/Rhemaria01",
  githubUser: "Rhemaria01",
  // Fill these in before going live — the contact section only renders channels that are set.
  email: "reenavhemaria789@gmail.com",
  linkedin: "https://www.linkedin.com/in/reenav-hemaria/",
  resume: "/Reenav-Hemaria-Resume.pdf",
  firstLaunch: "2023-06-01T00:00:00+05:30",
  tagline:
    "I design the data model, the request path, and what the system does when half its dependencies go dark.",
  summary:
    "I started in frontend, grew into full-stack product work, and now spend most of my time underneath the product: schemas, event buses, caches, search infrastructure, deployment, and the operator tools that keep it all observable.",
};

export const sections = [
  { id: "launch", label: "Launch", code: "00" },
  { id: "origin", label: "Origin", code: "01" },
  { id: "trajectory", label: "Trajectory", code: "02" },
  { id: "missions", label: "Missions", code: "03" },
  { id: "fleet", label: "Fleet", code: "04" },
  { id: "rules", label: "Flight Rules", code: "05" },
  { id: "deep-field", label: "Deep Field", code: "06" },
  { id: "star-chart", label: "Star Chart", code: "07" },
  { id: "ground", label: "Ground Control", code: "08" },
  { id: "transmit", label: "Transmit", code: "09" },
] as const;

export const owns = [
  { k: "Data model", d: "Schemas, constraints and migrations that keep the product honest." },
  { k: "Request path", d: "What runs synchronously, what gets cached, what can wait." },
  { k: "Async processing", d: "Event buses, consumers, batching, offsets and replay." },
  { k: "Failure behavior", d: "How the system holds up under fan-out or a dependency outage." },
];

export const orbits = [
  {
    ring: "Inner orbit",
    era: "2019 — 2023",
    title: "Frontend",
    tech: ["React", "Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "Vite", "Firebase"],
    note: "College builds, a frontend internship and agency web work. Interfaces first.",
  },
  {
    ring: "Middle orbit",
    era: "2023 — 2025",
    title: "Full-stack product",
    tech: ["Express", "Django", "Prisma", "MongoDB", "tRPC", "TanStack Query", "Zustand", "Electron"],
    note: "Led end-to-end SaaS builds at Code Rustlers: AI email, CMS, chat and client web products.",
  },
  {
    ring: "Outer orbit",
    era: "2025 → now",
    title: "Backend systems",
    tech: ["NestJS", "PostgreSQL", "PgBouncer", "Redis", "Kafka", "Cassandra", "Weaviate", "Docker"],
    note: "Event-driven architecture, retrieval infrastructure and data modeling at Stuvio.",
  },
];

export type Role = {
  company: string;
  title: string;
  period: string;
  kind: string;
  summary: string;
  points: string[];
  tags: string[];
};

export const roles: Role[] = [
  {
    company: "Stuvio",
    title: "Full Stack Developer",
    period: "Aug 2025 — Present",
    kind: "Full-time · backend-heavy",
    summary:
      "Building production systems across six products: Brello, JamJam, Juugo, Senwitt, Taara and Stooky. The title says full stack; the work is mostly underneath the product.",
    points: [
      "Designed Stooky's event bus, cache and data responsibilities, and runtime architecture, then built product features on top of it and led the operator dashboard.",
      "Designed and repeatedly rebuilt Juugo's retrieval system, taking it from scrape-on-query to Weaviate with a separately deployed query-understanding service.",
      "Designed JamJam's data model and built the API around it.",
      "Stood up Taara's API and deployment foundation, led the Senwitt NestJS API, and led the Brello Expo client.",
    ],
    tags: ["NestJS", "PostgreSQL", "Redis", "Kafka", "Weaviate", "Docker"],
  },
  {
    company: "Code Rustlers",
    title: "Full-stack Developer",
    period: "Jan 2025 — Aug 2025",
    kind: "Promoted",
    summary:
      "Took SaaS products from first commit to delivery, owning both ends of the stack.",
    points: [
      "Led end-to-end development of 3+ SaaS products.",
      "That work contributed to 30% higher client satisfaction, 25% faster delivery, 20% fewer support queries and 15% improved uptime.",
    ],
    tags: ["Next.js", "TypeScript", "Prisma", "TanStack Query", "Google APIs"],
  },
  {
    company: "Code Rustlers",
    title: "Web Developer",
    period: "Aug 2023 — Dec 2024",
    kind: "First full-time role",
    summary:
      "Shipped in-house products at Code Rustlers (Crispy Mail, Bytereels, Chatboat) and delivered sites for clients.",
    points: [
      "Contributed teams support and a Docker node loader to FlexiBuckets (my open-source project); merged upstream.",
      "Built a CMS-powered fabric showcase for Vandana Fabrics (my client) that increased signups by 30% in its first month.",
    ],
    tags: ["Next.js", "React", "Tailwind CSS", "shadcn/ui", "Zustand"],
  },
  {
    company: "The Devisers",
    title: "Frontend Developer Intern",
    period: "Jun 2023",
    kind: "One month",
    summary: "First professional launch: shipping frontend code in a working team.",
    points: [],
    tags: ["React", "JavaScript", "CSS"],
  },
];

/* ───────────── Primary missions ───────────── */

export const stooky = {
  name: "Stooky",
  designation: "MISSION 01",
  kind: "Social product · event-driven backend",
  url: "https://stooky.space",
  lede:
    "My strongest system-design work. I designed the runtime shape of the system (which store owns what, how events flow, and what still works when a piece fails), then built product features on top of it.",
  decisions: [
    { t: "PostgreSQL is the source of truth", d: "Connections go through PgBouncer with transaction pooling." },
    { t: "Redis is an overlay, not an authority", d: "It holds the profile cache, feed and Explore snapshots, suspension state and hot counters. A Redis miss or outage never fails a write that has already committed." },
    { t: "Kafka is the behavior bus", d: "Likes, impressions, watches, follows, searches and session events are emitted asynchronously, so the API never waits on the broker." },
    { t: "Exposure is separated from engagement", d: "Impressions, watches, skips and hides are much hotter traffic, so they get their own lag budget." },
    { t: "Effectively-once counters", d: "The counter consumer aggregates batches and stores its watermark in the same PostgreSQL transaction as the counter update, so a replay after a crash doesn't double-count." },
    { t: "Compensate after commit", d: "Redis is patched after the database commits, with overlay TTLs as the backstop." },
    { t: "Kafka down ≠ API down", d: "The API keeps serving. Counters may go stale until a reconciliation job repairs them." },
  ],
  roles: ["api", "realtime", "worker", "video", "counter", "notifier"],
  features: [
    "Ranked feed hydrated from snapshots and rank stats, with a caught-up state and recycled posts",
    "Redis-backed user suspension, plus privacy rules for seeded engagement on private accounts",
    "FCM push for comments, mentions, DMs and sign-in security alerts",
    "Broadcast campaigns with banner images and a live campaign socket",
    "Apple sign-in redirect into the app",
    "Cloudflare R2 for media",
    "PostgreSQL backup and restore",
    "Platform kill switches for voice and video",
  ],
  dashboard:
    "Led the Next.js operator dashboard: live VPS and database health over a socket, broadcast controls, a Content Security Policy, and an Authelia-protected login.",
  deploy: "Staging and production run on a VPS with Docker and Nginx.",
  stack: ["NestJS", "Prisma", "PostgreSQL", "PgBouncer", "Redis", "Kafka", "Kafka Connect", "Cassandra", "Spark", "FCM", "Authelia", "Cloudflare R2", "Docker", "Next.js", "Nginx"],
};

export const juugo = {
  name: "Juugo",
  designation: "MISSION 02",
  kind: "Commerce search & retrieval",
  lede:
    "I owned the retrieval system and replaced it several times as quality and workload needs changed. What matters here is the sequence of rebuilds and the decision to drop an approach once it stopped working.",
  stages: [
    {
      n: "S1",
      title: "Scrape on query",
      body: "The first version fetched products when a search came in. It was simple and proved the product idea.",
      tech: ["NestJS", "Scrapers"],
      jettison: "Live fetching couldn't support ranking, filtering or consistent quality.",
    },
    {
      n: "S2",
      title: "Intent search + hybrid ranking",
      body: "Product taxonomy in PostgreSQL, embeddings, generated TSV data with a GIN index, guest access, and chat cursor/state for conversational search.",
      tech: ["PostgreSQL", "Embeddings", "GIN / TSV", "Prisma"],
      jettison: "The catalogue needed to be ingested ahead of time, not fetched on demand.",
    },
    {
      n: "S3",
      title: "Distributed ingestion",
      body: "Brand scrapers and detail-page workers for Myntra, Superdry, Satya Paul, Burberry, Marks & Spencer, Tommy, Puma and Meesho. A Python Playwright stealth fetcher handled sites that blocked plain HTTP.",
      tech: ["BullMQ", "Playwright", "Python"],
      jettison: "BullMQ was later removed from the API once it was no longer the right queue.",
    },
    {
      n: "S4",
      title: "Weaviate retrieval",
      body: "Moved retrieval to Weaviate: index setup, synchronization, dumps, production API-key auth and metadata backfill.",
      tech: ["Weaviate", "Docker"],
      jettison: null,
    },
    {
      n: "S5",
      title: "Query understanding service",
      body: "A separate, independently deployed Python service handles occasion parsing and LLM query understanding. It applies an ontology, a style-phrase whitelist and exclusion filters, infers gender from relationships mentioned in the query, and reads conversation history.",
      tech: ["Python", "Gemini", "Groq", "Ontology"],
      jettison: null,
    },
  ],
  sampleQuery: "something elegant for my sister's sangeet, nothing too shiny",
  parse: [
    { k: "occasion", v: "sangeet", via: "occasion parser" },
    { k: "gender", v: "women", via: "inferred from “sister”" },
    { k: "style", v: "elegant", via: "style-phrase whitelist" },
    { k: "exclude", v: "shiny / metallic", via: "exclusion filter" },
    { k: "context", v: "previous turns", via: "conversation history" },
  ],
  bench:
    "Also built the benchmarking around it: an internal UI with message logs and a backend-environment toggle, a separate benchmark database, results stored as product IDs, and timings split into embedding, database, ranking and end-to-end latency.",
  embed:
    "In a related semantic-search service, migrated Gemini embedding output from 1536 to 768 dimensions to match the pgvector schema. That kept the embedding service and the vector storage in sync.",
  stack: ["NestJS", "Prisma", "PostgreSQL", "Weaviate", "Playwright", "Python", "Gemini", "Groq", "Docker"],
};

export type Entity = { id: string; label: string; x: number; y: number; notes: string[]; store?: "pg" | "redis" | "cassandra" };

export const jamjam = {
  name: "JamJam",
  designation: "MISSION 03",
  kind: "Community platform · data-model design",
  lede:
    "My strongest schema-design work. I designed the data model first and built the API around it. Every star in this chart is an entity, and every line is a relation.",
  entities: [
    { id: "user", label: "User", x: 50, y: 46, store: "pg", notes: ["Hashed sensitive fields", "Masked read model", "KYC status", "OTP email verification", "Encrypted phone numbers"] },
    { id: "session", label: "Session", x: 22, y: 70, store: "redis", notes: ["Redis-backed sessions", "Interceptor rejects inactive accounts"] },
    { id: "community", label: "Community", x: 74, y: 18, store: "pg", notes: ["Ownership transfer", "Discovery feed source"] },
    { id: "membership", label: "Membership", x: 66, y: 34, store: "pg", notes: ["User ↔ community join", "Drives the personal feed"] },
    { id: "ban", label: "Ban", x: 90, y: 30, store: "pg", notes: ["Community-scoped bans"] },
    { id: "invite", label: "InviteLink", x: 90, y: 8, store: "pg", notes: ["Invite links into communities"] },
    { id: "post", label: "Post", x: 40, y: 18, store: "pg", notes: ["Personal and discovery feeds", "Reusable cross-service pagination"] },
    { id: "draft", label: "Draft", x: 18, y: 10, store: "pg", notes: ["Unpublished posts"] },
    { id: "poll", label: "Poll", x: 24, y: 30, store: "pg", notes: ["Poll posts and options"] },
    { id: "comment", label: "Comment", x: 58, y: 6, store: "pg", notes: ["Threaded on posts"] },
    { id: "vote", label: "Vote", x: 8, y: 46, store: "pg", notes: ["Votes on posts and comments"] },
    { id: "reaction", label: "Reaction", x: 30, y: 52, store: "pg", notes: ["Reactions on posts"] },
    { id: "moderation", label: "ModerationLog", x: 78, y: 62, store: "pg", notes: ["Worker-based content moderation", "Decisions logged in the database"] },
    { id: "username", label: "UsernameCheck", x: 94, y: 78, store: "cassandra", notes: ["Cassandra path for username moderation"] },
    { id: "notification", label: "Notification", x: 50, y: 78, store: "pg", notes: ["Collapse IDs fold a burst into one logical row", "Milestone counts"] },
    { id: "prefs", label: "NotifPrefs", x: 30, y: 92, store: "pg", notes: ["Per-user notification preferences"] },
    { id: "media", label: "Media", x: 66, y: 92, store: "pg", notes: ["Attached media"] },
  ] as Entity[],
  links: [
    ["user", "session"], ["user", "membership"], ["membership", "community"], ["community", "ban"], ["community", "invite"],
    ["user", "post"], ["post", "community"], ["post", "comment"], ["post", "poll"], ["user", "draft"], ["draft", "post"],
    ["vote", "post"], ["vote", "user"], ["reaction", "post"], ["reaction", "user"], ["post", "moderation"], ["moderation", "username"],
    ["user", "notification"], ["notification", "prefs"], ["notification", "media"], ["post", "media"], ["ban", "user"],
  ] as [string, string][],
  extras: [
    "Reusable pagination as one consistent pattern across services, not reimplemented per endpoint",
    "Production seeding, plus a clean Prisma migration history once the model stabilized",
    "Started with BullMQ + Redis for aggregation; later designs moved high-volume accumulation and fan-out toward Kafka",
  ],
  stack: ["NestJS", "Prisma", "PostgreSQL", "Redis", "Cassandra", "React Native (client slice)"],
};

/* ───────────── Fleet: supporting missions ───────────── */

export const fleet = [
  {
    name: "Taara",
    kind: "Astrology product API",
    role: "Stood up the API & deployment",
    points: [
      "NestJS, Prisma, Docker and VPS setup from scratch",
      "Birth profiles with nested birth-place data and a real foreign key",
      "Daily Aaj and Panchang responses cached in Redis and PostgreSQL, invalidated when a profile changes",
      "Chat history with summarized conversation context",
      "RevenueCat billing with a virtual currency, plus Google and Apple sign-in",
    ],
    stack: ["NestJS", "Prisma", "PostgreSQL", "Redis", "Docker", "RevenueCat"],
    hue: "amber",
  },
  {
    name: "Senwitt",
    kind: "Learning / gamification backend",
    role: "Led the NestJS API · built a slice of the Expo app",
    points: [
      "Soft-deleted users, partial unique indexes and obfuscated fields",
      "Google and Apple token checks; OTP reset with Redis rate limits",
      "Guest stats merged into authenticated accounts",
      "Quests, achievements, streaks, friends, invite codes, season badges, a cohort leaderboard, and lazy energy regeneration",
      "Replaced a separate profile table with a subscription model, and a generic session table with exercise sessions",
      "My part of the shared Expo app: session experience, domain scores, share cards, journey sync, Clarity telemetry and an iOS lockdown crash patch",
    ],
    stack: ["NestJS", "Prisma", "PostgreSQL", "Redis", "Expo"],
    hue: "cyan",
  },
  {
    name: "Brello",
    kind: "AI chat experience",
    role: "Led the Expo client · built the web chat surface",
    points: [
      "Expo client: auth, streaming transcript, Markdown, image search, PDF export, themes, and finance and weather dashboards",
      "The hard part: keeping scroll and keyboard behavior right while a response is still streaming in",
      "Web (Next.js): Mermaid diagrams, YouTube embeds, image captions, abort/regenerate, and history that survives a refresh",
      "Mobile textarea behavior and auth middleware",
    ],
    stack: ["Next.js", "Expo", "Streaming Markdown"],
    hue: "violet",
  },
];

/* ───────────── Flight rules ───────────── */

export const flightRules = [
  { t: "Start from the data model and the request path.", d: "Before anything else: where the data lives, who owns it, and what has to happen before the response goes back." },
  { t: "Make source-of-truth ownership explicit.", d: "PostgreSQL owns transactional state. Everything else is derived, cached or eventually consistent, and documented as such." },
  { t: "Redis is for speed, never for authority.", d: "Caches are designed with invalidation and compensation in mind. TTLs are the backstop, not the plan." },
  { t: "Get noncritical work off the request path.", d: "Emit the event, return the response. Consumers handle the rest at their own pace." },
  { t: "Separate traffic classes by volume and latency.", d: "Hot exposure events don't share a lag budget with engagement events." },
  { t: "Consumers must be safe to replay.", d: "Transactional persistence, offsets committed after success, and reconciliation for whatever drifts." },
  { t: "Batch high-frequency writes.", d: "Aggregate in memory, write once, and keep pressure off the primary." },
  { t: "Let constraints enforce correctness.", d: "Foreign keys, partial unique indexes and real relations are part of the application logic." },
  { t: "No distributed infrastructure without a workload reason.", d: "Kafka gets added when the event volume calls for it, not because it looks good on a resume." },
  { t: "Measure, don't invent.", d: "Instrument the search path end to end before claiming anything got faster." },
  { t: "Production readiness includes the boring parts.", d: "Deployment, backup and restore, health monitoring and operator tooling all count." },
  { t: "Prefer designs that can evolve.", d: "Juugo's retrieval went through five stages because each one left room for the next." },
];

/* ───────────── Deep field: earlier & side projects ───────────── */

export type ArchiveItem = {
  name: string;
  year: string;
  group: "agency" | "college" | "side" | "oss" | "client";
  blurb: string;
  stack: string[];
  outcome?: string;
  links?: { label: string; href: string }[];
};

export const archive: ArchiveItem[] = [
  {
    name: "FlexiBuckets",
    year: "2024",
    group: "oss",
    blurb: "My open-source, self-hosted app for managing several S3-compatible buckets from one interface, with granular-permission file sharing.",
    outcome: "Supports files up to 15 GB",
    stack: ["Next.js", "TanStack Query", "Zustand", "shadcn/ui", "TypeScript"],
    links: [
      { label: "GitHub", href: "https://github.com/flexibuckets/flexibuckets" },
      { label: "Site", href: "https://flexibuckets.thebrainfry.com/" },
    ],
  },
  {
    name: "Crispy Mail",
    year: "2024",
    group: "agency",
    blurb: "AI Gmail assistant that labels low-priority mail, condenses newsletters into a daily TL;DR, and drafts replies from custom inbox rules.",
    outcome: "Designed to process 100+ emails a day",
    stack: ["Next.js", "Google APIs", "Composio", "TanStack Query"],
  },
  {
    name: "Vandana Fabrics",
    year: "2024",
    group: "client",
    blurb: "Client site: CMS-powered fabric showcase with NextAuth sign-in.",
    outcome: "+30% signups in the first month",
    stack: ["Next.js", "Prisma", "NextAuth", "Tailwind CSS"],
    links: [{ label: "Site", href: "https://www.vandanafabrics.com" }],
  },
  {
    name: "Bytereels",
    year: "2024",
    group: "agency",
    blurb: "AI-powered video platform for content creation.",
    outcome: "40% less content-creation time",
    stack: ["AI", "Video"],
  },
  {
    name: "Chatboat",
    year: "2024",
    group: "agency",
    blurb: "OpenAI-integrated support chatbot.",
    outcome: "Handled 70% of repetitive queries",
    stack: ["OpenAI"],
  },
  {
    name: "Digicrowd",
    year: "2022–23",
    group: "college",
    blurb: "Decentralized crowdfunding on Ethereum, which became a Springer-published research paper.",
    stack: ["React", "Vite", "Solidity", "Thirdweb", "IPFS", "Ganache"],
    links: [{ label: "GitHub", href: "https://github.com/Rhemaria01/DigicrowdVite" }],
  },
  {
    name: "Movie Recommender",
    year: "2022",
    group: "college",
    blurb: "Personalized movie suggestions from preferences and viewing history, with a model served by a Flask backend.",
    stack: ["React", "Python", "Flask", "Jupyter"],
    links: [
      { label: "GitHub", href: "https://github.com/Rhemaria01/MRS" },
      { label: "Demo", href: "https://moviesonthego.netlify.app/" },
    ],
  },
  {
    name: "Async Tic-Tac-Toe",
    year: "2022–23",
    group: "college",
    blurb: "Asynchronous multiplayer game with real-time updates and authentication.",
    stack: ["React", "Firestore", "Realtime DB", "Firebase Auth"],
  },
  {
    name: "Farm Fresh",
    year: "2021",
    group: "college",
    blurb: "Portal connecting farmers directly with consumers, without intermediaries.",
    stack: ["React", "Firebase"],
  },
  {
    name: "PDFMate",
    year: "—",
    group: "side",
    blurb: "Chat over your uploaded PDFs. One of the largest of the early projects.",
    stack: ["LLM", "PDF"],
  },
  {
    name: "Orbi",
    year: "—",
    group: "side",
    blurb: "Small React Native number-puzzle game with levels, mastery, a store and board animations.",
    stack: ["React Native"],
  },
  {
    name: "Meesho Scraper",
    year: "—",
    group: "side",
    blurb: "Scraper that writes JSON and SQLite and saves its progress to disk so it can resume.",
    stack: ["Python", "SQLite"],
  },
  {
    name: "Sudoken",
    year: "—",
    group: "side",
    blurb: "Sudoku board, difficulty selector and sign-in, added inside an existing Next.js app.",
    stack: ["Next.js"],
  },
  {
    name: "Pipecat fork",
    year: "—",
    group: "side",
    blurb: "Private fork connected to my own backend; nothing merged upstream.",
    stack: ["Python"],
  },
];

export const archiveGroups = [
  { id: "all", label: "All signals" },
  { id: "oss", label: "Open source" },
  { id: "client", label: "Clients" },
  { id: "agency", label: "Code Rustlers" },
  { id: "college", label: "College" },
  { id: "side", label: "Side quests" },
] as const;

/* ───────────── Star chart ───────────── */

export const constellations = [
  { name: "Data", stars: ["PostgreSQL", "PgBouncer", "Prisma", "Redis", "Cassandra", "pgvector", "MongoDB", "SQLite", "Firebase"] },
  { name: "Distributed", stars: ["Kafka", "Kafka Connect", "Spark", "BullMQ", "WebSockets"] },
  { name: "Backend", stars: ["NestJS", "Node.js", "Express", "Python", "Django", "Flask", "tRPC", "JWT"] },
  { name: "Search & AI", stars: ["Weaviate", "Embeddings", "Gemini", "Groq", "Playwright", "Composio"] },
  { name: "Infra", stars: ["Docker", "Nginx", "VPS", "Cloudflare R2", "Authelia", "FCM", "RevenueCat"] },
  { name: "Frontend", stars: ["TypeScript", "React", "Next.js", "Expo", "React Native", "TanStack Query", "Zustand", "Tailwind CSS", "Electron"] },
];

// Which missions each star shows up in — powers the star-chart hover.
export const starUsage: Record<string, string[]> = {
  PostgreSQL: ["Stooky", "Juugo", "JamJam", "Taara", "Senwitt"],
  PgBouncer: ["Stooky"],
  Prisma: ["Stooky", "Juugo", "JamJam", "Taara", "Senwitt", "Vandana Fabrics"],
  Redis: ["Stooky", "JamJam", "Taara", "Senwitt"],
  Cassandra: ["Stooky", "JamJam"],
  pgvector: ["Semantic search"],
  SQLite: ["Meesho Scraper"],
  Firebase: ["Tic-Tac-Toe", "Farm Fresh"],
  Kafka: ["Stooky"],
  "Kafka Connect": ["Stooky"],
  Spark: ["Stooky"],
  BullMQ: ["Juugo", "JamJam"],
  WebSockets: ["Stooky"],
  NestJS: ["Stooky", "Juugo", "JamJam", "Taara", "Senwitt"],
  Python: ["Juugo", "Movie Recommender"],
  Flask: ["Movie Recommender"],
  Weaviate: ["Juugo"],
  Embeddings: ["Juugo"],
  Gemini: ["Juugo"],
  Groq: ["Juugo"],
  Playwright: ["Juugo"],
  Composio: ["Crispy Mail"],
  Docker: ["Stooky", "Juugo", "Taara"],
  Nginx: ["Stooky"],
  VPS: ["Stooky", "Taara"],
  "Cloudflare R2": ["Stooky"],
  Authelia: ["Stooky"],
  FCM: ["Stooky"],
  RevenueCat: ["Taara"],
  "Next.js": ["Stooky dashboard", "Brello", "FlexiBuckets", "Crispy Mail"],
  Expo: ["Brello", "Senwitt"],
  "React Native": ["JamJam", "Orbi"],
  "TanStack Query": ["FlexiBuckets", "Crispy Mail"],
  Zustand: ["FlexiBuckets"],
  React: ["Digicrowd", "Movie Recommender", "Farm Fresh"],
};

/* ───────────── Ground control ───────────── */

export const education = {
  degree: "B.E., Information Technology",
  school: "St. John College of Engineering and Management, Palghar",
  period: "2019 — 2023",
  score: "8.34",
};

export const paper = {
  title: "Blockchain Crowdfunding: A new Era in Democratizing Investment Opportunities",
  venue: "Springer",
  year: "2023",
};

export const logbook = [
  { y: "2022", t: "Smart India Hackathon", d: "Team of six; placed 10th within the college." },
  { y: "2021", t: "Quiz competition", d: "Second rank." },
  { y: "—", t: "IT Student Association", d: "Helped organize events, including the technical side of a national-level college fest." },
];

export const certifications = ["ReactJS with Firebase · LearnCodeOnline", "MongoDB with NodeJS · Verzeo", "Getting Started with Python"];
