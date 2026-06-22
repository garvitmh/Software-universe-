/**
 * ConceptMasteryEngine.js
 * 
 * Manages the mastery scores, confidence, streaks, difficulty-weighted updates,
 * and time-based decay of learning concepts within the Software Universe.
 * 
 * Pure functions only.
 */

export const MASTERY_LEVELS = {
  EXPLORER: "Explorer",
  LEARNER: "Learner",
  PRACTITIONER: "Practitioner",
  ENGINEER: "Engineer",
  SENIOR_ENGINEER: "Senior Engineer",
  ARCHITECT: "Architect"
};

const RECOMMENDATIONS = {
  order: ["loyalty", "analytics"],
  payment: ["security", "order"],
  delivery: ["analytics"],
  loyalty: ["order", "payment"],
  security: ["payment"],
  pos: ["order", "payment"],
  analytics: ["loyalty"]
};

const DECAY_PERIOD = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

/**
 * Converts a numerical mastery score into a mastery level badge.
 * @param {number} mastery - Score between 0 and 100
 * @returns {string} The mastery level badge
 */
export function getMasteryLevel(mastery) {
  if (mastery < 20) return MASTERY_LEVELS.EXPLORER;
  if (mastery < 40) return MASTERY_LEVELS.LEARNER;
  if (mastery < 60) return MASTERY_LEVELS.PRACTITIONER;
  if (mastery < 80) return MASTERY_LEVELS.ENGINEER;
  if (mastery < 95) return MASTERY_LEVELS.SENIOR_ENGINEER;
  return MASTERY_LEVELS.ARCHITECT;
}

/**
 * Initializes a new concept state object with baseline metrics.
 * @param {string} conceptId 
 * @returns {Object} Initial concept mastery state
 */
export function initializeConcept(conceptId) {
  return {
    mastery: 10, // Default baseline mastery
    confidence: 30, // Default baseline confidence
    attempts: 0,
    correctAnswers: 0,
    lastSeen: Date.now(),
    streak: 0
  };
}

/**
 * Applies time-based decay to a concept's mastery.
 * If more than 30 days have elapsed since lastSeen, mastery decays slowly.
 * @param {Object} conceptState - The current state of the concept
 * @param {number} currentTime - Current timestamp (default: Date.now())
 * @returns {Object} Updated concept state after decay
 */
export function applyDecay(conceptState, currentTime = Date.now()) {
  const elapsed = currentTime - conceptState.lastSeen;
  if (elapsed > DECAY_PERIOD) {
    const daysOver = (elapsed - DECAY_PERIOD) / (24 * 60 * 60 * 1000);
    // Decay by 1 point per day exceeded, capped at minimum 0
    const decayedMastery = Math.max(0, conceptState.mastery - Math.floor(daysOver));
    return {
      ...conceptState,
      mastery: decayedMastery
    };
  }
  return conceptState;
}

/**
 * Pure function to calculate and return the updated concept state based on an answer attempt.
 * @param {string} conceptId - The ID of the concept
 * @param {boolean} isCorrect - Whether the user got the question correct
 * @param {Object} learnerState - Current learner state containing conceptMastery
 * @param {string} questionDifficulty - The difficulty level of the question ("Beginner", "Intermediate", "Senior", "Staff", "Architect")
 * @returns {Object} The updated concept state
 */
export function updateMastery(conceptId, isCorrect, learnerState, questionDifficulty = "Beginner") {
  const currentMasteryState = learnerState.conceptMastery || {};
  const prevConcept = currentMasteryState[conceptId] 
    ? applyDecay(currentMasteryState[conceptId]) 
    : initializeConcept(conceptId);

  const newAttempts = prevConcept.attempts + 1;
  const newCorrectAnswers = prevConcept.correctAnswers + (isCorrect ? 1 : 0);
  const newStreak = isCorrect ? prevConcept.streak + 1 : 0;

  // Weight by Difficulty (Architect spec requirements)
  let masteryDelta = 0;
  if (isCorrect) {
    switch (questionDifficulty) {
      case "Architect":
        masteryDelta = 8;
        break;
      case "Staff":
        masteryDelta = 7;
        break;
      case "Senior":
        masteryDelta = 6;
        break;
      case "Intermediate":
        masteryDelta = 4;
        break;
      case "Beginner":
      default:
        masteryDelta = 2;
        break;
    }
  } else {
    // Small penalties to avoid punishing experimentation
    switch (questionDifficulty) {
      case "Architect":
      case "Staff":
        masteryDelta = -2;
        break;
      case "Senior":
      case "Intermediate":
        masteryDelta = -1.5;
        break;
      case "Beginner":
      default:
        masteryDelta = -1;
        break;
    }
  }

  // Calculate new mastery, clamped between 0 and 100
  const newMastery = Math.max(0, Math.min(100, prevConcept.mastery + masteryDelta));

  // Calculate new confidence (Mastery and Confidence are kept distinct)
  // Confidence goes up with correct answers (boosted by streak) and drops on wrong answers
  let confidenceDelta = isCorrect ? (5 + newStreak) : -8;
  const newConfidence = Math.max(0, Math.min(100, prevConcept.confidence + confidenceDelta));

  return {
    mastery: newMastery,
    confidence: newConfidence,
    attempts: newAttempts,
    correctAnswers: newCorrectAnswers,
    lastSeen: Date.now(),
    streak: newStreak
  };
}

/**
 * Returns a list of concept IDs where mastery is below 40.
 * @param {Object} conceptMastery - The masteries object from learner state
 * @returns {string[]} List of weak concept IDs
 */
export function getWeakConcepts(conceptMastery = {}) {
  return Object.keys(conceptMastery).filter(conceptId => {
    const concept = applyDecay(conceptMastery[conceptId]);
    return concept.mastery < 40;
  });
}

/**
 * Returns a list of concept IDs where mastery is above 80.
 * @param {Object} conceptMastery - The masteries object from learner state
 * @returns {string[]} List of strong concept IDs
 */
export function getStrongConcepts(conceptMastery = {}) {
  return Object.keys(conceptMastery).filter(conceptId => {
    const concept = applyDecay(conceptMastery[conceptId]);
    return concept.mastery > 80;
  });
}

/**
 * Analyzes weak concepts and returns recommended concepts for study.
 * @param {Object} conceptMastery - The masteries object from learner state
 * @returns {string[]} List of recommended concept IDs
 */
export function getRecommendedConcepts(conceptMastery = {}) {
  const weak = getWeakConcepts(conceptMastery);
  const recommendations = new Set();

  weak.forEach(conceptId => {
    const suggested = RECOMMENDATIONS[conceptId];
    if (suggested) {
      suggested.forEach(rec => {
        // Only recommend if not already strong
        const currentRec = conceptMastery[rec];
        if (!currentRec || currentRec.mastery <= 80) {
          recommendations.add(rec);
        }
      });
    }
  });

  return Array.from(recommendations);
}
