import Link from "next/link";
import Roadmap from "@/components/Roadmap";
import { TECH_CONTENT } from "@/lib/tech-content";

export const metadata = {
  title: "The Roadmap · Software Universe",
  description: "An interactive map of the whole stack and its deepest flows.",
};

export default function RoadmapPage() {
  const readyTech = Object.keys(TECH_CONTENT);
  return (
    <main className="wrap" style={{ paddingTop: 44, paddingBottom: 56, maxWidth: 920 }}>
      <Link href="/" style={{ fontSize: 13.5, color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 22 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
        Back to the campus
      </Link>

      <div style={{ marginBottom: 30, maxWidth: 640 }}>
        <span className="pill" style={{ background: "var(--brand-soft)", color: "var(--brand-2)", marginBottom: 14 }}>The Roadmap</span>
        <h1 style={{ fontSize: 42, lineHeight: 1.05 }}>The whole system, as a map you can walk.</h1>
        <p style={{ fontSize: 18, color: "var(--ink-2)", marginTop: 14, lineHeight: 1.55 }}>
          Click any node to open it — what it is, why it's there, and a door straight into the deep chapter, the tech page, or the live simulator. Then switch to <strong>Deep flows</strong> to step through exactly what happens, moment by moment, when an order is placed.
        </p>
      </div>

      <Roadmap readyTech={readyTech} />
    </main>
  );
}
