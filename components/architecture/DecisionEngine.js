/**
 * DecisionEngine.js
 * 
 * Specialized Architectural Decision recommending and tradeoff reasoning engine.
 * Evaluates decision contexts under constraints (team size, budget, traffic growth),
 * compares technology alternatives, scores tradeoffs, lists mitigation risks,
 * predicts future scalability survival scenarios, executes what-if analyses,
 * and formulates explainable narratives for engineering staff.
 * 
 * Pure functions only. Runs safely in both Node and browser environments.
 */

// Reusable database of options by category
export const OPTIONS_BY_CATEGORY = {
  QUEUE: ["BullMQ", "Kafka", "SQS"],
  DATABASE: ["PostgreSQL", "MongoDB", "DynamoDB"],
  CACHE: ["Redis", "Memcached", "In-Memory Map"],
  ARCHITECTURE: ["Modular Monolith", "Microservices", "Serverless Architecture"],
  SECURITY: ["Firebase Auth & JWT", "Custom OAuth Server", "Session Cookies & PassportJS"],
  OBSERVABILITY: ["Grafana & SLOs", "Datadog", "Logstash & Kibana (ELK)"],
  DEPLOYMENT: ["Render / PaaS", "Docker Compose / VPS", "Kubernetes / AWS EKS"],
  SCALING: ["Read Replicas & Connection Pooling", "Database Sharding", "Write-through Caching"],
  API: ["GraphQL", "REST API", "gRPC"],
  "STATE MANAGEMENT": ["Riverpod", "Bloc", "Redux"],
  STORAGE: ["AWS S3", "Local File Storage", "MinIO"],
  ANALYTICS: ["PostgreSQL Read Replicas", "ClickHouse", "Elasticsearch"],
  MESSAGING: ["Socket.io", "Pusher", "WebSockets"]
};

// Default high-fidelity decision context representation
export const MOCK_DECISION_CONTEXT = {
  problem: "Need decoupled asynchronous job processing for order placement confirmation and SMS/email alerts",
  category: "QUEUE",
  currentArchitecture: "Modular Monolith",
  traffic: 150, // req/sec
  teamSize: 2,
  budget: "LOW",
  latencyRequirements: "< 200ms",
  reliabilityRequirements: "99.9%",
  existingPatterns: ["Prisma", "PostgreSQL", "Redis cache"],
  incidents: [
    { type: "timeout", service: "Twilio SMS", frequency: 5, impact: "Blocked database transaction threads, caused checkout timeout crash" }
  ],
  growthForecast: "10x"
};

// Internal Decision memory storage
export const DECISION_MEMORY = [];

/**
 * Generates alternatives database with detailed pros/cons.
 * 
 * @param {string} category 
 * @param {Object} context 
 * @returns {Object[]} Alternatives
 */
export function generateAlternatives(category, context = {}) {
  const cleanCategory = category ? category.toUpperCase() : "QUEUE";
  const options = OPTIONS_BY_CATEGORY[cleanCategory] || OPTIONS_BY_CATEGORY.QUEUE;
  
  return options.map(opt => {
    let pros = [];
    let cons = [];
    if (opt === "BullMQ") {
      pros = ["Simple setup", "Leverages existing Redis", "Low hosting overhead"];
      cons = ["Single point of failure Redis dependency", "Node.js environment lock"];
    } else if (opt === "Kafka") {
      pros = ["Extremely high scale", "Event replay log", "Multi-consumer partitioning"];
      cons = ["High operational complexity", "Requires separate server management (JVM/KRaft)", "Expensive hosting cost"];
    } else if (opt === "SQS") {
      pros = ["Serverless/Managed", "Pay as you go", "Zero operational maintenance"];
      cons = ["Vendor lock-in", "Polled consumption latency", "No ordering by default unless FIFO is selected"];
    } else if (opt === "PostgreSQL") {
      pros = ["Strict ACID compliance", "Rich relational joins", "Strong ecosystem"];
      cons = ["Hard to scale writes horizontally", "Requires connection pool limits"];
    } else if (opt === "MongoDB") {
      pros = ["Flexible document structure", "High write performance", "Sharding out-of-the-box"];
      cons = ["No strict foreign keys constraints", "Weak multi-document transaction speed"];
    } else if (opt === "DynamoDB") {
      pros = ["Serverless scaling", "Predictable single-digit ms latency", "Managed backups"];
      cons = ["Complex query constraints (GSI limitations)", "Vendor lock-in (AWS)"];
    } else if (opt === "Redis") {
      pros = ["Sub-millisecond latency", "Rich data structures", "Great for caching/sessions"];
      cons = ["In-memory constraints (RAM limit)", "Expensive scaling cost"];
    } else if (opt === "Modular Monolith") {
      pros = ["Low operational overhead", "Shared code imports", "Fast deployment cycles"];
      cons = ["Resource contention", "Scaling requires duplicating whole system"];
    } else if (opt === "Microservices") {
      pros = ["Independent team scaling", "Technology stack freedom", "Isolated failure domains"];
      cons = ["High operational complexity", "Network communication latency", "Distributed transactions (Saga) required"];
    } else {
      pros = [`Highly optimized for ${cleanCategory}`, "Well supported", "Standard solution"];
      cons = ["Setup time", "Operational maintenance"];
    }
    return { name: opt, pros, cons };
  });
}

