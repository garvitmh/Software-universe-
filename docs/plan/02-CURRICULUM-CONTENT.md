# 02 · Complete Curriculum & Content Architecture

> Master plan, Section 2 of N. This is **the spine of the product** — the thing that
> guarantees the promise *"nothing is left behind."* Section 01 defined the pedagogy (the
> 8 lenses, the no-quiz mechanics, the depth ladder, paths). This section defines **the
> complete field map** every learner can traverse, **the data model** that makes hundreds of
> topics authorable and renderable, and **the gap list** that turns today's ~30 articles into
> that map.
>
> Everything is grounded in the real repo, cited exactly:
>
> - `lib/domains.js` — 11 `DOMAINS` × `DEPTH_LADDER` (`local → prod → enterprise → mnc`); `CURRICULUM_STATS`.
> - `lib/curriculum.js` — `CODEX_PARTS` (10 reading chapters) + `TECH_SECTIONS` (6 groups, **30 `TECH_CONTENT` slugs**, all `ready: true`).
> - `lib/tech-content.js` — the article schema (verified across all 30): `slug, title, category, color, tagline, oneLiner, what[], analogy{title,body}, insideTitle?, inside[]{name,desc}, why[], alternatives[]{name,note}, howWeUse{body[],refs[]}, breaks, related[]`.
> - `lib/dsa.js` — `DSA_PATTERNS[]{id,name,tint,idea,recognize[]}` + `DSA_PROBLEMS[]{slug,title,difficulty,pattern,statement,recognize,approaches[],twists[],related?}`.
> - `lib/glossary.js` (~70 terms `{term,def,more?}`), `lib/resources.js` (`RESOURCE_GROUPS`), `lib/fmt.jsx` → `components/Term.jsx` (inline `[[term]]` tooltips), `components/TechArticle.jsx` (the renderer), `app/codex/tech/[slug]`, `app/simulator/*`, `app/dsa/*`, `app/learn`.
>
> **Single most important structural finding:** the codebase already has *two parallel
> spines* — `CODEX_PARTS` (the 10-chapter Burger-Farm narrative) and `TECH_SECTIONS`/`DOMAINS`
> (the encyclopedic reference). This section **unifies them under one content model** so a
> "topic" is the atom, the Burger-Farm chapters become *guided paths through topics*, and the
> map fills in honestly. Completeness checklists used (not copied): roadmap.sh, OSSU
> (`github.com/ossu/computer-science`), Teach Yourself CS. The structure below is ours.

---

## Part A · The Exhaustive Field Map

This is the breadth contract. It is a **superset** of `lib/domains.js` — today's 11 domains
become **18 domains** (foundations split out; languages, math, systems/OS, networking,
distributed systems, data engineering, software craft, theory, and career added), ordered by
*what a request touches* and *what a learner needs in what order*, not by academic taxonomy.

**Legend.** Each leaf topic is a candidate **TOPIC** (one `tech-content`-style object). The
**rungs** note says which `DEPTH_LADDER` rungs it must eventually cover. The **modes** note
marks which of READ / SEE / PRACTICE it earns (ASK is always-on). `▣ = exists today`
(maps to a live slug/sim); `◻ = gap`.

### D0 · CS & Programming Foundations  *(domain id: `cs-foundations`, new)*
*The mental model under everything. No prerequisites.*

- **How a computer runs code** ◻ — CPU/ALU/registers, fetch-decode-execute, clock. `rungs: local` · `R S`
- **Memory: stack vs heap, pointers, references** ◻ — what a variable *is*; addresses; allocation. `local` · `R S`
- **Binary, bits, bytes & number representation** ◻ — two's complement, floats (the `0.1+0.2` lesson), Unicode. `local` · `R S`
- **Data types & type systems** ◻ — static vs dynamic, strong vs weak, inference; ties to `dart`▣/`typescript`▣. `local→prod` · `R`
- **Control flow & functions** ◻ — branching, loops, call stack, scope, closures. `local` · `R S`
- **Recursion & the call stack** ◻ — base/recursive case, stack frames, overflow; pairs with DSA. `local` · `R S P`
- **Programming paradigms** ◻ — imperative vs declarative; **OOP** (encapsulation/inheritance/polymorphism) vs **FP** (pure functions, immutability, HOFs). `local→enterprise` · `R`
- **How code becomes a running program** ◻ — compile vs interpret vs JIT/AOT; bridges to `dart`▣ (its two-engine analogy already written). `local` · `R S`

### D1 · Languages (comparative)  *(domain id: `languages`, new — promotes `TECH_SECTIONS.languages`)*
*Not "learn one language" — learn what each is FOR, comparatively.*

