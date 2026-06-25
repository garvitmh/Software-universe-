"use client";

import { useMemo, useState } from "react";
import { GLOSSARY } from "@/lib/glossary";

const ALL = Object.entries(GLOSSARY)
  .map(([id, v]) => ({ id, ...v }))
  .sort((a, b) => a.term.localeCompare(b.term, "en", { sensitivity: "base" }));

export default function GlossaryPage() {
  const [q, setQ] = useState("");

  const groups = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const filtered = needle
      ? ALL.filter((e) => e.term.toLowerCase().includes(needle) || e.def.toLowerCase().includes(needle))
      : ALL;
    const map = new Map();
    for (const e of filtered) {
      const letter = /[a-z]/i.test(e.term[0]) ? e.term[0].toUpperCase() : "#";
      if (!map.has(letter)) map.set(letter, []);
      map.get(letter).push(e);
    }
    return [...map.entries()];
  }, [q]);

  const count = groups.reduce((n, [, items]) => n + items.length, 0);

  return (
    <div className="ed-rise" style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 32px 80px" }}>
      {/* Header */}
      <div style={{ borderBottom: "2px solid var(--ink)", paddingBottom: 18, marginBottom: 22 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 10.5, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 12 }}>
          Reference · The Lexicon
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 52, letterSpacing: "-.02em", margin: "0 0 10px" }}>The Glossary</h1>
        <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--ink-2)", maxWidth: 620, margin: 0 }}>
          Every term used across the field guide, in plain language. No jargon left unexplained.
        </p>
      </div>

      {/* Filter */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 30, flexWrap: "wrap" }}>
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter terms…"
          style={{
            flex: 1,
            minWidth: 240,
            border: "1px solid var(--border-2)",
            background: "var(--surface)",
            borderRadius: 6,
            padding: "11px 14px",
            outline: "none",
            color: "var(--ink)",
            fontFamily: "var(--font-body)",
            fontSize: 16,
          }}
        />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".06em", color: "var(--ink-3)", whiteSpace: "nowrap" }}>
          {count} {count === 1 ? "term" : "terms"}
        </span>
      </div>

      {count === 0 && (
        <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 20, color: "var(--ink-3)" }}>
          Nothing matches “{q}”. Try the Professor — press ⌘/Ctrl K.
        </p>
      )}

      {/* Groups */}
      {groups.map(([letter, items]) => (
        <section key={letter} style={{ display: "grid", gridTemplateColumns: "72px 1fr", gap: 8, borderTop: "1px solid var(--border)", paddingTop: 18, marginBottom: 26 }} className="ed-two">
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 40, color: "var(--ink-3)", lineHeight: 1 }}>{letter}</div>
          <div>
            {items.map((e) => (
              <div key={e.id} style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 20, padding: "13px 0", borderBottom: "1px solid var(--border)" }} className="ed-glossary-row">
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 18, color: "var(--ink)" }}>{e.term}</div>
                <div style={{ fontSize: 16, lineHeight: 1.6, color: "var(--ink-2)" }}>
                  {e.def}
                  {e.more && <span style={{ display: "block", marginTop: 6, color: "var(--ink-3)", fontSize: 15 }}>{e.more}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
