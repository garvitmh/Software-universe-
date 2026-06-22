/**
 * RuntimeCodeLinker.js
 * 
 * The primary execution linkage engine of Software Universe.
 * Maps human user actions (triggers) to the exact runtime paths through the system.
 * Identifies active files, services, databases, event producers/consumers,
 * models complex failure paths with automated SRE recovery rules,
 * details latency estimations with bottlenecks, upstream/downstream dependency links,
 * and adds animation coordinates metadata for visual flow playback.
 * 
 * Pure functions only. Runs safely in both Node and browser environments.
 */

// Supported trigger types
export const SUPPORTED_TRIGGERS = [
  "LOGIN", "ADD_TO_CART", "PLACE_ORDER", "PAYMENT_SUCCESS",
  "PAYMENT_FAILURE", "REFUND", "ORDER_CANCELLED", "DELIVERY_ASSIGNED",
  "LOYALTY_REWARD", "ADMIN_REFUND", "POS_PRINT"
];

// Reusable master node dictionary with system mappings
export const NODE_DATABASE = {
  // Screens & Widgets (Client)
  CheckoutScreen: { id: "CheckoutScreen", name: "Checkout Screen View", type: "SCREEN", system: "Flutter App", domain: "Orders", file: "apps/mobile/lib/screens/checkout_screen.dart", duration: 5, metadata: { icon: "layout", color: "blue", x: 50, y: 200 } },
  LoginScreen: { id: "LoginScreen", name: "Login Screen View", type: "SCREEN", system: "Flutter App", domain: "Auth", file: "apps/mobile/lib/screens/login_screen.dart", duration: 5, metadata: { icon: "lock", color: "blue", x: 50, y: 150 } },
  BurgerCardWidget: { id: "BurgerCardWidget", name: "Burger Card Widget", type: "WIDGET", system: "Flutter App", domain: "Orders", file: "apps/mobile/lib/widgets/burger_card.dart", duration: 2, metadata: { icon: "grid", color: "blue", x: 50, y: 100 } },
  CheckoutErrorWidget: { id: "CheckoutErrorWidget", name: "Checkout Error Widget", type: "WIDGET", system: "Flutter App", domain: "Orders", file: "apps/mobile/lib/widgets/checkout_error.dart", duration: 2, metadata: { icon: "alert-triangle", color: "red", x: 950, y: 400 } },
  UserWalletWidget: { id: "UserWalletWidget", name: "User Wallet Widget", type: "WIDGET", system: "Flutter App", domain: "Loyalty", file: "apps/mobile/lib/widgets/user_wallet.dart", duration: 3, metadata: { icon: "credit-card", color: "green", x: 950, y: 100 } },
  
  // State Providers
  OrderProvider: { id: "OrderProvider", name: "Order State Provider", type: "PROVIDER", system: "Flutter App", domain: "Orders", file: "apps/mobile/lib/providers/order_provider.dart", duration: 15, metadata: { icon: "refresh-cw", color: "cyan", x: 150, y: 200 } },
  AuthProvider: { id: "AuthProvider", name: "Auth State Provider", type: "PROVIDER", system: "Flutter App", domain: "Auth", file: "apps/mobile/lib/providers/auth_provider.dart", duration: 10, metadata: { icon: "user-check", color: "cyan", x: 150, y: 150 } },
  CartProvider: { id: "CartProvider", name: "Cart State Provider", type: "PROVIDER", system: "Flutter App", domain: "Orders", file: "apps/mobile/lib/providers/cart_provider.dart", duration: 8, metadata: { icon: "shopping-cart", color: "cyan", x: 150, y: 100 } },

  // Client Services
  OrderServiceClient: { id: "OrderServiceClient", name: "Order Client Service API", type: "SERVICE", system: "Flutter App", domain: "Orders", file: "apps/mobile/lib/services/order_service.dart", duration: 10, metadata: { icon: "share-2", color: "purple", x: 250, y: 200 } },
  AuthServiceClient: { id: "AuthServiceClient", name: "Auth Client Service API", type: "SERVICE", system: "Flutter App", domain: "Auth", file: "apps/mobile/lib/services/auth_service.dart", duration: 10, metadata: { icon: "share-2", color: "purple", x: 250, y: 150 } },

  // API Gateways & Router controllers
  POST_Orders: { id: "POST_Orders", name: "POST /orders", type: "API", system: "Backend Gateway", domain: "Orders", file: "apps/backend/src/server.ts", duration: 10, metadata: { icon: "globe", color: "orange", x: 350, y: 200 } },
  POST_AuthLogin: { id: "POST_AuthLogin", name: "POST /auth/login", type: "API", system: "Backend Gateway", domain: "Auth", file: "apps/backend/src/server.ts", duration: 8, metadata: { icon: "globe", color: "orange", x: 350, y: 150 } },
  POST_AdminRefund: { id: "POST_AdminRefund", name: "POST /admin/refund", type: "API", system: "Backend Gateway", domain: "Payments", file: "apps/backend/src/server.ts", duration: 12, metadata: { icon: "globe", color: "orange", x: 350, y: 300 } },

  OrderController: { id: "OrderController", name: "Order Router Controller", type: "CONTROLLER", system: "Backend Service", domain: "Orders", file: "apps/backend/src/controllers/order.controller.ts", duration: 20, metadata: { icon: "sliders", color: "yellow", x: 450, y: 200 } },
  AuthController: { id: "AuthController", name: "Auth Router Controller", type: "CONTROLLER", system: "Backend Service", domain: "Auth", file: "apps/backend/src/controllers/auth.controller.ts", duration: 15, metadata: { icon: "sliders", color: "yellow", x: 450, y: 150 } },
  AdminController: { id: "AdminController", name: "Admin Dashboard Controller", type: "CONTROLLER", system: "Backend Service", domain: "Analytics", file: "apps/backend/src/controllers/admin.controller.ts", duration: 18, metadata: { icon: "sliders", color: "yellow", x: 450, y: 300 } },

  // Backend Services
  PaymentService: { id: "PaymentService", name: "Payment Business Service", type: "SERVICE", system: "Backend Service", domain: "Payments", file: "apps/backend/src/services/payment.service.ts", duration: 450, metadata: { icon: "credit-card", color: "purple", x: 550, y: 250 } },
  InventoryService: { id: "InventoryService", name: "Inventory Stock Manager", type: "SERVICE", system: "Backend Service", domain: "Orders", file: "apps/backend/src/services/inventory.service.ts", duration: 35, metadata: { icon: "package", color: "purple", x: 550, y: 320 } },
  LoyaltyService: { id: "LoyaltyService", name: "Loyalty Ledger Engine", type: "SERVICE", system: "Backend Service", domain: "Loyalty", file: "apps/backend/src/services/loyalty.service.ts", duration: 30, metadata: { icon: "award", color: "purple", x: 750, y: 120 } },

  // Repositories
  OrderRepository: { id: "OrderRepository", name: "Order SQL Repository", type: "REPOSITORY", system: "Backend DB Adapter", domain: "Orders", file: "apps/backend/src/repositories/order.repository.ts", duration: 15, metadata: { icon: "database", color: "pink", x: 650, y: 200 } },
  LoyaltyRepository: { id: "LoyaltyRepository", name: "Loyalty Point Repository", type: "REPOSITORY", system: "Backend DB Adapter", domain: "Loyalty", file: "apps/backend/src/repositories/loyalty.repository.ts", duration: 12, metadata: { icon: "database", color: "pink", x: 800, y: 150 } },

  // Databases & Caching
  PostgreSQL: { id: "PostgreSQL", name: "PostgreSQL Database Writer", type: "DATABASE", system: "Database", domain: "Database", file: "prisma/schema.prisma", duration: 30, metadata: { icon: "hard-drive", color: "red", x: 750, y: 200 } },
  RedisCache: { id: "RedisCache", name: "Redis Memory Cache", type: "CACHE", system: "Database", domain: "Caching", file: "apps/backend/src/middleware/rateLimiter.ts", duration: 3, metadata: { icon: "zap", color: "red", x: 250, y: 100 } },

  // Events & Queues
  OrderCreatedEvent: { id: "OrderCreatedEvent", name: "OrderCreated Event Emit", type: "EVENT", system: "Backend Events", domain: "Orders", file: "apps/backend/src/events/emitters.ts", duration: 5, metadata: { icon: "activity", color: "magenta", x: 820, y: 220 } },
  RedisQueue: { id: "RedisQueue", name: "BullMQ Redis Queue Broker", type: "QUEUE", system: "Infrastructure Queue", domain: "Queues", file: "apps/backend/src/queues/order.queue.ts", duration: 10, metadata: { icon: "layers", color: "indigo", x: 880, y: 250 } },
  NotificationWorker: { id: "NotificationWorker", name: "BullMQ Notification Worker", type: "WORKER", system: "Background Worker", domain: "Queues", file: "apps/backend/src/workers/notification.worker.ts", duration: 80, metadata: { icon: "cpu", color: "indigo", x: 920, y: 300 } },

  // External APIs
  TwilioSMS: { id: "TwilioSMS", name: "Twilio SMS Dispatcher", type: "WEBHOOK", system: "External Network", domain: "Third-Party", file: "apps/backend/src/services/notification.service.ts", duration: 480, metadata: { icon: "external-link", color: "darkblue", x: 980, y: 350 } },
  StripeGateway: { id: "StripeGateway", name: "Stripe Payment Gateway", type: "EXTERNAL", system: "External Network", domain: "Third-Party", file: "apps/backend/src/services/payment.service.ts", duration: 520, metadata: { icon: "external-link", color: "darkblue", x: 620, y: 380 } },
  DunzoDispatcher: { id: "DunzoDispatcher", name: "Dunzo Dispatch Matching Service", type: "EXTERNAL", system: "External Network", domain: "Third-Party", file: "apps/backend/src/services/delivery.service.ts", duration: 450, metadata: { icon: "external-link", color: "darkblue", x: 680, y: 440 } },

  // Admin Panels & POS
  AdminDashboard: { id: "AdminDashboard", name: "Admin Dashboard Panel", type: "ADMIN", system: "Admin Web Panel", domain: "Analytics", file: "apps/admin/components/OrderTable.tsx", duration: 40, metadata: { icon: "monitor", color: "grey", x: 850, y: 50 } },
  KitchenPOS: { id: "KitchenPOS", name: "Kitchen POS Thermal Printer", type: "POS", system: "POS Printer", domain: "POS", file: "apps/backend/src/services/pos.service.ts", duration: 150, metadata: { icon: "printer", color: "black", x: 980, y: 200 } }
};

