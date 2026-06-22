/**
 * CodeExecutionTracer.js
 * 
 * Specialized execution simulation and timeline tracing engine of Software Universe.
 * Simulates system flows over time, mapping OpenTelemetry-style parent/child span traces,
 * chronological timeline event logs, async branching forks, parallel groups,
 * critical path bounds, latency breakdowns, transient retries, and queue worker gaps.
 * 
 * Pure functions only. Runs safely in both Node and browser environments.
 */

// Supported spans status types
export const SPAN_STATUS = ["SUCCESS", "FAILED", "RETRYING", "QUEUED", "WAITING", "CANCELLED", "TIMEOUT"];

// Master dictionary of trace span models by trigger type
export const MOCK_TRACE_SPANS = {
  PLACE_ORDER: [
    { id: "span-1", parentId: null, name: "Checkout Screen View", type: "SCREEN", startTime: 0, endTime: 5, duration: 5, status: "SUCCESS", domain: "Orders", system: "Flutter App" },
    { id: "span-2", parentId: "span-1", name: "Order State Provider", type: "PROVIDER", startTime: 5, endTime: 20, duration: 15, status: "SUCCESS", domain: "Orders", system: "Flutter App" },
    { id: "span-3", parentId: "span-2", name: "Order Client Service API", type: "SERVICE", startTime: 20, endTime: 30, duration: 10, status: "SUCCESS", domain: "Orders", system: "Flutter App" },
    { id: "span-4", parentId: "span-3", name: "POST /orders", type: "API", startTime: 30, endTime: 40, duration: 10, status: "SUCCESS", domain: "Orders", system: "Backend Gateway" },
    { id: "span-5", parentId: "span-4", name: "Order Router Controller", type: "CONTROLLER", startTime: 40, endTime: 545, duration: 505, status: "SUCCESS", domain: "Orders", system: "Backend Service" },
    { id: "span-6", parentId: "span-5", name: "Payment Business Service", type: "SERVICE", startTime: 60, endTime: 510, duration: 450, status: "SUCCESS", domain: "Payments", system: "Backend Service" },
    { id: "span-7", parentId: "span-6", name: "Stripe Payment Gateway", type: "EXTERNAL", startTime: 65, endTime: 485, duration: 420, status: "SUCCESS", domain: "Third-Party", system: "External Network" },
    { id: "span-8", parentId: "span-5", name: "Order SQL Repository", type: "REPOSITORY", startTime: 510, endTime: 525, duration: 15, status: "SUCCESS", domain: "Orders", system: "Backend DB Adapter" },
    { id: "span-9", parentId: "span-8", name: "PostgreSQL Database Writer", type: "DATABASE", startTime: 515, endTime: 545, duration: 30, status: "SUCCESS", domain: "Database", system: "Database" },
    { id: "span-10", parentId: "span-5", name: "OrderCreated Event Emit", type: "EVENT", startTime: 545, endTime: 550, duration: 5, status: "SUCCESS", domain: "Orders", system: "Backend Events" },
    { id: "span-11", parentId: "span-10", name: "BullMQ Redis Queue Broker", type: "QUEUE", startTime: 550, endTime: 560, duration: 10, status: "QUEUED", domain: "Queues", system: "Infrastructure Queue" },
    { id: "span-12", parentId: "span-11", name: "BullMQ Notification Worker", type: "WORKER", startTime: 560, endTime: 640, duration: 80, status: "SUCCESS", domain: "Queues", system: "Background Worker" },
    { id: "span-13", parentId: "span-12", name: "Twilio SMS Dispatcher", type: "WEBHOOK", startTime: 565, endTime: 1045, duration: 480, status: "SUCCESS", domain: "Third-Party", system: "External Network" },
    { id: "span-14", parentId: "span-11", name: "Kitchen POS Thermal Printer", type: "POS", startTime: 560, endTime: 710, duration: 150, status: "SUCCESS", domain: "POS", system: "POS Printer" },
    { id: "span-15", parentId: "span-11", name: "Admin Dashboard Panel", type: "ADMIN", startTime: 560, endTime: 600, duration: 40, status: "SUCCESS", domain: "Analytics", system: "Admin Web Panel" }
  ],
  LOGIN: [
    { id: "span-1", parentId: null, name: "Login Screen View", type: "SCREEN", startTime: 0, endTime: 5, duration: 5, status: "SUCCESS", domain: "Auth", system: "Flutter App" },
    { id: "span-2", parentId: "span-1", name: "Auth State Provider", type: "PROVIDER", startTime: 5, endTime: 15, duration: 10, status: "SUCCESS", domain: "Auth", system: "Flutter App" },
    { id: "span-3", parentId: "span-2", name: "Auth Client Service API", type: "SERVICE", startTime: 15, endTime: 25, duration: 10, status: "SUCCESS", domain: "Auth", system: "Flutter App" },
    { id: "span-4", parentId: "span-3", name: "POST /auth/login", type: "API", startTime: 25, endTime: 33, duration: 8, status: "SUCCESS", domain: "Auth", system: "Backend Gateway" },
    { id: "span-5", parentId: "span-4", name: "Auth Router Controller", type: "CONTROLLER", startTime: 33, endTime: 48, duration: 15, status: "SUCCESS", domain: "Auth", system: "Backend Service" },
    { id: "span-6", parentId: "span-5", name: "Redis Memory Cache", type: "CACHE", startTime: 35, endTime: 38, duration: 3, status: "SUCCESS", domain: "Caching", system: "Database" }
  ],
  PAYMENT_FAILURE: [
    { id: "span-1", parentId: null, name: "Checkout Screen View", type: "SCREEN", startTime: 0, endTime: 5, duration: 5, status: "SUCCESS", domain: "Orders", system: "Flutter App" },
    { id: "span-2", parentId: "span-1", name: "Order State Provider", type: "PROVIDER", startTime: 5, endTime: 20, duration: 15, status: "SUCCESS", domain: "Orders", system: "Flutter App" },
    { id: "span-3", parentId: "span-2", name: "POST /orders", type: "API", startTime: 20, endTime: 30, duration: 10, status: "SUCCESS", domain: "Orders", system: "Backend Gateway" },
    { id: "span-4", parentId: "span-3", name: "Order Router Controller", type: "CONTROLLER", startTime: 30, endTime: 550, duration: 520, status: "FAILED", domain: "Orders", system: "Backend Service" },
    { id: "span-5", parentId: "span-4", name: "Payment Business Service", type: "SERVICE", startTime: 40, endTime: 540, duration: 500, status: "FAILED", domain: "Payments", system: "Backend Service" },
    { id: "span-6", parentId: "span-5", name: "Stripe Payment Gateway", type: "EXTERNAL", startTime: 45, endTime: 545, duration: 500, status: "TIMEOUT", domain: "Third-Party", system: "External Network" },
    { id: "span-7", parentId: "span-4", name: "Checkout Error Widget", type: "WIDGET", startTime: 545, endTime: 547, duration: 2, status: "SUCCESS", domain: "Orders", system: "Flutter App" }
  ]
};

