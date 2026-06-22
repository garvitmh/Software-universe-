/**
 * RecommendationEngine.js
 * 
 * Generates personalized, prioritized recommendations for the learner
 * based on their current progress, long-term memory patterns, mastery metrics,
 * and curriculum graph.
 * 
 * Pure functions only. No React, no DOM.
 */

import { getWeakPatterns, getFavoriteThemes } from "./ProfessorMemory.js";

/**
 * Evaluates the learner model, memory records, concept mastery levels,
 * and curriculum graph to produce primary and secondary learning recommendations.
 * 
 * @param {Object} learner - Current learner state
 * @param {Object} memory - Professor memory state
 * @param {Object} mastery - Maps conceptId -> { mastery, confidence, attempts, correctAnswers, lastSeen, streak }
 * @param {Object} graph - KnowledgeGraph module
 * @param {string} currentWorld - Active concept ID/world name
 * @returns {Object} Structured recommendation payload
 */
export function generateRecommendations(learner, memory, mastery = {}, graph, currentWorld) {
  const conceptId = currentWorld || learner.recentHistory?.[0]?.concept || "security";
  const currentConceptMastery = mastery[conceptId] || { mastery: 10, confidence: 30 };
  const preferredMode = memory?.profile?.preferredExplanationMode || "MENTAL_MODEL";
  const currentLevel = learner.currentLevel || "Beginner";

  // 1. WEAK PATTERNS (Critical reinforcement)
  const weakPatterns = memory ? getWeakPatterns(memory) : [];
  if (weakPatterns.length > 0) {
    const target = weakPatterns[0];
    return {
      primaryRecommendation: {
        nextConcept: target,
        nextWorld: target,
        revisitConcepts: weakPatterns,
        curiosityTopics: [],
        recommendedDifficulty: "Beginner",
        reason: `Pattern Analysis: You are repeatedly struggling with '${target}' and related concepts. We recommend reinforcing foundational items before continuing.`,
        confidence: 95,
        urgency: "CRITICAL",
        recommendationType: "REINFORCE",
        explanationMode: preferredMode
      },
      secondaryRecommendations: weakPatterns.slice(1).map(c => ({
        nextConcept: c,
        nextWorld: c,
        recommendedDifficulty: "Beginner",
        reason: `Reinforce weak pattern '${c}'`,
        urgency: "HIGH",
        recommendationType: "REINFORCE"
      })),
      optionalCuriosityTopics: []
    };
  }

  // 2. WEAK CONCEPTS (Review)
  const weakConcepts = learner.weakConcepts || [];
  if (weakConcepts.length > 0) {
    const target = weakConcepts[0];
    return {
      primaryRecommendation: {
        nextConcept: target,
        nextWorld: target,
        revisitConcepts: weakConcepts,
        curiosityTopics: [],
        recommendedDifficulty: "Beginner",
        reason: `Foundational Review: Concept '${target}' mastery is below 40%. We recommend a targeted review of this concept.`,
        confidence: 90,
        urgency: "HIGH",
        recommendationType: "REVIEW",
        explanationMode: preferredMode
      },
      secondaryRecommendations: weakConcepts.slice(1).map(c => ({
        nextConcept: c,
        nextWorld: c,
        recommendedDifficulty: "Beginner",
        reason: `Review weak concept '${c}'`,
        urgency: "HIGH",
        recommendationType: "REVIEW"
      })),
      optionalCuriosityTopics: []
    };
  }

  // 3. BREAKTHROUGH UNLOCK PATHS
  if (memory?.breakthroughMoments && memory.breakthroughMoments.length > 0) {
    const lastBreakthrough = memory.breakthroughMoments[0];
    // Suggest adjacent unlocked concepts if a breakthrough happened recently
    if (graph && graph.getUnlocks) {
      const unlocks = graph.getUnlocks(lastBreakthrough.concept) || [];
      if (unlocks.length > 0) {
        const target = unlocks[0];
        return {
          primaryRecommendation: {
            nextConcept: target,
            nextWorld: target,
            revisitConcepts: [],
            curiosityTopics: [],
            recommendedDifficulty: "Intermediate",
            reason: `Breakthrough Path: Having successfully unlocked '${lastBreakthrough.concept}', we recommend moving forward to '${target}' which is now enabled!`,
            confidence: 85,
            urgency: "MEDIUM",
            recommendationType: "BREAKTHROUGH",
            explanationMode: preferredMode
          },
          secondaryRecommendations: unlocks.slice(1).map(c => ({
            nextConcept: c,
            nextWorld: c,
            recommendedDifficulty: "Intermediate",
            reason: `Unlock adjacent path: '${c}'`,
            urgency: "MEDIUM",
            recommendationType: "BREAKTHROUGH"
          })),
          optionalCuriosityTopics: []
        };
      }
    }
  }

  // 4. ARCHITECT CHALLENGES (Deep design mode)
  if (currentConceptMastery.mastery > 90 && currentConceptMastery.confidence > 80) {
    const challengeTopics = ["CAP Theorem", "Saga Pattern", "Eventual Consistency"];
    return {
      primaryRecommendation: {
        nextConcept: conceptId,
        nextWorld: conceptId,
        revisitConcepts: [],
        curiosityTopics: challengeTopics,
        recommendedDifficulty: "Architect",
        reason: `Architect Challenge: You have achieved outstanding mastery (>90%) and confidence (>80%) on '${conceptId}'. We challenge you to design a high-scale architecture for this system!`,
        confidence: 95,
        urgency: "MEDIUM",
        recommendationType: "ARCHITECT_CHALLENGE",
        explanationMode: "DEEP_EXPLORATION"
      },
      secondaryRecommendations: [],
      optionalCuriosityTopics: challengeTopics
    };
  }

  // 5. STRONG THEMES / FAVORITES
  const favoriteThemes = memory ? getFavoriteThemes(memory) : [];
  if (favoriteThemes.length > 0) {
    const target = favoriteThemes[0];
    return {
      primaryRecommendation: {
        nextConcept: target,
        nextWorld: target,
        revisitConcepts: [],
        curiosityTopics: [],
        recommendedDifficulty: currentLevel,
        reason: `Personal Interest: Based on your strong performance and interest in '${target}', we suggest deep-diving further into this theme.`,
        confidence: 80,
        urgency: "LOW",
        recommendationType: "EXPLORE",
        explanationMode: preferredMode
      },
      secondaryRecommendations: favoriteThemes.slice(1).map(c => ({
        nextConcept: c,
        nextWorld: c,
        recommendedDifficulty: currentLevel,
        reason: `Explore favorite theme '${c}'`,
        urgency: "LOW",
        recommendationType: "EXPLORE"
      })),
      optionalCuriosityTopics: ["Kafka", "Distributed Tracing", "Saga Orchestrators"]
    };
  }

  // 6. DEFAULT ROADMAP PROGRESSION
  let nextTarget = null;
  if (graph && graph.getUnlocks) {
    const unlocks = graph.getUnlocks(conceptId) || [];
    if (unlocks.length > 0) {
      nextTarget = unlocks[0];
    }
  }

  // Fallback to first concept with low mastery
  if (!nextTarget && graph && graph.KNOWLEDGE_GRAPH) {
    const allConcepts = Object.keys(graph.KNOWLEDGE_GRAPH);
    nextTarget = allConcepts.find(c => {
      const m = mastery[c];
      return !m || m.mastery < 40;
    });
  }

  if (!nextTarget) {
    nextTarget = "security"; // absolute default fallback
  }

  return {
    primaryRecommendation: {
      nextConcept: nextTarget,
      nextWorld: nextTarget,
      revisitConcepts: [],
      curiosityTopics: [],
      recommendedDifficulty: currentLevel,
      reason: `Pedagogical Roadmap: We recommend advancing to '${nextTarget}' to progress along the Software Universe curriculum path.`,
      confidence: 75,
      urgency: "LOW",
      recommendationType: "ADVANCE",
      explanationMode: preferredMode
    },
    secondaryRecommendations: [],
    optionalCuriosityTopics: ["CAP Theorem", "Snowflake IDs", "Paxos"]
  };
}
