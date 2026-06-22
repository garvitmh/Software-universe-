/**
 * QuestionGenerator.js
 * 
 * Generates the next question for a learner based on their current state,
 * mastery scores, curriculum graph relationships, and active concept.
 * 
 * Implements recovery mode, confidence calibration, weak neighborhood,
 * follow-up chains, and history filtering.
 * 
 * Pure functions only.
 */

import { CONCEPT_SCHEMA } from "./ConceptSchema.js";

// Advanced questions database (Staff, Architect, Misconceptions, Curiosity)
export const ADVANCED_QUESTIONS = {
  security: {
    Staff: {
      id: "security_staff",
      concept: "security",
      difficulty: "Staff",
      text: "How do you coordinate public key rotations for stateless JWT verification across multiple independent microservices?",
      options: [
        "Use a JSON Web Key Set (JWKS) endpoint, caching public keys locally and updating them on validation failures.",
        "Query the central identity database synchronously on every incoming API request.",
        "Transmit the private signing key in the authorization header so services can dynamically verify claims.",
        "Hardcode the public verification keys directly in each service's deployment configuration."
      ],
      answerIdx: 0,
      explanation: "JWKS (RFC 7517) enables identity providers to publish public keys dynamically. Microservices cache these keys and pull updates on rotation, avoiding redeployments."
    },
    Architect: {
      id: "security_architect",
      concept: "security",
      difficulty: "Architect",
      text: "Design a JWT access token validation system that remains highly available even if the central identity provider suffers a 4-hour database outage.",
      options: [
        "Cache public verification keys locally with long TTLs in microservices and verify signatures stateless. Only reject if signature check fails.",
        "Buffer authentication requests in a Redis queue and process them after the identity provider recovers.",
        "Disable signature checks for requests during the outage to maintain service availability.",
        "Store all active JWTs in the identity provider database and run synchronous validation checks."
      ],
      answerIdx: 0,
      explanation: "Because JWT verification is stateless, as long as the service has the public signing keys cached, it can independently verify signatures without contacting the identity provider."
    },
    Misconception: {
      id: "security_misconception",
      concept: "security",
      difficulty: "Intermediate",
      text: "True or False: A stateless JSON Web Token (JWT) encrypts user data, keeping it secret from the client browser.",
      options: [
        "True: JWT payloads are fully encrypted and cannot be decoded by users.",
        "False: JWTs are only signed to prevent tampering. Payloads are base64Url-encoded and can be read by anyone."
      ],
      answerIdx: 1,
      explanation: "Standard JWTs (JWS) only sign the payload to guarantee integrity. Claims can be read by anyone who decodes the base64Url string. Use JWE for encryption."
    },
    Curiosity: {
      id: "security_curiosity",
      concept: "security",
      difficulty: "Beginner",
      text: "Did you know? Auth0 and Netflix handle millions of JWT validations per second. They verify tokens statelessly using public keys and check a distributed Redis revocation blacklist only when a token is suspected of compromise.",
      options: ["That's fascinating! Let's continue.", "Makes sense. Show me how to build this."],
      answerIdx: 0,
      explanation: "Statelessness handles 99% of requests, while a tiny, low-latency blacklist cache protects against token compromise."
    }
  },

  payment: {
    Staff: {
      id: "payment_staff",
      concept: "payment",
      difficulty: "Staff",
      text: "How do you coordinate idempotency key checks when multiple client retries arrive at different application nodes at the exact same millisecond?",
      options: [
        "Use Redis SETNX or Redlock to acquire an atomic distributed lock on the idempotency key.",
        "Query the primary relational database using read-committed transaction isolation.",
        "Let all threads execute and filter duplicates at the database primary key level.",
        "Rely on client-side debounce triggers to prevent concurrent requests."
      ],
      answerIdx: 0,
      explanation: "Redis lookup is extremely fast (<2ms) and SETNX allows atomic lock acquisition, protecting the relational database from double-writes."
    },
    Architect: {
      id: "payment_architect",
      concept: "payment",
      difficulty: "Architect",
      text: "Stripe handles idempotency keys by caching both the lock and the response payload. If the database crashes mid-transaction but Stripe payment succeeds, how do you recover?",
      options: [
        "Implement a transactional outbox and daily ledger reconciliation matching database entries against Stripe bank deposits.",
        "Automatically trigger a refund on the gateway if DB write fails.",
        "Let the customer retry, generating a new idempotency key.",
        "Manually review the Stripe logs and write sql inserts."
      ],
      answerIdx: 0,
      explanation: "A transactional outbox coupled with automated daily ledger reconciliation ensures that payments and orders eventually match, resolving inconsistencies safely."
    },
    Misconception: {
      id: "payment_misconception",
      concept: "payment",
      difficulty: "Intermediate",
      text: "True or False: A client-side submit button disable trigger is sufficient protection against duplicate charges.",
      options: [
        "True: It prevents double clicks.",
        "False: It is easily bypassed by network delays, browser page refreshes, or programmatic API requests."
      ],
      answerIdx: 1,
      explanation: "Client-side debouncing is a UX helper, not a security guarantee. Any API client can bypass it and fire duplicate requests directly."
    },
    Curiosity: {
      id: "payment_curiosity",
      concept: "payment",
      difficulty: "Beginner",
      text: "Did you know? Amazon uses idempotency keys on every transaction. If a network drops during checkout, your app automatically retries using the same key, ensuring you are never double-charged.",
      options: ["Fascinating!", "Let's build it."],
      answerIdx: 0,
      explanation: "Idempotency keys decouple network failures from checkout transactions, preventing duplicate charges."
    }
  },

  order: {
    Staff: {
      id: "order_staff",
      concept: "order",
      difficulty: "Staff",
      text: "How do you handle a scenario where an order's status transition requires multiple external API calls (e.g. charging card, print receipt) that could partially fail?",
      options: [
        "Wrap transitions in a saga orchestrator or transactional outbox pattern to guarantee eventual consistency.",
        "Run all API calls in a single Postgres transaction block.",
        "Let the client send individual API requests for each state change.",
        "Never perform external API calls during state transitions."
      ],
      answerIdx: 0,
      explanation: "Using sagas or outboxes guarantees that even if individual microservices fail or network drops occur, the order state eventually converges safely."
    },
    Architect: {
      id: "order_architect",
      concept: "order",
      difficulty: "Architect",
      text: "At 100k requests/sec, how do you handle state machine row locks on a hot store's active order count without exhausting DB connections?",
      options: [
        "Shub/Partition order status writes, buffer updates in Redis, and batch write using worker queues.",
        "Increase DB pool size to 10,000 connections.",
        "Remove row locks and handle double-accept conflicts programmatically.",
        "Move order state verification to client-side localStorage."
      ],
      answerIdx: 0,
      explanation: "Decoupling checkouts from database writes using message buffers is the only way to protect database transaction slots at high scale."
    },
    Misconception: {
      id: "order_misconception",
      concept: "order",
      difficulty: "Intermediate",
      text: "True or False: A simple database status update query (UPDATE orders SET status = 'CANCELLED') is safe for tracking order history.",
      options: [
        "True: It changes the state directly in the database.",
        "False: It overwrites the historical state changes, making it impossible to perform audit logs or track transition times."
      ],
      answerIdx: 1,
      explanation: "Updating status in place destroys the history of transitions, making compliance audit and latency reports impossible."
    },
    Curiosity: {
      id: "order_curiosity",
      concept: "order",
      difficulty: "Beginner",
      text: "Did you know? DoorDash coordinates millions of status updates using event-driven architectures. Every delivery progress state is published to Apache Kafka, enabling real-time dispatch calculations in under 200 milliseconds!",
      options: ["Fascinating!", "Tell me more."],
      answerIdx: 0,
      explanation: "Distributed streaming logs allow multiple downstream microservices to consume order states asynchronously."
    }
  },

  loyalty: {
    Staff: {
      id: "loyalty_staff",
      concept: "loyalty",
      difficulty: "Staff",
      text: "Why does optimistic concurrency versioning scale better than row-level pessimistic locking for high-volume loyalty point adjustments?",
      options: [
        "Optimistic version checks do not lock rows during read operations, allowing high read throughput, only checking version on commit.",
        "Pessimistic locking consumes more database disk space.",
        "Optimistic versioning encrypts the balance column automatically.",
        "Pessimistic row locks are not supported by Prisma."
      ],
      answerIdx: 0,
      explanation: "Optimistic locking assumes collisions are rare, avoiding expensive lock queues on reads. If a write conflicts, it simply fails and retries."
    },
    Architect: {
      id: "loyalty_architect",
      concept: "loyalty",
      difficulty: "Architect",
      text: "In an append-only ledger architecture, querying the current balance requires a SUM aggregate query. How do you scale reads for millions of users without overloading the database?",
      options: [
        "Cache current balances in Redis and update them in real-time, using the append-only database ledger as the single source of truth for periodic reconciliation.",
        "Partition the ledger table by day and sum only the current day's records.",
        "Move old transactions to a cold archival storage bucket.",
        "Run database index rebuilds every hour."
      ],
      answerIdx: 0,
      explanation: "DERIVING balances from ledger aggregates is correct, but caching them in a fast memory layer avoids expensive table scans."
    },
    Misconception: {
      id: "loyalty_misconception",
      concept: "loyalty",
      difficulty: "Intermediate",
      text: "True or False: Loyalty point databases should store the current balance in a mutable column (UPDATE users SET points = points + 10).",
      options: [
        "True: It keeps the table small and easy to query.",
        "False: It makes financial auditing impossible, leaving no record of how or when points were acquired or spent."
      ],
      answerIdx: 1,
      explanation: "Financial structures mandate ledger records. Balance columns must only represent cached derived projections, not the sole record."
    },
    Curiosity: {
      id: "loyalty_curiosity",
      concept: "loyalty",
      difficulty: "Beginner",
      text: "Did you know? Credit card networks and retail banks never delete or update rows. Correcting a mistake is written as a new offset transaction, preserving a perfect audit history.",
      options: ["Neat!", "Let's move on."],
      answerIdx: 0,
      explanation: "Append-only ledgers guarantee auditability and security in financial transactional ledger design."
    }
  },

  pos: {
    Staff: {
      id: "pos_staff",
      concept: "pos",
      difficulty: "Staff",
      text: "How do you handle printer network drops to ensure that receipt printing is both resilient and guarantees zero duplicate tickets?",
      options: [
        "Queue print jobs with unique job IDs in a persistent Redis queue (BullMQ), using backoff retry strategies and deduplicating on the printer receiver.",
        "Continuously stream print packets over TCP with zero wait limits.",
        "Display a printer error message and block customer checkouts until the printer reconnects.",
        "Write print logs directly to local files and print them manually."
      ],
      answerIdx: 0,
      explanation: "Persistent message queues allow retry backoffs, while UUID validation on the printing client ignores duplicate retry packets."
    },
    Architect: {
      id: "pos_architect",
      concept: "pos",
      difficulty: "Architect",
      text: "Design a restaurant POS print system that survives a complete wide-area network (WAN) internet outage while maintaining active checkouts and printing tickets on-site.",
      options: [
        "Deploy local gateway nodes at each store that buffer order packets locally and sync to local LAN printers, syncing to cloud once WAN is restored.",
        "Move all print logic to edge workers (e.g. Cloudflare) to ensure 99.99% availability.",
        "Configure printers to dial cellular networks directly for backup connection.",
        "Stop order checkouts during outages to avoid print discrepancies."
      ],
      answerIdx: 0,
      explanation: "Local LAN replication engines ensure store operations continue independently of global cloud server WAN status."
    },
    Misconception: {
      id: "pos_misconception",
      concept: "pos",
      difficulty: "Intermediate",
      text: "True or False: Checking POS printer connectivity inside the customer checkout request is standard practice.",
      options: [
        "True: It ensures the printer is online before charging the user.",
        "False: Slow printers, paper jams, or hardware dropouts will stall checkout request threads, causing payment failures."
      ],
      answerIdx: 1,
      explanation: "Never perform hardware checks inside synchronous HTTP write paths. Checkout success must be isolated from printer hardware state."
    },
    Curiosity: {
      id: "pos_curiosity",
      concept: "pos",
      difficulty: "Beginner",
      text: "Did you know? Starbucks stores can continue processing payments and printing labels for cups even if their internet goes completely offline, thanks to local LAN message queuing!",
      options: ["Awesome!", "Good to know."],
      answerIdx: 0,
      explanation: "Local queues buffer transaction prints locally during wide-area network disconnects."
    }
  },

  delivery: {
    Staff: {
      id: "delivery_staff",
      concept: "delivery",
      difficulty: "Staff",
      text: "What is the primary scaling limitation of running direct ray-casting polygon geofence checks in SQL on every store search?",
      options: [
        "It is computationally heavy (O(N*M)) on database CPU, requiring spatial indexing (e.g. PostGIS R-Tree SP-Trees) to avoid full table scans.",
        "Relational databases cannot calculate coordinates.",
        "PostGIS only supports rectangular geofences.",
        "It requires Google Maps API calls for every calculation."
      ],
      answerIdx: 0,
      explanation: "Geometry polygon checking requires floating-point coordinate math on every record, requiring spatial indices to locate candidates."
    },
    Architect: {
      id: "delivery_architect",
      concept: "delivery",
      difficulty: "Architect",
      text: "For a delivery service handling 1M active drivers, how do you solve the database bottleneck of matching drivers to orders in real-time?",
      options: [
        "Map locations to discrete hexagonal grid indices (e.g., Uber H3) and query drivers by matching hex rings, turning geometry calculations into fast key lookups.",
        "Run Haversine calculations in parallel using a large GPU compute cluster.",
        "Store driver locations in local memory on the customer app.",
        "Use WebSockets to broadcast all driver coordinates to all customers."
      ],
      answerIdx: 0,
      explanation: "Hexagonal grid coordinates compress latitude and longitude into 64-bit integer values, reducing math operations to index queries."
    },
    Misconception: {
      id: "delivery_misconception",
      concept: "delivery",
      difficulty: "Intermediate",
      text: "True or False: A straight line radius check (Haversine distance) is always accurate for serviceability checking.",
      options: [
        "True: It calculates the shortest physical distance between two points.",
        "False: It ignores geographical barriers like rivers, mountains, and highways with no connecting bridges."
      ],
      answerIdx: 1,
      explanation: "Radius circles ignore topological limits and routing road layouts, leading to impossible delivery routes."
    },
    Curiosity: {
      id: "delivery_curiosity",
      concept: "delivery",
      difficulty: "Beginner",
      text: "Did you know? Uber Eats divides the entire planet into hierarchical hexagons using the H3 grid system. Searching for restaurants is a simple grid-index key check, making search instant!",
      options: ["Cool!", "Explain deeper."],
      answerIdx: 0,
      explanation: "H3 hexagons have unique, hierarchically indexed string IDs, simplifying geo-searches."
    }
  },

  analytics: {
    Staff: {
      id: "analytics_staff",
      concept: "analytics",
      difficulty: "Staff",
      text: "What is the primary cause of connection pool exhaustion when analytics queries run on the primary transactional database?",
      options: [
        "Analytics queries scan millions of rows, holding connection slots open for long durations, starving fast checkout threads.",
        "Analytics databases do not support connection pooling.",
        "Relational databases limit analytical queries to 1 request per minute.",
        "Columnar indexes block incoming transactional write queries."
      ],
      answerIdx: 0,
      explanation: "OLAP queries run long scans, hogging database transaction threads. This starves fast checkouts (OLTP), causing connection pool exhaustions."
    },
    Architect: {
      id: "analytics_architect",
      concept: "analytics",
      difficulty: "Architect",
      text: "At petabyte scale, how do you sync transactions from OLTP databases to an OLAP columnar data warehouse in under 5 seconds without affecting write performance?",
      options: [
        "Enable Change Data Capture (CDC) to read database transaction logs asynchronously and stream them to the OLAP warehouse.",
        "Run a cron job that exports database tables to CSV and uploads them to the warehouse every minute.",
        "Set up database triggers that execute HTTP POST calls to the warehouse on every insert.",
        "Use read replicas to run raw SQL dump exports in real-time."
      ],
      answerIdx: 0,
      explanation: "CDC monitors database transaction logs (WAL) asynchronously, capturing edits without locking transaction slots or loading CPU."
    },
    Misconception: {
      id: "analytics_misconception",
      concept: "analytics",
      difficulty: "Intermediate",
      text: "True or False: Columnar databases (OLAP) are superior to relational databases (OLTP) for processing checkouts.",
      options: [
        "True: They can store much more data.",
        "False: Columnar databases are optimized for heavy reads and aggregates, but are extremely slow for row-level writes and transaction locks required for checkouts."
      ],
      answerIdx: 1,
      explanation: "OLAP columnar engines write in bulk and do not support low-latency row locks or ACID updates required for checkouts."
    },
    Curiosity: {
      id: "analytics_curiosity",
      concept: "analytics",
      difficulty: "Beginner",
      text: "Did you know? Netflix streams millions of log events to Amazon Redshift for analytics, using CDC (Change Data Capture) to process data without putting a single lock on their active checkout databases!",
      options: ["Awesome!", "Cool."],
      answerIdx: 0,
      explanation: "Change Data Capture (CDC) enables streaming database records asynchronously without impacting active write workloads."
    }
  }
};

