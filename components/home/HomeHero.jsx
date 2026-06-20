"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const Hero3D = dynamic(() => import("@/components/home/Hero3D"), {
  ssr: false,
  loading: () => <HeroFallback />,
});

function HeroFallback() {
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center" }}>
      <div style={{ width: 120, height: 120, borderRadius: "50%", background: "var(--grad-warm)", filter: "blur(2px)", opacity: 0.3 }} />
    </div>
  );
}

export default function HomeHero() {
  return (
    <section style={{ padding: "20px 0" }}>
      <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
        <div className="card" style={{ padding: "30px", display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 24, alignItems: "center", minHeight: 380, borderRadius: "var(--radius-xl)" }}>
          {/* Left — copy */}
          <div>
            <span className="eyebrow" style={{ marginBottom: 12, display: "inline-block" }}>
              Welcome to the System
            </span>
            <h1 style={{ fontSize: "clamp(32px, 5vw, 48px)", lineHeight: 1.1, fontWeight: 600, letterSpacing: "-.02em" }}>
              Your codebase, <br />
              <span className="grad-text" style={{ fontStyle: "italic" }}>finally explained.</span>
            </h1>
            <p style={{ fontSize: 16, color: "var(--ink-2)", maxWidth: 480, marginTop: 16, lineHeight: 1.55 }}>
              A complete map of your Burger Farm architecture. Explore the Codex, step through the interactive Roadmap, or safely break things in the Simulator.
            </p>
            <div style={{ display: "flex", gap: 14, marginTop: 24, flexWrap: "wrap" }}>
              <Link href="/simulator" className="btn btn-pop" style={{ fontSize: 15, padding: "12px 20px", borderRadius: 12 }}>
                Enter the Simulator
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </Link>
              <Link href="/roadmap" className="btn btn-ghost" style={{ fontSize: 15, padding: "12px 20px", borderRadius: 12, borderWidth: 1.5 }}>
                View the Roadmap
              </Link>
            </div>
          </div>

          {/* Right — 3D retro computer */}
          <div style={{ height: 380, cursor: "grab", background: "var(--surface-warm)", borderRadius: 16, border: "1px solid var(--hairline)" }} className="hero-3d">
            <Hero3D />
          </div>
        </div>
      </div>
    </section>
  );
}
