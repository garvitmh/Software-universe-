/**
 * ConstraintEngine.js
 * 
 * Specialized Architectural Constraint mapping and tradeoff simulation engine.
 * Discovers current system constraints, identifies dominant constraints (e.g. team size, traffic),
 * uncovers hidden root causes, compiles chronological constraint history,
 * measures domain pressure scores, competing architectural forces,
 * models future constraint impacts, and generates explainable evolution narratives.
 * 
 * Pure functions only. Runs safely in both Node and browser environments.
 */

// List of all supported constraint types
export const CONSTRAINT_CATEGORIES = [
  "TRAFFIC", "LATENCY", "RELIABILITY", "TEAM_SIZE", "BUDGET",
  "TIME_TO_MARKET", "KNOWLEDGE", "COMPLEXITY", "OPERATIONAL_LOAD",
  "SECURITY", "COMPLIANCE", "DATABASE", "THIRD_PARTY", "OBSERVABILITY",
  "DEPLOYMENT", "AVAILABILITY", "SCALABILITY"
];

// Reusable mock baseline dataset
export const BASELINE_CONSTRAINTS = [
  {
    id: "C-TEAM-01",
    type: "TEAM_SIZE",
    severity: "HIGH",
    affectedDomains: ["All"],
    symptoms: ["Avoiding microservices deployment", "Sticking to Modular Monolith build", "Slower feature release iterations"],
    causes: ["Early-stage development startup", "Limited developer headcount (2 engineers)"],
    possibleSolutions: ["Maintain monolithic codebase boundaries", "Leverage managed serverless services (PaaS) to bypass DevOps load"]
  },
  {
    id: "C-BUDGET-01",
    type: "BUDGET",
    severity: "HIGH",
    affectedDomains: ["Infrastructure"],
    symptoms: ["Reusing Redis cache for background tasks instead of setting up RabbitMQ/Kafka", "Single PostgreSQL write node without replica clustering"],
    causes: ["Conscious boot-strapped hosting budgets"],
    possibleSolutions: ["Replace expensive APM licenses (like Datadog) with self-hosted Grafana + Prometheus", "Optimize container sizing rules"]
  },
  {
    id: "C-RELIABILITY-01",
    type: "RELIABILITY",
    severity: "MEDIUM",
    affectedDomains: ["Payments", "Notifications"],
    symptoms: ["Direct synchronous Twilio/Stripe API timeouts crash order threads", "Unprocessed transaction notifications"],
    causes: ["Unstable third-party networks", "No asynchronous queue retry mechanism"],
    possibleSolutions: ["Decouple integrations behind BullMQ background workers", "Enable Dead Letter Queues (DLQ) and retry parameters"]
  }
];

/**
 * Discovers constraints dynamically from context parameters.
 * 
 * @param {Object} context 
 * @returns {Object[]} List of constraint models
 */