/**
 * Main entry point: Generates the next question based on the learner's state,
 * mastery scores, curriculum graph, and current concept.
 * 
 * @param {Object} learner - Current learner state
 * @param {Object} mastery - Maps conceptId -> { mastery, confidence, streak, attempts, correctAnswers, lastSeen }
 * @param {Object} graph - KnowledgeGraph module
 * @param {Object} currentConcept - The active concept node from CONCEPT_SCHEMA
 * @returns {Object} Selected question payload
 */
export function generateNextQuestion(learner, mastery = {}, graph, currentConcept) {
  const conceptId = currentConcept.id;
  const currentConceptMastery = mastery[conceptId] || { mastery: 10, confidence: 30 };
  const correctlyAnswered = new Set(
    (learner.recentHistory || [])
      .filter(item => item.correct)
      .map(item => item.questionId)
  );

  // 1. RECOVERY MODE: If EXPLAIN_SIMPLER flag is active, return a recovery question
  if (learner.flags && learner.flags.includes("EXPLAIN_SIMPLER")) {
    return generateRecoveryQuestion(conceptId, currentConcept.questions, correctlyAnswered);
  }

  // 2. CONFIDENCE CALIBRATION
  // Underconfident: high mastery, low confidence -> Drop difficulty by 1 level
  if (currentConceptMastery.mastery > 70 && currentConceptMastery.confidence < 30) {
    const adjustedLevel = getDroppedLevel(learner.currentLevel);
    const question = selectByLevel(conceptId, currentConcept.questions, adjustedLevel, correctlyAnswered);
    if (question) {
      return {
        question,
        concept: conceptId,
        difficulty: question.difficulty,
        reason: "Confidence Calibration: Underconfident learner. Drop difficulty to rebuild confidence.",
        confidenceTarget: "low",
        recommendedFollowups: []
      };
    }
  }

  // Overconfident: low mastery, high confidence -> Inject misconception check
  if (currentConceptMastery.mastery < 40 && currentConceptMastery.confidence > 80) {
    const question = generateMisconceptionQuestion(conceptId);
    if (question && !correctlyAnswered.has(question.id)) {
      return {
        question,
        concept: conceptId,
        difficulty: question.difficulty,
        reason: "Confidence Calibration: Overconfident learner. Test with misconception query.",
        confidenceTarget: "high",
        recommendedFollowups: []
      };
    }
  }

  // 3. WEAK NEIGHBORHOOD CHECK: Identify weak adjacent concepts
  if (graph && graph.getWeakNeighborhood) {
    const weakNeighbors = graph.getWeakNeighborhood(mastery, conceptId);
    if (weakNeighbors.length > 0) {
      // Target the first weak neighbor
      const targetId = weakNeighbors[0];
      const targetConcept = CONCEPT_SCHEMA[targetId];
      if (targetConcept && targetConcept.questions) {
        // Find a question from the weak neighbor matching learner's level
        const question = selectByLevel(targetId, targetConcept.questions, learner.currentLevel, correctlyAnswered);
        if (question) {
          return {
            question,
            concept: targetId,
            difficulty: question.difficulty,
            reason: `Weak Neighborhood: Concept '${targetId}' is weak (<40% mastery). Cluster questions to build local strength.`,
            confidenceTarget: "neutral",
            recommendedFollowups: []
          };
        }
      }
    }
  }

  // 4. FOLLOW-UP CHAINS: If the last answer was correct, attempt to chain to next level
  const lastHistory = learner.recentHistory && learner.recentHistory[0];
  if (lastHistory && lastHistory.correct && lastHistory.concept === conceptId) {
    const question = generateFollowupQuestion(conceptId, currentConcept.questions, lastHistory.difficulty, correctlyAnswered);
    if (question) {
      return {
        question,
        concept: conceptId,
        difficulty: question.difficulty,
        reason: "Follow-up Chain: Evolving questions naturally after correct answer.",
        confidenceTarget: "neutral",
        recommendedFollowups: []
      };
    }
  }

  // 5. STANDARD SELECTION: Select by current level from active concept
  let question = selectByLevel(conceptId, currentConcept.questions, learner.currentLevel, correctlyAnswered);
  let reason = "Standard Adaptive Grill: Matching learner current difficulty level.";

  // If no question found at current level, search for any unanswered question in the active concept
  if (!question) {
    question = currentConcept.questions.find(q => !correctlyAnswered.has(q.id));
    reason = "Fallback Selection: Matching active concept's first unanswered question.";
  }

  // Ultimate Fallback: if all answered, repeat the first question in the concept
  if (!question) {
    question = currentConcept.questions[0];
    reason = "Loop Fallback: All questions correctly answered. Repeating baseline question.";
  }

  return {
    question,
    concept: conceptId,
    difficulty: question.difficulty,
    reason,
    confidenceTarget: "neutral",
    recommendedFollowups: []
  };
}