/**
 * Builds chronological execution spans.
 * 
 * @param {string} trigger 
 * @returns {Object[]} Spans list
 */
export function buildSpans(trigger = "PLACE_ORDER") {
  const clean = String(trigger).toUpperCase();
  return MOCK_TRACE_SPANS[clean] || MOCK_TRACE_SPANS.PLACE_ORDER;
}

/**
 * Maps chronological timeline offsets.
 * 
 * @param {string} trigger 
 * @returns {Object[]} Timeline stream
 */
export function buildTimeline(trigger = "PLACE_ORDER") {
  const spans = buildSpans(trigger);
  const events = [];

  spans.forEach(s => {
    events.push({
      timestamp: s.startTime,
      action: `${s.name} Started`,
      component: s.name,
      type: s.type,
      system: s.system
    });
    events.push({
      timestamp: s.endTime,
      action: `${s.name} Finished [${s.status}]`,
      component: s.name,
      type: s.type,
      system: s.system
    });
  });

  return events.sort((a, b) => a.timestamp - b.timestamp);
}

/**
 * Pinpoints the bottleneck-dominant path of nodes that dictate total latency.
 * 
 * @param {Object[]} spans 
 * @returns {Object} Critical path data
 */
export function findCriticalPath(spans = []) {
  // Sync components on critical transaction execution thread (ignores async background alerts)
  const syncTypes = ["SCREEN", "PROVIDER", "SERVICE", "API", "CONTROLLER", "REPOSITORY", "DATABASE", "EXTERNAL"];
  const criticalSpans = spans
    .filter(s => syncTypes.includes(s.type))
    .sort((a, b) => a.startTime - b.startTime);

  const nodes = [];
  let totalDuration = 0;

  criticalSpans.forEach(s => {
    // Avoid double counting child external calls nested inside parent services (Stripe inside PaymentService)
    if (s.id === "span-7" && s.parentId === "span-6") return;
    nodes.push(s.name);
    totalDuration += s.duration;
  });

  return {
    nodes,
    totalDuration
  };
}