export function discoverCurrentConstraints(context = {}) {
  const discovered = [];
  
  const team = context.teamSize !== undefined ? context.teamSize : 2;
  const budget = String(context.budget || "LOW").toUpperCase();
  const growth = String(context.growthForecast || "10x").toUpperCase();
  const latency = context.latencyRequirements || "< 200ms";
  const incidents = context.incidents || [];
  const traffic = context.traffic || 150;

  // 1. Team Size Constraint
  if (team <= 3) {
    discovered.push({
      id: "C-TEAM-01",
      type: "TEAM_SIZE",
      severity: "HIGH",
      affectedDomains: ["All"],
      symptoms: ["Avoid distributed systems/microservices", "Rely on monolithic structures", "Dev bottleneck on complex feature deployments"],
      causes: ["Small developer count limit", "Velocity requirements"],
      possibleSolutions: ["Keep modular monolith", "Leverage PaaS platforms like Render"]
    });
  }

  // 2. Budget Constraint
  if (budget === "LOW") {
    discovered.push({
      id: "C-BUDGET-01",
      type: "BUDGET",
      severity: "HIGH",
      affectedDomains: ["Infrastructure"],
      symptoms: ["Redis reused for cache + task queue buffer", "Single DB writer instance hosted on shared nodes"],
      causes: ["Tight hosting budget boundaries", "Velocity over infrastructure cost"],
      possibleSolutions: ["Use open-source Grafana+Prometheus instead of Datadog", "Optimize queue retention sizes"]
    });
  }

  // 3. Reliability Constraint
  const hasQueueIncidents = incidents.length > 0 || incidents.some(inc => 
    String(inc.type || inc).toLowerCase().includes("timeout") || 
    String(inc.service || inc).toLowerCase().includes("sms")
  );
  if (hasQueueIncidents) {
    discovered.push({
      id: "C-RELIABILITY-01",
      type: "RELIABILITY",
      severity: "HIGH",
      affectedDomains: ["Payments", "Notifications"],
      symptoms: ["External API response hangs block main execution flow", "Outages go unnoticed without immediate logging alarms"],
      causes: ["Synchronous third-party integration couplings", "Missing asynchronous retry brokers"],
      possibleSolutions: ["Adopt async task workers (BullMQ)", "Set up exponential backoff and DLQs"]
    });
  }

  // 4. Latency Constraint
  if (latency.includes("< 200ms") || latency.includes("< 150ms") || traffic > 300) {
    discovered.push({
      id: "C-LATENCY-01",
      type: "LATENCY",
      severity: "MEDIUM",
      affectedDomains: ["Checkout Flow", "API Responses"],
      symptoms: ["Main execution thread waits for external API payloads", "P95 response time breaches target metrics"],
      causes: ["Synchronous network requests on critical user checkout paths"],
      possibleSolutions: ["Introduce cache-aside strategies via Redis", "Offload non-critical workloads to background threads"]
    });
  }

  // 5. Traffic / Scalability Constraint
  if (growth === "100X" || traffic > 1000) {
    discovered.push({
      id: "C-SCALABILITY-01",
      type: "SCALABILITY",
      severity: "HIGH",
      affectedDomains: ["Database", "Orders Service"],
      symptoms: ["Connection pool saturation under spikes", "CPU spikes during dashboard queries"],
      causes: ["Single primary write database instance handle writes and analytics reports concurrently"],
      possibleSolutions: ["Introduce PostgreSQL read replicas", "Install PgBouncer connection pool proxy"]
    });
  }

  // Ensure we fall back to baseline constraints if nothing matches context
  return discovered.length > 0 ? discovered : BASELINE_CONSTRAINTS;
}

/**
 * Detects the dominant constraint that dictates overall architectural boundaries.
 * 
 * @param {Object} context 
 * @returns {Object} Dominant constraint details
 */
export function detectDominantConstraint(context = {}) {
  const current = discoverCurrentConstraints(context);
  
  // Rule-based heuristic ranking: TEAM_SIZE > SCALABILITY > BUDGET > RELIABILITY
  const teamConst = current.find(c => c.type === "TEAM_SIZE");
  const scaleConst = current.find(c => c.type === "SCALABILITY" || c.type === "TRAFFIC");
  const budgetConst = current.find(c => c.type === "BUDGET");
  const relConst = current.find(c => c.type === "RELIABILITY");

  if (teamConst && teamConst.severity === "HIGH") {
    return {
      type: "TEAM_SIZE",
      severity: "HIGH",
      evidence: "Small development team size (2-3 developers) overrides all architectural choices. Spinning up microservices or complex Kubernetes structures would exhaust the team's operational bandwidth.",
      affectedSystems: ["Service boundaries (Modular Monolith)", "Hosting stack choice (Render/PaaS)", "Avoidance of distributed brokers like Kafka"]
    };
  }

  if (scaleConst && scaleConst.severity === "HIGH") {
    return {
      type: "SCALABILITY",
      severity: "HIGH",
      evidence: "Traffic volume forecasts or spikes require horizontal scalability. Monolithic resource sharing blocks system stability.",
      affectedSystems: ["Database read/write partitions", "Queues worker cluster count", "Caching layers"]
    };
  }

  if (budgetConst && budgetConst.severity === "HIGH") {
    return {
      type: "BUDGET",
      severity: "HIGH",
      evidence: "Infrastructure budget limits rule out premium hosted offerings (e.g. Datadog, MSK). Architecture must maximize resource reuse.",
      affectedSystems: ["Redis double duty (Cache + Queue)", "Single Postgres write node", "PaaS deployments"]
    };
  }

  if (relConst) {
    return {
      type: "RELIABILITY",
      severity: "HIGH",
      evidence: "Operational timeouts or third-party outages require robust retry bounds and decoupled asynchronous flows.",
      affectedSystems: ["Order checkout routes", "Notification workers", "DLQ audit pipelines"]
    };
  }

  return {
    type: "TIME_TO_MARKET",
    severity: "MEDIUM",
    evidence: "Need to launch features instantly to test market demand dominates infrastructure scaling design.",
    affectedSystems: ["Codebase architecture structures"]
  };
}

/**
 * Pinpoints root causes of architectural issues rather than superficial symptoms.
 * 
 * @param {Object} context 
 * @returns {string[]} Hidden root causes
 */
