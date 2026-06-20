import Link from "next/link";
import Callout from "@/components/Callout";

const STATES = [
  { s: "PENDING_PAYMENT", t: "var(--amber)" },
  { s: "PLACED", t: "var(--blue)" },
  { s: "PREPARING", t: "var(--blue)" },
  { s: "OUT_FOR_DELIVERY", t: "var(--purple)" },
  { s: "DELIVERED", t: "var(--teal)" },
  { s: "COMPLETED", t: "var(--teal)" },
];

const LEDGER = [
  { type: "EARN", pts: "+18", after: "18", src: "order #8f3" },
  { type: "EARN", pts: "+22", after: "40", src: "order #a1c" },
  { type: "REDEEM", pts: "−30", after: "10", src: "order #b90" },
];

export default function BigSystemsPage() {
  return (
    <main className="wrap-narrow" style={{ paddingTop: 44, paddingBottom: 40 }}>
      <Link href="/" style={{ fontSize: 13.5, color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 22 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
        Back to the campus
      </Link>

      <span className="pill" style={{ background: "var(--amber-soft)", color: "var(--amber)", marginBottom: 14 }}>World 1 · The Codex · Part 08</span>
      <h1 style={{ fontSize: 42, lineHeight: 1.06 }}>Big systems: payments, orders, loyalty, delivery.</h1>

      <div className="prose" style={{ marginTop: 22 }}>
        <p className="lead">
          So far the order lived safely inside your own database. Now it has to touch the <strong>outside world</strong> — a bank that takes the money, a kitchen that cooks, a driver who delivers, a map that decides if you’re even in range. None of those are under your control, and all of them can be slow, flaky, or offline. This chapter is about the handful of patterns that keep the order <em>correct anyway</em>.
        </p>

        <h2>Payments — talking to a bank you don’t control</h2>
        <p>
          Payment is its own record in your schema (<code>OrderPayment</code>), separate from the order, because it’s a conversation with an external <strong>gateway</strong> that answers on its own schedule. The order starts at <code>PENDING_PAYMENT</code>; only once the gateway truly confirms does it move on. The iron rule: <strong>never trust the phone’s word that payment succeeded</strong> — a tampered app could just claim it did. The backend confirms with the gateway directly (often via a <strong>webhook</strong> — the gateway calling your backend back to say “this one’s paid”). And the <code>idempotency_key</code> from Part 05 means a retried payment request can’t charge twice.
        </p>

        <h2>The order’s whole life is a state machine</h2>
        <p>
          An order is <em>always</em> in exactly one known state, and only certain moves between them are legal. Your <code>OrderStatus</code> is that exact list:
        </p>

        <div style={{ margin: "1.6rem 0", overflowX: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4, minWidth: 640 }}>
            {STATES.map((st, i) => (
              <div key={st.s} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ fontFamily: "JetBrains Mono", fontSize: 11, fontWeight: 600, color: st.t, background: "var(--surface)", border: `1px solid var(--hairline)`, borderRadius: 8, padding: "7px 9px", whiteSpace: "nowrap" }}>{st.s}</span>
                {i < STATES.length - 1 && (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--faint)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                )}
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12.5, color: "var(--faint)", marginTop: 8 }}>
            (pickup orders pass through <code>READY_FOR_PICKUP</code> instead; <code>CANCELLED</code> is the early exit.)
          </p>
        </div>

        <p>
          Why force every order onto this track? Because it makes illegal situations impossible — an order can’t jump from <code>DELIVERED</code> back to <code>PREPARING</code>, and nothing can be “half placed.” And every single move is written to an append-only log, <code>OrderEvent</code>, stamped with an <strong>actor</strong> — <code>customer</code>, <code>admin:&lt;id&gt;</code>, <code>system</code>, or <code>pos:&lt;id&gt;</code>. That log is your audit trail: you can replay any order’s entire history and know exactly who moved it, when, and why. When a customer disputes an order, you don’t guess — you read the tape.
        </p>

        <h2>Loyalty — a ledger, not a number</h2>
        <p>
          Here’s where your schema is quietly world-class. The naïve way to do points is a single number you add to and subtract from. The right way — what <code>LoyaltyTransaction</code> does — is an <strong>append-only ledger</strong>: every earn and every redeem is its own immutable row, with a signed <code>points</code> value and a <code>balance_after</code> snapshot. The balance is just the running total of the tape:
        </p>

        <div style={{ margin: "1.6rem 0", overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", fontSize: 12.5, minWidth: 420, width: "100%" }}>
            <thead>
              <tr>
                {["type", "points", "balance_after", "source"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 12px", background: "var(--bg-2)", border: "1px solid var(--hairline)", color: "var(--ink-2)", fontWeight: 600, fontFamily: "JetBrains Mono", fontSize: 11.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LEDGER.map((r, i) => (
                <tr key={i}>
                  <td style={{ padding: "8px 12px", border: "1px solid var(--hairline)", background: "var(--surface)", fontFamily: "JetBrains Mono", fontWeight: 600, color: r.type === "REDEEM" ? "var(--brand-2)" : "var(--teal)" }}>{r.type}</td>
                  <td style={{ padding: "8px 12px", border: "1px solid var(--hairline)", background: "var(--surface)", fontFamily: "JetBrains Mono" }}>{r.pts}</td>
                  <td style={{ padding: "8px 12px", border: "1px solid var(--hairline)", background: "var(--surface)", fontFamily: "JetBrains Mono", fontWeight: 600 }}>{r.after}</td>
                  <td style={{ padding: "8px 12px", border: "1px solid var(--hairline)", background: "var(--surface)", color: "var(--muted)" }}>{r.src}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p>
          This is <em>exactly</em> how banks track money, and for the same reasons: when a customer asks “where did my points go?”, you can show them every movement; you can never silently lose or invent points; and each row carries an <code>idempotency_key</code> like <code>earn:order:&lt;id&gt;</code> that guarantees a points award happens <strong>exactly once</strong>, even if the order is processed twice. The account also keeps a <code>version</code> counter so two taps trying to spend the same points can’t both win — the second one notices the version changed and backs off. (That trick is called <strong>optimistic concurrency</strong>.) And the rates aren’t hardcoded — <code>LoyaltyConfig</code> lets the admin tune earn rate, redeem value, and tiers, exactly like Part 06.
        </p>

        <h2>Delivery — “do we even deliver here?”</h2>
        <p>
          Each saved address (<code>UserAddress</code>) carries a precise <code>latitude</code>/<code>longitude</code> and a chosen store. The decision of whether an address is <em>serviceable</em> — inside a store’s delivery range — lives on the <strong>backend</strong>, never the app. Two reasons: the rules change often (a store widens its radius for the weekend), and you can’t trust a phone’s claimed location. The app shows the answer; the backend owns the judgment. Same pattern as everything else: the truth is server-side.
        </p>

        <Callout variant="why" title="Why a ledger instead of just storing the balance?">
          A single balance number is smaller and simpler — until the day it’s wrong. Then you have no idea how it got wrong, no way to prove what the customer earned, and no way to undo one bad change. The ledger costs more rows, but it buys you an unbreakable audit trail, painless dispute resolution, and the ability to reverse exactly one entry. Every system that touches things people care about losing — money, points, inventory — converges on this same append-only design. It’s not over-engineering; it’s the floor for anything with value attached.
        </Callout>

        <Callout variant="breaks" title="What breaks without idempotency here">
          A customer pays; the network blips; the app retries the request. Without idempotency, you’ve now charged them twice and granted the loyalty points twice. With it, the second attempt hits the unique <code>idempotency_key</code> wall and is quietly ignored — the customer is charged once, earns once, and never knows there was a hiccup. The same one-word guard protects the payment, the order, and the points. In money systems, “exactly once” isn’t a nicety; it’s the whole game.
        </Callout>

        <Callout variant="scale" title="How the giants run these">
          At scale these subsystems get pulled apart and connected by <strong>queues</strong>: when you place an order, the kitchen/POS isn’t called directly — a message is dropped on a queue, so if a store’s system is offline the order waits safely instead of vanishing (the exact rescue you can trigger in the Simulator). Stripe runs payments as a state machine with webhooks; Uber and Swiggy track every order as an event log just like your <code>OrderEvent</code>; airline miles and bank balances are ledgers like your <code>LoyaltyTransaction</code>. You’ve built the small version of the real thing — same shapes, fewer zeros.
        </Callout>

        <div style={{ margin: "1.6rem 0" }}>
          <Link href="/simulator/order-journey" className="btn btn-primary">
            See the POS-offline rescue in the Simulator
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </Link>
        </div>
      </div>

      <div style={{ marginTop: 30, paddingTop: 22, borderTop: "1px solid var(--hairline)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <Link href="/codex/burger-builder" className="muted" style={{ fontSize: 14 }}>← Part 07 — The burger builder</Link>
        <Link href="/codex/scale" className="muted" style={{ fontSize: 14 }}>Part 09 — Enterprise plumbing & scale →</Link>
      </div>
    </main>
  );
}
