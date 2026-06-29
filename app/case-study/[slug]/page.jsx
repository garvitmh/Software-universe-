import { notFound } from "next/navigation";
import { CASE_STUDY } from "@/lib/caseStudy";
import CaseStudyChapter from "@/components/case-study/CaseStudyChapter";

export function generateStaticParams() {
  return CASE_STUDY.chapters.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }) {
  const c = CASE_STUDY.chapters.find((x) => x.slug === params.slug);
  if (!c) return { title: "Not found · Software Universe" };
  return {
    title: `${c.title} · Burger Farm case study`,
    description: c.dek,
  };
}

export default function CaseStudyChapterPage({ params }) {
  const idx = CASE_STUDY.chapters.findIndex((c) => c.slug === params.slug);
  if (idx === -1) notFound();
  const chapter = CASE_STUDY.chapters[idx];
  const prev = idx > 0 ? CASE_STUDY.chapters[idx - 1] : null;
  const next = idx < CASE_STUDY.chapters.length - 1 ? CASE_STUDY.chapters[idx + 1] : null;
  return <CaseStudyChapter chapter={chapter} prev={prev} next={next} />;
}