export function detectHiddenConstraints(context = {}) {
  const hidden = [];

  const incidents = context.incidents || [];
  const traffic = context.traffic || 150;

  // Rule 1: Analytics queries block primary DB
  hidden.push("Admin reporting analytics dashboards running directly against the primary write PostgreSQL database instance.");

  // Rule 2: Queue outages due to missing retention limit
  hidden.push("Unbounded BullMQ task completion history kept in Redis RAM memory without set limits, risking Redis OOM crashes.");

  // Rule 3: Direct webhooks block checkout threads
  if (incidents.some(inc => String(inc.service || inc).toLowerCase().includes("twilio") || String(inc.type || inc).toLowerCase().includes("timeout"))) {
    hidden.push("Synchronous network connection hangs inTwilio SMS checkouts, delaying database commit loops and saturating PG connection pools.");
  }

  // Rule 4: Scale limits under high traffic
  if (traffic > 500) {
    hidden.push("Absence of database connection pooling (PgBouncer) causes server container restarts under concurrent request surges.");
  }

  return hidden;
}

/**
 * Chronologically maps how constraints shaped architecture through development stages.
 * 
 * @param {Object} context 
 * @returns {Object[]} Chronology
 */
export function buildConstraintHistory(context = {}) {
  return [
    { phase: "MVP Phase", dominantConstraint: "TIME_TO_MARKET", description: "Need features online immediately. Implemented synchronous checkouts and direct database queries." },
    { phase: "Growth Phase", dominantConstraint: "BUDGET", description: "Limited funds forced the reuse of Redis for both caching and BullMQ async processing, avoiding extra broker bills." },
    { phase: "Scale Phase", dominantConstraint: "RELIABILITY", description: "SMS provider outages and checkout thread timeouts forced decoupling payment from alerts via retries and DLQs." },
    { phase: "Enterprise Phase", dominantConstraint: "OBSERVABILITY", description: "High traffic spikes required define availability error budgets, SLO goals, and Prometheus metrics panels." }
  ];
}

/**
 * Calculates dynamic pressure, complexity, and risk scores per domain.
 * 
 * @param {Object} context 
 * @returns {Object[]} Pressure map profile
 */
export function buildPressureMap(context = {}) {
  const baseMap = [
    { domain: "Orders", pressureScore: 70, complexity: 60, risk: "MEDIUM" },
    { domain: "Payments", pressureScore: 80, complexity: 75, risk: "HIGH" },
    { domain: "Analytics", pressureScore: 85, complexity: 70, risk: "HIGH" },
    { domain: "Notifications", pressureScore: 50, complexity: 40, risk: "LOW" },
    { domain: "Security", pressureScore: 60, complexity: 55, risk: "MEDIUM" },
    { domain: "POS Integration", pressureScore: 40, complexity: 50, risk: "LOW" },
    { domain: "Delivery Matcher", pressureScore: 65, complexity: 60, risk: "MEDIUM" }
  ];

  const traffic = context.traffic || 150;
  const incidents = context.incidents || [];

  return baseMap.map(dm => {
    let scoreMod = 0;
    
    // Scale pushes pressure on core Orders and Payments
    if (traffic > 500) {
      if (dm.domain === "Orders" || dm.domain === "Payments") {
        scoreMod += 15;
      }
    }

    // Incidents push pressure on Notifications/Payments
    if (incidents.length > 0) {
      const hasNotificationIncident = incidents.some(i => String(i.service || i).toLowerCase().includes("sms") || String(i.service || i).toLowerCase().includes("twilio"));
      if (hasNotificationIncident && dm.domain === "Notifications") {
        scoreMod += 30;
      }
      const hasPaymentIncident = incidents.some(i => String(i.service || i).toLowerCase().includes("stripe") || String(i.service || i).toLowerCase().includes("payment"));
      if (hasPaymentIncident && dm.domain === "Payments") {
        scoreMod += 15;
      }
    }

    const finalPressure = Math.min(100, dm.pressureScore + scoreMod);
    let finalRisk = dm.risk;
    if (finalPressure >= 85) finalRisk = "HIGH";
    else if (finalPressure >= 60) finalRisk = "MEDIUM";
    else finalRisk = "LOW";

    return {
      ...dm,
      pressureScore: finalPressure,
      risk: finalRisk
    };
  });
}

/**
 * Details tradeoffs forced by constraints.
 * 
 * @param {Object} context 
 * @returns {Object[]} Tradeoff list
 */
