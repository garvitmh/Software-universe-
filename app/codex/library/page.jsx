import Link from "next/link";
import CardSpotlight from "@/components/ui/CardSpotlight";
import { BookOpenIcon, LibraryIcon, ChevronRightIcon, CpuIcon, ServerIcon, DatabaseIcon } from "@/components/ui/Icons";

const LIBRARY_ITEMS = [
  {
    slug: "google-sre-introduction",
    title: "Google SRE: Introduction",
    author: "Benjamin Treynor Sloss",
    type: "book",
    source: "Google SRE Book - Chapter 1",
    desc: "Understand the core principles of SRE, how it differs from traditional sysadmin ops, and the 50% rule for SRE engineering time.",
    category: "Site Reliability",
    color: "var(--purple)",
    bgColor: "var(--purple-soft)"
  },
  {
    slug: "google-sre-monitoring",
    title: "Google SRE: Monitoring Distributed Systems",
    author: "Betsy Beyer et al.",
    type: "book",
    source: "Google SRE Book - Chapter 6",
    desc: "Learn about the Golden Signals (latency, traffic, errors, saturation), metric tracking, and the architecture of alerts.",
    category: "Monitoring",
    color: "var(--teal)",
    bgColor: "var(--teal-soft)"
  },
  {
    slug: "google-sre-failures",
    title: "Google SRE: Addressing Cascading Failures",
    author: "Betsy Beyer et al.",
    type: "book",
    source: "Google SRE Book - Chapter 22",
    desc: "Deep dive into backpressure, queue overflows, retry storms, circuit breakers, and immediate incident mitigation techniques.",
    category: "Resilience",
    color: "var(--pink)",
    bgColor: "var(--pink-soft)"
  },
  {
    slug: "stripe-idempotency",
    title: "Stripe: Idempotency Keys in Payment APIs",
    author: "Stripe Engineering",
    type: "blog",
    source: "Stripe Tech Blog",
    desc: "How Stripe prevents double charging. A detailed guide on unique idempotency keys, request deduping, and distributed transaction locks.",
    category: "Payments",
    color: "var(--brand)",
    bgColor: "var(--brand-soft)"
  },
  {
    slug: "discord-scylldadb",
    title: "Discord: Storing Billions of Messages on ScyllaDB",
    author: "Discord Engineering",
    type: "blog",
    source: "Discord Tech Blog",
    desc: "Why Discord migrated from Cassandra to ScyllaDB. Database clustering, performance bottlenecks, and indexing billions of real-time packets.",
    category: "Databases",
    color: "var(--blue)",
    bgColor: "var(--blue-soft)"
  }
];

const REPOS = [
  { name: "every-programmer-should-know", desc: "Hardware latency numbers, memory layers, and network latency constraints.", icon: CpuIcon },
  { name: "ai-engineering-from-scratch", desc: "Code-first neural networks, tensors, and multi-agent coordination flows.", icon: ServerIcon },
  { name: "awesome-sre", desc: "Curated lists of playbooks, SLO monitors, and alert runbooks.", icon: LibraryIcon },
  { name: "professional-programming", desc: "Architectural design patterns, refactoring checklists, and clean code principles.", icon: DatabaseIcon }
];

