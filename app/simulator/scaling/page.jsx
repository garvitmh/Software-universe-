import Link from "next/link";
import ScalingSim from "@/components/ScalingSim";

export default function ScalingPage() {
  return (
    <main className="wrap-narrow" style={{ paddingTop: 44, paddingBottom: 44 }}>
      <Link href="/simulator" style={{ fontSize: 13.5, color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 22 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
        All simulators
      </Link>

      <div style={{ marginBottom: 26 }}>
        <span className="pill" style={{ background: "var(--amber-soft)", color: "var(--amber)", marginBottom: 14 }}>World 2 · The Simulator</span>
        <h1 style={{ fontSize: 38, lineHeight: 1.08, maxWidth: 600 }}>Scale it from 10 to a million.</h1>
        <p style={{ fontSize: 17, color: "var(--ink-2)", maxWidth: 600, marginTop: 14, lineHeight: 1.55 }}>
          Drag the traffic up and watch the system buckle. Then switch on the right infrastructure to bring it back to green — and notice you’re <em>adding</em> to a correct design, never rewriting it.
        </p>
      </div>

      <div className="card" style={{ padding: "26px 24px", borderRadius: "var(--radius-xl)" }}>
        <ScalingSim />
      </div>

      <div style={{ marginTop: 22, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <p className="muted" style={{ fontSize: 14 }}>Want the why behind every layer here?</p>
        <Link href="/codex/scale" className="btn btn-ghost">Read Part 09 — Scale →</Link>
      </div>
    </main>
  );
}