export function generateTradeoffMap(context = {}) {
  return [
    { gain: "High Reliability (job workers, retries, DLQ)", sacrifice: "Higher system code complexity and eventual data consistency delay" },
    { gain: "Fast Time-To-Market & Cheap Hosting (Modular Monolith)", sacrifice: "Horizontal scaling ceiling limits and shared database bottleneck danger" },
    { gain: "Deep Observability Telemetry (Prometheus metrics, trace logs)", sacrifice: "Added developer instrumentation work and increased storage cost bills" }
  ];
}

/**
 * Forecasts constraint bottlenecks under growth or reduction scenarios.
 * 
 * @param {Object} context 
 * @returns {string[]} Future bottlenecks
 */
export function predictFutureConstraints(context = {}) {
  const forecasts = [];
  const growth = String(context.growthForecast || "10x").toUpperCase();
  const team = context.teamSize !== undefined ? context.teamSize : 2;

  // Traffic 100x
  if (growth === "100X" || growth === "1000X") {
    forecasts.push("Primary database write bottleneck: single PostgreSQL writer node will saturate cpu limits under transaction concurrent locks.");
    forecasts.push("Redis memory limits: BullMQ task backlogs will exceed Redis RAM capacity unless retention rules are set.");
  } else {
    forecasts.push("Traffic growth bottleneck: high concurrent checkouts will saturate Express node threads, requiring worker scaling.");
  }

  // Team shrinkage
  if (team <= 3) {
    forecasts.push("Operational maintenance load: developer velocity will drop if self-hosted Kubernetes or Kafka clusters are introduced.");
  }

  // Regulations/Compliance
  forecasts.push("Compliance constraints: growth will trigger security audit requirements, demanding encrypted databases and API ledger trails.");

  return forecasts;
}

/**
 * Calculates competitive force scores (simplicity, reliability, cost, scale, etc).
 * 
 * @param {Object} context 
 * @returns {Object[]} List of Competing forces
 */
export function analyzeArchitectureForces(context = {}) {
  const team = context.teamSize !== undefined ? context.teamSize : 2;
  const budget = String(context.budget || "LOW").toUpperCase();
  const traffic = context.traffic || 150;
  const growth = String(context.growthForecast || "10x").toUpperCase();

  let simplicity = 70;
  let reliability = 70;
  let scale = 60;
  let cost = 70;
  let devExp = 75;

  if (team <= 3) {
    simplicity += 25;
    devExp += 15;
    scale -= 15;
  }

  if (budget === "LOW") {
    cost += 25;
    scale -= 10;
  }

  if (traffic > 800 || growth === "100X") {
    scale += 35;
    reliability += 20;
    simplicity -= 30;
  }

  return [
    { force: "Simplicity", strength: Math.max(10, Math.min(100, simplicity)) },
    { force: "Reliability", strength: Math.max(10, Math.min(100, reliability)) },
    { force: "Scale", strength: Math.max(10, Math.min(100, scale)) },
    { force: "Cost Savings", strength: Math.max(10, Math.min(100, cost)) },
    { force: "Developer Experience", strength: Math.max(10, Math.min(100, devExp)) }
  ];
}

/**
 * Simulates constraint changes under emergency parameters.
 * 
 * @param {Object} context 
 * @param {string} input - budgetCut50 / traffic10x / teamHalved
 * @returns {Object} Simulation outputs
 */
export function simulateConstraintChanges(context = {}, input) {
  const cleanInput = String(input || "").trim();

  if (cleanInput === "budgetCut50") {
    return {
      scenario: "Infrastructure hosting budget cut by 50%",
      dominantForce: "Cost Savings",
      viableArchitectures: ["Modular Monolith on VPS/Render free tier"],
      unviableArchitectures: ["AWS EKS / Kubernetes clusters", "Datadog APM metrics", "Enterprise Confluent Kafka clouds"],
      recommendations: ["Replace managed logs tools with self-hosted Grafana + Prometheus", "Enable aggressive caching in Redis to lower Postgres node compute hours"]
    };
  }

  if (cleanInput === "traffic10x") {
    return {
      scenario: "API Traffic spike increases 10x",
      dominantForce: "Scale & Availability",
      viableArchitectures: ["Asynchronous BullMQ worker pipelines", "PostgreSQL read replica pools"],
      unviableArchitectures: ["Synchronous third-party checkout integrations", "Single database writer performing analytics reports"],
      recommendations: ["Configure PgBouncer pg connection pools", "Buffer all external API notifications behind async workers with DLQs"]
    };
  }

  if (cleanInput === "teamHalved") {
    return {
      scenario: "Development team size halved",
      dominantForce: "Operational Simplicity",
      viableArchitectures: ["Pure Modular Monolith utilizing unified package imports"],
      unviableArchitectures: ["Microservices split with network RPCs", "Custom OAuth servers and local secure credential hashes"],
      recommendations: ["Decommission local credentials databases in favor of Firebase Auth", "Avoid custom broker queues, relying on SQS or BullMQ"]
    };
  }

  return {
    scenario: "No modifications input provided",
    dominantForce: "Unchanged",
    viableArchitectures: ["Current architecture"],
    unviableArchitectures: [],
    recommendations: ["Continue tracking golden metrics and logs via Grafana dashboards"]
  };
}

