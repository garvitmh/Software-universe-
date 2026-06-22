// components/planet-scale/PlanetReplayPanel.jsx

import React from "react";
import { usePlanetScale } from "./usePlanetScale";

export default function PlanetReplayPanel() {
  const {
    setScale,
    changeScenario,
    triggerDisaster,
    setConsistencyMode,
    toggleCDN,
    resetWorld,
    primaryRegion,
    setPrimaryRegion,
    disasters
  } = usePlanetScale();

  const scripts = [
    {
      name: "🌤️ Routine Operations",
      description: "Apprentice level. 10k rps, eventual consistency, no errors.",
      action: () => {
        resetWorld();
        setScale("10k");
        changeScenario("normal");
      }
    },
    {
      name: "⚡ Black Friday Peak",
      description: "Scale spike to 1M rps with heavy regional write traffic.",
      action: () => {
        resetWorld();
        setScale("1m");
        changeScenario("black_friday");
      }
    },
    {
      name: "🔥 AWS US-East Failure",
      description: "Leader region crashes, triggering consensus failover promotion.",
      action: () => {
        resetWorld();
        setScale("10m");
        changeScenario("regional_failure");
      }
    },
    {
      name: "🌪️ Redis Cache stampede",
      description: "CDN cache wipes, slamming database connections globally.",
      action: () => {
        resetWorld();
        setScale("1m");
        changeScenario("cache_failure");
      }
    }
  ];

  return (
    <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Automation Scripts</span>
        <h3 style={{ margin: "2px 0 0 0" }}>Scenario Replay Engine</h3>
        <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--muted)" }}>
          Run predefined operations profiles to benchmark system limits.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {scripts.map((sc, idx) => (
          <button
            key={idx}
            onClick={sc.action}
            style={{
              padding: "12px",
              borderRadius: "8px",
              backgroundColor: "var(--bg-2)",
              border: "1px solid var(--hairline-2)",
              textAlign: "left",
              cursor: "pointer",
              transition: "all 0.2s ease",
              display: "flex",
              flexDirection: "column",
              gap: "4px"
            }}
          >
            <span style={{ fontWeight: "700", fontSize: "12px" }}>{sc.name}</span>
            <p style={{ margin: 0, fontSize: "10px", color: "var(--muted)" }}>{sc.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
