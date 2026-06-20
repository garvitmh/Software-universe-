import Link from "next/link";
import OrderJourney from "@/components/OrderJourney";

export default function OrderJourneyPage() {
  return (
    <main className="wrap" style={{ paddingTop: 44, paddingBottom: 40 }}>
      <Link href="/" style={{ fontSize: 13.5, color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 22 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
        Back to the campus
      </Link>

      <div style={{ marginBottom: 30 }}>
        <span className="pill" style={{ background: "var(--teal-soft)", color: "var(--teal)", marginBottom: 14 }}>World 2 · The Simulator</span>
        <h1 style={{ fontSize: 40, lineHeight: 1.08, maxWidth: 640 }}>The journey of an order.</h1>
        <p style={{ fontSize: 18, color: "var(--ink-2)", maxWidth: 600, marginTop: 14, lineHeight: 1.55 }}>
          One order, from your tap to your door — moving through every part of your system. Press play, then click any stage to open it.
          Flip on “POS offline” to watch a disaster turn into a non-event.
        </p>
      </div>

      <div className="card" style={{ padding: "28px 26px", borderRadius: "var(--radius-xl)" }}>
        <OrderJourney />
      </div>

      <div style={{ marginTop: 22, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <p className="muted" style={{ fontSize: 14 }}>
          Want the deep version — every stage, the why, and what else we could have done?
        </p>
        <Link href="/codex/foundations" className="btn btn-ghost">Open the Codex →</Link>
      </div>
    </main>
  );
}
