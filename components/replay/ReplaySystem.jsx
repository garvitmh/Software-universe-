// components/replay/ReplaySystem.jsx

import React, { useState, useEffect } from "react";
import { MOCK_HISTORY_EVENTS } from "./ReplaySchema";
import { buildTimeline } from "./ReplayEngine";
import ReplayTimeline from "./ReplayTimeline";
import SessionHeatmap from "./SessionHeatmap";
import LearningPathPanel from "./LearningPathPanel";
import BreakthroughPanel from "./BreakthroughPanel";
import MistakePanel from "./MistakePanel";
import CuriosityPanel from "./CuriosityPanel";
import ArchitectMomentPanel from "./ArchitectMomentPanel";
import TransformationPanel from "./TransformationPanel";
import KnowledgeConstellation from "./KnowledgeConstellation";
import ProgressGraph from "./ProgressGraph";
import ReplayControls from "./ReplayControls";
import ReplayNarrator from "./ReplayNarrator";
import ReplayPlayer from "./ReplayPlayer";

export default function ReplaySystem() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentIndex, setCurrentIndex] = useState(0);

  const rawTimeline = buildTimeline(MOCK_HISTORY_EVENTS);

  // Filter timeline events
  const filteredEvents = rawTimeline.filter(e => {
    if (activeFilter === "all") return true;
    return e.type === activeFilter;
  });

  // Keep index within bounds of filtered list
  useEffect(() => {
    if (currentIndex >= filteredEvents.length) {
      setCurrentIndex(Math.max(0, filteredEvents.length - 1));
    }
  }, [activeFilter, filteredEvents.length, currentIndex]);

  // Playback timer loop
  useEffect(() => {
    let timer = null;
    if (isPlaying && filteredEvents.length > 0) {
      timer = setInterval(() => {
        setCurrentIndex(prev => {
          if (prev >= filteredEvents.length - 1) {
            setIsPlaying(false); // Stop when end is reached
            return prev;
          }
          return prev + 1;
        });
      }, 2500 / speed);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, speed, filteredEvents.length]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>
      {/* Header Profile Title */}
      <div className="card" style={{
        padding: "16px 20px",
        backgroundColor: "var(--surface)",
        borderLeft: "4px solid var(--brand)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div>
          <span style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Software Universe Chronicles
          </span>
          <h2 style={{ margin: "2px 0 0 0", fontSize: "18px", fontFamily: "Fraunces" }}>
            Apprentice Progress Replay & Growth Summary
          </h2>
        </div>
        <span className="pill" style={{ backgroundColor: "var(--brand-soft)", color: "var(--brand-2)", fontWeight: "bold" }}>
          Ascension Phase: SENIOR
        </span>
      </div>

      {/* Grid structure */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
        gap: "24px"
      }} className="ways-grid">
        
        {/* Left Column (Timelines & Heatmaps) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {filteredEvents.length > 0 && (
            <ReplayTimeline
              events={filteredEvents}
              currentIndex={currentIndex}
              onSelectIndex={setCurrentIndex}
            />
          )}
          <SessionHeatmap events={rawTimeline} />
          <LearningPathPanel events={rawTimeline} />
          <BreakthroughPanel events={rawTimeline} />
          <MistakePanel events={rawTimeline} />
        </div>

        {/* Right Column (Cards, Controls & Narratives) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {filteredEvents[currentIndex] && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--muted)" }}>
                ACTIVE TIMELINE CHECKPOINT CARD:
              </span>
              <ReplayPlayer event={filteredEvents[currentIndex]} />
            </div>
          )}
          
          <ReplayControls
            isPlaying={isPlaying}
            onTogglePlay={() => setIsPlaying(!isPlaying)}
            speed={speed}
            onChangeSpeed={setSpeed}
            activeFilter={activeFilter}
            onChangeFilter={(f) => {
              setActiveFilter(f);
              setCurrentIndex(0);
            }}
          />
          <ReplayNarrator events={rawTimeline} />
          <CuriosityPanel events={rawTimeline} />
          <ArchitectMomentPanel events={rawTimeline} />
          <TransformationPanel events={rawTimeline} />
        </div>

      </div>

      {/* Galaxy Map & Curves (Full width at bottom) */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }}>
        <KnowledgeConstellation events={rawTimeline} />
        <ProgressGraph events={rawTimeline} />
      </div>
    </div>
  );
}
