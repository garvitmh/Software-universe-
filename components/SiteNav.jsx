"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

const NAV = [
  { label: "Home", href: "/", match: (p) => p === "/" },
  { label: "Curriculum", href: "/learn", match: (p) => p.startsWith("/learn") },
  { label: "Codex", href: "/codex", match: (p) => p.startsWith("/codex") },
  { label: "Simulator", href: "/simulator", match: (p) => p.startsWith("/simulator") },
  { label: "Case study", href: "/case-study", match: (p) => p.startsWith("/case-study") },
];

export default function SiteNav() {
  const path = usePathname() || "/";
  const [mac, setMac] = useState(false);

  useEffect(() => {
    setMac(typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform));
  }, []);

  const openProfessor = () => window.dispatchEvent(new CustomEvent("toggle-rag-drawer"));

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "saturate(140%) blur(12px)",
        background: "color-mix(in srgb, var(--bg) 86%, transparent)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          height: 62,
          padding: "0 32px",
          display: "flex",
          alignItems: "center",
          gap: 28,
        }}
      >
        {/* Wordmark */}
        <Link href="/" style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontWeight: 600,
              fontSize: 22,
              letterSpacing: "-.01em",
              color: "var(--ink)",
            }}
          >
            Software Universe
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontWeight: 600,
              fontSize: 9.5,
              letterSpacing: ".16em",
              textTransform: "uppercase",
              color: "var(--ink-3)",
            }}
          >
            est. 2026
          </span>
        </Link>

        {/* Sections */}
        <div style={{ display: "flex", gap: 2, marginLeft: 8 }}>
          {NAV.map((n) => {
            const active = n.match(path);
            return (
              <Link
                key={n.label}
                href={n.href}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontWeight: 600,
                  fontSize: 11,
                  letterSpacing: ".12em",
                  textTransform: "uppercase",
                  color: active ? "var(--ink)" : "var(--ink-3)",
                  padding: "8px 13px",
                  borderBottom: `2px solid ${active ? "var(--ink)" : "transparent"}`,
                }}
              >
                {n.label}
              </Link>
            );
          })}
        </div>

        {/* Right cluster */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={openProfessor}
            title="Ask the Professor"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              border: "1px solid var(--border-2)",
              background: "var(--surface)",
              color: "var(--ink-2)",
              fontFamily: "var(--font-body)",
              fontWeight: 500,
              fontSize: 13,
              padding: "8px 13px",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            <span style={{ fontStyle: "italic", fontFamily: "var(--font-display)", color: "var(--primary)" }}>
              Ask the Professor
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontWeight: 600,
                fontSize: 10,
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                borderRadius: 4,
                padding: "2px 6px",
                color: "var(--ink-3)",
              }}
            >
              {mac ? "⌘K" : "Ctrl K"}
            </span>
          </button>

          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