- **Dart** ▣ (`dart`) · **TypeScript** ▣ (`typescript`) · **Node.js (runtime)** ▣ (`nodejs`)
- **Python** ◻ — readability, batteries, the ML/data lingua franca. `local→prod` · `R`
- **JavaScript (the language)** ◻ — event loop, prototypes, async; distinct from `nodejs`▣. `local→prod` · `R S`
- **Java / JVM** ◻ — enterprise default, GC, "verbose but safe." `prod→enterprise` · `R`
- **C & C++** ◻ — manual memory, close to the metal, undefined behaviour. `local→prod` · `R`
- **Go** ◻ — goroutines, simplicity-as-a-feature, cloud-native default. `prod→mnc` · `R`
- **Rust** ◻ — ownership/borrow-checker, memory safety without GC. `prod→enterprise` · `R S`
- **Language comparison matrix** ◻ — *one* cross-cutting topic: typing, memory, concurrency, ecosystem, "reach for X when…". `enterprise` · `R`

### D2 · DSA, Algorithms & Complexity  *(domain id: `dsa`, ▣ exists as the Lab)*
*Already the strongest-built domain. Pattern-first (`DSA_PATTERNS`).*

- **Big-O & complexity** ◻ — time/space, amortized, why it matters. `local` · `R S`
- **Core data structures** ◻ — arrays, linked lists, stacks, queues, hash maps, trees, heaps, graphs, tries, union-find. `local` · `R S P`
- **Patterns** ▣ — Two Pointers, Sliding Window, Binary Search, Trees/BFS/DFS, DP, Graphs, Heaps (all in `DSA_PATTERNS`). `optimal+twists` · `R P`
- **Pattern gaps** ◻ — Backtracking, Greedy, Intervals, Prefix-Sum, Bit Manipulation, Trie, Union-Find. `R P`
- **Sorting & searching** ◻ — quicksort/mergesort/heapsort, stability, when to use which. `local` · `R S P`
- **Algorithm design strategies** ◻ — divide-and-conquer, greedy proofs, DP formulation. `prod` · `R`

### D3 · Math for CS  *(domain id: `math`, new)*
*Just-enough math, taught when a topic needs it (not as a wall).*

- **Discrete math** ◻ — logic, sets, combinatorics, graph theory (feeds DSA-graphs). `local` · `R`
- **Linear algebra** ◻ — vectors, matrices, dot products (feeds `embeddings`▣ / ML). `prod` · `R S`
- **Probability & statistics** ◻ — distributions, expectation, Bayes (feeds ML + tail latencies). `prod` · `R S`
- **Calculus (gradients only)** ◻ — derivatives → gradient descent (feeds NN training). `prod` · `R S`

### D4 · Computer Systems & OS  *(domain id: `systems`, new)*
*What sits between your code and the silicon.*

- **Processes vs threads** ◻ — address spaces, context switches; pairs with `nodejs`▣ event loop. `local→prod` · `R S`
- **Concurrency & parallelism** ◻ (app-level `concurrency`▣ exists; this is the OS-level depth) — locks, deadlocks, atomics. `prod→enterprise` · `R S`
- **Memory management** ◻ — virtual memory, paging, GC vs manual; ties to D0. `prod` · `R S`
- **Scheduling** ◻ — preemptive vs cooperative, fairness. `prod` · `R S`
- **Virtualization & isolation** ◻ — VMs vs containers (deepens `docker`▣). `prod→enterprise` · `R`
- **The filesystem & I/O** ◻ — blocking vs non-blocking (the *why* under Node). `local→prod` · `R`

### D5 · Networking  *(domain id: `networking`, new — promotes parts of `web`)*
*How any two machines talk.*

- **The layered model** ◻ — physical → IP → TCP/UDP → app; packets. `local→prod` · `R S`
- **TCP/IP & UDP** ◻ — handshakes, reliability vs speed. `prod` · `R S`
- **HTTP & REST** ▣ (`http-rest`) · **JSON** ▣ (`json`)
- **HTTP/2 & HTTP/3** ◻ — multiplexing, head-of-line blocking. `prod→mnc` · `R`
- **DNS** ◻ — name → IP, TTLs, the "it's always DNS" lesson. `prod` · `R S`
- **TLS / HTTPS** ◻ — handshake, certs, what "secure" means; bridges to D14. `prod` · `R S`
- **CDNs & edge** ◻ — caching geographically (deepens `caching`▣ at `mnc`). `mnc` · `R S`
- **Sockets, WebSockets & SSE** ◻ (`realtime-sync`▣ covers SSE) — full-duplex. `prod` · `R S`
- **Load balancers & reverse proxies** ◻ — L4/L7, sticky sessions. `prod→mnc` · `R S`

