/**
 * ProfessorMemory.js
 * 
 * Tracks the long-term memory, history, achievements, and misconceptions 
 * of the learner.
 * 
 * Memory updates are append-only and return new immutable memory states.
 * Pure functions only.
 */

/**
 * Returns a new initial empty memory structure.
 * @returns {Object} Initial memory state
 */
export function createInitialMemory() {
  return {
    profile: {
      preferredDifficulty: "Beginner",
      preferredExplanationMode: "MENTAL_MODEL",
      personality: "Mentor",
      learningStyle: "Systems thinker"
    },
    favoriteConcepts: [],
    weakConcepts: [],
    breakthroughMoments: [],
    misconceptions: [],
    learningHistory: [], // Capped at 1000 items
    curiosityHistory: [],
    masterySnapshots: {}, // Maps conceptId -> number[]
    worldProgress: {}, // Maps world/concept -> progress (0.0 to 1.0)
    architectMoments: []
  };
}

/**
 * Commits a learning or pedagogical event to the memory state.
 * Returns a new updated copy of the memory.
 * 
 * @param {Object} memory - Current memory state
 * @param {Object} event - Event descriptor
 * @returns {Object} New updated memory state
 */
export function rememberEvent(memory, event) {
  const nextMemory = {
    ...memory,
    profile: { ...memory.profile },
    favoriteConcepts: [...memory.favoriteConcepts],
    weakConcepts: [...memory.weakConcepts],
    breakthroughMoments: [...memory.breakthroughMoments],
    misconceptions: [...memory.misconceptions],
    learningHistory: [...memory.learningHistory],
    curiosityHistory: [...memory.curiosityHistory],
    masterySnapshots: { ...memory.masterySnapshots },
    worldProgress: { ...memory.worldProgress },
    architectMoments: [...memory.architectMoments]
  };

  const t = event.timestamp || Date.now();

  switch (event.type) {
    case "SUCCESS":
    case "FAILURE": {
      const correct = event.type === "SUCCESS";
      
      // Append to learning history and cap at 1000
      nextMemory.learningHistory = [
        {
          world: event.concept,
          concept: event.concept,
          timestamp: t,
          difficulty: event.difficulty || "Beginner",
          correct
        },
        ...nextMemory.learningHistory
      ].slice(0, 1000);

      // Record mastery snapshot
      const currentSnaps = nextMemory.masterySnapshots[event.concept] || [];
      const score = event.details?.mastery !== undefined ? event.details.mastery : (correct ? 75 : 25);
      nextMemory.masterySnapshots[event.concept] = [...currentSnaps, score].slice(-20); // Keep last 20 snapshots

      // Re-evaluate weak/favorite collections dynamically based on last 5 answers
      const conceptHistory = nextMemory.learningHistory.filter(h => h.concept === event.concept).slice(0, 5);
      const successes = conceptHistory.filter(h => h.correct).length;
      
      // Update weakConcepts list
      if (conceptHistory.length >= 3 && successes / conceptHistory.length <= 0.4) {
        if (!nextMemory.weakConcepts.includes(event.concept)) {
          nextMemory.weakConcepts.push(event.concept);
        }
      } else {
        nextMemory.weakConcepts = nextMemory.weakConcepts.filter(c => c !== event.concept);
      }

      // Update favoriteConcepts list
      if (conceptHistory.length >= 3 && successes / conceptHistory.length >= 0.8) {
        if (!nextMemory.favoriteConcepts.includes(event.concept)) {
          nextMemory.favoriteConcepts.push(event.concept);
        }
      } else {
        nextMemory.favoriteConcepts = nextMemory.favoriteConcepts.filter(c => c !== event.concept);
      }
      break;
    }

    case "BREAKTHROUGH":
      nextMemory.breakthroughMoments = [
        {
          concept: event.concept,
          timestamp: t,
          note: event.details?.note || "Breakthrough milestone achieved."
        },
        ...nextMemory.breakthroughMoments
      ];
      break;

    case "MISCONCEPTION":
      nextMemory.misconceptions = [
        {
          concept: event.concept,
          misconception: event.details?.misconception || "Common misconception",
          correctedAt: t
        },
        ...nextMemory.misconceptions
      ];
      break;

    case "CURIOSITY":
      nextMemory.curiosityHistory = [
        {
          topic: event.concept,
          timestamp: t,
          details: event.details || null
        },
        ...nextMemory.curiosityHistory
      ];
      break;

    case "WORLD_COMPLETION":
      nextMemory.worldProgress[event.concept] = 1.0;
      break;

    case "ARCHITECT_MOMENT":
      nextMemory.architectMoments = [
        {
          timestamp: t,
          concept: event.concept,
          note: event.details?.note || "Architect transformation moment achieved."
        },
        ...nextMemory.architectMoments
      ];
      break;

    default:
      break;
  }

  return nextMemory;
}

/**
 * Appends a breakthrough moment to memory.
 */
export function recordBreakthrough(memory, conceptId, note) {
  return rememberEvent(memory, {
    type: "BREAKTHROUGH",
    concept: conceptId,
    details: { note }
  });
}

/**
 * Appends a corrected misconception to memory.
 */
export function recordMisconception(memory, conceptId, misconception) {
  return rememberEvent(memory, {
    type: "MISCONCEPTION",
    concept: conceptId,
    details: { misconception }
  });
}

/**
 * Analyzes memory history to identify repeated patterns of failure/weakness.
 * Returns a list of weak concepts with high failure ratios.
 * 
 * @param {Object} memory - Current memory state
 * @returns {string[]} Concept IDs matching weak trends
 */
export function getWeakPatterns(memory) {
  const counts = {};
  const failures = {};
  
  memory.learningHistory.forEach(item => {
    const concept = item.concept;
    counts[concept] = (counts[concept] || 0) + 1;
    if (!item.correct) {
      failures[concept] = (failures[concept] || 0) + 1;
    }
  });

  const weakPatterns = [];
  for (const concept in counts) {
    if (counts[concept] >= 3 && (failures[concept] / counts[concept]) >= 0.6) {
      weakPatterns.push(concept);
    }
  }
  return weakPatterns;
}

/**
 * Analyzes learning and curiosity history to identify favorite topics/themes.
 * Returns a sorted list of favorite concept IDs.
 * 
 * @param {Object} memory - Current memory state
 * @returns {string[]} Concept IDs matching favorite trends
 */
export function getFavoriteThemes(memory) {
  const scores = {};
  
  // Learning success scores
  memory.learningHistory.forEach(item => {
    if (item.correct) {
      scores[item.concept] = (scores[item.concept] || 0) + 2;
    } else {
      scores[item.concept] = (scores[item.concept] || 0) - 1;
    }
  });
  
  // Curiosity clicks / reads
  memory.curiosityHistory.forEach(item => {
    scores[item.topic] = (scores[item.topic] || 0) + 3;
  });

  // Breakthrough moments
  memory.breakthroughMoments.forEach(item => {
    scores[item.concept] = (scores[item.concept] || 0) + 5;
  });

  return Object.entries(scores)
    .filter(([_, score]) => score > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([concept]) => concept);
}

/**
 * Returns all transformation/architect milestones.
 * @param {Object} memory - Current memory state
 * @returns {Object[]} Architect moments
 */
export function getArchitectMoments(memory) {
  return memory.architectMoments || [];
}
