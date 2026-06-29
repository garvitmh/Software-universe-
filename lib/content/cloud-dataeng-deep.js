// Cloud & data engineering, in depth.
// Each entry is rendered by components/TechArticle.jsx. Inline markup in strings:
//   `code`  and  **bold**.
// Pure data — no imports. An OBJECT keyed by slug. New kebab-case slugs only.
export const CLOUD_DATAENG_DEEP = {
  // ─────────────────────────── CLOUD NETWORKING ───────────────────────────
  "cloud-networking": {
    slug: "cloud-networking",
    title: "Cloud networking — VPCs, subnets, security groups",
    category: "Cloud",
    color: "blue",
    tagline: "Building a private, walled-off network inside someone else's data center — and deciding exactly what can talk to what.",
    oneLiner: "Cloud networking is the private network you carve out in the cloud (a VPC), split into subnets, fenced by security groups, and fronted by load balancers — so your servers can reach each other but the internet only reaches what you choose to expose.",
    what: [
      "When you rent servers in the cloud they don't just float on the open internet — you place them inside a **VPC (Virtual Private Cloud)**: your own isolated slice of the provider's network, with a private address range (like `10.0.0.0/16`) that nobody else can see or route to. It feels like your company's office network, except it lives in a rented data center.",
      "Inside the VPC you carve out **subnets** — smaller address ranges, usually one per availability zone. The crucial split is **public subnets** (machines that may receive internet traffic, like a load balancer) versus **private subnets** (databases and app servers that should never be directly reachable from outside). A machine in a private subnet can call out, but the internet cannot call in.",
      "What's actually *allowed* to flow is decided by **security groups** — per-machine firewalls that say ‘accept traffic on port 443 from anywhere, port 5432 only from the app servers'. They default to ‘deny everything', so you open holes deliberately. In front of it all sits a **load balancer**, the one public door that spreads incoming requests across your private app servers.",
    ],
    analogy: {
      title: "A gated corporate campus",
      body: "The VPC is the whole fenced campus with its own internal road system that outsiders can't drive on. Subnets are zones within it — a public lobby anyone can enter, and secured back offices staff reach only from inside. Security groups are the badge readers on each door: this door opens for anyone, that one only for engineering. The load balancer is the staffed reception desk out front — the single point where visitors are received and directed inward.",
    },
    insideTitle: "The pieces of a cloud network",
    inside: [
      { name: "VPC", desc: "Your isolated private network with its own address range; the boundary everything else lives inside." },
      { name: "Subnet", desc: "A slice of the VPC, tied to one availability zone. Public ones face the internet; private ones don't." },
      { name: "Security group", desc: "A per-resource firewall: a list of which ports accept traffic, and from which sources. Default-deny." },
      { name: "Load balancer", desc: "The public entry point that spreads incoming requests across healthy app servers in private subnets." },
      { name: "NAT & gateways", desc: "A NAT gateway lets private machines reach *out* (for updates) without being reachable *in*; an internet gateway connects public subnets." },
    ],
    how: [
      "You create a VPC with an address block, then split it into subnets — typically a public and a private subnet in each of two or three availability zones, so a single data-center failure doesn't take the whole tier down. **Route tables** decide where traffic goes: public subnets route to an internet gateway, private subnets route outbound through a NAT gateway.",
      "You attach **security groups** to each resource. The load balancer's group accepts `443` from the world; the app servers' group accepts traffic *only* from the load balancer's group; the database's group accepts `5432` *only* from the app servers' group. Each layer can talk to the next and nothing skips ahead — a chain of least privilege.",
      "A request from a user hits the load balancer in a public subnet, which forwards it to an app server in a private subnet, which queries the database in another private subnet. The database has no public address at all, so even a leaked password can't be used from the open internet.",
    ],
    why: [
      "The alternative — every server with a public IP and a hand-managed firewall — means one misconfigured machine is directly exposed to the entire internet, and there's no clean boundary to reason about. A VPC gives you a *default-private* posture: nothing is reachable until you deliberately route and open it, which is exactly the right default for security.",
      "It also makes the network match the architecture. Tiers (web / app / data) map to subnets and security groups, so ‘the database is only reachable by the app' stops being a hope and becomes an enforced rule. And spreading subnets across availability zones is what makes the whole system survive losing a data center.",
    ],
    alternatives: [
      { name: "Flat public networking", note: "Give every box a public IP and a firewall. Simple for one server, a sprawling attack surface as you grow." },
      { name: "Service mesh / private links", note: "Push connectivity and policy *between* services (sidecars, private endpoints); complements the VPC rather than replacing it." },
      { name: "Provider default VPC", note: "Every account ships with a default VPC so you can start instantly — fine for experiments, too permissive for production." },
      { name: "Zero-trust networking", note: "Stop trusting the network at all — authenticate every call regardless of where it came from. The modern direction; more work to adopt." },
    ],
    whoUses: "Every team that runs more than a toy app in the cloud. Platform and infrastructure teams own the VPC layout, subnets, and security-group policy as shared plumbing; product teams deploy into it. Managed platforms (Vercel, Render, Fly) hide all of this — which is exactly why small teams reach for them until they need the control a hand-built VPC gives.",
    bigPicture: "Cloud networking is the private foundation everything else sits on: **cloud compute** (your VMs and containers) lives inside subnets, **load balancing** is the public door, **managed services** like databases are placed in private subnets and exposed only to your app, and **edge computing** sits *in front* of the VPC near users. It's the layer that turns ‘some rented servers' into a real, defensible system.",
    prereqs: ["cloud", "cloud-compute", "load-balancing"],
    projects: [
      "Create a VPC with one public and one private subnet, put a web server in the public subnet and a database in the private one, and prove the database has no route from the internet.",
      "Write security groups so the web tier accepts `443` from anywhere but the database accepts `5432` only from the web tier's group — then confirm a direct connection from your laptop to the database is refused.",
      "Add a NAT gateway and show a private-subnet server can `apt update` (reach out) while still being unreachable from outside.",
    ],
    breaks: "Put a database in a public subnet ‘just to test' and you've exposed it to the whole internet — a classic breach origin. Open a security group to `0.0.0.0/0` on the wrong port and the firewall is decorative. Forget that security groups are default-deny and your services silently can't reach each other, with no error pointing at the network. Stuff everything in one subnet in one availability zone and a single data-center outage takes you fully down. The discipline: default-private, least-privilege groups, and multi-AZ from day one.",
    scale: "Local: no network at all — everything talks over `localhost` on your laptop. Production: one VPC, public and private subnets across two availability zones, security groups enforcing web→app→data, a load balancer out front. Enterprise: many VPCs (per team, per environment) peered or hub-and-spoked together, centralized egress and inspection, private links to managed services so traffic never touches the public internet. Planet-scale: VPCs in every region, global load balancing steering users to the nearest one, and a zero-trust overlay where the network is no longer trusted on its own — every call is authenticated end to end.",
    related: ["cloud", "cloud-compute", "load-balancing", "managed-services", "edge-computing", "observability"],
  },

  // ─────────────────────────── EDGE COMPUTING ───────────────────────────
  "edge-computing": {
    slug: "edge-computing",
    title: "Edge computing",
    category: "Cloud",
    color: "blue",
    tagline: "Running your code on servers close to the user instead of in one far-away data center — so the round-trip is short.",
    oneLiner: "Edge computing moves computation out to the hundreds of points-of-presence near users (the same network that powers CDNs), so the work happens metres away instead of an ocean away — turning a CDN from something that only caches into something that also computes.",
    what: [
      "A normal app runs in one (or a few) data centers. A user in Sydney calling a server in Virginia eats a ~200ms round-trip *per request*, no matter how fast the server is — the speed of light is the bottleneck. **Edge computing** fixes this by running your code in the **points-of-presence (PoPs)** a CDN already operates all over the world, so the user is served from a machine in their own city.",
      "You already met this network as a **CDN** that *caches* static files near users. Edge computing is the next step: the same edge nodes can now *run logic* — rewrite a request, check an auth token, personalize a page, do an A/B split, call a nearby database — not just hand back a cached file. The edge stops being a dumb cache and becomes a thin compute layer.",
      "Edge runtimes are deliberately constrained: tiny, fast-starting environments (often based on V8 isolates rather than full containers) with strict CPU and memory limits and no long-lived local disk. You trade the power of a full server for the ability to run *everywhere at once*, instantly, with no cold-start penalty worth mentioning.",
    ],
    analogy: {
      title: "Local branch offices vs one head office",
      body: "If every customer query had to be mailed to a single head office across the country and back, even instant answers would feel slow because of the postage time. Edge computing opens a small branch office in every town — staffed lightly, unable to do the heavy back-office work, but able to handle the common questions on the spot. Only the rare request that truly needs head office gets forwarded; everyone else is served locally in seconds.",
    },
    insideTitle: "What runs at the edge",
    inside: [
      { name: "Point-of-presence (PoP)", desc: "An edge location near users — the same global footprint a CDN uses to cache files." },
      { name: "Edge function", desc: "A small, fast-starting piece of code (V8 isolate / WASM) that runs at the PoP on each request." },
      { name: "Edge cache", desc: "The original CDN job — storing responses near users — now programmable from your edge code." },
      { name: "Origin", desc: "Your real backend in a central region; the edge calls it only when it can't answer locally." },
      { name: "Edge data", desc: "Replicated key-value stores at the edge so functions can read config or session data without a long trip to origin." },
    ],
    how: [
      "You deploy a small function to the platform (Cloudflare Workers, Vercel Edge, AWS Lambda@Edge). The platform pushes that code to *every* PoP automatically. When a user makes a request, it lands at the nearest PoP, your function runs there in a sub-millisecond-to-start isolate, and it can respond immediately — set a cookie, redirect, rewrite headers, serve a cached or personalized page.",
      "If the function needs something it can't compute locally — a database write, a complex query — it calls back to the **origin** in a central region. The art of edge design is doing as much as possible at the edge (the latency-sensitive, read-mostly work) and forwarding only what genuinely must reach the center.",
      "Because the same code runs in hundreds of places at once, edge functions are constrained: short execution budgets, limited memory, no reliable local state between requests. State lives in edge-replicated stores or back at the origin, and the function stays small and stateless.",
    ],
    why: [
      "Latency is felt, not measured — a page that responds in 50ms feels alive while one at 300ms feels sluggish, and for a global audience the *distance* dominates that number. Doing auth checks, redirects, personalization, and caching at the edge cuts the round-trips that matter most, and it offloads the origin so your central servers do far less work.",
      "It also improves resilience and cost: the edge absorbs traffic spikes and attacks before they reach your origin, and serving from a nearby cache is far cheaper than recomputing in one region for the whole planet. The trade is a constrained runtime and a harder mental model — your code now runs in many places with no shared memory.",
    ],
    alternatives: [
      { name: "Central region only", note: "Run everything in one place. Simplest to reason about; distant users pay the round-trip on every request." },
      { name: "Multi-region origin", note: "Full backends in several regions. More power than the edge, far more cost and operational complexity to keep in sync." },
      { name: "Plain CDN (cache only)", note: "Cache static files near users but compute nothing. Great for assets; can't personalize or run logic." },
      { name: "Client-side logic", note: "Push work into the browser instead of the edge. No server cost, but limited by the device and unsafe for secrets." },
    ],
    whoUses: "Anyone serving a global audience who cares about latency: media sites, e-commerce, SaaS dashboards, and APIs. Frontend and platform teams use it for auth at the edge, A/B testing, geo-routing, and personalization; Cloudflare, Vercel, Fastly, and AWS make it a few lines of config. It's increasingly the default place to put the ‘first touch' of a request, with the heavy backend left in a central region.",
    bigPicture: "Edge computing is the programmable evolution of the **object storage & CDN** layer, and it sits *in front of* your **cloud networking** — a request hits the nearest edge PoP before it ever reaches your VPC and origin. It pairs naturally with **caching** (the edge is where caching lives geographically) and with **load balancing** (global edge routing is load balancing across regions). Think of it as the outermost ring of the system, closest to the user.",
    prereqs: ["object-storage-cdn", "cloud", "caching"],
    projects: [
      "Deploy an edge function that redirects users to a country-specific page based on the request's geo headers, and confirm it responds from a PoP near you.",
      "Move an auth-token check to the edge so unauthenticated requests are rejected before they ever reach your origin server.",
      "Build an edge A/B test that assigns a variant via a cookie at the edge and caches each variant near users, then measure the latency drop versus doing it at the origin.",
    ],
    breaks: "Treat an edge function like a full server — pull in a heavy library or do a long computation — and it blows the CPU/memory budget and fails under load. Assume local state persists between requests and you get baffling bugs, because the next request may hit a different PoP entirely. Forget that the edge still has to call origin for writes and you build something ‘fast' that's actually slow on every write. Cache personalized content at the edge by mistake and one user sees another's data. The edge rewards small, stateless, read-mostly logic and punishes everything else.",
    scale: "Local: there is no edge — your function runs once, on your laptop. Production: a single managed edge function (Workers/Vercel Edge) handling redirects, auth checks, and caching in front of one central origin. Enterprise: many edge functions across PoPs running personalization, A/B tests, and geo-routing, with edge-replicated config and a central origin per region behind them. Planet-scale: the edge becomes a real compute tier — hundreds of PoPs, edge-resident data stores, requests resolved entirely at the edge for the common case, and the origin reduced to the system of record that the edge only occasionally consults.",
    related: ["object-storage-cdn", "cloud", "caching", "load-balancing", "cloud-networking", "rendering"],
  },

  // ─────────────────────────── STREAM PROCESSING ───────────────────────────
  "stream-processing": {
    slug: "stream-processing",
    title: "Stream processing — batch vs stream",
    category: "Data Engineering",
    color: "teal",
    tagline: "Processing events the moment they arrive, continuously, instead of collecting them and crunching the pile later.",
    oneLiner: "Stream processing handles data as an unbounded, never-ending flow — computing results over rolling time windows as each event lands — where batch processing waits, collects a finite chunk, and processes it all at once.",
    what: [
      "There are two fundamentally different ways to process data. **Batch** processing collects a *bounded* set — yesterday's orders, this month's logs — and runs a job over the whole pile at once: simple, efficient, but the answer is always as old as the batch interval. **Stream** processing treats data as an *unbounded* flow and computes results continuously, updating as each new event arrives, so the answer is always seconds fresh.",
      "The hard part of streaming is that the data never ends, so ‘compute the total' is meaningless — total *over what*? The answer is **windows**: you slice the endless stream into chunks of time. A **tumbling window** is fixed, non-overlapping buckets (‘count per minute'); a **sliding window** overlaps (‘count over the last 5 minutes, updated every minute'); a **session window** groups bursts of activity separated by gaps.",
      "Two notions of time make it subtle. **Event time** is when something actually happened; **processing time** is when your system saw it. Events arrive late and out of order (a phone was offline), so a good stream processor waits a bounded grace period — tracked by a **watermark** — before declaring a window closed, balancing freshness against correctness.",
    ],
    analogy: {
      title: "Counting cars: a toll-booth tally vs a monthly traffic report",
      body: "Batch processing is the monthly traffic report — at month's end, someone adds up every car that passed and publishes the figure. Accurate, complete, and a month stale. Stream processing is the toll booth's live counter, ticking up the moment each car drives through, always showing ‘cars in the last hour' right now. The toll booth even handles a car that radioed in late: it knows roughly how long to wait (the watermark) before finalizing the hour's count.",
    },
    insideTitle: "The streaming concepts",
    inside: [
      { name: "Unbounded stream", desc: "A never-ending sequence of events (clicks, sensor readings, orders) processed as it flows, not collected first." },
      { name: "Window", desc: "A slice of the stream by time — tumbling (fixed), sliding (overlapping), or session (gap-delimited) — that gives ‘over what' an answer." },
      { name: "Event time vs processing time", desc: "When it happened vs when you saw it. Late, out-of-order arrivals make these diverge." },
      { name: "Watermark", desc: "A moving ‘we've probably seen everything up to time T' marker that decides when a window is safe to close." },
      { name: "State & checkpointing", desc: "Running aggregates the processor keeps in memory, snapshotted periodically so it can recover exactly where it left off after a crash." },
    ],
    how: [
      "Events flow in from a log or queue (often **Kafka**). The stream processor (Flink, Spark Structured Streaming, Kafka Streams) reads them, assigns each to one or more windows by its event time, and maintains running **state** per window — a count, a sum, a join. As the watermark advances past a window's end, the processor emits that window's final result and frees its state.",
      "To survive failures without double-counting, processors **checkpoint**: they periodically snapshot all in-flight state plus their position in the input. On a crash they restore the last snapshot and replay from that offset, which — combined with idempotent or transactional output — gives **exactly-once** results: every event affects the answer once, despite crashes and retries.",
      "Late events that arrive after the watermark are handled by policy: dropped, sent to a side output, or used to *update* an already-emitted window (a correction). The engineer tunes the watermark delay to trade timeliness (close windows fast) against completeness (wait for stragglers).",
    ],
    why: [
      "Batch is fine when ‘yesterday's numbers' are good enough — billing, reporting, training a model. But fraud detection, live dashboards, alerting, and personalization need the answer *now*, and re-running a batch every few seconds is wasteful and still laggy. Streaming computes incrementally on each event, so latency drops from hours to milliseconds and you do far less redundant work.",
      "The cost is real complexity: out-of-order data, exactly-once semantics, state that must be checkpointed, and windows you have to reason about carefully. Many mature systems run *both* — a streaming path for fresh-but-approximate answers and a batch path for complete-but-late ground truth — which is the heart of the lambda/kappa architecture debate.",
    ],
    alternatives: [
      { name: "Batch processing", note: "Collect a finite chunk and process it all at once. Simpler and cheaper per record; always as stale as the interval." },
      { name: "Micro-batch", note: "Tiny, frequent batches (e.g. every few seconds) that approximate streaming with simpler mechanics; Spark's classic model." },
      { name: "Database triggers / CDC", note: "React to row changes in a database directly. Fine for modest volumes; doesn't scale to high-throughput event flows." },
      { name: "Request-time computation", note: "Don't pre-process at all — compute on read. Simplest, but slow and expensive for heavy aggregations under load." },
    ],
    whoUses: "Data and platform engineering teams building anything that must react in seconds: fraud and anomaly detection, real-time dashboards and metrics, recommendation and personalization pipelines, IoT and telemetry, and live ETL that keeps a warehouse fresh. Apache Flink, Kafka Streams, and Spark Structured Streaming are the common engines; managed versions (Kinesis Data Analytics, Dataflow, Confluent) lower the operational bar.",
    bigPicture: "Stream processing sits downstream of **Kafka and event streaming** (the durable log it reads from) and feeds **data lakes and warehouses** (where results land for analytics). It's the real-time counterpart to **ETL pipelines** — same goal of moving and transforming data, but continuous rather than scheduled. It also leans on the same **idempotency** and exactly-once thinking that **message queues** demand, just generalized to high-throughput, stateful computation over time.",
    prereqs: ["message-queues", "data-engineering-basics", "kafka-and-event-streaming"],
    projects: [
      "Read a stream of fake ‘click' events from a Kafka topic and compute a count per 1-minute tumbling window, printing each window's total as it closes.",
      "Inject out-of-order events with old timestamps and watch how a watermark delay of 0 vs 30 seconds changes which events make it into their correct window.",
      "Compare a batch job that recomputes a daily total from scratch against a streaming job that maintains the same total incrementally, and measure the difference in latency and work done.",
    ],
    breaks: "Pick processing time instead of event time and your ‘per-minute' counts smear whenever ingestion lags — the numbers become meaningless during a backlog. Set the watermark too tight and you silently drop every late event; too loose and your dashboards lag. Forget checkpointing and a single crash either loses results or double-counts them. Let per-key state grow without bound (a window that never closes, a key that never expires) and the processor runs out of memory. Streaming is powerful only when time semantics, watermarks, and state lifetime are chosen deliberately.",
    scale: "Local: a single-threaded loop reading events from a file and bucketing them by minute — streaming in miniature. Production: one stream-processing job (Flink/Kafka Streams) reading a topic, computing windowed aggregates with checkpointing to recover from crashes, writing results to a database. Enterprise: many jobs across a managed cluster, partitioned by key for parallelism, with exactly-once sinks into a warehouse and careful watermark tuning per source. Planet-scale: globally distributed pipelines ingesting millions of events per second, regional processors with cross-region state replication, and a blended batch+stream architecture so live answers and complete answers coexist.",
    related: ["kafka-and-event-streaming", "etl-pipelines", "data-engineering-basics", "message-queues", "data-lakes-and-warehouses", "oltp-vs-olap"],
  },

  // ─────────────────────────── ETL PIPELINES ───────────────────────────
  "etl-pipelines": {
    slug: "etl-pipelines",
    title: "ETL & data pipelines",
    category: "Data Engineering",
    color: "teal",
    tagline: "The plumbing that moves data out of the systems that produce it, reshapes it, and lands it where analysts and models can use it.",
    oneLiner: "An ETL pipeline extracts data from source systems, transforms it into a clean, consistent shape, and loads it into a destination (usually a warehouse) — orchestrated as a dependency graph of steps that runs on a schedule or in response to events.",
    what: [
      "Data is born scattered — in your app's database, in third-party APIs, in log files, in spreadsheets — and in shapes built for *transactions*, not *analysis*. A **pipeline** is the repeatable process that collects it, cleans and reshapes it, and delivers it somewhere useful. The classic name is **ETL**: **Extract** from the sources, **Transform** into a clean model, **Load** into the destination.",
      "A newer ordering, **ELT** (Extract, Load, Transform), flips the last two: dump the raw data into a powerful warehouse *first*, then transform it *inside* the warehouse using SQL. This won out for cloud warehouses because their compute is cheap and elastic — it's easier to load everything raw and transform later than to perfectly shape it in flight, and you keep the raw data for re-processing.",
      "The transform step is where the real work lives: deduplicating, fixing types and time zones, joining sources, handling nulls, and modeling the data (e.g. into facts and dimensions). And because real pipelines have many interdependent steps, they're expressed as a **DAG** (directed acyclic graph) — step B runs only after step A succeeds — and run by an **orchestrator** that schedules, retries, and monitors them.",
    ],
    analogy: {
      title: "A bottling plant for raw ingredients",
      body: "Raw produce arrives from many farms in crates of all shapes (extract). The plant washes it, sorts it, cuts it to standard size, and discards the bad pieces (transform), then fills, labels, and stacks uniform bottles on the right shelf (load). A floor manager makes sure washing finishes before bottling starts, restarts a stalled machine, and raises an alarm if a batch is contaminated (orchestration). ELT is the same plant that stores the raw crates first and processes them on demand.",
    },
    insideTitle: "The stages and the machinery",
    inside: [
      { name: "Extract", desc: "Pull data from sources — databases (often via CDC), APIs, files, event streams — without overloading the source system." },
      { name: "Transform", desc: "Clean, type-fix, deduplicate, join, and model the data into the shape analysis needs. Where most bugs and value live." },
      { name: "Load", desc: "Write the result into the destination — a warehouse, lake, or serving database — incrementally where possible." },
      { name: "Orchestrator", desc: "Schedules the DAG of steps, enforces dependencies, retries failures, and alerts on breakage (Airflow, Dagster, Prefect)." },
      { name: "Idempotency & backfill", desc: "Each run must be safely re-runnable, and you must be able to re-process historical data when logic changes." },
    ],
    how: [
      "The orchestrator triggers the pipeline on a schedule (‘every hour') or an event (‘a new file landed'). The **extract** step reads from sources — for databases, often via **change data capture (CDC)**, which streams row-level changes rather than re-reading the whole table. Extracted data lands in a staging area, frequently raw, in object storage or a warehouse stage.",
      "The **transform** step applies the business logic: cleaning, joining, and modeling. In ELT this is SQL running inside the warehouse (commonly managed with a tool like dbt that versions and tests the transformations). The **load** step writes the final tables, ideally **incrementally** — only the new or changed rows — so a daily run doesn't rewrite years of history.",
      "Around all of it, the orchestrator handles the messy reality: a step fails, so it retries; a source is late, so dependents wait; today's run must be **idempotent** so a retry doesn't double-load; and when transform logic changes, a **backfill** re-runs the pipeline over historical data to correct it. Good pipelines also test data quality (row counts, nulls, freshness) and fail loudly when something looks wrong.",
    ],
    why: [
      "Without a pipeline, analysts query the production database directly — slowing the app, seeing transaction-shaped data that's painful to analyze, and getting inconsistent answers because everyone cleans it differently. A pipeline does the cleaning *once*, centrally, into a model built for analysis, so the whole company works from the same trustworthy numbers.",
      "It also makes data *reliable and repeatable*: scheduled, monitored, retried, and versioned, instead of a fragile script someone runs by hand. The cost is real infrastructure and ongoing maintenance — pipelines break when sources change shape — which is why observability and testing matter as much as the transforms themselves.",
    ],
    alternatives: [
      { name: "ELT (load first, transform in warehouse)", note: "The modern default for cloud warehouses — keep raw data, transform with SQL on elastic compute. ETL still wins when you must shape data before it lands." },
      { name: "Query the source directly", note: "No pipeline at all. Fine for tiny scale; hammers production and gives inconsistent, transaction-shaped data as you grow." },
      { name: "Streaming pipeline", note: "Continuous instead of scheduled (see stream processing). Far fresher; more complex and not needed when hourly/daily is enough." },
      { name: "Reverse ETL", note: "Push modeled warehouse data *back* into operational tools (CRM, ads). The pipeline's mirror image, closing the analytics loop." },
    ],
    whoUses: "Data engineering teams own pipelines; analytics engineers (via dbt) own much of the transform layer; data scientists and analysts consume the output. Orchestrators like Airflow, Dagster, and Prefect run the DAGs; Fivetran/Airbyte handle extraction connectors; Snowflake/BigQuery/Redshift are common destinations. Essentially every company past the spreadsheet stage runs pipelines, even if they don't call them that.",
    bigPicture: "ETL is the connective tissue of data engineering: it reads from **OLTP** systems (your app's transactional database, see **oltp-vs-olap**) and lands data in **data lakes and warehouses** for **OLAP** analysis. It's the scheduled, batch counterpart to **stream processing**, and it consumes from **Kafka** when sources are event streams. The **data engineering basics** define *what* good data looks like; pipelines are *how* it gets there reliably.",
    prereqs: ["data-engineering-basics", "oltp-vs-olap", "sql"],
    projects: [
      "Build a tiny ETL script that pulls JSON from a public API, cleans and reshapes it, and loads it into a local database table — then schedule it to run hourly.",
      "Express that job as a small Airflow (or Prefect) DAG with an extract task that must finish before the transform task, add a retry, and break a step on purpose to watch the orchestrator handle it.",
      "Make the load step incremental (only new rows since the last run) and idempotent, then re-run it twice and confirm no rows are duplicated.",
    ],
    breaks: "Forget idempotency and a single retry double-loads a day's revenue. Do a full reload every run instead of an incremental one and a growing dataset eventually takes longer to process than the interval allows — the pipeline can never catch up. Skip data-quality checks and a silently malformed source poisons every downstream table for weeks before anyone notices. Hard-code a source's schema and the pipeline shatters the moment that source adds a column. Real pipelines survive on incremental loads, idempotent runs, schema tolerance, and loud quality alarms.",
    scale: "Local: a single Python script that reads a file, cleans it, and writes a CSV — ETL in one process. Production: a handful of scheduled DAGs in an orchestrator, extracting from a few sources via CDC, transforming in the warehouse with dbt, loading incrementally with retries and freshness checks. Enterprise: hundreds of interdependent pipelines, a data catalog and lineage graph, SLAs on freshness, and dedicated platform tooling so teams can ship pipelines safely. Planet-scale: thousands of pipelines moving petabytes daily across regions, blended with streaming for the fresh paths, automated backfills, and data contracts that stop a source change from silently breaking everything downstream.",
    related: ["data-engineering-basics", "data-lakes-and-warehouses", "oltp-vs-olap", "stream-processing", "kafka-and-event-streaming", "sql"],
  },

  // ─────────────────────── DATA LAKES & WAREHOUSES ───────────────────────
  "data-lakes-and-warehouses": {
    slug: "data-lakes-and-warehouses",
    title: "Data lakes, warehouses & lakehouses",
    category: "Data Engineering",
    color: "teal",
    tagline: "Where a company's analytical data lives — raw and cheap in a lake, clean and fast in a warehouse, or both at once in a lakehouse.",
    oneLiner: "A data warehouse stores cleaned, structured data in a columnar format optimized for fast analytical queries; a data lake stores raw data of any shape cheaply; a lakehouse fuses the two so you query lake-cheap storage with warehouse-fast structure.",
    what: [
      "Once you're moving data with pipelines, it has to *land* somewhere built for analysis — not your app's transactional database (see **oltp-vs-olap**). There are two classic destinations. A **data warehouse** stores cleaned, structured, schema-defined tables optimized to answer big aggregate questions fast (Snowflake, BigQuery, Redshift). A **data lake** is cheap object storage holding raw data of *any* shape — JSON, logs, images, Parquet files — with structure imposed only when you read it.",
      "The reason warehouses are fast at analytics is **columnar storage**. A transactional database stores data row-by-row (great for ‘fetch this one order'); a warehouse stores it column-by-column, so a query like ‘average order value across 2 billion rows' reads only the two columns it needs, tightly compressed, instead of scanning whole rows. That single design choice is most of the speed difference.",
      "The **lakehouse** is the modern fusion: keep data in cheap lake storage as open columnar files (Parquet) but add a transactional **table format** (Delta Lake, Apache Iceberg, Hudi) on top that gives you warehouse features — ACID transactions, schema enforcement, time-travel — directly over the lake. You get the lake's cost and flexibility with the warehouse's reliability and query semantics.",
    ],
    analogy: {
      title: "A warehouse, a quarry, and a quarry with a catalog",
      body: "A data warehouse is a tidy retail warehouse — everything labeled, shelved by category, instantly findable, but you pay to keep it that organized and only stock what fits the shelves. A data lake is a quarry — dump any raw material in cheaply, sort out what you need later. The lakehouse is that same quarry with a meticulous catalog and inventory system laid over it: still cheap to dump into, but now you can find, trust, and transact on the raw material as if it were warehouse stock.",
    },
    insideTitle: "The storage options compared",
    inside: [
      { name: "Data warehouse", desc: "Cleaned, structured tables in columnar storage, tuned for fast aggregate analytics. Costlier, schema-on-write." },
      { name: "Data lake", desc: "Raw data of any format in cheap object storage. Flexible and cheap; messy and slow without governance. Schema-on-read." },
      { name: "Lakehouse", desc: "Open columnar files + a transactional table format (Iceberg/Delta) giving ACID, schema, and time-travel over the lake." },
      { name: "Columnar storage", desc: "Storing data by column not row, so analytical queries read and compress only the columns they touch." },
      { name: "Table format & metadata", desc: "The layer (Iceberg/Delta) tracking which files make up a table, enabling transactions, schema evolution, and snapshots." },
    ],
    how: [
      "Pipelines (ETL/ELT) land data here. In a warehouse, the **load** step writes structured tables and the engine stores them columnar and compressed; queries (SQL) scan only the needed columns across many parallel workers, which is why a scan of billions of rows returns in seconds. **Partitioning** (e.g. by date) and clustering let the engine skip files it doesn't need entirely.",
      "In a lake, raw files sit in object storage organized by path. A query engine (Spark, Presto/Trino) reads them on demand, applying **schema-on-read**. Without governance this becomes a ‘data swamp' — files nobody understands — which is exactly the problem the lakehouse table formats solve by tracking metadata, enforcing schema, and exposing the files as proper transactional tables.",
      "A lakehouse keeps the Parquet files in the lake but registers them through Iceberg/Delta. Now an update is an atomic transaction, a bad load can be rolled back, you can **time-travel** to query the table as it was last Tuesday, and the schema can evolve safely — all over storage that costs a fraction of a warehouse, queried by any engine that speaks the open format.",
    ],
    why: [
      "You don't run analytics on your production database because big aggregate scans would crush the transactional workload, and row storage is the wrong shape for them anyway. A dedicated analytical store separates the two worlds and uses columnar layout to make ‘scan billions of rows' fast and cheap. The lake adds the ability to keep *everything*, cheaply, including data you haven't decided how to use yet.",
      "The lakehouse exists because the lake-vs-warehouse split forced an ugly choice — cheap-but-messy or clean-but-expensive — and teams ended up copying data between both, paying twice and drifting out of sync. Putting warehouse semantics on open lake files collapses two systems into one source of truth. The cost is that table formats and governance are still maturing and demand real discipline.",
    ],
    alternatives: [
      { name: "Query the OLTP database directly", note: "No separate store. Simple at tiny scale; the analytical load eventually harms the app and the data shape fights you." },
      { name: "Warehouse only", note: "Everything cleaned and loaded into a warehouse. Fast and simple to query; pricey for huge or unstructured data you may never analyze." },
      { name: "Lake only", note: "Dump everything raw, query with Spark/Trino. Cheapest and most flexible; degrades into an ungoverned swamp without metadata." },
      { name: "HTAP databases", note: "Single systems aiming to serve transactions *and* analytics at once. Promising; still niche versus the dedicated split." },
    ],
    whoUses: "Data engineers build and govern the store; analytics engineers model tables inside it; analysts and data scientists query it; ML teams pull training data from it. Snowflake, BigQuery, and Databricks (the lakehouse poster child) dominate; Iceberg and Delta Lake are the open table formats; Trino/Presto query lakes directly. Any organization doing serious analytics or ML runs one of these.",
    bigPicture: "This is the destination that **ETL pipelines** load into and that **stream processing** feeds in real time — the **OLAP** side of the **oltp-vs-olap** split. It sits on top of cloud **object storage** (the lake literally *is* a bucket), shares the **sharding/partitioning** intuition for spreading data across machines, and is where the cleaned data defined by **data engineering basics** finally becomes queryable. BI tools, dashboards, and model training all read from here.",
    prereqs: ["oltp-vs-olap", "data-engineering-basics", "sql", "object-storage-cdn"],
    projects: [
      "Load the same dataset into a row-oriented database and a columnar store (e.g. DuckDB), run a wide aggregate query on both, and measure how much less data the columnar engine reads.",
      "Write raw JSON files to a local ‘lake' folder, then query them with DuckDB/Trino using schema-on-read — and notice how a missing or renamed field silently breaks the query.",
      "Convert that lake into a lakehouse table using Apache Iceberg or Delta Lake, perform an update as a transaction, then time-travel to query the table's previous snapshot.",
    ],
    breaks: "Treat a lake as a dumping ground with no catalog and it rots into a swamp where nobody trusts or can find anything. Run heavy analytics straight off the warehouse without partitioning and a single query scans terabytes and runs up an eye-watering bill. Pick row storage for analytics (or columnar for transactions) and every query fights the layout. Skip the table format on a lake and a half-finished write leaves readers seeing corrupt, partial data. The store only delivers if storage layout, partitioning, and governance match how the data is actually queried.",
    scale: "Local: a single columnar file queried with DuckDB on your laptop — a one-person warehouse. Production: a managed warehouse (BigQuery/Snowflake) holding cleaned tables loaded by pipelines, partitioned by date, serving the company's dashboards. Enterprise: a governed lakehouse — petabytes of open Parquet under Iceberg/Delta, a data catalog with lineage, separate compute warehouses per team so analytics and ML don't contend. Planet-scale: multi-region storage with data placed near where it's queried, automatic file compaction and clustering, and a single open table layer that dozens of engines read concurrently as the one source of truth.",
    related: ["oltp-vs-olap", "etl-pipelines", "data-engineering-basics", "stream-processing", "object-storage-cdn", "sharding"],
  },

  // ─────────────────────── KAFKA & EVENT STREAMING ───────────────────────
  "kafka-and-event-streaming": {
    slug: "kafka-and-event-streaming",
    title: "Kafka & event streaming",
    category: "Data Engineering",
    color: "amber",
    tagline: "A durable, replayable log of events that many independent systems read at their own pace — the central nervous system of an event-driven architecture.",
    oneLiner: "Kafka is an append-only, partitioned, durable log: producers append events to topics, the events are kept (not deleted on read), and many consumer groups read them independently — so one stream of events can feed analytics, search, billing, and more, each replayable from any point.",
    what: [
      "A normal **message queue** hands a job to one worker and deletes it once done — point-to-point, fire-and-forget. **Kafka** is different in a way that changes everything: it's a **durable, append-only log**. Producers *append* events to a **topic**; Kafka *keeps* them for a configured retention (days, weeks, forever); and many different consumers can read the same events independently, each tracking its own position. Reading doesn't consume — the event stays for the next reader.",
      "A topic is split into **partitions** — independent ordered logs — which is how Kafka scales and parallelizes. Order is guaranteed *within* a partition, not across them, and events with the same key (say, all events for one user) go to the same partition so their order is preserved. More partitions means more consumers can read in parallel.",
      "Consumers organize into **consumer groups**. Within a group, partitions are divided among the members so each event is processed once *by that group* — that's how you scale out work. But *different* groups each get the *whole* stream independently: the analytics group, the search-indexing group, and the billing group all read the same order events without interfering. And because the log persists, a consumer can **replay** from any past offset — to rebuild a database, backfill a new service, or recover from a bug.",
    ],
    analogy: {
      title: "A newspaper printed once, read by everyone, kept on file",
      body: "A message queue is handing a single memo to one assistant who shreds it when done. Kafka is publishing a newspaper: it's printed once (appended to the log) and archived. Every department subscribes and reads its own copy at its own pace — sports reads it, finance reads it, nobody's reading stops another's. And the archive means a new department hired next year can go back and read every past edition (replay) to catch up completely.",
    },
    insideTitle: "The pieces of the log",
    inside: [
      { name: "Topic", desc: "A named stream of events (‘orders', ‘clicks'). Producers append to it; consumers read from it." },
      { name: "Partition", desc: "An independent ordered slice of a topic. The unit of parallelism and the only place order is guaranteed." },
      { name: "Offset", desc: "A consumer's bookmark — the position it has read up to in a partition. Rewind it to replay." },
      { name: "Producer & consumer group", desc: "Producers append; a consumer group splits partitions among its members so the group processes each event once." },
      { name: "Retention & replay", desc: "Events persist for a set time (or forever via compaction), so any consumer can re-read history from any offset." },
      { name: "Replication", desc: "Each partition is copied across brokers, so a broker failure doesn't lose events — the durability guarantee." },
    ],
    how: [
      "A producer sends an event to a topic; Kafka chooses a partition (by the event's key, hashing it so same-key events stay ordered together) and appends it durably, replicating it to other brokers before acknowledging. The event now sits in the log at a specific **offset**, kept regardless of who has or hasn't read it.",
      "Each consumer group reads forward through the partitions assigned to its members, committing its **offset** as it goes so it knows where to resume after a restart. Add a consumer to a group and Kafka **rebalances** — reassigning partitions so the new member shares the load. Spin up a brand-new group and it can start from offset zero, reading the entire history.",
      "Reliability rests on choices: producers pick how many replicas must acknowledge a write (durability vs latency); consumers choose when to commit offsets, which sets at-least-once vs (with transactions) exactly-once semantics. Because at-least-once means an event can be re-delivered after a crash, consumers must be **idempotent** — the same discipline message queues demand, now at log scale.",
    ],
    why: [
      "Point-to-point queues couple producers to consumers: if three systems need the order events, you fan out three queues and the producer must know about all of them. Kafka inverts this — the producer just appends once, and any number of consumers subscribe independently, now or in the future. New use cases (a fresh analytics pipeline, a new search index) plug in without touching the producer. That decoupling is why Kafka becomes a company's central event backbone.",
      "Durability and replay are the other superpowers. Because the log is the source of truth and persists, you can rebuild any derived system by replaying — recover from a bug, seed a new service, or reprocess history with fixed logic. This underpins **event sourcing** and stream processing. The cost is operational weight: Kafka is a serious distributed system, and ordering, partitioning, and exactly-once semantics demand real care.",
    ],
    alternatives: [
      { name: "Message queue (RabbitMQ/SQS)", note: "Point-to-point job handoff, deleted on consume. Simpler for task queues; no replay, no many-readers, no durable history." },
      { name: "Managed log services", note: "AWS Kinesis, Google Pub/Sub, Confluent Cloud — the same model run for you, less ops at the price of lock-in." },
      { name: "Redpanda / Pulsar", note: "Kafka-compatible or Kafka-alternative logs with different operational trade-offs (no JVM, tiered storage, native multi-tenancy)." },
      { name: "Database + polling / CDC", note: "Treat a table as the event source and poll or stream its changes. Works at modest scale; doesn't match a log's throughput or replay." },
    ],
    whoUses: "Platform and data engineering teams run Kafka as shared infrastructure; backend teams publish domain events to it; data teams consume it into warehouses and stream processors. It's pervasive at scale — LinkedIn (its birthplace), Uber, Netflix, and most large product companies — and managed offerings (Confluent, MSK, Redpanda Cloud) bring it within reach of smaller teams who want the model without operating brokers.",
    bigPicture: "Kafka is the durable backbone that ties the data world together: **stream processing** engines read from it, **ETL pipelines** extract from it, **data lakes and warehouses** are populated from it, and microservices use it to emit and react to events. It generalizes the **message queues** idea — same idempotency and at-least-once concerns — into a replayable, many-reader log, and its **partitions** are the **sharding** concept applied to an event stream. Think of it as the river every downstream data system drinks from.",
    prereqs: ["message-queues", "idempotency", "data-engineering-basics"],
    projects: [
      "Run a single-broker Kafka (or Redpanda) locally, create a topic, produce a few events with a CLI producer, and consume them with two separate consumer groups — confirming both groups receive every event.",
      "Give the topic 3 partitions, send events keyed by user id, and verify all events for one user land on the same partition and stay in order.",
      "Commit a consumer's offset, stop it, reset the offset back to zero, and restart it to replay the entire history — then reason about why the consumer must be idempotent for that to be safe.",
    ],
    breaks: "Assume order across the whole topic and you'll be wrong — Kafka only orders within a partition, so a bad key choice scrambles related events across partitions. Rely on at-least-once delivery without idempotent consumers and a single rebalance double-processes events (double charges, duplicate rows). Set retention too short and a lagging or new consumer finds the history it needed already deleted. Pick too few partitions and you cap how many consumers can ever read in parallel; too many and you drown in overhead. And treating Kafka as a simple queue misses the whole point — and underestimates the ops burden of running it well.",
    scale: "Local: a single broker with one topic and a couple of partitions, producing and consuming on your laptop — the log model in miniature. Production: a small replicated cluster (3 brokers) with topics partitioned for parallelism, replication for durability, and a handful of consumer groups feeding services and a warehouse. Enterprise: many clusters across teams, schema registry enforcing event contracts, tiered storage for long retention, and Kafka as the company's event backbone with dozens of producers and consumer groups. Planet-scale: geo-replicated clusters spanning regions (MirrorMaker / cluster linking), trillions of events a day, exactly-once stream-processing topologies on top, and the log as the durable source of truth that entire systems are rebuilt from by replay.",
    related: ["message-queues", "stream-processing", "etl-pipelines", "data-lakes-and-warehouses", "idempotency", "sharding"],
  },
};
