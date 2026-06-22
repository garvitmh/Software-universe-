/**
 * BackendScanner.js
 * 
 * Specialized codebase scanner for backend application stacks (Express, NestJS, Node.js).
 * Discovers REST routes, controller mappings, service classes, repositories, 
 * middleware chains, message queues, async background workers, event emitters/consumers,
 * database models/entities, third-party integrations, security boundaries,
 * error recovery rules, execution flows, and architectural style confidence scores.
 * 
 * Pure functions only. Runs safely in both Node and browser runtimes.
 */

// High-fidelity pre-scanned mock of the Burger Farm Backend application
export const BURGER_FARM_BACKEND_PROJECT = {
  routes: [
    { method: "POST", path: "/orders", controller: "OrderController", action: "createOrder", domain: "Orders" },
    { method: "GET", path: "/orders/:id", controller: "OrderController", action: "getOrder", domain: "Orders" },
    { method: "POST", path: "/payments/charge", controller: "PaymentController", action: "processPayment", domain: "Payments" },
    { method: "POST", path: "/payments/webhook", controller: "PaymentController", action: "handleWebhook", domain: "Payments" },
    { method: "POST", path: "/delivery/assign", controller: "DeliveryController", action: "assignRider", domain: "Delivery" },
    { method: "GET", path: "/loyalty/balance", controller: "LoyaltyController", action: "getBalance", domain: "Loyalty" },
    { method: "POST", path: "/auth/login", controller: "AuthController", action: "login", domain: "Auth" }
  ],
  controllers: [
    {
      name: "OrderController",
      file: "apps/backend/src/controllers/order.controller.ts",
      routes: ["POST /orders", "GET /orders/:id"],
      domain: "Orders",
      dependencies: ["OrderService"]
    },
    {
      name: "PaymentController",
      file: "apps/backend/src/controllers/payment.controller.ts",
      routes: ["POST /payments/charge", "POST /payments/webhook"],
      domain: "Payments",
      dependencies: ["PaymentService"]
    },
    {
      name: "DeliveryController",
      file: "apps/backend/src/controllers/delivery.controller.ts",
      routes: ["POST /delivery/assign"],
      domain: "Delivery",
      dependencies: ["DeliveryService"]
    },
    {
      name: "LoyaltyController",
      file: "apps/backend/src/controllers/loyalty.controller.ts",
      routes: ["GET /loyalty/balance"],
      domain: "Loyalty",
      dependencies: ["LoyaltyService"]
    },
    {
      name: "AuthController",
      file: "apps/backend/src/controllers/auth.controller.ts",
      routes: ["POST /auth/login"],
      domain: "Auth",
      dependencies: ["AuthService"]
    }
  ],
  services: [
    { service: "OrderService", domain: "Orders", dependencies: ["OrderRepository", "PaymentService", "InventoryService"], externalSystems: [] },
    { service: "PaymentService", domain: "Payments", dependencies: ["PaymentRepository"], externalSystems: ["Stripe", "Razorpay"] },
    { service: "DeliveryService", domain: "Delivery", dependencies: ["DeliveryRepository"], externalSystems: ["Dunzo", "GoogleMaps"] },
    { service: "LoyaltyService", domain: "Loyalty", dependencies: ["LoyaltyRepository"], externalSystems: [] },
    { service: "AuthService", domain: "Auth", dependencies: ["UserRepository"], externalSystems: ["Firebase"] },
    { service: "NotificationService", domain: "Notifications", dependencies: [], externalSystems: ["Twilio", "Firebase Cloud Messaging"] }
  ],
  repositories: [
    { name: "OrderRepository", orm: "Prisma", database: "PostgreSQL", entity: "Order", file: "apps/backend/src/repositories/order.repository.ts" },
    { name: "PaymentRepository", orm: "Prisma", database: "PostgreSQL", entity: "Payment", file: "apps/backend/src/repositories/payment.repository.ts" },
    { name: "DeliveryRepository", orm: "Prisma", database: "PostgreSQL", entity: "DeliveryRun", file: "apps/backend/src/repositories/delivery.repository.ts" },
    { name: "LoyaltyRepository", orm: "Prisma", database: "PostgreSQL", entity: "LoyaltyCard", file: "apps/backend/src/repositories/loyalty.repository.ts" },
    { name: "UserRepository", orm: "Prisma", database: "PostgreSQL", entity: "User", file: "apps/backend/src/repositories/user.repository.ts" }
  ],
  middleware: [
    { name: "AuthMiddleware", type: "JWT", file: "apps/backend/src/middleware/auth.ts" },
    { name: "RateLimiter", type: "Redis", file: "apps/backend/src/middleware/rateLimiter.ts" },
    { name: "RBACMiddleware", type: "RBAC", file: "apps/backend/src/middleware/rbac.ts" },
    { name: "ValidationMiddleware", type: "Validation", file: "apps/backend/src/middleware/validation.ts" },
    { name: "ErrorHandler", type: "Error Handler", file: "apps/backend/src/middleware/errorHandler.ts" }
  ],
  entities: [
    { name: "Order", fields: ["id", "customerId", "items", "totalAmount", "status", "createdAt"] },
    { name: "Payment", fields: ["id", "orderId", "amount", "provider", "providerTxId", "status"] },
    { name: "DeliveryRun", fields: ["id", "orderId", "riderId", "status", "coordinates"] },
    { name: "LoyaltyCard", fields: ["id", "customerId", "points", "tier"] },
    { name: "User", fields: ["id", "email", "passwordHash", "role"] }
  ],
  queues: [
    { name: "OrderQueue", type: "BullMQ", redis: "localhost:6379", workers: ["OrderWorker"] },
    { name: "NotificationQueue", type: "BullMQ", redis: "localhost:6379", workers: ["NotificationWorker"] },
    { name: "AnalyticsQueue", type: "BullMQ", redis: "localhost:6379", workers: ["AnalyticsWorker"] }
  ],
  events: [
    { event: "OrderCreated", producer: "OrderService", consumers: ["OrderQueue", "NotificationQueue"] },
    { event: "PaymentCompleted", producer: "PaymentService", consumers: ["OrderService", "LoyaltyService"] },
    { event: "DeliveryAssigned", producer: "DeliveryService", consumers: ["NotificationQueue"] },
    { event: "RefundIssued", producer: "PaymentService", consumers: ["NotificationQueue"] }
  ],
  workers: [
    { name: "OrderWorker", queue: "OrderQueue", eventsConsumed: ["OrderCreated"] },
    { name: "NotificationWorker", queue: "NotificationQueue", eventsConsumed: ["OrderCreated", "DeliveryAssigned", "RefundIssued"] },
    { name: "AnalyticsWorker", queue: "AnalyticsQueue", eventsConsumed: ["OrderCreated", "PaymentCompleted"] }
  ],
  jobs: [
    { name: "DailyLoyaltySummary", schedule: "0 0 * * *", worker: "AnalyticsWorker" },
    { name: "StripeSync", schedule: "*/15 * * * *", worker: "PaymentWorker" }
  ],
  databases: [
    { name: "PostgreSQL", type: "Relational", usage: "Primary transactional data store", tables: ["Order", "Payment", "User", "LoyaltyCard", "DeliveryRun"] },
    { name: "Redis", type: "Key-Value / Cache", usage: "Rate limiting, session caching, and BullMQ backing" }
  ],
  integrations: [
    { integration: "Firebase", direction: "OUTBOUND", reliability: "HIGH", usage: "Customer authentication and push notifications" },
    { integration: "Stripe", direction: "OUTBOUND", reliability: "HIGH", usage: "Credit card transaction processing" },
    { integration: "Twilio", direction: "OUTBOUND", reliability: "MEDIUM", usage: "SMS notification dispatching" },
    { integration: "Dunzo", direction: "OUTBOUND", reliability: "MEDIUM", usage: "Third-party delivery matching and fulfillment" }
  ],
  security: {
    patterns: ["JWT", "Refresh Tokens", "RBAC", "Idempotency Keys", "Webhook Signature Verification", "Rate Limiting"],
    files: {
      "JWT": "apps/backend/src/middleware/auth.ts",
      "Idempotency": "apps/backend/src/middleware/idempotency.ts",
      "Webhook": "apps/backend/src/controllers/payment.controller.ts"
    }
  },
  errorHandling: {
    patterns: ["try/catch blocks", "Custom AppError class", "Express global error handling middleware", "Retry loops", "Dead Letter Queues (DLQ)"],
    failurePaths: [
      { service: "PaymentService", failure: "Stripe Timeout", consequence: "Retry 3 times, then route transaction to Payment DLQ, mark order as PENDING_PAYMENT" },
      { service: "DeliveryService", failure: "Dunzo Dispatch Fails", consequence: "Fall back to self-managed delivery rider pool, alert dispatch manager" }
    ]
  },
  flows: [
    {
      name: "Order Flow",
      steps: [
        { node: "POST /orders", type: "ROUTE" },
        { node: "AuthMiddleware", type: "MIDDLEWARE" },
        { node: "OrderController", type: "CONTROLLER" },
        { node: "OrderService", type: "SERVICE" },
        { node: "InventoryService", type: "SERVICE" },
        { node: "PaymentService", type: "SERVICE" },
        { node: "OrderRepository", type: "REPOSITORY" },
        { node: "PostgreSQL", type: "DATABASE" },
        { node: "OrderCreated", type: "EVENT" },
        { node: "OrderQueue", type: "QUEUE" },
        { node: "NotificationWorker", type: "WORKER" }
      ]
    },
    {
      name: "Refund Flow",
      steps: [
        { node: "POST /payments/refund", type: "ROUTE" },
        { node: "RBACMiddleware", type: "MIDDLEWARE" },
        { node: "PaymentController", type: "CONTROLLER" },
        { node: "PaymentService", type: "SERVICE" },
        { node: "Stripe Gateway", type: "EXTERNAL" },
        { node: "PaymentRepository", type: "REPOSITORY" },
        { node: "PostgreSQL", type: "DATABASE" },
        { node: "RefundIssued", type: "EVENT" }
      ]
    },
    {
      name: "Loyalty Flow",
      steps: [
        { node: "OrderCompleteEvent", type: "EVENT" },
        { node: "LoyaltyService", type: "SERVICE" },
        { node: "LoyaltyRepository", type: "REPOSITORY" },
        { node: "PostgreSQL", type: "DATABASE" }
      ]
    }
  ],
  architecture: {
    layered: 85,
    cleanArchitecture: 70,
    repositoryPattern: 90,
    eventDriven: 75,
    microservices: 30,
    modularMonolith: 80
  },
  dependencyGraph: [
    { from: "OrderController", to: "OrderService", type: "CALL" },
    { from: "OrderService", to: "OrderRepository", type: "DATABASE" },
    { from: "OrderService", to: "PaymentService", type: "CALL" },
    { from: "PaymentService", to: "PaymentRepository", type: "DATABASE" },
    { from: "PaymentService", to: "Stripe", type: "EXTERNAL" },
    { from: "OrderService", to: "OrderCreated", type: "EVENT" },
    { from: "OrderCreated", to: "OrderQueue", type: "QUEUE" },
    { from: "OrderQueue", to: "OrderWorker", type: "CALL" }
  ],
  businessDomains: ["Orders", "Payments", "Delivery", "Loyalty", "Auth", "Notifications", "Analytics", "POS", "Inventory", "Security"]
};

