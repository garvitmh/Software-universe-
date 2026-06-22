/**
 * SessionReplayEngine.js
 * 
 * Recreates chronological session replays and question sequences from learning history.
 * 
 * Pure functions only.
 */

/**
 * Replays question attempts in reverse chronological order as play steps.
 * 
 * @param {Object} memory - ProfessorMemory state
 * @returns {Object[]} Sequential playback log
 */
export function getPlaybackSequence(memory) {
  const history = memory?.learningHistory || [];
  
  // Return steps sorted earliest first for sequential playback
  return [...history].reverse().map((step, idx) => ({
    stepIndex: idx + 1,
    concept: step.concept,
    difficulty: step.difficulty,
    result: step.correct ? "CORRECT" : "INCORRECT",
    timestamp: step.timestamp
  }));
}
