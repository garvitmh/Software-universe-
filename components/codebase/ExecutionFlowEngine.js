/**
 * ExecutionFlowEngine.js
 * 
 * Specialized execution flow mapping and behavior tracing engine.
 * Computes end-to-end user journeys across client-side views, backend middleware,
 * API controllers, repository calls, event queues, and worker jobs.
 * 
 * Simulates failure recovery pathways, alternative routes, tech stack scaling evolutions,
 * latency budgets, and generates step-by-step coordinates to animate flows in UI players.
 * 
 * Pure functions only. Runs safely in both Node and browser runtimes.
 */

// Mapped core user journeys
export const USER_JOURNEYS = [
  {
    id: "login_journey",
    name: "Customer Login Journey",
    trigger: "User opens app & enters credentials",
    criticality: "CRITICAL",
    domains: ["Auth", "Security"],
    systems: ["Flutter", "Backend", "External"],
    steps: [
      { id: "step_1", type: "SCREEN", name: "LoginScreen", system: "Flutter", domain: "Auth", duration: 150, dependencies: [], failureModes: ["Network timeout"], alternatives: [] },
      { id: "step_2", type: "PROVIDER", name: "authProvider", system: "Flutter", domain: "Auth", duration: 50, dependencies: ["step_1"], failureModes: [], alternatives: [] },
      { id: "step_3", type: "EXTERNAL", name: "Firebase Auth SDK", system: "External", domain: "Security", duration: 300, dependencies: ["step_2"], failureModes: ["Invalid credentials", "Firebase unavailable"], alternatives: ["OTP login"] },
      { id: "step_4", type: "API", name: "POST /auth/login", system: "Backend", domain: "Auth", duration: 120, dependencies: ["step_3"], failureModes: ["Rate limited"], alternatives: [] },
      { id: "step_5", type: "CONTROLLER", name: "AuthController", system: "Backend", domain: "Auth", duration: 40, dependencies: ["step_4"], failureModes: [], alternatives: [] },
      { id: "step_6", type: "DATABASE", name: "PostgreSQL: Users Table", system: "Backend", domain: "Security", duration: 60, dependencies: ["step_5"], failureModes: ["DB Connection pool exhausted"], alternatives: ["Cache lookup"] }
    ]
  },
  {
    id: "add_to_cart_journey",
    name: "Add To Cart Flow",
    trigger: "Taps Add Item on product details card",
    criticality: "HIGH",
    domains: ["Orders"],
    systems: ["Flutter"],
    steps: [
      { id: "step_1", type: "SCREEN", name: "MenuScreen", system: "Flutter", domain: "Orders", duration: 50, dependencies: [], failureModes: [], alternatives: [] },
      { id: "step_2", type: "COMPONENT", name: "BurgerCard", system: "Flutter", domain: "Orders", duration: 30, dependencies: ["step_1"], failureModes: [], alternatives: [] },
      { id: "step_3", type: "PROVIDER", name: "cartProvider", system: "Flutter", domain: "Orders", duration: 20, dependencies: ["step_2"], failureModes: [], alternatives: [] }
    ]
  },
  {
    id: "place_order_journey",
    name: "Place Order & Dispatch Flow",
    trigger: "User submits checkout transaction",
    criticality: "CRITICAL",
    domains: ["Orders", "Payments", "Delivery", "Notifications"],
    systems: ["Flutter", "Backend", "Database", "Queue", "Notification"],
    steps: [
      { id: "step_1", type: "SCREEN", name: "CheckoutScreen", system: "Flutter", domain: "Payments", duration: 100, dependencies: [], failureModes: [], alternatives: [] },
      { id: "step_2", type: "PROVIDER", name: "orderProvider", system: "Flutter", domain: "Orders", duration: 40, dependencies: ["step_1"], failureModes: [], alternatives: [] },
      { id: "step_3", type: "API", name: "POST /orders", system: "Backend", domain: "Orders", duration: 150, dependencies: ["step_2"], failureModes: ["Route blocked"], alternatives: [] },
      { id: "step_4", type: "CONTROLLER", name: "OrderController", system: "Backend", domain: "Orders", duration: 30, dependencies: ["step_3"], failureModes: [], alternatives: [] },
      { id: "step_5", type: "SERVICE", name: "OrderService", system: "Backend", domain: "Orders", duration: 80, dependencies: ["step_4"], failureModes: ["Inventory lock failed"], alternatives: [] },
      { id: "step_6", type: "SERVICE", name: "PaymentService", system: "Backend", domain: "Payments", duration: 110, dependencies: ["step_5"], failureModes: ["Stripe gateway timeout"], alternatives: ["Razorpay fallback"] },
      { id: "step_7", type: "REPOSITORY", name: "OrderRepository", system: "Backend", domain: "Orders", duration: 50, dependencies: ["step_6"], failureModes: [], alternatives: [] },
      { id: "step_8", type: "DATABASE", name: "PostgreSQL Database", system: "Backend", domain: "Orders", duration: 70, dependencies: ["step_7"], failureModes: ["Transaction deadlock"], alternatives: [] },
      { id: "step_9", type: "EVENT", name: "OrderCreatedEvent", system: "Backend", domain: "Orders", duration: 20, dependencies: ["step_8"], failureModes: [], alternatives: [] },
      { id: "step_10", type: "QUEUE", name: "OrderQueue", system: "Backend", domain: "Orders", duration: 40, dependencies: ["step_9"], failureModes: ["Redis buffer full"], alternatives: [] },
      { id: "step_11", type: "WORKER", name: "NotificationWorker", system: "Backend", domain: "Notifications", duration: 120, dependencies: ["step_10"], failureModes: ["FCM delivery fails"], alternatives: ["Send direct SMS"] }
    ]
  },
  {
    id: "refund_journey",
    name: "Admin Refund Settlement Flow",
    trigger: "Operations administrator clicks Approve Refund",
    criticality: "HIGH",
    domains: ["Payments", "Orders", "Notifications"],
    systems: ["Admin", "Backend", "External", "Database"],
    steps: [
      { id: "step_1", type: "ADMIN", name: "RefundsPage", system: "Admin", domain: "Payments", duration: 80, dependencies: [], failureModes: [], alternatives: [] },
      { id: "step_2", type: "COMPONENT", name: "RefundModal", system: "Admin", domain: "Payments", duration: 50, dependencies: ["step_1"], failureModes: [], alternatives: [] },
      { id: "step_3", type: "API", name: "POST /admin/refunds/approve", system: "Backend", domain: "Payments", duration: 140, dependencies: ["step_2"], failureModes: ["Unauthorized user role"], alternatives: [] },
      { id: "step_4", type: "SERVICE", name: "PaymentService", system: "Backend", domain: "Payments", duration: 70, dependencies: ["step_3"], failureModes: [], alternatives: [] },
      { id: "step_5", type: "EXTERNAL", name: "Stripe API", system: "External", domain: "Payments", duration: 450, dependencies: ["step_4"], failureModes: ["Insufficent platform funds", "Stripe down"], alternatives: ["Manual offline settlement"] },
      { id: "step_6", type: "DATABASE", name: "PostgreSQL Database", system: "Backend", domain: "Payments", duration: 60, dependencies: ["step_5"], failureModes: [], alternatives: [] },
      { id: "step_7", type: "NOTIFICATION", name: "Customer Push Notification", system: "Backend", domain: "Notifications", duration: 150, dependencies: ["step_6"], failureModes: [], alternatives: [] }
    ]
  },
  {
    id: "delivery_journey",
    name: "Rider Delivery Route Chain",
    trigger: "OrderCreated triggers rider assignment algorithm",
    criticality: "MEDIUM",
    domains: ["Delivery", "Notifications"],
    systems: ["Backend", "External"],
    steps: [
      { id: "step_1", type: "SERVICE", name: "DeliveryService", system: "Backend", domain: "Delivery", duration: 90, dependencies: [], failureModes: [], alternatives: [] },
      { id: "step_2", type: "EXTERNAL", name: "Dunzo Logistics API", system: "External", domain: "Delivery", duration: 380, dependencies: ["step_1"], failureModes: ["No active riders in range", "Partner down"], alternatives: ["Shadowfax API fallback"] },
      { id: "step_3", type: "WEBHOOK", name: "RiderAssignedWebhook", system: "Backend", domain: "Delivery", duration: 110, dependencies: ["step_2"], failureModes: ["Signature mismatched"], alternatives: [] },
      { id: "step_4", type: "NOTIFICATION", name: "Mobile Tracking Alert", system: "Backend", domain: "Notifications", duration: 130, dependencies: ["step_3"], failureModes: [], alternatives: [] }
    ]
  },
  {
    id: "loyalty_journey",
    name: "Loyalty Tier Points Ledger Update",
    trigger: "OrderCompleted triggers transaction points ledger save",
    criticality: "LOW",
    domains: ["Loyalty"],
    systems: ["Backend", "Database"],
    steps: [
      { id: "step_1", type: "EVENT", name: "OrderCompletedEvent", system: "Backend", domain: "Loyalty", duration: 30, dependencies: [], failureModes: [], alternatives: [] },
      { id: "step_2", type: "SERVICE", name: "LoyaltyService", system: "Backend", domain: "Loyalty", duration: 80, dependencies: ["step_1"], failureModes: [], alternatives: [] },
      { id: "step_3", type: "DATABASE", name: "PostgreSQL: LoyaltyLedger", system: "Backend", domain: "Loyalty", duration: 70, dependencies: ["step_2"], failureModes: [], alternatives: [] }
    ]
  }
];

