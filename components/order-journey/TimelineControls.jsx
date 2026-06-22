"use client";

import React from "react";

export default function TimelineControls({
  running,
  currentEventIdx,
  events,
  run,
  stepBack,
  stepForward,
  reset,
  posOffline,
  setPosOffline,
  scaleLoad,
  setScaleLoad,
  onScrub
}) {
  const progress = events.length > 0 ? (currentEventIdx + 1) / events.length : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Top Header Controls Area */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 16, borderBottom: "1px solid var(--hairline)", paddingBottom: 16 }}>
        {/* Playback Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button 
            className="btn btn-primary" 
            onClick={run} 
            style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 110, justifyContent: "center", transition: "all 0.2s ease" }}
          >
            {running ? "⏸️ Pause" : currentEventIdx >= events.length - 1 ? "🔄 Replay" : "▶️ Play"}
          </button>
          <button 
            className="btn btn-ghost" 
            onClick={stepBack} 
            disabled={currentEventIdx <= -1} 
            style={{ padding: "6px 12px", minWidth: 38, opacity: currentEventIdx <= -1 ? 0.4 : 1, transition: "opacity 0.2s" }}
            title="Step Back"
          >
            ⏮️
          </button>
          <button 
            className="btn btn-ghost" 
            onClick={stepForward} 
            disabled={currentEventIdx >= events.length - 1} 
            style={{ padding: "6px 12px", minWidth: 38, opacity: currentEventIdx >= events.length - 1 ? 0.4 : 1, transition: "opacity 0.2s" }}
            title="Step Forward"
          >
            ⏭️
          </button>
          <button 
            className="btn btn-ghost" 
            onClick={reset} 
            style={{ padding: "6px 12px", minWidth: 60, transition: "colors 0.2s" }}
          >
            Reset
          </button>
        </div>

        {/* Configuration Toggles */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          {/* POS Offline simulation */}
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, fontWeight: 600, color: "var(--ink-2)", selectSelection: "none" }}>
            <input 
              type="checkbox" 
              checked={posOffline} 
              onChange={() => setPosOffline(!posOffline)} 
              disabled={running}
              style={{ cursor: "pointer", width: 16, height: 16, accentColor: "var(--brand)" }}
            />
            Simulate POS Offline 💥
          </label>

          {/* Scale Load slider */}
          <div style={{ display: "flex", alignItems: "center", background: "var(--bg-2)", border: "1px solid var(--hairline-2)", padding: 4, borderRadius: 8, gap: 4 }}>
            {["10", "100k", "1M"].map((load) => (
              <button
                key={load}
                onClick={() => setScaleLoad(load)}
                disabled={running}
                style={{
                  padding: "4px 10px", border: "none", borderRadius: 6, cursor: running ? "not-allowed" : "pointer", fontSize: 11.5, fontWeight: 700,
                  background: scaleLoad === load ? "var(--brand)" : "transparent",
                  color: scaleLoad === load ? "#fff" : "var(--ink-2)",
                  opacity: running ? 0.6 : 1,
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                }}
              >
                {load === "10" ? "10 Users" : load === "100k" ? "100k Scale" : "1M Scale"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scrubable Timeline Progress Slider */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 600, color: "var(--muted)" }}>
          <span>Timeline (Event {currentEventIdx + 1} of {events.length})</span>
          <span>{running ? "⚡ Simulation Running" : "⏸️ Paused"}</span>
        </div>
        <input 
          type="range"
          min="-1"
          max={events.length - 1}
          value={currentEventIdx}
          onChange={(e) => onScrub(parseInt(e.target.value))}
          style={{ width: "100%", height: 6, background: "var(--hairline-2)", borderRadius: 3, outline: "none", accentColor: "var(--brand)", cursor: "pointer" }}
        />
      </div>
    </div>
  );
}
