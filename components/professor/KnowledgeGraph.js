/**
 * KnowledgeGraph.js
 * 
 * Defines the nodes, relationships, and graph traversal algorithms 
 * representing the Software Universe educational curriculum.
 * 
 * Nodes capture prerequisites, unlocks, non-hierarchical links, misconceptions,
 * tradeoffs, real-world examples, and category attributes.
 */

export const KNOWLEDGE_GRAPH = {
  security: {
    id: "security",
    name: "JWT Revocation & Token Buckets",
    category: "security",
    masteryImportance: 9,
    prerequisites: [],
    enables: ["payment"],
    relatedConcepts: ["order", "loyalty"],
    alternatives: ["Stateful session IDs", "Short-lived JWTs (e.g. 5m)"],
    failureConcepts: ["Token theft window", "Brute-force password checks"],
    scaleConcepts: ["Redis JWT Blacklist check", "API Gateway rate-limiting"],
    misconceptions: [
      {
        misconception: "JWT stores data securely",
        reality: "JWT only signs data; it is base64 encoded and readable by anyone unless explicitly encrypted (JWE)."
      }
    ],
    tradeoffs: [
      {
        concept: "JWT Blacklisting",
        pros: "Enables immediate token invalidation during compromise or logout.",
        cons: "Requires querying Redis, sacrificing 100% statelessness."
      }
    ],
    giantExamples: [
      {
        company: "Auth0 & Netflix",
        detail: "Use stateless JWTs for API access but maintain distributed Redis cache blacklists to immediately invalidate tokens during security incidents."
      }
    ],
    metrics: {
      popularity: 95,
      difficulty: 60,
      importance: 90
    }
  },

  payment: {
    id: "payment",
    name: "Idempotency Keys & Webhook Security",
    category: "payments",
    masteryImportance: 10,
    prerequisites: ["security"],
    enables: ["order", "loyalty"],
    relatedConcepts: ["security", "order"],
    alternatives: ["Client-side disable-button", "Database unique constraints"],
    failureConcepts: ["Double-billing", "Spoofed webhook payment receipts"],
    scaleConcepts: ["Redis idempotency locks", "Webhook CDN signature caching"],
    misconceptions: [
      {
        misconception: "Disable-button prevents double charge",
        reality: "It does not protect against network retry loops, tab reloads, or direct API requests."
      }
    ],
    tradeoffs: [
      {
        concept: "Idempotency Keys",
        pros: "Ensures payment is processed exactly once, avoiding duplicate charges.",
        cons: "Requires managing distributed locks and caching response payloads."
      }
    ],
    giantExamples: [
      {
        company: "Stripe & Adyen",
        detail: "Mandate idempotency keys on all post requests. If a request is retried, the exact same response is returned from the cache."
      }
    ],
    metrics: {
      popularity: 90,
      difficulty: 70,
      importance: 95
    }
  },

  order: {
    id: "order",
    name: "State Machines & Audit Logs",
    category: "orders",
    masteryImportance: 9,
    prerequisites: ["payment"],
    enables: ["loyalty", "pos", "analytics"],
    relatedConcepts: ["payment", "loyalty"],
    alternatives: ["Mutable status column", "Event sourcing"],
    failureConcepts: ["Double-update race conditions", "Lost audit history"],
    scaleConcepts: ["Redis buffer queues", "Asynchronous worker pools"],
    misconceptions: [
      {
        misconception: "Status columns are enough",
        reality: "Simple status columns destroy history and auditability. You cannot tell who canceled or when without state transition logs."
      }
    ],
    tradeoffs: [
      {
        concept: "Pessimistic Row Locks",
        pros: "Guarantees no race conditions between concurrent status updates.",
        cons: "Blocks concurrent write requests, potentially bottlenecking throughput."
      }
    ],
    giantExamples: [
      {
        company: "Uber & Swiggy",
        detail: "Use state machine transitions and distributed event logs (like Apache Kafka) to coordinate driver dispatch and order status changes."
      }
    ],
    metrics: {
      popularity: 88,
      difficulty: 65,
      importance: 92
    }
  },

  loyalty: {
    id: "loyalty",
    name: "Append-Only Ledgers & Optimistic Versioning",
    category: "loyalty",
    masteryImportance: 8,
    prerequisites: ["order"],
    enables: ["analytics"],
    relatedConcepts: ["order", "payment"],
    alternatives: ["Mutable balance field", "Pessimistic DB lock"],
    failureConcepts: ["Loyalty points double-spend", "Balance drift"],
    scaleConcepts: ["Balance caching in Redis", "Ledger partitioning"],
    misconceptions: [
      {
        misconception: "Balances should be updated directly",
        reality: "Direct balance updates violate audit compliance. Use append-only ledgers where balances are derived by summing records."
      }
    ],
    tradeoffs: [
      {
        concept: "Optimistic locking",
        pros: "Very low database lock overhead, handling concurrent read-writes efficiently.",
        cons: "Failed writes due to version mismatches must be caught and retried by the client."
      }
    ],
    giantExamples: [
      {
        company: "Retail Banks & Credit Networks",
        detail: "Enforce strict append-only transactional ledgers. A transaction row is never modified; adjustments are written as compensating transactions."
      }
    ],
    metrics: {
      popularity: 80,
      difficulty: 75,
      importance: 88
    }
  },

  pos: {
    id: "pos",
    name: "Asynchronous Print Queues & Retries",
    category: "queues",
    masteryImportance: 8,
    prerequisites: ["order"],
    enables: [],
    relatedConcepts: ["order", "payment"],
    alternatives: ["Direct TCP print call", "Local file buffering"],
    failureConcepts: ["Printer jams stalling checkout", "Lost kitchen tickets"],
    scaleConcepts: ["BullMQ asynchronous print queues", "Local LAN offline workers"],
    misconceptions: [
      {
        misconception: "Synchronous print calls are safe",
        reality: "Offline hardware, network delays, or printer jams will block the checkout transaction thread if done synchronously."
      }
    ],
    tradeoffs: [
      {
        concept: "Asynchronous Queueing",
        pros: "Decouples transaction processing from printing hardware, keeping checkouts functional.",
        cons: "Requires background worker processes and introduces slight ticket printing delays."
      }
    ],
    giantExamples: [
      {
        company: "McDonald's & Starbucks",
        detail: "Run local area network (LAN) print queues at store level to buffer kitchen orders during wide-area network (WAN) cloud outages."
      }
    ],
    metrics: {
      popularity: 82,
      difficulty: 58,
      importance: 85
    }
  },

  delivery: {
    id: "delivery",
    name: "Geofencing & Serviceability",
    category: "delivery",
    masteryImportance: 8,
    prerequisites: [],
    enables: ["analytics"],
    relatedConcepts: ["analytics"],
    alternatives: ["Postcode lookup", "Direct radius circles"],
    failureConcepts: ["Store routing to distant stores", "Cold food deliveries"],
    scaleConcepts: ["PostGIS SP-GiST indexes", "Hexagonal H3 spatial grids"],
    misconceptions: [
      {
        misconception: "Straight line distance is accurate",
        reality: "Straight line checks ignore road networks and physical barriers (rivers, highways) that isolate locations."
      }
    ],
    tradeoffs: [
      {
        concept: "Polygon geofencing",
        pros: "Highly accurate boundaries matching real streets and barriers.",
        cons: "Requires computationally expensive coordinate polygon checking (ray-casting)."
      }
    ],
    giantExamples: [
      {
        company: "DoorDash & UberEats",
        detail: "Use spatial databases (like PostGIS) and hexagonal indexing grids (like Uber H3) to dynamically define pricing zones and service areas."
      }
    ],
    metrics: {
      popularity: 85,
      difficulty: 72,
      importance: 87
    }
  },

  analytics: {
    id: "analytics",
    name: "OLTP vs OLAP Isolations",
    category: "analytics",
    masteryImportance: 9,
    prerequisites: ["order", "loyalty", "delivery"],
    enables: [],
    relatedConcepts: ["loyalty", "delivery"],
    alternatives: ["Single Database Instance", "NoSQL Database"],
    failureConcepts: ["Analytics queries locking transaction tables", "Timeout checkouts"],
    scaleConcepts: ["Read replicas", "Change Data Capture (CDC) streaming to BigQuery"],
    misconceptions: [
      {
        misconception: "Dashboards can run on primary DB",
        reality: "Running large aggregates on production OLTP tables locks rows and exhausts connection pools, causing checkout failures."
      }
    ],
    tradeoffs: [
      {
        concept: "Read Replicas",
        pros: "Completely offloads expensive reporting queries from the transaction database.",
        cons: "Replication lag introduces eventual consistency (reports may be slightly out of date)."
      }
    ],
    giantExamples: [
      {
        company: "Amazon & Netflix",
        detail: "Enforce strict separation. Transaction databases write to OLTP stores, which continuously stream logs (using Debezium CDC) to OLAP warehouses."
      }
    ],
    metrics: {
      popularity: 92,
      difficulty: 68,
      importance: 94
    }
  }
};

