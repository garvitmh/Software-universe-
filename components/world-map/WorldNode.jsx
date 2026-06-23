import React from "react";
import { Handle, Position } from "@xyflow/react";
import { AlertCircleIcon, PlayIcon, ZapIcon, ActivityIcon } from "@/components/ui/Icons";

const TINTS = {
  blue: { ink: "var(--blue)", soft: "var(--blue-soft)" },
  pink: { ink: "var(--pink)", soft: "var(--pink-soft)" },
  brand: { ink: "var(--brand)", soft: "var(--brand-soft)" },
  amber: { ink: "var(--amber)", soft: "var(--amber-soft)" },
  teal: { ink: "var(--teal)", soft: "var(--teal-soft)" },
  purple: { ink: "var(--purple)", soft: "var(--purple-soft)" },
};

const HANDLE_STYLE = { opacity: 0, pointerEvents: "none" };

export default function WorldNode({ data }) {
  const tint = TINTS[data.tint] || TINTS.brand;
  
  const isFailuresMode = data.systemMode === "failures";
  const isScalingMode = data.systemMode === "scaling";

  const getBorderColor = () => {
    if (data.selected) return "var(--brand)";
    if (isFailuresMode) return "var(--pop-pink)";
    if (isScalingMode && data.scaleLoad === "1M") return "var(--pop-yellow)";
    return "var(--hairline)";
  };

  const getShadow = () => {
    if (data.selected) return "0 8px 30px -8px rgba(232,86,10,.25)";
    if (isFailuresMode) return "0 0 14px rgba(255, 77, 141, 0.25)";
    if (isScalingMode && data.scaleLoad === "1M") return "0 0 14px rgba(255, 178, 62, 0.25)";
    return "var(--shadow)";
  };

  return (
    <div 
      style={{ 
        width: 250, 
        background: "var(--surface)", 
        border: `1.5px solid ${getBorderColor()}`, 
        borderLeft: `5px solid ${isFailuresMode ? "var(--pop-pink)" : tint.ink}`, 
        borderRadius: 16, 
        padding: "16px 18px", 
        boxShadow: getShadow(), 
        cursor: "pointer",
        position: "relative",
        transition: "border-color 0.15s ease, box-shadow 0.15s ease",
      }}
    >
      <Handle type="target" position={Position.Left} id="l" style={HANDLE_STYLE} />
      <Handle type="source" position={Position.Right} id="r" style={HANDLE_STYLE} />
      <Handle type="target" position={Position.Top} id="t" style={HANDLE_STYLE} />
      <Handle type="source" position={Position.Bottom} id="b" style={HANDLE_STYLE} />

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "center", justifycontent: "space-between", gap: 8, width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, minWidth: 0 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: isFailuresMode ? "var(--pop-pink)" : tint.ink, flexShrink: 0 }} />
            <div style={{ fontFamily: "Fraunces", fontSize: 17, fontWeight: 700, color: "var(--ink)", letterSpacing: "-.01em", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
              {data.title}
            </div>
          </div>
          {isFailuresMode ? (
            <AlertCircleIcon size={15} style={{ color: "var(--pop-pink)", flexShrink: 0 }} />
          ) : data.simSlug ? (
            <span 
              style={{ 
                fontSize: 9, 
                fontWeight: 700, 
                background: "var(--brand-soft)", 
                color: "var(--brand)", 
                padding: "2px 6px", 
                borderRadius: 99,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                display: "inline-flex",
                alignItems: "center",
                gap: 3,
                flexShrink: 0
              }}
            >
              Sim <PlayIcon size={8} />
            </span>
          ) : null}
        </div>
        
        <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ink-2)", lineHeight: 1.3 }}>
          {data.sub}
        </div>

        {/* Dynamic Mode Footer */}
        {isFailuresMode && (
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--pop-pink)", marginTop: 6, display: "flex", alignItems: "center", gap: 5 }}>
            <ZapIcon size={12} />
            <span>Risk: Disaster scenario active</span>
          </div>
        )}

        {isScalingMode && (
          <div style={{ fontSize: 11, fontWeight: 700, color: data.scaleLoad === "1M" ? "var(--pop-yellow)" : "var(--pop-lime)", marginTop: 6, display: "flex", alignItems: "center", gap: 5 }}>
            <ActivityIcon size={12} />
            <span>Load: {data.scaleLoad} Users</span>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: data.scaleLoad === "1M" ? "var(--pop-yellow)" : "var(--pop-lime)", display: "inline-block" }} />
          </div>
        )}

        {!isFailuresMode && !isScalingMode && (
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
            <span>Explore architecture</span>
            <span style={{ fontSize: 10 }}>→</span>
          </div>
        )}
      </div>
    </div>
  );
}
