"use client";

import React from "react";
import { motion } from "framer-motion";

export default function TrafficSlider({ stages, currentIndex, onIndexChange, isPlaying, pause }) {
  return (
    <div className="card" style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "8px" }}>
        <div>
          <span className="eyebrow" style={{ color: "var(--brand)" }}>Scale Scrubber</span>
          <h3 style={{ margin: "2px 0 0 0", fontSize: "20px" }}>Simulate System Load</h3>
        </div>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase" }}>Active Load</span>
            <div style={{ fontSize: "24px", fontWeight: "800", color: "var(--brand-2)", fontFamily: "Fraunces" }}>
              {stages[currentIndex].label}
            </div>
          </div>
          <div style={{ width: "1px", height: "30px", backgroundColor: "var(--hairline)" }} />
          <div style={{ textAlign: "left" }}>
            <span style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase" }}>Throughput</span>
            <div style={{ fontSize: "18px", fontWeight: "700", color: "var(--ink)", fontFamily: "JetBrains Mono, monospace" }}>
              {stages[currentIndex].rps}
            </div>
          </div>
        </div>
      </div>

      {/* Slider track container */}
      <div style={{ position: "relative", padding: "12px 0 24px 0" }}>
        {/* Underlay progress track */}
        <div style={{
          position: "relative",
          height: "8px",
          borderRadius: "999px",
          background: "var(--bg-2)",
          border: "1px solid var(--hairline-2)"
        }}>
          {/* Active fill */}
          <motion.div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              borderRadius: "999px",
              background: "linear-gradient(90deg, var(--brand-soft), var(--brand))"
            }}
            animate={{ width: `${(currentIndex / (stages.length - 1)) * 100}%` }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          />

          {/* Stepper Dots */}
          {stages.map((stage, idx) => {
            const isActive = idx <= currentIndex;
            const isCurrent = idx === currentIndex;
            return (
              <div
                key={stage.id}
                onClick={() => {
                  if (isPlaying) pause();
                  onIndexChange(idx);
                }}
                style={{
                  position: "absolute",
                  left: `${(idx / (stages.length - 1)) * 100}%`,
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  width: isCurrent ? "16px" : "12px",
                  height: isCurrent ? "16px" : "12px",
                  borderRadius: "50%",
                  background: isCurrent ? "#ffffff" : isActive ? "var(--brand)" : "var(--bg-2)",
                  border: isCurrent ? "3px solid var(--brand)" : "1px solid var(--hairline)",
                  cursor: "pointer",
                  zIndex: 2,
                  boxShadow: isCurrent ? "0 0 12px var(--brand)" : "none",
                  transition: "all 0.2s ease"
                }}
              >
                {/* Tooltip or Label below dot */}
                <div style={{
                  position: "absolute",
                  bottom: "-24px",
                  transform: "translateX(-50%)",
                  left: "50%",
                  whiteSpace: "nowrap",
                  fontSize: "11px",
                  fontWeight: isCurrent ? "700" : "500",
                  color: isCurrent ? "var(--brand-2)" : "var(--muted)",
                  pointerEvents: "none",
                  transition: "color 0.2s ease"
                }}>
                  {stage.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Input range overlay (for scrubbing dragging support) */}
        <input
          type="range"
          min="0"
          max={stages.length - 1}
          step="1"
          value={currentIndex}
          onChange={(e) => {
            if (isPlaying) pause();
            onIndexChange(Number(e.target.value));
          }}
          style={{
            position: "absolute",
            top: "6px",
            left: 0,
            width: "100%",
            height: "20px",
            opacity: 0,
            cursor: "pointer",
            zIndex: 3
          }}
        />
      </div>
    </div>
  );
}
