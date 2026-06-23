import Link from "next/link";
import * as Icons from "@/components/ui/Icons";

const SIMS = [
  {
    href: "/simulator/order-journey",
    title: "The journey of an order",
    desc: "One order from tap to door, through every part of the system. Press play, open any stage — then flip “POS offline” and watch a disaster become a non-event.",
    tag: "Flagship", iconName: "TruckIcon",
    grad: "linear-gradient(120deg, #0F6E56 0%, #2BB58F 100%)",
  },
  {
    href: "/simulator/cart-drift",
    title: "The cart that disagrees with itself",
    desc: "The most common bug in app development, live. Toggle between “everyone keeps a copy” and “one source of truth” and watch three parts of the screen drift apart — or stay locked together.",
    tag: "State", iconName: "ShoppingCartIcon",
    grad: "linear-gradient(120deg, #534AB7 0%, #8E84F0 100%)",
  },
  {
    href: "/simulator/scaling",
    title: "From 10 to 1,000,000 users",
    desc: "Drag the slider and pile on the traffic. Watch the system slow down and fall over — then add caches, copies, replicas and queues to bring it back to green.",
    tag: "Scale", iconName: "TrendingUpIcon",
    grad: "var(--grad-warm)",
  },
  {
    href: "/simulator/loyalty-ledger",
    title: "The loyalty ledger",
    desc: "Earn and redeem points and watch the append-only ledger grow. Then hit “retry the same order” and see idempotency refuse to credit you twice — the way banks do it.",
    tag: "Money", iconName: "TicketIcon",
    grad: "var(--grad-sunset)",
  },
  {
    href: "/simulator/dependency-explorer",
    title: "Dependency Explorer & Chaos Monkey",
    desc: "A living topological map of system service nodes. Inject failures with the Chaos Monkey, toggle retries and circuit breakers, and observe cascading blast radius failures and MTTR recovery timelines.",
    tag: "Resilience", iconName: "ZapIcon",
    grad: "linear-gradient(120deg, #F43F5E 0%, #BE123C 100%)",
  },
  {
    href: "/simulator/raft",
    title: "Raft Distributed Consensus",
    desc: "Watch leader election heartbeats and split-brain scenarios in a visual cluster, then ask Socratic AI how it guarantees consistency across replicas.",
    tag: "Consensus", iconName: "ServerIcon",
    grad: "linear-gradient(120deg, #7C5CFC 0%, #FF4D8D 100%)",
  },
  {
    href: "/simulator/llm",
    title: "LLM Transformer internals",
    desc: "Visualize real-time matrix multiplications, query self-attention states, and understand how modern transformers generate tokens.",
    tag: "AI Engine", iconName: "CpuIcon",
    grad: "linear-gradient(120deg, #2D7DF6 0%, #7C5CFC 100%)",
  },
  {
    href: "/simulator/visualgo",
    title: "B-Tree Database Indexing",
    desc: "Insert database index values, watch nodes split and balance in real-time, and see why disk-bound indexes use balanced multi-way B-trees.",
    tag: "Database", iconName: "DatabaseIcon",
    grad: "linear-gradient(120deg, #2FBF71 0%, #2D7DF6 100%)",
  },
];

export default function SimulatorHub() {
  return (
    <main className="wrap" style={{ paddingTop: 40, paddingBottom: 56 }}>
      <Link href="/" style={{ fontSize: 13.5, color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 22 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
        Back to the campus
      </Link>

      <div style={{ marginBottom: 32, maxWidth: 660 }}>
        <span className="pill" style={{ background: "var(--teal-soft)", color: "var(--teal)", marginBottom: 16 }}>World 2 · The Simulator</span>
        <h1 style={{ fontSize: "clamp(38px, 5.5vw, 56px)", lineHeight: 1.03, fontWeight: 600, letterSpacing: "-.02em" }}>
          Don’t just read it. <span className="grad-text" style={{ fontStyle: "italic" }}>Run it.</span>
        </h1>
        <p style={{ fontSize: 18, color: "var(--ink-2)", marginTop: 16, lineHeight: 1.55 }}>
          Each simulator takes one idea from the Codex and lets you <em>play</em> with it — press buttons, drag sliders, and break things on purpose to see exactly why the architecture is shaped the way it is.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }} className="ways-grid">
        {SIMS.map((s, i) => {
          const IconComp = Icons[s.iconName] || Icons.PlayIcon;
          return (
            <Link key={s.href} href={s.href}>
              <div className="card" style={{ padding: 0, height: "100%", overflow: "hidden", borderRadius: "var(--radius-chunky)", display: "flex", flexDirection: "column" }}>
                <div style={{ height: 88, background: s.grad, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", color: "#fff" }}>
                  <IconComp size={36} />
                  <span style={{ color: "#fff", fontWeight: 700, fontSize: 12.5, letterSpacing: ".12em", textTransform: "uppercase", background: "rgba(0,0,0,.2)", padding: "5px 13px", borderRadius: 999 }}>{s.tag}</span>
                </div>
                <div style={{ padding: "22px 24px 26px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <h3 style={{ fontFamily: "Fraunces", fontSize: 24, fontWeight: 600 }}>{s.title}</h3>
                  <p style={{ color: "var(--ink-2)", fontSize: 15, marginTop: 10, lineHeight: 1.6, flex: 1 }}>{s.desc}</p>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--brand-2)", fontWeight: 700, fontSize: 14.5, marginTop: 18 }}>
                    Open simulator
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div style={{ marginTop: 40, textAlign: "center" }}>
        <Link href="/roadmap" className="btn btn-ghost" style={{ fontSize: 15.5, padding: "13px 24px", borderRadius: 16, borderWidth: 1.5 }}>
          See how they connect — the Roadmap
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </Link>
      </div>
    </main>
  );
}
