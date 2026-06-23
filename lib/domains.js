// The curriculum grid — the spine of Software Universe.
//   Horizontal axis = DOMAINS (breadth: every field a software engineer touches)
//   Vertical axis   = DEPTH   (each topic climbs local → production → enterprise → MNC)
//
// `status: "live"` topics link to existing content; `"soon"` are planned cells
// on the map (honest about what's built vs coming). This single source feeds the
// /learn map, cross-links, and the AI assistant's topic context.

export const DEPTH_LADDER = [
  { id: "local", label: "Local", blurb: "One machine, one user — make it work." },
  { id: "prod", label: "Production", blurb: "Real users, real money — make it correct & safe." },
  { id: "enterprise", label: "Enterprise", blurb: "Many teams, many services — make it maintainable." },
  { id: "mnc", label: "Planet-scale", blurb: "Millions of users — make it survive anything." },
];

export const DOMAINS = [
  {
    id: "foundations",
    title: "Foundations",
    tint: "brand",
    tagline: "How any software system fits together — and the journey of a single request through it.",
    topics: [
      { t: "How it all fits together", href: "/codex/foundations", status: "live" },
      { t: "Layers & separation of concerns", href: "/codex/layers-and-separation", status: "live" },
      { t: "State — one source of truth", href: "/codex/state-management", status: "live" },
      { t: "The journey of a request (visual)", href: "/simulator/order-journey", status: "live" },
      { t: "The whole-system roadmap", href: "/roadmap", status: "live" },
    ],
  },
  {
    id: "mobile",
    title: "Mobile",
    tint: "purple",
    tagline: "Building the app the user actually taps — Flutter, Dart, state, and premium motion.",
    topics: [
      { t: "Your Flutter app, layer by layer", href: "/codex/flutter-app", status: "live" },
      { t: "Dart — the language", href: "/codex/tech/dart", status: "live" },
      { t: "Flutter — drawing every pixel", href: "/codex/tech/flutter", status: "live" },
      { t: "Riverpod — shared state", href: "/codex/tech/riverpod", status: "live" },
      { t: "Dio — the network client", href: "/codex/tech/dio", status: "live" },
      { t: "The burger builder & motion engine", href: "/codex/burger-builder", status: "live" },
      { t: "Offline-first & sync", status: "soon" },
    ],
  },
  {
    id: "web",
    title: "Web & Frontend",
    tint: "blue",
    tagline: "How the browser talks to servers, and how modern web apps are built and rendered.",
    topics: [
      { t: "HTTP & REST — the grammar of the web", href: "/codex/tech/http-rest", status: "live" },
      { t: "JSON — the shape data travels in", href: "/codex/tech/json", status: "live" },
      { t: "Next.js & React", href: "/codex/tech/nextjs", status: "live" },
      { t: "Refine — admin scaffolding", href: "/codex/tech/refine", status: "live" },
      { t: "The admin panel — the control room", href: "/codex/admin-panel", status: "live" },
      { t: "Rendering: CSR vs SSR vs SSG", href: "/codex/tech/rendering", status: "live" },
      { t: "CSS, layout & accessibility", status: "soon" },
    ],
  },
  {
    id: "backend",
    title: "Backend & APIs",
    tint: "amber",
    tagline: "The brain: catching requests, running guards, doing the real work, and proving identity.",
    topics: [
      { t: "The backend — the brain", href: "/codex/backend", status: "live" },
      { t: "Node.js — JS on the server", href: "/codex/tech/nodejs", status: "live" },
      { t: "Express — routes & middleware", href: "/codex/tech/express", status: "live" },
      { t: "Auth — JWT, cookies & CSRF", href: "/codex/tech/auth", status: "live" },
      { t: "Live sync (SSE)", href: "/codex/tech/realtime-sync", status: "live" },
      { t: "Rate limiting & API gateways", status: "soon" },
      { t: "gRPC, GraphQL & WebSockets", status: "soon" },
    ],
  },
  {
    id: "databases",
    title: "Databases",
    tint: "teal",
    tagline: "The permanent memory: linked tables, exact money, all-or-nothing writes, and fast lookups.",
    topics: [
      { t: "The database — the memory", href: "/codex/database", status: "live" },
      { t: "PostgreSQL", href: "/codex/tech/postgresql", status: "live" },
      { t: "Prisma — the ORM", href: "/codex/tech/prisma", status: "live" },
      { t: "SQL & indexes", href: "/codex/tech/sql", status: "live" },
      { t: "Transactions & ACID", href: "/codex/tech/transactions", status: "live" },
      { t: "B-Tree indexing (visual)", href: "/simulator/visualgo", status: "live" },
      { t: "Sharding, replicas & NoSQL", status: "soon" },
    ],
  },
  {
    id: "system-design",
    title: "System Design & Scale",
    tint: "pink",
    tagline: "From 10 users to a million: caching, queues, consensus, and staying correct when networks fail.",
    topics: [
      { t: "Scale — 10 to a million users", href: "/codex/scale", status: "live" },
      { t: "Big systems — payments, orders, loyalty", href: "/codex/big-systems", status: "live" },
      { t: "Idempotency", href: "/codex/tech/idempotency", status: "live" },
      { t: "State machines", href: "/codex/tech/state-machines", status: "live" },
      { t: "Ledgers", href: "/codex/tech/ledgers", status: "live" },
      { t: "Caching", href: "/codex/tech/caching", status: "live" },
      { t: "Concurrency & races", href: "/codex/tech/concurrency", status: "live" },
      { t: "Scaling sandbox (visual)", href: "/simulator/scaling", status: "live" },
      { t: "Dependency & blast-radius (visual)", href: "/simulator/dependency-explorer", status: "live" },
      { t: "Raft consensus (visual)", href: "/simulator/raft", status: "live" },
      { t: "Queues, backpressure & sagas", status: "soon" },
    ],
  },
  {
    id: "dsa",
    title: "DSA & Problem Solving",
    tint: "brand",
    tagline: "The NeetCode-style lab: recognize the pattern, reach the optimal approach, handle every twist.",
    topics: [
      { t: "Enter the DSA Lab", href: "/dsa", status: "live" },
      { t: "Two Pointers", href: "/dsa", status: "live" },
      { t: "Sliding Window", href: "/dsa", status: "live" },
      { t: "Binary Search", href: "/dsa", status: "live" },
      { t: "Trees, BFS & DFS", href: "/dsa", status: "live" },
      { t: "Dynamic Programming", href: "/dsa", status: "live" },
      { t: "Graphs", href: "/dsa", status: "live" },
      { t: "Heaps · Priority Queue", href: "/dsa", status: "live" },
    ],
  },
  {
    id: "devops",
    title: "DevOps & Deployment",
    tint: "teal",
    tagline: "Shipping safely and operating in production: pipelines, containers, environments, rollbacks.",
    topics: [
      { t: "Deployment & ops — going live", href: "/codex/deployment", status: "live" },
      { t: "CI/CD pipelines", href: "/codex/tech/ci-cd", status: "live" },
      { t: "Docker & containers", href: "/codex/tech/docker", status: "live" },
      { t: "Observability — logs, metrics, traces", href: "/codex/tech/observability", status: "live" },
      { t: "Kubernetes & orchestration", href: "/codex/tech/kubernetes", status: "live" },
      { t: "Incident response (War Room)", href: "/universe", status: "live" },
    ],
  },
  {
    id: "cloud",
    title: "Cloud",
    tint: "blue",
    tagline: "Renting the world's computers: compute, storage, networking, and managed services.",
    topics: [
      { t: "What 'the cloud' actually is", href: "/codex/tech/cloud", status: "live" },
      { t: "Compute: VMs, containers, serverless", status: "soon" },
      { t: "Object storage & CDNs", status: "soon" },
      { t: "Managed databases & queues", status: "soon" },
      { t: "Cost, regions & availability zones", status: "soon" },
    ],
  },
  {
    id: "ai-ml",
    title: "AI / ML",
    tint: "purple",
    tagline: "How modern AI works under the hood — from tensors to transformers to RAG.",
    topics: [
      { t: "LLM transformer internals (visual)", href: "/simulator/llm", status: "live" },
      { t: "What a neural network really computes", status: "soon" },
      { t: "Embeddings & vector search", href: "/codex/tech/embeddings", status: "live" },
      { t: "RAG — grounding an LLM", href: "/codex/tech/rag", status: "live" },
      { t: "Training vs inference & cost", status: "soon" },
    ],
  },
  {
    id: "security",
    title: "Security",
    tint: "pink",
    tagline: "Proving identity, guarding requests, and the failure modes attackers exploit.",
    topics: [
      { t: "Auth — JWT, cookies & CSRF", href: "/codex/tech/auth", status: "live" },
      { t: "Security world (Burger Farm)", href: "/worlds/security", status: "live" },
      { t: "Common attacks: XSS, SQLi, SSRF", status: "soon" },
      { t: "Secrets, rotation & least privilege", status: "soon" },
      { t: "Threat modelling", status: "soon" },
    ],
  },
];

// Quick stats for the map header.
export const CURRICULUM_STATS = (() => {
  let live = 0, soon = 0;
  for (const d of DOMAINS) for (const t of d.topics) (t.status === "live" ? live++ : soon++);
  return { domains: DOMAINS.length, live, soon, total: live + soon };
})();
