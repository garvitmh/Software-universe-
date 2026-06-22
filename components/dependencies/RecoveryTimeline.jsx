"use client";

import React, { useState, useEffect } from "react";

export default function RecoveryTimeline({ nodeStates, onRecoverNode }) {
  const [activeStep, setActiveStep] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [mttrHistory, setMttrHistory] = useState([]);
  const [startTime, setStartTime] = useState(null);

  const crashedNodes = Object.keys(nodeStates).filter(
    (id) => nodeStates[id] === "crashed" || nodeStates[id] === "collapsed"
  );

  const isSystemDamaged = crashedNodes.length > 0;

  const steps = [
    { label: "Incident Detection", desc: "PagerDuty alarm triggers. Metrics capture traffic drop.", duration: 2000, emoji: "🚨" },
    { label: "Blast Radius Mapping", desc: "Isolating dependencies. Tripping circuit breakers.", duration: 2000, emoji: "🔍" },
    { label: "Remediation & Restart", desc: "Spinning up new replicas. Reverting faulty commits.", duration: 3000, emoji: "⚙️" },
    { label: "Post-Mortem Verification", desc: "Validating API health checks. Resolving warning alerts.", duration: 2000, emoji: "✅" }
  ];

  // Start recovery flow automatically if system is damaged and we haven't started yet
  useEffect(() => {
    if (isSystemDamaged && activeStep === -1) {
      // Start recovery
      setActiveStep(0);
      setProgress(0);
      setStartTime(Date.now());
    } else if (!isSystemDamaged && activeStep !== -1) {
      // System was healed externally
      setActiveStep(-1);
      setProgress(0);
    }
  }, [isSystemDamaged, activeStep]);

  // Handle step intervals
  useEffect(() => {
    if (activeStep === -1 || !isSystemDamaged) return;

    const currentStepConfig = steps[activeStep];
    const startTime = Date.now();
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / currentStepConfig.duration) * 100, 100);
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
        
        if (activeStep < steps.length - 1) {
          setActiveStep((prev) => prev + 1);
          setProgress(0);
        } else {
          // Recovery completed!
          const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);
          // Recover all crashed nodes
          crashedNodes.forEach(nodeId => onRecoverNode(nodeId));
          
          // Log MTTR
          const simulatedMinutes = Math.floor(Math.random() * 15) + 5; // 5-20 min MTTR
          setMttrHistory(prev => [
            {
              timestamp: new Date().toLocaleTimeString(),
              nodes: crashedNodes.join(", "),
              mttr: `${simulatedMinutes} mins`
            },
            ...prev
          ]);
          
          setActiveStep(-1);
          setProgress(0);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [activeStep, isSystemDamaged]);

  const triggerFastRecovery = () => {
    if (!isSystemDamaged) return;
    
    // Instantly recover all
    crashedNodes.forEach(nodeId => onRecoverNode(nodeId));
    
    setMttrHistory(prev => [
      {
        timestamp: new Date().toLocaleTimeString(),
        nodes: crashedNodes.join(", "),
        mttr: "1.2 mins (Fast Failover Bypass)"
      },
      ...prev
    ]);
    
    setActiveStep(-1);
    setProgress(0);
  };

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--hairline)",
        borderRadius: 16,
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        boxShadow: "var(--shadow)"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>⏳</span>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, fontFamily: "monospace" }}>Recovery Timeline (MTTR)</h3>
        </div>
        
        {isSystemDamaged && (
          <button
            onClick={triggerFastRecovery}
            style={{
              background: "#89DCEB",
              color: "#1E1E2E",
              border: "none",
              borderRadius: 6,
              padding: "4px 8px",
              fontSize: 10.5,
              fontWeight: 800,
              cursor: "pointer",
              fontFamily: "monospace"
            }}
          >
            ⚡ Fast Failover
          </button>
        )}
      </div>

      <p style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.45, margin: 0 }}>
        <strong>Mean Time To Recovery (MTTR)</strong> tracks the average duration to detect, isolate, and remediate a live production incident.
      </p>

      {/* Active Recovery Status */}
      {isSystemDamaged ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: 12, borderRadius: 10, background: "var(--bg-2)", border: "1px solid var(--hairline-2)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#F38BA8" }}>Active Incident Recovery Run</span>
            <span style={{ fontSize: 10, fontFamily: "monospace", color: "var(--muted)" }}>
              Step {activeStep + 1} of {steps.length}
            </span>
          </div>

          {/* Progress bar */}
          <div style={{ height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: "var(--brand)",
                transition: "width 0.1s linear"
              }}
            />
          </div>

          {/* Current Step Display */}
          {activeStep !== -1 && (
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginTop: 4 }}>
              <span style={{ fontSize: 18 }}>{steps[activeStep].emoji}</span>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 12, fontWeight: 700 }}>{steps[activeStep].label}</span>
                <span style={{ fontSize: 10.5, color: "var(--ink-2)" }}>{steps[activeStep].desc}</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          style={{
            border: "1px dashed var(--hairline-2)",
            borderRadius: 10,
            padding: "14px 10px",
            textAlign: "center",
            fontSize: 12,
            color: "var(--muted)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6
          }}
        >
          <span>💤</span>
          <span>No active incidents. System MTTR metrics healthy.</span>
        </div>
      )}

      {/* Recovery Steps Checklist */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
        <span style={{ fontSize: 10.5, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Incident Remediation Pipeline
        </span>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {steps.map((st, idx) => {
            const isCompleted = activeStep > idx || activeStep === -1 && !isSystemDamaged;
            const isCurrent = activeStep === idx;
            
            return (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  opacity: isCompleted ? 0.9 : isCurrent ? 1 : 0.4
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    border: isCompleted
                      ? "1.5px solid #A6E3A1"
                      : isCurrent
                      ? "1.5px solid var(--brand)"
                      : "1.5px solid var(--hairline-2)",
                    background: isCompleted
                      ? "#A6E3A1"
                      : isCurrent
                      ? "rgba(99,102,241,0.1)"
                      : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 8.5,
                    color: isCompleted ? "#1E1E2E" : isCurrent ? "var(--brand)" : "var(--muted)"
                  }}
                >
                  {isCompleted ? "✓" : idx + 1}
                </div>
                <span style={{ fontSize: 11.5, fontWeight: isCurrent ? 700 : 500, fontFamily: "monospace" }}>
                  {st.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* MTTR History Ledger */}
      <div style={{ borderTop: "1px solid var(--hairline)", paddingTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
        <span style={{ fontSize: 10.5, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          MTTR Incident Log
        </span>

        {mttrHistory.length === 0 ? (
          <div style={{ fontSize: 10.5, color: "var(--muted)", fontStyle: "italic", textAlign: "center", padding: "4px 0" }}>
            No incident history recorded
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 90, overflowY: "auto" }}>
            {mttrHistory.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 10,
                  padding: "4px 6px",
                  background: "var(--bg-2)",
                  borderRadius: 4
                }}
              >
                <span style={{ fontFamily: "monospace", color: "var(--ink)" }}>
                  [{item.timestamp}] {item.nodes} crashed
                </span>
                <span style={{ fontWeight: 700, color: "#A6E3A1" }}>
                  MTTR: {item.mttr}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
