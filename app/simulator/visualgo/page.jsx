import Link from "next/link";
import BTreeSim from "@/components/sim/BTreeSim";

export const metadata = {
  title: "B-tree index — visualized · Software Universe",
  description: "Insert keys into a real B-tree and watch nodes overflow, split, and push a key up — the exact structure that keeps a database index shallow enough to search in a handful of disk reads.",
};

export default function VisualgoPage() {
  return (
    <div className="ed-rise" style={{ maxWidth: 900, margin: "0 auto", padding: "48px 32px 80px" }}>
      <Link href="/simulator" style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--ink-3)", display: "inline-block", marginBottom: 22 }}>
        ← The Simulator
      </Link>

      <div style={{ borderBottom: "2px solid var(--ink)", paddingBottom: 18, marginBottom: 26 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 10.5, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 12 }}>
          Demonstration · How databases find things fast
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 48, letterSpacing: "-.02em", margin: "0 0 8px" }}>Why an index stays shallow</h1>
        <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--ink-2)", maxWidth: 660, margin: 0 }}>
          A table with a million rows can find one of them in a handful of steps. The trick is a{" "}
          <strong style={{ color: "var(--ink)" }}>B-tree</strong> — a tree built to be <em>wide and short</em>, because every
          step down it is a slow read from disk. Add keys below and watch it grow the way a real database index does.
        </p>
      </div>

      <div className="prose" style={{ marginBottom: 24 }}>
        <p>
          Each box is a <strong style={{ color: "var(--ink)" }}>node</strong> holding sorted keys. This one is a{" "}
          <em>2-3-4 tree</em>: a node may hold up to three keys. Insert a fourth and the node{" "}
          <strong style={{ color: "var(--ink)" }}>overflows</strong> — it splits in two and shoves its middle key up to the
          parent. Keep going and that push-up eventually reaches the top and the whole tree gets one level taller. Crucially, a
          B-tree only ever grows <strong style={{ color: "var(--ink)" }}>at the root</strong>, never at the leaves, so every
          leaf stays the same distance from the top — the tree is always perfectly balanced for free.
        </p>
      </div>

      <BTreeSim />

      <div className="prose" style={{ marginTop: 28 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 26, letterSpacing: "-.01em", margin: "0 0 12px" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 13, color: "var(--ink-3)", marginRight: 12, verticalAlign: "middle" }}>§</span>
          What to notice
        </h2>
        <ul style={{ paddingLeft: 18, display: "flex", flexDirection: "column", gap: 8 }}>
          <li style={{ fontSize: 16, color: "var(--ink-2)", lineHeight: 1.6 }}>
            <strong style={{ color: "var(--ink)" }}>The height barely moves.</strong> Hit "Insert random" twenty times. The key
            count climbs fast; the height creeps up by one only now and then. A lookup visits exactly <em>height</em> nodes —
            and height grows like a <em>logarithm</em>, so a million keys is still only a few levels deep.
          </li>
          <li style={{ fontSize: 16, color: "var(--ink-2)", lineHeight: 1.6 }}>
            <strong style={{ color: "var(--ink)" }}>Why not a normal binary tree?</strong> A binary search tree visits one key
            per step, so it's tall and skinny — a million keys means ~20 levels, ~20 disk reads. A B-tree packs many keys per
            node, so it's short and fat: fewer levels, fewer reads. On disk, the number of <em>reads</em> is what hurts, not the
            number of comparisons.
          </li>
          <li style={{ fontSize: 16, color: "var(--ink-2)", lineHeight: 1.6 }}>
            <strong style={{ color: "var(--ink)" }}>Try a duplicate.</strong> Insert a key that's already there — it's refused,
            because index keys are unique, exactly like a primary key in a real table.
          </li>
        </ul>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".06em", color: "var(--ink-3)", marginTop: 20 }}>
          Read the full entry:{" "}
          <Link href="/codex/tech/sql" style={{ color: "var(--primary)", borderBottom: "1px solid var(--primary)" }}>SQL &amp; indexes</Link>. Stuck? Press ⌘/Ctrl K.
        </p>
      </div>
    </div>
  );
}
