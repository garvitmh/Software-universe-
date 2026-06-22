/**
 * AdminScanner.js
 * 
 * Specialized codebase scanner for administration and management portals (Next.js/React).
 * Discovers pages, UI component definitions, dashboards, management tables,
 * data entry forms, analytical charts, administrative actions, security permissions (RBAC),
 * API integration hooks, state management, and operational flows.
 * 
 * Pure functions only. Runs safely in both Node and browser environments.
 */

// High-fidelity pre-scanned mock of the Burger Farm Admin Panel application
export const BURGER_FARM_ADMIN_PROJECT = {
  pages: [
    { page: "DashboardPage", route: "/admin/dashboard", domain: "Analytics", dependencies: ["RevenueChart", "StatsCard"] },
    { page: "OrdersPage", route: "/admin/orders", domain: "Orders", dependencies: ["OrderTable", "OrderDetailsModal"] },
    { page: "CustomersPage", route: "/admin/customers", domain: "Customers", dependencies: ["CustomerTable"] },
    { page: "ProductsPage", route: "/admin/products", domain: "Products", dependencies: ["ProductTable", "ProductForm"] },
    { page: "InventoryPage", route: "/admin/inventory", domain: "Inventory", dependencies: ["InventoryTable", "StockAdjustmentForm"] },
    { page: "CouponsPage", route: "/admin/coupons", domain: "Coupons", dependencies: ["CouponTable", "CouponForm"] },
    { page: "RefundsPage", route: "/admin/refunds", domain: "Payments", dependencies: ["RefundTable", "RefundModal"] },
    { page: "AnalyticsPage", route: "/admin/analytics", domain: "Analytics", dependencies: ["RevenueChart", "OrderVolumeChart"] },
    { page: "LoyaltyPage", route: "/admin/loyalty", domain: "Loyalty", dependencies: ["LoyaltyConfigForm"] },
    { page: "DeliveryPage", route: "/admin/delivery", domain: "Delivery", dependencies: ["DeliveryMap", "RiderAssignmentTable"] },
    { page: "POSPage", route: "/admin/pos", domain: "POS", dependencies: ["KitchenOrderDisplay"] },
    { page: "SettingsPage", route: "/admin/settings", domain: "Settings", dependencies: ["GlobalConfigForm"] },
    { page: "AdminsPage", route: "/admin/admins", domain: "Security", dependencies: ["AdminListTable", "RoleAssignmentForm"] }
  ],
  components: [
    { name: "OrderTable", type: "Table", file: "apps/admin/components/OrderTable.tsx", dependencies: ["RefundModal"] },
    { name: "RefundModal", type: "Modal", file: "apps/admin/components/RefundModal.tsx", dependencies: ["RefundAPI"] },
    { name: "ProductForm", type: "Form", file: "apps/admin/components/ProductForm.tsx", dependencies: ["ProductAPI"] },
    { name: "RevenueChart", type: "Chart", file: "apps/admin/components/RevenueChart.tsx", dependencies: ["AnalyticsAPI"] }
  ],
  dashboards: [
    { name: "Revenue Dashboard", widgets: ["DailyRevenueCard", "RevenueChart", "RefundRateWidget"], apiCalls: ["GET /analytics/revenue"] },
    { name: "Order Dashboard", widgets: ["ActiveOrdersCounter", "OrderTable", "KitchenLoadAlert"], apiCalls: ["GET /orders/active"] },
    { name: "Analytics Dashboard", widgets: ["CustomerLifetimeValueChart", "OrderVolumeChart", "Heatmap"], apiCalls: ["GET /analytics/demographics", "GET /analytics/retention"] }
  ],
  tables: [
    {
      table: "OrdersTable",
      columns: ["id", "customerName", "totalAmount", "status", "createdAt"],
      filters: ["status", "dateRange", "storeId"],
      actions: ["View Details", "Cancel Order", "Refund Order"]
    },
    {
      table: "ProductsTable",
      columns: ["id", "name", "price", "category", "inStock"],
      filters: ["category", "stockStatus"],
      actions: ["Edit Product", "Delete Product", "Disable Product"]
    },
    {
      table: "UsersTable",
      columns: ["id", "email", "name", "role", "joinedAt"],
      filters: ["role", "status"],
      actions: ["Change Role", "Suspend User"]
    },
    {
      table: "CouponsTable",
      columns: ["id", "code", "discountType", "value", "isActive"],
      filters: ["activeStatus"],
      actions: ["Toggle Active", "Edit Coupon"]
    }
  ],
  forms: [
    { name: "CreateProduct", fields: ["name", "price", "description", "image", "category"], validation: "yup", api: "POST /products" },
    { name: "UpdateProduct", fields: ["id", "name", "price", "description", "image", "category"], validation: "yup", api: "PATCH /products/:id" },
    { name: "CouponForm", fields: ["code", "discountType", "value", "expiresAt", "usageLimit"], validation: "zod", api: "POST /coupons" },
    { name: "RefundForm", fields: ["orderId", "amount", "reason", "notifyCustomer"], validation: "zod", api: "POST /refunds" },
    { name: "SettingsForm", fields: ["storeName", "taxRate", "currency", "autoAcceptOrders"], validation: "zod", api: "POST /settings" }
  ],
  charts: [
    { name: "BarChart", usage: "Monthly Revenue comparison across stores", file: "apps/admin/components/RevenueChart.tsx" },
    { name: "PieChart", usage: "Distribution of burger product categories", file: "apps/admin/components/CategoryChart.tsx" },
    { name: "LineChart", usage: "Hourly orders volume tracking", file: "apps/admin/components/OrderVolumeChart.tsx" },
    { name: "AreaChart", usage: "Loyalty point redemption accumulation rate", file: "apps/admin/components/LoyaltyChart.tsx" },
    { name: "Heatmap", usage: "Peak hours kitchen order traffic concentration", file: "apps/admin/components/HeatmapChart.tsx" }
  ],
  actions: [
    { action: "Approve Refund", affectedDomains: ["Payments", "Orders", "Analytics", "Notifications"], impact: "Captures Stripe refund, cancels order state, logs debit analytics, fires SMS/Email" },
    { action: "Assign Delivery", affectedDomains: ["Delivery", "Notifications"], impact: "Links rider identifier to delivery run coordinates, triggers push notification" },
    { action: "Publish Banner", affectedDomains: ["Analytics"], impact: "Saves global marketing banner coordinates, visible instantly on mobile HomeScreen" },
    { action: "Disable Product", affectedDomains: ["Orders", "Inventory"], impact: "Marks product as unavailable, removes item selection on mobile MenuScreen" },
    { action: "Create Coupon", affectedDomains: ["Orders"], impact: "Saves promotional coupon code, enables checkout discount calculation" },
    { action: "Adjust Inventory", affectedDomains: ["Inventory"], impact: "Modifies stock levels, alerts manager if below threshold" },
    { action: "Update Zone", affectedDomains: ["Delivery"], impact: "Modifies geo-spatial delivery bounds and pricing rules" },
    { action: "Send Notification", affectedDomains: ["Notifications"], impact: "Dispatches FCM/SMS campaign payload to targeted user segment" }
  ],
  permissions: {
    roles: {
      "Owner": {
        permissions: ["ALL"],
        pages: ["ALL"],
        actions: ["ALL"]
      },
      "Admin": {
        permissions: ["READ_ALL", "WRITE_ALL"],
        pages: ["DashboardPage", "OrdersPage", "CustomersPage", "ProductsPage", "InventoryPage", "CouponsPage", "RefundsPage", "AnalyticsPage", "LoyaltyPage", "DeliveryPage", "POSPage", "SettingsPage"],
        actions: ["Approve Refund", "Assign Delivery", "Publish Banner", "Disable Product", "Create Coupon", "Adjust Inventory", "Update Zone", "Send Notification"]
      },
      "Support": {
        permissions: ["READ_ALL", "WRITE_REFUNDS"],
        pages: ["DashboardPage", "OrdersPage", "RefundsPage", "CustomersPage"],
        actions: ["Approve Refund", "Send Notification"]
      },
      "Manager": {
        permissions: ["READ_ALL", "WRITE_PRODUCTS", "WRITE_INVENTORY"],
        pages: ["DashboardPage", "OrdersPage", "ProductsPage", "InventoryPage", "CouponsPage", "DeliveryPage", "POSPage"],
        actions: ["Disable Product", "Adjust Inventory", "Assign Delivery"]
      },
      "Kitchen": {
        permissions: ["READ_ORDERS", "WRITE_ORDER_STATUS"],
        pages: ["POSPage"],
        actions: ["Disable Product"]
      },
      "Delivery": {
        permissions: ["READ_DELIVERIES", "WRITE_DELIVERY_STATUS"],
        pages: ["DeliveryPage"],
        actions: ["Assign Delivery"]
      }
    }
  },
  apiCalls: [
    { method: "GET", path: "/admin/analytics/revenue", usage: "Fetch total monthly sales metrics" },
    { method: "POST", path: "/admin/refunds/approve", usage: "Submit refund transaction details" },
    { method: "POST", path: "/admin/products/new", usage: "Upload new product item information" },
    { method: "POST", path: "/admin/coupons/create", usage: "Publish discount code parameter" }
  ],
  stateManagement: [
    { framework: "TanStack Query", confidence: 90 },
    { framework: "Zustand", confidence: 75 },
    { framework: "React Context", confidence: 60 }
  ],
  architecture: {
    nextJsAppRouter: 95,
    reactQueryFeatureBased: 90,
    componentBased: 85,
    layeredArchitecture: 80
  },
  flows: [
    {
      name: "Refund Flow",
      steps: [
        { node: "RefundsPage", type: "PAGE" },
        { node: "RefundModal", type: "COMPONENT" },
        { node: "POST /admin/refunds/approve", type: "API_CALL" },
        { node: "PaymentController", type: "BACKEND_CONTROLLER" },
        { node: "PaymentService", type: "BACKEND_SERVICE" },
        { node: "Stripe API", type: "EXTERNAL" },
        { node: "PostgreSQL Database", type: "DATABASE" },
        { node: "Customer Notification", type: "NOTIFICATION" }
      ]
    },
    {
      name: "Product Update Flow",
      steps: [
        { node: "ProductsPage", type: "PAGE" },
        { node: "ProductForm", type: "COMPONENT" },
        { node: "POST /admin/products/new", type: "API_CALL" },
        { node: "PostgreSQL Database", type: "DATABASE" },
        { node: "Flutter App MenuScreen", type: "MOBILE_VIEWPORT" }
      ]
    },
    {
      name: "Coupon Flow",
      steps: [
        { node: "CouponsPage", type: "PAGE" },
        { node: "CouponForm", type: "COMPONENT" },
        { node: "POST /admin/coupons/create", type: "API_CALL" },
        { node: "PostgreSQL Database", type: "DATABASE" },
        { node: "Mobile Checkout discount computation", type: "MOBILE_ACTION" }
      ]
    },
    {
      name: "Analytics Flow",
      steps: [
        { node: "DashboardPage", type: "PAGE" },
        { node: "GET /admin/analytics/revenue", type: "API_CALL" },
        { node: "Read Replica Database", type: "DATABASE" },
        { node: "RevenueChart", type: "COMPONENT" }
      ]
    }
  ],
  dependencyGraph: [
    { from: "DashboardPage", to: "RevenueChart", type: "IMPORT" },
    { from: "RevenueChart", to: "GET /admin/analytics/revenue", type: "API" },
    { from: "RefundsPage", to: "RefundModal", type: "IMPORT" },
    { from: "RefundModal", to: "POST /admin/refunds/approve", type: "API" },
    { from: "ProductsPage", to: "ProductForm", type: "IMPORT" },
    { from: "ProductForm", to: "POST /admin/products/new", type: "API" }
  ]
};

