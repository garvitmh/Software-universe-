import Link from "next/link";
import Callout from "@/components/Callout";
import { ALL_TECH } from "@/lib/curriculum";

const TINTS = {
  blue: { soft: "var(--blue-soft)", ink: "var(--blue)" },
  amber: { soft: "var(--amber-soft)", ink: "var(--amber)" },
  teal: { soft: "var(--teal-soft)", ink: "var(--teal)" },
  purple: { soft: "var(--purple-soft)", ink: "var(--purple)" },
  pink: { soft: "var(--pink-soft)", ink: "var(--pink)" },
  brand: { soft: "var(--brand-soft)", ink: "var(--brand-2)" },
};

// tiny inline formatter: `code` and **bold**
function fmt(str) {
  const parts = String(str).split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("`") && p.endsWith("`")) return <code key={i}>{p.slice(1, -1)}</code>;
    if (p.startsWith("**") && p.endsWith("**")) return <strong key={i}>{p.slice(2, -2)}</strong>;
    return <span key={i}>{p}</span>;
  });
}

function Paras({ items }) {
  return (items || []).map((p, i) => <p key={i}>{fmt(p)}</p>);
}

export default function TechArticle({ content: c }) {
  const tint = TINTS[c.color] || TINTS.brand;
  const relatedTech = (c.related || [])
    .map((slug) => ALL_TECH.find((t) => t.slug === slug))
    .filter(Boolean);

  return (
    <main className="wrap-narrow" style={{ paddingTop: 40, paddingBottom: 52 }}>
      <span className="pill" style={{ background: tint.soft, color: tint.ink, marginBottom: 14 }}>
        Tech reference · {c.category}
      </span>
      <h1 style={{ fontSize: 40, lineHeight: 1.08 }}>{c.title}</h1>
      {c.tagline && <p style={{ fontSize: 19, color: "var(--ink-2)", marginTop: 12, lineHeight: 1.5 }}>{c.tagline}</p>}

      <div className="prose" style={{ marginTop: 22 }}>
        {c.oneLiner && (
          <div style={{ background: tint.soft, border: "1px solid var(--hairline)", borderRadius: 14, padding: "14px 18px", margin: "0 0 1.4rem" }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: tint.ink, marginBottom: 4 }}>In one line</div>
            <div style={{ fontSize: 16.5, color: "var(--ink)" }}>{fmt(c.oneLiner)}</div>
          </div>
        )}

        <h2>What it is</h2>
        <Paras items={c.what} />

        {c.analogy && (
          <Callout variant="deeper" title={c.analogy.title || "A way to picture it"}>
            {fmt(c.analogy.body)}
          </Callout>
        )}

        {c.inside && c.inside.length > 0 && (
          <>
            <h2>{c.insideTitle || "What's inside it"}</h2>
            {c.insideIntro && <p>{fmt(c.insideIntro)}</p>}
            <div className="inside-grid">
              {c.inside.map((it, i) => (
                <div key={i} className="inside-card">
                  <h4>{fmt(it.name)}</h4>
                  <p>{fmt(it.desc)}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {c.why && (
          <>
            <h2>Why we use it (and what else exists)</h2>
            <Paras items={c.why} />
          </>
        )}

        {c.alternatives && c.alternatives.length > 0 && (
          <div style={{ margin: "1.2rem 0", border: "1px solid var(--hairline)", borderRadius: 12, overflow: "hidden" }}>
            {c.alternatives.map((a, i) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "11px 15px", borderBottom: i < c.alternatives.length - 1 ? "1px solid var(--hairline)" : "none", background: i % 2 ? "var(--surface)" : "var(--bg-2)" }}>
                <span style={{ fontWeight: 600, fontSize: 13.5, minWidth: 120, color: "var(--ink)" }}>{a.name}</span>
                <span style={{ fontSize: 13.5, color: "var(--muted)" }}>{fmt(a.note)}</span>
              </div>
            ))}
          </div>
        )}

        {c.howWeUse && (
          <>
            <h2>How it works in Burger Farm</h2>
            <Paras items={c.howWeUse.body} />
            {c.howWeUse.refs && c.howWeUse.refs.length > 0 && (
              <div style={{ margin: "1rem 0", background: "var(--bg-2)", border: "1px solid var(--hairline)", borderRadius: 12, padding: "12px 16px" }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--faint)", marginBottom: 8 }}>In your repo</div>
                {c.howWeUse.refs.map((r, i) => (
                  <div key={i} style={{ fontFamily: "JetBrains Mono", fontSize: 12.5, color: "var(--ink-2)", padding: "2px 0" }}>{r}</div>
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
            <h2>Keep pulling the thread</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {relatedTech.map((t) => (
                <Link key={t.slug} href={t.href} className="pill" style={{ background: "var(--surface)", border: "1px solid var(--hairline-2)", color: "var(--ink-2)" }}>
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
