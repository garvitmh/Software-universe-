import Link from "next/link";
import Callout from "@/components/Callout";

const RUNGS = [
  { users: "10", add: "One backend, one database. That’s genuinely enough.", tint: "var(--teal-soft)", ink: "var(--teal)" },
  { users: "1,000", add: "Add caching for the menu + indexes for the hot queries.", tint: "var(--blue-soft)", ink: "var(--blue)" },
  { users: "100,000", add: "Many backend copies behind a load balancer · queues for slow work · read replicas.", tint: "var(--amber-soft)", ink: "var(--amber)" },
  { users: "1,000,000", add: "CDN for images · sharded/partitioned data · full observability · rate limits.", tint: "var(--brand-soft)", ink: "var(--brand-2)" },
];

export default function ScalePage() {
  return (
    <main className="wrap-narrow" style={{ paddingTop: 44, paddingBottom: 40 }}>
      <Link href="/" style={{ fontSize: 13.5, color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 22 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
        Back to the campus
      </Link>

      <span className="pill" style={{ background: "var(--amber-soft)", color: "var(--amber)", marginBottom: 14 }}>World 1 · The Codex · Part 09</span>
      <h1 style={{ fontSize: 42, lineHeight: 1.06 }}>Enterprise plumbing & scale.</h1>

      <div className="prose" style={{ marginTop: 22 }}>
        <p className="lead">
          Here’s the reassuring truth almost nobody tells beginners: the system that serves 10 customers and the system that serves a million are <strong>the same design</strong>. You don’t rewrite — you add capacity around a core that was already correct. Everything you learned in Parts 1–8 is what makes that possible. This chapter is the tour of what you bolt on, and when.
        </p>

        <h2>The scaling ladder</h2>
        <p>
          You climb it one rung at a time, and only when the numbers say so. Each rung adds a technique — it doesn’t replace the rung below:
        </p>

        <div style={{ margin: "1.6rem 0" }}>
          {RUNGS.map((r, i) => (
            <div key={r.users} style={{ display: "flex", gap: 12, alignItems: "stretch", marginBottom: 8 }}>
              <div style={{ background: r.tint, border: "1px solid var(--hairline)", borderRadius: 12, padding: "12px 10px", minWidth: 96, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: r.ink, fontFamily: "Fraunces" }}>{r.users}</div>
                <div style={{ fontSize: 10.5, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".05em" }}>users</div>
              </div>
              <div style={{ flex: 1, background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", fontSize: 14, color: "var(--ink-2)" }}>
                {r.add}
              </div>
            </div>
          ))}
        </div>

        <h2>Caching — compute once, serve many</h2>
        <p>
          Your menu is read constantly but changes rarely. Recomputing it from the database on every single request is pure waste. <strong>Caching</strong> means keeping the answer ready: in the backend’s memory, then in a shared fast store (like <strong>Redis</strong>) all backend copies share, and finally — for images — in a <strong>CDN</strong>, a network of servers near your customers. The genuinely hard part isn’t storing the cache, it’s <em>invalidating</em> it: when the admin changes a price (Part 06), the stale cached menu must be thrown away so customers see the new one. “There are only two hard things in computing,” the joke goes, “naming, and cache invalidation.”
        </p>

        <h2>Horizontal scaling — many copies, one door</h2>
        <p>
          Remember the backend is <strong>stateless</strong> (Part 04) — it keeps no session in its own memory. That single property is what lets you run twenty identical copies and put a <strong>load balancer</strong> in front: one public door that spreads requests across them. Traffic doubles? Add more copies. Because no copy is “the one that remembers you,” it doesn’t matter which answers your request. Statelessness, decided way back in Part 4, is the thing that cashes out here.
        </p>

        <h2>Queues — get the slow stuff off the critical path</h2>
        <p>
          When you place an order, some work is slow or external: emailing a receipt, sending a push notification, telling the kitchen’s POS. You don’t make the customer <em>wait</em> for all that. Instead the backend drops a message on a <strong>queue</strong> and instantly tells the customer “order placed”; separate <strong>worker</strong> processes pick up the messages and do the slow work behind the scenes. This is also the rescue from Part 8: if the POS is offline, the message waits safely in the queue instead of the order being lost.
        </p>

        <h2>Seeing what’s happening — observability</h2>
        <p>
          At ten users you watch the logs by eye. At a million you can’t — you need <strong>observability</strong>: aggregated logs, metrics (graphs of latency, error rate, orders/minute), and <strong>traces</strong>. Your app already lays the groundwork: the network client attaches a <strong>request-id</strong> to every call (Part 3), so you can follow one order’s journey across every service and pinpoint exactly where it slowed down. You can’t fix what you can’t see.
        </p>

        <h2>One quiet hero: API versioning</h2>
        <p>
          Every backend route lives under <code>/api/v1/</code>. That <code>v1</code> is doing serious work. Because you can’t force every customer to update their app (Part 1), old and new apps are always live at once. Versioning lets you ship a <code>/api/v2</code> with breaking changes while <code>/api/v1</code> keeps serving the old phones — you evolve the system without bricking anyone. It’s a small prefix that buys you years of freedom to change.
        </p>

        <Callout variant="why" title="Why not just build for a million users on day one?">
          It’s tempting to add caching, queues, and a fleet of servers immediately — to feel “serious.” It’s almost always a mistake. Every one of those parts adds complexity, cost, and new ways to fail, and a 10-user app gains nothing from them. The discipline is to build <em>correct and simple</em> first (which you did), then add each scaling layer only when a real measurement demands it. Premature scaling burns time solving problems you don’t have yet, while the real early risk — getting the design wrong — goes unaddressed. Right order: correct, then fast, then big.
        </Callout>

        <Callout variant="breaks" title="What breaks without invalidation, or without queues">
          Cache, but forget to invalidate it: the admin drops a price, the cache keeps serving the old one, and customers see — and pay — last week’s prices for hours. No queue, meanwhile, means a slow or down payment gateway freezes the whole checkout, because the request is stuck waiting on something external. Each scaling tool quietly introduces its own failure mode, which is exactly why you add them deliberately, one at a time, and not all at once in a panic.
        </Callout>

        <Callout variant="scale" title="How the giants actually run">
          Netflix runs thousands of small services behind load balancers, leaning hard on caching and CDNs so a video starts instantly anywhere on earth. Amazon pioneered breaking a giant app into independently-scaled services connected by queues. Stripe obsesses over idempotency and observability because money allows no “oops.” The striking part: none of it is a different <em>kind</em> of thinking than your Burger Farm — it’s the same patterns (stateless services, caches, queues, ledgers, versioned APIs) turned up to enormous scale. You’ve been learning the real thing the whole time.
        </Callout>
      </div>

      <div style={{ marginTop: 30, paddingTop: 22, borderTop: "1px solid var(--hairline)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <Link href="/codex/big-systems" className="muted" style={{ fontSize: 14 }}>← Part 08 — Big systems</Link>
        <Link href="/codex/deployment" className="muted" style={{ fontSize: 14 }}>Part 10 — Deployment & ops →</Link>
      </div>
    </main>
  );
}
