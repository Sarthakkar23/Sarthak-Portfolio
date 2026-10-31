import React, { useEffect, useRef } from "react";
import * as THREE from "three";

// The signature hero: a synthetic handwritten prescription, made of ink particles, is read by a
// scan line, its fields lock in, and the ink re-forms as the FHIR record AMRIP-India would produce.
// Everything shown is a synthetic sample — no real patient or prescription data.

const SEAL = new THREE.Color("#a3263a");
const IVORY = new THREE.Color("#efe6d8");

const RX_LINES = [
  { text: "Tab. Paracetamol 650 mg", note: "1-0-1  ×  5 days" },
  { text: "Cap. Amoxicillin 500 mg", note: "1-1-1  ×  7 days" },
  { text: "Syp. Ambroxol 10 ml", note: "TDS after food" },
];
const FHIR_LINES = [
  "{",
  '  "resourceType": "MedicationRequest",',
  '  "subject": "Patient/synthetic-34F",',
  '  "medication": "Paracetamol 650 mg",',
  '  "dosage": "1-0-1 · 5 days",',
  '  "evidence": "ocr-span + bbox ✓",',
  '  "status": "verified"',
  "}",
];

// Draw text to an offscreen canvas and return the coordinates of its inked pixels.
function inkPoints(draw, w, h, step) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d");
  g.fillStyle = "#000";
  g.fillRect(0, 0, w, h);
  g.fillStyle = "#fff";
  g.strokeStyle = "#fff";
  const boxes = draw(g) || [];
  const data = g.getImageData(0, 0, w, h).data;
  const pts = [];
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      if (data[(y * w + x) * 4] > 110) pts.push(x - w / 2, h / 2 - y);
    }
  }
  return { pts, boxes };
}

function drawPrescription(g, w, h) {
  const hand = '"Bradley Hand", "Segoe Script", "Snell Roundhand", "Brush Script MT", cursive';
  g.lineWidth = 2;
  g.strokeRect(6, 6, w - 12, h - 12);
  g.font = `600 ${h * 0.11}px Georgia, serif`;
  g.fillText("Rx", 28, h * 0.2);
  g.font = `${h * 0.045}px Georgia, serif`;
  g.fillText("SYNTHETIC SAMPLE  ·  Pt. 34 F", w * 0.42, h * 0.12);
  g.fillRect(28, h * 0.25, w - 56, 1.5);
  const boxes = [];
  RX_LINES.forEach((l, i) => {
    const y = h * (0.38 + i * 0.17);
    g.font = `${h * 0.078}px ${hand}`;
    g.fillText(l.text, 34, y);
    g.font = `${h * 0.058}px ${hand}`;
    g.fillText(l.note, 54, y + h * 0.07);
    boxes.push({ x: 24, y: y - h * 0.075, w: w - 48, h: h * 0.165 });
  });
  g.font = `${h * 0.07}px ${hand}`;
  g.fillText("Dr. A. Rao", w * 0.62, h * 0.93);
  return boxes;
}

function drawRecord(g, w, h) {
  const lh = h / (FHIR_LINES.length + 1.2);
  const family = '"Hanken Grotesk Variable", ui-monospace, Menlo, monospace';
  // start from the line height, then shrink until the longest line fits the document width
  let size = lh * 0.62;
  g.font = `500 ${size}px ${family}`;
  const widest = Math.max(...FHIR_LINES.map((l) => g.measureText(l).width));
  if (widest > w - 28) size *= (w - 28) / widest;
  g.font = `500 ${size}px ${family}`;
  FHIR_LINES.forEach((l, i) => g.fillText(l, 14, lh * (i + 1.25)));
}

// Fit (or repeat) a point list to exactly n points.
function fit(pts, n) {
  const out = new Float32Array(n * 3);
  const count = pts.length / 2;
  for (let i = 0; i < n; i++) {
    const j = count ? (Math.floor(Math.random() * count) * 2) : 0;
    out[i * 3] = (pts[j] || 0) + (Math.random() - 0.5) * 1.2;
    out[i * 3 + 1] = (pts[j + 1] || 0) + (Math.random() - 0.5) * 1.2;
    out[i * 3 + 2] = 0;
  }
  return out;
}

