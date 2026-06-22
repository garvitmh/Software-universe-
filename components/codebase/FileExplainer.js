/**
 * FileExplainer.js
 * 
 * Pedagogical explanation engine for individual code components.
 * Explains WHY files exist, their architectural responsibilities, mental models, 
 * dependencies, tradeoffs, failure consequences, scaling progression, and 
 * real-world analogies.
 * 
 * Adapts explanation depth depending on the user's current Learning Level 
 * (Beginner, Intermediate, Senior, Architect).
 * 
 * Pure functions only. Runs safely in both Node and browser environments.
 */

// Analytical mock mapping database of file explanations in Burger Farm
export const FILE_EXPLANATIONS_DB = {
  "OrderService": {
    file: "apps/backend/src/services/order.service.ts",
    role: "Service",
    layer: "Application",
    domain: "Orders",
    analogy: "Restaurant Manager",
    mentalModel: "A Restaurant Manager coordinating work between the kitchen staff (workers), the reception desk (controllers), and the storage warehouse (repositories).",
    whyExists: "Coordinates business transactions related to burger checkouts, locking tables, and orchestrating stripe calls. Exists to prevent controllers from bloating into gigantic 'God objects' holding business rules.",
    responsibilities: [
      "Coordinates checkouts with Stripe payments",
      "Locks database rows in OrderRepository to protect inventory counts",
      "Publishes OrderCreatedEvent to queues for async dispatching"
    ],
    tradeoffs: {
      pros: ["High testability of core logic", "Strict separation of HTTP parsing and business routines", "Reusable across admin and mobile API routes"],
      cons: ["Adds layer of abstraction", "Increases file count and import statement counts"]
    },
    failureModes: {
      consequenceIfDisappeared: "All burger orders fail. Controllers don't know how to validate baskets or process charges.",
      severity: "CRITICAL",
      blastRadius: 90,
      affectedFlows: ["Order Placement Path", "Rider Delivery Route Chain"]
    },
    scalingStory: {
      tenUsers: "Sends direct SMTP email/SMS synchronously within the HTTP execution thread.",
      hundredKUsers: "Offloads notification dispatches to BullMQ redis buffers and background workers.",
      oneMillionUsers: "Publishes transaction logs to partitioned Apache Kafka topics consumed by microservice analytics."
    },
    evolutionStory: [
      "Stage 1: Direct SQL transactions on single postgres instance",
      "Stage 2: Event emitters offloading background processing to Redis queues",
      "Stage 3: Sharded database queries and distributed event brokers"
    ],
    analogies: {
      Beginner: "A chef manager who takes your order ticket, checks if ingredients are in the pantry, tells the cashier to charge you, and gives the kitchen the ticket.",
      Senior: "An orchestrator class that abstracts domain rules, coordinating transactional repositories, external payment gateways, and events.",
      Architect: "A transaction boundaries manager separating inbound REST presentations from infrastructure layers and message broker states."
    },
    questions: {
      commonMisconceptions: "Thinking services should handle direct Express HTTP request and response objects, which destroys reuse.",
      interviewQuestions: "How do you handle idempotency checks inside a checkout service block?",
      architectQuestions: "If the Payment Gateway goes down during checkout, how should the Service manage database transaction rollbacks?"
    }
  },
  "OrderController": {
    file: "apps/backend/src/controllers/order.controller.ts",
    role: "Controller",
    layer: "Presentation",
    domain: "Orders",
    analogy: "Receptionist",
    mentalModel: "A Receptionist greeting clients at the door, verifying their credentials, and routing them to the correct service manager.",
    whyExists: "Translates HTTP protocols (JSON request bodies, URL params, headers) into clean inputs for services, returning appropriate status codes (201 Created, 400 Bad Request).",
    responsibilities: [
      "Parses order parameters from incoming requests",
      "Invokes OrderService business pipelines",
      "Formats output payloads and status headers"
    ],
    tradeoffs: {
      pros: ["Standardized entry boundaries", "Decouples network endpoints from logic"],
      cons: ["Boilerplate routing declarations"]
    },
    failureModes: {
      consequenceIfDisappeared: "HTTP orders cannot reach the backend. Express throws route-not-found errors.",
      severity: "CRITICAL",
      blastRadius: 85,
      affectedFlows: ["Order Placement Path"]
    },
    scalingStory: {
      tenUsers: "Sync validation in-thread.",
      hundredKUsers: "Offloads requests to API Gateways, applying rate limit counters.",
      oneMillionUsers: "Distributed controller endpoints horizontally scaled behind load balancers."
    },
    evolutionStory: [
      "Stage 1: Simple route handler file",
      "Stage 2: Standardized controllers with request verification middleware",
      "Stage 3: Auto-generated RPC/GraphQL endpoints"
    ],
    analogies: {
      Beginner: "The receptionist at a hotel who checks your booking information and points you to your room.",
      Senior: "The endpoint adapter in a hexagonal architecture mapping HTTP ports to Application Core ports.",
      Architect: "An ingress handler managing payload validation schemas, CORS permissions, and gateway routing."
    },
    questions: {
      commonMisconceptions: "Writing raw database query commands inside controller callbacks.",
      interviewQuestions: "What is the difference between path parameters and query parameters in Express routing?",
      architectQuestions: "How do you implement distributed rate limiting at the controller layer?"
    }
  },
  "OrderRepository": {
    file: "apps/backend/src/repositories/order.repository.ts",
    role: "Repository",
    layer: "Infrastructure",
    domain: "Orders",
    analogy: "Warehouse Clerk",
    mentalModel: "A Warehouse Clerk writing data in folders and retrieving old files from filing cabinets (Database tables).",
    whyExists: "Abstracts the database ORM (Prisma/SQL queries). If we switch database engines (e.g. Postgres to MongoDB), we only modify the repository, not the services.",
    responsibilities: [
      "Queries order transactions by ID",
      "Inserts and updates rows in PostgreSQL tables via Prisma client",
      "Manages query optimizations and database indices"
    ],
    tradeoffs: {
      pros: ["Decouples database models from business routines", "Eases unit testing via repository mocking"],
      cons: ["Adds extra file abstraction layers for simple SQL queries"]
    },
    failureModes: {
      consequenceIfDisappeared: "No order information can be saved or loaded. PostgreSQL tables become unreachable.",
      severity: "CRITICAL",
      blastRadius: 80,
      affectedFlows: ["Order Placement Path", "Refund Settlement Path"]
    },
    scalingStory: {
      tenUsers: "Direct raw connections to local Postgres instance.",
      hundredKUsers: "Connection pooling enabled, redirecting read requests to replicas.",
      oneMillionUsers: "Partitioned tables and sharded database keys distributed geographically."
    },
    evolutionStory: [
      "Stage 1: Inline SQL string queries",
      "Stage 2: Prisma ORM object queries",
      "Stage 3: Repository classes utilizing replicas and local Redis cache layers"
    ],
    analogies: {
      Beginner: "A store clerk who walks to the backroom storage shelf, grabs the item you requested, and puts it in the database cabinet.",
      Senior: "An adapter implementation mapping core Domain repository definitions to Postgres Prisma targets.",
      Architect: "A data access layer decoupling entities from database persistence frameworks, managing pools and write-concurrency limits."
    },
    questions: {
      commonMisconceptions: "Injecting validation or formatting routines inside repository data retrievers.",
      interviewQuestions: "How does the Repository Pattern simplify switching from relational to NoSQL databases?",
      architectQuestions: "How do you handle transactional rollback limits across multiple repositories without exposing Prisma clients to services?"
    }
  }
};