/**
 * Scores options across simplicity, scalability, reliability, cost, complexity.
 * 
 * @param {string} option 
 * @returns {Object} Scores
 */
export function analyzeTradeoffs(option) {
  const tradeoffsDb = {
    "BullMQ": { simplicity: 90, scalability: 75, reliability: 80, cost: 90, complexity: 25 },
    "Kafka": { simplicity: 20, scalability: 95, reliability: 90, cost: 60, complexity: 90 },
    "SQS": { simplicity: 85, scalability: 90, reliability: 95, cost: 80, complexity: 15 },
    "PostgreSQL": { simplicity: 80, scalability: 70, reliability: 90, cost: 85, complexity: 30 },
    "MongoDB": { simplicity: 85, scalability: 85, reliability: 80, cost: 80, complexity: 35 },
    "DynamoDB": { simplicity: 75, scalability: 95, reliability: 95, cost: 90, complexity: 40 },
    "Redis": { simplicity: 90, scalability: 85, reliability: 85, cost: 75, complexity: 30 },
    "Memcached": { simplicity: 95, scalability: 80, reliability: 80, cost: 85, complexity: 15 },
    "In-Memory Map": { simplicity: 100, scalability: 10, reliability: 40, cost: 100, complexity: 5 },
    "Modular Monolith": { simplicity: 95, scalability: 60, reliability: 85, cost: 95, complexity: 10 },
    "Microservices": { simplicity: 30, scalability: 95, reliability: 80, cost: 50, complexity: 90 },
    "Serverless Architecture": { simplicity: 70, scalability: 90, reliability: 90, cost: 85, complexity: 50 },
    "Firebase Auth & JWT": { simplicity: 90, scalability: 95, reliability: 95, cost: 90, complexity: 20 },
    "Custom OAuth Server": { simplicity: 40, scalability: 80, reliability: 85, cost: 60, complexity: 80 },
    "Session Cookies & PassportJS": { simplicity: 80, scalability: 70, reliability: 80, cost: 95, complexity: 35 },
    "Grafana & SLOs": { simplicity: 75, scalability: 90, reliability: 90, cost: 80, complexity: 45 },
    "Datadog": { simplicity: 90, scalability: 95, reliability: 95, cost: 40, complexity: 20 },
    "Logstash & Kibana (ELK)": { simplicity: 50, scalability: 85, reliability: 85, cost: 70, complexity: 75 },
    "Render / PaaS": { simplicity: 95, scalability: 80, reliability: 85, cost: 70, complexity: 15 },
    "Docker Compose / VPS": { simplicity: 75, scalability: 60, reliability: 75, cost: 95, complexity: 40 },
    "Kubernetes / AWS EKS": { simplicity: 20, scalability: 98, reliability: 95, cost: 50, complexity: 95 }
  };
  
  return tradeoffsDb[option] || { simplicity: 75, scalability: 75, reliability: 75, cost: 75, complexity: 75 };
}

