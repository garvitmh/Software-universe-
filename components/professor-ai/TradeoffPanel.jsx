// components/professor-ai/TradeoffPanel.jsx

import React from "react";
import { getTradeoffs } from "./TradeoffEngine.js";

export default function TradeoffPanel({ topic }) {
  const tr = getTradeoffs(topic);

  return (
    <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Tradeoffs</span>
        <h3 style={{ margin: "2px 0 0 0" }}>Technology Evaluation Matrix</h3>
      </div>

      <div style={{
        padding: "14px",
        borderRadius: "10px",
        backgroundColor: "var(--surface)",
        border: "1px solid var(--hairline-2)",
        display: "flex",
        flexDirection: "column",
        gap: "10px"
      }}>
        <div style={{ fontSize: "14px", fontWeight: "700", borderBottom: "1px solid var(--hairline-2)", paddingBottom: "6px" }}>
          {tr.technology}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "11px" }}>
          <div style={{ borderLeft: "3px solid var(--teal)", paddingLeft: "8px" }}>
            <strong style={{ color: "var(--teal)" }}>✓ Benefit:</strong> {tr.benefit}
          </div>
          <div style={{ borderLeft: "3px solid var(--amber)", paddingLeft: "8px" }}>
            <strong style={{ color: "var(--amber)" }}>💸 Cost:</strong> {tr.cost}
          </div>
          <div style={{ borderLeft: "3px solid var(--brand)", paddingLeft: "8px" }}>
            <strong style={{ color: "var(--brand-2)" }}>🧩 Complexity:</strong> {tr.complexity}
          </div>
          <div style={{ borderLeft: "3px solid var(--pink)", paddingLeft: "8px" }}>
            <strong style={{ color: "var(--pink)" }}>💥 Failure Mode:</strong> {tr.failureMode}
          </div>
        </div>
      </div>
    </div>
  );
}
