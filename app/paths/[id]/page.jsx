import Link from "next/link";
import { notFound } from "next/navigation";
import { PATHS, getPath } from "@/lib/paths";
import PathSteps from "@/components/paths/PathSteps";

export function generateStaticParams() {
  return PATHS.map((p) => ({ id: p.id }));
}

export function generateMetadata({ params }) {
  const p = getPath(params.id);
  return { title: p ? `${p.title} — a guided path · Software Universe` : "Guided path" };
}

export default function PathReader({ params }) {
  const p = getPath(params.id);
  if (!p) notFound();

  return (
    <div className="ed-rise" style={{ maxWidth: 760, margin: "0 auto", padding: "48px 32px 80px" }}>
      <Link href="/paths" style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--ink-3)", display: "inline-block", marginBottom: 22 }}>
        ← All paths
      </Link>

      <div style={{ borderBottom: "2px solid var(--ink)", paddingBottom: 18, marginBottom: 26 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 10.5, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 12 }}>
          Guided path · {p.steps.length} stops
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 46, letterSpacing: "-.02em", margin: "0 0 6px" }}>{p.title}</h1>
        <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 22, color: "var(--ink-2)", margin: "0 0 12px" }}>{p.subtitle}</p>
        <p style={{ fontSize: 17, lineHeight: 1.6, color: "var(--ink-2)", margin: 0 }}>{p.blurb}</p>
      </div>

      <PathSteps steps={p.steps} />

      <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".06em", color: "var(--ink-3)", marginTop: 26 }}>
        Steps tick off as you read them. Stuck on a word? Press ⌘/Ctrl&nbsp;K to ask the Professor.
      </p>
    </div>
  );
}
