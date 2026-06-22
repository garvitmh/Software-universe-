"use client";

import React, { useState } from "react";

export default function SessionReplayPanel({ playback = [] }) {
  const [activeStep, setActiveStep] = useState(0);

  const steps = playback.length > 0 ? playback : [
    { stepIndex: 1, concept: "security", difficulty: "Beginner", result: "INCORRECT", timestamp: Date.now() - 10000 },
    { stepIndex: 2, concept: "payment", difficulty: "Intermediate", result: "CORRECT", timestamp: Date.now() - 5000 },
    { stepIndex: 3, concept: "order", difficulty: "Senior", result: "CORRECT", timestamp: Date.now() - 1000 }
  ];

  const handleNext = () => {
    setActiveStep(prev => (prev + 1) % steps.length);
  };

  const handlePrev = () => {
    setActiveStep(prev => (prev - 1 + steps.length) % steps.length);
  };

  const active = steps[activeStep] || steps[0];

  return (
    <div className="obs-card" style={{ gridColumn: "span 6" }}>
      <div className="obs-card-title">
        <span>Session Replay Player</span>
        <span style={{ color: "#89B4FA" }}>Replay Engine</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
        {/* Playback Controls Panel */}
        <div style={{
          padding: 12,
          background: "rgba(17, 17, 27, 0.6)",
          border: "1px solid var(--obs-border)",
          borderRadius: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <button onClick={handlePrev} style={{ padding: "4px 10px", background: "#313244", color: "#F8F9FC", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: "bold" }}>
            ◀ PREV
          </button>
          
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <span style={{ fontSize: 9, color: "var(--obs-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              STEP {active.stepIndex} of {steps.length}
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: active.result === "CORRECT" ? "#A6E3A1" : "#F38BA8" }}>
              {active.concept.toUpperCase()} ({active.result})
            </span>
          </div>

          <button onClick={handleNext} style={{ padding: "4px 10px", background: "#313244", color: "#F8F9FC", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: "bold" }}>
            NEXT ▶
          </button>
        </div>

        {/* Step details logs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, maxH: 150, overflowY: "auto" }}>
          {steps.map((st, i) => (
            <div
              key={st.stepIndex}
              onClick={() => setActiveStep(i)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 10px",
                borderRadius: 8,
                background: activeStep === i ? "rgba(137, 180, 250, 0.08)" : "transparent",
                border: activeStep === i ? "1px solid rgba(137, 180, 250, 0.25)" : "1px solid transparent",
                cursor: "pointer",
                transition: "all 0.15s"
              }}
            >
              <div style={{ display: "flex", gap: 8, fontSize: 11.5 }}>
                <span style={{ color: "var(--obs-muted)", width: 14 }}>{st.stepIndex}.</span>
                <span style={{ color: "var(--obs-text)", fontWeight: activeStep === i ? 700 : 500 }}>
                  {st.concept}
                </span>
                <span style={{ color: "var(--obs-muted)", fontSize: 10 }}>({st.difficulty})</span>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, color: st.result === "CORRECT" ? "#A6E3A1" : "#F38BA8" }}>
                {st.result}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
