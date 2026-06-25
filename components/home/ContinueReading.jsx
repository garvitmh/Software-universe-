"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getRecents, getReadCount } from "@/lib/learnerStore";

// Shows the learner's most recent Codex entries on the landing. Renders nothing
// for a first-time visitor (no history, no fake data).
export default function ContinueReading() {
  const [recents, setRecents] = useState([]);
  const [count, setCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const load = () => {
      setRecents(getRecents().slice(0, 4));
      setCount(getReadCount());
    };
    load();
    window.addEventListener("su-progress-change", load);
    return () => window.removeEventListener("su-progress-change", load);
  }, []);

  if (!mounted || recents.length === 0) return null;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
      <div style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "14px 0", marginTop: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10, gap: 16 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 10.5, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--primary)" }}>
            Continue reading
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: ".06em", color: "var(--ink-3)", whiteSpace: "nowrap" }}>
            {count} {count === 1 ? "entry" : "entries"} read
          </span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 22px" }}>
          {recents.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              style={{ fontFamily: "var(--font-display)", fontSize: 17, color: "var(--ink)", borderBottom: "1px solid var(--primary)" }}
            >
              {r.title} →
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
