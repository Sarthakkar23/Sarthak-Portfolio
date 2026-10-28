// Case-study pages at /work/:slug. Facts come from the résumé; "next" lists planned work, not results.
// Diagram stages render left-to-right (top-to-bottom on phones). `loop` draws a return arrow.

export const caseStudies = {
  "amrip-india": {
    name: "AMRIP-India",
    title: "Turning photographed prescriptions into interoperable health records",
    role: "Capstone · team of 2 · in progress",
    stack: ["Python", "LangGraph", "LangChain", "PyTorch", "Transformers", "LoRA / PEFT", "LayoutLMv3", "TrOCR", "FastAPI", "PostgreSQL", "DuckDB", "Splink", "Docker"],
    art: "med",
    problem: [
      "Most Indian prescriptions and lab reports still live on paper — often handwritten — so they never make it into India's digital health stack (ABDM).",
      "Turning a phone photo into a standards-valid FHIR R4 record means solving several hard problems at once: messy layouts, handwriting, drug names a general OCR model has never seen, clinical terminology mapping, and an LLM that must never invent a field.",
      "And because this is patient data, it has to run locally and stay private under India's DPDP Act.",
    ],
    approach: [
      ["A pipeline, not one model", "A multi-stage pipeline — document classification, layout-aware OCR, handwriting recognition, clinical NER, SNOMED CT / LOINC mapping — with an LLM only at the end to structure everything into FHIR R4."],
      ["LangGraph state graph", "Printed and handwritten pages take different branches. State is checkpointed in Postgres after every step, so every record carries a full audit trail."],
      ["A verifier the LLM can't talk past", "Any field the LLM produces is rejected unless it traces back to an OCR span and bounding box in the original photo. Rejected fields go back to the LLM for up to two repair rounds."],
      ["Humans for the hard cases", "Anything still wrong pauses the graph with interrupt() until a reviewer fixes it — the pipeline never silently guesses."],
      ["Small models, tuned", "Qwen2.5 / Llama 3.2 (3B or smaller) fine-tuned with LoRA in 4-bit to emit valid FHIR JSON. TrOCR decoding is constrained to 2.5 lakh Indian medicine brands so handwritten drug names come out right."],
      ["Same patient, different spellings", "Patient records are matched across spelling variants of Indian names with Splink (Fellegi–Sunter) on DuckDB."],
    ],
    diagram: {
      caption: "How a photo becomes a FHIR record",
      stages: [
        { label: "Phone photo", detail: "Prescription or lab report", kind: "io" },
        { label: "Classify", detail: "Document type · printed vs handwritten" },
        { label: "OCR", detail: "LayoutLMv3 (printed) · TrOCR + 2.5L drug lexicon (handwritten)" },
        { label: "Clinical NER", detail: "Drugs, doses, tests, values" },
        { label: "Code mapping", detail: "SNOMED CT · LOINC" },
        { label: "LLM structuring", detail: "LoRA-tuned ≤3B model, 4-bit → FHIR JSON", kind: "accent" },
        { label: "Verifier", detail: "Every field must trace to an OCR span + box", kind: "accent", loop: "Repair ≤ 2 rounds" },
        { label: "Human review", detail: "interrupt() for anything still failing" },
        { label: "FHIR R4 record", detail: "ABDM-compliant · Postgres audit trail", kind: "io" },
      ],
    },
    results: {
      metrics: [
        ["Multi-stage", "OCR → NER → LLM pipeline"],
        ["2.5 lakh", "medicine brands in the TrOCR lexicon"],
        ["4-bit", "LoRA on ≤3B open models"],
        ["Local-first", "patient data never leaves the machine"],
      ],
      notes: [
        "Work in progress. The main experiment compares three settings — verifier off, verifier on, and verifier on with the repair loop — to measure how much grounding and repair reduce wrong fields.",
      ],
    },
    next: [
      "Report field-level precision/recall for each of the three verifier settings on a held-out set of real prescriptions.",
      "Measure where errors enter the pipeline (OCR vs NER vs mapping vs LLM) to decide which stage to improve next.",
      "Package the pipeline as a self-hostable service clinics could run on their own hardware.",
    ],
  },

  cloudoptima: {
    name: "CloudOptima",
    title: "Cheaper, greener cloud scheduling with deep reinforcement learning",
    role: "Minor project · team of 2 · published as an SSRN preprint",
    stack: ["Python", "PyTorch (DQN)", "XGBoost", "Random Forest", "Optuna", "Isolation Forest", "SHAP", "LIME", "Streamlit", "Plotly"],
    art: "cloud",
    paper: "https://papers.ssrn.com/abstract=6957438",
    problem: [
      "Reactive auto-scaling waits for load to spike before adding capacity, so clusters are either over-provisioned (wasted money and CO₂) or late (degraded service).",
      "Operators also need to trust an automated scheduler — a black box that moves workloads around is hard to sign off on.",
    ],
    approach: [
      ["Forecast before you scale", "Predicted CPU and RAM demand from PlanetLab traces with XGBoost and Random Forest, using lag and rolling-window features built from the raw logs and tuned with Optuna."],
      ["Learn where each task should run", "A Deep Q-Network in PyTorch decides which VM each task goes to, with a reward that balances cost, efficiency and packing."],
      ["Fail over automatically", "A failover engine spots failing VMs with Isolation Forest and Z-score checks and moves their work elsewhere."],
      ["Explain every decision", "A Streamlit dashboard shows SHAP and LIME explanations for each scaling decision, so people without an ML background can follow why the system acted."],
    ],
    diagram: {
      caption: "The CloudOptima control loop",
      stages: [
        { label: "Workload traces", detail: "PlanetLab CPU / RAM logs", kind: "io" },
        { label: "Feature engineering", detail: "Lag + rolling-window features" },
        { label: "Demand forecast", detail: "XGBoost / Random Forest, Optuna-tuned" },
        { label: "DQN scheduler", detail: "Picks the VM for every task", kind: "accent", loop: "Reward: cost · efficiency · packing" },
        { label: "Failover engine", detail: "Isolation Forest + Z-score" },
        { label: "Explainability", detail: "SHAP + LIME per decision" },
        { label: "Ops dashboard", detail: "Streamlit + Plotly", kind: "io" },
      ],
    },
    results: {
      metrics: [
        ["−34%", "simulated compute cost vs. reactive auto-scaling"],
        ["−38%", "simulated CO₂"],
        ["0.89 / 0.84", "R² for CPU / RAM forecasts (MAE 6.2%)"],
        ["99.2%", "simulated availability · 98% failed tasks recovered"],
      ],
      notes: ["Results are from simulation on PlanetLab traces, as reported in the SSRN preprint."],
    },
    next: [
      "Validate on a second public trace (e.g. a modern container-cluster dataset) to test how well the policy generalises.",
      "Compare the DQN against a strong heuristic bin-packing baseline and a policy-gradient method.",
      "Run a small live deployment on cloud VMs to check the simulated savings hold up.",
    ],
  },

  "clearpixel-ai": {
    name: "ClearPixel AI",
    title: "Real-time image restoration on a CPU",
    role: "Personal project",
    stack: ["Python", "OpenCV", "NumPy", "Flask", "HED", "DeOldify"],
    art: "pixel",
    problem: [
      "Old and noisy photos need denoising, sharpening and colourisation — but deep models are slow without a GPU, and a plain blur destroys detail.",
    ],
    approach: [
      ["Tune the classics first", "A tuned mix of CLAHE, median filtering and OpenCV denoising beat a plain Gaussian blur by more than 4 dB PSNR."],
      ["Vectorise everything", "NumPy / OpenCV code vectorised so classical filters run in real time on a CPU."],
      ["Deep models where they matter", "HED edge detection and DeOldify colourisation for the tasks classical filters can't do."],
      ["One API", "Restoration, edges and colourisation all sit behind a single Flask API."],
    ],
    diagram: {
      caption: "The restoration pipeline",
      stages: [
        { label: "Input image", detail: "Noisy / faded photo", kind: "io" },
        { label: "Contrast", detail: "CLAHE" },
        { label: "Denoise", detail: "Median + OpenCV denoising", kind: "accent" },
        { label: "Edges", detail: "HED edge detection" },
        { label: "Colourise", detail: "DeOldify" },
        { label: "Flask API", detail: "One endpoint per task", kind: "io" },
      ],
    },
    results: {
      metrics: [
        ["31.2 dB", "PSNR on Set14 at σ=25"],
        ["0.914", "SSIM"],
        ["+4.1 dB", "over a plain Gaussian blur (27.1 dB)"],
        ["110–140 ms", "per 1080p frame · HED < 2 s on CPU"],
      ],
      notes: [],
    },
    next: [
      "Benchmark against a lightweight learned denoiser (e.g. a small U-Net) to find where classical filters stop being competitive.",
      "Add a browser demo so visitors can try it on their own photos.",
    ],
  },

  "fraud-detection": {
    name: "Fraud Detection",
    title: "Catching the 0.17%: fraud detection on highly imbalanced data",
    role: "Personal project",
    stack: ["Python", "XGBoost", "scikit-learn", "SMOTE", "pandas"],
    art: "fraud",
    problem: [
      "In 284,807 card transactions only 0.17% are fraud. A model that predicts 'not fraud' every time is 99.8% accurate — and useless.",
      "The model also has to be fast enough to sit inside a live payment check.",
    ],
    approach: [
      ["Measure the right thing", "Optimised for fraud-class F1, precision and recall instead of accuracy."],
      ["Compare honestly", "Benchmarked logistic regression, SVM, Random Forest and XGBoost on the same split."],
      ["Fix the imbalance", "Tuned XGBoost with SMOTE oversampling and class weights."],
      ["Check latency", "Measured inference time per transaction on CPU on a 56,962-transaction holdout."],
    ],
    diagram: {
      caption: "From raw transactions to a live-ready model",
      stages: [
        { label: "Transactions", detail: "284,807 · 0.17% fraud", kind: "io" },
        { label: "Rebalance", detail: "SMOTE + class weights" },
        { label: "Model bake-off", detail: "LR · SVM · RF · XGBoost" },
        { label: "Tuned XGBoost", detail: "Optimised for fraud-class F1", kind: "accent" },
        { label: "Holdout check", detail: "56,962 transactions", kind: "io" },
      ],
    },
    results: {
      metrics: [
        ["0.83", "fraud-class F1 (from 0.68 baseline)"],
        ["86.4%", "precision"],
        ["79.8%", "recall"],
        ["3.8 ms", "per transaction on CPU"],
      ],
      notes: [],
    },
    next: [
      "Pick the decision threshold from a cost model (cost of a missed fraud vs. a blocked customer) instead of maximising F1.",
      "Add SHAP explanations so analysts can see why a transaction was flagged.",
    ],
  },
};

export const caseStudyOrder = ["amrip-india", "cloudoptima", "clearpixel-ai", "fraud-detection"];
