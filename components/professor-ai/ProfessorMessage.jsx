// components/professor-ai/ProfessorMessage.jsx

import React from "react";

export default function ProfessorMessage({ msg }) {
  const isUser = msg.sender === "Apprentice";
  const dateStr = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isUser ? "flex-end" : "flex-start",
        width: "100%",
        gap: "4px"
      }}
    >
      <div style={{ display: "flex", gap: "6px", alignItems: "center", fontSize: "10px", color: "var(--muted)", fontWeight: "600" }}>
        <span>{msg.sender}</span>
        <span>•</span>
        <span>{dateStr}</span>
        {!isUser && msg.mode && (
          <span className="pill" style={{ fontSize: "8px", backgroundColor: "var(--brand-soft)", color: "var(--brand-2)", padding: "1px 4px" }}>
            {msg.mode.toUpperCase()}
          </span>
        )}
      </div>

      <div
        className="card"
        style={{
          padding: "12px 16px",
          borderRadius: "14px",
          borderTopRightRadius: isUser ? "4px" : "14px",
          borderTopLeftRadius: isUser ? "14px" : "4px",
          backgroundColor: isUser ? "var(--brand-soft)" : "var(--surface)",
          border: isUser ? "1px solid var(--brand)" : "1px solid var(--hairline-2)",
          color: "var(--ink)",
          maxWidth: "80%",
          boxShadow: "0 2px 5px rgba(0,0,0,0.02)",
          fontSize: "12px",
          lineHeight: "1.5"
        }}
      >
        {msg.text}
      </div>
    </div>
  );
}
