import Link from "next/link";
import Callout from "@/components/Callout";

export default function FlutterAppPage() {
  return (
    <main className="wrap-narrow" style={{ paddingTop: 44, paddingBottom: 40 }}>
      <Link href="/" style={{ fontSize: 13.5, color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 22 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
        Back to the campus
      </Link>

      <span className="pill" style={{ background: "var(--amber-soft)", color: "var(--amber)", marginBottom: 14 }}>World 1 · The Codex · Part 03</span>
      <h1 style={{ fontSize: 42, lineHeight: 1.06 }}>Your Flutter app, layer by layer.</h1>

      <div className="prose" style={{ marginTop: 22 }}>
        <p className="lead">
          We’ve seen the layers as an idea. Now let’s walk your actual app and find them in the wild — how it’s physically organised, how screens connect, and how it talks to the backend. This is <code>apps/mobile-app</code>, built with Flutter.
        </p>

        <h2>Everything is a widget</h2>
        <p>
          Flutter has one big idea: <strong>everything on screen is a “widget”</strong>, and screens are just widgets made of smaller widgets. A button is a widget; the row holding three buttons is a widget; the whole menu screen is a widget built from rows, cards, and lists. You build a UI by <em>composing</em> small widgets into bigger ones — like Lego. That’s why Flutter UI is fast to build and looks identical on Android and iOS: Flutter draws every pixel itself rather than borrowing the phone’s native buttons.
        </p>

        <h2>Organised by feature, not by type</h2>
        <p>
          Open <code>apps/mobile-app/lib/features/</code> and you’ll see the app is split by <strong>feature</strong> — menu, home, stores, outlet, auth — each in its own folder, each self-contained:
        </p>

        <div style={{ margin: "1.6rem 0", background: "var(--bg-2)", border: "1px solid var(--hairline)", borderRadius: 14, padding: "16px 18px", fontFamily: "JetBrains Mono", fontSize: 13, color: "var(--ink-2)", lineHeight: 1.9 }}>
          lib/features/<br />
          ├─ menu/<br />
          │&nbsp;&nbsp;├─ <span style={{ color: "var(--blue)" }}>presentation/</span> &nbsp;screens, widgets, providers<br />
          │&nbsp;&nbsp;├─ <span style={{ color: "var(--amber)" }}>data/</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;repository + models<br />
          │&nbsp;&nbsp;└─ <span style={{ color: "var(--brand-2)" }}>motion/</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;the burger-builder engine<br />
          ├─ home/<br />
          └─ stores/, outlet/, auth/ …
        </div>

        <p>
          This is <strong>feature-first</strong> architecture. Everything the menu needs lives under <code>features/menu</code>: the screens (<code>presentation/pages</code>), the state (<code>presentation/providers</code>), and the data layer (<code>data/menu_repository.dart</code>). The layers from the last chapter are right there, just folded inside each feature.
        </p>

        <h2>How screens connect</h2>
        <p>
          The app uses a <strong>router</strong> to move between screens, with a bottom navigation bar whose tabs are independent “branches” (so switching tabs doesn’t lose your place). When the home screen sends you to the menu, it doesn’t reach into the menu’s code — it just asks the router to go to that branch. Navigation is its own concern, kept apart from the screens themselves.
        </p>

        <h2>How it talks to the backend</h2>
        <p>
          Every request to the backend goes through one shared network client (built on a library called <strong>Dio</strong>), provided once as <code>apiClientProvider</code>. It’s configured with the base URL, and with <strong>interceptors</strong> — small bits of code that run on every request and response. They attach the auth cookie, add a request-id for tracing, and can retry on a blip. So no screen writes a raw network call; they ask a repository, the repository uses the shared client, and the interceptors handle the cross-cutting stuff invisibly.
        </p>

        <Callout variant="why" title="Why feature-first, not folder-by-type?">
          The other common layout groups by <em>type</em>: all screens in one giant <code>screens/</code> folder, all models in <code>models/</code>, and so on. It looks tidy at first but ages badly — to work on “the menu” you’re hopping across five distant folders, and two features’ files sit jumbled together. Feature-first keeps everything for one feature in one place, so you can understand, change, or even delete a whole feature without spelunking the codebase. The tradeoff is a little repetition of structure across features — a price well worth paying.
        </Callout>

        <Callout variant="breaks" title="What breaks without the shared client + interceptors">
          Picture every screen making its own raw network calls. The day you change how auth works, or add a retry, or move the backend URL, you’re editing dozens of scattered call-sites and missing some. Worse, a momentary network blip with no retry shows the user a broken screen for a request that would’ve succeeded a half-second later. One shared client with interceptors means those concerns are handled in exactly one place, for every request, forever.
        </Callout>

        <Callout variant="scale" title="As the app grows">
          Feature-first is the layout that survives a growing team. Two developers can build two features in parallel with almost no collisions, because each feature is an island. Layer-by-type, by contrast, turns every change into a merge conflict in the shared <code>screens/</code> and <code>models/</code> folders. It’s the difference between a codebase that gets easier to navigate as it grows and one that gets harder.
        </Callout>
      </div>

      <div style={{ marginTop: 30, paddingTop: 22, borderTop: "1px solid var(--hairline)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <Link href="/codex/state-management" className="muted" style={{ fontSize: 14 }}>← Part 02 — State</Link>
        <Link href="/codex/backend" className="muted" style={{ fontSize: 14 }}>Part 04 — The backend →</Link>
      </div>
    </main>
  );
}
