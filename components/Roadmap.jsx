"use client";

import Link from "next/link";
import { useState } from "react";

// ── The system as a journey, roadmap.sh-style ──────────────────────────────
const STAGES = [
  {
    id: "app",
    title: "The customer's app",
    tint: "purple",
    summary: "What the customer taps. Shows things, asks for things, stores almost nothing.",
    detail:
      "The app is a Flutter program. Its job is to render the UI and ask the backend for everything — the menu, prices, the cart's fate. It holds no truth of its own, which is exactly why prices can change without shipping a new app.",
    chapter: "flutter-app",
    nodes: [
      { id: "dart", title: "Dart", tech: "dart", note: "The language it's written in — typed, null-safe, two compile modes." },
      { id: "flutter", title: "Flutter", tech: "flutter", note: "Everything is a widget; it draws its own pixels, identical on both phones." },
      { id: "riverpod", title: "Riverpod", tech: "riverpod", note: "Holds shared state (the cart) so the screen never disagrees with itself." },
      { id: "dio", title: "Dio + interceptors", tech: "dio", chapter: "flutter-app", note: "One network client; interceptors attach the auth cookie & a request-id to every call." },
      { id: "layers", title: "Layers & repository", chapter: "layers-and-separation", note: "UI → provider → repository → network. Each layer talks only to its neighbour." },
    ],
  },
  {
    id: "wire",
    title: "The wire between them",
    tint: "blue",
    summary: "How the app and backend actually talk: a request over HTTP, carrying JSON, proving who it is.",
    detail:
      "Every interaction is an HTTP request to a URL under /api/v1, carrying JSON. State-changing requests prove identity with an httpOnly cookie and a CSRF token. This is the membrane where 'never trust the client' is enforced.",
    chapter: "backend",
    nodes: [
      { id: "http", title: "HTTP & REST", tech: "http-rest", chapter: "backend", note: "Methods (GET/POST), URLs, status codes — the grammar of the web." },
      { id: "json", title: "JSON", tech: "json", chapter: "backend", note: "The text shape data travels in, the same in Dart and JavaScript." },
      { id: "auth", title: "Auth: JWT · cookie · CSRF", tech: "auth", chapter: "backend", note: "An httpOnly cookie proves who you are; a CSRF token proves the request is genuine." },
    ],
  },
  {
    id: "backend",
    title: "The backend",
    tint: "amber",
    summary: "The brain. Catches the request, runs the guards, does the real work, replies.",
    detail:
      "A Node.js + Express program. A request flows through middleware (auth, CSRF, tracing) → a route → a thin handler → a service that holds the real logic. The backend is stateless, so you can run many copies of it.",
    chapter: "backend",
    nodes: [
      { id: "nodejs", title: "Node.js", tech: "nodejs", note: "Runs JavaScript on the server; an event loop that never blocks on waiting." },
      { id: "express", title: "Express", tech: "express", note: "Maps URLs to handlers and runs middleware guards in order." },
      { id: "middleware", title: "Middleware guards", chapter: "backend", note: "requireAdmin, requireCsrf — code that runs before the handler and can block." },
    ],
  },
  {
    id: "data",
    title: "The database",
    tint: "teal",
    summary: "The permanent memory. Linked tables, exact money, all-or-nothing writes.",
    detail:
      "PostgreSQL, reached through Prisma. Every order is a row, linked to its user, store and items by foreign keys. Money is an exact Decimal; an idempotency key blocks double-charges; transactions make a multi-row order all-or-nothing.",
    chapter: "database",
    nodes: [
      { id: "prisma", title: "Prisma", tech: "prisma", note: "Translates code objects ↔ database rows, and keeps schema + code in lock-step." },
      { id: "postgresql", title: "PostgreSQL", tech: "postgresql", note: "The relational database — tables, foreign keys, indexes, ACID transactions." },
      { id: "sql", title: "SQL & indexes", tech: "sql", chapter: "database", note: "How data is queried, and how an index makes 'this store's pending orders' instant." },
      { id: "transactions", title: "Transactions", tech: "transactions", chapter: "database", note: "All-or-nothing groups of writes — the bedrock of handling money safely." },
    ],
  },
  {
    id: "admin",
    title: "The control room",
    tint: "pink",
    summary: "A separate web app that writes the data the customer app reads. Change the business, not the code.",
    detail:
      "The admin panel (Next.js + Refine) writes to the same database the app reads. Content is data (ContentBlock/Item), not code — so a new offer is a few rows, not a deploy. Every write is logged in an AuditLog.",
    chapter: "admin-panel",
    nodes: [
      { id: "nextjs", title: "Next.js & React", tech: "nextjs", chapter: "admin-panel", note: "The framework the admin (and this very site) is built with." },
      { id: "refine", title: "Refine", tech: "refine", chapter: "admin-panel", note: "Generates the list/create/edit/show screens over each resource." },
      { id: "content", title: "Content as data", chapter: "admin-panel", note: "Offers, banners, per-store overrides — all rows the admin controls, schedulable." },
    ],
  },
  {
    id: "systems",
    title: "Big systems",
    tint: "brand",
    summary: "Where the order touches the outside world: a bank, a kitchen, a driver — and stays correct anyway.",
    detail:
      "Payments (a state machine + webhooks), the order's lifecycle (OrderStatus + an OrderEvent audit log), loyalty (an append-only ledger with idempotency and optimistic concurrency), and serviceability. The patterns that keep money and orders correct.",
    chapter: "big-systems",
    nodes: [
      { id: "idempotency", title: "Idempotency", tech: "idempotency", chapter: "big-systems", note: "Why a retried order can't charge or credit you twice.", sim: "loyalty-ledger" },
      { id: "statemachines", title: "State machines", tech: "state-machines", chapter: "big-systems", note: "An order is always in exactly one known state; only some moves are legal.", sim: "order-journey" },
      { id: "ledgers", title: "Ledgers", tech: "ledgers", chapter: "big-systems", note: "Points & money tracked as an append-only tape, like a bank.", sim: "loyalty-ledger" },
    ],
  },
  {
    id: "scale",
    title: "Scale & going live",
    tint: "teal",
    summary: "The same design, with capacity added around it — then shipped to the world.",
    detail:
      "Caching, load-balanced copies, queues, read replicas and observability take the system from 10 to a million users. Then a release pipeline (test → build → migrate → start) deploys it to Render, with secrets in the environment and infra described as code.",
    chapter: "scale",
    nodes: [
      { id: "caching", title: "Caching & queues", tech: "caching", chapter: "scale", note: "Compute once and serve many; push slow work off the request path.", sim: "scaling" },
      { id: "scaling", title: "Scaling the stack", chapter: "scale", note: "Stateless copies behind a load balancer; indexes and replicas under load.", sim: "scaling" },
      { id: "deploy", title: "Deployment & ops", chapter: "deployment", note: "Pipeline, env secrets, infra-as-code, migrations, containers, rollbacks." },
    ],
  },
];

