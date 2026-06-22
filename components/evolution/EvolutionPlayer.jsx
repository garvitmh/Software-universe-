"use client";

import React from "react";
import { useEvolutionState } from "./useEvolution";

// UI Components
import TrafficSlider from "./TrafficSlider";
import TopologyAnimator from "./TopologyAnimator";
import ConstraintTimeline from "./ConstraintTimeline";
import TradeoffViewer from "./TradeoffViewer";
import EvolutionStageCard from "./EvolutionStageCard";
import CapabilityPanel from "./CapabilityPanel";
import CostPanel from "./CostPanel";
import PressurePanel from "./PressurePanel";
import ArchitectureDiffPanel from "./ArchitectureDiffPanel";
import EvolutionStoryPanel from "./EvolutionStoryPanel";
import EvolutionControls from "./EvolutionControls";

export default function EvolutionPlayer() {
  const evolution = useEvolutionState();
  const {
    currentStageIndex,
    currentStage,
    isPlaying,
    speed,
    stagesCount,
    stages,
    goNext,
    goPrevious,
    jumpToStage,
    resetPlayer,
    togglePlay,
    setSpeed
  } = evolution;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>
      {/* Page Header */}
      <div className="card" style={{ padding: "20px 24px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
        <div>
          <span className="eyebrow" style={{ color: "var(--brand)" }}>Scale & Limits</span>
          <h2 style={{ margin: "2px 0 0 0", fontSize: "24px", fontFamily: "Fraunces" }}>
            Architecture Evolution Player
          </h2>
          <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "var(--muted)", maxWidth: "700px" }}>
            Systems don't scale by simply buying bigger machines. Watch the architecture transform,
            unlock new patterns, and balance operational trade-offs as load scales from 10 to 1,000,000 users.
          </p>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "24px"
      }} className="evolution-player-grid">
        
        {/* Left / Center Column: Map & Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", gridColumn: "span 2" }} className="main-canvas-column">
          {/* Load scrubber */}
          <TrafficSlider
            stages={stages}
            currentIndex={currentStageIndex}
            onIndexChange={jumpToStage}
            isPlaying={isPlaying}
            pause={() => isPlaying && togglePlay()}
          />

          {/* Topology Canvas */}
          <TopologyAnimator topology={currentStage.topology} />

          {/* Controls Bar */}
          <EvolutionControls
            isPlaying={isPlaying}
            speed={speed}
            goNext={goNext}
            goPrevious={goPrevious}
            resetPlayer={resetPlayer}
            togglePlay={togglePlay}
            setSpeed={setSpeed}
            currentIndex={currentStageIndex}
            stagesCount={stagesCount}
          />
        </div>

        {/* Right Column: Telemetry & Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }} className="telemetry-details-column">
          {/* Stage Metadata Card */}
          <EvolutionStageCard stage={currentStage} />

          {/* Narrative Story */}
          <EvolutionStoryPanel story={currentStage.story} />

          {/* New Capabilities */}
          <CapabilityPanel capabilities={currentStage.capabilities} />

          {/* Diff Changes */}
          <ArchitectureDiffPanel diff={currentStage.diff} />

          {/* Trade-offs Win/Loss */}
          <TradeoffViewer tradeoffs={currentStage.tradeoffs} />

          {/* Bottlenecks Timeline */}
          <ConstraintTimeline currentStageId={currentStage.id} />

          {/* Forces Pressure gauges */}
          <PressurePanel pressures={currentStage.pressures} />

          {/* Operational Cost meters */}
          <CostPanel cost={currentStage.cost} />
        </div>
      </div>
    </div>
  );
}
