"use client";

import { useState } from "react";

const PRICE = 179;
const NAMES = ["Classic Burger", "Cheese Burst", "Crispy Veg", "Paneer Royale", "Smoky BBQ"];

export default function CartDriftSim() {
  const [mode, setMode] = useState("scattered"); // 'scattered' | 'truth'
  const [items, setItems] = useState([NAMES[0], NAMES[1], NAMES[2]]); // the real list
  const [iconCount, setIconCount] = useState(3); // stale copy #1
  const [billCount, setBillCount] = useState(3); // stale copy #2

  const add = () => {
    const next = [...items, NAMES[items.length % NAMES.length]];
    setItems(next);
    setIconCount(next.length); // on ADD, everyone happens to update
    setBillCount(next.length);
  };

  const remove = () => {
    if (!items.length) return;
    setItems(items.slice(0, -1));
    // on REMOVE, the stale copies "miss the memo" — this is the bug
  };

  const setModeSafe = (m) => {
    if (m === "scattered") {
      // entering scattered mode starts consistent, then drifts as you remove
      setIconCount(items.length);
      setBillCount(items.length);
    }
    setMode(m);
  };

  const truth = mode === "truth";
  const displayIcon = truth ? items.length : iconCount;
  const displayBillCount = truth ? items.length : billCount;
  const drift = !truth && (displayIcon !== items.length || displayBillCount !== items.length);

  const Seg = ({ id, label }) => (
    <button
      onClick={() => setModeSafe(id)}
      style={{
        flex: 1,
        padding: "10px 12px",
        borderRadius: 10,
        border: "none",
        cursor: "pointer",
        fontSize: 13.5,
        fontWeight: 600,
        background: mode === id ? "var(--surface)" : "transparent",
        color: mode === id ? "var(--ink)" : "var(--muted)",
        boxShadow: mode === id ? "0 1px 4px rgba(0,0,0,.08)" : "none",
        transition: "all .15s ease",
      }}
    >
      {label}
    </button>
  );

  const Reader = ({ title, sub, value, bad }) => (
    <div style={{ background: "var(--surface)", border: `1px solid ${bad ? "var(--brand)" : "var(--hairline)"}`, borderRadius: 14, padding: "14px 14px", textAlign: "center", position: "relative" }}>
      {bad && <span style={{ position: "absolute", top: -8, right: -8, background: "var(--brand)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 999 }}>stale</span>}
      <div style={{ fontSize: 12, color: "var(--faint)", textTransform: "uppercase", letterSpacing: ".05em" }}>{title}</div>
      <div style={{ fontFamily: "Fraunces", fontSize: 28, fontWeight: 600, color: bad ? "var(--brand-2)" : "var(--ink)", marginTop: 2 }}>{value}</div>
      <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{sub}</div>
    </div>
  );

  return (
    <div>
      {/* mode toggle */}
      <div style={{ display: "flex", gap: 4, background: "var(--bg-2)", borderRadius: 12, padding: 4, marginBottom: 20 }}>
        <Seg id="scattered" label="Everyone keeps a copy" />
        <Seg id="truth" label="One source of truth" />
      </div>

      {/* three readers */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        <Reader title="Cart icon" sub="the little badge" value={displayIcon} bad={!truth && displayIcon !== items.length} />
        <Reader title="Cart screen" sub={`${items.length} item${items.length === 1 ? "" : "s"}`} value={items.length} bad={false} />
        <Reader title="The bill" sub="what they pay" value={`₹${displayBillCount * PRICE}`} bad={!truth && displayBillCount !== items.length} />
      </div>

      {/* verdict banner */}
      <div style={{ marginTop: 16 }}>
        {drift ? (
          <div style={{ background: "#FBE0D2", border: "1px solid var(--brand)", borderRadius: 12, padding: "12px 16px", fontSize: 13.5, color: "var(--brand-2)" }}>
            <strong>They disagree.</strong> The screen shows {items.length}, but the icon says {displayIcon} and the bill charges for {displayBillCount} — that’s a <strong>₹{(displayBillCount - items.length) * PRICE} overcharge</strong>. This is a money bug, and it came entirely from separate copies drifting apart.
          </div>
        ) : truth ? (
          <div style={{ background: "var(--teal-soft)", border: "1px solid var(--teal)", borderRadius: 12, padding: "12px 16px", fontSize: 13.5, color: "var(--teal)" }}>
            <strong>Locked together.</strong> All three <em>read from the same cart</em>, so they literally cannot disagree. Remove all you like — they stay in step.
          </div>
        ) : (
          <div style={{ background: "var(--bg-2)", border: "1px solid var(--hairline)", borderRadius: 12, padding: "12px 16px", fontSize: 13.5, color: "var(--ink-2)" }}>
            Consistent for now. Each part holds its own copy. Now press <strong>Remove</strong> and watch the copies fall out of sync…
          </div>
        )}
      </div>

      {/* controls */}
      <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button onClick={add} className="btn btn-primary">＋ Add item</button>
        <button onClick={remove} className="btn btn-ghost" disabled={!items.length} style={{ opacity: items.length ? 1 : 0.5 }}>− Remove item</button>
        <span style={{ fontSize: 13, color: "var(--faint)", alignSelf: "center" }}>
          {truth ? "Try to break it — you can’t." : "Add syncs everyone; remove forgets to."}
        </span>
      </div>
    </div>
  );
}
