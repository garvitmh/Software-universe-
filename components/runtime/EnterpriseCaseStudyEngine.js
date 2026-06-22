/**
 * EnterpriseCaseStudyEngine.js
 * 
 * Compares Burger Farm's architectural problems against the real-world evolution
 * and engineering practices of elite tech organizations like Stripe, Netflix, Uber, and Google.
 * Highlights constraint-aware recommendations (e.g. BullMQ over Kafka for small teams)
 * to teach that architecture is about earned complexity.
 * 
 * Pure functions only. Runs safely in both Node and browser environments.
 */

// Comprehensive profiles of industry leaders
export const COMPANY_PROFILES = {
  stripe: {
    name: "Stripe",
    domains: ["PAYMENTS", "SECURITY", "RELIABILITY", "QUEUES"],
    scale: "Global payment volume of hundreds of billions, millions of events/sec",
    principles: [
      "Idempotency first: prevent duplicate charges at all costs",
      "Strict double-entry bookkeeping ledger architecture",
      "API stability and backward compatibility guarantees"
    ],
    patterns: [
      "Idempotent Consumers",
      "Transactional Outbox Pattern",
      "Immutable Ledgers"
    ],
    failures: [
      {
        incident: "Double-charge incident under network timeouts",
        rootCause: "Clients retrying POST payment requests without unique idempotency keys.",
        lessons: "Enforce idempotency keys on all write mutations globally.",
        changesMade: "Mandated Stripe-Idempotency-Key headers in API request validation filters."
      }
    ],
    architectureEvolution: [
      "Startup: Simple Ruby on Rails Payment API wrapper",
      "Growth: Distributed Idempotency middleware layer using Redis keys",
      "Scale: Highly-available double-entry ledger database engine",
      "Enterprise: Planet-scale, multi-region active-active transaction ledger platform"
    ]
  },
  netflix: {
    name: "Netflix",
    domains: ["RELIABILITY", "OBSERVABILITY", "MICROSERVICES", "CACHE"],
    scale: "Hundreds of millions of active video streams globally, peak internet traffic",
    principles: [
      "Chaos engineering: constantly test system resilience under real outages",
      "SRE Fault isolation: contain outages to the smallest blast radius",
      "Design for failure: degrade gracefully rather than crash"
    ],
    patterns: [
      "Circuit Breakers",
      "Bulkhead Isolation",
      "Chaos Monkey testing"
    ],
    failures: [
      {
        incident: "Cascading dependency failure blackout",
        rootCause: "A single downstream microservice failure saturated the main API gateway worker threads.",
        lessons: "Isolate client execution resources and break execution flows immediately upon failure thresholds.",
        changesMade: "Introduced Hystrix circuit-breaker wrappers around all downstream service dependencies."
      }
    ],
    architectureEvolution: [
      "Startup: Monolithic DVD-rental website on a single server",
      "Growth: Deconstructed AWS cloud-based microservices architecture",
      "Scale: Chaos-driven resilience layer and distributed caching tiers",
      "Enterprise: Global multi-region replication and automated active-active traffic failovers"
    ]
  },
  uber: {
    name: "Uber",
    domains: ["ORDERS", "DELIVERY", "QUEUES", "ANALYTICS"],
    scale: "Millions of concurrent rides and deliveries, sub-second geospatial updates",
    principles: [
      "Geospatial cell matching for dispatch logistics optimization",
      "Asynchronous, event-driven service interaction pathways",
      "Eventual consistency over distributed ACID transactions"
    ],
    patterns: [
      "Event Sourcing",
      "Geospatial sharding (H3)",
      "Apache Kafka messaging streams"
    ],
    failures: [
      {
        incident: "Dispatch coordination server latency lockup",
        rootCause: "Synchronous HTTP/REST API endpoints saturated internal event loops under high traffic spikes.",
        lessons: "Shift dispatch computations from synchronous APIs to asynchronous message queues.",
        changesMade: "Migrated dispatch core workflows to Apache Kafka log partition pipelines."
      }
    ],
    architectureEvolution: [
      "Startup: Monolithic Node.js dispatch server",
      "Growth: Service-Oriented Architecture (SOA) split by business functions",
      "Scale: Geospatial cell sharding (H3 index framework) and Kafka event streams",
      "Enterprise: Planet-scale marketplace balancing system across multi-region active datastores"
    ]
  },
  amazon: {
    name: "Amazon",
    domains: ["MICROSERVICES", "DATABASES", "DEPLOYMENTS", "RELIABILITY"],
    scale: "Global e-commerce traffic, millions of server instances, AWS cloud host",
    principles: [
      "Two-pizza teams: complete ownership of specific business APIs",
      "Strict service boundary limits: communicate only via APIs",
      "Operational excellence and metrics-driven system management"
    ],
    patterns: [
      "Database sharding",
      "Bulkhead segregation",
      "Microservice ownership models"
    ],
    failures: [
      {
        incident: "DynamoDB storage cluster write saturation",
        rootCause: "Uncontrolled write surges locked database partition nodes and led to cascading shop outages.",
        lessons: "Enforce retry backoffs with jitter and configure strict client-side rate limits.",
        changesMade: "Implemented adaptive partition throttling and client-side exponential backoffs."
      }
    ],
    architectureEvolution: [
      "Startup: Monolithic Obidos e-commerce engine",
      "Growth: Early migration to Service-Oriented Abstractions (SOA)",
      "Scale: High-availability custom NoSQL databases (DynamoDB development)",
      "Enterprise: Serverless edge computing and global AWS cloud mesh systems"
    ]
  },
  google: {
    name: "Google",
    domains: ["OBSERVABILITY", "RELIABILITY", "DATABASES", "DEPLOYMENTS"],
    scale: "Billions of daily search queries, global cloud compute network",
    principles: [
      "SRE Golden Signals: monitor Latency, Traffic, Errors, and Saturation",
      "Error budget enforcement: balance velocity with system reliability",
      "Postmortem-driven culture: blameless review of operational failures"
    ],
    patterns: [
      "Distributed Tracing (Dapper)",
      "Borg container orchestration",
      "Spanner global transaction engine"
    ],
    failures: [
      {
        incident: "Global login authentication outage",
        rootCause: "A corrupted configuration update propagated globally due to lack of canary gates.",
        lessons: "Implement automated canary gates and validation filters for config rollouts.",
        changesMade: "Mandated strict configuration schema checks and regional progressive rollouts."
      }
    ],
    architectureEvolution: [
      "Startup: Single Stanford indexer server running on cheap PCs",
      "Growth: Google File System (GFS) and MapReduce distributed computing framework",
      "Scale: Borg container manager and distributed key-value datastores (BigTable)",
      "Enterprise: Spanner globally-consistent distributed relational database systems"
    ]
  },
  cloudflare: {
    name: "Cloudflare",
    domains: ["SECURITY", "CACHE", "RELIABILITY"],
    scale: "Terabits per second of internet routing, global edge network proxy",
    principles: [
      "Edge computing logic execution closest to the end user",
      "Global caching by default to protect origin servers",
      "Zero-Trust security controls across all routing paths"
    ],
    patterns: [
      "Anycast routing networks",
      "Edge Worker execution sandboxes",
      "DDoS mitigation scrubbers"
    ],
    failures: [
      {
        incident: "Global network route leak outage",
        rootCause: "A BGP route advertisement configuration error leaked massive IP space routing tables.",
        lessons: "Verify all external routing advertisements through automated validation filters.",
        changesMade: "Enforced strict BGP routing validation filters and automated prefix limits."
      }
    ],
    architectureEvolution: [
      "Startup: Simple DNS security proxy tool",
      "Growth: Anycast-based global edge proxy network",
      "Scale: Edge serverless runtime engine (Cloudflare Workers)",
      "Enterprise: Comprehensive global SASE security and routing cloud network"
    ]
  },
  shopify: {
    name: "Shopify",
    domains: ["DATABASES", "QUEUES", "RELIABILITY", "ORDERS"],
    scale: "Millions of merchants, high-spike flash sale traffic loads",
    principles: [
      "Monolith first: avoid early microservice splits that slow down delivery",
      "Controlled evolution: scale the database before splitting the codebase",
      "Strict background job isolation for transactional consistency"
    ],
    patterns: [
      "Modular Monolith",
      "Database pod sharding",
      "Active-replica database routers"
    ],
    failures: [
      {
        incident: "Flash sale checkout database connection lockout",
        rootCause: "A surge of concurrent checkouts locked table rows on the primary Postgres write database.",
        lessons: "Segregate merchants into isolated database shards (pods).",
        changesMade: "Built Shopify Pods: sharded database sets grouping merchant domains."
      }
    ],
    architectureEvolution: [
      "Startup: Ruby on Rails app on a single SQLite/PostgreSQL server",
      "Growth: Highly optimized modular Ruby monolith on centralized PostgreSQL databases",
      "Scale: Horizontal database sharding by merchant ID (Pods system)",
      "Enterprise: Globally-distributed multi-active cloud pod hosting configurations"
    ]
  },
  airbnb: {
    name: "Airbnb",
    domains: ["SEARCH", "AUTH", "DATABASES"],
    scale: "Millions of listings and concurrent bookings worldwide",
    principles: [
      "Service boundary segregation",
      "Data consistency in search synchronization",
      "Microservice API consistency"
    ],
    patterns: [
      "Service Mesh",
      "Elasticsearch clustering",
      "Change Data Capture (CDC)"
    ],
    failures: [
      {
        incident: "Booking search index synchronization lag",
        rootCause: "Database updates lagged in cron synchronization tasks, leaving listings inconsistent in search results.",
        lessons: "Transition from cron-based syncing to real-time event CDC.",
        changesMade: "Implemented Debezium Change Data Capture to stream database updates directly to search indices."
      }
    ],
    architectureEvolution: [
      "Startup: Monolithic Rails booking application",
      "Growth: Early SOA decomposition of search and user profiles",
      "Scale: Microservice mesh integration and decentralized API boundaries",
      "Enterprise: Unified service orchestration mesh with centralized schema registries"
    ]
  },
  discord: {
    name: "Discord",
    domains: ["CACHE", "QUEUES", "RELIABILITY"],
    scale: "Trillions of messages, millions of concurrent voice connections",
    principles: [
      "Fast read/write cycles on messaging logs",
      "Memory efficiency in custom routing systems",
      "Stateless communication gateways"
    ],
    patterns: [
      "ScyllaDB distributed NoSQL",
      "Rust service wrappers",
      "Redis caching networks"
    ],
    failures: [
      {
        incident: "Cassandra read latency spike under tombstone load",
        rootCause: "Deletions in chat channels created database tombstones that saturated Cassandra read scans.",
        lessons: "Relational and early NoSQL storage engines have high scan overhead under frequent modifications.",
        changesMade: "Migrated messaging logs from Apache Cassandra to ScyllaDB (written in C++)."
      }
    ],
    architectureEvolution: [
      "Startup: Single monolithic server with MongoDB chat logs",
      "Growth: Apache Cassandra distributed database cluster",
      "Scale: ScyllaDB migration and Elixir gateway routing optimization",
      "Enterprise: Rust microservice layer with C++ ScyllaDB clusters serving trillions of messages"
    ]
  },
  doordash: {
    name: "DoorDash",
    domains: ["DELIVERY", "ORDERS", "RELIABILITY"],
    scale: "Millions of daily food deliveries, real-time dispatch routes",
    principles: [
      "Real-time logistics optimization",
      "Marketplace balance between drivers and restaurants",
      "Fast localized geo-routing calculations"
    ],
    patterns: [
      "Geospatial dispatching nodes",
      "Redis queue buffering",
      "Distributed lock managers"
    ],
    failures: [
      {
        incident: "Dispatcher lock queue congestion",
        rootCause: "Lock contention on localized driver assignment threads blocked database writes.",
        lessons: "Implement optimistic locks and retry backoffs on dispatcher queues.",
        changesMade: "Implemented lock timeout parameters and client-side retry-with-jitter rules."
      }
    ],
    architectureEvolution: [
      "Startup: Monolithic Django backend app",
      "Growth: Separate Python/Django services for orders and drivers",
      "Scale: Microservices logistics engines and geospatial dispatch loops",
      "Enterprise: Dynamic real-time geospatial routing and fleet assignment grid"
    ]
  },
  linkedin: {
    name: "LinkedIn",
    domains: ["QUEUES", "ANALYTICS", "OBSERVABILITY"],
    scale: "Hundreds of millions of members, billions of social graph updates",
    principles: [
      "Social graph query optimizations",
      "Asynchronous event-driven updates",
      "Highly scalable tracking metrics pipelines"
    ],
    patterns: [
      "Apache Kafka event pipeline",
      "Social graph database (LiX)",
      "Transactional outbox pattern"
    ],
    failures: [
      {
        incident: "Activity feed updates propagation lag",
        rootCause: "Synchronous database checks on member connections saturated the database CPU.",
        lessons: "Avoid real-time traversals of social graph connections during page loads.",
        changesMade: "Introduced social feed cache layers that pre-compute and store user timelines."
      }
    ],
    architectureEvolution: [
      "Startup: Monolithic web app on a single database",
      "Growth: Transition to early service architecture",
      "Scale: Built custom Kafka log system for real-time messaging pipeline",
      "Enterprise: Multi-datacenter social graph replication and unified event broker bus"
    ]
  },
  meta: {
    name: "Meta",
    domains: ["CACHE", "DATABASES", "RELIABILITY"],
    scale: "Billions of daily active social users, social graph API requests",
    principles: [
      "Cache everything: shield databases at all costs",
      "Fast iteration and canary-based deployments",
      "Distributed consensus for graph lookups"
    ],
    patterns: [
      "Memcached cache-aside",
      "MySQL sharding",
      "TAO graph datastore"
    ],
    failures: [
      {
        incident: "Cascading global login outage under cache storm",
        rootCause: "A cache invalidation event triggered database read storms, saturating database pools.",
        lessons: "Shield databases from cache invalidations using cache leases.",
        changesMade: "Introduced TAO: a distributed social graph store with query coalescing."
      }
    ],
    architectureEvolution: [
      "Startup: Monolithic PHP application",
      "Growth: Memcached cache-aside cluster shielding master-replica MySQL pools",
      "Scale: Sharding MySQL databases and introducing custom PHP compilers",
      "Enterprise: TAO distributed social graph store spanning global datacenters"
    ]
  },
  github: {
    name: "GitHub",
    domains: ["DATABASES", "DEPLOYMENTS", "RELIABILITY"],
    scale: "Millions of repositories, millions of developer git actions",
    principles: [
      "High availability of code repositories",
      "Consistent relational database operations",
      "Progressive delivery of developer features"
    ],
    patterns: [
      "MySQL replication",
      "Vitess database sharding",
      "Canary deployments"
    ],
    failures: [
      {
        incident: "MySQL database failover split-brain outage",
        rootCause: "Database orchestrator triggered automated master promotion under network partition, leading to duplicate write streams.",
        lessons: "Ensure strict distributed consensus checks before master DB promotions.",
        changesMade: "Configured MySQL Orchestrator with Consul-based consensus verification steps."
      }
    ],
    architectureEvolution: [
      "Startup: Monolithic Ruby on Rails app",
      "Growth: Active-replica MySQL sets shielding git file servers",
      "Scale: Vitess database sharding proxy layers",
      "Enterprise: Globally-replicated edge proxy routers and resilient git cluster systems"
    ]
  },
  twilio: {
    name: "Twilio",
    domains: ["NOTIFICATIONS", "SECURITY", "RELIABILITY"],
    scale: "Millions of daily API requests, global telco carrier integrations",
    principles: [
      "Failover routing resilient to telco carrier blackouts",
      "Idempotency in REST message requests",
      "Asynchronous queuing for heavy outbound spikes"
    ],
    patterns: [
      "Provider failover routing",
      "API request idempotency",
      "Dead Letter Queues (DLQ)"
    ],
    failures: [
      {
        incident: "SMS notification blackout outage",
        rootCause: "Primary carrier gateway suffered downtime, blocking outbound SMS requests.",
        lessons: "Always implement dynamic carrier routing models with automatic failover.",
        changesMade: "Developed multi-provider failover routing with automatic carrier status checking."
      }
    ],
    architectureEvolution: [
      "Startup: Monolithic telephony server gateway",
      "Growth: Service-oriented telephony API wrapper",
      "Scale: Distributed carrier routing networks",
      "Enterprise: Global multi-carrier failover network spanning hundreds of telcos"
    ]
  }
};

