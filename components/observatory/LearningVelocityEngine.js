/**
 * LearningVelocityEngine.js
 * 
 * Tracks the speed (velocity) of concepts mastered and questions answered,
 * acceleration trends, and plateau risks.
 * 
 * Pure functions only.
 */

/**
 * Calculates learner velocity metrics.
 * 
 * @param {Object} learner - LearnerModel state
 * @param {Object} memory - ProfessorMemory state
 * @returns {Object} Velocity indicators
 */
export function calculateVelocity(learner, memory) {
  const history = memory?.learningHistory || [];
  
  // Calculate question velocity (count of entries in last 24h)
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
  const questionsLastDay = history.filter(h => h.timestamp > oneDayAgo).length;

  // Concept velocity (count of distinct concepts mastered in last week)
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recentConcepts = new Set(
    history
      .filter(h => h.timestamp > oneWeekAgo && h.correct)
      .map(h => h.concept)
  );
  
  // Calculate acceleration (comparing last 10 entries vs previous 10)
  const recent10 = history.slice(0, 10);
  const previous10 = history.slice(10, 20);
  
  const recentSuccessRatio = recent10.length > 0 ? recent10.filter(h => h.correct).length / recent10.length : 0.5;
  const previousSuccessRatio = previous10.length > 0 ? previous10.filter(h => h.correct).length / previous10.length : 0.5;

  const acceleration = recentSuccessRatio - previousSuccessRatio;

  // Plateau Risk: many attempts without breakthrough or positive acceleration
  const plateauRisk = history.length >= 10 && recentSuccessRatio < 0.3 && acceleration <= 0;

  return {
    questionsPerDay: questionsLastDay || 5, // baseline mock if history is fresh
    conceptsPerWeek: recentConcepts.size || 1,
    acceleration: acceleration >= 0 ? "positive" : "stable/negative",
    plateauRisk
  };
}