/**
 * Returns a recovery question (Beginner level, or curiosity card).
 */
export function generateRecoveryQuestion(conceptId, questions = [], correctlyAnswered = new Set()) {
  // Try to get a Beginner level question
  let question = questions.find(q => q.difficulty === "Beginner" && !correctlyAnswered.has(q.id));
  let reason = "Recovery Mode: Struggling learner. Presenting Beginner recall question.";

  if (!question) {
    // Inject a Curiosity question
    question = generateCuriosityQuestion(conceptId);
    reason = "Recovery Mode: Struggling learner. Injecting wonder-curiosity card.";
  }

  return {
    question,
    concept: conceptId,
    difficulty: question.difficulty,
    reason,
    confidenceTarget: "low",
    recommendedFollowups: []
  };
}

/**
 * Selects a challenge question (Staff or Architect level).
 */
export function generateChallengeQuestion(conceptId) {
  const adv = ADVANCED_QUESTIONS[conceptId];
  return adv ? adv.Architect : null;
}

/**
 * Returns a misconception query.
 */
export function generateMisconceptionQuestion(conceptId) {
  const adv = ADVANCED_QUESTIONS[conceptId];
  return adv ? adv.Misconception : null;
}

/**
 * Returns a curiosity query.
 */
export function generateCuriosityQuestion(conceptId) {
  const adv = ADVANCED_QUESTIONS[conceptId];
  return adv ? adv.Curiosity : null;
}

