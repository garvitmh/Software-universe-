/**
 * ProductionIncidentSimulator.js
 * 
 * Specialized operations simulator for reproducing real-world production outages.
 * Recreates incidents like Stripe timeouts, PostgreSQL pool saturation, Redis crashes,
 * and OOM memory leaks. Generates metrics, stdout error logs, span traces, SRE alerts,
 * root-cause diagnostics, blast radius models, mitigations, MTTR recovery timelines,
 * and postmortems modeled after Google SRE and Netflix chaos playbooks.
 * 
 * Pure functions only. Runs safely in both Node and browser environments.
 */

// Supported incident types
export const SUPPORTED_INCIDENTS = [
  "PAYMENT_TIMEOUT", "POSTGRES_SATURATION", "REDIS_FAILURE", "WORKER_CRASH",
  "MEMORY_LEAK", "CPU_SATURATION", "SMS_OUTAGE", "WEBHOOK_STORM",
  "ANALYTICS_EXPLOSION", "DEPLOYMENT_FAILURE"
];

// Baseline default incident model
export const DEFAULT_INCIDENT = {
  id: "INC-2026-001",
  type: "PAYMENT_TIMEOUT",
  severity: "SEV1",
  startedAt: "2026-06-22T08:00:00Z",
  affectedSystems: ["Checkout", "Notifications"],
  assumptions: ["All background workers were running", "Stripe API suffered network dropouts"]
};

/**
 * Details chronological SRE event steps of the incident.
 * 
 * @param {Object} incident 
 * @returns {string[]} Incident timeline
 */
export function buildIncidentTimeline(incident = DEFAULT_INCIDENT) {
  const type = String(incident.type || "PAYMENT_TIMEOUT").toUpperCase();

  if (type === "PAYMENT_TIMEOUT") {
    return [
      "00:00 - Stripe API latency increases above 8000ms.",
      "00:05 - P99 Checkout API Latency Alert fires (threshold 1000ms, current 8400ms).",
      "00:15 - Multiple customer checkout timeout errors, cart dropouts rise.",
      "00:20 - On-call engineer responds to PagerDuty alert.",
      "00:30 - Engineer identifies Stripe connection timeout blockages in CheckoutController.",
      "00:45 - Mitigation: Configured stripe retry limits and enabled local fallback checkouts.",
      "01:10 - Stripe API recovers; checkout success rates return to baseline. Incident resolved."
    ];
  }

  if (type === "POSTGRES_SATURATION") {
    return [
      "00:00 - Primary PostgreSQL CPU spike reaches 100% saturation.",
      "00:04 - Database Connection Pool Exhausted Alert triggers.",
      "00:10 - Checkout API transactions queue up, waiting for DB write slots.",
      "00:15 - On-call SRE responds and logs in to PostgreSQL admin console.",
      "00:25 - SRE identifies expensive monthly analytics reports running on the primary DB write node.",
      "00:35 - Mitigation: Terminated analytics query threads, shifted reporting dashboard to read replica.",
      "00:50 - DB connection locks drop, checkout success rates stabilize. Incident resolved."
    ];
  }

  if (type === "REDIS_FAILURE") {
    return [
      "00:00 - Redis memory utilization reaches 99%.",
      "00:05 - Redis instance crashes under Out-of-Memory (OOM) exception.",
      "00:08 - BullMQ dispatches freeze, background notification worker logs connection errors.",
      "00:15 - Alert fires: Notification Queue Backlog exceeding threshold (current depth 480).",
      "00:20 - Engineer restarts Redis cluster container and adds removeOnComplete task limits.",
      "00:35 - Worker reconnects and drains queued notification logs. Incident resolved."
    ];
  }

  return [
    "00:00 - Incident condition initialized.",
    "00:15 - System monitors trigger automated alert flags.",
    "00:30 - On-call engineer executes diagnostic checks.",
    "01:00 - Resolution applied. System returns to healthy baseline."
  ];
}

/**
 * Simulates real-time system metrics under the incident stress.
 * 
 * @param {Object} incident 
 * @returns {Object} System metrics
 */
export function generateMetrics(incident = DEFAULT_INCIDENT) {
  const type = String(incident.type || "PAYMENT_TIMEOUT").toUpperCase();

  if (type === "PAYMENT_TIMEOUT") {
    return { requestRate: 120, latency: 1450, p95: 5200, p99: 8400, cpu: 88, memory: 40, queueDepth: 45, errorRate: 15.2 };
  }
  if (type === "POSTGRES_SATURATION") {
    return { requestRate: 200, latency: 2100, p95: 6000, p99: 9200, cpu: 100, memory: 70, queueDepth: 120, errorRate: 35.5 };
  }
  if (type === "REDIS_FAILURE") {
    return { requestRate: 80, latency: 120, p95: 180, p99: 300, cpu: 15, memory: 98, queueDepth: 850, errorRate: 5.0 };
  }

  return { requestRate: 100, latency: 150, p95: 250, p99: 400, cpu: 30, memory: 45, queueDepth: 5, errorRate: 0.2 };
}

