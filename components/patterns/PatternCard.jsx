"use client";

import React from "react";
import { motion } from "framer-motion";

export default function PatternCard({ pattern, isSelected, onSelect, isComparing, onToggleCompare }) {
  const complexityColors = {
    LOW: { bg: "rgba(16, 185, 129, 0.08)", text: "rgb(16, 185, 129)", border: "rgba(16, 185, 129, 0.2)" },
    MEDIUM: { bg: "rgba(245, 158, 11, 0.08)", text: "rgb(245, 158, 11)", border: "rgba(245, 158, 11, 0.2)" },
    HIGH: { bg: "rgba(239, 68, 68, 0.08)", text: "rgb(239, 68, 68)", border: "rgba(239, 68, 68, 0.2)" }
  };

  const compStyle = complexityColors[pattern.complexity] || complexityColors.LOW;

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
      transition={{ duration: 0.2 }}
      style={{
        background: "var(--surface)",
        border: isSelected ? "2px solid var(--brand)" : "1px solid var(--hairline)",
        borderRadius: "14px",
        padding: "18px",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        position: "relative",
        boxShadow: isSelected ? "0 0 12px rgba(249, 115, 22, 0.15)" : "none"
      }}
      onClick={() => onSelect(pattern.id)}
    >
      {/* Compare Checkbox Pin */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          onToggleCompare(pattern.id);
        }}
        style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          width: "20px",
          height: "20px",
          borderRadius: "6px",
          border: isComparing ? "1px solid var(--brand)" : "1px solid var(--hairline)",
          background: isComparing ? "var(--brand)" : "var(--bg-2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "12px",
          color: "#fff",
          cursor: "pointer",
          zIndex: 10
        }}
        title="Compare side-by-side"
      >
        {isComparing && "✓"}
      </div>

      <div>
        <span style={{
          fontSize: "10px",
          fontWeight: "700",
          textTransform: "uppercase",
          color: "var(--brand-2)",
          background: "var(--brand-soft)",
          padding: "2px 8px",
          borderRadius: "999px"
        }}>
          {pattern.category}
        </span>
        <h4 style={{ margin: "8px 0 0 0", fontSize: "15px", fontWeight: "700", color: "var(--ink)", lineHeight: "1.3", paddingRight: "20px" }}>
          {pattern.name}
        </h4>
      </div>

      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <span style={{
          fontSize: "10px",
          fontWeight: "700",
          padding: "2px 6px",
          borderRadius: "4px",
          backgroundColor: compStyle.bg,
          color: compStyle.text,
          border: `1px solid ${compStyle.border}`
        }}>
          {pattern.complexity}
        </span>
        <span style={{ fontSize: "11px", color: "var(--muted)" }}>
          Popularity: <strong style={{ color: "var(--ink-2)" }}>{pattern.popularity}</strong>
        </span>
      </div>

      {/* Use Cases tags list */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
        {pattern.useCases.slice(0, 3).map((use) => (
          <span
            key={use}
            style={{
              fontSize: "10px",
              color: "var(--muted)",
              background: "var(--bg-2)",
              border: "1px solid var(--hairline-2)",
              padding: "1px 6px",
              borderRadius: "4px"
            }}
          >
            {use}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
