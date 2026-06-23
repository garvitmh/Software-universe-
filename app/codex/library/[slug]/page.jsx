import fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import SplitPaneViewer from "@/components/SplitPaneViewer";

// Each library item. `file` is the (optional) scraped HTML in the data lake; if
// it's absent (the common, deploy-safe case) we render `summaryHtml` — a curated,
// in-repo explainer — plus the working Socratic assistant. Never 404s on content.
const SLUG_TO_FILE = {
  "google-sre-introduction": {
    file: "books/google-sre/introduction.html",
    title: "Google SRE: Introduction",
    concept: "Site Reliability Engineering SRE",
    query: "Explain what Google SRE is, Benjamin Treynor's SRE definition, error budgets, and the 50% ops cap.",
    sourceUrl: "https://sre.google/sre-book/introduction/",
    summaryHtml: `<h3>What SRE is</h3>
<p>Site Reliability Engineering, born at Google, is <strong>"what happens when you ask a software engineer to design an operations team."</strong> Instead of a team that manually keeps services running, SRE applies software engineering to operations — automating away toil and treating reliability as a feature you can measure.</p>
<p>The defining idea is the <strong>error budget</strong>. 100% reliability is the wrong target — impossibly expensive, and users can't tell the difference. You pick a Service Level Objective (say 99.9%); the remaining 0.1% is a budget you can "spend" shipping features and taking risks. Burn it and releases slow down to recover reliability; stay under it and you move fast.</p>
<p>Google also caps "ops" work at <strong>50%</strong> — at least half an SRE's time must go to engineering that reduces future toil, or the role decays back into manual firefighting.</p>`,
  },
  "google-sre-monitoring": {
    file: "books/google-sre/monitoring.html",
    title: "Google SRE: Monitoring",
    concept: "SRE Golden Signals Monitoring",
    query: "Explain SRE monitoring, the four golden signals, white-box vs black-box, and alerting on symptoms not causes.",
    sourceUrl: "https://sre.google/sre-book/monitoring-distributed-systems/",
    summaryHtml: `<h3>The Four Golden Signals</h3>
<p>If you can measure only four things about a user-facing system, measure these: <strong>Latency</strong> (how long requests take — track success and failure separately), <strong>Traffic</strong> (demand, e.g. requests/sec), <strong>Errors</strong> (rate of failed requests), and <strong>Saturation</strong> (how "full" the system is — the resource closest to its limit).</p>
<p>Monitoring comes in two flavours: <strong>black-box</strong> (probe from outside, as a user would) and <strong>white-box</strong> (internal metrics the system emits about itself). White-box tells you <em>why</em>; black-box tells you <em>what the user feels</em>.</p>
<p>The golden rule of alerting: <strong>page a human only for problems that are urgent, real, and actionable.</strong> Alerting on causes instead of symptoms — or on things nobody can act on — creates fatigue, and fatigue is how the one real page gets missed.</p>`,
  },
  "google-sre-failures": {
    file: "books/google-sre/cascading-failures.html",
    title: "Google SRE: Cascading Failures",
    concept: "Cascading failure distributed systems",
    query: "Explain cascading failures, retry storms, backpressure, circuit breakers, and how SREs recover.",
    sourceUrl: "https://sre.google/sre-book/addressing-cascading-failures/",
    summaryHtml: `<h3>Cascading failures</h3>
<p>A cascading failure is a small problem that snowballs: one overloaded server slows, its requests time out, clients <strong>retry</strong>, the retries pile on more load, and the overload spreads to healthy servers until the whole system is down. The trigger is often tiny — a deploy, a traffic spike, a slow dependency.</p>
<p>The accelerant is usually <strong>retry storms</strong>: well-meaning retries multiply load exactly when the system can least handle it. Defenses include <strong>backpressure</strong> (reject early when overloaded rather than queueing forever), <strong>circuit breakers</strong> (stop calling a failing dependency for a while), bounded queues, jittered exponential backoff, and load shedding.</p>
<p>Recovery is counter-intuitive: you often must <strong>reduce</strong> load (drop traffic, disable retries, even restart) before the system can climb out — because it's stuck in a state where it can't serve the very load keeping it down.</p>`,
  },
  "stripe-idempotency": {
    file: "blogs/stripe-idempotency.html",
    title: "Stripe: Idempotency Keys",
    concept: "Idempotency keys payment API",
    query: "How does Stripe use idempotency keys to avoid double charges, and how is exactly-once guaranteed?",
    sourceUrl: "https://stripe.com/blog/idempotency",
    summaryHtml: `<h3>Idempotency keys</h3>
<p>Networks are unreliable: a client sends "charge ₹500", the response is lost, the client retries — and without protection, the customer is charged twice. Stripe's fix is the <strong>idempotency key</strong>: the client attaches a unique key to the request, and the server guarantees a request with that key is processed <strong>exactly once</strong>, no matter how many times it arrives.</p>
<p>The flow: on the first request the server does the work and stores the result against the key. Any later request with the same key returns the <em>stored</em> result instead of redoing the work. Uniqueness is enforced at the strongest level — a unique constraint or a distributed lock — so even two requests racing at the same instant can't both succeed.</p>
<p>That's why you can safely retry a payment: "at least once" delivery plus idempotency equals an "exactly once" effect.</p>`,
  },
  "discord-scylldadb": {
    file: "blogs/discord-scylldadb.html",
    title: "Discord: Storing Billions of Messages",
    concept: "Discord ScyllaDB migration",
    query: "Why did Discord migrate from Cassandra to ScyllaDB, and what database bottlenecks did it solve?",
    sourceUrl: "https://discord.com/blog/how-discord-stores-trillions-of-messages",
    summaryHtml: `<h3>Storing billions of messages</h3>
<p>Discord originally stored messages in <strong>Cassandra</strong>, but at billions of messages it hit serious pain: latency spikes, expensive "tombstones" from deletes, and constant operational toil from JVM garbage-collection pauses and hot partitions (a few huge channels overwhelming single nodes).</p>
<p>They migrated to <strong>ScyllaDB</strong> — a Cassandra-compatible database rewritten in C++ with a shard-per-core architecture and no garbage collector. Same data model, dramatically better and more predictable performance, far fewer nodes to operate.</p>
<p>The deeper lesson: at extreme scale the <strong>database is often the bottleneck</strong>, and choosing storage that matches your access pattern (and avoids GC pauses, hot partitions, and tombstone build-up) can matter more than any application-level tuning.</p>`,
  },
};

