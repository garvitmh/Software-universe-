// Server component: renders one Burger Farm case-study chapter from the data in
// lib/caseStudy.js — prose blocks, decision cards (what/why/alternatives/how),
// and the "what if?" edge-case register. Editorial styling throughout.
import Link from "next/link";

function renderInline(text, keyBase) {
  const parts = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0;
  let m;
  let i = 0;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("**")) {
      parts.push(
        <strong key={`${keyBase}-b${i++}`} style={{ color: "var(--ink)", fontWeight: 600 }}>{tok.slice(2, -2)}</strong>
      );
    } else {
      parts.push(
        <code key={`${keyBase}-c${i++}`} style={{ fontFamily: "var(--font-mono)", fontSize: "0.86em", background: "var(--code-bg)", color: "var(--code-ink)", padding: "1px 5px", borderRadius: 4, border: "1px solid var(--border)" }}>{tok.slice(1, -1)}</code>
      );
    }
    last = m.index + tok.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function Block({ block, k }) {
  if (typeof block === "string") {
    return <p style={{ fontSize: 16.5, lineHeight: 1.72, color: "var(--ink-2)", margin: "0 0 16px" }}>{renderInline(block, k)}</p>;
  }
  if (block.list) {
    return (
      <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 9, margin: "0 0 18px" }}>
        {block.list.map((it, i) => (
          <li key={`${k}-l${i}`} style={{ fontSize: 16, lineHeight: 1.62, color: "var(--ink-2)" }}>{renderInline(it, `${k}-l${i}`)}</li>
        ))}
      </ul>
    );
  }
  if (block.steps) {
    return (
      <ol style={{ paddingLeft: 22, display: "flex", flexDirection: "column", gap: 10, margin: "0 0 18px" }}>
        {block.steps.map((it, i) => (
          <li key={`${k}-s${i}`} style={{ fontSize: 16, lineHeight: 1.62, color: "var(--ink-2)" }}>{renderInline(it, `${k}-s${i}`)}</li>
        ))}
      </ol>
    );
  }
  if (block.note) {
    const tone = block.tone || "info";
    const accent = tone === "warn" ? "var(--accent)" : tone === "good" ? "var(--primary)" : "var(--bronze)";
    const label = tone === "warn" ? "Watch out" : tone === "good" ? "The payoff" : "Why";
    return (
      <div style={{ border: "1px solid var(--border-2)", borderLeft: `3px solid ${accent}`, borderRadius: 6, padding: "13px 16px", margin: "0 0 18px", background: "var(--surface)" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: accent, marginBottom: 6 }}>{label}</div>
        <p style={{ fontSize: 15, lineHeight: 1.62, color: "var(--ink-2)", margin: 0 }}>{renderInline(block.note, k)}</p>
      </div>
    );
  }
  if (block.fig) {
    return (
      <div style={{ margin: "0 0 18px" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, lineHeight: 1.7, color: "var(--ink)", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 6, padding: "14px 16px", textAlign: "center" }}>{block.fig}</div>
        {block.caption && <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)", marginTop: 7, textAlign: "center" }}>Fig. — {block.caption}</div>}
      </div>
    );
  }
  return null;
}

export default function CaseStudyChapter({ chapter, prev, next }) {
  return (
    <div className="ed-rise" style={{ maxWidth: 760, margin: "0 auto", padding: "44px 32px 80px" }}>
      <Link href="/case-study" style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--ink-3)", display: "inline-block", marginBottom: 22 }}>
        ← Burger Farm, taken apart
      </Link>

      <div style={{ borderBottom: "2px solid var(--ink)", paddingBottom: 18, marginBottom: 28 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 10.5, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 12 }}>
          Chapter {chapter.num} · {chapter.eyebrow}
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 44, lineHeight: 1.08, letterSpacing: "-.02em", margin: "0 0 10px" }}>{chapter.title}</h1>
        {chapter.dek && <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 19, lineHeight: 1.5, color: "var(--ink-2)", margin: 0 }}>{chapter.dek}</p>}
      </div>

      {chapter.sections.map((sec, si) => (
        <section key={`sec${si}`} style={{ marginBottom: 34 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 25, letterSpacing: "-.01em", margin: "0 0 14px" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 13, color: "var(--ink-3)", marginRight: 12 }}>§</span>
            {sec.heading}
          </h2>
          {sec.body.map((b, bi) => (
            <Block key={`sec${si}-b${bi}`} block={b} k={`sec${si}-b${bi}`} />
          ))}
        </section>
      ))}

      {chapter.decisions && chapter.decisions.length > 0 && (
        <section style={{ marginBottom: 34 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 25, letterSpacing: "-.01em", margin: "0 0 16px" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 13, color: "var(--ink-3)", marginRight: 12 }}>§</span>
            The decisions behind it
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {chapter.decisions.map((d) => (
              <div key={d.id} style={{ border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden", background: "var(--surface)" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 12, padding: "13px 18px", borderBottom: "1px solid var(--border)", background: "var(--surface-2)" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 12, color: "var(--primary)" }}>{d.id}</span>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 18, lineHeight: 1.25, color: "var(--ink)" }}>{d.title}</span>
                </div>
                <div style={{ padding: "6px 18px 14px" }}>
                  {[["What", d.what], ["Why", d.why], ["Alternatives we rejected", d.alternatives], ["How", d.how]].map(([label, val]) => (
                    <div key={label} style={{ marginTop: 12 }}>
                      <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 4 }}>{label}</div>
                      <p style={{ fontSize: 15, lineHeight: 1.62, color: "var(--ink-2)", margin: 0 }}>{renderInline(val, `${d.id}-${label}`)}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {chapter.edgeCases && chapter.edgeCases.length > 0 && (
        <section style={{ marginBottom: 34 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 25, letterSpacing: "-.01em", margin: "0 0 16px" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 13, color: "var(--ink-3)", marginRight: 12 }}>§</span>
            What if it goes wrong?
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {chapter.edgeCases.map((e, i) => (
              <div key={`edge${i}`} style={{ border: "1px solid var(--border)", borderRadius: 8, padding: "15px 18px", background: "var(--surface)" }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 17.5, lineHeight: 1.3, color: "var(--ink)", marginBottom: 8 }}>
                  <span style={{ color: "var(--accent)" }}>What if</span> {renderInline(e.q, `edge${i}-q`)}
                </div>
                {e.risk && (
                  <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "var(--ink-3)", margin: "0 0 8px", fontStyle: "italic" }}>
                    The danger: {renderInline(e.risk, `edge${i}-r`)}
                  </p>
                )}
                <div style={{ borderTop: "1px solid var(--border)", paddingTop: 9 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--primary)", marginRight: 8 }}>Our answer</span>
                  <span style={{ fontSize: 15, lineHeight: 1.62, color: "var(--ink-2)" }}>{renderInline(e.answer, `edge${i}-a`)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* prev / next */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, marginTop: 44, paddingTop: 22, borderTop: "1px solid var(--border)" }}>
        {prev ? (
          <Link href={`/case-study/${prev.slug}`} style={{ textDecoration: "none", maxWidth: "48%" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 4 }}>← Chapter {prev.num}</div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 16, color: "var(--ink)" }}>{prev.title}</div>
          </Link>
        ) : <span />}
        {next ? (
          <Link href={`/case-study/${next.slug}`} style={{ textDecoration: "none", maxWidth: "48%", textAlign: "right" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 4 }}>Chapter {next.num} →</div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 16, color: "var(--ink)" }}>{next.title}</div>
          </Link>
        ) : <span />}
      </div>
    </div>
  );
}