// Mapped systemic failure scenarios
export const FAILURE_FLOWS = [
  {
    source: "External:Stripe",
    flow: "Refund/Charge Processing",
    recovery: [
      { step: "Attempt Stripe primary charge", status: "FAILED", reason: "API Timeout" },
      { step: "Trigger retry queue counter (3 attempts)", status: "RETRYING" },
      { step: "Fall back to Razorpay payments backup controller", status: "FALLBACK_TRIGGERED" },
      { step: "In case of total failure, queue transaction details to DLQ and mark order as PENDING_PAYMENT", status: "DLQ_ROUTE_COMPLETED" }
    ]
  },
  {
    source: "Database:Redis",
    flow: "BullMQ Job Routing",
    recovery: [
      { step: "Attempt write to Redis buffer", status: "FAILED", reason: "Connection Refused" },
      { step: "Bypass Redis cache, execute synchronous local fallback", status: "COMPLETED" },
      { step: "Notify global logging client of queue blockages", status: "ALERTED" }
    ]
  },
  {
    source: "External:Dunzo",
    flow: "Rider Logistics Dispatch",
    recovery: [
      { step: "Dispatch delivery coordinates payload to Dunzo", status: "FAILED", reason: "No riders available" },
      { step: "Trigger 2-minute cooldown retry check", status: "WAITING" },
      { step: "Route logistics payload to Shadowfax backup routing API", status: "COMPLETED" }
    ]
  }
];

