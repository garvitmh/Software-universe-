"use client";

import React from "react";
import { motion } from "framer-motion";

const ROOMS = [
  { id: "netflix", label: "Netflix Room", x: 10, y: 15, w: 24, h: 30, color: "var(--brand)" },
  { id: "stripe", label: "Stripe Vault", x: 38, y: 15, w: 24, h: 30, color: "var(--brand-2)" },
  { id: "uber", label: "Uber Dispatch", x: 66, y: 15, w: 24, h: 30, color: "var(--pop-pink)" },
  
  { id: "amazon", label: "Amazon Plaza", x: 10, y: 55, w: 24, h: 30, color: "var(--pop-blue)" },
  { id: "shopify", label: "Shopify Pods", x: 38, y: 55, w: 24, h: 30, color: "var(--teal)" },
  { id: "cloudflare", label: "Cloudflare Edge", x: 66, y: 55, w: 24, h: 30, color: "var(--amber)" },
  
  { id: "discord", label: "Discord Wide", x: 24, y: 95, w: 24, h: 30, color: "var(--brand-2)" },
  { id: "airbnb", label: "Airbnb Gate", x: 52, y: 95, w: 24, h: 30, color: "var(--pop-pink)" }
];

export default function MuseumMap({ selectedId, onSelect }) {
  return (
    <div className="card" style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "14px" }}>
      <div>
        <span className="eyebrow" style={{ color: "var(--brand)" }}>Museum Floorplan</span>
        <h3 style={{ margin: "2px 0 0 0", fontSize: "18px" }}>Interactive Exhibits Guide Map</h3>
      </div>

      <div style={{
        position: "relative",
        width: "100%",
        height: "240px",
        backgroundColor: "var(--bg)",
        border: "1px solid var(--hairline-2)",
        borderRadius: "12px",
        overflow: "hidden"
      }}>
        {/* SVG Blueprint */}
        <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
          {/* Floor grid */}
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--hairline-2)" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Connective corridors */}
          <line x1="22%" y1="30%" x2="78%" y2="30%" stroke="var(--hairline)" strokeWidth="2" strokeDasharray="4,4" />
          <line x1="22%" y1="70%" x2="78%" y2="70%" stroke="var(--hairline)" strokeWidth="2" strokeDasharray="4,4" />
          <line x1="50%" y1="30%" x2="50%" y2="70%" stroke="var(--hairline)" strokeWidth="2" strokeDasharray="4,4" />
        </svg>

        {/* Room Blocks */}
        {ROOMS.map((r) => {
          const isSelected = selectedId === r.id;
          return (
            <motion.div
              key={r.id}
              onClick={() => onSelect(r.id)}
              whileHover={{ scale: 1.03 }}
              style={{
                position: "absolute",
                left: `${r.x}%`,
                top: `${r.y}%`,
                transform: "translate(-50%, -50%)",
                width: "90px",
                height: "50px",
                background: isSelected ? r.color : "var(--surface)",
                border: `1.5px solid ${isSelected ? r.color : "var(--hairline)"}`,
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: isSelected ? `0 0 14px ${r.color}40` : "none",
                zIndex: 10,
                transition: "background 0.2s, border 0.2s"
              }}
            >
              <span style={{
                fontSize: "10px",
                fontWeight: "800",
                color: isSelected ? "#fff" : "var(--ink)",
                textAlign: "center",
                lineHeight: "1.2"
              }}>
                {r.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
