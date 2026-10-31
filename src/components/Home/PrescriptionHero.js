import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// The signature hero: a synthetic handwritten prescription, made of ink particles, is read by a
// scan line, its fields lock in, and the ink re-forms as the FHIR record AMRIP-India would produce.
// When the record lands, crisp type settles over the ink and an oxblood seal stamps it verified.
// Everything shown is a synthetic sample: no real patient or prescription data.

const SEAL = new THREE.Color("#a3263a");
const IVORY = new THREE.Color("#efe6d8");
const HAND = '"Homemade Apple", cursive';
const MONO = '"Hanken Grotesk Variable", system-ui, sans-serif';
const SCALE = 2; // offscreen canvases render at 2x so sampled ink keeps its strokes

const RX_LINES = [
  { text: "Tab. Paracetamol 650 mg", note: "1-0-1  x  5 days" },
  { text: "Cap. Amoxicillin 500 mg", note: "1-1-1  x  7 days" },
  { text: "Syp. Ambroxol 10 ml", note: "TDS after food" },
];
const FHIR_FULL = [
  "{",
  '  "resourceType": "MedicationRequest",',
  '  "subject": "Patient/synthetic-34F",',
  '  "medication": "Paracetamol 650 mg",',
  '  "dosage": "1-0-1 · 5 days",',
  '  "evidence": "ocr span + box matched",',
  '  "status": "verified"',
  "}",
];
const FHIR_SHORT = [
  "{",
  '  "resourceType": "MedicationRequest",',
  '  "medication": "Paracetamol 650 mg",',
  '  "dosage": "1-0-1 · 5 days",',
  '  "status": "verified"',
  "}",
];

// Draw onto a 2x offscreen canvas and return the CSS-pixel coordinates of every inked pixel.
function inkPoints(draw, w, h) {
  const c = document.createElement("canvas");
  c.width = w * SCALE;
  c.height = h * SCALE;
  const g = c.getContext("2d");
  g.fillStyle = "#000";
  g.fillRect(0, 0, c.width, c.height);
  g.scale(SCALE, SCALE);
  g.fillStyle = "#fff";
  g.strokeStyle = "#fff";
  const meta = draw(g) || {};
  const data = g.getImageData(0, 0, c.width, c.height).data;
  const pts = [];
  for (let y = 0; y < c.height; y += 1) {
    for (let x = 0; x < c.width; x += 1) {
      if (data[(y * c.width + x) * 4] > 120) pts.push(x / SCALE - w / 2, h / 2 - y / SCALE);
    }
  }
  return { pts, meta };
}

// Offset of an element from an ancestor, ignoring CSS transforms (the hero copy drifts on scroll).
function offsetIn(el, root) {
  let x = 0;
  let y = 0;
  while (el && el !== root) {
    x += el.offsetLeft;
    y += el.offsetTop;
    el = el.offsetParent;
  }
  return { x, y };
}

// Draw the DOM name exactly where it sits, in its own face, so the ink can gather into it.
function drawName(g, hero) {
  hero.querySelectorAll(".lx-hero-word").forEach((word) => {
    const cs = getComputedStyle(word);
    const x = offsetIn(word, hero).x;
    const y = offsetIn(word.querySelector(".lx-baseline"), hero).y;
    g.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    if ("letterSpacing" in g) g.letterSpacing = cs.letterSpacing;
    g.fillText(word.firstChild.textContent, x, y);
  });
}

function drawPrescription(g, w, h) {
  g.lineWidth = 1.5;
  g.strokeRect(6, 6, w - 12, h - 12);
  g.font = `italic 400 ${h * 0.13}px "Bodoni Moda Variable", Georgia, serif`;
  g.fillText("Rx", 26, h * 0.2);
  g.font = `500 ${h * 0.042}px ${MONO}`;
  g.fillText("SYNTHETIC SAMPLE  ·  PT. 34 F", w * 0.44, h * 0.12);
  g.fillRect(26, h * 0.255, w - 52, 1);
  const boxes = [];
  RX_LINES.forEach((l, i) => {
    const y = h * (0.39 + i * 0.165);
    g.font = `${h * 0.06}px ${HAND}`;
    g.fillText(l.text, 32, y);
    g.font = `${h * 0.045}px ${HAND}`;
    g.fillText(l.note, 52, y + h * 0.066);
    boxes.push({ x: 22, y: y - h * 0.07, w: w - 44, h: h * 0.158 });
  });
  g.font = `${h * 0.055}px ${HAND}`;
  g.fillText("Dr. A. Rao", w * 0.6, h * 0.93);
  return { boxes };
}

