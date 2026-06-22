/**
 * ObservatoryEngine.js
 * 
 * Central orchestrator of the Observatory layer.
 * Evaluates learner model, memories, and performance curves to produce 
 * a complete, structured analysis of systems transformation.
 * 
 * Pure functions only.
 */

import { calculateTransformationStage } from "./TransformationEngine.js";
import { buildTimeline } from "./TimelineEngine.js";
import { generateInsights } from "./InsightsEngine.js";
import { calculateProgress } from "./ProgressEngine.js";
import { calculateWorldProgress } from "./WorldProgressEngine.js";
import { getCuriosityInsight } from "./CuriosityEngine.js";
import { getArchitectMoments } from "./ArchitectMomentEngine.js";
import { calculateVelocity } from "./LearningVelocityEngine.js";
import { inferLearningStyle } from "./LearningStyleEngine.js";
import { detectRisks } from "./RiskEngine.js";
import { generateRecommendations } from "../professor/RecommendationEngine.js";

/**
 * Compiles all learning data into a structured Observatory insight packet.
 * 
 * @param {Object} learner - LearnerModel state
 * @param {Object} memory - ProfessorMemory state
 * @param {Object} graph - KnowledgeGraph module
 * @param {string} currentWorld - Active concept ID/world name
 * @returns {Object} Complete Observatory state payload
 */
export function compileObservatoryState(learner, memory, graph, currentWorld) {
  const mastery = learner?.conceptMastery || {};
  const targetWorld = currentWorld || learner?.recentHistory?.[0]?.concept || "security";

  const transformation = calculateTransformationStage(learner, memory, mastery);
  const insights = generateInsights(learner, memory);
  const worldProgress = calculateWorldProgress(learner);
  const progress = calculateProgress(learner);
  const architectMoments = getArchitectMoments(memory);
  const curiosity = getCuriosityInsight(memory);
  const velocity = calculateVelocity(learner, memory);
  const style = inferLearningStyle(memory);
  const risks = detectRisks(learner, memory, mastery);
  const timeline = buildTimeline(learner, memory);

  // Generate recommendations
  const recommendations = generateRecommendations(learner, memory, mastery, graph, targetWorld);

  return {
    transformation,
    insights,
    worldProgress,
    mastery: progress.overview,
    architectMoments,
    recommendations,
    curiosity,
    weakAreas: learner?.weakConcepts || [],
    velocity,
    style,
    risks,
    timeline
  };
}
