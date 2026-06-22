"use client";

import React from "react";
import { useUniverse } from "../UniverseContext";
import { motion } from "framer-motion";

export default function OpportunityRadar() {
  const { cognitiveState } = useUniverse();
  const opportunities = cognitiveState.opportunities || [];

  return (
    <motion.div
      className="card"
      style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "18px", position: "relative", overflow: "hidden" }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Radar Scanner</span>
        <h3 style={{ margin: "4px 0 0 0", fontSize: "22px" }}>Opportunity Radar</h3>
      </div>

      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        {/* Animated radar circle widget */}
        <div style={{
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          border: "2px solid var(--brand)",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          background: "rgba(99, 102, 241, 0.03)"
        }}>
          {/* Radar target rings */}
          <div style={{ width: "60px", height: "60px", borderRadius: "50%", border: "1px dashed var(--hairline-2)", position: "absolute" }} />
          <div style={{ width: "30px", height: "30px", borderRadius: "50%", border: "1px solid var(--hairline-2)", position: "absolute" }} />
          
          {/* Radar sweep line */}
          <div style={{
            position: "absolute",
            width: "50px",
            height: "2px",
            background: "linear-gradient(to right, transparent, var(--brand))",
            top: "50%",
            left: "50%",
            transformOrigin: "left center",
            animation: "spinSlow 4s linear infinite",
            zIndex: 1
          }} />

          {/* Glowing blips */}
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--pop-pink)", position: "absolute", top: "25%", left: "40%", boxShadow: "0 0 8px var(--pop-pink)" }} />
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--pop-blue)", position: "absolute", bottom: "30%", right: "25%", boxShadow: "0 0 8px var(--pop-blue)" }} />
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
          {opportunities.map((opt, i) => {
            const isHigh = i === 0;
            return (
              <div key={i} style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 12px",
                borderRadius: "8px",
                background: "var(--surface-warm)",
                border: "1px solid var(--hairline)",
                fontSize: "13px"
              }}>
                <span style={{ fontWeight: "600", color: "var(--ink)" }}>{opt}</span>
                <span className="pill" style={{
                  fontSize: "9px",
                  padding: "2px 8px",
                  background: isHigh ? "var(--pink-soft)" : "var(--brand-soft)",
                  color: isHigh ? "var(--pink)" : "var(--brand-2)"
                }}>
                  {isHigh ? "HIGH" : "MEDIUM"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
