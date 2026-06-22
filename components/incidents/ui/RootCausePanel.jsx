"use client";

import React from "react";
import { motion } from "framer-motion";
import { useIncidentContext } from "../IncidentContext";

export default function RootCausePanel() {
  const { rootCause, activeStep } = useIncidentContext();

  const isRevealed = activeStep >= 2;

  return (
    <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--muted)" }}>AI Diagnostics</span>
        <h3 style={{ margin: "2px 0 0 0", fontSize: "16px" }}>Root Cause Analysis</h3>
      </div>

      {!isRevealed ? (
        <div style={{
          padding: "24px",
          textAlign: "center",
          borderRadius: "10px",
          background: "var(--bg-2)",
          border: "1px dashed var(--hairline-2)"
        }}>
          <span style={{ fontSize: "28px" }}>🔍</span>
          <p style={{ margin: "10px 0 0 0", fontSize: "13px", color: "var(--muted)" }}>
            Investigation ongoing. Advance the timeline to reveal root cause analysis.
          </p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
          {/* Confidence meter */}
          <div style={{
            padding: "14px 16px",
            borderRadius: "10px",
            background: "rgba(255,77,141,0.08)",
            border: "1px solid rgba(255,77,141,0.2)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--ink)" }}>
                🎯 {rootCause?.component}
              </span>
              <span style={{ fontSize: "18px", fontWeight: "800", color: "var(--pop-pink)", fontFamily: "JetBrains Mono, monospace" }}>
                {rootCause?.confidence}%
              </span>
            </div>
            {/* Confidence bar */}
            <div style={{ height: "8px", borderRadius: "4px", background: "var(--bg-2)", overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${rootCause?.confidence || 0}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{ height: "100%", borderRadius: "4px", background: "linear-gradient(90deg, var(--pop-pink), var(--pop-purple))" }}
              />
            </div>
            <span style={{ fontSize: "10px", color: "var(--muted)", marginTop: "4px", display: "block" }}>Confidence Score</span>
          </div>

          {/* Evidence */}
          <div style={{ padding: "14px 16px", borderRadius: "10px", background: "var(--surface-warm)", border: "1px solid var(--hairline)" }}>
            <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--muted)", fontWeight: "700" }}>Evidence</span>
            <p style={{ margin: "6px 0 0 0", fontSize: "13px", color: "var(--ink-2)", lineHeight: "1.6" }}>
              {rootCause?.evidence}
            </p>
          </div>

          {/* Contributing factors */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--muted)", fontWeight: "700" }}>
              Contributing Factors
            </span>
            {["Missing circuit breakers on external calls", "No fallback gateway configured", "Inadequate timeout policies"].map((factor, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                <span style={{ color: "#F97316", fontWeight: "800", flexShrink: 0, marginTop: "1px" }}>→</span>
                <span style={{ fontSize: "12px", color: "var(--ink-2)" }}>{factor}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
