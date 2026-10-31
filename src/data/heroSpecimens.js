// The home hero cycles through these, in order: each one is a project's messy input turning into
// the result it can prove. To feature a new project, add an entry; to retire one, delete it.
//
// kind:
//   "prescription" · "mask" · "photo"  custom drawings for those projects
//   "structured"                       the template any project can use with no new code:
//                                      `input` lines (raw, messy) become `record` lines (structured)
//
// record / recordShort: the structured result, shown as crisp type once the ink settles
//                       (recordShort is used on phones; keep lines short).
// seal:  optional ring text for the wax seal that stamps the result.
// note:  how to read the sample, shown in the caption. Everything drawn is synthetic or illustrative.

export const heroSpecimens = [
  {
    slug: "amrip-india",
    name: "AMRIP-India",
    line: "My capstone turns a photographed prescription into a record a hospital system can trust.",
    kind: "prescription",
    phases: ["Handwritten prescription", "Reading every field", "Verified FHIR record"],
    record: [
      "{",
      '  "resourceType": "MedicationRequest",',
      '  "subject": "Patient/synthetic-34F",',
      '  "medication": "Paracetamol 650 mg",',
      '  "dosage": "1-0-1 · 5 days",',
      '  "evidence": "ocr span + box matched",',
      '  "status": "verified"',
      "}",
    ],
    recordShort: [
      "{",
      '  "resourceType": "MedicationRequest",',
      '  "medication": "Paracetamol 650 mg",',
      '  "dosage": "1-0-1 · 5 days",',
      '  "status": "verified"',
      "}",
    ],
    seal: "VERIFIED · AMRIP-INDIA · SYNTHETIC ·",
    note: "Synthetic sample.",
  },
  {
    slug: "masksight",
    name: "MaskSight",
    line: "Learns what a good part looks like, then masks any defect without ever seeing a defect label.",
    kind: "mask",
    phases: ["Surface under inspection", "Scoring every pixel", "Defect mask, no labels used"],
    note: "Illustration.",
  },
  {
    slug: "clearpixel-ai",
    name: "ClearPixel AI",
    line: "Restores noisy photos on a CPU: 31.2 dB PSNR at 110–140 ms per 1080p frame.",
    kind: "photo",
    phases: ["Noisy photo, σ = 25", "Filtering", "Restored"],
    note: "Illustration.",
  },
  {
    slug: "fraud-detection",
    name: "Fraud Detection",
    line: "Finds the 0.17% of card transactions that are fraud, in 3.8 ms each.",
    kind: "structured",
    phases: ["Raw transactions", "Scoring every row", "Fraud flagged"],
    inputTitle: "transactions.csv",
    input: [
      "txn 40219   INR  1,240   14:02   pos",
      "txn 40220   INR    310   14:02   online",
      "txn 40221   INR 48,900   03:17   card-not-present",
      "txn 40222   INR    760   14:03   pos",
    ],
    record: ["{", '  "txn": 40221,', '  "verdict": "fraud",', '  "model": "XGBoost + SMOTE",', '  "latency": "3.8 ms"', "}"],
    seal: "FLAGGED · FRAUD-DETECTION · SYNTHETIC ·",
    note: "Synthetic sample.",
  },
];
