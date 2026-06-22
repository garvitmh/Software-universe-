// components/planet-scale/CDNPanel.jsx

import React from "react";
import { usePlanetScale } from "./usePlanetScale";

export default function CDNPanel() {
  const { cdnEnabled, toggleCDN, globalMetrics, disasters } = usePlanetScale();

  const isCacheCollapsed = disasters.includes("redis_cache_collapse");

  return (
    <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <span className="eyebrow" style={{ color: "var(--brand)" }}>Edge Network</span>
          <h3 style={{ margin: "2px 0 0 0" }}>Global Content Delivery (CDN)</h3>
        </div>
        
        {/* Toggle Switch */}
        <button
          onClick={toggleCDN}
          disabled={isCacheCollapsed}
          style={{
            padding: "6px 12px",
            borderRadius: "20px",
            backgroundColor: cdnEnabled && !isCacheCollapsed ? "var(--brand)" : "var(--hairline-2)",
            color: cdnEnabled && !isCacheCollapsed ? "#fff" : "var(--muted)",
            border: "none",
            fontSize: "11px",
            fontWeight: "700",
            cursor: isCacheCollapsed ? "not-allowed" : "pointer",
            transition: "all 0.2s ease"
          }}
        >
          {isCacheCollapsed ? "CRASHED" : cdnEnabled ? "ENABLED" : "DISABLED"}
        </button>
      </div>

      <p style={{ margin: 0, fontSize: "12px", color: "var(--muted)" }}>
        Toggling the CDN routes assets and static reads through edge caches close to users, preventing origin overload.
      </p>

      {/* Grid of stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <div style={{
          padding: "10px",
          borderRadius: "8px",
          backgroundColor: "var(--bg-2)",
          border: "1px solid var(--hairline-2)"
        }}>
          <span style={{ fontSize: "10px", color: "var(--muted)", display: "block" }}>Cache Hit Ratio</span>
          <span style={{
            fontSize: "18px",
            fontWeight: "700",
            color: globalMetrics.cacheHitRatio > 70 ? "var(--teal)" : "var(--pink)"
          }}>
            {globalMetrics.cacheHitRatio}%
          </span>
        </div>

        <div style={{
          padding: "10px",
          borderRadius: "8px",
          backgroundColor: "var(--bg-2)",
          border: "1px solid var(--hairline-2)"
        }}>
          <span style={{ fontSize: "10px", color: "var(--muted)", display: "block" }}>Origin DB Pressure</span>
          <span style={{
            fontSize: "18px",
            fontWeight: "700",
            color: (!cdnEnabled || isCacheCollapsed) ? "var(--pink)" : "var(--ink)"
          }}>
            {(!cdnEnabled || isCacheCollapsed) ? "100% Slammed" : "15% (Offloaded)"}
          </span>
        </div>
      </div>

      {isCacheCollapsed && (
        <div style={{
          padding: "10px",
          borderRadius: "8px",
          backgroundColor: "var(--pink-soft)",
          border: "1px solid var(--pink)",
          fontSize: "11px",
          color: "var(--pink)"
        }}>
          ⚠️ <strong>Cache Stampede:</strong> The Redis cache tier has collapsed. All edge node reads are bypassing cache and slamming the primary databases directly, causing a massive latency spike.
        </div>
      )}
    </div>
  );
}
