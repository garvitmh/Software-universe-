"use client";

import React from "react";
import TimelinePanel from "./TimelinePanel";
import ConstraintPanel from "./ConstraintPanel";
import FailureStoryPanel from "./FailureStoryPanel";
import ArchitecturePanel from "./ArchitecturePanel";
import TradeoffPanel from "./TradeoffPanel";
import ScalePanel from "./ScalePanel";
import PatternUsagePanel from "./PatternUsagePanel";
import RegretPanel from "./RegretPanel";
import BurgerFarmLessonsPanel from "./BurgerFarmLessonsPanel";
import ArchitectureEvolutionPanel from "./ArchitectureEvolutionPanel";

export default function CaseStudyPlayer({
  company,
  activeTimelineIndex,
  onTimelineChange,
  isPlaying,
  togglePlay,
  speed,
  setSpeed
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>
      {/* Timeline scrubbing */}
      <TimelinePanel
        timeline={company.timeline}
        activeIndex={activeTimelineIndex}
        onIndexChange={onTimelineChange}
        isPlaying={isPlaying}
        togglePlay={togglePlay}
        speed={speed}
        setSpeed={setSpeed}
      />

      {/* Grid panels layout */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "24px"
      }} className="exhibit-panels-grid">
        
        {/* Constraints & Failures */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <ConstraintPanel originalProblem={company.originalProblem} />
          <FailureStoryPanel failures={company.failures} />
          <ScalePanel scale={company.scale} name={company.name} />
        </div>

        {/* Target Architecture & Evolution */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <ArchitecturePanel architecture={company.architecture} />
          <ArchitectureEvolutionPanel />
          <TradeoffPanel tradeoffs={company.tradeoffs} />
        </div>

        {/* Patterns & Regrets */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <PatternUsagePanel patterns={company.patterns} />
          <RegretPanel regrets={company.regrets} />
          <BurgerFarmLessonsPanel burgerFarmRelevance={company.burgerFarmRelevance} />
        </div>

      </div>
    </div>
  );
}
