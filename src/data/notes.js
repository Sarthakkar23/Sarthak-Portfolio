// Notes / blog posts at /notes/:slug. Body is a small Markdown subset:
// ## headings, paragraphs, - lists, 1. lists, > quotes, ```code```, **bold**, `code`, [links](url).
// To add a post, add an object to the top of this array.

export const notes = [
  {
    slug: "lora-4bit-fhir",
    title: "Teaching a 3B model to write FHIR: LoRA in 4-bit",
    date: "2026-10-29",
    tags: ["LLMs", "LoRA", "Health AI"],
    summary:
      "Why AMRIP-India uses small open models fine-tuned with LoRA in 4-bit to turn clinical text into valid FHIR JSON — and why the verifier matters more than the model.",
    body: `
In AMRIP-India, my capstone, the last stage of the pipeline takes everything the earlier stages extracted from a photographed prescription — OCR text, clinical entities, SNOMED CT / LOINC codes — and has an LLM structure it into a FHIR R4 record. This note is about how I'm approaching that model, and why.

## Why a small model?

Three constraints pushed me away from large hosted models:

- **Privacy.** Prescriptions are patient data. Under India's DPDP Act the safest design is one where the data never leaves the machine, so the whole pipeline runs locally.
- **Cost and hardware.** A clinic can't be expected to run a 70B model. I'm working with **Qwen2.5 and Llama 3.2 at 3B parameters or smaller**.
- **The task is narrow.** The model isn't asked to reason about medicine — it's asked to map already-extracted facts into a strict JSON schema. That's exactly the kind of task fine-tuning is good at.

## LoRA, briefly

Full fine-tuning updates every weight in the model. **LoRA** (Low-Rank Adaptation) freezes the original weights and learns small low-rank matrices that are added to selected layers. You train a tiny fraction of the parameters, and the result is a lightweight adapter you can swap in and out.

Loading the frozen base model in **4-bit** cuts its memory footprint further, so fine-tuning and inference both fit on modest hardware. The trade-off is some precision in the base weights — which is acceptable here because the adapter is learning a formatting task, not new knowledge.

## The model is not the safety mechanism

The most important design decision isn't the model at all. Any field the LLM produces is **rejected unless it traces back to an OCR span and a bounding box in the original photo**. If a dose or a drug name can't be grounded in the image, it doesn't make it into the record.

Rejected fields are sent back to the LLM for up to **two repair rounds**. If something still fails, the LangGraph graph pauses with \`interrupt()\` and waits for a human reviewer. Every step is checkpointed in Postgres, so each record carries a full audit trail of what was extracted, rejected, repaired and approved.

> A small model that is forced to show its evidence is more trustworthy than a large model that isn't.

## Helping OCR with domain knowledge

Handwritten drug names are where general OCR fails hardest. Instead of hoping the model gets them right, TrOCR's decoding is **restricted to a list of 2.5 lakh Indian medicine brands**, so its output has to be a real drug name.

## What I'm measuring

The main experiment compares three settings: the verifier **off**, **on**, and **on with the repair loop**. The question is simple — how many wrong fields does grounding plus repair actually prevent? The project is still in progress, so I'll update this note with results once they're final.
`,
  },
  {
    slug: "cloudoptima-ssrn",
    title: "What our SSRN paper on cloud resource optimisation found",
    date: "2026-10-29",
    tags: ["Reinforcement learning", "Cloud", "Research"],
    summary:
      "A plain-language summary of CloudOptima: forecasting demand, letting a Deep Q-Network place workloads, and explaining every decision — 34% lower simulated compute cost than reactive auto-scaling.",
    paper: "https://papers.ssrn.com/abstract=6957438",
    body: `
In July 2026, my co-author A. A. Sahoo and I posted [*Cloud Computing Resource Optimizer*](https://papers.ssrn.com/abstract=6957438) as an SSRN preprint. It grew out of CloudOptima, our minor project. Here's the idea in plain language.

## The problem with reactive scaling

Most auto-scaling is reactive: when load crosses a threshold, add capacity. That means clusters are either **over-provisioned** — wasting money and energy — or **late**, adding capacity after users already feel the slowdown.

## Our approach

CloudOptima has four parts:

1. **Forecast demand.** We built lag and rolling-window features from PlanetLab workload traces and trained XGBoost and Random Forest models, tuned with Optuna, to predict CPU and RAM demand.
2. **Learn where each task should run.** A **Deep Q-Network** in PyTorch decides which VM each task goes to. Its reward balances three things: cost, efficiency and packing.
3. **Fail over automatically.** An anomaly detector — Isolation Forest plus Z-score checks — spots failing VMs and moves their work elsewhere.
4. **Explain every decision.** A Streamlit dashboard shows SHAP and LIME explanations for each scaling decision, so someone without an ML background can see *why* the system acted.

## Results (in simulation)

Compared with reactive auto-scaling on PlanetLab traces:

- **34% lower** compute cost and **38% lower** CO₂
- Demand forecasts with **R² of 0.89 (CPU) and 0.84 (RAM)**, MAE 6.2%
- **99.2%** availability, with **98%** of failed tasks recovered automatically

## What I learned

- **Forecasting and control are better together.** The scheduler makes better placements when it knows what's coming, not just what's happening.
- **Explainability is a feature, not an add-on.** An operator won't hand control to a system they can't interrogate. SHAP and LIME made the DQN's decisions reviewable.
- **Simulation is a starting point.** These numbers come from simulated traces. The natural next step is validating on a second dataset and a small live deployment.

You can read the full paper on [SSRN](https://papers.ssrn.com/abstract=6957438) and the code on [GitHub](https://github.com/Sarthakkar23/Cloud-Resource-Optimizer).
`,
  },
];
