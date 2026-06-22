"use client";

import React, { useState } from "react";

export default function ImageLayer() {
  const [modifyCode, setModifyCode] = useState(false);
  const [modifyDeps, setModifyDeps] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildTime, setBuildTime] = useState(null);
  const [buildLog, setBuildLog] = useState([]);

  // States: 'idle' | 'building' | 'done'
  const [buildState, setBuildState] = useState("idle");

  // Layers metadata
  const initialLayers = [
    { num: 4, cmd: "COPY src/ .", size: "12 MB", desc: "Copies source code files. Changes frequently.", status: "cached" },
    { num: 3, cmd: "RUN npm install", size: "295 MB", desc: "Installs NPM dependencies. Slow to run.", status: "cached" },
    { num: 2, cmd: "WORKDIR /usr/src/app", size: "0 B", desc: "Sets working directory in container filesystem.", status: "cached" },
    { num: 1, cmd: "FROM node:18-alpine", size: "116 MB", desc: "Minimal Linux OS with Node.js pre-installed.", status: "cached" }
  ];

  const [layers, setLayers] = useState(initialLayers);

  const startBuild = () => {
    setIsBuilding(true);
    setBuildState("building");
    setBuildTime(null);
    setBuildLog(["[1/4] Resolving base image...", "[2/4] Directory setup ready."]);

    let stepDelay = 800;
    let targetLayers = [...initialLayers];

    // Compute layer outcomes based on checks
    setTimeout(() => {
      // Base layers are always cached
      targetLayers[3].status = "cached";
      targetLayers[2].status = "cached";

      if (modifyDeps) {
        // Dependency modification breaks cache at layer 3 and downstream layer 4
        targetLayers[1].status = "rebuilt";
        targetLayers[0].status = "rebuilt";
        setBuildLog(prev => [...prev, "⚠️ package.json changed! Cache invalidated at Layer 3.", "[3/4] RUN npm install &rarr; Installing dependencies (295 MB)..."]);
        
        setTimeout(() => {
          setBuildLog(prev => [...prev, "[4/4] COPY src/ &rarr; Copying source code (12 MB)...", "Successfully compiled image: burger-farm:latest"]);
          setLayers(targetLayers);
          setIsBuilding(false);
          setBuildState("done");
          setBuildTime("8.4 seconds");
        }, 1800);
      } else if (modifyCode) {
        // Source modification only breaks cache at layer 4
        targetLayers[1].status = "cached";
        targetLayers[0].status = "rebuilt";
        setBuildLog(prev => [...prev, "✓ Layer 3 cache hit. Reusing cached node_modules.", "[4/4] COPY src/ &rarr; Copying modified source files (12 MB)...", "Successfully compiled image: burger-farm:latest"]);
        
        setTimeout(() => {
          setLayers(targetLayers);
          setIsBuilding(false);
          setBuildState("done");
          setBuildTime("2.1 seconds");
        }, 1000);
      } else {
        // No changes: fully cached!
        targetLayers[1].status = "cached";
        targetLayers[0].status = "cached";
        setBuildLog(prev => [...prev, "✓ Layer 3 cache hit.", "✓ Layer 4 cache hit.", "⚡ Entire image matches cache. Skipping build steps.", "Successfully compiled image: burger-farm:latest"]);
        
        setTimeout(() => {
          setLayers(targetLayers);
          setIsBuilding(false);
          setBuildState("done");
          setBuildTime("0.15 seconds");
        }, 400);
      }
    }, stepDelay);
  };

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--hairline)",
        borderRadius: 16,
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        boxShadow: "var(--shadow)"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 20 }}>📦</span>
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, fontFamily: "monospace" }}>Docker Image Layering</h3>
      </div>

      <p style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.45, margin: 0 }}>
        Docker images are built step-by-step as immutable layers. Changing a file invalidates the cache for that layer and all subsequent layers above it.
      </p>

      {/* Checklist inputs */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, background: "var(--bg-2)", padding: 12, borderRadius: 10, border: "1px solid var(--hairline-2)" }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>Simulate Code Modification</span>
        
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={modifyCode}
            onChange={(e) => setModifyCode(e.target.checked)}
            disabled={isBuilding}
          />
          Modify app source files (e.g. index.js)
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={modifyDeps}
            onChange={(e) => setModifyDeps(e.target.checked)}
            disabled={isBuilding}
          />
          Install new NPM library (modifies package.json)
        </label>
      </div>

      {/* Build Button */}
      <button
        onClick={startBuild}
        disabled={isBuilding}
        style={{
          background: isBuilding ? "var(--faint)" : "var(--brand)",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          padding: "10px 14px",
          fontSize: 12,
          fontWeight: 700,
          cursor: isBuilding ? "not-allowed" : "pointer",
          boxShadow: isBuilding ? "none" : "0 4px 12px rgba(99, 102, 241, 0.2)",
          transition: "all 0.15s",
          textAlign: "center"
        }}
      >
        {isBuilding ? "🔨 Packaging Layer Files..." : "⚙️ Run Docker Build"}
      </button>

      {/* Layer stack viz */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
        <span style={{ fontSize: 10.5, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Docker Image Layers Stack
        </span>

        <div style={{ display: "flex", flexDirection: "column-reverse", gap: 8 }}>
          {layers.map((l) => {
            const isRebuilt = l.status === "rebuilt" && buildState === "done";
            const isCacheHit = l.status === "cached" && buildState === "done";
            
            return (
              <div
                key={l.num}
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: "var(--bg-2)",
                  border: `1.5px solid ${
                    isRebuilt
                      ? "#FAB387"
                      : isCacheHit
                      ? "rgba(166, 227, 161, 0.4)"
                      : "var(--hairline-2)"
                  }`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  opacity: isBuilding ? 0.6 : 1,
                  transition: "all 0.25s"
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: "75%" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "monospace", color: "var(--ink)" }}>
                    Step {l.num}: {l.cmd}
                  </span>
                  <span style={{ fontSize: 10, color: "var(--ink-2)", lineHeight: 1.3 }}>
                    {l.desc}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                  <span style={{ fontSize: 9.5, fontFamily: "monospace", color: "var(--muted)" }}>{l.size}</span>
                  {buildState === "done" && (
                    <span
                      style={{
                        fontSize: 8.5,
                        fontWeight: 800,
                        padding: "1px 5px",
                        borderRadius: 4,
                        background: isCacheHit ? "rgba(166,227,161,0.1)" : "rgba(250,179,135,0.1)",
                        color: isCacheHit ? "#A6E3A1" : "#FAB387"
                      }}
                    >
                      {isCacheHit ? "USING CACHE" : "REBUILT"}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Build log console */}
      {(buildState !== "idle" || buildTime) && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, borderTop: "1px solid var(--hairline)", paddingTop: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 10.5, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>Build Logs</span>
            {buildTime && (
              <span style={{ fontSize: 10.5, fontFamily: "monospace", color: "#A6E3A1", fontWeight: 700 }}>
                Build Time: {buildTime}
              </span>
            )}
          </div>
          <div
            style={{
              background: "#11111B",
              borderRadius: 8,
              padding: 10,
              maxHeight: 110,
              overflowY: "auto",
              fontFamily: "monospace",
              fontSize: 10.5,
              color: "#CDD6F4",
              display: "flex",
              flexDirection: "column",
              gap: 4
            }}
          >
            {buildLog.map((log, idx) => (
              <div key={idx} dangerouslySetInnerHTML={{ __html: log }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
