const MAP = {
  why: { bg: "var(--blue-soft)", border: "#CFE3F7", ink: "var(--blue)", label: "Why" },
  breaks: { bg: "var(--pink-soft)", border: "#F3D3DF", ink: "var(--pink)", label: "What breaks" },
  deeper: { bg: "var(--amber-soft)", border: "#F1DEB6", ink: "var(--amber)", label: "Go deeper" },
  scale: { bg: "var(--teal-soft)", border: "#B7E3D4", ink: "var(--teal)", label: "How it scales" },
  giants: { bg: "var(--purple-soft)", border: "#D8D5F3", ink: "var(--purple)", label: "How the giants do it" },
};

export default function Callout({ variant = "why", title, children }) {
  const c = MAP[variant] || MAP.why;
  return (
    <div style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 16, padding: "18px 20px", margin: "1.8rem 0" }}>
      <div style={{ marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: c.ink }}>{c.label}</span>
      </div>
      {title && <h3 style={{ fontFamily: "Inter", fontSize: 17, fontWeight: 600, letterSpacing: 0, marginBottom: 6 }}>{title}</h3>}
      <p style={{ color: "var(--ink-2)", fontSize: 15.5, lineHeight: 1.6, margin: 0 }}>{children}</p>
    </div>
  );
}
