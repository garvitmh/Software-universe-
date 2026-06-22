// components/professor-ai/AnalogyEngine.js

export const ANALOGIES = {
  jwt: {
    title: "JWT = Hotel Keycard",
    description: "A JWT is like a hotel keycard. The card machine signs it with details (Room 302, valid until 11 AM) and hand it to you. The room door lock doesn't call the front desk; it only verifies the signature on the card. But if you lose it, it's hard to revoke without changing the locks.",
    drawback: "Revocation is complex; once issued, the card is valid until expiry."
  },
  queue: {
    title: "Queue = Restaurant Pager",
    description: "Instead of customers standing in a single line crowding the counter, the cashier gives them a vibrating pager. Customers can wander around, sit down, or wait. The kitchen prepares meals at its own pace. When order is ready, pager buzzes. The queue buffers and decouples peak orders from kitchen capacity.",
    drawback: "Introduces eventual delivery; customers don't get food instantly."
  },
  replica: {
    title: "Read Replica = Photocopying the Newspaper",
    description: "Instead of 100 people crowding to read the single original chalkboard, you photocopy it and distribute copies. Everyone reads their own copy instantly (fast reads). But if the teacher edits the original chalkboard, the copies are temporarily out of sync (replication lag).",
    drawback: "Eventual consistency; copies might display stale headlines."
  },
  "load balancer": {
    title: "Load Balancer = Restaurant Hostess",
    description: "A hostess stands at the front entrance, directing incoming groups of guests to different waitstaff tables (servers). This ensures table 1 doesn't get 10 groups while table 4 sits idle, balancing restaurant throughput.",
    drawback: "Single point of entry; if hostess falls over, entrance congests."
  },
  caching: {
    title: "Cache = Desk Drawer vs. Attic",
    description: "Things you need right now are kept on your study desk drawer (Cache). Things you rarely look at are stored in boxes in the attic (Database). Accessing desk drawer is instant, but drawer has limited size.",
    drawback: "Eviction rules: drawer fills up, requiring you to throw old papers out."
  }
};

export function getAnalogy(conceptId) {
  return ANALOGIES[conceptId.toLowerCase()] || {
    title: `Analogy for ${conceptId}`,
    description: "Imagine a conveyor belt coordinating pieces in a factory. It distributes components step-by-step to prevent overloading worker assembly lines.",
    drawback: "Carries extra coordination overhead."
  };
}
