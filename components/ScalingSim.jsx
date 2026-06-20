"use client";

import { useState } from "react";

const LEVELS = [
  { label: "10", needs: [] },
  { label: "100", needs: [] },
  { label: "1,000", needs: ["cache"] },
  { label: "10,000", needs: ["cache", "scale"] },
  { label: "100,000", needs: ["cache", "scale", "replicas", "queue"] },
  { label: "1,000,000", needs: ["cache", "scale", "replicas", "queue", "cdn"] },
];

const UPGRADES = [
  { key: "cache", name: "Cache", sub: "compute the menu once, serve many" },
  { key: "scale", name: "Load balancer + copies", sub: "many stateless backends behind one door" },
  { key: "replicas", name: "Read replicas", sub: "copies of the DB for all the reads" },
  { key: "queue", name: "Queues", sub: "push slow work off the request path" },
  { key: "cdn", name: "CDN", sub: "images served from near the customer" },
];

export default function ScalingSim() {
  const [lvl, setLvl] = useState(0);
  const [on, setOn] = useState({ cache: false, scale: false, replicas: false, queue: false, cdn: false });

  const level = LEVELS[lvl];
  const missing = level.needs.filter((k) => !on[k]);
  const status =
    missing.length === 0 ? "healthy" : missing.length === 1 ? "slow" : "overloaded";

  const baseLatency = 40;
  const latency = baseLatency + missing.length * missing.length * 120 + lvl * 8;

  const statusMap = {
    healthy: { color: "var(--teal)", bg: "var(--teal-soft)", label: "Healthy", note: "Snappy. Every order sails through." },
    slow: { color: "var(--amber)", bg: "var(--amber-soft)", label: "Slowing down", note: "Customers feel the lag. One thing is missing." },
    overloaded: { color: "var(--brand-2)", bg: "#FBE0D2", label: "Falling over", note: "Requests time out. Orders are being lost." },
  };
  const s = statusMap[status];

  const copies = on.scale ? 6 : 1;

  const toggle = (k) => setOn((p) => ({ ...p, [k]: !p[k] }));

  const nextHint = missing[0];
  const nextUpgrade = UPGRADES.find((u) => u.key === nextHint);

  return (
    <div>
      {/* Users slider */}
      <div style={{ marginBottom: 8, display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <span className="eyebrow">Traffic</span>
        <span style={{ fontFamily: "Fraunces", fontSize: 30, fontWeight: 600, color: "var(--ink)" }}>
          {level.label} <span style={{ fontSize: 15, color: "var(--faint)", fontFamily: "Inter" }}>users</span>
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={LEVELS.length - 1}
        step={1}
        value={lvl}
        onChange={(e) => setLvl(Number(e.target.value))}
        style={{ width: "100%", accentColor: "var(--brand)", height: 28, cursor: "pointer" }}
        aria-label="number of users"
      />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--faint)", marginTop: -2 }}>
        {LEVELS.map((l) => <span key={l.label}>{l.label}</span>)}
      </div>

      {/* Status panel */}
      <div style={{ marginTop: 22, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ background: s.bg, border: `1px solid var(--hairline)`, borderRadius: 14, padding: "16px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 10, height: 10, borderRadius: 999, background: s.color }} />
            <span style={{ fontWeight: 600, color: s.color, fontSize: 15 }}>{s.label}</span>
          </div>
          <p style={{ fontSize: 13, color: "var(--ink-2)", marginTop: 6 }}>{s.note}</p>
        </div>
        <div style={{ background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: 14, padding: "16px 18px" }}>
          <div style={{ fontSize: 12, color: "var(--faint)", textTransform: "uppercase", letterSpacing: ".05em" }}>Response time</div>
          <div style={{ fontFamily: "Fraunces", fontSize: 26, fontWeight: 600, color: s.color }}>
            {latency >= 2000 ? "timeout" : `${latency} ms`}
          </div>
        </div>
      </div>

      {/* Backend copies visual */}
      <div style={{ marginTop: 16, background: "var(--bg-2)", border: "1px solid var(--hairline)", borderRadius: 14, padding: "14px 16px" }}>
        <div style={{ fontSize: 12, color: "var(--faint)", marginBottom: 10 }}>
          {on.scale ? `${copies} backend copies behind a load balancer` : "1 backend (no load balancer)"}
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {Array.from({ length: copies }).map((_, i) => (
            <span key={i} style={{ width: 30, height: 30, borderRadius: 8, background: status === "overloaded" ? "#FBE0D2" : "var(--brand-soft)", border: "1px solid var(--hairline)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand-2)" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="6" rx="1" /><rect x="3" y="14" width="18" height="6" rx="1" /></svg>
            </span>
          ))}
        </div>
      </div>

      {/* Hint */}
      {nextUpgrade ? (
        <div style={{ marginTop: 16, fontSize: 13.5, color: "var(--ink-2)", padding: "10px 14px", background: "var(--brand-soft)", border: "1px solid #F3C9A8", borderRadius: 12 }}>
          → To handle <strong>{level.label}</strong> users, add: <strong>{nextUpgrade.name}</strong>.
        </div>
      ) : (
        <div style={{ marginTop: 16, fontSize: 13.5, color: "var(--teal)", padding: "10px 14px", background: "var(--teal-soft)", border: "1px solid var(--hairline)", borderRadius: 12 }}>
          ✓ Provisioned correctly for {level.label} users. Drag higher to find the next limit.
        </div>
      )}

      {/* Upgrade toggles */}
      <div style={{ marginTop: 20 }}>
        <span className="eyebrow">Infrastructure — switch on what you need</span>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
          {UPGRADES.map((u) => {
            const active = on[u.key];
            const required = level.needs.includes(u.key);
            return (
              <button
                key={u.key}
                onClick={() => toggle(u.key)}
                style={{
                  textAlign: "left",
                  background: active ? "var(--teal-soft)" : "var(--surface)",
                  border: `1px solid ${active ? "var(--teal)" : required ? "var(--brand)" : "var(--hairline)"}`,
                  borderRadius: 12,
                  padding: "11px 13px",
                  cursor: "pointer",
                  transition: "all .15s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                  <span style={{ fontWeight: 600, fontSize: 13.5, color: active ? "var(--teal)" : "var(--ink)" }}>{u.name}</span>
                  <span style={{ fontSize: 11, color: active ? "var(--teal)" : required ? "var(--brand-2)" : "var(--faint)" }}>
                    {active ? "on" : required ? "needed" : "off"}
                  </span>
                </div>
                <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 3 }}>{u.sub}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
