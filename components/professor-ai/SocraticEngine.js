// components/professor-ai/SocraticEngine.js

export const SOCRATIC_PROMPTS = [
  "What physical constraints or system forces do you think forced the creation of this pattern?",
  "If you remove this component entirely, what breaks first under a 100x traffic spike?",
  "Which constraint dominates your current system design context: development budget, team headcount, or network latency limits?",
  "What happens if the asynchronous sync queue lags by 5 seconds? How does that affect the mobile checkout screen UX?"
];

export function getSocraticQuestion(topic) {
  const t = topic.toLowerCase();
  if (t.includes("queue")) {
    return "If we buffer orders in a queue, how should we handle notification alerts if the consumer worker crumbles?";
  }
  if (t.includes("cache") || t.includes("redis")) {
    return "What happens if 10,000 customers request an expired cache key at the exact same millisecond? How does the database primary node react?";
  }
  if (t.includes("replica") || t.includes("consistency")) {
    return "Under a transatlantic network partition, would you prioritize consistency (stopping European writes) or availability (accepting divergent states)?";
  }
  
  // Random fallback
  const idx = Math.floor(Math.random() * SOCRATIC_PROMPTS.length);
  return SOCRATIC_PROMPTS[idx];
}
