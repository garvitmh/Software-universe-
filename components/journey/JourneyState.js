/**
 * JourneyState.js
 * 
 * Defines the static metadata configuration for the Guided Journey paths
 * inside the Software Universe.
 */

export const JOURNEYS = {
  beginner: {
    id: "beginner",
    title: "Beginner Journey",
    description: "Master basic programming building blocks and structural separations.",
    icon: "🌱",
    color: "var(--teal)",
    steps: [
      { id: "variables", title: "Variables", icon: "📦", desc: "Storage containers for in-memory program values.", concept: "foundations", requiredMastery: 10 },
      { id: "functions", title: "Functions", icon: "⚙️", desc: "Reusable execution blocks wrapping business rules.", concept: "foundations", requiredMastery: 30 },
      { id: "widgets", title: "Widgets", icon: "🖼️", desc: "Basic display nodes forming user interface views.", concept: "jwt", requiredMastery: 10 },
      { id: "state", title: "State Management", icon: "🧠", desc: "Synchronizing state mutations across different views.", concept: "jwt", requiredMastery: 40 },
      { id: "api", title: "API Communication", icon: "📡", desc: "Connecting client views to server-side JSON endpoints.", concept: "queues", requiredMastery: 20 },
      { id: "database", title: "Database Writes", icon: "💾", desc: "Persisting business records permanently in a database.", concept: "databases", requiredMastery: 20 },
      { id: "queue", title: "Job Queues", icon: "📬", desc: "De-coupling slow actions from primary synchronous loops.", concept: "queues", requiredMastery: 40 },
      { id: "worker", title: "Background Workers", icon: "👷‍♂️", desc: "Asynchronously processing task queues in isolated threads.", concept: "queues", requiredMastery: 60 }
    ]
  },
  burgerfarm: {
    id: "burgerfarm",
    title: "Burger Farm Journey",
    description: "Step-by-step trace of how Burger Farm processes a checkout order.",
    icon: "🍔",
    color: "var(--brand)",
    steps: [
      { id: "place_order", title: "Place Order", icon: "🛒", desc: "Client sends HTTP POST /orders request payload.", concept: "queues", requiredMastery: 10 },
      { id: "payment", title: "Verify Payment", icon: "💳", desc: "Verify checkout transaction with Stripe Gateway APIs.", concept: "jwt", requiredMastery: 50 },
      { id: "queue_job", title: "Queue Notification", icon: "📥", desc: "Emit OrderCreated event and push job into Redis broker.", concept: "queues", requiredMastery: 50 },
      { id: "process_worker", title: "Process Background", icon: "⚙️", desc: "Worker receives the job and prepares payload formats.", concept: "queues", requiredMastery: 70 },
      { id: "notify_client", title: "Send Twilio SMS", icon: "📱", desc: "Call external Twilio gateways to update order statuses.", concept: "retries", requiredMastery: 40 },
      { id: "analytics_log", title: "Record Analytics", icon: "📊", desc: "Archive order history entries into database nodes.", concept: "observability", requiredMastery: 30 }
    ]
  },
  sre: {
    id: "sre",
    title: "SRE Journey",
    description: "Transition from coding into operational monitoring and blameless analysis.",
    icon: "🛡️",
    color: "var(--pink)",
    steps: [
      { id: "metrics", title: "Metrics Telemetry", icon: "📈", desc: "Gauge throughput, request rates, CPU usage, and error counts.", concept: "observability", requiredMastery: 30 },
      { id: "logs", title: "Structured Logging", icon: "📄", desc: "Format error logs with trace IDs for tracking.", concept: "observability", requiredMastery: 50 },
      { id: "traces", title: "Distributed Tracing", icon: "🧬", desc: "Map network paths and latency hops between dependencies.", concept: "observability", requiredMastery: 70 },
      { id: "alerts", title: "Pager Alerts", icon: "🚨", desc: "Trigger pager alerts under latency breaches (e.g. P99 > 3s).", concept: "observability", requiredMastery: 80 },
      { id: "incidents", title: "Incident Triage", icon: "🔥", desc: "Mitigate live checkout failures blamelessly.", milestone: "FIRST_POSTMORTEM" },
      { id: "postmortems", title: "Blameless Postmortems", icon: "📝", desc: "Scribe structural incident reviews detailing root causes.", milestone: "FIRST_POSTMORTEM" }
    ]
  },
  architect: {
    id: "architect",
    title: "Architect Journey",
    description: "Synthesize tradeoffs and constraints to build resilient scale.",
    icon: "🧙‍♂️",
    color: "var(--pop-purple)",
    steps: [
      { id: "tradeoffs", title: "Weigh Tradeoffs", icon: "⚖️", desc: "Evaluate operational overhead of Kafka vs BullMQ.", milestone: "FIRST_TRADEOFF" },
      { id: "constraints", title: "Identify Constraints", icon: "🧱", desc: "Evaluate constraints (team count, time-to-market).", milestone: "FIRST_CONSTRAINT" },
      { id: "adrs", title: "Scribe ADRs", icon: "✍️", desc: "Document system design decisions and consequences.", concept: "observability", requiredMastery: 60 },
      { id: "outages", title: "Handle Outages", icon: "⚡", desc: "Design retry policies and local cache fallbacks.", concept: "retries", requiredMastery: 80 },
      { id: "scaling", title: "Scale Architecture", icon: "🚀", desc: "Introduce database replication, caching, and sharding.", concept: "databases", requiredMastery: 50 },
      { id: "evolution", title: "System Evolution", icon: "🌀", desc: "Analyze long-term constraints and regional routing.", concept: "deployments", requiredMastery: 30 }
    ]
  }
};