// Target details of architectural patterns
export const ARCHITECTURAL_PATTERNS = {
  cqrs: {
    pattern: "CQRS (Command Query Responsibility Segregation)",
    why: "Separates read paths from write paths to scale queries and commands independently.",
    when: "High read-to-write ratios where analytics queries lock write tables.",
    tradeoffs: "Adds eventual consistency challenges and increases code complexity."
  },
  event_sourcing: {
    pattern: "Event Sourcing",
    why: "Stores all system state updates as an immutable append-only sequence of history events.",
    when: "Auditability is mandatory (e.g. accounting ledger or order tracking history).",
    tradeoffs: "High learning curve, requires event migration strategies (schema evolution), and complicates queries."
  },
  saga: {
    pattern: "Saga Pattern",
    why: "Manages distributed transactions across multiple microservices using compensation events.",
    when: "Multiple independent databases must reach consistency without distributed 2PC locking.",
    tradeoffs: "High complexity in rollback workflows and debug tracing challenges."
  },
  outbox: {
    pattern: "Transactional Outbox Pattern",
    why: "Guarantees reliable message publishing by writing events to a DB outbox table within the write transaction.",
    when: "A database transaction must commit *exactly when* a background message is sent.",
    tradeoffs: "Requires a polling publisher thread or CDC (Change Data Capture) pipeline."
  },
  circuit_breaker: {
    pattern: "Circuit Breaker",
    why: "Prevents cascading failures by immediately failing fast when downstream services time out.",
    when: "Invoking third-party web services or unreliable network boundaries.",
    tradeoffs: "Requires fallback handlers and monitoring gauges."
  },
  bulkhead: {
    pattern: "Bulkhead Isolation",
    why: "Segregates server threads or processes into isolated resource pools.",
    when: "Preventing a bottleneck in one feature from starving threads of another feature.",
    tradeoffs: "Increases infrastructure complexity and configuration management."
  },
  retries: {
    pattern: "Retries with Exponential Backoff and Jitter",
    why: "Re-tries failed network operations, backing off gradually to prevent self-inflicted DDoS.",
    when: "All remote HTTP or database operations subject to transient errors.",
    tradeoffs: "Can increase client latencies if timeout thresholds are too high."
  },
  caching: {
    pattern: "Cache-Aside Pattern",
    why: "Stores frequently read records in fast in-memory stores to reduce database load.",
    when: "High read ratios on static or slowly-changing datasets.",
    tradeoffs: "Requires cache invalidation logic, causing potential consistency drift."
  },
  sharding: {
    pattern: "Database Sharding",
    why: "Splits a single database table horizontally across multiple independent servers.",
    when: "Write transaction rates exceed the hardware limits of a single master node.",
    tradeoffs: "Complicates multi-shard queries, transactions, and index management."
  },
  read_replicas: {
    pattern: "Database Read Replicas",
    why: "Routes query traffic to read-only database nodes, keeping the primary node for write transactions.",
    when: "High query loads block transaction tables on the primary write database.",
    tradeoffs: "Introduces replication lag between primary and replica nodes."
  },
  workers: {
    pattern: "Background Job Workers",
    why: "Deletes heavy workflows from main execution thread to process them asynchronously.",
    when: "Sending emails, parsing reports, or syncing invoices without blocking user API requests.",
    tradeoffs: "Requires queue brokers (Redis/RabbitMQ) and worker monitors."
  },
  queues: {
    pattern: "Message Queues",
    why: "Provides durable, asynchronous message buffers between decoupled services.",
    when: "Buffering spikes in event traffic and ensuring reliable message delivery.",
    tradeoffs: "Adds operations overhead and eventual consistency challenges."
  }
};

