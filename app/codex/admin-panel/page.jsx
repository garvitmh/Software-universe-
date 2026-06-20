import Link from "next/link";
import Callout from "@/components/Callout";

export default function AdminPanelPage() {
  return (
    <main className="wrap-narrow" style={{ paddingTop: 44, paddingBottom: 40 }}>
      <Link href="/" style={{ fontSize: 13.5, color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 22 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
        Back to the campus
      </Link>

      <span className="pill" style={{ background: "var(--amber-soft)", color: "var(--amber)", marginBottom: 14 }}>World 1 · The Codex · Part 06</span>
      <h1 style={{ fontSize: 42, lineHeight: 1.06 }}>The admin panel — the control room.</h1>

      <div className="prose" style={{ marginTop: 22 }}>
        <p className="lead">
          This is the part that makes Burger Farm a <em>business</em> and not just an app. The <strong>admin panel</strong> (<code>apps/admin-panel</code>, a separate Next.js web app) is the steering wheel — it lets staff change prices, launch offers, mark items sold out, and reshape what customers see <strong>without a developer, without a deploy, without a new app release.</strong> Understanding how is the single most important idea in your whole project.
        </p>

        <h2>The trick: the app reads, the admin writes, the database is in the middle</h2>
        <p>
          The customer’s app holds almost nothing of its own. It <em>asks</em> the backend for everything — the menu, the prices, the banners — and simply draws whatever it’s handed. The admin panel writes those same things into the same database. So the two apps never talk to each other, yet they’re perfectly connected through the data:
        </p>

        <div style={{ margin: "1.8rem 0" }}>
          <div style={{ display: "flex", alignItems: "stretch", justifyContent: "center", gap: 0, flexWrap: "wrap" }}>
            <div style={{ background: "var(--purple-soft)", border: "1px solid var(--hairline)", borderRadius: 12, padding: "12px 16px", textAlign: "center", width: 150 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--purple)" }}>Admin panel</div>
              <div style={{ fontSize: 11.5, color: "var(--muted)" }}>staff change things</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", padding: "0 10px", color: "var(--faint)", flexDirection: "column", justifyContent: "center" }}>
              <span style={{ fontSize: 11, color: "var(--purple)" }}>writes</span>
              <svg width="22" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </div>
            <div style={{ background: "var(--teal-soft)", border: "1px solid var(--hairline)", borderRadius: 12, padding: "12px 16px", textAlign: "center", width: 160 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--teal)" }}>Backend + database</div>
              <div style={{ fontSize: 11.5, color: "var(--muted)" }}>the single truth</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", padding: "0 10px", color: "var(--faint)", flexDirection: "column", justifyContent: "center" }}>
              <span style={{ fontSize: 11, color: "var(--blue)" }}>reads</span>
              <svg width="22" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
            </div>
            <div style={{ background: "var(--blue-soft)", border: "1px solid var(--hairline)", borderRadius: 12, padding: "12px 16px", textAlign: "center", width: 150 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--blue)" }}>Customer app</div>
              <div style={{ fontSize: 11.5, color: "var(--muted)" }}>draws what it’s told</div>
            </div>
          </div>
          <p style={{ fontSize: 13, color: "var(--faint)", textAlign: "center", marginTop: 10 }}>
            Change a price here · it’s live on every phone on the next refresh. No app update.
          </p>
        </div>

        <h2>Content is data, not code</h2>
        <p>
          Here’s the part people miss. The offers, the story banners, the home-screen sections — none of that is <em>hardcoded</em> in the app. It’s stored as rows in tables like <code>ContentBlock</code> and <code>ContentItem</code>. A “block” is a slot on the home screen; the “items” are what fills it. The admin creates them, orders them, schedules them — and the app just renders whatever blocks the backend returns, in whatever order. New campaign on Friday? That’s a few rows, not a code change.
        </p>

        <h2>Per-store control</h2>
        <p>
          Real chains aren’t uniform — one outlet runs out of cheese, another has a different photo. Your schema handles this with <code>StoreProduct</code> (is this product available <em>at this store</em>, at what price) and <code>StoreAssetOverride</code> (use a different image here). The same menu, bent per location, all from the control room. The app never needs to know the rules — it just shows what the backend resolves for the store you picked.
        </p>

        <h2>It didn’t build every screen by hand: Refine</h2>
        <p>
          An admin console is mostly the same four screens for every kind of thing: a <strong>list</strong>, a <strong>create</strong> form, an <strong>edit</strong> form, and a <strong>detail</strong> view (developers call this “CRUD” — create, read, update, delete). The panel uses a framework called <strong>Refine</strong> that generates this scaffolding over each backend resource, so staff get a real, consistent console without someone hand-coding hundreds of nearly-identical forms.
        </p>

        <h2>And it’s locked down</h2>
        <p>
          Because this app can change prices and data, it reuses the exact auth from Part 04 — the <strong>httpOnly cookie + CSRF check</strong>. Only an authenticated admin can write, and every write is a state-changing request that must carry the forgery-proof token. The control room has a strong lock on the door.
        </p>

        <Callout variant="why" title="Why a separate app, not a hidden screen in the customer app?">
          You could bury an “admin mode” inside the customer app. Almost no serious product does, for three reasons: the <em>users</em> are different (staff vs customers), the <em>risk</em> is different (one app can refund money and change prices; the other can’t), and the <em>release cadence</em> is different (you tweak the admin daily; you ship the mobile app every few weeks through an app store). Splitting them lets each evolve, deploy, and be secured on its own terms — and keeps powerful tools far away from a customer’s phone.
        </Callout>

        <Callout variant="breaks" title="What breaks if content were hardcoded">
          Remember the disaster from Part 01 — prices baked into the app. A weekend promo would mean: write code, build the app, submit to Apple and Google, wait for review, and pray every customer updates… and even then, last week’s price lingers on un-updated phones. By making content <em>data the admin controls</em>, that entire nightmare collapses into one form and a Save button. This chapter is where Part 01’s pain finally gets its cure.
        </Callout>

        <Callout variant="scale" title="As the business grows up">
          A one-person shop needs one admin login. A chain needs <strong>roles</strong> (a store manager can mark items sold out but can’t change company-wide pricing), an <strong>audit log</strong> so every change is attributable — your schema already has an <code>AuditLog</code> table recording who changed what, when — and <strong>scheduled/draft publishing</strong> so a campaign can be prepared today and go live Friday at 9am on its own. The control room is built to grow from one knob into a full cockpit, without the customer app ever changing.
        </Callout>
      </div>

      <div style={{ marginTop: 30, paddingTop: 22, borderTop: "1px solid var(--hairline)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <Link href="/codex/database" className="muted" style={{ fontSize: 14 }}>← Part 05 — The database</Link>
        <Link href="/codex/burger-builder" className="muted" style={{ fontSize: 14 }}>Part 07 — The burger builder →</Link>
      </div>
    </main>
  );
}
