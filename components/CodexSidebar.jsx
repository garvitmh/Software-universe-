"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CODEX_PARTS, TECH_SECTIONS, codexHref, techHref } from "@/lib/curriculum";

export default function CodexSidebar({ readyTech = [] }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const ready = new Set(readyTech);

  const close = () => setOpen(false);

  return (
    <>
      <button className="codex-menu-btn" onClick={() => setOpen((v) => !v)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
        Contents
      </button>

      <aside className={`codex-sidebar${open ? " open" : ""}`}>
        <div className="side-section-label">The Codex · the system</div>
        {CODEX_PARTS.map((part) => (
          <div key={part.n}>
            <div className="side-group-label">
              <span className="side-group-num">{part.n}</span>
              {part.group}
            </div>
            {part.chapters.map((c) => {
              const href = codexHref(c.slug);
              const active = path === href;
              return (
                <Link key={c.slug} href={href} className={`side-link${active ? " active" : ""}`} onClick={close}>
                  {c.title}
                </Link>
              );
            })}
          </div>
        ))}

        <div className="side-section-label" style={{ marginTop: 26 }}>Tech reference · the encyclopedia</div>
        {TECH_SECTIONS.map((sec) => (
          <div key={sec.id}>
            <div className="side-group-label">{sec.label}</div>
            {sec.items.map((it) => {
              const isReady = ready.has(it.slug);
              const href = techHref(it.slug);
              const active = path === href;
              if (!isReady) {
                return (
                  <span key={it.slug} className="side-link soon">
                    {it.title}
                    <span className="side-soon-tag">soon</span>
                  </span>
                );
              }
              return (
                <Link key={it.slug} href={href} className={`side-link${active ? " active" : ""}`} onClick={close}>
                  {it.title}
                </Link>
              );
            })}
          </div>
        ))}

        <div style={{ marginTop: 26, padding: "0 10px" }}>
          <Link href="/codex/library" className="side-link" onClick={close} style={{ color: "var(--purple)", fontWeight: 600 }}>
            → The engineering library
          </Link>
          <Link href="/roadmap" className="side-link" onClick={close} style={{ color: "var(--brand-2)", fontWeight: 600 }}>
            → The interactive roadmap
          </Link>
          <Link href="/simulator" className="side-link" onClick={close} style={{ color: "var(--teal)", fontWeight: 600 }}>
            → The simulators
          </Link>
        </div>
      </aside>
    </>
  );
}
