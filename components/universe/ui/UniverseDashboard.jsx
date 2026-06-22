"use client";

import React, { useState } from "react";
import { useUniverse } from "../UniverseContext";
import { motion } from "framer-motion";

// Sub-components imports
import UniverseCompass from "./UniverseCompass";
import NarrativeViewer from "./NarrativeViewer";
import ReflectionPanel from "./ReflectionPanel";
import ChallengeArena from "./ChallengeArena";
import TransformationTimeline from "./TransformationTimeline";
import OpportunityRadar from "./OpportunityRadar";
import ArchitectJourney from "./ArchitectJourney";
import UniverseMap from "./UniverseMap";
import WorldExplorer from "./WorldExplorer";
import LearningFeed from "./LearningFeed";
import ArchitectMomentPanel from "./ArchitectMomentPanel";
import StrengthPanel from "./StrengthPanel";
import WeaknessPanel from "./WeaknessPanel";
import NextBreakthroughPanel from "./NextBreakthroughPanel";
import JourneyMode from "../../journey/JourneyMode";
import FlowPlayer from "../../runtime/ui/FlowPlayer";
import WarRoom from "../../incidents/ui/WarRoom";
import EvolutionPlayer from "../../evolution/EvolutionPlayer";
import PatternAtlas from "../../patterns/PatternAtlas";
import CaseStudyMuseum from "../../case-studies/CaseStudyMuseum";
import PlanetScaleSimulator from "../../planet-scale/PlanetScaleSimulator";


const LEARNER_STAGES = [
  { id: "BEGINNER", label: "Beginner" },
  { id: "APPRENTICE", label: "Apprentice" },
  { id: "PRACTITIONER", label: "Practitioner" },
  { id: "SENIOR", label: "Senior" },
  { id: "ARCHITECT", label: "Architect" },
  { id: "SYSTEM_THINKER", label: "System Thinker" }
];