/**
 * Resolves triggers to chronological runtime execution chains.
 * 
 * @param {string} trigger 
 * @returns {Object[]} Chronological runtime nodes
 */
export function discoverRuntimePath(trigger = "PLACE_ORDER") {
  const clean = String(trigger).toUpperCase();
  const db = NODE_DATABASE;

  if (clean === "PLACE_ORDER" || clean === "PAYMENT_SUCCESS") {
    return [
      db.CheckoutScreen,
      db.OrderProvider,
      db.OrderServiceClient,
      db.POST_Orders,
      db.OrderController,
      db.PaymentService,
      db.StripeGateway,
      db.OrderRepository,
      db.PostgreSQL,
      db.OrderCreatedEvent,
      db.RedisQueue,
      db.NotificationWorker,
      db.TwilioSMS,
      db.KitchenPOS,
      db.AdminDashboard
    ];
  }

  if (clean === "LOGIN") {
    return [
      db.LoginScreen,
      db.AuthProvider,
      db.AuthServiceClient,
      db.POST_AuthLogin,
      db.AuthController,
      db.RedisCache
    ];
  }

  if (clean === "ADD_TO_CART") {
    return [
      db.BurgerCardWidget,
      db.CartProvider,
      db.CartProvider,
      db.RedisCache
    ];
  }

  if (clean === "PAYMENT_FAILURE") {
    return [
      db.CheckoutScreen,
      db.OrderProvider,
      db.POST_Orders,
      db.OrderController,
      db.PaymentService,
      db.StripeGateway,
      db.CheckoutErrorWidget
    ];
  }

  if (clean === "REFUND" || clean === "ADMIN_REFUND") {
    return [
      db.AdminDashboard,
      db.POST_AdminRefund,
      db.AdminController,
      db.PaymentService,
      db.StripeGateway,
      db.OrderRepository,
      db.PostgreSQL,
      db.LoyaltyService,
      db.LoyaltyRepository,
      db.UserWalletWidget
    ];
  }

  if (clean === "ORDER_CANCELLED") {
    return [
      db.CheckoutScreen,
      db.OrderProvider,
      db.POST_Orders,
      db.OrderController,
      db.InventoryService,
      db.OrderRepository,
      db.PostgreSQL,
      db.NotificationWorker,
      db.TwilioSMS
    ];
  }

  if (clean === "DELIVERY_ASSIGNED") {
    return [
      db.AdminDashboard,
      db.AdminController,
      db.DunzoDispatcher,
      db.OrderRepository,
      db.PostgreSQL,
      db.NotificationWorker,
      db.TwilioSMS
    ];
  }

  if (clean === "LOYALTY_REWARD") {
    return [
      db.OrderCreatedEvent,
      db.LoyaltyService,
      db.LoyaltyRepository,
      db.UserWalletWidget
    ];
  }

  if (clean === "POS_PRINT") {
    return [
      db.OrderCreatedEvent,
      db.RedisQueue,
      db.KitchenPOS
    ];
  }

  // Fallback default path
  return [
    db.CheckoutScreen,
    db.OrderProvider,
    db.POST_Orders,
    db.PostgreSQL
  ];
}

