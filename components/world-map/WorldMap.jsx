"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Link from "next/link";
import { WORLDS, EDGES, CURIOSITY_LIST } from "./world-data";
import WorldNode from "./WorldNode";
import ChildNode from "./ChildNode";

const nodeTypes = {
  worldNode: WorldNode,
  childNode: ChildNode,
};

export default function WorldMap() {
  const [systemMode, setSystemMode] = useState("normal"); // 'normal' | 'failures' | 'scaling'
  const [scaleLoad, setScaleLoad] = useState("10"); // '10' | '100k' | '1M'
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWorld, setSelectedWorld] = useState(null);
  const [curiosityIdx, setCuriosityIdx] = useState(0);

  // Initial Nodes builder
  const buildNodes = useCallback((selectedId, mode, load) => {
    return WORLDS.map((w) => ({
      id: w.id,
      type: "worldNode",
      position: { x: w.x, y: w.y },
      data: {
        id: w.id,
        title: w.title,
        sub: w.sub,
        desc: w.desc,
        tint: w.tint,
        slug: w.slug,
        simSlug: w.simSlug,
        anchors: w.anchors,
        failures: w.failures,
        disaster: w.disaster,
        recovery: w.recovery,
        scalingStats: w.scalingStats,
        selected: w.id === selectedId,
        systemMode: mode,
        scaleLoad: load,
      },
    }));
  }, []);

  // Initial Edges builder
  const buildEdges = useCallback((selectedId, mode, load) => {
    const baseEdges = EDGES.map((e, idx) => {
      let stroke = "var(--hairline-2)";
      let strokeWidth = 2;
      let animated = e.animated;
      let duration = "2s";

      if (mode === "failures") {
        stroke = "var(--pop-pink)";
        strokeWidth = 2.5;
        animated = true;
        duration = "4s"; // slow crawl of errors
      } else if (mode === "scaling") {
        stroke = load === "1M" ? "var(--pop-yellow)" : "var(--pop-lime)";
        strokeWidth = load === "1M" ? 4.5 : load === "100k" ? 3 : 1.5;
        animated = true;
        duration = load === "1M" ? "0.3s" : load === "100k" ? "0.8s" : "2s";
      } else if (e.animated) {
        stroke = "var(--brand)";
      }

      return {
        id: `edge-${idx}`,
        source: e.source,
        target: e.target,
        animated,
        style: {
          stroke,
          strokeWidth,
          animationDuration: duration,
        },
      };
    });

    return baseEdges;
  }, []);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Sync nodes and edges on mode/load changes
  useEffect(() => {
    const activeId = selectedWorld?.id || null;
    const baseNodes = buildNodes(activeId, systemMode, scaleLoad);
    const baseEdges = buildEdges(activeId, systemMode, scaleLoad);

    if (!activeId) {
      setNodes(baseNodes);
      setEdges(baseEdges);
      return;
    }

    // If there is an expanded node, inject its children
    const clickedWorld = WORLDS.find((w) => w.id === activeId);
    if (!clickedWorld) return;

    const parentNode = baseNodes.find((n) => n.id === activeId);
    if (!parentNode) return;

    const centerX = parentNode.position.x + 125;
    const centerY = parentNode.position.y + 45;
    const childrenData = clickedWorld.children || [];
    const N = childrenData.length;
    const radius = 170;
    const angleStep = (2 * Math.PI) / N;

    const childNodes = childrenData.map((child, idx) => {
      const angle = idx * angleStep;
      const x = centerX + Math.cos(angle) * radius - 75;
      const y = centerY + Math.sin(angle) * radius - 25;
      return {
        id: child.id,
        type: "childNode",
        position: { x, y },
        data: {
          label: child.label,
          typeLabel: child.typeLabel,
          emoji: child.emoji,
          href: child.href,
          tint: clickedWorld.tint,
          systemMode,
        },
      };
    });

    const childEdges = childrenData.map((child) => ({
      id: `child-edge-${activeId}-${child.id}`,
      source: activeId,
      target: child.id,
      animated: false,
      style: {
        stroke: systemMode === "failures" ? "var(--pop-pink)" : "var(--hairline-2)",
        strokeWidth: 1.5,
        strokeDasharray: "3 3",
      },
    }));

    setNodes([...baseNodes, ...childNodes]);
    setEdges([...baseEdges, ...childEdges]);
  }, [systemMode, scaleLoad, selectedWorld, buildNodes, buildEdges, setNodes, setEdges]);

  // Node click handler
  const onNodeClick = useCallback((event, node) => {
    const clickedId = node.id;
    const clickedWorld = WORLDS.find((w) => w.id === clickedId);

    if (!clickedWorld) {
      // Child node click
      if (node.data.typeLabel === "Failure" || node.data.typeLabel === "Disaster Risk") {
        const parentId = clickedId.split("-")[0];
        const parentWorld = WORLDS.find((w) => w.id === parentId);
        if (parentWorld) {
          setSelectedWorld(parentWorld);
          setSystemMode("failures");
        }
      }
      return;
    }

    if (selectedWorld?.id === clickedId) {
      // Collapse
      setSelectedWorld(null);
    } else {
      // Expand
      setSelectedWorld(clickedWorld);
    }
  }, [selectedWorld]);

  const closeDrawer = () => {
    setSelectedWorld(null);
  };

  // Search Results filtering
  const getSearchResults = () => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    const results = [];

    for (const w of WORLDS) {
      if (w.title.toLowerCase().includes(query) || w.sub.toLowerCase().includes(query)) {
        results.push({ type: "world", id: w.id, label: w.title, sub: w.sub });
      }
      for (const child of w.children || []) {
        if (child.label.toLowerCase().includes(query)) {
          results.push({ type: child.typeLabel, id: w.id, childId: child.id, label: child.label, sub: `Inside ${w.title}` });
        }
      }
    }
    return results.slice(0, 5);
  };

  const handleSearchResultClick = (res) => {
    const world = WORLDS.find((w) => w.id === res.id);
    if (world) {
      setSelectedWorld(world);
      setSearchQuery("");
    }
  };

  // Curiosity trigger
  const handleCuriosityTrigger = () => {
    const current = CURIOSITY_LIST[curiosityIdx];
    const world = WORLDS.find((w) => w.id === current.worldId);
    if (world) {
      setSelectedWorld(world);
      setSystemMode("failures"); // edge cases usually tie to failures
    }
  };

  const nextCuriosity = (e) => {
    e.stopPropagation();
    setCuriosityIdx((prev) => (prev + 1) % CURIOSITY_LIST.length);
  };

  return (
    <div style={{ position: "relative", width: "100%", height: 680, border: "1px solid var(--hairline)", borderRadius: 20, overflow: "hidden", background: "var(--bg-2)" }}>
      {/* Title & Mode Controls Overlay (Top-Left) */}
      <div style={{ position: "absolute", top: 20, left: 20, zIndex: 10, display: "flex", flexDirection: "column", gap: 10 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "var(--ink)" }}>Software Universe Map</h2>
          <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>Click any world node to expand its knowledge graph.</p>
        </div>

        {/* Mode Selector pills */}
        <div style={{ display: "flex", background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: 10, padding: 4, width: "fit-content", gap: 4, boxShadow: "var(--shadow)" }}>
          <button 
            onClick={() => setSystemMode("normal")}
            style={{
              padding: "6px 12px", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 12.5, fontWeight: 600,
              background: systemMode === "normal" ? "var(--brand-soft)" : "transparent",
              color: systemMode === "normal" ? "var(--brand-2)" : "var(--ink-2)"
            }}
          >
            🟢 Normal
          </button>
          <button 
            onClick={() => setSystemMode("failures")}
            style={{
              padding: "6px 12px", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 12.5, fontWeight: 600,
              background: systemMode === "failures" ? "var(--pink-soft)" : "transparent",
              color: systemMode === "failures" ? "var(--pink)" : "var(--ink-2)"
            }}
          >
            💥 Disasters
          </button>
          <button 
            onClick={() => setSystemMode("scaling")}
            style={{
              padding: "6px 12px", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 12.5, fontWeight: 600,
              background: systemMode === "scaling" ? "var(--amber-soft)" : "transparent",
              color: systemMode === "scaling" ? "var(--amber)" : "var(--ink-2)"
            }}
          >
            🚀 Scale Test
          </button>
        </div>

        {/* Dynamic Scale Sub-Selector */}
        {systemMode === "scaling" && (
          <div style={{ display: "flex", background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: 10, padding: 4, width: "fit-content", gap: 4, animation: "fadeUp 0.15s ease", boxShadow: "var(--shadow)" }}>
            {["10", "100k", "1M"].map((load) => (
              <button
                key={load}
                onClick={() => setScaleLoad(load)}
                style={{
                  padding: "4px 10px", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 11.5, fontWeight: 700,
                  background: scaleLoad === load ? "var(--brand)" : "transparent",
                  color: scaleLoad === load ? "#fff" : "var(--ink-2)"
                }}
              >
                {load === "10" ? "10 Users" : load === "100k" ? "100k Users" : "1M Users"}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Live Search Bar Overlay (Top-Right) */}
      <div style={{ position: "absolute", top: 20, right: 20, zIndex: 10, width: 260 }}>
        <div style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="🔍 Search tech, worlds..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%", padding: "10px 14px", fontSize: 13, border: "1px solid var(--hairline-2)", borderRadius: 10,
              background: "var(--surface)", color: "var(--ink)", boxShadow: "var(--shadow)", outline: "none"
            }}
          />
          {searchQuery && (
            <div style={{ position: "absolute", top: "100%", right: 0, left: 0, marginTop: 6, background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: 10, boxShadow: "var(--shadow-lg)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
              {getSearchResults().length > 0 ? (
                getSearchResults().map((res) => (
                  <button
                    key={res.id + (res.childId || "")}
                    onClick={() => handleSearchResultClick(res)}
                    style={{
                      padding: "10px 14px", border: "none", background: "none", textAlign: "left", cursor: "pointer",
                      borderBottom: "1px solid var(--hairline)", display: "flex", flexDirection: "column", gap: 2
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{res.label}</span>
                    <span style={{ fontSize: 10.5, color: "var(--muted)" }}>{res.sub} ({res.type})</span>
                  </button>
                ))
              ) : (
                <div style={{ padding: "12px 14px", fontSize: 12.5, color: "var(--muted)", textAlign: "center" }}>No results found</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Curiosity Card Overlay (Bottom-Left) */}
      <div 
        onClick={handleCuriosityTrigger}
        style={{
          position: "absolute", bottom: 20, left: 20, zIndex: 10, width: 320,
          background: "var(--surface)", border: "1.5px solid var(--brand)", borderRadius: 14,
          padding: 16, boxShadow: "var(--shadow-lg)", cursor: "pointer",
          transition: "transform 0.15s ease", display: "flex", flexDirection: "column", gap: 10
        }}
        onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; }}
        onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--brand)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            🧭 Curiosity Challenge
          </span>
          <button 
            onClick={nextCuriosity}
            style={{ background: "var(--bg-2)", border: "none", borderRadius: 6, padding: "2px 8px", fontSize: 10, fontWeight: 700, cursor: "pointer", color: "var(--ink-2)" }}
          >
            Next →
          </button>
        </div>
        <p style={{ fontSize: 13.5, color: "var(--ink)", fontWeight: 600, lineHeight: 1.45, margin: 0 }}>
          "{CURIOSITY_LIST[curiosityIdx].question}"
        </p>
        <div style={{ fontSize: 11.5, color: "var(--brand)", fontWeight: 700, display: "flex", alignItems: "center", gap: 3 }}>
          <span>Inspect systems failure node</span>
          <span>🔍</span>
        </div>
      </div>

      {/* React Flow Canvas */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.25}
        maxZoom={1.6}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="var(--hairline-2)" gap={24} size={1.5} />
        <Controls showInteractive={false} style={{ bottom: 20, right: 20 }} />
      </ReactFlow>

      {/* Side Details Drawer */}
      {selectedWorld && (
        <div 
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            bottom: 20,
            width: 390,
            background: "var(--surface)",
            border: "1px solid var(--hairline)",
            borderRadius: 18,
            boxShadow: "var(--shadow-lg)",
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            animation: "fadeUp 0.25s var(--ease-bounce)"
          }}
        >
          {/* Header */}
          <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--hairline)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--ink)" }}>{selectedWorld.title}</h3>
              <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{selectedWorld.sub}</p>
            </div>
            <button 
              onClick={closeDrawer}
              style={{
                background: "var(--bg-2)",
                border: "none",
                borderRadius: "50%",
                width: 28,
                height: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "var(--ink-2)",
                fontSize: 14,
                fontWeight: "bold"
              }}
            >
              ✕
            </button>
          </div>

          {/* Content (Scrollable) */}
          <div style={{ padding: "20px 24px", flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 20 }}>
            
            {/* Dynamic View Selector */}
            {systemMode === "normal" && (
              <div>
                <h4 style={{ fontSize: 13, textTransform: "uppercase", color: "var(--muted)", letterSpacing: "0.05em", fontWeight: 700, marginBottom: 6 }}>Overview</h4>
                <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.5 }}>{selectedWorld.desc}</p>
              </div>
            )}

            {systemMode === "failures" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ background: "var(--pink-soft)", border: "1.5px solid var(--pop-pink)", borderRadius: 12, padding: 14 }}>
                  <h5 style={{ fontSize: 12.5, color: "var(--pop-pink)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", margin: "0 0 6px 0", display: "flex", alignItems: "center", gap: 4 }}>
                    <span>💥</span> The Disaster (What Breaks)
                  </h5>
                  <p style={{ fontSize: 13.5, color: "var(--ink)", lineHeight: 1.5, margin: 0 }}>{selectedWorld.disaster}</p>
                </div>

                <div style={{ background: "var(--teal-soft)", border: "1.5px solid var(--teal)", borderRadius: 12, padding: 14 }}>
                  <h5 style={{ fontSize: 12.5, color: "var(--teal)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", margin: "0 0 6px 0", display: "flex", alignItems: "center", gap: 4 }}>
                    <span>🛡️</span> The Recovery (Safety Net)
                  </h5>
                  <p style={{ fontSize: 13.5, color: "var(--ink)", lineHeight: 1.5, margin: 0 }}>{selectedWorld.recovery}</p>
                </div>
              </div>
            )}

            {systemMode === "scaling" && (
              <div style={{ background: "var(--surface-warm)", border: "1.5px solid var(--hairline-2)", borderRadius: 12, padding: 14 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <h5 style={{ fontSize: 12.5, color: "var(--muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", margin: 0 }}>
                    📊 Scaling Bottlenecks
                  </h5>
                  <span style={{ fontSize: 11, fontWeight: 700, color: scaleLoad === "1M" ? "var(--pop-yellow)" : "var(--pop-lime)", background: scaleLoad === "1M" ? "rgba(255, 178, 62, 0.1)" : "rgba(47, 191, 113, 0.1)", padding: "2px 8px", borderRadius: 99 }}>
                    {scaleLoad} Users
                  </span>
                </div>
                <p style={{ fontSize: 13.5, color: "var(--ink)", lineHeight: 1.5, margin: 0 }}>{selectedWorld.scalingStats[scaleLoad]}</p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div style={{ display: "flex", gap: 12 }}>
              <Link href={["order", "payment", "delivery", "loyalty"].includes(selectedWorld.id) ? `/worlds/${selectedWorld.id}` : `/codex/${selectedWorld.slug}`} style={{ flex: 1 }}>
                <div className="btn btn-primary" style={{ width: "100%", justifyContent: "center", fontSize: 13.5, padding: "10px 14px", borderRadius: 10 }}>
                  📖 Read Codex
                </div>
              </Link>
              {selectedWorld.simSlug ? (
                <Link href={`/simulator/${selectedWorld.simSlug}`} style={{ flex: 1 }}>
                  <div className="btn btn-ghost" style={{ width: "100%", justifyContent: "center", fontSize: 13.5, padding: "10px 14px", borderRadius: 10, borderColor: "var(--brand)" }}>
                    🎮 Play Simulator
                  </div>
                </Link>
              ) : (
                <div style={{ flex: 1, cursor: "not-allowed" }}>
                  <div className="btn btn-ghost" style={{ width: "100%", justifyContent: "center", fontSize: 13.5, padding: "10px 14px", borderRadius: 10, borderColor: "var(--hairline)", color: "var(--faint)", background: "var(--surface-warm)" }}>
                    🚫 No Simulator
                  </div>
                </div>
              )}
            </div>

            {/* Tradeoffs Card */}
            {systemMode !== "failures" && (
              <div style={{ background: "var(--blue-soft)", border: "1px solid var(--hairline-2)", borderRadius: 12, padding: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--blue)", fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  <span>⚖️</span> Tradeoffs
                </div>
                <p style={{ fontSize: 13, color: "var(--ink-2)", marginTop: 6, lineHeight: 1.45, margin: 0 }}>{selectedWorld.tradeoffs || "No tradeoffs documented yet."}</p>
              </div>
            )}

            {/* Code Anchors */}
            {selectedWorld.anchors && selectedWorld.anchors.length > 0 && (
              <div>
                <h4 style={{ fontSize: 13, textTransform: "uppercase", color: "var(--muted)", letterSpacing: "0.05em", fontWeight: 700, marginBottom: 8 }}>Code Anchors</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {selectedWorld.anchors.map((anchor, idx) => (
                    <code 
                      key={idx} 
                      style={{ 
                        display: "block", 
                        background: "var(--bg-2)", 
                        border: "1px solid var(--hairline)", 
                        borderRadius: 6, 
                        padding: "6px 10px", 
                        fontSize: 11, 
                        fontFamily: "JetBrains Mono, monospace", 
                        color: "var(--brand-2)", 
                        overflowX: "auto",
                        whiteSpace: "pre"
                      }}
                    >
                      {anchor.split("/").pop()}
                    </code>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
