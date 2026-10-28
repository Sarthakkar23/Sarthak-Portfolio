import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  SiPython,
  SiPytorch,
  SiScikitlearn,
  SiOpencv,
  SiNumpy,
  SiFlask,
  SiFastapi,
  SiPostgresql,
  SiDocker,
  SiAmazonaws,
  SiStreamlit,
  SiReact,
  SiPandas,
  SiGit,
} from "react-icons/si";
import { AiFillGithub, AiFillInstagram } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
import { FiArrowUpRight, FiPlus, FiMinus, FiDownload } from "react-icons/fi";
import avatar from "../../assets/homedown.png";
import resumePdf from "../../assets/resume/Sarthak Kar Resume.pdf";
import config from "../../config";
import "./HomeNew.css";

const EMAIL = "sarthakkar05@gmail.com";

const tools = [
  { icon: SiPython, name: "Python" },
  { icon: SiPytorch, name: "PyTorch" },
  { icon: SiNumpy, name: "NumPy" },
  { icon: SiFlask, name: "Flask" },
  { icon: SiScikitlearn, name: "scikit-learn" },
  { icon: SiOpencv, name: "OpenCV" },
  { icon: SiPandas, name: "pandas" },
  { icon: SiFastapi, name: "FastAPI" },
  { icon: SiPostgresql, name: "PostgreSQL" },
  { icon: SiDocker, name: "Docker" },
  { icon: SiAmazonaws, name: "AWS" },
  { icon: SiStreamlit, name: "Streamlit" },
  { icon: SiReact, name: "React" },
  { icon: SiGit, name: "Git" },
];

const projects = [
  {
    name: "AMRIP-India",
    subtitle: "AI-Centric Medical Record Interoperability Platform",
    badge: "Capstone · In progress",
    tags: ["LangGraph", "LoRA / PEFT", "LayoutLMv3", "TrOCR", "FastAPI"],
    description:
      "A 9-stage pipeline that turns phone photos of Indian prescriptions and lab reports into ABDM-compliant FHIR R4 records — OCR, handwriting recognition, clinical NER and a LoRA-tuned LLM with a verifier-and-repair loop.",
    metrics: [
      ["9", "pipeline stages"],
      ["2.5L", "medicine brands"],
      ["4-bit", "LoRA fine-tune"],
    ],
    link: config.socialMedia.github,
    art: "med",
  },
  {
    name: "CloudOptima",
    subtitle: "Multi-Cloud Resource Orchestrator",
    badge: "Published · SSRN",
    tags: ["PyTorch DQN", "XGBoost", "Optuna", "SHAP / LIME"],
    description:
      "A Deep Q-Network decides which VM each task goes to, with workload forecasting, anomaly-based failover and an explainable Streamlit dashboard.",
    metrics: [
      ["34%", "less compute cost"],
      ["0.89", "R² CPU forecast"],
      ["99.2%", "availability"],
    ],
    link: "https://github.com/Sarthakkar23/Cloud-Resource-Optimizer",
    art: "cloud",
  },
  {
    name: "ClearPixel AI",
    subtitle: "Digital Image Restoration Suite",
    badge: "Personal project",
    tags: ["OpenCV", "Flask", "NumPy", "DeOldify"],
    description:
      "Restoration, HED edge detection and DeOldify colourisation behind one Flask API, vectorised to run fast on CPU.",
    metrics: [
      ["31.2dB", "PSNR on Set14"],
      ["0.914", "SSIM"],
      ["<140ms", "per 1080p frame"],
    ],
    link: "https://github.com/Sarthakkar23/Clear-Pixel-AI",
    art: "pixel",
  },
  {
    name: "Fraud Detection",
    subtitle: "Credit Card Fraud Detection",
    badge: "Personal project",
    tags: ["XGBoost", "SMOTE", "scikit-learn"],
    description:
      "Tuned XGBoost with SMOTE and class weights on 284,807 transactions where only 0.17% are fraud — fast enough for a live payment check.",
    metrics: [
      ["0.83", "fraud-class F1"],
      ["86.4%", "precision"],
      ["3.8ms", "per transaction"],
    ],
    link: config.socialMedia.github,
    art: "fraud",
  },
];

