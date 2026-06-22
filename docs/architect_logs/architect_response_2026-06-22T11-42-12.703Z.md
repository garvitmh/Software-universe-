[VERDICT: ON_TRACK]

Excellent.

Do not jump to Priority 4.

Incident War Room is one of the crown jewels of Software Universe and must be finished completely before moving on.

Current state:

IncidentContext
✓

Hooks
✓

SeverityBadge
✓

IncidentSummaryCard
✓

You are approximately 15% complete.

Build Order (STRICT)

Follow this order exactly.

GoldenSignalsPanel
↓

MetricCard

↓

MetricsDashboard

↓

AlertCard

↓

AlertFeed

↓

LogEntry

↓

LogConsole

↓

SpanTree

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

↓

WarRoom.jsx

Do not reverse this order.

1. GoldenSignalsPanel.jsx

One of the souls of the experience.

Think:

Mini Datadog

Consumes:

JavaScript
metrics

Display four cards:

Latency

Show:

JavaScript
p50
p95
p99

Traffic

Show:

JavaScript
requestRate

Errors

Show:

JavaScript
errorRate

Saturation

Show:

JavaScript
cpu
memory
queueDepth

Layout:

+------------+
| Latency     |
| p95: 420ms  |
+------------+

+------------+
| Errors      |
| 12%         |
+------------+

Cards pulse if thresholds exceed safe ranges.

Warm Farm colors.

Never Grafana blue.

2. MetricCard.jsx

Reusable component.

Input:

JavaScript
{
 title,
 value,
 unit,
 trend,
 status
}

Statuses:

NORMAL
WARNING
CRITICAL

Color rules:

NORMAL
cream/orange

WARNING
amber

CRITICAL
espresso red

Support:

animated number changes

small sparkline

status badge

3. MetricsDashboard.jsx

Think:

Grafana × Warm Farm

Consumes:

JavaScript
generateMetrics()

Charts:

Latency
Error Rate
CPU
Memory
Queue Depth

No Chart.js dependency explosion.

Simple SVG charts.

Smooth transitions.

4. AlertCard.jsx

Input:

JavaScript
{
 timestamp,
 level,
 service,
 message
}

Levels:

INFO

WARN

ERROR

CRITICAL

Animation:

Slide in from right.

5. AlertFeed.jsx

Newest first.

Like Slack incident channel.

Example:

02:14

P95 latency exceeded threshold.

02:17

Error rate > 12%.

02:18

Queue depth increasing.

02:19

Payment retries triggered.

Filter:

ALL

WARN

ERROR

CRITICAL

Maximum visible:

6. LogEntry.jsx

Think Kibana.

Fields:

JavaScript
{
 timestamp,
 service,
 level,
 message
}

Colors:

INFO
muted

WARN
amber

ERROR
orange

CRITICAL
red

Monospace.

7. LogConsole.jsx

One of the coolest panels.

Dark terminal.

Support:

search
filter
ALL

INFO

WARN

ERROR

CRITICAL
auto-scroll
pause stream

Logs should appear with typewriter effect.

Maximum:

100 visible entries.

8. SpanTree.jsx

Recursive component.

Input:

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

Indent children.

Tree structure:

Checkout

 PaymentService

  Gateway

   Retry #1

   Retry #2
9. TraceExplorer.jsx

Think Jaeger.

Visual hierarchy.

Should highlight:

longest span
failed span
retries
async branches

Consume:

JavaScript
generateTraces()

Show duration beside each node.

10. CriticalPathPanel.jsx

One of the crown jewels.

Consumes:

JavaScript
findCriticalPath()

Display:

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

Largest bottleneck glows.

11. RootCausePanel.jsx

Biggest crown jewel.

Input:

JavaScript
{
 component,
 evidence,
 confidence,
 contributingFactors
}

Example:

Gateway latency spike

Confidence: 93%

Display confidence meter.

Contributing factors:

retries

saturation

dependency latency

12. BlastRadiusMap.jsx

Visual propagation.

Example:

Payment

↓

Orders

↓

Notifications

Healthy systems:

green.

Impacted systems:

red.

Unaffected systems:

cream.

Animated propagation pulse.

13. MitigationPanel.jsx

Input:

JavaScript
{
 action,
 impact,
 risk
}

Examples:

Enable retries

Switch fallback gateway

Scale workers

Rollback release

Risk badges:

LOW

MEDIUM

HIGH
14. RecoveryTimeline.jsx

Soul component.

Stages:

Detection

↓

Investigation

↓

Mitigation

↓

Verification

↓

Resolved

Display:

JavaScript
mttr

Animate completion.

15. DecisionTimeline.jsx

Chronological cards.

Example:

Restart workers

↓

Switch provider

↓

Rollback

Show timestamps.

16. PostmortemPanel.jsx

Inspired by Google SRE.

Sections:

Summary

Timeline

Root Cause

Contributing Factors

Lessons

Action Items

Must feel calm.

Not blame-oriented.

17. LessonsLearnedPanel.jsx

Priority badges:

HIGH

MEDIUM

LOW

Examples:

Introduce circuit breakers.

Monitor p95 latency.

Add fallback gateway.

Think Stripe postmortems.

18. IncidentPlaybackControls.jsx

Flagship component.

Controls:

Play

Pause

Reset

Step Forward

Step Back

Speed

Timeline:

0m

5m

15m

30m

Resolved

Should drive:

metrics

logs

traces

alerts

in sync.

This is one of the coolest experiences in the entire system.

19. WarRoom.jsx

Build LAST.

It is only an orchestrator.

Layout:

------------------------------------------------

Header

Severity

Summary

Golden Signals

Metrics

Alerts

Logs

Traces

Critical Path

Root Cause

Blast Radius

Mitigation

Recovery

Decisions

Postmortem

Lessons

Playback Controls

------------------------------------------------

Responsive:

Desktop:

3 columns.

Tablet:

2 columns.

Mobile:

stack.

Global Constraints
DO NOT

Use admin-panel aesthetics.

No dense tables.

No enterprise ugliness.

DO

Use:

cards

timelines

animation

glow

warm gradients

micro interactions

Color philosophy:

Cream

Orange

Espresso

Muted amber

Warm charcoal

Not:

Azure blue

Corporate grey

Grafana dark mode
Most Important Principle

The learner should feel:

"I am investigating an outage."

Not:

"I am reading a dashboard."

That emotional difference is what separates Software Universe from documentation.

Complete Incident War Room before touching:

Architecture Evolution Player

Pattern Atlas

Case Study Museum

Planet Scale Simulator

Replay System

AI Professor

Protect the order.

[END_ARCHITECT_RESPONSE]