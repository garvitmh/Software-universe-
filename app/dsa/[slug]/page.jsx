import Link from "next/link";
import { notFound } from "next/navigation";
import { DSA_PROBLEMS, DSA_PATTERNS } from "@/lib/dsa";
import { fmt } from "@/lib/fmt";

export function generateStaticParams() {
  return DSA_PROBLEMS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }) {
  const p = DSA_PROBLEMS.find((x) => x.slug === params.slug);
  if (!p) return { title: "Not found · Software Universe" };
  return { title: `${p.title} — DSA Lab · Software Universe`, description: p.statement.slice(0, 140) };
}

const DIFF = { Easy: "var(--teal)", Medium: "var(--amber)", Hard: "var(--pink)" };

export default function DsaProblemPage({ params }) {
  const p = DSA_PROBLEMS.find((x) => x.slug === params.slug);
  if (!p) notFound();
  const pattern = DSA_PATTERNS.find((x) => x.id === p.pattern);
  const related = (p.related || []).map((s) => DSA_PROBLEMS.find((x) => x.slug === s)).filter(Boolean);

  return (
    <main className="wrap-narrow" style={{ paddingTop: 40, paddingBottom: 56 }}>
      <Link href="/dsa" style={{ fontSize: 13.5, color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 20 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
        DSA Lab
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
        <span className="pill" style={{ background: "var(--brand-soft)", color: "var(--brand-2)" }}>{pattern ? pattern.name : "DSA"}</span>
        <span style={{ fontSize: 12.5, fontWeight: 700, color: DIFF[p.difficulty] || "var(--muted)" }}>{p.difficulty}</span>
      </div>
      <h1 style={{ fontSize: 40, lineHeight: 1.08, fontWeight: 600 }}>{p.title}</h1>

      <div className="prose" style={{ marginTop: 20 }}>
        <h2>The problem</h2>
        <p>{fmt(p.statement)}</p>

        <div style={{ margin: "1.4rem 0", background: "var(--blue-soft)", border: "1px solid var(--hairline)", borderRadius: 14, padding: "14px 18px" }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--blue)", marginBottom: 4 }}>How to recognize it</div>
          <div style={{ fontSize: 15, color: "var(--ink)", lineHeight: 1.55 }}>{fmt(p.recognize)}</div>
        </div>

        <h2>Approaches — brute force → optimal</h2>
        {p.approaches.map((a, i) => (
          <div key={i} style={{ margin: "1.1rem 0", border: "1px solid var(--hairline)", borderRadius: 14, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", background: "var(--surface-warm)", borderBottom: "1px solid var(--hairline)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)" }}>{a.name}</span>
                <span style={{ display: "inline-flex", gap: 8, fontFamily: "JetBrains Mono", fontSize: 11.5 }}>
                  <span style={{ color: "var(--brand-2)", background: "var(--brand-soft)", padding: "2px 8px", borderRadius: 6 }}>time {a.time}</span>
                  <span style={{ color: "var(--teal)", background: "var(--teal-soft)", padding: "2px 8px", borderRadius: 6 }}>space {a.space}</span>
                </span>
              </div>
              <p style={{ fontSize: 14, color: "var(--ink-2)", marginTop: 6, lineHeight: 1.55 }}>{fmt(a.idea)}</p>
            </div>
            <pre style={{ margin: 0, padding: "14px 16px", background: "var(--bg-2)", overflowX: "auto", fontFamily: "JetBrains Mono", fontSize: 13, lineHeight: 1.55, color: "var(--ink)" }}>
              <code>{a.code}</code>
            </pre>
          </div>
        ))}

        <h2>When the question is twisted</h2>
        <p style={{ color: "var(--muted)", fontSize: 14.5 }}>The same recognition skill handles the variants — this is what makes a pattern worth far more than a memorized solution:</p>
        <ul style={{ paddingLeft: 18, display: "flex", flexDirection: "column", gap: 8 }}>
          {p.twists.map((t, i) => (
            <li key={i} style={{ fontSize: 15, color: "var(--ink-2)", lineHeight: 1.55 }}>{fmt(t)}</li>
          ))}
        </ul>

        <div style={{ margin: "1.6rem 0", padding: "14px 18px", background: "var(--surface-warm)", border: "1px dashed var(--hairline-2)", borderRadius: 12, fontSize: 14, color: "var(--ink-2)" }}>
          Stuck on a step, or want it explained another way? Hit <kbd style={{ background: "var(--bg-2)", border: "1px solid var(--hairline-2)", borderRadius: 6, padding: "1px 7px", fontSize: 12 }}>Ctrl/⌘ K</kbd> and ask the assistant about this problem.
        </div>

        {related.length > 0 && (
          <>
            <h2>Related problems</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {related.map((r) => (
                <Link key={r.slug} href={`/dsa/${r.slug}`} className="pill" style={{ background: "var(--surface)", border: "1px solid var(--hairline-2)", color: "var(--ink-2)" }}>
                  {r.title} →
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
