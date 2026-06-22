/**
 * InsightsEngine.js
 * 
 * Generates natural language insights and observations (like a mentor)
 * regarding learning styles, conceptual strengths, and confidence dynamics.
 * 
 * Pure functions only.
 */

/**
 * Generates written feedback insights based on progress and history logs.
 * 
 * @param {Object} learner - LearnerModel state
 * @param {Object} memory - ProfessorMemory state
 * @returns {string[]} List of generated insight strings
 */
export function generateInsights(learner, memory) {
  const insights = [];

  const style = memory?.profile?.preferredExplanationMode || "MENTAL_MODEL";
  if (style === "MENTAL_MODEL") {
    insights.push("You learn best through real-world analogies and intuitive mental models.");
  } else if (style === "DEEP_EXPLORATION") {
    insights.push("You prefer diving deep into architectural code structures and direct system details.");
  }

  // Strong concepts
  if (memory?.favoriteConcepts && memory.favoriteConcepts.length > 0) {
    insights.push(`You exhibit strong intuition and rapid mastery in the '${memory.favoriteConcepts.join(", ")}' domain(s).`);
  }

  // Weak concepts
  if (learner?.weakConcepts && learner.weakConcepts.length > 0) {
    insights.push(`Security or foundational topics like '${learner.weakConcepts.join(", ")}' are current constraints to your system growth.`);
  }

  // Confidence vs Mastery
  const recentHistory = memory?.learningHistory || [];
  const correctCount = recentHistory.filter(h => h.correct).length;
  const confidence = learner?.confidence || 50;

  if (confidence > 80 && correctCount / recentHistory.length < 0.4) {
    insights.push("Your confidence is currently pacing faster than your actual mastery. Take time to verify assumptions.");
  } else if (confidence < 30 && correctCount / recentHistory.length > 0.7) {
    insights.push("Your mastery is high, but your confidence remains low. You are performing better than you think!");
  }

  // General defaults
  if (insights.length === 0) {
    insights.push("Continue practicing questions across worlds to generate deeper personalized learning insights.");
  }

  return insights;
}
