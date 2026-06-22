// components/replay/SessionCard.jsx

import React from "react";

export default function SessionCard({ event }) {
  const dateStr = new Date(event.timestamp).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

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
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.04)"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--muted)", textTransform: "uppercase" }}>
          💻 Learning Session
        </span>
        <span style={{ fontSize: "11px", color: "var(--muted)" }}>{dateStr}</span>
      </div>

      <div>
        <h4 style={{ margin: "0 0 4px 0", fontSize: "15px", fontWeight: "700" }}>{event.title}</h4>
        <p style={{ margin: 0, fontSize: "12px", color: "var(--ink-2)", lineHeight: "1.4" }}>
          {event.description}
        </p>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "4px" }}>
        {event.concepts.map((concept, idx) => (
          <span
            key={idx}
            className="pill"
            style={{
              backgroundColor: "var(--bg-2)",
              color: "var(--ink-2)",
              fontSize: "10px",
              fontWeight: "600"
            }}
          >
            {concept}
          </span>
        ))}
      </div>
    </div>
  );
}
