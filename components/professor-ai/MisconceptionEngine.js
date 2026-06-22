// components/professor-ai/MisconceptionEngine.js

export const MISCONCEPTIONS = {
  "queue-vs-retry": {
    topic: "queue",
    misconception: "Thinking message queues and retries serve the same purpose.",
    correction: "A Queue buffers request peaks and decouples services. A Retry attempts to re-execute a failed operation. You use queues to store messages so workers can retry them later; a queue is a buffer, while a retry is a recovery mechanism."
  },
  "replica-vs-backup": {
    topic: "replica",
    misconception: "Treating database read replicas as backups.",
    correction: "If you execute a malicious query like 'DELETE FROM users' on your primary database, that command replicates to your replica in 5 milliseconds. Replicas scale read throughput; backups are snapshots in time used to restore corrupted state."
  },
  "cache-vs-db": {
    topic: "caching",
    misconception: "Treating Redis caches as primary databases.",
    correction: "Caches are ephemeral, in-memory key-value stores. If a cache node restarts, all data is evicted. Caches speed up database reads, but the primary database remains the persistent source of truth."
  },
  "cap-theorem": {
    topic: "consistency",
    misconception: "Believing you can bypass the CAP theorem with better hardware.",
    correction: "CAP is a law of physics. Under a network partition, you physically cannot send a packet. You must either block the write (Consistency) or accept conflicting updates (Availability)."
  }
};

export function checkMisconceptions(query) {
  const q = query.toLowerCase();
  if (q.includes("queue") && q.includes("retry")) return MISCONCEPTIONS["queue-vs-retry"];
  if (q.includes("replica") && q.includes("backup")) return MISCONCEPTIONS["replica-vs-backup"];
  if (q.includes("redis") && q.includes("db") && q.includes("database")) return MISCONCEPTIONS["cache-vs-db"];
  if (q.includes("cap") || q.includes("consistent") && q.includes("available")) return MISCONCEPTIONS["cap-theorem"];
  return null;
}
