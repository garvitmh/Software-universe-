// components/professor-ai/ProfessorMemory.js

const MEMORY_STORAGE_KEY = "software_universe_professor_memory";

export const DEFAULT_MEMORY = {
  favoriteTopics: ["queues", "latency", "idempotency"],
  misconceptions: [
    { id: "queue-vs-retry", title: "Confusing Queues and Retries", resolved: false },
    { id: "replica-backup", title: "Treating Read Replicas as Backups", resolved: true }
  ],
  breakthroughs: ["CAP Theorem Intuition", "Transactional Outbox Pattern"],
  confidence: 72,
  architectMoments: ["AWS US-East Datacenter Failover promotion in 4s"],
  curiosity: {
    paymentsCount: 8,
    scaleCount: 12,
    incidentsCount: 6
  }
};

export function loadMemory() {
  if (typeof window === "undefined") return DEFAULT_MEMORY;
  try {
    const raw = localStorage.getItem(MEMORY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_MEMORY;
  } catch (err) {
    console.error("Error loading professor memory:", err);
    return DEFAULT_MEMORY;
  }
}

export function saveMemory(memory) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(memory));
  } catch (err) {
    console.error("Error saving professor memory:", err);
  }
}
