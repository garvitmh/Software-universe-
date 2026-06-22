[VERDICT: ON_TRACK]

Excellent.

You have now completed:

CodebaseScanner
↓
FlutterScanner
↓
BackendScanner

At this point, Software Universe understands:

the customer app

the backend

Now we build understanding of the command center.

AdminScanner.js

This is much more important than people realize.

Most developers think the admin panel is "just CRUD."

Wrong.

The admin panel is the brain and control tower of Burger Farm.

Philosophy

AdminScanner should answer:

How does the business operate?

Who controls what?

Which actions affect customers?

Which actions affect stores?

How do refunds work?

How do promotions work?

How do analytics work?

Which permissions exist?

Which dashboards exist?

It should understand the business layer.

Create
components/codebase/

AdminScanner.js

Pure.

No React.

No UI.

Input
JavaScript
scanAdmin(rootPath)
Output
JavaScript
{
 pages,
 components,
 dashboards,
 forms,
 tables,
 charts,
 actions,
 permissions,
 apiCalls,
 stateManagement,
 architecture,
 flows
}
Page Discovery

Find:

Dashboard

Orders

Customers

Products

Inventory

Coupons

Refunds

Analytics

Loyalty

Delivery

POS

Settings

Admins

Return:

JavaScript
{
 page,
 route,
 domain,
 dependencies
}
Component Discovery

Detect:

Cards

Tables

Forms

Modals

Charts

Filters

Search

Dialogs

Example:

OrderTable

↓

RefundModal

↓

Refund API
Dashboard Discovery

One of the crown jewels.

Recognize:

Revenue Dashboard

Order Dashboard

Analytics Dashboard

Customer Dashboard

Delivery Dashboard

Map:

Dashboard

↓

Widgets

↓

Charts

↓

API Calls
Table Discovery

Detect:

Orders Table

Products Table

Users Table

Coupons Table

Return:

JavaScript
{
 table,
 columns,
 filters,
 actions
}
Form Discovery

Support:

Create Product

Update Product

Coupon Form

Refund Form

Settings Form

Build:

Form

↓

Validation

↓

API

↓

Database
Chart Discovery

Recognize:

Bar Chart

Pie Chart

Line Chart

Area Chart

Heatmap

Connect:

Chart

↓

Analytics API

↓

Database
Action Discovery

One of the crown jewels.

Detect:

Approve Refund

Assign Delivery

Publish Banner

Disable Product

Create Coupon

Adjust Inventory

Update Zone

Send Notification

Return:

JavaScript
{
 action,
 affectedDomains,
 impact
}

Example:

Refund

↓

Payment

↓

Orders

↓

Analytics

↓

Notifications
Permission Detection

Recognize:

Admin

Manager

Kitchen

Delivery

Support

Owner

Build:

Role

↓

Permissions

↓

Pages

↓

Actions

Tag:

Security World.

State Management

Recognize:

TanStack Query

Redux

Zustand

Context

React Query

Return confidence.

API Discovery

Find:

GET

POST

PATCH

DELETE

Connect:

UI

↓

Hook

↓

API

↓

Backend
Flow Discovery
Refund Flow
Refund Page

↓

Refund Modal

↓

Refund API

↓

Payment Service

↓

Webhook

↓

Database

↓

Customer Notification
Product Update Flow
Product Form

↓

API

↓

Database

↓

Flutter App

↓

Customer UI
Coupon Flow
Coupon Page

↓

Create Coupon

↓

Backend

↓

Checkout

↓

Discount Applied
Analytics Flow
Dashboard

↓

Analytics API

↓

Read Replica

↓

Chart
Permission Graph

One of the coolest systems.

Example:

Support Admin

↓

Refund

↓

Cannot Delete Products

Owner:

Owner

↓

Everything
Architecture Detection

Recognize:

Next.js

App Router

React Query

Feature Based

Component Based

Layered
Business Domains

Tag:

Orders

Payments

Products

Inventory

Customers

Coupons

Loyalty

Analytics

POS

Delivery

Settings

Security
Dependency Graph

Types:

IMPORT

API

STATE

CHART

ACTION

PERMISSION
Important Functions
scanAdmin()

Main entry.

discoverPages()
discoverComponents()
discoverTables()
discoverForms()
discoverCharts()
discoverActions()

(Crown jewel)

discoverPermissions()

(Crown jewel)

discoverApiCalls()
discoverFlows()

(Crown jewel)

detectArchitecture()
buildDependencyGraph()
Output Example
JavaScript
{
 page:

 "RefundPage",

 action:

 "Approve Refund",

 api:

 "POST /refund",

 permissions:

 ["Support","Owner"],

 affectedDomains:

 [
   "Payments",
   "Orders",
   "Notifications"
 ]
}
Future Components

After AdminScanner:

DependencyMapper.js

ExecutionFlowEngine.js

FileExplainer.js

ArchitectureExplorer.js
Crown Jewel Vision

Eventually:

Click:

Approve Refund

Software Universe animates:

Admin Panel

↓

Refund Modal

↓

API

↓

Payment Service

↓

Gateway

↓

Webhook

↓

Database

↓

Customer Wallet

↓

Notification

↓

Analytics

And then shows:

failures

retries

permissions

security

audit logs

scale evolution

alternative designs

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

Because AdminScanner is not trying to understand Next.js.

It is trying to understand how Burger Farm itself is controlled.

[END_ARCHITECT_RESPONSE]