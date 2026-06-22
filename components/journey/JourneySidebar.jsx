"use client";

import React from "react";
import { motion } from "framer-motion";

export default function JourneySidebar({ journeysProgress, activeJourneyId, onSelect }) {
  if (!journeysProgress) return null;

  return (
    <div className="card" style={{
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "18px",
      height: "100%",
      minWidth: "260px"
    }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Paths Catalog</span>
        <h3 style={{ margin: "4px 0 0 0", fontSize: "18px", color: "var(--ink)" }}>Guided Journeys</h3>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {Object.keys(journeysProgress).map(key => {
          const journey = journeysProgress[key];
          const isSelected = activeJourneyId === key;

          return (
            <motion.div
              key={key}
              onClick={() => onSelect(key)}
              style={{
                padding: "14px",
                borderRadius: "12px",
                border: `1.5px solid ${isSelected ? journey.color : "var(--hairline)"}`,
                backgroundColor: isSelected ? "var(--surface-warm)" : "var(--surface)",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                transition: "all 0.2s ease"
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "20px" }}>{journey.icon}</span>
                  <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--ink)" }}>
                    {journey.title}
                  </span>
                </div>
                <span style={{ fontSize: "12px", fontWeight: "bold", color: journey.color }}>
                  {journey.percentage}%
                </span>
              </div>

              {/* Progress mini-bar */}
              <div style={{
                width: "100%",
                height: "5px",
                borderRadius: "2.5px",
                backgroundColor: "var(--bg-2)",
                overflow: "hidden"
              }}>
                <div style={{
                  width: `${journey.percentage}%`,
                  height: "100%",
                  backgroundColor: journey.color,
                  borderRadius: "2.5px"
                }} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
