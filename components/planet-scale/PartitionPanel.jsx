// components/planet-scale/PartitionPanel.jsx

import React from "react";
import { usePlanetScale } from "./usePlanetScale";

export default function PartitionPanel() {
  const { disasters, triggerDisaster, consistencyMode } = usePlanetScale();

  const isPartitioned = disasters.includes("undersea_fiber_cut");

  return (
    <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Network Partitions</span>
        <h3 style={{ margin: "2px 0 0 0" }}>Split-Brain & Partitioning</h3>
        <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--muted)" }}>
          Simulate a network severance. Observe how nodes handle isolated clusters.
        </p>
      </div>

      {/* Interactive sever trigger */}
      <button
        onClick={() => triggerDisaster("undersea_fiber_cut")}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "8px",
          backgroundColor: isPartitioned ? "var(--pink-soft)" : "var(--bg-2)",
          border: isPartitioned ? "2px solid var(--pink)" : "1px solid var(--hairline-2)",
          color: isPartitioned ? "var(--pink)" : "var(--ink)",
          fontWeight: "700",
          cursor: "pointer",
          fontSize: "12px",
          transition: "all 0.2s ease"
        }}
      >
        {isPartitioned ? "⚡ HEAL NETWORK PARTITION" : "✂️ SEVER TRANSATLANTIC CABLE"}
      </button>

      {/* Visual Separation Blocks */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px",
        borderRadius: "8px",
        backgroundColor: "var(--bg-2)",
        border: "1px solid var(--hairline-2)",
        fontSize: "11px"
      }}>
        <div style={{ padding: "6px 12px", borderRadius: "4px", backgroundColor: "var(--surface)", border: "1px solid var(--hairline-2)", fontWeight: "700" }}>
          US Regions
        </div>
        
        <div style={{
          width: "40px",
          height: "2px",
          backgroundColor: isPartitioned ? "var(--pink)" : "var(--teal)",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          {isPartitioned ? (
            <span style={{ fontSize: "12px", color: "var(--pink)", position: "absolute", top: "-10px" }}>⚡</span>
          ) : (
            <span style={{ fontSize: "8px", color: "var(--teal)", position: "absolute", top: "-10px" }}>✔</span>
          )}
        </div>

        <div style={{ padding: "6px 12px", borderRadius: "4px", backgroundColor: "var(--surface)", border: "1px solid var(--hairline-2)", fontWeight: "700" }}>
          Europe/Asia
        </div>
      </div>

      {/* CAP details */}
      <div style={{
        fontSize: "11px",
        padding: "10px",
        borderRadius: "6px",
        backgroundColor: "var(--surface)",
        borderLeft: isPartitioned ? "3px solid var(--pink)" : "3px solid var(--brand-soft)",
        lineHeight: "1.4"
      }}>
        {isPartitioned ? (
          <div>
            {consistencyMode === "strong" ? (
              <span style={{ color: "var(--pink)" }}>
                <strong>Consistency Active:</strong> System has rejected writes on the European side because it cannot establish a Paxos quorum with the US primary. Europe goes offline (sacrificing availability).
              </span>
            ) : (
              <span style={{ color: "var(--amber)" }}>
                <strong>Availability Active:</strong> Both sides of the partition are accepting writes independently (split-brain). When the partition heals, conflicts must be resolved using last-write-wins (sacrificing consistency).
              </span>
            )}
          </div>
        ) : (
          <span style={{ color: "var(--muted)" }}>
            A network partition forces a choice. In the event of a fiber cut, must you remain consistent (strong) and reject writes in some nodes, or remain available (eventual) and accept divergent updates?
          </span>
        )}
      </div>
    </div>
  );
}
