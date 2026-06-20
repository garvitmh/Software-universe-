"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

function slugify(t) {
  return t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function OnThisPage() {
  const path = usePathname();
  const [heads, setHeads] = useState([]);
  const [active, setActive] = useState("");

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll(".codex-content h2"));
    const items = nodes.map((h) => {
      if (!h.id) h.id = slugify(h.textContent || "");
      h.style.scrollMarginTop = "78px";
      return { id: h.id, text: h.textContent };
    });
    setHeads(items);

    if (!nodes.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-10% 0px -72% 0px" }
    );
    nodes.forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, [path]);

  return (
    <aside className="codex-rail">
      {heads.length >= 2 && (
        <>
          <div className="rail-title">On this page</div>
          {heads.map((h) => (
            <a key={h.id} href={`#${h.id}`} className={`rail-link${active === h.id ? " active" : ""}`}>
              {h.text}
            </a>
          ))}
        </>
      )}
    </aside>
  );
}
