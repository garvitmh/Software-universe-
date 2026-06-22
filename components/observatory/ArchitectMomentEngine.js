/**
 * ArchitectMomentEngine.js
 * 
 * Compiles and filters architect moments (milestones where the learner successfully
 * reasoned about system trade-offs, failure states, or scaling constraints).
 * 
 * Pure functions only.
 */

/**
 * Returns a list of architect milestones from memory.
 * 
 * @param {Object} memory - ProfessorMemory state
 * @returns {Object[]} Transformation moments
 */
export function getArchitectMoments(memory) {
  return memory?.architectMoments || [];
}