function cleanHtmlContent(html, slug) {
  let cleaned = html
    .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "")
    .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, "")
    .replace(/<iframe[^>]*>([\s\S]*?)<\/iframe>/gi, "");

  let bodyContent = cleaned;
  if (slug.startsWith("google-sre")) {
    const contentMatch = cleaned.match(/<div class="content" id="content">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/main>/i);
    if (contentMatch) bodyContent = contentMatch[1];
  } else if (slug === "stripe-idempotency" || slug === "discord-scylldadb") {
    const articleMatch = cleaned.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
    if (articleMatch) bodyContent = articleMatch[1];
  }
  return bodyContent.replace(/<noscript>[\s\S]*?<\/noscript>/gi, "");
}

export function generateStaticParams() {
  return Object.keys(SLUG_TO_FILE).map((slug) => ({ slug }));
}

export default function LibraryReaderPage({ params }) {
  const { slug } = params;
  const itemConfig = SLUG_TO_FILE[slug];
  if (!itemConfig) notFound();

  // Prefer the scraped HTML if the data lake has it; otherwise the curated summary.
  let bodyHtml = itemConfig.summaryHtml;
  let isCurated = true;
  try {
    const rawPath = path.join(process.cwd(), "data", "raw", itemConfig.file);
    if (fs.existsSync(rawPath)) {
      const cleaned = cleanHtmlContent(fs.readFileSync(rawPath, "utf8"), slug);
      if (cleaned && cleaned.trim().length > 200) {
        bodyHtml = cleaned;
        isCurated = false;
      }
    }
  } catch (err) {
    console.warn(`Library: falling back to curated summary for ${slug}: ${err.message}`);
  }

  const readerComponent = (
    <div style={{ padding: "40px 32px 80px", maxWidth: "760px", margin: "0 auto", backgroundColor: "var(--surface)", minHeight: "100%", borderLeft: "1px solid var(--hairline)", borderRight: "1px solid var(--hairline)" }}>
      <Link href="/codex/library" style={{ fontSize: "13px", color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: 4, marginBottom: "24px" }}>
        ← Back to library
      </Link>
      <span className="pill" style={{ background: "var(--purple-soft)", color: "var(--purple)", marginBottom: 12, display: "inline-block" }}>
        {itemConfig.title.split(":")[0]}
      </span>
      <div className="prose" style={{ fontSize: "16px", lineHeight: "1.75" }} dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      {isCurated && (
        <p style={{ marginTop: 28, paddingTop: 16, borderTop: "1px solid var(--hairline)", fontSize: 13.5, color: "var(--muted)", lineHeight: 1.6 }}>
          This is a Software Universe summary — ask the assistant (right) to go deeper on any part, or read the full original at{" "}
          <a href={itemConfig.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--brand-2)", fontWeight: 600 }}>the source ↗</a>.
        </p>
      )}
    </div>
  );

  return (
    <div style={{ width: "100%" }}>
      <SplitPaneViewer
        concept={itemConfig.concept}
        title={itemConfig.title}
        fallbackComponent={readerComponent}
        defaultQuery={itemConfig.query}
      />
    </div>
  );
}