/**
 * Details technology risks, severity, and mitigations.
 * 
 * @param {string} option 
 * @returns {Object[]} Risks
 */
export function evaluateRisks(option) {
  const risksDb = {
    "BullMQ": [
      { risk: "Single Point of Failure Redis dependency", severity: "MEDIUM", mitigation: "Use a managed Redis provider with automatic failover (Aiven/Upstash) and set alert indicators." }
    ],
    "Kafka": [
      { risk: "High Operational Complexity", severity: "HIGH", mitigation: "Use managed Kafka services like AWS MSK or Confluent Cloud to delegate infrastructure admin burden." },
      { risk: "JVM Memory Management / GC overhead", severity: "MEDIUM", mitigation: "Set proper heap sizing and monitor garbage collection cycles." }
    ],
    "SQS": [
      { risk: "Vendor Lock-In to AWS platform", severity: "LOW", mitigation: "Enforce message publishers and receivers behind clean abstract interfaces/adapters." }
    ],
    "PostgreSQL": [
      { risk: "Connection Pool Exhaustion", severity: "MEDIUM", mitigation: "Install PgBouncer proxy layer and size application connection pools according to CPU boundaries." }
    ],
    "MongoDB": [
      { risk: "Lack of transaction limits / data loss under crash", severity: "MEDIUM", mitigation: "Use replica sets with write concern 'majority' enabled." }
    ],
    "DynamoDB": [
      { risk: "Unanticipated scaling costs on high scan operations", severity: "HIGH", mitigation: "Avoid full scans; rely strictly on query primary/secondary index lookups." }
    ],
    "Modular Monolith": [
      { risk: "Blast radius coupling", severity: "HIGH", mitigation: "Enforce strict dependency boundaries at the code-level using build linter rules." }
    ],
    "Microservices": [
      { risk: "Distributed state consistency issues", severity: "CRITICAL", mitigation: "Implement event-driven eventual consistency with outbox publishers and saga orchestration." }
    ]
  };

  return risksDb[option] || [{ risk: "General Technology Adoption Risk", severity: "LOW", mitigation: "Invest in developer training and set up monitoring dashboards." }];
}

/**
 * Predicts consequences for choosing an option.
 * 
 * @param {string} option 
 * @returns {Object} Consequences
 */
export function predictConsequences(option) {
  const consequencesDb = {
    "BullMQ": {
      positive: ["Enables rapid background task offloading", "Saves checkouts from network delays", "Facilitates transparent job retries"],
      negative: ["Adds Redis operational monitoring requirements", "Constrains background task processing script execution to Node.js environments"]
    },
    "Kafka": {
      positive: ["Enables massive event stream scale", "Supports historical event replay", "Decouples multiple consumer services independently"],
      negative: ["Adds substantial JVM infrastructure overhead", "Requires specialized engineering expertise to debug partition offset mismatches"]
    },
    "SQS": {
      positive: ["Zero infrastructure maintenance required", "Auto-scales instantly to infinity", "Pay-as-you-use pricing"],
      negative: ["Imposes AWS platform coupling", "Introduces message consumption polling latencies"]
    },
    "PostgreSQL": {
      positive: ["Guarantees strict schema integrity", "Ensures transaction ACID compliance", "Supports rich analytics relational joins"],
      negative: ["Limits write operations to a single node primary cluster", "Requires index maintenance overhead on large tables"]
    },
    "Modular Monolith": {
      positive: ["Simple local development setup", "Extremely fast deployments", "Zero network RPC overhead between domains"],
      negative: ["Codebases grow messy without modules check guidelines", "Shared database resource exhaustion affects all domains simultaneously"]
    },
    "Microservices": {
      positive: ["Allows team feature isolation", "Enables independent service scaling", "Improves domain system blast radius"],
      negative: ["Multiplies build and deploy CI/CD pipeline structures", "Requires managing distributed transaction states (Saga/Outbox)"]
    }
  };

  return consequencesDb[option] || {
    positive: ["Standardizes technology choices", "Resolves immediate problem requirements"],
    negative: ["Adds another technology item to maintain", "Slightly increases learning curve"]
  };
}

