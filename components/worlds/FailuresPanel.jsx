import React from "react";

export default function FailuresPanel({ failures }) {
  return (
    <div className="card" style={{ padding: "24px", border: "1px solid var(--hairline)", display: "flex", flexDirection: "column", gap: 16 }}>
      <h3 style={{ fontSize: 15, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", borderBottom: "1px solid var(--hairline)", paddingBottom: 10, margin: 0 }}>
        💥 Disasters & Recovery
      </h3>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <div style={{ background: "var(--pink-soft)", border: "1.5px solid var(--pop-pink)", borderRadius: 14, padding: 16 }}>
          <h4 style={{ fontSize: 13.5, color: "var(--pop-pink)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px 0", display: "flex", alignItems: "center", gap: 6 }}>
            <span>💥</span> The Disaster (What Breaks)
          </h4>
          <p style={{ fontSize: 14, color: "var(--ink)", lineHeight: 1.5, margin: 0 }}>
            {failures.disaster}
          </p>
        </div>
        
        <div style={{ background: "var(--teal-soft)", border: "1.5px solid var(--teal)", borderRadius: 14, padding: 16 }}>
          <h4 style={{ fontSize: 13.5, color: "var(--teal)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px 0", display: "flex", alignItems: "center", gap: 6 }}>
            <span>🛡️</span> The Recovery (Safety Net)
          </h4>
          <p style={{ fontSize: 14, color: "var(--ink)", lineHeight: 1.5, margin: 0 }}>
            {failures.recovery}
          </p>
        </div>
      </div>
    </div>
  );
}
