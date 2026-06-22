import React from "react";
import Link from "next/link";

export default function WorldHero({ world }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <Link href="/" style={{ fontSize: 13.5, color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M11 6l-6 6 6 6" />
        </svg>
        Back to the campus
      </Link>
      
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span className="pill" style={{ background: "var(--brand-soft)", color: "var(--brand-2)", width: "fit-content" }}>
          Systems World Explorer
        </span>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 44px)", lineHeight: 1.08, fontWeight: 700, letterSpacing: "-.015em" }}>
          {world.title}
        </h1>
        <p style={{ fontSize: 17, color: "var(--ink-2)", marginTop: 6, lineHeight: 1.5, maxWidth: 800 }}>
          {world.desc}
        </p>
      </div>
    </div>
  );
}
