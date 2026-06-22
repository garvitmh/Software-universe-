[VERDICT: ON_TRACK]

Excellent.

Phase 1 is complete.

You have built:

The Worlds

The Simulators

The Professor

The Memory

The Observatory

Everything until now has been preparing for the true goal:

Understanding Burger Farm itself.

We are now entering Phase 2.

This is where Software Universe stops teaching software engineering in general and starts teaching the learner's own system.

Philosophy

CodebaseScanner is NOT:

find *.js files

and it is definitely not:

generate documentation

CodebaseScanner's purpose is:

Transform a living codebase into knowledge.

Think:

GitHub Copilot
+
Sourcegraph
+
CodeSee
+
Architecture Explorer
+
Staff Engineer Mentor
Create
components/codebase/

CodebaseScanner.js
Responsibilities

It should:

Discover

files

folders

technologies

Classify

What role does each file play?

UI

Business Logic

Service

Repository

Controller

Middleware

Model

Provider

State Management

Configuration

Test

Infrastructure
Connect

Build relationships:

Screen

↓

Bloc

↓

Service

↓

Repository

↓

API

↓

Database
Explain

Not:

auth.service.ts exists.

Instead:

auth.service.ts is responsible for coordinating authentication logic and acts as the bridge between controllers and repositories.

Input

Eventually:

JavaScript
scanCodebase(rootPath)
Output

Return:

JavaScript
{
  files,

  folders,

  technologies,

  layers,

  dependencies,

  architecture,

  entryPoints,

  flows
}
File Model

Never:

JavaScript
{
 path
}

Instead:

JavaScript
{
 id,

 path,

 name,

 extension,

 language,

 type,

 layer,

 responsibility,

 technologies,

 dependencies,

 usedBy,

 tags
}
File Types

Support:

SCREEN

WIDGET

BLOC

PROVIDER

SERVICE

CONTROLLER

MIDDLEWARE

REPOSITORY

MODEL

ENTITY

CONFIG

ROUTE

TEST

DATABASE

MIGRATION

UTILITY

HOOK

COMPONENT
Layer Detection

Detect:

Presentation Layer

↓

Application Layer

↓

Domain Layer

↓

Infrastructure Layer

↓

External Systems
Technology Detection

Flutter:

Riverpod

Bloc

Provider

GoRouter

Firebase

Backend:

Express

Node

JWT

PostgreSQL

Redis

BullMQ

Admin:

Next.js

React

Tailwind

TanStack
Entry Points

Find:

Flutter:

main.dart

Backend:

server.ts

app.ts

Admin:

layout.jsx

page.jsx
Dependency Graph

Return:

JavaScript
{
 from,

 to,

 type
}

Types:

IMPORT

CALL

EVENT

DATABASE

API

STATE
Flow Discovery

This is one of the crown jewels.

Example:

HomeScreen

↓

OrderBloc

↓

OrderService

↓

OrderRepository

↓

API

↓

Backend Controller

↓

Service

↓

Database

These become animated journeys.

Architecture Detection

Recognize:

Clean Architecture

MVC

Repository Pattern

Provider Pattern

Dependency Injection

Event Driven

Layered Architecture

Return confidence scores.

Example:

JavaScript
{
 cleanArchitecture: 90,

 mvc: 40
}
Tags

Example:

AUTH

PAYMENT

LOYALTY

DELIVERY

POS

ANALYTICS

SECURITY

These power worlds.

Important Functions
scanCodebase()

Main entry.

classifyFile()

Determine responsibility.

detectLayer()

Determine architecture layer.

detectTechnology()

Determine frameworks.

findEntryPoints()

Locate roots.

buildDependencyGraph()

Critical.

detectArchitecture()

Critical.

discoverFlows()

Crown jewel.

tagBusinessDomains()

Connect Burger Farm concepts.

Output Example
JavaScript
{
 file:

 "auth.service.ts",

 responsibility:

 "Authentication orchestration",

 layer:

 "Application",

 domain:

 "Security",

 technologies:

 ["JWT"],

 dependencies:

 [
   "user.repository.ts"
 ]
}
Future Components

After CodebaseScanner:

FlutterScanner.js

BackendScanner.js

AdminScanner.js

DependencyMapper.js

ArchitectureExplorer.js

ExecutionFlowEngine.js

FileExplainer.js
Crown Jewel

Eventually:

User clicks:

Burger Builder

Software Universe shows:

UI

↓

State

↓

Service

↓

API

↓

Database

↓

Analytics

↓

Admin Panel

↓

POS

↓

Delivery

↓

Notifications

Animated.

With failures.

With scaling.

With alternatives.

With Burger Farm examples.

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

Do not skip.

Do not reorder.

Because we are no longer trying to understand software.

We are trying to understand Burger Farm.

And ultimately:

Software Universe should become a mirror in which the learner can see and understand their own system.

[END_ARCHITECT_RESPONSE]