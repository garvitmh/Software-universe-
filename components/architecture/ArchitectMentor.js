/**
 * ArchitectMentor.js
 * 
 * The final pedagogical coaching and student mentoring engine of Software Universe.
 * Translates student state (mastery, confidence, failures, velocity) into mentor modes,
 * transformation stages, and customized learning strategies.
 * Generates active interventions, architectural stories, level-appropriate puzzles,
 * common misconceptions corrections, achievement celebrations, burnout detection,
 * architect moments, maturity index scores, and learning progress biographies.
 * 
 * Pure functions only. Runs safely in both Node and browser environments.
 */

// List of supported mentor modes and their behavioral characteristics
export const MENTOR_MODES = {
  PROFESSOR: { difficulty: "MEDIUM", tone: "Formal, academic", questionStyle: "Conceptual definitions" },
  COACH: { difficulty: "LOW", tone: "Encouraging, supportive", questionStyle: "Analogy-driven scenarios" },
  SOCRATIC: { difficulty: "HIGH", tone: "Inquisitive, challenging", questionStyle: "Counterexamples and 'why' prompts" },
  ARCHITECT: { difficulty: "HIGH", tone: "Pragmatic, tradeoff-centric", questionStyle: "Constraint-driven designs" },
  DRILL_SERGEANT: { difficulty: "CRITICAL", tone: "Direct, intense", questionStyle: "Failure scenarios under stress" },
  STORYTELLER: { difficulty: "LOW", tone: "Anecdotal, historical", questionStyle: "Biography-led reviews" },
  EXPLORER: { difficulty: "MEDIUM", tone: "Curious, open-ended", questionStyle: "Hypothetical futures" },
  CHALLENGER: { difficulty: "HIGH", tone: "Competitive, puzzle-based", questionStyle: "System edge-cases" }
};

// Evolution path stages representing student growth
export const TRANSFORMATION_STAGES = [
  "BEGINNER",
  "APPRENTICE",
  "PRACTITIONER",
  "SENIOR",
  "ARCHITECT",
  "SYSTEM_THINKER"
];

// Baseline default learner state model
export const DEFAULT_LEARNER_STATE = {
  averageMastery: 35,
  confidence: 50,
  failuresCount: 0,
  consecutiveWrongAnswers: 0,
  correctAnswersCount: 3,
  velocity: 80, // out of 100
  architectMomentsCount: 0,
  lastAnswerCorrect: true,
  challengeModeActive: false,
  burnoutDetected: false,
  pastDecisionsReviewed: ["ADR-001", "ADR-004"],
  selectedMisconceptions: []
};

/**
 * Assigns optimal mentor mode based on confidence, correctness, and fatigue.
 * 
 * @param {Object} state - Learner state
 * @returns {string} Selected mentor mode name
 */
export function chooseMentorMode(state = DEFAULT_LEARNER_STATE) {
  const active = { ...DEFAULT_LEARNER_STATE, ...state };
  
  if (active.burnoutDetected || active.failuresCount >= 4) {
    return "STORYTELLER";
  }

  if (active.confidence < 45) {
    return "COACH";
  }

  if (active.confidence >= 80 && active.consecutiveWrongAnswers >= 2) {
    return "SOCRATIC";
  }

  if (active.averageMastery >= 70 || active.correctAnswersCount >= 8) {
    return "ARCHITECT";
  }

  if (active.challengeModeActive) {
    return "CHALLENGER";
  }

  return "PROFESSOR";
}

/**
 * Measures learner stage from accumulated metrics.
 * 
 * @param {Object} state - Learner state
 * @returns {string} Transformation stage
 */
export function determineTransformationStage(state = DEFAULT_LEARNER_STATE) {
  const active = { ...DEFAULT_LEARNER_STATE, ...state };
  const moments = active.architectMomentsCount || 0;
  const mastery = active.averageMastery || 0;

  if (mastery >= 85 && moments >= 4) return "SYSTEM_THINKER";
  if (mastery >= 70 && moments >= 2) return "ARCHITECT";
  if (mastery >= 55 && active.correctAnswersCount >= 6) return "SENIOR";
  if (mastery >= 40) return "PRACTITIONER";
  if (mastery >= 20) return "APPRENTICE";
  return "BEGINNER";
}

/**
 * Configures focused subjects, question difficulty, and pace parameters.
 * 
 * @param {Object} state - Learner state
 * @returns {Object} Learning strategy details
 */
