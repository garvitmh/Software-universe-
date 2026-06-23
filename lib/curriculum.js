// The single source of truth for the whole site's structure.
// Powers the Codex sidebar (Google-Docs style) and the interactive Roadmap.
// `ready: true` = page exists and links; false = shown as "soon".

export const CODEX_PARTS = [
  {
    n: "01",
    group: "Foundations",
    chapters: [{ slug: "foundations", title: "How it all fits together", ready: true }],
  },
  {
    n: "02",
    group: "The thinking tools",
    chapters: [
      { slug: "layers-and-separation", title: "Layers & separation", ready: true },
      { slug: "state-management", title: "State — one source of truth", ready: true },
    ],
  },
  {
    n: "03",
    group: "The Flutter app",
    chapters: [{ slug: "flutter-app", title: "Your app, layer by layer", ready: true }],
  },
  {
    n: "04",
    group: "The backend",
    chapters: [{ slug: "backend", title: "The brain — routes, services, auth", ready: true }],
  },
  {
    n: "05",
    group: "The database",
    chapters: [{ slug: "database", title: "The memory — tables, money, transactions", ready: true }],
  },
  {
    n: "06",
    group: "The admin panel",
    chapters: [{ slug: "admin-panel", title: "The control room", ready: true }],
  },
  {
    n: "07",
    group: "Burger builder",
    chapters: [{ slug: "burger-builder", title: "The motion engine", ready: true }],
  },
  {
    n: "08",
    group: "Big systems",
    chapters: [{ slug: "big-systems", title: "Payments, orders, loyalty, delivery", ready: true }],
  },
  {
    n: "09",
    group: "Scale",
    chapters: [{ slug: "scale", title: "From 10 to a million users", ready: true }],
  },
  {
    n: "10",
    group: "Deployment & ops",
    chapters: [{ slug: "deployment", title: "Going live", ready: true }],
  },
];

// Encyclopedic, MDN/GeeksforGeeks-style deep reference on every technology and
// concept in the stack. Lives at /codex/tech/<slug>.
export const TECH_SECTIONS = [
  {
    id: "languages",
    label: "Languages & runtimes",
    items: [
      { slug: "dart", title: "Dart", ready: true, blurb: "The language your app is written in." },
      { slug: "typescript", title: "TypeScript", ready: true, blurb: "Typed JavaScript — the backend & admin." },
      { slug: "nodejs", title: "Node.js", ready: true, blurb: "What runs your backend JavaScript." },
    ],
  },
  {
    id: "app",
    label: "App & frontend",
    items: [
      { slug: "flutter", title: "Flutter", ready: true, blurb: "Draws every pixel of the app." },
      { slug: "riverpod", title: "Riverpod", ready: true, blurb: "How the app holds and shares state." },
      { slug: "dio", title: "Dio", ready: true, blurb: "The app's network client + interceptors." },
      { slug: "nextjs", title: "Next.js & React", ready: true, blurb: "The admin panel (and this site)." },
      { slug: "refine", title: "Refine", ready: true, blurb: "The admin's CRUD scaffolding." },
    ],
  },
  {
    id: "backend",
    label: "Backend & data",
    items: [
      { slug: "express", title: "Express", ready: true, blurb: "Routes, middleware, the request pipeline." },
      { slug: "prisma", title: "Prisma", ready: true, blurb: "The translator between code and the database." },
      { slug: "postgresql", title: "PostgreSQL", ready: true, blurb: "The relational database itself." },
      { slug: "sql", title: "SQL & indexes", ready: true, blurb: "How data is queried — and made fast." },
    ],
  },
  {
    id: "web",
    label: "The web in between",
    items: [
      { slug: "http-rest", title: "HTTP & REST", ready: true, blurb: "How the app and backend talk." },
      { slug: "json", title: "JSON", ready: true, blurb: "The shape data travels in." },
      { slug: "auth", title: "Auth — JWT, cookies, CSRF", ready: true, blurb: "Proving who you are, safely." },
      { slug: "realtime-sync", title: "Live sync (SSE)", ready: true, blurb: "How the admin's changes appear instantly." },
    ],
  },
  {
    id: "concepts",
    label: "Cross-cutting logic",
    items: [
      { slug: "idempotency", title: "Idempotency", ready: true, blurb: "Why a retry can't charge you twice." },
      { slug: "transactions", title: "Transactions & ACID", ready: true, blurb: "All-or-nothing writes." },
      { slug: "state-machines", title: "State machines", ready: true, blurb: "An order is always in one known state." },
      { slug: "ledgers", title: "Ledgers", ready: true, blurb: "Points & money done like a bank." },
      { slug: "caching", title: "Caching", ready: true, blurb: "Compute once, serve many." },
      { slug: "concurrency", title: "Concurrency & races", ready: true, blurb: "When two requests collide." },
    ],
  },
  {
    id: "wider-stack",
    label: "The wider stack",
    items: [
      { slug: "docker", title: "Docker & containers", ready: true, blurb: "One sealed box that runs anywhere." },
      { slug: "kubernetes", title: "Kubernetes", ready: true, blurb: "Run & heal many containers." },
      { slug: "ci-cd", title: "CI/CD", ready: true, blurb: "Test every change, ship it safely." },
      { slug: "observability", title: "Observability", ready: true, blurb: "Logs, metrics, traces — see it live." },
      { slug: "cloud", title: "The cloud", ready: true, blurb: "Rent computers, not own them." },
      { slug: "rendering", title: "Web rendering (CSR/SSR/SSG)", ready: true, blurb: "Where the page gets built." },
      { slug: "embeddings", title: "Embeddings & vector search", ready: true, blurb: "Search by meaning, not keywords." },
      { slug: "rag", title: "RAG — grounding an LLM", ready: true, blurb: "Answer from your own docs." },
    ],
  },
];

// Flat helpers
export function codexHref(slug) {
  return `/codex/${slug}`;
}
export function techHref(slug) {
  return `/codex/tech/${slug}`;
}

export const ALL_CODEX_CHAPTERS = CODEX_PARTS.flatMap((p) =>
  p.chapters.map((c) => ({ ...c, part: p.n, group: p.group, href: codexHref(c.slug) }))
);
export const ALL_TECH = TECH_SECTIONS.flatMap((s) =>
  s.items.map((c) => ({ ...c, section: s.label, sectionId: s.id, href: techHref(c.slug) }))
);