/**
 * Maps each node to its respective physical file path and pedagogical explainer analogy.
 * 
 * @param {Object[]} runtimePath 
 * @returns {Object[]} File maps
 */
export function mapFiles(runtimePath = []) {
  return runtimePath.map(node => {
    let analogy = "Standard system component.";
    if (node.type === "SCREEN") analogy = "The front window of the store displaying items.";
    else if (node.type === "PROVIDER") analogy = "The whiteboard keeping track of the current order status.";
    else if (node.type === "API") analogy = "The waiter taking order slips to the kitchen.";
    else if (node.type === "CONTROLLER") analogy = "The kitchen expeditor organizing orders as they arrive.";
    else if (node.type === "SERVICE") analogy = "The head chef executing business recipes (calculating prices, processing cards).";
    else if (node.type === "REPOSITORY") analogy = "The file clerk pulling records from safety drawers.";
    else if (node.type === "DATABASE") analogy = "The physical steel vault preserving accounting ledger tickets.";
    else if (node.type === "QUEUE") analogy = "The queue line buffer holding alert receipts until workers process them.";
    else if (node.type === "WORKER") analogy = "The delivery driver pulling orders off the rack to take them to Twilio network.";

    return {
      nodeId: node.id,
      path: node.file,
      role: node.type,
      explanation: analogy
    };
  });
}