/**
 * Discovers points where the execution flow forks asynchronously.
 * 
 * @param {string} trigger 
 * @returns {Object[]} Async branches
 */
export function detectAsyncBranches(trigger = "PLACE_ORDER") {
  const clean = String(trigger).toUpperCase();

  if (clean === "PLACE_ORDER") {
    return [
      {
        source: "BullMQ Redis Queue Broker",
        branches: [
          { name: "Notifications Branch", path: ["BullMQ Notification Worker", "Twilio SMS Dispatcher"] },
          { name: "POS Printing Branch", path: ["Kitchen POS Thermal Printer"] },
          { name: "Admin Dashboard Branch", path: ["Admin Dashboard Panel"] }
        ]
      }
    ];
  }

  return [];
}

/**
 * Groups spans executing concurrently (overlapping intervals).
 * 
 * @param {Object[]} spans 
 * @returns {Object[]} Parallel groups
 */
export function detectParallelism(spans = []) {
  const parallelGroups = [];
  
  // Group by overlapping start times (e.g. at 560ms notifications, printer, and admin fire concurrently)
  const startMap = {};
  spans.forEach(s => {
    if (s.startTime !== undefined) {
      if (!startMap[s.startTime]) startMap[s.startTime] = [];
      startMap[s.startTime].push(s.name);
    }
  });

  Object.entries(startMap).forEach(([time, names]) => {
    if (names.length > 1) {
      parallelGroups.push({
        startTime: parseInt(time),
        components: names
      });
    }
  });

  return parallelGroups;
}

/**
 * Details event logs.
 * 
 * @param {string} trigger 
 * @returns {Object[]} Time-stamped event profiles
 */
export function traceEvents(trigger = "PLACE_ORDER") {
  const clean = String(trigger).toUpperCase();
  
  if (clean === "PLACE_ORDER") {
    return [
      { event: "OrderCreated", producer: "OrderCreated Event Emit", consumers: ["BullMQ Redis Queue Broker"], timestamp: 545 }
    ];
  }
  return [];
}

/**
 * Identifies spans exceeding acceptable latency thresholds.
 * 
 * @param {Object[]} spans 
 * @returns {Object[]} Bottleneck alerts
 */
export function detectBottlenecks(spans = []) {
  return spans
    .filter(s => s.duration >= 100)
    .map(s => ({
      component: s.name,
      avgDuration: s.duration,
      severity: s.duration >= 400 ? "HIGH" : "MEDIUM"
    }));
}

/**
 * Traces retry timelines for transient timeouts.
 * 
 * @param {string} trigger 
 * @returns {Object[]} Retry steps
 */
export function traceRetries(trigger = "PLACE_ORDER") {
  const clean = String(trigger).toUpperCase();

  if (clean === "PLACE_ORDER") {
    return [
      { step: "Stripe Connection Attempt 1", timestamp: 65, duration: 420, status: "TIMEOUT" },
      { step: "Exponential Retry Backoff", timestamp: 490, duration: 10, status: "RETRYING" },
      { step: "Stripe Connection Attempt 2", timestamp: 500, duration: 10, status: "SUCCESS" }
    ];
  }

  return [];
}

