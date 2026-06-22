/**
 * UniverseBrain.js
 * 
 * Supreme orchestrator of the Software Universe intelligence layer.
 * Coordinates outputs from the Learning, Codebase, Decision, and Living Software layers,
 * synthesizing them into a unified cognitive state.
 * 
 * Pure functions only. Runs safely in both Node and browser environments.
 */

// Supported learner stages
export const LEARNER_STAGES = [
  "BEGINNER", "APPRENTICE", "PRACTITIONER", "SENIOR", "ARCHITECT", "SYSTEM_THINKER"
];

/**
 * Subsystem: Learning Brain
 * Analyzes concept mastery, confidence levels, and active gaps.
 * 
 * @param {Object} state 
 * @returns {Object} Learning metrics
 */
export function analyzeLearning(state = {}) {
  const learner = state.learner || {};
  const mastery = learner.mastery || {};
  const history = learner.history || [];

  const concepts = Object.keys(mastery);
  let totalMastery = 0;
  let totalConfidence = learner.confidence || 50;
  const weakConcepts = [];
  const strongConcepts = [];

  concepts.forEach(concept => {
    const val = Number(mastery[concept] || 0);
    totalMastery += val;
    if (val < 40) weakConcepts.push(concept);
    if (val > 80) strongConcepts.push(concept);
  });

  const avgMastery = concepts.length > 0 ? Math.round(totalMastery / concepts.length) : 35;
  const favoriteThemes = history.map(h => h.theme).filter((v, i, a) => v && a.indexOf(v) === i);

  return {
    mastery: avgMastery,
    confidence: totalConfidence,
    weakConcepts: weakConcepts.length > 0 ? weakConcepts : ["databases", "queues"],
    strongConcepts: strongConcepts.length > 0 ? strongConcepts : ["foundations"],
    favoriteThemes: favoriteThemes.length > 0 ? favoriteThemes : ["observability", "reliability"],
    misconceptions: learner.misconceptions || []
  };
}

/**
 * Subsystem: Architecture Brain
 * Details system structure, dominant constraints, and design balances.
 * 
 * @param {Object} state 
 * @returns {Object} Architectural analysis
 */
export function analyzeArchitecture(state = {}) {
  const codebase = state.codebase || {};
  const constraints = state.constraints || {};

  const strengths = [];
  const weaknesses = [];

  if (codebase.files && codebase.files.length > 10) {
    strengths.push("Clear separation between components and API routing");
  } else {
    strengths.push("Compact, easily understandable directory footprint");
  }

  if (state.runtime && state.runtime.errorRate > 5) {
    weaknesses.push("Unstable checkout transaction pipelines");
  } else {
    weaknesses.push("Lack of distributed transactional fallback layers");
  }

  return {
    strengths: strengths,
    weaknesses: weaknesses,
    bottlenecks: codebase.bottlenecks || ["Primary Database lock contention under analytics spikes"],
    constraints: constraints.dominant || "TEAM_SIZE (2 developers limits microservice operational capability)",
    tradeoffs: [
      "BullMQ (Simple setup, Redis reuse) vs Apache Kafka (High throughput, heavy operational overhead)"
    ]
  };
}

/**
 * Subsystem: Runtime Brain
 * Analyzes latencies, failures, traces, and alert triggers.
 * 
 * @param {Object} state 
 * @returns {Object} Runtime analysis
 */
export function analyzeRuntime(state = {}) {
  const runtime = state.runtime || {};

  return {
    latency: runtime.latency || 1500,
    p95: runtime.p95 || 3200,
    p99: runtime.p99 || 8000,
    queues: {
      depth: runtime.queueDepth || 450,
      status: (runtime.queueDepth || 0) > 500 ? "WARNING" : "HEALTHY"
    },
    failures: runtime.errorRate || 12.0,
    alerts: runtime.alerts || ["P99 Latency Breach SEV1", "Checkout Error Rate Spiking"],
    traces: runtime.traces || [
      { id: "span-1", name: "Order Controller POST", duration: 8000, status: "TIMEOUT" }
    ],
    criticalPath: runtime.criticalPath || [
      "Checkout Screen", "Order Client Service", "API Gateway", "Order SQL Repository", "Postgres Master Node"
    ]
  };
}