function drawRecord(g, w, h, lines) {
  const lh = h / (lines.length + 1.2);
  let size = lh * 0.6;
  g.font = `500 ${size}px ${MONO}`;
  const widest = Math.max(...lines.map((l) => g.measureText(l).width));
  if (widest > w - 28) size *= (w - 28) / widest;
  g.font = `500 ${size}px ${MONO}`;
  lines.forEach((l, i) => g.fillText(l, 14, lh * (i + 1.25)));
  return { lh, size };
}

// Pick n distinct points (shuffled, no replacement); repeat only when a shape has fewer pixels than n.
function fit(pts, n) {
  const count = pts.length / 2;
  const idx = Array.from({ length: count }, (_, i) => i);
  for (let i = count - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const k = idx[i % Math.max(1, count)] * 2;
    out[i * 3] = (pts[k] || 0) + (i >= count ? (Math.random() - 0.5) * 0.6 : 0);
    out[i * 3 + 1] = pts[k + 1] || 0;
  }
  return out;
}

const vertex = /* glsl */ `
  attribute vec3 aTo;
  attribute vec3 aScatter;
  attribute vec3 aName;
  attribute float aSeed;
  uniform float uMorph;
  uniform float uAssemble;
  uniform float uName;
  uniform float uNameCrisp;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uSize;
  uniform float uScan;
  uniform float uFade;
  varying float vGlow;
  varying float vAlpha;

  float ease(float t) { return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0; }

  void main() {
    float d = clamp(uMorph * 1.5 - aSeed * 0.5, 0.0, 1.0);
    float t = ease(d);
    vec3 p = mix(position, aTo, t);
    float flight = sin(3.14159 * t);
    p.x += sin(aSeed * 40.0 + uTime * 1.3) * 24.0 * flight;
    p.y += cos(aSeed * 31.0 + uTime * 1.1) * 16.0 * flight;
    // ink first gathers into the name (desktop), then flows on into the prescription
    float g = ease(clamp(uName * 1.4 - aSeed * 0.4, 0.0, 1.0));
    vec3 pre = mix(aScatter, aName, g);
    float a = ease(clamp(uAssemble * 1.4 - aSeed * 0.4, 0.0, 1.0));
    p = mix(pre, p, a);
    p.y += sin(3.14159 * a) * g * (aSeed - 0.5) * 80.0;
    vec2 toM = p.xy - uMouse;
    float dist = length(toM);
    p.xy += normalize(toM + 0.0001) * smoothstep(110.0, 0.0, dist) * 30.0;

    float s = abs(p.y - uScan);
    vGlow = smoothstep(26.0, 0.0, s);
    vAlpha = (0.42 + 0.38 * max(a, g)) * (1.0 - uFade * 0.8) * (1.0 - uNameCrisp * (1.0 - a) * 0.92);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = uSize * (1.0 + vGlow * 0.9);
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
    float soft = smoothstep(0.5, 0.1, r);
    vec3 col = mix(uIvory, uSeal * 1.7, vGlow);
    gl_FragColor = vec4(col, soft * vAlpha);
  }
`;

// The loop, in seconds.
const LOOP = 13;
function timeline(t) {
  const k = t % LOOP;
  const s = (a, b) => Math.min(1, Math.max(0, (k - a) / (b - a)));
  const scan = k > 1.4 && k < 3.8 ? s(1.4, 3.8) : -1;
  const boxes = k < 1.6 ? 0 : k < 4.2 ? s(1.6, 3.9) : k < 5.6 ? 1 - s(4.6, 5.6) : 0;
  const morph = k < 4.4 ? 0 : k < 6.6 ? s(4.4, 6.6) : k < 10 ? 1 : 1 - s(10, 12.4);
  const crisp = k < 6.7 ? 0 : k < 7.4 ? s(6.7, 7.4) : k < 9.5 ? 1 : 1 - s(9.5, 10.1);
  return { morph, scan, boxes, crisp };
}

