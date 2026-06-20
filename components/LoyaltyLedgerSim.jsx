"use client";

import { useState } from "react";

export default function LoyaltyLedgerSim() {
  const [ledger, setLedger] = useState([]); // newest first
  const [orderSeq, setOrderSeq] = useState(1);
  const [redeemSeq, setRedeemSeq] = useState(1);
  const [lastOrder, setLastOrder] = useState(null);
  const [flash, setFlash] = useState(null); // {kind, text}

  const balance = ledger.length ? ledger[0].after : 0;

  const append = (row) => setLedger((l) => [row, ...l]);

  const placeOrder = () => {
    const id = `o${orderSeq}`;
    setOrderSeq((n) => n + 1);
    setLastOrder(id);
    append({ type: "EARN", pts: 20, after: balance + 20, key: `earn:order:${id}`, src: `order ${id}` });
    setFlash({ kind: "ok", text: `Order ${id} placed — earned 20 points.` });
  };

  const retry = () => {
    if (!lastOrder) {
      setFlash({ kind: "muted", text: "Place an order first." });
      return;
    }
    const key = `earn:order:${lastOrder}`;
    const exists = ledger.some((r) => r.key === key);
    if (exists) {
      setFlash({ kind: "block", text: `Retry blocked. Key “${key}” was already used — points credited exactly once, not twice.` });
    } else {
      append({ type: "EARN", pts: 20, after: balance + 20, key, src: `order ${lastOrder}` });
      setFlash({ kind: "ok", text: `Earned 20 points for ${lastOrder}.` });
    }
  };

  const redeem = () => {
    if (balance < 30) {
      setFlash({ kind: "block", text: "Not enough points to redeem (need 30)." });
      return;
    }
    const id = `r${redeemSeq}`;
    setRedeemSeq((n) => n + 1);
    append({ type: "REDEEM", pts: -30, after: balance - 30, key: `redeem:${id}`, src: `discount ${id}` });
    setFlash({ kind: "ok", text: "Redeemed 30 points for ₹15 off." });
  };

  const reset = () => {
    setLedger([]); setOrderSeq(1); setRedeemSeq(1); setLastOrder(null);
    setFlash({ kind: "muted", text: "Ledger cleared." });
  };

  const flashStyle = {
    ok: { bg: "var(--teal-soft)", bd: "var(--teal)", fg: "var(--teal)" },
    block: { bg: "#FBE0D2", bd: "var(--brand)", fg: "var(--brand-2)" },
    muted: { bg: "var(--bg-2)", bd: "var(--hairline)", fg: "var(--ink-2)" },
  }[flash?.kind || "muted"];

  return (
    <div>
      {/* balance */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <span className="eyebrow">Points balance</span>
        <span style={{ fontFamily: "Fraunces", fontSize: 38, fontWeight: 600, color: "var(--brand-2)" }}>{balance}</span>
      </div>

      {/* controls */}
      <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button onClick={placeOrder} className="btn btn-primary">＋ Place an order (+20)</button>
        <button onClick={retry} className="btn btn-ghost">↻ Retry last order</button>
        <button onClick={redeem} className="btn btn-ghost">− Redeem 30</button>
        <button onClick={reset} className="btn btn-ghost" style={{ marginLeft: "auto" }}>Reset</button>
      </div>

      {/* flash */}
      {flash && (
        <div style={{ marginTop: 14, background: flashStyle.bg, border: `1px solid ${flashStyle.bd}`, borderRadius: 12, padding: "11px 15px", fontSize: 13.5, color: flashStyle.fg }}>
          {flash.kind === "block" ? <strong>Idempotency · </strong> : null}{flash.text}
        </div>
      )}

      {/* ledger */}
      <div style={{ marginTop: 20 }}>
        <span className="eyebrow">The ledger — append-only, every movement recorded</span>
        <div style={{ marginTop: 10, overflowX: "auto", border: "1px solid var(--hairline)", borderRadius: 12 }}>
          <table style={{ borderCollapse: "collapse", fontSize: 12.5, width: "100%", minWidth: 460 }}>
            <thead>
              <tr>
                {["type", "points", "balance_after", "idempotency_key"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "9px 12px", background: "var(--bg-2)", color: "var(--ink-2)", fontWeight: 600, fontFamily: "JetBrains Mono", fontSize: 11, borderBottom: "1px solid var(--hairline)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ledger.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: "18px 12px", color: "var(--faint)", textAlign: "center" }}>No movements yet — place an order to earn your first points.</td></tr>
              ) : ledger.map((r, i) => (
                <tr key={i}>
                  <td style={{ padding: "9px 12px", borderBottom: "1px solid var(--hairline)", fontFamily: "JetBrains Mono", fontWeight: 600, color: r.pts < 0 ? "var(--brand-2)" : "var(--teal)" }}>{r.type}</td>
                  <td style={{ padding: "9px 12px", borderBottom: "1px solid var(--hairline)", fontFamily: "JetBrains Mono", color: r.pts < 0 ? "var(--brand-2)" : "var(--teal)" }}>{r.pts > 0 ? `+${r.pts}` : r.pts}</td>
                  <td style={{ padding: "9px 12px", borderBottom: "1px solid var(--hairline)", fontFamily: "JetBrains Mono", fontWeight: 600 }}>{r.after}</td>
                  <td style={{ padding: "9px 12px", borderBottom: "1px solid var(--hairline)", fontFamily: "JetBrains Mono", color: "var(--muted)", fontSize: 11.5 }}>{r.key}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: 12.5, color: "var(--faint)", marginTop: 8 }}>
          The balance is never stored on its own — it’s the running total of this tape. That’s why a retried order can’t double-credit, and why every point is accountable.
        </p>
      </div>
    </div>
  );
}
