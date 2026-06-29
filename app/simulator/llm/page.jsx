import Link from "next/link";
import LLMSim from "@/components/sim/LLMSim";

export const metadata = {
  title: "How an LLM writes — visualized · Software Universe",
  description: "Watch a language model turn context into a probability distribution over the next word, reshape it with temperature, and generate text one token at a time — the real autoregressive loop, runnable in your browser.",
};

export default function LlmPage() {
  return (
    <div className="ed-rise" style={{ maxWidth: 900, margin: "0 auto", padding: "48px 32px 80px" }}>
      <Link href="/simulator" style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--ink-3)", display: "inline-block", marginBottom: 22 }}>
        ← The Simulator
      </Link>

      <div style={{ borderBottom: "2px solid var(--ink)", paddingBottom: 18, marginBottom: 26 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 10.5, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 12 }}>
          Demonstration · How a language model writes
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 48, letterSpacing: "-.02em", margin: "0 0 8px" }}>One word at a time</h1>
        <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--ink-2)", maxWidth: 680, margin: 0 }}>
          A language model doesn't write a sentence — it writes <strong style={{ color: "var(--ink)" }}>one token</strong>, then
          reads everything so far and writes the next, over and over. Each step is really just{" "}
          <strong style={{ color: "var(--ink)" }}>a probability for every possible next word</strong>. Below is a tiny model you
          can actually run: watch it build that distribution, then pick from it.
        </p>
      </div>

      <div className="prose" style={{ marginBottom: 24 }}>
        <p>
          Press <strong style={{ color: "var(--ink)" }}>Generate</strong> and three things happen, exactly as in a real model:
          it looks at the <strong style={{ color: "var(--ink)" }}>context</strong> (the words so far), produces a{" "}
          <strong style={{ color: "var(--ink)" }}>probability distribution</strong> over what comes next (the bars), and{" "}
          <strong style={{ color: "var(--ink)" }}>samples</strong> one — which becomes part of the context for the next step.
          The <strong style={{ color: "var(--ink)" }}>temperature</strong> dial controls how boldly it samples. You can also{" "}
          <em>click any bar</em> to choose the word yourself.
        </p>
      </div>

      <LLMSim />

      <div className="prose" style={{ marginTop: 28 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 26, letterSpacing: "-.01em", margin: "0 0 12px" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 13, color: "var(--ink-3)", marginRight: 12, verticalAlign: "middle" }}>§</span>
          What to notice
        </h2>
        <ul style={{ paddingLeft: 18, display: "flex", flexDirection: "column", gap: 8 }}>
          <li style={{ fontSize: 16, color: "var(--ink-2)", lineHeight: 1.6 }}>
            <strong style={{ color: "var(--ink)" }}>Temperature is the personality dial.</strong> Near 0 the model is greedy —
            it always takes the tallest bar, so it's repetitive and safe. Crank it up and the bars flatten, so it takes risks and
            gets creative (or starts babbling). Same model, one number.
          </li>
          <li style={{ fontSize: 16, color: "var(--ink-2)", lineHeight: 1.6 }}>
            <strong style={{ color: "var(--ink)" }}>Context shapes everything.</strong> The highlighted words are what the model
            is conditioning on. Change the starting words and the whole distribution changes — that's why your prompt matters so
            much. (When this small model has never seen the exact context, it <em>backs off</em> to less context — a real
            limitation that bigger models fix with far more training data.)
          </li>
          <li style={{ fontSize: 16, color: "var(--ink-2)", lineHeight: 1.6 }}>
            <strong style={{ color: "var(--ink)" }}>It's a loop, not a plan.</strong> The model never decides the whole sentence
            up front. Each word is chosen knowing only what came before — which is exactly why it can surprise even itself.
          </li>
        </ul>

        <div style={{ border: "1px solid var(--border-2)", borderLeft: "3px solid var(--bronze)", borderRadius: 6, padding: "14px 16px", marginTop: 18, background: "var(--surface)" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--bronze)", marginBottom: 7 }}>An honest footnote</div>
          <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "var(--ink-2)", margin: 0 }}>
            This toy builds its probabilities by <em>counting</em> word sequences in a handful of sentences. A real LLM is a giant{" "}
            neural network that learns those probabilities from trillions of words, and uses a mechanism called{" "}
            <strong style={{ color: "var(--ink)" }}>attention</strong> to weigh which earlier words matter most for the next one —
            far more powerful than counting. But the outer loop you just drove — <em>context → distribution → sample → repeat</em> —
            is genuinely how every one of them, from the smallest to GPT-scale, produces text.
          </p>
        </div>

        <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".06em", color: "var(--ink-3)", marginTop: 20 }}>
          Read the full entry:{" "}
          <Link href="/codex/tech/neural-networks" style={{ color: "var(--primary)", borderBottom: "1px solid var(--primary)" }}>What a neural network computes</Link>. Stuck? Press ⌘/Ctrl K.
        </p>
      </div>
    </div>
  );
}
