// components/planet-scale/TopologyPanel.jsx

import React from "react";
import { usePlanetScale } from "./usePlanetScale";

export default function TopologyPanel() {
  const { scale, cdnEnabled } = usePlanetScale();

  // Define architecture layout components based on scale
  const getLayout = () => {
    switch (scale) {
      case "10k":
        return {
          title: "Monolithic DB & App",
          nodes: ["Client Gateway", "Single Node Monolith App Server", "Local SQLite / Postgres DB"],
          description: "Simple single-region monolith. Good for low load, but has a single point of failure and high latency for international users."
        };
      case "100k":
        return {
          title: "Edge Offloaded Single-Region",
          nodes: [
            cdnEnabled ? "Global CDN Edge" : "Origin LB (No CDN)",
            "Region Load Balancer",
            "Cluster App Pods (3 Nodes)",
            "Primary DB + Local Read Replica"
          ],
          description: "Utilizes local replicas to offload reads. Scaled app servers horizontally."
        };
      case "1m":
        return {
          title: "Multi-Region Core Setup",
          nodes: [
            "Anycast DNS Routing",
            cdnEnabled ? "Edge CDN Offload" : "Regional Load Balancers",
            "Multi-Region App Clusters (US & EU)",
            "DB Primary (US) + Asynchronous Replicas (EU/APAC)"
          ],
          description: "Deploys application servers across continents. High replication lag on DB writes outside US region."
        };
      case "10m":
      case "100m":
        return {
          title: "Planet-Scale Partitioned Active-Active",
          nodes: [
            "Anycast Geo DNS & Edge CDN Clusters",
            "Global Messaging Queues (Kafka) & Redis Caches",
            "Any-Region Stateless Worker Clusters (7 Nodes)",
            "Distributed Consensus DB (CockroachDB / Spanner Core)"
          ],
          description: "Ultra-resilient multi-master database layer. Writes consensus across regions. Tolerates total regional outages."
        };
      default:
        return { title: "Initializing...", nodes: [], description: "" };
    }
  };

  const layout = getLayout();

  return (
    <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Infrastructure</span>
        <h3 style={{ margin: "2px 0 0 0" }}>System Topology Blueprint</h3>
        <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--muted)" }}>
          The architecture automatically mutates to absorb scale forces.
        </p>
      </div>

      <div style={{
        padding: "16px",
        borderRadius: "10px",
        backgroundColor: "var(--bg-2)",
        border: "1px solid var(--hairline-2)",
        display: "flex",
        flexDirection: "column",
        gap: "12px"
      }}>
        <div style={{ fontSize: "13px", fontWeight: "700", borderBottom: "1px solid var(--hairline-2)", paddingBottom: "6px" }}>
          {layout.title}
        </div>

        {/* Vertical Nodes Flow Chart */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
          {layout.nodes.map((node, idx) => (
            <React.Fragment key={idx}>
              <div style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "6px",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--hairline-2)",
                fontSize: "11px",
                fontWeight: "600",
                textAlign: "center",
                boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
              }}>
                {node}
              </div>
              {idx < layout.nodes.length - 1 && (
                <div style={{
                  width: "2px",
                  height: "12px",
                  backgroundColor: "var(--brand-soft)"
                }} />
              )}
            </React.Fragment>
          ))}
        </div>

        <p style={{ margin: 0, fontSize: "11px", color: "var(--muted)", lineHeight: "1.4" }}>
          {layout.description}
        </p>
      </div>
    </div>
  );
}
