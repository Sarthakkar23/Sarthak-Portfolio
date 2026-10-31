// The AI twin's brain. Runs entirely in the visitor's browser — no API key, no cost.
// 1. Understands what the question is about (intent + entities) and answers from the résumé data.
// 2. For general "what is X?" questions it looks the topic up on Wikipedia and links it back to Sarthak's work.
// 3. When it isn't sure, it says so and points to Sarthak's contact details.
import { profile, education, skills, projects as resumeProjects, publication, experience, leadership, certifications } from "../../data/resume";
import { curatedProjects } from "../../data/projects";

const EMAIL = profile.email;
const LINKEDIN = "https://www.linkedin.com/in/sarthak-kar-2283692a7/";
const CONTACT = `For anything I can't answer, please contact Sarthak directly at **${EMAIL}** or on LinkedIn.`;
const CONTACT_INLINE = `contact Sarthak at **${EMAIL}** or on LinkedIn`;
const contactLinks = [
  { label: "Email Sarthak", href: `mailto:${EMAIL}` },
  { label: "LinkedIn", href: LINKEDIN },
];

const norm = (s) => ` ${s.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9+#.'/ -]/g, " ").replace(/\s+/g, " ")} `;
// "^word" = the question starts with that whole word; anything else = substring match.
const has = (q, words) =>
  words.some((w) => {
    if (!w.startsWith("^")) return q.includes(w);
    const t = q.trim();
    const word = w.slice(1).trim();
    return t.startsWith(word) && !/[a-z]/.test(t.charAt(word.length) || " ");
  });

// ---------- Projects: résumé bullets + card summaries + aliases ----------
const ALIASES = {
  "amrip-india": ["amrip", "prescription", "fhir", "health record", "medical record", "abdm", "capstone", "healthcare", "medical"],
  cloudoptima: ["cloudoptima", "cloud optim", "cloud resource", "resource optim", "autoscal", "auto-scal", "dqn", "deep q", "scheduler", "vm "],
  "clearpixel-ai": ["clearpixel", "clear pixel", "image restor", "denois", "deoldify", "coloris", "coloriz", "psnr", "photo restor"],
  "fraud-detection": ["fraud", "credit card", "transaction", "imbalanced", "smote"],
  masksight: ["masksight", "mask sight", "defect", "anomaly", "segmentation", "patchcore", "padim", "mvtec", "synthcal", "inspection"],
};
const PROJECTS = curatedProjects.map((c) => {
  const r = resumeProjects.find((p) => p.name === c.name) || {};
  return { ...c, title: r.title || c.subtitle, kind: r.kind || c.badge, stack: r.stack || c.tags.join(", "), points: r.points || [], aliases: ALIASES[c.slug] || [] };
});
const projectLink = (p) => ({ label: `${p.name} case study`, to: `/work/${p.slug}` });

// ---------- Skills index: every tool → its group + the projects that used it ----------
const TECH = [];
skills.forEach(([group, items]) =>
  items.forEach((item) => {
    const base = item.replace(/\s*\(.*\)/, "");
    const variants = base.split(/\s*\/\s*/).concat(base).map((v) => v.toLowerCase().trim()).filter((v) => v.length > 1);
    TECH.push({ name: item, group, variants: [...new Set(variants)] });
  })
);
const EXTRA_TECH = [
  ["machine learning", "ML & Deep Learning", ["machine learning", " ml "]],
  ["deep learning", "ML & Deep Learning", ["deep learning", "neural net"]],
  ["LLMs", "NLP & LLMs", [" llm", "large language model", "genai", "gen ai", "generative ai"]],
  ["NLP", "NLP & LLMs", [" nlp", "natural language"]],
  ["computer vision", "Vision & OCR", ["computer vision", " cv ", "image processing"]],
  ["reinforcement learning", "ML & Deep Learning", ["reinforcement learning", " rl "]],
  ["explainable AI", "Data & XAI", ["explainab", " xai"]],
  ["cloud computing", "Cloud & Serving", ["cloud computing", " ec2", " s3", " vpc"]],
  ["model deployment (FastAPI, Docker, MLflow)", "Cloud & Serving", ["deploy", "mlops", "serving models", "model serving", "fastapi", "flask", "streamlit"]],
  ["TensorFlow", null, ["tensorflow", "keras"]],
];
EXTRA_TECH.forEach(([name, group, variants]) => TECH.push({ name, group, variants, extra: true }));

