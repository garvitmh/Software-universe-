"use client";

import React from "react";

// Status colors
const STATUS_COLORS = {
  done: "#10B981", // Emerald
  learning: "#F59E0B", // Amber
  skip: "#6B7280", // Gray
};

export default function RoadmapFlowVertical({ stages, tints, onSelect, nodeStatus = {} }) {
  return (
    <div style={{ position: "relative", padding: "40px 0 80px", width: "100%", maxWidth: 900, margin: "0 auto" }}>
      
      {/* The Grid Layout */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "1fr 8px 1fr", 
        rowGap: "24px", 
        columnGap: "40px", 
        position: "relative" 
      }}>
        
        {/* The Continuous Center Line */}
        <div style={{ 
          gridColumn: 2, 
          gridRow: "1 / -1", 
          background: "var(--brand)", 
          width: 6, 
          borderRadius: 6, 
          justifySelf: "center",
          opacity: 0.15,
          zIndex: 1
        }} />

        {stages.map((stage, sIdx) => (
          <React.Fragment key={stage.id}>
            {/* Stage Node (Centered) */}
            <div style={{ 
              gridColumn: "1 / -1", 
              justifySelf: "center", 
              zIndex: 10, 
              marginTop: sIdx === 0 ? 0 : 50, 
              marginBottom: 10,
              width: "100%",
              maxWidth: 400,
            }}>
              <StageButton 
                stage={stage} 
                tint={tints[stage.tint] || tints.brand} 
                status={nodeStatus[stage.id]}
                onClick={() => onSelect({ ...stage, isStage: true })} 
              />
            </div>

            {/* Child Tech Nodes (Alternating Left/Right) */}
            {stage.nodes.map((child, idx) => {
              const isLeft = idx % 2 === 0;
              const status = nodeStatus[child.id];
              return (
                <div key={child.id} style={{
                  gridColumn: isLeft ? 1 : 3,
                  justifySelf: isLeft ? "end" : "start",
                  position: "relative",
                  zIndex: 10,
                  width: "100%",
                  maxWidth: 280,
                }}>
                  {/* Horizontal Connector Line bridging the grid columnGap */}
                  <div style={{
                    position: "absolute", top: "50%",
                    [isLeft ? "right" : "left"]: "-40px",
                    width: "40px", height: "4px", 
                    background: "var(--brand)", 
                    opacity: 0.15,
                    zIndex: -1,
                    transform: "translateY(-50%)"
                  }} />

                  <ChildButton 
                    child={child} 
                    status={status}
                    onClick={() => onSelect(child)} 
                  />
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function StageButton({ stage, tint, status, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        background: "var(--surface)",
        border: `2px solid ${tint.ink}`,
        borderRadius: 14,
        padding: "16px 20px",
        cursor: "pointer",
        textAlign: "center",
        boxShadow: `4px 4px 0 0 ${tint.soft}`,
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        position: "relative"
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "translate(2px, 2px)";
        e.currentTarget.style.boxShadow = `2px 2px 0 0 ${tint.soft}`;
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "translate(0, 0)";
        e.currentTarget.style.boxShadow = `4px 4px 0 0 ${tint.soft}`;
      }}
    >
      <div style={{ fontFamily: "Fraunces", fontSize: 22, fontWeight: 700, color: "var(--ink)", marginBottom: 4 }}>
        {stage.title}
      </div>
      <div style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.4 }}>
        {stage.summary}
      </div>
      
      {/* Status Badge */}
      {status && (
        <div style={{ position: "absolute", top: -10, right: -10, background: STATUS_COLORS[status], color: "#fff", width: 24, height: 24, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", border: "3px solid var(--bg)", zIndex: 20 }}>
          {status === 'done' && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>}
          {status === 'learning' && <div style={{width:8, height:8, background:"#fff", borderRadius:4}} />}
          {status === 'skip' && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>}
        </div>
      )}
    </button>
  );
}

function ChildButton({ child, status, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        background: "var(--surface)",
        border: "1.5px solid var(--hairline-2)",
        borderRadius: 10,
        padding: "12px 16px",
        cursor: "pointer",
        textAlign: "left",
        transition: "border-color 0.15s ease, background 0.15s ease",
        position: "relative"
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.borderColor = "var(--brand)";
        e.currentTarget.style.background = "var(--bg-2)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.borderColor = "var(--hairline-2)";
        e.currentTarget.style.background = "var(--surface)";
      }}
    >
      <div style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)", marginBottom: 4 }}>
        {child.title}
      </div>
      <div style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.4 }}>
        {child.note}
      </div>

      {/* Status Badge */}
      {status && (
        <div style={{ position: "absolute", top: -8, right: -8, background: STATUS_COLORS[status], color: "#fff", width: 20, height: 20, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid var(--bg)", zIndex: 20 }}>
          {status === 'done' && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>}
          {status === 'learning' && <div style={{width:6, height:6, background:"#fff", borderRadius:3}} />}
          {status === 'skip' && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>}
        </div>
      )}
    </button>
  );
}
