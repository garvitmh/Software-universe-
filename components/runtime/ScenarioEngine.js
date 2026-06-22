/**
 * ScenarioEngine.js
 * 
 * Specialized architectural simulator representing alternative realities.
 * Simulates scenarios like traffic spikes (100x), database outages, Redis crashes,
 * payment timeouts, team shrinks, and cost budget reductions.
 * Projects failure propagations, chronological timelines, SRE recovery rules,
 * architecture evolution stages, alternative comparisons (BullMQ vs Kafka),
 * tradeoff ratios, and explainable staff architect narratives.
 * 
 * Pure functions only. Runs safely in both Node and browser environments.
 */

// Supported scenarios
export const SUPPORTED_SCENARIOS = [
  "TRAFFIC_SPIKE", "DATABASE_FAILURE", "REDIS_FAILURE", "PAYMENT_TIMEOUT",
  "WORKER_CRASH", "TEAM_SHRINK", "COST_PRESSURE", "ANALYTICS_EXPLOSION",
  "SECURITY_BREACH", "THIRD_PARTY_OUTAGE"
];

// Baseline default scenario model
export const DEFAULT_SCENARIO = {
  id: "S-TRAFFIC-01",
  type: "TRAFFIC_SPIKE",
  severity: "HIGH",
  assumptions: ["All systems start healthy", "Developer team size is 2", "Redis cache is active"],
  parameters: { multiplier: 100 }
};

/**
 * Detects components failing under the scenario stress.
 * 
 * @param {Object} scenario 
 * @returns {Object[]} Bottleneck profiles
 */
export function detectScenarioBottlenecks(scenario = DEFAULT_SCENARIO) {
  const type = String(scenario.type || "TRAFFIC_SPIKE").toUpperCase();

  if (type === "TRAFFIC_SPIKE") {
    return [
      { component: "PostgreSQL Database", reason: "Read/write lock contention under concurrent checkout transactions.", severity: "CRITICAL" },
      { component: "PaymentService", reason: "External payment gateway API timeouts block Express event loops.", severity: "HIGH" },
      { component: "OrderController", reason: "Express server container CPU pool exhausted.", severity: "MEDIUM" }
    ];
  }

  if (type === "DATABASE_FAILURE") {
    return [
      { component: "PostgreSQL Primary Node", reason: "Primary database instance crashed or unreachable.", severity: "CRITICAL" },
      { component: "OrderRepository", reason: "Database query connections fail, throwing unhandled exceptions.", severity: "HIGH" }
    ];
  }

  if (type === "REDIS_FAILURE") {
    return [
      { component: "BullMQ Redis Queue Broker", reason: "Redis memory exhausted or node disconnected.", severity: "CRITICAL" },
      { component: "NotificationWorker", reason: "Cannot fetch jobs from queue, background notifications halted.", severity: "HIGH" }
    ];
  }

  if (type === "ANALYTICS_EXPLOSION") {
    return [
      { component: "PostgreSQL Primary Node", reason: "Heavy sales reporting queries saturate write CPU bandwidth.", severity: "CRITICAL" }
    ];
  }

  return [
    { component: "System Core API", reason: "General latency degradation under resource constraints.", severity: "MEDIUM" }
  ];
}

/**
 * Tracks how a failure in one component cascades to other dependent systems.
 * 
 * @param {Object} scenario 
 * @returns {Object} Failure propagation details
 */
export function propagateFailures(scenario = DEFAULT_SCENARIO) {
  const type = String(scenario.type || "TRAFFIC_SPIKE").toUpperCase();

  if (type === "REDIS_FAILURE") {
    return {
      source: "Redis Queue Broker",
      impactedSystems: ["NotificationWorker (Disabled)", "KitchenPOS (Job buffer halted)", "AdminDashboard (Real-time updates failed)"],
      description: "A Redis outage disables BullMQ brokers. Background alerts cease, kitchen printing queues freeze, but client checkouts survive in degraded state."
    };
  }

  if (type === "DATABASE_FAILURE") {
    return {
      source: "PostgreSQL Primary Database",
      impactedSystems: ["OrderRepository (Crashed)", "OrderController (Crashed)", "CheckoutScreen (Crashed)", "StripeGateway (Transactions Rolled Back)"],
      description: "A database failure cascades immediately to repository adapters, causing Express router handlers to throw HTTP 500 exceptions, crashing checkouts."
    };
  }

  if (type === "PAYMENT_TIMEOUT" || type === "THIRD_PARTY_OUTAGE") {
    return {
      source: "Stripe Payment Gateway",
      impactedSystems: ["PaymentService (Blocked thread)", "OrderController (Saturated socket pool)", "PostgreSQL (Connection pool exhaustion)"],
      description: "External network hangs delay Stripe replies. Express threads wait synchronously, holding PostgreSQL write connections open, blocking other domains."
    };
  }

  return {
    source: "General System Load",
    impactedSystems: [],
    description: "No cascading failure detected."
  };
}

/**
 * Outlines chronological time marks of event progressions.
 * 
 * @param {Object} scenario 
 * @returns {string[]} Chronological event log
 */
