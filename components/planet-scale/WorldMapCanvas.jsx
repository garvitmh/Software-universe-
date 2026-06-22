// components/planet-scale/WorldMapCanvas.jsx

import React from "react";
import { usePlanetScale } from "./usePlanetScale";
import { REGIONS } from "./PlanetSchema";
import RegionNode from "./RegionNode";
import TrafficFlowLine from "./TrafficFlowLine";

export default function WorldMapCanvas() {
  const {
    regionTelemetry,
    activeRegion,
    setActiveRegion,
    primaryRegion,
    disasters
  } = usePlanetScale();

  // Define network topology links
  const links = [
    { from: "us-west", to: "us-east" },
    { from: "us-east", to: "europe" },
    { from: "europe", to: "india" },
    { from: "india", to: "singapore" },
    { from: "singapore", to: "japan" },
    { from: "singapore", to: "australia" },
    { from: "us-west", to: "japan" },
    { from: "us-west", to: "australia" }
  ];

  return (
    <div style={{
      position: "relative",
      width: "100%",
      height: "440px",
      background: "var(--bg-2)", // warm-cream
      borderRadius: "16px",
      border: "1px solid var(--hairline-2)",
      overflow: "hidden",
      boxShadow: "inset 0 4px 20px rgba(0, 0, 0, 0.05)"
    }}>
      {/* Grid Overlay */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: "radial-gradient(var(--hairline-2) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
        opacity: 0.7,
        pointerEvents: "none"
      }} />

      {/* Styled SVG Continents Backdrop */}
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none"
        }}
        viewBox="0 0 1000 500"
        preserveAspectRatio="none"
      >
        {/* Simplified Vector Continents */}
        {/* North America */}
        <path d="M 50 100 Q 120 80 200 120 T 320 200 T 350 250 T 250 280 T 150 250 T 80 180 Z" fill="var(--hairline)" opacity="0.25" />
        {/* South America */}
        <path d="M 250 280 Q 280 320 300 380 T 330 460 T 280 480 T 240 400 T 220 330 Z" fill="var(--hairline)" opacity="0.25" />
        {/* Eurasia & Africa */}
        <path d="M 450 80 Q 600 60 750 90 T 900 120 T 920 220 T 800 280 T 700 240 T 550 200 T 420 150 Z" fill="var(--hairline)" opacity="0.25" />
        <path d="M 450 200 Q 520 220 580 250 T 600 350 T 540 450 T 480 380 T 420 280 Z" fill="var(--hairline)" opacity="0.25" />
        {/* Australia */}
        <path d="M 800 350 Q 860 360 900 380 T 920 440 T 840 450 T 780 400 Z" fill="var(--hairline)" opacity="0.25" />

        {/* Network Connection Lines */}
        {links.map((link, idx) => {
          const fromReg = REGIONS[link.from];
          const toReg = REGIONS[link.to];
          if (!fromReg || !toReg) return null;

          // Convert coordinates to canvas space
          const x1 = fromReg.x * 10;
          const y1 = fromReg.y * 5;
          const x2 = toReg.x * 10;
          const y2 = toReg.y * 5;

          // Check if link is disrupted by cable cut
          const isCut = disasters.includes("undersea_fiber_cut") &&
            ((link.from === "us-east" && link.to === "europe") || (link.from === "europe" && link.to === "us-east"));

          // Midpoint offset for a curve
          const cx = (x1 + x2) / 2;
          const cy = (y1 + y2) / 2 - 30; // slight arc upward

          return (
            <g key={idx}>
              <path
                d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`}
                fill="none"
                stroke={isCut ? "var(--pink)" : "var(--brand-soft)"}
                strokeWidth={isCut ? 2 : 1.5}
                strokeDasharray={isCut ? "4 4" : "none"}
                opacity={isCut ? 0.8 : 0.4}
              />
              {!isCut && (
                <TrafficFlowLine
                  fromX={x1}
                  fromY={y1}
                  toX={x2}
                  toY={y2}
                  ctrlX={cx}
                  ctrlY={cy}
                  fromId={link.from}
                  toId={link.to}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Region Nodes overlay (absolutely positioned) */}
      {Object.values(REGIONS).map((reg) => {
        const telemetry = regionTelemetry[reg.id] || {};
        const isPrimary = reg.id === primaryRegion;
        const isActive = reg.id === activeRegion;

        return (
          <RegionNode
            key={reg.id}
            region={reg}
            telemetry={telemetry}
            isPrimary={isPrimary}
            isActive={isActive}
            onClick={() => setActiveRegion(reg.id)}
          />
        );
      })}
    </div>
  );
}
