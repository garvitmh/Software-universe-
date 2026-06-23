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
              Learn software — from one machine to a million users
            </span>
            <h1 style={{ fontSize: "clamp(32px, 5vw, 48px)", lineHeight: 1.1, fontWeight: 600, letterSpacing: "-.02em" }}>
              Software, <br />
              <span className="grad-text" style={{ fontStyle: "italic" }}>finally understood.</span>
            </h1>
            <p style={{ fontSize: 16, color: "var(--ink-2)", maxWidth: 480, marginTop: 16, lineHeight: 1.55 }}>
              A visual, AI-guided way to learn how real systems work — across every domain, from your first line of code to planet-scale. Read it, watch it run, and break it on purpose. Stuck on a word? Ask the assistant, anywhere.
            </p>
            
            {/* Interactive Socratic Search Input */}
            <div style={{ marginTop: 20, maxWidth: 480 }}>
              <div 
                style={{ 
                  display: "flex", 
                  background: "var(--surface-warm)", 
                  border: "1px solid var(--hairline-2)", 
                  borderRadius: 14, 
                  padding: "8px 8px 8px 14px", 
                  alignItems: "center", 
                  gap: 10,
                  boxShadow: "0 2px 8px -2px rgba(60,40,15,0.05)"
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ color: "var(--muted)" }}>
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input 
                  type="text" 
                  placeholder="Ask Socratic RAG: What is backpressure?" 
                  style={{ 
                    border: "none", 
                    background: "transparent", 
                    outline: "none", 
                    fontSize: "14px", 
                    color: "var(--ink)", 
                    flex: 1 
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      const queryText = e.target.value.trim();
                      window.dispatchEvent(new CustomEvent("toggle-rag-drawer"));
                      setTimeout(() => {
                        const drawerInput = document.querySelector('input[placeholder^="Ask the Universe"]');
                        if (drawerInput) {
                          // Change value programmatically and trigger event
                          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                          nativeInputValueSetter.call(drawerInput, queryText);
                          
                          const event = new Event('input', { bubbles: true });
                          drawerInput.dispatchEvent(event);
                          
                          const form = drawerInput.closest('form');
                          if (form) {
                            const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                            form.dispatchEvent(submitEvent);
                          }
                        }
                      }, 350);
                      e.target.value = '';
                    }
                  }}
                />
                <span style={{ fontSize: "10.5px", color: "var(--muted)", background: "var(--bg-2)", padding: "4px 8px", borderRadius: 6, fontWeight: 600 }}>Enter</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: 14, marginTop: 24, flexWrap: "wrap" }}>
              <Link href="/learn" className="btn btn-pop" style={{ fontSize: 15, padding: "12px 20px", borderRadius: 12 }}>
                Start with the map
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </Link>
              <Link href="/simulator" className="btn btn-ghost" style={{ fontSize: 15, padding: "12px 20px", borderRadius: 12, borderWidth: 1.5 }}>
                Enter the Simulator
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