/**
 * Calculates a recommendation confidence rating between 0 and 100.
 * 
 * @param {Object} context 
 * @param {string} option 
 * @returns {Object} Confidence rating
 */
export function calculateConfidence(context, option) {
  let score = 80;

  if (context.teamSize) {
    if (context.teamSize <= 3) {
      if (option === "Kafka" || option === "Microservices" || option === "Kubernetes / AWS EKS") {
        score -= 30;
      } else if (option === "BullMQ" || option === "Modular Monolith" || option === "Render / PaaS") {
        score += 10;
      }
    } else if (context.teamSize >= 15) {
      if (option === "Modular Monolith") {
        score -= 10;
      } else if (option === "Microservices" || option === "Kafka") {
        score += 10;
      }
    }
  }

  if (context.budget) {
    const cleanBudget = String(context.budget).toUpperCase();
    if (cleanBudget === "LOW") {
      if (option === "Kafka" || option === "Datadog" || option === "Kubernetes / AWS EKS") {
        score -= 20;
      } else if (option === "BullMQ" || option === "SQS" || option === "Render / PaaS") {
        score += 5;
      }
    }
  }

  if (context.incidents && context.incidents.length > 0) {
    const hasQueueIncidents = context.incidents.some(inc => 
      String(inc.type || inc).toLowerCase().includes("timeout") || 
      String(inc.service || inc).toLowerCase().includes("sms") ||
      String(inc.service || inc).toLowerCase().includes("notification")
    );
    if (hasQueueIncidents) {
      if (option === "BullMQ" || option === "Kafka" || option === "SQS") {
        score += 15;
      }
    }
  }

  if (context.existingPatterns && context.existingPatterns.length > 0) {
    const hasRedis = context.existingPatterns.some(pat => String(pat).toLowerCase().includes("redis"));
    if (hasRedis && option === "BullMQ") {
      score += 10;
    }
  }

  return { confidence: Math.max(10, Math.min(100, score)) };
}

/**
 * Simulates scaling constraints into the future.
 * 
 * @param {Object} context 
 * @param {string} option 
 * @returns {Object} Future projection metrics
 */
export function simulateFuture(context = {}, option) {
  let survives = true;
  let bottleneck = "None";
  let impact = "Scales smoothly";
  let reasons = `Option ${option} fits within expected future boundaries.`;

  const growth = String(context.growthForecast || "10x").toUpperCase();

  if (growth === "100X" || growth === "1000X") {
    if (option === "Modular Monolith") {
      survives = false;
      bottleneck = "Database lock contention / Shared resource starvation";
      impact = "Severe API latency degradation and connection dropouts under spikes";
      reasons = "At 100x traffic scaling, modular monoliths sharing a single database instance will experience read-write lock contention on checkout routes.";
    } else if (option === "BullMQ") {
      survives = true;
      bottleneck = "Redis RAM memory exhaustion / Single-threaded worker CPU pool";
      impact = "Delayed job execution times and potential Redis Out-Of-Memory exceptions if workers cannot process fast enough";
      reasons = "BullMQ handles high throughput, but Redis stores everything in memory. A 100x surge requires enabling Redis cluster partitioning and scaling out worker counts.";
    } else if (option === "In-Memory Map") {
      survives = false;
      bottleneck = "Node.js process memory overload";
      impact = "Process crash under Out-Of-Memory (OOM) error";
      reasons = "Storing massive jobs in-memory without a separate database process leads to rapid heap exhaustion.";
    } else if (option === "Kafka") {
      survives = true;
      bottleneck = "Broker disk write bandwidth limit";
      impact = "High disk utilization, but safely scales out using extra partitions and brokers";
      reasons = "Kafka is designed for 100x scaling through distributed partitioning. It survives easily.";
    }
  }

  return {
    option,
    scenario: `${growth} traffic scaling`,
    survives,
    bottleneck,
    impact,
    reasons
  };
}

/**
 * Runs a quick tradeoff review for unexpected operational changes.
 * 
 * @param {string} scenario 
 * @returns {Object} What-if result payload
 */
