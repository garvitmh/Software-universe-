// components/replay/CuriosityPanel.jsx

import React from "react";

export default function CuriosityPanel({ events }) {
  // Aggregate worlds engagement count
  const counts = {};
  events.forEach(e => {
    counts[e.world] = (counts[e.world] || 0) + 1;
  });

  const sortedWorlds = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Interests</span>
        <h3 style={{ margin: "2px 0 0 0" }}>Developer Curiosity Radar</h3>
        <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--muted)" }}>
          Tracks your engagement and repeat visits across the Software Universe worlds.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {sortedWorlds.slice(0, 3).map(([world, count], idx) => {
          const percentage = Math.round((count / events.length) * 100);
          return (
            <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: "700" }}>
                <span style={{ textTransform: "capitalize" }}>🗺️ {world} World</span>
                <span>{percentage}% of history</span>
              </div>
              <div style={{ width: "100%", height: "6px", backgroundColor: "var(--hairline-2)", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{
                  width: `${percentage}%`,
                  height: "100%",
                  backgroundColor: "var(--brand)",
                  transition: "width 0.4s ease"
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
