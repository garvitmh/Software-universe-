import React from "react";

export default function IndustryPanel({ industry }) {
  return (
    <div className="card" style={{ padding: "24px", border: "1px solid var(--hairline)", display: "flex", flexDirection: "column", gap: 12 }}>
      <h3 style={{ fontSize: 15, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", borderBottom: "1px solid var(--hairline)", paddingBottom: 10, margin: 0 }}>
        🌎 How the Giants Do It
      </h3>
      
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginTop: 4 }}>
        <div style={{ fontSize: 26, background: "var(--brand-soft)", padding: 8, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
          🏢
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <h4 style={{ fontSize: 14.5, fontWeight: 700, color: "var(--ink)", fontFamily: "Inter" }}>
            Production Industry Scaling
          </h4>
          <p style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.5, margin: 0 }}>
            {industry}
          </p>
        </div>
      </div>
    </div>
  );
}