const services = [
  {
    title: "LLMs & NLP",
    body: "Agentic pipelines with LangGraph, LoRA fine-tuning of small LLMs in 4-bit, and clinical NER on Indian-language text.",
    chips: ["LangGraph", "LangChain", "Transformers", "LoRA / PEFT", "Qwen2.5", "Llama 3.2"],
  },
  {
    title: "Machine & Deep Learning",
    body: "From imbalanced classification to deep reinforcement learning — tuned, evaluated and explained.",
    chips: ["PyTorch", "XGBoost", "LightGBM", "Deep Q-Networks", "Optuna", "SMOTE"],
  },
  {
    title: "Vision & OCR",
    body: "Layout-aware document understanding, handwriting recognition and image restoration.",
    chips: ["OpenCV", "LayoutLMv3", "TrOCR", "Donut", "PaddleOCR", "DeOldify"],
  },
  {
    title: "Data & Explainable AI",
    body: "Clean data pipelines, record linkage and explanations people without an ML background can follow.",
    chips: ["pandas", "PostgreSQL", "DuckDB", "Splink", "SHAP", "LIME"],
  },
  {
    title: "Cloud & Serving",
    body: "Shipping models as real products: APIs, containers, dashboards and AWS infrastructure.",
    chips: ["AWS", "FastAPI", "Flask", "Docker", "Streamlit", "MLflow"],
  },
];

const timeline = [
  {
    when: "Dec 2025 – Jan 2026",
    title: "Cloud Computing Intern",
    where: "Central Tool Room & Training Centre (CTTC), Bhubaneswar",
    body: "Hands-on AWS programme — EC2, S3, VPC networking and load balancing on CTTC's server infrastructure.",
  },
  {
    when: "Jul 2026",
    title: "Co-author, SSRN preprint",
    where: "Cloud Computing Resource Optimizer",
    body: "Sahoo, A. A., & Kar, S. (2026). 7 pp.",
    link: "https://papers.ssrn.com/abstract=6957438",
  },
  {
    when: "Sep 2024 – present",
    title: "Committee Head, Sponsorship",
    where: "Directorate of Student Affairs, SRMIST",
    body: "Sponsorship and logistics for Milan (60,000+ participants, 350 colleges). Brought in AJIO for ₹2 lakh in coupons; vendor stalls generated ₹1.2 lakh.",
  },
  {
    when: "Jul 2025 – present",
    title: "Lead, Sponsorship",
    where: "TEDxSRMIST",
    body: "Own sponsorship outreach and speaker acquisition; secured a ₹50,000 sponsorship and brought a speaker on board.",
  },
];

const faqs = [
  {
    q: "What kind of roles are you looking for?",
    a: "Applied AI/ML engineering roles and internships — especially work involving LLMs, document AI, computer vision or ML systems that ship to real users.",
  },
  {
    q: "What are you working on right now?",
    a: "AMRIP-India, my capstone: a LoRA-tuned LLM pipeline that converts photographed Indian prescriptions into standards-validated FHIR health records, built as a LangGraph state graph with a verifier-and-repair loop.",
  },
  {
    q: "Where do you study?",
    a: "I'm a final-year B.Tech Computer Science & Engineering student at SRM Institute of Science and Technology, Kattankulathur, specialising in AI and Machine Learning (2023 – May 2027).",
  },
  {
    q: "Can you take a model from notebook to product?",
    a: "Yes — that's the part I enjoy most. My projects ship behind FastAPI or Flask, run in Docker, and come with dashboards (Streamlit, React) and explanations (SHAP, LIME).",
  },
  {
    q: "Do you have published work?",
    a: "I co-authored “Cloud Computing Resource Optimizer”, an SSRN preprint (July 2026) based on my CloudOptima project.",
  },
];

const reveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
};

function ProjectArt({ kind }) {
  return (
    <div className={`sk-art sk-art-${kind}`} aria-hidden="true">
      <div className="sk-art-grid" />
      <div className="sk-art-orb" />
      <div className="sk-art-orb sk-art-orb-2" />
    </div>
  );
}

