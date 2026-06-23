import Link from "next/link";
import { DSA_PATTERNS, problemsByPattern, DSA_STATS } from "@/lib/dsa";

export const metadata = {
  title: "DSA Lab — solve by pattern · Software Universe",
  description: "Learn data structures & algorithms by recognizing the pattern, not memorizing problems.",
};

const TINT = {
  blue: { soft: "var(--blue-soft)", ink: "var(--blue)" },
  teal: { soft: "var(--teal-soft)", ink: "var(--teal)" },
  brand: { soft: "var(--brand-soft)", ink: "var(--brand-2)" },
  purple: { soft: "var(--purple-soft)", ink: "var(--purple)" },
  amber: { soft: "var(--amber-soft)", ink: "var(--amber)" },
  pink: { soft: "var(--pink-soft)", ink: "var(--pink)" },
};

const DIFF = {
  Easy: "var(--teal)",
  Medium: "var(--amber)",
  Hard: "var(--pink)",
};

export default function DsaLab() {
  return (
    <main className="wrap" style={{ paddingTop: 40, paddingBottom: 64 }}>
      <Link href="/learn" style={{ fontSize: 13.5, color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 22 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
        The map
      </Link>

      <div style={{ maxWidth: 700, marginBottom: 30 }}>
        <span className="eyebrow" style={{ color: "var(--brand-2)" }}>DSA Lab</span>
        <h1 style={{ fontSize: "clamp(34px, 5vw, 52px)", lineHeight: 1.04, fontWeight: 600, letterSpacing: "-.02em", marginTop: 8 }}>
          Solve by <span className="grad-text" style={{ fontStyle: "italic" }}>pattern</span>, not by memory.
        </h1>
        <p style={{ fontSize: 18, color: "var(--ink-2)", marginTop: 14, lineHeight: 1.55 }}>
          The trap is memorizing 250 problems. The skill is recognizing that a new problem is really one of a dozen shapes you already know. Each problem here shows you <strong>how to spot the pattern</strong>, the path from brute-force to optimal, and <strong>what happens when the question is twisted</strong>.
        </p>
        <div style={{ display: "flex", gap: 18, marginTop: 14, fontSize: 13.5, color: "var(--muted)" }}>
          <span><strong style={{ color: "var(--ink)" }}>{DSA_STATS.patterns}</strong> patterns</span>
          <span><strong style={{ color: "var(--ink)" }}>{DSA_STATS.problems}</strong> problems</span>
          <span style={{ color: "var(--faint)" }}>more landing continuously</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        {DSA_PATTERNS.map((pat) => {
          const tint = TINT[pat.tint] || TINT.brand;
          const probs = problemsByPattern(pat.id);
          return (
            <section key={pat.id} className="card" style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "20px 22px", background: tint.soft, borderBottom: "1px solid var(--hairline)" }}>
                <h2 style={{ fontFamily: "Fraunces", fontSize: 23, fontWeight: 600, color: "var(--ink)" }}>{pat.name}</h2>
                <p style={{ fontSize: 14.5, color: "var(--ink-2)", marginTop: 6, lineHeight: 1.55, maxWidth: 760 }}>{pat.idea}</p>
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: tint.ink, marginBottom: 6 }}>How to recognize it</div>
                  <ul style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 3 }}>
                    {pat.recognize.map((r, i) => (
                      <li key={i} style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.5 }}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div style={{ padding: "16px 22px 20px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
                {probs.map((p) => (
                  <Link key={p.slug} href={`/dsa/${p.slug}`}>
                    <div className="card" style={{ padding: "14px 16px", height: "100%", borderRadius: 14, display: "flex", flexDirection: "column", gap: 6 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                        <span style={{ fontWeight: 600, fontSize: 15, color: "var(--ink)" }}>{p.title}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: DIFF[p.difficulty] || "var(--muted)" }}>{p.difficulty}</span>
                      </div>
                      <span style={{ fontSize: 12.5, color: "var(--brand-2)", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 5 }}>
                        Open
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