// Famous real-world industry outage stories
export const FAILURE_STORIES = {
  netflix_hystrix: {
    incident: "Netflix Ribbon Outage (December 2012)",
    rootCause: "A AWS service degradation caused downstream request timeouts, cascade-exhausting main API gateway thread pools.",
    lessons: "Always wrap downstream calls with timeout thresholds and isolate resource threads.",
    changesMade: "Fully implemented Hystrix circuit-breakers and isolated pool partitions globally."
  },
  uber_kafka: {
    incident: "Uber Geospatial Dispatch Lag (2015)",
    rootCause: "Synchronous REST endpoints bottlenecked driver coordination updates, causing ride requests to drop under peak loads.",
    lessons: "Shift real-time dispatch systems to asynchronous log brokers.",
    changesMade: "Migrated ride assignment flow to Kafka and geospatial indices (H3) to balance dispatch queues."
  },
  stripe_idempotency: {
    incident: "Stripe Webhook Storm Incident (2018)",
    rootCause: "A database transaction lockup led to client request timeouts. Clients retried charge requests, creating duplicate webhook storms.",
    lessons: "Verify unique idempotency parameters before database mutations.",
    changesMade: "Mandated unique idempotency keys and transactional outbox logs to serialize charges safely."
  },
  cloudflare_bgp: {
    incident: "Cloudflare Global Route Leak (June 2019)",
    rootCause: "A transit provider misconfiguration leaked BGP routing tables globally, redirecting massive traffic volumes and dropping DNS routes.",
    lessons: "Enforce strict IP prefix limit controls on all gateway routers.",
    changesMade: "Configured automated Anycast route validation protocols to filter invalid BGP advertisements."
  },
  github_mysql: {
    incident: "GitHub MySQL Split-Brain (October 2018)",
    rootCause: "A network partition triggered database failover scripts to promote a replica replica master while the original master was still writing.",
    lessons: "Require consensus checks across multiple nodes before executing master failover actions.",
    changesMade: "Integrated Consul consensus verification checks inside Orchestrator split-brain failover logic."
  }
};