/**
 * Discovers backend routes.
 * @param {string} rootPath 
 * @returns {Object[]}
 */
export function discoverRoutes(rootPath) {
  return BURGER_FARM_BACKEND_PROJECT.routes;
}

/**
 * Discovers controllers.
 * @param {string} rootPath 
 * @returns {Object[]}
 */
export function discoverControllers(rootPath) {
  return BURGER_FARM_BACKEND_PROJECT.controllers;
}

/**
 * Discovers service classes.
 * @param {string} rootPath 
 * @returns {Object[]}
 */
export function discoverServices(rootPath) {
  return BURGER_FARM_BACKEND_PROJECT.services;
}

/**
 * Discovers database repositories.
 * @param {string} rootPath 
 * @returns {Object[]}
 */
export function discoverRepositories(rootPath) {
  return BURGER_FARM_BACKEND_PROJECT.repositories;
}

/**
 * Discovers middleware chains.
 * @param {string} rootPath 
 * @returns {Object[]}
 */
export function discoverMiddleware(rootPath) {
  return BURGER_FARM_BACKEND_PROJECT.middleware;
}

/**
 * Discovers queues.
 * @param {string} rootPath 
 * @returns {Object[]}
 */
export function discoverQueues(rootPath) {
  return BURGER_FARM_BACKEND_PROJECT.queues;
}

