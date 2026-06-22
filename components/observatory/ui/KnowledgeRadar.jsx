"use client";

import React, { useRef, useEffect } from "react";

export default function KnowledgeRadar({ mastery = {} }) {
  const canvasRef = useRef(null);

  const categories = [
    { label: "Security", key: "security" },
    { label: "Payments", key: "payment" },
    { label: "Orders", key: "order" },
    { label: "Loyalty", key: "loyalty" },
    { label: "Queues", key: "pos" },
    { label: "Delivery", key: "delivery" },
    { label: "Analytics", key: "analytics" }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear and set sizing
    const size = 300;
    canvas.width = size;
    canvas.height = size;

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.35;

    ctx.clearRect(0, 0, size, size);

    // Draw concentric radar webs
    const webCounts = 4;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1;

    for (let j = 1; j <= webCounts; j++) {
      const r = radius * (j / webCounts);
      ctx.beginPath();
      for (let i = 0; i < categories.length; i++) {
        const angle = (i * 2 * Math.PI) / categories.length - Math.PI / 2;
        const x = centerX + r * Math.cos(angle);
        const y = centerY + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }

    // Draw axis lines and category labels
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.fillStyle = "#8E92B2";
    ctx.font = "bold 9px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    categories.forEach((cat, i) => {
      const angle = (i * 2 * Math.PI) / categories.length - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      // Draw axis line
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();

      // Label offsets
      const labelDistance = radius + 15;
      const lx = centerX + labelDistance * Math.cos(angle);
      const ly = centerY + labelDistance * Math.sin(angle);

      ctx.fillText(cat.label, lx, ly);
    });

    // Draw mastery score polygon
    ctx.strokeStyle = "#FAB387";
    ctx.fillStyle = "rgba(250, 179, 135, 0.15)";
    ctx.lineWidth = 2;

    ctx.beginPath();
    categories.forEach((cat, i) => {
      const score = (mastery[cat.key]?.mastery || 10) / 100;
      const angle = (i * 2 * Math.PI) / categories.length - Math.PI / 2;
      const r = radius * score;
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw center core glow dot
    ctx.fillStyle = "#F38BA8";
    ctx.beginPath();
    ctx.arc(centerX, centerY, 3, 0, 2 * Math.PI);
    ctx.fill();

  }, [mastery]);

  return (
    <div className="obs-card" style={{ gridColumn: "span 4", alignItems: "center" }}>
      <div className="obs-card-title" style={{ width: "100%" }}>
        <span>Knowledge Radar</span>
        <span style={{ color: "#FAB387" }}>Core Skills</span>
      </div>
      <canvas ref={canvasRef} style={{ maxWidth: "100%", height: "auto" }} />
    </div>
  );
}
