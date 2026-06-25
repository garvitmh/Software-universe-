import Link from "next/link";
import Callout from "@/components/Callout";
import { ALL_TECH } from "@/lib/curriculum";
import { fmt } from "@/lib/fmt";

function Paras({ items, dropFirst }) {
  return (items || []).map((p, i) => (
    <p key={i} className={dropFirst && i === 0 ? "ed-dropcap" : undefined}>
      {fmt(p)}
    </p>
  ));
}

// An h2 with a mono §-marker, the Editorial section convention.
function H2({ n, children }) {
  return (
    <h2 style={{ fontSize: 30, margin: "2.6rem 0 1rem", letterSpacing: "-.01em" }}>
      {n != null && (
        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 13, color: "var(--ink-3)", marginRight: 12, verticalAlign: "middle" }}>
          §{n}
        </span>
      )}
      {children}
    </h2>
  );
}

export default function TechArticle({ content: c }) {
  const relatedTech = (c.related || [])
    .map((slug) => ALL_TECH.find((t) => t.slug === slug))
    .filter(Boolean);

  let n = 0;

  return (
    <main className="wrap-narrow" style={{ paddingTop: 40, paddingBottom: 60 }}>
      <div className="ed-label" style={{ marginBottom: 16 }}>Tech reference · {c.category}</div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 48, lineHeight: 1.04, fontWeight: 500, letterSpacing: "-.02em" }}>{c.title}</h1>
      {c.tagline && (
        <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 23, color: "var(--ink-2)", marginTop: 12, lineHeight: 1.4 }}>
          {c.tagline}
        </p>
      )}

      <div className="prose" style={{ marginTop: 26 }}>
        {c.oneLiner && (
          <div
            style={{
              border: "1px solid var(--border)",
              borderLeft: "3px solid var(--primary)",
              borderRadius: "0 6px 6px 0",
              padding: "14px 18px",
              margin: "0 0 1.8rem",
              background: "var(--surface)",
            }}
          >
            <div className="ed-label" style={{ marginBottom: 5, color: "var(--primary)" }}>In one line</div>
            <div style={{ fontSize: 18, color: "var(--ink)", lineHeight: 1.5 }}>{fmt(c.oneLiner)}</div>
          </div>
        )}

        <H2 n={++n}>What it is</H2>
        <Paras items={c.what} dropFirst />

        {c.analogy && (
          <Callout variant="deeper" title={c.analogy.title || "A way to picture it"}>
            {fmt(c.analogy.body)}
          </Callout>
        )}

        {c.inside && c.inside.length > 0 && (
          <>
            <H2 n={++n}>{c.insideTitle || "What's inside it"}</H2>
            {c.insideIntro && <p>{fmt(c.insideIntro)}</p>}
            <div style={{ borderTop: "1px solid var(--border)", margin: "0 0 1.6rem" }}>
              {c.inside.map((it, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "170px 1fr", gap: 20, padding: "15px 0", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 17, color: "var(--ink)" }}>{fmt(it.name)}</div>
                  <div style={{ fontSize: 16, lineHeight: 1.6, color: "var(--ink-2)" }}>{fmt(it.desc)}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {c.why && (
          <>
            <H2 n={++n}>Why we use it (and what else exists)</H2>
            <Paras items={c.why} />
          </>
        )}

        {c.alternatives && c.alternatives.length > 0 && (
          <div style={{ margin: "1.2rem 0", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
            {c.alternatives.map((a, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 14,
                  padding: "12px 16px",
                  borderBottom: i < c.alternatives.length - 1 ? "1px solid var(--border)" : "none",
                  background: i % 2 ? "var(--surface)" : "var(--surface-2)",
                }}
              >
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15, minWidth: 130, color: "var(--ink)" }}>{a.name}</span>
                <span style={{ fontSize: 15, color: "var(--ink-2)", lineHeight: 1.5 }}>{fmt(a.note)}</span>
              </div>
            ))}
          </div>
        )}

        {c.howWeUse && (
          <>
            <H2 n={++n}>How it works in Burger Farm</H2>
            <Paras items={c.howWeUse.body} />
            {c.howWeUse.refs && c.howWeUse.refs.length > 0 && (
              <div style={{ margin: "1rem 0", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, padding: "12px 16px" }}>
                <div className="ed-label" style={{ marginBottom: 8 }}>In your repo</div>
                {c.howWeUse.refs.map((r, i) => (
                  <div key={i} style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, color: "var(--ink-2)", padding: "2px 0" }}>{r}</div>
                ))}
              </div>
            )}
          </>
        )}

        {c.breaks && (
          <Callout variant="breaks" title={c.breaksTitle || "When it breaks"}>
            {fmt(c.breaks)}
          </Callout>
        )}

        {c.scale && (
          <Callout variant="scale" title={c.scaleTitle || "How it grows"}>
            {fmt(c.scale)}
          </Callout>
        )}

        {relatedTech.length > 0 && (
          <>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600, margin: "2.6rem 0 1rem" }}>Keep pulling the thread</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px" }}>
              {relatedTech.map((t) => (
                <Link
                  key={t.slug}
                  href={t.href}
                  style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 14, color: "var(--ink)", borderBottom: "1px solid var(--primary)" }}
                >
                  {t.title} →
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