function findTech(q) {
  const found = [];
  for (const t of TECH) {
    const hit = t.variants.some((v) => {
      const needle = v.startsWith(" ") || v.endsWith(" ") ? v : v.length <= 3 ? ` ${v} ` : v;
      return q.includes(needle);
    });
    if (hit && !found.some((f) => f.name === t.name)) found.push(t);
  }
  return found;
}

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const wordIn = (hay, k) => new RegExp(`(^|[^a-z0-9])${esc(k)}([^a-z0-9]|$)`).test(hay);

function projectsUsing(t) {
  const keys = t.variants.map((v) => v.trim());
  return PROJECTS.filter((p) => {
    const hay = `${p.stack} ${p.tags.join(" ")} ${p.points.join(" ")} ${p.summary}`.toLowerCase();
    return keys.some((k) => wordIn(hay, k));
  });
}

// ---------- Answer builders ----------
const A = (text, links = [], topic = null) => ({ text, links, topic });

function projectAnswer(p, detailed = false) {
  const metrics = (p.metrics || []).map(([v, l]) => `**${v}** ${l}`).join(" · ");
  const body = detailed
    ? p.points.map((pt) => `- ${pt}`).join("\n")
    : `${p.summary}${metrics ? `\n\nHighlights: ${metrics}` : ""}`;
  return A(
    `**${p.name}** — ${p.title} (${p.kind}).\n\n${body}\n\nBuilt with ${p.stack}.`,
    [projectLink(p), ...(p.repo ? [{ label: "Code on GitHub", href: `https://github.com/Sarthakkar23/${p.repo}` }] : [])],
    { type: "project", slug: p.slug }
  );
}

function techAnswer(techs) {
  const parts = techs.slice(0, 3).map((t) => {
    if (t.extra && !t.group) {
      return `**${t.name}** isn't on Sarthak's résumé — his deep-learning work is in **PyTorch**.`;
    }
    const used = projectsUsing(t);
    const inExperience = experience.find((e) => t.variants.some((v) => wordIn(e.body.toLowerCase(), v.trim())));
    const where = used.length
      ? ` He used it in ${used.map((p) => `**${p.name}**`).join(", ")}.`
      : inExperience
      ? ` He worked with it hands-on as a **${inExperience.role}** at ${inExperience.org}: ${inExperience.body}`
      : "";
    return `**Yes — ${t.name}** is part of his toolkit (${t.group}).${where}`;
  });
  const used = [...new Set(techs.flatMap(projectsUsing))];
  const detail = used.length === 1 ? `\n\n**${used[0].name}:** ${used[0].summary}` : "";
  return A(parts.join("\n\n") + detail, used.slice(0, 2).map(projectLink), used.length === 1 ? { type: "project", slug: used[0].slug } : { type: "tech" });
}

const summary = () =>
  A(
    "Sarthak Kar is a **final-year B.Tech CSE (AI & ML)** student at SRMIST, Chennai, graduating **May 2027**. He's currently building a LoRA-tuned LLM pipeline that turns photographed Indian prescriptions into standards-validated FHIR health records (AMRIP-India). He has shipped projects in deep reinforcement learning, imbalanced classification and computer vision, co-authored an SSRN preprint on multi-cloud resource optimisation, and is looking for **applied AI/ML engineering roles**.",
    [{ label: "Full story", to: "/about" }, { label: "Résumé", to: "/resume" }],
    { type: "about" }
  );