// Core fallback template for unknown files
const FALLBACK_EXPLANATION = {
  file: "",
  role: "Utility",
  layer: "Infrastructure",
  domain: "General",
  analogy: "Swiss Army Knife",
  mentalModel: "A Swiss Army Knife in your tool belt containing multiple small helper tools.",
  whyExists: "Exists as a utility file to support general helper functions and modular abstractions across the codebase.",
  responsibilities: ["Performs helper checks", "Provides reusable functions"],
  tradeoffs: {
    pros: ["Reduces duplication"],
    cons: ["Increases overall codebase size"]
  },
  failureModes: {
    consequenceIfDisappeared: "Minor helper utility crashes; some UI formats revert to default text representations.",
    severity: "LOW",
    blastRadius: 5,
    affectedFlows: []
  },
  scalingStory: {
    tenUsers: "Processes formats in memory.",
    hundredKUsers: "Optimized using lightweight helper bundles.",
    oneMillionUsers: "Distributed via CDN or static bundles."
  },
  evolutionStory: ["Stage 1: Inline helpers", "Stage 2: Reusable utility module"],
  analogies: {
    Beginner: "A tool belt helper.",
    Senior: "A stateless helper namespace.",
    Architect: "A shared kernel library package."
  },
  questions: {
    commonMisconceptions: "Importing stateful logic inside stateless utility helpers.",
    interviewQuestions: "Why are stateless pure utilities easier to test?",
    architectQuestions: "How do you distribute utility helpers across multiple monorepo packages safely?"
  }
};

