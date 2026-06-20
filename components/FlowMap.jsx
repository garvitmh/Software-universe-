"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const NODES = [
  { id: "app", label: "The app", sub: "what you tap", x: 110, y: 110, tint: "var(--blue-soft)", ink: "var(--blue)", href: "/codex/foundations", icon: <PhoneIcon /> },
  { id: "backend", label: "The backend", sub: "the brain", x: 460, y: 110, tint: "var(--amber-soft)", ink: "var(--amber)", href: "/codex/foundations", icon: <ServerIcon /> },
  { id: "database", label: "The database", sub: "the memory", x: 810, y: 110, tint: "var(--teal-soft)", ink: "var(--teal)", href: "/codex/foundations", icon: <DbIcon /> },
  { id: "admin", label: "The admin", sub: "the controls", x: 460, y: 250, tint: "var(--purple-soft)", ink: "var(--purple)", href: "/codex/foundations", icon: <SlidersIcon /> },
];

const W = 150, H = 90;

export default function FlowMap() {
  return (
    <div style={{ overflowX: "auto" }}>
      <div style={{ position: "relative", width: 920, height: 330, margin: "0 auto" }}>
        <svg width="920" height="330" style={{ position: "absolute", inset: 0 }}>
          <Line x1={185} y1={110} x2={385} y2={110} />
          <Line x1={535} y1={110} x2={735} y2={110} />
          <Line x1={460} y1={205} x2={460} y2={157} />
          <text x={285} y={100} textAnchor="middle" fontSize="11.5" fill="var(--faint)">asks</text>
          <text x={635} y={100} textAnchor="middle" fontSize="11.5" fill="var(--faint)">reads / writes</text>
          <text x={478} y={185} fontSize="11.5" fill="var(--faint)">controls</text>
        </svg>

        <motion.div
          aria-hidden
          style={{
            position: "absolute",
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: "var(--brand)",
            boxShadow: "0 0 0 5px rgba(232,86,10,.16), 0 0 14px rgba(232,86,10,.5)",
            top: 103,
          }}
          animate={{ left: [103, 453, 803, 803, 453, 103], opacity: [0, 1, 1, 1, 1, 0] }}
          transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut", times: [0, 0.28, 0.5, 0.6, 0.82, 1] }}
        />

        {NODES.map((n, i) => (
          <Link key={n.id} href={n.href}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.06 * i, duration: 0.5 }}
              whileHover={{ y: -3 }}
              style={{
                position: "absolute",
                left: n.x - W / 2,
                top: n.y - H / 2,
                width: W,
                height: H,
                background: "var(--surface)",
                border: "1px solid var(--hairline)",
                borderRadius: 16,
                boxShadow: "var(--shadow)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 3,
                cursor: "pointer",
              }}
            >
              <span style={{ width: 34, height: 34, borderRadius: 10, background: n.tint, color: n.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {n.icon}
              </span>
              <span style={{ fontSize: 13.5, fontWeight: 600 }}>{n.label}</span>
              <span style={{ fontSize: 11.5, color: "var(--faint)" }}>{n.sub}</span>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Line({ x1, y1, x2, y2 }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--hairline-2)" strokeWidth="2" strokeDasharray="5 6" strokeLinecap="round" />;
}

function PhoneIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="7" y="2" width="10" height="20" rx="2.5" /><path d="M11 18h2" /></svg>;
}
function ServerIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="7" rx="2" /><rect x="3" y="13" width="18" height="7" rx="2" /><path d="M7 7.5h.01M7 16.5h.01" /></svg>;
}
function DbIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" /><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" /></svg>;
}
function SlidersIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 8h10M18 8h2M4 16h2M10 16h10" /><circle cx="16" cy="8" r="2.2" /><circle cx="8" cy="16" r="2.2" /></svg>;
}
