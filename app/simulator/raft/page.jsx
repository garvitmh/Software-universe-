import Link from "next/link";
import RaftSim from "@/components/sim/RaftSim";

export const metadata = {
  title: "Raft consensus — visualized · Software Universe",
  description: "Watch a cluster of machines elect a leader, survive a crash, and refuse to split-brain — the heart of distributed consensus.",
};

export default function RaftPage() {
  return (
    <div className="ed-rise" style={{ maxWidth: 900, margin: "0 auto", padding: "48px 32px 80px" }}>
      <Link href="/simulator" style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--ink-3)", display: "inline-block", marginBottom: 22 }}>
        ← The Simulator
      </Link>

      <div style={{ borderBottom: "2px solid var(--ink)", paddingBottom: 18, marginBottom: 26 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 10.5, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 12 }}>
          Demonstration · Distributed consensus
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 48, letterSpacing: "-.02em", margin: "0 0 8px" }}>How machines agree</h1>
        <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--ink-2)", maxWidth: 640, margin: 0 }}>
          Five servers, no boss. Somehow they must agree on a single <strong style={{ color: "var(--ink)" }}>leader</strong> — even
          when one crashes or the network splits in two. This is <strong style={{ color: "var(--ink)" }}>Raft</strong>, the
          consensus algorithm behind systems like etcd and CockroachDB.
        </p>
      </div>

      <div className="prose" style={{ marginBottom: 24 }}>
        <p>
          Every server starts as a <strong style={{ color: "var(--ink)" }}>follower</strong> with a random countdown (the ring
          around it). If a follower's countdown hits zero without hearing from a leader, it becomes a{" "}
          <strong style={{ color: "var(--ink)" }}>candidate</strong>, bumps the <em>term</em> (a logical clock), and asks everyone
          to vote. Win a <em>majority</em> of the whole cluster and you're the <strong style={{ color: "var(--ink)" }}>leader</strong>;
          the leader then sends <em>heartbeats</em> that reset everyone's countdown so no one challenges it. Randomized timeouts
          make it very unlikely two servers run at once — that's how ties are avoided.
        </p>
      </div>

      <RaftSim />

      <div className="prose" style={{ marginTop: 28 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 26, letterSpacing: "-.01em", margin: "0 0 12px" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 13, color: "var(--ink-3)", marginRight: 12, verticalAlign: "middle" }}>§</span>
          Try to break it
        </h2>
        <ul style={{ paddingLeft: 18, display: "flex", flexDirection: "column", gap: 8 }}>
          <li style={{ fontSize: 16, color: "var(--ink-2)", lineHeight: 1.6 }}>
            <strong style={{ color: "var(--ink)" }}>Crash the leader.</strong> Heartbeats stop, a follower times out, and a new
            election picks a fresh leader at a higher term. That's fault tolerance.
          </li>
          <li style={{ fontSize: 16, color: "var(--ink-2)", lineHeight: 1.6 }}>
            <strong style={{ color: "var(--ink)" }}>Split the network</strong> into a side of 3 and a side of 2. The side of 3 can
            still reach a majority and keep (or elect) a leader; the side of 2 <em>never can</em> — it needs 3 votes and only has 2.
            That refusal is how Raft prevents <strong style={{ color: "var(--ink)" }}>split-brain</strong> (two leaders disagreeing).
            Heal the partition and the lone side rejoins under the higher term.
          </li>
        </ul>
        <p style={{ marginTop: 12, color: "var(--ink-2)" }}>
          (One thing this view simplifies: the real algorithm also replicates a <em>log</em> of commands and only commits an entry
          once a majority has stored it. The election you see here is the foundation that makes that safe.)
        </p>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".06em", color: "var(--ink-3)", marginTop: 20 }}>
          Read the full entry:{" "}
          <Link href="/codex/tech/distributed-consensus" style={{ color: "var(--primary)", borderBottom: "1px solid var(--primary)" }}>Distributed consensus</Link>. Stuck? Press ⌘/Ctrl K.
        </p>
      </div>
    </div>
  );
}
