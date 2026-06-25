// Editorial callouts. Two shapes:
//  · left-rule (analogy / why / scale / giants) — a navy or bronze margin rule
//  · boxed (breaks) — a rust-bordered box, for "when it breaks"
const MAP = {
  why: { accent: "var(--primary)", label: "Why", box: false },
  deeper: { accent: "var(--primary)", label: "The analogy", box: false },
  scale: { accent: "var(--bronze)", label: "How it scales", box: false },
  giants: { accent: "var(--primary)", label: "How the giants do it", box: false },
  breaks: { accent: "var(--accent)", label: "When it breaks", box: true },
};

export default function Callout({ variant = "why", title, children }) {
  const c = MAP[variant] || MAP.why;

  if (c.box) {
    return (
      <div
        style={{
          border: `1px solid ${c.accent}`,
          borderRadius: 6,
          padding: "22px 24px",
          margin: "1.8rem 0",
          background: `color-mix(in srgb, ${c.accent} 5%, transparent)`,
        }}
      >
        <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 22, color: c.accent, marginBottom: 12 }}>
          {title || c.label}
        </div>
        <div style={{ fontSize: 16.5, lineHeight: 1.8, color: "var(--ink-2)" }}>{children}</div>
      </div>
    );
  }

  return (
    <div style={{ borderLeft: `3px solid ${c.accent}`, padding: "6px 0 6px 22px", margin: "1.8rem 0" }}>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontWeight: 600,
          fontSize: 10.5,
          letterSpacing: ".1em",
          textTransform: "uppercase",
          color: c.accent,
          marginBottom: 7,
        }}
      >
        {c.label}
      </div>
      {title && (
        <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 20, color: "var(--ink)", marginBottom: 8, lineHeight: 1.3 }}>
          {title}
        </div>
      )}
      <div style={{ fontSize: 18, lineHeight: 1.6, color: "var(--ink)" }}>{children}</div>
    </div>
  );
}
