import Link from "next/link";
import WorldMap from "@/components/world-map/WorldMap";
import HomeHero from "@/components/home/HomeHero";
import { ALL_TECH, techHref } from "@/lib/curriculum";
import { TECH_CONTENT } from "@/lib/tech-content";

const WAYS = [
  { href: "/universe", tag: "Explore", title: "Command Center", emoji: "🛡️", desc: "GitHub × Duolingo style telemetry dashboard." },
  { href: "/codex/foundations", tag: "Read", title: "The Codex", emoji: "📖", desc: "Deep docs you can explore." },
  { href: "/roadmap", tag: "Map", title: "The Roadmap", emoji: "🗺️", desc: "The whole stack as a living map." },
  { href: "/simulator", tag: "Play", title: "The Simulator", emoji: "🎮", desc: "Break it on purpose." },
];

export default function Home() {
  return (
    <main style={{ padding: "30px 40px 80px", maxWidth: 1400, margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", gap: 32 }}>
      <HomeHero />

      {/* Overview Quick Links */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        {WAYS.map((w) => (
          <Link key={w.href} href={w.href}>
            <div className="card" style={{ padding: "16px", height: "100%", display: "flex", flexDirection: "column", gap: 12, borderRadius: 12, cursor: "pointer", transition: "transform 0.15s ease", border: "1px solid var(--hairline)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 24 }}>{w.emoji}</span>
                <span style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)" }}>{w.title}</span>
              </div>
              <p style={{ fontSize: 13, color: "var(--ink-2)", margin: 0, lineHeight: 1.45 }}>{w.desc}</p>
            </div>
          </Link>
        ))}
      </section>

      {/* Main Systems Interactive World Map */}
      <section>
        <div className="card" style={{ padding: "8px", borderRadius: 24, background: "var(--surface)", border: "1px solid var(--hairline)" }}>
          <WorldMap />
        </div>
      </section>

      {/* Tech Encyclopedia Section */}
      <section className="card" style={{ padding: "24px", borderRadius: 18, border: "1px solid var(--hairline)" }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: 16, borderBottom: "1px solid var(--hairline)", paddingBottom: 12 }}>
          📚 Tech Encyclopedia
        </h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {ALL_TECH.map((t) => {
            const ready = !!TECH_CONTENT[t.slug];
            return ready ? (
              <Link 
                key={t.slug} 
                href={techHref(t.slug)} 
                className="pill" 
                style={{ 
                  background: "var(--surface-warm)", 
                  border: "1px solid var(--hairline-2)", 
                  fontSize: 12.5, 
                  padding: "6px 14px", 
                  borderRadius: 99,
                  transition: "transform 0.15s ease, border-color 0.15s ease",
                  cursor: "pointer"
                }}
              >
                {t.title}
              </Link>
            ) : (
              <span 
                key={t.slug} 
                className="pill" 
                style={{ 
                  background: "transparent", 
                  border: "1px dashed var(--hairline-2)", 
                  color: "var(--muted)", 
                  fontSize: 12.5,
                  padding: "6px 14px",
                  borderRadius: 99
                }}
              >
                {t.title}
              </span>
            );
          })}
        </div>
      </section>
    </main>
  );
}