const vertex = /* glsl */ `
  attribute vec3 aTo;
  attribute vec3 aScatter;
  attribute float aSeed;
  uniform float uMorph;      // 0 = prescription, 1 = record
  uniform float uAssemble;   // 0 = scattered, 1 = assembled
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uSize;
  uniform float uScan;       // scan line y in local px, very negative when idle
  varying float vGlow;
  varying float vAlpha;

  float ease(float t) { return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0; }

  void main() {
    float d = clamp(uMorph * 1.5 - aSeed * 0.5, 0.0, 1.0);
    float t = ease(d);
    vec3 p = mix(position, aTo, t);
    // turbulence while in flight
    float flight = sin(3.14159 * t);
    p.x += sin(aSeed * 40.0 + uTime * 1.3) * 26.0 * flight;
    p.y += cos(aSeed * 31.0 + uTime * 1.1) * 18.0 * flight;
    // assemble from scatter on first entrance
    float a = ease(clamp(uAssemble * 1.4 - aSeed * 0.4, 0.0, 1.0));
    p = mix(aScatter, p, a);
    // pointer pushes the ink aside
    vec2 toM = p.xy - uMouse;
    float dist = length(toM);
    p.xy += normalize(toM + 0.0001) * smoothstep(110.0, 0.0, dist) * 34.0;
    // idle breathing
    p.y += sin(uTime * 0.6 + aSeed * 6.28) * 0.8;

    vGlow = smoothstep(14.0, 0.0, abs(p.y - uScan));
    vAlpha = 0.55 + 0.45 * a;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (1.0 + vGlow * 0.8);
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uIvory;
  uniform vec3 uSeal;
  varying float vGlow;
  varying float vAlpha;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r = length(c);
    if (r > 0.5) discard;
    float soft = smoothstep(0.5, 0.15, r);
    vec3 col = mix(uIvory, uSeal * 1.6, vGlow);
    gl_FragColor = vec4(col, soft * vAlpha);
  }
`;

// The loop, in seconds. Keyframes return { morph, scan (0..1 of card height), boxes (0..1) }.
const LOOP = 13;
function timeline(t) {
  const k = t % LOOP;
  const s = (a, b) => Math.min(1, Math.max(0, (k - a) / (b - a)));
  const scan = k > 1.4 && k < 3.8 ? s(1.4, 3.8) : -1;
  const boxes = k < 1.6 ? 0 : k < 4.2 ? s(1.6, 3.9) : k < 5.6 ? 1 - s(4.6, 5.6) : 0;
  const morph = k < 4.4 ? 0 : k < 6.6 ? s(4.4, 6.6) : k < 10 ? 1 : 1 - s(10, 12.4);
  return { morph, scan, boxes };
}

