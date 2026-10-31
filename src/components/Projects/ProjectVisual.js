import React, { useEffect, useRef, useState } from "react";
import portrait from "../../assets/portrait.webp";

// Small, illustrative animations for each highlight project. They dramatise how each system
// works using only facts from the résumé; they are labelled as illustrations, never as outputs.

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Runs `tick` on an interval only while the element is on screen.
function useVisibleInterval(ref, tick, ms) {
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return undefined;
    let id = null;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !id) id = setInterval(tick, ms);
      if (!e.isIntersecting && id) {
        clearInterval(id);
        id = null;
      }
    });
    io.observe(el);
    return () => {
      io.disconnect();
      if (id) clearInterval(id);
    };
  }, [ref, tick, ms]);
}

/* ---------- AMRIP-India: fields boxed one by one, then emitted as structured data ---------- */
const RX = [
  ["Tab. Paracetamol 650 mg", '"medication": "Paracetamol 650 mg"'],
  ["1-0-1  ×  5 days", '"dosage": "1-0-1 · 5 days"'],
  ["Cap. Amoxicillin 500 mg", '"medication": "Amoxicillin 500 mg"'],
];
function AmripVisual() {
  const ref = useRef(null);
  const [step, setStep] = useState(reduced() ? RX.length : 0);
  useVisibleInterval(ref, () => setStep((s) => (s + 1) % (RX.length + 2)), 1100);
  return (
    <div className="pv-amrip" ref={ref}>
      <div className="pv-paper">
        <span className="pv-rx">Rx</span>
        {RX.map(([hand], i) => (
          <p key={hand} className={`pv-hand ${step > i ? "is-boxed" : ""}`}>
            {hand}
          </p>
        ))}
        <span className="pv-paper-note">synthetic sample</span>
      </div>
      <div className="pv-json" aria-hidden="true">
        <span>{"{"}</span>
        {RX.map(([, json], i) => (
          <span key={json} className={step > i ? "is-on" : ""}>
            &nbsp;&nbsp;{json},
          </span>
        ))}
        <span className={step > RX.length ? "is-on is-verified" : ""}>&nbsp;&nbsp;"status": "verified"</span>
        <span>{"}"}</span>
      </div>
    </div>
  );
}

/* ---------- CloudOptima: tasks packed onto VMs; one fails and its work moves ---------- */
const SLOTS = 7;
function CloudVisual() {
  const ref = useRef(null);
  const [load, setLoad] = useState(() => (reduced() ? [5, 4, 6, 3, 5, 4] : [2, 1, 3, 0, 2, 1]));
  const [failing, setFailing] = useState(-1);
  const tickRef = useRef(0);
  useVisibleInterval(
    ref,
    () => {
      tickRef.current += 1;
      const t = tickRef.current;
      setLoad((prev) => {
        const next = [...prev];
        if (t % 9 === 0) {
          // a VM fails: Isolation Forest flags it, its tasks move to the least-loaded healthy VMs
          const v = next.indexOf(Math.max(...next));
          setFailing(v);
          let moving = next[v];
          next[v] = 0;
          while (moving > 0) {
            const healthy = next.map((n, i) => (i === v ? Infinity : n));
            const tgt = healthy.indexOf(Math.min(...healthy));
            if (next[tgt] >= SLOTS) break;
            next[tgt] += 1;
            moving -= 1;
          }
          return next;
        }
        if (t % 9 === 2) setFailing(-1);
        // the scheduler places a new task on the least-loaded VM; finished tasks leave
        if (Math.random() < 0.35) {
          const busy = next.map((n, i) => ({ n, i })).filter((x) => x.n > 0);
          if (busy.length) next[busy[Math.floor(Math.random() * busy.length)].i] -= 1;
        }
        const tgt = next.indexOf(Math.min(...next));
        if (next[tgt] < SLOTS) next[tgt] += 1;
        return next;
      });
    },
    700
  );
  return (
    <div className="pv-cloud" ref={ref}>
      <div className="pv-vms">
        {load.map((n, v) => (
          <div key={v} className={`pv-vm ${failing === v ? "is-failing" : ""}`}>
            {Array.from({ length: SLOTS }).map((_, s) => (
              <span key={s} className={SLOTS - 1 - s < n ? "is-full" : ""} />
            ))}
            <em>VM {v + 1}</em>
          </div>
        ))}
      </div>
      <p className="pv-legend">{failing >= 0 ? `VM ${failing + 1} flagged · work moved` : "Scheduler packing new tasks"}</p>
    </div>
  );
}