### D6 · Web Frontend  *(domain id: `web`, ▣ exists)*

- **Next.js & React** ▣ (`nextjs`) · **Refine** ▣ (`refine`) · **Rendering CSR/SSR/SSG** ▣ (`rendering`)
- **HTML semantics & the DOM** ◻ — the document, the tree, events. `local` · `R S`
- **CSS, layout & responsive design** ◻ (`status:"soon"` in domains) — box model, flex/grid, breakpoints. `local→prod` · `R S`
- **Accessibility (a11y)** ◻ (part of the "soon" CSS/a11y cell) — WCAG, semantics, keyboard, SR. `prod→enterprise` · `R`
- **Client vs server state** ◻ — caching, React Query. `prod` · `R`
- **Frontend performance** ◻ — bundle size, Core Web Vitals, lazy loading. `prod→mnc` · `R S`

### D7 · Web Backend & APIs  *(domain id: `backend`, ▣ exists)*

- **Express — routes & middleware** ▣ (`express`) · **Auth — JWT/cookies/CSRF** ▣ (`auth`) · **Live sync (SSE)** ▣ (`realtime-sync`)
- **API design & versioning** ◻ — REST maturity, pagination, errors, `/v1` (cited in `http-rest`▣). `prod→enterprise` · `R`
- **Rate limiting & API gateways** ◻ (`status:"soon"`) — token bucket, quotas. `prod→mnc` · `R S`
- **gRPC, GraphQL & WebSockets** ◻ (`status:"soon"`) — when each beats REST. `prod→enterprise` · `R S`
- **Background jobs & workers** ◻ — offloading the event loop (the `nodejs`▣ "breaks" lesson, made real). `prod` · `R S`
- **Webhooks** ◻ — server-to-server callbacks, signing, retries. `prod` · `R`

### D8 · Mobile  *(domain id: `mobile`, ▣ exists)*

- **Flutter** ▣ · **Dart** ▣ · **Riverpod** ▣ · **Dio** ▣
- **Mobile app architecture** ◻ — feature-first folders, layers (in the `flutter-app` chapter). `prod` · `R`
- **Offline-first & sync** ◻ (`status:"soon"`) — local DB, conflict resolution. `prod→enterprise` · `R S`
- **Push notifications & deep links** ◻ — APNs/FCM, the lifecycle. `prod` · `R`
- **App store / release** ◻ — signing, staged rollout, crash reporting. `prod→enterprise` · `R`

### D9 · Databases  *(domain id: `databases`, ▣ exists)*

- **PostgreSQL** ▣ · **Prisma** ▣ · **SQL & indexes** ▣ (`sql`) · **Transactions & ACID** ▣ (`transactions`)
- **Data modelling & normalization** ◻ — ERDs, 1NF–3NF, when to denormalize. `prod` · `R S`
- **Indexing deep-dive** ◻ — B-tree (the `visualgo`▣ sim shows it), hash, composite, covering. `prod→enterprise` · `R S`
- **Query optimization** ◻ — EXPLAIN, the planner, N+1. `prod→enterprise` · `R S`
- **Isolation levels & locking** ◻ — deepens `transactions`▣ + `concurrency`▣. `enterprise` · `R S`
- **NoSQL families** ◻ (part of "Sharding, replicas & NoSQL" `soon`) — KV, document, wide-column, graph. `prod→mnc` · `R`
- **Replication & sharding** ◻ (`status:"soon"`) — leader/follower, partition keys, the CAP cost. `enterprise→mnc` · `R S`
- **Caching layers** ▣ (`caching`) — DB-side & app-side. `prod→mnc` · `R S`

### D10 · Distributed Systems & System Design  *(domain id: `system-design`, ▣ exists)*

- **Scale 10→1M** ▣ (`scale`) · **Big systems** ▣ (`big-systems`) · **Idempotency** ▣ · **State machines** ▣ · **Ledgers** ▣ · **Caching** ▣ · **Concurrency** ▣
- **Sims** ▣ — `scaling`, `dependency-explorer`, `raft`, `order-journey`, `loyalty-ledger`, `cart-drift`.
- **CAP & consistency models** ◻ — strong vs eventual; the tradeoff triangle. `enterprise→mnc` · `R S`
- **Consensus (the READ behind `raft`▣)** ◻ — quorum, leader election. `mnc` · `R S`
- **Queues, backpressure & sagas** ◻ (`status:"soon"`) — at-least-once, dead-letter, compensating txns. `enterprise→mnc` · `R S`
- **Load balancing & partitioning** ◻ — consistent hashing. `mnc` · `R S`
- **The classic interview designs** ◻ — URL shortener, rate limiter, news feed, chat, "design Uber." `enterprise→mnc` · `R P`

