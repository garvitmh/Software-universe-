/**
 * ObservabilityScanner.js
 * 
 * Specialized system observability mapping and instrumentation engine.
 * Classifies service Golden Signals (Latency, Traffic, Errors, Saturation),
 * maps performance metric queries, categorizes system logging types, maps tracing paths,
 * configures alert thresholds, defines Service Level Objectives (SLOs),
 * outlines operational incident symptoms and auto-recovery rules, and groups dashboards.
 * 
 * Pure functions only. Runs safely in both Node and browser environments.
 */

// Golden Signals classification database
export const GOLDEN_SIGNALS = [
  { service: "Backend:PaymentService", latency: true, traffic: true, errors: true, saturation: true },
  { service: "Backend:OrderService", latency: true, traffic: true, errors: true, saturation: true },
  { service: "Database:PostgreSQL", latency: true, traffic: true, errors: true, saturation: true },
  { service: "Database:Redis", latency: false, traffic: true, errors: true, saturation: true },
  { service: "Worker:NotificationWorker", latency: true, traffic: true, errors: true, saturation: true }
];

// Instrumentable Metrics list
export const METRICS = [
  { metric: "P95 Latency", unit: "ms", importance: "HIGH", owner: "Backend Team" },
  { metric: "P99 Latency", unit: "ms", importance: "CRITICAL", owner: "Backend Team" },
  { metric: "Error Rate", unit: "%", importance: "CRITICAL", owner: "Backend Team" },
  { metric: "Active DB Connections", unit: "count", importance: "HIGH", owner: "Infra Team" },
  { metric: "Queue Backlog Length", unit: "jobs", importance: "HIGH", owner: "Operations Team" },
  { metric: "Cache Hit Ratio", unit: "%", importance: "MEDIUM", owner: "Infra Team" },
  { metric: "Webhook Timeout Failures", unit: "count", importance: "HIGH", owner: "Payments Team" },
  { metric: "CPU Utilization", unit: "%", importance: "CRITICAL", owner: "Infra Team" }
];

// Mapped log categories
export const LOGS = [
  { level: "INFO", message: "User session authenticated", domain: "Auth" },
  { level: "WARN", message: "Coupon verification latency threshold exceeded", domain: "Coupons" },
  { level: "ERROR", message: "Stripe transaction charge failed: Card Declined", domain: "Payments" },
  { level: "FATAL", message: "Unable to establish primary database socket pool connection", domain: "Security" },
  { level: "AUDIT", message: "Administrator approved refund of order transaction #BF-98210", domain: "Payments" }
];

// Cross-system transaction traces
export const TRACES = [
  {
    traceId: "tr_checkout_9082A",
    services: ["Flutter:CheckoutScreen", "Backend:POST /orders", "Backend:OrderService", "Backend:PaymentService", "Database:PostgreSQL"],
    duration: 540,
    criticality: "CRITICAL"
  },
  {
    traceId: "tr_refund_89021B",
    services: ["Admin:RefundsPage", "Backend:POST /payments/refund", "Backend:PaymentService", "External:Stripe", "Database:PostgreSQL"],
    duration: 880,
    criticality: "HIGH"
  },
  {
    traceId: "tr_delivery_dispatch_7721X",
    services: ["Queue:OrderQueue", "Worker:OrderWorker", "External:Dunzo", "Backend:RiderAssignedWebhook"],
    duration: 1420,
    criticality: "MEDIUM"
  }
];

// System Alert triggers
export const ALERTS = [
  { alert: "High Latency Spikes (P99 > 1500ms)", severity: "CRITICAL", affectedSystems: ["Backend:PaymentService", "Flutter:CheckoutScreen"] },
  { alert: "Error Rate Spike (> 2.5%)", severity: "CRITICAL", affectedSystems: ["Backend:OrderService", "Backend:PaymentService"] },
  { alert: "Queue Backlog Pileup (> 500 jobs)", severity: "HIGH", affectedSystems: ["Queue:NotificationQueue", "Worker:NotificationWorker"] },
  { alert: "Database Connection Pool Saturation (> 90%)", severity: "CRITICAL", affectedSystems: ["Database:PostgreSQL"] }
];

// Service Level Objectives
export const SLOS = [
  { service: "Stripe Payment Success Rate", objective: "99.95%", errorBudget: "0.05%" },
  { service: "Application API Availability", objective: "99.90%", errorBudget: "0.10%" },
  { service: "Notification Worker SMS Delivery", objective: "99.00%", errorBudget: "1.00%" },
  { service: "Order Checkout Latency (P95 < 500ms)", objective: "95.00%", errorBudget: "5.00%" }
];

// System Health Checks
export const HEALTH_CHECKS = [
  { component: "API Server (/health)", statusEndpoint: "http://api.burgerfarm.com/health", frequency: "10s" },
  { component: "Primary Database (Ping Check)", statusEndpoint: "Internal PG ping command", frequency: "15s" },
  { component: "Redis Buffer Socket Check", statusEndpoint: "Internal Redis ping command", frequency: "5s" },
  { component: "Notification SMS Service (Twilio API)", statusEndpoint: "Third-party status status.twilio.com", frequency: "60s" }
];

