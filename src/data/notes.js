// Notes / blog posts at /notes/:slug. Body is a small Markdown subset:
// ## headings, paragraphs, - lists, 1. lists, > quotes, ```code```, **bold**, `code`, [links](url).
// To add a post, add an object to the top of this array.

export const notes = [
  {
    slug: "threshold-without-labels",
    title: "Choosing a defect threshold without a single defect label",
    date: "2026-11-01",
    tags: ["Computer vision", "Anomaly detection", "MaskSight"],
    summary:
      "Anomaly detectors rank pixels well but can't tell you where to cut. How MaskSight's SynthCal learns that cut from painted-on fake defects — and why the threshold has to be relative to each image's peak.",
    body: `
[MaskSight](https://github.com/Sarthakkar23/MaskSight) learns what a *good* product looks like from normal images only, then predicts a pixel-level mask of anything that deviates: scratches, cracks, contamination, missing parts. This note is about the one decision that makes or breaks it: the threshold.

## Ranking is solved. Cutting isn't.

Unsupervised detectors like **PatchCore** and **PaDiM** produce a heatmap where defective pixels score higher than normal ones. They're very good at that ranking: pixel AUROC is about **0.98** on MVTec AD.

But a production line doesn't want a heatmap. It wants a **binary mask**, and a mask needs a threshold. Papers usually tune that threshold on the labelled test set. A real deployment has no such labels.

The honest label-free option is to take a high quantile of the scores on normal images. It gives poor masks: **Dice 0.12 on leather, 0.22 on grid**.

## Make your own labels

The idea behind **SynthCal** is simple: if you don't have defect labels, paint defects whose masks you already know.

1. Hold out 10% of the normal training images.
2. Paint Perlin-noise defects on them — foreign texture, displaced structure or a stain, kept to one or two regions on the object's foreground.
3. Every fake defect comes with its exact mask for free.

## The trap: absolute thresholds don't transfer

The first version learned an absolute score threshold on the fake defects. It did **worse than the baseline** (Dice 0.369 vs 0.397 with PatchCore).

The reason: fake defects are never exactly as conspicuous as real ones. A pasted texture on carpet is far louder than a real thread defect, so a cut-off learned on one is wrong for the other.

## The fix: cut relative to the peak

What *does* transfer is the shape of the response — how quickly the heatmap falls off from its peak. That depends on the backbone's receptive field and the smoothing, not on how strong the defect is. So the rule became:

\`\`\`
defective  =  score > floor   AND   score > α · max(score in this image)
\`\`\`

- **floor** is the 99.9th percentile of normal-pixel scores, so clean parts stay clean.
- **α** is chosen to maximise Dice on the synthetic defects.

Averaged over categories, the α learned on fake defects lands **0.05 away** from the α you'd pick if you could see the real labels.

## Results

On all 15 MVTec AD categories, with WideResNet-50 features on one free Colab T4:

- Label-free mask Dice rose from **0.397 to 0.517** (+30%) with PatchCore, and from 0.366 to 0.480 with PaDiM.
- That beats an **oracle** threshold tuned on the real test labels (0.466).
- SynthCal beat the label-free baseline on **15 of 15** categories.
- It reaches **96%** of the best possible α for this rule, without labels.

## What's still hard

Masks come from a 28×28 feature grid that's upsampled, so thin scratches come out blobby. Screw, capsule and grid stay hard. And where real defects look nothing like the generator's — missing parts on a transistor — SynthCal gains the least.

The code, every benchmark config and the Colab notebook are on [GitHub](https://github.com/Sarthakkar23/MaskSight).
`,
  },
  {
    slug: "accuracy-lies-at-017",
    title: "Why 99.8% accuracy was the worst fraud model I trained",
    date: "2026-11-01",
    tags: ["Imbalanced ML", "XGBoost", "Fraud"],
    summary:
      "When only 0.17% of transactions are fraud, a model that never flags anything looks almost perfect. What I measured instead, and how fraud-class F1 went from 0.68 to 0.83.",
    body: `
My fraud-detection project uses 284,807 card transactions. Only **0.17%** of them are fraud. That one number changes how you have to build and judge the model.

## The 99.8% trap

A model that predicts "not fraud" for every single transaction is **99.8% accurate**. It also catches zero fraud. Accuracy rewards the majority class, and here the majority class is everything you don't care about.

So I stopped looking at accuracy and optimised for three things on the fraud class only:

- **Precision** — of the transactions I flag, how many are really fraud? Low precision means blocking honest customers.
- **Recall** — of the real fraud, how much do I catch? Low recall means money lost.
- **F1** — the balance of the two, and the number I tuned for.

## Compare honestly

I trained logistic regression, SVM, Random Forest and XGBoost on the same split. Logistic regression set the baseline: fraud-class **F1 0.68**.

## Fix the imbalance

Two tools did most of the work on XGBoost:

1. **SMOTE** — synthesises new fraud examples between real ones, so the model sees enough of the rare class to learn its shape.
2. **Class weights** — makes a missed fraud cost more than a false alarm during training.

The tuned XGBoost reached **F1 0.83**, with **86.4% precision** and **79.8% recall**.

## Fast enough to matter

A fraud model only helps if it can sit inside a live payment check. On a 56,962-transaction holdout, inference took **3.8 ms per transaction on CPU**.

## What I'd change next

- **Pick the threshold from money, not F1.** A missed fraud and a blocked customer don't cost the same. A cost model should set the cut-off.
- **Explain each flag.** SHAP values would let an analyst see why a transaction was stopped before they act on it.
`,
  },
  {
    slug: "classical-before-deep",
    title: "Tuning the classics before reaching for a deep model",
    date: "2026-11-01",
    tags: ["Computer vision", "OpenCV", "ClearPixel AI"],
    summary:
      "How ClearPixel AI restores noisy photos to 31.2 dB PSNR in about 110–140 ms per 1080p frame on a CPU — classical filters where they win, deep models only where they don't.",
    body: `
[ClearPixel AI](https://github.com/Sarthakkar23/Clear-Pixel-AI) restores old and noisy photos: denoising, sharpening, edge detection and colourisation, all behind one Flask API. The constraint that shaped it: it had to run on a **CPU**, in real time.

## The easy answer is a blur. It's wrong.

A Gaussian blur removes noise, but it removes detail with it. On Set14 at noise level σ=25 it scores **27.1 dB PSNR**. Deep denoisers do better but are slow without a GPU.

## Tune the classics first

Instead of jumping to a neural network, I combined and tuned three classical steps:

1. **CLAHE** — contrast-limited adaptive histogram equalisation, to recover local contrast without blowing out highlights.
2. **Median filtering** — removes speckle while keeping edges sharper than a blur does.
3. **OpenCV denoising**, tuned for the noise level.

Together they reach **31.2 dB PSNR and 0.914 SSIM** on Set14 at σ=25 — **4.1 dB** better than the plain blur.

## Make it fast

The filters were rewritten as vectorised NumPy / OpenCV operations instead of Python loops. The classical pipeline now runs in **110–140 ms per 1080p frame** on a CPU.

## Deep models only where they earn it

Some jobs classical filters can't do:

- **HED** (holistically-nested edge detection) for clean, semantic edges — under **2 s** per image on CPU.
- **DeOldify** for colourising black-and-white photos.

Each task is its own endpoint on the same Flask API.

## What I'd test next

The honest question is where classical filters stop being competitive. The next step is benchmarking against a small learned denoiser, such as a lightweight U-Net, and adding a browser demo so anyone can try it on their own photos.
`,
  },
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
