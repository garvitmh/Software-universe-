// components/planet-scale/IncidentPanel.jsx

import React from "react";
import { usePlanetScale } from "./usePlanetScale";

export default function IncidentPanel() {
  const { disasters, triggerDisaster, globalMetrics } = usePlanetScale();

  // Map disasters to active incident codes
  const activeIncidents = [];
  if (disasters.includes("region_down")) {
    activeIncidents.push({
      id: "INCIDENT-901",
      title: "AWS US-East Region Total Failure",
      severity: "CRITICAL",
      impact: "100% request loss in US-East. Initiating leader failover.",
      key: "region_down"
    });
  }
  if (disasters.includes("undersea_fiber_cut")) {
    activeIncidents.push({
      id: "INCIDENT-902",
      title: "Transatlantic Fiber Cable Cut",
      severity: "WARNING",
      impact: "US-EU replication latency spikes +350ms. Paxos timeouts active.",
      key: "undersea_fiber_cut"
    });
  }
  if (disasters.includes("database_replication_lock")) {
    activeIncidents.push({
      id: "INCIDENT-903",
      title: "US-West Database Thread Lockup",
      severity: "WARNING",
      impact: "DB replication log queue full. Stale reads rising.",
      key: "database_replication_lock"
    });
  }
  if (disasters.includes("redis_cache_collapse")) {
    activeIncidents.push({
      id: "INCIDENT-904",
      title: "Redis Cache Eviction Storm",
      severity: "CRITICAL",
      impact: "100% Cache Miss. Origin databases overloaded.",
      key: "redis_cache_collapse"
    });
  }
  if (disasters.includes("network_congestion")) {
    activeIncidents.push({
      id: "INCIDENT-905",
      title: "Frankfurt Router DDoS Congestion",
      severity: "WARNING",
      impact: "95th percentile latency exceeds 300ms in Europe.",
      key: "network_congestion"
    });
  }
  if (disasters.includes("kafka_consumer_lag")) {
    activeIncidents.push({
      id: "INCIDENT-906",
      title: "Kafka Consumer Log Queue Ingestion Lag",
      severity: "WARNING",
      impact: "Background worker lag in Japan/Sydney nodes.",
      key: "kafka_consumer_lag"
    });
  }

  // Fallback for general threshold warning
  if (globalMetrics.errors > 10 && activeIncidents.length === 0) {
    activeIncidents.push({
      id: "INCIDENT-ALERT",
      title: "High Global Error Rates Detected",
      severity: "CRITICAL",
      impact: `System wide error rate is at ${globalMetrics.errors}%. Check node connections.`,
      key: null
    });
  }

  return (
    <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>War Room Feed</span>
        <h3 style={{ margin: "2px 0 0 0" }}>Active System Incidents</h3>
        <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--muted)" }}>
          Telemetries automatically alert on-call SREs when regional SLAs are violated.
        </p>
      </div>

      {activeIncidents.length === 0 ? (
        <div style={{
          padding: "16px",
          borderRadius: "8px",
          backgroundColor: "var(--bg-2)",
          border: "1px solid var(--hairline-2)",
          textAlign: "center",
          color: "var(--teal)",
          fontSize: "12px",
          fontWeight: "700"
        }}>
          💚 All SLAs healthy. No active incidents.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {activeIncidents.map((inc) => (
            <div
              key={inc.id}
              style={{
                padding: "12px",
                borderRadius: "8px",
                backgroundColor: "var(--bg-2)",
                border: `1.5px solid ${inc.severity === "CRITICAL" ? "var(--pink)" : "var(--amber)"}`,
                display: "flex",
                flexDirection: "column",
                gap: "4px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "11px", fontWeight: "800", color: inc.severity === "CRITICAL" ? "var(--pink)" : "var(--amber)" }}>
                  {inc.id} [{inc.severity}]
                </span>
                {inc.key && (
                  <button
                    onClick={() => triggerDisaster(inc.key)}
                    style={{
                      padding: "2px 6px",
                      fontSize: "9px",
                      fontWeight: "700",
                      backgroundColor: "var(--surface)",
                      border: "1px solid var(--hairline-2)",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    RESOLVE
                  </button>
                )}
              </div>
              <span style={{ fontSize: "12px", fontWeight: "700" }}>{inc.title}</span>
              <p style={{ margin: 0, fontSize: "11px", color: "var(--muted)" }}>{inc.impact}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