const INTENTS = [
  {
    id: "sensitive",
    words: ["salary", " ctc", "stipend", "package", "visa", "relocat", "notice period", "girlfriend", "married", " age ", "how old", "religion", "caste", "politic", "home address", "phone number", "mobile number", "whatsapp", "personal life"],
    answer: () => A(`That's best discussed with Sarthak personally — I only know what's on his résumé. ${CONTACT}`, contactLinks),
  },
  {
    id: "thanks",
    words: ["^thank", "^thx", "^great", "^cool", "^nice", "^awesome", "^ok", "^okay"],
    short: true,
    answer: () => A("You're welcome! Anything else you'd like to know about Sarthak's work?"),
  },
  {
    id: "greeting",
    words: ["^hi", "^hello", "^hey", "^yo ", "^namaste", "^hola", "good morning", "good evening"],
    short: true,
    answer: () =>
      A("Hi! 👋 I'm Sarthak's AI twin. Ask me about his projects, skills, experience or education — or whether he'd fit a role you're hiring for."),
  },
  {
    id: "contact",
    words: ["contact", "reach", "email", "e-mail", "mail him", "linkedin", "get in touch", "talk to him", "connect with", "resume", "résumé", " cv"],
    answer: () =>
      A(
        `You can reach Sarthak at **${EMAIL}** or on LinkedIn. His one-page résumé is on the Résumé page, and there's a contact form at the bottom of the home page.`,
        [...contactLinks, { label: "Résumé", to: "/resume" }]
      ),
  },
  {
    id: "availability",
    words: ["available", "availability", "when can", "start date", "join", "joining", "full-time", "full time", "graduat", "pass out", "passout", "internship opportun", "open to", "looking for", "job search", "seeking"],
    answer: () =>
      A(
        `Sarthak graduates in **May 2027** and is actively looking for **applied AI/ML engineering roles** — especially LLM / document-AI pipelines, computer vision and ML systems. For exact dates and role details, ${CONTACT_INLINE}.`,
        contactLinks
      ),
  },
  {
    id: "location",
    words: ["where is he", "where does he live", "where's he", "based", "location", "located", "which city", "where from", "where is sarthak"],
    answer: () => A(`Sarthak is based in **${profile.location}**. For questions about relocation or remote work, ${CONTACT_INLINE}.`, contactLinks),
  },
  {
    id: "education",
    words: ["study", "studies", "studying", "college", "university", "degree", "education", "b.tech", "btech", "srm", "cgpa", "gpa", "marks", "semester", "year is he", "which year"],
    answer: (q) =>
      A(
        `He's studying **${education.degree}** (${education.spec.replace("Specialisation: ", "specialising in ")}) at **${education.school}**, ${education.when}.${
          has(q, ["cgpa", "gpa", "marks"]) ? `\n\nHis grades aren't listed on the site — ${CONTACT_INLINE}.` : ""
        }`,
        [{ label: "About Sarthak", to: "/about" }]
      ),
  },
  {
    id: "experience",
    words: ["experience", "intern", "worked", "work history", "job", "company", "companies", "employ", "industry", "cttc", "professional"],
    answer: () => {
      const e = experience[0];
      return A(
        `**${e.role}** at ${e.org}, ${e.where} (${e.when}). ${e.body}\n\nBeyond that, his hands-on experience comes from building four end-to-end ML projects — including a published one (CloudOptima) and his capstone, AMRIP-India.`,
        [{ label: "All projects", to: "/project" }]
      );
    },
  },
  {
    id: "publication",
    words: ["paper", "publication", "publish", "research", "ssrn", "preprint", "journal", "conference"],
    answer: () =>
      A(
        `Yes — ${publication.cite} *${publication.title}* ${publication.venue} It's based on his CloudOptima project: a Deep Q-Network scheduler that cut simulated compute cost by **34%** versus reactive auto-scaling.`,
        [{ label: "Read the paper", href: publication.link }, { label: "Plain-language summary", to: "/notes/cloudoptima-ssrn" }]
      ),
  },
  {
    id: "leadership",
    words: ["leader", "leadership", "lead ", "team", "extracurricular", "extra-curricular", "club", "tedx", "milan", "sponsor", "soft skill", "communication", "event", "manage"],
    answer: () =>
      A(
        leadership.map((l) => `- **${l.role}**, ${l.org} (${l.when}): ${l.body}`).join("\n") +
          "\n\nTwo of his ML projects (AMRIP-India and CloudOptima) were also built in teams of two."
      ),
  },
  {
    id: "certifications",
    words: ["certif", "course", "courses", "forage", "jpmorgan", "jp morgan"],
    answer: () => A(`His certifications:\n${certifications.map((c) => `- ${c}`).join("\n")}`),
  },
  {
    id: "best",
    words: ["best project", "strongest", "favourite project", "favorite project", "proudest", "most impressive", "flagship", "top project", "biggest project"],
    answer: () => {
      const [amrip, cloud] = PROJECTS;
      return A(
        `Two stand out:\n- **${amrip.name}** — his capstone: ${amrip.summary}\n- **${cloud.name}** — published as an SSRN preprint: ${cloud.summary} It cut simulated compute cost by **34%**.`,
        [projectLink(amrip), projectLink(cloud)]
      );
    },
  },
  {
    id: "fit",
    words: ["fit", "hire him", "why should", "why hire", "good candidate", "strength", "suitable", "good at", "stand out", "unique", "value", "ml engineer", "ai engineer", "data scientist", "role"],
    answer: () =>
      A(
        `Here's the case for Sarthak in an applied AI/ML role:\n- **End-to-end builder** — takes messy real data (handwritten prescriptions, raw cloud logs, 0.17%-fraud transactions) all the way to a served, measured model.\n- **Modern LLM stack** — LangGraph pipelines with verification and human review, LoRA fine-tuning in 4-bit (AMRIP-India).\n- **Measurable results** — 34% lower simulated compute cost (CloudOptima), fraud F1 0.83, 31.2 dB restoration.\n- **Research + communication** — a co-authored SSRN preprint, SHAP/LIME explanations for non-ML users, and leadership roles managing sponsors for a 60,000+ attendee festival.\n\nFor role-specific questions, ${CONTACT_INLINE}.`,
        [{ label: "Projects", to: "/project" }, ...contactLinks.slice(0, 1)]
      ),
  },
  {
    id: "projects",
    words: ["project", "built", "build", "portfolio", "worked on", "work on", "made", "created", "developed", "github", "repos"],
    answer: () => {
      let extra = "";
      try {
        const cached = JSON.parse(sessionStorage.getItem("sk-gh-repos-v1"));
        const known = curatedProjects.map((p) => (p.repo || "").toLowerCase());
        const more = (cached?.repos || []).filter((r) => !r.fork && r.name !== "Sarthak-Portfolio" && !known.includes(r.name.toLowerCase()));
        if (more.length) extra = `\n\nAlso on GitHub: ${more.slice(0, 4).map((r) => `**${r.name.replace(/[-_]/g, " ")}**`).join(", ")}.`;
      } catch (e) {}
      return A(
        `His main projects:\n${PROJECTS.map((p) => `- **${p.name}** — ${p.summary}`).join("\n")}${extra}\n\nAsk me about any one of them for details.`,
        [{ label: "All projects", to: "/project" }]
      );
    },
  },
  {
    id: "skills",
    words: ["skill", "tech stack", "stack", "tools", "technolog", "languages", "programming", "frameworks", "libraries", "know"],
    answer: () =>
      A(`His toolkit:\n${skills.map(([g, items]) => `- **${g}:** ${items.join(", ")}`).join("\n")}`, [{ label: "About Sarthak", to: "/about" }]),
  },
  {
    id: "about",
    words: ["who is", "who's", "what does he do", "what does sarthak do", "what he does", "introduction", "profile", "about him", "about sarthak", "tell me about", "introduce", "summary", "summarize", "summarise", "overview", "background", "yourself", "describe him"],
    answer: summary,
  },
];

