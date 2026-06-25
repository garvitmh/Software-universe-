import Link from "next/link";
import { CODEX_PARTS, TECH_SECTIONS, codexHref, techHref } from "@/lib/curriculum";
import { TECH_CONTENT } from "@/lib/tech-content";
import { stats } from "@/lib/content/repository";

export const metadata = {
  title: "The Codex — contents · Software Universe",
  description: "Read the system front to back, or look up any one technology. The full table of contents.",
};

const underline = {
  fontFamily: "var(--font-body)",
  fontWeight: 500,
  fontSize: 15,
  color: "var(--ink)",
  borderBottom: "1px solid var(--primary)",
  lineHeight: 1.5,
};

export default function CodexIndex() {
  const ready = TECH_CONTENT;
  const s = stats();
  const byNumbers = [
    [s.entries, "entries"],
    [s.terms, "glossary terms"],
    [s.paths, "guided paths"],
    [s.topicsLive, "live topics"],
  ];
  return (
    <main style={{ maxWidth: 760, paddingTop: 40, paddingBottom: 60 }}>
      <div style={{ borderBottom: "2px solid var(--ink)", paddingBottom: 18, marginBottom: 26 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 10.5, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 12 }}>
          Vol. I · The Codex
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 52, letterSpacing: "-.02em", margin: "0 0 10px" }}>Contents</h1>
        <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--ink-2)", margin: "0 0 16px" }}>
          Two ways through: read the system front to back, or look up any one technology. Every term is a link; press ⌘/Ctrl&nbsp;K to ask the Professor anywhere.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 22px" }}>
          {byNumbers.map(([num, label]) => (
            <span key={label} style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".04em", color: "var(--ink-3)" }}>
              <span style={{ color: "var(--primary)", fontWeight: 600 }}>{num}</span> {label}
            </span>
          ))}
        </div>
      </div>

      {/* The system, in order */}
      <h2 style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--ink-3)", margin: "0 0 6px" }}>
        The system, in order
      </h2>
      <div style={{ borderTop: "1px solid var(--border)" }}>
        {CODEX_PARTS.map((part) => (
          <div key={part.n} style={{ display: "grid", gridTemplateColumns: "44px 1fr", gap: 16, padding: "16px 0", borderBottom: "1px solid var(--border)" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 13, color: "var(--ink-3)" }}>{part.n}</span>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 20, marginBottom: 6 }}>{part.group}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 18px" }}>
                {part.chapters.map((c) => (
                  <Link key={c.slug} href={codexHref(c.slug)} style={underline}>
                    {c.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* The reference */}
      <h2 style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--ink-3)", margin: "44px 0 6px" }}>
        The reference · every technology
      </h2>
      <div style={{ borderTop: "1px solid var(--border)" }}>
        {TECH_SECTIONS.map((sec) => (
          <div key={sec.id} style={{ padding: "16px 0", borderBottom: "1px solid var(--border)" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--primary)", marginBottom: 10 }}>
              {sec.label}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 18px" }}>
              {sec.items.map((it) =>
                ready[it.slug] ? (
                  <Link key={it.slug} href={techHref(it.slug)} style={underline}>
                    {it.title}
                  </Link>
                ) : (
                  <span key={it.slug} style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 15, color: "var(--ink-3)" }}>
                    {it.title}
                  </span>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
