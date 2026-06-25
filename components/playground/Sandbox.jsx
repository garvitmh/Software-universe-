"use client";

import { useEffect, useRef, useState } from "react";

// ── JavaScript: runs in a throwaway Web Worker (console captured, killable). ──
const JS_WORKER_SRC = `
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

// ── Python: Pyodide in a persistent worker (loads the runtime from CDN once). ──
const PY_WORKER_SRC = `
  let readyPromise = null;
  function getPyodide() {
    if (!readyPromise) {
      importScripts("https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js");
      readyPromise = loadPyodide();
    }
    return readyPromise;
  }
  self.onmessage = async function (e) {
    const logs = [];
    try {
      const pyodide = await getPyodide();
      pyodide.setStdout({ batched: (s) => logs.push({ level: "log", text: s }) });
      pyodide.setStderr({ batched: (s) => logs.push({ level: "error", text: s }) });
      await pyodide.runPythonAsync(e.data.code);
      self.postMessage(logs.length ? logs : [{ level: "log", text: "(no output — try print())" }]);
    } catch (err) {
      logs.push({ level: "error", text: String(err && err.message ? err.message : err) });
      self.postMessage(logs);
    }
  };
`;

const JS_EXAMPLES = [
  { label: "Hello", code: `// Anything you console.log shows up below.\nconsole.log("Hello, Software Universe!");\nconsole.log("2 + 2 =", 2 + 2);` },
  { label: "FizzBuzz", code: `// Print 1..20, but "Fizz"/"Buzz"/"FizzBuzz".\nfor (let i = 1; i <= 20; i++) {\n  let out = "";\n  if (i % 3 === 0) out += "Fizz";\n  if (i % 5 === 0) out += "Buzz";\n  console.log(out || i);\n}` },
  { label: "Two Sum (O(n))", code: `// Two numbers that add to the target, in ONE pass, with a hash map.\nfunction twoSum(nums, target) {\n  const seen = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const need = target - nums[i];\n    if (seen.has(need)) return [seen.get(need), i];\n    seen.set(nums[i], i);\n  }\n  return null;\n}\nconsole.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]` },
  { label: "Count the work", code: `// O(n) vs O(n^2): count the steps each takes.\nfunction linear(n) { let s = 0; for (let i = 0; i < n; i++) s++; return s; }\nfunction quadratic(n) { let s = 0; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) s++; return s; }\nfor (const n of [10, 100, 1000]) {\n  console.log("n =", n, "| O(n):", linear(n), "| O(n^2):", quadratic(n));\n}` },
];

const PY_EXAMPLES = [
  { label: "Hello", code: `print("Hello, Software Universe!")\nprint("2 + 2 =", 2 + 2)` },
  { label: "FizzBuzz", code: `for i in range(1, 21):\n    out = ""\n    if i % 3 == 0:\n        out += "Fizz"\n    if i % 5 == 0:\n        out += "Buzz"\n    print(out or i)` },
  { label: "Two Sum", code: `# Two numbers that add to the target, in one pass with a dict.\ndef two_sum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        if target - n in seen:\n            return [seen[target - n], i]\n        seen[n] = i\n    return None\n\nprint(two_sum([2, 7, 11, 15], 9))  # [0, 1]` },
  { label: "Comprehensions", code: `# The Pythonic way: squares of the even numbers.\nsquares = [n * n for n in range(10) if n % 2 == 0]\nprint(squares)\n\nwords = "the quick brown fox".split()\nprint({w: len(w) for w in words})` },
  { label: "A small class", code: `class Stack:\n    def __init__(self):\n        self.items = []\n    def push(self, x):\n        self.items.append(x)\n    def pop(self):\n        return self.items.pop()\n    def __len__(self):\n        return len(self.items)\n\ns = Stack()\nfor x in [1, 2, 3]:\n    s.push(x)\nprint("size:", len(s))\nprint("pop:", s.pop())` },
];

const COLORS = {
  log: "var(--ink)",
  warn: "var(--bronze)",
  error: "var(--accent)",
  result: "var(--primary)",
};