/* ---------- ClearPixel AI: before / after slider ---------- */
function PixelVisual() {
  const ref = useRef(null);
  const canvasRef = useRef(null);
  const [pos, setPos] = useState(55);
  const [touched, setTouched] = useState(false);

  // Paint a noisy copy of the image for the "before" side.
  useEffect(() => {
    const img = new Image();
    img.src = portrait;
    img.onload = () => {
      const c = canvasRef.current;
      if (!c) return;
      const w = 360;
      const h = Math.round((img.height / img.width) * w);
      c.width = w;
      c.height = h;
      const g = c.getContext("2d");
      g.filter = "contrast(0.8) brightness(0.92)";
      g.drawImage(img, 0, 0, w, h);
      g.filter = "none";
      const d = g.getImageData(0, 0, w, h);
      for (let i = 0; i < d.data.length; i += 4) {
        const n = (Math.random() - 0.5) * 120;
        d.data[i] += n;
        d.data[i + 1] += n;
        d.data[i + 2] += n;
      }
      g.putImageData(d, 0, 0);
    };
  }, []);

  // A slow sweep until the visitor takes over.
  useVisibleInterval(
    ref,
    () => {
      if (!touched) setPos((p) => 50 + Math.sin(Date.now() / 1400) * 28);
    },
    60
  );

  return (
    <div className="pv-pixel" ref={ref}>
      <img src={portrait} alt="" className="pv-after" />
      <canvas ref={canvasRef} className="pv-before" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} aria-hidden="true" />
      <span className="pv-divider" style={{ left: `${pos}%` }} aria-hidden="true" />
      <span className="pv-tag pv-tag-l">Noisy (σ=25)</span>
      <span className="pv-tag pv-tag-r">Restored</span>
      <input
        type="range"
        min="0"
        max="100"
        value={Math.round(pos)}
        onChange={(e) => {
          setTouched(true);
          setPos(Number(e.target.value));
        }}
        aria-label="Compare noisy and restored image"
        className="pv-range"
      />
    </div>
  );
}

/* ---------- Fraud Detection: a stream where rare fraud is flagged at the model line ---------- */
function FraudVisual() {
  const ref = useRef(null);
  const canvasRef = useRef(null);
  useEffect(() => {
    const c = canvasRef.current;
    const box = ref.current;
    if (!c || !box) return undefined;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const g = c.getContext("2d");
    const lanes = 9;
    const dots = Array.from({ length: 70 }, () => ({
      x: Math.random(),
      lane: Math.floor(Math.random() * lanes),
      v: 0.0012 + Math.random() * 0.0016,
      fraud: Math.random() < 0.045, // enlarged from 0.17% so the eye can find it
    }));
    let raf;
    let visible = true;
    // Paint one frame; `advance` moves the stream. Resizing a canvas wipes it, so every resize
    // repaints immediately — the illustration is never an empty box, on screen or off.
    const paint = (advance) => {
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, w, h);
      const line = w * 0.62;
      g.strokeStyle = "rgba(239,230,216,0.28)";
      g.setLineDash([3, 5]);
      g.beginPath();
      g.moveTo(line, 10);
      g.lineTo(line, h - 10);
      g.stroke();
      g.setLineDash([]);
      dots.forEach((d) => {
        if (advance && !reduced()) d.x += d.v;
        if (d.x > 1.05) {
          d.x = -0.05;
          d.fraud = Math.random() < 0.045;
        }
        const x = d.x * w;
        const y = 18 + (d.lane + 0.5) * ((h - 36) / lanes);
        const caught = d.fraud && x > line;
        g.fillStyle = d.fraud ? (caught ? "#c2414f" : "rgba(239,230,216,0.85)") : "rgba(239,230,216,0.42)";
        g.beginPath();
        g.arc(x, y, d.fraud ? 3.2 : 2.2, 0, Math.PI * 2);
        g.fill();
        if (caught) {
          g.strokeStyle = "#c2414f";
          g.beginPath();
          g.arc(x, y, 9, 0, Math.PI * 2);
          g.stroke();
        }
      });
    };
    const size = () => {
      w = box.clientWidth;
      h = box.clientHeight;
      c.width = w * dpr;
      c.height = h * dpr;
      paint(false);
    };
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (visible) paint(true);
    };
    size();
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(box);
    const ro = new ResizeObserver(size);
    ro.observe(box);
    loop();
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, []);
  return (
    <div className="pv-fraud" ref={ref}>
      <canvas ref={canvasRef} aria-hidden="true" />
      <span className="pv-tag pv-tag-model">model · 3.8 ms</span>
    </div>
  );
}


