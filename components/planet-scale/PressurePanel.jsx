// components/planet-scale/PressurePanel.jsx

import React from "react";
import { usePlanetScale } from "./usePlanetScale";

export default function PressurePanel() {
  const { globalMetrics, scale, consistencyMode, disasters } = usePlanetScale();

  // Compute pressure metrics out of 100
  let trafficPressure = 20;
  if (scale === "100k") trafficPressure = 40;
  if (scale === "1m") trafficPressure = 60;
  if (scale === "10m") trafficPressure = 80;
  if (scale === "100m") trafficPressure = 98;

  let latencyPressure = Math.min(100, (globalMetrics.latency / 250) * 100);
  if (consistencyMode === "strong") latencyPressure = Math.max(latencyPressure, 70);

  let availabilityPressure = 100 - globalMetrics.availability; // high errors means high availability pressure
  if (disasters.length > 0) availabilityPressure = Math.max(availabilityPressure, 40 * disasters.length);
  availabilityPressure = Math.min(99, availabilityPressure);

  let costPressure = Math.min(100, (globalMetrics.cost / 200000) * 100);

  let compliancePressure = consistencyMode === "strong" ? 85 : 30; // Strong consistency gives high database compliance/safety

  const forces = [
    { name: "📈 Traffic Load", value: trafficPressure, color: "var(--brand)" },
    { name: "⏳ Latency Overhead", value: latencyPressure, color: "var(--amber)" },
    { name: "💥 Availability Risk", value: availabilityPressure, color: "var(--pink)" },
    { name: "💸 Budget / Cost Consumption", value: costPressure, color: "#854d0e" },
    { name: "🛡️ Data Safety / Consistency", value: compliancePressure, color: "var(--teal)" }
  ];

  return (
    <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Force Balance</span>
        <h3 style={{ margin: "2px 0 0 0" }}>Architectural Tradeoff Pressure</h3>
        <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--muted)" }}>
          Systems design is a negotiation. Optimizing one metric inevitably shifts stress onto other components.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {forces.map((f, idx) => (
          <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: "700" }}>
              <span>{f.name}</span>
              <span>{Math.round(f.value)}%</span>
            </div>
            {/* Progress Track */}
            <div style={{ width: "100%", height: "8px", backgroundColor: "var(--hairline-2)", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{
                width: `${f.value}%`,
                height: "100%",
                backgroundColor: f.color,
                transition: "width 0.4s ease"
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
