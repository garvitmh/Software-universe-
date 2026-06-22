"use client";

import React from "react";
import { useUniverse } from "../UniverseContext";
import { motion } from "framer-motion";

export default function LearningFeed() {
  const { cognitiveState } = useUniverse();
  
  // Synthesize feed items from cognitive state
  const stories = cognitiveState.stories || [];
  const opportunities = cognitiveState.opportunities || [];
  const recommendations = cognitiveState.recommendations ? [cognitiveState.recommendations] : [];
  const alerts = cognitiveState.warnings || [];

  // Construct structured feed items with source metadata
  const feedItems = [];

  alerts.forEach((alert, index) => {
    feedItems.push({
      id: `alert-${index}`,
      author: "SRE Watchdog",
      handle: "@sre_observer",
      avatar: "🚨",
      content: `Telemetry Alert: ${alert}`,
      type: "alert",
      timestamp: "Just now",
      color: "var(--pink)",
      bgColor: "rgba(153, 53, 86, 0.08)",
      borderColor: "rgba(153, 53, 86, 0.2)"
    });
  });

  recommendations.forEach((rec, index) => {
    feedItems.push({
      id: `rec-${index}`,
      author: "Chief Architect",
      handle: "@staff_architect",
      avatar: "🧙‍♂️",
      content: rec,
      type: "recommendation",
      timestamp: "5m ago",
      color: "var(--brand-2)",
      bgColor: "var(--brand-soft)",
      borderColor: "var(--hairline-2)"
    });
  });

  opportunities.forEach((op, index) => {
    feedItems.push({
      id: `op-${index}`,
      author: "Opportunity Engine",
      handle: "@roadmap_gps",
      avatar: "🎯",
      content: `Pathway Unlocked: ${op}`,
      type: "opportunity",
      timestamp: "10m ago",
      color: "var(--teal)",
      bgColor: "rgba(15, 110, 86, 0.08)",
      borderColor: "rgba(15, 110, 86, 0.2)"
    });
  });

  stories.forEach((story, index) => {
    feedItems.push({
      id: `story-${index}`,
      author: "Learner Biography",
      handle: "@evolution_log",
      avatar: "📖",
      content: story,
      type: "story",
      timestamp: `${index + 1}h ago`,
      color: "var(--purple)",
      bgColor: "rgba(83, 74, 183, 0.08)",
      borderColor: "rgba(83, 74, 183, 0.2)"
    });
  });

  // Fallback if feed is empty
  if (feedItems.length === 0) {
    feedItems.push({
      id: "empty",
      author: "System Brain",
      handle: "@universe_brain",
      avatar: "🤖",
      content: "Initializing Software Universe feed channels. Awaiting learner telemetry inputs...",
      type: "system",
      timestamp: "Now",
      color: "var(--muted)",
      bgColor: "var(--bg-2)",
      borderColor: "var(--hairline)"
    });
  }

  return (
    <motion.div
      className="card"
      style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Telemetry Feed</span>
        <h3 style={{ margin: "4px 0 0 0", fontSize: "22px" }}>Learning Feed</h3>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px", maxHeight: "400px", overflowY: "auto", paddingRight: "4px" }} className="no-scrollbar">
        {feedItems.map((item, idx) => (
          <motion.div
            key={item.id}
            style={{
              padding: "16px",
              borderRadius: "14px",
              backgroundColor: item.bgColor,
              border: `1px solid ${item.borderColor || "var(--hairline)"}`,
              display: "flex",
              gap: "14px",
              alignItems: "flex-start"
            }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            whileHover={{ scale: 1.01 }}
          >
            <div style={{
              fontSize: "24px",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--hairline-2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}>
              {item.avatar}
            </div>
            
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--ink)" }}>{item.author}</span>
                  <span style={{ fontSize: "12px", color: "var(--muted)" }}>{item.handle}</span>
                </div>
                <span style={{ fontSize: "11px", color: "var(--faint)" }}>{item.timestamp}</span>
              </div>
              <p style={{ fontSize: "13.5px", color: "var(--ink-2)", lineHeight: "1.5", margin: 0 }}>
                {item.content}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
