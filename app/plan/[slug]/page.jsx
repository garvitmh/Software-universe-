import fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";

const PLAN_DIR = path.join(process.cwd(), "docs", "plan");

const TITLES = {
  "00-MASTER-PLAN": "Master Plan",
  "01-VISION-PRODUCT-PEDAGOGY": "Vision, Product & Pedagogy",
  "02-CURRICULUM-CONTENT": "Curriculum & Content Architecture",
  "03-INTERACTIVE-VISUALIZATION": "Interactive & Visualization",
  "04-AI-TUTOR-RAG": "AI Tutor & RAG",
  "05-PLATFORM-ARCHITECTURE": "Platform & Architecture",
  "06-DATA-SOURCING-CONTENTOPS": "Data, Sourcing & Content-Ops",
};

export function generateStaticParams() {
  try {
    return fs.readdirSync(PLAN_DIR)
      .filter((f) => f.endsWith(".md"))
      .map((f) => ({ slug: f.replace(/\.md$/, "") }));
  } catch {
    return [];
  }
}

export function generateMetadata({ params }) {
  const t = TITLES[params.slug] || params.slug;
  return { title: `${t} — Plan · Software Universe` };
}

export default function PlanDocPage({ params }) {
  const file = path.join(PLAN_DIR, `${params.slug}.md`);
  if (!fs.existsSync(file)) notFound();
  const md = fs.readFileSync(file, "utf8");
  const html = marked.parse(md, { async: false, gfm: true, breaks: false });

  return (
    <main className="wrap-narrow" style={{ paddingTop: 36, paddingBottom: 64 }}>
      <Link href="/plan" style={{ fontSize: 13.5, color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 20 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
        All plan documents
      </Link>
      <article className="prose plan-doc" dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}
