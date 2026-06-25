import Link from "next/link";
import { DOMAINS, DEPTH_LADDER, DOMAIN_LADDER } from "@/lib/domains";

export const metadata = {
  title: "The Learn Map — the curriculum · Software Universe",
  description:
    `${DOMAINS.length} domains, each climbing the same four-tier ladder — local, production, enterprise, planet-scale.`,
};

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX"];
const TIERS = DEPTH_LADDER.map((d) => d.label);

export default function LearnMapPage() {
  return (
    <div className="ed-rise" style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 32px 80px" }}>
      {/* Header */}
      <div style={{ borderBottom: "2px solid var(--ink)", paddingBottom: 18, marginBottom: 8 }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontWeight: 600,
            fontSize: 10.5,
            letterSpacing: ".16em",
            textTransform: "uppercase",
            color: "var(--ink-3)",
            marginBottom: 12,
          }}
        >
          The Curriculum · Contents
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 52, letterSpacing: "-.02em", margin: "0 0 10px" }}>
          The Learn Map
        </h1>
        <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--ink-2)", maxWidth: 640, margin: 0 }}>
          {DOMAINS.length} domains, each climbing the same four-tier ladder — <em>local, production, enterprise, planet-scale</em>.
          The depth bars show how far each reaches today.
        </p>
      </div>

      {/* Domains ledger grid */}
      <div className="ed-two" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
        {DOMAINS.map((dom, i) => {
          const live = dom.topics.filter((t) => t.status === "live").length;
          const ladder = DOMAIN_LADDER[dom.id] || [0, 0, 0, 0];
          const firstLive = dom.topics.find((t) => t.status === "live" && t.href);
          return (
            <section
              key={dom.id}
              className="ed-domain"
              style={{ padding: "24px 28px", borderBottom: "1px solid var(--border)", borderRight: "1px solid var(--border)" }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 8 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 13, color: "var(--ink-3)" }}>
                  {ROMAN[i]}.
                </span>
                <div style={{ flex: 1 }}>
                  {firstLive ? (
                    <Link href={firstLive.href} style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 24, lineHeight: 1.05, letterSpacing: "-.01em", color: "var(--ink)" }}>
                      {dom.title}
                    </Link>
                  ) : (
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 24, lineHeight: 1.05, letterSpacing: "-.01em" }}>
                      {dom.title}
                    </span>
                  )}
                </div>
                <span style={{ fontFamily: "var(--font-mono)", fontWeight: 500, fontSize: 12, color: "var(--ink-3)", whiteSpace: "nowrap" }}>
                  {live}/{dom.topics.length}
                </span>
              </div>

              <p style={{ fontSize: 15, lineHeight: 1.55, color: "var(--ink-2)", margin: "0 0 16px 34px" }}>{dom.tagline}</p>

              <div style={{ marginLeft: 34 }}>
                {/* depth ladder */}
                <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
                  {ladder.map((pct, k) => (
                    <div key={k} title={`${TIERS[k]} — ${pct}%`} style={{ flex: 1, height: 4, background: "var(--surface-2)", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: "var(--primary)" }} />
                    </div>
                  ))}
                </div>

                {/* topic tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "5px 14px" }}>
                  {dom.topics.map((t, k) =>
                    t.status === "live" && t.href ? (
                      <Link
                        key={k}
                        href={t.href}
                        style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 13, color: "var(--ink)", borderBottom: "1px solid var(--primary)" }}
                      >
                        {t.t}
                      </Link>
                    ) : (
                      <span
                        key={k}
                        title="On the way"
                        style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 13, color: "var(--ink-3)" }}
                      >
                        {t.t}
                      </span>
                    )
                  )}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".06em", color: "var(--ink-3)", marginTop: 30 }}>
        Don't know a word along the way? Press ⌘/Ctrl&nbsp;K anywhere to ask the Professor.
      </p>
    </div>
  );
}
