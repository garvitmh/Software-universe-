"use client";

import { useRef, useState } from "react";

// The code that runs *inside* the Web Worker. It captures console output and a
// trailing return value, then posts everything back. Isolated from the page —
// no DOM, no network of consequence — and killable from the outside on timeout.
const WORKER_SRC = `
  function stringify(v) {
    if (typeof v === "string") return v;
    if (v === undefined) return "undefined";
    if (v === null) return "null";
    try { return JSON.stringify(v, null, 2); } catch (e) { return String(v); }
  }
  self.onmessage = function (e) {
    var logs = [];
    var push = function (level, args) {
      logs.push({ level: level, text: Array.prototype.map.call(args, stringify).join(" ") });
    };
    var console = {
      log: function () { push("log", arguments); },
      info: function () { push("log", arguments); },
      warn: function () { push("warn", arguments); },
      error: function () { push("error", arguments); },
    };
    try {
      var fn = new Function("console", e.data.code);
      var result = fn(console);
      if (result !== undefined) push("result", [result]);
    } catch (err) {
      push("error", [String(err && err.stack ? err.stack : err)]);
    }
    self.postMessage(logs);
  };
`;

const EXAMPLES = [
  {
    label: "Hello",
    code: `// Anything you console.log shows up below.\nconsole.log("Hello, Software Universe!");\nconsole.log("2 + 2 =", 2 + 2);`,
  },
  {
    label: "FizzBuzz",
    code: `// The classic. Print 1..20, but "Fizz"/"Buzz"/"FizzBuzz".\nfor (let i = 1; i <= 20; i++) {\n  let out = "";\n  if (i % 3 === 0) out += "Fizz";\n  if (i % 5 === 0) out += "Buzz";\n  console.log(out || i);\n}`,
  },
  {
    label: "Two Sum (O(n))",
    code: `// Find two numbers that add to the target — in ONE pass,\n// using a hash map to remember what we've seen. This is O(n):\n// we touch each number once instead of checking every pair.\nfunction twoSum(nums, target) {\n  const seen = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const need = target - nums[i];\n    if (seen.has(need)) return [seen.get(need), i];\n    seen.set(nums[i], i);\n  }\n  return null;\n}\nconsole.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]`,
  },
  {
    label: "Count the work",
    code: `// Watch O(n) vs O(n^2). We count how many steps each takes.\nfunction linear(n) {\n  let steps = 0;\n  for (let i = 0; i < n; i++) steps++;\n  return steps;\n}\nfunction quadratic(n) {\n  let steps = 0;\n  for (let i = 0; i < n; i++)\n    for (let j = 0; j < n; j++) steps++;\n  return steps;\n}\nfor (const n of [10, 100, 1000]) {\n  console.log("n =", n, "| O(n):", linear(n), "| O(n^2):", quadratic(n));\n}`,
  },
  {
    label: "Bubble sort",
    code: `// Sort by repeatedly swapping neighbours that are out of order.\nfunction bubbleSort(a) {\n  a = a.slice();\n  for (let i = 0; i < a.length; i++)\n    for (let j = 0; j < a.length - 1 - i; j++)\n      if (a[j] > a[j + 1]) [a[j], a[j + 1]] = [a[j + 1], a[j]];\n  return a;\n}\nconsole.log(bubbleSort([5, 2, 9, 1, 7, 3]));`,
  },
];

const COLORS = {
  log: "var(--ink)",
  warn: "var(--bronze)",
  error: "var(--accent)",
  result: "var(--primary)",
};

