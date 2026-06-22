// components/professor-ai/StoryEngine.js

export const STORIES = {
  stripe: {
    title: "Stripe's Idempotency Scars",
    content: "In its early days, Stripe noticed that unstable mobile connections led users to double-tap checkout buttons. API calls retried, but charging the user twice was catastrophic. In response, Stripe mandated unique 'Idempotency-Keys' on all charge requests, storing keys in a Redis lock buffer. If a duplicate key arrived within 24 hours, the server replayed the cached response rather than charging again.",
    lesson: "Never trust client networks; enforce unique idempotency filters on all mutative routes."
  },
  netflix: {
    title: "Netflix's Chaos Engineering",
    content: "In 2008, a major database corruption shut down Netflix's DVD shipping center for three days. Shifting to AWS cloud, Netflix realized virtual nodes fail unpredictably. Instead of hiding from failure, they built Chaos Monkey: a tool that randomly kills production EC2 instances. This forced developers to design stateless, self-healing app services that automatically failover without user impact.",
    lesson: "Test resilience by actively injecting chaos rather than waiting for outages."
  },
  discord: {
    title: "Discord's ScyllaDB Migration",
    content: "Discord initially stored billions of chat messages in MongoDB. As chat rooms grew, write lock contention spiked. They moved to Cassandra, but Java garbage collection pauses caused latency p99 spikes. Finally, Discord migrated to ScyllaDB (a C++ Cassandra clone) and sharded chat histories by room ids, reducing p99 latency from 80ms to under 5ms.",
    lesson: "Sharding and GC-free database engines are necessary at billions-scale data volumes."
  }
};

export function getStory(topic) {
  const t = topic.toLowerCase();
  if (t.includes("stripe") || t.includes("pay") || t.includes("idempotency")) return STORIES.stripe;
  if (t.includes("netflix") || t.includes("chaos") || t.includes("resilience") || t.includes("circuit")) return STORIES.netflix;
  if (t.includes("discord") || t.includes("db") || t.includes("database") || t.includes("scale")) return STORIES.discord;
  return STORIES.stripe; // default
}
