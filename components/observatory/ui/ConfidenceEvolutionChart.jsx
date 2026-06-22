"use client";

import React, { useRef, useEffect } from "react";

export default function ConfidenceEvolutionChart({ timeline = [] }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 340;
    const height = 300;
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    const padding = 35;
    const graphWidth = width - 2 * padding;
    const graphHeight = height - 2 * padding;

    // Draw grid background
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (graphHeight * i) / 5;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();

      // Draw axis labels
      ctx.fillStyle = "#8E92B2";
      ctx.font = "8px monospace";
      ctx.fillText(`${100 - i * 20}%`, 10, y + 3);
    }

    // Prepare mock data points if timeline is empty
    const pointsCount = 8;
    const masteryPoints = [20, 35, 45, 55, 50, 70, 85, 95];
    const confidencePoints = [50, 30, 45, 60, 40, 65, 80, 90];

    const getX = (idx) => padding + (graphWidth * idx) / (pointsCount - 1);
    const getY = (score) => padding + graphHeight * (1 - score / 100);

    // Draw Mastery Line (Yellow/Orange)
    ctx.strokeStyle = "#FAB387";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    masteryPoints.forEach((score, i) => {
      const x = getX(i);
      const y = getY(score);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw Mastery Dots
    ctx.fillStyle = "#FAB387";
    masteryPoints.forEach((score, i) => {
      ctx.beginPath();
      ctx.arc(getX(i), getY(score), 3.5, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw Confidence Line (Blue)
    ctx.strokeStyle = "#89B4FA";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    confidencePoints.forEach((score, i) => {
      const x = getX(i);
      const y = getY(score);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw Confidence Dots
    ctx.fillStyle = "#89B4FA";
    confidencePoints.forEach((score, i) => {
      ctx.beginPath();
      ctx.arc(getX(i), getY(score), 3.5, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Bottom Legend text
    ctx.fillStyle = "#FAB387";
    ctx.font = "bold 9px sans-serif";
    ctx.fillText("● Mastery Score", padding + 20, height - 12);

    ctx.fillStyle = "#89B4FA";
    ctx.fillText("● Confidence Level", padding + 130, height - 12);

  }, [timeline]);

  return (
    <div className="obs-card" style={{ gridColumn: "span 4", alignItems: "center" }}>
      <div className="obs-card-title" style={{ width: "100%" }}>
        <span>Confidence Evolution</span>
        <span style={{ color: "#EBA0F0" }}>Growth Curves</span>
      </div>
      <canvas ref={canvasRef} style={{ maxWidth: "100%", height: "auto" }} />
    </div>
  );
}
