import Link from "next/link";
import ApiPlayground from "@/components/sim/ApiPlayground";

export const metadata = {
  title: "API playground — real live requests · Software Universe",
  description: "Send a real HTTP GET request to a free public API and watch the actual live response come back — status, timing, and JSON. The web's plumbing, with real data.",
};

export default function ApiPlaygroundPage() {
  return (
    <div className="ed-rise" style={{ maxWidth: 900, margin: "0 auto", padding: "48px 32px 80px" }}>
      <Link href="/simulator" style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--ink-3)", display: "inline-block", marginBottom: 22 }}>
        ← The Simulator
      </Link>

      <div style={{ borderBottom: "2px solid var(--ink)", paddingBottom: 18, marginBottom: 26 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 10.5, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 12 }}>
          Demonstration · The web's plumbing
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 48, letterSpacing: "-.02em", margin: "0 0 8px" }}>Ask the internet a question</h1>
        <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--ink-2)", maxWidth: 660, margin: 0 }}>
          Almost everything an app shows you — a price, the weather, a profile — it got by{" "}
          <strong style={{ color: "var(--ink)" }}>asking another computer</strong> over the internet. Below you can send that
          exact kind of request yourself, to real public services, and watch the <strong style={{ color: "var(--ink)" }}>live
          answer</strong> come back. No keys, no sign-up — this is the real thing, running in your browser right now.
        </p>
      </div>

      <div className="prose" style={{ marginBottom: 24 }}>
        <p>
          A request has a <strong style={{ color: "var(--ink)" }}>verb</strong> and an <strong style={{ color: "var(--ink)" }}>address</strong>.
          The verb here is <code>GET</code> — "fetch me this, don't change anything." The address (the{" "}
          <em>URL</em>) names exactly what you want. Press <strong style={{ color: "var(--ink)" }}>Send</strong> and three things
          come back: a <strong style={{ color: "var(--ink)" }}>status code</strong> (200 means "here you go", 404 means "no such
          thing", 500 means "I broke"), how <strong style={{ color: "var(--ink)" }}>long</strong> it took, and the{" "}
          <strong style={{ color: "var(--ink)" }}>body</strong> — the actual data, almost always in a format called{" "}
          <strong style={{ color: "var(--ink)" }}>JSON</strong> (labelled boxes of values that every language can read).
        </p>
      </div>

      <ApiPlayground />

      <div className="prose" style={{ marginTop: 28 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 26, letterSpacing: "-.01em", margin: "0 0 12px" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 13, color: "var(--ink-3)", marginRight: 12, verticalAlign: "middle" }}>§</span>
          Things to try
        </h2>
        <ul style={{ paddingLeft: 18, display: "flex", flexDirection: "column", gap: 8 }}>
          <li style={{ fontSize: 16, color: "var(--ink-2)", lineHeight: 1.6 }}>
            <strong style={{ color: "var(--ink)" }}>Send the same request twice.</strong> The crypto price and the Space Station's
            position change between sends — proof you're hitting a live server, not a saved file.
          </li>
          <li style={{ fontSize: 16, color: "var(--ink-2)", lineHeight: 1.6 }}>
            <strong style={{ color: "var(--ink)" }}>Edit the URL.</strong> In the GitHub one, swap <code>facebook/react</code> for{" "}
            <code>torvalds/linux</code>. In the weather one, change the latitude/longitude to your own city. The response changes
            to match — that's how one API serves millions of different questions.
          </li>
          <li style={{ fontSize: 16, color: "var(--ink-2)", lineHeight: 1.6 }}>
            <strong style={{ color: "var(--ink)" }}>Break it on purpose.</strong> Add a typo to the URL. You'll likely get a{" "}
            <code>404</code> (the server understood but has no such thing) — or a <em>blocked</em> error, which means the server
            didn't grant your browser permission to read its answer. That permission rule is called{" "}
            <strong style={{ color: "var(--ink)" }}>CORS</strong>, and bumping into it is a rite of passage for every web developer.
          </li>
        </ul>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".06em", color: "var(--ink-3)", marginTop: 20 }}>
          Read the full entry:{" "}
          <Link href="/codex/tech/http-rest" style={{ color: "var(--primary)", borderBottom: "1px solid var(--primary)" }}>HTTP &amp; REST</Link>. Stuck? Press ⌘/Ctrl K.
        </p>
      </div>
    </div>
  );
}
