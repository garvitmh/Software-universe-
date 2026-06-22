// components/planet-scale/TradeoffPanel.jsx

import React from "react";
import { usePlanetScale } from "./usePlanetScale";

export default function TradeoffPanel() {
  const { consistencyMode, cdnEnabled } = usePlanetScale();

  const getTradeoffs = () => {
    if (consistencyMode === "strong") {
      return {
        title: "Strong Consensus Active",
        positives: [
          "Zero stale reads: Readers always see latest write.",
          "Linearizable history: Simple developer mental model.",
          "Transaction safety: Excellent for financial order placement."
        ],
        negatives: [
          "Slow global writes: Must block for remote round-trips (100ms+).",
          "Partition susceptibility: Cutting nodes stops updates completely.",
          "Higher cost: Consumes substantial CPU coordination overhead."
        ]
      };
    } else if (consistencyMode === "read-your-writes") {
      return {
        title: "Read-Your-Writes Active",
        positives: [
          "No self-discrepancies: Users see their own changes immediately.",
          "Fast write return: Connects to local region primary proxy.",
          "Good UX: Solves the 'I just submitted but don't see it' issue."
        ],
        negatives: [
          "Global stale reads: Other users still see lag on replicas.",
          "Routing complexity: Session sticky routers must pin readers.",
          "Slight consensus delay: Leader coordination is required."
        ]
      };
    } else {
      return {
        title: "Async Eventual Consistency Active",
        positives: [
          "Instant writes: Return in <15ms directly.",
          "High partition tolerance: Nodes accept writes while isolated.",
          "Lower infrastructure cost: Minimum sync bandwidth."
        ],
        negatives: [
          "Stale reads: Users view out-of-date records frequently.",
          "Conflict resolution: Requires Last-Write-Wins or CRDT merging.",
          "Data loss risk: Node crash before sync loses recent writes."
        ]
      };
    }
  };

  const current = getTradeoffs();

  return (
    <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Analysis</span>
        <h3 style={{ margin: "2px 0 0 0" }}>System Design Verdict</h3>
        <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--muted)" }}>
          Every architectural choice accepts a corresponding drawback.
        </p>
      </div>

      <div style={{
        padding: "14px",
        borderRadius: "10px",
        backgroundColor: "var(--bg-2)",
        border: "1px solid var(--hairline-2)",
        display: "flex",
        flexDirection: "column",
        gap: "12px"
      }}>
        <div style={{ fontSize: "13px", fontWeight: "700", borderBottom: "1px solid var(--hairline-2)", paddingBottom: "6px" }}>
          {current.title}
        </div>

        {/* Positives */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <span style={{ fontSize: "10px", fontWeight: "700", color: "var(--teal)", textTransform: "uppercase" }}>
            ✓ Benefits & Advantages
          </span>
          {current.positives.map((p, idx) => (
            <div key={idx} style={{ display: "flex", gap: "6px", fontSize: "11px", alignItems: "flex-start" }}>
              <span style={{ color: "var(--teal)" }}>•</span>
              <span style={{ color: "var(--ink-2)" }}>{p}</span>
            </div>
          ))}
        </div>

        {/* Negatives */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "4px" }}>
          <span style={{ fontSize: "10px", fontWeight: "700", color: "var(--pink)", textTransform: "uppercase" }}>
            ✗ Costs & Drawbacks
          </span>
          {current.negatives.map((n, idx) => (
            <div key={idx} style={{ display: "flex", gap: "6px", fontSize: "11px", alignItems: "flex-start" }}>
              <span style={{ color: "var(--pink)" }}>•</span>
              <span style={{ color: "var(--ink-2)" }}>{n}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