export function runWhatIfScenario(scenario) {
  const cleanScenario = String(scenario).toLowerCase();
  
  if (cleanScenario.includes("redis dies")) {
    return {
      scenario: "Redis dies",
      impact: "All BullMQ background queues cease working. Jobs remain in publisher threads or fail.",
      recommendation: "Ensure Redis has AOF (Append-Only File) persistence enabled, provision a Redis replica sentinel pool, or implement local file fallback logs (SQLite/Disk buffer) in queue publisher middleware.",
      severity: "CRITICAL"
    };
  }
  
  if (cleanScenario.includes("database doubles") || cleanScenario.includes("db doubles")) {
    return {
      scenario: "Database size doubles",
      impact: "Query latency increases, index scans take longer, primary write locks block checkout routes.",
      recommendation: "Implement PostgreSQL Read Replicas, configure connection pooling with PgBouncer, and introduce cache-aside patterns via Redis for fast dashboard metrics retrieval.",
      severity: "HIGH"
    };
  }
  
  if (cleanScenario.includes("team shrinks")) {
    return {
      scenario: "Development team shrinks",
      impact: "Higher operational load on fewer engineers. Maintenance cycles delay features.",
      recommendation: "Avoid complex microservices, Kubernetes, or self-hosted Kafka clusters. Rely heavily on managed services (PaaS, AWS SQS, Supabase/Render) and modular monolith structures.",
      severity: "MEDIUM"
    };
  }

  if (cleanScenario.includes("costs explode")) {
    return {
      scenario: "Hosting costs explode",
      impact: "Hosting budget runs dry, forcing emergency infrastructure teardowns.",
      recommendation: "Replace expensive APMs (like Datadog) with self-hosted Grafana + Prometheus. Swap over-provisioned database nodes for read replicas, and scale down developer environments outside business hours.",
      severity: "HIGH"
    };
  }

  if (cleanScenario.includes("traffic spikes")) {
    return {
      scenario: "Sudden traffic spikes",
      impact: "API servers saturate CPU pools, queues back up, and checkouts fail due to gateway timeouts.",
      recommendation: "Configure auto-scaling triggers on Render API servers, enable Redis-backed rate limiting, and decouple checkout flow using BullMQ async tasks.",
      severity: "HIGH"
    };
  }

  if (cleanScenario.includes("third-party api unstable") || cleanScenario.includes("api unstable")) {
    return {
      scenario: "Third-party payment/SMS API becomes unstable",
      impact: "Synchronous connections hang, triggering cascading thread failures and checkout timeouts.",
      recommendation: "Decouple connections behind asynchronous BullMQ background workers, configure exponential backoff retry parameters, set up dead-letter-queues (DLQ) for manual inspect audits, and use circuit breaker patterns.",
      severity: "CRITICAL"
    };
  }

  return {
    scenario: scenario,
    impact: "Unanticipated system strain",
    recommendation: "Establish SLO error budgets and configure alerts on Grafana dashboards to inspect latency/errors metrics.",
    severity: "MEDIUM"
  };
}

/**
 * Creates structured explainability narratives for decisions.
 * 
 * @param {string} recommendation 
 * @param {Object} context 
 * @returns {string} Human narrative explanation
 */
export function explainDecision(recommendation, context = {}) {
  const team = context.teamSize || 2;
  const budget = String(context.budget || "LOW").toUpperCase();
  const problem = context.problem || "Need asynchronous processing";
  
  if (recommendation === "BullMQ") {
    return `Given the development team size is small (${team} developers) and budget is conscious (${budget}), we recommend adopting BullMQ. It leverages the existing Redis cache pattern (avoiding the operational cost of spinning up a separate broker like Kafka) while successfully resolving the problem: "${problem}". BullMQ offloads background processing latency and protects checkouts from external service outages via job retries.`;
  }
  
  if (recommendation === "Kafka") {
    return `Because expected traffic growth is high (${context.growthForecast || "10x"}) and we need multi-consumer replay guarantees for audit log streams, Apache Kafka is selected as the optimal choice. Although Kafka introduces significant operational complexity (requires JVM clustering maintenance) that would normally strain a small team of ${team} engineers, its massive scale capabilities and persistent partition offset replay outweigh the complexity cost.`;
  }
  
  if (recommendation === "SQS") {
    return `Given the team prefers zero operational server maintenance, AWS SQS is recommended. SQS is fully serverless, scaling automatically without Redis memory constraints. This choice allows the ${team}-person engineering team to focus entirely on product features rather than queue hosting logistics, accepting the vendor lock-in tradeoff.`;
  }
  
  return `We recommend adopting ${recommendation} for this scenario. This decision resolves the problem ("${problem}") under constraints of team size (${team}) and budget (${budget}) by balancing simplicity, scalability, and long-term complexity tradeoffs.`;
}

