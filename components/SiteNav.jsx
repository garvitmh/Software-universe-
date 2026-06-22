import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function SiteNav() {
  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "saturate(140%) blur(12px)",
        background: "color-mix(in srgb, var(--bg) 80%, transparent)",
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
              background: "var(--ink)",
              color: "var(--bg)",
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
          <NavLink href="/universe" label="Command Center" />
          <NavLink href="/codex/foundations" label="The Codex" />
          <NavLink href="/roadmap" label="The Roadmap" />
          <NavLink href="/simulator" label="The Simulator" />
          <div style={{ width: 1, height: 16, background: "var(--hairline-2)", margin: "0 4px" }} />
          <ThemeToggle />
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
