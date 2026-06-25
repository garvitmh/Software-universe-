import Link from "next/link";
import { PATHS } from "@/lib/paths";
import PathBadge from "@/components/paths/PathBadge";

export const metadata = {
  title: "Guided paths · Software Universe",
  description: "A rope through the maze — curated, ordered routes that build one idea on the last.",
};

export default function PathsIndex() {
  return (
    <div className="ed-rise" style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 32px 80px" }}>
      <div style={{ borderBottom: "2px solid var(--ink)", paddingBottom: 18, marginBottom: 8 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 10.5, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 12 }}>
          The Curriculum · Routes
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 52, letterSpacing: "-.02em", margin: "0 0 10px" }}>Guided paths</h1>
        <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--ink-2)", maxWidth: 640, margin: 0 }}>
          A map shows you everything at once; a <em>path</em> gives you a route. Each one is an ordered walk where every stop
          builds on the last — read top to bottom and the big picture assembles itself.
        </p>
      </div>

      <div className="ed-two" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
        {PATHS.map((p, i) => (
          <Link
            key={p.id}
            href={`/paths/${p.id}`}
            className="ed-domain"
            style={{ display: "block", padding: "26px 28px", borderBottom: "1px solid var(--border)", borderRight: i % 2 === 0 ? "1px solid var(--border)" : "none" }}
          >
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, marginBottom: 6 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 10.5, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--primary)" }}>
                {p.subtitle}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                <PathBadge hrefs={p.steps.map((s) => s.href)} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)", whiteSpace: "nowrap" }}>{p.steps.length} stops</span>
              </div>
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 26, letterSpacing: "-.01em", marginBottom: 8 }}>{p.title}</div>
            <p style={{ fontSize: 15, lineHeight: 1.55, color: "var(--ink-2)", margin: "0 0 14px" }}>{p.blurb}</p>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--ink-3)", lineHeight: 1.5 }}>
              {p.steps.slice(0, 3).map((s) => s.title).join(" · ")}
              {p.steps.length > 3 ? " · …" : ""}
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 17, color: "var(--primary)", marginTop: 14 }}>Walk this path →</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
