"use client";

import React from "react";
import { motion } from "framer-motion";

export default function TimelineControls({ isPlaying, onTogglePlay, currentTime, totalDuration, speed, onChangeSpeed, onScrub }) {
  return (
    <div style={{
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "16px",
      padding: "16px",
      borderRadius: "12px",
      backgroundColor: "var(--bg-2)",
      border: "1px solid var(--hairline-2)"
    }}>
      {/* Play/Pause Button */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <motion.button
          onClick={onTogglePlay}
          className="btn btn-primary"
          style={{
            padding: "8px 16px",
            fontSize: "14px",
            background: isPlaying ? "var(--pink)" : "var(--brand)",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
          whileTap={{ scale: 0.96 }}
        >
          <span>{isPlaying ? "⏸️ Pause" : "▶️ Play"}</span>
        </motion.button>

        {/* Speed Buttons */}
        <div style={{ display: "flex", gap: "4px" }}>
          {[1, 2, 5, 10].map(s => (
            <button
              key={s}
              onClick={() => onChangeSpeed(s)}
              style={{
                padding: "4px 10px",
                fontSize: "12px",
                fontWeight: "bold",
                borderRadius: "6px",
                border: speed === s ? "1.5px solid var(--brand)" : "1px solid var(--hairline-2)",
                backgroundColor: speed === s ? "var(--brand-soft)" : "var(--surface)",
                color: speed === s ? "var(--brand-2)" : "var(--ink-2)",
                cursor: "pointer"
              }}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Scrub Slider */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        gap: "12px",
        minWidth: "200px"
      }}>
        <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--ink-2)" }}>0 ms</span>
        <input
          type="range"
          min="0"
          max={totalDuration}
          value={currentTime}
          onChange={(e) => onScrub(Number(e.target.value))}
          style={{
            flex: 1,
            accentColor: "var(--brand)",
            cursor: "pointer",
            height: "6px",
            borderRadius: "3px"
          }}
        />
        <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--ink-2)" }}>{totalDuration} ms</span>
      </div>

      {/* Current Time Display */}
      <div style={{
        fontSize: "13px",
        fontWeight: "bold",
        backgroundColor: "var(--surface)",
        padding: "6px 12px",
        borderRadius: "8px",
        border: "1.5px solid var(--hairline-2)",
        minWidth: "120px",
        textAlign: "center"
      }}>
        ⏱️ {currentTime} / {totalDuration} ms
      </div>
    </div>
  );
}
