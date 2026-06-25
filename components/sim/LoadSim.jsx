"use client";

import { useEffect, useRef, useState } from "react";

// The physics behind the demo. `ratio` is load as a fraction of capacity
// (1.0 = at capacity); `loadPct` is that as a percentage for display.
function compute(rps, servers, cache, broken) {
  const eff = Math.max(1, servers - (broken > 0 ? 1 : 0));
  const perServer = cache && broken <= 0 ? 42 : 22;
  const cap = eff * perServer;
  const ratio = rps / cap;
  const lat = Math.round(18 + Math.max(0, ratio - 1) * 150 + (broken > 0 ? 70 : 0) + (cache && broken <= 0 ? 0 : 14));
  const ok = Math.round(ratio > 1 ? Math.max(40, 100 - (ratio - 1) * 110) : broken > 0 ? 88 : 100);
  return { lat, ok, loadPct: Math.round(ratio * 100), ratio, eff, cap };
}

export default function LoadSim() {
  const [rps, setRps] = useState(45);
  const [servers, setServers] = useState(3);
  const [cache, setCache] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [broken, setBroken] = useState(0);

  const canvasRef = useRef(null);
  const params = useRef({ rps, servers, cache, playing, broken });
  const breakTimer = useRef(null);

  useEffect(() => {
    params.current = { rps, servers, cache, playing, broken };
  }, [rps, servers, cache, playing, broken]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let packets = [];
    let acc = 0;
    let last = performance.now();
    let raf;

    const isDark = () => document.documentElement.getAttribute("data-theme") === "dark";
    const C = () =>
      isDark()
        ? { p: "#90B2DE", a: "#D4895E", box: "#34322A", boxbg: "#222018", txt: "#857F70", deadbg: "#3a2a22" }
        : { p: "#2E4B73", a: "#9C4422", box: "#D6D0C0", boxbg: "#ffffff", txt: "#8B857A", deadbg: "#f3e6df" };

    const rr = (x, y, w, h, r) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    };

    const draw = (now) => {
      raf = requestAnimationFrame(draw);
      const dt = Math.min(40, now - last);
      last = now;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      if (canvas.width !== W * dpr) {
        canvas.width = W * dpr;
        canvas.height = H * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      const col = C();
      const p = params.current;
      const c = compute(p.rps, p.servers, p.cache, p.broken);
      const eff = c.eff;
      const sx = W - 94;
      const laneH = H / p.servers;

      // servers
      for (let i = 0; i < p.servers; i++) {
        const cy = laneH * i + laneH / 2;
        const dead = p.broken > 0 && i === p.servers - 1;
        ctx.fillStyle = dead ? col.deadbg : col.boxbg;
        ctx.strokeStyle = dead ? col.a : col.box;
        ctx.lineWidth = 1;
        rr(sx, cy - laneH * 0.32, 78, laneH * 0.64, 4);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = dead ? col.a : col.txt;
        ctx.font = '500 11px "IBM Plex Mono"';
        ctx.fillText(dead ? "down" : "server " + (i + 1), sx + 10, cy + 4);
      }

      // cache box
      const cacheOn = p.cache && p.broken <= 0;
      ctx.strokeStyle = cacheOn ? col.p : col.a;
      ctx.lineWidth = 1;
      rr(16, 14, 96, 24, 4);
      ctx.stroke();
      ctx.fillStyle = cacheOn ? col.p : col.a;
      ctx.font = '500 11px "IBM Plex Mono"';
      ctx.fillText(cacheOn ? "cache: on" : "cache: off", 26, 30);

      // spawn packets
      if (p.playing) {
        acc += dt * (p.rps / 1000);
        while (acc >= 1) {
          acc -= 1;
          const over = c.ratio > 1 && Math.random() < Math.min(0.7, c.ratio - 1);
          packets.push({ x: 0, y: 20 + Math.random() * (H - 40), lane: Math.floor(Math.random() * eff), drop: over });
        }
      }

      const sp = 0.28 * dt;
      packets = packets.filter((pk) => {
        pk.x += sp;
        const ty = laneH * pk.lane + laneH / 2;
        if (pk.x > sx - 20) pk.y += (ty - pk.y) * 0.12;
        ctx.fillStyle = pk.drop ? col.a : col.p;
        ctx.fillRect(pk.x - 2, pk.y - 2, 4, 4);
        if (pk.drop && pk.x > W * 0.62) return false;
        return pk.x < sx + 8;
      });
      if (packets.length > 600) packets.splice(0, 200);
    };

    draw(performance.now());
    return () => cancelAnimationFrame(raf);
  }, []);

  const breakIt = () => {
    setBroken(1);
    if (breakTimer.current) clearTimeout(breakTimer.current);
    breakTimer.current = setTimeout(() => setBroken(0), 5000);
  };

  const c = compute(rps, servers, cache, broken);
  const cacheOn = cache && broken <= 0;
  const latCol = c.lat > 120 ? "var(--accent)" : "var(--ink)";
  const okCol = c.ok < 90 ? "var(--accent)" : "var(--ink)";
  const loadCol = c.loadPct > 100 ? "var(--accent)" : "var(--ink)";
  const statusText =
    broken > 0
      ? "Incident — server withdrawn, cache cold"
      : c.loadPct > 100
      ? "Overloaded — requests dropping"
      : "Healthy — all requests served";
  const statusCol = broken > 0 || c.loadPct > 100 ? "var(--accent)" : "var(--primary)";

  const monoLabel = {
    fontFamily: "var(--font-mono)",
    fontWeight: 600,
    fontSize: 10,
    letterSpacing: ".1em",
    textTransform: "uppercase",
    color: "var(--ink-3)",
  };
  const sliderLabel = { display: "block", fontFamily: "var(--font-display)", fontSize: 17, marginBottom: 6 };
  const sliderVal = { float: "right", fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--ink-2)" };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "280px minmax(0,1fr)", gap: 0, border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }} className="ed-two">
      {/* Controls */}
      <div style={{ padding: 26, borderRight: "1px solid var(--border)", background: "var(--surface)" }}>
        <div style={{ ...monoLabel, color: "var(--primary)", marginBottom: 20 }}>Controls</div>

        <label style={sliderLabel}>
          Incoming traffic <span style={sliderVal}>{rps}/s</span>
        </label>
        <input type="range" min={5} max={200} value={rps} onChange={(e) => setRps(+e.target.value)} style={{ width: "100%", marginBottom: 22 }} />

        <label style={sliderLabel}>
          Servers <span style={sliderVal}>{servers}</span>
        </label>
        <input type="range" min={1} max={6} value={servers} onChange={(e) => setServers(+e.target.value)} style={{ width: "100%", marginBottom: 22 }} />

        <div
          onClick={() => setCache((v) => !v)}
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", border: "1px solid var(--border)", borderRadius: 6, padding: "11px 14px", marginBottom: 18 }}
        >
          <span style={{ fontFamily: "var(--font-display)", fontSize: 17 }}>Cache layer</span>
          <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 12, color: cacheOn ? "var(--primary)" : "var(--accent)" }}>{cacheOn ? "ON" : "OFF"}</span>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setPlaying((v) => !v)}
            style={{ flex: 1, border: "none", background: "var(--ink)", color: "var(--bg)", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 14, padding: 11, borderRadius: 6, cursor: "pointer" }}
          >
            {playing ? "Pause" : "Play"}
          </button>
          <button
            onClick={breakIt}
            style={{ flex: 1, border: "1px solid var(--accent)", background: "transparent", color: "var(--accent)", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 14, padding: 11, borderRadius: 6, cursor: "pointer" }}
          >
            Break it
          </button>
        </div>
        <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 14, lineHeight: 1.55 }}>
          "Break it" withdraws a server and takes the cache cold for a few seconds.
        </div>
      </div>

      {/* Viz */}
      <div style={{ padding: 22, background: "var(--surface-2)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 0, marginBottom: 18, border: "1px solid var(--border)", borderRadius: 6, overflow: "hidden", background: "var(--surface)" }}>
          <Stat label="Latency" value={c.lat} unit="ms" color={latCol} border />
          <Stat label="Success" value={c.ok} unit="%" color={okCol} border />
          <Stat label="Load" value={c.loadPct} unit="%" color={loadCol} />
        </div>

        <canvas ref={canvasRef} style={{ width: "100%", height: 300, display: "block", border: "1px solid var(--border)", borderRadius: 6, background: "var(--surface)" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 12, fontSize: 13.5, color: "var(--ink-2)", flexWrap: "wrap" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ width: 9, height: 9, background: "var(--primary)" }} /> served
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ width: 9, height: 9, background: "var(--accent)" }} /> dropped
          </span>
          <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 13, color: statusCol }}>{statusText}</span>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, unit, color, border }) {
  return (
    <div style={{ padding: "16px 18px", borderRight: border ? "1px solid var(--border)" : "none" }}>
      <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 10, letterSpacing: ".1em", color: "var(--ink-3)", textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 34, color }}>
        {value}
        <span style={{ fontSize: 15, color: "var(--ink-3)" }}>{unit}</span>
      </div>
    </div>
  );
}