export function buildLearningStrategy(state = DEFAULT_LEARNER_STATE) {
  const active = { ...DEFAULT_LEARNER_STATE, ...state };
  const stage = determineTransformationStage(active);

  if (stage === "BEGINNER" || stage === "APPRENTICE") {
    return {
      pace: "SLOW",
      difficulty: "LOW",
      focus: "Mental models, basic concepts, and direct file structures",
      teachingStyle: "Analogy-heavy explanations and fundamental definitions of layers"
    };
  }

  if (stage === "SENIOR" || stage === "ARCHITECT" || stage === "SYSTEM_THINKER") {
    return {
      pace: "FAST",
      difficulty: "HIGH",
      focus: "Architecture tradeoff grids, scaling bottlenecks, and what-if simulation scenarios",
      teachingStyle: "Tradeoff comparisons and constraint-based, open-ended challenging questions"
    };
  }

  return {
    pace: "MEDIUM",
    difficulty: "MEDIUM",
    focus: "Design patterns, dependencies, and historical evolution stages",
    teachingStyle: "Case studies and pattern reviews"
  };
}

/**
 * Selects active teaching interventions matching learner state symptoms.
 * 
 * @param {Object} state - Learner state
 * @returns {Object[]} Active interventions
 */
export function generateInterventions(state = DEFAULT_LEARNER_STATE) {
  const active = { ...DEFAULT_LEARNER_STATE, ...state };
  const interventions = [];

  if (active.failuresCount >= 3) {
    interventions.push({ type: "EXPLAIN_SIMPLER", reason: "Multiple consecutive failures detected.", priority: "HIGH" });
    interventions.push({ type: "REVIEW_FOUNDATION", reason: "Requires conceptual refresh on design patterns.", priority: "MEDIUM" });
  }

  if (active.lastAnswerCorrect === false && active.confidence >= 75) {
    interventions.push({ type: "SHOW_FAILURE", reason: "Confidently wrong on recent checkout logic.", priority: "HIGH" });
    interventions.push({ type: "SHOW_TRADEOFF", reason: "learner needs to evaluate design options side-by-side.", priority: "MEDIUM" });
  }

  if (active.burnoutDetected) {
    interventions.push({ type: "TAKE_BREAK", reason: "Fatigue indicators are high. Lowering workload.", priority: "CRITICAL" });
    interventions.push({ type: "TELL_STORY", reason: "Shifting to biographical historical review.", priority: "HIGH" });
  }

  if (active.architectMomentsCount > 0 && active.lastAnswerCorrect) {
    interventions.push({ type: "CELEBRATE", reason: "Deep architectural insight demonstrated.", priority: "MEDIUM" });
  }

  if (interventions.length === 0) {
    interventions.push({ type: "ASK_QUESTION", reason: "Standard progress flow.", priority: "LOW" });
    interventions.push({ type: "SHOW_ANALOGY", reason: "Reinforcing current pattern layout.", priority: "LOW" });
  }

  return interventions;
}

/**
 * Generates chronological architectural stories.
 * 
 * @returns {Object[]} Chronological stories
 */
export function generateStories() {
  return [
    {
      title: "The Fall of Synchronous Checkouts",
      concept: "Asynchronous Queuing & Decoupling",
      narrative: "Burger Farm started with direct synchronous calls to Twilio inside the POST /orders checkout route. It was simple. Then, a promotional code went viral. Twilio API connections lagged, blocking database write threads. Payments timed out. The fix was simple: offload notifications to BullMQ background workers, saving checkouts from network delivery hangs."
    },
    {
      title: "The Analytics CPU Squeeze",
      concept: "Database Read Replicas",
      narrative: "Admin reporting dashboards querying monthly revenue totals began saturating the primary database CPU. Customer checkout writes starved, causing server exceptions. The team resolved this not by cache-aside optimization, but by provisioning secondary read replicas, safely routing heavy select queries away from the transaction writer."
    }
  ];
}

/**
 * Maps architectural puzzle questions according to five learner stages.
 * 
 * @param {string} stage 
 * @returns {Object} Puzzle question details
 */
export function generateChallenges(stage = "BEGINNER") {
  const challengesDb = {
    BEGINNER: {
      level: 1,
      question: "What is the Repository Pattern, and why is it preferred over embedding raw Prisma database commands directly inside controllers?",
      expectedConcepts: ["Decoupling", "Mocking adapters", "Unit testing separation"]
    },
    APPRENTICE: {
      level: 2,
      question: "Why should we avoid creating circular mutual service references (e.g., OrderService calling PaymentService which calls OrderService)?",
      expectedConcepts: ["Dependency cycles", "Tight coupling", "Event emitters segregation"]
    },
    PRACTITIONER: {
      level: 3,
      question: "Why not query the primary write database instance directly for monthly revenue sales admin graphs?",
      expectedConcepts: ["Resource contention", "CPU saturation", "Read replica routing"]
    },
    SENIOR: {
      level: 4,
      question: "What do we sacrifice when selecting fully serverless AWS SQS queues over self-hosted Redis BullMQ queues?",
      expectedConcepts: ["Vendor lock-in", "Consumption latency", "AOF persistence infrastructure costs"]
    },
    ARCHITECT: {
      level: 5,
      question: "How should Stripe resolve webhook delivery instability to guarantee payment ledger entries are not double-charged?",
      expectedConcepts: ["Idempotency keys", "Database transaction locks", "Distributed double processing checks"]
    },
    SYSTEM_THINKER: {
      level: 6,
      question: "Which constraint dominates: developer team operational bandwidth or maximum horizontal throughput? Defend Monolith vs Microservices.",
      expectedConcepts: ["Operational load", "Network latency", "Team size coordination constraints"]
    }
  };

  return challengesDb[stage.toUpperCase()] || challengesDb.BEGINNER;
}

