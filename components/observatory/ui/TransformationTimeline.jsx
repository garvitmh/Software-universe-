"use client";

import React from "react";

export default function TransformationTimeline({ timeline = [] }) {
  // Fallback default milestones if timeline is empty
  const milestones = timeline.length > 0 ? timeline : [
    { timestamp: Date.now() - 1000, category: "ARCHITECT_MOMENT", title: "Architect Milestone Achieved", description: "Designed high availability JWT failover logic for microservices.", icon: "👑" },
    { timestamp: Date.now() - 3600000, category: "BREAKTHROUGH", title: "Breakthrough: ORDER", description: "Understood row locks and FSM status transitions via pad analogy.", icon: "🎉" },
    { timestamp: Date.now() - 7200000, category: "MISCONCEPTION", title: "Misconception Resolved", description: "Clarified that JWT only signs data; payloads are fully readable unless JWE is used.", icon: "💡" },
    { timestamp: Date.now() - 86400000, category: "CURIOSITY", title: "Explored Curiosity: PAYMENTS", description: "Learned how Stripe validates webhook signatures at high scale.", icon: "🔍" }
  ];

  return (
    <div className="obs-card" style={{ gridColumn: "span 6", maxHeight: 400, overflowY: "auto" }} className="obs-card obs-scroll">
      <div className="obs-card-title">
        <span>Transformation Timeline</span>
        <span style={{ color: "#F38BA8" }}>Your Narrative</span>
      </div>
      
      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 10, position: "relative", paddingLeft: 10 }}>
        {/* Central Vertical Timeline Line */}
        <div style={{
          position: "absolute",
          left: 17,
          top: 10,
          bottom: 10,
          width: 2,
          background: "rgba(255, 255, 255, 0.08)"
        }} />

        {milestones.map((item, idx) => (
          <div key={idx} style={{ display: "flex", gap: 14, position: "relative", alignItems: "flex-start" }}>
            {/* Timeline Circle with Icon */}
            <div style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: "var(--obs-bg)",
              border: "2px solid rgba(255, 255, 255, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              zIndex: 1,
              flexShrink: 0
            }}>
              {item.icon}
            </div>

            {/* Content box */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#F8F9FC" }}>{item.title}</span>
                <span style={{ fontSize: 9, color: "var(--obs-muted)" }}>
                  {new Date(item.timestamp).toLocaleDateString()}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 12, color: "var(--obs-muted)", lineHeight: 1.4 }}>
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
