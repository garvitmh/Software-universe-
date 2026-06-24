import Link from "next/link";

export const metadata = { title: "The Plan · Software Universe" };

const DOCS = [
  { slug: "00-MASTER-PLAN", n: "00", title: "Master Plan", desc: "The index + the synthesized, phased execution roadmap. Start here.", tint: "var(--brand-2)", soft: "var(--brand-soft)" },
  { slug: "01-VISION-PRODUCT-PEDAGOGY", n: "01", title: "Vision, Product & Pedagogy", desc: "The north star, the learner journey, the 8-lens topic model, no-quiz mechanics, learning paths.", tint: "var(--purple)", soft: "var(--purple-soft)" },
  { slug: "02-CURRICULUM-CONTENT", n: "02", title: "Curriculum & Content Architecture", desc: "The exhaustive 18-domain field map (~135 topics) + the scalable content data model.", tint: "var(--teal)", soft: "var(--teal-soft)" },
  { slug: "03-INTERACTIVE-VISUALIZATION", n: "03", title: "Interactive & Visualization", desc: "The ~40-simulator catalog, the reusable SimShell framework, the in-browser code sandbox.", tint: "var(--amber)", soft: "var(--amber-soft)" },
  { slug: "04-AI-TUTOR-RAG", n: "04", title: "AI Tutor & RAG", desc: "The Socratic tutor architecture, retrieval, generation, the 6 modes, personalization & progress.", tint: "var(--blue)", soft: "var(--blue-soft)" },
  { slug: "05-PLATFORM-ARCHITECTURE", n: "05", title: "Platform & Architecture", desc: "Folder architecture, the theme-pack design system + /design playground, search, perf, a11y, tech-debt.", tint: "var(--pink)", soft: "var(--pink-soft)" },
  { slug: "06-DATA-SOURCING-CONTENTOPS", n: "06", title: "Data, Sourcing & Content-Ops", desc: "License-safe sourcing, the deploy-safe RAG corpus, the content production pipeline.", tint: "var(--teal)", soft: "var(--teal-soft)" },
];

export default function PlanIndex() {
  return (
    <main className="wrap" style={{ paddingTop: 40, paddingBottom: 64, maxWidth: 920 }}>
      <Link href="/" style={{ fontSize: 13.5, color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 22 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
        Back to the campus
      </Link>

      <div style={{ maxWidth: 680, marginBottom: 30 }}>
        <span className="eyebrow" style={{ color: "var(--brand-2)" }}>The blueprint</span>
        <h1 style={{ fontSize: "clamp(34px, 5vw, 50px)", lineHeight: 1.05, fontWeight: 600, letterSpacing: "-.02em", marginTop: 8 }}>
          The master plan, in the open.
        </h1>
        <p style={{ fontSize: 18, color: "var(--ink-2)", marginTop: 14, lineHeight: 1.55 }}>
          The enterprise-grade plan to turn Software Universe into the answer to everything in software engineering — vision, the full curriculum, the simulators, the AI tutor, the platform, and how it all gets sourced and built. Each doc is implementation-ready.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {DOCS.map((d) => (
          <Link key={d.slug} href={`/plan/${d.slug}`}>
            <div className="card" style={{ padding: "20px 22px", height: "100%", display: "flex", flexDirection: "column", gap: 8, borderRadius: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontFamily: "JetBrains Mono", fontSize: 12, fontWeight: 700, color: d.tint, background: d.soft, borderRadius: 7, padding: "3px 8px" }}>{d.n}</span>
                <h2 style={{ fontFamily: "Fraunces", fontSize: 18, fontWeight: 600, color: "var(--ink)", lineHeight: 1.15 }}>{d.title}</h2>
              </div>
              <p style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.55, flex: 1 }}>{d.desc}</p>
              <span style={{ fontSize: 13, color: "var(--brand-2)", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 5 }}>
                Read
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
