import Link from "next/link";
import { DSA_PATTERNS, problemsByPattern, DSA_STATS } from "@/lib/dsa";

export const metadata = {
  title: "DSA Lab — solve by pattern, in Java · Software Universe",
  description: "Learn data structures & algorithms by recognising the pattern and deriving the optimal from scratch — every problem worked in Java.",
};

const DIFF = { Easy: "var(--teal)", Medium: "var(--bronze)", Hard: "var(--accent)" };
const label = { fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ink-3)" };

export default function DsaLab() {
  return (
    <div className="ed-rise" style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 32px 80px" }}>
      <div style={{ borderBottom: "2px solid var(--ink)", paddingBottom: 18, marginBottom: 28 }}>
        <div style={{ ...label, fontSize: 10.5, letterSpacing: ".16em", marginBottom: 12 }}>Practice · The DSA Lab</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 52, letterSpacing: "-.02em", margin: "0 0 10px" }}>
          Solve by pattern, not by memory.
        </h1>
        <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--ink-2)", maxWidth: 660, margin: 0 }}>
          The trap is memorising 250 problems. The skill is seeing that a new problem is really one of ~18 shapes you
          already know — and being able to <em>derive</em> the optimal from scratch. Every problem here teaches the
          thinking (not just the answer), brute-force → optimal, worked in <strong style={{ color: "var(--ink)" }}>Java</strong>.
        </p>
        <div style={{ display: "flex", gap: 20, marginTop: 16, fontFamily: "var(--font-mono)", fontSize: 11.5, letterSpacing: ".04em", color: "var(--ink-3)" }}>
          <span><span style={{ color: "var(--primary)", fontWeight: 600 }}>{DSA_STATS.problems}</span> problems</span>
          <span><span style={{ color: "var(--primary)", fontWeight: 600 }}>{DSA_STATS.patterns}</span> patterns</span>
          <span>building toward {DSA_STATS.target} (NeetCode)</span>
        </div>
      </div>

      {DSA_PATTERNS.map((pat, idx) => {
        const probs = problemsByPattern(pat.id);
        return (
          <section key={pat.id} style={{ padding: "26px 0", borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, marginBottom: 8 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 26, letterSpacing: "-.01em" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 13, color: "var(--ink-3)", marginRight: 12 }}>{String(idx + 1).padStart(2, "0")}</span>
                {pat.name}
              </h2>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)", whiteSpace: "nowrap" }}>
                {probs.length} {probs.length === 1 ? "problem" : "problems"}
              </span>
            </div>

            <p style={{ fontSize: 15.5, lineHeight: 1.6, color: "var(--ink-2)", margin: "0 0 12px", maxWidth: 820 }}>{pat.idea}</p>

            <div style={{ marginBottom: probs.length ? 14 : 0 }}>
              <div style={{ ...label, color: "var(--bronze)", marginBottom: 6 }}>Recognise it</div>
              <ul style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 2 }}>
                {pat.recognize.map((r, i) => (
                  <li key={i} style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.5 }}>{r}</li>
                ))}
              </ul>
            </div>

            {probs.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 0, borderTop: "1px solid var(--border)", borderLeft: "1px solid var(--border)" }}>
                {probs.map((p) => (
                  <Link key={p.slug} href={`/dsa/${p.slug}`} className="ed-domain" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "13px 16px", borderBottom: "1px solid var(--border)", borderRight: "1px solid var(--border)" }}>
                    <span style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 15, color: "var(--ink)" }}>{p.title}</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600, letterSpacing: ".04em", color: DIFF[p.difficulty] || "var(--ink-3)", textTransform: "uppercase" }}>{p.difficulty}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)", marginTop: 10 }}>— worked problems landing here next —</div>
            )}
          </section>
        );
      })}
    </div>
  );
}