/**
 * Subsystem: Evolution Brain
 * Predicts learner advancement and system scale readiness.
 * 
 * @param {Object} state 
 * @returns {Object} Evolution projections
 */
export function predictEvolution(state = {}) {
  const learning = analyzeLearning(state);
  const userTraffic = state.traffic || 500;

  let currentStage = "BEGINNER";
  if (learning.mastery > 40) currentStage = "APPRENTICE";
  if (learning.mastery > 60) currentStage = "PRACTITIONER";
  if (learning.mastery > 80) currentStage = "SENIOR";
  if (learning.mastery > 90) currentStage = "ARCHITECT";
  if (learning.mastery > 95 && state.learner?.hasMoments) currentStage = "SYSTEM_THINKER";

  const nextIndex = Math.min(LEARNER_STAGES.indexOf(currentStage) + 1, LEARNER_STAGES.length - 1);
  const nextStage = LEARNER_STAGES[nextIndex];

  let missingCapabilities = [];
  let futureConstraints = [];

  if (userTraffic < 1000) {
    missingCapabilities = ["Asynchronous job queues", "Redis cache shielding"];
    futureConstraints = ["Primary DB write lock limits"];
  } else {
    missingCapabilities = ["Database sharding", "Multi-region fallback routings"];
    futureConstraints = ["Consensus sync latency thresholds"];
  }

  return {
    currentStage: currentStage,
    nextStage: nextStage,
    missingCapabilities: missingCapabilities,
    futureConstraints: futureConstraints
  };
}

/**
 * Subsystem: Story Brain
 * Captures historical breakthroughs and realization timelines.
 * 
 * @param {Object} state 
 * @returns {string[]} Milestone stories list
 */
export function generateStory(state = {}) {
  const learner = state.learner || {};
  const milestones = learner.milestones || [];

  const stories = [
    "Started journey by memorizing structural queue endpoints.",
    "First breakthrough: Separated compute threads using background workers."
  ];

  if (milestones.includes("FIRST_TRADEOFF")) {
    stories.push("Realized that Kafka and BullMQ carry vastly different operational costs; evaluated complexity thresholds.");
  }
  if (milestones.includes("FIRST_CONSTRAINT")) {
    stories.push("Understood that team size boundaries limit the viability of microservice splits.");
  }
  if (milestones.includes("FIRST_POSTMORTEM")) {
    stories.push("Analyzed database locking outages blamelessly, shifting focus from code edits to structural SRE postmortems.");
  }

  return stories;
}

/**
 * Subsystem: Challenge Brain
 * Generates conceptual questions adapted to the learner's tier.
 * 
 * @param {Object} state 
 * @returns {string} Architectural challenge
 */
export function generateChallenge(state = {}) {
  const evolution = predictEvolution(state);
  const stage = evolution.currentStage;

  if (stage === "BEGINNER" || stage === "APPRENTICE") {
    return "What is the difference between a synchronous API call and a queued background job, and how does it affect client response times?";
  }
  if (stage === "PRACTITIONER") {
    return "Your database CPU spiked to 100% due to dashboard query loads. How do read replicas route traffic without dropping checkout writes?";
  }
  if (stage === "SENIOR") {
    return "Design an idempotency system for a checkout route: what happens when a client retries a payment POST request after a network gateway timeout?";
  }

  return "A high-throughput notification broker is required. Evaluate the operational tradeoffs between BullMQ on Redis versus Apache Kafka, given a team size of 2 engineers.";
}

/**
 * Subsystem: Misconception Brain
 * Flags and corrects common architectural anti-patterns.
 * 
 * @param {Object} state 
 * @returns {Object} Misconception report
 */
