import Link from "next/link";
import FlowMap from "@/components/FlowMap";
import HomeHero from "@/components/home/HomeHero";
import { Reveal, Tilt, Marquee, CountUp } from "@/components/Bits";
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

const STATS = [
  { to: 10, suffix: "", label: "deep chapters" },
  { to: 22, suffix: "", label: "tech deep-dives" },
  { to: 4, suffix: "", label: "live simulators" },
  { to: 1, suffix: "", label: "real codebase" },
];

const WAYS = [
  { href: "/codex/foundations", tag: "Read", title: "The Codex", grad: "var(--grad-warm)", emoji: "📖",
    desc: "Deep docs you can poke. 10 chapters on your system + a 22-page encyclopedia of every technology — what it is, why it, and when it breaks." },
  { href: "/roadmap", tag: "Map", title: "The Roadmap", grad: "var(--grad-sunset)", emoji: "🗺️",
    desc: "The whole stack as a living map. Open any node, follow the data as it flows, and step through each deep flow moment by moment." },
  { href: "/simulator", tag: "Play", title: "The Simulator", grad: "var(--grad-cool)", emoji: "🎮",
    desc: "Break it on purpose. Watch an order travel the system, drag the scaling slider to a million users, and see the architecture save the day." },
];

export default function Home() {
  return (
    <main>
      <HomeHero />

      {/* Tech marquee */}
      <section style={{ padding: "10px 0 6px" }}>
        <Marquee speed={32}>
          {ALL_TECH.map((t) => (
            <span key={t.slug} className="chip3d" style={{ whiteSpace: "nowrap" }}>{t.title}</span>
          ))}
        </Marquee>
      </section>

      {/* Stats */}
      <section className="wrap" style={{ paddingTop: 36, paddingBottom: 18 }}>
        <Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }} className="stats-grid">
            {STATS.map((s) => (
              <div key={s.label} className="sticker" style={{ padding: "20px 18px", textAlign: "center" }}>
                <div className="grad-text" style={{ fontFamily: "Fraunces", fontSize: 44, fontWeight: 700, lineHeight: 1 }}>
                  <CountUp to={s.to} suffix={s.suffix} />
                </div>
                <div style={{ fontSize: 13.5, color: "var(--muted)", marginTop: 6, fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Three ways in */}
      <section className="wrap" style={{ paddingTop: 40 }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 26 }}>
            <span className="eyebrow">Three ways in, one campus</span>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", marginTop: 8 }}>Read it, map it, or play with it.</h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }} className="ways-grid">
          {WAYS.map((w, i) => (
            <Reveal key={w.href} delay={i * 0.08}>
              <Link href={w.href}>
                <Tilt max={8} style={{ height: "100%" }}>
                  <div className="card" style={{ padding: 0, height: "100%", overflow: "hidden", borderRadius: "var(--radius-chunky)" }}>
                    <div style={{ height: 84, background: w.grad, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 22px" }}>
                      <span style={{ fontSize: 34 }}>{w.emoji}</span>
                      <span style={{ color: "#fff", fontWeight: 700, fontSize: 13, letterSpacing: ".12em", textTransform: "uppercase", background: "rgba(0,0,0,.18)", padding: "5px 12px", borderRadius: 999 }}>{w.tag}</span>
                    </div>
                    <div style={{ padding: "20px 22px 24px" }}>
                      <h3 style={{ fontFamily: "Fraunces", fontSize: 25, fontWeight: 600 }}>{w.title}</h3>
                      <p style={{ color: "var(--ink-2)", fontSize: 15, marginTop: 10, lineHeight: 1.6 }}>{w.desc}</p>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--brand-2)", fontWeight: 700, fontSize: 14.5, marginTop: 16 }}>
                        Open <Arrow />
                      </span>
                    </div>
                  </div>
                </Tilt>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* System map */}
      <section className="wrap" style={{ paddingTop: 52, paddingBottom: 10 }}>
        <Reveal>
          <div className="card" style={{ padding: "26px 22px 30px", borderRadius: "var(--radius-xl)" }}>
            <div style={{ textAlign: "center", marginBottom: 6 }}>
              <span className="eyebrow">Your system at a glance</span>
              <p className="muted" style={{ fontSize: 14, marginTop: 6 }}>
                Watch a request flow through it — the app asks, the backend decides, the database remembers.
              </p>
            </div>
            <FlowMap />
          </div>
        </Reveal>
      </section>

      {/* Learning path */}
      <section className="wrap" style={{ paddingTop: 52 }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 18 }}>
            <span className="eyebrow">Your path</span>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", marginTop: 8 }}>From the first tap to a million users.</h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }} className="path-grid">
          {PARTS.map((p, i) => (
            <Reveal key={p.n} delay={(i % 2) * 0.06}>
              <Link href={p.href}>
                <div className="card" style={{ padding: "16px 18px", display: "flex", alignItems: "center", gap: 14, borderRadius: 16, transition: "transform .16s var(--ease-bounce)" }}>
                  <span style={{ fontFamily: "JetBrains Mono", fontSize: 13, fontWeight: 700, color: "#fff", background: "var(--grad-warm)", width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{p.n}</span>
                  <span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: "var(--ink)" }}>{p.title}</span>
                  <Arrow />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Tech reference encyclopedia */}
      <section className="wrap" style={{ paddingTop: 56, paddingBottom: 20 }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <span className="eyebrow">The encyclopedia</span>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", marginTop: 8 }}>Every technology in your stack.</h2>
            <p className="muted" style={{ fontSize: 14.5, maxWidth: 580, margin: "8px auto 0", lineHeight: 1.55 }}>
              A deep page on each tool and concept — what it is, what&apos;s inside it, why it (and not the alternatives), how it works in <em>your</em> code, and exactly when it breaks.
            </p>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 14 }}>
          {TECH_SECTIONS.map((sec, i) => (
            <Reveal key={sec.id} delay={(i % 3) * 0.06}>
              <div className="card" style={{ padding: "16px 18px", height: "100%" }}>
                <div className="eyebrow" style={{ marginBottom: 11 }}>{sec.label}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {sec.items.map((it) => {
                    const ready = !!TECH_CONTENT[it.slug];
                    return ready ? (
                      <Link key={it.slug} href={techHref(it.slug)} className="chip3d">{it.title}</Link>
                    ) : (
                      <span key={it.slug} className="chip3d" style={{ color: "var(--faint)", opacity: 0.55 }}>{it.title}</span>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}

function Arrow() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}
