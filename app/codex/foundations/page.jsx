import Link from "next/link";
import FlowMap from "@/components/FlowMap";
import Callout from "@/components/Callout";
import Term from "@/components/Term";
import Aside from "@/components/Aside";

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
          Everything you built — and everything we’ll ever discuss — is one of four things, or a conversation between them. Get this one picture solid and nothing later will feel like magic. We’ll go slowly, and anything underlined you can hover (or tap) to clear the doubt on the spot.
        </p>

        <p style={{ fontSize: 14, color: "var(--faint)", display: "flex", alignItems: "center", gap: 8, margin: "0 0 1.4rem" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
          Try it: hover this → <Term def="You just cleared your first doubt. Every underlined word works like this — a plain-language definition, right where you need it.">a definition appears here</Term>.
        </p>

        <h2>The four characters</h2>
        <p>
          Your Burger Farm isn’t one program. It’s <strong>four cooperating parts</strong>, and you literally have a folder for each. Think of them as four characters in a play, each with one job, constantly passing messages to one another.
        </p>

        <p>
          <strong>1. The app</strong> — the <Term id="frontend">frontend</Term> — is the part the customer sees and touches (<code>apps/mobile-app</code>, built with <Term id="flutter">Flutter</Term>). Its whole job is to <strong>show</strong> things and to <strong>ask</strong> for things. Here’s the surprising part: it stores almost nothing. When it needs the menu, it doesn’t remember it from last time — it <em>asks</em> for a fresh copy.
        </p>

        <Aside q="Wait — if the app keeps almost nothing, isn't that slower?">
          A little, sometimes — but it buys something far more valuable: the app is never wrong. If the owner drops a price, you see the new price the next time the screen loads, because you’re always asking for the live truth instead of trusting a stale copy on your phone. (And for speed, the system keeps ready-made copies of rarely-changing things — that’s <Term id="cache">caching</Term>, which we cover much later.) The rule to remember: <strong>the app asks; it doesn’t remember.</strong>
        </Aside>

        <p>
          <strong>2. The backend</strong> is the brain (<code>apps/backend</code>, built with <Term id="nodejs">Node.js</Term> and <Term id="express">Express</Term>). It runs on a <Term id="server">server</Term> and does the real work: checking the rules, taking payments, deciding what’s allowed. The app talks to it constantly. Its golden rule is <strong>never trust the <Term id="client">client</Term></strong> — the phone can be tampered with, so the backend re-checks everything itself.
        </p>

        <Aside q="What's a 'server', really? Is it 'the cloud'?">
          A server is just a computer — but one that runs all the time in a data centre and exists to answer requests over the internet, rather than to sit on a desk. “The cloud” simply means renting these computers from a company (like Google or Amazon) instead of owning the physical box. So “it runs on a server in the cloud” = “it runs on a computer we rent that’s always on.” Nothing more mystical than that.
        </Aside>

        <p>
          <strong>3. The database</strong> is the memory (<Term id="database">PostgreSQL</Term>). Every order, payment, and customer is stored here as <Term id="row">rows</Term> in <Term id="table">tables</Term>, organised so the backend can find anything instantly — and so nothing is lost when a server restarts. The app never touches it directly; only the backend does.
        </p>

        <p>
          <strong>4. The admin panel</strong> is the control room (<code>apps/admin-panel</code>, built with <Term id="nextjs">Next.js</Term>). It’s a <em>separate</em> screen the business uses to change prices, add offers, or mark an item sold out — without touching code or shipping a new app. It’s not the customer app with a secret mode; it’s its own application, used by staff.
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
          When you tap “Place order”, that one action travels through all four characters (and a few more). Let’s walk it slowly, because this journey is the spine of the entire system:
        </p>
        <p>
          The app gathers your cart and sends a <Term id="request">request</Term> to the backend. The backend <strong><Term def="To 'validate' means to check something is true and allowed before acting on it — is the store open? is this really the current price? is the payment real? The backend never assumes; it verifies.">validates</Term></strong> it — is the store open, is the price right, is the address one you deliver to? Then the payment is authorised; the database <strong>writes the order down</strong> all-or-nothing, so a half-saved order can’t exist (that’s a <Term id="transaction">transaction</Term>); the kitchen system is told; the food is cooked and delivered — and the order’s status flows back to your screen the whole way.
        </p>
        <p>
          That’s a lot of safety nets for one tap. Rather than just read it, <strong>watch it move</strong> — and then break it on purpose to see why each net exists:
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
          From here the Codex descends: how the app is built in <Link href="/codex/layers-and-separation" style={{ color: "var(--brand-2)", fontWeight: 600 }}>layers</Link>, how the <Link href="/codex/backend" style={{ color: "var(--brand-2)", fontWeight: 600 }}>backend</Link> keeps secrets safe, how the <Link href="/codex/admin-panel" style={{ color: "var(--brand-2)", fontWeight: 600 }}>admin</Link> controls everything live — and eventually how this whole thing survives <Link href="/codex/scale" style={{ color: "var(--brand-2)", fontWeight: 600 }}>a million users a day</Link>. Each chapter answers the same four questions: <strong>what</strong> we do, <strong>why</strong> this way, <strong>how</strong> it works, and <strong>when it breaks</strong>. And every new word gets the underline treatment, so you’re never left guessing.
        </Callout>
      </div>

      <div style={{ marginTop: 30, paddingTop: 22, borderTop: "1px solid var(--hairline)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <span className="muted" style={{ fontSize: 14 }}>Part 01 of 10 · Foundations</span>
        <Link href="/codex/layers-and-separation" className="muted" style={{ fontSize: 14 }}>Part 02 — Layers & separation →</Link>
      </div>
    </main>
  );
}