/**
 * Lists active business logic services.
 * 
 * @param {Object[]} runtimePath 
 * @returns {string[]} Active services
 */
export function mapServices(runtimePath = []) {
  return Array.from(new Set(
    runtimePath.filter(n => n.type === "SERVICE").map(n => n.name)
  ));
}

/**
 * Lists active data repository adapters.
 * 
 * @param {Object[]} runtimePath 
 * @returns {string[]} Active repositories
 */
export function mapRepositories(runtimePath = []) {
  return Array.from(new Set(
    runtimePath.filter(n => n.type === "REPOSITORY").map(n => n.name)
  ));
}

/**
 * Maps event producers and consumers based on trigger.
 * 
 * @param {string} trigger 
 * @returns {Object[]} Event maps
 */
export function mapEvents(trigger = "PLACE_ORDER") {
  const clean = String(trigger).toUpperCase();
  
  if (clean === "PLACE_ORDER") {
    return [
      { event: "OrderCreated", producer: "OrderController", consumers: ["RedisQueue", "NotificationWorker", "KitchenPOS"] }
    ];
  }
  if (clean === "REFUND") {
    return [
      { event: "RefundIssued", producer: "AdminController", consumers: ["LoyaltyService", "UserWalletWidget"] }
    ];
  }
  return [
    { event: "StandardEvent", producer: "BackendService", consumers: ["ObservabilityScanner"] }
  ];
}

