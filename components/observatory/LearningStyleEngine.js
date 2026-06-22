/**
 * LearningStyleEngine.js
 * 
 * Infers the preferred style of explanations (visual, systems thinker, 
 * analogy-driven) based on profile details and history.
 * 
 * Pure functions only.
 */

/**
 * Returns learning style preferences.
 * 
 * @param {Object} memory - ProfessorMemory state
 * @returns {Object} Style features
 */
export function inferLearningStyle(memory) {
  const profile = memory?.profile || {};
  const preferredMode = profile.preferredExplanationMode || "MENTAL_MODEL";

  let styleName = "Analogy-Driven Explorer";
  let explanation = "You learn best by linking complex software architectures to simple physical models.";

  if (preferredMode === "DEEP_EXPLORATION") {
    styleName = "Systems Thinker";
    explanation = "You prefer mapping the components, constraints, and failures of code directly.";
  }

  return {
    styleName,
    explanation,
    preferredExplanationMode: preferredMode
  };
}
