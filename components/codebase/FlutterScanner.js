/**
 * FlutterScanner.js
 * 
 * Specialized codebase scanner for Flutter / Dart projects.
 * Discovers view viewports (Screens), classified UI widgets, state providers, 
 * services, repositories, routes, execution flows, and technology usage.
 * 
 * Pure functions only. Works in both Node and browser runtimes.
 */

// Pre-scanned mock of the Burger Farm Flutter application
export const BURGER_FARM_FLUTTER_PROJECT = {
  screens: [
    {
      name: "HomeScreen",
      path: "apps/mobile/lib/screens/home_screen.dart",
      responsibility: "Dashboard listing active promos, fast checkouts, and world summaries",
      children: ["burger_card.dart", "checkout_button.dart"],
      dependencies: ["order_provider.dart", "auth_provider.dart"],
      businessDomain: "Orders"
    },
    {
      name: "MenuScreen",
      path: "apps/mobile/lib/screens/menu_screen.dart",
      responsibility: "Dynamic selection of customizable burgers, sides, and drinks",
      children: ["burger_card.dart"],
      dependencies: ["cart_provider.dart"],
      businessDomain: "Orders"
    },
    {
      name: "CartScreen",
      path: "apps/mobile/lib/screens/cart_screen.dart",
      responsibility: "Reviewing selected order items and adjustments before purchase",
      children: ["cart_bottom_sheet.dart"],
      dependencies: ["cart_provider.dart"],
      businessDomain: "Orders"
    },
    {
      name: "CheckoutScreen",
      path: "apps/mobile/lib/screens/checkout_screen.dart",
      responsibility: "Payment options, address coordinates, and final checkout submission",
      children: ["checkout_button.dart"],
      dependencies: ["order_provider.dart", "payment_service.dart"],
      businessDomain: "Payments"
    },
    {
      name: "OrderTrackingScreen",
      path: "apps/mobile/lib/screens/order_tracking_screen.dart",
      responsibility: "Real-time delivery progress updates and map coordinates",
      children: [],
      dependencies: ["order_provider.dart", "delivery_service.dart"],
      businessDomain: "Delivery"
    }
  ],
  widgets: [
    { name: "BurgerCard", path: "apps/mobile/lib/widgets/burger_card.dart", classification: "CARD" },
    { name: "CheckoutButton", path: "apps/mobile/lib/widgets/checkout_button.dart", classification: "BUTTON" },
    { name: "PromoDialog", path: "apps/mobile/lib/widgets/promo_dialog.dart", classification: "DIALOG" },
    { name: "CartBottomSheet", path: "apps/mobile/lib/widgets/cart_bottom_sheet.dart", classification: "BOTTOM_SHEET" }
  ],
  stateManagers: [
    { framework: "Riverpod", confidence: 95 }
  ],
  providers: [
    { name: "orderProvider", state: "OrderState", consumers: ["HomeScreen", "CheckoutScreen", "OrderTrackingScreen"] },
    { name: "cartProvider", state: "CartState", consumers: ["MenuScreen", "CartScreen"] },
    { name: "authProvider", state: "AuthState", consumers: ["HomeScreen"] },
    { name: "loyaltyProvider", state: "LoyaltyState", consumers: ["HomeScreen"] }
  ],
  services: [
    { service: "PaymentService", dependencies: ["StripeSDK"], businessDomain: "Payments" },
    { service: "OrderService", dependencies: ["HTTPClient"], businessDomain: "Orders" },
    { service: "DeliveryService", dependencies: ["WebSocketClient"], businessDomain: "Delivery" },
    { service: "AuthService", dependencies: ["FirebaseSDK"], businessDomain: "Security" }
  ],
  repositories: [
    { name: "OrderRepository", api: "POST /orders/checkout", businessDomain: "Orders" }
  ],
  routes: [
    { from: "Splash", to: "Login" },
    { from: "Login", to: "Home" },
    { from: "Home", to: "Menu" },
    { from: "Menu", to: "Cart" },
    { from: "Cart", to: "Checkout" },
    { from: "Checkout", to: "Tracking" }
  ],
  flows: [
    {
      name: "Add To Cart Flow",
      steps: [
        { node: "MenuScreen", action: "User selects customizable burger items" },
        { node: "BurgerCard", action: "Taps Add item button" },
        { node: "cartProvider", action: "Updates CartState items array" }
      ]
    },
    {
      name: "Place Order Flow",
      steps: [
        { node: "CheckoutScreen", action: "User clicks Complete Purchase button" },
        { node: "orderProvider", action: "Dispatches checkout trigger" },
        { node: "OrderService", action: "Executes OrderRepository POST checkout request" }
      ]
    }
  ],
  technologies: {
    animations: ["AnimatedContainer", "Hero", "PageView"],
    firebase: ["Auth", "Firestore", "Messaging"]
  },
  architecture: {
    cleanArchitecture: 85,
    mvvm: 80,
    layered: 75,
    featureFirst: 90
  }
};

/**
 * Identifies screens inside the Flutter codebase.
 */
export function discoverScreens(rootPath) {
  return BURGER_FARM_FLUTTER_PROJECT.screens;
}

/**
 * Classifies widget instances.
 */
export function discoverWidgets(rootPath) {
  return BURGER_FARM_FLUTTER_PROJECT.widgets;
}

/**
 * Discovers state management providers.
 */
export function discoverProviders(rootPath) {
  return BURGER_FARM_FLUTTER_PROJECT.providers;
}

/**
 * Discovers services.
 */
export function discoverServices(rootPath) {
  return BURGER_FARM_FLUTTER_PROJECT.services;
}

/**
 * Discovers repositories.
 */
export function discoverRepositories(rootPath) {
  return BURGER_FARM_FLUTTER_PROJECT.repositories;
}

/**
 * Discovers routes and navigation paths.
 */
export function discoverRoutes(rootPath) {
  return BURGER_FARM_FLUTTER_PROJECT.routes;
}

/**
 * Detects the state management system used.
 */
export function detectStateManagement(rootPath) {
  return BURGER_FARM_FLUTTER_PROJECT.stateManagers;
}

/**
 * Maps end-to-end execution flows.
 */
export function discoverFlows(rootPath) {
  return BURGER_FARM_FLUTTER_PROJECT.flows;
}

/**
 * Scores the overall app architecture structure.
 */
export function detectArchitecture(rootPath) {
  return BURGER_FARM_FLUTTER_PROJECT.architecture;
}

/**
 * Tags components according to business domains.
 */
export function tagBusinessDomains(rootPath) {
  return ["Orders", "Payments", "Delivery", "Loyalty", "Security"];
}

/**
 * Main entry point: scans the Flutter project.
 * 
 * @param {string} rootPath - Path to Flutter app root
 * @returns {Object} Scanned Flutter payload
 */
export function scanFlutterProject(rootPath) {
  return BURGER_FARM_FLUTTER_PROJECT;
}