/**
 * Synthesizes stdout/stderr console streams detailing connection losses.
 * 
 * @param {Object} incident 
 * @returns {string[]} Error logs list
 */
export function generateLogs(incident = DEFAULT_INCIDENT) {
  const type = String(incident.type || "PAYMENT_TIMEOUT").toUpperCase();

  if (type === "PAYMENT_TIMEOUT") {
    return [
      "[ERROR] PaymentService: Stripe connection timed out after 8000ms.",
      "[WARN] OrderController: Stripe API Timeout. Retrying attempt #1...",
      "[ERROR] OrderRepository: Connection pool exhausted. Waiting for connection...",
      "[INFO] SRE: Applied Stripe gateway connection throttle and enabled async fallback."
    ];
  }
  if (type === "POSTGRES_SATURATION") {
    return [
      "[ERROR] PrismaClient: Connection pool exhaustion. Timeout waiting for database connection.",
      "[WARN] AdminController: Slow query detected on orders table (duration 18500ms).",
      "[INFO] SRE: Terminated query pid 20432: SELECT SUM(total) FROM orders..."
    ];
  }
  if (type === "REDIS_FAILURE") {
    return [
      "[ERROR] BullMQ Queue: Disconnected from Redis server at localhost:6379.",
      "[WARN] NotificationWorker: Cannot fetch jobs. Retrying queue connection in 5s...",
      "[FATAL] Redis: Out of memory (OOM). Evicting keys failed."
    ];
  }

  return [
    "[INFO] System running healthy.",
    "[INFO] Standard diagnostic check complete."
  ];
}

/**
 * Maps spans showing timeout/failed status.
 * 
 * @param {Object} incident 
 * @returns {Object[]} Spans traces
 */
export function generateTraces(incident = DEFAULT_INCIDENT) {
  const type = String(incident.type || "PAYMENT_TIMEOUT").toUpperCase();

  if (type === "PAYMENT_TIMEOUT") {
    return [
      { id: "span-1", name: "Checkout Screen View", type: "SCREEN", duration: 5, status: "SUCCESS" },
      { id: "span-2", name: "Payment Business Service", type: "SERVICE", duration: 450, status: "FAILED" },
      { id: "span-3", name: "Stripe Payment Gateway", type: "EXTERNAL", duration: 420, status: "TIMEOUT" },
      { id: "span-4", name: "Checkout Error Widget", type: "WIDGET", duration: 2, status: "SUCCESS" }
    ];
  }

  return [
    { id: "span-1", name: "Checkout Screen View", type: "SCREEN", duration: 5, status: "SUCCESS" },
    { id: "span-2", name: "Order Router Controller", type: "CONTROLLER", duration: 15, status: "SUCCESS" }
  ];
}

/**
 * Returns active on-call alerts.
 * 
 * @param {Object} incident 
 * @returns {Object[]} Active alerts
 */
export function generateAlerts(incident = DEFAULT_INCIDENT) {
  const type = String(incident.type || "PAYMENT_TIMEOUT").toUpperCase();

  if (type === "PAYMENT_TIMEOUT") {
    return [
      { alert: "p99 Checkout Latency Breach", severity: "SEV1", threshold: "1000ms", currentValue: "8400ms" },
      { alert: "Checkout API HTTP 5xx Error Rate", severity: "SEV1", threshold: "5.0%", currentValue: "15.2%" }
    ];
  }
  if (type === "POSTGRES_SATURATION") {
    return [
      { alert: "PostgreSQL Write Primary CPU 100%", severity: "SEV1", threshold: "90%", currentValue: "100%" },
      { alert: "Prisma Connection Pool Exhaustion", severity: "SEV1", threshold: "90%", currentValue: "98%" }
    ];
  }
  if (type === "REDIS_FAILURE") {
    return [
      { alert: "Redis OOM Disconnect Alert", severity: "SEV1", threshold: "1", currentValue: "OOM" },
      { alert: "BullMQ Notification Queue Backlog Spiking", severity: "SEV2", threshold: "100", currentValue: "850" }
    ];
  }

  return [];
}

/**
 * Computes the most probable culprit.
 * 
 * @param {Object} incident 
 * @returns {Object} Root cause
 */
