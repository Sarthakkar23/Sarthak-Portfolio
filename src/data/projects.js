// Hand-written details for projects you want to present carefully.
// Any other public repo on GitHub shows up automatically (see useGithubProjects),
// using its GitHub description, topics, language and homepage.
//
// To feature a repo here, add an entry whose `repo` matches the GitHub repo name.
// Projects without a public repo (repo: null) are always shown.

export const curatedProjects = [
  {
    repo: null,
    name: "AMRIP-India",
    subtitle: "AI-Centric Medical Record Interoperability Platform",
    badge: "Capstone · In progress",
    summary:
      "LLM pipeline that turns phone photos of Indian prescriptions and lab reports into ABDM-compliant FHIR R4 health records — with a verifier that rejects any field it can't trace back to the source image.",
    tags: ["LangGraph", "LoRA / PEFT", "LayoutLMv3", "TrOCR", "FastAPI", "PostgreSQL"],
    metrics: [
      ["9-stage", "OCR → NER → LLM pipeline"],
      ["2.5 lakh", "drug names for TrOCR"],
      ["4-bit", "LoRA on ≤3B LLMs"],
    ],
    category: "LLMs",
    art: "med",
  },
  {
    repo: "Cloud-Resource-Optimizer",
    name: "CloudOptima",
    subtitle: "Multi-Cloud Resource Orchestrator",
    badge: "Published · SSRN preprint",
    summary:
      "Deep Q-Network that decides which VM each task runs on, plus workload forecasting, anomaly-based failover and SHAP/LIME explanations for every scaling decision.",
    tags: ["PyTorch DQN", "XGBoost", "Optuna", "SHAP", "LIME", "Streamlit"],
    metrics: [
      ["−34%", "compute cost vs. reactive scaling"],
      ["0.89 R²", "CPU demand forecast"],
      ["99.2%", "simulated availability"],
    ],
    category: "ML Systems",
    art: "cloud",
  },
  {
    repo: "Clear-Pixel-AI",
    name: "ClearPixel AI",
    subtitle: "Digital Image Restoration Suite",
    badge: "Computer Vision",
    summary:
      "Restoration, HED edge detection and DeOldify colourisation behind one Flask API — vectorised to run in real time on CPU.",
    tags: ["OpenCV", "Flask", "NumPy", "DeOldify", "HED"],
    metrics: [
      ["31.2 dB", "PSNR on Set14 (σ=25)"],
      ["0.914", "SSIM"],
      ["110–140 ms", "per 1080p frame"],
    ],
    category: "Vision",
    art: "pixel",
  },
  {
    repo: null,
    name: "Fraud Detection",
    subtitle: "Credit Card Fraud Detection",
    badge: "Imbalanced ML",
    summary:
      "Tuned XGBoost with SMOTE and class weights on 284,807 transactions where only 0.17% are fraud — fast enough for a live payment check.",
    tags: ["XGBoost", "scikit-learn", "SMOTE", "pandas"],
    metrics: [
      ["0.83 F1", "up from 0.68 baseline"],
      ["86.4%", "precision"],
      ["3.8 ms", "per transaction"],
    ],
    category: "ML Systems",
    art: "fraud",
  },
];

// Repos that should never appear on the site.
export const hiddenRepos = ["Sarthak-Portfolio"];
