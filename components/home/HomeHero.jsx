"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { SplitText, Magnetic, Aurora } from "@/components/Bits";

const Hero3D = dynamic(() => import("@/components/home/Hero3D"), {
  ssr: false,
  loading: () => <HeroFallback />,
});

function HeroFallback() {
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center" }}>
      <div style={{ width: 120, height: 120, borderRadius: "50%", background: "var(--grad-warm)", filter: "blur(2px)", animation: "floaty 3s ease-in-out infinite" }} />
    </div>
  );
}

export default function HomeHero() {
  return (
    <section style={{ position: "relative", overflow: "hidden", paddingTop: 36, paddingBottom: 30 }}>
      <Aurora />
      <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.05fr .95fr", gap: 24, alignItems: "center", minHeight: 460 }} className="hero-grid">
          {/* Left — copy */}
          <div>
            <span className="pill" style={{ marginBottom: 20, background: "var(--surface)", border: "1.5px solid var(--hairline-2)" }}>
              <span className="tag-dot" style={{ background: "var(--brand)" }} />
              Built on your real Burger Farm codebase
            </span>
            <h1 style={{ fontSize: "clamp(40px, 6vw, 72px)", lineHeight: 1.02, fontWeight: 600, letterSpacing: "-.02em" }}>
              <SplitText text="Your codebase," />
              <br />
              <span className="grad-text" style={{ fontStyle: "italic" }}>
                <SplitText text="finally explained." delay={0.25} />
              </span>
            </h1>
            <p style={{ fontSize: 19, color: "var(--ink-2)", maxWidth: 480, marginTop: 22, lineHeight: 1.55 }}>
              Don&apos;t read about your app — <strong>play with it.</strong> Three worlds: deep docs you can poke, a living map of the whole stack, and simulators where you break things on purpose.
            </p>
            <div style={{ display: "flex", gap: 14, marginTop: 30, flexWrap: "wrap" }}>
              <Magnetic>
                <Link href="/simulator" className="btn btn-pop" style={{ fontSize: 16, padding: "14px 24px", borderRadius: 16 }}>
                  Enter the Simulator
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </Link>
              </Magnetic>
              <Magnetic strength={0.3}>
                <Link href="/roadmap" className="btn btn-ghost" style={{ fontSize: 16, padding: "14px 24px", borderRadius: 16, borderWidth: 1.5 }}>
                  Walk the roadmap
                </Link>
              </Magnetic>
            </div>
          </div>

          {/* Right — 3D burger */}
          <div style={{ height: 460, cursor: "grab" }} className="hero-3d">
            <Hero3D />
          </div>
        </div>
      </div>
    </section>
  );
}