/**
 * Details queue times and processing allocations.
 * 
 * @param {string} trigger 
 * @returns {Object} Queue stats
 */
export function traceQueues(trigger = "PLACE_ORDER") {
  const clean = String(trigger).toUpperCase();
  if (clean === "PLACE_ORDER") {
    return {
      queueTime: 10,
      processingTime: 80,
      worker: "BullMQ Notification Worker"
    };
  }
  return { queueTime: 0, processingTime: 0, worker: "None" };
}

/**
 * Models tracing logs when checkout routes fail.
 * 
 * @returns {Object[]} Failed traces
 */
export function traceFailureExecution() {
  return buildSpans("PAYMENT_FAILURE");
}

/**
 * Segments latency across compute, storage IO, queue delay, and network roundtrips.
 * 
 * @param {Object[]} spans 
 * @returns {Object} Latency breakdown
 */
export function calculateLatencyBreakdown(spans = []) {
  let compute = 0;
  let io = 0;
  let queue = 0;
  let network = 0;
  let total = 0;

  spans.forEach(s => {
    if (s.id === "span-7" || s.id === "span-13") {
      network += s.duration; // Stripe, Twilio
    } else if (s.type === "DATABASE") {
      io += s.duration; // PostgreSQL
    } else if (s.type === "QUEUE") {
      queue += s.duration; // Redis Queue
    } else if (s.id !== "span-5") { // Exclude parent controllers containing child durations
      compute += s.duration;
    }
  });

  total = compute + io + queue + network;

  return {
    total,
    compute,
    io,
    queue,
    network
  };
}

/**
 * Attaches visual coordinates for canvas visual flow playbacks.
 * 
 * @param {Object[]} spans 
 * @returns {Object[]} Replay coordinates
 */
export function addReplayMetadata(spans = []) {
  const icons = {
    SCREEN: "layout",
    PROVIDER: "refresh-cw",
    SERVICE: "purple",
    API: "globe",
    CONTROLLER: "sliders",
    REPOSITORY: "database",
    DATABASE: "hard-drive",
    CACHE: "zap",
    QUEUE: "layers",
    WORKER: "cpu",
    EXTERNAL: "external-link",
    WEBHOOK: "external-link"
  };

  return spans.map((s, index) => {
    return {
      spanId: s.id,
      x: 50 + index * 80,
      y: s.parentId ? 250 : 180,
      icon: icons[s.type] || "activity",
      color: s.status === "FAILED" || s.status === "TIMEOUT" ? "red" : "blue",
      delay: index * 100,
      duration: s.duration
    };
  });
}

/**
 * Entry point: trace trigger execution streams and compile temporal timeline profile.
 * 
 * @param {string} trigger - User action trigger
 * @returns {Object} Trace simulation payload
 */
export function traceExecution(trigger = "PLACE_ORDER") {
  const spans = buildSpans(trigger);
  const timeline = buildTimeline(trigger);
  const critical = findCriticalPath(spans);
  const asyncBranches = detectAsyncBranches(trigger);
  const parallelism = detectParallelism(spans);
  const events = traceEvents(trigger);
  const bottlenecks = detectBottlenecks(spans);
  const retries = traceRetries(trigger);
  const queues = traceQueues(trigger);
  const failures = traceFailureExecution();
  const breakdown = calculateLatencyBreakdown(spans);
  const replay = addReplayMetadata(spans);

  // Identify total latency based on critical path duration
  const totalDuration = critical.totalDuration;

  return {
    trigger: trigger,
    totalDuration: totalDuration,
    spans: spans,
    timeline: timeline,
    bottlenecks: bottlenecks,
    criticalPath: critical.nodes,
    asyncBranches: asyncBranches.map(b => b.source),
    asyncBranchesDetailed: asyncBranches,
    parallelism: parallelism,
    events: events,
    retries: retries,
    queues: queues,
    failures: failures,
    latencyBreakdown: breakdown,
    replayMetadata: replay
  };
}
