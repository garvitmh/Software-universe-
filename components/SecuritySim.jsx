"use client";

import React, { useState, useEffect, useRef } from "react";

export default function SecuritySim() {
  const [role, setRole] = useState("USER");
  const [userId, setUserId] = useState("42");
  const [secretKey, setSecretKey] = useState("secret-signing-key-1337");
  const [tamperedRole, setTamperedRole] = useState("USER");
  
  // Real server key (unknown to attacker, but we inspect it)
  const SERVER_SECRET = "secret-signing-key-1337";

  // Signature calculation simulation
  // Simple deterministic hash function representing HMAC SHA-256 for educational visualization
  const getSimulatedHMAC = (header, payload, secret) => {
    const dataStr = `${btoa(JSON.stringify(header))}.${btoa(JSON.stringify(payload))}`;
    let hash = 0;
    const combinedStr = dataStr + secret;
    for (let i = 0; i < combinedStr.length; i++) {
      hash = (hash << 5) - hash + combinedStr.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16).toUpperCase();
  };

  const header = { alg: "HS256", typ: "JWT" };
  
  // Clean states
  const originalPayload = { sub: userId, role: role, exp: "15m" };
  const originalSignature = getSimulatedHMAC(header, originalPayload, SERVER_SECRET);
  const originalToken = `${btoa(JSON.stringify(header))}.${btoa(JSON.stringify(originalPayload))}.${originalSignature}`;

  // Tampered states
  const tamperedPayload = { sub: userId, role: tamperedRole, exp: "15m" };
  // The signature that accompanies the tampered token (if they edit payload, signature matches original unless they try to compute it with their secretKey)
  const isTampered = tamperedRole !== role;
  
  // If the attacker tampered with it, they send the original signature or they sign it with their own key
  const [attackerSecret, setAttackerSecret] = useState("wrong-attacker-key");
  const currentSignatureUsed = isTampered 
    ? getSimulatedHMAC(header, tamperedPayload, attackerSecret) // Attacker tries to resign
    : originalSignature;

  const serverComputedSignature = getSimulatedHMAC(header, tamperedPayload, SERVER_SECRET);
  const isVerified = currentSignatureUsed === serverComputedSignature;

  // Brute force state
  const [bruteForceStatus, setBruteForceStatus] = useState("idle"); // idle | running | success
  const [bruteForceLog, setBruteForceLog] = useState([]);
  const [guessedKey, setGuessedKey] = useState("");
  const bruteIntervalRef = useRef(null);

  // Rate limit state
  const [tokenBucket, setTokenBucket] = useState(5); // max 5
  const [requestLog, setRequestLog] = useState([]);
  const [isRateLimited, setIsRateLimited] = useState(false);

  // Refill token bucket over time
  useEffect(() => {
    const interval = setInterval(() => {
      setTokenBucket(prev => Math.min(prev + 1, 5));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSendRequest = () => {
    const timestamp = new Date().toLocaleTimeString();
    if (tokenBucket <= 0) {
      setIsRateLimited(true);
      setRequestLog(prev => [`[${timestamp}] 🔴 BLOCKED: HTTP 429 Too Many Requests (Rate limit exhausted)`, ...prev.slice(0, 5)]);
      return;
    }

    setIsRateLimited(false);
    setTokenBucket(prev => prev - 1);
    
    if (isVerified) {
      const accessLevel = tamperedPayload.role === "ADMIN" ? "🔓 ADMIN DASHBOARD ACCESS GRANTED!" : "🟢 USER ORDER DATA LOADED";
      setRequestLog(prev => [`[${timestamp}] 200 OK — Role: ${tamperedPayload.role}. ${accessLevel}`, ...prev.slice(0, 5)]);
    } else {
      setRequestLog(prev => [`[${timestamp}] 🔴 401 Unauthorized — Signature mismatch! Refusing connection.`, ...prev.slice(0, 5)]);
    }
  };

  const startBruteForce = () => {
    if (bruteForceStatus === "running") return;
    setBruteForceStatus("running");
    setBruteForceLog(["[Console] Starting dictionary attack on HMAC signature secret key..."]);
    
    // We simulate guessing keys rapidly.
    // Target is SERVER_SECRET. To make it quick, let's say the target key is short or we guess a list of common keys.
    const dictionary = [
      "admin", "123456", "password", "root", "auth-key", "token-secret", 
      "burgerfarm", "secret", "signing-key", "secret-signing-key-1337"
    ];
    
    let index = 0;
    bruteIntervalRef.current = setInterval(() => {
      if (index >= dictionary.length) {
        clearInterval(bruteIntervalRef.current);
        setBruteForceStatus("failed");
        setBruteForceLog(prev => [...prev, "[Console] ❌ All dictionary guesses failed. Try a custom signature key."]);
        return;
      }
      
      const guess = dictionary[index];
      const testSig = getSimulatedHMAC(header, tamperedPayload, guess);
      const success = guess === SERVER_SECRET;

      setGuessedKey(guess);
      setBruteForceLog(prev => [
        ...prev, 
        `[Guess] Secret: "${guess}" -> Computed Hash: ${testSig} ... ${success ? "✅ MATCH!" : "❌ FAIL"}`
      ]);

      if (success) {
        clearInterval(bruteIntervalRef.current);
        setBruteForceStatus("success");
        setAttackerSecret(guess);
        setBruteForceLog(prev => [...prev, `[Console] 🎉 Success! Private key cracked: "${guess}"`]);
      }
      index++;
    }, 400);
  };

  const stopBruteForce = () => {
    if (bruteIntervalRef.current) {
      clearInterval(bruteIntervalRef.current);
    }
    setBruteForceStatus("idle");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.45, margin: 0 }}>
        Stateless JWTs encode session claims. Click to tamper with the role and test how the server handles it.
      </p>

      {/* Visual JWT Token Breakdown */}
      <div className="card" style={{ background: "var(--surface-warm)", padding: 14, borderRadius: 12, border: "1px solid var(--hairline-2)" }}>
        <span className="eyebrow" style={{ color: "var(--muted)" }}>Active JWT Token (Encoded)</span>
        <div style={{ wordBreak: "break-all", fontFamily: "JetBrains Mono", fontSize: 12, lineHeight: 1.5, marginTop: 8 }}>
          <span style={{ color: "var(--pop-pink)", fontWeight: 700 }}>{btoa(JSON.stringify(header))}</span>
          <span style={{ color: "var(--ink)" }}>.</span>
          <span style={{ color: "var(--purple)", fontWeight: 700 }}>{btoa(JSON.stringify(tamperedPayload))}</span>
          <span style={{ color: "var(--ink)" }}>.</span>
          <span style={{ color: "var(--teal)", fontWeight: 700 }}>{currentSignatureUsed}</span>
        </div>
      </div>

      {/* Editor Columns */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 16 }}>
        {/* Token Claims Editor */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span className="eyebrow">Modify Claims (Payload)</span>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, background: "var(--bg-2)", padding: 12, borderRadius: 10, border: "1px solid var(--hairline)" }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)" }}>User ID (sub)</label>
              <input 
                type="text" 
                value={userId} 
                onChange={(e) => { setUserId(e.target.value); }} 
                style={{ width: "100%", padding: 6, border: "1px solid var(--hairline)", borderRadius: 6, fontSize: 12, marginTop: 4 }} 
              />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)" }}>System Role</label>
              <select 
                value={tamperedRole} 
                onChange={(e) => setTamperedRole(e.target.value)}
                style={{ width: "100%", padding: 6, border: "1px solid var(--hairline)", borderRadius: 6, fontSize: 12, marginTop: 4, background: "var(--surface)" }}
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN (Privileged)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Attacker Signing Key */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span className="eyebrow">Attacker Signature Key</span>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, background: "var(--bg-2)", padding: 12, borderRadius: 10, border: "1px solid var(--hairline)", height: "100%" }}>
            <p style={{ fontSize: 11.5, color: "var(--ink-2)", margin: 0 }}>
              To bypass verification, you must sign the altered payload with the correct secret key.
            </p>
            <input 
              type="text" 
              value={attackerSecret} 
              onChange={(e) => setAttackerSecret(e.target.value)} 
              placeholder="Type key to sign..."
              disabled={bruteForceStatus === "running"}
              style={{ width: "100%", padding: 6, border: "1px solid var(--hairline)", borderRadius: 6, fontSize: 12 }} 
            />
            <div style={{ display: "flex", gap: 6 }}>
              {bruteForceStatus === "running" ? (
                <button onClick={stopBruteForce} className="btn btn-ghost" style={{ flex: 1, padding: 6, fontSize: 11, color: "var(--brand)" }}>
                  ⏹ Stop Attack
                </button>
              ) : (
                <button onClick={startBruteForce} className="btn btn-ghost" style={{ flex: 1, padding: 6, fontSize: 11 }}>
                  🕵️ Dictionary Attack
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dictionary Attack Output */}
      {bruteForceStatus !== "idle" && (
        <div style={{ background: "#1E1E1E", color: "#A9FFB2", padding: 12, borderRadius: 10, fontFamily: "JetBrains Mono", fontSize: 11.5, maxHeight: 120, overflowY: "auto" }}>
          {bruteForceLog.slice(-4).map((log, index) => (
            <div key={index}>{log}</div>
          ))}
        </div>
      )}

      {/* Verification State Panel */}
      <div 
        style={{ 
          background: isVerified ? "var(--teal-soft)" : "#FBE0D2", 
          border: `1.5px solid ${isVerified ? "var(--teal)" : "var(--brand)"}`, 
          borderRadius: 12, 
          padding: 14, 
          display: "flex", 
          flexDirection: "column", 
          gap: 6 
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: isVerified ? "var(--teal)" : "var(--brand-2)" }}>
            {isVerified ? "🟢 Server: Token Signature Valid" : "🔴 Server: Token Signature Mismatch"}
          </span>
          <span style={{ fontSize: 11, fontFamily: "JetBrains Mono", fontWeight: 700, color: "var(--muted)" }}>
            Secret Key status: {attackerSecret === SERVER_SECRET ? "CRACKED" : "UNMATCHED"}
          </span>
        </div>
        <div style={{ fontSize: 12, color: "var(--ink-2)", lineHeight: 1.4 }}>
          {isVerified ? (
            <span>The payload claims are trusted because the signature matches the SHA-256 hash calculated by the server using the private secret.</span>
          ) : (
            <span>
              The server computed <code>{serverComputedSignature}</code> using its secret key, but the client sent <code>{currentSignatureUsed}</code>. Request rejected!
            </span>
          )}
        </div>
      </div>

      {/* API Endpoint Caller & Rate Limiter */}
      <div style={{ border: "1px solid var(--hairline)", borderRadius: 12, padding: 14, display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="eyebrow">API Endpoint: /api/admin/reconcile</span>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "var(--muted)" }}>Rate Limit Bucket:</span>
            {Array.from({ length: 5 }).map((_, i) => (
              <span 
                key={i} 
                style={{ 
                  width: 10, 
                  height: 10, 
                  borderRadius: "50%", 
                  background: i < tokenBucket ? "var(--pop-lime)" : "var(--hairline-2)",
                  display: "inline-block" 
                }} 
              />
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button 
            onClick={handleSendRequest} 
            className="btn btn-primary" 
            style={{ flex: 1 }}
          >
            ⚡ Send API Request
          </button>
        </div>

        {/* Server Request Console */}
        <div style={{ background: "var(--bg-2)", border: "1px solid var(--hairline-2)", borderRadius: 8, padding: 10, height: 95, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
          {requestLog.length === 0 ? (
            <div style={{ color: "var(--faint)", fontSize: 11.5, textAlign: "center", paddingTop: 25 }}>No API calls sent. Click button to test authorization.</div>
          ) : (
            requestLog.map((log, idx) => (
              <div 
                key={idx} 
                style={{ 
                  fontFamily: "JetBrains Mono", 
                  fontSize: 11, 
                  color: log.includes("200 OK") 
                    ? "var(--teal)" 
                    : log.includes("429") 
                      ? "var(--brand-2)" 
                      : "var(--brand)" 
                }}
              >
                {log}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