/**
 * Explains why a file exists, its dependencies, used by, and tradeoffs.
 * 
 * @param {string} fileName - Base name of file (e.g. 'OrderService')
 * @param {string} learningLevel - Level (Beginner, Intermediate, Senior, Architect)
 * @returns {Object} Explanation structure
 */
export function explainFile(fileName, learningLevel = "Beginner") {
  const cleanName = fileName.replace(".ts", "").replace(".js", "").replace(".dart", "");
  const match = FILE_EXPLANATIONS_DB[cleanName] || { ...FALLBACK_EXPLANATION, file: fileName };

  const selectedAnalogy = match.analogies[learningLevel] || match.analogies.Beginner;

  return {
    ...match,
    learningLevel,
    explanation: selectedAnalogy,
    whyExists: match.whyExists,
    responsibilities: match.responsibilities,
    tradeoffs: match.tradeoffs,
    failureModes: match.failureModes,
    scaleEvolution: [
      match.scalingStory.tenUsers,
      match.scalingStory.hundredKUsers,
      match.scalingStory.oneMillionUsers
    ]
  };
}

/**
 * Explains purpose.
 * @param {string} fileName 
 * @returns {string} Purpose explanation
 */
export function explainPurpose(fileName) {
  return explainFile(fileName).whyExists;
}

/**
 * Maps outgoing dependencies.
 * @param {string} fileName 
 * @returns {string[]} Dependencies explanations
 */
export function explainDependencies(fileName) {
  const match = explainFile(fileName);
  return match.responsibilities || [];
}

/**
 * Identifies direct upstream calls and impact implications.
 * @param {string} fileName 
 * @returns {string} Consumers description
 */
export function explainConsumers(fileName) {
  const match = explainFile(fileName);
  return `Used by other system controllers and services to coordinate ${match.domain} activities.`;
}

/**
 * Details tradeoffs.
 * @param {string} fileName 
 * @returns {Object} Tradeoff maps
 */
export function explainTradeoffs(fileName) {
  return explainFile(fileName).tradeoffs;
}

/**
 * Details crash consequences.
 * @param {string} fileName 
 * @returns {Object} Failure modes
 */
export function explainFailureModes(fileName) {
  return explainFile(fileName).failureModes;
}

/**
 * Details growth paths.
 * @param {string} fileName 
 * @returns {Object} Scale stories
 */
export function explainScalingStory(fileName) {
  const match = explainFile(fileName);
  return {
    tenUsers: match.scaleEvolution[0],
    hundredKUsers: match.scaleEvolution[1],
    oneMillionUsers: match.scaleEvolution[2]
  };
}

/**
 * Generates analogies.
 * @param {string} fileName 
 * @returns {Object} Analogies for Beginner, Senior, Architect
 */
export function generateAnalogies(fileName) {
  const match = explainFile(fileName);
  const cleanName = fileName.replace(".ts", "").replace(".js", "").replace(".dart", "");
  const dbMatch = FILE_EXPLANATIONS_DB[cleanName];
  return dbMatch ? dbMatch.analogies : { Beginner: "Swiss Army Knife", Senior: "Helper library", Architect: "Shared Kernel" };
}

/**
 * Generates questions.
 * @param {string} fileName 
 * @returns {Object} Misconceptions and questions
 */
export function generateQuestions(fileName) {
  const cleanName = fileName.replace(".ts", "").replace(".js", "").replace(".dart", "");
  const dbMatch = FILE_EXPLANATIONS_DB[cleanName];
  return dbMatch ? dbMatch.questions : { commonMisconceptions: "None", interviewQuestions: "None", architectQuestions: "None" };
}

/**
 * Details optimization stages.
 * @param {string} fileName 
 * @returns {string[]} Evolution stages
 */
export function generateEvolutionStory(fileName) {
  const cleanName = fileName.replace(".ts", "").replace(".js", "").replace(".dart", "");
  const dbMatch = FILE_EXPLANATIONS_DB[cleanName];
  return dbMatch ? dbMatch.evolutionStory : ["Stage 1: Simple helper", "Stage 2: Reusable helper"];
}
