// components/professor-ai/TradeoffEngine.js

export const TRADEOFFS = {
  queues: {
    technology: "Asynchronous Message Queues (BullMQ / RabbitMQ)",
    benefit: "Decouples services; buffers traffic peaks so databases do not crash under surges.",
    cost: "Requires provisioning broker nodes (Redis/RabbitMQ) and increases sync write delay.",
    complexity: "Must implement Transactional Outbox pattern to prevent message loss on database rollbacks.",
    failureMode: "Consumer queue lag and eventual message delivery blockages."
  },
  caching: {
    technology: "In-Memory Caching (Redis / Memcached)",
    benefit: "Sub-millisecond read times; offloads up to 85% of traffic from primary relational databases.",
    cost: "Consumes expensive RAM nodes and risks stale data displays.",
    complexity: "Cache invalidation algorithms (e.g. Write-Through, Cache-Aside, Time-To-Live).",
    failureMode: "Cache Stampede/Stampede storms slams database directly when cache keys expire simultaneously."
  },
  replicas: {
    technology: "Asynchronous Read Replicas",
    benefit: "Scales read throughput horizontally across global geographical zones.",
    cost: "Billing for additional node instances and cross-region replication bandwidth.",
    complexity: "App routing layer must separate write queries from read queries.",
    failureMode: "Replication lag causing stale read errors on newly updated records."
  }
};

export function getTradeoffs(techId) {
  const tid = techId.toLowerCase();
  if (tid.includes("queue") || tid.includes("outbox")) return TRADEOFFS.queues;
  if (tid.includes("cache") || tid.includes("redis")) return TRADEOFFS.caching;
  if (tid.includes("replica") || tid.includes("database")) return TRADEOFFS.replicas;
  return TRADEOFFS.queues; // default fallback
}