export function detectMisconceptions(state = {}) {
  const learning = analyzeLearning(state);
  const active = learning.misconceptions[0] || "MICROSERVICES_SOLVE_ALL";

  if (active === "KAFKA_IS_ALWAYS_BETTER") {
    return {
      misconception: "Kafka is always the best choice for message queuing.",
      correction: "For small teams and low budgets, BullMQ on Redis provides retries and job status tracking with zero extra operational overhead.",
      explanation: "Kafka requires cluster nodes, Zookeeper/KRaft coordination, and partition limits, carrying high administrative overhead.",
      counterExample: "A 2-developer team spending more time administering Kafka brokers than writing business code."
    };
  }
  if (active === "PATTERNS_ARE_GOALS") {
    return {
      misconception: "The goal of architecture is to apply as many patterns as possible.",
      correction: "Patterns are tools that address specific bottlenecks. Applying them prematurely adds complexity without value.",
      explanation: "Every pattern carries a tradeoff. CQRS separates reads and writes but complicates consistency checks.",
      counterExample: "Adding event sourcing to a simple CRUD blog site."
    };
  }

  return {
    misconception: "Splitting a monolith into microservices automatically solves all scalability issues.",
    correction: "Microservices solve team coordination and localized scalability limits, but introduce network latency, transaction rollbacks, and operational burden.",
    explanation: "If your monolith has database bottleneck issues, splitting it into microservices that share the same database will only worsen locks.",
    counterExample: "A startup team splitting a monolithic API into 15 microservices, resulting in slower release cycles and constant integration errors."
  };
}

/**
 * Subsystem: Opportunity Engine
 * Detects next logical learning targets.
 * 
 * @param {Object} state 
 * @returns {string[]} Unlocked pathways
 */
export function detectOpportunities(state = {}) {
  const learning = analyzeLearning(state);
  const opportunities = [];

  if (learning.mastery < 50) {
    opportunities.push("Deepen queue buffering principles and retry setups.");
  } else {
    opportunities.push("Explore database primary-replica routing with PgBouncer.");
  }

  if (learning.confidence < 40) {
    opportunities.push("Complete challenge drills on idempotency keys to boost confidence.");
  } else {
    opportunities.push("Initiate SRE telemetry scan drills (Golden Signals logging).");
  }

  return opportunities;
}

/**
 * Subsystem: Transformation Engine
 * Measures growth milestones reached.
 * 
 * @param {Object} state 
 * @returns {Object} Milestones report
 */
export function evaluateTransformation(state = {}) {
  const learner = state.learner || {};
  const milestones = learner.milestones || [];

  const recorded = [];
  milestones.forEach(m => {
    if (m === "FIRST_TRADEOFF") {
      recorded.push({ name: "Tradeoff Analysis Mastery", detail: "Learner weighed implementation simplicity against high-scale overhead." });
    }
    if (m === "FIRST_CONSTRAINT") {
      recorded.push({ name: "Constraint Realization", detail: "Learner recognized that developer bandwidth dominates over theoretical scale." });
    }
    if (m === "FIRST_POSTMORTEM") {
      recorded.push({ name: "Blameless SRE Scribing", detail: "Learner transitioned from diagnostic blame to structural SRE postmortems." });
    }
  });

  if (recorded.length === 0) {
    recorded.push({ name: "Vibe Coding Foundations", detail: "Learner is currently mastering basic code syntax separations." });
  }

  return {
    milestones: recorded,
    significance: `${recorded.length} major transition milestones recorded in memory.`
  };
}

/**
 * Subsystem: Future Roadmap Engine
 * Plans step-by-step topic timelines.
 * 
 * @param {Object} state 
 * @returns {Object} Study roadmap
 */
