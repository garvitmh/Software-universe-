// components/replay/MemoryCard.jsx

import React from "react";

export default function MemoryCard({ event }) {
  const dateStr = new Date(event.timestamp).toLocaleDateString();

  return (
    <div
      className="card"
      style={{
        padding: "16px",
        backgroundColor: "var(--surface)",
        border: "1px solid var(--hairline-2)",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        borderRadius: "12px"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--amber)", textTransform: "uppercase" }}>
          ❓ Quiz Challenge
        </span>
        <span style={{ fontSize: "11px", color: "var(--muted)" }}>{dateStr}</span>
      </div>

      <div>
        <h4 style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: "700" }}>{event.title}</h4>
        <p style={{ margin: 0, fontSize: "12px", color: "var(--ink-2)", lineHeight: "1.4" }}>
          {event.description}
        </p>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
        <div style={{ display: "flex", gap: "6px" }}>
          {event.concepts.map((concept, idx) => (
            <span
              key={idx}
              className="pill"
              style={{
                backgroundColor: "var(--brand-soft)",
                color: "var(--brand-2)",
                fontSize: "10px",
                fontWeight: "600"
              }}
            >
              {concept}
            </span>
          ))}
        </div>
        <span style={{ fontSize: "11px", color: "var(--muted)", fontWeight: "600" }}>
          Priority: {event.importance}/10
        </span>
      </div>
    </div>
  );
}