/**
 * Returns the concept node by ID.
 * @param {string} id 
 * @returns {Object|null} Node details
 */
export function getConcept(id) {
  return KNOWLEDGE_GRAPH[id] || null;
}

/**
 * Returns the list of prerequisite node IDs.
 * @param {string} id 
 * @returns {string[]} Prerequisite IDs
 */
export function getPrerequisites(id) {
  const concept = getConcept(id);
  return concept ? concept.prerequisites : [];
}

/**
 * Returns the list of concept IDs enabled/unlocked by this concept.
 * @param {string} id 
 * @returns {string[]} Enabled concept IDs
 */
export function getUnlocks(id) {
  const concept = getConcept(id);
  return concept ? concept.enables : [];
}

/**
 * Returns non-hierarchical related concept IDs.
 * @param {string} id 
 * @returns {string[]} Related concept IDs
 */
export function getRelatedConcepts(id) {
  const concept = getConcept(id);
  return concept ? concept.relatedConcepts : [];
}

/**
 * Identifies adjacent concepts (prerequisites, enables, related) where mastery is below 40.
 * @param {Object} conceptMastery - Maps conceptId -> { mastery, ... }
 * @param {string} id - The center concept node ID
 * @returns {string[]} Adjacent concept IDs with weak mastery
 */
