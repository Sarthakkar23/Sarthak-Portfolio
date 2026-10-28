// Knowledge base for the AI twin (api/chat.js). Keep in sync with the résumé.
module.exports = `# Sarthak Kar — profile (source of truth for the AI twin)

## Summary
Sarthak Kar is a final-year B.Tech Computer Science student specialising in AI/ML, based in Chennai, India. He is currently building a LoRA-tuned LLM pipeline that converts photographed Indian prescriptions into standards-validated FHIR health records. He has shipped projects in deep reinforcement learning, imbalanced classification and computer vision, and co-authored an SSRN preprint on multi-cloud resource optimisation. He is seeking applied AI/ML engineering roles.

## Contact
Email: sarthakkar05@gmail.com. LinkedIn: linkedin.com/in/sarthak-kar-2283692a7. GitHub: github.com/Sarthakkar23. The website has a contact form and a downloadable one-page résumé.

## Education
SRM Institute of Science and Technology (SRMIST), Kattankulathur, Chennai, India. B.Tech, Computer Science & Engineering, specialisation in Artificial Intelligence and Machine Learning. 2023 – May 2027 (graduating May 2027).

## Technical skills
Languages: Python, SQL, Java, C/C++, JavaScript, HTML/CSS.
ML & deep learning: PyTorch, scikit-learn, XGBoost, LightGBM, Deep Q-Networks, Optuna, SMOTE / imbalanced-learn.
NLP & LLMs: LangGraph, LangChain, Hugging Face Transformers, LoRA / PEFT, 4-bit quantisation, Qwen2.5, Llama 3.2, MuRIL / IndicBERT, SapBERT, clinical NER.
Vision & OCR: OpenCV, LayoutLMv3, TrOCR, Donut, PaddleOCR, HED, DeOldify, Pillow.
Data & explainable AI: pandas, NumPy, PostgreSQL, DuckDB, Splink, SHAP, LIME, Isolation Forest, Label Studio.
Cloud & serving: AWS (EC2, S3, VPC), FastAPI, Flask, Docker, Streamlit, React, Git, Weights & Biases, MLflow, Plotly, Matplotlib, seaborn.

## Project: AMRIP-India — AI-Centric Medical Record Interoperability Platform (capstone, team of 2, in progress)
Stack: Python, LangGraph, LangChain, PyTorch, Hugging Face Transformers, LoRA / PEFT, LayoutLMv3, TrOCR, FastAPI, PostgreSQL, Docker.
- A 9-stage pipeline that takes phone photos of Indian prescriptions and lab reports and outputs ABDM-compliant FHIR R4 records: document classification, layout-aware OCR, handwriting recognition, clinical NER, SNOMED CT / LOINC mapping, then an LLM to structure it all.
- Built as a LangGraph state graph. Printed and handwritten pages take different branches; a verifier node sends rejected fields back to the LLM for up to two repair rounds; anything still wrong pauses the graph with interrupt() until a human reviewer fixes it. State is checkpointed in Postgres after every step, so each record has a full audit trail.
- A verifier rejects any field the LLM produces unless it traces back to an OCR span and bounding box in the photo. The main experiment compares the verifier off, on, and on with the repair loop.
- Fine-tuning Qwen2.5 / Llama 3.2 (3B or smaller) with LoRA in 4-bit to output valid FHIR JSON. TrOCR decoding is restricted to a list of 2.5 lakh Indian medicine brands so it reads handwritten drug names correctly.
- Matches the same patient across different spellings of Indian names using Splink (Fellegi–Sunter) on DuckDB. Served with FastAPI and PostgreSQL; everything runs locally so patient data stays private under India's DPDP Act.
- Results are not final yet; the project is in progress.

## Project: CloudOptima — Multi-Cloud Resource Orchestrator (minor project, team of 2, published as an SSRN preprint)
Stack: Python, PyTorch (DQN), XGBoost, Optuna, SHAP, LIME, Streamlit, Plotly. Code: github.com/Sarthakkar23/Cloud-Resource-Optimizer
- Cut simulated compute cost by 34% and CO2 by 38% compared with reactive auto-scaling, using a Deep Q-Network in PyTorch that decides which VM each task goes to, with a reward balancing cost, efficiency and packing.
- Predicted CPU and RAM demand with R² of 0.89 and 0.84 (MAE 6.2%) on PlanetLab traces. Built lag and rolling-window features from raw logs and tuned XGBoost and Random Forest with Optuna.
- Kept simulated availability at 99.2% and recovered 98% of failed tasks automatically, with a failover engine that spots failing VMs using Isolation Forest and Z-score checks and moves their work elsewhere.
- Built a Streamlit dashboard that shows SHAP and LIME explanations for every scaling decision, so people without an ML background can follow why the system acted.

## Project: ClearPixel AI — Digital Image Restoration Suite (personal project)
Stack: Python, OpenCV, Flask, NumPy. Code: github.com/Sarthakkar23/Clear-Pixel-AI
- 31.2 dB PSNR / 0.914 SSIM on Set14 at noise sigma=25, against 27.1 dB for a plain Gaussian blur, by tuning a mix of CLAHE, median filtering and OpenCV denoising.
- Classical filters run in 110–140 ms per 1080p frame and HED edge detection in under 2 s on CPU after vectorising the NumPy / OpenCV code. Restoration, edges and DeOldify colourisation sit behind one Flask API.

## Project: Credit Card Fraud Detection (personal project)
Stack: Python, XGBoost, scikit-learn, SMOTE, pandas.
- Raised fraud-class F1 from 0.68 (logistic regression) to 0.83 with 86.4% precision and 79.8% recall on 284,807 transactions where only 0.17% are fraud. Compared LR, SVM, Random Forest and XGBoost, then tuned XGBoost with SMOTE and class weights.
- Inference takes 3.8 ms per transaction on CPU, measured on a 56,962-transaction holdout — fast enough for a live payment check.

## Publication
Sahoo, A. A., & Kar, S. (2026). Cloud Computing Resource Optimizer. SSRN preprint, 7 pages. Posted 15 July 2026. papers.ssrn.com/abstract=6957438

## Experience
Cloud Computing Intern, Central Tool Room & Training Centre (CTTC), Bhubaneswar, India. December 2025 – January 2026. Completed a hands-on AWS cloud computing programme covering EC2 compute, S3 storage, VPC networking and load balancing, working directly on CTTC's server infrastructure.

## Leadership
- Committee Head, Sponsorship — Directorate of Student Affairs, SRMIST (Sep 2024 – present; Committee Member Dec 2023 – Sep 2024). Runs sponsorship and logistics for Milan, SRMIST's national cultural festival, drawing 60,000+ participants from 350 colleges. Brought in AJIO as a sponsor for ₹2 lakh in coupons in exchange for on-ground branding, and sold vendor stalls that generated ₹1.2 lakh in revenue.
- Lead, Sponsorship — TEDxSRMIST (Jul 2025 – present; Lead Associate Sep 2023 – Jul 2025). Owns sponsorship outreach and speaker acquisition for a five-speaker annual edition. Brought one of the event's speakers on board and secured a ₹50,000 sponsorship from a local gym.

## Certifications
Cloud Computing — Central Tool Room & Training Centre (CTTC), January 2026. JPMorgan Chase & Co. Virtual Job Simulation — Forage.
`;