export function simulateTimeline(scenario = DEFAULT_SCENARIO) {
  const type = String(scenario.type || "TRAFFIC_SPIKE").toUpperCase();

  if (type === "TRAFFIC_SPIKE") {
    return [
      "0 min: Traffic spike starts, API CPU utilization climbs to 85%.",
      "5 min: Database connections saturate, checkout latency breaches 1.2s.",
      "15 min: Synchronous notifications hang, Express socket pool exhausted.",
      "30 min: SRE provisions PostgreSQL read replicas and moves analytics off primary node."
    ];
  }

  if (type === "PAYMENT_TIMEOUT") {
    return [
      "0 min: Stripe Gateway network connection hangs.",
      "2 min: Express queue tasks back up.",
      "10 min: Exponential retries fail, alert payloads redirected to Dead Letter Queue (DLQ).",
      "20 min: Checkout routes report failures, background worker restarts alert retry loop."
    ];
  }

  if (type === "REDIS_FAILURE") {
    return [
      "0 min: Redis container memory alert triggers.",
      "5 min: Redis service crashes under RAM limit, worker connection drops.",
      "15 min: BullMQ queue ceases job dispatches. Notifications delayed.",
      "25 min: SRE restarts Redis cluster with larger memory containers and enables AOF persistence."
    ];
  }

  return [
    "0 min: Scenario simulation initiated.",
    "15 min: Stress metrics stabilize.",
    "30 min: Recovery procedures execute successfully."
  ];
}

/**
 * Details SRE recovery and auto-remediation steps.
 * 
 * @param {Object} scenario 
 * @returns {Object} Recovery plan
 */
export function simulateRecovery(scenario = DEFAULT_SCENARIO) {
  const type = String(scenario.type || "TRAFFIC_SPIKE").toUpperCase();

  if (type === "REDIS_FAILURE") {
    return {
      remedy: "Redis AOF Log Restore & Cluster Expansion",
      steps: [
        "Reload Redis memory data from append-only persistence files (AOF).",
        "Enable cluster replica sentinel pools for automatic failover.",
        "Set up local buffer file storage (SQLite) in Express middleware to capture queue publications during downtime."
      ]
    };
  }

  if (type === "COST_PRESSURE") {
    return {
      remedy: "Infrastructure Cost Compaction",
      steps: [
        "Decommission expensive APM SaaS (Datadog) in favor of self-hosted open-source Prometheus + Grafana.",
        "Downscale developer and staging container counts outside business hours.",
        "Restrict database write connection pool sizes and enable aggressive Redis cache-aside caching."
      ]
    };
  }

  return {
    remedy: "Standard Auto-Remediation",
    steps: [
      "Scale up API container replica counts.",
      "Restart failing background worker instances.",
      "Enforce API rate limits to protect primary datastores."
    ]
  };
}

/**
 * Projects evolutionary stages forced by scenario conditions.
 * 
 * @param {Object} scenario 
 * @returns {string[]} Evolved layout nodes
 */
export function evolveArchitecture(scenario = DEFAULT_SCENARIO) {
  const type = String(scenario.type || "TRAFFIC_SPIKE").toUpperCase();

  if (type === "TRAFFIC_SPIKE" || type === "ANALYTICS_EXPLOSION") {
    return [
      "Single Database Instance Layout (Current)",
      "Read Replica Queries Routing Layout (Phase 1)",
      "Database Horizontal Partitioning Layout (Phase 2)",
      "Database Sharding Layout (Phase 3)",
      "Fully Decoupled Event-Driven Microservices Layout (Phase 4)"
    ];
  }

  return [
    "Modular Monolith (Current)",
    "Modular Monolith with Managed Addons (Phase 1)",
    "Distributed Service Boundaries (Phase 2)"
  ];
}

/**
 * Conducts what-if alternative technology comparisons under stress levels.
 * 
 * @param {Object} scenario 
 * @returns {Object} Comparison matrix
 */
export function compareAlternatives(scenario = DEFAULT_SCENARIO) {
  const type = String(scenario.type || "TRAFFIC_SPIKE").toUpperCase();

  if (type === "TRAFFIC_SPIKE") {
    return {
      comparison: "BullMQ vs Apache Kafka under scaling loads",
      results: [
        { load: "10k users", winner: "BullMQ", reasons: "Low hosting costs, leverages existing Redis, simple code footprint." },
        { load: "100k users", winner: "BullMQ", reasons: "Redis cluster partitioning handles throughput easily without extra cluster admin." },
        { load: "1M users", winner: "Apache Kafka", reasons: "Strict event replay log, partitioned message brokers, handles massive concurrent consumers safely." }
      ]
    };
  }

  return {
    comparison: "Standard vs Managed Services",
    results: [
      { load: "Low Budget", winner: "Self-Hosted", reasons: "Bypasses monthly recurring SaaS bills." },
      { load: "High Scale", winner: "Managed SQS/RDS", reasons: "Delegates operational DevOps load." }
    ]
  };
}

/**
 * Recommends architectural actions to mitigate the scenario risk.
 * 
 * @param {Object} scenario 
 * @returns {Object[]} Recommended remedies
 */
