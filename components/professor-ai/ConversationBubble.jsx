// components/professor-ai/ConversationBubble.jsx

import React from "react";

export default function ConversationBubble({ type, title, text, children }) {
  const getIcon = () => {
    switch (type) {
      case "ANALOGY": return "🍎";
      case "STORY": return "📖";
      case "TRADEOFF": return "📐";
      case "CHALLENGE": return "🏆";
      case "SOCRATIC":
      default:
        return "💭";
    }
  };

  return (
    <div
      className="card"
      style={{
        padding: "16px",
        backgroundColor: "var(--surface)",
        borderLeft: "4px solid var(--brand)",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)"
      }}
    >
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <span style={{ fontSize: "18px" }}>{getIcon()}</span>
        <span style={{ fontSize: "11px", fontWeight: "800", color: "var(--brand-2)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          {title}
        </span>
      </div>

      <p style={{ margin: 0, fontSize: "12px", color: "var(--ink-2)", lineHeight: "1.5" }}>
        {text}
      </p>

      {children && (
        <div style={{ marginTop: "6px" }}>
          {children}
        </div>
      )}
    </div>
  );
}
