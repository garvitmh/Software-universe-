/**
 * WorldProgressEngine.js
 * 
 * Maps concept mastery scores to per-world progress ratios (0.0 to 1.0).
 * 
 * Pure functions only.
 */

/**
 * Calculates completion ratios per world.
 * 
 * @param {Object} learner - LearnerModel state
 * @returns {Object} World completion ratios (0.0 to 1.0)
 */
export function calculateWorldProgress(learner) {
  const mastery = learner?.conceptMastery || {};
  const progress = {
    security: 0.1,
    payment: 0.1,
    order: 0.1,
    loyalty: 0.1,
    pos: 0.1,
    delivery: 0.1,
    analytics: 0.1
  };

  // Convert mastery percentage (0-100) to ratio (0-1)
  Object.keys(progress).forEach(world => {
    if (mastery[world]) {
      const score = mastery[world].mastery || 0;
      progress[world] = Math.max(0.1, Math.min(1.0, score / 100)); // Baseline of 0.1 to show initial unlock state
    }
  });

  return progress;
}