export function generateRecommendations(scenario = DEFAULT_SCENARIO) {
  const type = String(scenario.type || "TRAFFIC_SPIKE").toUpperCase();

  if (type === "TRAFFIC_SPIKE") {
    return [
      { recommendation: "Provision PostgreSQL Read Replicas", impact: "High: Offloads CPU spikes from write node", effort: "Medium" },
      { recommendation: "Configure PgBouncer Connection Pool", impact: "High: Saves PG thread pools from exhaustion", effort: "Low" },
      { recommendation: "Scale worker containers replicas", impact: "Medium: Processes queue backlogs faster", effort: "Low" }
    ];
  }

  if (type === "TEAM_SHRINK") {
    return [
      { recommendation: "Maintain Modular Monolith layout", impact: "Critical: Bypasses microservices operational overhead", effort: "Low" },
      { recommendation: "Decommission custom OAuth in favor of Firebase", impact: "High: Offloads security credential admin load", effort: "Medium" }
    ];
  }

  return [
    { recommendation: "Enable caching in Redis", impact: "Medium: Saves database reads", effort: "Low" },
    { recommendation: "Configure retry limits", impact: "High: Buffers external network outages", effort: "Low" }
  ];
}

/**
 * Scores gains vs sacrifices across simplicity, scale, cost, complexity, and reliability.
 * 
 * @param {Object} scenario 
 * @returns {Object[]} Tradeoff metrics
 */
export function calculateTradeoffs(scenario = DEFAULT_SCENARIO) {
  const type = String(scenario.type || "TRAFFIC_SPIKE").toUpperCase();

  if (type === "TRAFFIC_SPIKE") {
    return [
      { gain: "High Scalability & Availability under surge", sacrifice: "Increased infrastructure costs and eventual consistency delays" }
    ];
  }

  if (type === "TEAM_SHRINK") {
    return [
      { gain: "High developer velocity and low operational load", sacrifice: "Celings on independent scaling of domain packages" }
    ];
  }

  return [
    { gain: "Standardized designs", sacrifice: "Boilerplate code indirection layers" }
  ];
}

/**
 * Models the final stable state after scenario impact.
 * 
 * @param {Object} scenario 
 * @returns {string} Future state overview
 */
export function predictFutureState(scenario = DEFAULT_SCENARIO) {
  const type = String(scenario.type || "TRAFFIC_SPIKE").toUpperCase();

  if (type === "TRAFFIC_SPIKE") {
    return "Stable event-driven Modular Monolith using Redis-backed BullMQ dispatches, supported by PG connection pool proxies and replica read nodes.";
  }

  if (type === "COST_PRESSURE") {
    return "Compacted single-node container deployment utilizing open-source Grafana telemetries and aggressive Redis query caching.";
  }

  return "Restored stable primary system architecture.";
}

/**
 * Creates explainable staff architect narratives.
 * 
 * @param {Object} scenario 
 * @returns {string} Explanatory narrative
 */
export function explainScenario(scenario = DEFAULT_SCENARIO) {
  const type = String(scenario.type || "TRAFFIC_SPIKE").toUpperCase();

  if (type === "TRAFFIC_SPIKE") {
    return "Because traffic pressure is growing 100x and database write locks are blocking checkouts, introducing read replicas and PgBouncer proxies becomes mandatory to protect checkout availability, accepting the tradeoff of eventual consistency delays in analytics reports.";
  }

  if (type === "TEAM_SHRINK") {
    return "Given the team size shrinks, the dominant force shifts to operational simplicity. We recommend maintaining the Modular Monolith and using managed serverless integrations (like Firebase Auth and SQS) to protect developer velocity from operational DevOps exhaustion.";
  }

  return `We recommend implementing mitigation steps for scenario ${type} to balance system availability, simplicity, and hosting costs.`;
}

/**
 * Entry point: simulate reality change parameters.
 * 
 * @param {Object} scenario 
 * @returns {Object} Simulated scenario payload
 */
export function simulateScenario(scenario = DEFAULT_SCENARIO) {
  const active = { ...DEFAULT_SCENARIO, ...scenario };

  const bottlenecks = detectScenarioBottlenecks(active);
  const propagation = propagateFailures(active);
  const timeline = simulateTimeline(active);
  const recovery = simulateRecovery(active);
  const evolution = evolveArchitecture(active);
  const comparisons = compareAlternatives(active);
  const recommendations = generateRecommendations(active);
  const tradeoffs = calculateTradeoffs(active);
  const future = predictFutureState(active);
  const explanation = explainScenario(active);

  return {
    scenario: active,
    assumptions: active.assumptions,
    affectedSystems: propagation.impactedSystems,
    failures: [propagation],
    bottlenecks: bottlenecks.map(b => b.component),
    bottlenecksDetailed: bottlenecks,
    recovery: recovery,
    recommendations: recommendations,
    tradeoffs: tradeoffs,
    futureArchitecture: future,
    timeline: timeline,
    evolutionPhases: evolution,
    alternativeComparisons: comparisons,
    evolutionNarrative: explanation
  };
}