function HomeNew() {
  const [activeService, setActiveService] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <main className="sk-home">
      {/* ---------- HERO ---------- */}
      <section className="sk-hero" id="home">
        <div className="sk-hero-glow" />
        <h1 className="sk-hero-title">
          <motion.span
            className="sk-line sk-line-white"
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.3, ease: [0.22, 1, 0.36, 1] }}
          >
            Think
          </motion.span>
          <motion.span
            className="sk-line sk-line-red"
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.45, ease: [0.22, 1, 0.36, 1] }}
          >
            Intelligently
          </motion.span>
        </h1>

        <motion.img
          src={avatar}
          alt="Sarthak Kar avatar"
          className="sk-hero-avatar"
          initial={{ opacity: 0, scale: 0.85, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />

        <motion.div
          className="sk-hero-bottom"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.9 }}
        >
          <p className="sk-hero-tagline">
            AI/ML engineer in the making — <br />
            I build LLM pipelines, vision <br />
            systems and ML that ships.
          </p>
          <div className="sk-hero-cta">
            <span className="sk-status">
              <span className="sk-dot" /> Open to AI/ML roles
            </span>
            <a className="sk-btn sk-btn-red" href="#contact">
              Let's talk <FiArrowUpRight />
            </a>
          </div>
        </motion.div>

        <div className="sk-marquee" aria-label="Tools I use">
          <div className="sk-marquee-track">
            {[...tools, ...tools].map(({ icon: Icon, name }, i) => (
              <span className="sk-marquee-item" key={i}>
                <Icon /> {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- PROJECTS ---------- */}
      <section className="sk-section" id="work">
        <motion.h2 className="sk-heading" {...reveal}>
          Latest <span className="sk-red">Projects</span>
        </motion.h2>
        <div className="sk-projects">
          {projects.map((p, i) => (
            <motion.a
              href={p.link}
              target="_blank"
              rel="noreferrer"
              className="sk-project"
              key={p.name}
              {...reveal}
              transition={{ ...reveal.transition, delay: (i % 2) * 0.1 }}
            >
              <div className="sk-project-media">
                <ProjectArt kind={p.art} />
                <span className="sk-project-badge">{p.badge}</span>
                <span className="sk-project-title-overlay">{p.name}</span>
                <span className="sk-project-arrow">
                  <FiArrowUpRight />
                </span>
              </div>
              <div className="sk-project-meta">
                <h3>
                  {p.name} <small>{p.subtitle}</small>
                </h3>
                <p className="sk-project-desc">{p.description}</p>
                <div className="sk-metrics">
                  {p.metrics.map(([v, l]) => (
                    <div key={l}>
                      <strong>{v}</strong>
                      <span>{l}</span>
                    </div>
                  ))}
                </div>
                <p className="sk-project-tags">{p.tags.join(" · ")}</p>
              </div>
            </motion.a>
          ))}
        </div>
        <div className="sk-center">
          <Link to="/project" className="sk-link">
            View all my projects <FiArrowUpRight />
          </Link>
        </div>
      </section>

      {/* ---------- SERVICES / SKILLS ---------- */}
      <section className="sk-section sk-services" id="services">
        <motion.div className="sk-services-left" {...reveal}>
          <h2 className="sk-heading">
            What I help <br />
            you <span className="sk-red">Build…</span>
          </h2>
          <p className="sk-muted">Tools that I use</p>
          <div className="sk-tool-grid">
            {tools.map(({ icon: Icon, name }) => (
              <span className="sk-tool" key={name} title={name}>
                <Icon />
              </span>
            ))}
          </div>
          <p className="sk-muted sk-langs">
            Languages: Python, SQL, Java, C/C++, JavaScript, HTML/CSS
          </p>
        </motion.div>
        <div className="sk-services-right">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              className={`sk-service ${activeService === i ? "is-active" : ""}`}
              onMouseEnter={() => setActiveService(i)}
              onClick={() => setActiveService(i)}
              {...reveal}
              transition={{ ...reveal.transition, delay: i * 0.06 }}
              style={{ "--tilt": `${(i % 2 ? 1 : -1) * 1.2}deg` }}
            >
              <h3>
                <span className="sk-service-num">0{i + 1}</span> {s.title}
              </h3>
              <p>{s.body}</p>
              <div className="sk-chips">
                {s.chips.map((c) => (
                  <span className="sk-chip" key={c}>
                    {c}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------- ABOUT ---------- */}
      <section className="sk-section" id="about">
        <motion.h2 className="sk-heading" {...reveal}>
          Building systems <br />
          <span className="sk-red">that make sense.</span>
        </motion.h2>
        <div className="sk-about">
          <motion.div className="sk-about-photo" {...reveal}>
            <img src={avatar} alt="Sarthak Kar" />
            <div className="sk-about-card">
              <strong>Sarthak Kar</strong>
              <span>B.Tech CSE (AI/ML) · SRMIST · Chennai, India</span>
            </div>
          </motion.div>
          <motion.div className="sk-about-text" {...reveal}>
            <p>
              I'm a final-year <b>B.Tech Computer Science</b> student at <b>SRM Institute of Science
              and Technology</b>, specialising in <b>AI/ML</b>. Right now I'm building a LoRA-tuned LLM
              pipeline that converts photographed Indian prescriptions into standards-validated FHIR
              health records.
            </p>
            <p>
              I've shipped projects in <b>deep reinforcement learning</b>, <b>imbalanced
              classification</b> and <b>computer vision</b>, and co-authored an SSRN preprint on
              multi-cloud resource optimisation. Outside the code, I lead sponsorship for SRMIST's
              national cultural festival and TEDxSRMIST.
            </p>
            <div className="sk-stats">
              <div>
                <strong>4+</strong>
                <span>Shipped projects</span>
              </div>
              <div>
                <strong>1</strong>
                <span>Published preprint</span>
              </div>
              <div>
                <strong>60K+</strong>
                <span>Festival attendees managed</span>
              </div>
            </div>
            <div className="sk-row">
              <Link to="/resume" className="sk-btn sk-btn-red">
                View resume <FiArrowUpRight />
              </Link>
              <a href={resumePdf} download="Sarthak-Kar-Resume.pdf" className="sk-btn sk-btn-ghost">
                Download PDF <FiDownload />
              </a>
            </div>
          </motion.div>
        </div>

        <motion.h3 className="sk-subheading" {...reveal}>
          My <span className="sk-red">journey</span>
        </motion.h3>
        <div className="sk-timeline">
          {timeline.map((t, i) => (
            <motion.div
              className="sk-timeline-item"
              key={t.title}
              {...reveal}
              transition={{ ...reveal.transition, delay: i * 0.06 }}
            >
              <span className="sk-timeline-when">{t.when}</span>
              <h4>{t.title}</h4>
              <span className="sk-timeline-where">{t.where}</span>
              <p>
                {t.body}{" "}
                {t.link && (
                  <a href={t.link} target="_blank" rel="noreferrer" className="sk-red">
                    Read paper <FiArrowUpRight />
                  </a>
                )}
              </p>
            </motion.div>
          ))}
        </div>
        <p className="sk-muted sk-certs">
          Certifications: Cloud Computing — CTTC (Jan 2026) · JPMorgan Chase & Co. Virtual Job
          Simulation — Forage
        </p>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="sk-section" id="faq">
        <motion.h2 className="sk-heading" {...reveal}>
          FAQs
        </motion.h2>
        <div className="sk-faq-wrap">
          <div className="sk-faq">
            {faqs.map((f, i) => (
              <div className={`sk-faq-item ${openFaq === i ? "is-open" : ""}`} key={f.q}>
                <button onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
                  <span>
                    <span className="sk-faq-num">0{i + 1}</span> {f.q}
                  </span>
                  {openFaq === i ? <FiMinus /> : <FiPlus />}
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {f.a}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
          <motion.div className="sk-faq-card" {...reveal}>
            <img src={avatar} alt="" />
            <h3>
              Hiring or building <br />
              something cool?
            </h3>
            <p>I'm looking for applied AI/ML engineering roles. Let's talk about what you're working on.</p>
            <a className="sk-btn sk-btn-white" href={`mailto:${EMAIL}`}>
              Email me <FiArrowUpRight />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ---------- CONTACT ---------- */}
      <section className="sk-section sk-contact" id="contact">
        <motion.h2 className="sk-heading sk-heading-xl" {...reveal}>
          Let's <span className="sk-red">build</span> <br />
          intelligent things together.
        </motion.h2>
        <div className="sk-contact-grid">
          <a href={`mailto:${EMAIL}`}>
            <span className="sk-muted">Email</span>
            <strong>{EMAIL}</strong>
          </a>
          <a href={config.socialMedia.linkedin} target="_blank" rel="noreferrer">
            <span className="sk-muted">LinkedIn</span>
            <strong>Sarthak Kar</strong>
          </a>
          <div>
            <span className="sk-muted">Social</span>
            <div className="sk-socials">
              <a href={config.socialMedia.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                <AiFillGithub />
              </a>
              <a href={config.socialMedia.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <FaLinkedinIn />
              </a>
              <a href={config.socialMedia.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                <AiFillInstagram />
              </a>
            </div>
          </div>
        </div>
      </section>

      <a className="sk-float-cta" href="#contact">
        <img src={avatar} alt="" />
        <span>
          <strong>Speak to me</strong>
          <small>Email or LinkedIn</small>
        </span>
      </a>
    </main>
  );
}

export default HomeNew;
