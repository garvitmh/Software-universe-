// components/planet-scale/PlanetScaleSimulator.jsx

import React from "react";
import { PlanetScaleProvider, usePlanetScale } from "./usePlanetScale";
import WorldMapCanvas from "./WorldMapCanvas";
import PlanetControls from "./PlanetControls";
import LatencyPanel from "./LatencyPanel";
import ConsistencyPanel from "./ConsistencyPanel";
import ReplicationPanel from "./ReplicationPanel";
import CDNPanel from "./CDNPanel";
import PartitionPanel from "./PartitionPanel";
import DisasterPanel from "./DisasterPanel";
import FailoverPanel from "./FailoverPanel";
import CostPanel from "./CostPanel";
import PressurePanel from "./PressurePanel";
import TopologyPanel from "./TopologyPanel";
import TradeoffPanel from "./TradeoffPanel";
import MetricsPanel from "./MetricsPanel";
import IncidentPanel from "./IncidentPanel";
import ScaleTimelinePanel from "./ScaleTimelinePanel";
import PlanetReplayPanel from "./PlanetReplayPanel";

function SimulatorLayout() {
  const { activeScenario, scale, globalMetrics } = usePlanetScale();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>
      {/* Active Scenario Title Banner */}
      <div className="card" style={{
        padding: "16px 20px",
        backgroundColor: "var(--surface)",
        borderLeft: "4px solid var(--brand)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div>
          <span style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Active Simulator Profile</span>
          <h2 style={{ margin: "2px 0 0 0", fontSize: "18px", fontFamily: "Fraunces" }}>
            {activeScenario === "normal" ? "Routine Cluster telemetry" : "⚡ CRITICAL SCENARIO: " + activeScenario.toUpperCase().replace("_", " ")}
          </h2>
        </div>
        <div style={{ display: "flex", gap: "16px", fontSize: "12px" }}>
          <div>
            <span style={{ color: "var(--muted)" }}>Global Load:</span>{" "}
            <strong style={{ color: "var(--brand)" }}>{scale.toUpperCase()}</strong>
          </div>
          <div>
            <span style={{ color: "var(--muted)" }}>SLA Availability:</span>{" "}
            <strong style={{ color: globalMetrics.availability > 95 ? "var(--teal)" : "var(--pink)" }}>
              {globalMetrics.availability}%
            </strong>
          </div>
        </div>
      </div>

      {/* World Map Container */}
      <WorldMapCanvas />

      {/* Controls Container */}
      <PlanetControls />

      {/* Grid of Diagnostics Panels */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
        gap: "24px"
      }} className="ways-grid">
        
        {/* Core telemetry and speed-of-light constraints */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <LatencyPanel />
          <ReplicationPanel />
          <PartitionPanel />
          <DisasterPanel />
          <CostPanel />
          <IncidentPanel />
        </div>

        {/* Configurations, failover logic, and tradeoff charts */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <ConsistencyPanel />
          <CDNPanel />
          <FailoverPanel />
          <PressurePanel />
          <TopologyPanel />
          <TradeoffPanel />
        </div>

        {/* Global overview, scales, and automation scripts */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <MetricsPanel />
          <ScaleTimelinePanel />
          <PlanetReplayPanel />
        </div>

      </div>
    </div>
  );
}

export default function PlanetScaleSimulator() {
  return (
    <PlanetScaleProvider>
      <SimulatorLayout />
    </PlanetScaleProvider>
  );
}
