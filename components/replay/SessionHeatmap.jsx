// components/replay/SessionHeatmap.jsx

import React from "react";

export default function SessionHeatmap({ events }) {
  // Construct a grid representing 7 days of the week, for the last 15 weeks
  const weeks = 15;
  const daysOfWeek = 7;

  // Map events to date keys
  const dateMap = {};
  events.forEach(e => {
    const key = new Date(e.timestamp).toISOString().split('T')[0];
    dateMap[key] = (dateMap[key] || 0) + e.importance;
  });

  // Generate grid values
  const grid = [];
  const now = new Date();

  for (let w = 0; w < weeks; w++) {
    const weekDays = [];
    for (let d = 0; d < daysOfWeek; d++) {
      // Calculate offset date
      const offsetDays = (weeks - 1 - w) * 7 + (daysOfWeek - 1 - d);
      const date = new Date(now.getTime() - offsetDays * 24 * 60 * 60 * 1000);
      const key = date.toISOString().split('T')[0];
      const intensity = dateMap[key] || 0;
      weekDays.push({ key, date, intensity });
    }
    grid.push(weekDays);
  }

  // Get color for intensity level
  const getColor = (intensity) => {
    if (intensity === 0) return "var(--bg-2)"; // default cream
    if (intensity < 4) return "var(--brand-soft)"; // soft orange
    if (intensity < 8) return "var(--amber)"; // amber
    return "var(--brand)"; // espresso/full-brand
  };

  return (
    <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Consistency</span>
        <h3 style={{ margin: "2px 0 0 0" }}>Daily Study Intensity</h3>
        <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--muted)" }}>
          Contribution grid tracking daily mastery adjustments.
        </p>
      </div>

      <div style={{ display: "flex", gap: "4px", overflowX: "auto", paddingBottom: "10px" }}>
        {grid.map((week, wIdx) => (
          <div key={wIdx} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {week.map((day, dIdx) => (
              <div
                key={dIdx}
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "2px",
                  backgroundColor: getColor(day.intensity),
                  border: "1px solid var(--hairline-2)"
                }}
                title={`${day.key}: ${day.intensity} intensity`}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "6px", fontSize: "10px", color: "var(--muted)" }}>
        <span>Less</span>
        <div style={{ width: "10px", height: "10px", borderRadius: "1px", backgroundColor: "var(--bg-2)", border: "1px solid var(--hairline-2)" }} />
        <div style={{ width: "10px", height: "10px", borderRadius: "1px", backgroundColor: "var(--brand-soft)" }} />
        <div style={{ width: "10px", height: "10px", borderRadius: "1px", backgroundColor: "var(--amber)" }} />
        <div style={{ width: "10px", height: "10px", borderRadius: "1px", backgroundColor: "var(--brand)" }} />
        <span>More</span>
      </div>
    </div>
  );
}
