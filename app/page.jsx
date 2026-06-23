import Link from "next/link";
import WorldMap from "@/components/world-map/WorldMap";
import HomeHero from "@/components/home/HomeHero";
import CardSpotlight from "@/components/ui/CardSpotlight";
import { 
  ShieldIcon, 
  BookOpenIcon, 
  MapIcon, 
  PlayIcon, 
  LibraryIcon, 
  ChevronRightIcon,
  ActivityIcon,
  CpuIcon,
  ServerIcon,
  DatabaseIcon
} from "@/components/ui/Icons";
import { ALL_TECH, techHref } from "@/lib/curriculum";
import { TECH_CONTENT } from "@/lib/tech-content";

export default function Home() {
  return (
    <main style={{ padding: "30px 40px 80px", maxWidth: 1400, margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", gap: 40, position: "relative" }}>
      {/* Background Dot Grid */}
      <div 
        className="grid-bg" 
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "600px",
          pointerEvents: "none",
          zIndex: 0,
          opacity: 0.35,
          maskImage: "linear-gradient(to bottom, black 50%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 50%, transparent 100%)"
        }} 
      />

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 32 }}>
        <HomeHero />

        {/* Bento Grid Layout Section */}
        <section 
          style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(4, 1fr)", 
            gap: 20, 
            marginTop: 8 
          }} 
          className="ways-grid"
        >
          {/* 1. Command Center Card (Col span 2) */}
          <Link href="/universe" style={{ gridColumn: "span 2", display: "block" }}>
            <CardSpotlight
              style={{
                height: "100%",
                padding: "26px",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--hairline)",
                background: "var(--surface)",
                display: "flex",
                flexDirection: "column",
                gap: 16
              }}
              glowColor="rgba(99, 102, 241, 0.08)"
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--brand)" }}>
                  <ShieldIcon size={22} />
                  <span style={{ fontWeight: 700, fontSize: 16, color: "var(--ink)" }}>Command Center</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--pop-lime)", display: "inline-block", boxShadow: "0 0 8px var(--pop-lime)" }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>13 live tools</span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <p style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.5, margin: 0 }}>
                  Drive a live traffic simulation, run incident war-rooms, and explore 13 interactive system-design labs — all in one control room.
                </p>
                {/* What's inside the control room (honest, not fake telemetry) */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                  {["Traffic simulator", "Incident War Room", "Pattern Atlas", "Case Studies", "AI Professor"].map((t) => (
                    <span key={t} style={{ fontSize: 10.5, fontWeight: 600, color: "var(--ink-2)", background: "var(--surface-warm)", border: "1px solid var(--hairline-2)", padding: "4px 9px", borderRadius: 6 }}>{t}</span>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--brand-2)", fontWeight: "700", fontSize: "14px", marginTop: "auto", paddingTop: 8 }}>
                Open control room
                <ChevronRightIcon size={16} />
              </div>
            </CardSpotlight>
          </Link>

          {/* 2. Codex Library Card (Col span 2) */}
          <Link href="/codex/library" style={{ gridColumn: "span 2", display: "block" }}>
            <CardSpotlight
              style={{
                height: "100%",
                padding: "26px",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--hairline)",
                background: "var(--surface)",
                display: "flex",
                flexDirection: "column",
                gap: 16
              }}
              glowColor="rgba(139, 92, 246, 0.08)"
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--purple)" }}>
                  <BookOpenIcon size={22} />
                  <span style={{ fontWeight: 700, fontSize: 16, color: "var(--ink)" }}>The Codex Library</span>
                </div>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: "var(--muted)", border: "1.5px solid var(--hairline)", padding: "3px 8px", borderRadius: 99, textTransform: "uppercase", letterSpacing: "0.04em" }}>Grounded RAG</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <p style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.5, margin: 0 }}>
                  Explore premium reference materials: Google SRE chapters, Stripe payment APIs, and Discord ScyllaDB migrations, integrated with Socratic AI.
                </p>
                {/* Inline mini catalog list */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
                  <span style={{ fontSize: 11, background: "var(--purple-soft)", color: "var(--purple)", padding: "4px 8px", borderRadius: 6, fontWeight: 600 }}>Google SRE Book</span>
                  <span style={{ fontSize: 11, background: "var(--brand-soft)", color: "var(--brand)", padding: "4px 8px", borderRadius: 6, fontWeight: 600 }}>Stripe Idempotency</span>
                  <span style={{ fontSize: 11, background: "var(--blue-soft)", color: "var(--blue)", padding: "4px 8px", borderRadius: 6, fontWeight: 600 }}>Discord Scaling</span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--brand-2)", fontWeight: "700", fontSize: "14px", marginTop: "auto", paddingTop: 8 }}>
                Browse library documents
                <ChevronRightIcon size={16} />
              </div>
            </CardSpotlight>
          </Link>

          {/* 3. The Roadmap Card (Col span 1) */}
          <Link href="/roadmap" style={{ gridColumn: "span 1", display: "block" }}>
            <CardSpotlight
              style={{
                height: "100%",
                padding: "26px",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--hairline)",
                background: "var(--surface)",
                display: "flex",
                flexDirection: "column",
                gap: 12
              }}
              glowColor="rgba(245, 158, 11, 0.08)"
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--amber)" }}>
                <MapIcon size={22} />
                <span style={{ fontWeight: 700, fontSize: 16, color: "var(--ink)" }}>Roadmap</span>
              </div>
              <p style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.5, margin: 0, flex: 1 }}>
                A dynamic topological map linking Flutter frontends directly to database transactions.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--brand-2)", fontWeight: "700", fontSize: "14px", marginTop: "auto", paddingTop: 8 }}>
                View roadmap
                <ChevronRightIcon size={16} />
              </div>
            </CardSpotlight>
          </Link>

          {/* 4. The Simulator Card (Col span 1) */}
          <Link href="/simulator" style={{ gridColumn: "span 1", display: "block" }}>
            <CardSpotlight
              style={{
                height: "100%",
                padding: "26px",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--hairline)",
                background: "var(--surface)",
                display: "flex",
                flexDirection: "column",
                gap: 12
              }}
              glowColor="rgba(15, 110, 86, 0.08)"
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--teal)" }}>
                <PlayIcon size={22} />
                <span style={{ fontWeight: 700, fontSize: 16, color: "var(--ink)" }}>Simulator</span>
              </div>
              <p style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.5, margin: 0, flex: 1 }}>
                safely break services on purpose. Toggle offline POS, stress test caches, and trigger fault zones.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--brand-2)", fontWeight: "700", fontSize: "14px", marginTop: "auto", paddingTop: 8 }}>
                Launch simulator
                <ChevronRightIcon size={16} />
              </div>
            </CardSpotlight>
          </Link>
        </section>

        {/* Main Systems Interactive World Map */}
        <section>
          <div className="card" style={{ padding: "8px", borderRadius: 24, background: "var(--surface)", border: "1px solid var(--hairline)", overflow: "hidden" }}>
            <WorldMap />
          </div>
        </section>

        {/* Tech Encyclopedia Section */}
        <section className="card" style={{ padding: "26px", borderRadius: 18, border: "1px solid var(--hairline)", background: "var(--surface)" }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", marginBottom: 18, borderBottom: "1px solid var(--hairline)", paddingBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <LibraryIcon size={18} style={{ color: "var(--brand)" }} />
            Tech Reference Encyclopedia
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {ALL_TECH.map((t) => {
              const ready = !!TECH_CONTENT[t.slug];
              return ready ? (
                <Link 
                  key={t.slug} 
                  href={techHref(t.slug)} 
                  className="pill glow-spotlight-hover" 
                  style={{ 
                    background: "var(--surface-warm)", 
                    border: "1px solid var(--hairline-2)", 
                    color: "var(--ink)",
                    fontSize: 12.5, 
                    padding: "6px 14px", 
                    borderRadius: 99,
                    transition: "transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease",
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
      </div>
    </main>
  );
}
