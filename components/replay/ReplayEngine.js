// components/replay/ReplayEngine.js

import { EVENT_TYPES } from "./ReplaySchema.js";

export function buildTimeline(events) {
  return [...events].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

export function detectBreakthroughs(events) {
  return events.filter(e => e.type === EVENT_TYPES.BREAKTHROUGH);
}

export function detectRepeatedMistakes(events) {
  // Find concepts with multiple mistake/misconception events
  const mistakeEvents = events.filter(
    e => e.type === EVENT_TYPES.MISTAKE || e.type === EVENT_TYPES.MISCONCEPTION
  );

  const conceptCounts = {};
  mistakeEvents.forEach(e => {
    e.concepts.forEach(c => {
      conceptCounts[c] = (conceptCounts[c] || 0) + 1;
    });
  });

  // Filter out concepts that had more than 1 mistake
  const repeatedConcepts = Object.keys(conceptCounts).filter(c => conceptCounts[c] > 1);

  return repeatedConcepts.map(concept => {
    return {
      concept,
      count: conceptCounts[concept],
      events: mistakeEvents.filter(e => e.concepts.includes(concept))
    };
  });
}

export function detectTransformationMoments(events) {
  return events.filter(
    e => e.type === EVENT_TYPES.ARCHITECT_MOMENT || e.type === EVENT_TYPES.TRANSFORMATION
  );
}

export function buildNarrative(events) {
  const sorted = buildTimeline(events);
  if (sorted.length === 0) return "Your journey in Software Universe is just beginning.";

  const breakthroughs = detectBreakthroughs(sorted);
  const transformations = detectTransformationMoments(sorted);
  const mistakes = sorted.filter(e => e.type === EVENT_TYPES.MISTAKE);

  let narrative = `Your architectural journey spans ${sorted.length} logged events. `;
  
  if (sorted[0]) {
    narrative += `You first launched into Software Universe on ${new Date(sorted[0].timestamp).toLocaleDateString()}, focusing on ${sorted[0].concepts.join(" and ")}. `;
  }

  if (mistakes.length > 0) {
    narrative += `Early on, you encountered bottlenecks like "${mistakes[0].title}," teaching you that simple code fails at production limits. `;
  }

  if (breakthroughs.length > 0) {
    const keyBreak = breakthroughs[breakthroughs.length - 1];
    narrative += `A major breakthrough occurred during the "${keyBreak.title}" session, where the mechanics of ${keyBreak.concepts.join("/")} clicked. `;
  }

  if (transformations.length > 0) {
    const latestTrans = transformations[transformations.length - 1];
    narrative += `Ultimately, you achieved a key transition: "${latestTrans.title}", demonstrating that you have started asking 'why' rather than just 'how' to construct systems. `;
  } else {
    narrative += `Continue building to unlock your first key Architect Transformation moment.`;
  }

  return narrative;
}
