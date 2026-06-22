// components/replay/ReplayControls.jsx

import React from "react";

export default function ReplayControls({
  isPlaying,
  onTogglePlay,
  speed,
  onChangeSpeed,
  activeFilter,
  onChangeFilter
}) {
  const filters = [
    { id: "all", label: "All Events" },
    { id: "SESSION", label: "Sessions" },
    { id: "BREAKTHROUGH", label: "Breakthroughs" },
    { id: "MISTAKE", label: "Mistakes" },
    { id: "ARCHITECT_MOMENT", label: "Architect Moments" }
  ];

  return (
    <div className="card" style={{
      padding: "16px 20px",
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "16px",
      backgroundColor: "var(--surface)",
      border: "1px solid var(--hairline-2)"
    }}>
      {/* Playback Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button
          onClick={onTogglePlay}
          style={{
            padding: "8px 16px",
            borderRadius: "8px",
            backgroundColor: isPlaying ? "var(--amber)" : "var(--brand)",
            color: "#ffffff",
            border: "none",
            fontWeight: "700",
            fontSize: "12px",
            cursor: "pointer"
          }}
        >
          {isPlaying ? "⏸️ Pause Chronicles" : "▶️ Play Chronicles"}
        </button>

        {/* Speed */}
        <div style={{ display: "flex", gap: "4px" }}>
          {[1, 2, 5].map((s) => (
            <button
              key={s}
              onClick={() => onChangeSpeed(s)}
              style={{
                padding: "3px 6px",
                fontSize: "10px",
                fontWeight: "700",
                borderRadius: "4px",
                border: "1px solid var(--hairline-2)",
                backgroundColor: speed === s ? "var(--brand-soft)" : "var(--bg-2)",
                color: speed === s ? "var(--brand-2)" : "var(--muted)",
                cursor: "pointer"
              }}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Category filters */}
      <div style={{ display: "flex", gap: "6px" }}>
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => onChangeFilter(f.id)}
            style={{
              padding: "4px 10px",
              fontSize: "11px",
              fontWeight: "600",
              borderRadius: "6px",
              border: activeFilter === f.id ? "1.5px solid var(--brand)" : "1px solid var(--hairline-2)",
              backgroundColor: activeFilter === f.id ? "var(--brand-soft)" : "var(--bg-2)",
              color: activeFilter === f.id ? "var(--brand-2)" : "var(--ink-2)",
              cursor: "pointer"
            }}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}
