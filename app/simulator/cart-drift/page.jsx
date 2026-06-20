import Link from "next/link";
import CartDriftSim from "@/components/CartDriftSim";

export default function CartDriftPage() {
  return (
    <main className="wrap-narrow" style={{ paddingTop: 44, paddingBottom: 44 }}>
      <Link href="/simulator" style={{ fontSize: 13.5, color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 22 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
        All simulators
      </Link>

      <div style={{ marginBottom: 26 }}>
        <span className="pill" style={{ background: "var(--purple-soft)", color: "var(--purple)", marginBottom: 14 }}>World 2 · The Simulator</span>
        <h1 style={{ fontSize: 38, lineHeight: 1.08, maxWidth: 600 }}>The cart that disagrees with itself.</h1>
        <p style={{ fontSize: 17, color: "var(--ink-2)", maxWidth: 600, marginTop: 14, lineHeight: 1.55 }}>
          The single most common bug in app development — and the fix — in one toggle. In “everyone keeps a copy”, press Remove and watch the icon, the screen, and the bill drift apart. Flip to “one source of truth” and try to break it. You can’t.
        </p>
      </div>

      <div className="card" style={{ padding: "26px 24px", borderRadius: "var(--radius-xl)" }}>
        <CartDriftSim />
      </div>

      <div style={{ marginTop: 22, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <p className="muted" style={{ fontSize: 14 }}>Why this happens, and how Riverpod fixes it in your code:</p>
        <Link href="/codex/state-management" className="btn btn-ghost">Read Part 02 — State →</Link>
      </div>
    </main>
  );
}
