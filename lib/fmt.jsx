import Term from "@/components/Term";
import { GLOSSARY } from "@/lib/glossary";

// Inline markup used throughout content strings:
//   `code`            → <code>
//   **bold**          → <strong>
//   [[term-id]]       → <Term> using the glossary's canonical term as text
//   [[term-id|words]] → <Term> wrapping custom words
export function fmt(str) {
  const parts = String(str).split(/(`[^`]+`|\*\*[^*]+\*\*|\[\[[^\]]+\]\])/g);
  return parts.map((p, i) => {
    if (p.startsWith("`") && p.endsWith("`")) return <code key={i}>{p.slice(1, -1)}</code>;
    if (p.startsWith("**") && p.endsWith("**")) return <strong key={i}>{p.slice(2, -2)}</strong>;
    if (p.startsWith("[[") && p.endsWith("]]")) {
      const inner = p.slice(2, -2);
      const bar = inner.indexOf("|");
      const id = bar === -1 ? inner : inner.slice(0, bar);
      const text = bar === -1 ? (GLOSSARY[id]?.term || id) : inner.slice(bar + 1);
      return <Term key={i} id={id}>{text}</Term>;
    }
    return <span key={i}>{p}</span>;
  });
}