// ── Deep, step-by-step flows ───────────────────────────────────────────────
const FLOWS = [
  {
    id: "order",
    title: "Placing an order",
    blurb: "The single most important path in the system — what happens between your tap and your food.",
    tint: "brand",
    steps: [
      { t: "You tap “Place order”", d: "The app reads the cart from its Riverpod provider and builds an order request as JSON. It attaches a unique idempotency key for this attempt." },
      { t: "The request crosses the wire", d: "Over HTTP to /api/v1/orders, carrying the httpOnly auth cookie and a CSRF token. The phone's claim of who you are is not trusted on its own." },
      { t: "Middleware guards run", d: "Express checks the cookie (are you logged in?) and the CSRF token (is this request genuine, not forged?). Fail either and it never reaches the handler." },
      { t: "The service validates everything", d: "Server-side: is the store open? Are these the real current prices? Is the address serviceable? The backend re-checks every fact, because the client can lie." },
      { t: "Payment is authorised", d: "The order is created as PENDING_PAYMENT and the payment gateway is asked to authorise. The backend waits for the gateway's real answer — it never takes the app's word." },
      { t: "A transaction writes it all", d: "Order + OrderItems + OrderPayment are written inside one database transaction: all-or-nothing. There is no universe where the payment is saved but the order vanishes." },
      { t: "Loyalty points are credited", d: "An append-only LoyaltyTransaction row is written with key earn:order:<id>, so even a retried order credits the points exactly once." },
      { t: "The order moves to PLACED", d: "The status advances along its state machine and an OrderEvent is logged with the actor — your audit trail of who did what, when." },
      { t: "The kitchen is told — safely", d: "A message is dropped on a queue for the POS/kitchen. If the store's system is offline, the message waits there instead of the order being lost." },
      { t: "Status flows back to your screen", d: "The app watches the order's status and updates live as it moves PREPARING → OUT_FOR_DELIVERY → DELIVERED." },
    ],
    sim: "order-journey",
    chapters: ["foundations", "big-systems", "database"],
  },
  {
    id: "price",
    title: "An admin changes a price — and it's instantly live",
    blurb: "Why the business can change without a developer, a deploy, or an app-store update.",
    tint: "pink",
    steps: [
      { t: "An admin edits a price", d: "In the admin panel (Next.js + Refine), a staff member changes a product's price in an edit form and hits Save." },
      { t: "The write is guarded", d: "The request carries the admin's httpOnly cookie and CSRF token; requireAdmin + requireCsrf confirm it's a genuine, authorised change before anything is written." },
      { t: "The database row updates", d: "Prisma writes the new price to the Product (or StoreProduct) row in PostgreSQL — the single source of truth. The change is also recorded in the AuditLog: who, what, when." },
      { t: "The cache is invalidated", d: "Any cached copy of the menu is thrown away, so the next read computes the fresh price rather than serving the stale one." },
      { t: "The app simply re-reads", d: "The customer app holds no prices of its own — on its next menu fetch it receives the new price and renders it. Every phone, instantly, with no update." },
    ],
    chapters: ["admin-panel", "scale"],
  },
  {
    id: "login",
    title: "Logging in — done safely",
    blurb: "How the system proves who you are without leaving the door open to theft or forgery.",
    tint: "blue",
    steps: [
      { t: "You authenticate", d: "You prove identity (e.g. an OTP). The backend verifies it and decides you are who you claim." },
      { t: "A signed token is issued", d: "The backend creates a JWT — a tamper-proof badge saying 'this is who I am', signed with a secret only the server knows." },
      { t: "It's stored in an httpOnly cookie", d: "The token is put in a cookie marked httpOnly, which JavaScript on the page cannot read. Even a malicious injected script can't steal your login." },
      { t: "Every later request carries it", d: "The browser attaches the cookie automatically, so the backend knows it's you — without the app ever handling the raw token." },
      { t: "CSRF closes the side door", d: "Because cookies are sent automatically, a forged request from another site could ride along. A double-submit CSRF token, which a foreign site can't obtain, blocks that." },
    ],
    chapters: ["backend"],
  },
];

