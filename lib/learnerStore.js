// A tiny localStorage-backed record of where the learner has been. No accounts,
// no server, no analytics — just "remember my place" so the field guide feels
// personal. Everything is SSR-safe (guards `window`) and fails silently.

const KEY = "su_progress_v1";
const MAX_RECENTS = 16;
const EMPTY = { recents: [], bookmarks: [], readHrefs: [] };

function read() {
  if (typeof window === "undefined") return { ...EMPTY };
  try {
    return { ...EMPTY, ...(JSON.parse(localStorage.getItem(KEY)) || {}) };
  } catch {
    return { ...EMPTY };
  }
}

function write(data) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {}
  window.dispatchEvent(new CustomEvent("su-progress-change"));
}

export function recordVisit({ title, href, kind = "entry" }) {
  if (!href || !title) return;
  const data = read();
  const recents = [{ title, href, kind, at: Date.now() }, ...data.recents.filter((r) => r.href !== href)].slice(0, MAX_RECENTS);
  const readHrefs = data.readHrefs.includes(href) ? data.readHrefs : [...data.readHrefs, href];
  write({ ...data, recents, readHrefs });
}

export function getRecents() {
  return read().recents;
}

export function getReadCount() {
  return read().readHrefs.length;
}

export function getReadHrefs() {
  return read().readHrefs;
}

export function isBookmarked(href) {
  return read().bookmarks.some((b) => b.href === href);
}

export function toggleBookmark({ title, href, kind = "entry" }) {
  const data = read();
  const exists = data.bookmarks.some((b) => b.href === href);
  const bookmarks = exists
    ? data.bookmarks.filter((b) => b.href !== href)
    : [{ title, href, kind, at: Date.now() }, ...data.bookmarks];
  write({ ...data, bookmarks });
  return !exists;
}

export function getBookmarks() {
  return read().bookmarks;
}