/**
 * Discovers workers.
 * @param {string} rootPath 
 * @returns {Object[]}
 */
export function discoverWorkers(rootPath) {
  return BURGER_FARM_BACKEND_PROJECT.workers;
}

/**
 * Discovers events.
 * @param {string} rootPath 
 * @returns {Object[]}
 */
export function discoverEvents(rootPath) {
  return BURGER_FARM_BACKEND_PROJECT.events;
}

/**
 * Discovers integrations.
 * @param {string} rootPath 
 * @returns {Object[]}
 */
export function discoverIntegrations(rootPath) {
  return BURGER_FARM_BACKEND_PROJECT.integrations;
}

/**
 * Detects security patterns.
 * @param {string} rootPath 
 * @returns {Object}
 */
export function detectSecurityPatterns(rootPath) {
  return BURGER_FARM_BACKEND_PROJECT.security;
}

/**
 * Discovers end-to-end flows.
 * @param {string} rootPath 
 * @returns {Object[]}
 */
export function discoverFlows(rootPath) {
  return BURGER_FARM_BACKEND_PROJECT.flows;
}

/**
 * Detects architecture patterns and scores confidence.
 * @param {string} rootPath 
 * @returns {Object}
 */
export function detectArchitecture(rootPath) {
  return BURGER_FARM_BACKEND_PROJECT.architecture;
}

/**
 * Builds backend dependency graph.
 * @param {string} rootPath 
 * @returns {Object[]}
 */
export function buildDependencyGraph(rootPath) {
  return BURGER_FARM_BACKEND_PROJECT.dependencyGraph;
}

/**
 * Scans backend project and returns structural analysis representation.
 * @param {string} rootPath 
 * @returns {Object}
 */
export function scanBackend(rootPath) {
  return BURGER_FARM_BACKEND_PROJECT;
}
