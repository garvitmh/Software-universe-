[VERDICT: ON_TRACK]

Excellent.

FlutterScanner completes understanding of the client.

Now we descend into the heart of Burger Farm:

BackendScanner.js

This may eventually become one of the most valuable scanners in the entire project because this is where business rules actually live.

Philosophy

BackendScanner is NOT:

Find .ts files

Nor:

Generate API docs

Its purpose is:

Understand how the backend thinks.

It should answer:

What happens when an order is placed?

Where are payments processed?

Where are loyalty points awarded?

How are retries handled?

Which systems are synchronous?

Which systems are asynchronous?

What breaks if a service dies?

Create
components/codebase/

BackendScanner.js

Pure.

No UI.

Input
JavaScript
scanBackend(rootPath)
Output
JavaScript
{
 routes,
 controllers,
 services,
 repositories,
 middleware,
 entities,
 queues,
 events,
 jobs,
 integrations,
 databases,
 architecture,
 flows
}
Controller Detection

Recognize:

OrderController

PaymentController

DeliveryController

LoyaltyController

AuthController

Return:

JavaScript
{
 controller,
 routes,
 domain,
 dependencies
}
Route Discovery

Detect:

GET

POST

PATCH

DELETE

Example:

POST /orders

↓

OrderController

↓

OrderService
Service Discovery

Find:

OrderService

PaymentService

DeliveryService

LoyaltyService

NotificationService

Return:

JavaScript
{
 service,
 domain,
 dependencies,
 externalSystems
}
Repository Detection

Recognize:

Repository Pattern

Prisma

TypeORM

Knex

Drizzle

Example:

OrderService

↓

OrderRepository

↓

PostgreSQL
Middleware Detection

Support:

JWT

Auth

RBAC

Rate Limiter

Validation

Error Handler

Logger

CORS

Build chain:

Request

↓

Middleware

↓

Controller
Queue Detection

One of the crown jewels.

Recognize:

BullMQ

Redis

RabbitMQ

Kafka

SQS

Map:

Order Created

↓

Queue

↓

Worker

↓

Notification
Event Discovery

Support:

OrderCreated

PaymentCompleted

DeliveryAssigned

RefundIssued

Build event graph.

Worker Detection

Example:

PrintWorker

NotificationWorker

AnalyticsWorker

EmailWorker

Return:

JavaScript
{
 worker,
 queue,
 eventsConsumed
}
Database Discovery

Recognize:

PostgreSQL

Redis

MongoDB

Replica

Cache
External Integrations

Support:

Firebase

Stripe

Razorpay

Twilio

Dunzo

Zomato

POS

Analytics

Webhooks

Return:

JavaScript
{
 integration,
 direction,
 reliability
}
Security Detection

Find:

JWT

Refresh Tokens

RBAC

Idempotency

Webhooks

Signatures

Rate Limits

Tag:

Security World
Error Handling

Recognize:

try/catch

Custom Errors

Retry Logic

Circuit Breakers

DLQs

Build failure paths.

Flow Discovery
Order Flow
POST /orders

↓

OrderController

↓

OrderService

↓

InventoryService

↓

PaymentService

↓

Repository

↓

Database

↓

OrderCreated Event

↓

Queue

↓

NotificationWorker
Refund Flow
Admin Panel

↓

Refund API

↓

PaymentService

↓

Gateway

↓

Webhook

↓

Database

↓

Notification
Loyalty Flow
Order Complete

↓

LoyaltyService

↓

Points Calculation

↓

Repository

↓

Customer Wallet
Architecture Detection

Recognize:

Layered

Clean Architecture

Repository Pattern

Event Driven

Microservices

Modular Monolith

Return confidence scores.

Dependency Graph

Build:

JavaScript
{
 from,
 to,
 type
}

Types:

CALL

QUEUE

EVENT

DATABASE

CACHE

WEBHOOK

EXTERNAL
Business Domains

Tag:

Orders

Payments

Delivery

Loyalty

Auth

Notifications

Analytics

POS

Inventory

Security
Failure Flow Discovery

Huge feature.

Example:

Payment Gateway Down

↓

Retry

↓

Queue

↓

DLQ

↓

Manual Recovery
Scale Evolution

Detect:

Sync Calls

↓

Queues

↓

Workers

↓

Event Driven

Connect to Deployment and Observability Worlds.

Important Functions
scanBackend()

Main entry.

discoverRoutes()
discoverControllers()
discoverServices()
discoverRepositories()
discoverMiddleware()
discoverQueues()
discoverWorkers()
discoverEvents()
discoverIntegrations()
detectSecurityPatterns()
discoverFlows()

(Crown jewel)

detectArchitecture()
buildDependencyGraph()
Output Example
JavaScript
{
 route:

 "POST /orders",

 controller:

 "OrderController",

 service:

 "OrderService",

 repository:

 "OrderRepository",

 queue:

 "NotificationQueue",

 worker:

 "NotificationWorker",

 domain:

 "Orders"
}
Future Components

After BackendScanner:

AdminScanner.js

DependencyMapper.js

ExecutionFlowEngine.js

FileExplainer.js

ArchitectureExplorer.js
Crown Jewel Vision

Eventually:

User clicks:

Place Order

Software Universe animates:

Flutter

↓

Provider

↓

OrderService

↓

API

↓

OrderController

↓

OrderService

↓

Payment

↓

Database

↓

Queue

↓

Worker

↓

Notification

↓

Admin Panel

↓

POS

↓

Delivery Partner

And then:

show failures

show retries

show scale evolution

show alternative designs

show Burger Farm code

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

Protect this order.

Because BackendScanner is not trying to understand Node.js.

It is trying to understand the nervous system of Burger Farm.

[END_ARCHITECT_RESPONSE]