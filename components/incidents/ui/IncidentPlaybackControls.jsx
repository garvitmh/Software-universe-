"use client";

import React from "react";
import { motion } from "framer-motion";
import { useIncidentContext } from "../IncidentContext";

const SPEED_OPTIONS = [0.5, 1, 2, 4];

const STEP_LABELS = [
  { label: "Detection", color: "var(--pop-pink)" },
  { label: "Investigation", color: "#F97316" },
  { label: "Mitigation", color: "var(--amber)" },
  { label: "Verification", color: "var(--pop-blue)" },
  { label: "Resolution", color: "var(--teal)" }
];

export default function IncidentPlaybackControls() {
  const {
    activeStep,
    isPlaying,
    playbackSpeed,
    totalSteps,
    play,
    pause,
    nextStep,
    prevStep,
    setPlaybackSpeed,
    reset,
    status
  } = useIncidentContext();

  const progress = (activeStep / (totalSteps - 1)) * 100;
  const currentStepInfo = STEP_LABELS[activeStep] || STEP_LABELS[0];

  return (
    <div className="card" style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "12px" }}>
      {/* Status + step label */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span style={{ fontSize: "13px", fontWeight: "700", color: currentStepInfo.color }}>
            ● {currentStepInfo.label}
          </span>
          <span style={{ fontSize: "11px", color: "var(--faint)", fontFamily: "JetBrains Mono, monospace" }}>
            Step {activeStep + 1} of {totalSteps}
          </span>
        </div>
        <span style={{
          fontSize: "11px", fontWeight: "700", padding: "2px 10px", borderRadius: "999px",
          background: status === "RESOLVED" ? "var(--teal-soft)" : isPlaying ? "rgba(255,77,141,0.1)" : "var(--bg-2)",
          color: status === "RESOLVED" ? "var(--teal)" : isPlaying ? "var(--pop-pink)" : "var(--muted)",
          border: `1px solid ${status === "RESOLVED" ? "rgba(15,110,86,0.2)" : isPlaying ? "rgba(255,77,141,0.2)" : "var(--hairline)"}`
        }}>
          {status}
        </span>
      </div>

      {/* Progress bar / scrubber */}
      <div style={{ position: "relative", height: "8px", borderRadius: "4px", background: "var(--bg-2)", overflow: "visible" }}>
        {/* Step markers */}
        {STEP_LABELS.map((s, i) => (
          <div
            key={i}
            onClick={() => {
              // Jump to step
              pause();
              // reset then advance? For now just show dot
            }}
            style={{
              position: "absolute",
              left: `${(i / (totalSteps - 1)) * 100}%`,
              top: "50%", transform: "translate(-50%, -50%)",
              width: "12px", height: "12px", borderRadius: "50%",
              background: i <= activeStep ? s.color : "var(--hairline-2)",
              border: i === activeStep ? `2px solid var(--bg)` : "none",
              boxShadow: i === activeStep ? `0 0 8px ${s.color}80` : "none",
              zIndex: 2, cursor: "pointer", transition: "all 0.3s ease"
            }}
          />
        ))}
        {/* Fill */}
        <motion.div
          style={{
            position: "absolute", left: 0, top: 0, height: "100%",
            borderRadius: "4px",
            background: `linear-gradient(90deg, var(--pop-pink), ${currentStepInfo.color})`
          }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Controls row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
        {/* Transport controls */}
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <button
            onClick={reset}
            title="Reset"
            style={{ background: "var(--bg-2)", border: "1px solid var(--hairline)", borderRadius: "8px", padding: "6px 10px", cursor: "pointer", fontSize: "14px" }}
          >
            ⏮
          </button>
          <button
            onClick={prevStep}
            disabled={activeStep === 0}
            style={{ background: "var(--bg-2)", border: "1px solid var(--hairline)", borderRadius: "8px", padding: "6px 10px", cursor: activeStep === 0 ? "not-allowed" : "pointer", fontSize: "14px", opacity: activeStep === 0 ? 0.4 : 1 }}
          >
            ⏪
          </button>
          <motion.button
            onClick={isPlaying ? pause : play}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: isPlaying ? "rgba(255,77,141,0.15)" : "var(--brand)",
              border: `1px solid ${isPlaying ? "rgba(255,77,141,0.3)" : "var(--brand)"}`,
              borderRadius: "10px", padding: "8px 18px", cursor: "pointer",
              fontSize: "14px", fontWeight: "700", color: isPlaying ? "var(--pop-pink)" : "#fff",
              display: "flex", alignItems: "center", gap: "6px"
            }}
          >
            {isPlaying ? "⏸ Pause" : "▶ Play"}
          </motion.button>
          <button
            onClick={nextStep}
            disabled={activeStep === totalSteps - 1}
            style={{ background: "var(--bg-2)", border: "1px solid var(--hairline)", borderRadius: "8px", padding: "6px 10px", cursor: activeStep === totalSteps - 1 ? "not-allowed" : "pointer", fontSize: "14px", opacity: activeStep === totalSteps - 1 ? 0.4 : 1 }}
          >
            ⏩
          </button>
        </div>

        {/* Speed selector */}
        <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
          <span style={{ fontSize: "11px", color: "var(--muted)", fontWeight: "600" }}>Speed:</span>
          {SPEED_OPTIONS.map(s => (
            <button
              key={s}
              onClick={() => setPlaybackSpeed(s)}
              style={{
                padding: "3px 8px", borderRadius: "5px", fontSize: "11px", fontWeight: "700",
                cursor: "pointer", fontFamily: "JetBrains Mono, monospace",
                background: playbackSpeed === s ? "var(--brand)" : "var(--bg-2)",
                color: playbackSpeed === s ? "#fff" : "var(--muted)",
                border: `1px solid ${playbackSpeed === s ? "var(--brand)" : "var(--hairline)"}`
              }}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