export default function Sandbox() {
  const [code, setCode] = useState(EXAMPLES[0].code);
  const [output, setOutput] = useState([]);
  const [status, setStatus] = useState("ready");
  const [running, setRunning] = useState(false);
  const taRef = useRef(null);

  const run = () => {
    setRunning(true);
    setStatus("running…");
    setOutput([]);

    let worker;
    try {
      const blob = new Blob([WORKER_SRC], { type: "application/javascript" });
      worker = new Worker(URL.createObjectURL(blob));
    } catch (e) {
      setOutput([{ level: "error", text: "Could not start the sandbox: " + String(e) }]);
      setRunning(false);
      setStatus("error");
      return;
    }

    const timeout = setTimeout(() => {
      worker.terminate();
      setOutput((o) => [...o, { level: "error", text: "Timed out after 2s — an infinite loop, perhaps?" }]);
      setRunning(false);
      setStatus("timed out");
    }, 2000);

    worker.onmessage = (e) => {
      clearTimeout(timeout);
      worker.terminate();
      const logs = e.data || [];
      setOutput(logs.length ? logs : [{ level: "log", text: "(no output — try console.log)" }]);
      setRunning(false);
      setStatus(logs.some((l) => l.level === "error") ? "error" : "done");
    };
    worker.onerror = (e) => {
      clearTimeout(timeout);
      worker.terminate();
      setOutput([{ level: "error", text: String(e.message || e) }]);
      setRunning(false);
      setStatus("error");
    };

    worker.postMessage({ code });
  };

  const onKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const el = taRef.current;
      const s = el.selectionStart;
      const next = code.slice(0, s) + "  " + code.slice(el.selectionEnd);
      setCode(next);
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = s + 2;
      });
    }
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      run();
    }
  };

  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
      {/* examples */}
      <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", background: "var(--surface)", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ink-3)", marginRight: 4 }}>
          Examples
        </span>
        {EXAMPLES.map((ex) => (
          <button
            key={ex.label}
            onClick={() => {
              setCode(ex.code);
              setOutput([]);
              setStatus("ready");
            }}
            style={{ border: "1px solid var(--border-2)", background: "var(--surface)", color: "var(--ink-2)", fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 13, padding: "6px 11px", borderRadius: 6, cursor: "pointer" }}
          >
            {ex.label}
          </button>
        ))}
      </div>

      {/* editor */}
      <textarea
        ref={taRef}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={onKeyDown}
        spellCheck={false}
        style={{
          width: "100%",
          minHeight: 280,
          resize: "vertical",
          border: "none",
          outline: "none",
          background: "var(--code-bg)",
          color: "var(--code-ink)",
          fontFamily: "var(--font-mono)",
          fontSize: 13.5,
          lineHeight: 1.7,
          padding: "18px 20px",
          display: "block",
        }}
      />

      {/* controls */}
      <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", background: "var(--surface)", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <button
          onClick={run}
          disabled={running}
          style={{ border: "none", background: "var(--ink)", color: "var(--bg)", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 14, padding: "9px 18px", borderRadius: 6, cursor: "pointer" }}
        >
          {running ? "Running…" : "Run ▸"}
        </button>
        <button
          onClick={() => {
            setOutput([]);
            setStatus("ready");
          }}
          style={{ border: "1px solid var(--border-2)", background: "var(--surface)", color: "var(--ink)", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 14, padding: "9px 16px", borderRadius: 6, cursor: "pointer" }}
        >
          Clear
        </button>
        <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".06em", color: "var(--ink-3)" }}>
          ⌘/Ctrl + Enter to run · {status}
        </span>
      </div>

      {/* output */}
      <div style={{ borderTop: "1px solid var(--border)", background: "var(--surface-2)", padding: "16px 20px", minHeight: 80 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 10 }}>
          Output
        </div>
        {output.length === 0 ? (
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--ink-3)" }}>— run your code to see output here —</div>
        ) : (
          output.map((l, i) => (
            <pre
              key={i}
              style={{ fontFamily: "var(--font-mono)", fontSize: 13, lineHeight: 1.6, color: COLORS[l.level] || "var(--ink)", margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}
            >
              {l.level === "result" ? "⟶ " : l.level === "error" ? "✕ " : ""}
              {l.text}
            </pre>
          ))
        )}
      </div>
    </div>
  );
}