/**
 * Returns the entire set of company profiles.
 * 
 * @returns {Object} All company profiles
 */
export function getCompanyProfiles() {
  return COMPANY_PROFILES;
}

/**
 * Compares company approaches for a given problem/domain.
 * 
 * @param {Object} problem 
 * @returns {Object[]} Comparative company approaches
 */
export function compareCompanies(problem = {}) {
  const domain = String(problem.domain || "").toUpperCase();
  const issue = String(problem.issue || "").toLowerCase();

  const comparisons = [];

  // Filter and build comparison lists
  for (const [key, profile] of Object.entries(COMPANY_PROFILES)) {
    if (profile.domains.includes(domain) || domain === "" || issue === "") {
      let approach = "Standard architecture";
      let complexity = "Medium";
      let scale = profile.scale;
      let lessons = "Earn complexity step-by-step.";

      if (domain === "PAYMENTS") {
        if (key === "stripe") {
          approach = "Mandated idempotency keys and double-entry ledgers";
          complexity = "High";
          lessons = "Double charge prevention via key checks.";
        } else if (key === "shopify") {
          approach = "Merchant database sharding (Pods) and retry queues";
          complexity = "High";
          lessons = "Isolate merchant transactions to avoid single pool locks.";
        } else if (key === "twilio") {
          approach = "API request idempotency verification";
          complexity = "Medium";
          lessons = "Validate requests before downstream dispatch.";
        }
      } else if (domain === "RELIABILITY" || domain === "MICROSERVICES") {
        if (key === "netflix") {
          approach = "Chaos Monkey testing and Hystrix circuit-breaker isolation";
          complexity = "Very High";
          lessons = "Contain outages using fallback handlers.";
        } else if (key === "amazon") {
          approach = "API-first boundaries, two-pizza service ownership";
          complexity = "High";
          lessons = "Decouple services to scale operations.";
        } else if (key === "google") {
          approach = "Borg scheduling, canary rollouts, strict SLO monitoring";
          complexity = "Very High";
          lessons = "Manage reliability through strict error budgets.";
        }
      } else if (domain === "QUEUES" || domain === "NOTIFICATIONS") {
        if (key === "uber") {
          approach = "Asynchronous Kafka partition queue streams";
          complexity = "High";
          lessons = "Decouple dispatcher nodes from read queries.";
        } else if (key === "discord") {
          approach = "Elixir routing nodes with Rust worker pools";
          complexity = "Very High";
          lessons = "Optimize task queue footprints to avoid cache load.";
        } else if (key === "linkedin") {
          approach = "Apache Kafka event pipeline and graph queries";
          complexity = "High";
          lessons = "Stream updates asynchronously to social connections.";
        }
      }

      comparisons.push({
        company: profile.name,
        approach: approach,
        complexity: complexity,
        scale: scale,
        lessons: lessons
      });
    }
  }

  return comparisons.slice(0, 4); // Limit to top comparison items for neat presentation
}

