"use client";

import React from "react";

export default function RecommendationFeed({ recommendations = {} }) {
  const primary = recommendations?.primaryRecommendation || {
    nextConcept: "security",
    recommendedDifficulty: "Beginner",
    reason: "Review basic stateless JWT mechanisms.",
    urgency: "HIGH",
    recommendationType: "REVIEW"
  };

  const secondary = recommendations?.secondaryRecommendations || [];
  const optionalCuriosity = recommendations?.optionalCuriosityTopics || ["CAP Theorem", "Kafka"];

  return (
    <div className="obs-card" style={{ gridColumn: "span 6" }}>
      <div className="obs-card-title">
        <span>Pedagogical Recommendation Feed</span>
        <span style={{ color: "#FAB387" }}>Staff Suggestions</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 10 }}>
        {/* Primary Recommendation Card */}
        <div style={{
          padding: 14,
          background: "rgba(250, 179, 135, 0.05)",
          border: "1px solid rgba(250, 179, 135, 0.2)",
          borderRadius: 12,
          display: "flex",
          flexDirection: "column",
          gap: 6
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: "#FAB387", textTransform: "uppercase" }}>
              🎯 Primary Action: {primary.recommendationType}
            </span>
            <span className={`obs-badge obs-badge-${primary.urgency.toLowerCase()}`}>{primary.urgency}</span>
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#F8F9FC" }}>
            Explore {primary.nextConcept.toUpperCase()} at {primary.recommendedDifficulty} level
          </div>
          <p style={{ margin: 0, fontSize: 12, color: "var(--obs-muted)", lineHeight: 1.4 }}>
            {primary.reason}
          </p>
        </div>

        {/* Curiosity Recommendations */}
        {optionalCuriosity.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--obs-muted)" }}>Curiosity Deep Dives:</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {optionalCuriosity.map(c => (
                <span key={c} style={{
                  padding: "3px 8px",
                  borderRadius: 6,
                  background: "rgba(148, 226, 213, 0.08)",
                  border: "1px solid rgba(148, 226, 213, 0.15)",
                  color: "#94E2D5",
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase"
                }}>
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
