/**
 * TimelineEngine.js
 * 
 * Aggregates chronological events from history and memory (breakthroughs, successes,
 * misconceptions, architect moments) to create a visual software development journey.
 * 
 * Pure functions only.
 */

/**
 * Builds a chronological learning timeline from historical events.
 * 
 * @param {Object} learner - LearnerModel state
 * @param {Object} memory - ProfessorMemory state
 * @returns {Object[]} Chronological timeline events
 */
export function buildTimeline(learner, memory) {
  const events = [];

  // Add learning history successes/failures
  if (memory?.learningHistory) {
    // Group by day/hour for summary to prevent timeline clutter
    const counts = {};
    memory.learningHistory.forEach(item => {
      const dateStr = new Date(item.timestamp).toLocaleDateString();
      if (!counts[dateStr]) counts[dateStr] = { successes: 0, total: 0 };
      counts[dateStr].total++;
      if (item.correct) counts[dateStr].successes++;
    });

    Object.entries(counts).forEach(([dateStr, stats]) => {
      events.push({
        timestamp: new Date(dateStr).getTime(),
        category: "ACTIVITY",
        title: "Practice Session Completed",
        description: `Solved ${stats.successes}/${stats.total} questions correctly.`,
        icon: "⚡"
      });
    });
  }

  // Add breakthroughs
  if (memory?.breakthroughMoments) {
    memory.breakthroughMoments.forEach(bt => {
      events.push({
        timestamp: bt.timestamp,
        category: "BREAKTHROUGH",
        title: `Breakthrough: ${bt.concept.toUpperCase()}`,
        description: bt.note,
        icon: "🎉"
      });
    });
  }

  // Add corrected misconceptions
  if (memory?.misconceptions) {
    memory.misconceptions.forEach(mc => {
      events.push({
        timestamp: mc.correctedAt,
        category: "MISCONCEPTION",
        title: "Misconception Resolved",
        description: `Clarified false assumptions about '${mc.concept}': "${mc.misconception}".`,
        icon: "💡"
      });
    });
  }

  // Add architect moments
  if (memory?.architectMoments) {
    memory.architectMoments.forEach(am => {
      events.push({
        timestamp: am.timestamp,
        category: "ARCHITECT_MOMENT",
        title: "Architect Milestone Achieved",
        description: am.note,
        icon: "👑"
      });
    });
  }

  // Add curiosity logs
  if (memory?.curiosityHistory) {
    memory.curiosityHistory.forEach(ch => {
      events.push({
        timestamp: ch.timestamp,
        category: "CURIOSITY",
        title: `Explored Curiosity: ${ch.topic.toUpperCase()}`,
        description: "Read did-you-know conceptual context card.",
        icon: "🔍"
      });
    });
  }

  // Sort chronologically (latest first)
  return events.sort((a, b) => b.timestamp - a.timestamp);
}
