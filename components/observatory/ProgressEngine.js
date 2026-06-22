/**
 * ProgressEngine.js
 * 
 * Extracts concept mastery scores, confidence logs, and overall curriculum
 * progress metrics.
 * 
 * Pure functions only.
 */

/**
 * Calculates current progress metrics.
 * 
 * @param {Object} learner - LearnerModel state
 * @returns {Object} Progress overview
 */
export function calculateProgress(learner) {
  const mastery = learner?.conceptMastery || {};
  const overview = {};

  Object.entries(mastery).forEach(([concept, data]) => {
    overview[concept] = {
      mastery: data.mastery || 0,
      confidence: data.confidence || 0,
      attempts: data.attempts || 0,
      streak: data.streak || 0
    };
  });

  return {
    overview,
    globalConfidence: learner?.confidence || 50,
    totalQuestionsAnswered: learner?.totalQuestions || 0,
    correctAnswersCount: learner?.correctAnswers || 0
  };
}
