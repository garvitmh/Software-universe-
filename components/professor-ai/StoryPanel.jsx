// components/professor-ai/StoryPanel.jsx

import React from "react";
import { getStory } from "./StoryEngine.js";

export default function StoryPanel({ topic }) {
  const story = getStory(topic);

  return (
    <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Folklore</span>
        <h3 style={{ margin: "2px 0 0 0" }}>Engineering Scars & Stories</h3>
      </div>

      <div style={{
        padding: "14px",
        borderRadius: "10px",
        backgroundColor: "var(--bg-2)",
        border: "1px solid var(--hairline-2)",
        display: "flex",
        flexDirection: "column",
        gap: "8px"
      }}>
        <span style={{ fontSize: "14px", fontWeight: "700", fontFamily: "Fraunces" }}>{story.title}</span>
        <p style={{ margin: 0, fontSize: "11px", color: "var(--ink-2)", lineHeight: "1.5" }}>
          {story.content}
        </p>
        <div style={{ borderLeft: "3px solid var(--brand)", paddingLeft: "8px", fontSize: "11px", fontWeight: "600", color: "var(--brand-2)" }}>
          💡 Key Lesson: {story.lesson}
        </div>
      </div>
    </div>
  );
}
