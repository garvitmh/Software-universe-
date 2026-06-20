"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import RoadmapFlowVertical from "@/components/RoadmapFlowVertical";
import { TECH_CONTENT } from "@/lib/tech-content";
import TechArticle from "@/components/TechArticle";

// ── The system as a journey, roadmap.sh-style ──────────────────────────────
const STAGES = [
  {
    id: "01-foundations",
    title: "Phase 01: Foundations",
    tint: "brand",
    summary: "What we are building, and how all the pieces fit together.",
    detail: "Before writing a single line of code, we define the architecture. How does a phone talk to a server? Where does data live? This is the blueprint.",
    chapter: "foundations",
    nodes: []
  },
  {
    id: "02-thinking",
    title: "Phase 02: Thinking Tools",
    tint: "pink",
    summary: "Mental models for enterprise architecture: layers, separation, and single sources of truth.",
    detail: "Why do we put logic in services? What is a repository? Why must state have exactly one source of truth? These are the unshakeable rules we follow.",
    chapter: "layers-and-separation",
    nodes: []
  },
  {
    id: "03-app",
    title: "Phase 03: The Flutter App",
    tint: "purple",
    summary: "Drawing the pixels the user taps and holding the client-side state.",
    detail: "We build the mobile application using Flutter and Dart. It's completely dumb—it just draws what the backend tells it to, and sends user actions back over the wire.",
    chapter: "flutter-app",
    nodes: [
      { id: "dart", title: "Dart", tech: "dart", note: "The language it's written in — typed, null-safe, two compile modes." },
      { id: "flutter", title: "Flutter", tech: "flutter", note: "Everything is a widget; it draws its own pixels, identical on both phones." },
      { id: "riverpod", title: "Riverpod", tech: "riverpod", note: "Holds shared state (the cart) so the screen never disagrees with itself." },
      { id: "dio", title: "Dio", tech: "dio", note: "One network client; interceptors attach auth cookies to every call." },
    ]
  },
  {
    id: "04-backend",
    title: "Phase 04: The Backend & APIs",
    tint: "amber",
    summary: "The brain that catches requests, runs guards, and processes logic.",
    detail: "A Node.js + Express program. A request flows through middleware (auth, CSRF) → a route → a thin handler → a service that holds the real business logic.",
    chapter: "backend",
    nodes: [
      { id: "http", title: "HTTP & REST", tech: "http-rest", note: "Methods (GET/POST), URLs, status codes — the grammar of the web." },
      { id: "json", title: "JSON", tech: "json", note: "The text shape data travels in." },
      { id: "nodejs", title: "Node.js", tech: "nodejs", note: "Runs JavaScript on the server; an event loop that never blocks." },
      { id: "express", title: "Express", tech: "express", note: "Maps URLs to handlers and runs middleware guards in order." },
      { id: "auth", title: "Auth: JWT & CSRF", tech: "auth", note: "Proving who you are and ensuring the request is genuine." },
    ]
  },
  {
    id: "05-data",
    title: "Phase 05: The Database",
    tint: "teal",
    summary: "The permanent memory. Linked tables, exact money, all-or-nothing writes.",
    detail: "PostgreSQL, reached through Prisma. Every order is a row, linked to its user, store and items. Money is exact, and transactions make writes all-or-nothing.",
    chapter: "database",
    nodes: [
      { id: "postgresql", title: "PostgreSQL", tech: "postgresql", note: "The relational database — tables, foreign keys, indexes." },
      { id: "prisma", title: "Prisma", tech: "prisma", note: "Translates code objects ↔ database rows safely." },
      { id: "sql", title: "SQL & indexes", tech: "sql", note: "How data is queried, and how indexes make it fast." },
      { id: "transactions", title: "Transactions", tech: "transactions", note: "All-or-nothing writes — the bedrock of handling money." },
    ]
  },
  {
    id: "06-admin",
    title: "Phase 06: The Admin Panel",
    tint: "pink",
    summary: "A control room to change prices and content without developers.",
    detail: "The admin panel (Next.js + Refine) writes to the same database the app reads. Content is data, not code — so a new offer is a few rows, not a deploy.",
    chapter: "admin-panel",
    nodes: [
      { id: "nextjs", title: "Next.js", tech: "nextjs", note: "The React framework the admin panel is built with." },
      { id: "refine", title: "Refine", tech: "refine", note: "Generates the list/create/edit/show screens quickly." },
      { id: "realtime", title: "Live sync", tech: "realtime-sync", note: "How the admin's changes appear instantly." },
    ]
  },
  {
    id: "07-builder",
    title: "Phase 07: The Motion Engine",
    tint: "purple",
    summary: "Making the app feel premium with complex UI interactions.",
    detail: "We step back to the app to build the custom Burger Builder. We use complex Flutter layouts and animations to deliver a premium user experience.",
    chapter: "burger-builder",
    nodes: []
  },
  {
    id: "08-systems",
    title: "Phase 08: Big Systems",
    tint: "brand",
    summary: "Where the order touches the outside world and stays correct.",
    detail: "Payments, the order's lifecycle, and loyalty ledgers. These are the strict patterns that keep money and state correct even when networks fail.",
    chapter: "big-systems",
    nodes: [
      { id: "idempotency", title: "Idempotency", tech: "idempotency", note: "Why a retried order can't charge you twice." },
      { id: "statemachines", title: "State machines", tech: "state-machines", note: "An order is always in exactly one known state." },
      { id: "ledgers", title: "Ledgers", tech: "ledgers", note: "Points & money tracked as an append-only tape." },
    ]
  },
  {
    id: "09-scale",
    title: "Phase 09: Scale",
    tint: "blue",
    summary: "Capacity added around the system to survive a million users.",
    detail: "We add caching, read replicas, and concurrency handling. We learn how to make the system fast when thousands of users hit it at once.",
    chapter: "scale",
    nodes: [
      { id: "caching", title: "Caching", tech: "caching", note: "Compute once and serve many." },
      { id: "concurrency", title: "Concurrency", tech: "concurrency", note: "Handling races when two users hit the same resource." },
    ]
  },
  {
    id: "10-deploy",
    title: "Phase 10: Deployment",
    tint: "teal",
    summary: "Shipping the code to the world safely.",
    detail: "Pipelines, environments, and secrets. How we take code from our laptop and put it on a secure server for the world to use.",
    chapter: "deployment",
    nodes: []
  }
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
  const [nodeStatus, setNodeStatus] = useState({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem("roadmap_status");
      if (saved) setNodeStatus(JSON.parse(saved));
    } catch (e) {}
  }, []);

  const updateStatus = (status) => {
    if (!sel) return;
    const newStatus = { ...nodeStatus, [sel.id]: status };
    if (status === null) delete newStatus[sel.id]; // null means remove status
    setNodeStatus(newStatus);
    localStorage.setItem("roadmap_status", JSON.stringify(newStatus));
  };

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
        <RoadmapFlowVertical stages={STAGES} tints={TINTS} onSelect={setSel} nodeStatus={nodeStatus} />
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
          <div style={{ position: "fixed", top: 0, right: 0, height: "100vh", width: "min(440px, 92vw)", background: "var(--bg)", borderLeft: "1px solid var(--hairline)", boxShadow: "var(--shadow-lg)", zIndex: 61, display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "26px 26px 0" }}>
              <button onClick={() => setSel(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: 14, display: "inline-flex", alignItems: "center", gap: 6 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                Close
              </button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "24px 30px" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--brand)", textTransform: "uppercase", letterSpacing: 0.5 }}>{sel.isStage ? "Phase overview" : "Tech deep dive"}</div>
              
              {/* Progress Tracking */}
              <div style={{ display: "flex", gap: 8, marginTop: 16, marginBottom: 16 }}>
                <button onClick={() => updateStatus(nodeStatus[sel.id] === 'done' ? null : 'done')} className="btn" style={{ flex: 1, background: nodeStatus[sel.id] === 'done' ? "#10B981" : "var(--surface)", color: nodeStatus[sel.id] === 'done' ? "#fff" : "var(--ink)", border: "1px solid var(--hairline-2)", fontSize: 13, padding: "8px" }}>✓ Done</button>
                <button onClick={() => updateStatus(nodeStatus[sel.id] === 'learning' ? null : 'learning')} className="btn" style={{ flex: 1, background: nodeStatus[sel.id] === 'learning' ? "#F59E0B" : "var(--surface)", color: nodeStatus[sel.id] === 'learning' ? "#fff" : "var(--ink)", border: "1px solid var(--hairline-2)", fontSize: 13, padding: "8px" }}>● Learning</button>
                <button onClick={() => updateStatus(nodeStatus[sel.id] === 'skip' ? null : 'skip')} className="btn" style={{ flex: 1, background: nodeStatus[sel.id] === 'skip' ? "#6B7280" : "var(--surface)", color: nodeStatus[sel.id] === 'skip' ? "#fff" : "var(--ink)", border: "1px solid var(--hairline-2)", fontSize: 13, padding: "8px" }}>⨯ Skip</button>
              </div>
              {sel.tech && TECH_CONTENT[sel.tech] ? (
                <div style={{ marginTop: -20, marginLeft: -20, marginRight: -20 }}>
                  <TechArticle content={TECH_CONTENT[sel.tech]} />
                </div>
              ) : (
                <>
                  <h2 style={{ fontFamily: "Fraunces", fontSize: 24, fontWeight: 700, color: "var(--ink)", marginTop: 6 }}>{sel.title}</h2>
                  <p style={{ fontSize: 15.5, color: "var(--ink-2)", marginTop: 12, lineHeight: 1.6 }}>{sel.detail || sel.note}</p>
                </>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 22 }}>
                {(sel.chapter) && (
                  <Link href={`/codex/${sel.chapter}`} onClick={() => setSel(null)} className="btn btn-primary" style={{ justifyContent: "space-between" }}>
                    Read the chapter <span>→</span>
                  </Link>
                )}
                {sel.sim && (
                  <Link href={`/simulator/${sel.sim}`} onClick={() => setSel(null)} className="btn btn-ghost" style={{ justifyContent: "space-between" }}>
                    Run the simulator <span>→</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