function PrescriptionHero({ ready = true, onPhase }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
    } catch (e) {
      mount.classList.add("is-fallback");
      return undefined;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -100, 100);
    const group = new THREE.Group();
    scene.add(group);

    let points, boxLines, scanLine, cardH, cardW, boxes;
    const uniforms = {
      uMorph: { value: reduced ? 1 : 0 },
      uAssemble: { value: reduced ? 1 : 0 },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(9999, 9999) },
      uSize: { value: 2.2 },
      uScan: { value: -9999 },
      uIvory: { value: IVORY },
      uSeal: { value: SEAL },
    };

    function build() {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      const mobile = w < 760;
      cardW = Math.round(Math.min(mobile ? w * 0.86 : w * 0.34, 560));
      cardH = Math.round(cardW * (mobile ? 0.6 : 0.7));
      const step = 2;
      const n = mobile ? 7000 : 9000;
      uniforms.uSize.value = (mobile ? 1.7 : 2.3) * renderer.getPixelRatio();

      const rx = inkPoints((g) => drawPrescription(g, cardW, cardH), cardW, cardH, step);
      const rec = inkPoints((g) => drawRecord(g, cardW, cardH), cardW, cardH, step);
      boxes = rx.boxes;

      if (points) {
        group.remove(points);
        points.geometry.dispose();
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(fit(rx.pts, n), 3));
      geo.setAttribute("aTo", new THREE.BufferAttribute(fit(rec.pts, n), 3));
      const scatter = new Float32Array(n * 3);
      const seeds = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        scatter[i * 3] = (Math.random() - 0.5) * w * 1.2;
        scatter[i * 3 + 1] = (Math.random() - 0.5) * h * 1.2;
        seeds[i] = Math.random();
      }
      geo.setAttribute("aScatter", new THREE.BufferAttribute(scatter, 3));
      geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
      const mat = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      points = new THREE.Points(geo, mat);
      group.add(points);

      // field boxes (thin oxblood frames) and the scan line
      if (boxLines) {
        group.remove(boxLines);
        boxLines.geometry.dispose();
      }
      const seg = [];
      boxes.forEach((b) => {
        const x0 = b.x - cardW / 2, x1 = x0 + b.w, y0 = cardH / 2 - b.y, y1 = y0 - b.h;
        seg.push(x0, y0, 0, x1, y0, 0, x1, y0, 0, x1, y1, 0, x1, y1, 0, x0, y1, 0, x0, y1, 0, x0, y0, 0);
      });
      const bg = new THREE.BufferGeometry();
      bg.setAttribute("position", new THREE.Float32BufferAttribute(seg, 3));
      boxLines = new THREE.LineSegments(bg, new THREE.LineBasicMaterial({ color: SEAL, transparent: true, opacity: 0 }));
      group.add(boxLines);

      if (!scanLine) {
        scanLine = new THREE.Mesh(
          new THREE.PlaneGeometry(1, 1),
          new THREE.MeshBasicMaterial({ color: SEAL, transparent: true, opacity: 0, blending: THREE.AdditiveBlending })
        );
        group.add(scanLine);
      }
      scanLine.scale.set(cardW + 40, 1.5, 1);

      // camera in CSS pixels; place the document right of centre on desktop, centred on phones
      camera.left = -w / 2;
      camera.right = w / 2;
      camera.top = h / 2;
      camera.bottom = -h / 2;
      camera.updateProjectionMatrix();
      // desktop: upper right, clear of the name (lower left) and the actions (lower middle)
      // phone: the band between the caption (top) and the name (bottom third)
      group.position.set(mobile ? 0 : w * 0.245, mobile ? h * 0.16 : h * 0.135, 0);
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
    }

    build();

    // pointer → local group coordinates
    const onMove = (e) => {
      const r = mount.getBoundingClientRect();
      uniforms.uMouse.value.set(e.clientX - r.left - r.width / 2 - group.position.x, r.height / 2 - (e.clientY - r.top) - group.position.y);
    };
    const onLeave = () => uniforms.uMouse.value.set(9999, 9999);
    window.addEventListener("pointermove", onMove, { passive: true });
    mount.addEventListener("pointerleave", onLeave);

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.01 });
    io.observe(mount);
    const onResize = () => build();
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    let started = null;
    let raf;
    let lastPhase = "";
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
      const dt = clock.getDelta();
      uniforms.uTime.value += dt;
      if (reduced) {
        renderer.render(scene, camera);
        cancelAnimationFrame(raf);
        return;
      }
      if (!mount.dataset.ready) return renderer.render(scene, camera);
      if (started === null) started = uniforms.uTime.value;
      const t = uniforms.uTime.value - started;
      uniforms.uAssemble.value = Math.min(1, t / 1.6);
      const tl = timeline(Math.max(0, t - 0.6));
      uniforms.uMorph.value = tl.morph;
      const scanY = tl.scan < 0 ? -9999 : cardH / 2 - tl.scan * cardH;
      uniforms.uScan.value = scanY;
      scanLine.position.y = scanY;
      scanLine.material.opacity = tl.scan < 0 ? 0 : 0.9;
      boxLines.material.opacity = tl.boxes * 0.85;
      const phase = tl.morph > 0.5 ? "record" : tl.scan >= 0 ? "reading" : "prescription";
      if (phase !== lastPhase && onPhase) {
        lastPhase = phase;
        onPhase(phase);
      }
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      mount.removeEventListener("pointerleave", onLeave);
      if (points) points.geometry.dispose();
      if (boxLines) boxLines.geometry.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, [onPhase]);

  // Start the choreography once the intro has finished.
  useEffect(() => {
    if (ready && mountRef.current) mountRef.current.dataset.ready = "1";
  }, [ready]);

  return <div className="lx-hero-canvas" ref={mountRef} aria-hidden="true" />;
}

export default PrescriptionHero;
