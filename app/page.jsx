import Link from "next/link";
import FlowMap from "@/components/FlowMap";

const PARTS = [
  { n: "01", title: "Foundations — how it all fits together", status: "open", href: "/codex/foundations" },
  { n: "02", title: "The thinking tools — layers & state", status: "open", href: "/codex/layers-and-separation" },
  { n: "03", title: "Your Flutter app, layer by layer", status: "open", href: "/codex/flutter-app" },
  { n: "04", title: "The backend — the brain", status: "open", href: "/codex/backend" },
  { n: "05", title: "The database — the memory", status: "open", href: "/codex/database" },
  { n: "06", title: "The admin panel — the control room", status: "open", href: "/codex/admin-panel" },
  { n: "07", title: "The burger builder & motion engine", status: "open", href: "/codex/burger-builder" },
  { n: "08", title: "Big systems — payments, orders, loyalty, delivery", status: "open", href: "/codex/big-systems" },
  { n: "09", title: "Enterprise plumbing & scale — caching, queues, a million users", status: "soon" },
  { n: "10", title: "Deployment & ops — Docker, Kubernetes, the lot", status: "soon" },
];

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="wrap" style={{ paddingTop: 64, paddingBottom: 24, textAlign: "center" }}>
        <div className="fade-up">
          <span className="pill" style={{ marginBottom: 18 }}>
            <span className="tag-dot" style={{ background: "var(--brand)" }} />
            Built on your real Burger Farm codebase
          </span>
          <h1 style={{ fontSize: 54, lineHeight: 1.04, maxWidth: 760, margin: "0 auto", fontWeight: 600 }}>
            Your codebase,
            <br />
            <span style={{ color: "var(--brand)" }}>explained.</span>
          </h1>
          <p style={{ fontSize: 19, color: "var(--ink-2)", maxWidth: 580, margin: "20px auto 0", lineHeight: 1.55 }}>
            From zero to architect — the app, the backend, the database, the admin, and the reasoning behind every decision.
            Not documentation. A universe you explore.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 28, flexWrap: "wrap" }}>
            <Link href="/simulator/order-journey" className="btn btn-primary">
              Enter the Simulator
              <Arrow />
            </Link>
            <Link href="/codex/foundations" className="btn btn-ghost">
              Open the Codex
            </Link>
          </div>
        </div>
      </section>

      {/* System map */}
      <section className="wrap" style={{ paddingTop: 28, paddingBottom: 28 }}>
        <div className="card" style={{ padding: "26px 22px 30px", borderRadius: "var(--radius-xl)" }}>
          <div style={{ textAlign: "center", marginBottom: 6 }}>
            <span className="eyebrow">Your system at a glance</span>
            <p className="muted" style={{ fontSize: 14, marginTop: 6 }}>
              Watch a request flow through it — the app asks, the backend decides, the database remembers. Click any part to explore.
            </p>
          </div>
          <FlowMap />
        </div>
      </section>

      {/* Two worlds */}
      <section className="wrap" style={{ paddingTop: 36, paddingBottom: 10 }}>
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <span className="eyebrow">Two worlds, one campus</span>
          <h2 style={{ fontSize: 30, marginTop: 8 }}>Read it, or experience it.</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <WorldCard
            href="/codex/foundations"
            badge="World 1"
            tint="var(--amber-soft)"
            ink="var(--amber)"
            icon={<BookIcon />}
            title="The Codex"
            desc="The deep library. Every domain explained in plain language, simple → deep, wall-to-wall diagrams. The why, the what-else, and what breaks when it goes wrong."
            cta="Open the Codex"
          />
          <WorldCard
            href="/simulator/order-journey"
            badge="World 2"
            tint="var(--teal-soft)"
            ink="var(--teal)"
            icon={<PlayIcon />}
            title="The Simulator"
            desc="See it move. Watch an order travel the whole system, drag the sliders, and trigger the disasters — crash the database, fail a payment — then watch how we save it."
            cta="Enter the Simulator"
          />
        </div>
      </section>

      {/* Learning path */}
      <section className="wrap" style={{ paddingTop: 44 }}>
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <span className="eyebrow">Your path</span>
          <h2 style={{ fontSize: 30, marginTop: 8 }}>From the first tap to a million users.</h2>
        </div>
        <div className="card" style={{ padding: 10 }}>
          {PARTS.map((p, i) => (
            <PartRow key={p.n} part={p} last={i === PARTS.length - 1} />
          ))}
        </div>
      </section>
    </main>
  );
}

function WorldCard({ href, badge, tint, ink, icon, title, desc, cta }) {
  return (
    <Link href={href}>
      <div
        className="card"
        style={{
          padding: "26px 24px",
          height: "100%",
          borderRadius: "var(--radius-xl)",
          transition: "transform .18s ease, box-shadow .25s ease",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <span style={{ width: 46, height: 46, borderRadius: 13, background: tint, color: ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {icon}
          </span>
          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--faint)" }}>{badge}</span>
        </div>
        <h3 style={{ fontFamily: "Fraunces", fontSize: 26, fontWeight: 600 }}>{title}</h3>
        <p style={{ color: "var(--ink-2)", fontSize: 15.5, marginTop: 10, lineHeight: 1.6, flex: 1 }}>{desc}</p>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--brand-2)", fontWeight: 600, fontSize: 15, marginTop: 18 }}>
          {cta} <Arrow />
        </span>
      </div>
    </Link>
  );
}

function PartRow({ part, last }) {
  const open = part.status === "open";
  const inner = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 14px",
        borderBottom: last ? "none" : "1px solid var(--hairline)",
        borderRadius: 12,
        background: open ? "var(--brand-soft)" : "transparent",
      }}
    >
      <span style={{ fontSize: 13, fontWeight: 600, width: 22, color: open ? "var(--brand-2)" : "var(--faint)" }}>{part.n}</span>
      <span style={{ flex: 1, fontSize: 15, fontWeight: open ? 600 : 500, color: open ? "var(--ink)" : "var(--ink-2)" }}>{part.title}</span>
      {open ? (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--brand-2)", fontSize: 13, fontWeight: 600 }}>
          Start <Arrow />
        </span>
      ) : (
        <span style={{ fontSize: 12, color: "var(--faint)" }}>soon</span>
      )}
    </div>
  );
  return open ? <Link href={part.href}>{inner}</Link> : inner;
}

function Arrow() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}
function BookIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5a2 2 0 0 1 2-2h11v17H6a2 2 0 0 0-2 2z" /><path d="M17 3h1a2 2 0 0 1 2 2v15" /></svg>;
}
function PlayIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M10 8.5l6 3.5-6 3.5z" fill="currentColor" /></svg>;
}
