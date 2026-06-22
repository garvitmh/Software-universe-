// components/planet-scale/DisasterPanel.jsx

import React from "react";
import { usePlanetScale } from "./usePlanetScale";

export default function DisasterPanel() {
  const { disasters, triggerDisaster } = usePlanetScale();

  const disasterTypes = [
    {
      key: "region_down",
      name: "AWS US-East Outage",
      icon: "🔥",
      description: "Causes complete power loss in Northern Virginia datacenter."
    },
    {
      key: "undersea_fiber_cut",
      name: "Fiber Cable Cut",
      icon: "✂️",
      description: "Sever transatlantic fiber, forcing packet routing via satellite."
    },
    {
      key: "database_replication_lock",
      name: "DB Replica Deadlock",
      icon: "🔒",
      description: "Locks up US-West replication thread, piling up queue lag."
    },
    {
      key: "redis_cache_collapse",
      name: "Redis Cache Eviction Storm",
      icon: "🌪️",
      description: "Evicts all edge nodes, triggering origin database slams."
    },
    {
      key: "network_congestion",
      name: "DDoS Attack on Europe",
      icon: "🤖",
      description: "Floods Frankfurt router queues, spiking local latency."
    },
    {
      key: "kafka_consumer_lag",
      name: "Kafka Queue Congestion",
      icon: "⏳",
      description: "Slows background database ingestion threads."
    }
  ];

  return (
    <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Chaos Engineering</span>
        <h3 style={{ margin: "2px 0 0 0" }}>Disaster Injection Board</h3>
        <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--muted)" }}>
          Inject real-world networking and infrastructure failures to test system survivability.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }} className="ways-grid">
        {disasterTypes.map((dis) => {
          const active = disasters.includes(dis.key);
          return (
            <button
              key={dis.key}
              onClick={() => triggerDisaster(dis.key)}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                padding: "10px",
                borderRadius: "8px",
                backgroundColor: active ? "var(--pink-soft)" : "var(--bg-2)",
                border: active ? "1.5px solid var(--pink)" : "1px solid var(--hairline-2)",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s ease"
              }}
            >
              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                <span style={{ fontSize: "16px" }}>{dis.icon}</span>
                <span style={{
                  fontWeight: "700",
                  fontSize: "12px",
                  color: active ? "var(--pink)" : "var(--ink)"
                }}>
                  {dis.name}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: "10px", color: "var(--muted)", lineHeight: "1.3" }}>
                {dis.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
