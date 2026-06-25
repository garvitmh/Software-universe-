import Link from "next/link";
import Sandbox from "@/components/playground/Sandbox";

export const metadata = {
  title: "The Playground — run it yourself · Software Universe",
  description: "Write JavaScript and run it right here, safely. Reading is one thing; making the machine do it is another.",
};

export default function PlaygroundPage() {
  return (
    <div className="ed-rise" style={{ maxWidth: 900, margin: "0 auto", padding: "48px 32px 80px" }}>
      <div style={{ borderBottom: "2px solid var(--ink)", paddingBottom: 18, marginBottom: 26 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 10.5, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 12 }}>
          Practice · The Playground
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 48, letterSpacing: "-.02em", margin: "0 0 8px" }}>Run it yourself</h1>
        <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--ink-2)", maxWidth: 640, margin: 0 }}>
          Reading about code and making the machine actually <em>do</em> it are different skills. Here's a real
          <strong style={{ color: "var(--ink)" }}> JavaScript and Python</strong> sandbox — type, press Run, and watch what
          happens. Start from an example or write your own.
        </p>
      </div>

      <div className="prose" style={{ marginBottom: 24 }}>
        <p>
          Your code runs in an isolated background thread, so a mistake can't hurt anything — a JavaScript infinite loop is
          stopped after two seconds. Print with <code>console.log(...)</code> in JavaScript or <code>print(...)</code> in
          Python. The first Python run downloads the language runtime (a real Python, compiled to WebAssembly), so give it a
          few seconds; every run after that is quick.
        </p>
      </div>

      <Sandbox />

      <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".06em", color: "var(--ink-3)", marginTop: 28 }}>
        Pair this with the{" "}
        <Link href="/dsa" style={{ color: "var(--primary)", borderBottom: "1px solid var(--primary)" }}>DSA Lab</Link> and the{" "}
        <Link href="/simulator/complexity" style={{ color: "var(--primary)", borderBottom: "1px solid var(--primary)" }}>Big-O visualizer</Link>. Stuck? Press ⌘/Ctrl K.
      </p>
    </div>
  );
}
