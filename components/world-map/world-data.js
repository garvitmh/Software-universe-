export const WORLDS = [
  {
    id: "pos",
    title: "POS World",
    sub: "Mobile App & Tap Journey",
    desc: "How a tap on a mobile device travels through layers of Flutter code to become a real order.",
    x: 100,
    y: 200,
    tint: "blue",
    slug: "foundations",
    simSlug: "order-journey",
    anchors: ["apps/mobile-app/lib/features/menu/presentation/builder/burger_stack.dart", "apps/mobile-app/lib/core/theme/app_motion.dart"],
    disaster: "A customer loses network connectivity while placing an order, resulting in an offline app crash and a dropped order.",
    recovery: "Dio network client interceptors catch the offline state, queuing the order locally in SQLite and retrying automatically when connection is restored.",
    scalingStats: {
      "10": "Zero latency. Perfect visual feedback and rendering.",
      "100k": "App store assets can be cached locally to prevent server bandwidth overload.",
      "1M": "Server-side menu assets must be hosted via CDN to avoid asset delivery failures on cold app starts."
    },
    curiosityQuestion: "What happens if a customer's phone disconnects right after they tap pay?",
    children: [
      { id: "pos-codex", typeLabel: "Codex", label: "Foundations", emoji: "📖", href: "/codex/foundations" },
      { id: "pos-sim", typeLabel: "Simulator", label: "Tap Journey", emoji: "🎮", href: "/simulator/order-journey" },
      { id: "pos-tech-flutter", typeLabel: "Tech", label: "Flutter", emoji: "🛠️", href: "/codex/tech/flutter" },
      { id: "pos-tech-dart", typeLabel: "Tech", label: "Dart", emoji: "🛠️", href: "/codex/tech/dart" },
      { id: "pos-failure", typeLabel: "Failure", label: "Offline Sync", emoji: "💥" }
    ]
  },
  {
    id: "security",
    title: "Security World",
    sub: "Auth & Identity",
    desc: "Cookies, JWTs, stateless session tokens, and CSRF protection guarding the backend.",
    x: 100,
    y: 450,
    tint: "pink",
    slug: "tech/auth",
    simSlug: "cart-drift",
    anchors: ["apps/backend/src/middleware/auth.middleware.ts", "apps/backend/src/routes/auth.routes.ts"],
    disaster: "Session hijacking via stolen cookie/JWT or malicious CSRF requests sending unauthorized checkouts.",
    recovery: "Enforce SameSite=Strict cookies, anti-CSRF token verification headers, and JWT signature verification via rotation keys.",
    scalingStats: {
      "10": "Minimal processing overhead on stateless JWT signatures.",
      "100k": "Stateless verification prevents DB lookups, keeping response times under 5ms.",
      "1M": "Verifying signatures is CPU-heavy; requires distributed auth servers or API gateways to offload verification."
    },
    curiosityQuestion: "How do we prevent malicious sites from placing orders on a user's behalf?",
    children: [
      { id: "sec-codex", typeLabel: "Codex", label: "The Backend Brain", emoji: "📖", href: "/codex/backend" },
      { id: "sec-tech-auth", typeLabel: "Tech", label: "JWT & Cookies", emoji: "🛠️", href: "/codex/tech/auth" },
      { id: "sec-failure", typeLabel: "Failure", label: "Session Hijack", emoji: "💥" }
    ]
  },
  {
    id: "order",
    title: "Order World",
    sub: "State Machine & Queues",
    desc: "The lifecycle of an order from Placed to Preparing to Completed, managed by a robust state machine.",
    x: 380,
    y: 200,
    tint: "brand",
    slug: "layers-and-separation",
    simSlug: "order-journey",
    anchors: ["apps/backend/src/services/order.service.ts", "schema.prisma"],
    disaster: "Two backend requests concurrently modify an order state, causing status conflicts (e.g. preparing and refunded simultaneously).",
    recovery: "Enforce a strict State Machine that only allows valid transitions (e.g. Placed -> Preparing, never Refunded -> Preparing), combined with database-level pessimistic locks.",
    scalingStats: {
      "10": "Immediate database updates directly on the primary connection.",
      "100k": "Synchronous database writes begin to lock. Must offload order placements to a message queue (Redis/RabbitMQ).",
      "1M": "Database locks will cause connection pools to exhaust. A queue separates intake from prep workers, allowing asynchronous processing."
    },
    curiosityQuestion: "What breaks if the admin changes a product price while a customer is checking out?",
    children: [
      { id: "ord-codex-1", typeLabel: "Codex", label: "Layers & Separation", emoji: "📖", href: "/worlds/order" },
      { id: "ord-codex-2", typeLabel: "Codex", label: "State Management", emoji: "📖", href: "/worlds/order" },
      { id: "ord-tech-node", typeLabel: "Tech", label: "Node.js & Express", emoji: "🛠️", href: "/codex/tech/express" },
      { id: "ord-failure", typeLabel: "Failure", label: "Race Conditions", emoji: "💥" }
    ]
  },
  {
    id: "payment",
    title: "Payment World",
    sub: "Gateway & Transactions",
    desc: "Interfacing with external payment processors, webhooks, and ensuring ledgers balance.",
    x: 660,
    y: 60,
    tint: "amber",
    slug: "big-systems",
    simSlug: "loyalty-ledger",
    anchors: ["apps/backend/src/services/payment.service.ts", "schema.prisma"],
    disaster: "A transient network error interrupts a payment gateway callback, double-charging a customer on retry.",
    recovery: "Pass a unique, deterministic `idempotency_key` (derived from cart details) with every request so the gateway rejects duplicates.",
    scalingStats: {
      "10": "Direct synchronous HTTP calls to Stripe gateway succeed in under 1s.",
      "100k": "Gateway response latencies stack up. Must handle payment status asynchronously via secure webhooks.",
      "1M": "Webhook bursts saturate backend handlers. Must route incoming webhooks to a queue to throttle ingestion rate."
    },
    curiosityQuestion: "How do we prevent double-charging a customer on network retries?",
    children: [
      { id: "pay-codex", typeLabel: "Codex", label: "Big Systems", emoji: "📖", href: "/worlds/payment" },
      { id: "pay-tech-idemp", typeLabel: "Tech", label: "Idempotency", emoji: "🛠️", href: "/codex/tech/idempotency" },
      { id: "pay-tech-trans", typeLabel: "Tech", label: "Transactions", emoji: "🛠️", href: "/codex/tech/transactions" },
      { id: "pay-failure", typeLabel: "Failure", label: "Double Charge", emoji: "💥" }
    ]
  },
  {
    id: "delivery",
    title: "Delivery World",
    sub: "Geofencing & Serviceability",
    desc: "Determining store service areas using latitudes, longitudes, and routing algorithms.",
    x: 660,
    y: 340,
    tint: "teal",
    slug: "big-systems",
    anchors: ["apps/backend/src/services/delivery.service.ts"],
    disaster: "Google Maps API limit is exceeded, throwing errors and preventing customers from placing valid delivery orders.",
    recovery: "Cache store boundaries as polygons locally and perform geofencing calculations (e.g. ray-casting) in-memory before calling external APIs.",
    scalingStats: {
      "10": "In-memory bounding box queries take less than 0.1ms.",
      "100k": "Frequent GPS lookups strain server memory. Offload coordinate containment to PostgreSQL via PostGIS spatial indices.",
      "1M": "Database spatial queries become a bottleneck. Must cache active delivery boundaries in Redis as geospatial indexes (GEOSEARCH)."
    },
    curiosityQuestion: "Can we check delivery serviceability without paying for the Google Maps API every time?",
    children: [
      { id: "del-codex", typeLabel: "Codex", label: "Delivery Logic", emoji: "📖", href: "/worlds/delivery" },
      { id: "del-tech-http", typeLabel: "Tech", label: "HTTP & REST", emoji: "🛠️", href: "/codex/tech/http-rest" },
      { id: "del-failure", typeLabel: "Failure", label: "Geofence Mismatch", emoji: "💥" }
    ]
  },
  {
    id: "loyalty",
    title: "Loyalty World",
    sub: "Append-only Ledgers",
    desc: "Points earn and redeem accounting modeled like a double-entry ledger to prevent fraud.",
    x: 940,
    y: 200,
    tint: "purple",
    slug: "big-systems",
    simSlug: "loyalty-ledger",
    anchors: ["apps/backend/src/services/loyalty.service.ts", "schema.prisma"],
    disaster: "Concurrent point redemption requests cause a race condition, leading to points double-spending and a negative balance.",
    recovery: "Model points as an append-only ledger of transactions rather than a single mutable balance column, combined with a unique composite key on `idempotency_key`.",
    scalingStats: {
      "10": "SUM calculations on ledger rows return immediately.",
      "100k": "Summing millions of rows slows down database queries. Must store cached customer balances in a Redis cache, updating it on ledger writes.",
      "1M": "Frequent writes to the ledger cause database serialization bottlenecks. Must batch loyalty writes asynchronously using a broker (Kafka)."
    },
    curiosityQuestion: "Can points double-spend if a customer redeems them on two devices simultaneously?",
    children: [
      { id: "loy-codex", typeLabel: "Codex", label: "Ledgers & Loyalty", emoji: "📖", href: "/worlds/loyalty" },
      { id: "loy-sim", typeLabel: "Simulator", label: "Loyalty Ledger", emoji: "🎮", href: "/simulator/loyalty-ledger" },
      { id: "loy-tech-ledger", typeLabel: "Tech", label: "Ledger Concept", emoji: "🛠️", href: "/codex/tech/ledgers" },
      { id: "loy-failure", typeLabel: "Failure", label: "Double Spend", emoji: "💥" }
    ]
  },
  {
    id: "analytics",
    title: "Analytics World",
    sub: "Audit Logs & Dashboards",
    desc: "Tracking store performance, menu item popularity, and compiling admin-facing activity logs.",
    x: 940,
    y: 450,
    tint: "blue",
    slug: "admin-panel",
    anchors: ["apps/admin-panel/src/pages/dashboard.tsx"],
    disaster: "Database write locks during traffic spikes as analytics writes contend with core order checkout writes.",
    recovery: "Decouple analytics tracking to an asynchronous log buffer or separate TimescaleDB instance, leaving the primary database for OLTP.",
    scalingStats: {
      "10": "SQL aggregation queries are lightning-fast.",
      "100k": "Scanning the primary tables degrades checkout performance. Implement read replicas to route all analytical read queries away from the primary DB.",
      "1M": "Real-time analytics is too heavy for relational DBs. Route clickstream data to a data warehouse (ClickHouse / Snowflake) or ELK stack."
    },
    curiosityQuestion: "How do we make sure tracking customer clicks doesn't crash the checkout database?",
    children: [
      { id: "ana-codex", typeLabel: "Codex", label: "Admin Panel CRUD", emoji: "📖", href: "/codex/admin-panel" },
      { id: "ana-tech-next", typeLabel: "Tech", label: "Next.js & React", emoji: "🛠️", href: "/codex/tech/nextjs" },
      { id: "ana-tech-refine", typeLabel: "Tech", label: "Refine CRUD", emoji: "🛠️", href: "/codex/tech/refine" },
      { id: "ana-failure", typeLabel: "Failure", label: "Write Lockup", emoji: "💥" }
    ]
  },
  {
    id: "deployment",
    title: "Deployment World",
    sub: "Infrastructure & Ops",
    desc: "Containers, environment configurations, CI/CD pipelines, and database migrations.",
    x: 1220,
    y: 200,
    tint: "teal",
    slug: "deployment",
    simSlug: "scaling",
    anchors: ["render.yaml", "package.json"],
    disaster: "A database schema migration is deployed while the old server version is still running, causing crashing queries and server downtime.",
    recovery: "Enforce multi-phase, backward-compatible migrations (e.g. Add Column -> Write to both old/new columns -> Deploy code -> Remove old column).",
    scalingStats: {
      "10": "Single server instance running Node.js easily handles 100% of load.",
      "100k": "Single server instance runs out of CPU/Memory. Deploy a Load Balancer (Nginx/ALB) and horizontally scale to 3+ server instances.",
      "1M": "Database becomes the ultimate bottleneck. Implement read replicas, caching layers, and database sharding (partitioning by store region)."
    },
    curiosityQuestion: "How do we update the database schema without causing downtime for active customers?",
    children: [
      { id: "dep-codex", typeLabel: "Codex", label: "Ops & Deployment", emoji: "📖", href: "/codex/deployment" },
      { id: "dep-sim", typeLabel: "Simulator", label: "Scale Simulator", emoji: "🎮", href: "/simulator/scaling" },
      { id: "dep-tech-cache", typeLabel: "Tech", label: "Caching & Replicas", emoji: "🛠️", href: "/codex/tech/caching" },
      { id: "dep-tech-db", typeLabel: "Tech", label: "Postgres & SQL", emoji: "🛠️", href: "/codex/tech/postgresql" },
      { id: "dep-failure", typeLabel: "Failure", label: "OOM Crash", emoji: "💥" }
    ]
  }
];

export const EDGES = [
  { source: "pos", target: "order", animated: true },
  { source: "security", target: "order", animated: false },
  { source: "order", target: "payment", animated: true },
  { source: "order", target: "delivery", animated: true },
  { source: "payment", target: "loyalty", animated: true },
  { source: "delivery", target: "loyalty", animated: true },
  { source: "loyalty", target: "analytics", animated: false },
  { source: "loyalty", target: "deployment", animated: true },
  { source: "analytics", target: "deployment", animated: false }
];
export const CURIOSITY_LIST = WORLDS.map(w => ({
  question: w.curiosityQuestion,
  worldId: w.id,
  targetNodeId: `${w.id}-failure`
}));
