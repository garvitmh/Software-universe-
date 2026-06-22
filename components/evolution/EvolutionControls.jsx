"use client";

import React from "react";
import { motion } from "framer-motion";

const SPEED_OPTIONS = [0.5, 1, 2, 4];

export default function EvolutionControls({
  isPlaying,
  speed,
  goNext,
  goPrevious,
  resetPlayer,
  togglePlay,
  setSpeed,
  currentIndex,
  stagesCount
}) {
  return (
    <div className="card" style={{ padding: "16px 20px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
      {/* Playback action group */}
      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
        <button
          onClick={resetPlayer}
          title="Reset back to Stage 1"
          style={{
            background: "var(--bg-2)",
            border: "1px solid var(--hairline)",
            borderRadius: "8px",
            padding: "8px 12px",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          ⏮ Reset
        </button>

        <button
          onClick={goPrevious}
          disabled={currentIndex === 0}
          style={{
            background: "var(--bg-2)",
            border: "1px solid var(--hairline)",
            borderRadius: "8px",
            padding: "8px 12px",
            cursor: currentIndex === 0 ? "not-allowed" : "pointer",
            fontSize: "14px",
            opacity: currentIndex === 0 ? 0.4 : 1
          }}
        >
          ⏪ Prev
        </button>

        <motion.button
          onClick={togglePlay}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{
            background: isPlaying ? "rgba(249, 115, 22, 0.1)" : "var(--brand)",
            border: `1px solid ${isPlaying ? "var(--brand)" : "var(--brand)"}`,
            borderRadius: "10px",
            padding: "10px 20px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "700",
            color: isPlaying ? "var(--brand-2)" : "#fff",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          {isPlaying ? "⏸ Pause" : "▶ Play Evolution"}
        </motion.button>

        <button
          onClick={goNext}
          disabled={currentIndex === stagesCount - 1}
          style={{
            background: "var(--bg-2)",
            border: "1px solid var(--hairline)",
            borderRadius: "8px",
            padding: "8px 12px",
            cursor: currentIndex === stagesCount - 1 ? "not-allowed" : "pointer",
            fontSize: "14px",
            opacity: currentIndex === stagesCount - 1 ? 0.4 : 1
          }}
        >
          ⏩ Next
        </button>
      </div>

      {/* Speed multiplier group */}
      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
        <span style={{ fontSize: "12px", color: "var(--muted)", fontWeight: "600" }}>Speed:</span>
        {SPEED_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setSpeed(s)}
            style={{
              padding: "4px 10px",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: "700",
              cursor: "pointer",
              fontFamily: "JetBrains Mono, monospace",
              background: speed === s ? "var(--brand)" : "var(--bg-2)",
              color: speed === s ? "#fff" : "var(--muted)",
              border: `1px solid ${speed === s ? "var(--brand)" : "var(--hairline)"}`,
              transition: "all 0.15s ease"
            }}
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  );
}