function bestIntent(q) {
  let best = null;
  for (const intent of INTENTS) {
    const score = intent.words.reduce((s, w) => s + (has(q, [w]) ? 1 : 0), 0);
    if (!score) continue;
    if (intent.short && q.trim().split(" ").length > 6) continue;
    if (!best || score > best.score) best = { intent, score };
  }
  return best && best.intent;
}

// ---------- Glossary: short definitions for terms in Sarthak's stack ----------
const GLOSSARY = [
  [["lora", "low-rank adaptation", "peft", "qlora"], "LoRA (Low-Rank Adaptation)", "a parameter-efficient way to fine-tune a large model: the original weights stay frozen and small low-rank matrices are trained and added to selected layers, so only a tiny fraction of parameters change.", "amrip-india"],
  [["fhir"], "FHIR", "Fast Healthcare Interoperability Resources — the HL7 standard for exchanging electronic health records as structured resources (Patient, MedicationRequest, Observation…). India's ABDM uses FHIR R4.", "amrip-india"],
  [["langgraph"], "LangGraph", "a library from the LangChain team for building LLM applications as stateful graphs — nodes, branches, loops, checkpoints and human-in-the-loop pauses.", "amrip-india"],
  [["langchain"], "LangChain", "a framework for building applications on top of large language models — prompts, tools, retrieval and chains of model calls.", "amrip-india"],
  [["quantis", "quantiz", "4-bit", "4 bit"], "Quantisation", "storing a model's weights at lower precision (e.g. 4-bit instead of 16-bit) to cut memory use and speed up inference, at a small cost in accuracy.", "amrip-india"],
  [["trocr"], "TrOCR", "a Transformer-based OCR model from Microsoft that reads text — including handwriting — directly from image crops.", "amrip-india"],
  [["layoutlm"], "LayoutLMv3", "a multimodal Transformer that understands documents using text, layout (positions) and image together.", "amrip-india"],
  [["snomed"], "SNOMED CT", "a comprehensive clinical terminology used to code diagnoses, findings and procedures in health records.", "amrip-india"],
  [["loinc"], "LOINC", "a standard set of codes for identifying laboratory tests and clinical observations.", "amrip-india"],
  [["splink", "record linkage", "fellegi"], "Splink", "an open-source library for probabilistic record linkage (Fellegi–Sunter model) — finding records that refer to the same person despite spelling differences.", "amrip-india"],
  [["dqn", "deep q", "q-network", "q learning", "q-learning"], "Deep Q-Network (DQN)", "a reinforcement-learning method where a neural network learns the expected long-term reward of each action, so an agent can pick the best action in each state.", "cloudoptima"],
  [["shap"], "SHAP", "a method that explains a model's prediction by attributing it to each input feature, based on Shapley values from game theory.", "cloudoptima"],
  [["lime"], "LIME", "a technique that explains an individual prediction by fitting a simple, interpretable model around that one example.", "cloudoptima"],
  [["optuna"], "Optuna", "a hyperparameter-optimisation framework that searches for the best model settings automatically.", "cloudoptima"],
  [["isolation forest"], "Isolation Forest", "an anomaly-detection algorithm that isolates unusual points with random splits — anomalies get isolated in fewer splits.", "cloudoptima"],
  [["xgboost", "gradient boost"], "XGBoost", "a fast, regularised gradient-boosted decision-tree library — a go-to model for tabular data.", "fraud-detection"],
  [["smote", "oversampl"], "SMOTE", "Synthetic Minority Over-sampling Technique — creates synthetic examples of the rare class to help models learn from imbalanced data.", "fraud-detection"],
  [["psnr"], "PSNR", "Peak Signal-to-Noise Ratio — a standard measure (in dB) of how close a restored image is to the original; higher is better.", "clearpixel-ai"],
  [["ssim"], "SSIM", "the Structural Similarity Index — measures perceived similarity between two images on a 0–1 scale.", "clearpixel-ai"],
  [["clahe"], "CLAHE", "Contrast-Limited Adaptive Histogram Equalisation — boosts local contrast in an image without over-amplifying noise.", "clearpixel-ai"],
  [["deoldify"], "DeOldify", "a deep-learning model for colourising and restoring old black-and-white photos.", "clearpixel-ai"],
  [["transformer"], "A Transformer", "a neural-network architecture built on self-attention; it's the basis of modern LLMs and of models like TrOCR and LayoutLMv3.", "amrip-india"],
  [["ocr", "optical character"], "OCR (optical character recognition)", "turning text in an image — printed or handwritten — into machine-readable text.", "amrip-india"],
  [["ner", "named entity"], "NER (named-entity recognition)", "finding and labelling entities in text — in clinical NER: drugs, doses, tests and values.", "amrip-india"],
  [["fine-tun", "fine tun", "finetun"], "Fine-tuning", "continuing to train a pre-trained model on task-specific data so it gets good at that task.", "amrip-india"],
  [["rag", "retrieval augmented"], "RAG", "Retrieval-Augmented Generation — an LLM answers using documents retrieved for each question, which grounds its answers in real sources.", null],
];
function glossaryEntry(topic) {
  const t = norm(topic);
  return GLOSSARY.find(([keys]) => keys.some((k) => (k.length <= 4 ? t.includes(` ${k} `) || t.includes(` ${k}s `) : t.includes(k))));
}
function glossary(topic) {
  const t = norm(topic);
  const g = GLOSSARY.find(([keys]) => keys.some((k) => (k.length <= 4 ? t.includes(` ${k} `) || t.includes(` ${k}s `) : t.includes(k))));
  if (!g) return null;
  const [, title, def, slug] = g;
  const p = slug && PROJECTS.find((x) => x.slug === slug);
  return A(
    `**${title}** is ${def}${p ? `\n\n**How Sarthak uses it:** in **${p.name}** — ${p.summary}` : ""}`,
    p ? [projectLink(p)] : [],
    p ? { type: "project", slug: p.slug } : null
  );
}

