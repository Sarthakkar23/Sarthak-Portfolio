// Drawings for the hero's specimens. Each kind draws a "before" (the messy input, with boxes for the
// scan to lock onto) and an "after" (the result) onto a w × h card; the hero samples the white ink of
// each into particles and morphs one into the other. Everything drawn is synthetic or illustrative.

export const HAND = '"Homemade Apple", cursive';
export const MONO = '"Hanken Grotesk Variable", system-ui, sans-serif';

const RX_LINES = [
  { text: "Tab. Paracetamol 650 mg", note: "1-0-1  x  5 days" },
  { text: "Cap. Amoxicillin 500 mg", note: "1-1-1  x  7 days" },
  { text: "Syp. Ambroxol 10 ml", note: "TDS after food" },
];

function frame(g, w, h, label) {
  g.lineWidth = 1.5;
  g.strokeRect(6, 6, w - 12, h - 12);
  g.font = `500 ${h * 0.042}px ${MONO}`;
  g.fillText(label, 26, h * 0.12);
  g.fillRect(26, h * 0.17, w - 52, 1);
}

// Lines of type fitted to the card width, one per row. Shared by every structured result.
export function drawRecord(g, w, h, lines) {
  const lh = h / (lines.length + 1.2);
  let size = lh * 0.6;
  g.font = `500 ${size}px ${MONO}`;
  const widest = Math.max(...lines.map((l) => g.measureText(l).width));
  if (widest > w - 28) size *= (w - 28) / widest;
  g.font = `500 ${size}px ${MONO}`;
  lines.forEach((l, i) => g.fillText(l, 14, lh * (i + 1.25)));
  return { lh, size };
}

/* ---------- AMRIP-India: handwritten prescription ---------- */
function prescription(g, w, h) {
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

/* ---------- Template: raw rows become a structured record ---------- */
function structuredInput(g, w, h, spec) {
  frame(g, w, h, `${(spec.inputTitle || "input").toUpperCase()}  ·  SYNTHETIC`);
  const rows = spec.input || [];
  const top = h * 0.3;
  const lh = (h * 0.62) / Math.max(rows.length, 1);
  let size = Math.min(lh * 0.42, h * 0.06);
  g.font = `400 ${size}px ${MONO}`;
  const widest = Math.max(...rows.map((r) => g.measureText(r).width), 1);
  if (widest > w - 64) size *= (w - 64) / widest;
  g.font = `400 ${size}px ${MONO}`;
  const boxes = [];
  rows.forEach((r, i) => {
    const y = top + lh * i + lh * 0.55;
    g.fillText(r, 32, y);
    boxes.push({ x: 22, y: y - lh * 0.62, w: w - 44, h: lh * 0.86 });
  });
  return { boxes };
}

/* ---------- MaskSight: a cracked surface becomes its defect mask ---------- */
const CRACK = [
  [0.34, 0.4],
  [0.42, 0.47],
  [0.47, 0.55],
  [0.55, 0.62],
  [0.6, 0.71],
  [0.63, 0.8],
];
function weave(g, w, h, width) {
  g.save();
  g.beginPath();
  g.rect(20, h * 0.22, w - 40, h * 0.7);
  g.clip();
  g.lineWidth = width;
  for (let x = -h; x < w + h; x += 26) {
    g.beginPath();
    g.moveTo(x, h);
    g.lineTo(x + h * 0.8, 0);
    g.stroke();
  }
  g.restore();
}
function maskBefore(g, w, h) {
  frame(g, w, h, "SURFACE UNDER INSPECTION  ·  SYNTHETIC");
  weave(g, w, h, 0.7);
  g.lineWidth = 3.2;
  g.lineCap = "round";
  g.beginPath();
  CRACK.forEach(([x, y], i) => (i ? g.lineTo(x * w, y * h) : g.moveTo(x * w, y * h)));
  g.stroke();
  g.lineWidth = 1.6;
  g.beginPath();
  g.moveTo(0.47 * w, 0.55 * h);
  g.lineTo(0.43 * w, 0.62 * h);
  g.stroke();
  return { boxes: [{ x: w * 0.28, y: h * 0.33, w: w * 0.42, h: h * 0.53 }] };
}
function maskAfter(g, w, h) {
  frame(g, w, h, "DEFECT MASK  ·  NO LABELS USED");
  weave(g, w, h, 0.5);
  g.beginPath();
  g.ellipse(0.485 * w, 0.6 * h, 0.2 * w, 0.075 * w, Math.atan2(0.4 * h, 0.29 * w), 0, Math.PI * 2);
  g.fill();
  return {};
}

/* ---------- ClearPixel AI: a noisy photo is restored ---------- */
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
function dithered(image, s, noise) {
  const c = document.createElement("canvas");
  c.width = s;
  c.height = s;
  const g = c.getContext("2d");
  // centre-crop, biased up so the face sits in frame
  const side = Math.min(image.width, image.height);
  g.drawImage(image, (image.width - side) / 2, (image.height - side) * 0.22, side, side, 0, 0, s, s);
  const d = g.getImageData(0, 0, s, s);
  for (let y = 0; y < s; y++) {
    for (let x = 0; x < s; x++) {
      const i = (y * s + x) * 4;
      let lum = (d.data[i] * 0.3 + d.data[i + 1] * 0.59 + d.data[i + 2] * 0.11) / 255;
      if (noise) lum += (Math.random() - 0.5) * 0.9;
      const on = lum > (BAYER[(y % 4) * 4 + (x % 4)] + 0.5) / 16;
      d.data[i] = d.data[i + 1] = d.data[i + 2] = on ? 255 : 0;
      d.data[i + 3] = 255;
    }
  }
  g.putImageData(d, 0, 0);
  return c;
}
function photo(noise) {
  return (g, w, h, spec, ctx) => {
    const s = Math.round(h * 0.78);
    const x = Math.round((w - s) / 2);
    const y = Math.round(h * 0.13);
    g.lineWidth = 1.5;
    g.strokeRect(6, 6, w - 12, h - 12);
    if (ctx.image) {
      g.imageSmoothingEnabled = false;
      g.drawImage(dithered(ctx.image, Math.round(s / 1.5), noise), x, y, s, s);
    }
    g.font = `500 ${h * 0.042}px ${MONO}`;
    g.fillText(noise ? "NOISY  ·  σ = 25" : "RESTORED", 26, h * 0.12);
    return noise
      ? { boxes: [0, 1, 2].map((k) => ({ x: x - 8, y: y + (s / 3) * k + 4, w: s + 16, h: s / 3 - 8 })) }
      : {};
  };
}

// before(g, w, h, spec, ctx) → { boxes }   after(g, w, h, spec, ctx, lines) → { lh, size } for records
export function specimenDrawers(spec) {
  const record = (g, w, h, s, ctx, lines) => drawRecord(g, w, h, lines);
  switch (spec.kind) {
    case "prescription":
      return { before: prescription, after: record };
    case "mask":
      return { before: maskBefore, after: maskAfter };
    case "photo":
      return { before: photo(true), after: photo(false) };
    default:
      return { before: structuredInput, after: record };
  }
}
