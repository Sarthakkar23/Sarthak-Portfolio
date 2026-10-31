// Everything on the About page comes from here. Keep it in sync with the resume PDF.

export const profile = {
  name: "Sarthak Kar",
  location: "Chennai, India",
  email: "sarthakkar05@gmail.com",
  summary:
    "Final-year B.Tech Computer Science student specialising in AI/ML, currently building a LoRA-tuned LLM pipeline that converts photographed Indian prescriptions into standards-validated FHIR health records. I've shipped projects in deep reinforcement learning, imbalanced classification and computer vision, and co-authored an SSRN preprint on multi-cloud resource optimisation. Seeking applied AI/ML engineering roles.",
};

export const facts = [
  ["Based in", "Chennai, India"],
  ["Studying", "B.Tech CSE · AI & ML"],
  ["University", "SRMIST, Kattankulathur"],
  ["Graduating", "May 2027"],
  ["Building", "AMRIP-India (capstone)"],
  ["Status", "Open to AI/ML roles"],
];

export const education = {
  school: "SRM Institute of Science and Technology, Kattankulathur",
  degree: "B.Tech, Computer Science & Engineering",
  spec: "Specialisation: Artificial Intelligence and Machine Learning",
  where: "Chennai, India",
  when: "2023 – May 2027",
};

export const skills = [
  ["Languages", ["Python", "SQL", "Java", "C/C++", "JavaScript", "HTML/CSS"]],
  ["ML & Deep Learning", ["PyTorch", "scikit-learn", "XGBoost", "LightGBM", "Deep Q-Networks", "Optuna", "SMOTE / imbalanced-learn"]],
  ["NLP & LLMs", ["LangGraph", "LangChain", "Hugging Face Transformers", "LoRA / PEFT", "4-bit quantisation", "Qwen2.5", "Llama 3.2", "MuRIL / IndicBERT", "SapBERT", "Clinical NER"]],
  ["Vision & OCR", ["OpenCV", "LayoutLMv3", "TrOCR", "Donut", "PaddleOCR", "HED", "DeOldify", "Pillow"]],
  ["Data & XAI", ["pandas", "NumPy", "PostgreSQL", "DuckDB", "Splink", "SHAP", "LIME", "Isolation Forest", "Label Studio"]],
  ["Cloud & Serving", ["AWS (EC2, S3, VPC)", "FastAPI", "Flask", "Docker", "Streamlit", "React", "Git", "Weights & Biases", "MLflow", "Plotly", "Matplotlib", "seaborn"]],
];

export const projects = [
  {
    name: "AMRIP-India",
    title: "AI-Centric Medical Record Interoperability Platform",
    kind: "Capstone (team of 2), in progress",
    stack: "Python, LangGraph, LangChain, PyTorch, Hugging Face Transformers, LoRA / PEFT, LayoutLMv3, TrOCR, FastAPI, PostgreSQL, Docker",
    points: [
      "A 9-stage pipeline that takes phone photos of Indian prescriptions and lab reports and outputs ABDM-compliant FHIR R4 records: document classification, layout-aware OCR, handwriting recognition, clinical NER, SNOMED CT / LOINC mapping, then an LLM to structure it all.",
      "Built as a LangGraph state graph. Printed and handwritten pages take different branches, a verifier node sends rejected fields back to the LLM for up to two repair rounds, and anything still wrong pauses the graph with interrupt() until a reviewer fixes it. State is checkpointed in Postgres after every step, so each record has a full audit trail.",
      "A verifier rejects any field the LLM produces unless it traces back to an OCR span and bounding box in the photo; the main experiment compares the verifier off, on, and on with the repair loop.",
      "Fine-tuning Qwen2.5 / Llama 3.2 (3B or smaller) with LoRA in 4-bit to output valid FHIR JSON. TrOCR decoding is restricted to a list of 2.5 lakh Indian medicine brands so it reads handwritten drug names correctly.",
      "Matches the same patient across different spellings of Indian names using Splink (Fellegi–Sunter) on DuckDB. Served with FastAPI and PostgreSQL, and everything runs locally so patient data stays private under the DPDP Act.",
    ],
  },
  {
    name: "CloudOptima",
    title: "Multi-Cloud Resource Orchestrator",
    kind: "Minor project (team of 2) · published as an SSRN preprint",
    stack: "Python, PyTorch (DQN), XGBoost, Optuna, SHAP, LIME, Streamlit, Plotly",
    link: "https://github.com/Sarthakkar23/Cloud-Resource-Optimizer",
    points: [
      "Cut simulated compute cost by 34% and CO₂ by 38% compared with reactive auto-scaling, using a Deep Q-Network in PyTorch that decides which VM each task goes to, with a reward balancing cost, efficiency and packing.",
      "Predicted CPU and RAM demand with R² of 0.89 and 0.84 (MAE 6.2%) on PlanetLab traces. Built lag and rolling-window features from the raw logs and tuned XGBoost and Random Forest with Optuna.",
      "Kept simulated availability at 99.2% and recovered 98% of failed tasks automatically, with a failover engine that spots failing VMs using Isolation Forest and Z-score checks and moves their work elsewhere.",
      "Built a Streamlit dashboard that shows SHAP and LIME explanations for every scaling decision, so people without an ML background can follow why the system acted.",
    ],
  },
  {
    name: "ClearPixel AI",
    title: "Digital Image Restoration Suite",
    kind: "Personal project",
    stack: "Python, OpenCV, Flask, NumPy",
    link: "https://github.com/Sarthakkar23/Clear-Pixel-AI",
    points: [
      "Got 31.2 dB PSNR / 0.914 SSIM on Set14 at noise σ=25, against 27.1 dB for a plain Gaussian blur, by tuning a mix of CLAHE, median filtering and OpenCV denoising.",
      "Classical filters run in 110–140 ms per 1080p frame and HED edge detection in under 2 s on CPU after vectorising the NumPy / OpenCV code. Restoration, edges and DeOldify colourisation all sit behind one Flask API.",
    ],
  },
  {
    name: "Fraud Detection",
    title: "Credit Card Fraud Detection",
    kind: "Personal project",
    stack: "Python, XGBoost, scikit-learn, SMOTE, pandas",
    points: [
      "Raised fraud-class F1 from 0.68 (logistic regression) to 0.83 with 86.4% precision and 79.8% recall on 284,807 transactions where only 0.17% are fraud. Compared LR, SVM, Random Forest and XGBoost, then tuned XGBoost with SMOTE and class weights.",
      "Inference takes 3.8 ms per transaction on CPU, measured on a 56,962-transaction holdout, which is fast enough for a live payment check.",
    ],
  },
];