export function findRootCause(incident = DEFAULT_INCIDENT) {
  const type = String(incident.type || "PAYMENT_TIMEOUT").toUpperCase();

  if (type === "PAYMENT_TIMEOUT") {
    return {
      component: "Stripe Payment Gateway",
      evidence: "Gateway timeout latency exceeds 8000ms on Checkout payments Service.",
      confidence: 95
    };
  }
  if (type === "POSTGRES_SATURATION") {
    return {
      component: "PostgreSQL Primary Node",
      evidence: "Admin reporting analytics monthly query spikes locked Orders checkouts tables.",
      confidence: 90
    };
  }
  if (type === "REDIS_FAILURE") {
    return {
      component: "Redis Instance",
      evidence: "Redis memory footprint reached 100% capacity due to lack of BullMQ job completion retention limits.",
      confidence: 92
    };
  }

  return {
    component: "System Core API",
    evidence: "Resource exhaustion.",
    confidence: 50
  };
}

/**
 * Segments impacted systems from unaffected services.
 * 
 * @param {Object} incident 
 * @returns {Object} Blast radius
 */
export function calculateBlastRadius(incident = DEFAULT_INCIDENT) {
  const type = String(incident.type || "PAYMENT_TIMEOUT").toUpperCase();

  if (type === "REDIS_FAILURE") {
    return {
      source: "Redis Queue Broker",
      impactedSystems: ["Notifications", "POS Printing Queue", "Admin Live Updates"],
      unaffectedSystems: ["Order Checkout Path", "User Authentication"]
    };
  }
  if (type === "PAYMENT_TIMEOUT") {
    return {
      source: "Stripe Gateway",
      impactedSystems: ["Order Checkout API", "Loyalty Wallet Deductions"],
      unaffectedSystems: ["User Logins", "Kitchen POS Printing"]
    };
  }

  return {
    source: "General System Node",
    impactedSystems: ["API Gateway"],
    unaffectedSystems: ["Database Replication"]
  };
}

/**
 * Suggests SRE mitigations.
 * 
 * @param {Object} incident 
 * @returns {string[]} Mitigations
 */
export function generateMitigations(incident = DEFAULT_INCIDENT) {
  const type = String(incident.type || "PAYMENT_TIMEOUT").toUpperCase();

  if (type === "PAYMENT_TIMEOUT") {
    return [
      "Configure Stripe request timeout flags (max 5000ms)",
      "Enable local buffer SQLite checkouts during Stripe downtime",
      "Switch client view to retry checkout with Razorpay backup gateway"
    ];
  }
  if (type === "POSTGRES_SATURATION") {
    return [
      "Kill long-running analytics query pid threads",
      "Redirect analytics reporting queries to Postgres read replicas",
      "Install PgBouncer connection proxy pool to buffer spikes"
    ];
  }
  if (type === "REDIS_FAILURE") {
    return [
      "Enable Redis AOF persistence and Sentinel replica pools",
      "Set removeOnComplete limits on BullMQ job history definitions",
      "Scale up Redis container RAM footprint"
    ];
  }

  return ["Scale up container instances", "Enforce API rate limiting rules"];
}

/**
 * Simulates recovery sequences, outputting MTTR.
 * 
 * @param {Object} incident 
 * @returns {Object} Recovery data
 */
export function simulateRecovery(incident = DEFAULT_INCIDENT) {
  const type = String(incident.type || "PAYMENT_TIMEOUT").toUpperCase();

  if (type === "PAYMENT_TIMEOUT") {
    return { mttr: "38 minutes", recoveredSystems: ["Checkout API", "Stripe payment validations"] };
  }
  if (type === "POSTGRES_SATURATION") {
    return { mttr: "50 minutes", recoveredSystems: ["PostgreSQL primary node CPU", "Orders checkout transactions database"] };
  }
  if (type === "REDIS_FAILURE") {
    return { mttr: "25 minutes", recoveredSystems: ["BullMQ task queues", "Kitchen POS printing queues"] };
  }

  return { mttr: "60 minutes", recoveredSystems: ["API Gateway"] };
}

/**
 * Detects frequency and suggests permanent fix.
 * 
 * @param {Object} incident 
 * @returns {string} Repeated incident diagnostic recommendation
 */
export function detectRepeatedIncidents(incident = DEFAULT_INCIDENT) {
  const type = String(incident.type || "PAYMENT_TIMEOUT").toUpperCase();

  if (type === "PAYMENT_TIMEOUT") {
    return "Stripe timeouts have occurred 4 times this quarter. Mitigate by setting up secondary gateway failover (Razorpay) and circuit breakers.";
  }
  if (type === "POSTGRES_SATURATION") {
    return "Database saturated events recorded twice recently. Setup strict read replica query routing guidelines in CI/CD pipeline code check rules.";
  }

  return "First recorded instance of this incident type. Monitor golden signals on Grafana dashboard.";
}

