// components/replay/ReplaySchema.js

export const EVENT_TYPES = {
  SESSION: "SESSION",
  BREAKTHROUGH: "BREAKTHROUGH",
  MISTAKE: "MISTAKE",
  MISCONCEPTION: "MISCONCEPTION",
  ARCHITECT_MOMENT: "ARCHITECT_MOMENT",
  MILESTONE: "MILESTONE",
  QUESTION: "QUESTION",
  CURIOSITY: "CURIOSITY",
  TRANSFORMATION: "TRANSFORMATION"
};

// Chronological log of a user's learning path in Software Universe
export const MOCK_HISTORY_EVENTS = [
  {
    timestamp: "2026-05-01T10:00:00Z",
    type: EVENT_TYPES.SESSION,
    title: "Initial Launch",
    description: "Logged in for the first time. Explored the foundations of modular design.",
    world: "foundations",
    concepts: ["modules", "separation-of-concerns"],
    importance: 2
  },
  {
    timestamp: "2026-05-03T14:20:00Z",
    type: EVENT_TYPES.QUESTION,
    title: "Database Lock Dilemma",
    description: "Answered the SQLite transaction locking challenge. Felt unsure about lock contention.",
    world: "database",
    concepts: ["transactions", "lock-contention"],
    importance: 4
  },
  {
    timestamp: "2026-05-05T11:00:00Z",
    type: EVENT_TYPES.MISTAKE,
    title: "Direct API Calls Misstep",
    description: "Attempted to solve POS printing outage by calling the printer API synchronously inside order placement controller.",
    world: "orders",
    concepts: ["synchronous-coupling"],
    importance: 5
  },
  {
    timestamp: "2026-05-05T11:15:00Z",
    type: EVENT_TYPES.MISCONCEPTION,
    title: "API Gateway Confusion",
    description: "Thought that microservices solve all code separation problems instantly, ignoring network overhead costs.",
    world: "foundations",
    concepts: ["microservices"],
    importance: 6
  },
  {
    timestamp: "2026-05-08T16:30:00Z",
    type: EVENT_TYPES.BREAKTHROUGH,
    title: "Queue Mechanics Clicked",
    description: "Configured transactional outbox patterns. Discovered how BullMQ buffers orders under load peaks.",
    world: "queues",
    concepts: ["queues", "outbox-pattern"],
    importance: 8
  },
  {
    timestamp: "2026-05-08T16:45:00Z",
    type: EVENT_TYPES.MILESTONE,
    title: "Practitioner Level Unlocked",
    description: "Mastered basic asynchronous workflows. Mastery index exceeded 45%.",
    world: "foundations",
    concepts: ["queues", "retries"],
    importance: 7
  },
  {
    timestamp: "2026-05-12T09:15:00Z",
    type: EVENT_TYPES.SESSION,
    title: "Stripe Webhook Lab",
    description: "Explored payment webhooks and signature validations inside a sandboxed order controller.",
    world: "payments",
    concepts: ["webhooks", "signature-verification"],
    importance: 5
  },
  {
    timestamp: "2026-05-15T12:00:00Z",
    type: EVENT_TYPES.MISTAKE,
    title: "Idempotency Leak Outage",
    description: "Faced customer charge duplicates because double checkout submissions did not share an idempotency key.",
    world: "payments",
    concepts: ["idempotency", "race-conditions"],
    importance: 6
  },
  {
    timestamp: "2026-05-15T12:35:00Z",
    type: EVENT_TYPES.BREAKTHROUGH,
    title: "Idempotency Clicked",
    description: "Implemented PG double-entry ledger verification combined with unique constraints on order ids.",
    world: "payments",
    concepts: ["idempotency", "transactions"],
    importance: 9
  },
  {
    timestamp: "2026-05-18T10:30:00Z",
    type: EVENT_TYPES.CURIOSITY,
    title: "Chaos Engineering Curiosity",
    description: "Deep-dived into Netflix ribbon circuit breaker documentation after viewing the Case Study Museum.",
    world: "observability",
    concepts: ["circuit-breaker", "resilience"],
    importance: 4
  },
  {
    timestamp: "2026-05-20T14:40:00Z",
    type: EVENT_TYPES.ARCHITECT_MOMENT,
    title: "Simplicity vs Scale Realization",
    description: "Faced with a 100x traffic surge simulation, chose modular monolith optimization over complex Kafka clustering because team size was small.",
    world: "foundations",
    concepts: ["team-size-constraints", "tradeoffs"],
    importance: 10
  },
  {
    timestamp: "2026-05-20T15:00:00Z",
    type: EVENT_TYPES.TRANSFORMATION,
    title: "Senior Engineer Ascension",
    description: "Chief Architect noted that apprentice has stopped asking 'how to build?' and started evaluating 'why to build?'.",
    world: "foundations",
    concepts: ["tradeoffs", "system-thinking"],
    importance: 10
  },
  {
    timestamp: "2026-06-01T11:20:00Z",
    type: EVENT_TYPES.SESSION,
    title: "Global Scale Exploration",
    description: "Configured 7 regions inside Planet Scale Simulator. Observed speed-of-light network limitations.",
    world: "scale",
    concepts: ["latency", "geography"],
    importance: 6
  },
  {
    timestamp: "2026-06-05T15:45:00Z",
    type: EVENT_TYPES.BREAKTHROUGH,
    title: "CAP Theorem Intuition",
    description: "Witnessed how strong consistency slows down global writes to 220ms while eventual consistency returns in 15ms but risks stale reads.",
    world: "scale",
    concepts: ["cap-theorem", "consistency-modes"],
    importance: 9
  },
  {
    timestamp: "2026-06-10T16:00:00Z",
    type: EVENT_TYPES.ARCHITECT_MOMENT,
    title: "US-East Datacenter Recovery",
    description: "SRE incident response: successfully managed a total Northern Virginia outage by failing over writes to US-West in 4 seconds.",
    world: "observability",
    concepts: ["failover", "consensus-algorithms"],
    importance: 10
  }
];
