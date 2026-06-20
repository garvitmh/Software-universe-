"use client";

import { useCallback } from "react";
import {
  ReactFlow, Background, Controls, MiniMap, Handle, Position,
  useNodesState, useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// Fixed layout: the request path left→right, with the admin feeding down into
// the backend. A real pannable / zoomable canvas — beyond a static tree.
const POS = {
  app: { x: 0, y: 180 }, wire: { x: 250, y: 180 }, backend: { x: 500, y: 180 },
  data: { x: 760, y: 180 }, admin: { x: 500, y: 6 }, systems: { x: 1020, y: 180 }, scale: { x: 1280, y: 180 },
};
const EDGES = [
  ["app", "wire"], ["wire", "backend"], ["backend", "data"],
  ["data", "systems"], ["systems", "scale"], ["admin", "backend"],
];
// literal hex for the SVG minimap (CSS vars don't resolve inside the minimap)
const HEX = { blue: "#185FA5", amber: "#854F0B", teal: "#0F6E56", purple: "#534AB7", pink: "#993556", brand: "#C2410C" };

const HANDLE = { opacity: 0, pointerEvents: "none" };

function StageNode({ data }) {
  const t = data.tint;
  return (
    <div style={{ width: 212, background: "var(--surface)", border: `1.5px solid ${t.soft}`, borderLeft: `4px solid ${t.ink}`, borderRadius: 14, padding: "12px 15px", boxShadow: "var(--shadow)", cursor: "pointer" }}>
      <Handle type="target" position={Position.Left} id="l" style={HANDLE} />
      <Handle type="source" position={Position.Right} id="r" style={HANDLE} />
      <Handle type="target" position={Position.Top} id="t" style={HANDLE} />
      <Handle type="source" position={Position.Bottom} id="b" style={HANDLE} />
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ width: 9, height: 9, borderRadius: 999, background: t.ink, flexShrink: 0 }} />
        <div style={{ fontFamily: "Fraunces", fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>{data.title}</div>
      </div>
      <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 5, lineHeight: 1.4 }}>{data.summary}</div>
      <div style={{ fontSize: 10.5, color: t.ink, marginTop: 7, fontWeight: 700 }}>{data.count} topics inside →</div>
    </div>
  );
}

const nodeTypes = { stage: StageNode };

export default function RoadmapFlow({ stages, tints, onSelect }) {
  const initialNodes = stages.map((s) => ({
    id: s.id,
    type: "stage",
    position: POS[s.id] || { x: 0, y: 0 },
    data: { title: s.title, summary: s.summary, tint: tints[s.tint] || tints.brand, hex: HEX[s.tint] || HEX.brand, count: s.nodes.length, stage: s },
  }));
  const initialEdges = EDGES.map(([a, b]) => ({
    id: `${a}-${b}`,
    source: a, target: b,
    sourceHandle: a === "admin" ? "b" : "r",
    targetHandle: a === "admin" ? "t" : "l",
    animated: true,
    style: { stroke: "#D9C7A6", strokeWidth: 2 },
  }));

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const onNodeClick = useCallback((_e, node) => onSelect?.({ ...node.data.stage, isStage: true }), [onSelect]);

  return (
    <div>
      <div style={{ height: 540, border: "1px solid var(--hairline)", borderRadius: 18, overflow: "hidden", background: "var(--bg-2)" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          fitView
          fitViewOptions={{ padding: 0.22 }}
          minZoom={0.4}
          maxZoom={1.6}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#E6DAC2" gap={24} size={1.5} />
          <Controls showInteractive={false} />
          <MiniMap nodeColor={(n) => n.data?.hex || "#ccc"} nodeStrokeWidth={0} maskColor="rgba(244,236,221,0.66)" pannable zoomable />
        </ReactFlow>
      </div>
      <p style={{ fontSize: 12.5, color: "var(--faint)", textAlign: "center", marginTop: 10 }}>
        Drag to pan · scroll to zoom · click any node to open it
      </p>
    </div>
  );
}
