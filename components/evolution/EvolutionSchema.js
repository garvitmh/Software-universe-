"use client";

export const EVOLUTION_STAGES = [
  {
    id: "users_10",
    label: "10 Users",
    userCount: 10,
    rps: "0.2 req/sec",
    architecture: "Single Node Monolith",
    constraint: "None (Awaiting growth)",
    bottleneck: "Single Point of Failure (Everything on one VPS)",
    story: "At 10 users, Software Universe (Burger Farm v1) runs on a single $5/month VPS. The Node.js web server, application logic, and SQLite database all live on this same small box. It is incredibly simple, cost-effective, and fast to deploy. However, if the VPS goes down or its disk fills up, the entire application is completely offline.",
    capabilities: ["Single VPS Deployment", "Local SQLite DB", "Synchronous Processing"],
    cost: { infra: 5, operational: 5, cognitive: 5 },
    tradeoffs: {
      gain: "Extreme simplicity, zero networking latency between layers, minimal running costs.",
      loss: "Zero redundancy. Any software crash or machine outage is catastrophic.",
      complexity: "LOW"
    },
    pressures: { traffic: 2, latency: 5, availability: 10, cost: 5, teamSize: 5 },
    diff: {
      added: ["Client", "Monolith Server", "Local Database"],
      removed: [],
      risks: ["Web server crashes shut down the DB", "Single disk crash wipes out all customer data"]
    },
    topology: {
      nodes: [
        { id: "client", label: "User Clients", type: "client", x: 15, y: 50, status: "healthy" },
        { id: "api", label: "Monolith Server", type: "api", x: 50, y: 50, status: "healthy" },
        { id: "db", label: "SQLite DB (Local)", type: "db", x: 85, y: 50, status: "healthy" }
      ],
      links: [
        { from: "client", to: "api", type: "sync", active: true },
        { from: "api", to: "db", type: "sync", active: true }
      ]
    }
  },
  {
    id: "users_100",
    label: "100 Users",
    userCount: 100,
    rps: "2 req/sec",
    architecture: "Monolith with Local SQLite",
    constraint: "CPU / Single Thread Blocking",
    bottleneck: "Notification tasks (emails, receipt generation) block the request loop",
    story: "At 100 users, traffic is still light, but we run into a major UX issue: when a user checks out, sending an email or push notification synchronously blocks the single-threaded Node.js request loop. Other users experience temporary freeze frames. We need to introduce basic background worker processing to offload these heavy tasks asynchronously.",
    capabilities: ["Direct SQLite Storage", "Off-Main-Thread Processing"],
    cost: { infra: 10, operational: 15, cognitive: 15 },
    tradeoffs: {
      gain: "Basic asynchronous offloading prevents server loops from stalling during notifications.",
      loss: "Background tasks are still stored in-memory; server restarts kill pending workers.",
      complexity: "LOW"
    },
    pressures: { traffic: 12, latency: 25, availability: 20, cost: 8, teamSize: 8 },
    diff: {
      added: ["Local Background Worker"],
      removed: [],
      risks: ["Server restarts wipe out pending worker tasks", "Local storage runs out of memory"]
    },
    topology: {
      nodes: [
        { id: "client", label: "User Clients", type: "client", x: 15, y: 50, status: "healthy" },
        { id: "api", label: "Monolith Server", type: "api", x: 50, y: 40, status: "healthy" },
        { id: "db", label: "SQLite DB (Local)", type: "db", x: 85, y: 40, status: "healthy" },
        { id: "worker", label: "Email Worker (Local)", type: "worker", x: 50, y: 75, status: "healthy" }
      ],
      links: [
        { from: "client", to: "api", type: "sync", active: true },
        { from: "api", to: "db", type: "sync", active: true },
        { from: "api", to: "worker", type: "async", active: true }
      ]
    }
  },
  {
    id: "users_1k",
    label: "1,000 Users",
    userCount: 1000,
    rps: "25 req/sec",
    architecture: "Load Balanced Servers + Remote Database",
    constraint: "Database Connections & Disk IO",
    bottleneck: "PostgreSQL connection limits; local disk capacity",
    story: "At 1,000 users, running the database on the same server as the application starts saturating the server's CPU and disk space. We scale out: we spin up a second application server for redundancy and place them both behind an HTTP Load Balancer. We also migrate the database from local SQLite to a dedicated, remote PostgreSQL server. If one application server fails, the load balancer routes traffic to the other.",
    capabilities: ["HTTP Load Balancing", "Dedicated SQL Database", "App Server Redundancy"],
    cost: { infra: 30, operational: 35, cognitive: 30 },
    tradeoffs: {
      gain: "Application server can fail without bringing the system down; isolated database resources.",
      loss: "Networking hops now introduce latencies. Session storage is no longer local.",
      complexity: "MEDIUM"
    },
    pressures: { traffic: 35, latency: 45, availability: 30, cost: 25, teamSize: 15 },
    diff: {
      added: ["Load Balancer", "App Instance 2", "Remote PostgreSQL DB"],
      removed: ["Local Database", "Local Background Worker"],
      risks: ["Database connection exhaustion", "Load Balancer becomes the new Single Point of Failure"]
    },
    topology: {
      nodes: [
        { id: "client", label: "User Clients", type: "client", x: 15, y: 50, status: "healthy" },
        { id: "lb", label: "HTTP Load Balancer", type: "lb", x: 35, y: 50, status: "healthy" },
        { id: "api1", label: "App Server #1", type: "api", x: 55, y: 30, status: "healthy" },
        { id: "api2", label: "App Server #2", type: "api", x: 55, y: 70, status: "healthy" },
        { id: "db", label: "Dedicated PostgreSQL", type: "db", x: 80, y: 50, status: "stressed" }
      ],
      links: [
        { from: "client", to: "lb", type: "sync", active: true },
        { from: "lb", to: "api1", type: "sync", active: true },
        { from: "lb", to: "api2", type: "sync", active: true },
        { from: "api1", to: "db", type: "sync", active: true },
        { from: "api2", to: "db", type: "sync", active: true }
      ]
    }
  },
  {
    id: "users_10k",
    label: "10,000 Users",
    userCount: 10000,
    rps: "250 req/sec",
    architecture: "App Cluster + Caching + Distributed Message Queue",
    constraint: "Database Read Saturation",
    bottleneck: "Frequent repeated SQL queries for menu items, customer accounts, and settings",
    story: "At 10,000 users, database reads are choking the primary PostgreSQL database. Web requests block waiting for database locks. We introduce Redis to cache frequent read queries (like menu items). We also replace our unreliable local worker queues with BullMQ backed by Redis. Background notification jobs now queue up safely in Redis, ensuring they survive app crashes.",
    capabilities: ["Redis Query Caching", "Distributed Task Queuing", "Session State Cache"],
    cost: { infra: 55, operational: 50, cognitive: 45 },
    tradeoffs: {
      gain: "Protects database from read spikes; background jobs are safely persistent.",
      loss: "Risks cache invalidation bugs ('there are two hard problems...'). Stale data can occur.",
      complexity: "MEDIUM"
    },
    pressures: { traffic: 60, latency: 65, availability: 50, cost: 45, teamSize: 25 },
    diff: {
      added: ["Redis Cache / Queue", "Dedicated Background Workers"],
      removed: [],
      risks: ["Cache invalidation errors", "Redis memory exhaustion (OOM) crashes the worker pipeline"]
    },
    topology: {
      nodes: [
        { id: "client", label: "User Clients", type: "client", x: 10, y: 50, status: "healthy" },
        { id: "lb", label: "Load Balancer", type: "lb", x: 25, y: 50, status: "healthy" },
        { id: "api1", label: "App Server #1", type: "api", x: 45, y: 30, status: "healthy" },
        { id: "api2", label: "App Server #2", type: "api", x: 45, y: 70, status: "healthy" },
        { id: "redis", label: "Redis Cache/Queue", type: "cache", x: 65, y: 30, status: "healthy" },
        { id: "worker", label: "Background Workers", type: "worker", x: 85, y: 30, status: "healthy" },
        { id: "db", label: "PostgreSQL Primary", type: "db", x: 65, y: 70, status: "stressed" }
      ],
      links: [
        { from: "client", to: "lb", type: "sync", active: true },
        { from: "lb", to: "api1", type: "sync", active: true },
        { from: "lb", to: "api2", type: "sync", active: true },
        { from: "api1", to: "redis", type: "sync", active: true },
        { from: "api2", to: "redis", type: "sync", active: true },
        { from: "api1", to: "db", type: "sync", active: true },
        { from: "api2", to: "db", type: "sync", active: true },
        { from: "redis", to: "worker", type: "async", active: true },
        { from: "worker", to: "db", type: "sync", active: true }
      ]
    }
  },
  {
    id: "users_100k",
    label: "100,000 Users",
    userCount: 100000,
    rps: "2,500 req/sec",
    architecture: "Read Replicas + Edge CDN + Automated Scaling Group",
    constraint: "Primary Database Write IOPS / Replica Lag",
    bottleneck: "Reporting / read traffic fighting write traffic on the Primary DB",
    story: "At 100,000 users, even with caching, database reads and writes conflict. To resolve this, we configure Database Replication: we split our database tier into a PostgreSQL Primary (handling all writes) and a PostgreSQL Read Replica (handling all reads). We also introduce a CDN (Content Delivery Network) at the edge to serve static assets directly to users without touching our servers.",
    capabilities: ["Database Read Replicas", "Edge Content Delivery (CDN)", "Auto-Scaling App Groups"],
    cost: { infra: 75, operational: 70, cognitive: 70 },
    tradeoffs: {
      gain: "Read capacity scales horizontally; web server resource footprint is highly optimized.",
      loss: "Read replica lag can cause users to write data and not see it immediately (eventual consistency).",
      complexity: "HIGH"
    },
    pressures: { traffic: 80, latency: 75, availability: 70, cost: 70, teamSize: 45 },
    diff: {
      added: ["Edge CDN", "PostgreSQL Read Replica"],
      removed: [],
      risks: ["Replica replication delay", "Split-brain replica configurations during network partitions"]
    },
    topology: {
      nodes: [
        { id: "client", label: "User Clients", type: "client", x: 10, y: 50, status: "healthy" },
        { id: "cdn", label: "Edge CDN", type: "cdn", x: 22, y: 30, status: "healthy" },
        { id: "lb", label: "Load Balancer", type: "lb", x: 22, y: 70, status: "healthy" },
        { id: "api1", label: "App Server #1", type: "api", x: 42, y: 55, status: "healthy" },
        { id: "api2", label: "App Server #2", type: "api", x: 42, y: 85, status: "healthy" },
        { id: "redis", label: "Redis Cache/Queue", type: "cache", x: 62, y: 30, status: "healthy" },
        { id: "worker", label: "Background Workers", type: "worker", x: 82, y: 30, status: "healthy" },
        { id: "db_primary", label: "Postgres Primary (Writes)", type: "db", x: 62, y: 85, status: "healthy" },
        { id: "db_replica", label: "Postgres Replica (Reads)", type: "replica", x: 82, y: 85, status: "stressed" }
      ],
      links: [
        { from: "client", to: "cdn", type: "sync", active: true },
        { from: "client", to: "lb", type: "sync", active: true },
        { from: "lb", to: "api1", type: "sync", active: true },
        { from: "lb", to: "api2", type: "sync", active: true },
        { from: "api1", to: "redis", type: "sync", active: true },
        { from: "api2", to: "redis", type: "sync", active: true },
        { from: "api1", to: "db_primary", type: "sync", active: true },
        { from: "api2", to: "db_primary", type: "sync", active: true },
        { from: "api1", to: "db_replica", type: "sync", active: true },
        { from: "api2", to: "db_replica", type: "sync", active: true },
        { from: "redis", to: "worker", type: "async", active: true },
        { from: "worker", to: "db_primary", type: "sync", active: true },
        { from: "db_primary", to: "db_replica", type: "replica", active: true }
      ]
    }
  },
  {
    id: "users_1m",
    label: "1,000,000 Users",
    userCount: 1000000,
    rps: "25,000 req/sec",
    architecture: "Global Microservices + Database Sharding / Partitioning",
    constraint: "Global Network Latency / Distributed Transaction Lockouts",
    bottleneck: "Primary database single-write bottleneck; international network latency",
    story: "At 1,000,000 users, a single PostgreSQL primary cannot handle the write volume. We must Shard or Partition the database (e.g. splitting order records by region or customer ID). We also break our monolithic app server into microservices (Checkout Service, Notifications Service, Inventory Service) so teams can scale and deploy them independently.",
    capabilities: ["Database Sharding", "Independent Microservices", "Global Anycast Routing", "Distributed Tracing"],
    cost: { infra: 95, operational: 90, cognitive: 95 },
    tradeoffs: {
      gain: "No single database limits; infinite scaling limits; fault-isolation per microservice.",
      loss: "Debugging requires tracing; no native SQL joins across shards; complex distributed deploys.",
      complexity: "HIGH"
    },
    pressures: { traffic: 95, latency: 85, availability: 90, cost: 95, teamSize: 90 },
    diff: {
      added: ["Checkout Service", "Catalog Service", "Order DB Shard 1", "Order DB Shard 2"],
      removed: ["Monolith App Servers", "PostgreSQL Primary"],
      risks: ["Data inconsistency across shards", "Network service-to-service communication failures"]
    },
    topology: {
      nodes: [
        { id: "client", label: "User Clients", type: "client", x: 10, y: 50, status: "healthy" },
        { id: "cdn", label: "Anycast Edge CDN", type: "cdn", x: 22, y: 30, status: "healthy" },
        { id: "lb", label: "Global Load Balancer", type: "lb", x: 22, y: 70, status: "healthy" },
        { id: "checkout_srv", label: "Checkout Service", type: "api", x: 42, y: 40, status: "healthy" },
        { id: "catalog_srv", label: "Catalog Service", type: "api", x: 42, y: 75, status: "healthy" },
        { id: "redis", label: "Global Redis Cache", type: "cache", x: 62, y: 20, status: "healthy" },
        { id: "queue", label: "Kafka Message Bus", type: "queue", x: 62, y: 50, status: "healthy" },
        { id: "worker", label: "Asynchronous Workers", type: "worker", x: 82, y: 20, status: "healthy" },
        { id: "db_shard1", label: "Order DB (Shard A-M)", type: "db", x: 82, y: 50, status: "healthy" },
        { id: "db_shard2", label: "Order DB (Shard N-Z)", type: "db", x: 82, y: 80, status: "healthy" }
      ],
      links: [
        { from: "client", to: "cdn", type: "sync", active: true },
        { from: "client", to: "lb", type: "sync", active: true },
        { from: "lb", to: "checkout_srv", type: "sync", active: true },
        { from: "lb", to: "catalog_srv", type: "sync", active: true },
        { from: "checkout_srv", to: "redis", type: "sync", active: true },
        { from: "checkout_srv", to: "queue", type: "sync", active: true },
        { from: "catalog_srv", to: "redis", type: "sync", active: true },
        { from: "queue", to: "worker", type: "async", active: true },
        { from: "worker", to: "db_shard1", type: "sync", active: true },
        { from: "worker", to: "db_shard2", type: "sync", active: true },
        { from: "checkout_srv", to: "db_shard1", type: "sync", active: true },
        { from: "checkout_srv", to: "db_shard2", type: "sync", active: true }
      ]
    }
  }
];
