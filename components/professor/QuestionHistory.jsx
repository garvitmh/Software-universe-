"use client";

import React from "react";
import { useProfessor } from "./ProfessorContext";

export default function QuestionHistory({ tintColors }) {
  const { questionScores, currentWorld } = useProfessor();

  const scoresArray = Object.entries(questionScores).map(([id, data]) => ({
    id,
    ...data
  }));

  const totalAnswered = scoresArray.length;
  const correctCount = scoresArray.filter(s => s.score === 1).length;
  const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;

  const colors = tintColors[currentWorld] || { main: "var(--brand)", soft: "var(--brand-soft)", dark: "var(--brand-2)" };

  const getDiffColor = (diff) => {
    if (diff === "Senior") return "#CBA6F7"; // Purple
    if (diff === "Intermediate") return "#89B4FA"; // Blue
    return "#A6E3A1"; // Green
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, borderTop: "1px dashed var(--hairline-2)", paddingTop: 16, marginTop: 10 }}>
      <div style={{ display: "flex", alignItems: "center", justifySpaceBetween: "space-between", justifyContent: "space-between" }}>
        <h5 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--ink)", margin: 0 }}>
          Syllabus Transcript
        </h5>
        {totalAnswered > 0 && (
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-2)" }}>
            Accuracy: <span style={{ color: accuracy >= 70 ? "#A6E3A1" : "#FAB387" }}>{accuracy}%</span> ({correctCount}/{totalAnswered})
          </div>
        )}
      </div>

      {totalAnswered === 0 ? (
        <div style={{ fontSize: 12, color: "var(--muted)", fontStyle: "italic", textAlign: "center", padding: "10px 0" }}>
          No quiz history found. Answer questions above to build your transcript!
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 180, overflowY: "auto", paddingRight: 4 }}>
          {scoresArray.reverse().map((attempt, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 12px",
                background: "var(--surface)",
                border: "1px solid var(--hairline)",
                borderRadius: 8,
                fontSize: 12
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 14 }}>{attempt.score === 1 ? "✅" : "❌"}</span>
                <span style={{ color: "var(--ink)", fontWeight: 600, fontFamily: "monospace" }}>
                  {attempt.id}
                </span>
                <span
                  style={{
                    fontSize: 9.5,
                    fontWeight: 700,
                    color: getDiffColor(attempt.difficulty),
                    background: "rgba(0,0,0,0.15)",
                    padding: "1px 5px",
                    borderRadius: 4
                  }}
                >
                  {attempt.difficulty}
                </span>
              </div>
              <div style={{ fontSize: 10, color: "var(--muted)" }}>
                {new Date(attempt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