export default function Sandbox() {
  const [lang, setLang] = useState("js");
  const [codes, setCodes] = useState({ js: JS_EXAMPLES[0].code, py: PY_EXAMPLES[0].code });
  const [output, setOutput] = useState([]);
  const [status, setStatus] = useState("ready");
  const [running, setRunning] = useState(false);
  const taRef = useRef(null);
  const pyWorkerRef = useRef(null);
  const pyUrlRef = useRef(null);

  const code = codes[lang];
  const examples = lang === "js" ? JS_EXAMPLES : PY_EXAMPLES;
  const setCode = (next) => setCodes((c) => ({ ...c, [lang]: next }));

  const killPyWorker = () => {
    if (pyWorkerRef.current) pyWorkerRef.current.terminate();
    if (pyUrlRef.current) URL.revokeObjectURL(pyUrlRef.current);
    pyWorkerRef.current = null;
    pyUrlRef.current = null;
  };
  useEffect(() => () => killPyWorker(), []);

  const runJs = () => {
    setRunning(true);
    setStatus("running…");
    setOutput([]);
    let worker;
    try {
      const blob = new Blob([JS_WORKER_SRC], { type: "application/javascript" });
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

  const runPython = () => {
    setRunning(true);
    setStatus("running Python…");
    setOutput([]);
    if (!pyWorkerRef.current) {
      const blob = new Blob([PY_WORKER_SRC], { type: "application/javascript" });
      const url = URL.createObjectURL(blob);
      pyUrlRef.current = url;
      pyWorkerRef.current = new Worker(url);
    }
    const worker = pyWorkerRef.current;
    const timeout = setTimeout(() => {
      killPyWorker();
      setOutput((o) => [...o, { level: "error", text: "Timed out (30s). The Python worker was reset — try again." }]);
      setRunning(false);
      setStatus("timed out");
    }, 30000);
    worker.onmessage = (e) => {
      clearTimeout(timeout);
      const logs = e.data || [];
      setOutput(logs);
      setRunning(false);
      setStatus(logs.some((l) => l.level === "error") ? "error" : "done");
    };
    worker.onerror = (e) => {
      clearTimeout(timeout);
      killPyWorker();
      setOutput([{ level: "error", text: "Python failed to start: " + String(e.message || e) }]);
      setRunning(false);
      setStatus("error");
    };
    worker.postMessage({ code });
  };

  const run = () => (lang === "js" ? runJs() : runPython());

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

  const langBtn = (key, label) => (
    <button
      key={key}
      onClick={() => {
        setLang(key);
        setOutput([]);
        setStatus("ready");
      }}
      style={{
        border: `1px solid ${lang === key ? "var(--ink)" : "var(--border)"}`,
        background: lang === key ? "var(--ink)" : "var(--surface)",
        color: lang === key ? "var(--bg)" : "var(--ink-2)",
        fontFamily: "var(--font-mono)",
        fontWeight: 600,
        fontSize: 11,
        letterSpacing: ".06em",
        padding: "6px 12px",
        borderRadius: 6,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
      {/* language + examples */}
      <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", background: "var(--surface)", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 6, marginRight: 6 }}>
          {langBtn("js", "JavaScript")}
          {langBtn("py", "Python")}
        </div>
        <span style={{ width: 1, height: 18, background: "var(--border)", margin: "0 4px" }} />
        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-3)" }}>Examples</span>
        {examples.map((ex) => (
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
        <button onClick={run} disabled={running} style={{ border: "none", background: "var(--ink)", color: "var(--bg)", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 14, padding: "9px 18px", borderRadius: 6, cursor: "pointer" }}>
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
        <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 10 }}>Output</div>
        {output.length === 0 ? (
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--ink-3)" }}>
            {running && lang === "py" ? "loading the Python runtime (first run downloads it)…" : "— run your code to see output here —"}
          </div>
        ) : (
          output.map((l, i) => (
            <pre key={i} style={{ fontFamily: "var(--font-mono)", fontSize: 13, lineHeight: 1.6, color: COLORS[l.level] || "var(--ink)", margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
              {l.level === "result" ? "⟶ " : l.level === "error" ? "✕ " : ""}
              {l.text}
            </pre>
          ))
        )}
      </div>
    </div>
  );
}
