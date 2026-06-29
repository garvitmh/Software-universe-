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
    id: "scratch",
    label: "Computing from scratch",
    items: [
      { slug: "what-is-a-program", title: "What a program is", ready: true, blurb: "A list of instructions, followed exactly." },
      { slug: "variables-and-memory", title: "Variables & memory", ready: true, blurb: "Where a program keeps what it's thinking about." },
      { slug: "how-code-runs", title: "How code runs", ready: true, blurb: "From your text to machine instructions." },
    ],
  },
  {
    id: "cs-core",
    label: "Computer-science core",
    items: [
      { slug: "data-structures-overview", title: "Data structures, mapped", ready: true, blurb: "The big picture: when to reach for each." },
      { slug: "arrays-and-strings", title: "Arrays & strings", ready: true, blurb: "Numbered slots, instant access — the workhorse." },
      { slug: "linked-lists", title: "Linked lists", ready: true, blurb: "Nodes & pointers; cheap to splice." },
      { slug: "stacks-and-queues", title: "Stacks & queues", ready: true, blurb: "Last-in vs first-out — and why it matters." },
      { slug: "hash-tables", title: "Hash tables & maps", ready: true, blurb: "Look up by name in one step." },
      { slug: "trees-and-bsts", title: "Trees & binary search trees", ready: true, blurb: "Hierarchy, and halving every search." },
      { slug: "graphs", title: "Graphs", ready: true, blurb: "Nodes & edges; BFS and DFS." },
      { slug: "heaps-priority-queues", title: "Heaps & priority queues", ready: true, blurb: "The most-urgent item, always ready." },
      { slug: "recursion-and-backtracking", title: "Recursion & backtracking", ready: true, blurb: "A function that calls itself." },
      { slug: "dynamic-programming", title: "Dynamic programming", ready: true, blurb: "Solve each sub-problem once." },
      { slug: "sorting-and-searching", title: "Sorting & searching", ready: true, blurb: "Order it, then binary-search it." },
      { slug: "big-o-notation", title: "Big-O notation", ready: true, blurb: "How cost grows — the language of efficiency." },
    ],
  },
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
      { slug: "offline-first", title: "Offline-first & sync", ready: true, blurb: "Working when the network doesn't." },
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
      { slug: "sharding", title: "Sharding & replication", ready: true, blurb: "Split and copy a database to scale." },
      { slug: "rate-limiting", title: "Rate limiting", ready: true, blurb: "Cap how fast anyone can hit your API." },
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
      { slug: "web-security", title: "Web security (XSS/SQLi/SSRF)", ready: true, blurb: "How web apps break — and the fix." },
      { slug: "api-styles", title: "API styles (REST/GraphQL/gRPC/WS)", ready: true, blurb: "Four ways for programs to talk." },
      { slug: "css-accessibility", title: "CSS, layout & accessibility", ready: true, blurb: "Look right for everyone — including a11y." },
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
      { slug: "message-queues", title: "Message queues", ready: true, blurb: "Hand slow work to a line of jobs." },
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
      { slug: "cloud-compute", title: "Cloud compute (VM/container/serverless)", ready: true, blurb: "The three ways to rent compute." },
      { slug: "object-storage-cdn", title: "Object storage & CDNs", ready: true, blurb: "Where files live, and how they reach users fast." },
      { slug: "neural-networks", title: "Neural networks", ready: true, blurb: "What the AI is actually computing." },
      { slug: "managed-services", title: "Managed databases & queues", ready: true, blurb: "Let the cloud run your stateful infra." },
      { slug: "cloud-cost-regions", title: "Cost, regions & zones", ready: true, blurb: "Where servers live, and why the bill is the bill." },
      { slug: "training-vs-inference", title: "Training vs inference", ready: true, blurb: "The two AI phases — and which you pay for forever." },
      { slug: "secrets-management", title: "Secrets & least privilege", ready: true, blurb: "Keep keys out of code; rotate; scope tightly." },
      { slug: "threat-modelling", title: "Threat modelling", ready: true, blurb: "Think like an attacker, before they do." },
    ],
  },
  {
    id: "systems",
    label: "Systems & the machine",
    items: [
      { slug: "processes-and-threads", title: "Processes & threads", ready: true, blurb: "What runs your program — and does many things at once." },
      { slug: "memory-stack-heap", title: "Memory: stack & heap", ready: true, blurb: "Where variables actually live while code runs." },
      { slug: "concurrency-primitives", title: "Locks, mutexes & semaphores", ready: true, blurb: "Coordinating threads without corrupting data." },
      { slug: "how-an-os-works", title: "What an OS does", ready: true, blurb: "The manager between your code and the hardware." },
    ],
  },
  {
    id: "networking-distributed",
    label: "Networks & distributed systems",
    items: [
      { slug: "how-the-internet-works", title: "How the internet works", ready: true, blurb: "Packets, IP & routing — the journey of your data." },
      { slug: "tcp-vs-udp", title: "TCP vs UDP", ready: true, blurb: "Reliable-but-careful vs fast-but-careless." },
      { slug: "tls-https", title: "How HTTPS / TLS works", ready: true, blurb: "The handshake, certificates & encryption." },
      { slug: "dns-deep", title: "DNS, in depth", ready: true, blurb: "The phone book — names into addresses." },
      { slug: "load-balancing", title: "Load balancing", ready: true, blurb: "One front door, many servers behind it." },
      { slug: "consistency-models", title: "Consistency models", ready: true, blurb: "Strong vs eventual — what a reader sees." },
      { slug: "replication-and-partitioning", title: "Replication & partitioning", ready: true, blurb: "Copy it for safety, split it for scale." },
      { slug: "distributed-consensus", title: "Distributed consensus", ready: true, blurb: "How machines agree — Raft & Paxos intuition." },
      { slug: "health-checks-and-readiness", title: "Health checks & readiness", ready: true, blurb: "How a system knows an instance is alive and ready for traffic." },
      { slug: "circuit-breakers", title: "Circuit breakers", ready: true, blurb: "Stop hammering a failing dependency — fail fast, then recover." },
      { slug: "backpressure-and-flow-control", title: "Backpressure & flow control", ready: true, blurb: "What to do when the consumer can't keep up with the producer." },
      { slug: "distributed-tracing", title: "Distributed tracing", ready: true, blurb: "Follow one request as it hops across many services." },
      { slug: "service-discovery", title: "Service discovery", ready: true, blurb: "How services find each other's ever-changing addresses." },
      { slug: "graceful-shutdown-and-zero-downtime", title: "Graceful shutdown", ready: true, blurb: "Drain in-flight work before a process exits — no dropped requests." },
    ],
  },
  {
    id: "craft",
    label: "Software craft",
    items: [
      { slug: "design-patterns", title: "Design patterns", ready: true, blurb: "Reusable, named solutions to recurring problems." },
      { slug: "solid-principles", title: "The SOLID principles", ready: true, blurb: "Five rules for code that's easy to change." },
      { slug: "clean-code-refactoring", title: "Clean code & refactoring", ready: true, blurb: "Write for the next human; improve without breaking." },
      { slug: "oop-vs-functional", title: "OOP vs functional", ready: true, blurb: "Two ways to organise a program." },
      { slug: "testing-strategies", title: "Testing strategies", ready: true, blurb: "The test pyramid: unit, integration, e2e." },
      { slug: "test-driven-development", title: "Test-driven development", ready: true, blurb: "Red, green, refactor." },
      { slug: "version-control-git", title: "Version control with Git", ready: true, blurb: "Commits, branches, merges — and why." },
      { slug: "code-review", title: "Code review", ready: true, blurb: "A second pair of eyes before merge." },
      { slug: "agile-and-scrum", title: "Agile & Scrum", ready: true, blurb: "How teams plan and ship in small steps." },
    ],
  },
  {
    id: "sysdesign",
    label: "System design",
    items: [
      { slug: "system-design-interview", title: "The system-design interview", ready: true, blurb: "A framework: requirements → estimate → design → bottlenecks." },
      { slug: "design-a-url-shortener", title: "Design a URL shortener", ready: true, blurb: "The classic: hashing, storage, redirects, scale." },
      { slug: "design-a-news-feed", title: "Design a news feed", ready: true, blurb: "Fan-out, ranking, caching — like Instagram/Twitter." },
      { slug: "design-a-chat-app", title: "Design a chat app", ready: true, blurb: "WebSockets, delivery, presence — like WhatsApp." },
      { slug: "data-engineering-basics", title: "Data engineering basics", ready: true, blurb: "ETL/ELT, warehouses vs lakes, batch vs stream." },
    ],
  },
  {
    id: "web-deep",
    label: "The web, in depth",
    items: [
      { slug: "browser-rendering-pipeline", title: "The browser rendering pipeline", ready: true, blurb: "DOM → layout → paint → composite; reflow vs repaint." },
      { slug: "the-event-loop", title: "The JavaScript event loop", ready: true, blurb: "One thread, two queues, never blocking." },
      { slug: "web-performance", title: "Web performance", ready: true, blurb: "Core Web Vitals, lazy-loading, code-splitting, CDNs." },
      { slug: "state-management-patterns", title: "State management patterns", ready: true, blurb: "Local → lifted → global; Flux, signals, when to use each." },
      { slug: "web-storage", title: "Cookies, localStorage & IndexedDB", ready: true, blurb: "The four browser stores — and which leak." },
      { slug: "progressive-web-apps", title: "Progressive Web Apps", ready: true, blurb: "Service workers, offline, installable, push." },
      { slug: "the-dom-and-virtual-dom", title: "The DOM & Virtual DOM", ready: true, blurb: "The live page tree, and the diffing trick frameworks use." },
      { slug: "hydration-and-islands", title: "Hydration & islands", ready: true, blurb: "Making server HTML interactive without shipping everything." },
      { slug: "web-components-and-shadow-dom", title: "Web Components & Shadow DOM", ready: true, blurb: "Framework-free reusable elements with scoped styles." },
      { slug: "css-architecture-and-the-cascade", title: "CSS architecture & the cascade", ready: true, blurb: "Specificity, the cascade, and taming CSS at scale." },
      { slug: "resource-loading-and-the-critical-path", title: "Resource loading & the critical path", ready: true, blurb: "Render-blocking, preload/defer, and the first paint." },
      { slug: "image-and-asset-optimization", title: "Image, font & asset optimization", ready: true, blurb: "Formats, responsive images, and shrinking the bytes." },
    ],
  },
  {
    id: "backend-deep",
    label: "Backend & data, in depth",
    items: [
      { slug: "api-gateways", title: "API gateways", ready: true, blurb: "The single front door every request walks through." },
      { slug: "caching-strategies", title: "Caching strategies", ready: true, blurb: "Cache-aside, write-through, write-back, invalidation." },
      { slug: "data-modeling", title: "Data modelling", ready: true, blurb: "Normalize vs denormalize; design for access patterns." },
      { slug: "oltp-vs-olap", title: "OLTP vs OLAP", ready: true, blurb: "Transactional vs analytical; row vs column stores." },
      { slug: "database-isolation-levels", title: "Isolation levels", ready: true, blurb: "Read-uncommitted → serializable, and the anomalies." },
      { slug: "connection-pooling", title: "Connection pooling", ready: true, blurb: "Why DB connections are costly — and how a pool fixes it." },
      { slug: "webhooks", title: "Webhooks", ready: true, blurb: "Event callbacks: delivery, retries, idempotency, signing." },
      { slug: "database-indexes", title: "Database indexes", ready: true, blurb: "B-trees, composite & covering indexes — when they help or hurt." },
      { slug: "query-optimization", title: "Query optimization", ready: true, blurb: "The planner, EXPLAIN, and why a query is slow." },
      { slug: "database-replication", title: "Database replication", ready: true, blurb: "Primaries, replicas, failover — copies for safety & reads." },
      { slug: "partitioning-and-sharding", title: "Partitioning & sharding", ready: true, blurb: "Splitting one big table across many machines to scale writes." },
      { slug: "time-series-databases", title: "Time-series databases", ready: true, blurb: "Built for metrics & events streaming in over time." },
    ],
  },
  {
    id: "ai-security-deep",
    label: "AI & security, in depth",
    items: [
      { slug: "prompt-engineering", title: "Prompt engineering", ready: true, blurb: "Reliable output from an LLM — few-shot, chain-of-thought." },
      { slug: "vector-databases", title: "Vector databases", ready: true, blurb: "Store embeddings; nearest-neighbour search." },
      { slug: "ai-agents", title: "AI agents", ready: true, blurb: "LLMs that plan, call tools, and loop." },
      { slug: "rag-vs-fine-tuning", title: "RAG vs fine-tuning", ready: true, blurb: "Two ways to give a model your knowledge." },
      { slug: "owasp-top-10", title: "The OWASP Top 10", ready: true, blurb: "The most common web vulnerabilities, in plain language." },
      { slug: "cryptography-basics", title: "Cryptography basics", ready: true, blurb: "Encryption, hashing, signatures — what each guarantees." },
      { slug: "oauth-and-openid", title: "OAuth & OpenID Connect", ready: true, blurb: "'Sign in with Google', explained." },
    ],
  },
  {
    id: "mobile-devops-deep",
    label: "Mobile & shipping, in depth",
    items: [
      { slug: "mobile-navigation", title: "Mobile navigation", ready: true, blurb: "Stacks, tabs & deep links." },
      { slug: "mobile-animations", title: "Mobile animations", ready: true, blurb: "Native 60fps motion & gestures." },
      { slug: "app-performance", title: "App performance", ready: true, blurb: "Startup, jank, memory, battery on real devices." },
      { slug: "app-release-process", title: "Shipping to the app stores", ready: true, blurb: "Signing, review, staged rollout, OTA." },
      { slug: "deployment-strategies", title: "Deployment strategies", ready: true, blurb: "Blue-green, canary, rolling — ship without downtime." },
      { slug: "infrastructure-as-code", title: "Infrastructure as code", ready: true, blurb: "Your servers as reviewable, repeatable code." },
      { slug: "feature-flags", title: "Feature flags", ready: true, blurb: "Ship dark, roll out gradually, kill instantly." },
    ],
  },
  {
    id: "cloud-dataeng-deep",
    label: "Cloud networking & data engineering",
    items: [
      { slug: "cloud-networking", title: "Cloud networking", ready: true, blurb: "VPCs, subnets, security groups, load balancers." },
      { slug: "edge-computing", title: "Edge computing", ready: true, blurb: "Run code near the user, not just cache." },
      { slug: "stream-processing", title: "Stream processing", ready: true, blurb: "Batch vs stream; windows, watermarks, exactly-once." },
      { slug: "etl-pipelines", title: "ETL & data pipelines", ready: true, blurb: "Extract/transform/load; DAGs, orchestration, CDC." },
      { slug: "data-lakes-and-warehouses", title: "Data lakes & warehouses", ready: true, blurb: "Lake vs warehouse vs lakehouse; columnar." },
      { slug: "kafka-and-event-streaming", title: "Kafka & event streaming", ready: true, blurb: "The durable log many systems read & replay." },
      { slug: "change-data-capture", title: "Change data capture (CDC)", ready: true, blurb: "Stream every row change out of your database, in order." },
    ],
  },
  {
    id: "foundations-deep",
    label: "Foundations & math, in depth",
    items: [
      { slug: "how-a-cpu-works", title: "How a CPU works", ready: true, blurb: "Fetch-decode-execute — what 'running' physically is." },
      { slug: "binary-and-number-representation", title: "Binary & numbers", ready: true, blurb: "Bits, two's complement, why floats drift." },
      { slug: "character-encoding", title: "Character encoding", ready: true, blurb: "ASCII, Unicode, UTF-8 — and mojibake." },
      { slug: "type-systems", title: "Type systems", ready: true, blurb: "Static vs dynamic, strong vs weak, inference." },
      { slug: "garbage-collection", title: "Garbage collection", ready: true, blurb: "The automatic memory janitor — and its pauses." },
      { slug: "discrete-math-for-programmers", title: "Discrete math for programmers", ready: true, blurb: "Sets, logic, combinatorics — the math under DSA." },
      { slug: "probability-for-programmers", title: "Probability for programmers", ready: true, blurb: "Randomness, expected value, where it shows up." },
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
