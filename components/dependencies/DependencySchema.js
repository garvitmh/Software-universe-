export const DEPENDENCY_SCHEMA = {
  services: [
    {
      id: "payment",
      name: "Payment Gateway",
      desc: "Stripe interface mapping and webhook validations.",
      x: 100,
      y: 100,
      criticality: "high",
      type: "service"
    },
    {
      id: "orders",
      name: "Orders Service",
      desc: "Core business transaction processing and database coordinator.",
      x: 320,
      y: 200,
      criticality: "high",
      type: "service"
    },
    {
      id: "inventory",
      name: "Inventory Service",
      desc: "Stock reservation and supply checks.",
      x: 540,
      y: 100,
      criticality: "medium",
      type: "service"
    },
    {
      id: "pos",
      name: "POS Service",
      desc: "Local kitchen printing systems dispatcher.",
      x: 540,
      y: 300,
      criticality: "high",
      type: "service"
    },
    {
      id: "notifications",
      name: "Notification Push",
      desc: "User status messages and email webhooks.",
      x: 100,
      y: 300,
      criticality: "low",
      type: "service"
    },
    {
      id: "analytics",
      name: "Analytics Service",
      desc: "Business reporting and funnel calculations.",
      x: 320,
      y: 400,
      criticality: "low",
      type: "service"
    },
    {
      id: "admin",
      name: "Admin Panel CRUD",
      desc: "Manager override panel and menu management.",
      x: 540,
      y: 450,
      criticality: "low",
      type: "service"
    }
  ],
  edges: [
    {
      from: "orders",
      to: "payment",
      type: "synchronous",
      label: "Charge Checkout",
      sync: true,
      retryable: false,
      fallback: "None (order fails)"
    },
    {
      from: "orders",
      to: "inventory",
      type: "synchronous",
      label: "Reserve Stock",
      sync: true,
      retryable: true,
      fallback: "Allow ordering (oversell risk)"
    },
    {
      from: "orders",
      to: "pos",
      type: "asynchronous",
      label: "Print Ticket Queue",
      sync: false,
      retryable: true,
      fallback: "Buffer in Redis queue"
    },
    {
      from: "orders",
      to: "notifications",
      type: "webhook",
      label: "Send Success SMS",
      sync: false,
      retryable: true,
      fallback: "Log failure; retry later"
    },
    {
      from: "orders",
      to: "analytics",
      type: "replica",
      label: "Sync Order Events",
      sync: false,
      retryable: true,
      fallback: "Buffered CDC logs"
    },
    {
      from: "admin",
      to: "inventory",
      type: "synchronous",
      label: "Query Stock levels",
      sync: true,
      retryable: true,
      fallback: "Display cached stock"
    },
    {
      from: "admin",
      to: "analytics",
      type: "database",
      label: "Fetch Sales Reports",
      sync: true,
      retryable: false,
      fallback: "Fail dashboard load"
    }
  ]
};
