// components/planet-scale/PlanetControls.jsx

import React from "react";
import { usePlanetScale } from "./usePlanetScale";

export default function PlanetControls() {
  const {
    playbackState,
    playTimeline,
    setPlaybackSpeed,
    resetWorld,
    increaseScale,
    scale
  } = usePlanetScale();

  const { isPlaying, speed, step } = playbackState;

  return (
    <div className="card" style={{
      padding: "16px 20px",
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "16px",
      backgroundColor: "var(--surface)",
      border: "1px solid var(--hairline-2)"
    }}>
      {/* Simulation Playback controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button
          onClick={() => playTimeline(!isPlaying)}
          style={{
            padding: "8px 16px",
            borderRadius: "8px",
            backgroundColor: isPlaying ? "var(--amber)" : "var(--brand)",
            color: "#ffffff",
            border: "none",
            fontWeight: "700",
            fontSize: "12px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <span>{isPlaying ? "⏸️ Pause" : "▶️ Play Telemetry"}</span>
        </button>

        <span style={{ fontSize: "11px", color: "var(--muted)", fontWeight: "600" }}>
          Step: {step}
        </span>
      </div>

      {/* Speed Multiplier */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <span style={{ fontSize: "11px", color: "var(--muted)" }}>Speed:</span>
        {[1, 2, 5].map((s) => (
          <button
            key={s}
            onClick={() => setPlaybackSpeed(s)}
            style={{
              padding: "4px 8px",
              borderRadius: "4px",
              border: "1px solid var(--hairline-2)",
              backgroundColor: speed === s ? "var(--brand-soft)" : "var(--bg-2)",
              color: speed === s ? "var(--brand-2)" : "var(--muted)",
              fontWeight: "700",
              fontSize: "10px",
              cursor: "pointer"
            }}
          >
            {s}x
          </button>
        ))}
      </div>

      {/* Manual Actions */}
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={increaseScale}
          style={{
            padding: "6px 12px",
            borderRadius: "6px",
            border: "1px solid var(--hairline-2)",
            backgroundColor: "var(--bg-2)",
            fontSize: "11px",
            fontWeight: "700",
            cursor: "pointer"
          }}
        >
          ⚖️ Cycle Scale ({scale.toUpperCase()})
        </button>

        <button
          onClick={resetWorld}
          style={{
            padding: "6px 12px",
            borderRadius: "6px",
            border: "1px solid var(--hairline-2)",
            backgroundColor: "var(--bg-2)",
            color: "var(--pink)",
            fontSize: "11px",
            fontWeight: "700",
            cursor: "pointer"
          }}
        >
          🔄 Reset World
        </button>
      </div>
    </div>
  );
}
