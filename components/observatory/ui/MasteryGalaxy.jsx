"use client";

import React, { useRef, useEffect } from "react";

export default function MasteryGalaxy({ mastery = {} }) {
  const canvasRef = useRef(null);

  const nodes = [
    { id: "security", label: "Security", x: 60, y: 70, color: "#CBA6F7" },
    { id: "payment", label: "Payments", x: 140, y: 70, color: "#FAB387" },
    { id: "order", label: "Orders", x: 220, y: 110, color: "#89B4FA" },
    { id: "loyalty", label: "Ledgers", x: 140, y: 150, color: "#A6E3A1" },
    { id: "pos", label: "Queues", x: 220, y: 220, color: "#F2CDCD" },
    { id: "delivery", label: "Geo", x: 60, y: 210, color: "#F38BA8" },
    { id: "analytics", label: "Analytics", x: 280, y: 170, color: "#EBA0F0" }
  ];

  const links = [
    { source: "security", target: "payment" },
    { source: "payment", target: "order" },
    { source: "payment", target: "loyalty" },
    { source: "order", target: "loyalty" },
    { source: "order", target: "pos" },
    { source: "order", target: "analytics" },
    { source: "loyalty", target: "analytics" },
    { source: "delivery", target: "analytics" }
  ];

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

    // Draw connection lines
    ctx.lineWidth = 1.5;
    links.forEach(link => {
      const sourceNode = nodes.find(n => n.id === link.source);
      const targetNode = nodes.find(n => n.id === link.target);
      if (!sourceNode || !targetNode) return;

      const sourceMastery = mastery[sourceNode.id]?.mastery || 0;
      const targetMastery = mastery[targetNode.id]?.mastery || 0;
      
      // If both concepts have >40% mastery, light up the link
      if (sourceMastery >= 40 && targetMastery >= 40) {
        ctx.strokeStyle = "rgba(148, 226, 213, 0.4)"; // Teal glow link
        ctx.shadowColor = "#94E2D5";
        ctx.shadowBlur = 4;
      } else {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
        ctx.shadowBlur = 0;
      }

      ctx.beginPath();
      ctx.moveTo(sourceNode.x, sourceNode.y);
      ctx.lineTo(targetNode.x, targetNode.y);
      ctx.stroke();
    });

    // Reset shadow
    ctx.shadowBlur = 0;

    // Draw concept nodes
    nodes.forEach(node => {
      const score = mastery[node.id]?.mastery || 0;
      
      // Outer glow for strong nodes
      if (score >= 80) {
        ctx.fillStyle = "rgba(166, 227, 161, 0.05)";
        ctx.beginPath();
        ctx.arc(node.x, node.y, 22, 0, 2 * Math.PI);
        ctx.fill();
      }

      // Base Node
      ctx.strokeStyle = score >= 40 ? node.color : "rgba(255,255,255,0.15)";
      ctx.lineWidth = score >= 80 ? 3 : 1.5;
      ctx.fillStyle = score >= 40 ? "rgba(17, 17, 27, 0.95)" : "rgba(30, 30, 46, 0.5)";
      
      ctx.beginPath();
      ctx.arc(node.x, node.y, 14, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      // Core Dot
      ctx.fillStyle = score >= 40 ? node.color : "#45475A";
      ctx.beginPath();
      ctx.arc(node.x, node.y, 4, 0, 2 * Math.PI);
      ctx.fill();

      // Node label
      ctx.fillStyle = score >= 40 ? "#F8F9FC" : "#6C7086";
      ctx.font = "bold 9px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(node.label, node.x, node.y - 20);

      // Score text
      ctx.fillStyle = score >= 80 ? "#A6E3A1" : "#8E92B2";
      ctx.font = "8px monospace";
      ctx.fillText(`${score}%`, node.x, node.y + 24);
    });

  }, [mastery]);

  return (
    <div className="obs-card" style={{ gridColumn: "span 4", alignItems: "center" }}>
      <div className="obs-card-title" style={{ width: "100%" }}>
        <span>Mastery Galaxy</span>
        <span style={{ color: "#89B4FA" }}>Knowledge Nodes</span>
      </div>
      <canvas ref={canvasRef} style={{ maxWidth: "100%", height: "auto" }} />
    </div>
  );
}
