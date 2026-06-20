"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STAGES = [
  { id: "customer", label: "Customer", run: "You tap “Place order”.", icon: UserIcon,
    detail: "It starts with you. A tap on the phone is just a request — your phone holds no burgers and no money. It only asks." },
  { id: "app", label: "App", run: "The app sends the order to the backend.", icon: PhoneIcon,
    detail: "The Flutter app bundles your choices into a small message and sends it to the backend over the internet. It does no real work itself — it’s the waiter, not the kitchen." },
  { id: "backend", label: "Backend", run: "The backend validates it and takes charge.", icon: ServerIcon,
    detail: "The Node/Express backend checks everything (is the store open? is the item available? is the price right?) before anything real happens. This is where the actual logic lives." },
  { id: "payment", label: "Payment", run: "Razorpay authorises the money.", icon: CardIcon,
    detail: "We never touch your card directly — Razorpay does, and sends back a signed “yes”. We verify that signature so a fake “paid” can’t sneak through. (What if it double-charges on a double-tap? That’s idempotency — a Codex chapter.)" },
  { id: "database", label: "Database", run: "The order is written down — permanently.", icon: DbIcon,
    detail: "PostgreSQL records the order, the payment, the items — as rows that survive crashes and restarts. This is the single source of truth everyone else trusts." },
  { id: "pos", label: "POS", run: "The kitchen system gets the ticket.", icon: PrinterIcon,
    detail: "The order is handed to the restaurant’s POS (point-of-sale) so the staff see it. This is a separate, third-party system — which means it can be down when we need it." },
  { id: "kitchen", label: "Kitchen", run: "Your burger gets cooked.", icon: FlameIcon,
    detail: "The staff cook to the ticket. From here it’s the real world — but the software keeps tracking the status the whole time." },
  { id: "delivery", label: "Delivery", run: "It’s on its way to you.", icon: BikeIcon,
    detail: "A delivery partner (think Dunzo / Zomato) picks it up, and status events flow back into the app so you can watch it come. Another integration — another Codex chapter." },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function OrderJourney() {
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const [selected, setSelected] = useState(0);
  const [posOffline, setPosOffline] = useState(false);
  const [queued, setQueued] = useState(false);
  const [narration, setNarration] = useState("Press play to send a real order through your whole system.");
  const runId = useRef(0);

  async function run() {
    const myRun = ++runId.current;
    setRunning(true);
    setQueued(false);
    setSelected(null);
    for (let i = 0; i < STAGES.length; i++) {
      if (runId.current !== myRun) return;
      setStep(i);
      setSelected(i);
      if (i === 5 && posOffline) {
        setQueued(true);
        setNarration("POS is offline! With no safety net this order would simply vanish — but we hold it in a queue and keep retrying.");
        await sleep(1900);
        if (runId.current !== myRun) return;
        setNarration("Queue retried successfully — the order reaches the kitchen. Nothing lost.");
        await sleep(900);
      } else {
        setNarration(STAGES[i].run);
      }
      await sleep(950);
    }
    if (runId.current !== myRun) return;
    setNarration("Delivered. That’s one order’s full journey through your system.");
    setRunning(false);
  }

  function reset() {
    runId.current++;
    setRunning(false);
    setStep(-1);
    setQueued(false);
    setSelected(0);
    setNarration("Press play to send a real order through your whole system.");
  }

  const active = selected != null ? STAGES[selected] : null;
  const progress = step < 0 ? 0 : step / (STAGES.length - 1);

  return (
    <div>
      {/* controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 22 }}>
        <button className="btn btn-primary" onClick={run} disabled={running}>
          {running ? <SpinIcon /> : <PlayIcon />}
          {running ? "Sending…" : step >= STAGES.length - 1 ? "Send again" : "Place the order"}
        </button>
        <button className="btn btn-ghost" onClick={reset}>Reset</button>
        <label
          onClick={() => !running && setPosOffline((v) => !v)}
          style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 10, cursor: running ? "default" : "pointer", opacity: running ? 0.5 : 1, fontSize: 14, fontWeight: 500, color: "var(--ink-2)" }}
        >
          Simulate: POS offline
          <span style={{ width: 42, height: 24, borderRadius: 999, background: posOffline ? "var(--brand)" : "var(--hairline-2)", position: "relative", transition: "background .2s" }}>
            <span style={{ position: "absolute", top: 3, left: posOffline ? 21 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left .2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
          </span>
        </label>
      </div>

      {/* pipeline */}
      <div style={{ overflowX: "auto", paddingBottom: 6 }}>
        <div style={{ position: "relative", minWidth: 860 }}>
          <div style={{ position: "absolute", top: 27, left: 40, right: 40, height: 3, background: "var(--hairline-2)", borderRadius: 2 }} />
          <motion.div
            style={{ position: "absolute", top: 27, left: 40, height: 3, background: "var(--brand)", borderRadius: 2, transformOrigin: "left" }}
            animate={{ width: `calc((100% - 80px) * ${progress})` }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
            {STAGES.map((s, i) => {
              const Icon = s.icon;
              const passed = step >= i && step >= 0;
              const isActive = step === i;
              const isQueuedPos = i === 5 && queued;
              const bg = isQueuedPos ? "var(--amber)" : passed ? "var(--brand)" : "var(--surface)";
              const fg = isQueuedPos || passed ? "#fff" : "var(--faint)";
              return (
                <button
                  key={s.id}
                  onClick={() => setSelected(i)}
                  style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: 108, padding: 0 }}
                >
                  <motion.span
                    animate={isActive ? { scale: [1, 1.18, 1] } : { scale: 1 }}
                    transition={{ duration: 0.5 }}
                    style={{ width: 54, height: 54, borderRadius: "50%", background: bg, color: fg, border: `2px solid ${selected === i ? "var(--brand-2)" : passed || isQueuedPos ? "transparent" : "var(--hairline-2)"}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: passed ? "0 8px 18px -8px rgba(232,86,10,.6)" : "var(--shadow)", transition: "background .3s, color .3s" }}
                  >
                    <Icon />
                  </motion.span>
                  <span style={{ fontSize: 12.5, fontWeight: selected === i ? 600 : 500, color: selected === i ? "var(--ink)" : "var(--muted)" }}>{s.label}</span>
                  {isQueuedPos && <span style={{ fontSize: 10.5, fontWeight: 600, color: "var(--amber)", background: "var(--amber-soft)", padding: "2px 7px", borderRadius: 6 }}>queued</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* narration */}
      <div style={{ marginTop: 22, background: "var(--surface-warm)", border: "1px solid var(--hairline)", borderRadius: 14, padding: "16px 18px", minHeight: 58, display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: running ? "var(--brand)" : "var(--faint)", flexShrink: 0 }} />
        <AnimatePresence mode="wait">
          <motion.p key={narration} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} style={{ fontSize: 15.5, color: "var(--ink)", lineHeight: 1.5 }}>
            {narration}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* stage detail */}
      <AnimatePresence mode="wait">
        {active && (
          <motion.div key={active.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} style={{ marginTop: 14 }}>
            <div className="card" style={{ padding: "20px 22px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 10 }}>
                <span style={{ width: 38, height: 38, borderRadius: 11, background: "var(--brand-soft)", color: "var(--brand-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <active.icon />
                </span>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--faint)" }}>Stage {selected + 1} of {STAGES.length}</div>
                  <h3 style={{ fontFamily: "Fraunces", fontSize: 21, fontWeight: 600 }}>{active.label}</h3>
                </div>
              </div>
              <p style={{ color: "var(--ink-2)", fontSize: 16, lineHeight: 1.6 }}>{active.detail}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PlayIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z" /></svg>; }
function SpinIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><motion.path d="M12 3a9 9 0 1 0 9 9" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }} style={{ transformOrigin: "center" }} /></svg>; }
function UserIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" /></svg>; }
function PhoneIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="7" y="2" width="10" height="20" rx="2.5" /><path d="M11 18h2" /></svg>; }
function ServerIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="7" rx="2" /><rect x="3" y="13" width="18" height="7" rx="2" /><path d="M7 7.5h.01M7 16.5h.01" /></svg>; }
function CardIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2.5" /><path d="M2 10h20" /></svg>; }
function DbIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" /></svg>; }
function PrinterIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V3h12v6" /><rect x="4" y="9" width="16" height="8" rx="2" /><path d="M8 17h8v4H8z" /></svg>; }
function FlameIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2c1 4-3 5-3 9a3 3 0 0 0 6 0c0-1-1-2-1-3 2 1 3 3 3 5a6 6 0 1 1-12 0c0-5 5-6 7-11z" /></svg>; }
function BikeIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="17" r="3" /><circle cx="18" cy="17" r="3" /><path d="M6 17l4-9h5l3 9M10 8h4" /></svg>; }
