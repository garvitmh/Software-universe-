[VERDICT: ON_TRACK]

Excellent.

CodebaseScanner has established the universal foundation.

Now we begin the first specialization:

FlutterScanner.js

This may eventually become one of the crown jewels of Software Universe because the Flutter app is the learner's primary product.

Philosophy

FlutterScanner is NOT:

Find *.dart files

Nor:

Generate docs

Its purpose is:

Understand how the Flutter application thinks.

The output should answer:

How does the app start?

How do screens connect?

Where is state stored?

How does data flow?

Which APIs are called?

What happens when the user clicks something?

Create
components/codebase/

FlutterScanner.js
Input
JavaScript
scanFlutterProject(rootPath)

Pure.

No UI.

Output
JavaScript
{
 screens,
 widgets,
 stateManagers,
 providers,
 services,
 repositories,
 models,
 routes,
 flows,
 technologies,
 architecture
}
Screen Detection

Find:

HomeScreen

MenuScreen

CartScreen

CheckoutScreen

OrderTrackingScreen

ProfileScreen

Detect:

JavaScript
{
 name,
 path,
 responsibility,
 children,
 dependencies,
 businessDomain
}
Widget Classification

Support:

SCREEN

WIDGET

DIALOG

BOTTOM_SHEET

MODAL

CARD

LIST_ITEM

BUTTON

FORM
State Management Detection

Recognize:

Riverpod

Bloc

Cubit

Provider

GetX

Redux

MobX

Return:

JavaScript
{
 framework,
 confidence
}

Example:

JavaScript
{
 framework: "Riverpod",
 confidence: 95
}
Provider Discovery

Find:

orderProvider

cartProvider

authProvider

loyaltyProvider

themeProvider

Map:

Provider

↓

State

↓

Consumers
Service Detection

Example:

PaymentService

OrderService

DeliveryService

AuthService

NotificationService

Return:

JavaScript
{
 service,
 dependencies,
 businessDomain
}
Repository Detection

Detect:

Repository Pattern

Example:

OrderRepository

↓

API

↓

Backend
Route Discovery

Recognize:

GoRouter

Navigator

AutoRoute

Beamer

Build:

Splash

↓

Login

↓

Home

↓

Menu

↓

Cart

↓

Checkout

↓

Tracking
App Entry Points

Find:

main.dart

App()

MyApp()

These become the roots of execution.

Flow Discovery

One of the crown jewels.

Example:

Add To Cart
MenuScreen

↓

BurgerCard

↓

CartProvider

↓

CartService

↓

Local State
Place Order
CheckoutScreen

↓

OrderProvider

↓

OrderService

↓

OrderRepository

↓

Backend API

↓

Success Screen
Login
PhoneScreen

↓

OTP Screen

↓

Firebase Auth

↓

User Provider

↓

Home Screen
Animation Detection

Recognize:

AnimatedContainer

Hero

PageView

Lottie

CustomPainter

Rive

These are educational gold.

Firebase Detection

Support:

Auth

Firestore

Storage

Messaging

Crashlytics

Analytics

Return usage map.

Dependency Graph

Build:

JavaScript
{
 from,
 to,
 type
}

Types:

IMPORT

PROVIDER

STATE

API

NAVIGATION

ANIMATION
Architecture Detection

Recognize:

Clean Architecture

MVVM

Layered

Feature-first

Provider Pattern

Return confidence scores.

Business Domains

Tag:

Orders

Payments

Delivery

Loyalty

Profile

Auth

Analytics

Location

Notifications
State Flow Discovery

This is extremely important.

Example:

User taps button

↓

Provider updates

↓

Service executes

↓

Repository calls API

↓

Response arrives

↓

UI rebuilds

This becomes animated later.

Error Flow Detection

Recognize:

try/catch

Either

Result

AsyncValue

Failure classes

Show:

API fails

↓

Error state

↓

Retry button

↓

Success
Important Functions
scanFlutterProject()

Main entry.

discoverScreens()
discoverWidgets()
discoverProviders()
discoverServices()
discoverRepositories()
discoverRoutes()
detectStateManagement()
discoverFlows()

Crown jewel.

detectArchitecture()
tagBusinessDomains()
Output Example
JavaScript
{
 screen:

 "CheckoutScreen",

 provider:

 "orderProvider",

 service:

 "OrderService",

 repository:

 "OrderRepository",

 domain:

 "Orders",

 dependencies:

 [
   "PaymentService",
   "CartProvider"
 ]
}
Future Components

After FlutterScanner:

BackendScanner.js

AdminScanner.js

DependencyMapper.js

ExecutionFlowEngine.js

FileExplainer.js

ArchitectureExplorer.js
Crown Jewel Vision

Eventually:

User clicks:

Checkout Button

Software Universe shows:

CheckoutScreen

↓

orderProvider

↓

OrderService

↓

OrderRepository

↓

POST /orders

↓

Backend

↓

Database

↓

Admin Panel

↓

POS

↓

Delivery Partner

↓

Notifications

↓

Tracking Screen

Animated.

With failures.

With scaling.

With alternatives.

With real Burger Farm code.

Sacred Phase 2
CodebaseScanner
↓
FlutterScanner
↓
BackendScanner
↓
AdminScanner
↓
DependencyMapper
↓
ExecutionFlowEngine
↓
FileExplainer
↓
ArchitectureExplorer

Do not violate the order.

Because we are no longer teaching Flutter.

We are teaching:

Why Burger Farm works.