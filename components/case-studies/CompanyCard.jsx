"use client";

import React from "react";
import { motion } from "framer-motion";

export default function CompanyCard({ company, isSelected, onSelect, isComparing, onToggleCompare }) {
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
      onClick={() => onSelect(company.id)}
    >
      {/* Comparison checkbox */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          onToggleCompare(company.id);
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

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{
          width: "36px",
          height: "36px",
          borderRadius: "8px",
          background: isSelected ? "var(--brand)" : "var(--brand-soft)",
          color: isSelected ? "#fff" : "var(--brand-2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          fontSize: "14px"
        }}>
          {company.logo}
        </div>
        <div>
          <h4 style={{ margin: 0, fontSize: "15px", fontWeight: "800", color: "var(--ink)" }}>
            {company.name}
          </h4>
          <span style={{ fontSize: "10px", color: "var(--muted)", textTransform: "uppercase", fontWeight: "600" }}>
            {company.era}
          </span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <span style={{ fontSize: "10px", color: "var(--muted)", textTransform: "uppercase" }}>Scale</span>
        <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--ink-2)" }}>{company.scale}</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <span style={{ fontSize: "10px", color: "var(--muted)", textTransform: "uppercase" }}>Main Problem</span>
        <p style={{ margin: 0, fontSize: "11px", color: "var(--muted)", lineHeight: "1.4", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
          {company.originalProblem}
        </p>
      </div>

      {/* Signature Patterns badges */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "4px" }}>
        {company.patterns.map((patId) => (
          <span
            key={patId}
            style={{
              fontSize: "9px",
              color: "var(--brand-2)",
              background: "var(--brand-soft)",
              padding: "2px 6px",
              borderRadius: "4px",
              fontWeight: "700",
              textTransform: "uppercase"
            }}
          >
            {patId.replace(/_/g, " ")}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
