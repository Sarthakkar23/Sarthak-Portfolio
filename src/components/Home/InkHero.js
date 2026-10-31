import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { heroSpecimens } from "../../data/heroSpecimens";
import { specimenDrawers, HAND, MONO } from "./specimens";
import portrait from "../../assets/portrait.webp";

// The signature hero. On desktop the ink first gathers into the name; then it cycles through
// heroSpecimens: each project's messy input is drawn in ink particles, read by a scan line, its
// fields lock in, and the ink re-forms as the result. Records get crisp type and a wax seal.
// Everything shown is a synthetic sample or an illustration: no real patient or customer data.

const SEAL = new THREE.Color("#a3263a");
const IVORY = new THREE.Color("#efe6d8");
const SCALE = 2; // offscreen canvases render at 2x so sampled ink keeps its strokes

// Draw onto a 2x offscreen canvas and return the CSS-pixel coordinates of every inked pixel.
function inkPoints(draw, w, h) {
  const c = document.createElement("canvas");
  c.width = w * SCALE;
  c.height = h * SCALE;
  const g = c.getContext("2d", { willReadFrequently: true });
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
    // ink first gathers into the name (desktop), then flows on into the specimen
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

// One specimen's life, in seconds: assemble · scan · fields lock · morph · crisp · disperse.
const CYCLE = 11.6;
function timeline(k) {
  const s = (a, b) => Math.min(1, Math.max(0, (k - a) / (b - a)));
  const assemble = k < 10.2 ? s(0, 1.6) : 1 - s(10.2, 11.4);
  const scan = k > 2 && k < 4.4 ? s(2, 4.4) : -1;
  const boxes = k < 2.2 ? 0 : k < 4.8 ? s(2.2, 4.5) : k < 6.2 ? 1 - s(5.2, 6.2) : 0;
  const morph = k < 5 ? 0 : s(5, 7.2);
  const crisp = k < 7.3 ? 0 : k < 8 ? s(7.3, 8) : k < 9.6 ? 1 : 1 - s(9.6, 10.2);
  return { assemble, morph, scan, boxes, crisp };
}

function InkHero({ ready = true, onPhase }) {
  const mountRef = useRef(null);
  const recordRef = useRef(null);
  const [lines, setLines] = useState([]);
  const [seal, setSeal] = useState("");

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
      return undefined;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setClearColor(0x000000, 0);
    mount.prepend(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -100, 100);
    const group = new THREE.Group();
    scene.add(group);

    let points, geo, boxLines, scanLine, scanGlow, cardH, cardW, n, mobile;
    let image = null;
    let current = 0; // index into heroSpecimens
    let hasRecord = false;
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
      uFade: { value: 0 },
      uIvory: { value: IVORY },
      uSeal: { value: SEAL },
    };
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    // Draw specimen `current` into the particle targets, the scan boxes and the crisp record layer.
    function loadSpecimen() {
      const spec = heroSpecimens[current];
      const { before, after } = specimenDrawers(spec);
      const ctx = { mobile, image };
      const recLines = spec.record ? (mobile && spec.recordShort) || spec.record : null;
      hasRecord = Boolean(recLines);
      setLines(recLines || []);
      setSeal(spec.seal || "");

      const rx = inkPoints((g) => before(g, cardW, cardH, spec, ctx), cardW, cardH);
      const rec = inkPoints((g) => after(g, cardW, cardH, spec, ctx, recLines), cardW, cardH);
      geo.setAttribute("position", new THREE.BufferAttribute(fit(rx.pts, n), 3));
      geo.setAttribute("aTo", new THREE.BufferAttribute(fit(rec.pts, n), 3));

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

      if (record && recLines) {
        record.style.setProperty("--lh", `${rec.meta.lh}px`);
        record.style.setProperty("--fs", `${rec.meta.size}px`);
      }
    }

    function build() {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h) return;
      mobile = w < 760;
      // on phones the record must also fit the framed box's height
      cardW = Math.round(Math.min(mobile ? Math.min(w * 0.88, (h * 0.86) / 0.62) : w * 0.34, 560));
      cardH = Math.round(cardW * (mobile ? 0.62 : 0.7));
      n = mobile ? 15000 : 26000;
      uniforms.uSize.value = (mobile ? 1.25 : 1.4) * renderer.getPixelRatio();
      const gx = mobile ? 0 : w * 0.245;
      // on phones the canvas is its own framed box below the copy, so the specimen sits centred in it;
      // on desktop it sits high and right, clear of the one-line name along the bottom
      const gy = mobile ? 0 : h * 0.2;

      if (points) {
        group.remove(points);
        points.geometry.dispose();
      }
      geo = new THREE.BufferGeometry();
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
      points = new THREE.Points(geo, material);
      group.add(points);

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

      // crisp record layer sits exactly over the particle card
      if (record) {
        record.style.left = `${w / 2 + gx - cardW / 2}px`;
        record.style.top = `${h / 2 - gy - cardH / 2}px`;
        record.style.width = `${cardW}px`;
        record.style.height = `${cardH}px`;
      }
      loadSpecimen();
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
    let cycle = 0;

    const clamp01 = (v) => Math.min(1, Math.max(0, v));
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden || !points) return;
      uniforms.uTime.value += clock.getDelta();
      if (reduced) {
        if (record) {
          record.style.opacity = hasRecord ? 1 : 0;
          record.classList.add("is-sealed");
        }
        if (onPhase) onPhase(2, current);
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

      // desktop opening: 0–1.3 s ink gathers into the name · the crisp name resolves · 2.1 s it flows on
      const base = inkName ? 2.1 : 0;
      if (inkName) {
        uniforms.uName.value = t < base + 1.7 ? clamp01(t / 1.3) : 0;
        if (t > 1.35 && !nameShown) {
          nameShown = true;
          const nameEl = mount.parentElement.querySelector(".lx-hero-name");
          if (nameEl) nameEl.classList.add("is-shown");
        }
        // once the ink has left the name, later cycles must not inherit its dimming
        uniforms.uNameCrisp.value = t < base + 1.7 ? clamp01((t - 1.35) / 0.9) : 0;
      }
      const ct = Math.max(0, t - base);
      const c = Math.floor(ct / CYCLE);
      if (c !== cycle) {
        // the ink is fully dispersed here, so the next specimen can be drawn without a visible jump
        cycle = c;
        current = c % heroSpecimens.length;
        uniforms.uMorph.value = 0;
        loadSpecimen();
      }
      const tl = timeline(ct - c * CYCLE);
      uniforms.uAssemble.value = tl.assemble;
      uniforms.uMorph.value = tl.morph;
      uniforms.uFade.value = hasRecord ? tl.crisp : 0;
      const scanY = tl.scan < 0 ? -9999 : cardH / 2 - tl.scan * cardH;
      uniforms.uScan.value = scanY;
      scanLine.position.y = scanY;
      scanGlow.position.y = scanY;
      scanLine.material.opacity = tl.scan < 0 ? 0 : 0.95;
      scanGlow.material.opacity = tl.scan < 0 ? 0 : 0.12;
      boxLines.material.opacity = tl.boxes * 0.85;
      if (record) {
        record.style.opacity = hasRecord ? tl.crisp : 0;
        record.classList.toggle("is-sealed", tl.crisp > 0.6);
      }
      const phase = tl.morph > 0.5 ? 2 : tl.scan >= 0 ? 1 : 0;
      const key = `${current}:${phase}`;
      if (key !== lastPhase && onPhase) {
        lastPhase = key;
        onPhase(phase, current);
      }
      renderer.render(scene, camera);
    };

    // Never sample fallback glyphs or a half-loaded photo: wait for every face and image drawn with.
    const fonts = document.fonts
      ? Promise.all([
          document.fonts.load(`40px ${HAND}`),
          document.fonts.load(`500 20px ${MONO}`),
          document.fonts.load(`italic 400 40px "Bodoni Moda Variable"`),
          document.fonts.load(`500 40px "Bodoni Moda Variable"`),
        ]).catch(() => null)
      : Promise.resolve();
    const photo = new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = portrait;
    });
    Promise.all([fonts, photo]).then(([, img]) => {
      if (disposed) return;
      image = img;
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
      if (points) points.geometry.dispose();
      material.dispose();
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
        {seal && (
          <svg className="lx-seal" viewBox="0 0 120 120" role="presentation">
            <defs>
              <path id="lx-seal-ring" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
            </defs>
            <circle cx="60" cy="60" r="56" className="lx-seal-disc" />
            <circle cx="60" cy="60" r="50" className="lx-seal-rule" />
            <circle cx="60" cy="60" r="31" className="lx-seal-rule" />
            <text className="lx-seal-ring">
              <textPath href="#lx-seal-ring">{seal}</textPath>
            </text>
            <text x="60" y="70" textAnchor="middle" className="lx-seal-mono">
              SK
            </text>
          </svg>
        )}
      </div>
    </div>
  );
}

export default InkHero;
