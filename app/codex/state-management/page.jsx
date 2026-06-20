import Link from "next/link";
import Callout from "@/components/Callout";
import Term from "@/components/Term";
import Aside from "@/components/Aside";

const READERS = [
  { name: "Floating cart bar", sub: "“2 items · ₹358”" },
  { name: "Cart screen", sub: "the full list" },
  { name: "Menu badge", sub: "the little count" },
];

export default function StatePage() {
  return (
    <main className="wrap-narrow" style={{ paddingTop: 44, paddingBottom: 40 }}>
      <Link href="/" style={{ fontSize: 13.5, color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 22 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
        Back to the campus
      </Link>

      <span className="pill" style={{ background: "var(--amber-soft)", color: "var(--amber)", marginBottom: 14 }}>World 1 · The Codex · Part 02</span>
      <h1 style={{ fontSize: 42, lineHeight: 1.06 }}>State — the single source of truth.</h1>

      <div className="prose" style={{ marginTop: 22 }}>
        <p className="lead">
          “State” is just a fancy word for <strong>everything that can change while the app is open</strong> — what’s in your cart, which filter is on, the search text. It sounds trivial, right up until two parts of the screen quietly disagree about it. This chapter is about never letting that happen.
        </p>

        <h2>What “state” actually is</h2>
        <p>
          In your menu, state is concrete and everywhere: the items in the cart, the active category (Burgers vs Fries), the Veg / Non-Veg filter, whether the radial dial is open. None of it is permanent — it lives only while the screen is up, and it changes constantly as the user taps.
        </p>

        <h2>The trap: everyone keeps their own copy</h2>
        <p>
          The naïve approach is to let each widget remember its own version. The cart icon keeps a count, the cart page keeps a list, the bill keeps a total. Then the user removes an item — and one of those three doesn’t get the memo. Now the icon says <strong>2</strong>, the page shows <strong>3</strong>, and the customer trusts neither. This is the single most common bug in app development, and it comes entirely from <em>copies disagreeing</em>.
        </p>

        <h2>The fix: one truth, many readers</h2>
        <p>
          Keep the cart in exactly <strong>one</strong> place, and have every widget <em>read from it</em> rather than hold its own copy. When the one place changes, everyone re-reads and redraws — automatically. They literally cannot disagree, because there’s only one of them.
        </p>

        <div style={{ margin: "1.8rem 0" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ background: "var(--brand-soft)", border: "1px solid #F3C9A8", borderRadius: 14, padding: "12px 18px", textAlign: "center" }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--brand-2)" }}>The cart — one source of truth</div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}><code>menu_cart_provider.dart</code></div>
            </div>
            <div style={{ display: "flex", gap: 28, color: "var(--faint)", margin: "2px 0" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M6 13l6 6 6-6" /></svg>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M6 13l6 6 6-6" /></svg>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M6 13l6 6 6-6" /></svg>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
              {READERS.map((r) => (
                <div key={r.name} style={{ background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: 12, padding: "10px 12px", textAlign: "center", minWidth: 120 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{r.name}</div>
                  <div style={{ fontSize: 11.5, color: "var(--faint)" }}>{r.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <h2>How it works in your code</h2>
        <p>
          In your app, that “one place” is a <Term id="provider"><strong>provider</strong></Term> (from a library called <Term id="riverpod"><strong>Riverpod</strong></Term>). <code>menu_cart_provider.dart</code> holds the cart; the floating cart bar and the cart screen both <em>watch</em> it, so they’re always in lock-step.
        </p>

        <Aside q="Isn't &lsquo;one source of truth&rsquo; just a global variable I could make myself?">
          Close — and that instinct is right! The difference is the <em>reacting</em>. A plain global variable holds the cart, but when you change it, nothing else notices — you’d have to manually go and tell the icon, the bill, and the cart screen to redraw, and the day you forget one, the bug is back. A provider is a global value that also <strong>announces its own changes</strong>: everyone watching is redrawn automatically, every time, with no manual telling. So it’s a global variable with the one superpower that actually matters here.
        </Aside>
        <p>
          It gets cleverer. In <code>menu_provider.dart</code>, the active filter and the active category are their own little providers, and <code>menuVisibleProductsProvider</code> <strong>derives</strong> the on-screen product list from three things: the full catalogue, the chosen filter, and the chosen category. Tap “Veg” and you change <em>one</em> value — the visible list recomputes itself and the screen redraws, with you never manually syncing anything. That automatic recompute-on-change is what people mean by <Term id="reactive"><strong>reactive</strong></Term>.
        </p>

        <Callout variant="why" title="Why Riverpod, and not just a quick variable?">
          The simplest option (Flutter’s <code>setState</code>) keeps state inside one widget — fine for a toggle, useless when three separate screens need the same cart. Other tools exist (Provider, Bloc, GetX). Riverpod was chosen because it makes <em>derived</em> state (like “the visible products”) effortless, it’s testable without a running app, it catches wiring mistakes at compile time, and it rebuilds only the widgets that actually use the changed value — not the whole screen. The tradeoff is a little more setup than a bare variable; the payoff is state that can’t drift out of sync.
        </Callout>

        <Callout variant="breaks" title="What breaks without one source">
          Two copies of the cart total is not a cosmetic bug — it’s a <strong>money</strong> bug. The icon’s total and the checkout’s total disagree, and now you’re either charging the customer wrong or arguing with them about it. Same shape of failure when an item goes “sold out”: if one screen kept a stale copy, a customer can still order something that doesn’t exist. A single source of truth makes these whole classes of bug simply impossible.
        </Callout>

        <Callout variant="scale" title="As the app grows">
          With one screen, you could get away with scattered copies. With dozens of screens that all touch the cart, the user, the selected store — scattered state becomes a guaranteed source of drift bugs that are agony to track down. Centralised, reactive state is what lets a big app stay correct without a small army of manual “keep these in sync” patches.
        </Callout>
      </div>

      <div style={{ marginTop: 30, paddingTop: 22, borderTop: "1px solid var(--hairline)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <Link href="/codex/layers-and-separation" className="muted" style={{ fontSize: 14 }}>← Part 02 — Layers & separation</Link>
        <span style={{ fontSize: 14, color: "var(--faint)" }}>Next — Your Flutter app, layer by layer · coming soon</span>
      </div>
    </main>
  );
}