export function buildRoadmap(state = {}) {
  const evolution = predictEvolution(state);
  const stage = evolution.currentStage;

  if (stage === "BEGINNER" || stage === "APPRENTICE") {
    return {
      immediate: ["Queues basics", "BullMQ workers", "Redis session setups"],
      shortTerm: ["Postgres Read Replicas", "SRE Golden Signals", "Canary Gates"],
      longTerm: ["Kafka event streams", "Globally sharded databases", "Consensus algorithms"]
    };
  }

  return {
    immediate: ["PgBouncer setup", "Distributed tracing Dapper models", "Blameless postmortems"],
    shortTerm: ["Vitess DB sharding", "Anycast CDN routing", "Consul service discovery"],
    longTerm: ["Active-Active multi-region database sync", "Globally consistent Spanner networks"]
  };
}

/**
 * Subsystem: Self Reflection
 * Analyzes blind spots and growth paths.
 * 
 * @param {Object} state 
 * @returns {Object} Self reflection report
 */
export function reflect(state = {}) {
  const learning = analyzeLearning(state);

  return {
    strengths: ["Highly engaged with observability telemetry dashboards", "Identifies team size limits pragmatically"],
    blindSpots: learning.weakConcepts,
    growthAreas: ["Database transaction boundaries under concurrent lock contention"],
    nextBreakthrough: "Tradeoff-driven technology selection: letting benchmark metrics drive choices rather than fashion."
  };
}

/**
 * Subsystem: Narrative Engine
 * Weaves Staff Architect narratives explaining the apprentice's evolution.
 * 
 * @param {Object} state 
 * @returns {string} Narrative biography
 */
export function generateNarrative(state = {}) {
  const evolution = predictEvolution(state);
  const learning = analyzeLearning(state);

  return `The apprentice began their journey as a standard vibe coder, copying code snippets and hoping for scale. At the ${evolution.currentStage} stage, they have completed key breakthroughs. Having mapped conceptual mastery to ${learning.mastery}%, they have started separating concerns using asynchronous background workers rather than synchronous routes. They have recognized that code is shaped by constraints, and that systems fail. The transition to systems thinking is under way: they no longer ask 'which framework should I use?', but rather 'which dominant constraint forces this tradeoff?'`;
}

/**
 * Supreme entry point: Orchestrates all sub-brains.
 * 
 * @param {Object} state - Unified state payload
 * @returns {Object} Compiled cognitive overview of the Software Universe
 */
export function think(state = {}) {
  const learning = analyzeLearning(state);
  const arch = analyzeArchitecture(state);
  const runtime = analyzeRuntime(state);
  const evolution = predictEvolution(state);
  const story = generateStory(state);
  const challenge = generateChallenge(state);
  const misc = detectMisconceptions(state);
  const opportunities = detectOpportunities(state);
  const transform = evaluateTransformation(state);
  const roadmap = buildRoadmap(state);
  const reflection = reflect(state);
  const narrative = generateNarrative(state);

  return {
    learnerState: {
      stage: evolution.currentStage,
      mastery: learning.mastery,
      confidence: learning.confidence,
      weakConcepts: learning.weakConcepts,
      strongConcepts: learning.strongConcepts
    },
    systemState: {
      latency: runtime.latency,
      p99: runtime.p99,
      errorRate: runtime.failures,
      queueDepth: runtime.queues.depth
    },
    architectureState: {
      constraints: arch.constraints,
      bottlenecks: arch.bottlenecks,
      tradeoffs: arch.tradeoffs
    },
    runtimeState: runtime,
    recommendations: `Adopt ${state.recommendation || "BullMQ + Postgres Replicas"} to solve current bottlenecks.`,
    interventions: opportunities.map(o => `Action: ${o}`),
    stories: story,
    challenges: [challenge],
    transformations: transform,
    architectMoments: transform.milestones.map(m => m.name),
    warnings: runtime.alerts,
    opportunities: opportunities,
    narrative: narrative,
    futureRoadmap: roadmap,
    reflection: reflection
  };
}
