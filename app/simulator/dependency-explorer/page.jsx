import Link from "next/link";
import DependencyExplorer from "@/components/dependencies/DependencyExplorer";

export default function DependencyExplorerPage() {
  return (
    <main className="wrap" style={{ paddingTop: 44, paddingBottom: 44 }}>
      <Link
        href="/simulator"
        style={{
          fontSize: 13.5,
          color: "var(--muted)",
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 22
        }}
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M11 6l-6 6 6 6" />
        </svg>
        All simulators
      </Link>

      <div
        className="card"
        style={{
          padding: "32px 30px",
          borderRadius: "var(--radius-xl)",
          background: "var(--surface)",
          border: "1px solid var(--hairline)",
          boxShadow: "var(--shadow-lg)"
        }}
      >
        <DependencyExplorer />
      </div>

      <div
        style={{
          marginTop: 22,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12
        }}
      >
        <p className="muted" style={{ fontSize: 14 }}>
          Want to understand how these patterns are coded in production?
        </p>
        <Link href="/codex/backend" className="btn btn-ghost">
          Read Part 04 — Backend &rarr;
        </Link>
      </div>
    </main>
  );
}
