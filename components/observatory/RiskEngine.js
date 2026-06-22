/**
 * RiskEngine.js
 * 
 * Detects burnout (high failures, low confidence), overconfidence (high confidence, low mastery),
 * and stagnation (flat progress curve).
 * 
 * Pure functions only.
 */

/**
 * Returns detected learner risks.
 * 
 * @param {Object} learner - LearnerModel state
 * @param {Object} memory - ProfessorMemory state
 * @param {Object} mastery - Maps conceptId -> { mastery, confidence, ... }
 * @returns {Object} Detected risks
 */
export function detectRisks(learner, memory, mastery = {}) {
  const history = memory?.learningHistory || [];
  const confidence = learner?.confidence || 50;

  // 1. Burnout detection: incorrect streak is high, confidence is very low
  const recentFailures = history.slice(0, 5).filter(h => !h.correct).length;
  const isBurnout = recentFailures >= 4 && confidence < 20;

  // 2. Overconfidence detection: mastery is low but confidence is high
  let isOverconfident = false;
  let overconfidentConcept = null;

  Object.entries(mastery).forEach(([conceptId, data]) => {
    if (data.mastery < 45 && data.confidence > 80) {
      isOverconfident = true;
      overconfidentConcept = conceptId;
    }
  });

  // 3. Stagnation: flat progress (many questions answered without streak updates)
  const isStagnant = history.length >= 10 && history.slice(0, 10).filter(h => h.correct).length === 5;

  let riskType = "None";
  let severity = "LOW";
  let recommendation = "You are in a healthy, active learning zone. Keep exploring!";

  if (isBurnout) {
    riskType = "Burnout";
    severity = "CRITICAL";
    recommendation = "You have faced multiple incorrect answers recently. We recommend stepping back, reviewing the Mental Model tab, or visiting simpler worlds.";
  } else if (isOverconfident) {
    riskType = "Overconfidence";
    severity = "MEDIUM";
    recommendation = `Your confidence in '${overconfidentConcept}' is high, but scores suggest some core misconceptions. We recommend attempting some Failure or Misconception questions to calibrate.`;
  } else if (isStagnant) {
    riskType = "Stagnation";
    severity = "LOW";
    recommendation = "Your learning curve has flattened. Try pushing to a higher difficulty level or unlocking a new concept.";
  }

  return {
    riskType,
    severity,
    recommendation,
    indicators: {
      isBurnout,
      isOverconfident,
      isStagnant
    }
  };
}