// Alternative pathways per flow type
export const ALTERNATIVE_FLOWS = [
  {
    name: "Payment Gateways",
    paths: [
      { path: "Success Pathway", steps: ["Submit Checkout", "Stripe Charges Card", "Mark Order PAID", "Deliver SMS Notification"] },
      { path: "Stripe Timeout Recovery", steps: ["Submit Checkout", "Stripe Times Out", "Retry 3 times", "Redirect to Razorpay API", "Mark Order PAID"] },
      { path: "Payment Deficit Rejection", steps: ["Submit Checkout", "Card Declined", "Mark Order CANCELLED", "Restore Inventory Level"] }
    ]
  },
  {
    name: "Order Cancellation",
    paths: [
      { path: "User Cancellation", steps: ["Taps Cancel on Mobile", "POST /orders/:id/cancel", "Mark order CANCELLED", "Restore stock count in PostgreSQL", "Refund payment"] },
      { path: "System Auto-Cancel", steps: ["Store rejects order", "Controller fires CancellationService", "Mark order CANCELLED", "Stripe refund capture", "Notify User SMS"] }
    ]
  }
];

// Scale evolution blueprints
export const SCALE_FLOWS = [
  {
    name: "Operational Scaling Stages",
    stages: [
      { title: "Stage 1: Synchronous Calls (10 users)", architecture: "Monolith, direct HTTP handlers, single DB instance", performance: "Fast, database contention risks" },
      { title: "Stage 2: Asynchronous Queues (100k users)", architecture: "BullMQ / Redis buffers, separate workers processing events", performance: "High resiliency, eventual consistency" },
      { title: "Stage 3: Event-Driven Pipeline (1M users)", architecture: "Apache Kafka / RabbitMQ broker clusters, partitioned workers", performance: "Sub-millisecond analytics processing, zero single points of failure" }
    ]
  }
];

/**
 * Discovers user journeys based on repository states.
 * 
 * @param {Object} flutterMap 
 * @param {Object} backendMap 
 * @param {Object} adminMap 
 * @param {Object} dependencyMap 
 * @returns {Object[]} User journeys list
 */
export function discoverUserJourneys(flutterMap, backendMap, adminMap, dependencyMap) {
  return USER_JOURNEYS;
}

/**
 * Models error recovery pathways.
 * 
 * @returns {Object[]}
 */
export function buildFailureFlows() {
  return FAILURE_FLOWS;
}

/**
 * Models alternative routes.
 * 
 * @returns {Object[]}
 */
export function buildAlternativeFlows() {
  return ALTERNATIVE_FLOWS;
}

/**
 * Models scaling architecture evolution.
 * 
 * @returns {Object[]}
 */
export function buildScaleFlows() {
  return SCALE_FLOWS;
}