/* ---------- MaskSight: normal surface → anomaly heatmap → threshold → binary mask ---------- */
const MASK_STEPS = [
  "Surface under inspection",
  "Anomaly heatmap from normal-only training",
  "Keep pixels above max(floor, α · peak)",
  "Binary defect mask, no labels used",
];
function MaskVisual() {
  const ref = useRef(null);
  const [step, setStep] = useState(reduced() ? 3 : 0);
  useVisibleInterval(ref, () => setStep((s) => (s + 1) % MASK_STEPS.length), 1500);
  return (
    <div className={`pv-mask is-step-${step}`} ref={ref}>
      <svg viewBox="0 0 160 110" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <pattern id="pv-weave" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(239,230,216,0.10)" strokeWidth="1.6" />
          </pattern>
          <radialGradient id="pv-heat">
            <stop offset="0" stopColor="#efe6d8" stopOpacity="0.95" />
            <stop offset="0.35" stopColor="#d9727f" stopOpacity="0.85" />
            <stop offset="1" stopColor="#8a1c2b" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="160" height="110" fill="url(#pv-weave)" />
        {/* the defect: a crack across the surface */}
        <path className="pv-crack" d="M58 38 C 66 44, 70 46, 76 52 S 88 62, 94 66 L 99 72" />
        {/* strong response on the crack, weak noise elsewhere that the floor removes */}
        <g className="pv-heat">
          <circle cx="66" cy="44" r="13" />
          <circle cx="78" cy="54" r="16" />
          <circle cx="92" cy="65" r="13" />
        </g>
        <g className="pv-noise">
          <circle cx="26" cy="24" r="9" />
          <circle cx="132" cy="84" r="10" />
          <circle cx="128" cy="22" r="7" />
        </g>
        <path
          className="pv-maskpath"
          d="M55 33 C 64 33, 74 41, 82 47 C 92 54, 101 61, 103 70 C 104 77, 96 78, 90 73 C 82 66, 72 60, 64 53 C 56 47, 48 37, 55 33 Z"
        />
      </svg>
      <span className="pv-tag pv-tag-l pv-mask-step" key={step}>
        {MASK_STEPS[step]}
      </span>
    </div>
  );
}

const VISUALS = { med: AmripVisual, mask: MaskVisual, cloud: CloudVisual, pixel: PixelVisual, fraud: FraudVisual };
const CAPTIONS = {
  mask: "Illustration: a heatmap becomes a mask by thresholding against its own peak. Not MaskSight output.",
  med: "Illustration: each field is located, verified, then written as FHIR.",
  cloud: "Illustration: the scheduler packs tasks; a failing VM is flagged and its work moved.",
  pixel: "Illustration of noise removal; drag to compare. Not actual ClearPixel output.",
  fraud: "Illustration: transactions stream past the model; fraud is enlarged to be visible.",
};

export default function ProjectVisual({ kind }) {
  const V = VISUALS[kind];
  if (!V) return null;
  return (
    <figure className="pv-frame">
      <V />
      <figcaption>{CAPTIONS[kind]}</figcaption>
    </figure>
  );
}