/**
 * Flags architectural decisions that worsened the outage.
 * 
 * @param {Object} incident 
 * @returns {Object} Architectural regrets
 */
export function detectArchitecturalRegrets(incident = DEFAULT_INCIDENT) {
  const type = String(incident.type || "PAYMENT_TIMEOUT").toUpperCase();

  if (type === "POSTGRES_SATURATION") {
    return {
      mistake: "Running heavy analytics queries directly against the primary Postgres write database.",
      impact: "Blocks Order checkout transactions and exhausts Prisma connection pool capacity.",
      betterApproach: "Use PG connection pool PgBouncer proxy and route reports to replica nodes."
    };
  }
  if (type === "REDIS_FAILURE") {
    return {
      mistake: "Failing to set removeOnComplete limits in BullMQ task queue configurations.",
      impact: "Completed job history data accumulates in Redis RAM indefinitely, causing OOM crashes.",
      betterApproach: "Enforce removeOnComplete queue limits on task instantiation."
    };
  }

  return {
    mistake: "Missing circuit breakers on third-party APIs.",
    impact: "Cascading timeouts wait on network, blocking thread limits.",
    betterApproach: "Implement circuit breakers using Hystrix or resilient middleware wrappers."
  };
}

/**
 * Produces a detailed postmortem.
 * 
 * @param {Object} incident 
 * @returns {Object} Postmortem report
 */
export function generatePostmortem(incident = DEFAULT_INCIDENT) {
  const timeline = buildIncidentTimeline(incident);
  const rc = findRootCause(incident);
  const regrets = detectArchitecturalRegrets(incident);
  const type = String(incident.type || "PAYMENT_TIMEOUT").toUpperCase();

  let summary = "";
  let factors = [];
  let lessons = [];
  let items = [];

  if (type === "PAYMENT_TIMEOUT") {
    summary = "Stripe Gateway latency spikes delayed checkout threads, leading to connection exhaustion.";
    factors = ["Stripe API latency exceeded 8s", "Missing connection timeouts in checkout controller"];
    lessons = ["Introduce circuit breakers on external calls", "Monitor P95 latency thresholds on checkouts"];
    items = ["Configure stripe max timeout limits", "Enable backup gateway fallback configurations"];
  } else if (type === "POSTGRES_SATURATION") {
    summary = "Analytics revenue query spiked CPU pools on primary write DB node, blocking orders checkout writes.";
    factors = ["Admin monthly sales dashboard querying primary postgres node", "Lack of connection pool proxy"];
    lessons = ["Route all reporting analytics queries to replica nodes", "Set connection pool constraints via PgBouncer"];
    items = ["Provision PG read replica nodes", "Install PgBouncer pool buffer"];
  } else {
    summary = "System outage affected core API gateways.";
    factors = ["Lack of active alert notifications", "Single node infrastructure limits"];
    lessons = ["Enable Grafana Prometheus monitors", "Setup auto-scaling triggers"];
    items = ["Configure alerts definitions", "Scale replica node instances"];
  }

  return {
    summary: summary,
    timeline: timeline,
    rootCause: rc.component,
    contributingFactors: factors,
    lessonsLearned: lessons,
    actionItems: items,
    regretFlagged: regrets.mistake
  };
}

/**
 * Entry point: simulate SRE on-call incidents.
 * 
 * @param {Object} incident - Incident payload
 * @returns {Object} Comprehensive SRE simulation details
 */
export function simulateIncident(incident = DEFAULT_INCIDENT) {
  const active = { ...DEFAULT_INCIDENT, ...incident };

  const timeline = buildIncidentTimeline(active);
  const metrics = generateMetrics(active);
  const logs = generateLogs(active);
  const traces = generateTraces(active);
  const alerts = generateAlerts(active);
  const rc = findRootCause(active);
  const blast = calculateBlastRadius(active);
  const mitigations = generateMitigations(active);
  const recovery = simulateRecovery(active);
  const postmortem = generatePostmortem(active);
  const repeated = detectRepeatedIncidents(active);
  const regrets = detectArchitecturalRegrets(active);

  return {
    incident: active,
    symptoms: ["Outage alerts firing", "Latencies spikes", "Errors in controller logs"],
    timeline: timeline,
    alerts: alerts,
    metrics: metrics,
    logs: logs,
    traces: traces,
    rootCause: rc.component,
    rootCauseDetails: rc,
    blastRadius: blast.impactedSystems,
    blastRadiusDetails: blast,
    mitigations: mitigations,
    recovery: recovery,
    postmortem: postmortem,
    repeatedDiagnostics: repeated,
    architecturalRegrets: regrets
  };
}