export const publication = {
  cite: "Sahoo, A. A., & Kar, S. (2026).",
  title: "Cloud Computing Resource Optimizer.",
  venue: "SSRN preprint, 7 pp. Posted 15 Jul 2026.",
  link: "https://papers.ssrn.com/abstract=6957438",
};

export const experience = [
  {
    role: "Cloud Computing Intern",
    org: "Central Tool Room & Training Centre (CTTC)",
    where: "Bhubaneswar, India",
    when: "Dec 2025 – Jan 2026",
    body: "Completed a hands-on AWS cloud computing programme covering EC2 compute, S3 storage, VPC networking and load balancing, working directly on CTTC's server infrastructure.",
  },
];

export const leadership = [
  {
    role: "Committee Head, Sponsorship",
    org: "Directorate of Student Affairs, SRMIST",
    when: "Sep 2024 – present · Committee Member, Dec 2023 – Sep 2024",
    body: "Run sponsorship and logistics for Milan, SRMIST's national cultural festival, drawing 60,000+ participants from 350 colleges. Brought in AJIO as a sponsor for ₹2 lakh in coupons in exchange for on-ground branding, and sold vendor stalls that generated ₹1.2 lakh in revenue.",
  },
  {
    role: "Lead, Sponsorship",
    org: "TEDxSRMIST",
    when: "Jul 2025 – present · Lead Associate, Sep 2023 – Jul 2025",
    body: "Own sponsorship outreach and speaker acquisition for a five-speaker annual edition. Brought one of the event's speakers on board and secured a ₹50,000 sponsorship from a local gym.",
  },
];

export const certifications = [
  "Cloud Computing — Central Tool Room & Training Centre (CTTC), Jan 2026",
  "JPMorgan Chase & Co. Virtual Job Simulation — Forage",
];

export const timeline = [
  ["2023", "Started B.Tech CSE (AI & ML) at SRMIST"],
  ["Sep 2023", "Joined TEDxSRMIST as Lead Associate, Sponsorship"],
  ["Dec 2023", "Joined the Directorate of Student Affairs sponsorship committee"],
  ["Sep 2024", "Became Committee Head, Sponsorship — Milan festival"],
  ["Jul 2025", "Promoted to Lead, Sponsorship at TEDxSRMIST"],
  ["Dec 2025", "Cloud Computing Intern at CTTC, Bhubaneswar"],
  ["Jul 2026", "Co-authored SSRN preprint on cloud resource optimisation"],
  ["Now", "Building AMRIP-India, an LLM pipeline for health records"],
  ["May 2027", "Graduating — ready for applied AI/ML roles"],
];

// The "Now" line on the home page. Edit this whenever your focus changes.
export const now = {
  text: "Building AMRIP-India, my capstone: an LLM pipeline that turns photographed prescriptions into verified FHIR health records.",
  link: "/work/amrip-india",
  updated: "Nov 2026",
};