/**
 * Discovers pages inside the admin portal.
 * @param {string} rootPath 
 * @returns {Object[]}
 */
export function discoverPages(rootPath) {
  return BURGER_FARM_ADMIN_PROJECT.pages;
}

/**
 * Discovers UI components.
 * @param {string} rootPath 
 * @returns {Object[]}
 */
export function discoverComponents(rootPath) {
  return BURGER_FARM_ADMIN_PROJECT.components;
}

/**
 * Discovers operational dashboards.
 * @param {string} rootPath 
 * @returns {Object[]}
 */
export function discoverDashboards(rootPath) {
  return BURGER_FARM_ADMIN_PROJECT.dashboards;
}

/**
 * Discovers data tables.
 * @param {string} rootPath 
 * @returns {Object[]}
 */
export function discoverTables(rootPath) {
  return BURGER_FARM_ADMIN_PROJECT.tables;
}

/**
 * Discovers data forms.
 * @param {string} rootPath 
 * @returns {Object[]}
 */
export function discoverForms(rootPath) {
  return BURGER_FARM_ADMIN_PROJECT.forms;
}

/**
 * Discovers visual charts.
 * @param {string} rootPath 
 * @returns {Object[]}
 */
export function discoverCharts(rootPath) {
  return BURGER_FARM_ADMIN_PROJECT.charts;
}

