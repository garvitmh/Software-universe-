import { notFound } from "next/navigation";
import TechArticle from "@/components/TechArticle";
import { TECH_CONTENT } from "@/lib/tech-content";

export function generateStaticParams() {
  return Object.keys(TECH_CONTENT).map((slug) => ({ slug }));
}

export function generateMetadata({ params }) {
  const c = TECH_CONTENT[params.slug];
  if (!c) return { title: "Not found · Software Universe" };
  return { title: `${c.title} · Tech reference · Software Universe`, description: c.tagline };
}

export default function TechPage({ params }) {
  const content = TECH_CONTENT[params.slug];
  if (!content) notFound();
  return <TechArticle content={content} />;
}
