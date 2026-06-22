"use client";

import React from "react";

export default function EventLog({ events, currentEventIdx, selectedEventIdx, onEventSelect }) {
  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", gap: 12, padding: "20px 16px" }}>
      <h4 style={{ fontSize: 13, textTransform: "uppercase", color: "var(--muted)", letterSpacing: "0.06em", fontWeight: 700, borderBottom: "1px solid var(--hairline)", paddingBottom: 8, margin: 0 }}>
        📋 Chronological Events
      </h4>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 380, overflowY: "auto", paddingRight: 4 }}>
        {events.map((ev, idx) => {
          const isSelected = selectedEventIdx === idx;
          const isPast = currentEventIdx >= idx;
          const isErr = ev.id === "POS_FAILURE";

          let bg = "transparent";
          let border = "1px solid var(--hairline-2)";
          if (isSelected) {
            bg = isErr ? "#FBE0D2" : "var(--brand-soft)";
            border = `1.5px solid ${isErr ? "var(--brand)" : "var(--brand)"}`;
          } else if (isPast) {
            bg = "var(--bg-2)";
          }

          return (
            <button
              key={ev.id}
              onClick={() => onEventSelect(idx)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 12px", border: border, borderRadius: 10, background: bg,
                cursor: "pointer", textAlign: "left", width: "100%", transition: "all 0.15s ease"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11, fontFamily: "monospace", color: isSelected ? "var(--brand-2)" : "var(--muted)" }}>#{idx + 1}</span>
                <span style={{ fontSize: 13, fontWeight: isSelected ? 700 : 500, color: isErr ? "var(--brand-2)" : "var(--ink)" }}>{ev.label}</span>
              </div>
              <span style={{ fontSize: 11, color: isErr ? "var(--brand)" : isPast ? "var(--teal)" : "var(--muted)" }}>
                {isErr ? "🚨 err" : isPast ? "🟢 committed" : "⚪ pending"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
