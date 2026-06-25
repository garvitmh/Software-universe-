import Link from "next/link";
import ComplexityChart from "@/components/sim/ComplexityChart";
import SortRace from "@/components/sim/SortRace";

export const metadata = {
  title: "Big-O & sorting — visualized · Software Universe",
  description: "See why an algorithm's shape matters more than its speed: watch how cost grows, and watch five sorts race.",
};

export default function ComplexityPage() {
  return (
    <div className="ed-rise" style={{ maxWidth: 900, margin: "0 auto", padding: "48px 32px 80px" }}>
      <Link href="/simulator" style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--ink-3)", display: "inline-block", marginBottom: 22 }}>
        ← The Simulator
      </Link>

      <div style={{ borderBottom: "2px solid var(--ink)", paddingBottom: 18, marginBottom: 26 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 10.5, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 12 }}>
          Demonstration · Big-O
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 48, letterSpacing: "-.02em", margin: "0 0 8px" }}>How fast does it grow?</h1>
        <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--ink-2)", maxWidth: 640, margin: 0 }}>
          The thing that matters about an algorithm isn't how fast it is on your laptop today — it's the <em>shape</em> of how
          its work grows as the input grows. That shape has a name: <strong style={{ color: "var(--ink)" }}>Big-O</strong>.
        </p>
      </div>

      <div className="prose" style={{ marginBottom: 28 }}>
        <p>
          Two algorithms can both feel instant on ten items. Push them to a million and one finishes before you blink while the
          other would outlast the universe. Big-O is how we tell them apart <em>before</em> that day arrives. Drag the input size
          and watch the gap open — the vertical axis is logarithmic, so each gridline is <em>ten times</em> the one below it, and
          the lines <em>still</em> fan out.
        </p>
      </div>

      <ComplexityChart />

      <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 30, letterSpacing: "-.01em", margin: "48px 0 12px" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 13, color: "var(--ink-3)", marginRight: 12, verticalAlign: "middle" }}>§</span>
        Watch them sort
      </h2>
      <div className="prose" style={{ marginBottom: 24 }}>
        <p>
          Here's the same lesson with your own eyes. Every one of these sorts the <em>same</em> shuffled bars — but look at the
          comparison counts. The <strong style={{ color: "var(--ink)" }}>O(n²)</strong> sorts (bubble, insertion, selection) do
          hundreds of comparisons; the <strong style={{ color: "var(--ink)" }}>O(n log n)</strong> sorts (merge, quick) do a
          fraction. Pick one, hit play, and feel the difference.
        </p>
      </div>

      <SortRace />

      <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".06em", color: "var(--ink-3)", marginTop: 28 }}>
        Want to practise spotting the right pattern? Head to the{" "}
        <Link href="/dsa" style={{ color: "var(--primary)", borderBottom: "1px solid var(--primary)" }}>DSA Lab</Link>. Stuck on a term? Press ⌘/Ctrl K.
      </p>
    </div>
  );
}