/**
 * Records accepted / rejected choices to internal memory.
 * 
 * @param {string} decisionId 
 * @param {string} action 
 * @returns {Object} Success metadata
 */
export function recordDecisionInteraction(decisionId, action) {
  const timestamp = new Date().toISOString();
  DECISION_MEMORY.push({
    decisionId,
    action, // 'ACCEPTED' or 'REJECTED'
    timestamp
  });
  return { success: true, memoryCount: DECISION_MEMORY.length };
}

/**
 * Gets recorded decision items.
 * 
 * @returns {Object[]} Decisions memory
 */
export function getDecisionMemory() {
  return DECISION_MEMORY;
}

/**
 * Evaluates decision context objects and suggests optimal configurations.
 * 
 * @param {Object} context 
 * @returns {Object} Comprehensive decision recommendations payload
 */
export function makeDecision(context = MOCK_DECISION_CONTEXT) {
  const activeContext = { ...MOCK_DECISION_CONTEXT, ...context };
  
  let category = activeContext.category;
  if (!category) {
    const prob = String(activeContext.problem || "").toLowerCase();
    if (prob.includes("queue") || prob.includes("async") || prob.includes("notification") || prob.includes("background") || prob.includes("job") || prob.includes("task")) {
      category = "QUEUE";
    } else if (prob.includes("database") || prob.includes("store") || prob.includes("table") || prob.includes("prisma") || prob.includes("acid") || prob.includes("postgres")) {
      category = "DATABASE";
    } else if (prob.includes("cache") || prob.includes("session") || prob.includes("redis") || prob.includes("speed")) {
      category = "CACHE";
    } else if (prob.includes("architecture") || prob.includes("microservice") || prob.includes("monolith")) {
      category = "ARCHITECTURE";
    } else if (prob.includes("security") || prob.includes("auth") || prob.includes("login") || prob.includes("password")) {
      category = "SECURITY";
    } else if (prob.includes("observability") || prob.includes("log") || prob.includes("metric") || prob.includes("monitor") || prob.includes("alert")) {
      category = "OBSERVABILITY";
    } else if (prob.includes("deploy") || prob.includes("hosting") || prob.includes("kubernetes")) {
      category = "DEPLOYMENT";
    } else if (prob.includes("scale") || prob.includes("replica") || prob.includes("sharding")) {
      category = "SCALING";
    } else if (prob.includes("api") || prob.includes("rest") || prob.includes("graphql") || prob.includes("grpc")) {
      category = "API";
    } else if (prob.includes("state") || prob.includes("riverpod") || prob.includes("bloc")) {
      category = "STATE MANAGEMENT";
    } else if (prob.includes("storage") || prob.includes("s3") || prob.includes("bucket")) {
      category = "STORAGE";
    } else if (prob.includes("analytics") || prob.includes("dashboard") || prob.includes("clickhouse")) {
      category = "ANALYTICS";
    } else if (prob.includes("message") || prob.includes("socket") || prob.includes("websocket")) {
      category = "MESSAGING";
    } else {
      category = "QUEUE";
    }
  }
  
  category = category.toUpperCase();
  
  const options = OPTIONS_BY_CATEGORY[category] || OPTIONS_BY_CATEGORY.QUEUE;
  
  let recommendation = options[0];
  
  const team = activeContext.teamSize || 2;
  const budget = String(activeContext.budget || "LOW").toUpperCase();
  const growth = String(activeContext.growthForecast || "10x").toUpperCase();
  const probText = String(activeContext.problem || "").toLowerCase();
  
  if (category === "QUEUE") {
    if (team <= 3 && budget === "LOW") {
      recommendation = "BullMQ";
    } else if ((growth === "100X" || growth === "1000X") && team >= 8) {
      recommendation = "Kafka";
    } else if (probText.includes("managed") || probText.includes("serverless") || probText.includes("aws")) {
      recommendation = "SQS";
    } else {
      recommendation = "BullMQ";
    }
  } else if (category === "DATABASE") {
    if (probText.includes("transaction") || probText.includes("relational") || probText.includes("acid") || probText.includes("schema")) {
      recommendation = "PostgreSQL";
    } else if (probText.includes("document") || probText.includes("schema-less") || probText.includes("flexible")) {
      recommendation = "MongoDB";
    } else if (probText.includes("serverless") || probText.includes("managed") || probText.includes("aws")) {
      recommendation = "DynamoDB";
    } else {
      recommendation = "PostgreSQL";
    }
  } else if (category === "CACHE") {
    if (probText.includes("memcached")) {
      recommendation = "Memcached";
    } else if (probText.includes("in-memory") || probText.includes("simple map")) {
      recommendation = "In-Memory Map";
    } else {
      recommendation = "Redis";
    }
  } else if (category === "ARCHITECTURE") {
    if (team <= 5) {
      recommendation = "Modular Monolith";
    } else if (team >= 15) {
      recommendation = "Microservices";
    } else {
      recommendation = "Modular Monolith";
    }
  }

  const generatedAlts = generateAlternatives(category, activeContext);
  const alternativesList = generatedAlts.map(a => a.name).filter(name => name !== recommendation);
  
  const tradeoffs = analyzeTradeoffs(recommendation);
  const risksList = evaluateRisks(recommendation);
  const consequences = predictConsequences(recommendation);
  const confidenceData = calculateConfidence(activeContext, recommendation);
  const futureImpact = simulateFuture(activeContext, recommendation);
  const why = explainDecision(recommendation, activeContext);
  
  const constraints = [];
  if (team <= 3) constraints.push("Small development team size");
  else constraints.push("Large development team coordination");
  
  if (budget === "LOW") constraints.push("Extremely tight budget boundaries");
  else if (budget === "HIGH") constraints.push("Generous enterprise hosting budget");
  
  if (growth === "100X" || growth === "1000X") constraints.push("100x traffic hyper-growth scaling requirements");
  else constraints.push("Moderate linear traffic growth target");

  if (activeContext.latencyRequirements) {
    constraints.push(`Latency threshold constraint: ${activeContext.latencyRequirements}`);
  }

  // Cross-system inputs from Git evolution chronicle and SRE monitoring datasets
  if (activeContext.gitHistoryData) {
    const pain = activeContext.gitHistoryData.repeatedPain || [];
    if (pain.length > 0) {
      constraints.push(`Historical development pain in: ${pain.map(p => p.pattern).join(', ')}`);
      if (pain.some(p => p.pattern.toLowerCase().includes("webhook") || p.pattern.toLowerCase().includes("queue"))) {
        if (category === "QUEUE" && recommendation !== "BullMQ" && team <= 3) {
          recommendation = "BullMQ";
        }
      }
    }
  }

  if (activeContext.observabilityData) {
    const incidents = activeContext.observabilityData.incidents || [];
    if (incidents.length > 0) {
      constraints.push(`Operational incidents profile: ${incidents.length} recorded events`);
    }
  }

  return {
    bestOption: recommendation,
    recommendation: recommendation,
    why: why,
    rejectedOptions: alternativesList,
    alternatives: alternativesList,
    tradeoffs: tradeoffs,
    risks: risksList.map(r => r.risk || r),
    risksDetailed: risksList,
    confidence: confidenceData.confidence,
    constraints: constraints,
    consequences: consequences,
    futureImpact: futureImpact,
    futureImpactPrediction: futureImpact.reasons,
    category: category,
    contextUsed: activeContext
  };
}