### D11 · DevOps, Cloud & SRE  *(domains: `devops`▣ + `cloud`▣)*

- **Deployment & ops** ▣ (`deployment`) · **CI/CD** ▣ · **Docker** ▣ · **Kubernetes** ▣ · **Observability** ▣ · **Cloud** ▣
- **Incident response (War Room)** ▣ (`/universe`)
- **Compute: VMs / containers / serverless** ◻ (`status:"soon"`). `prod→mnc` · `R S`
- **Object storage & CDNs** ◻ (`status:"soon"`) — blobs, signed URLs. `prod→mnc` · `R`
- **Managed databases & queues** ◻ (`status:"soon"`). `prod→enterprise` · `R`
- **Cost, regions & availability zones** ◻ (`status:"soon"`) — the economics of scale. `enterprise→mnc` · `R S`
- **IaC** ◻ — Terraform, declarative infra, drift. `enterprise` · `R`
- **SRE: SLO/SLI/error budgets** ◻ — reliability as a number. `enterprise→mnc` · `R`

### D12 · Data Engineering  *(domain id: `data-eng`, new)*

- **Batch vs streaming** ◻ — ETL/ELT, the lambda/kappa idea. `prod→enterprise` · `R S`
- **Data warehouses & lakes** ◻ — OLAP vs OLTP. `enterprise` · `R`
- **Pipelines & orchestration** ◻ — DAGs, idempotent jobs (reuses `idempotency`▣). `enterprise` · `R`
- **Analytics** ◻ (`AnalyticsSim`▣ / `/codex/observatory`). `enterprise` · `R S`

### D13 · AI / ML  *(domain id: `ai-ml`, ▣ exists)*

- **LLM transformer internals** ▣ (`/simulator/llm`) · **Embeddings & vector search** ▣ (`embeddings`) · **RAG** ▣ (`rag`)
- **What a neural network computes** ◻ (`status:"soon"`) — neurons, weights, forward pass. `local→prod` · `R S`
- **Training vs inference & cost** ◻ (`status:"soon"`) — gradient descent, GPUs, the bill. `prod→mnc` · `R S`
- **The ML math bridge** ◻ — links to D3 (linear algebra, calculus, probability). `prod` · `R`
- **Transformers & attention (the READ behind the `llm`▣ sim)** ◻. `enterprise` · `R S`
- **LLMs, prompting & fine-tuning** ◻ — context windows, RLHF intuition. `prod→enterprise` · `R`
- **MLOps** ◻ — model registry, drift, eval, serving. `enterprise→mnc` · `R`

### D14 · Security & Cryptography  *(domain id: `security`, ▣ exists)*

- **Auth — JWT/cookies/CSRF** ▣ (`auth`) · **Security world** ▣ (`/worlds/security`, `SecuritySim`)
- **Common attacks: XSS, SQLi, SSRF** ◻ (`status:"soon"`). `prod→enterprise` · `R S`
- **Secrets, rotation & least privilege** ◻ (`status:"soon"`). `prod→enterprise` · `R`
- **Threat modelling** ◻ (`status:"soon"`) — STRIDE, attack surface. `enterprise` · `R`
- **Cryptography basics** ◻ — hashing vs encryption, symmetric/asymmetric, signing (the *why* under JWT & TLS). `prod` · `R S`
- **AuthN/AuthZ patterns** ◻ — OAuth/OIDC, RBAC/ABAC, sessions vs tokens (deepens `auth`▣). `prod→enterprise` · `R`

### D15 · Software Craft  *(domain id: `craft`, new)*
*The discipline that makes the rest maintainable.*

- **Layers & separation of concerns** ▣ (`layers-and-separation`) · **State — one source of truth** ▣ (`state-management`)
- **Testing** ◻ — unit/integration/e2e, the pyramid, TDD, mocking. `local→enterprise` · `R P`
- **Design patterns** ◻ — the useful subset (factory, strategy, observer, repository — already lived in the codebase). `prod→enterprise` · `R`
- **SOLID & clean code** ◻ — naming, functions, cohesion/coupling. `prod→enterprise` · `R`
- **Refactoring** ◻ — code smells, safe transformations. `prod` · `R P`
- **Git & version control** ◻ — branching, merge vs rebase, PRs, conflicts. `local→enterprise` · `R S P`
- **Code review** ◻ — what to look for, how to give feedback. `enterprise` · `R`
- **Software architecture** ◻ — monolith vs microservices, hexagonal, event-driven, the **C4 model**. `enterprise→mnc` · `R S`

