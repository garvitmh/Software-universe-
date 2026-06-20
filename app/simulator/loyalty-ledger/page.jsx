import Link from "next/link";
import LoyaltyLedgerSim from "@/components/LoyaltyLedgerSim";

export default function LoyaltyLedgerPage() {
  return (
    <main className="wrap-narrow" style={{ paddingTop: 44, paddingBottom: 44 }}>
      <Link href="/simulator" style={{ fontSize: 13.5, color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 22 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
        All simulators
      </Link>

      <div style={{ marginBottom: 26 }}>
        <span className="pill" style={{ background: "var(--brand-soft)", color: "var(--brand-2)", marginBottom: 14 }}>World 2 · The Simulator</span>
        <h1 style={{ fontSize: 38, lineHeight: 1.08, maxWidth: 600 }}>Points done the way banks do money.</h1>
        <p style={{ fontSize: 17, color: "var(--ink-2)", maxWidth: 600, marginTop: 14, lineHeight: 1.55 }}>
          Earn and redeem, and watch every movement land on an append-only ledger — the balance is just the running total. Then hit <strong>Retry last order</strong> and see the idempotency key refuse to credit you twice.
        </p>
      </div>

      <div className="card" style={{ padding: "26px 24px", borderRadius: "var(--radius-xl)" }}>
        <LoyaltyLedgerSim />
      </div>

      <div style={{ marginTop: 22, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <p className="muted" style={{ fontSize: 14 }}>The real schema behind this — ledgers, idempotency, optimistic concurrency:</p>
        <Link href="/codex/big-systems" className="btn btn-ghost">Read Part 08 — Big systems →</Link>
      </div>
    </main>
  );
}
