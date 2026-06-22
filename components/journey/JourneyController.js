/**
 * JourneyController.js
 * 
 * Functions to evaluate a learner's progression status against the Guided Journeys.
 */

import { JOURNEYS } from "./JourneyState.js";

/**
 * Checks if a specific step is unlocked for the learner.
 * 
 * @param {Object} step - Step definition object
 * @param {Object} state - The raw learner/telemetry state from context
 * @returns {boolean} True if unlocked
 */
export function isStepUnlocked(step, state = {}) {
  const learner = state.learner || {};
  const mastery = learner.mastery || {};
  const milestones = learner.milestones || [];

  // Check milestone requirement
  if (step.milestone) {
    return milestones.includes(step.milestone);
  }

  // Check concept mastery requirement
  if (step.concept) {
    const currentMastery = mastery[step.concept] || 0;
    return currentMastery >= (step.requiredMastery || 0);
  }

  return true; // No requirements means unlocked
}

/**
 * Evaluates a journey's completion status.
 * 
 * @param {string} journeyId - The ID of the target journey
 * @param {Object} state - The raw learner/telemetry state from context
 * @returns {Object} Progress stats: { steps, completedCount, activeStepIndex, activeStepId }
 */
export function evaluateJourneyProgress(journeyId, state = {}) {
  const journey = JOURNEYS[journeyId];
  if (!journey) return null;

  const steps = journey.steps;
  let completedCount = 0;
  let activeStepIndex = 0;
  let foundActive = false;

  const stepsStatus = steps.map((step, idx) => {
    const unlocked = isStepUnlocked(step, state);
    const completed = unlocked && (step.concept ? (state.learner?.mastery?.[step.concept] || 0) >= Math.min(100, (step.requiredMastery || 0) + 20) : true);

    if (completed) {
      completedCount++;
    }

    if (!completed && !foundActive) {
      activeStepIndex = idx;
      foundActive = true;
    }

    return {
      ...step,
      unlocked,
      completed
    };
  });

  if (!foundActive) {
    activeStepIndex = steps.length - 1;
  }

  return {
    journeyId,
    title: journey.title,
    description: journey.description,
    color: journey.color,
    steps: stepsStatus,
    completedCount,
    totalSteps: steps.length,
    activeStepIndex,
    activeStepId: steps[activeStepIndex]?.id || null,
    percentage: Math.round((completedCount / steps.length) * 100)
  };
}

/**
 * Evaluates progress across all journeys.
 * 
 * @param {Object} state - The raw learner/telemetry state from context
 * @returns {Object} Map of journey progress payloads
 */
export function evaluateAllJourneys(state = {}) {
  const results = {};
  Object.keys(JOURNEYS).forEach(key => {
    results[key] = evaluateJourneyProgress(key, state);
  });
  return results;
}
