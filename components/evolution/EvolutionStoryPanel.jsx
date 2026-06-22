"use client";

import React from "react";
import { motion } from "framer-motion";

export default function EvolutionStoryPanel({ story }) {
  return (
    <div className="card" style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>The Scaling Story</span>
        <h3 style={{ margin: "2px 0 0 0", fontSize: "20px" }}>Architect's Journal</h3>
      </div>

      <div style={{
        backgroundColor: "var(--bg)",
        border: "1px solid var(--hairline-2)",
        padding: "20px 24px",
        borderRadius: "12px",
        position: "relative"
      }}>
        {/* Quote mark indicator */}
        <span style={{
          position: "absolute",
          top: "6px",
          left: "14px",
          fontSize: "48px",
          color: "var(--brand-soft)",
          fontFamily: "Georgia, serif",
          lineHeight: "1",
          pointerEvents: "none"
        }}>
          “
        </span>

        <p style={{
          margin: 0,
          fontFamily: "Fraunces, Georgia, serif",
          fontSize: "15px",
          lineHeight: "1.7",
          color: "var(--ink)",
          textIndent: "16px",
          position: "relative",
          zIndex: 1
        }}>
          {story}
        </p>
      </div>
    </div>
  );
}
