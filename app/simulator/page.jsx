import Link from "next/link";
import LoadSim from "@/components/sim/LoadSim";

const SIMS = [
  {
    href: "/simulator/order-journey",
    title: "The journey of an order",
    desc: "One order from tap to door, through every part of the system. Press play, open any stage — then flip “POS offline” and watch a disaster become a non-event.",
    tag: "Flagship",
  },
  {
    href: "/simulator/cart-drift",
    title: "The cart that disagrees with itself",
    desc: "The most common bug in app development, live. Toggle “everyone keeps a copy” vs “one source of truth” and watch three parts of the screen drift apart — or stay locked together.",
    tag: "State",
  },
  {
    href: "/simulator/scaling",
    title: "From 10 to 1,000,000 users",
    desc: "Drag the slider and pile on the traffic. Watch the system slow and fall over — then add caches, replicas and queues to bring it back to green.",
    tag: "Scale",
  },
  {
    href: "/simulator/loyalty-ledger",
    title: "The loyalty ledger",
    desc: "Earn and redeem points and watch the append-only ledger grow. Hit “retry the same order” and see idempotency refuse to credit you twice — the way banks do it.",
    tag: "Money",
  },
  {
    href: "/simulator/dependency-explorer",
    title: "Dependency Explorer & Chaos Monkey",
    desc: "A living map of service nodes. Inject failures, toggle retries and circuit breakers, and observe cascading blast-radius failures and recovery timelines.",
    tag: "Resilience",
  },
  {
    href: "/simulator/raft",
    title: "Raft distributed consensus",
    desc: "Watch leader-election heartbeats and split-brain scenarios in a visual cluster, then ask the Professor how it guarantees consistency across replicas.",
    tag: "Consensus",
  },
  {
    href: "/simulator/llm",
    title: "LLM transformer internals",
    desc: "Visualize matrix multiplications, query self-attention states, and understand how modern transformers generate tokens, one at a time.",
    tag: "AI Engine",
  },
  {
    href: "/simulator/visualgo",
    title: "B-Tree database indexing",
    desc: "Insert index values, watch nodes split and balance in real time, and see why disk-bound indexes use balanced multi-way B-trees.",
    tag: "Database",
  },
  {
    href: "/simulator/complexity",
    title: "Big-O & sorting — visualized",
    desc: "See why an algorithm's shape beats its raw speed: drag the input size and watch cost explode, then race five sorting algorithms on the same array.",
    tag: "Algorithms",
  },
];

export default function SimulatorHub() {
  return (
    <div className="ed-rise" style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 32px 80px" }}>
      {/* Header */}
      <div style={{ borderBottom: "2px solid var(--ink)", paddingBottom: 18, marginBottom: 24 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 10.5, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 12 }}>
          Demonstration · Fig. 7
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 52, letterSpacing: "-.02em", margin: "0 0 8px" }}>The Simulator</h1>
        <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--ink-2)", maxWidth: 620, margin: 0 }}>
          Don't merely read that systems fail — make them fail. Raise the traffic, withdraw a server, and observe.
        </p>
      </div>

      {/* Live featured demo */}
      <LoadSim />

      {/* The rest of the demonstrations */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", margin: "52px 0 14px" }}>
        <h2 style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--ink-3)", margin: 0 }}>
          More demonstrations
        </h2>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)" }}>{SIMS.length} interactive</span>
      </div>

      <div style={{ border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
        {SIMS.map((s, i) => (
          <Link
            key={s.href}
            href={s.href}
            className="ed-domain"
            style={{ display: "flex", alignItems: "center", gap: 22, padding: "20px 24px", borderBottom: i < SIMS.length - 1 ? "1px solid var(--border)" : "none" }}
          >
            <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 10.5, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--primary)", minWidth: 96 }}>
              {s.tag}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 21, letterSpacing: "-.01em", marginBottom: 4 }}>{s.title}</div>
              <div style={{ fontSize: 14.5, lineHeight: 1.55, color: "var(--ink-2)" }}>{s.desc}</div>
            </div>
            <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 20, color: "var(--primary)" }}>→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