/**
 * Lists target databases involved.
 * 
 * @param {Object[]} runtimePath 
 * @returns {string[]} Active databases
 */
export function mapDatabases(runtimePath = []) {
  return Array.from(new Set(
    runtimePath.filter(n => n.type === "DATABASE" || n.type === "CACHE").map(n => n.name)
  ));
}

/**
 * Lists active external network integrations.
 * 
 * @param {string} trigger 
 * @returns {string[]} External systems
 */
export function mapExternalSystems(trigger = "PLACE_ORDER") {
  const path = discoverRuntimePath(trigger);
  return Array.from(new Set(
    path.filter(n => n.type === "EXTERNAL" || n.type === "WEBHOOK").map(n => n.name)
  ));
}

/**
 * Maps cascading timeout failure flows and SRE recovery rules.
 * 
 * @param {string} trigger 
 * @returns {Object} Failure path model
 */
export function buildFailurePaths(trigger = "PLACE_ORDER") {
  const clean = String(trigger).toUpperCase();

  if (clean === "PLACE_ORDER" || clean === "PAYMENT_FAILURE") {
    return {
      source: "StripeGateway Payment Gateway Timeout",
      failure: "Stripe API hangs, causing CheckoutController write thread blocks and PostgreSQL pool saturation.",
      recovery: "Implement Stripe timeout flags (max 5000ms), emit 'PaymentFailureEvent' to revert inventory stock counts, transition checkout tickets to 'FAILED', and retry webhook verification asynchronously."
    };
  }

  if (clean === "POS_PRINT") {
    return {
      source: "KitchenPOS Thermal Printer Offline",
      failure: "Thermal printer runs out of paper or shuts down, dropping ticket requests.",
      recovery: "Buffer print jobs inside BullMQ Redis queue, configure workers to ping printer check-status endpoint every 30s, and replay accumulated queue buffer once printer status reports online."
    };
  }

  // Redis Crash
  return {
    source: "Redis instance crash",
    failure: "BullMQ background task workers disconnect, halting alert deliveries.",
    recovery: "Ensure Redis AOF persistence is active to reload queue state, configure Express to fallback to SQLite local file storage during Redis downtime, and drain local SQLite logs once Redis reconnects."
  };
}

/**
 * Details alternative paths (success, cancellation, refund).
 * 
 * @param {string} trigger 
 * @returns {Object[]} Alternative paths
 */
export function buildAlternativePaths(trigger = "PLACE_ORDER") {
  return [
    {
      name: "Success Workflow",
      path: ["CheckoutScreen", "OrderProvider", "POST_Orders", "PaymentService", "PostgreSQL", "OrderCreatedEvent", "KitchenPOS"]
    },
    {
      name: "Cancellation Workflow",
      path: ["CheckoutScreen", "OrderProvider", "POST_Orders", "InventoryService", "OrderRepository", "PostgreSQL"]
    },
    {
      name: "Refund/Chargeback Workflow",
      path: ["AdminDashboard", "POST_AdminRefund", "PaymentService", "StripeGateway", "OrderRepository", "PostgreSQL"]
    }
  ];
}

/**
 * Estimates minimum, average, and p95 latency timings, isolating bottlenecks.
 * 
 * @param {Object[]} runtimePath 
 * @returns {Object} Latency analysis
 */