/**
 * Highlights common junior assumptions and suggests corrections.
 * 
 * @param {string[]} selectedKeywords 
 * @returns {Object[]} Misconception profiles
 */
export function detectMisconceptions(selectedKeywords = []) {
  const database = [
    {
      misconception: "Microservices solve all scalability and team communication issues.",
      correction: "Microservices introduce severe distributed complexity, network RPC latency, and complex consistency patterns (e.g. Sagas). Avoid them for small teams.",
      example: "Splitting Burger Farm into 10 services with 2 developers would halt velocity.",
      counterExample: "A Modular Monolith provides clean domain boundaries inside a single compile unit, saving deploy overhead."
    },
    {
      misconception: "Apache Kafka is always the superior message queue option.",
      correction: "Kafka is highly scalable but carries high operational overhead (JVM, partition counts, cluster admin). For notifications or buffers, BullMQ or SQS is simpler.",
      example: "Reusing an existing Redis cache for BullMQ allows job buffering with zero new infrastructure bills.",
      counterExample: "Spinning up a multi-broker Kafka cluster to queue checkout SMS alerts for a local restaurant app is extreme over-engineering."
    },
    {
      misconception: "Caching in Redis always improves performance.",
      correction: "Caching dynamic data adds write-through delays, memory limits, and invalidation bugs. Don't cache data that is constantly updated.",
      example: "Caching real-time order cooking statuses creates state mismatch bugs between users and kitchen staff.",
      counterExample: "Caching catalog categories or payment options saves frequent database reads."
    }
  ];

  if (selectedKeywords.length === 0) return [database[0]];

  return database.filter(db => 
    selectedKeywords.some(kw => 
      db.misconception.toLowerCase().includes(kw.toLowerCase()) || 
      db.correction.toLowerCase().includes(kw.toLowerCase())
    )
  );
}

/**
 * Creates achievement logs celebrating developmental breakthroughs.
 * 
 * @param {Object} state - Learner state
 * @returns {Object[]} Celebrations
 */
export function celebrateAchievements(state = DEFAULT_LEARNER_STATE) {
  const active = { ...DEFAULT_LEARNER_STATE, ...state };
  const achievements = [];

  if (active.correctAnswersCount >= 1) {
    achievements.push({
      type: "FIRST_BREAKTHROUGH",
      message: "Learner successfully mapped a synchronous database query to an isolated Repository class pattern.",
      significance: "Initial transition to clean dependency injection structures."
    });
  }

  if (active.pastDecisionsReviewed.includes("ADR-005")) {
    achievements.push({
      type: "FIRST_TRADEOFF",
      message: "Learner evaluated pros/cons of SQS serverless vs Redis BullMQ queues under budget limits.",
      significance: "Beginning of tradeoff-based technology selections."
    });
  }

  if (active.architectMomentsCount >= 1) {
    achievements.push({
      type: "SYSTEM_THINKING_MOMENT",
      message: "Learner prioritized developer operational bandwidth over distributed microservice boundaries.",
      significance: "Demonstrated constraint-centric reasoning rather than ad-hoc technology preferences."
    });
  }

  return achievements;
}

/**
 * Checks for fatigue signals from learner performance metrics.
 * 
 * @param {Object} state - Learner state
 * @returns {Object} Burnout diagnostic
 */
export function detectBurnout(state = DEFAULT_LEARNER_STATE) {
  const active = { ...DEFAULT_LEARNER_STATE, ...state };
  const isBurnedOut = active.failuresCount >= 3 && active.velocity < 50;

  return {
    burnoutDetected: isBurnedOut,
    symptoms: isBurnedOut ? ["Declining answer velocity", "High consecutive failures", "Low confidence scores"] : [],
    remedy: isBurnedOut ? "Switch to STORYTELLER mentor mode, reduce question difficulty, and review database caching basics." : "Maintain normal learning pace."
  };
}