function PrescriptionHero({ ready = true, onPhase }) {
  const mountRef = useRef(null);
  const recordRef = useRef(null);
  const [lines, setLines] = useState(FHIR_FULL);

  useEffect(() => {
    const mount = mountRef.current;
    const record = recordRef.current;
    if (!mount) return undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let disposed = false;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
    } catch (e) {
      mount.classList.add("is-fallback");
      if (record) record.style.opacity = 1;
      return undefined;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setClearColor(0x000000, 0);
    mount.prepend(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -100, 100);
    const group = new THREE.Group();
    scene.add(group);

    let points, boxLines, scanLine, scanGlow, cardH, cardW;
    let inkName = false;
    let nameShown = false;
    const uniforms = {
      uMorph: { value: reduced ? 1 : 0 },
      uAssemble: { value: reduced ? 1 : 0 },
      uName: { value: 0 },
      uNameCrisp: { value: 0 },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(9999, 9999) },
      uSize: { value: 1.4 },
      uScan: { value: -9999 },
      uFade: { value: reduced ? 1 : 0 },
      uIvory: { value: IVORY },
      uSeal: { value: SEAL },
    };

    function build() {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h) return;
      const mobile = w < 760;
      const recLines = mobile ? FHIR_SHORT : FHIR_FULL;
      setLines(recLines);
      // on phones the record must also fit the framed box's height
      cardW = Math.round(Math.min(mobile ? Math.min(w * 0.88, (h * 0.86) / 0.62) : w * 0.34, 560));
      cardH = Math.round(cardW * (mobile ? 0.62 : 0.7));
      const n = mobile ? 15000 : 26000;
      const gx = mobile ? 0 : w * 0.245;
      // on phones the canvas is its own framed box below the copy, so the record sits centred in it;
      // on desktop the record sits high and right, clear of the one-line name along the bottom
      const gy = mobile ? 0 : h * 0.2;
      uniforms.uSize.value = (mobile ? 1.25 : 1.4) * renderer.getPixelRatio();

      const rx = inkPoints((g) => drawPrescription(g, cardW, cardH), cardW, cardH);
      const rec = inkPoints((g) => drawRecord(g, cardW, cardH, recLines), cardW, cardH);

      if (points) {
        group.remove(points);
        points.geometry.dispose();
        points.material.dispose();
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
      // Desktop: the ink starts by gathering into the name, which only the hero can draw in place.
      const hero = mount.parentElement;
      const nameEl = hero && hero.querySelector(".lx-hero-name");
      // only claim the name if it hasn't already been revealed without us
      inkName = Boolean(!mobile && !reduced && nameEl && (started === null ? !nameEl.classList.contains("is-shown") : inkName));
      let named = scatter;
      if (inkName) {
        nameEl.dataset.ink = "1";
        const pts = inkPoints((g) => drawName(g, hero), w, h).pts;
        if (pts.length) {
          named = fit(pts, n);
          for (let i = 0; i < n; i++) {
            named[i * 3] -= gx;
            named[i * 3 + 1] -= gy;
          }
        }
      }
      geo.setAttribute("aName", new THREE.BufferAttribute(named, 3));
      geo.setAttribute("aScatter", new THREE.BufferAttribute(scatter, 3));
      geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
      points = new THREE.Points(
        geo,
        new THREE.ShaderMaterial({
          uniforms,
          vertexShader: vertex,
          fragmentShader: fragment,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        })
      );
      group.add(points);

      if (boxLines) {
        group.remove(boxLines);
        boxLines.geometry.dispose();
      }
      const seg = [];
      (rx.meta.boxes || []).forEach((b) => {
        const x0 = b.x - cardW / 2, x1 = x0 + b.w, y0 = cardH / 2 - b.y, y1 = y0 - b.h;
        seg.push(x0, y0, 0, x1, y0, 0, x1, y0, 0, x1, y1, 0, x1, y1, 0, x0, y1, 0, x0, y1, 0, x0, y0, 0);
      });
      const bg = new THREE.BufferGeometry();
      bg.setAttribute("position", new THREE.Float32BufferAttribute(seg, 3));
      boxLines = new THREE.LineSegments(bg, new THREE.LineBasicMaterial({ color: SEAL, transparent: true, opacity: 0 }));
      group.add(boxLines);

      if (!scanLine) {
        const mat = (o) => new THREE.MeshBasicMaterial({ color: SEAL, transparent: true, opacity: o, blending: THREE.AdditiveBlending, depthWrite: false });
        scanLine = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat(0));
        scanGlow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat(0));
        group.add(scanGlow, scanLine);
      }
      scanLine.scale.set(cardW + 40, 1.4, 1);
      scanGlow.scale.set(cardW + 40, 26, 1);

      camera.left = -w / 2;
      camera.right = w / 2;
      camera.top = h / 2;
      camera.bottom = -h / 2;
      camera.updateProjectionMatrix();
      group.position.set(gx, gy, 0);
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";

      // crisp record layer sits exactly over the particle record
      if (record) {
        record.style.left = `${w / 2 + gx - cardW / 2}px`;
        record.style.top = `${h / 2 - gy - cardH / 2}px`;
        record.style.width = `${cardW}px`;
        record.style.height = `${cardH}px`;
        record.style.setProperty("--lh", `${rec.meta.lh}px`);
        record.style.setProperty("--fs", `${rec.meta.size}px`);
      }
    }

    const onMove = (e) => {
      const r = mount.getBoundingClientRect();
      uniforms.uMouse.value.set(e.clientX - r.left - r.width / 2 - group.position.x, r.height / 2 - (e.clientY - r.top) - group.position.y);
    };
    const onLeave = () => uniforms.uMouse.value.set(9999, 9999);
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.01 });
    // rebuild when the hero's own box changes size (the phone frame is not tied to the window)
    let lastSize = "";
    const ro = new ResizeObserver(() => {
      const size = `${mount.clientWidth}x${mount.clientHeight}`;
      if (size === lastSize) return;
      lastSize = size;
      build();
    });
    const clock = new THREE.Clock();
    let started = null;
    let raf;
    let lastPhase = "";

    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden || !points) return;
      uniforms.uTime.value += clock.getDelta();
      if (reduced) {
        if (record) {
          record.style.opacity = 1;
          record.classList.add("is-sealed");
        }
        renderer.render(scene, camera);
        cancelAnimationFrame(raf);
        return;
      }
      if (!mount.dataset.ready) {
        renderer.render(scene, camera);
        return;
      }
      if (started === null) started = uniforms.uTime.value;
      const t = uniforms.uTime.value - started;
      const clamp01 = (v) => Math.min(1, Math.max(0, v));
      let tl;
      if (inkName) {
        // 0–1.3 s ink gathers into the name · the crisp name resolves · 2.1 s the ink flows on
        uniforms.uName.value = clamp01(t / 1.3);
        if (t > 1.35 && !nameShown) {
          nameShown = true;
          const nameEl = mount.parentElement.querySelector(".lx-hero-name");
          if (nameEl) nameEl.classList.add("is-shown");
        }
        uniforms.uNameCrisp.value = clamp01((t - 1.35) / 0.9);
        uniforms.uAssemble.value = clamp01((t - 2.1) / 1.6);
        tl = timeline(Math.max(0, t - 2.7));
      } else {
        uniforms.uAssemble.value = Math.min(1, t / 1.6);
        tl = timeline(Math.max(0, t - 0.6));
      }
      uniforms.uMorph.value = tl.morph;
      uniforms.uFade.value = tl.crisp;
      const scanY = tl.scan < 0 ? -9999 : cardH / 2 - tl.scan * cardH;
      uniforms.uScan.value = scanY;
      scanLine.position.y = scanY;
      scanGlow.position.y = scanY;
      scanLine.material.opacity = tl.scan < 0 ? 0 : 0.95;
      scanGlow.material.opacity = tl.scan < 0 ? 0 : 0.12;
      boxLines.material.opacity = tl.boxes * 0.85;
      if (record) {
        record.style.opacity = tl.crisp;
        record.classList.toggle("is-sealed", tl.crisp > 0.6);
      }
      const phase = tl.morph > 0.5 ? "record" : tl.scan >= 0 ? "reading" : "prescription";
      if (phase !== lastPhase && onPhase) {
        lastPhase = phase;
        onPhase(phase);
      }
      renderer.render(scene, camera);
    };

    // Never sample fallback glyphs: wait for the faces the canvases draw with.
    const fonts = document.fonts
      ? Promise.all([
          document.fonts.load(`40px ${HAND}`),
          document.fonts.load(`500 20px ${MONO}`),
          document.fonts.load(`italic 400 40px "Bodoni Moda Variable"`),
          document.fonts.load(`500 40px "Bodoni Moda Variable"`),
        ]).catch(() => null)
      : Promise.resolve();
    fonts.then(() => {
      if (disposed) return;
      build();
      window.addEventListener("pointermove", onMove, { passive: true });
      mount.addEventListener("pointerleave", onLeave);
      io.observe(mount);
      lastSize = `${mount.clientWidth}x${mount.clientHeight}`;
      ro.observe(mount);
      window.addEventListener("lx-name-fit", build);
      loop();
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      ro.disconnect();
      window.removeEventListener("lx-name-fit", build);
      mount.removeEventListener("pointerleave", onLeave);
      if (points) {
        points.geometry.dispose();
        points.material.dispose();
      }
      if (boxLines) boxLines.geometry.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, [onPhase]);

  useEffect(() => {
    if (ready && mountRef.current) mountRef.current.dataset.ready = "1";
  }, [ready]);

  return (
    <div className="lx-hero-canvas" ref={mountRef} aria-hidden="true">
      <div className="lx-record" ref={recordRef}>
        {lines.map((l, i) => (
          <span key={i}>{l}</span>
        ))}
        <svg className="lx-seal" viewBox="0 0 120 120" role="presentation">
          <defs>
            <path id="lx-seal-ring" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
          </defs>
          <circle cx="60" cy="60" r="56" className="lx-seal-disc" />
          <circle cx="60" cy="60" r="50" className="lx-seal-rule" />
          <circle cx="60" cy="60" r="31" className="lx-seal-rule" />
          <text className="lx-seal-ring">
            <textPath href="#lx-seal-ring">VERIFIED · AMRIP-INDIA · SYNTHETIC ·</textPath>
          </text>
          <text x="60" y="70" textAnchor="middle" className="lx-seal-mono">
            SK
          </text>
        </svg>
      </div>
    </div>
  );
}

export default PrescriptionHero;
