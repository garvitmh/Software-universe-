// components/professor-ai/ChallengeEngine.js

export const CHALLENGES = [
  {
    id: "challenge-1",
    title: "Black Friday Surge at Burger Farm",
    scenario: "Orders surge from 5 rps to 500 rps. The PostgreSQL database write connection pool saturates due to transaction locks on the kitchen inventory counters. Order checkouts start timing out at 10 seconds.",
    questions: [
      "How would introducing a message queue (e.g. BullMQ) solve this write saturation?",
      "What are the tradeoffs of notifying the user 'Order Received' before it is written to the DB?"
    ],
    hint: "Think about decoupling synchronous calls and accepting eventual consistency."
  },
  {
    id: "challenge-2",
    title: "The POS Printer Outage Outrage",
    scenario: "The kitchen's thermal receipt printer goes offline because of a paper jam. The OrderController tries to call the printer API synchronously, locking the checkout threads and crashing the entire mobile ordering pipeline.",
    questions: [
      "How would a transactional outbox prevent a jammed printer from taking down checkout transactions?",
      "Where should printer retries happen: in the client screen or in a background worker?"
    ],
    hint: "Avoid synchronous coupling to external IO nodes."
  }
];

export function getRandomChallenge() {
  const idx = Math.floor(Math.random() * CHALLENGES.length);
  return CHALLENGES[idx];
}

export function getChallengeForTopic(topic) {
  const match = CHALLENGES.find(c => c.scenario.toLowerCase().includes(topic.toLowerCase()));
  return match || CHALLENGES[0];
}
