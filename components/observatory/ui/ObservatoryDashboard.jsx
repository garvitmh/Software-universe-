"use client";

import React from "react";
import "./Observatory.css";

import KnowledgeRadar from "./KnowledgeRadar";
import MasteryGalaxy from "./MasteryGalaxy";
import ConfidenceEvolutionChart from "./ConfidenceEvolutionChart";
import TransformationTimeline from "./TransformationTimeline";
import ArchitectMomentsPanel from "./ArchitectMomentsPanel";
import BreakthroughPanel from "./BreakthroughPanel";
import WeakPatternsPanel from "./WeakPatternsPanel";
import CuriosityPanel from "./CuriosityPanel";
import WorldProgressMap from "./WorldProgressMap";
import LearningVelocityPanel from "./LearningVelocityPanel";
import RecommendationFeed from "./RecommendationFeed";
import SessionReplayPanel from "./SessionReplayPanel";

export default function ObservatoryDashboard({ observatoryState = {} }) {
  const trans = observatoryState.transformation || { stage: "Explorer", description: "Beginning your systems journey." };
  const style = observatoryState.style || { styleName: "Systems Thinker", explanation: "Likes architectural layouts." };

  const totalQ = observatoryState.totalQuestionsAnswered || 12;
  const correctQ = observatoryState.correctAnswersCount || 8;
  const correctPct = totalQ > 0 ? Math.round((correctQ / totalQ) * 100) : 70;

  return (
    <div className="obs-wrapper animate-fade-in">
      {/* Header Panel */}
      <div className="obs-header">
        <div className="obs-header-title">
          <h1>Observatory Second Brain</h1>
          <p>Analyzing Systems Transformation and Learning Journey Milestones</p>
        </div>
        
        {/* Profile Card Summary */}
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
            <span style={{ fontSize: 10, color: "var(--obs-muted)", textTransform: "uppercase", fontWeight: 700 }}>
              Learning Style
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#94E2D5" }}>
              {style.styleName}
            </span>
          </div>
          
          <div style={{
            height: 24,
            width: 1,
            background: "var(--obs-border)"
          }} />

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
            <span style={{ fontSize: 10, color: "var(--obs-muted)", textTransform: "uppercase", fontWeight: 700 }}>
              Stage Rank
            </span>
            <span className="obs-badge" style={{ background: "var(--grad-brand)", padding: "4px 10px", fontSize: 11, borderRadius: 8 }}>
              {trans.stage}
            </span>
          </div>
        </div>
      </div>

      {/* Narrative block */}
      <div style={{
        background: "rgba(250, 179, 135, 0.03)",
        border: "1px solid rgba(250, 179, 135, 0.1)",
        borderRadius: 12,
        padding: "14px 18px",
        fontSize: 13,
        lineHeight: 1.5,
        color: "var(--obs-muted)"
      }}>
        💡 <strong style={{ color: "#FAB387" }}>Transformation Stage:</strong> {trans.description} <em style={{ color: "#A6E3A1", marginLeft: 8 }}>{trans.nextMilestone}</em>
      </div>

      {/* Main Grid Dashboard */}
      <div className="obs-grid">
        {/* Row 1: Radar, Galaxy, Line Chart (4+4+4 = 12) */}
        <KnowledgeRadar mastery={observatoryState.mastery} />
        <MasteryGalaxy mastery={observatoryState.mastery} />
        <ConfidenceEvolutionChart timeline={observatoryState.timeline} />

        {/* Row 2: Timeline & Architect Moments (6+6 = 12) */}
        <TransformationTimeline timeline={observatoryState.timeline} />
        <ArchitectMomentsPanel moments={observatoryState.architectMoments} />

        {/* Row 3: Breakthroughs & Risks (6+6 = 12) */}
        <BreakthroughPanel breakthroughs={observatoryState.breakthroughMoments} misconceptions={observatoryState.misconceptions} />
        <WeakPatternsPanel weakAreas={observatoryState.weakAreas} risks={observatoryState.risks} />

        {/* Row 4: Curiosity & World Progress Map (6+6 = 12) */}
        <CuriosityPanel curiosity={observatoryState.curiosity} />
        <WorldProgressMap worldProgress={observatoryState.worldProgress} />

        {/* Row 5: Velocity, Recommendation Feed, Session Playback (4+4+4 = 12) */}
        <LearningVelocityPanel velocity={observatoryState.velocity} />
        <RecommendationFeed recommendations={observatoryState.recommendations} />
        <SessionReplayPanel playback={observatoryState.playback} />
      </div>
    </div>
  );
}
