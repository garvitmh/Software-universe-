import Link from "next/link";

const SIMS = [
  {
    href: "/simulator/order-journey",
    title: "The journey of an order",
    desc: "One order from tap to door, through every part of the system. Press play, open any stage — then flip “POS offline” and watch a disaster become a non-event.",
    tag: "Flagship",
    tint: "var(--teal-soft)", ink: "var(--teal)",
    ready: true,
  },
  {
    href: "/simulator/cart-drift",
    title: "The cart that disagrees with itself",
    desc: "The most common bug in app development, live. Toggle between “everyone keeps a copy” and “one source of truth” and watch three parts of the screen drift apart — or stay locked together.",
    tag: "State",
    tint: "var(--purple-soft)", ink: "var(--purple)",
    ready: true,
  },
  {
    href: "/simulator/scaling",
    title: "From 10 to 1,000,000 users",
    desc: "Drag the slider and pile on the traffic. Watch the system slow down and fall over — then add caches, copies, replicas and queues to bring it back to green.",
    tag: "Scale",
    tint: "var(--amber-soft)", ink: "var(--amber)",
    ready: true,
  },
  {
    href: "/simulator/loyalty-ledger",
    title: "The loyalty ledger",
    desc: "Earn and redeem points and watch the append-only ledger grow. Then hit “retry the same order” and see idempotency refuse to credit you twice — the way banks do it.",
    tag: "Money",
    tint: "var(--brand-soft)", ink: "var(--brand-2)",
    ready: true,
  },
];

export default function SimulatorHub() {
  return (
    <main className="wrap" style={{ paddingTop: 44, paddingBottom: 48 }}>
      <Link href="/" style={{ fontSize: 13.5, color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 22 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
        Back to the campus
      </Link>

      <div style={{ marginBottom: 28 }}>
        <span className="pill" style={{ background: "var(--teal-soft)", color: "var(--teal)", marginBottom: 14 }}>World 2 · The Simulator</span>
        <h1 style={{ fontSize: 42, lineHeight: 1.06, maxWidth: 640 }}>Don’t just read it. Run it.</h1>
        <p style={{ fontSize: 18, color: "var(--ink-2)", maxWidth: 620, marginTop: 14, lineHeight: 1.55 }}>
          Each simulator takes one idea from the Codex and lets you <em>play</em> with it — press buttons, drag sliders, and break things on purpose to see exactly why the architecture is shaped the way it is.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {SIMS.map((s) => (
          <Link key={s.href} href={s.href}>
            <div className="card" style={{ padding: "24px 22px", height: "100%", borderRadius: "var(--radius-xl)", display: "flex", flexDirection: "column" }}>
              <span className="pill" style={{ background: s.tint, color: s.ink, alignSelf: "flex-start", marginBottom: 14 }}>{s.tag}</span>
              <h3 style={{ fontFamily: "Fraunces", fontSize: 23, fontWeight: 600 }}>{s.title}</h3>
              <p style={{ color: "var(--ink-2)", fontSize: 15, marginTop: 10, lineHeight: 1.6, flex: 1 }}>{s.desc}</p>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--brand-2)", fontWeight: 600, fontSize: 14.5, marginTop: 18 }}>
                Open simulator
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
