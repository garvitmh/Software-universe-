"use client";

import { useState } from "react";

const CLASSES = [
  { key: "1", label: "O(1)", color: "var(--ink-3)", f: () => 1, note: "Constant — it doesn't care how big n is." },
  { key: "logn", label: "O(log n)", color: "var(--teal)", f: (n) => Math.log2(n) + 1, note: "Halve the problem each step — binary search." },
  { key: "n", label: "O(n)", color: "var(--primary)", f: (n) => n, note: "Touch each item once — a single loop." },
  { key: "nlogn", label: "O(n log n)", color: "var(--purple)", f: (n) => n * (Math.log2(n) + 1), note: "The best general sorts — merge & quick." },
  { key: "n2", label: "O(n²)", color: "var(--bronze)", f: (n) => n * n, note: "Nested loops — every pair of items." },
  { key: "2n", label: "O(2ⁿ)", color: "var(--accent)", f: (n) => Math.pow(2, n), note: "Try every subset — it explodes." },
];

const N = 40;
const W = 720;
const H = 320;
const padL = 52;
const padR = 14;
const padT = 16;
const padB = 28;
const chartW = W - padL - padR;
const chartH = H - padT - padB;
const logMax = Math.log10(Math.pow(2, N) + 1);

const xAt = (i) => padL + ((i - 1) / (N - 1)) * chartW;
const yAt = (ops) => padT + chartH - (Math.log10(ops + 1) / logMax) * chartH;
const linePts = (f) => {
  const pts = [];
  for (let i = 1; i <= N; i++) pts.push(`${xAt(i).toFixed(1)},${yAt(f(i)).toFixed(1)}`);
  return pts.join(" ");
};
const fmt = (v) => (v >= 1e6 ? v.toExponential(1) : Math.round(v).toLocaleString());

export default function ComplexityChart() {
  const [n, setN] = useState(16);

  // log-scale horizontal gridlines at powers of ten
  const decades = [];
  for (let p = 0; Math.pow(10, p) <= Math.pow(2, N); p += 2) decades.push(Math.pow(10, p));

  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
      <div style={{ padding: "20px 22px", background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 6 }}>
          <label style={{ fontFamily: "var(--font-display)", fontSize: 17 }}>
            Input size{" "}
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--primary)" }}>n = {n}</span>
          </label>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: ".06em", color: "var(--ink-3)" }}>vertical axis is logarithmic</span>
        </div>
        <input type="range" min={2} max={N} value={n} onChange={(e) => setN(+e.target.value)} style={{ width: "100%" }} />
      </div>

      <div style={{ padding: 18, background: "var(--surface-2)" }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6 }}>
          {/* gridlines */}
          {decades.map((d) => (
            <g key={d}>
              <line x1={padL} y1={yAt(d)} x2={W - padR} y2={yAt(d)} stroke="var(--border)" strokeWidth="1" strokeDasharray="2 4" />
              <text x={padL - 8} y={yAt(d) + 3} textAnchor="end" fontFamily="var(--font-mono)" fontSize="9" fill="var(--ink-3)">
                {d >= 1e6 ? d.toExponential(0) : d.toLocaleString()}
              </text>
            </g>
          ))}
          {/* marker at n */}
          <line x1={xAt(n)} y1={padT} x2={xAt(n)} y2={padT + chartH} stroke="var(--ink-3)" strokeWidth="1" strokeDasharray="3 3" />
          {/* curves */}
          {CLASSES.map((c) => (
            <polyline key={c.key} points={linePts(c.f)} fill="none" stroke={c.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          ))}
          {/* dots at n */}
          {CLASSES.map((c) => {
            const v = c.f(n);
            if (v > Math.pow(2, N)) return null;
            return <circle key={c.key} cx={xAt(n)} cy={yAt(v)} r="3" fill={c.color} />;
          })}
          <text x={padL} y={H - 8} fontFamily="var(--font-mono)" fontSize="9" fill="var(--ink-3)">n = 1</text>
          <text x={W - padR} y={H - 8} textAnchor="end" fontFamily="var(--font-mono)" fontSize="9" fill="var(--ink-3)">n = {N}</text>
        </svg>

        {/* readout */}
        <div style={{ marginTop: 16, border: "1px solid var(--border)", borderRadius: 6, overflow: "hidden", background: "var(--surface)" }}>
          {CLASSES.map((c, i) => (
            <div key={c.key} style={{ display: "grid", gridTemplateColumns: "92px 1fr auto", gap: 14, alignItems: "center", padding: "10px 14px", borderBottom: i < CLASSES.length - 1 ? "1px solid var(--border)" : "none" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 13, color: c.color }}>
                <span style={{ width: 10, height: 10, background: c.color, borderRadius: 2 }} />
                {c.label}
              </span>
              <span style={{ fontSize: 13.5, color: "var(--ink-2)" }}>{c.note}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--ink)", whiteSpace: "nowrap" }}>
                {fmt(c.f(n))} <span style={{ color: "var(--ink-3)" }}>steps</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