export function getWeakNeighborhood(conceptMastery = {}, id) {
  const concept = getConcept(id);
  if (!concept) return [];

  const neighbors = new Set([
    ...concept.prerequisites,
    ...concept.enables,
    ...concept.relatedConcepts
  ]);

  return Array.from(neighbors).filter(neighborId => {
    const state = conceptMastery[neighborId];
    // Weak if mastery is below 40 (or not seen yet)
    return !state || state.mastery < 40;
  });
}

/**
 * Performs a topological sort of prerequisites to return the learning path to a goal concept.
 * @param {string} goalId - Target concept ID
 * @param {Object} graph - The graph definition (defaults to KNOWLEDGE_GRAPH)
 * @returns {string[]} Topologically sorted list of concept IDs
 */
export function getLearningPath(goalId, graph = KNOWLEDGE_GRAPH) {
  const path = [];
  const visited = new Set();
  const temp = new Set();

  function visit(id) {
    if (temp.has(id)) {
      throw new Error(`Cycle detected in KnowledgeGraph! Core cycle: ${id}`);
    }
    if (!visited.has(id)) {
      temp.add(id);
      const node = graph[id];
      if (node && node.prerequisites) {
        node.prerequisites.forEach(prereqId => {
          if (graph[prereqId]) {
            visit(prereqId);
          }
        });
      }
      temp.delete(id);
      visited.add(id);
      path.push(id);
    }
  }

  if (graph[goalId]) {
    visit(goalId);
  }
  return path;
}
