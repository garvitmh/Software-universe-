import Link from "next/link";
import { CASE_STUDY } from "@/lib/caseStudy";

export const metadata = {
  title: "Burger Farm, taken apart · Software Universe",
  description: "A real enterprise food-ordering platform explained in extreme detail: every architectural decision (what/why/alternatives/how), the full data flow, and an exhaustive 'what if it breaks?' playbook.",
};

export default function CaseStudyIndex() {
  const { meta, chapters } = CASE_STUDY;
  return (
    <div className="ed-rise" style={{ maxWidth: 860, margin: "0 auto", padding: "48px 32px 80px" }}>
      <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 10.5, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 16 }}>
        Case study · {meta.kicker}
      </div>

      <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 64, lineHeight: 1, letterSpacing: "-.03em", margin: "0 0 18px" }}>
        {meta.title}
      </h1>
      <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 22, lineHeight: 1.5, color: "var(--ink-2)", maxWidth: 680, margin: "0 0 28px" }}>
        {meta.dek}
      </p>

      {/* stats strip */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 0, border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden", marginBottom: 36 }}>
        {meta.stats.map((s, i) => (
          <div key={i} style={{ flex: "1 1 140px", padding: "16px 18px", borderRight: i < meta.stats.length - 1 ? "1px solid var(--border)" : "none", background: "var(--surface)" }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 30, letterSpacing: "-.02em", color: "var(--primary)" }}>{s.n}</div>
            <div style={{ fontSize: 12.5, lineHeight: 1.4, color: "var(--ink-3)", marginTop: 2 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* intro */}
      <div style={{ maxWidth: 700, marginBottom: 44 }}>
        {meta.intro.map((p, i) => (
          <p key={i} style={{ fontSize: 17, lineHeight: 1.74, color: "var(--ink-2)", margin: "0 0 16px" }}
             dangerouslySetInnerHTML={{ __html: p.replace(/\*\*([^*]+)\*\*/g, '<strong style="color:var(--ink);font-weight:600">$1</strong>') }} />
        ))}
      </div>

      {/* chapter list */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", margin: "0 0 14px" }}>
        <h2 style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--ink-3)", margin: 0 }}>
          The chapters
        </h2>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)" }}>{chapters.length} parts</span>
      </div>

      <div style={{ border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
        {chapters.map((c, i) => (
          <Link
            key={c.slug}
            href={`/case-study/${c.slug}`}
            className="ed-domain"
            style={{ display: "flex", alignItems: "center", gap: 20, padding: "18px 22px", borderBottom: i < chapters.length - 1 ? "1px solid var(--border)" : "none", textDecoration: "none" }}
          >
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 26, color: "var(--ink-3)", minWidth: 38, fontStyle: "italic" }}>{c.num}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--primary)", marginBottom: 3 }}>{c.eyebrow}</div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 20, letterSpacing: "-.01em", marginBottom: 3, color: "var(--ink)" }}>{c.title}</div>
              <div style={{ fontSize: 14, lineHeight: 1.5, color: "var(--ink-2)" }}>{c.dek}</div>
            </div>
            <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 20, color: "var(--primary)" }}>→</span>
          </Link>
        ))}
      </div>

      <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".06em", color: "var(--ink-3)", marginTop: 24 }}>
        Want the moving version? Watch the same order flow in{" "}
        <Link href="/simulator/order-journey" style={{ color: "var(--primary)", borderBottom: "1px solid var(--primary)" }}>The journey of an order</Link>.
      </p>
    </div>
  );
}