export default function LibraryPage() {
  return (
    <main
      style={{
        padding: "40px 24px 80px",
        maxWidth: 1200,
        margin: "0 auto",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 32,
      }}
      className="library-container"
    >
      {/* Background Grid Pattern */}
      <div style={{
        position: "absolute",
        top: 62,
        left: 0,
        width: "100%",
        height: "500px",
        pointerEvents: "none",
        zIndex: 0,
        backgroundImage: "radial-gradient(circle at 1px 1px, var(--hairline-2) 1px, transparent 0)",
        backgroundSize: "24px 24px",
        opacity: 0.4,
        maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)"
      }} />

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
        <Link
          href="/"
          style={{
            fontSize: "13.5px",
            color: "var(--muted)",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <ChevronRightIcon size={14} style={{ transform: "rotate(180deg)" }} />
          Back to the campus
        </Link>
        <div>
          <span className="pill" style={{ background: "var(--brand-soft)", color: "var(--brand-2)", marginBottom: 12, display: "inline-block" }}>
            World 1 · The Codex · Core Library
          </span>
          <h1 style={{ fontSize: "clamp(34px, 5vw, 46px)", fontWeight: "600", fontFamily: "Fraunces" }}>
            The Engineering Library
          </h1>
          <p style={{ fontSize: "16px", color: "var(--ink-2)", maxWidth: "600px", marginTop: "8px", lineHeight: "1.55" }}>
            Read world-class engineering blogs, textbooks, and open-source resources directly inside Software Universe. Grounded by our inline Socratic RAG helper.
          </p>
        </div>
      </div>

      {/* Bento Grid of books and blogs */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20, position: "relative", zIndex: 1 }}>
        {LIBRARY_ITEMS.map((item, idx) => {
          // Asymmetrical spanning for the first two cards to create a Bento Grid feel
          const gridColumn = idx < 2 ? "span 1" : "auto";
          
          return (
            <Link key={item.slug} href={`/codex/library/${item.slug}`} style={{ display: "block" }}>
              <CardSpotlight
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  padding: "24px",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--hairline)",
                  background: "var(--surface)",
                }}
                glowColor={item.color === "var(--brand)" ? "rgba(232, 86, 10, 0.1)" : "rgba(99, 102, 241, 0.08)"}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <span
                    className="pill"
                    style={{
                      backgroundColor: item.bgColor,
                      color: item.color,
                      fontWeight: "700",
                      fontSize: "11px",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em"
                    }}
                  >
                    {item.category}
                  </span>
                  <span style={{ fontSize: "12px", color: "var(--muted)", fontWeight: "500" }}>
                    {item.type === "book" ? "Book Chapter" : "Tech Blog"}
                  </span>
                </div>
                
                <h3 style={{ fontSize: "20px", fontFamily: "Fraunces", color: "var(--ink)", fontWeight: "600", flex: "0 0 auto", lineHeight: "1.25" }}>
                  {item.title}
                </h3>
                <span style={{ fontSize: "12.5px", color: "var(--muted)", display: "block", marginTop: "4px" }}>
                  By {item.author} ({item.source})
                </span>
                
                <p style={{ fontSize: "14px", color: "var(--ink-2)", marginTop: "12px", lineHeight: "1.55", flex: "1 0 auto" }}>
                  {item.desc}
                </p>
                
                <div style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--brand-2)", fontWeight: "700", fontSize: "13.5px", marginTop: "20px" }}>
                  Read document
                  <ChevronRightIcon size={16} />
                </div>
              </CardSpotlight>
            </Link>
          );
        })}
      </section>

      {/* Cloned Repositories Section */}
      <section style={{ position: "relative", zIndex: 1, marginTop: 24 }}>
        <h3 style={{ fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", marginBottom: 16, borderBottom: "1px solid var(--hairline)", paddingBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
          <LibraryIcon size={16} style={{ color: "var(--brand)" }} />
          Ingested Repositories (Codebase Contexts)
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          {REPOS.map((repo) => {
            const Icon = repo.icon;
            return (
              <div
                key={repo.name}
                className="card"
                style={{
                  padding: "20px",
                  borderRadius: "var(--radius)",
                  border: "1px solid var(--hairline)",
                  background: "var(--surface-warm)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--brand-2)" }}>
                  <Icon size={20} />
                  <span style={{ fontWeight: "700", fontSize: "14px", color: "var(--ink)" }}>{repo.name}</span>
                </div>
                <p style={{ fontSize: "13px", color: "var(--ink-2)", lineHeight: "1.45" }}>
                  {repo.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
