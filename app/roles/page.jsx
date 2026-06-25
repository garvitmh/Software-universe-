import Link from "next/link";
import { ROLES } from "@/lib/content/roles";
import { ALL_TECH, ALL_CODEX_CHAPTERS } from "@/lib/curriculum";

export const metadata = {
  title: "Roles — who does what · Software Universe",
  description: "Every role in software, what each actually does day to day, the skills it needs, and exactly what to learn for it.",
};

function resolve(slug) {
  const t = ALL_TECH.find((x) => x.slug === slug);
  if (t) return { title: t.title, href: t.href };
  const c = ALL_CODEX_CHAPTERS.find((x) => x.slug === slug);
  if (c) return { title: c.title, href: c.href };
  return null;
}

const monoLabel = {
  fontFamily: "var(--font-mono)",
  fontWeight: 600,
  fontSize: 10,
  letterSpacing: ".12em",
  textTransform: "uppercase",
  color: "var(--primary)",
  marginBottom: 8,
};

export default function RolesPage() {
  const roles = Array.isArray(ROLES) ? ROLES : [];
  return (
    <div className="ed-rise" style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 32px 80px" }}>
      <div style={{ borderBottom: "2px solid var(--ink)", paddingBottom: 18, marginBottom: 8 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 10.5, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 12 }}>
          The Field · Roles
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 52, letterSpacing: "-.02em", margin: "0 0 10px" }}>Who does what</h1>
        <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--ink-2)", maxWidth: 640, margin: 0 }}>
          Software isn't one job — it's a dozen. Here's what each role actually does day to day, the skills it leans on, and
          exactly which entries to read to grow into it.
        </p>
      </div>

      {roles.map((role) => {
        const learn = (role.learn || []).map(resolve).filter(Boolean);
        return (
          <section key={role.id || role.title} style={{ padding: "30px 0", borderBottom: "1px solid var(--border)" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 28, letterSpacing: "-.01em", margin: "0 0 6px" }}>{role.title}</h2>
            {role.blurb && (
              <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 19, color: "var(--ink-2)", margin: "0 0 18px" }}>{role.blurb}</p>
            )}

            <div className="ed-two" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
              <div>
                {role.does && role.does.length > 0 && (
                  <div style={{ marginBottom: 18 }}>
                    <div style={monoLabel}>What they do</div>
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {role.does.map((d, i) => (
                        <li key={i} style={{ fontSize: 15.5, lineHeight: 1.6, color: "var(--ink-2)", marginBottom: 4 }}>{d}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {role.projects && role.projects.length > 0 && (
                  <div>
                    <div style={monoLabel}>Typical projects</div>
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {role.projects.map((p, i) => (
                        <li key={i} style={{ fontSize: 15.5, lineHeight: 1.6, color: "var(--ink-2)", marginBottom: 4 }}>{p}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div>
                {role.skills && role.skills.length > 0 && (
                  <div style={{ marginBottom: 18 }}>
                    <div style={monoLabel}>Key skills</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                      {role.skills.map((s, i) => (
                        <span key={i} style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--ink)", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 5, padding: "4px 10px" }}>{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                {learn.length > 0 && (
                  <div>
                    <div style={monoLabel}>Learn these</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px" }}>
                      {learn.map((l) => (
                        <Link key={l.href} href={l.href} style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 14, color: "var(--ink)", borderBottom: "1px solid var(--primary)" }}>
                          {l.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        );
      })}

      <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".06em", color: "var(--ink-3)", marginTop: 26 }}>
        Not sure where to start? The <Link href="/paths" style={{ color: "var(--primary)", borderBottom: "1px solid var(--primary)" }}>guided paths</Link> walk you through the foundations every role shares.
      </p>
    </div>
  );
}
