import Link from "next/link";
import { DOMAINS, DEPTH_LADDER, CURRICULUM_STATS } from "@/lib/domains";

export const metadata = {
  title: "Learn — the map · Software Universe",
  description: "Software engineering, end to end: every domain, each climbing from local to planet-scale.",
};

const TINT = {
  brand: { soft: "var(--brand-soft)", ink: "var(--brand-2)" },
  purple: { soft: "var(--purple-soft)", ink: "var(--purple)" },
  blue: { soft: "var(--blue-soft)", ink: "var(--blue)" },
  amber: { soft: "var(--amber-soft)", ink: "var(--amber)" },
  teal: { soft: "var(--teal-soft)", ink: "var(--teal)" },
  pink: { soft: "var(--pink-soft)", ink: "var(--pink)" },
};

export default function LearnMapPage() {
  const s = CURRICULUM_STATS;
  return (
    <main className="wrap" style={{ paddingTop: 40, paddingBottom: 64 }}>
      {/* Header */}
      <div style={{ maxWidth: 720, marginBottom: 26 }}>
        <span className="eyebrow" style={{ color: "var(--brand-2)" }}>The map · learn everything</span>
        <h1 style={{ fontSize: "clamp(34px, 5vw, 52px)", lineHeight: 1.04, fontWeight: 600, letterSpacing: "-.02em", marginTop: 8 }}>
          Software, end to end — <span className="grad-text" style={{ fontStyle: "italic" }}>from one machine to a million users.</span>
        </h1>
        <p style={{ fontSize: 18, color: "var(--ink-2)", marginTop: 14, lineHeight: 1.55 }}>
          Grow <strong>wide</strong> across every field a software engineer touches, and <strong>deep</strong> in each one — climbing the same ladder every time: what it is, why it's built that way, how it works, and exactly when it breaks.
        </p>
        <div style={{ display: "flex", gap: 18, marginTop: 16, fontSize: 13.5, color: "var(--muted)", flexWrap: "wrap" }}>
          <span><strong style={{ color: "var(--ink)" }}>{s.domains}</strong> domains</span>
          <span><strong style={{ color: "var(--teal)" }}>{s.live}</strong> topics live</span>
          <span><strong style={{ color: "var(--faint)" }}>{s.soon}</strong> on the way</span>
        </div>
      </div>

      {/* Depth ladder */}
      <div className="card" style={{ padding: "16px 18px", marginBottom: 30, background: "var(--surface)" }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>Every topic climbs this ladder</div>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${DEPTH_LADDER.length}, 1fr)`, gap: 10 }} className="path-grid">
          {DEPTH_LADDER.map((d, i) => (
            <div key={d.id} style={{ display: "flex", flexDirection: "column", gap: 4, padding: "10px 12px", borderRadius: 12, background: "var(--bg-2)", borderLeft: `3px solid var(--brand)`, opacity: 0.55 + i * 0.15 }}>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: "var(--ink)" }}>{i + 1}. {d.label}</span>
              <span style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.4 }}>{d.blurb}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Domains grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 18 }}>
        {DOMAINS.map((dom) => {
          const tint = TINT[dom.tint] || TINT.brand;
          const live = dom.topics.filter((t) => t.status === "live").length;
          return (
            <section key={dom.id} className="card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "18px 20px 14px", borderBottom: "1px solid var(--hairline)", background: tint.soft }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
                  <h2 style={{ fontFamily: "Fraunces", fontSize: 21, fontWeight: 600, color: "var(--ink)" }}>{dom.title}</h2>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: tint.ink, whiteSpace: "nowrap" }}>{live}/{dom.topics.length} live</span>
                </div>
                <p style={{ fontSize: 13.5, color: "var(--ink-2)", marginTop: 6, lineHeight: 1.5 }}>{dom.tagline}</p>
              </div>
              <div style={{ padding: "14px 18px 18px", display: "flex", flexWrap: "wrap", gap: 7 }}>
                {dom.topics.map((t, i) =>
                  t.status === "live" && t.href ? (
                    <Link
                      key={i}
                      href={t.href}
                      className="pill"
                      style={{ background: "var(--surface-warm)", border: "1px solid var(--hairline-2)", color: "var(--ink)", fontSize: 12.5, padding: "6px 12px" }}
                    >
                      {t.t}
                    </Link>
                  ) : (
                    <span
                      key={i}
                      className="pill"
                      style={{ background: "transparent", border: "1px dashed var(--hairline-2)", color: "var(--faint)", fontSize: 12.5, padding: "6px 12px" }}
                      title="On the way"
                    >
                      {t.t}
                    </span>
                  )
                )}
              </div>
            </section>
          );
        })}
      </div>

      <p style={{ textAlign: "center", color: "var(--faint)", fontSize: 13.5, marginTop: 34 }}>
        Don't know a word along the way? Hit <kbd style={{ background: "var(--bg-2)", border: "1px solid var(--hairline-2)", borderRadius: 6, padding: "1px 7px", fontSize: 12 }}>Ctrl/⌘ K</kbd> anywhere and ask the assistant.
      </p>
    </main>
  );
}