/**
 * Returns the stage-by-stage evolution story of a company.
 * 
 * @param {string} companyName 
 * @returns {string[]} Evolution timeline
 */
export function generateEvolutionStory(companyName = "stripe") {
  const key = String(companyName).toLowerCase();
  const profile = COMPANY_PROFILES[key];
  if (profile) {
    return profile.architectureEvolution;
  }
  return [
    "Startup: Monolith deployment on a single server",
    "Growth: Introduction of read replicas and basic caches",
    "Scale: Split to modular monolith or early microservices",
    "Enterprise: Multi-region globally distributed active-active clusters"
  ];
}

/**
 * Maps pattern names to detail structures.
 * 
 * @param {string[]} patternNames 
 * @returns {Object[]} Pattern maps
 */
export function mapPatterns(patternNames = []) {
  const result = [];
  patternNames.forEach(name => {
    const key = String(name).toLowerCase().replace(/ /g, "_");
    const pattern = ARCHITECTURAL_PATTERNS[key];
    if (pattern) {
      result.push(pattern);
    } else {
      result.push({
        pattern: name,
        why: "A specialized architectural design strategy.",
        when: "System requirements demand structural optimization.",
        tradeoffs: "Adds structural complexity."
      });
    }
  });

  if (result.length === 0) {
    // Return defaults if empty
    return [ARCHITECTURAL_PATTERNS.circuit_breaker, ARCHITECTURAL_PATTERNS.read_replicas];
  }

  return result;
}

