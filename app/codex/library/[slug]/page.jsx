import fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import SplitPaneViewer from "@/components/SplitPaneViewer";

const SLUG_TO_FILE = {
  "google-sre-introduction": {
    file: "books/google-sre/introduction.html",
    title: "Google SRE: Introduction",
    concept: "Site Reliability Engineering SRE",
    query: "Explain what Google SRE is, Benjamin Treynor's SRE definition, and how the 50% ops cap is maintained."
  },
  "google-sre-monitoring": {
    file: "books/google-sre/monitoring.html",
    title: "Google SRE: Monitoring",
    concept: "SRE Golden Signals Monitoring",
    query: "Explain SRE monitoring, latency, traffic, errors, saturation, and how dashboards should trigger alerts."
  },
  "google-sre-failures": {
    file: "books/google-sre/cascading-failures.html",
    title: "Google SRE: Cascading Failures",
    concept: "Cascading failure distributed systems",
    query: "Explain cascading failures in distributed systems, backpressure, queue limits, and how SREs recover from retry storms."
  },
  "stripe-idempotency": {
    file: "blogs/stripe-idempotency.html",
    title: "Stripe: Idempotency Keys",
    concept: "Idempotency keys payment API",
    query: "How does Stripe use idempotency keys, avoid double charges, and coordinate distributed locks?"
  },
  "discord-scylldadb": {
    file: "blogs/discord-scylldadb.html",
    title: "Discord: Storing Billions of Messages",
    concept: "Discord ScyllaDB migration",
    query: "Why did Discord migrate Cassandra to ScyllaDB, how do they store billions of messages, and what database bottlenecks were solved?"
  }
};

function cleanHtmlContent(html, slug) {
  let cleaned = html
    .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "")
    .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, "")
    .replace(/<iframe[^>]*>([\s\S]*?)<\/iframe>/gi, "");

  // Locate main body content
  let bodyContent = cleaned;
  
  if (slug.startsWith("google-sre")) {
    const contentMatch = cleaned.match(/<div class="content" id="content">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/main>/i);
    if (contentMatch) {
      bodyContent = contentMatch[1];
    } else {
      const maiaMatch = cleaned.match(/<div id="maia-main">([\s\S]*?)<\/div>\s*<\/div>\s*<\/main>/i);
      if (maiaMatch) {
        bodyContent = maiaMatch[1];
      }
    }
    
    // Clean up dropdown list headers
    bodyContent = bodyContent
      .replace(/<div ng-controller="HeaderCtrl as headerCtrl">[\s\S]*?<\/ol>\s*<\/div>\s*<\/div>/gi, "")
      .replace(/<div class="header clearfix">[\s\S]*?<\/div>/gi)
      .replace(/<div id="overlay-element" class="expands">[\s\S]*?<\/div>/gi, "");
  } else if (slug === "stripe-idempotency") {
    // Extract Stripe blog article body
    const articleMatch = cleaned.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
    if (articleMatch) {
      bodyContent = articleMatch[1];
    }
  } else if (slug === "discord-scylldadb") {
    // Extract Discord blog article body
    const articleMatch = cleaned.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
    if (articleMatch) {
      bodyContent = articleMatch[1];
    }
  }

  // Remove any remaining scripts, iframes, GTM wrappers
  bodyContent = bodyContent
    .replace(/<noscript>[\s\S]*?<\/noscript>/gi, "")
    .replace(/class="[^"]*maia[^"]*"/gi, "")
    .replace(/class="[^"]*Maia[^"]*"/gi, "");

  return bodyContent;
}

export default async function LibraryReaderPage({ params }) {
  const { slug } = params;
  const itemConfig = SLUG_TO_FILE[slug];

  if (!itemConfig) {
    notFound();
  }

  const rawPath = path.join(process.cwd(), "data", "raw", itemConfig.file);
  
  if (!fs.existsSync(rawPath)) {
    notFound();
  }

  let fileContent = "";
  try {
    fileContent = fs.readFileSync(rawPath, "utf8");
  } catch (err) {
    console.error(`Failed to read textbook file ${rawPath}:`, err);
    notFound();
  }

  const cleanedHtml = cleanHtmlContent(fileContent, slug);

  // Fallback React reader component to pass to SplitPaneViewer
  const readerComponent = (
    <div
      style={{
        padding: "40px 32px 80px",
        maxWidth: "760px",
        margin: "0 auto",
        backgroundColor: "var(--surface)",
        minHeight: "100%",
        borderLeft: "1px solid var(--hairline)",
        borderRight: "1px solid var(--hairline)"
      }}
    >
      <Link
        href="/codex/library"
        style={{
          fontSize: "13px",
          color: "var(--muted)",
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          marginBottom: "24px"
        }}
      >
        ← Back to library
      </Link>
      
      <span className="pill" style={{ background: "var(--purple-soft)", color: "var(--purple)", marginBottom: 12, display: "inline-block" }}>
        {itemConfig.title.split(":")[0]}
      </span>
      
      <div 
        className="prose"
        style={{ fontSize: "16px", lineHeight: "1.75" }}
        dangerouslySetInnerHTML={{ __html: cleanedHtml }}
      />
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