// ---------- The web: Wikipedia lookup for general questions ----------
const GENERAL = /^\s*(what('s| is| are)|what does|who (is|was|invented)|explain|define|definition of|meaning of|how does|how do|tell me about)\s+/i;

async function wikipedia(topic) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 5000);
  try {
    const s = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(topic)}&srlimit=1&format=json&origin=*`,
      { signal: ctl.signal }
    ).then((r) => r.json());
    const title = s?.query?.search?.[0]?.title;
    if (!title) return null;
    const page = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`, {
      signal: ctl.signal,
    }).then((r) => r.json());
    if (!page?.extract || page.type === "disambiguation") return null;
    const sentences = page.extract.match(/[^.!?]+[.!?]+/g) || [page.extract];
    return { title: page.title, text: sentences.slice(0, 2).join(" ").trim(), url: page.content_urls?.desktop?.page };
  } catch (e) {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// ---------- Fallback: keyword search over everything we know ----------
const CHUNKS = [
  ...PROJECTS.flatMap((p) => p.points.map((pt) => ({ text: pt, project: p }))),
  ...leadership.map((l) => ({ text: `${l.role}, ${l.org}: ${l.body}` })),
  ...experience.map((e) => ({ text: `${e.role} at ${e.org}: ${e.body}` })),
  { text: profile.summary },
];
const STOP = new Set("a an and are as at be by did do does for from has have he his how i in is it its me my of on or so tell that the their this to was what when where which who why will with would you your about sarthak kar him".split(" "));
const terms = (s) => (s.toLowerCase().match(/[a-z0-9][a-z0-9+#.-]*/g) || []).filter((w) => w.length > 2 && !STOP.has(w));

function searchChunks(q) {
  const qt = new Set(terms(q));
  if (!qt.size) return null;
  let best = null;
  for (const c of CHUNKS) {
    const score = terms(c.text).reduce((s, w) => s + (qt.has(w) ? 1 : 0), 0);
    if (score && (!best || score > best.score)) best = { ...c, score };
  }
  return best && best.score >= 2 ? best : null;
}

/** Answer a visitor's question. `context.topic` is the previous answer's topic, for follow-ups. */
export async function answer(question, context = {}) {
  const q = norm(question);

  // Follow-ups like "tell me more" / "details" continue the previous topic.
  if (/^ (tell me )?(more|details?|go on|elaborate|expand|continue)\b/.test(q) || q.trim() === "more") {
    if (context.topic?.type === "project") {
      const p = PROJECTS.find((x) => x.slug === context.topic.slug);
      if (p) return projectAnswer(p, true);
    }
    return A("Happy to go deeper — which project or topic? For example: AMRIP-India, CloudOptima, his skills or his experience.");
  }

  const intent = bestIntent(q);
  const techs = findTech(q);
  const aboutHim = /\b(he|him|his|sarthak)\b/i.test(question);

  const project = PROJECTS.find((p) => has(q, p.aliases) || q.includes(p.name.toLowerCase()));

  // "What is LoRA?" — a general concept. Define it, then connect it to Sarthak's work.
  if (GENERAL.test(question) && !aboutHim) {
    const topic = question.replace(GENERAL, "").replace(/[?.!]+$/, "").trim();
    const g = glossary(topic);
    if (g) return g;
  }
  if (GENERAL.test(question) && !aboutHim && !project) {
    const topic = question.replace(GENERAL, "").replace(/[?.!]+$/, "").trim();
    const known = findTech(norm(topic));
    if (known.length && !/\s/.test(topic)) return techAnswer(known);
    // Disambiguate one-word tech terms ("transformers", "pandas") towards their ML meaning.
    const techTopic = !/\s/.test(topic) && findTech(norm(topic)).length > 0;
    const wiki = topic.length > 1 ? await wikipedia(techTopic ? `${topic} machine learning` : topic) : null;
    if (wiki) {
      const related = findTech(norm(`${topic} ${wiki.title}`));
      const used = [...new Set(related.flatMap(projectsUsing))];
      const tie = used.length
        ? `\n\n**How Sarthak uses it:** ${used.map((p) => p.name).join(", ")} — ask me about ${used.length > 1 ? "them" : "it"}!`
        : "";
      return A(`**${wiki.title}:** ${wiki.text}${tie}\n\n_Source: Wikipedia._`, [
        ...(wiki.url ? [{ label: "Read on Wikipedia", href: wiki.url }] : []),
        ...used.slice(0, 1).map(projectLink),
      ]);
    }
  }

  // A specific project?
  if (project && (!intent || ["projects", "best", "about"].includes(intent.id)) && !(techs.length && has(q, [" with ", " using "]))) {
    return projectAnswer(project, has(q, ["detail", "how did", "how does", "architecture", "explain", "in depth"]));
  }

  // A specific technology? ("Does he know PyTorch?", "Has he worked with AWS?", "LangGraph experience?")
  const asksAboutTool = has(q, ["know", " use", "used", "experience with", "experience in", "worked with", "familiar", "proficient", "good at"]);
  const withTool = has(q, [" with ", " using ", " in "]) && ["projects", "experience"].includes(intent && intent.id);
  if (techs.length && (!intent || intent.id === "skills" || asksAboutTool || withTool)) return techAnswer(techs);
  if (asksAboutTool && !techs.length && (!intent || intent.id === "skills")) {
    const m = q.match(/(?:know|use|used|with|in|at)\s+([a-z0-9.+#-]{2,})/);
    const tool = m && !STOP.has(m[1]) && !["it", "ml", "ai", "the", "any", "some"].includes(m[1]) ? m[1] : null;
    if (tool) {
      return A(
        `**${tool.charAt(0).toUpperCase() + tool.slice(1)}** isn't listed on Sarthak's résumé, so I can't confirm it — ask me "what's his tech stack?" to see what is. To check whether he's worked with it, ${CONTACT_INLINE}.`,
        contactLinks
      );
    }
  }
  if (intent) return intent.answer(q);

  // A concept we know, asked about him ("Can he do RAG?")
  const ge = glossaryEntry(question);
  if (ge) {
    const [, title, , slug] = ge;
    const p = slug && PROJECTS.find((x) => x.slug === slug);
    if (p) return A(`Yes — **${title}** shows up in his work on **${p.name}**: ${p.summary}`, [projectLink(p)], { type: "project", slug: p.slug });
    return A(
      `**${title}** isn't listed on Sarthak's résumé. The closest work is his LLM pipelines with **LangGraph and LangChain** in AMRIP-India, which ground every LLM output in source evidence. To ask about ${title} specifically, ${CONTACT_INLINE}.`,
      [projectLink(PROJECTS[0]), ...contactLinks.slice(0, 1)]
    );
  }

  // Anything else we can match in the résumé text?
  const hit = searchChunks(question);
  if (hit) {
    return A(
      `${hit.project ? `From **${hit.project.name}**: ` : ""}${hit.text}`,
      hit.project ? [projectLink(hit.project)] : [],
      hit.project ? { type: "project", slug: hit.project.slug } : null
    );
  }

  // Last resort: try the web for anything that looks like a question about a topic.
  if (!aboutHim && question.trim().split(/\s+/).length <= 8) {
    const wiki = await wikipedia(question.replace(/[?.!]+$/, ""));
    if (wiki) {
      return A(`**${wiki.title}:** ${wiki.text}\n\n_Source: Wikipedia._ If you meant something about Sarthak, try rephrasing — or ${CONTACT_INLINE}.`, [
        ...(wiki.url ? [{ label: "Read on Wikipedia", href: wiki.url }] : []),
      ]);
    }
  }

  return A(`I'm not sure about that one. ${CONTACT}`, contactLinks);
}

export const _test = { bestIntent, findTech, norm };