/**
 * Evaluates gains vs sacrifices of a specific high-scale technology.
 * 
 * @param {string} technology 
 * @returns {Object} Tradeoff profile
 */
export function generateTradeoffs(technology = "kafka") {
  const tech = String(technology).toLowerCase();

  if (tech === "kafka" || tech === "event bus") {
    return {
      technology: "Apache Kafka Event Bus",
      gains: [
        "Massive throughput: millions of events per second scalability",
        "Replayability: replay historical logs from offset checkpoints",
        "Decoupled asynchronous scaling: independent consumer speeds"
      ],
      sacrifices: [
        "Extreme operational complexity: requires Zookeeper/KRaft cluster admin",
        "Higher cost overhead: expensive compute and storage resources",
        "Eventual consistency: read-after-write latencies increase code logic"
      ]
    };
  }
  if (tech === "microservices" || tech === "service mesh") {
    return {
      technology: "Distributed Microservices & Service Mesh",
      gains: [
        "Team autonomy: teams own and deploy code independently",
        "Independent scalability: scale memory/cpu of specific bottleneck routes",
        "Fault isolation: one service crash does not take down the entire shop"
      ],
      sacrifices: [
        "Network latency overhead: direct method calls turn to remote RPC hops",
        "Operational burden: requires Docker, Kubernetes, CI/CD, and distributed traces",
        "Data consistency: requires Saga transactions and complex rollback code"
      ]
    };
  }

  return {
    technology: technology,
    gains: ["Increased scalability", "Decoupled system components"],
    sacrifices: ["Operational complexity", "Increased initial setup costs"]
  };
}

