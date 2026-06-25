"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getReadHrefs } from "@/lib/learnerStore";

// Renders a path's steps as a numbered "rope" with live progress, ticking off
// each step the learner has already visited (from localStorage).
export default function PathSteps({ steps }) {
  const [done, setDone] = useState(() => new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const load = () => setDone(new Set(getReadHrefs()));
    load();
    window.addEventListener("su-progress-change", load);
    return () => window.removeEventListener("su-progress-change", load);
  }, []);

  const doneCount = mounted ? steps.filter((s) => done.has(s.href)).length : 0;
  const pct = Math.round((doneCount / steps.length) * 100);

  return (
    <div>
      {/* Progress */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "0 0 22px" }}>
        <div style={{ flex: 1, height: 4, background: "var(--surface-2)", borderRadius: 99, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: "var(--primary)", transition: "width .3s ease" }} />
        </div>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".06em", color: "var(--ink-3)", whiteSpace: "nowrap" }}>
          {doneCount} / {steps.length} read
        </span>
      </div>

      {mounted && doneCount === steps.length && (
        <div
          style={{
            border: "1px solid var(--teal)",
            background: "color-mix(in srgb, var(--teal) 7%, transparent)",
            borderRadius: 6,
            padding: "12px 16px",
            marginBottom: 18,
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: 18,
            color: "var(--teal)",
          }}
        >
          Path complete — every stop read. ✓
        </div>
      )}

      {/* Rope */}
      <div style={{ borderTop: "1px solid var(--border)" }}>
        {steps.map((s, i) => {
          const isDone = mounted && done.has(s.href);
          return (
            <Link
              key={s.href}
              href={s.href}
              className="ed-domain"
              style={{ display: "grid", gridTemplateColumns: "40px 1fr", gap: 16, padding: "18px 10px", borderBottom: "1px solid var(--border)", alignItems: "start" }}
            >
              <span
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: `1px solid ${isDone ? "var(--primary)" : "var(--border-2)"}`,
                  background: isDone ? "var(--primary)" : "transparent",
                  color: isDone ? "var(--bg)" : "var(--ink-3)",
                  fontFamily: "var(--font-mono)",
                  fontWeight: 600,
                  fontSize: 12,
                }}
              >
                {isDone ? "✓" : i + 1}
              </span>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 19, color: isDone ? "var(--ink-3)" : "var(--ink)", marginBottom: 3 }}>
                  {s.title}
                </div>
                <div style={{ fontSize: 14.5, lineHeight: 1.5, color: "var(--ink-2)" }}>{s.note}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