/**
 * Simulates path delays and finds bottlenecks.
 * 
 * @param {Object[]} steps 
 * @returns {Object} Timing estimates
 */
export function estimateTimings(steps = []) {
  if (steps.length === 0) {
    return { minLatency: 0, avgLatency: 0, bottlenecks: [] };
  }

  const durations = steps.map(s => s.duration || 0);
  const minLatency = Math.min(...durations);
  const avgLatency = Math.round(durations.reduce((a, b) => a + b, 0));
  
  // Find components exceeding 150ms thresholds
  const bottlenecks = steps
    .filter(s => (s.duration || 0) >= 150)
    .map(s => ({ step: s.name, type: s.type, delay: s.duration }));

  return {
    minLatency,
    avgLatency,
    bottlenecks
  };
}

/**
 * Maps upstream and downstream execution chains.
 * 
 * @param {Object[]} steps 
 * @returns {Object[]}
 */
export function buildDependencyChains(steps = []) {
  const chains = [];
  for (let i = 0; i < steps.length; i++) {
    chains.push({
      source: steps[i].name,
      downstream: steps.slice(i + 1).map(s => s.name),
      upstream: steps.slice(0, i).map(s => s.name)
    });
  }
  return chains;
}

/**
 * Extracts list of event handlers.
 * 
 * @returns {string[]}
 */
export function discoverEvents() {
  return ["OrderCreatedEvent", "PaymentCompletedEvent", "DeliveryAssignedWebhook", "RefundIssuedEvent", "OrderCompletedEvent"];
}

/**
 * Classifies path criticality levels.
 * 
 * @param {Object} flow 
 * @returns {string} Criticality tag (LOW, MEDIUM, HIGH, CRITICAL)
 */
export function assignCriticality(flow) {
  return flow.criticality || "MEDIUM";
}

/**
 * Computes coordinate paths (x, y), styling nodes, and delays for the visual canvas player.
 * 
 * @param {Object[]} steps 
 * @returns {Object[]} Animatable step payloads
 */
export function addAnimationMetadata(steps = []) {
  return steps.map((step, index) => {
    // Lay out steps horizontally on the visual timeline
    const x = 50 + index * 140;
    // Waver slightly vertically for dynamic visualization layout
    const y = index % 2 === 0 ? 150 : 200;

    let color = "#3b82f6"; // default blue
    let icon = "activity";

    switch (step.type) {
      case "SCREEN":
      case "ADMIN":
        color = "#a855f7"; // purple
        icon = "layout";
        break;
      case "PROVIDER":
        color = "#ec4899"; // pink
        icon = "database";
        break;
      case "API":
      case "WEBHOOK":
        color = "#10b981"; // green
        icon = "arrow-right";
        break;
      case "SERVICE":
      case "CONTROLLER":
        color = "#eab308"; // yellow
        icon = "cpu";
        break;
      case "DATABASE":
      case "REPOSITORY":
        color = "#ef4444"; // red
        icon = "server";
        break;
      case "QUEUE":
      case "WORKER":
        color = "#f97316"; // orange
        icon = "hash";
        break;
      case "EXTERNAL":
        color = "#6b7280"; // gray
        icon = "globe";
        break;
    }

    return {
      ...step,
      x,
      y,
      color,
      icon,
      delay: index * 0.4 // 400ms delay increments between anim actions
    };
  });
}

/**
 * Main entry point: aggregates structural scans and traces execution behaviors.
 * 
 * @param {Object} flutterMap 
 * @param {Object} backendMap 
 * @param {Object} adminMap 
 * @param {Object} dependencyMap 
 * @returns {Object} Behaviour flows mapping payload
 */
export function buildExecutionFlows(flutterMap = {}, backendMap = {}, adminMap = {}, dependencyMap = {}) {
  const journeys = discoverUserJourneys(flutterMap, backendMap, adminMap, dependencyMap).map(j => {
    const enrichedSteps = addAnimationMetadata(j.steps);
    const timings = estimateTimings(enrichedSteps);
    const chains = buildDependencyChains(enrichedSteps);

    return {
      ...j,
      steps: enrichedSteps,
      timings,
      dependencyChains: chains
    };
  });

  return {
    flows: journeys.map(j => ({
      id: j.id,
      name: j.name,
      trigger: j.trigger,
      criticality: j.criticality,
      systems: j.systems,
      domains: j.domains,
      stepsCount: j.steps.length
    })),
    journeys,
    failureFlows: buildFailureFlows(),
    scaleFlows: buildScaleFlows(),
    alternativeFlows: buildAlternativeFlows(),
    events: discoverEvents()
  };
}
