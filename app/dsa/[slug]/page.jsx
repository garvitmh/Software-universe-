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
  return { title: `${p.title} — DSA Lab · Software Universe`, description: p.statement.replace(/[`*]/g, "").slice(0, 150) };
}

const DIFF = { Easy: "var(--teal)", Medium: "var(--bronze)", Hard: "var(--accent)" };

const label = {
  fontFamily: "var(--font-mono)",
  fontWeight: 600,
  fontSize: 10.5,
  letterSpacing: ".12em",
  textTransform: "uppercase",
};

function H2({ children, n }) {
  return (
    <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 28, letterSpacing: "-.01em", margin: "2.6rem 0 1rem" }}>
      {n != null && <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 13, color: "var(--ink-3)", marginRight: 12, verticalAlign: "middle" }}>§{n}</span>}
      {children}
    </h2>
  );
}

export default function DsaProblemPage({ params }) {
  const p = DSA_PROBLEMS.find((x) => x.slug === params.slug);
  if (!p) notFound();
  const pattern = DSA_PATTERNS.find((x) => x.id === p.pattern);
  const related = (p.related || []).map((s) => DSA_PROBLEMS.find((x) => x.slug === s)).filter(Boolean);
  let n = 0;

  return (
    <main className="wrap-narrow" style={{ paddingTop: 40, paddingBottom: 64 }}>
      <Link href="/dsa" style={{ ...label, color: "var(--ink-3)", display: "inline-block", marginBottom: 18 }}>
        ← DSA Lab
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginBottom: 12 }}>
        <span style={{ ...label, color: "var(--primary)" }}>{pattern ? pattern.name : "DSA"}</span>
        <span style={{ ...label, color: DIFF[p.difficulty] || "var(--ink-3)" }}>{p.difficulty}</span>
        {p.leetcode && (
          <a href={`https://leetcode.com/problems/${p.slug}/`} target="_blank" rel="noopener noreferrer" style={{ ...label, color: "var(--ink-3)", borderBottom: "1px solid var(--border-2)" }}>
            LeetCode #{p.leetcode} ↗
          </a>
        )}
      </div>
      <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 46, lineHeight: 1.05, letterSpacing: "-.02em" }}>{p.title}</h1>

      <div className="prose" style={{ marginTop: 22 }}>
        {/* The problem */}
        <H2 n={++n}>The problem</H2>
        <p>{fmt(p.statement)}</p>

        {p.examples && p.examples.length > 0 && (
          <div style={{ border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden", margin: "1.2rem 0" }}>
            {p.examples.map((ex, i) => (
              <div key={i} style={{ padding: "12px 16px", borderBottom: i < p.examples.length - 1 ? "1px solid var(--border)" : "none", background: i % 2 ? "var(--surface)" : "var(--surface-2)" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--ink)" }}>
                  <span style={{ color: "var(--ink-3)" }}>in&nbsp;&nbsp;</span>{ex.in}
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--primary)", marginTop: 2 }}>
                  <span style={{ color: "var(--ink-3)" }}>out&nbsp;</span>{ex.out}
                </div>
                {ex.note && <div style={{ fontSize: 13, color: "var(--ink-2)", marginTop: 3, fontStyle: "italic" }}>{ex.note}</div>}
              </div>
            ))}
          </div>
        )}

        {p.constraints && p.constraints.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px", margin: "0 0 1rem" }}>
            <span style={{ ...label, color: "var(--ink-3)" }}>Constraints</span>
            {p.constraints.map((c, i) => (
              <span key={i} style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, color: "var(--ink-2)" }}>{c}</span>
            ))}
          </div>
        )}

        {/* Figure it out — the differentiator */}
        {p.figureItOut && p.figureItOut.length > 0 && (
          <div style={{ border: "1px solid var(--primary)", borderRadius: 8, background: "color-mix(in srgb, var(--primary) 5%, transparent)", padding: "22px 24px", margin: "1.8rem 0" }}>
            <div style={{ ...label, color: "var(--primary)", marginBottom: 14 }}>How to figure it out — from scratch</div>
            <div style={{ borderLeft: "1px solid var(--border-2)" }}>
              {p.figureItOut.map((step, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "30px 1fr", gap: 12, padding: "8px 0 8px 16px" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 13, color: "var(--primary)" }}>{i + 1}</span>
                  <div style={{ fontSize: 16.5, lineHeight: 1.65, color: "var(--ink)" }}>{fmt(step)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recognise */}
        <div style={{ borderLeft: "3px solid var(--bronze)", padding: "6px 0 6px 22px", margin: "1.8rem 0" }}>
          <div style={{ ...label, color: "var(--bronze)", marginBottom: 7 }}>How to recognise the pattern</div>
          <div style={{ fontSize: 17, lineHeight: 1.6, color: "var(--ink)" }}>{fmt(p.recognize)}</div>
        </div>

        {/* Approaches */}
        <H2 n={++n}>Approaches — brute force → optimal</H2>
        {p.approaches.map((a, i) => (
          <div key={i} style={{ border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden", margin: "1.2rem 0" }}>
            <div style={{ padding: "14px 18px", background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 19, color: "var(--ink)" }}>{a.name}</span>
                <span style={{ display: "inline-flex", gap: 8, fontFamily: "var(--font-mono)", fontSize: 11.5 }}>
                  <span style={{ color: "var(--primary)" }}>time {a.time}</span>
                  <span style={{ color: "var(--ink-3)" }}>·</span>
                  <span style={{ color: "var(--bronze)" }}>space {a.space}</span>
                </span>
              </div>
              {a.intuition && <p style={{ fontSize: 15.5, color: "var(--ink-2)", margin: "8px 0 0", lineHeight: 1.6 }}>{fmt(a.intuition)}</p>}
            </div>

            <pre style={{ margin: 0, padding: "16px 18px", background: "var(--code-bg)", color: "var(--code-ink)", overflowX: "auto", fontFamily: "var(--font-mono)", fontSize: 13, lineHeight: 1.7 }}>
              <code>{a.code}</code>
            </pre>

            {(a.timeWhy || a.spaceWhy) && (
              <div style={{ padding: "12px 18px", borderTop: "1px solid var(--border)", background: "var(--surface-2)", display: "flex", flexDirection: "column", gap: 5 }}>
                {a.timeWhy && (
                  <div style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.5 }}>
                    <span style={{ fontFamily: "var(--font-mono)", color: "var(--primary)" }}>{a.time}</span> — {fmt(a.timeWhy)}
                  </div>
                )}
                {a.spaceWhy && (
                  <div style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.5 }}>
                    <span style={{ fontFamily: "var(--font-mono)", color: "var(--bronze)" }}>{a.space}</span> — {fmt(a.spaceWhy)}
                  </div>
                )}
              </div>
            )}

            {a.walkthrough && a.walkthrough.length > 0 && (
              <div style={{ padding: "12px 18px", borderTop: "1px solid var(--border)" }}>
                <div style={{ ...label, color: "var(--ink-3)", marginBottom: 8 }}>Trace</div>
                {a.walkthrough.map((w, j) => (
                  <div key={j} style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.55, marginBottom: 3 }}>{fmt(w)}</div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Edge cases */}
        {p.edgeCases && p.edgeCases.length > 0 && (
          <>
            <H2 n={++n}>Edge cases & gotchas</H2>
            <ul style={{ paddingLeft: 18, display: "flex", flexDirection: "column", gap: 7 }}>
              {p.edgeCases.map((e, i) => (
                <li key={i} style={{ fontSize: 16, color: "var(--ink-2)", lineHeight: 1.6 }}>{fmt(e)}</li>
              ))}
            </ul>
          </>
        )}

        {/* Twists */}
        {p.twists && p.twists.length > 0 && (
          <>
            <H2 n={++n}>When the question is twisted</H2>
            <p style={{ color: "var(--ink-3)", fontSize: 15 }}>The same recognition skill handles the variants — this is why a pattern is worth far more than a memorised solution.</p>
            <ul style={{ paddingLeft: 18, display: "flex", flexDirection: "column", gap: 8 }}>
              {p.twists.map((t, i) => (
                <li key={i} style={{ fontSize: 16, color: "var(--ink-2)", lineHeight: 1.6 }}>{fmt(t)}</li>
              ))}
            </ul>
          </>
        )}

        <div style={{ margin: "1.8rem 0", padding: "14px 18px", border: "1px solid var(--border)", borderRadius: 8, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".04em", color: "var(--ink-3)" }}>
          Stuck on a step, or want it explained another way? Press ⌘/Ctrl K and ask the Professor about this problem.
        </div>

        {related.length > 0 && (
          <>
            <H2>Related problems</H2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px" }}>
              {related.map((r) => (
                <Link key={r.slug} href={`/dsa/${r.slug}`} style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 14, color: "var(--ink)", borderBottom: "1px solid var(--primary)" }}>
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
