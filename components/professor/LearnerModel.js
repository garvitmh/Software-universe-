import { LEVELS, getNextDifficulty } from './AdaptiveDifficultyEngine.js';
import { 
  updateMastery, 
  getWeakConcepts, 
  getStrongConcepts, 
  getRecommendedConcepts 
} from './ConceptMasteryEngine.js';

/**
 * Pure function to create a new Learner state
 */
export function createInitialLearner(level = LEVELS.BEGINNER) {
  return {
    currentLevel: level,
    confidence: 50, // Start at neutral confidence
    correctStreak: 0,
    incorrectStreak: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    recentHistory: [],
    weakConcepts: [],
    strongConcepts: [],
    recommendedConcepts: [],
    flags: [], // e.g. "EXPLAIN_SIMPLER"
    conceptMastery: {} // Maps conceptId -> { mastery, confidence, attempts, correctAnswers, lastSeen, streak }
  };
}

/**
 * Pure function to update the learner state based on a new answered question
 * @param {Object} learner - Current learner state
 * @param {Object} question - The question answered { id, concept, difficulty }
 * @param {boolean} isCorrect - Whether it was correct
 */
export function updateLearner(learner, question, isCorrect) {
  const newLearner = { ...learner };
  
  // Update totals
  newLearner.totalQuestions += 1;
  if (isCorrect) newLearner.correctAnswers += 1;
  
  // Update confidence (Clamp 0-100)
  newLearner.confidence = Math.max(0, Math.min(100, newLearner.confidence + (isCorrect ? 3 : -5)));
  
  // Update Streaks
  if (isCorrect) {
    newLearner.correctStreak += 1;
    newLearner.incorrectStreak = 0;
  } else {
    newLearner.incorrectStreak += 1;
    newLearner.correctStreak = 0;
  }
  
  // Update History (Keep last 20)
  const historyItem = {
    questionId: question.id,
    concept: question.concept,
    difficulty: question.difficulty,
    correct: isCorrect,
    timestamp: Date.now()
  };
  newLearner.recentHistory = [historyItem, ...newLearner.recentHistory].slice(0, 20);
  
  // Update Concept Mastery
  const conceptId = question.concept;
  if (conceptId) {
    if (!newLearner.conceptMastery) {
      newLearner.conceptMastery = {};
    }
    const difficulty = question.difficulty || newLearner.currentLevel;
    const updatedConceptState = updateMastery(conceptId, isCorrect, learner, difficulty);
    newLearner.conceptMastery = {
      ...newLearner.conceptMastery,
      [conceptId]: updatedConceptState
    };
    
    // Update weak, strong, and recommended lists
    newLearner.weakConcepts = getWeakConcepts(newLearner.conceptMastery);
    newLearner.strongConcepts = getStrongConcepts(newLearner.conceptMastery);
    newLearner.recommendedConcepts = getRecommendedConcepts(newLearner.conceptMastery);
  }

  // Flags for the UI / Professor
  newLearner.flags = [];
  
  // Level adjustment logic based on streaks
  if (newLearner.correctStreak >= 3) {
    // Increase difficulty
    newLearner.currentLevel = getNextDifficulty(newLearner.currentLevel, true);
    newLearner.correctStreak = 0; // Reset streak after leveling up
  } else if (newLearner.incorrectStreak >= 3) {
    // Decrease difficulty
    newLearner.currentLevel = getNextDifficulty(newLearner.currentLevel, false);
    newLearner.incorrectStreak = 0; // Reset streak after leveling down
    newLearner.flags.push("EXPLAIN_SIMPLER");
  }
  
  return newLearner;
}

export function serializeLearner(learner) {
  return JSON.stringify(learner);
}
