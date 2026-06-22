"use client";

import React, { useState } from "react";
import TopologyGraph from "./TopologyGraph";

export default function ScalingPanel({ scalingStats, worldSlug }) {
  const [activeTab, setActiveTab] = useState("10"); // "10" | "100k" | "1M"

  const getTabColor = (tab) => {
    if (activeTab !== tab) return "var(--ink-2)";
    if (tab === "1M") return "var(--pop-yellow)";
    return "var(--pop-lime)";
  };

  const getTabBg = (tab) => {
    if (activeTab !== tab) return "transparent";
    if (tab === "1M") return "rgba(255, 178, 62, 0.1)";
    return "rgba(47, 191, 113, 0.1)";
  };

  return (
    <div className="card" style={{ padding: "24px", border: "1px solid var(--hairline)", display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--hairline)", paddingBottom: 10, flexWrap: "wrap", gap: 12 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", margin: 0 }}>
          🚀 Scaling Dynamics & System Evolution Engine
        </h3>
        
        {/* Tab Selectors */}
        <div style={{ display: "flex", background: "var(--bg-2)", padding: 3, borderRadius: 8, gap: 4 }}>
          {["10", "100k", "1M"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "6px 12px",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 700,
                background: activeTab === tab ? "var(--surface)" : "transparent",
                color: getTabColor(tab),
                boxShadow: activeTab === tab ? "var(--shadow)" : "none"
              }}
            >
              {tab === "10" ? "10 Users" : tab === "100k" ? "100k Users" : "1M Users"}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Layout for Split View of Text + Topology Graph */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, alignItems: "start" }}>
        {/* Left Side: Explanatory Text */}
        <div 
          style={{ 
            background: getTabBg(activeTab), 
            border: `1.5px solid ${activeTab === "1M" ? "var(--pop-yellow)" : "var(--pop-lime)"}`, 
            borderRadius: 14, 
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
            minHeight: 260,
            justifyContent: "center",
            transition: "all 0.2s ease"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: activeTab === "1M" ? "var(--pop-yellow)" : "var(--pop-lime)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {activeTab === "1M" ? "⚠️ Scaling Bottleneck Alert" : "🟢 Performance profile"}
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)" }}>
              Load: {activeTab === "10" ? "Minimal" : activeTab === "100k" ? "Moderate" : "Peak Capacity"}
            </span>
          </div>
          <p style={{ fontSize: 14, color: "var(--ink)", lineHeight: 1.6, margin: 0 }}>
            {scalingStats[activeTab]}
          </p>
        </div>

        {/* Right Side: Visualizing System Evolution */}
        <TopologyGraph worldSlug={worldSlug} scale={activeTab} />
      </div>
    </div>
  );
}
