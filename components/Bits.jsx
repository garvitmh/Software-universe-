"use client";

// React-Bits-inspired animated primitives, built on framer-motion.
// Reusable across all three worlds (docs, roadmap, simulator).

import { motion, useInView, useMotionValue, useSpring, useTransform, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const SPRING = { type: "spring", stiffness: 260, damping: 22 };

/* Scroll-reveal: fades + slides children in when they enter the viewport. */
export function Reveal({ children, y = 22, delay = 0, once = true, className, style }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: "-12% 0px -12% 0px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

/* Word-by-word stagger reveal for headlines. */
export function SplitText({ text, className, style, delay = 0, stagger = 0.05 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const words = String(text).split(" ");
  return (
    <span ref={ref} className={className} style={{ display: "inline-block", ...style }}>
      {words.map((w, i) => (
        <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top" }}>
          <motion.span
            style={{ display: "inline-block" }}
            initial={{ y: "110%", opacity: 0 }}
            animate={inView ? { y: "0%", opacity: 1 } : {}}
            transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1], delay: delay + i * stagger }}
          >
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* Button/anchor that leans toward the cursor. */
export function Magnetic({ children, strength = 0.4, className, style, onClick }) {
  const ref = useRef(null);
  const x = useSpring(0, SPRING);
  const y = useSpring(0, SPRING);
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => { x.set(0); y.set(0); };
  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      onClick={onClick}
      style={{ x, y, display: "inline-flex", ...style }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* Card that tilts in 3D toward the cursor. */
export function Tilt({ children, max = 10, className, style }) {
  const ref = useRef(null);
  const rx = useSpring(0, SPRING);
  const ry = useSpring(0, SPRING);
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * max * 2);
    rx.set(-py * max * 2);
  };
  const reset = () => { rx.set(0); ry.set(0); };
  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 800, ...style }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* Number that counts up when scrolled into view. */
export function CountUp({ to = 100, from = 0, duration = 1.6, suffix = "", prefix = "", className, style }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(from);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(from, to, {
      duration,
      ease: [0.2, 0.7, 0.2, 1],
      onUpdate: (v) => setVal(v),
    });
    return () => controls.stop();
  }, [inView, from, to, duration]);
  return (
    <span ref={ref} className={className} style={style}>
      {prefix}{Math.round(val).toLocaleString()}{suffix}
    </span>
  );
}

/* Infinite horizontal marquee. */
export function Marquee({ children, speed = 26, className }) {
  return (
    <div className={`no-scrollbar ${className || ""}`} style={{ overflow: "hidden", maskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)" }}>
      <div style={{ display: "inline-flex", gap: 14, animation: `marquee ${speed}s linear infinite`, willChange: "transform" }}>
        <div style={{ display: "inline-flex", gap: 14 }}>{children}</div>
        <div style={{ display: "inline-flex", gap: 14 }} aria-hidden>{children}</div>
      </div>
    </div>
  );
}

/* Soft animated colour blobs — a playful background layer. */
export function Aurora({ colors = ["var(--pop-pink)", "var(--brand)", "var(--pop-purple)", "var(--pop-blue)"] }) {
  const spots = [
    { c: colors[0], top: "-8%", left: "8%", size: 360, delay: 0 },
    { c: colors[1], top: "20%", left: "70%", size: 420, delay: 3 },
    { c: colors[2], top: "55%", left: "12%", size: 320, delay: 6 },
    { c: colors[3], top: "62%", left: "62%", size: 380, delay: 9 },
  ];
  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 }}>
      {spots.map((s, i) => (
        <span key={i} className="blob" style={{ background: s.c, width: s.size, height: s.size, top: s.top, left: s.left, animationDelay: `${s.delay}s` }} />
      ))}
    </div>
  );
}
