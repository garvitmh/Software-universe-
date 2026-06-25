"use client";

import Link from "next/link";
import Armillary from "@/components/home/Armillary";
import ContinueReading from "@/components/home/ContinueReading";

const FOUR_Q = [
  { tag: "What", text: "What it actually is, in plain language.", color: "var(--primary)" },
  { tag: "Why", text: "Why it's built this way — and the alternatives.", color: "var(--primary)" },
  { tag: "How", text: "How it works under the hood, step by step.", color: "var(--primary)" },
  { tag: "When it breaks", text: "Where it fails, and what failure looks like.", color: "var(--accent)" },
];

const MODES = [
  { icon: "❦", title: "Read", desc: "Plain-language entries. No term left unexplained.", href: "/codex/foundations" },
  { icon: "◷", title: "See", desc: "Demonstrations of systems running, scaling, failing.", href: "/simulator" },
  { icon: "✑", title: "Practice", desc: "A patterns-first lab — recognise, then solve.", href: "/dsa" },
  { icon: "✦", title: "Ask", desc: "A Socratic professor in the margin of every page.", professor: true },
];

const askProfessor = () => window.dispatchEvent(new CustomEvent("toggle-rag-drawer"));

const WRAP = { maxWidth: 1200, margin: "0 auto", padding: "0 32px" };

export default function Home() {
  return (
    <div className="ed-rise">
      {/* Masthead line */}
      <div style={WRAP}>
        <div
          style={{
            borderBottom: "1px solid var(--border)",
            padding: "14px 0 10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "var(--font-mono)",
            fontWeight: 600,
            fontSize: 10.5,
            letterSpacing: ".14em",
            textTransform: "uppercase",
            color: "var(--ink-3)",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <span>Vol. I — The Complete Curriculum</span>
          <span>A visual field guide to software</span>
        </div>
      </div>

      {/* Hero */}
      <div
        className="ed-hero"
        style={{
          ...WRAP,
          padding: "46px 32px 26px",
          display: "grid",
          gridTemplateColumns: "1.08fr .92fr",
          gap: 48,
          alignItems: "center",
        }}
      >
        <div>
          <h1
            className="ed-h1"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              fontSize: 72,
              lineHeight: 1.0,
              letterSpacing: "-.02em",
              margin: "0 0 22px",
            }}
          >
            Software,
            <br />
            <span style={{ fontStyle: "italic", color: "var(--primary)" }}>finally understood.</span>
          </h1>
          <p style={{ fontSize: 20, lineHeight: 1.65, color: "var(--ink-2)", maxWidth: 520, margin: "0 0 30px" }}>
            <span
              style={{
                float: "left",
                fontFamily: "var(--font-display)",
                fontSize: 62,
                lineHeight: 0.78,
                fontWeight: 500,
                padding: "6px 12px 0 0",
                color: "var(--ink)",
              }}
            >
              A
            </span>
            visual, AI-guided way to learn how real systems work — across every domain, from your first line of code
            to planet-scale. Read it, watch it run, and break it on purpose.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link
              href="/learn"
              style={{
                background: "var(--ink)",
                color: "var(--bg)",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                fontSize: 15,
                padding: "14px 26px",
                borderRadius: 6,
              }}
            >
              Begin the curriculum →
            </Link>
            <Link
              href="/codex/foundations"
              style={{
                border: "1px solid var(--border-2)",
                background: "var(--surface)",
                color: "var(--ink)",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                fontSize: 15,
                padding: "14px 26px",
                borderRadius: 6,
              }}
            >
              Read an entry
            </Link>
          </div>
        </div>

        <figure className="ed-hero-fig" style={{ margin: 0 }}>
          <div
            style={{
              position: "relative",
              height: 380,
              border: "1px solid var(--border)",
              borderRadius: 8,
              overflow: "hidden",
              background: "var(--surface)",
              boxShadow: "var(--shadow)",
            }}
          >
            <Armillary />
          </div>
          <figcaption
            style={{
              fontFamily: "var(--font-mono)",
              fontWeight: 500,
              fontSize: 11,
              letterSpacing: ".06em",
              color: "var(--ink-3)",
              marginTop: 10,
              textAlign: "center",
            }}
          >
            Fig. 1 — A system, rendered as an armillary. Every ring a layer.
          </figcaption>
        </figure>
      </div>

      {/* Continue reading — only for returning learners */}
      <ContinueReading />

      {/* Four questions */}
      <div style={{ ...WRAP, marginTop: 30 }}>
        <div style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "8px 0" }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontWeight: 600,
              fontSize: 10.5,
              letterSpacing: ".14em",
              textTransform: "uppercase",
              color: "var(--ink-3)",
              padding: "8px 0",
            }}
          >
            Every entry answers four questions
          </div>
          <div className="ed-quad" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
            {FOUR_Q.map((q) => (
              <div key={q.tag} style={{ padding: "16px 22px 18px", borderLeft: "1px solid var(--border)" }}>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontStyle: "italic",
                    fontSize: 24,
                    color: q.color,
                    marginBottom: 6,
                  }}
                >
                  {q.tag}
                </div>
                <div style={{ fontSize: 15, lineHeight: 1.5, color: "var(--ink-2)" }}>{q.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Four ways to study */}
      <div style={{ ...WRAP, marginTop: 42 }}>
        <h2
          style={{
            fontFamily: "var(--font-mono)",
            fontWeight: 600,
            fontSize: 11,
            letterSpacing: ".16em",
            textTransform: "uppercase",
            color: "var(--ink-3)",
            margin: "0 0 18px",
          }}
        >
          Four ways to study
        </h2>
        <div className="ed-quad" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderTop: "1px solid var(--border)" }}>
          {MODES.map((m) => {
            const inner = (
              <>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 30, marginBottom: 12 }}>{m.icon}</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 22, marginBottom: 6 }}>
                  {m.title}
                </div>
                <div style={{ fontSize: 14.5, lineHeight: 1.55, color: "var(--ink-2)" }}>{m.desc}</div>
              </>
            );
            const cellStyle = {
              cursor: "pointer",
              padding: "22px 24px 26px",
              borderRight: "1px solid var(--border)",
              color: "inherit",
              display: "block",
              textAlign: "left",
              width: "100%",
              background: "transparent",
              fontFamily: "var(--font-body)",
            };
            return m.professor ? (
              <button key={m.title} className="ed-mode" onClick={askProfessor} style={{ ...cellStyle, border: "none", borderRight: "1px solid var(--border)" }}>
                {inner}
              </button>
            ) : (
              <Link key={m.title} href={m.href} className="ed-mode" style={cellStyle}>
                {inner}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Curriculum CTA */}
      <div style={{ ...WRAP, margin: "44px auto 80px" }}>
        <Link
          href="/learn"
          className="ed-domain"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 30,
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "34px 36px",
            background: "var(--surface)",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontWeight: 600,
                fontSize: 10.5,
                letterSpacing: ".14em",
                textTransform: "uppercase",
                color: "var(--primary)",
                marginBottom: 10,
              }}
            >
              The curriculum
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 34, letterSpacing: "-.01em", marginBottom: 6 }}>
              Eleven domains. One ladder, climbed eleven times.
            </div>
            <div style={{ fontSize: 16, color: "var(--ink-2)" }}>From one machine to a million users — read where you are.</div>
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 20, color: "var(--primary)", whiteSpace: "nowrap" }}>
            Open the map →
          </div>
        </Link>
      </div>
    </div>
  );
}