/**
 * Flags and logs deep architectural insights.
 * 
 * @param {Object} state - Learner state
 * @returns {Object} Architect moment logs
 */
export function detectArchitectMoments(state = DEFAULT_LEARNER_STATE) {
  const active = { ...DEFAULT_LEARNER_STATE, ...state };
  
  // Custom heuristics checking learner answers or milestones
  const detected = active.architectMomentsCount > 0 || active.pastDecisionsReviewed.includes("ADR-005");

  return {
    detected: detected,
    type: detected ? "CONSTRAINT_AWARENESS" : "NONE",
    evidence: detected ? "Learner identified developer team size (2 developers) as the dominant constraint over microservice splits." : "No explicit architect moments detected yet.",
    significance: detected ? "Reflects transition from memorizing design patterns to reasoning under strict constraints." : "Continue coaching basic tradeoffs."
  };
}

/**
 * Rates student maturity indexes between 0 and 100.
 * 
 * @param {Object} state - Learner state
 * @returns {Object} Maturity scores
 */
export function evaluateArchitecturalMaturity(state = DEFAULT_LEARNER_STATE) {
  const active = { ...DEFAULT_LEARNER_STATE, ...state };
  
  let patternScore = 30 + active.correctAnswersCount * 5;
  let tradeoffScore = 20 + active.correctAnswersCount * 6;
  let failureScore = 15 + active.correctAnswersCount * 7;
  let evolutionScore = 10 + active.correctAnswersCount * 8;
  let systemScore = 10 + (active.architectMomentsCount || 0) * 20;
  let constraintScore = 10 + (active.architectMomentsCount || 0) * 25;

  return {
    patternThinking: Math.min(100, patternScore),
    tradeoffThinking: Math.min(100, tradeoffScore),
    failureThinking: Math.min(100, failureScore),
    evolutionThinking: Math.min(100, evolutionScore),
    systemThinking: Math.min(100, systemScore),
    constraintThinking: Math.min(100, constraintScore)
  };
}

/**
 * Compiles learning evolution biography narrative.
 * 
 * @param {Object} state - Learner state
 * @returns {string} Narrative biography
 */
export function generateNarrative(state = DEFAULT_LEARNER_STATE) {
  const active = { ...DEFAULT_LEARNER_STATE, ...state };
  const stage = determineTransformationStage(active);

  let narrative = `The learner began their journey by memorizing code structures as a ${TRANSFORMATION_STAGES[0]}. `;
  
  if (stage === "BEGINNER" || stage === "APPRENTICE") {
    narrative += "They are currently building basic mental models and learning file layers boundaries.";
  } else if (stage === "PRACTITIONER" || stage === "SENIOR") {
    narrative += "They transitioned into recognizing patterns and resolving dependency coupling metrics. They are starting to grasp tradeoffs.";
  } else {
    narrative += `They have matured into a ${stage}. They no longer ask 'What technology should I use?', but rather 'What constraint is shaping my problem?' They evaluate risks, cost metrics, and project scalability lifetimes. This is the beginning of genuine architectural thinking.`;
  }

  return narrative;
}

/**
 * Evaluates student state parameters and formats pedagogical guidance.
 * 
 * @param {Object} state - Learner state
 * @returns {Object} Unified mentor payload
 */
export function guideLearner(state = DEFAULT_LEARNER_STATE) {
  const activeState = { ...DEFAULT_LEARNER_STATE, ...state };
  
  const mode = chooseMentorMode(activeState);
  const stage = determineTransformationStage(activeState);
  const strategy = buildLearningStrategy(activeState);
  const interventions = generateInterventions(activeState);
  const stories = generateStories();
  const challenge = generateChallenges(stage);
  const achievements = celebrateAchievements(activeState);
  const burnout = detectBurnout(activeState);
  const moments = detectArchitectMoments(activeState);
  const maturity = evaluateArchitecturalMaturity(activeState);
  const narrative = generateNarrative(activeState);

  // Match keyword checks for misconceptions
  const keywords = activeState.selectedMisconceptions || [];
  const misconceptions = detectMisconceptions(keywords);

  return {
    mentorMode: mode,
    mentorModeDetails: MENTOR_MODES[mode],
    transformationStage: stage,
    learningStrategy: strategy,
    interventions: interventions.map(i => i.type),
    interventionsDetailed: interventions,
    challenges: [challenge],
    challengeActive: challenge,
    stories: stories,
    storyActive: stories[0],
    celebrations: achievements,
    burnoutDiagnostic: burnout,
    architectMoment: moments.detected ? moments.evidence : null,
    architectMomentDetails: moments,
    maturity: maturity,
    narrative: narrative,
    misconceptionsDetected: misconceptions,
    stateUsed: activeState
  };
}