### D16 · Compilers & Language Theory  *(domain id: `theory`, new — depth domain)*

- **Lexing & parsing** ◻ — tokens, ASTs, grammars. `prod` · `R S`
- **Interpreters vs compilers** ◻ — deepens D0; pairs with `dart`▣ JIT/AOT. `prod` · `R`
- **Automata & computability** ◻ — regex engines, Turing machines (optional depth). `enterprise` · `R`
- **Type theory (gentle)** ◻ — what TypeScript/Rust types *are*. `enterprise` · `R`

### D17 · Career & Interview  *(domain id: `career`, new)*

- **The interview map** ◻ — DSA (→ D2) + system design (→ D10) + behavioural. `R`
- **System design interview** ◻ — the framework, back-of-envelope estimation. `R P`
- **Reading code & onboarding** ◻ — navigating a real codebase (Burger Farm *is* the exercise). `R P`
- **Engineering judgment** ◻ — the meta-lens: tradeoffs, "it depends," knowing when to stop. `enterprise` · `R`

**Coverage tally.** 18 domains, ~135 leaf topics. Today's repo lights up **~40 cells**
(30 tech articles + 10 codex chapters + ~10 sims, with overlap). The field map is roughly
**30% built** — and the map honestly shows the other 70% as `◻`, which *is* the roadmap
(Principle 7, "honest scaffolding," §01).

---

## Part B · The Depth Ladder, Per Topic, and the 4 Modes

### How the ladder applies to one topic

Every topic carries a `rungs` set (a subset of `DEPTH_LADDER` ids). The ladder is **not four
articles** — it is the **AT-SCALE lens (§01 lens 6)** *inside one article*. Worked example for
`caching`▣ (which today stops at the 4 base lenses):

| Rung | What the topic becomes | Mode it earns |
|---|---|---|
| **local** | A plain in-process `Map`, lost on restart — and that's fine. | READ + a tiny SEE |
| **prod** | Redis, TTLs, cache-aside; *now what about stale data?* | READ + SEE (`/simulator/scaling`) |
| **enterprise** | Shared cache across services, invalidation events, stampede locks. | READ + SEE |
| **mnc** | CDN edge + regional tiers, request coalescing, the thundering herd. | READ + SEE |

A topic is **shippable** when it covers its *lowest* rung with lenses 1–4 (§01 DoD). It is
**fully realized** when every rung in `rungs` is written across the AT-SCALE lens.

### Which subtopics get which mode (the assignment rule)

ASK is universal (the professor is grounded over every topic). The other three follow a rule:

| Mode | Surface | A topic earns it when… | Examples |
|---|---|---|---|
| **READ** | `app/codex/tech/[slug]` via `TechArticle.jsx` | **Always.** Every topic has a READ article — it's the floor. | all 30 today |
| **SEE** | `app/simulator/[name]` (a `*Sim.jsx`) | the lesson is a *behaviour over time* a sentence can't convey (a race, a climb, a fill-up). | `scaling`, `raft`, `cart-drift`, `llm`, `loyalty-ledger`, `order-journey`, `visualgo` ▣ |
| **PRACTICE** | `app/dsa/[slug]` or a sim-with-task | the skill is *doing*, with a self-evident success signal. | DSA problems ▣; "add a cache, watch p99 drop" challenges |
| **ASK** | `InlineRAGDrawer` / professor | **Always**, grounded by RAG over the corpus. | every page |

**The heuristic, once:** *READ for every concept; SEE when it moves; PRACTICE when you do it;
ASK whenever you're lost.* A topic's `tryIt` field (§01 lens 8) wires SEE→`tryIt.sim` and
PRACTICE→`tryIt.dsa`, so the modes are **data on the topic**, not separate trees.

---

## Part C · The Content Data Model (at scale)

### C.1 — The TOPIC schema (one object = one topic)

This **extends** the verified `tech-content` shape (§01 lens template) — additive, so all 30
existing articles keep working unchanged. New fields are progressive (`ready: true` needs only
the base set).

