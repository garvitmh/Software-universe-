// components/professor-ai/TeachingStrategyEngine.js

export const TEACHING_STRATEGIES = {
  EXPLAIN_SIMPLER: "EXPLAIN_SIMPLER",
  GO_DEEPER: "GO_DEEPER",
  USE_STORY: "USE_STORY",
  USE_FAILURE: "USE_FAILURE",
  USE_ANALOGY: "USE_ANALOGY",
  CHALLENGE_LEARNER: "CHALLENGE_LEARNER",
  TRADEOFF_DISCUSSION: "TRADEOFF_DISCUSSION"
};

export function determineStrategy(mastery, confidence, queryIntent) {
  // If user explicitly asks for analogy/story/tradeoff, honor that intent
  if (queryIntent === "ANALOGY") return TEACHING_STRATEGIES.USE_ANALOGY;
  if (queryIntent === "STORY") return TEACHING_STRATEGIES.USE_STORY;
  if (queryIntent === "TRADEOFF") return TEACHING_STRATEGIES.TRADEOFF_DISCUSSION;
  if (queryIntent === "CHALLENGE") return TEACHING_STRATEGIES.CHALLENGE_LEARNER;
  if (queryIntent === "DEBUG") return TEACHING_STRATEGIES.USE_FAILURE;

  // Pedagogical steering based on mastery/confidence
  if (mastery < 40) {
    return TEACHING_STRATEGIES.USE_ANALOGY; // Keep it concrete
  }
  if (mastery < 70 && confidence > 80) {
    return TEACHING_STRATEGIES.USE_FAILURE; // Confidently wrong, show them SRE failure
  }
  if (mastery >= 80) {
    return TEACHING_STRATEGIES.TRADEOFF_DISCUSSION; // Advanced, discuss architectural cost
  }
  
  return TEACHING_STRATEGIES.EXPLAIN_SIMPLER;
}
