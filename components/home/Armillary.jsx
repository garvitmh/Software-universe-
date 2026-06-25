"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * The hero "armillary" — a wireframe icosahedron wrapped in three orbital
 * rings, with a single node tracing the outer ring. A system, rendered as an
 * astrolabe: every ring a layer. Bronze ink, reactive to the active theme,
 * with a gentle pointer parallax. (Ported faithfully from the Editorial spec.)
 */
export default function Armillary() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const isDark = () => document.documentElement.getAttribute("data-theme") === "dark";
    const col = () => (isDark() ? 0xcaa468 : 0x9a7b45);

    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);

    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
    cam.position.set(0, 0, 6);

    const group = new THREE.Group();
    scene.add(group);

    const mat = new THREE.LineBasicMaterial({ color: col(), transparent: true, opacity: 0.85 });
    const icoGeo = new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.25, 1));
    const ico = new THREE.LineSegments(icoGeo, mat);
    group.add(ico);

    const ringMat = new THREE.LineBasicMaterial({ color: col(), transparent: true, opacity: 0.5 });
    const ringGeos = [];
    const mkRing = (r, rx, ry, rz) => {
      const pts = [];
      for (let i = 0; i <= 80; i++) {
        const a = (i / 80) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0));
      }
      const g = new THREE.BufferGeometry().setFromPoints(pts);
      ringGeos.push(g);
      const l = new THREE.Line(g, ringMat);
      l.rotation.set(rx, ry, rz);
      return l;
    };
    group.add(mkRing(2.15, 0, 0, 0));
    group.add(mkRing(2.15, Math.PI / 2.2, 0, 0));
    group.add(mkRing(2.15, 0, Math.PI / 2.4, Math.PI / 6));

    const nodeGeo = new THREE.SphereGeometry(0.07, 16, 16);
    const nodeMat = new THREE.MeshBasicMaterial({ color: col() });
    const node = new THREE.Mesh(nodeGeo, nodeMat);
    scene.add(node);

    let tx = 0;
    let ty = 0;
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 0.6;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 0.6;
    };
    canvas.addEventListener("pointermove", onMove);

    const resize = () => {
      const W = canvas.clientWidth || 1;
      const H = canvas.clientHeight || 1;
      renderer.setSize(W, H, false);
      cam.aspect = W / H;
      cam.updateProjectionMatrix();
    };
    window.addEventListener("resize", resize);

    let t = 0;
    let raf;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!reduce) {
        group.rotation.y += 0.0035;
        group.rotation.x = -0.25 + ty * 0.5;
        group.rotation.y += tx * 0.004;
        t += 0.012;
      }
      const c = col();
      mat.color.setHex(c);
      ringMat.color.setHex(c);
      nodeMat.color.setHex(c);
      node.position.set(Math.cos(t) * 2.15, Math.sin(t) * 0.4, Math.sin(t) * 2.15);
      renderer.render(scene, cam);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", onMove);
      icoGeo.dispose();
      ringGeos.forEach((g) => g.dispose());
      nodeGeo.dispose();
      mat.dispose();
      ringMat.dispose();
      nodeMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
    />
  );
}