export function estimateLatency(runtimePath = []) {
  let minLatency = 0;
  let avgLatency = 0;
  let p95Latency = 0;
  const bottlenecks = [];

  runtimePath.forEach(node => {
    // Screen/widget components carry negligible latency
    if (node.type === "SCREEN" || node.type === "WIDGET") {
      minLatency += 2;
      avgLatency += node.duration;
      p95Latency += node.duration * 1.5;
    } else if (node.type === "EXTERNAL" || node.type === "WEBHOOK") {
      // External API latency
      minLatency += 150;
      avgLatency += node.duration;
      p95Latency += node.duration * 2;
      if (node.duration >= 200) {
        bottlenecks.push(`${node.name} (${node.duration}ms): External network roundtrip represents a latency risk.`);
      }
    } else {
      // Internal backend nodes
      minLatency += Math.max(1, Math.round(node.duration / 3));
      avgLatency += node.duration;
      p95Latency += node.duration * 1.8;
      if (node.duration >= 100) {
        bottlenecks.push(`${node.name} (${node.duration}ms): Slow internal process blocks event loops.`);
      }
    }
  });

  return {
    minLatency: Math.round(minLatency),
    avgLatency: Math.round(avgLatency),
    p95Latency: Math.round(p95Latency),
    bottlenecks: bottlenecks
  };
}

/**
 * Compiles upstream/downstream relationships chronologically.
 * 
 * @param {Object[]} runtimePath 
 * @returns {Object[]} Upstream and downstream links
 */
export function buildDependencyLinks(runtimePath = []) {
  const links = [];
  
  for (let i = 0; i < runtimePath.length; i++) {
    const node = runtimePath[i];
    const upstream = i > 0 ? [runtimePath[i - 1].id] : [];
    const downstream = i < runtimePath.length - 1 ? [runtimePath[i + 1].id] : [];
    
    links.push({
      id: node.id,
      name: node.name,
      upstream: upstream,
      downstream: downstream,
      next: downstream.length > 0 ? downstream[0] : null
    });
  }

  return links;
}

/**
 * Prepares animation coordinates, icons, color tokens, and delays.
 * 
 * @param {Object[]} runtimePath 
 * @returns {Object[]} Animation metadata
 */
export function addAnimationMetadata(runtimePath = []) {
  return runtimePath.map((node, index) => {
    return {
      nodeId: node.id,
      x: node.metadata?.x || 50 + index * 100,
      y: node.metadata?.y || 200,
      icon: node.metadata?.icon || "layout",
      color: node.metadata?.color || "blue",
      delayMs: index * 150
    };
  });
}

/**
 * Main entry: analyzes trigger inputs and maps system runtime traversals.
 * 
 * @param {string} trigger - User action trigger
 * @returns {Object} Comprehensive runtime linking payload
 */
export function linkRuntime(trigger = "PLACE_ORDER") {
  const path = discoverRuntimePath(trigger);
  
  const files = mapFiles(path);
  const services = mapServices(path);
  const repositories = mapRepositories(path);
  const events = mapEvents(trigger);
  const databases = mapDatabases(path);
  const externalSystems = mapExternalSystems(trigger);
  const failures = buildFailurePaths(trigger);
  const alternatives = buildAlternativePaths(trigger);
  const latency = estimateLatency(path);
  const dependencies = buildDependencyLinks(path);
  const animation = addAnimationMetadata(path);

  return {
    trigger: trigger,
    runtimePath: path.map(n => n.name),
    runtimeNodes: path,
    files: files,
    services: services,
    repositories: repositories,
    databases: databases,
    queues: path.filter(n => n.type === "QUEUE").map(n => n.name),
    workers: path.filter(n => n.type === "WORKER").map(n => n.name),
    events: events,
    externalSystems: externalSystems,
    failurePaths: [failures],
    alternativePaths: alternatives,
    latency: latency,
    dependencies: dependencies,
    animationMetadata: animation
  };
}
