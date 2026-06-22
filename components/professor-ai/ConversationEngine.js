// components/professor-ai/ConversationEngine.js

import { PROFESSOR_MODES } from "./ProfessorModes.js";

export function classifyIntent(query) {
  const q = query.toLowerCase();
  
  if (q.includes("analogy") || q.includes("explain simply") || q.includes("explain like")) {
    return "ANALOGY";
  }
  if (q.includes("story") || q.includes("folklore") || q.includes("history") || q.includes("historical")) {
    return "STORY";
  }
  if (q.includes("tradeoff") || q.includes("pros and cons") || q.includes("benefit") || q.includes("drawback")) {
    return "TRADEOFF";
  }
  if (q.includes("challenge") || q.includes("scenario") || q.includes("test me")) {
    return "CHALLENGE";
  }
  if (q.includes("outage") || q.includes("crash") || q.includes("error") || q.includes("debug")) {
    return "DEBUG";
  }
  if (q.includes("why") || q.includes("how does") || q.includes("what is")) {
    return "SOCRATIC";
  }
  return "GENERAL";
}

export function selectBestMode(intent, currentMode) {
  if (intent === "ANALOGY") return PROFESSOR_MODES.teacher;
  if (intent === "STORY") return PROFESSOR_MODES.storyteller;
  if (intent === "TRADEOFF") return PROFESSOR_MODES.architect;
  if (intent === "DEBUG") return PROFESSOR_MODES.debugger;
  if (intent === "CHALLENGE") return PROFESSOR_MODES.socratic;
  if (intent === "SOCRATIC") return PROFESSOR_MODES.socratic;
  return currentMode || PROFESSOR_MODES.mentor;
}

export function buildResponsePlan(query, mode, memory) {
  const intent = classifyIntent(query);
  const selectedMode = selectBestMode(intent, mode);

  // Extract topic
  let topic = "general";
  const topics = ["queue", "jwt", "replica", "caching", "failover", "consistency", "load balancer"];
  const matched = topics.find(t => query.toLowerCase().includes(t));
  if (matched) topic = matched;

  return {
    intent,
    mode: selectedMode,
    topic,
    strategy: intent,
    timestamp: new Date().toISOString()
  };
}
