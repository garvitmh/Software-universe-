// Backend & data, in depth.
// Each entry is rendered by components/TechArticle.jsx. Inline markup in strings:
//   `code`  and  **bold**.
// Pure data — no imports. An OBJECT keyed by slug. New kebab-case slugs only.
export const BACKEND_DEEP = {
  // ───────────────────────────── API GATEWAYS ─────────────────────────────
  "api-gateways": {
    slug: "api-gateways",
    title: "API gateways",
    category: "Backend",
    color: "amber",
    tagline: "The single front door every request walks through before it reaches any of your services.",
    oneLiner: "An API gateway is one entry point in front of your backend that routes each request to the right service and handles the cross-cutting jobs — auth, rate-limiting, TLS — in one place so every service doesn't reinvent them.",
    what: [
      "As soon as a system grows past one backend, clients face a problem: *which* server do I call, and how do I prove who I am to each one? An **API gateway** answers that by being the single public address clients talk to. It receives every request, figures out where it belongs, and forwards it on — clients never need to know how many services exist behind it or where they live.",
      "Beyond routing, a gateway is the natural home for the work that *every* request needs but no single service should own: terminating **TLS** (decrypting HTTPS), checking **auth** tokens, enforcing **rate limits**, adding a request-id for tracing, and logging. Doing these once at the edge means each service behind the gateway can stay focused on its actual job.",
      "A gateway can also **aggregate**: a mobile screen that needs the menu, the cart, and the user's points might make one call to the gateway, which fans out to three services and stitches the answers together — so the phone makes one round-trip instead of three over a slow network.",
    ],
    analogy: {
      title: "The front desk of an office tower",
      body: "Visitors don't wander the building knocking on doors. They come to one front desk, which checks their ID (auth), turns away anyone with no appointment (rate-limiting / blocking), and then directs them to the right floor and office (routing). The desk handles the rules every visitor faces, so each office upstairs can just do its work and trust that whoever walks in was already checked.",
    },
    insideTitle: "What a gateway does",
    inside: [
      { name: "Routing", desc: "Maps an incoming path (`/api/orders`) to the service that owns it, hiding the backend's internal shape from clients." },
      { name: "Auth & TLS termination", desc: "Decrypts HTTPS and verifies the caller's token once, at the edge, before any service sees the request." },
      { name: "Rate-limiting & throttling", desc: "Caps how fast any one client can call, protecting everything behind it from floods." },
      { name: "Aggregation", desc: "Calls several services for one client request and combines the results into a single response." },
      { name: "Cross-cutting plumbing", desc: "Adds request-ids, logs, collects metrics, and can cache hot responses — uniformly, for all traffic." },
    ],
    how: [
      "A request arrives at the gateway's public address over HTTPS. The gateway terminates TLS, reads the path and headers, and matches the request against its **route table** — a set of rules saying ‘paths starting `/api/menu` go to the menu service'. It may rewrite the path or add headers before forwarding.",
      "Before forwarding, it runs the **edge policies**: is the auth token valid? Has this client exceeded its rate limit? Is the request well-formed? A request that fails any of these is rejected here, so it never reaches — and never loads — a downstream service.",
      "For aggregation routes, the gateway fans out to several services in parallel, waits for them, and assembles one response. If a downstream service is slow or down, the gateway applies a **timeout** and can return a partial or fallback answer rather than hanging.",
    ],
    why: [
      "Without a gateway, every service has to implement auth, TLS, rate-limiting, and logging itself — and they'll do it slightly differently, leaving gaps an attacker can find. Centralising those concerns makes them consistent and auditable, and lets you change a policy (a new rate limit, a new auth scheme) in one place.",
      "It also decouples clients from your internal architecture. You can split one service into three, move them between machines, or rename internal paths — and as long as the gateway's public routes stay stable, no client ever notices. That freedom to reshape the backend is worth a lot.",
    ],
    alternatives: [
      { name: "Direct-to-service (no gateway)", note: "Simplest for one or two services; clients call them directly. Breaks down fast as services multiply and each must own its own edge concerns." },
      { name: "Reverse proxy (nginx/Envoy)", note: "A lighter front door that routes and terminates TLS but does less app-aware work; often *is* the gateway's engine underneath." },
      { name: "Service mesh", note: "Pushes routing/auth/retries *between* internal services (sidecars), complementing rather than replacing the public gateway." },
      { name: "BFF (backend-for-frontend)", note: "A per-client gateway tuned to one app's screens; great for aggregation, but one more service to run per client type." },
    ],
    whoUses: "Anyone running more than a couple of services. Platform and infrastructure teams own the gateway as shared plumbing; product teams register their service's routes with it. Managed versions (AWS API Gateway, Kong, Apigee, Cloudflare) are everywhere, and even a single-service app often puts a thin reverse proxy in front for TLS and rate-limiting.",
    bigPicture: "The gateway is where several earlier ideas converge into one box: it's where **rate-limiting** is enforced, where **auth** tokens are first checked, where **TLS** is terminated, and where **load balancing** spreads traffic across copies of a service. It's the seam between the public internet and your private backend — and the place you reach for first when you outgrow a single server.",
    prereqs: ["http-rest", "auth", "rate-limiting", "load-balancing"],
    projects: [
      "Put nginx in front of two tiny backend services and route `/a` to one and `/b` to the other from a single port.",
      "Add a rate limit and a request-id header at that nginx layer, then confirm both services receive the same id for one client request.",
      "Build an aggregation endpoint that fans out to two services in parallel and merges their JSON into one response.",
    ],
    breaks: "Make the gateway a single point of failure with no redundancy and the day it falls, *everything* falls — every service is unreachable even though they're all healthy. Forget timeouts on aggregation and one slow downstream service hangs every request that touches it. Put too much business logic in the gateway and it becomes a tangled bottleneck every team must edit and fear. The gateway should be thin, replicated, and ruthless about cross-cutting concerns only.",
    scale: "Local: no gateway — you call your one backend directly on localhost. Production: a single reverse proxy (nginx/Caddy) in front terminating TLS, rate-limiting, and routing to your app — already a real gateway. Enterprise: a clustered gateway (Kong/Apigee/Envoy) fronting dozens of services, with central auth, per-route policies, and a service mesh handling internal traffic. Planet-scale: gateways replicated in every region behind global anycast, so a request enters at the nearest edge, gets authed and rate-limited locally, and only the necessary calls travel further — the front door is everywhere at once.",
    related: ["rate-limiting", "load-balancing", "auth", "api-styles", "tls-https", "backend"],
  },

  // ─────────────────────────── CACHING STRATEGIES ───────────────────────────
  "caching-strategies": {
    slug: "caching-strategies",
    title: "Caching strategies",
    category: "Backend",
    color: "teal",
    tagline: "Not just *whether* to cache, but *how* reads and writes flow through the cache — and how each one can lie to you.",
    oneLiner: "Caching strategies are the named patterns — cache-aside, write-through, write-back — for deciding when data enters and leaves the cache, what to evict when it's full, and how to invalidate copies that have gone stale.",
    what: [
      "Once you've decided to cache (see **caching**), the real engineering question is *the flow*: when does data get into the cache, and when does a write update or remove it? Pick the wrong pattern and you'll serve stale prices, lose writes on a crash, or stampede your database the instant a popular key expires.",
      "There are three classic read/write patterns. **Cache-aside** (lazy): the app checks the cache; on a miss it reads the database, then stores the result for next time. **Write-through**: every write goes to the cache *and* the database together, so the cache is always fresh. **Write-back** (write-behind): writes go to the cache immediately and are flushed to the database later in a batch — fast, but risky if the cache dies before the flush.",
      "Two cross-cutting concerns sit on top of any pattern. **Eviction** decides what to throw out when the cache fills up (commonly **LRU** — least recently used). **Invalidation** decides when a cached copy is *wrong* and must go — the genuinely hard part, because nothing about the cached value itself tells you the source data changed underneath it.",
    ],
    analogy: {
      title: "A chef's prep station",
      body: "Cache-aside is grabbing an ingredient from the fridge only when an order calls for it, and prepping a fresh batch when the tray's empty. Write-through is updating the prep tray *and* the master recipe card at the same instant, so they never disagree. Write-back is scribbling changes on the tray all shift and copying them into the recipe book at closing — fast during service, but if the tray's wiped before closing, those changes are gone. And eviction is simply: when the station's full, you clear out what you've touched least recently.",
    },
    insideTitle: "The patterns & policies",
    inside: [
      { name: "Cache-aside", desc: "App reads cache, falls back to DB on a miss, then populates the cache. The most common, most flexible pattern." },
      { name: "Write-through", desc: "Writes hit cache and DB together; reads are always fresh, writes pay a small latency tax." },
      { name: "Write-back", desc: "Writes hit cache now, DB later in batches. Fastest writes, but unflushed data is lost if the cache crashes." },
      { name: "Eviction (LRU/LFU/TTL)", desc: "What to drop when full: least-recently-used, least-frequently-used, or simply ‘expire after N seconds'." },
      { name: "Invalidation", desc: "Removing or refreshing a key when the underlying data changes — by TTL, by explicit delete-on-write, or by event." },
    ],
    how: [
      "In **cache-aside**, a read is: look in the cache → hit, return it; miss, query the database, write the value into the cache with a TTL, return it. Writes simply update the database and **delete** the cached key (not update it), so the next read repopulates from truth. Deleting rather than updating avoids subtle races where two writers leave a wrong value behind.",
      "In **write-through**, the write path itself writes both stores in order, so a subsequent read can't miss. **Write-back** instead acknowledges the write once it's in the cache and queues the database flush — you trade durability for speed, and you accept that a crash can lose the most recent writes.",
      "When a hot key expires, many requests miss *at once* and all hammer the database — a **cache stampede**. The fixes: a short lock so only one request rebuilds the value while others wait, ‘stale-while-revalidate' (serve the old value while refreshing in the background), or jittered TTLs so keys don't all expire on the same tick.",
    ],
    why: [
      "Each pattern is a deliberate trade between freshness, write speed, and durability. Cache-aside is the default because it's simple and the cache never holds data the database doesn't — but it accepts a slow first read and a brief stale window. Write-through buys always-fresh reads at the cost of slower writes. Write-back buys blistering writes at the cost of possibly losing them. Knowing which you've chosen is knowing exactly which failure you've accepted.",
      "Eviction and invalidation matter because a cache is *finite* and *derivative*: it will always be too small to hold everything, and its contents are always a possibly-outdated copy of something else. Choosing the eviction policy decides what stays fast; choosing the invalidation rule decides whether ‘fast' is also ‘correct'.",
    ],
    alternatives: [
      { name: "Cache-aside", note: "Default. Simple, resilient (a cache outage just means slower reads), but accepts cold-miss latency and a stale window." },
      { name: "Write-through", note: "Reads always fresh; every write is a touch slower. Good when reads vastly outnumber writes and staleness is intolerable." },
      { name: "Write-back", note: "Fastest writes by far; risks losing recent writes on a cache crash. Reserve for tolerant, high-write workloads." },
      { name: "Read-through (managed)", note: "The cache library itself loads from the DB on a miss, hiding the fallback from your app — tidy, but ties you to that library." },
    ],
    whoUses: "Every read-heavy system at scale, from a single Redis in front of one database to multi-tier caches at the biggest platforms. Backend engineers pick the pattern per data type; the menu and config (read constantly, changed rarely) are textbook cache-aside, while a session store might be write-through.",
    bigPicture: "This is the depth beneath the **caching** concept: same idea, now with named flows and failure modes. The patterns interact with **transactions** (a write-back flush is a place consistency can slip), with **concurrency** (delete-vs-update on write avoids races), and with the **api-gateway** (which often caches hot responses at the edge). What to cache *where* — process memory, shared Redis, CDN — is a layering decision the gateway and CDN topics complete.",
    prereqs: ["caching", "sql", "concurrency"],
    projects: [
      "Implement cache-aside over a slow function: log every hit and miss, add a TTL, and watch the hit-rate climb as it warms up.",
      "Reproduce a cache stampede by expiring one hot key under concurrent load, then fix it with a single-rebuild lock.",
      "Compare write-through vs cache-aside for the same write workload and measure the latency difference on writes and on the first read after a write.",
    ],
    breaks: "Update the cache on write instead of deleting it, and a slow writer can stamp an old value over a newer one — a stale read that never self-heals. Choose write-back without understanding it and a cache crash silently loses the last minute of orders. Give every key the same TTL and they all expire together, stampeding the database at the same instant. Cache something user-specific under a shared key and one customer sees another's data. The pattern you didn't think about is the bug you'll ship.",
    scale: "Local: a plain in-memory map (cache-aside) inside your one process — gone on restart, and that's fine. Production: a shared Redis with cache-aside and sensible TTLs, plus delete-on-write invalidation so an admin price change is reflected on the next read. Enterprise: tiered caching — per-process L1 in front of a shared Redis L2 — with stampede protection, jittered TTLs, and event-driven invalidation fired from a message queue. Planet-scale: regional cache clusters plus a CDN at the edge, where the hard problem becomes keeping caches across continents coherent — usually solved by accepting bounded staleness rather than fighting for global freshness.",
    related: ["caching", "concurrency", "transactions", "object-storage-cdn", "message-queues"],
  },

  // ──────────────────────────── DATA MODELLING ────────────────────────────
  "data-modeling": {
    slug: "data-modeling",
    title: "Data modelling",
    category: "Databases",
    color: "teal",
    tagline: "Designing the shape of your data — the decision that quietly determines how easy or painful everything else will be.",
    oneLiner: "Data modelling is deciding what tables (or documents) you have, how they relate, and whether to keep data tidy and split (normalized) or duplicated for speed (denormalized) — driven by how your app will actually read and write it.",
    what: [
      "Before a single query is written, someone decides the **shape** of the data: what entities exist (a `User`, an `Order`, a `MenuProduct`), what fields each holds, and how they connect. This is data modelling, and it's the most consequential design decision in the backend — get the shape wrong and every query fights it forever; get it right and most features become easy.",
      "The central tension is **normalization vs denormalization**. *Normalized* data stores each fact exactly once and links to it (an order points to a customer id rather than copying the customer's name). It's tidy, avoids contradictions, and is easy to update — but answering a question may require **joining** several tables. *Denormalized* data deliberately duplicates facts (storing the customer's name *on* the order) so a read needs no join — faster to read, but now the name lives in two places and can drift.",
      "Modelling also means picking **relationships**: one-to-one, one-to-many (one order, many items), and many-to-many (which needs a join table). And crucially, it means designing around your **access patterns** — the specific reads and writes your app does most. A model optimised for the wrong access pattern is slow no matter how elegant it looks.",
    ],
    analogy: {
      title: "Filing a company's paperwork",
      body: "Normalized is keeping one master file per employee and, on every other document, just writing their staff number — change their address once and it's right everywhere, but to read a report you must cross-reference. Denormalized is photocopying the employee's full details onto every document — any single document is complete on its own and instant to read, but when they move house you must hunt down and fix every copy. Good filing systems do both, deliberately: master files for things that change, copies for things read constantly and rarely edited.",
    },
    insideTitle: "The building blocks",
    inside: [
      { name: "Entities & attributes", desc: "The nouns (`User`, `Order`) and their fields — the rows and columns you'll actually store." },
      { name: "Relationships", desc: "One-to-one, one-to-many, many-to-many (via a join table) — how the nouns connect by id." },
      { name: "Normalization", desc: "Each fact stored once, referenced by key. No duplication, no contradictions, but joins to read." },
      { name: "Denormalization", desc: "Duplicating data to avoid joins. Faster reads, but you own keeping the copies in sync." },
      { name: "Access patterns", desc: "The reads/writes your app does most. The model should make the common ones cheap." },
    ],
    how: [
      "Start from the **access patterns**, not the abstract entities: list the questions the app asks (‘this user's last 10 orders', ‘all items on this order') and the writes it makes. The model that makes those cheap is the right one — design the schema to fit the queries, not the other way round.",
      "Default to **normalized**: one table per entity, foreign keys linking them, so each fact has one home. Reach for **denormalization** only when a measured read is too slow because of expensive joins, or when a value is read far more than it's written — and accept that you now must keep the duplicate in sync (often via the same transaction or a background job).",
      "Encode the rules in the schema itself: foreign keys to enforce relationships, `NOT NULL` and `UNIQUE` constraints to make impossible states impossible, and indexes on the columns you filter and join by. A good model pushes correctness down into the database rather than hoping the app remembers it.",
    ],
    why: [
      "The data model outlives almost everything else. Code gets rewritten; the schema, once data is in it, is painful to change because every row must be migrated. A model that matches your access patterns makes features fast to build and queries fast to run; a mismatched one means awkward joins, slow reports, and contortions in every feature for years.",
      "Normalization vs denormalization is really a correctness-vs-speed dial. Normalized data can't contradict itself, which is why it's the default for anything you must trust. You denormalize *on purpose*, in specific spots, when the read speed is worth taking on the duty of keeping copies consistent — never by accident.",
    ],
    alternatives: [
      { name: "Relational / normalized", note: "Tables with foreign keys, third-normal-form. The trustworthy default; joins are the price of no duplication." },
      { name: "Denormalized / wide rows", note: "Duplicate to avoid joins; great for read-heavy, write-light data. You own the sync burden." },
      { name: "Document model", note: "Store related data nested together (a JSON document). Reads of one aggregate are one fetch; cross-document joins are weak." },
      { name: "Star schema (analytics)", note: "A deliberately denormalized shape — facts plus dimension tables — built for fast aggregation, not transactions." },
    ],
    whoUses: "Every backend and data engineer, on day one of any project. Product engineers model new features' tables; data engineers model warehouses for analytics; DBAs review schemas for missing indexes and constraints. ORMs like **Prisma** turn a model definition into the actual tables.",
    bigPicture: "Data modelling is the bridge between **sql** (how you query) and **postgresql** (where it lives), and it's expressed in code through **prisma**. The normalize/denormalize dial reappears at scale in **sharding** (a denormalized shard-friendly shape avoids cross-shard joins) and in **oltp-vs-olap** (transactional models are normalized; analytical ones are star-schema denormalized). Get this right and **transactions**, **indexes**, and even **caching** all become simpler.",
    prereqs: ["sql", "postgresql", "prisma"],
    projects: [
      "Model a tiny order system three ways — fully normalized, with the customer name denormalized onto the order, and as a single nested document — and write the same ‘list my orders' query against each.",
      "Take a normalized schema and add the indexes its real queries need; measure a join query before and after.",
      "Find a many-to-many relationship in a domain you know (students↔courses) and build the join table that models it.",
    ],
    breaks: "Model without thinking about access patterns and your most common query becomes a five-table join that crawls. Denormalize casually and the same customer name ends up spelled two ways in two tables with no way to know which is right. Skip foreign keys and constraints and you accumulate orphan rows — order items pointing at orders that no longer exist. Worst of all, ship the wrong model and discover it only after a million rows are in it, when fixing it means a risky, slow migration.",
    scale: "Local: one normalized schema, a handful of tables, foreign keys and a few indexes — clean and correct. Production: the same model with carefully chosen indexes for real queries and a couple of *deliberate* denormalizations where reads proved hot. Enterprise: the transactional (OLTP) model stays normalized, while a separate denormalized warehouse (OLAP, star schema) is fed from it for analytics, so reports never touch the live model. Planet-scale: the model is shaped for sharding — chosen so the common access pattern hits a single shard — and key data is denormalized along shard boundaries to avoid cross-shard joins entirely, trading purity for the ability to grow.",
    related: ["sql", "postgresql", "prisma", "oltp-vs-olap", "sharding", "database"],
  },

  // ──────────────────────────── OLTP vs OLAP ────────────────────────────
  "oltp-vs-olap": {
    slug: "oltp-vs-olap",
    title: "OLTP vs OLAP",
    category: "Databases",
    color: "teal",
    tagline: "Why the database that takes your orders is a terrible place to run reports — and why you build a second one.",
    oneLiner: "OLTP systems handle the many small, fast reads and writes of running the business (placing an order); OLAP systems handle the few huge analytical scans of understanding it (last quarter's revenue by region) — and they're built so differently that you separate them.",
    what: [
      "There are two utterly different jobs a database might do. **OLTP** — Online *Transaction* Processing — is the live workload: thousands of tiny operations like ‘insert this order', ‘read this user', ‘decrement this stock'. Each touches a few rows, must be fast and correct, and runs constantly. This is the database your app talks to.",
      "**OLAP** — Online *Analytical* Processing — is the opposite: a handful of enormous queries like ‘total revenue per store per month for the last two years'. Each scans millions of rows, aggregates them, and runs occasionally for a dashboard or a report. It doesn't write much; it *reads vast amounts*.",
      "The reason this matters is **storage layout**. OLTP databases store data **row by row** (the whole order together), which is perfect for ‘fetch one order'. OLAP systems store data **column by column** (all the revenue values together), which is perfect for ‘sum one column across millions of rows' and lets that column compress beautifully. The same data, laid out for opposite jobs — which is exactly why you can't do both well in one store.",
    ],
    analogy: {
      title: "The till versus the back-office spreadsheet",
      body: "The shop's till (OLTP) is built to ring up one customer fast, over and over, all day — it must never be slow or wrong, and it only ever handles one basket at a time. The accountant's back-office analysis (OLAP) pulls *every* sale from the whole year into a giant spreadsheet to find trends. You'd never make customers wait while the accountant runs the annual report on the till — so the sales get copied into a separate book built for exactly that kind of sweeping question.",
    },
    insideTitle: "The two worlds",
    inside: [
      { name: "OLTP (transactional)", desc: "Many small, fast reads/writes on a few rows each. Row-oriented storage. The live application database." },
      { name: "OLAP (analytical)", desc: "Few huge read-only scans aggregating millions of rows. Column-oriented storage. The reporting brain." },
      { name: "Row vs column store", desc: "Rows keep a record together (fast single-record fetch); columns keep a field together (fast aggregation + compression)." },
      { name: "Data warehouse", desc: "The OLAP store (BigQuery, Snowflake, Redshift) where historical data lands for analysis." },
      { name: "ETL / ELT pipeline", desc: "The job that copies and reshapes OLTP data into the warehouse, on a schedule or as a stream." },
    ],
    how: [
      "The live app reads and writes the **OLTP** database (your Postgres). On a schedule (or continuously), an **ETL/ELT** pipeline extracts the new and changed rows, transforms them into an analysis-friendly shape (a denormalized **star schema**), and loads them into the **warehouse** — the OLAP store.",
      "Analysts and dashboards then query the **warehouse**, never the live database. Because the warehouse is column-oriented, ‘sum revenue over two years grouped by region' reads only the few columns it needs, scans them compressed, and returns in seconds — a query that on the row-oriented OLTP database would lock resources and crawl.",
      "Keeping them separate also protects the live system: a runaway analytical query can't slow down checkout, because it's running on a completely different machine against a copy of the data, deliberately a little behind reality.",
    ],
    why: [
      "Running big analytics on your live OLTP database is the classic mistake: one heavy report scans millions of rows, saturates the database, and customers can't place orders while it runs. Separating the workloads means each runs on a system built for it, and neither starves the other.",
      "The storage layout is the deep reason they can't merge. Row stores make single-record transactions fast but column aggregations slow; column stores make aggregations fast but single-row writes slow. No single layout wins both, so the mature answer is two systems and a pipeline between them — correctness and speed on the transactional side, scale and insight on the analytical side.",
    ],
    alternatives: [
      { name: "One database for both", note: "Fine when tiny — run reports off-hours on the OLTP database. Stops working the moment analytics gets heavy or data gets large." },
      { name: "Read replica for reports", note: "Point analytics at a replica so the primary stays fast. Helps with isolation, but it's still row-oriented — big aggregations are still slow." },
      { name: "HTAP (hybrid) systems", note: "Newer engines that try to serve both workloads at once. Tempting, but specialised systems still win at the extremes." },
      { name: "Column store warehouse", note: "BigQuery/Snowflake/Redshift for OLAP. The standard once analytics matters; you accept running and feeding a second system." },
    ],
    whoUses: "Every company that wants to *understand* its data, not just run on it. Backend engineers own the OLTP database; data engineers build the pipelines and the warehouse; analysts and data scientists live in the OLAP world. Even a small product separates the two the first time a report threatens to slow the app.",
    bigPicture: "This is **data-modeling** taken to its conclusion: the OLTP side stays normalized for correct, fast transactions; the OLAP side is deliberately denormalized into a star schema for fast aggregation. The pipeline between them is where **message-queues** and streaming often live, and the warehouse is itself a heavily **sharded**, column-oriented database. It's the dividing line between ‘running the business' and ‘understanding the business'.",
    prereqs: ["sql", "data-modeling", "postgresql"],
    projects: [
      "Run a heavy ‘group by month, sum revenue' query against a row-oriented table of a million rows, then load the same data into a columnar store (DuckDB) and rerun it — compare the times.",
      "Write a tiny ETL script that copies yesterday's orders from your OLTP table into a denormalized reporting table shaped for one dashboard.",
      "Sketch a star schema for a coffee-shop's sales: one fact table and dimension tables for store, product, and date.",
    ],
    breaks: "Point the company dashboard straight at the live OLTP database and the first time someone opens it during lunch rush, every query slows and orders start timing out. Skip the warehouse and analysts write ever-heavier queries against production until one of them takes the site down. Or build the pipeline but forget it's *behind* reality, and someone treats a number that's six hours stale as live truth. Separation is what keeps fast-and-correct from colliding with big-and-insightful.",
    scale: "Local: one database does everything; you run a report query by hand when you're curious. Production: analytics moves to a read replica so reports stop competing with checkout, though big aggregations are still slow. Enterprise: a real column-oriented warehouse (BigQuery/Snowflake) fed by a nightly or streaming ETL pipeline, with a star-schema model and a BI tool on top. Planet-scale: a multi-region data platform — streaming ingestion into a sharded columnar warehouse plus a data lake of raw events — where the OLTP and OLAP worlds are entirely separate fleets, and the only thing crossing between them is the pipeline.",
    related: ["sql", "data-modeling", "sharding", "message-queues", "data-engineering-basics", "database"],
  },

  // ─────────────────────── DATABASE ISOLATION LEVELS ───────────────────────
  "database-isolation-levels": {
    slug: "database-isolation-levels",
    title: "Database isolation levels",
    category: "Databases",
    color: "teal",
    tagline: "How much two simultaneous transactions are allowed to see of each other's half-done work — and the bugs each setting lets through.",
    oneLiner: "Isolation levels are the dial — from read-uncommitted up to serializable — that trades speed for safety by deciding which concurrency anomalies (dirty, non-repeatable, and phantom reads) a transaction is allowed to suffer.",
    what: [
      "The **I** in ACID is *isolation*: the promise that concurrent transactions don't trip over each other's unfinished work. But perfect isolation is expensive, so databases offer a **dial** — several levels — letting you choose how much overlap you'll tolerate in exchange for more concurrency and speed.",
      "Each level is defined by which **anomalies** it prevents. A **dirty read** is seeing another transaction's write *before it commits* — it might still roll back, so you read a value that never officially existed. A **non-repeatable read** is reading the same row twice in one transaction and getting two different values because someone committed a change in between. A **phantom read** is running the same `WHERE` query twice and getting *different rows*, because someone inserted or deleted a row matching it.",
      "The four standard levels climb in strictness: **Read Uncommitted** (allows all three anomalies), **Read Committed** (blocks dirty reads), **Repeatable Read** (also blocks non-repeatable reads), and **Serializable** (blocks all of them — the result is *as if* the transactions ran one after another, never overlapping).",
    ],
    analogy: {
      title: "Reading a document someone else is editing",
      body: "Read Uncommitted is reading over someone's shoulder as they type — you might quote a sentence they delete a second later (a dirty read). Read Committed means you only ever see saved versions — but if they save twice while you're reading, the same paragraph changes under you (non-repeatable). Repeatable Read freezes your copy of every paragraph you've already read — but a brand-new paragraph they add can still appear if you re-scan the page (a phantom). Serializable hands everyone the document strictly one at a time: whatever you read stays exactly as it was, start to finish.",
    },
    insideTitle: "The levels & the anomalies",
    inside: [
      { name: "Read Uncommitted", desc: "Weakest. Permits dirty reads — you may see writes that later roll back. Rarely useful." },
      { name: "Read Committed", desc: "Only see committed data. Blocks dirty reads; non-repeatable and phantom reads still possible. Postgres's default." },
      { name: "Repeatable Read", desc: "Rows you've read won't change under you. Blocks dirty and non-repeatable reads; phantoms can still slip in (in theory)." },
      { name: "Serializable", desc: "Strongest. The outcome equals some serial order of the transactions — all three anomalies gone, at the cost of contention." },
      { name: "The three anomalies", desc: "Dirty (uncommitted), non-repeatable (row changed mid-transaction), phantom (row set changed mid-transaction)." },
    ],
    how: [
      "Databases enforce isolation in two broad ways. **Locking**: a transaction takes locks on what it reads and writes so others must wait — strong but contention-prone. **MVCC** (multi-version concurrency control, used by Postgres): each transaction sees a consistent **snapshot** of the data as of a point in time, while writers create new row versions, so readers never block writers and vice-versa.",
      "Under MVCC, **Read Committed** takes a fresh snapshot for each statement (so two reads can differ), while **Repeatable Read** takes one snapshot for the *whole* transaction (so reads are stable). **Serializable** adds extra checking on top: if it detects that the concurrent transactions couldn't have happened in any serial order, it aborts one with a serialization error — and your code must retry.",
      "You choose the level per transaction (`SET TRANSACTION ISOLATION LEVEL ...` or via your ORM). The right choice is the *weakest* level that still prevents the anomaly that would actually hurt this particular piece of logic — strong everywhere is needlessly slow.",
    ],
    why: [
      "Concurrency is unavoidable in any real system, and the anomalies aren't academic — a dirty read can show a balance that vanishes, a non-repeatable read can make a check pass then a write fail on stale assumptions, and a phantom can let two transactions both think they're booking the last seat. The isolation level is precisely how you decide which of these your logic must be protected from.",
      "It's a real trade-off, not a free ‘turn it to max'. Serializable everywhere serialises your throughput too — transactions wait or abort and retry, and a busy system grinds. The craft is matching the level to the stakes: Read Committed for ordinary reads, Serializable (or explicit locking) for the few operations where an anomaly would corrupt money or inventory.",
    ],
    alternatives: [
      { name: "Read Committed (default)", note: "The pragmatic baseline in Postgres/Oracle. Fast, blocks the worst anomaly (dirty reads); handle the rest case-by-case." },
      { name: "Serializable", note: "Correctness without thinking about anomalies — but you must retry serialization failures and accept lower throughput." },
      { name: "Explicit row locking", note: "`SELECT ... FOR UPDATE` to lock just the rows that matter, staying at a low level elsewhere. Surgical and common." },
      { name: "Optimistic concurrency", note: "A `version` column checked on write (see **concurrency**) — often a lighter alternative to high isolation for hot rows." },
    ],
    whoUses: "Every backend engineer who writes a transaction that could run concurrently with itself — which is almost all of them. DBAs tune defaults; engineers writing money, inventory, or booking logic explicitly raise the level or add row locks for the operations that demand it.",
    bigPicture: "This is the **I** of ACID made concrete — the depth beneath **transactions**. It's the database-engine answer to the same problem **concurrency** solves at the application level (with version counters and conditional updates): two of these tools, picked per situation. It also connects to **consistency-models** in distributed systems, where the same ‘how much can observers disagree?' question reappears across machines instead of within one database.",
    prereqs: ["transactions", "concurrency", "sql"],
    projects: [
      "Open two database sessions, set both to Read Uncommitted vs Read Committed, and reproduce a dirty read in one and watch it disappear in the other.",
      "Trigger a non-repeatable read at Read Committed, then raise to Repeatable Read and confirm the second read now matches the first.",
      "Force a serialization failure at Serializable with two conflicting transactions, then write the retry loop that recovers from it.",
    ],
    breaks: "Run a ‘check balance, then deduct' as two statements at Read Committed and two requests interleave — both read enough, both deduct, the balance goes negative. Assume Repeatable Read means your `COUNT(*)` is stable and a phantom row sneaks past your limit check. Crank everything to Serializable without a retry loop and the first burst of contention floods your app with unhandled serialization errors. The level you didn't think about is the anomaly that bites in production, never in testing.",
    scale: "Local: one user, no concurrency — the level is irrelevant and the default is fine. Production: real concurrent traffic, so you keep Read Committed broadly but raise to Serializable or add `FOR UPDATE` locks on the handful of money/inventory operations that can't tolerate an anomaly. Enterprise: isolation choices are reviewed per critical transaction, retry-on-serialization-failure is standard middleware, and hot rows move to optimistic concurrency to dodge lock contention. Planet-scale: a single database's isolation gives way to **distributed consistency** — the same ‘how much can observers disagree?' question now spans regions, where true serializability across continents is so costly that systems deliberately choose weaker, bounded models.",
    related: ["transactions", "concurrency", "consistency-models", "sql", "postgresql"],
  },

  // ─────────────────────────── CONNECTION POOLING ───────────────────────────
  "connection-pooling": {
    slug: "connection-pooling",
    title: "Connection pooling",
    category: "Backend",
    color: "amber",
    tagline: "Opening a fresh database connection per request is shockingly expensive — so you keep a small set open and lend them out.",
    oneLiner: "A connection pool keeps a fixed number of already-open database connections ready and hands them out to requests for the moment they need one, instead of paying the heavy cost of opening and closing a connection every single time.",
    what: [
      "Talking to a database isn't free to *start*: opening a connection means a TCP handshake, often a TLS handshake, then the database authenticating the user and allocating memory and a backend process for the session. That setup can take tens of milliseconds — far longer than the actual query — and the database can only hold a limited number of connections open at once before it runs out of memory.",
      "If every web request opened its own connection, did one quick query, and closed it, you'd pay that whole setup cost on every request and quickly exhaust the database's connection limit under load. A **connection pool** fixes this: at startup it opens a small, fixed set of connections and keeps them alive. A request **borrows** one, runs its query, and **returns** it to the pool — the connection is reused, not rebuilt.",
      "The pool has a **maximum size**. When all its connections are busy, a new request **waits** in a queue for one to free up (or times out). This is a feature, not a bug: it caps how many connections ever hit the database, turning a potential stampede into an orderly line.",
    ],
    analogy: {
      title: "A taxi rank, not buying a car per trip",
      body: "Imagine if every time you needed to cross town you bought a car, drove it, then scrapped it — absurdly wasteful, and the dealership would run dry. A taxi rank keeps a fixed fleet of cars idling and ready: you take one, ride, and return it for the next person. If all the taxis are out, you wait at the rank for one to come back. The connection pool is that rank — a small fleet of expensive-to-build connections, lent out and returned, never thrown away after one trip.",
    },
    insideTitle: "The moving parts",
    inside: [
      { name: "Pool size (min/max)", desc: "How many connections are kept open. Max caps the load on the database; min keeps some always warm." },
      { name: "Acquire / release", desc: "A request borrows a connection to run its query, then must return it — forgetting to is a leak." },
      { name: "Wait queue & timeout", desc: "When all connections are busy, requests queue; an acquire-timeout stops them waiting forever." },
      { name: "Idle & max-lifetime", desc: "Connections idle too long are closed; old ones are recycled, so the pool stays healthy." },
      { name: "Health checks", desc: "The pool validates a connection is still alive before lending it, dropping dead ones quietly." },
    ],
    how: [
      "On startup the application creates the pool, opening its minimum number of connections. When code needs the database, it calls **acquire**: the pool hands over an idle connection if one exists, otherwise it opens a new one (up to the max) or makes the caller **wait** in the queue.",
      "After the query, the code calls **release**, and the connection goes back to the pool — *still open* — ready for the next request. The pool periodically closes connections that have been idle too long or have lived past their maximum lifetime, and replaces any that have died, so callers almost always get a healthy connection instantly.",
      "Sizing the pool is the key decision. Too small and requests pile up waiting; too large and you overwhelm the database, which has its own hard connection cap. The right number is usually modest — far smaller than your request concurrency — because each query holds its connection only for milliseconds.",
    ],
    why: [
      "Pooling turns the per-request connection setup cost — the slowest part of touching the database — into a one-time startup cost. Reusing warm connections can be the difference between a query taking 2ms and 40ms, and it's often the single biggest, cheapest latency win in a backend.",
      "Just as importantly, the pool **protects the database**. A database has a strict ceiling on concurrent connections, and blowing past it brings the whole thing down for everyone. By capping connections at the pool's max and queueing the rest, the pool converts a traffic spike from a database-killing stampede into a manageable wait — backpressure, applied right at the data layer.",
    ],
    alternatives: [
      { name: "Connection per request", note: "Open and close every time. Simple, but pays full setup cost per request and exhausts the database under load." },
      { name: "One shared connection", note: "Reuse a single connection everywhere. No setup cost, but it serialises all queries and breaks under concurrency." },
      { name: "External pooler (PgBouncer)", note: "A dedicated process pooling connections in front of Postgres — essential when many app instances each have their own pool." },
      { name: "Serverless data proxy", note: "Managed pooling (RDS Proxy, Prisma Accelerate) for serverless functions that spin up too fast to hold a normal pool." },
    ],
    whoUses: "Effectively every backend that talks to a database. ORMs and drivers build pooling in (**Prisma** has one; node-postgres, JDBC, SQLAlchemy all pool), so engineers mostly *tune* it rather than build it. Platform teams add an external pooler like PgBouncer once many app instances each open their own pool against one database.",
    bigPicture: "Pooling sits between the application (**express**/**nodejs**, via **prisma**) and the database (**postgresql**), and it's where the database's hard connection limit meets the app's concurrency. It's a specific, crucial instance of the general ‘keep an expensive resource warm and reuse it' pattern — the same instinct behind **caching** and HTTP keep-alive — and the pool's wait queue is **backpressure** for the data layer, kin to what a **message-queue** does for slow work.",
    prereqs: ["postgresql", "prisma", "tcp-vs-udp"],
    projects: [
      "Benchmark 1,000 queries opening a fresh connection each time vs reusing a pool of 10, and measure the total time difference.",
      "Set a pool max of 2, fire 20 concurrent slow queries, and watch requests queue and then drain — observe the wait, then the throughput.",
      "Intentionally never release a connection in a loop and reproduce ‘pool exhausted' errors, then fix the leak.",
    ],
    breaks: "Set the pool too large and every app instance opens dozens of connections; ten instances and you've blown past Postgres's connection limit, refusing all new connections site-wide. Set it too small and requests queue behind a starved pool, adding latency that looks like a slow database but is really a slow *wait for a connection*. Forget to release a connection — leak it in an error path — and the pool slowly drains until nothing can talk to the database at all. And in serverless, where functions spin up faster than connections can be reused, a naive pool can exhaust the database in seconds without an external pooler.",
    scale: "Local: a tiny pool (a handful of connections) inside your one app process is plenty and invisible. Production: a tuned pool per app instance, sized against the database's connection cap, with acquire-timeouts so a saturated pool fails fast instead of hanging. Enterprise: many app instances mean an external pooler (PgBouncer) in front of the database does transaction-level pooling, so thousands of app-side ‘connections' fold down to a safe few hundred real ones. Planet-scale: regional databases each fronted by their own pooler tier, with serverless workloads routed through managed data proxies — the entire architecture organised around the truth that real database connections are a scarce, precious resource.",
    related: ["postgresql", "prisma", "tcp-vs-udp", "managed-services", "rate-limiting"],
  },

  // ──────────────────────────────── WEBHOOKS ────────────────────────────────
  webhooks: {
    slug: "webhooks",
    title: "Webhooks",
    category: "Backend",
    color: "amber",
    tagline: "Don't keep asking ‘did it happen yet?' — let the other system call you the instant it does.",
    oneLiner: "A webhook is a URL you register with another system so that, when an event happens there (a payment succeeds), it sends an HTTP request *to you* — push instead of poll — and the engineering is all in making that delivery reliable, verified, and safe to retry.",
    what: [
      "Often your system needs to know when something happens in *another* system — a payment provider confirms a charge, a shipping service marks a parcel delivered. The naive way is **polling**: ask ‘is it done yet?' every few seconds. That's wasteful (most answers are ‘not yet') and slow (you learn late). A **webhook** flips it: you give the other system a URL of yours, and *it* makes an HTTP POST to that URL the moment the event occurs.",
      "So a webhook is just an HTTP endpoint you expose, and the other system is the client calling it. Stripe finishes a payment → it POSTs a JSON event to `https://yourapp.com/webhooks/stripe`. You're now the *server* receiving someone else's *push*.",
      "The whole difficulty of webhooks is reliability and trust, because the call comes from outside. The network is flaky, so deliveries get **retried** — meaning the same event can arrive **twice**, so your handler must be **idempotent**. And anyone on the internet can POST to your URL, so you must **verify** the request really came from the sender (via a **signature**) before you believe a word of it.",
    ],
    analogy: {
      title: "A doorbell instead of peering out the window",
      body: "Polling is getting up every minute to peer out the window checking whether the delivery arrived — exhausting and usually pointless. A webhook is a doorbell: you fit one (register your URL), and the courier rings it the instant they arrive (the event push). But a stranger can ring your bell too — so before you open the door you check it's really the courier (verify the signature), and if the bell rings twice for one delivery you don't accept the parcel twice (idempotency).",
    },
    insideTitle: "The moving parts",
    inside: [
      { name: "Registered URL", desc: "The endpoint you give the sender; where it POSTs events. Often configurable per event type." },
      { name: "Event payload", desc: "The JSON the sender POSTs — what happened, when, and the data — usually with an event id." },
      { name: "Signature & secret", desc: "A hash of the payload signed with a shared secret, so you can prove the request is genuine and untampered." },
      { name: "Retries & acks", desc: "You return 2xx to acknowledge; if you don't, the sender retries with backoff — so events can repeat." },
      { name: "Idempotency key", desc: "The event id you record once-processed, so a re-delivered event is recognised and skipped." },
    ],
    how: [
      "You register your URL with the sender and store the **shared secret** they give you. When the event fires, the sender POSTs the JSON payload to your URL with a **signature header** — typically an HMAC of the raw body using that secret.",
      "Your handler must, *before trusting anything*, recompute the HMAC over the raw request body and compare it to the header. Only if they match is the request genuine. Then it checks the event's id against a store of already-processed ids; if it's seen it before, it returns 200 and does nothing (idempotency). Otherwise it does the work, records the id, and returns a **2xx** to acknowledge receipt — fast, before any slow processing, often by dropping the event onto a **queue**.",
      "If your endpoint is slow, errors, or is unreachable, the sender doesn't get its 2xx and **retries** — usually with exponential backoff over minutes or hours. That's exactly why duplicates happen and why acknowledging quickly (then processing async) keeps the sender from giving up or piling on retries.",
    ],
    why: [
      "Webhooks exist because polling doesn't scale and isn't timely: you'd either ask too often (wasting both systems' resources on ‘not yet') or too rarely (learning about the payment minutes late). Push delivery is instant and cheap — the sender does the work of telling you, exactly once per event, the moment it matters.",
      "The reliability machinery — signing, retries, idempotency — isn't optional ceremony; it's the cost of accepting a call from outside your trust boundary. Skip the signature and you'll act on forged events; skip idempotency and a routine retry will double-process a real one. Webhooks are easy to *receive* and genuinely hard to receive *correctly*.",
    ],
    alternatives: [
      { name: "Polling", note: "Repeatedly ask the other system for status. Dead simple, no public endpoint needed; wasteful and laggy at any real frequency." },
      { name: "WebSockets / SSE", note: "A held-open connection for a continuous stream of events to a client. Great for live UI; heavier than a webhook for occasional server-to-server events." },
      { name: "Message queue / event bus", note: "If both systems share infrastructure, publish to a queue instead of HTTP — more reliable, but requires shared plumbing." },
      { name: "Polling a changes feed", note: "Pull a cursor-based ‘what changed since X' endpoint. A robust middle ground when webhooks aren't offered." },
    ],
    whoUses: "Anyone integrating with an external service that emits events — payment providers (Stripe, PayPal), GitHub, Slack, shipping and SMS providers all push webhooks. Backend engineers build the receiving endpoints; the same pattern powers a company's *own* outbound webhooks when *they* are the system other apps integrate with.",
    bigPicture: "Webhooks are server-to-server **http-rest** in reverse, and they lean hard on two earlier ideas: **idempotency** (because retries make duplicates inevitable) and **message-queues** (the right place to hand off the work after a fast ack). The signature verification is applied **web-security** — proving authenticity across a trust boundary. They're the asynchronous, event-driven cousin of the live-connection **realtime-sync** you use toward the browser.",
    prereqs: ["http-rest", "idempotency", "auth"],
    projects: [
      "Expose a webhook endpoint locally (with a tunnel like ngrok), register it with Stripe's test mode, and log the events it pushes when you simulate a payment.",
      "Add HMAC signature verification and reject a request whose body you've tampered with by one byte.",
      "Make the handler idempotent by recording event ids, then replay the same event three times and confirm the work happens exactly once.",
    ],
    breaks: "Trust the payload without verifying the signature and an attacker POSTs a fake ‘payment succeeded' to your URL and gets free product. Skip idempotency and a perfectly normal retry processes the same order twice — a double charge or double fulfilment. Do slow work *before* returning 2xx and the sender times out, retries, and now you've got pile-ups and duplicates from your own slowness. Verify the signature against the *parsed* body instead of the raw bytes and valid events start failing mysteriously. Every one of these is a webhook handler that ‘worked in testing'.",
    scale: "Local: one endpoint behind a tunnel, processing events inline, logging as you go — fine for development. Production: verify every signature, return 2xx immediately and hand the event to a background **queue**, and dedupe by event id so retries are safe. Enterprise: a dedicated webhook-ingestion service fronting all providers, recording every raw event, enforcing idempotency centrally, and replaying failed deliveries from a dead-letter queue. Planet-scale: regional ingestion endpoints behind a gateway absorbing millions of events, persisting them durably the instant they arrive, then fanning the work out to many idempotent workers — and on the *sending* side, your own outbound-webhook system with per-subscriber retry, backoff, and signing.",
    related: ["http-rest", "idempotency", "message-queues", "realtime-sync", "web-security", "auth"],
  },
};
