"use client";

import React from "react";
import { motion } from "framer-motion";
import { PATTERNS_DB } from "./PatternSchema";

export default function PatternComparisonPanel({ compareIds, toggleCompare, resetComparison }) {
  const pattern1 = PATTERNS_DB.find((p) => p.id === compareIds[0]);
  const pattern2 = PATTERNS_DB.find((p) => p.id === compareIds[1]);

  if (compareIds.length < 2) {
    return (
      <div className="card" style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: "12px", alignItems: "center", justifyContent: "center", minHeight: "180px", textAlign: "center" }}>
        <span style={{ fontSize: "36px" }}>⚔️</span>
        <h3 style={{ margin: "4px 0 0 0", fontSize: "16px", fontWeight: "700" }}>Side-by-Side Comparison</h3>
        <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--muted)", maxWidth: "420px" }}>
          Select the checkbox on the top right of any two pattern cards above to unlock a direct comparison of their gains, costs, and suited scales.
        </p>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span className="eyebrow" style={{ color: "var(--brand)" }}>Systems Comparison</span>
          <h3 style={{ margin: "2px 0 0 0", fontSize: "18px" }}>Direct Trade-offs Comparison</h3>
        </div>
        <button
          onClick={resetComparison}
          style={{
            background: "var(--bg-2)", border: "1px solid var(--hairline)", borderRadius: "8px",
            padding: "6px 12px", fontSize: "11px", fontWeight: "700", cursor: "pointer",
            color: "var(--muted)"
          }}
        >
          Clear Comparison
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }} className="comparison-columns">
        {/* Column 1 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ borderBottom: "2px solid var(--brand)", paddingBottom: "6px" }}>
            <span style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase" }}>Pattern A</span>
            <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "800", color: "var(--brand-2)" }}>{pattern1.name}</h4>
          </div>
          <div>
            <strong style={{ fontSize: "12px", color: "var(--ink)" }}>Primary Benefit:</strong>
            <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "var(--muted)", lineHeight: "1.4" }}>{pattern1.tradeoffs.gain}</p>
          </div>
          <div>
            <strong style={{ fontSize: "12px", color: "var(--ink)" }}>Operational Cost:</strong>
            <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "var(--muted)", lineHeight: "1.4" }}>{pattern1.tradeoffs.loss}</p>
          </div>
          <div>
            <strong style={{ fontSize: "12px", color: "var(--ink)" }}>Complexity:</strong>
            <span style={{ fontSize: "11px", padding: "2px 6px", background: "var(--bg-2)", borderRadius: "4px", marginLeft: "6px", fontWeight: "700" }}>
              {pattern1.complexity}
            </span>
          </div>
        </div>

        {/* Column 2 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ borderBottom: "2px solid var(--teal)", paddingBottom: "6px" }}>
            <span style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase" }}>Pattern B</span>
            <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "800", color: "var(--teal)" }}>{pattern2.name}</h4>
          </div>
          <div>
            <strong style={{ fontSize: "12px", color: "var(--ink)" }}>Primary Benefit:</strong>
            <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "var(--muted)", lineHeight: "1.4" }}>{pattern2.tradeoffs.gain}</p>
          </div>
          <div>
            <strong style={{ fontSize: "12px", color: "var(--ink)" }}>Operational Cost:</strong>
            <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "var(--muted)", lineHeight: "1.4" }}>{pattern2.tradeoffs.loss}</p>
          </div>
          <div>
            <strong style={{ fontSize: "12px", color: "var(--ink)" }}>Complexity:</strong>
            <span style={{ fontSize: "11px", padding: "2px 6px", background: "var(--bg-2)", borderRadius: "4px", marginLeft: "6px", fontWeight: "700" }}>
              {pattern2.complexity}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
