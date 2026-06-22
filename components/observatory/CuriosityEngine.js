/**
 * CuriosityEngine.js
 * 
 * Aggregates and tracks topics that excite the learner (e.g. did-you-know curiosity reads).
 * 
 * Pure functions only.
 */

/**
 * Returns curiosity logs and statistics.
 * 
 * @param {Object} memory - ProfessorMemory state
 * @returns {Object} Curiosity summaries
 */
export function getCuriosityInsight(memory) {
  const history = memory?.curiosityHistory || [];
  const topics = history.map(item => item.topic);

  return {
    exploredCount: history.length,
    topics,
    history
  };
}
