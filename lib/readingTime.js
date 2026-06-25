// Rough "N min read" from a tech entry's prose (~200 words/min). Shared by the
// article renderer and the content repository so the number is consistent.
export function readingMinutes(c) {
  if (!c) return 1;
  const parts = [
    c.tagline,
    c.oneLiner,
    ...(c.what || []),
    c.analogy?.body,
    ...(c.inside || []).map((i) => `${i.name} ${i.desc}`),
    ...(c.how || []),
    ...(c.why || []),
    ...(c.alternatives || []).map((a) => `${a.name} ${a.note}`),
    ...(c.howWeUse?.body || []),
    c.breaks,
    c.scale,
  ].filter(Boolean);
  const words = parts.join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
