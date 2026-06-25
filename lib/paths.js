// Guided learning paths — the "rope through the maze". Each path is an ordered
// sequence of existing entries with a one-line reason for each stop, so a
// beginner has a route instead of a wall of links. Progress is tracked locally
// (see lib/learnerStore.js) against each step's href.

export const PATHS = [
  {
    id: "first-principles",
    title: "First principles",
    subtitle: "How software actually fits together",
    blurb: "The absolute-beginner spine. Start here if you've built things but never quite knew what was underneath.",
    steps: [
      { href: "/codex/foundations", title: "How it all fits together", note: "The whole system on one page — the map before the territory." },
      { href: "/codex/layers-and-separation", title: "Layers & separation", note: "Why software is built in layers, each with one job." },
      { href: "/codex/state-management", title: "State — one source of truth", note: "The idea that keeps a screen from disagreeing with itself." },
      { href: "/codex/tech/http-rest", title: "HTTP & REST", note: "How two programs talk to each other over the web." },
      { href: "/codex/backend", title: "The backend — the brain", note: "Where the real work and the rules live." },
      { href: "/codex/database", title: "The database — the memory", note: "The part that remembers everything, safely." },
      { href: "/simulator/order-journey", title: "See: the journey of an order", note: "Watch one request travel the entire system." },
    ],
  },
  {
    id: "web-request",
    title: "Anatomy of a web request",
    subtitle: "From a tap to a rendered page",
    blurb: "Follow a single request all the way down and back up — the most important journey in all of web software.",
    steps: [
      { href: "/codex/tech/http-rest", title: "HTTP & REST", note: "Request and response — the grammar of the web." },
      { href: "/codex/tech/json", title: "JSON", note: "The shape data travels in." },
      { href: "/codex/tech/express", title: "Express — routes & middleware", note: "How the backend catches a request and guards it." },
      { href: "/codex/tech/auth", title: "Auth — JWT, cookies, CSRF", note: "Proving who you are, without being fooled." },
      { href: "/codex/tech/sql", title: "SQL & indexes", note: "How the answer is fetched — and made fast." },
      { href: "/codex/tech/rendering", title: "Web rendering (CSR/SSR/SSG)", note: "Where the final page actually gets built." },
      { href: "/simulator/order-journey", title: "See: end to end", note: "The whole round trip, visualised." },
    ],
  },
  {
    id: "surviving-scale",
    title: "Surviving scale",
    subtitle: "From ten users to a million",
    blurb: "What breaks as the crowd grows, and the levers — caches, limits, queues, shards — you pull to survive it.",
    steps: [
      { href: "/codex/scale", title: "Scale — 10 to a million", note: "What actually breaks first, and why." },
      { href: "/codex/tech/caching", title: "Caching", note: "Compute once, serve many — the first lever." },
      { href: "/simulator", title: "See: the load simulator", note: "Add traffic, withdraw a server, watch it fall over and recover." },
      { href: "/codex/tech/rate-limiting", title: "Rate limiting", note: "Stop one client flooding everyone." },
      { href: "/codex/tech/message-queues", title: "Message queues", note: "Hand slow work to a line of jobs." },
      { href: "/codex/tech/sharding", title: "Sharding & replication", note: "Split and copy the database to grow." },
      { href: "/simulator/dependency-explorer", title: "See: blast radius", note: "How one failure cascades — and how to contain it." },
    ],
  },
  {
    id: "correctness",
    title: "Getting money & data right",
    subtitle: "Correctness when it counts",
    blurb: "The handful of ideas that stop a system from losing money, double-charging, or corrupting its own data.",
    steps: [
      { href: "/codex/tech/transactions", title: "Transactions & ACID", note: "All-or-nothing writes — no half-finished states." },
      { href: "/codex/tech/idempotency", title: "Idempotency", note: "Why a retry can't charge you twice." },
      { href: "/codex/tech/ledgers", title: "Ledgers", note: "Track points and money the way a bank does." },
      { href: "/codex/tech/concurrency", title: "Concurrency & races", note: "When two requests collide on the same data." },
      { href: "/codex/tech/state-machines", title: "State machines", note: "An order is always in exactly one known state." },
      { href: "/simulator/loyalty-ledger", title: "See: the ledger refuse a double credit", note: "Idempotency, live." },
    ],
  },
  {
    id: "ship-it",
    title: "Ship it & keep it alive",
    subtitle: "The DevOps loop",
    blurb: "How code gets from your machine to real users — and how you watch it, scale it, and fix it once it's live.",
    steps: [
      { href: "/codex/tech/docker", title: "Docker & containers", note: "One sealed box that runs anywhere." },
      { href: "/codex/tech/ci-cd", title: "CI/CD", note: "Test every change automatically, then ship it." },
      { href: "/codex/tech/cloud-compute", title: "Cloud compute", note: "VMs vs containers vs serverless — where it runs." },
      { href: "/codex/tech/kubernetes", title: "Kubernetes", note: "Run and heal many containers at once." },
      { href: "/codex/tech/observability", title: "Observability", note: "Logs, metrics, traces — see production live." },
      { href: "/codex/deployment", title: "Going live", note: "The whole release, start to finish." },
    ],
  },
  {
    id: "dsa-starter",
    title: "DSA starter",
    subtitle: "Patterns over puzzles",
    blurb: "The NeetCode-style way in: learn to recognise the handful of patterns that solve most interview problems.",
    steps: [
      { href: "/dsa", title: "Enter the DSA Lab", note: "The whole idea: recognise the pattern first, then solve." },
      { href: "/dsa/two-sum", title: "Two Sum", note: "Hash maps — trade memory for O(1) lookups." },
      { href: "/dsa/valid-palindrome", title: "Valid Palindrome", note: "Two pointers, walking in from both ends." },
      { href: "/dsa/longest-substring-without-repeating", title: "Longest Substring", note: "The sliding window — a range that grows and shrinks." },
    ],
  },
];

export function getPath(id) {
  return PATHS.find((p) => p.id === id) || null;
}
