// components/professor-ai/MemoryPanel.jsx

import React from "react";

export default function MemoryPanel({ memory }) {
  return (
    <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Telemetry Memory</span>
        <h3 style={{ margin: "2px 0 0 0" }}>Professor Context Memory</h3>
        <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--muted)" }}>
          Persistently tracked user state parameters, ensuring personalized guidance loops.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* Favorite topics */}
        <div>
          <span style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", color: "var(--muted)", display: "block", marginBottom: "6px" }}>
            🔥 Core Study Focus Areas
          </span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {memory.favoriteTopics.map((top, idx) => (
              <span key={idx} className="pill" style={{ backgroundColor: "var(--bg-2)", color: "var(--ink-2)", fontSize: "11px", fontWeight: "600" }}>
                {top}
              </span>
            ))}
          </div>
        </div>

        {/* Breakthroughs */}
        <div>
          <span style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", color: "var(--muted)", display: "block", marginBottom: "6px" }}>
            💡 Unlocked Concepts
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "11px" }}>
            {memory.breakthroughs.map((br, idx) => (
              <div key={idx} style={{ display: "flex", gap: "6px", alignItems: "center", color: "var(--teal)", fontWeight: "600" }}>
                <span>✔</span>
                <span>{br}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