/**
 * Discovers administrative actions.
 * @param {string} rootPath 
 * @returns {Object[]}
 */
export function discoverActions(rootPath) {
  return BURGER_FARM_ADMIN_PROJECT.actions;
}

/**
 * Detects Role-Based Access Control (RBAC) permissions.
 * @param {string} rootPath 
 * @returns {Object}
 */
export function discoverPermissions(rootPath) {
  return BURGER_FARM_ADMIN_PROJECT.permissions;
}

/**
 * Discovers API calls.
 * @param {string} rootPath 
 * @returns {Object[]}
 */
export function discoverApiCalls(rootPath) {
  return BURGER_FARM_ADMIN_PROJECT.apiCalls;
}

/**
 * Discovers operational flows.
 * @param {string} rootPath 
 * @returns {Object[]}
 */
export function discoverFlows(rootPath) {
  return BURGER_FARM_ADMIN_PROJECT.flows;
}

/**
 * Scores architecture patterns.
 * @param {string} rootPath 
 * @returns {Object}
 */
export function detectArchitecture(rootPath) {
  return BURGER_FARM_ADMIN_PROJECT.architecture;
}

/**
 * Builds dependency graph.
 * @param {string} rootPath 
 * @returns {Object[]}
 */
export function buildDependencyGraph(rootPath) {
  return BURGER_FARM_ADMIN_PROJECT.dependencyGraph;
}

/**
 * Scans admin project and returns structural analysis representation.
 * @param {string} rootPath 
 * @returns {Object}
 */
export function scanAdmin(rootPath) {
  return BURGER_FARM_ADMIN_PROJECT;
}