const TINTS = {
  blue: { soft: "var(--blue-soft)", ink: "var(--blue)" },
  amber: { soft: "var(--amber-soft)", ink: "var(--amber)" },
  teal: { soft: "var(--teal-soft)", ink: "var(--teal)" },
  purple: { soft: "var(--purple-soft)", ink: "var(--purple)" },
  pink: { soft: "var(--pink-soft)", ink: "var(--pink)" },
  brand: { soft: "var(--brand-soft)", ink: "var(--brand-2)" },
};

export default function Roadmap({ readyTech = [] }) {
  const ready = new Set(readyTech);
  const [view, setView] = useState("system"); // 'system' | 'flows'
  const [sel, setSel] = useState(null); // selected node/stage for drawer
  const [openFlow, setOpenFlow] = useState("order");

  const Seg = ({ id, label }) => (
    <button
      onClick={() => setView(id)}
      style={{
        padding: "9px 18px", borderRadius: 10, border: "none", cursor: "pointer",
        fontSize: 14, fontWeight: 600,
        background: view === id ? "var(--surface)" : "transparent",
        color: view === id ? "var(--ink)" : "var(--muted)",
        boxShadow: view === id ? "0 1px 4px rgba(0,0,0,.08)" : "none",
      }}
    >
      {label}
    </button>
  );

  return (
    <div>
      <div style={{ display: "inline-flex", gap: 4, background: "var(--bg-2)", borderRadius: 12, padding: 4, marginBottom: 28 }}>
        <Seg id="system" label="The system map" />
        <Seg id="flows" label="Deep flows" />
      </div>

      {view === "system" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 0 }}>
          {STAGES.map((stage, i) => {
            const tint = TINTS[stage.tint];
            return (
              <div key={stage.id} style={{ display: "flex", gap: 18 }}>
                {/* spine */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 24 }}>
                  <span style={{ width: 16, height: 16, borderRadius: 999, background: tint.ink, boxShadow: `0 0 0 4px ${tint.soft}`, flexShrink: 0, marginTop: 8 }} />
                  {i < STAGES.length - 1 && <span style={{ width: 2, flex: 1, background: "var(--hairline-2)", margin: "4px 0" }} />}
                </div>
                {/* card */}
                <div style={{ flex: 1, paddingBottom: 26 }}>
                  <button onClick={() => setSel({ ...stage, isStage: true })} style={{ display: "block", textAlign: "left", width: "100%", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                    <div style={{ fontFamily: "Fraunces", fontSize: 22, fontWeight: 600, color: "var(--ink)" }}>{stage.title}</div>
                    <div style={{ fontSize: 14.5, color: "var(--muted)", marginTop: 3, lineHeight: 1.5 }}>{stage.summary}</div>
                  </button>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                    {stage.nodes.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => setSel({ ...n, stageTint: stage.tint })}
                        style={{
                          fontSize: 13, fontWeight: 500, color: "var(--ink-2)",
                          background: "var(--surface)", border: "1px solid var(--hairline-2)",
                          borderRadius: 999, padding: "7px 14px", cursor: "pointer",
                          transition: "all .14s ease",
                        }}
                      >
                        {n.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {view === "flows" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {FLOWS.map((flow) => {
            const tint = TINTS[flow.tint];
            const open = openFlow === flow.id;
            return (
              <div key={flow.id} className="card" style={{ padding: 0, overflow: "hidden" }}>
                <button onClick={() => setOpenFlow(open ? null : flow.id)} style={{ width: "100%", textAlign: "left", background: open ? tint.soft : "var(--surface)", border: "none", cursor: "pointer", padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                  <div>
                    <div style={{ fontFamily: "Fraunces", fontSize: 20, fontWeight: 600, color: open ? tint.ink : "var(--ink)" }}>{flow.title}</div>
                    <div style={{ fontSize: 14, color: "var(--muted)", marginTop: 3 }}>{flow.blurb}</div>
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={open ? tint.ink : "var(--faint)"} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? "rotate(90deg)" : "none", transition: "transform .2s ease", flexShrink: 0 }}><path d="M9 6l6 6-6 6" /></svg>
                </button>
                {open && (
                  <div style={{ padding: "8px 22px 22px" }}>
                    {flow.steps.map((s, i) => (
                      <div key={i} style={{ display: "flex", gap: 14, padding: "12px 0", borderTop: "1px solid var(--hairline)" }}>
                        <span style={{ flexShrink: 0, width: 26, height: 26, borderRadius: 999, background: tint.soft, color: tint.ink, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12.5, fontWeight: 700, fontFamily: "JetBrains Mono" }}>{i + 1}</span>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>{s.t}</div>
                          <div style={{ fontSize: 14, color: "var(--ink-2)", marginTop: 2, lineHeight: 1.55 }}>{s.d}</div>
                        </div>
                      </div>
                    ))}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
                      {flow.sim && <Link href={`/simulator/${flow.sim}`} className="btn btn-primary" style={{ fontSize: 13.5, padding: "9px 16px" }}>Run it in the Simulator →</Link>}
                      {flow.chapters?.map((ch) => (
                        <Link key={ch} href={`/codex/${ch}`} className="btn btn-ghost" style={{ fontSize: 13.5, padding: "9px 16px" }}>Read: {ch.replace(/-/g, " ")}</Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Detail drawer */}
      {sel && (
        <>
          <div onClick={() => setSel(null)} style={{ position: "fixed", inset: 0, background: "rgba(36,26,16,.32)", zIndex: 60 }} />
          <div style={{ position: "fixed", top: 0, right: 0, height: "100vh", width: "min(440px, 92vw)", background: "var(--bg)", borderLeft: "1px solid var(--hairline)", boxShadow: "var(--shadow-lg)", zIndex: 61, padding: "26px 26px 40px", overflowY: "auto" }}>
            <button onClick={() => setSel(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: 14, display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
              Close
            </button>
            <div style={{ fontFamily: "Fraunces", fontSize: 26, fontWeight: 600, lineHeight: 1.1 }}>{sel.title}</div>
            <p style={{ fontSize: 15.5, color: "var(--ink-2)", marginTop: 12, lineHeight: 1.6 }}>{sel.detail || sel.note}</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 22 }}>
              {(sel.chapter) && (
                <Link href={`/codex/${sel.chapter}`} onClick={() => setSel(null)} className="btn btn-primary" style={{ justifyContent: "space-between" }}>
                  Read the chapter <span>→</span>
                </Link>
              )}
              {sel.tech && ready.has(sel.tech) && (
                <Link href={`/codex/tech/${sel.tech}`} onClick={() => setSel(null)} className="btn btn-ghost" style={{ justifyContent: "space-between" }}>
                  Tech deep-dive: {sel.title} <span>→</span>
                </Link>
              )}
              {sel.tech && !ready.has(sel.tech) && (
                <span style={{ fontSize: 13, color: "var(--faint)", padding: "6px 2px" }}>Tech deep-dive page coming soon.</span>
              )}
              {sel.sim && (
                <Link href={`/simulator/${sel.sim}`} onClick={() => setSel(null)} className="btn btn-ghost" style={{ justifyContent: "space-between" }}>
                  Run the simulator <span>→</span>
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
