// components/planet-scale/TrafficFlowLine.jsx

import React from "react";
import { usePlanetScale } from "./usePlanetScale";

export default function TrafficFlowLine({ fromX, fromY, toX, toY, ctrlX, ctrlY, fromId, toId }) {
  const { scale, consistencyMode, cdnEnabled, disasters } = usePlanetScale();

  // Create path definition
  const pathD = `M ${fromX} ${fromY} Q ${ctrlX} ${ctrlY} ${toX} ${toY}`;

  // Reverse path for returns
  const pathReverseD = `M ${toX} ${toY} Q ${ctrlX} ${ctrlY} ${fromX} ${fromY}`;

  // Packet density based on scale
  let packetCount = 2;
  if (scale === "100k") packetCount = 3;
  if (scale === "1m") packetCount = 4;
  if (scale === "10m" || scale === "100m") packetCount = 6;

  // Determine packet type colors
  let packetColor = "var(--brand)"; // default request orange
  if (consistencyMode === "strong") {
    packetColor = "#b45309"; // slower amber consensus packets
  } else if (!cdnEnabled) {
    packetColor = "#f97316"; // un-cached hot database hits
  }

  // Active congestion check
  const isCongested = disasters.includes("network_congestion") && (fromId === "europe" || toId === "europe");

  // Create array of delays for packets to offset them
  const packets = Array.from({ length: packetCount }, (_, i) => i * (2.4 / packetCount));

  return (
    <g>
      {/* Forward packets */}
      {packets.map((delay, idx) => (
        <circle key={`fwd-${idx}`} r={isCongested ? 4 : 3} fill={packetColor}>
          <animateMotion
            dur={isCongested ? "4.5s" : "2.2s"}
            repeatCount="indefinite"
            begin={`${delay}s`}
            path={pathD}
          />
          <animate
            attributeName="opacity"
            values="0;1;1;0"
            keyTimes="0;0.1;0.9;1"
            dur={isCongested ? "4.5s" : "2.2s"}
            repeatCount="indefinite"
            begin={`${delay}s`}
          />
        </circle>
      ))}

      {/* Backward replication logs or CDN checks */}
      {packets.map((delay, idx) => (
        <circle key={`rev-${idx}`} r={2.5} fill="#0d9488" opacity={0.6}>
          <animateMotion
            dur={isCongested ? "5s" : "2.6s"}
            repeatCount="indefinite"
            begin={`${delay + 0.5}s`}
            path={pathReverseD}
          />
          <animate
            attributeName="opacity"
            values="0;0.8;0.8;0"
            keyTimes="0;0.1;0.9;1"
            dur={isCongested ? "5s" : "2.6s"}
            repeatCount="indefinite"
            begin={`${delay + 0.5}s`}
          />
        </circle>
      ))}
    </g>
  );
}