```js
// A single topic object. Backward-compatible superset of today's tech-content entries.
{
  // ── identity & placement (NEW fields marked) ──
  slug: "caching",
  title: "Caching",
  category: "Cross-cutting logic",        // existing; free-text label
  color: "teal",                          // existing; maps to TINTS in TechArticle.jsx
  tagline: "Compute once, serve many.",   // existing

  domain: "databases",        // NEW · which D0–D17 domain (id from domains.js)
  topicId: "caching",         // NEW · stable id for paths/mastery (defaults to slug)
  level: "L1",                // NEW · lowest learner level this reads at (§01 personas)
  difficulty: 2,              // NEW · 1–5, for sorting within a domain
  rungs: ["local","prod","enterprise","mnc"], // NEW · which DEPTH_LADDER ids it climbs
  prereqs: ["http-rest"],     // NEW · slugs; powers path order + "you may want X first"
  estMin: 9,                  // NEW · honest reading-time
  ready: true,                // NEW · shippable (lenses 1–4)?  realized = all 8 present
  modes: { read: true, see: "/simulator/scaling", practice: null }, // NEW · derived view

  // ── LENS 1 · WHAT (existing) ──
  oneLiner: "…", what: [ "…" ], analogy: { title: "…", body: "…" },

  // ── LENS 2 · WHY + alternatives/tradeoffs (existing + NEW tradeoffs) ──
  why: [ "…" ],
  alternatives: [ { name, note, tradeoff } ],   // tradeoff = NEW optional field
  tradeoffs: [ "the costs you accept: staleness, memory, invalidation" ], // NEW

  // ── LENS 3 · HOW (existing) ──
  insideTitle: "…", inside: [ { name, desc } ],
  howWeUse: { body: [ "…" ], refs: [ "apps/backend/…" ] },  // refs MUST cite real paths

  // ── LENS 4 · WHEN-IT-BREAKS (existing) ──
  breaks: "one story, never a checklist",

  // ── LENS 5 · HISTORY (NEW, progressive) ──
  history: "what we did before, and the pain that birthed this",

  // ── LENS 6 · AT-SCALE — the depth ladder, in place (NEW) ──
  atScale: { local: "…", prod: "…", enterprise: "…", mnc: "…" }, // keys ⊆ rungs

  // ── LENS 7 · HOW-THE-GIANTS-DO-IT (NEW, progressive) ──
  giants: [ { who: "Netflix", what: "EVCache, multi-region", why: "…" } ],

  // ── LENS 8 · NOW-YOU-TRY (NEW) ──
  tryIt: {
    sim: "/simulator/scaling",   // optional SEE link
    dsa: null,                   // optional PRACTICE link (a lib/dsa.js slug)
    selfCheck: [ "What happens to a cached value when the data changes?" ] // Mechanic A
  },

  // ── per-lens misconception (NEW, Mechanic B) ──
  misconception: "Most people think a cache is just 'faster storage'…",

  related: [ "http-rest", "concurrency", "scale" ]   // existing · the web of links
}
```

### C.2 — How it renders to routes

| Surface | Today | Change |
|---|---|---|
| `app/codex/tech/[slug]` | `generateStaticParams` reads `TECH_CONTENT` keys; `TechArticle.jsx` renders lenses 1–4. | **Upgrade `TechArticle.jsx`** to render lenses 5–8 *when present* (absent fields render nothing). Add `<AtScaleClimb>` (4-rung tabs reusing `DEPTH_LADDER`), `<GiantsRow>`, `<SelfCheck>`, and a `predict` variant of `Callout.jsx`. |
| `app/learn` | breadth grid from `domains.js`. | Add a **depth toggle** per card → expands the 4 rungs; add `domain` rollups computed from topics. |
| `app/learn/path/[id]` (new) | — | PATH mode from `lib/paths.js` (§01 §5). |
| `app/simulator/*` | `*Sim.jsx` components. | Linked *from* topics via `tryIt.sim` / `modes.see` — no new wiring, just data. |
| `app/dsa/*` | `DSA_PATTERNS`/`DSA_PROBLEMS`. | Linked via `tryIt.dsa`; keep its own richer schema (a different content type). |

