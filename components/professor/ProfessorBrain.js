/**
 * ProfessorBrain.js
 * 
 * Central decision engine (the Operating System) of the AI Professor.
 * Evaluates learner model, mastery, curriculum graphs, and current context
 * to recommend the next pedagogical action.
 * 
 * Pure functions only. No React, no DOM, no localStorage.
 */

import { CONCEPT_SCHEMA } from "./ConceptSchema.js";
import { 
  generateNextQuestion, 
  generateMisconceptionQuestion, 
  generateCuriosityQuestion,
  generateChallengeQuestion
} from "./QuestionGenerator.js";

/**
 * Recommends the next action for a learner based on their state, mastery levels,
 * curriculum graph relationships, and current active professor state.
 * 
 * @param {Object} learner - Current learner state (from LearnerModel)
 * @param {Object} mastery - Concept mastery map (learner.conceptMastery)
 * @param {Object} graph - KnowledgeGraph module
 * @param {Object} professorState - Current world/tab state { currentWorld, activeTab }
 * @returns {Object} Recommendation object
 */
export function decideNextAction(learner, mastery = {}, graph, professorState = {}) {
  // Determine current active concept / world ID
  const conceptId = professorState.currentWorld || learner.recentHistory?.[0]?.concept || "security";
  const currentConcept = CONCEPT_SCHEMA[conceptId];
  
  const currentConceptMastery = mastery[conceptId] || { mastery: 10, confidence: 30 };
  const currentLevel = learner.currentLevel || "Beginner";
  
  // 1. Struggling Learner
  // If incorrectStreak >= 3 OR learner has "EXPLAIN_SIMPLER" flag active
  if (learner.incorrectStreak >= 3 || (learner.flags && learner.flags.includes("EXPLAIN_SIMPLER"))) {
    return {
      action: "EXPLAIN_SIMPLER",
      explanationMode: "MENTAL_MODEL",
      nextQuestion: null,
      nextConcept: null,
      nextWorld: null,
      confidence: learner.confidence,
      reason: "Struggling learner profile detected (incorrect streak or explain flag active). Recommend shifting to intuitive analogy.",
      urgency: "high"
    };
  }

  // 2. Low Confidence
  // Mastery > 70, Confidence < 30
  if (currentConceptMastery.mastery > 70 && currentConceptMastery.confidence < 30) {
    const nextQ = generateNextQuestion(learner, mastery, graph, currentConcept);
    return {
      action: "ASK_QUESTION",
      explanationMode: null,
      nextQuestion: nextQ?.question || null,
      nextConcept: null,
      nextWorld: null,
      confidence: learner.confidence,
      reason: "High mastery but low confidence. Prompting with easier questions to rebuild learner confidence.",
      urgency: "medium"
    };
  }

  // 3. Confidently Wrong
  // Mastery < 40, Confidence > 80
  if (currentConceptMastery.mastery < 40 && currentConceptMastery.confidence > 80) {
    const misconceptionQuestion = generateMisconceptionQuestion(conceptId);
    return {
      action: "SHOW_MISCONCEPTION",
      explanationMode: null,
      nextQuestion: misconceptionQuestion,
      nextConcept: null,
      nextWorld: null,
      confidence: learner.confidence,
      reason: "Confidently wrong learner profile. Injecting misconception query to challenge false assumptions.",
      urgency: "high"
    };
  }

  // 4. Weak Neighborhood
  // Adjacent concepts in neighborhood have mastery < 40
  if (graph && graph.getWeakNeighborhood) {
    const weakNeighbors = graph.getWeakNeighborhood(mastery, conceptId);
    if (weakNeighbors && weakNeighbors.length > 0) {
      const targetId = weakNeighbors[0];
      return {
        action: "REVIEW_CONCEPT",
        explanationMode: null,
        nextQuestion: null,
        nextConcept: targetId,
        nextWorld: targetId,
        confidence: learner.confidence,
        reason: `Concept neighborhood check shows adjacent concept '${targetId}' is weak (<40% mastery). Suggesting review.`,
        urgency: "medium"
      };
    }
  }

  // 5. Celebration Engine / Milestone Achievement
  // Mastery > 90 and last answer was correct (streak > 0)
  if (currentConceptMastery.mastery > 90 && learner.correctStreak > 0) {
    return {
      action: "CELEBRATE",
      explanationMode: null,
      nextQuestion: null,
      nextConcept: null,
      nextWorld: null,
      confidence: learner.confidence,
      reason: `Milestone reached! Mastery of '${conceptId}' exceeds 90%. Celebrating learning progress.`,
      urgency: "high"
    };
  }

  // 6. Architect Level Design Challenge
  // If learner is at the Architect difficulty level
  if (currentLevel === "Architect") {
    const challengeQuestion = generateChallengeQuestion(conceptId);
    return {
      action: "DESIGN_CHALLENGE",
      explanationMode: null,
      nextQuestion: challengeQuestion,
      nextConcept: null,
      nextWorld: null,
      confidence: learner.confidence,
      reason: "Architect difficulty reached. Launching open-ended architectural design challenge.",
      urgency: "high"
    };
  }

  // 7. Curiosity Engine
  // 5% chance: deterministic seed based on totalQuestions and conceptId to remain pure
  const pseudoSeed = (learner.totalQuestions || 0) + (conceptId.charCodeAt(0) || 0);
  const pseudoRandom = Math.abs(Math.sin(pseudoSeed)) * 1000 % 1;
  if (pseudoRandom < 0.05) {
    const curiosityQuestion = generateCuriosityQuestion(conceptId);
    return {
      action: "CURIOSITY_MODE",
      explanationMode: null,
      nextQuestion: curiosityQuestion,
      nextConcept: null,
      nextWorld: null,
      confidence: learner.confidence,
      reason: "Curiosity Engine trigger. Injecting wonder-inducing did-you-know curiosity card.",
      urgency: "low"
    };
  }

  // 8. Strong Learner
  // Mastery > 90, Confidence > 80
  if (currentConceptMastery.mastery > 90 && currentConceptMastery.confidence > 80) {
    const actions = ["SHOW_TRADEOFFS", "SHOW_GIANT_EXAMPLE", "SHOW_FAILURES", "SHOW_BURGER_FARM"];
    const actionIndex = (learner.totalQuestions || 0) % actions.length;
    const selectedAction = actions[actionIndex];
    return {
      action: selectedAction,
      explanationMode: null,
      nextQuestion: null,
      nextConcept: null,
      nextWorld: null,
      confidence: learner.confidence,
      reason: `Strong learner profile. Prompting deeper analysis using ${selectedAction.replace("SHOW_", "").toLowerCase()} presentation.`,
      urgency: "low"
    };
  }

  // 9. Default Action: Ask Question
  const nextQ = generateNextQuestion(learner, mastery, graph, currentConcept);
  return {
    action: "ASK_QUESTION",
    explanationMode: null,
    nextQuestion: nextQ?.question || null,
    nextConcept: null,
    nextWorld: null,
    confidence: learner.confidence,
    reason: nextQ?.reason || "Standard pedagogical action: grill learner at matching difficulty level.",
    urgency: "low"
  };
}
