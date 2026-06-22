"use client";

export const PATTERNS_DB = [
  {
    id: "retries",
    name: "Retries with Exponential Backoff",
    category: "Reliability",
    complexity: "LOW",
    popularity: "95%",
    useCases: ["External APIs", "Third-party gateways", "Network socket glitches"],
    problem: "Transient network glitches, brief server restarts, or load spikes can cause requests to fail instantly. Without retries, these temporary errors propagate directly to the user as raw transaction failures.",
    solution: "Automatically replay failed requests with an increasing delay between attempts (e.g. 100ms, 200ms, 400ms) to let the target server recover, combined with random 'jitter' to prevent synchronized request spikes.",
    tradeoffs: {
      gain: "Increases success rates of external integrations by handling minor network hiccups transparently.",
      loss: "Saturates downstream servers if they are genuinely overloaded. Increases overall user request latency.",
      complexity: "LOW"
    },
    failureModes: [
      { title: "Retry Storms", description: "Hundreds of app instances repeatedly hammering a failing downstream database, keeping it permanently locked." }
    ],
    alternatives: ["Circuit Breaker", "Fail-fast immediately", "Queue-based processing"],
    companies: [
      { name: "Stripe", rationale: "Uses retries with random jitter inside their client libraries to ensure API operations survive network hiccups." }
    ],
    evolution: ["Synchronous attempt", "Basic loop retry", "Exponential delay", "Decorrelated Jitter Backoff"],
    relatedPatterns: ["circuit_breakers", "idempotency", "dlq"]
  },
  {
    id: "circuit_breakers",
    name: "Circuit Breakers",
    category: "Resilience",
    complexity: "MEDIUM",
    popularity: "88%",
    useCases: ["Database connections", "Microservices integration", "Heavy external APIs"],
    problem: "When a downstream service is down or extremely slow, upstream callers keep sending requests. These requests pile up, exhaust thread pools, lock memory, and cause a cascading outage throughout the system.",
    solution: "Wrap downstream calls in a protective state machine. If failures exceed a threshold (e.g., 50% failures in 10 seconds), the circuit opens, failing requests instantly without touching the broken service. Periodically, it allows a few test requests (Half-Open) to check if the service has recovered.",
    tradeoffs: {
      gain: "Prevents slow downstream dependencies from dragging down the rest of the application cluster.",
      loss: "Requests are failed immediately without attempting contact, which can result in false negatives if not calibrated.",
      complexity: "MEDIUM"
    },
    failureModes: [
      { title: "False Trips", description: "Circuit opens due to a minor network spike, blocking traffic to a service that was actually healthy." }
    ],
    alternatives: ["Load shedding", "Short timeouts", "Graceful degradation"],
    companies: [
      { name: "Netflix", rationale: "Pioneered this pattern with Hystrix to ensure a failure in the movie recommendation microservice doesn't block the core video streaming playback." }
    ],
    evolution: ["Infinite blocking wait", "Static short timeouts", "Three-state Circuit Breaker", "Adaptive Sliding-Window breakers"],
    relatedPatterns: ["retries", "bulkheads", "rate_limiting"]
  },
  {
    id: "queues",
    name: "Message Queues",
    category: "Messaging",
    complexity: "MEDIUM",
    popularity: "92%",
    useCases: ["Order checkouts", "Email deliveries", "Image/Video processing tasks"],
    problem: "Synchronously processing slow jobs (like compiling receipts, sending text alerts, or auditing accounts) inside the main request thread blocks web servers, reduces throughput, and results in slow user response times.",
    solution: "Decouple request receipt from request execution. Write tasks to a durable, distributed queue (FIFO list) and return a quick success response to the user. Asynchronous worker processes pick up jobs from the queue and run them.",
    tradeoffs: {
      gain: "Offloads heavy operations off the critical path, smoothing out sudden traffic spikes.",
      loss: "Introduces eventual consistency. Users can't see the results of their action instantly; they must poll or wait.",
      complexity: "MEDIUM"
    },
    failureModes: [
      { title: "Queue Backlogs", description: "Workers process slower than incoming traffic, causing queue queues to build up and delay tasks for hours." }
    ],
    alternatives: ["Direct background threads", "Pub/Sub streams", "Database tables acting as queues"],
    companies: [
      { name: "Uber", rationale: "Queues ride request matching operations asynchronously to ensure the rider gets a fast confirmation and drivers are queued correctly." }
    ],
    evolution: ["In-memory memory arrays", "SQL polling tables", "Redis backed queues (BullMQ)", "Distributed brokers (RabbitMQ, Kafka)"],
    relatedPatterns: ["workers", "dlq", "outbox"]
  },
  {
    id: "workers",
    name: "Background Workers",
    category: "Messaging",
    complexity: "LOW",
    popularity: "90%",
    useCases: ["Email processing", "Scheduled cron jobs", "Report compilers"],
    problem: "Executing resource-intensive calculations, image compression, or cron jobs directly inside web app processes steals CPU from user-facing API routes, causing latency spikes.",
    solution: "Isolate background job runners on dedicated worker server clusters separate from user-facing web instances. Workers pull tasks from a shared message queue and run them in isolation.",
    tradeoffs: {
      gain: "Protects user-facing web server resources; allows scaling workers and web instances independently.",
      loss: "Increases operational costs due to managing separate server tiers and deployments.",
      complexity: "LOW"
    },
    failureModes: [
      { title: "Idle Worker Waste", description: "Running worker instances during light traffic hours, wasting money when queue volumes are near zero." }
    ],
    alternatives: ["Serverless functions", "Local process spawn", "Monolith background threads"],
    companies: [
      { name: "Shopify", rationale: "Scales thousands of Sidekiq background worker processes separate from their Rails web nodes to process order receipts and inventory syncs." }
    ],
    evolution: ["Thread spawners", "Forked node processes", "Dedicated worker instances", "Autoscaling container groups"],
    relatedPatterns: ["queues", "dlq"]
  },
  {
    id: "caching",
    name: "Read Caching",
    category: "Performance",
    complexity: "MEDIUM",
    popularity: "98%",
    useCases: ["Menu catalogs", "User session storage", "Config settings"],
    problem: "Databases are slow and expensive to read from. Fetching static or slow-changing data (like item listings or customer profiles) from disk on every HTTP request saturates database CPU.",
    solution: "Store frequently requested data in a fast, in-memory database (like Redis or Memcached). Check the cache first; if data is found (cache hit), return it immediately. If not found (cache miss), query the database and populate the cache.",
    tradeoffs: {
      gain: "Reduces response latency from milliseconds to microseconds. Slashes database read pressure.",
      loss: "Risks stale data. Out-of-sync cache items can cause users to see outdated info. Cache invalidation is complex.",
      complexity: "MEDIUM"
    },
    failureModes: [
      { title: "Cache Stampedes", description: "When a popular cache key expires, thousands of concurrent requests hit the primary database at once, knocking it offline." }
    ],
    alternatives: ["In-memory global variables", "Local file cache", "SQL Materialized Views"],
    companies: [
      { name: "Twitter", rationale: "Caches active user timeline structures in Redis to avoid executing heavy relational joins across database clusters on every scroll." }
    ],
    evolution: ["In-memory map arrays", "Disk-cache files", "Distributed Redis/Memcached clusters", "Edge CDN micro-caching"],
    relatedPatterns: ["read_replicas", "rate_limiting"]
  },
  {
    id: "read_replicas",
    name: "Database Read Replicas",
    category: "Scaling",
    complexity: "MEDIUM",
    popularity: "85%",
    useCases: ["Analytics reporting", "Search filtering", "Read-heavy dashboards"],
    problem: "In read-heavy applications, SQL queries compete with write transactions on the primary database, leading to table locks, query timeouts, and slow checkouts.",
    solution: "Set up replication channels to copy database states to secondary nodes. Configure the application to route write statements (INSERT, UPDATE) to the primary node and read statements (SELECT) to replica nodes.",
    tradeoffs: {
      gain: "Scales database read capacity horizontally. Ensures write transactions are not blocked by heavy queries.",
      loss: "Eventual consistency. Replicas take time to sync. Users might write a record and not see it immediately on page reload.",
      complexity: "MEDIUM"
    },
    failureModes: [
      { title: "Replica Lag Outages", description: "Replicas fall minutes behind the primary. Users get confused seeing old states and trigger duplicate writes." }
    ],
    alternatives: ["Redis read-caching", "Elasticsearch indexing", "DB sharding"],
    companies: [
      { name: "GitHub", rationale: "Uses highly optimized MySQL replica nodes to serve millions of repository file list reads without touching write primary nodes." }
    ],
    evolution: ["Single DB node", "Passive backups", "Active Read Replicas", "Multi-Primary replication"],
    relatedPatterns: ["caching", "sharding"]
  },
  {
    id: "sharding",
    name: "Database Sharding",
    category: "Scaling",
    complexity: "HIGH",
    popularity: "70%",
    useCases: ["Million-user user tables", "High-frequency logging databases", "Global order tables"],
    problem: "A single primary database has physical CPU, RAM, and disk limits. Once saturated, you cannot scale writes further, regardless of database optimizations or replicas.",
    solution: "Partition tables horizontally across multiple independent database servers (shards) using a shard key (e.g., customerId % 4). Each database only stores a subset of the total rows.",
    tradeoffs: {
      gain: "Splits database writes infinitely. Avoids absolute database capacity limits.",
      loss: "Loss of cross-shard joins and transaction safety. Operational complexity is extremely high.",
      complexity: "HIGH"
    },
    failureModes: [
      { title: "Hot Shards", description: "An uneven shard key puts 90% of traffic onto a single shard server (e.g., a massive celebrity account), defeating the sharding split." }
    ],
    alternatives: ["Read Replicas", "NoSQL stores", "Table partitioning within one DB"],
    companies: [
      { name: "Slack", rationale: "Shards database instances by team/workspace ID, ensuring an issue in one workspace database has zero impact on others." }
    ],
    evolution: ["Single database", "Vertical partitioning", "Manual App-level sharding", "Automated Vitess/Spanner engines"],
    relatedPatterns: ["read_replicas", "cqrs"]
  },
  {
    id: "outbox",
    name: "Transactional Outbox",
    category: "Consistency",
    complexity: "MEDIUM",
    popularity: "75%",
    useCases: ["Financial microservices", "Event-driven checkout flows", "DB to Queue syncs"],
    problem: "When a server modifies database tables and sends notifications to an external queue in a single route, one can succeed while the other fails (e.g. database commits, but the queue server crashes, losing the notification).",
    solution: "Save event messages directly inside a dedicated `outbox` table in the same database, using the same ACID transaction as the business operation. A separate process polls this outbox table and reliably publishes messages to the queue.",
    tradeoffs: {
      gain: "Guarantees dual-write consistency. Messages are never lost even if queue brokers fail during checkouts.",
      loss: "Introduces polling overhead on the database and latency in message delivery.",
      complexity: "MEDIUM"
    },
    failureModes: [
      { title: "Outbox Polling Delays", description: "Poller worker lags, causing message publishing to fall behind database modifications by minutes." }
    ],
    alternatives: ["CDC (Change Data Capture)", "Distributed 2PC transactions", "Best-effort dual-writes"],
    companies: [
      { name: "Debezium", rationale: "Provides specialized Outbox connectors to stream events out of MySQL/PostgreSQL transactional tables into Apache Kafka." }
    ],
    evolution: ["Dual-writing variables", "Post-commit triggers", "Transactional outbox table", "Log-based Change Data Capture (CDC)"],
    relatedPatterns: ["queues", "saga", "event_sourcing"]
  },
  {
    id: "saga",
    name: "Saga Orchestration",
    category: "Consistency",
    complexity: "HIGH",
    popularity: "65%",
    useCases: ["Booking travel packages", "E-commerce order fulfillment", "Multi-service checkouts"],
    problem: "Distributed microservices cannot share database transactions. If checkout succeeds, but payment fails or inventory is out of stock, the system is left in a corrupted, half-complete state.",
    solution: "Model transactions as a chain of local steps. If a step fails, the Saga orchestrator triggers compensating transactions in reverse order (e.g. if Payment fails, refund payment, and release the reserved inventory).",
    tradeoffs: {
      gain: "Ensures eventual consistency across microservices without locking resources globally.",
      loss: "Designing and testing compensating rollback routes for every single service path is extremely complex.",
      complexity: "HIGH"
    },
    failureModes: [
      { title: "Compensating Failures", description: "A compensating rollback step fails (e.g., refund fails), leaving the system permanently out of sync until manual SRE intervention." }
    ],
    alternatives: ["2PC (Two-Phase Commit)", "Choreographed Sagas", "Monolith database mergers"],
    companies: [
      { name: "Uber", rationale: "Orchestrates Sagas across Trip, Payment, and Driver services to handle ride cancellations and refund flows reliably." }
    ],
    evolution: ["Direct nested REST calls", "Choreographed event events", "Orchestrated Sagas using Temporal/Cadence workflows"],
    relatedPatterns: ["outbox", "cqrs"]
  },
  {
    id: "cqrs",
    name: "CQRS",
    category: "Consistency",
    complexity: "HIGH",
    popularity: "70%",
    useCases: ["Search-heavy social feeds", "Complex financial systems", "Reporting views"],
    problem: "A single data model optimized for updates (writes) is often terrible for complex queries (reads). Forcing writes and reads through the same model results in slow database performance.",
    solution: "Command Query Responsibility Segregation (CQRS). Split the application into a Command model (writes/inserts, optimized for business validation) and a Query model (reads/selections, optimized for rendering fast views). Views are sync-updated asynchronously.",
    tradeoffs: {
      gain: "Allows scaling write performance and read performance completely independently. Simplifies complex reporting queries.",
      loss: "Read models are eventually consistent. Data updates take time to replicate to search views.",
      complexity: "HIGH"
    },
    failureModes: [
      { title: "Projection Failures", description: "Asynchronous projection engines crash, leaving the read database permanently out of sync with the write primary." }
    ],
    alternatives: ["SQL Views", "Active index syncing", "CRUD tables"],
    companies: [
      { name: "Microsoft", rationale: "Advocates CQRS inside Azure architectures to support high-throughput cloud dashboards and microservices databases." }
    ],
    evolution: ["Basic CRUD mapping", "Read replicas", "CQRS separate app layers", "CQRS separate storage engines"],
    relatedPatterns: ["event_sourcing", "read_replicas"]
  },
  {
    id: "event_sourcing",
    name: "Event Sourcing",
    category: "Data",
    complexity: "HIGH",
    popularity: "60%",
    useCases: ["Bank ledger accounts", "Version control systems", "Order history tracking"],
    problem: "Traditional databases only store the 'current state' of data. We lose historical context: we don't know *how* we reached this state, making auditing, debugging, and rollback impossible.",
    solution: "Store the state of an application as a sequence of immutable, append-only events (e.g. 'OrderCreated', 'PaymentReceived', 'OrderShipped'). Current state is reconstructed by replaying events from the beginning.",
    tradeoffs: {
      gain: "Perfect audit trails, time-travel debugging, and the ability to rebuild read models at any time.",
      loss: "Replaying millions of events to get the current state is slow; requires snapshots. High learning curve.",
      complexity: "HIGH"
    },
    failureModes: [
      { title: "Schema Evolution Issues", description: "Modifying the structure of historical events breaks older event replay, corrupting state restorations." }
    ],
    alternatives: ["Auditing columns", "Trigger log tables", "State-based DB tables"],
    companies: [
      { name: "LMAX Exchange", rationale: "Uses event-sourced journals to handle high-frequency trading ledgers with microsecond latency." }
    ],
    evolution: ["State-based overwrite", "History snapshot tables", "Event journaling databases", "Event sourcing + CQRS Snapshots"],
    relatedPatterns: ["cqrs", "outbox"]
  },
  {
    id: "bulkheads",
    name: "Bulkheads Isolation",
    category: "Resilience",
    complexity: "MEDIUM",
    popularity: "80%",
    useCases: ["Microservice thread pools", "Tenant database isolation", "Resource allocations"],
    problem: "If all requests share a single thread pool or database connection pool, a spike in slow requests (like compiling reporting PDFs) will steal all resources, starving critical requests (like order checkout).",
    solution: "Partition resources (threads, connections, memory) into isolated pools. A failure or overload in the PDF worker thread pool has zero impact on the checkout thread pool.",
    tradeoffs: {
      gain: "Guarantees critical system paths remain responsive during secondary component failures.",
      loss: "Reduces resource sharing efficiency; isolated pools can sit idle while others starve.",
      complexity: "MEDIUM"
    },
    failureModes: [
      { title: "Pool Underutilization", description: "Allocating too many threads to a quiet pool, starving other active components that need resources." }
    ],
    alternatives: ["Rate Limiting", "Load shedding", "Kubernetes CPU constraints"],
    companies: [
      { name: "Amazon", rationale: "Isolates cell-based architectures so a service outage in one geographic zone has no impact on other server cells." }
    ],
    evolution: ["Shared thread pools", "Static resource allocations", "Dynamic Bulkhead pools", "Service mesh bulkhead routers"],
    relatedPatterns: ["circuit_breakers", "rate_limiting"]
  },
  {
    id: "rate_limiting",
    name: "Rate Limiting",
    category: "Resilience",
    complexity: "MEDIUM",
    popularity: "94%",
    useCases: ["API security gateways", "Login attempts limiters", "Spam prevention"],
    problem: "Malicious users, buggy loops, or search bots can flood your API with requests, exhausting CPU, memory, and database connections, causing denial of service (DoS) for regular users.",
    solution: "Track request counts per IP address or API token using a fast cache (Redis). Reject requests (HTTP 429 Too Many Requests) that exceed predefined limits (e.g., maximum 60 requests per minute).",
    tradeoffs: {
      gain: "Protects application capacity from denial-of-service spikes and API abuse.",
      loss: "Legitimate users with heavy burst traffic can get throttled incorrectly if limits are set too tight.",
      complexity: "MEDIUM"
    },
    failureModes: [
      { title: "Throttling Cascades", description: "Client applications with poorly designed retry logic flood the gateway even faster when they get throttled." }
    ],
    alternatives: ["Load shedding", "IP firewalls", "Queueing traffic"],
    companies: [
      { name: "Stripe", rationale: "Enforces strict API rate limits using a Redis Token Bucket algorithm to protect their gateway from high-frequency script attacks." }
    ],
    evolution: ["Fixed window count", "Sliding window logs", "Token Bucket algorithm", "Leaky Bucket queuing"],
    relatedPatterns: ["circuit_breakers", "bulkheads", "backpressure"]
  },
  {
    id: "idempotency",
    name: "Idempotent Consumers",
    category: "Consistency",
    complexity: "MEDIUM",
    popularity: "87%",
    useCases: ["Payment processing API", "Order submissions", "Email deliveries"],
    problem: "When clients experience network timeouts, they retry requests. If the request was actually processed before the timeout, retrying creates duplicate records (e.g. charging a customer twice).",
    solution: "Enforce clients to pass a unique `Idempotency-Key` header with requests. Track these keys in the database. If a key has been processed, return the cached result of the original execution instead of running it again.",
    tradeoffs: {
      gain: "Guarantees safe request retries, preventing duplicate database updates and double billing.",
      loss: "Requires tracking and cleaning up millions of idempotency keys in storage, adding storage overhead.",
      complexity: "MEDIUM"
    },
    failureModes: [
      { title: "Race Conditions", description: "Two concurrent retries with the same key bypass checks and run simultaneously, resulting in double execution anyway." }
    ],
    alternatives: ["Unique SQL constraints", "Client-side checking", "Saga validation"],
    companies: [
      { name: "Stripe", rationale: "Enforces Idempotency Keys across all charge API endpoints to ensure network glitches never result in double credit card charges." }
    ],
    evolution: ["No checks", "Database unique index checks", "Idempotency key table storage", "Distributed Redis lock validations"],
    relatedPatterns: ["retries", "outbox"]
  },
  {
    id: "dlq",
    name: "Dead Letter Queues (DLQ)",
    category: "Reliability",
    complexity: "LOW",
    popularity: "86%",
    useCases: ["Queue processors", "Payment worker networks", "Audit log parsers"],
    problem: "When background worker processes pick up corrupted or malformed messages, they fail. If we retry them infinitely, they block the worker queue, wasting resources (a poison pill).",
    solution: "After a task fails a maximum number of times (e.g., 3 retries), move the message out of the main queue into a special secondary queue called the Dead Letter Queue (DLQ). Upstream traffic continues flowing, and SREs can inspect the DLQ.",
    tradeoffs: {
      gain: "Prevents malformed messages from stalling the active queue. Isolates broken tasks for investigation.",
      loss: "Requires building separate dashboards and alerts for SRE teams to monitor and debug DLQ backlogs.",
      complexity: "LOW"
    },
    failureModes: [
      { title: "Unmonitored DLQ Growth", description: "Dead letter queues fill up with millions of tasks silently, going unnoticed until the database disk fills up." }
    ],
    alternatives: ["Discarding failed messages", "In-place logging", "Database log tracking"],
    companies: [
      { name: "Amazon SQS", rationale: "Includes native Dead Letter Queue configurations to redirect stuck messages out of SQS messaging queues automatically." }
    ],
    evolution: ["Log and drop", "Database failure tables", "Secondary SQS DLQ queues", "Automated DLQ re-routing processors"],
    relatedPatterns: ["queues", "workers", "retries"]
  },
  {
    id: "backpressure",
    name: "Backpressure & Load Shedding",
    category: "Resilience",
    complexity: "MEDIUM",
    popularity: "82%",
    useCases: ["TCP socket streaming", "High-frequency webhook processors", "Bulk APIs"],
    problem: "When downstream consumers process slower than the upstream producer is sending, queues fill up and databases run out of memory. The consumer crashes or times out.",
    solution: "Implement feedback loops: when consumer queue capacity is saturated (e.g. buffer is 90% full), notify the sender to throttle or slow down its sending rate. If sender cannot slow down, drop low-priority requests (load shedding).",
    tradeoffs: {
      gain: "Prevents memory exhaustion crashes. Stabilizes nodes under extreme, uncontrolled bursts.",
      loss: "Drops requests or blocks incoming clients, causing degraded user experience.",
      complexity: "MEDIUM"
    },
    failureModes: [
      { title: "Deadlocks", description: "Producer blocks waiting for consumer capacity, while consumer blocks waiting for producer metadata, freezing the entire pipeline." }
    ],
    alternatives: ["Scaling workers infinitely", "Massive disk buffering", "Rate limiting"],
    companies: [
      { name: "Uber", rationale: "Drops telemetry webhook records under heavy surges (load shedding) to ensure passenger matching servers stay online." }
    ],
    evolution: ["Unbounded memory buffers", "Disk swap overflows", "Signal-based Backpressure flow control", "Dynamic Load Shedding gateways"],
    relatedPatterns: ["rate_limiting", "queues", "circuit_breakers"]
  }
];
