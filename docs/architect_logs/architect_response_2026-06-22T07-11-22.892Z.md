[VERDICT: ON_TRACK]

Excellent.

You have completed:

ObservabilityScanner
↓
GitHistoryExplorer
↓
ADRExplorer
↓
DecisionEngine

Now we arrive at perhaps the deepest engine in Software Universe.

ConstraintEngine.js

Most developers think architecture is about patterns.

Architects know:

Constraints create architecture.

No constraint exists in a vacuum.

Every queue, retry, database, cache, service boundary, and deployment strategy exists because some constraint forced its existence.

ConstraintEngine is the engine that teaches this.

Philosophy

ConstraintEngine is NOT:

Find bottlenecks.

Nor:

Count resources.

Its purpose is:

Understand what is limiting the system and why.

It answers:

What pressures shaped Burger Farm?

What tradeoffs are forced?

Which constraints dominate today?

Which constraints will dominate tomorrow?

Which decisions are symptoms rather than causes?

Create
components/architecture/

ConstraintEngine.js

Pure.

No UI.

Inputs

Consume:

ArchitectureExplorer

DecisionEngine

ObservabilityScanner

GitHistoryExplorer

ADRExplorer
Main Entry
JavaScript
analyzeConstraints(context)
Output
JavaScript
{
 currentConstraints,

 dominantConstraint,

 hiddenConstraints,

 futureConstraints,

 pressureMap,

 tradeoffMap,

 constraintHistory,

 recommendations,

 architectureForces
}
Constraint Categories

Support:

TRAFFIC

LATENCY

RELIABILITY

TEAM_SIZE

BUDGET

TIME_TO_MARKET

KNOWLEDGE

COMPLEXITY

OPERATIONAL_LOAD

SECURITY

COMPLIANCE

DATABASE

THIRD_PARTY

OBSERVABILITY

DEPLOYMENT

AVAILABILITY

SCALABILITY
Constraint Model
JavaScript
{
 id,

 type,

 severity,

 affectedDomains,

 symptoms,

 causes,

 possibleSolutions
}
Current Constraint Discovery

Examples:

Small Team

Symptoms:

Avoid microservices.

Prefer modular monolith.
Budget Constraint

Symptoms:

Redis instead of Kafka.

Single DB.
Reliability Constraint

Symptoms:

Retries

DLQ

Idempotency
Traffic Constraint

Symptoms:

Queues

Workers

Caching
Dominant Constraint

One of the crown jewels.

Question:

Which force is shaping the architecture most?

Return:

JavaScript
{
 type,

 severity,

 evidence,

 affectedSystems
}

Example:

TEAM_SIZE

↓

Everything else adapts around it.
Hidden Constraints

Huge feature.

Architects often optimize symptoms.

ConstraintEngine should detect causes.

Example:

Observed:

Slow notifications.

Hidden cause:

Third-party SMS latency.

Observed:

High DB load.

Hidden cause:

Analytics queries on primary database.
Constraint History

Consume:

GitHistoryExplorer and ADRExplorer.

Build:

MVP

↓

Speed constraint

↓

Growth

↓

Traffic constraint

↓

Scale

↓

Reliability constraint

↓

Enterprise

↓

Observability constraint

Return:

JavaScript
{
 phase,

 dominantConstraint
}
Pressure Map

One of the crown jewels.

Support:

Orders

Payments

Analytics

Notifications

Security

POS

Delivery

Measure:

Pressure

Complexity

Risk

Return:

JavaScript
{
 domain,

 pressureScore
}
Tradeoff Map

Example:

Reliability ↑

Complexity ↑

Cost ↑

Return:

JavaScript
{
 gain,

 sacrifice
}
Future Constraints

Huge feature.

Question:

Traffic ×100?

Predict:

Database

↓

Queue

↓

Workers

↓

Kafka

Question:

Team shrinks?

Predict:

Simplification becomes dominant.

Question:

Regulations appear?

Predict:

Security

Audit logs

Compliance
Architecture Forces

One of the deepest features.

Support:

Speed

Reliability

Scale

Simplicity

Cost

Developer Experience

Maintainability

Security

Observability

Each force should compete with others.

Return:

JavaScript
{
 force,

 strength
}
Recommendation Engine

Examples:

Team Size Dominates

Recommend:

Avoid microservices.

Prefer modular monolith.
Reliability Dominates

Recommend:

Retries

DLQ

Circuit breakers
Scale Dominates

Recommend:

Queues

Workers

Replicas
Cost Dominates

Recommend:

Keep architecture simple.
Constraint Simulator

One of the crown jewels.

Input:

Budget cut 50%.

Output:

Kafka becomes difficult.

Managed services become expensive.

Operational simplicity becomes more important.

Input:

10x traffic increase.

Output:

PaymentService becomes bottleneck.

Read replicas become necessary.

Workers required.
Explainability

Never:

Use Kafka.

Instead:

Because traffic pressure and replay requirements are increasing,
and reliability now dominates cost,
Kafka becomes attractive despite operational complexity.

Constraint reasoning matters.

Important Functions
analyzeConstraints()

Main entry.

discoverCurrentConstraints()
detectDominantConstraint()

(Crown jewel)

detectHiddenConstraints()

(Crown jewel)

buildConstraintHistory()
buildPressureMap()

(Crown jewel)

generateTradeoffMap()
predictFutureConstraints()

(Crown jewel)

analyzeArchitectureForces()
simulateConstraintChanges()

(Crown jewel)

generateRecommendations()
explainConstraintEvolution()

(The soul of the engine.)

Output Example
JavaScript
{
 dominantConstraint:

 "TEAM_SIZE",

 hiddenConstraints:
 [
   "Analytics overloading primary DB"
 ],

 futureConstraints:
 [
   "Traffic growth",
   "Observability"
 ],

 recommendations:
 [
   "Maintain modular monolith",
   "Introduce read replicas"
 ]
}
Future UI Components
components/constraints/

ConstraintRadar.jsx

PressureMap.jsx

TradeoffMap.jsx

ConstraintTimeline.jsx

ForceBalancePanel.jsx

DominantConstraintCard.jsx

HiddenConstraintExplorer.jsx

FutureConstraintPanel.jsx

ConstraintSimulator.jsx
After ConstraintEngine

Build:

ArchitectMentor.js

The final crown jewel of Phase 3.

Because after understanding:

code,

history,

observability,

decisions,

and constraints,

Software Universe will finally understand:

How to teach architectural thinking itself.

Sacred Phase 3
ObservabilityScanner
↓
GitHistoryExplorer
↓
ADRExplorer
↓
DecisionEngine
↓
ConstraintEngine
↓
ArchitectMentor

Protect this order.

Because the deepest truth in software engineering is:

Architecture is not shaped by technology.

Architecture is shaped by constraints.

[END_ARCHITECT_RESPONSE]