/**
 * Returns incident details of a specific failure story.
 * 
 * @param {string} storyId 
 * @returns {Object} Outage history
 */
export function generateFailureStories(storyId = "stripe_idempotency") {
  const key = String(storyId).toLowerCase();
  const story = FAILURE_STORIES[key];
  if (story) {
    return story;
  }
  return FAILURE_STORIES.stripe_idempotency;
}

/**
 * Generates pragmatic recommendations tailored to Burger Farm's constraints.
 * 
 * @param {Object} problem 
 * @param {Object} context - Burger Farm's constraints
 * @returns {Object} Pragmatic recommendations
 */
export function recommendForBurgerFarm(problem = {}, context = {}) {
  const domain = String(problem.domain || "").toUpperCase();
  const teamSize = Number(context.teamSize || 2);
  const budget = String(context.budget || "LOW").toUpperCase();

  // Basic check for team sizes
  if (teamSize <= 3 && budget === "LOW") {
    if (domain === "PAYMENTS") {
      return {
        recommendation: "Use BullMQ + Redis + PostgreSQL for payment idempotency checks.",
        rationale: "Avoid Kafka or service meshes. BullMQ leverages your existing Redis session cache, adding zero extra hosting costs while providing robust retries and job serialization.",
        primaryPattern: "Transactional Outbox with BullMQ queues",
        avoidPattern: "Distributed Kafka transaction log clusters"
      };
    }
    if (domain === "DATABASES" || domain === "ANALYTICS") {
      return {
        recommendation: "Configure PostgreSQL Read Replicas with PgBouncer.",
        rationale: "Avoid sharding or NoSQL migrations. Read replicas route slow analytics queries away from the checkout writer node with minimal operational maintenance.",
        primaryPattern: "Primary-Replica Query Routing with PgBouncer",
        avoidPattern: "Horizontal Database Sharding (MySQL/Postgres Shards)"
      };
    }
    if (domain === "RELIABILITY" || domain === "MICROSERVICES") {
      return {
        recommendation: "Maintain a Modular Monolith with in-memory method separations.",
        rationale: "Avoid split microservices. A modular monolith provides separation of concerns without network serialization latencies, Kubernetes overhead, or distributed database transactions.",
        primaryPattern: "Modular Monolith using separate domains inside a single repository",
        avoidPattern: "Decomposed Microservices mesh"
      };
    }
  }

  // Default recommendations
  return {
    recommendation: "Adopt modular component isolation and write tasks to memory queues.",
    rationale: "Keep operations simple. Add infrastructure components (like queues and replicas) only when verified benchmarks show CPU or I/O exhaustion.",
    primaryPattern: "Background Job Workers (BullMQ)",
    avoidPattern: "JVM-based message brokers (Kafka/RabbitMQ)"
  };
}

/**
 * Calculates current architectural maturity.
 * 
 * @param {Object} context 
 * @returns {Object} Maturity mappings
 */
