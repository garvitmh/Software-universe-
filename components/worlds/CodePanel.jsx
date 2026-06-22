import React from "react";

export default function CodePanel({ anchors }) {
  return (
    <div className="card" style={{ padding: "24px", border: "1px solid var(--hairline)", display: "flex", flexDirection: "column", gap: 16 }}>
      <h3 style={{ fontSize: 15, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", borderBottom: "1px solid var(--hairline)", paddingBottom: 10, margin: 0 }}>
        ⚓ Burger Farm Code References
      </h3>
      
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.4, margin: 0 }}>
          This world is directly mapped to the following files in your local Burger Farm codebase (located at <code>~/Desktop/zone-trial</code>):
        </p>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
          {anchors.map((file, idx) => (
            <div 
              key={idx}
              style={{
                background: "var(--bg-2)",
                border: "1px solid var(--hairline)",
                borderRadius: 8,
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, overflow: "hidden" }}>
                <span style={{ fontSize: 16 }}>📄</span>
                <span 
                  style={{ 
                    fontSize: 13, 
                    fontFamily: "JetBrains Mono, monospace", 
                    color: "var(--brand-2)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}
                >
                  {file.path}
                </span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", background: "var(--surface)", padding: "2px 8px", borderRadius: 6, border: "1px solid var(--hairline-2)" }}>
                {file.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
