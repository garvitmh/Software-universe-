"use client";

export const COMPANIES_DB = [
  {
    id: "netflix",
    name: "Netflix",
    logo: "NF",
    era: "2008 - 2012",
    scale: "230M+ Active Streams",
    originalProblem: "In 2008, a single relational database corruption knocked Netflix offline for three days, halting DVD shipping. As they transitioned to video streaming, their monolithic datacenter architecture could not scale horizontally to meet massive global streaming demand.",
    failures: "A three-day database corruption outage in 2008 that paralyzed DVD shipping operations. Under streaming, thread pool starvation caused RECOMMENDATION failures to take down core user logins.",
    architecture: "Migrated from a single Oracle Datacenter Monolith to a distributed, multi-region AWS Microservices architecture with Cassandra database clusters.",
    patterns: ["circuit_breakers", "bulkheads", "caching", "read_replicas"],
    tradeoffs: {
      gain: "Near-infinite scaling potential and extreme fault isolation. If one service fails, others continue running.",
      loss: "Extreme operational complexity and eventual consistency. Replicating databases globally introduced sync delays.",
      complexity: "HIGH"
    },
    regrets: "Microservice sprawl (the 'Death Star' architecture diagram). Debugging a single request became nearly impossible without investing millions in distributed tracing infrastructure.",
    lessons: "Isolate your critical path. Recommendations can fail, but users must always be able to click Play. Build resilience mechanisms directly into code using libraries like Hystrix.",
    burgerFarmRelevance: "Separate payment operations from order reception. If the payment gateway stalls, customers should still be able to browse the menu and queue orders locally.",
    timeline: [
      { year: "2008", title: "Monolith Crash", description: "Database corruption halts DVD shipping for 3 days. Decision made to migrate to the cloud." },
      { year: "2010", title: "AWS Migration Begins", description: "Moved streaming web portal to AWS. First microservices are introduced." },
      { year: "2012", title: "Hystrix & Simian Army", description: "Pioneered Chaos Engineering by killing production servers automatically to test circuit breakers." }
    ]
  },
  {
    id: "stripe",
    name: "Stripe",
    logo: "SP",
    era: "2015 - Present",
    scale: "20B+ Transactions/Day",
    originalProblem: "Payment gateways require absolute consistency. During network dropouts between Stripe and credit card networks (Visa/MC), clients retried requests. Without de-duplication, this charged customers twice.",
    failures: "Network timeouts caused duplicate HTTP requests, resulting in double-charging credit cards and corrupting ledger balances.",
    architecture: "A highly consistent transaction ledger routing system backed by distributed Redis locking layers and ACID database state checks.",
    patterns: ["idempotency", "retries", "dlq"],
    tradeoffs: {
      gain: "Guaranteed single-execution safety for credit card charges, allowing clients to retry safely.",
      loss: "High storage overhead to index and clean up millions of idempotency keys. Increased latency for locking checks.",
      complexity: "MEDIUM"
    },
    regrets: "Distributed locks in Redis introduced lock timeouts: if a lock held too long due to slow APIs, subsequent retries got blocked erroneously.",
    lessons: "Idempotency keys must be enforced at the API gateway layer. Always store idempotency keys in the same database as transactional state.",
    burgerFarmRelevance: "When the POS app submits a checkout request, pass an idempotency key (orderId). If the POS app retries due to network lag, it won't charge the customer twice.",
    timeline: [
      { year: "2015", title: "Double Charge Crisis", description: "Network timeouts lead to a spike in duplicate customer charges. Enforced Idempotency-Keys." },
      { year: "2017", title: "Rate Limiter Overhaul", description: "Imposed Token Bucket Redis limiters to protect endpoints from script attacks." }
    ]
  },
  {
    id: "uber",
    name: "Uber",
    logo: "UB",
    era: "2014 - 2018",
    scale: "15M+ Daily Trips",
    originalProblem: "Uber's early Python monolith could not scale geographical location updates. Drivers sent GPS coordinates every 4 seconds, saturating primary databases and slowing down passenger matching loops.",
    failures: "SQL database deadlocks during rush hours, preventing riders from finding nearby drivers and stalling dispatch services globally.",
    architecture: "Rewrote monolith into Go-based microservices using ringpopulation sharding and specialized geographic databases (Schemaless / Ringpop).",
    patterns: ["sharding", "queues", "backpressure", "circuit_breakers"],
    tradeoffs: {
      gain: "Handles millions of coordinate updates per second with sub-second processing latency.",
      loss: "Loss of transactional joins: matching trips across drivers required complex application-level joining code.",
      complexity: "HIGH"
    },
    regrets: "Saga rollbacks failed often: when driver matching was canceled, cleaning up database entries across 12 different services sometimes left ghost driver reservations.",
    lessons: "Shard databases by geographical region (cells). A failure in Paris should never impact dispatching in New York.",
    burgerFarmRelevance: "Store active order logs sharded by kitchen branch or storeId. A crash in store #4's database should not stop orders in store #1.",
    timeline: [
      { year: "2014", title: "Dispatcher Crash", description: "Primary Postgres database deadlocks under high GPS coordinate updates." },
      { year: "2016", title: "Ringpop Architecture", description: "Migrated coordinates tracking to Go services using regional node sharding." }
    ]
  },
  {
    id: "amazon",
    name: "Amazon",
    logo: "AM",
    era: "2001 - 2005",
    scale: "100M+ Items Sold/Year",
    originalProblem: "In 2001, Amazon operated as a giant monolithic website. Making a minor change to the book catalog required compiling and deploying the entire website, leading to slow releases and massive deploy coordination conflicts.",
    failures: "Monolithic deployments took weeks of coordination. A bug in the shopping cart checkout code regularly took down the book catalog search page.",
    architecture: "Deconstructed monolith into 'two-pizza team' services: autonomous microservices communicating via REST and simple message brokers.",
    patterns: ["queues", "workers", "bulkheads"],
    tradeoffs: {
      gain: "Decoupled deployments. Teams can release changes to recommendation algorithms without coordination.",
      loss: "High network overhead due to thousands of internal service calls. Difficult to test cross-service features.",
      complexity: "HIGH"
    },
    regrets: "Service dependency cycles: service A calls B, which calls C, which calls A, leading to circular locks that froze entire server pools.",
    lessons: "Organize architecture around business domains (e.g. Catalog Service, Ordering Service). Enforce strict API contracts between teams.",
    burgerFarmRelevance: "Keep the catalog (burger descriptions) decoupled from the order submission pipeline. Updating a burger's price should not block orders.",
    timeline: [
      { year: "2001", title: "Monolith Sprawl", description: "Build times reach 11 hours. Product releases are halted by integration conflicts." },
      { year: "2002", title: "Bezos API Mandate", description: "Bezos famously mandates that all teams must expose data and functionality through service interfaces." }
    ]
  },
  {
    id: "shopify",
    name: "Shopify",
    logo: "SH",
    era: "2016 - Present",
    scale: "1M+ Online Stores",
    originalProblem: "Flash sales (e.g., influencers launching cosmetics) route thousands of checkouts per second to a single store database. Rather than building microservices, Shopify wanted to keep their monolithic codebase.",
    failures: "Influencer sales caused massive database write saturation, knocking out other stores hosted on the same database clusters.",
    architecture: "The Modular Monolith: a single Rails application codebase, but databases are partitioned and isolated by tenant (store ID) into 'pods'.",
    patterns: ["sharding", "caching", "rate_limiting"],
    tradeoffs: {
      gain: "Maintains simple monolithic code styling while scaling database writes horizontally across pods.",
      loss: "Cross-store analytics or global reporting databases require separate ETL data pipes.",
      complexity: "MEDIUM"
    },
    regrets: "Pod allocation imbalances: massive merchant tenants saturated their assigned pod database, requiring complex, manual live database migrations.",
    lessons: "You don't need microservices to scale. Scale databases horizontally by partitioning data by customer (tenant) while keeping code simple.",
    burgerFarmRelevance: "Keep the codebase as a clean monolith, but route database traffic to separate databases based on storeId.",
    timeline: [
      { year: "2016", title: "Flash Sale Meltdowns", description: "Celebrity product launches crash shared database nodes. Pod partitioning designed." },
      { year: "2019", title: "Modular Monolith", description: "Enforced strict boundaries inside the monolith code to isolate merchant domains." }
    ]
  },
  {
    id: "cloudflare",
    name: "Cloudflare",
    logo: "CF",
    era: "2018 - Present",
    scale: "45M+ Requests/Sec",
    originalProblem: "Routing global traffic requires millisecond response times. Fetching website DNS settings or SSL certificates from a central database on every request introduces massive latency and single points of failure.",
    failures: "Central database outages took down DNS resolution globally, blocking millions of websites at once.",
    architecture: "Edge server proxy nodes utilizing distributed Key-Value stores (Quicksilver) to replicate config states globally within seconds.",
    patterns: ["caching", "backpressure"],
    tradeoffs: {
      gain: "Edge routing resolves in microseconds; zero dependency on a central database during active request proxying.",
      loss: "Eventual consistency: updating security settings takes up to 10 seconds to propagate globally.",
      complexity: "HIGH"
    },
    regrets: "Replication storms: when millions of DNS keys were updated at once, synchronization traffic saturated internal server networks.",
    lessons: "Push data to the edge. Fetching read-only configurations should never involve a network hop back to a central origin server.",
    burgerFarmRelevance: "Store burger menu prices locally in the POS client's memory. The POS client should never query the cloud database just to check the price of a fry.",
    timeline: [
      { year: "2018", title: "Central DB Crash", description: "A database outage stalls Edge routers. Switched to distributed KV systems." }
    ]
  },
  {
    id: "discord",
    name: "Discord",
    logo: "DS",
    era: "2017 - 2022",
    scale: "150M+ Active Users",
    originalProblem: "Discord stored billions of chat messages in MongoDB. As chat volume scaled, indexes could no longer fit in RAM, causing MongoDB writes to stall and CPU utilization to spike to 100%.",
    failures: "MongoDB write-locking outages that froze chat channels and caused connection drops for millions of concurrent gamers.",
    architecture: "Migrated messaging storage from MongoDB to Cassandra, and later to ScyllaDB (C++ Cassandra clone) with app-level partition sharding.",
    patterns: ["sharding", "caching", "backpressure"],
    tradeoffs: {
      gain: "Handles billions of messages in flat-write queues with sub-millisecond read times.",
      loss: "Cassandra schema migrations are rigid and complex. Requires custom app-level caching layers.",
      complexity: "HIGH"
    },
    regrets: "ScyllaDB compaction cycles: periodic database disk cleanup caused temporary latency spikes, requiring custom thread limiters.",
    lessons: "Choose databases based on read/write ratios. If you are doing append-only writes (chat logs), relational joins are useless; use Wide-Column stores.",
    burgerFarmRelevance: "For kitchen order logs (append-only history), use a wide-column or simple log database rather than running heavy relational updates.",
    timeline: [
      { year: "2017", title: "MongoDB Saturation", description: "RAM limit reached. Chat histories become slow and lock databases. Switched to Cassandra." },
      { year: "2022", title: "ScyllaDB Migration", description: "Migrated to ScyllaDB to eliminate garbage collection pauses in Cassandra." }
    ]
  },
  {
    id: "airbnb",
    name: "Airbnb",
    logo: "AB",
    era: "2018 - 2021",
    scale: "100M+ Bookings/Year",
    originalProblem: "Airbnb's monolithic codebase became a bottleneck for development speed. Teams conflicted on code merges. To resolve this, they rushed into microservices, creating hundreds of services without planning.",
    failures: "Microservice latency cascades: booking a room triggered synchronous API calls across 30 microservices, multiplying failures and slowing down booking searches.",
    architecture: "Consolidated microservices into a hybrid Service-Oriented Architecture (SOA) using aggregated GraphQL gateways and consolidated DBs.",
    patterns: ["caching", "saga", "circuit_breakers"],
    tradeoffs: {
      gain: "Decouples developer merges while keeping service-to-service call depths shallow.",
      loss: "GraphQL schema maintenance requires strict coordination between teams.",
      complexity: "HIGH"
    },
    regrets: "Microservice fragmentation: they built services that only wrapped a single database table, creating high network overhead with zero benefits.",
    lessons: "Don't build microservices too early. Microservices solve organizational problems, not performance problems. Keep services coarse-grained.",
    burgerFarmRelevance: "Do not build a separate microservice for 'Sauces' and 'Drinks'. Keep them as simple database tables within the catalog monolith.",
    timeline: [
      { year: "2018", title: "Microservice Rush", description: "Monolith split into 250 microservices, causing latency to spike by 300%." },
      { year: "2020", title: "Consolidation Era", description: "Merged small services back into macro-services behind a unified GraphQL Gateway." }
    ]
  },
  {
    id: "github",
    name: "GitHub",
    logo: "GH",
    era: "2019 - Present",
    scale: "100M+ Repositories",
    originalProblem: "GitHub operates as a massive monolithic Ruby on Rails application. As user commits scaled, relational databases struggled. Instead of rewriting everything into microservices, they wanted to keep their Rails codebase.",
    failures: "Primary database deadlocks during large pull request merges, knocking out repo pages and issue trackers.",
    architecture: "Uses Vitess (database sharding middleware for MySQL) to shard databases horizontally by repository ID, keeping Rails monolith code untouched.",
    patterns: ["sharding", "read_replicas", "caching"],
    tradeoffs: {
      gain: "Infinite scaling of MySQL writes while keeping the Ruby on Rails monolith intact.",
      loss: "Vitess sharding queries must be carefully designed to avoid cross-shard searches.",
      complexity: "HIGH"
    },
    regrets: "Cross-repository dashboards (like global user activity) became slow due to routing requests across multiple shards.",
    lessons: "You can scale a monolith by sharding the database tier underneath. Database proxy middleware (like Vitess) can hide sharding complexity from the application code.",
    burgerFarmRelevance: "Scale Burger Farm's monolith by using MySQL proxy sharding (Vitess) by storeId, keeping the Express.js application code simple.",
    timeline: [
      { year: "2019", title: "Vitess Adoption", description: "Database writes reach single-server limit. Integrated Vitess sharding." }
    ]
  }
];
