import Link from "next/link";
import FlowMap from "@/components/FlowMap";
import HomeHero from "@/components/home/HomeHero";
import { TECH_SECTIONS, ALL_TECH, techHref } from "@/lib/curriculum";
import { TECH_CONTENT } from "@/lib/tech-content";

const PARTS = [
  { n: "01", title: "Foundations — how it all fits together", href: "/codex/foundations" },
  { n: "02", title: "The thinking tools — layers & state", href: "/codex/layers-and-separation" },
  { n: "03", title: "Your Flutter app, layer by layer", href: "/codex/flutter-app" },
  { n: "04", title: "The backend — the brain", href: "/codex/backend" },
  { n: "05", title: "The database — the memory", href: "/codex/database" },
  { n: "06", title: "The admin panel — the control room", href: "/codex/admin-panel" },
  { n: "07", title: "The burger builder & motion engine", href: "/codex/burger-builder" },
  { n: "08", title: "Big systems — payments, orders, loyalty, delivery", href: "/codex/big-systems" },
  { n: "09", title: "Enterprise plumbing & scale", href: "/codex/scale" },
  { n: "10", title: "Deployment & ops — going live", href: "/codex/deployment" },
];

const WAYS = [
  { href: "/codex/foundations", tag: "Read", title: "The Codex", emoji: "📖", desc: "Deep docs you can poke." },
  { href: "/roadmap", tag: "Map", title: "The Roadmap", emoji: "🗺️", desc: "The whole stack as a living map." },
  { href: "/simulator", tag: "Play", title: "The Simulator", emoji: "🎮", desc: "Break it on purpose." },
];

export default function Home() {
  return (
    <main style={{ padding: "30px 40px 80px", maxWidth: 1400, margin: "0 auto", width: "100%" }}>
      <HomeHero />

        {/* Dashboard Grid Row 1 */}
        <section style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 24 }}>
          {WAYS.map((w) => (
            <Link key={w.href} href={w.href}>
              <div className="card" style={{ padding: "16px", height: "100%", display: "flex", flexDirection: "column", gap: 12, borderRadius: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 24 }}>{w.emoji}</span>
                  <span style={{ fontWeight: 600, fontSize: 14, color: "var(--ink)" }}>{w.title}</span>
                </div>
                <p style={{ fontSize: 13, color: "var(--ink-2)", margin: 0, lineHeight: 1.4 }}>{w.desc}</p>
              </div>
            </Link>
          ))}
        </section>

        {/* System Map Widget */}
        <section style={{ marginTop: 24 }}>
          <div className="card" style={{ padding: "20px", borderRadius: 8 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, borderBottom: "1px solid var(--hairline)", paddingBottom: 12, color: "var(--ink)" }}>System Architecture Overview</h3>
            <FlowMap />
          </div>
        </section>

        {/* Learning Path & Tech Stacks */}
        <section style={{ marginTop: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div className="card" style={{ borderRadius: 8, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--hairline)", background: "var(--bg-2)" }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, margin: 0, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--ink-2)" }}>Curriculum Modules</h3>
            </div>
            <div style={{ padding: 0 }}>
              {PARTS.map((p) => (
                <Link key={p.n} href={p.href} style={{ display: "flex", alignItems: "center", padding: "10px 16px", borderBottom: "1px solid var(--hairline)", textDecoration: "none" }}>
                  <span style={{ fontSize: 12, color: "var(--muted)", width: 28, fontFamily: "JetBrains Mono" }}>{p.n}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>{p.title}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="card" style={{ borderRadius: 8, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--hairline)", background: "var(--bg-2)" }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, margin: 0, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--ink-2)" }}>Tech Encyclopedia</h3>
            </div>
            <div style={{ padding: "16px", display: "flex", flexWrap: "wrap", gap: 8 }}>
              {ALL_TECH.map((t) => {
                const ready = !!TECH_CONTENT[t.slug];
                return ready ? (
                  <Link key={t.slug} href={techHref(t.slug)} className="pill" style={{ background: "var(--surface-warm)", border: "1px solid var(--hairline-2)", fontSize: 12 }}>{t.title}</Link>
                ) : (
                  <span key={t.slug} className="pill" style={{ background: "transparent", border: "1px dashed var(--hairline-2)", color: "var(--muted)", fontSize: 12 }}>{t.title}</span>
                );
              })}
            </div>
          </div>
        </section>
    </main>
  );
}