/**
 * Recommends architectural remedies based on dominant constraints.
 * 
 * @param {Object} context 
 * @returns {string[]} Recommendations
 */
export function generateRecommendations(context = {}) {
  const dominant = detectDominantConstraint(context);
  const recommendations = [];

  if (dominant.type === "TEAM_SIZE") {
    recommendations.push("Maintain Modular Monolith structure instead of splitting codebase into Microservices.");
    recommendations.push("Leverage fully managed PaaS systems (like Render, AWS SQS) to bypass developer DevOps workload.");
  } else if (dominant.type === "SCALABILITY" || dominant.type === "TRAFFIC") {
    recommendations.push("Establish PostgreSQL Read Replicas, routing analytics/reporting metrics requests away from the primary write database.");
    recommendations.push("Configure PgBouncer connection pooling to avoid PostgreSQL thread starvation under checkout concurrency.");
    recommendations.push("Scale up container instances of BullMQ workers to process high task queue backlogs.");
  } else if (dominant.type === "BUDGET") {
    recommendations.push("Adopt self-hosted Prometheus + Grafana telemetry stack instead of paying expensive licensing bills for APMs (like Datadog).");
    recommendations.push("Limit BullMQ task retention rules to avoid overloading Redis RAM limits.");
  } else {
    recommendations.push("Decouple all synchronous Twilio/Stripe API connections inside checkout handlers behind background workers.");
    recommendations.push("Enforce webhook endpoint idempotency checking to prevent double processing of payment transactions.");
  }

  return recommendations;
}

/**
 * Creates natural language evolutionary explanations explaining constraint tradeoffs.
 * 
 * @param {Object} context 
 * @returns {string} Explanatory narrative
 */
export function explainConstraintEvolution(context = {}) {
  const dominant = detectDominantConstraint(context);
  const team = context.teamSize !== undefined ? context.teamSize : 2;
  const growth = String(context.growthForecast || "10x").toUpperCase();

  let narrative = `Architecture is shaped by constraints. Given the current dominant constraint of ${dominant.type}, `;

  if (dominant.type === "TEAM_SIZE") {
    narrative += `we prioritize operational simplicity. With a team size of only ${team} engineers, spinning up distributed systems or Apache Kafka queues would create substantial DevOps overhead. A Modular Monolith using Redis-backed BullMQ allows the team to deliver features rapidly within hosting boundaries.`;
  } else if (dominant.type === "SCALABILITY") {
    narrative += `scalability becomes our core focus. Anticipating a traffic surge of ${growth}, sharing a single write database node creates database thread locks. Introducing read replicas and caching strategies are required to prevent checkout downtime, even if it adds code complexity.`;
  } else if (dominant.type === "BUDGET") {
    narrative += `budget efficiency dominates our choices. To avoid expensive server pricing, we double-duty Redis for caching and BullMQ, and choose open-source telemetry monitors over enterprise SaaS.`;
  } else {
    narrative += `reliability takes precedence. Decoupling unstable third-party APIs behind asynchronous queues ensures customer payments succeed even when alert providers suffer outages.`;
  }

  return narrative;
}

/**
 * Analyzes system constraints and maps system architectural compromises.
 * 
 * @param {Object} context 
 * @returns {Object} Constraint mapping payload
 */
export function analyzeConstraints(context = {}) {
  const current = discoverCurrentConstraints(context);
  const dominant = detectDominantConstraint(context);
  const hidden = detectHiddenConstraints(context);
  const history = buildConstraintHistory(context);
  const pressure = buildPressureMap(context);
  const tradeoffs = generateTradeoffMap(context);
  const future = predictFutureConstraints(context);
  const forces = analyzeArchitectureForces(context);
  const recommendations = generateRecommendations(context);
  const explanation = explainConstraintEvolution(context);

  return {
    currentConstraints: current,
    dominantConstraint: dominant.type,
    dominantConstraintDetails: dominant,
    hiddenConstraints: hidden,
    futureConstraints: future,
    pressureMap: pressure,
    tradeoffMap: tradeoffs,
    constraintHistory: history,
    architectureForces: forces,
    recommendations: recommendations,
    evolutionNarrative: explanation
  };
}
