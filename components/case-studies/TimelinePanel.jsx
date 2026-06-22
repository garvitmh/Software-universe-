"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TimelinePanel({
  timeline,
  activeIndex,
  onIndexChange,
  isPlaying,
  togglePlay,
  speed,
  setSpeed
}) {
  if (!timeline || timeline.length === 0) return null;

  const currentEvent = timeline[activeIndex] || timeline[0];

  return (
    <div className="card" style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <span className="eyebrow" style={{ color: "var(--brand)" }}>Historical Milestones</span>
          <h3 style={{ margin: "2px 0 0 0", fontSize: "18px" }}>Historical Evolution</h3>
        </div>

        {/* Timeline Control bar */}
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <button
            onClick={() => onIndexChange(0)}
            style={{
              background: "var(--bg-2)", border: "1px solid var(--hairline)", borderRadius: "6px",
              padding: "4px 10px", fontSize: "11px", fontWeight: "700", cursor: "pointer",
              color: "var(--muted)"
            }}
          >
            Reset
          </button>
          <button
            onClick={() => onIndexChange(Math.max(0, activeIndex - 1))}
            disabled={activeIndex === 0}
            style={{
              background: "var(--bg-2)", border: "1px solid var(--hairline)", borderRadius: "6px",
              padding: "4px 10px", fontSize: "11px", fontWeight: "700", cursor: activeIndex === 0 ? "not-allowed" : "pointer",
              color: "var(--muted)", opacity: activeIndex === 0 ? 0.4 : 1
            }}
          >
            ◀ Back
          </button>
          <motion.button
            onClick={togglePlay}
            whileTap={{ scale: 0.95 }}
            style={{
              background: isPlaying ? "rgba(249, 115, 22, 0.1)" : "var(--brand)",
              border: "none", borderRadius: "8px",
              padding: "6px 14px", fontSize: "11px", fontWeight: "700", cursor: "pointer",
              color: isPlaying ? "var(--brand-2)" : "#fff"
            }}
          >
            {isPlaying ? "⏸ Pause" : "▶ Play"}
          </motion.button>
          <button
            onClick={() => onIndexChange(Math.min(timeline.length - 1, activeIndex + 1))}
            disabled={activeIndex === timeline.length - 1}
            style={{
              background: "var(--bg-2)", border: "1px solid var(--hairline)", borderRadius: "6px",
              padding: "4px 10px", fontSize: "11px", fontWeight: "700", cursor: activeIndex === timeline.length - 1 ? "not-allowed" : "pointer",
              color: "var(--muted)", opacity: activeIndex === timeline.length - 1 ? 0.4 : 1
            }}
          >
            Next ▶
          </button>
        </div>
      </div>

      {/* Progress timeline dots bar */}
      <div style={{
        position: "relative",
        height: "4px",
        background: "var(--bg-2)",
        borderRadius: "2px",
        margin: "12px 10px 24px 10px"
      }}>
        {/* Active fill */}
        <div style={{
          position: "absolute",
          left: 0,
          top: 0,
          height: "100%",
          width: `${(activeIndex / (timeline.length - 1 || 1)) * 100}%`,
          background: "var(--brand)",
          borderRadius: "2px",
          transition: "width 0.3s ease"
        }} />

        {timeline.map((event, idx) => {
          const isCurrent = idx === activeIndex;
          const isPassed = idx <= activeIndex;
          return (
            <div
              key={event.year}
              onClick={() => onIndexChange(idx)}
              style={{
                position: "absolute",
                left: `${(idx / (timeline.length - 1 || 1)) * 100}%`,
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: isCurrent ? "14px" : "10px",
                height: isCurrent ? "14px" : "10px",
                borderRadius: "50%",
                background: isCurrent ? "#fff" : isPassed ? "var(--brand)" : "var(--bg-3)",
                border: isCurrent ? "3px solid var(--brand)" : "1px solid var(--hairline)",
                cursor: "pointer",
                zIndex: 2,
                transition: "all 0.2s"
              }}
            >
              {/* Year label below */}
              <div style={{
                position: "absolute",
                bottom: "-20px",
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: "10px",
                fontWeight: isCurrent ? "700" : "500",
                color: isCurrent ? "var(--brand-2)" : "var(--muted)",
                whiteSpace: "nowrap"
              }}>
                {event.year}
              </div>
            </div>
          );
        })}
      </div>

      {/* Active timeline event details card */}
      <div style={{
        background: "var(--bg)",
        border: "1px solid var(--hairline-2)",
        borderRadius: "12px",
        padding: "16px 20px",
        minHeight: "100px"
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "800", color: "var(--brand-2)" }}>
                {currentEvent.title}
              </h4>
              <span style={{ fontSize: "12px", fontWeight: "800", color: "var(--brand)" }}>
                {currentEvent.year}
              </span>
            </div>
            <p style={{ margin: "6px 0 0 0", fontSize: "12px", color: "var(--muted)", lineHeight: "1.5" }}>
              {currentEvent.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