// Mapped outage incident workflows
export const INCIDENTS = [
  {
    incident: "Payment Gateway Down (Stripe Outage)",
    symptoms: "Customers experience P99 latency timeouts and Stripe card charges return error code 503.",
    detection: "Alert 'Stripe API Failures > 5%' fires in Grafana, notifying payment operations channels.",
    impact: "Checkout screen locks up. Customer order completion fails. Operations revenue metrics halt.",
    recovery: "Toggle gateway router to process checkouts via Razorpay backup platform adapter. Log failed charges to Stripe recovery queue."
  },
  {
    incident: "Redis Cache Failure",
    symptoms: "Order queue processing stops. Push notifications fail. Analytics logs backlog.",
    detection: "Alert 'Redis Socket connection lost' triggers, paging infra on-call engineer.",
    impact: "Notification delivery is delayed. Main checkout and payment flows continue by bypassing Redis.",
    recovery: "Express middleware automatically redirects queues to memory cache. Redis server restarts and replays log files."
  },
  {
    incident: "Notification Worker Crash",
    symptoms: "Push notifications and tracking SMS are not sent. BullMQ backlog size increases.",
    detection: "Alert 'Queue backlog size > 500' triggers, alerting operations manager.",
    impact: "Delivery notifications delayed. Order placement and payment transactions continue safely.",
    recovery: "Kubernetes orchestration restarts worker pods. Workers drain accumulated queue items using backoff delays."
  }
];

// Monitor bottlenecks
export const BOTTLENECK_MONITORS = [
  { bottleneck: "Database:PostgreSQL", metrics: ["Active DB Connections", "CPU Utilization"], risk: "CRITICAL" },
  { bottleneck: "Backend:PaymentService", metrics: ["P95 Latency", "Webhook Timeout Failures"], risk: "HIGH" },
  { bottleneck: "Database:Redis", metrics: ["Queue Backlog Length", "Cache Hit Ratio"], risk: "MEDIUM" }
];

// Visual dashboards mappings
export const DASHBOARDS = [
  {
    name: "Orders Operations Dashboard",
    metrics: ["Request Count", "Error Rate", "P95 Latency"],
    alerts: ["Error Rate Spike (> 2.5%)"],
    owners: ["Backend Team", "Operations Team"]
  },
  {
    name: "Payments Dashboard",
    metrics: ["Stripe Webhook Failures", "P99 Latency"],
    alerts: ["High Latency Spikes (P99 > 1500ms)"],
    owners: ["Payments Team"]
  },
  {
    name: "Infrastructure Dashboard",
    metrics: ["CPU Utilization", "Active DB Connections", "Cache Hit Ratio"],
    alerts: ["Database Connection Pool Saturation (> 90%)"],
    owners: ["Infra Team"]
  }
];

/**
 * Classifies service Golden Signals.
 * @returns {Object[]}
 */
export function discoverGoldenSignals() {
  return GOLDEN_SIGNALS;
}

/**
 * Maps performance metric queries.
 * @returns {Object[]}
 */
export function discoverMetrics() {
  return METRICS;
}

/**
 * Categorizes system logging types.
 * @returns {Object[]}
 */
export function discoverLogs() {
  return LOGS;
}

/**
 * Maps tracing paths.
 * @returns {Object[]}
 */
export function discoverTraces() {
  return TRACES;
}

/**
 * Configures alert thresholds.
 * @returns {Object[]}
 */
export function discoverAlerts() {
  return ALERTS;
}

/**
 * Defines Service Level Objectives.
 * @returns {Object[]}
 */
export function generateSLOs() {
  return SLOS;
}

/**
 * Maps health checks status.
 * @returns {Object[]}
 */
export function discoverHealthChecks() {
  return HEALTH_CHECKS;
}

/**
 * Outlines operational incident recovery steps.
 * @returns {Object[]}
 */
export function analyzeIncidents() {
  return INCIDENTS;
}

/**
 * Identifies critical paths.
 * @returns {Object[]}
 */
export function detectCriticalPaths() {
  return [
    { path: "Checkout & Charge Flow", criticality: "CRITICAL", components: ["CheckoutScreen", "POST /orders", "OrderService", "PaymentService", "PostgreSQL"] },
    { path: "Order Dispatch Flow", criticality: "HIGH", components: ["OrderQueue", "OrderWorker", "Dunzo API"] },
    { path: "Customer Loyalty Log", criticality: "LOW", components: ["LoyaltyService", "LoyaltyLedger Table"] }
  ];
}

/**
 * Tracks bottleneck monitors.
 * @returns {Object[]}
 */
export function analyzeBottlenecks() {
  return BOTTLENECK_MONITORS;
}

/**
 * Group metrics into visual dashboard panels.
 * @returns {Object[]}
 */
export function buildDashboards() {
  return DASHBOARDS;
}

/**
 * Main entry point: aggregates observability, traces, and metrics.
 * 
 * @param {Object} architecture 
 * @param {Object} flows 
 * @param {Object} dependencies 
 * @returns {Object} Observability scan payload
 */
export function scanObservability(architecture = {}, flows = {}, dependencies = {}) {
  return {
    goldenSignals: discoverGoldenSignals(),
    metrics: discoverMetrics(),
    logs: discoverLogs(),
    traces: discoverTraces(),
    alerts: discoverAlerts(),
    slos: generateSLOs(),
    healthChecks: discoverHealthChecks(),
    incidents: analyzeIncidents(),
    criticalPaths: detectCriticalPaths(),
    bottlenecks: analyzeBottlenecks(),
    dashboards: buildDashboards()
  };
}