/**
 * Selects a follow-up question (next level of difficulty).
 */
export function generateFollowupQuestion(conceptId, questions = [], lastDifficulty, correctlyAnswered = new Set()) {
  const levelOrder = ["Beginner", "Intermediate", "Senior", "Staff", "Architect"];
  const lastIdx = levelOrder.indexOf(lastDifficulty);
  if (lastIdx === -1) return null;

  // Try to find a question at the next difficulty level
  for (let i = lastIdx + 1; i < levelOrder.length; i++) {
    const nextLevel = levelOrder[i];
    const question = selectByLevel(conceptId, questions, nextLevel, correctlyAnswered);
    if (question) return question;
  }
  return null;
}

// Helpers
function getDroppedLevel(level) {
  const levelOrder = ["Beginner", "Intermediate", "Senior", "Staff", "Architect"];
  const idx = levelOrder.indexOf(level);
  return levelOrder[Math.max(0, idx - 1)];
}

function selectByLevel(conceptId, questions = [], level, correctlyAnswered = new Set()) {
  // First check standard questions schema
  let question = questions.find(q => q.difficulty === level && !correctlyAnswered.has(q.id));
  
  // If not found in static schema, check advanced database
  if (!question) {
    const adv = ADVANCED_QUESTIONS[conceptId];
    if (adv && adv[level]) {
      const candidate = adv[level];
      if (!correctlyAnswered.has(candidate.id)) {
        question = candidate;
      }
    }
  }

  return question;
}