export function determineMaturity(context = {}) {
  const userTraffic = Number(context.traffic || 100);

  if (userTraffic < 1000) {
    return {
      currentLevel: "Startup",
      nextLevel: "Growing Startup",
      requiredCapabilities: ["Async background workers", "Centralized cache store"]
    };
  }
  if (userTraffic < 100000) {
    return {
      currentLevel: "Growing Startup",
      nextLevel: "Scale-up",
      requiredCapabilities: ["Read replicas routing", "Idempotency key checks", "Dead Letter Queues"]
    };
  }

  return {
    currentLevel: "Scale-up",
    nextLevel: "Enterprise",
    requiredCapabilities: ["Database sharding", "Multi-region failovers", "Distributed trace monitoring"]
  };
}

/**
 * Explains lessons from industry failures.
 * 
 * @param {Object} problem 
 * @returns {string[]} Architectural lessons
 */
export function explainLessons(problem = {}) {
  const domain = String(problem.domain || "").toUpperCase();

  if (domain === "PAYMENTS") {
    return [
      "Stripe lessons: Never trust client networks. Double clicks or dropped packets must be filtered by unique keys.",
      "Shopify lessons: Flash sale traffic spikes lock single writer nodes; segregate tenant connections early."
    ];
  }
  if (domain === "RELIABILITY") {
    return [
      "Netflix lessons: Downstream services will fail. Prevent failures from cascading by cutting connections immediately.",
      "Google SRE lessons: Automatic recovery scripts need strict sandbox testing to prevent global loop outages."
    ];
  }

  return [
    "Keep systems simple: adopt complexity only when traffic metrics justify the operational maintenance burden.",
    "Postmortems are valuable: write blameless reports to resolve structural root causes rather than blaming individuals."
  ];
}

/**
 * Generates staff-architect narrative comparing Burger Farm and giants.
 * 
 * @param {Object} problem 
 * @param {Object} context 
 * @returns {string} Narrative biography
 */
export function generateNarrative(problem = {}, context = {}) {
  const domain = String(problem.domain || "payments").toLowerCase();
  const recommendation = recommendForBurgerFarm(problem, context);

  return `Initially, Burger Farm was a simple startup using direct synchronous calls. Under peak loads, this led to timeouts and lockups. Stripe and Shopify faced similar scaling challenges years ago. They solved them by adding idempotency keys and database sharding. However, because Burger Farm operates under tight team size limits (2 developers) and budget constraints, copying Netflix or Stripe's massive systems directly would overwhelm the team. Instead, the pragmatic route is to adopt ${recommendation.primaryPattern}. This balances operational simplicity with system resilience, letting the business scale safely without inheriting premature complexity.`;
}

/**
 * Main entry point: Generates a unified comparative case study payload.
 * 
 * @param {Object} problem - Payload detailing domain and issue
 * @param {Object} context - Optional payload detailing team/traffic context
 * @returns {Object} Unified case study data
 */
export function generateCaseStudy(problem = {}, context = { teamSize: 2, budget: "LOW", traffic: 500 }) {
  const activeProblem = { domain: "payments", issue: "duplicate webhooks", ...problem };
  const activeContext = { teamSize: 2, budget: "LOW", traffic: 500, ...context };

  const comps = compareCompanies(activeProblem);
  const narrative = generateNarrative(activeProblem, activeContext);
  const rec = recommendForBurgerFarm(activeProblem, activeContext);
  const maturity = determineMaturity(activeContext);
  const lessons = explainLessons(activeProblem);

  // Extract relevant pattern names from comparisons
  const patternNames = ["circuit_breaker", "read_replicas", "outbox"];
  if (activeProblem.domain === "payments") {
    patternNames.push("outbox");
  } else if (activeProblem.domain === "queues") {
    patternNames.push("workers");
  }
  const patterns = mapPatterns(patternNames);

  return {
    problem: activeProblem,
    burgerFarm: {
      teamSize: activeContext.teamSize,
      budget: activeContext.budget,
      traffic: activeContext.traffic
    },
    companies: Object.keys(COMPANY_PROFILES).slice(0, 4),
    evolution: generateEvolutionStory("stripe"),
    decisions: [
      `Adopt ${rec.primaryPattern} to resolve ${activeProblem.issue}`
    ],
    tradeoffs: generateTradeoffs(activeProblem.domain === "queues" ? "kafka" : "microservices"),
    incidents: [
      generateFailureStories(activeProblem.domain === "payments" ? "stripe_idempotency" : "netflix_hystrix")
    ],
    lessons: lessons,
    recommendations: rec.recommendation,
    recommendationsDetails: rec,
    architecturalPatterns: patterns,
    burgerFarmVersion: "v1.2 (Modular Monolith with local Redis session storage)",
    companyApproaches: comps.map(c => `${c.company} → ${c.approach}`),
    evolutionStory: narrative,
    maturity: maturity
  };
}
