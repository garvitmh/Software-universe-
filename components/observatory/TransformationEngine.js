/**
 * TransformationEngine.js
 * 
 * Computes the learner's developmental stage (Explorer, Builder, Engineer, 
 * Senior Engineer, Architect) based on concept mastery, history, and achievements.
 * 
 * Pure functions only.
 */

/**
 * Calculates the stage of learner transformation.
 * 
 * @param {Object} learner - LearnerModel state
 * @param {Object} memory - ProfessorMemory state
 * @param {Object} mastery - Maps conceptId -> { mastery, confidence, ... }
 * @returns {Object} Stage details { stage, description, nextMilestone }
 */
export function calculateTransformationStage(learner, memory, mastery = {}) {
  const masteryScores = Object.values(mastery).map(m => m.mastery || 0);
  const totalConcepts = masteryScores.length;
  
  const highMastery50 = masteryScores.filter(s => s >= 50).length;
  const highMastery70 = masteryScores.filter(s => s >= 70).length;
  const highMastery85 = masteryScores.filter(s => s >= 85).length;
  const highMastery90 = masteryScores.filter(s => s >= 90).length;

  const breakthroughs = memory?.breakthroughMoments?.length || 0;
  const architectMoments = memory?.architectMoments?.length || 0;
  
  let stage = "Explorer";
  let description = "You are beginning your journey, exploring the foundational principles of distributed systems.";
  let nextMilestone = "Master at least 2 concepts above 50% to become a Builder.";

  if (highMastery90 >= 4 && learner.currentLevel === "Architect" && architectMoments >= 1) {
    stage = "Architect";
    description = "Outstanding! You reason about tradeoffs, failures, and complex systems at a world-class level.";
    nextMilestone = "You have achieved the highest engineering rank.";
  } else if (highMastery85 >= 4 && breakthroughs >= 2) {
    stage = "Senior Engineer";
    description = "You possess deep core systems knowledge and have overcome complex technical misconceptions.";
    nextMilestone = "Achieve 90%+ mastery on 4 concepts, solve an Architect challenge, and register an Architect moment to unlock Architect.";
  } else if (highMastery70 >= 3) {
    stage = "Engineer";
    description = "You build robust, reliable features and understand how to construct core workflows.";
    nextMilestone = "Achieve 85%+ mastery on 4 concepts and register at least 2 breakthroughs to unlock Senior Engineer.";
  } else if (highMastery50 >= 2) {
    stage = "Builder";
    description = "You are successfully creating systems and assembling functional applications.";
    nextMilestone = "Achieve 70%+ mastery on 3 concepts to unlock Engineer.";
  }

  return {
    stage,
    description,
    nextMilestone,
    milestones: {
      highMastery50,
      highMastery70,
      highMastery85,
      highMastery90,
      breakthroughs,
      architectMoments
    }
  };
}
