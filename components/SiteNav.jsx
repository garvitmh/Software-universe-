import Link from "next/link";

export default function SiteNav() {
  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "saturate(140%) blur(10px)",
        background: "rgba(251,247,238,.82)",
        borderBottom: "1px solid var(--hairline)",
      }}
    >
      <div
        className="wrap"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 62,
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <span
            style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              background: "#2A1B0E",
              color: "#F6924E",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 17,
            }}
          >
            ✦
          </span>
          <span style={{ fontWeight: 600, fontSize: 15.5, letterSpacing: "-.01em" }}>
            Software&nbsp;Universe
          </span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <NavLink href="/codex/foundations" label="The Codex" />
          <NavLink href="/simulator/order-journey" label="The Simulator" />
          <span
            style={{
              marginLeft: 8,
              fontSize: 12.5,
              color: "var(--faint)",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span className="tag-dot" style={{ background: "var(--brand)" }} />
            Lesson 1 / ~40
          </span>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, label }) {
  return (
    <Link
      href={href}
      style={{
        fontSize: 14,
        fontWeight: 500,
        color: "var(--ink-2)",
        padding: "8px 12px",
        borderRadius: 10,
      }}
    >
      {label}
    </Link>
  );
}
