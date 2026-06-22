[VERDICT: ON_TRACK]

Excellent.

Completed:

Journey Mode
↓
FlowPlayer

Now we build one of the flagship experiences of Software Universe.

Incident War Room

This should feel like:

Datadog
+
Grafana
+
Kibana
+
Jaeger
+
Netflix Dispatch

Not like a dashboard.

Like being the on-call engineer at 2AM.

Philosophy

The learner should experience:

Alert fires

↓

Metrics spike

↓

Logs stream

↓

Traces reveal latency

↓

Root cause emerges

↓

Mitigation

↓

Recovery

↓

Postmortem

They should feel pressure.

And then learn calm.

Folder Structure

Create:

components/incidents/ui/

WarRoom.jsx

MetricsDashboard.jsx

MetricCard.jsx

GoldenSignalsPanel.jsx

AlertFeed.jsx

AlertCard.jsx

LogConsole.jsx

LogEntry.jsx

TraceExplorer.jsx

SpanTree.jsx

CriticalPathPanel.jsx

RootCausePanel.jsx

BlastRadiusMap.jsx

MitigationPanel.jsx

RecoveryTimeline.jsx

DecisionTimeline.jsx

PostmortemPanel.jsx

LessonsLearnedPanel.jsx

IncidentSummaryCard.jsx

IncidentPlaybackControls.jsx

SeverityBadge.jsx
Data Source

Consume:

ProductionIncidentSimulator

CodeExecutionTracer

ScenarioEngine

ObservabilityScanner

DecisionEngine

UniverseBrain
Main Component
WarRoom.jsx

Acts as orchestrator.

Input:

JavaScript
incidentType

Example:

JavaScript
"PAYMENT_TIMEOUT"

"REDIS_FAILURE"

"WORKER_CRASH"

"DEPLOYMENT_FAILURE"

"ANALYTICS_EXPLOSION"

Returns:

JavaScript
simulateIncident()

Layout:

------------------------------------------------

Header

Severity Badge

Summary Card

Golden Signals

Alerts Feed

Metrics Dashboard

Logs

Trace Explorer

Critical Path

Blast Radius

Root Cause

Mitigation

Recovery Timeline

Decision Timeline

Postmortem

Lessons Learned

------------------------------------------------
IncidentSummaryCard

Display:

Incident

Started At

Severity

Affected Systems

Current Status

MTTR

Statuses:

ACTIVE

MITIGATING

RECOVERING

RESOLVED
SeverityBadge

Support:

SEV1
SEV2
SEV3
SEV4

Colors:

SEV1 → Red
SEV2 → Orange
SEV3 → Yellow
SEV4 → Blue

Animated pulse for SEV1.

GoldenSignalsPanel

One of the souls.

Show:

Latency

Traffic

Errors

Saturation

Visualize:

JavaScript
{
 p50,
 p95,
 p99,

 requestRate,

 errorRate,

 cpu,

 memory,

 queueDepth
}

Cards should animate.

MetricsDashboard

Think Grafana.

Components:

Latency Chart

Error Rate Chart

CPU Chart

Memory Chart

Queue Depth Chart

Consume:

JavaScript
generateMetrics()
AlertFeed

One of the coolest panels.

Feed:

02:14

P95 latency exceeded threshold.

02:17

Error rate > 12%.

02:18

DLQ depth increased.

02:20

CPU saturation alert.

Sort newest first.

LogConsole

Think Kibana.

Dark mode.

Monospace.

Auto-scroll.

Filter:

INFO

WARN

ERROR

CRITICAL

Support search.

Consume:

JavaScript
generateLogs()
LogEntry

Fields:

JavaScript
{
 timestamp,

 service,

 level,

 message
}

Color levels.

TraceExplorer

Think Jaeger.

Render:

Checkout

↓

PaymentService

↓

Gateway

↓

Retries

↓

DLQ

Tree view.

SpanTree

Recursive component.

Node:

JavaScript
{
 name,

 duration,

 status,

 children
}

Statuses:

SUCCESS
FAILED
RETRYING
TIMEOUT
CriticalPathPanel

One of the crown jewels.

Highlight:

Payment Gateway

↓

Webhook Verification

↓

Database

Show:

JavaScript
{
 duration,

 contributionPercentage
}
RootCausePanel

Biggest crown jewel.

Display:

Root Cause

Evidence

Confidence

Contributing Factors

Example:

Gateway latency spike.

Confidence: 93%
BlastRadiusMap

Visualize:

Payment

↓

Orders

↓

Notifications

Also show unaffected systems.

Nodes:

Affected → Red

Healthy → Green
MitigationPanel

Show:

Retries enabled

Fallback provider

Scaled workers

Rollback

Each mitigation:

JavaScript
{
 action,

 impact,

 risk
}
RecoveryTimeline

One of the souls.

Timeline:

Detection

↓

Investigation

↓

Mitigation

↓

Verification

↓

Resolved

Show MTTR.

DecisionTimeline

Display:

Restart workers

↓

Scale pods

↓

Switch gateway

↓

Rollback release

Chronological cards.

PostmortemPanel

Inspired by Google SRE.

Sections:

Summary

Timeline

Root Cause

Contributing Factors

Lessons Learned

Action Items
LessonsLearnedPanel

Show:

Introduce circuit breakers.

Monitor p95.

Add fallback gateway.

Move analytics off primary DB.

Priority:

HIGH

MEDIUM

LOW
IncidentPlaybackControls

One of the flagship experiences.

Controls:

Play

Pause

Reset

Speed

Step Forward

Step Back

Timeline:

0m

↓

5m

↓

15m

↓

30m

↓

Resolved

Should drive:

Metrics

Logs

Traces

Alerts

synchronously.

Animations

Logs:

Typewriter.

Alerts:

Slide in.

Metrics:

Smooth chart transitions.

Traces:

Node highlighting.

Blast Radius:

Pulse propagation.

Recovery Timeline:

Progressive completion.

Responsive Layout

Desktop:

3-column layout

Tablet:

2-column layout

Mobile:

Stacked cards
Shared Hooks

Create:

hooks/

useIncident.js

useMetrics.js

useAlerts.js

useLogs.js

useTraces.js

useRecoveryTimeline.js
Shared Context

Create:

components/incidents/

IncidentContext.js

State:

JavaScript
{
 incident,

 metrics,

 logs,

 traces,

 alerts,

 playback,

 recovery
}

Avoid prop drilling.

Priority Order

Implement exactly:

WarRoom
↓

IncidentContext

↓

IncidentSummaryCard

↓

SeverityBadge

↓

GoldenSignalsPanel

↓

MetricsDashboard

↓

AlertFeed

↓

LogConsole

↓

TraceExplorer

↓

CriticalPathPanel

↓

RootCausePanel

↓

BlastRadiusMap

↓

MitigationPanel

↓

RecoveryTimeline

↓

DecisionTimeline

↓

PostmortemPanel

↓

LessonsLearnedPanel

↓

IncidentPlaybackControls
Goal

The learner should finish a simulation and say:

"I understand what an incident feels like."

Not:

"I read about incidents."

Phase 6 Progress
Journey Mode
✓

FlowPlayer
✓

Incident War Room
← current

Architecture Evolution Player

Pattern Atlas

Case Study Museum

Planet Scale Simulator

Replay System

AI Professor

Protect this order.

Because Incident War Room is where Software Universe stops teaching reliability and starts teaching responsibility.

[END_ARCHITECT_RESPONSE]