export default function UniverseDashboard() {
  const { state, cognitiveState, updateTraffic } = useUniverse();
  const [activeTab, setActiveTab] = useState("overview"); // overview | constellation | labs | achievements

  const currentStage = cognitiveState.learnerState?.stage || "BEGINNER";
  const progressPercent = cognitiveState.learnerState?.mastery || 35;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px", width: "100%", paddingBottom: "80px" }}>
      {/* ── UNIVERSE HEADER ── */}
      <motion.div
        className="card"
        style={{
          padding: "28px",
          background: "var(--surface)",
          display: "flex",
          flexDirection: "column",
          gap: "20px"
        }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
          <div>
            <span className="eyebrow" style={{ color: "var(--brand)" }}>Control Room</span>
            <h1 style={{ margin: "4px 0 0 0", fontSize: "32px", fontFamily: "Fraunces" }}>
              Software Universe Command Center
            </h1>
            <p style={{ margin: "4px 0 0 0", fontSize: "14px", color: "var(--muted)" }}>
              Central monitoring and learning control panel of the Software Universe telemetry layer.
            </p>
          </div>

          {/* Interactive Simulation Controls */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            padding: "16px",
            borderRadius: "12px",
            backgroundColor: "var(--bg-2)",
            border: "1px solid var(--hairline-2)",
            minWidth: "280px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--ink-2)" }}>Simulate Scale (Traffic)</span>
              <span className="pill" style={{ background: "var(--brand-soft)", color: "var(--brand-2)", fontSize: "11px" }}>
                {state.traffic.toLocaleString()} req/sec
              </span>
            </div>
            <input
              type="range"
              min="100"
              max="25000"
              step="100"
              value={state.traffic}
              onChange={(e) => updateTraffic(Number(e.target.value))}
              style={{ width: "100%", accentColor: "var(--brand)", cursor: "pointer" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "var(--muted)" }}>
              <span>Minimal (100)</span>
              <span>Production (10k)</span>
              <span>100x Scale (25k)</span>
            </div>
          </div>
        </div>

        {/* Real-time System Metrics Bar */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "14px",
          borderTop: "1px solid var(--hairline)",
          paddingTop: "20px"
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)" }}>Avg Latency</span>
            <span style={{ fontSize: "18px", fontWeight: "700", color: "var(--ink)" }}>{cognitiveState.systemState?.latency || 0} ms</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)" }}>P99 Latency</span>
            <span style={{ fontSize: "18px", fontWeight: "700", color: "var(--ink)" }}>{cognitiveState.systemState?.p99 || 0} ms</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)" }}>Error Rate</span>
            <span style={{ fontSize: "18px", fontWeight: "700", color: cognitiveState.systemState?.errorRate > 5 ? "var(--pink)" : "var(--teal)" }}>
              {cognitiveState.systemState?.errorRate || 0}%
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)" }}>Queue Depth</span>
            <span style={{ fontSize: "18px", fontWeight: "700", color: "var(--ink)" }}>{cognitiveState.systemState?.queueDepth || 0} jobs</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)" }}>Dominant Constraint</span>
            <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--amber)", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }} title={cognitiveState.architectureState?.constraints}>
              {cognitiveState.architectureState?.constraints || "None"}
            </span>
          </div>
        </div>
      </motion.div>

      {/* ── CURRENT STAGE STEPPER ── */}
      <motion.div
        className="card"
        style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span className="eyebrow" style={{ color: "var(--brand-2)" }}>Growth Progression</span>
            <h3 style={{ margin: "2px 0 0 0", fontSize: "18px" }}>Apprentice Evolution Stage</h3>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--brand)" }}>
              Concept Mastery: {progressPercent}%
            </span>
          </div>
        </div>

        {/* Stepper Grid */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "8px",
          flexWrap: "wrap",
          padding: "10px 0"
        }}>
          {LEARNER_STAGES.map((stage, idx) => {
            const isCurrent = currentStage === stage.id;
            const isPassed = LEARNER_STAGES.findIndex(s => s.id === currentStage) >= idx;

            return (
              <React.Fragment key={stage.id}>
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "6px",
                  flex: 1,
                  minWidth: "100px"
                }}>
                  <div style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    backgroundColor: isCurrent ? "var(--brand)" : isPassed ? "var(--brand-soft)" : "var(--bg-2)",
                    border: isCurrent ? "3px solid var(--brand-soft)" : isPassed ? "1px solid var(--brand)" : "1px solid var(--hairline-2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "12px",
                    color: isCurrent ? "#ffffff" : isPassed ? "var(--brand-2)" : "var(--faint)",
                    boxShadow: isCurrent ? "0 0 10px rgba(99, 102, 241, 0.4)" : "none",
                    transition: "all 0.3s ease"
                  }}>
                    {idx + 1}
                  </div>
                  <span style={{
                    fontSize: "12px",
                    fontWeight: isCurrent ? "700" : "500",
                    color: isCurrent ? "var(--brand-2)" : "var(--ink-2)",
                    textAlign: "center"
                  }}>
                    {stage.label}
                  </span>
                </div>
                {idx < LEARNER_STAGES.length - 1 && (
                  <div style={{
                    flex: 1,
                    height: "2px",
                    backgroundColor: isPassed ? "var(--brand)" : "var(--hairline-2)",
                    minWidth: "16px",
                    alignSelf: "center",
                    marginBottom: "20px"
                  }} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </motion.div>

      {/* ── TABS NAVIGATION ── */}
      <div style={{ display: "flex", borderBottom: "2px solid var(--hairline)", gap: "24px" }}>
        <button
          onClick={() => setActiveTab("overview")}
          style={{
            background: "none",
            border: "none",
            borderBottom: activeTab === "overview" ? "3px solid var(--brand)" : "3px solid transparent",
            color: activeTab === "overview" ? "var(--brand)" : "var(--muted)",
            fontSize: "16px",
            fontWeight: "700",
            padding: "10px 4px",
            cursor: "pointer",
            outline: "none",
            transition: "all 0.2s ease"
          }}
        >
          ⚔️ Command Center
        </button>
        <button
          onClick={() => setActiveTab("constellation")}
          style={{
            background: "none",
            border: "none",
            borderBottom: activeTab === "constellation" ? "3px solid var(--brand)" : "3px solid transparent",
            color: activeTab === "constellation" ? "var(--brand)" : "var(--muted)",
            fontSize: "16px",
            fontWeight: "700",
            padding: "10px 4px",
            cursor: "pointer",
            outline: "none",
            transition: "all 0.2s ease"
          }}
        >
          🌌 Constellation Map
        </button>
        <button
          onClick={() => setActiveTab("labs")}
          style={{
            background: "none",
            border: "none",
            borderBottom: activeTab === "labs" ? "3px solid var(--brand)" : "3px solid transparent",
            color: activeTab === "labs" ? "var(--brand)" : "var(--muted)",
            fontSize: "16px",
            fontWeight: "700",
            padding: "10px 4px",
            cursor: "pointer",
            outline: "none",
            transition: "all 0.2s ease"
          }}
        >
          🧪 Active Laboratories
        </button>
        <button
          onClick={() => setActiveTab("achievements")}
          style={{
            background: "none",
            border: "none",
            borderBottom: activeTab === "achievements" ? "3px solid var(--brand)" : "3px solid transparent",
            color: activeTab === "achievements" ? "var(--brand)" : "var(--muted)",
            fontSize: "16px",
            fontWeight: "700",
            padding: "10px 4px",
            cursor: "pointer",
            outline: "none",
            transition: "all 0.2s ease"
          }}
        >
          🛡️ Hall of Realizations
        </button>
        <button
          onClick={() => setActiveTab("journey")}
          style={{
            background: "none",
            border: "none",
            borderBottom: activeTab === "journey" ? "3px solid var(--brand)" : "3px solid transparent",
            color: activeTab === "journey" ? "var(--brand)" : "var(--muted)",
            fontSize: "16px",
            fontWeight: "700",
            padding: "10px 4px",
            cursor: "pointer",
            outline: "none",
            transition: "all 0.2s ease"
          }}
        >
          🌱 Guided Journeys
        </button>
        <button
          onClick={() => setActiveTab("flowplayer")}
          style={{
            background: "none",
            border: "none",
            borderBottom: activeTab === "flowplayer" ? "3px solid var(--brand)" : "3px solid transparent",
            color: activeTab === "flowplayer" ? "var(--brand)" : "var(--muted)",
            fontSize: "16px",
            fontWeight: "700",
            padding: "10px 4px",
            cursor: "pointer",
            outline: "none",
            transition: "all 0.2s ease"
          }}
        >
          🎮 Flow Player
        </button>
        <button
          onClick={() => setActiveTab("warroom")}
          style={{
            background: "none",
            border: "none",
            borderBottom: activeTab === "warroom" ? "3px solid var(--brand)" : "3px solid transparent",
            color: activeTab === "warroom" ? "var(--brand)" : "var(--muted)",
            fontSize: "16px",
            fontWeight: "700",
            padding: "10px 4px",
            cursor: "pointer",
            outline: "none",
            transition: "all 0.2s ease"
          }}
        >
          ⚔️ Incident War Room
        </button>
        <button
          onClick={() => setActiveTab("evolution")}
          style={{
            background: "none",
            border: "none",
            borderBottom: activeTab === "evolution" ? "3px solid var(--brand)" : "3px solid transparent",
            color: activeTab === "evolution" ? "var(--brand)" : "var(--muted)",
            fontSize: "16px",
            fontWeight: "700",
            padding: "10px 4px",
            cursor: "pointer",
            outline: "none",
            transition: "all 0.2s ease"
          }}
        >
          📈 Evolution Player
        </button>
        <button
          onClick={() => setActiveTab("patterns")}
          style={{
            background: "none",
            border: "none",
            borderBottom: activeTab === "patterns" ? "3px solid var(--brand)" : "3px solid transparent",
            color: activeTab === "patterns" ? "var(--brand)" : "var(--muted)",
            fontSize: "16px",
            fontWeight: "700",
            padding: "10px 4px",
            cursor: "pointer",
            outline: "none",
            transition: "all 0.2s ease"
          }}
        >
          🗺️ Pattern Atlas
        </button>
        <button
          onClick={() => setActiveTab("museum")}
          style={{
            background: "none",
            border: "none",
            borderBottom: activeTab === "museum" ? "3px solid var(--brand)" : "3px solid transparent",
            color: activeTab === "museum" ? "var(--brand)" : "var(--muted)",
            fontSize: "16px",
            fontWeight: "700",
            padding: "10px 4px",
            cursor: "pointer",
            outline: "none",
            transition: "all 0.2s ease"
          }}
        >
          🏛️ Case Study Museum
        </button>
        <button
          onClick={() => setActiveTab("planetscale")}
          style={{
            background: "none",
            border: "none",
            borderBottom: activeTab === "planetscale" ? "3px solid var(--brand)" : "3px solid transparent",
            color: activeTab === "planetscale" ? "var(--brand)" : "var(--muted)",
            fontSize: "16px",
            fontWeight: "700",
            padding: "10px 4px",
            cursor: "pointer",
            outline: "none",
            transition: "all 0.2s ease"
          }}
        >
          🌍 Planet Scale Simulator
        </button>
      </div>

      {/* ── TAB CONTENT ── */}
      <div style={{ width: "100%" }}>
        {activeTab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "28px" }}>
            {/* Grid system for layout */}
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 8fr) minmax(0, 4fr)", gap: "28px" }} className="ways-grid">
              
              {/* Left Column (Core Interactive Panels) */}
              <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
                {/* Hero Narrative Card */}
                <NarrativeViewer />

                {/* Challenge Arena */}
                <ChallengeArena />

                {/* Learning Telemetry Feed */}
                <LearningFeed />
              </div>

              {/* Right Column (Side Diagnostics & Compass) */}
              <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
                {/* Next Breakthrough Rocket Card */}
                <NextBreakthroughPanel />

                {/* Learning Path Compass */}
                <UniverseCompass />

                {/* Opportunity Radar Scanner */}
                <OpportunityRadar />

                {/* SRE Strengths Panel */}
                <StrengthPanel />

                {/* Conceptual Blind Spots Weaknesses */}
                <WeaknessPanel />
              </div>

            </div>
          </div>
        )}

        {activeTab === "constellation" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            <UniverseMap />
          </div>
        )}

        {activeTab === "labs" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            <WorldExplorer />
          </div>
        )}

        {activeTab === "achievements" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px" }} className="path-grid">
            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              <ArchitectJourney />
              <TransformationTimeline />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              <ArchitectMomentPanel />
              <ReflectionPanel />
            </div>
          </div>
        )}

        {activeTab === "journey" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            <JourneyMode />
          </div>
        )}

        {activeTab === "flowplayer" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            <FlowPlayer />
          </div>
        )}

        {activeTab === "warroom" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            <WarRoom />
          </div>
        )}

        {activeTab === "evolution" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            <EvolutionPlayer />
          </div>
        )}

        {activeTab === "patterns" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            <PatternAtlas />
          </div>
        )}

        {activeTab === "museum" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            <CaseStudyMuseum />
          </div>
        )}
        {activeTab === "planetscale" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            <PlanetScaleSimulator />
          </div>
        )}
      </div>
    </div>
  );
}
