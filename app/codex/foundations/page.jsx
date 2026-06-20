import Link from "next/link";
import FlowMap from "@/components/FlowMap";
import Callout from "@/components/Callout";

export default function FoundationsPage() {
  return (
    <main className="wrap-narrow" style={{ paddingTop: 44, paddingBottom: 40 }}>
      <Link href="/" style={{ fontSize: 13.5, color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 22 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
        Back to the campus
      </Link>

      <span className="pill" style={{ background: "var(--amber-soft)", color: "var(--amber)", marginBottom: 14 }}>World 1 · The Codex · Part 01</span>
      <h1 style={{ fontSize: 42, lineHeight: 1.06 }}>Foundations: how it all fits together.</h1>

      <div className="prose" style={{ marginTop: 22 }}>
        <p className="lead">
          Everything you built — and everything we’ll ever discuss — is one of four things, or a conversation between them. Get this picture solid and nothing later will feel like magic.
        </p>

        <h2>The four characters</h2>
        <p>
          Your Burger Farm isn’t one program. It’s four cooperating parts, and you literally have a folder for each:
        </p>
        <p>
          <strong>The app</strong> (<code>apps/mobile-app</code>, built with Flutter) is the part the customer sees and touches. Its job is to <strong>show</strong> things and to <strong>ask</strong> for things. Crucially, it stores almost nothing — when it needs the menu, it doesn’t remember it, it asks.
        </p>
        <p>
          <strong>The backend</strong> (<code>apps/backend</code>, built with Node and Express) is the brain. It runs on a computer in a data centre — a <strong>server</strong> — and it does the real work: checking rules, taking payments, deciding what’s allowed. The app talks to it constantly.
        </p>
        <p>
          <strong>The database</strong> (PostgreSQL) is the memory. Every order, payment and customer is stored here as rows in tables, organised so the backend can find anything instantly — and so nothing is lost when a server restarts.
        </p>
        <p>
          <strong>The admin panel</strong> (<code>apps/admin-panel</code>, built with Next.js) is the control room. It’s a separate screen the business uses to change prices, add offers, or mark an item sold out — without ever touching code or shipping a new app.
        </p>

        <div style={{ margin: "1.8rem 0" }}>
          <div className="card" style={{ padding: "20px 16px 24px" }}>
            <FlowMap />
          </div>
          <p style={{ fontSize: 13.5, color: "var(--faint)", textAlign: "center", marginTop: 8 }}>
            The app asks · the backend decides · the database remembers · the admin controls.
          </p>
        </div>

        <Callout variant="why" title="Why split it into four at all?">
          You <em>could</em> cram everything into the app. Teams have. The reason serious products don’t: each part changes for different reasons and at different speeds. Swap the database, redesign the app, add a new payment provider — if they’re separate, you change one without breaking the others. That single idea — <strong>keep things that change for different reasons apart</strong> — is the seed of almost every principle in this Codex.
        </Callout>

        <h2>The journey of a single tap</h2>
        <p>
          When you tap “Place order”, that one action travels through all four (and a few more). The app sends a request; the backend validates it; the payment is authorised; the database writes it down; the kitchen system is told; it gets cooked and delivered — and status flows back to your screen the whole way.
        </p>
        <p>
          This journey is the spine of the entire system, so rather than just read it, <strong>watch it move</strong> — and then break it on purpose to see why each safety net exists.
        </p>

        <div style={{ margin: "1.6rem 0" }}>
          <Link href="/simulator/order-journey" className="btn btn-primary">
            Watch it in the Simulator
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </Link>
        </div>

        <Callout variant="breaks" title="What breaks — if the app held the data itself">
          Imagine the app stored the menu and prices on the phone. Now the owner drops a price for the weekend — but ten thousand phones still show last week’s price, and there’s no way to fix it without forcing everyone to update the app. Worse, a clever customer could edit their phone’s copy and “buy” a ₹400 burger for ₹40. This is exactly why the truth lives on the backend and database, and the app only ever asks. Pain like this is <em>why</em> the architecture is shaped the way it is — and we’ll meet a lot more of it.
        </Callout>

        <Callout variant="deeper" title="Where this goes next">
          From here the Codex descends: how the app is built in layers (Part 3), how the backend keeps secrets safe (Part 4), how the admin controls everything live (Part 5) — and eventually how this whole thing survives a million users a day (Part 9). Each chapter answers the same four questions: <strong>what</strong> we do, <strong>why</strong> this way, <strong>how</strong> it works, and <strong>when it breaks</strong>.
        </Callout>
      </div>

      <div style={{ marginTop: 30, paddingTop: 22, borderTop: "1px solid var(--hairline)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <span className="muted" style={{ fontSize: 14 }}>Part 01 of 10 · Foundations</span>
        <span style={{ fontSize: 14, color: "var(--faint)" }}>Part 02 — the thinking tools · coming soon</span>
      </div>
    </main>
  );
}

