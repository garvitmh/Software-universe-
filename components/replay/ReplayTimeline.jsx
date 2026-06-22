// components/replay/ReplayTimeline.jsx

import React from "react";

export default function ReplayTimeline({ events, currentIndex, onSelectIndex }) {
  return (
    <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Chronology</span>
        <h3 style={{ margin: "2px 0 0 0" }}>Experience Timeline</h3>
        <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--muted)" }}>
          Drag or click checkpoints to replay historical milestones step-by-step.
        </p>
      </div>

      <div style={{ position: "relative", padding: "10px 0" }}>
        {/* Track Line */}
        <div style={{
          position: "absolute",
          left: "10px",
          right: "10px",
          top: "50%",
          height: "2px",
          backgroundColor: "var(--hairline-2)",
          transform: "translateY(-50%)",
          zIndex: 1
        }} />

        {/* Nodes */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
          zIndex: 2
        }}>
          {events.map((ev, idx) => {
            const isPassed = idx <= currentIndex;
            const isCurrent = idx === currentIndex;

            return (
              <button
                key={idx}
                onClick={() => onSelectIndex(idx)}
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  backgroundColor: isCurrent ? "var(--brand)" : isPassed ? "var(--brand-soft)" : "var(--bg-2)",
                  border: isCurrent ? "3px solid var(--brand-soft)" : isPassed ? "1px solid var(--brand)" : "1px solid var(--hairline-2)",
                  cursor: "pointer",
                  padding: 0,
                  boxShadow: isCurrent ? "0 0 8px var(--brand)" : "none",
                  transition: "all 0.2s ease"
                }}
                title={`${ev.title} (${new Date(ev.timestamp).toLocaleDateString()})`}
              />
            );
          })}
        </div>
      </div>

      {/* Selected event detail snippet */}
      {events[currentIndex] && (
        <div style={{
          padding: "10px 12px",
          borderRadius: "8px",
          backgroundColor: "var(--bg-2)",
          border: "1px solid var(--hairline-2)",
          fontSize: "11px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div>
            <span style={{ fontWeight: "700", color: "var(--brand-2)" }}>
              Checkpoint {currentIndex + 1}: {events[currentIndex].title}
            </span>
            <span style={{ color: "var(--muted)", display: "block" }}>
              {new Date(events[currentIndex].timestamp).toLocaleDateString()}
            </span>
          </div>
          <span className="pill" style={{ fontSize: "9px", backgroundColor: "var(--surface)", border: "1px solid var(--hairline-2)" }}>
            {events[currentIndex].type}
          </span>
        </div>
      )}
    </div>
  );
}
