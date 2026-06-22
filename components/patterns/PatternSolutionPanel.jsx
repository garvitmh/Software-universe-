"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PatternSolutionPanel({ patternName, solution }) {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { label: "1. Trigger Failure", desc: "Outage vector or API lock hits the system layer.", icon: "💥", color: "rgb(239, 68, 68)" },
    { label: `2. Intercept Event`, desc: `The protective '${patternName}' hook registers the error state.`, icon: "🛡️", color: "var(--brand)" },
    { label: "3. Mitigation Loop", desc: "Dynamic mitigation logic handles retrying, routing, or shedding.", icon: "🔄", color: "var(--amber)" },
    { label: "4. Stabilized System", desc: "Failures are isolated and transaction resolves successfully.", icon: "🟢", color: "var(--teal)" }
  ];

  // Auto loop through steps
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="card" style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--teal)" }}>System Resolution</span>
        <h3 style={{ margin: "2px 0 0 0", fontSize: "18px" }}>Solution Behavior</h3>
        <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--muted)" }}>
          {solution}
        </p>
      </div>

      {/* Steps Row */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "14px",
        marginTop: "8px"
      }} className="solution-steps-grid">
        {steps.map((s, idx) => {
          const isCurrent = idx === activeStep;
          return (
            <motion.div
              key={s.label}
              animate={{
                borderColor: isCurrent ? s.color : "var(--hairline)",
                backgroundColor: isCurrent ? "var(--bg-2)" : "var(--surface)",
                y: isCurrent ? -4 : 0
              }}
              onClick={() => setActiveStep(idx)}
              transition={{ duration: 0.3 }}
              style={{
                border: "1px solid var(--hairline)",
                borderRadius: "12px",
                padding: "16px",
                cursor: "pointer",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                gap: "8px"
              }}
            >
              {/* Highlight bar */}
              {isCurrent && (
                <motion.div
                  layoutId="activeStepBar"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    borderTopLeftRadius: "12px",
                    borderTopRightRadius: "12px",
                    backgroundColor: s.color
                  }}
                />
              )}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "12px", fontWeight: "700", color: isCurrent ? "var(--ink)" : "var(--muted)" }}>
                  {s.label}
                </span>
                <span style={{ fontSize: "16px" }}>{s.icon}</span>
              </div>
              <p style={{ margin: 0, fontSize: "11px", color: "var(--muted)", lineHeight: "1.4" }}>
                {s.desc}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