**No new route file per topic.** A topic going live is still "add a key → it renders" — exactly
the property the repo already has (`tech-content.js` header: "Add a slug here → its page goes
live automatically; `generateStaticParams` reads these keys").

### C.3 — File/folder layout for hundreds of topics

Today everything is one 1,278-line `lib/tech-content.js`. That does not scale to ~135 topics.
**Split by domain, aggregate at the index:**

```
lib/content/
  index.js              // export const TOPICS = { ...all domain maps };  (the single map the
                        //   renderer + generateStaticParams consume — preserves today's API)
  _schema.js            // JSDoc typedef of the TOPIC object (authoring contract, lint target)
  cs-foundations.js     // export default { "how-a-computer-runs-code": {…}, … }
  languages.js          // dart, typescript, nodejs, python, go, rust, …
  systems.js · networking.js  // http-rest, json, dns, tls, …
  web.js                // nextjs, refine, rendering, css, a11y, …
  backend.js            // express, auth, realtime-sync, rate-limiting, …
  mobile.js             // flutter, dart, riverpod, dio, offline-first, …
  databases.js          // postgresql, prisma, sql, transactions, caching, …
  system-design.js      // scale, big-systems, idempotency, state-machines, ledgers, …
  devops-cloud.js       // deployment, ci-cd, docker, k8s, observability, cloud, …
  ai-ml.js              // embeddings, rag, neural-nets, transformers, …
  security.js · craft.js · data-eng.js · theory.js · career.js
lib/dsa.js              // KEEP — different schema; index just links it for PRACTICE
lib/paths.js            // §01 §5 — ordered ropes referencing topic slugs
lib/curriculum.js       // KEEP — but `TECH_SECTIONS` becomes a derived view of TOPICS by domain
lib/domains.js          // KEEP — `DOMAINS[].topics[]` derived from TOPICS (status ← `ready`)
```

**Migration is mechanical:** move the 30 existing entries into the right `lib/content/<domain>.js`,
re-export the union from `lib/content/index.js`, and point `tech-content.js` at it. `domains.js`
and `curriculum.js` become thin *projections* of `TOPICS` rather than hand-maintained parallel
lists — killing the "two-spines" drift risk. **Single source of truth: `lib/content/`.**

---

## Part D · Authoring Conventions & the Per-Article Template

### D.1 — The lens checklist (the author's definition of done)

For every topic, in this order (the order is the teaching — §01):

1. **WHAT** — `oneLiner` (a 12-year-old could follow it), then `what[]` (2–3 plain paras),
   then a **mandatory** `analogy`. *Plain language must land before any jargon.*
2. **WHY** — `why[]` (the problem), `alternatives[]` (each with a `tradeoff`), `tradeoffs[]`
   (the costs *this* choice accepts). Never "X is best" — always "X buys A at the cost of B."
3. **HOW** — `inside[]` (the parts you'll meet) + `howWeUse` with `refs[]` that **cite real
   Burger Farm paths** (`apps/backend/…`, `apps/mobile-app/lib/…`). The honesty anchor — every
   claim is checkable.
4. **WHEN-IT-BREAKS** — `breaks` is **one narrative story**, never a bullet list. The bad day
   teaches the lesson.
5–8. **HISTORY / AT-SCALE / GIANTS / NOW-YOU-TRY** — progressive; add as the topic matures.
   AT-SCALE keys must be a subset of `rungs`.

### D.2 — Inline markup conventions

- **Jargon → `[[term]]`** so `lib/fmt.jsx` → `Term.jsx` makes a tooltip. Use `[[id|text]]`
  when display text differs from the glossary id. The `idempotency`▣ entry already does this
  (`[[request|request]]`, `[[schema|schema]]`) — match that style. *Every* term-of-art on
  first use gets wrapped.
- **`` `code` ``** for identifiers/paths/commands; **`**bold**`** for the one key phrase per
  paragraph (per the `tech-content.js` header: markup is `code` and **bold**).
- **`refs[]`** are real repo paths with a `—` gloss: `"apps/backend/src/app.ts  — the entry point"`.
- **New glossary terms:** any `[[term]]` not yet in `lib/glossary.js` must be added there
  (`{term, def (1–2 beginner sentences), more?}`) in the same change — no dangling tooltips.

### D.3 — Diagram & simulator conventions

- **Prefer SEE over assertion** (Principle 5). If a claim is a behaviour over time (a race, a
  climb, an invalidation), point at a sim via `tryIt.sim`. Reuse existing sims before building
  new ones — inventory: `ScalingSim`, `RaftSim`, `CartDriftSim`, `LoyaltyLedgerSim`,
  `OrderJourney`, `AnalyticsSim`, `POSSim`, `SecuritySim`, `llm`, `visualgo`.
- **Every sim needs a text-equivalent** (a11y, §01 §7): the lesson stated in prose so a
  screen-reader user gets the same point. Honor `prefers-reduced-motion`.
- **Static diagrams** belong in the READ as `inside[]` cards or `FlowMap`/`Roadmap` components —
  consistent with `RoadmapFlowVertical.jsx`.

### D.4 — Voice (the constitution, §01)

Grade 8–9 reading level. Short sentences, active voice, concrete nouns. Idioms allowed **only**
in `analogy`, never in core `what`/`why`. Calm and adult — *welcome, not test.* Burger Farm
stays the one neutral, universal example world (food, orders, money).

---

## Part E · Mapping What Exists → The Master Map, and the Top Gaps

### E.1 — Where today's content lands

| Asset (real) | Count | Maps to | State |
|---|---|---|---|
| `TECH_CONTENT` tech articles | 30 | D1, D5–D11, D13, D14, D15 leaves | all `ready:true`, **lenses 1–4 only** |
| `CODEX_PARTS` chapters | 10 | become **guided paths** (§01 §5) over topics, not separate content | keep as paths |
| Simulators (`*Sim.jsx`, `app/simulator/*`) | ~10 | SEE mode for D9/D10/D13/D14 topics | wire via `tryIt.sim` |
| `DSA_PATTERNS` / `DSA_PROBLEMS` | 7 patterns | D2 PRACTICE | own schema, keep |
| `GLOSSARY` | ~70 | the `[[term]]` substrate under all READ | extend per new article |
| `RESOURCE_GROUPS` | several | the Library (`/codex/library`), per-domain "go deeper" | tag by `domain` |
| `domains.js` `status:"soon"` cells | 16 | **the prioritized gap queue** ↓ | build these first |

**The single biggest realization gap:** all 30 live articles stop at lenses 1–4. The
**AT-SCALE lens (6)** — the product's actual differentiator (§01 design note) — is written for
**zero** of them. The first content investment is *not* breadth; it's **adding `atScale` +
`tryIt.selfCheck` to the existing 30**, because that's where the felt "I watched a system grow"
magic lives, and the articles already exist.

### E.2 — Gaps to fill first (tied to `status:"soon"` flags)

**Tier 0 — deepen what's built (highest ROI, no new topics).**
1. Add `atScale{local,prod,enterprise,mnc}` to the ~12 topics that most reward it: `caching`,
   `scale`, `auth`, `transactions`, `concurrency`, `idempotency`, `postgresql`, `express`,
   `nodejs`, `docker`, `kubernetes`, `observability`.
2. Add `tryIt.selfCheck` + `misconception` to all 30 (cheap; unlocks Mechanics A & B from §01).

**Tier 1 — the 16 `soon` cells already on the map** (promises the UI is already showing):
- `databases`: **Sharding, replicas & NoSQL** → split into 3 topics (D9).
- `system-design`: **Queues, backpressure & sagas** (D10).
- `backend`: **Rate limiting & API gateways**, **gRPC/GraphQL/WebSockets** (D7).
- `web`: **CSS, layout & accessibility** → split CSS + a11y (D6).
- `mobile`: **Offline-first & sync** (D8).
- `cloud`: **Compute (VMs/containers/serverless)**, **Object storage & CDNs**, **Managed DBs
  & queues**, **Cost/regions/AZs** (D11).
- `ai-ml`: **What a neural network computes**, **Training vs inference & cost** (D13).
- `security`: **XSS/SQLi/SSRF**, **Secrets & least privilege**, **Threat modelling** (D14).

**Tier 2 — the missing foundations floor** (D0): the absolute-beginner cannot currently start
*below* the existing articles. Build **How a computer runs code**, **Memory: stack/heap**,
**Recursion**, **Big-O** — the prerequisites the "CS from scratch" path (§01) points at but
that don't yet exist. Without them, the floor has no floor.

**Tier 3 — the new comparative/breadth domains** (D1 languages beyond the 3, D3 math, D4
systems, D12 data-eng, D16 theory, D17 career) — fill steadily, status-honest, lowest urgency.

### E.3 — The build order, in one line

> **Deepen the 30 (AT-SCALE) → honor the 16 `soon` promises → lay the D0 foundations floor →
> grow breadth.** Depth before breadth, because the differentiator *and* the existing
> investment both live in depth.

---

## Appendix — what this section hands the rest of the plan

1. **One content source of truth:** `lib/content/<domain>.js` + `lib/content/index.js`, with
   `domains.js`/`curriculum.js` as *derived projections* (kills two-spine drift).
2. **The TOPIC schema** (Part C.1) — additive superset of `tech-content`; `TechArticle.jsx`
   must learn to render lenses 5–8 + the AT-SCALE climb, SelfCheck, Predict.
3. **The field map** (Part A) — 18 domains, ~135 topics — is the breadth contract; the
   `◻/▣` marks are the literal backlog.
4. **The gap queue** (Part E.2) — Tier 0 (deepen 30) → Tier 1 (16 `soon`) → Tier 2 (D0 floor)
   → Tier 3 (breadth) — is the content roadmap the AI/architecture sections build tooling for.
