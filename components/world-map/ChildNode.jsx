import React from "react";
import { Handle, Position } from "@xyflow/react";
import Link from "next/link";
import { BookOpenIcon, PlayIcon, CpuIcon, ZapIcon } from "@/components/ui/Icons";

const TINTS = {
  blue: "var(--blue)",
  pink: "var(--pink)",
  brand: "var(--brand)",
  amber: "var(--amber)",
  teal: "var(--teal)",
  purple: "var(--purple)",
};

const ICON_MAP = {
  codex: BookOpenIcon,
  simulator: PlayIcon,
  tech: CpuIcon,
  failure: ZapIcon,
};

const HANDLE_STYLE = { opacity: 0, pointerEvents: "none" };

export default function ChildNode({ data }) {
  const tintColor = TINTS[data.tint] || TINTS.brand;

  const isFailureMode = data.systemMode === "failures" && data.typeLabel === "Failure";
  const isScalingMode = data.systemMode === "scaling" && (data.typeLabel === "Simulator" || data.typeLabel === "Tech");

  const getBorderColor = () => {
    if (isFailureMode) return "var(--pop-pink)";
    if (isScalingMode) return "var(--brand)";
    return tintColor;
  };

  const getBackground = () => {
    if (isFailureMode) return "var(--pink-soft)";
    if (isScalingMode) return "var(--brand-soft)";
    return "var(--surface)";
  };

  const content = (
    <div
      style={{
        padding: "8px 12px",
        background: getBackground(),
        border: isFailureMode ? "2px solid var(--pop-pink)" : `1.5px dashed ${getBorderColor()}`,
        borderRadius: 12,
        boxShadow: isFailureMode ? "0 0 14px rgba(255, 77, 141, 0.4)" : "var(--shadow)",
        display: "flex",
        alignItems: "center",
        gap: 6,
        cursor: "pointer",
        transition: "transform 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease",
        animation: isFailureMode ? "wobble 2s ease infinite" : undefined,
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "scale(1.05)";
        if (!isFailureMode && !isScalingMode) {
          e.currentTarget.style.backgroundColor = "var(--surface-warm)";
        }
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        if (!isFailureMode && !isScalingMode) {
          e.currentTarget.style.backgroundColor = "var(--surface)";
        }
      }}
    >
      <Handle type="target" position={Position.Left} id="l" style={HANDLE_STYLE} />
      <Handle type="source" position={Position.Right} id="r" style={HANDLE_STYLE} />
      <Handle type="target" position={Position.Top} id="t" style={HANDLE_STYLE} />
      <Handle type="source" position={Position.Bottom} id="b" style={HANDLE_STYLE} />

      {(() => {
        const IconComp = isFailureMode ? ZapIcon : (ICON_MAP[data.iconType] || CpuIcon);
        return <IconComp size={14} style={{ color: isFailureMode ? "var(--pop-pink)" : tintColor }} />;
      })()}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: isFailureMode ? "var(--pop-pink)" : "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
          {isFailureMode ? "Disaster Risk" : data.typeLabel}
        </span>
        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>
          {data.label}
        </span>
      </div>
    </div>
  );

  if (data.href) {
    return <Link href={data.href}>{content}</Link>;
  }

  return content;
}
