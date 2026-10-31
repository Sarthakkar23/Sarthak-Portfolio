import React, { Suspense, lazy, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { MaskText, scrollToId } from "../Cinema/Cinema";
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
import portrait from "../../assets/portrait.webp";
import resumePdf from "../../assets/resume/Sarthak Kar Resume.pdf";
import ProjectCard from "../Projects/ProjectCard";
import ContactForm from "./ContactForm";
import useGithubProjects from "../../hooks/useGithubProjects";
import { profile, experience, facts } from "../../data/resume";
import { NowBand, Journey, HomeNotes } from "./HomeExtras";
import config from "../../config";
import "./HomeNew.css";

// three.js only loads with the hero, after the page text has rendered.
const PrescriptionHero = lazy(() => import("./PrescriptionHero"));

const tools = [
  { icon: SiPython, name: "Python" },
  { icon: SiPytorch, name: "PyTorch" },
  { icon: SiScikitlearn, name: "scikit-learn" },
  { icon: SiOpencv, name: "OpenCV" },
  { icon: SiNumpy, name: "NumPy" },
  { icon: SiPandas, name: "pandas" },
  { icon: SiFastapi, name: "FastAPI" },
  { icon: SiFlask, name: "Flask" },
  { icon: SiPostgresql, name: "PostgreSQL" },
  { icon: SiDocker, name: "Docker" },
  { icon: SiAmazonaws, name: "AWS" },
  { icon: SiStreamlit, name: "Streamlit" },
  { icon: SiReact, name: "React" },
  { icon: SiGit, name: "Git" },
];

const expertise = [
  {
    title: "LLM & Document AI Pipelines",
    body: "Agentic LangGraph workflows with verification and human-in-the-loop review, LoRA fine-tuning of small LLMs in 4-bit, and OCR-to-structured-data for real documents.",
    chips: ["LangGraph", "LangChain", "Transformers", "LoRA / PEFT", "LayoutLMv3", "TrOCR"],
  },
  {
    title: "Machine Learning & Deep RL",
    body: "Forecasting, imbalanced classification and reinforcement learning — tuned with Optuna and judged on the metric that matters, not just accuracy.",
    chips: ["PyTorch", "XGBoost", "LightGBM", "Deep Q-Networks", "Optuna", "SMOTE"],
  },
  {
    title: "Computer Vision",
    body: "Image restoration, edge detection and colourisation, optimised to run in real time on CPU.",
    chips: ["OpenCV", "HED", "DeOldify", "PaddleOCR", "Donut", "Pillow"],
  },
  {
    title: "Explainable & Responsible AI",
    body: "SHAP and LIME explanations for non-ML stakeholders, source-grounded LLM outputs, and local-first pipelines that keep sensitive data private.",
    chips: ["SHAP", "LIME", "Isolation Forest", "Splink", "DPDP-aware design"],
  },
  {
    title: "Shipping to Production",
    body: "Models served behind APIs, containerised, tracked and wrapped in dashboards people actually use.",
    chips: ["FastAPI", "Flask", "Docker", "AWS", "MLflow", "Weights & Biases"],
  },
];

const faqs = [
  {
    q: "What roles are you looking for?",
    a: "Applied AI/ML engineering roles — especially work on LLM and document-AI pipelines, computer vision, or ML systems that ship to real users. I graduate in May 2027.",
  },
  {
    q: "What's your strongest area?",
    a: "Building end-to-end ML pipelines: from messy real-world data (phone photos, raw logs, highly imbalanced transactions) to a measured, explainable model served behind an API.",
  },
  {
    q: "What are you building right now?",
    a: "AMRIP-India, my capstone: a 9-stage LangGraph pipeline that converts photographed Indian prescriptions into ABDM-compliant FHIR R4 records, with a verifier that rejects any LLM output it can't trace back to the source image.",
  },
  {
    q: "Do you have industry or research experience?",
    a: "I interned as a Cloud Computing Intern at CTTC Bhubaneswar (AWS: EC2, S3, VPC, load balancing), and co-authored an SSRN preprint on cloud resource optimisation based on my CloudOptima project.",
  },
  {
    q: "Can you work in a team and lead?",
    a: "Yes — I lead sponsorship for Milan, SRMIST's national cultural festival (60,000+ participants from 350 colleges), and for TEDxSRMIST. Two of my ML projects were built in teams of two.",
  },
];

const reveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
};

function HomeNew({ ready = true }) {
  const [activeService, setActiveService] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);
  const { curated, auto, all, status } = useGithubProjects();
  // Highlights, plus the two newest repos so fresh work shows up on the home page too.
  const homeProjects = [...curated, ...auto.slice(0, 2)];

  // Hero: the copy drifts up and fades as you scroll into the work.
  const heroRef = useRef(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const copyY = useTransform(heroP, [0, 1], ["0%", "-18%"]);
  const heroFade = useTransform(heroP, [0, 0.7], [1, 0]);
  const [phase, setPhase] = useState("prescription");

  // The name is set on one line that exactly fills the column, re-fitted on resize.
  const nameRef = useRef(null);
  useEffect(() => {
    const h1 = nameRef.current;
    if (!h1) return undefined;
    const line = h1.querySelector(".lx-name-line");
    const fit = () => {
      h1.style.fontSize = "100px";
      const ratio = h1.clientWidth / line.getBoundingClientRect().width;
      h1.style.fontSize = `${Math.min(100 * ratio, 280)}px`;
      window.dispatchEvent(new Event("lx-name-fit"));
    };
    let alive = true;
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => alive && fit());
    window.addEventListener("resize", fit);
    return () => {
      alive = false;
      window.removeEventListener("resize", fit);
    };
  }, []);

  // Reveal the name. On desktop the ink hero claims it (data-ink) and reveals it once the
  // particles have gathered; everywhere else, or if the hero never loads, it fades in here.
  useEffect(() => {
    const h1 = nameRef.current;
    if (!h1 || !ready) return undefined;
    const soon = setTimeout(() => !h1.dataset.ink && h1.classList.add("is-shown"), 250);
    const failsafe = setTimeout(() => h1.classList.add("is-shown"), 4500);
    return () => {
      clearTimeout(soon);
      clearTimeout(failsafe);
    };
  }, [ready]);

  return (
    <main className="sk-home">
      {/* ---------- HERO ---------- */}
      <section className="lx-hero" id="home" ref={heroRef}>
        <Suspense fallback={<div className="lx-hero-canvas" aria-hidden="true" />}>
          <PrescriptionHero ready={ready} onPhase={setPhase} />
        </Suspense>
        <motion.div className="lx-hero-copy" style={{ y: copyY, opacity: heroFade }}>
          <h1 className="lx-hero-name" ref={nameRef} aria-label="Sarthak Kar, AI and ML engineer">
            <span className="lx-name-line">
              {["Sarthak", "Kar"].map((word, wi) => (
                <span className={`lx-hero-word ${wi === 1 ? "sk-red" : ""}`} key={word}>
                  {word}
                  {/* zero-size marker on the baseline: the ink canvas reads it to draw the name in place */}
                  <span className="lx-baseline" />
                </span>
              ))}
            </span>
            <span className="lx-sign" aria-hidden="true">
              Sarthak
            </span>
          </h1>
          <motion.div
            className="lx-hero-meta"
            initial={{ opacity: 0, y: 16 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="lx-hero-line">
              AI / ML engineer. I build systems that read messy, real-world data and prove what they found.
            </p>
            <div className="lx-hero-actions">
              <button className="sk-btn sk-btn-white" onClick={() => scrollToId("contact")}>
                Get in touch <FiArrowUpRight />
              </button>
              <a className="sk-btn sk-btn-ghost" href={resumePdf} download="Sarthak-Kar-Resume.pdf">
                Résumé <FiDownload />
              </a>
            </div>
            <p className="lx-hero-status">
              <span className="sk-dot" /> Open to applied AI/ML roles · Graduating May 2027
            </p>
          </motion.div>
        </motion.div>
        <motion.p
          className="lx-hero-caption"
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ delay: 1.2, duration: 1 }}
          style={{ opacity: heroFade }}
          aria-live="polite"
        >
          <span className="lx-hero-phase">
            {phase === "record" ? "Verified FHIR record" : phase === "reading" ? "Reading every field" : "Handwritten prescription"}
          </span>
          AMRIP-India, my capstone, turns a photographed prescription into a record a hospital system can trust.
          <em> Synthetic sample.</em>{" "}
          <Link to="/work/amrip-india">See how it works</Link>
        </motion.p>
      </section>

      {/* ---------- LEDE ---------- */}
      <section className="sk-section lx-lede-wrap" aria-label="Selected results">
        <motion.p className="lx-lede" {...reveal}>
          Recent work cut simulated cloud compute cost by <em>34%</em>, caught card fraud at <em>0.83 F1</em> in data
          that is only 0.17% fraud, restored noisy images to <em>31.2 dB</em>, made label-free defect masks <em>30%</em> sharper, and became a co-authored{" "}
          <a href="https://papers.ssrn.com/abstract=6957438" target="_blank" rel="noreferrer">
            SSRN preprint
          </a>
          .
        </motion.p>
      </section>

      {/* ---------- PROJECTS ---------- */}
      <section className="sk-section" id="work">
        <div className="sk-heading-row">
          <MaskText className="sk-heading" lines={["Real problems.", <span className="sk-red">Measured results.</span>]} />
          <span className={`pj-sync is-${status}`}>
            <span className="sk-dot" /> {status === "ready" ? "Synced live with GitHub" : status === "loading" ? "Syncing with GitHub…" : "Highlights"}
          </span>
        </div>
        <div className="sk-projects">
          {homeProjects.map((p, i) => (
            <ProjectCard p={p} i={i} key={p.repo || p.name} />
          ))}
        </div>
        <div className="sk-center">
          <Link to="/project" className="sk-link">
            View all projects <FiArrowUpRight />
          </Link>
        </div>
      </section>

      <NowBand repos={all} />

      {/* ---------- EXPERTISE ---------- */}
      <section className="sk-section sk-services" id="services">
        <motion.div className="sk-services-left" {...reveal}>
          <MaskText className="sk-heading" lines={["What I bring", <>to your <span className="sk-red">team.</span></>]} />
          <p className="sk-muted">Tools I use day to day</p>
          <p className="lx-tools">{tools.map((t) => t.name).join(" · ")}</p>
          <p className="sk-muted sk-langs">Languages: Python, SQL, Java, C/C++, JavaScript, HTML/CSS</p>
        </motion.div>
        <div className="sk-services-right">
          {expertise.map((s, i) => (
            <motion.div
              key={s.title}
              className={`sk-service ${activeService === i ? "is-active" : ""}`}
              onMouseEnter={() => setActiveService(i)}
              onClick={() => setActiveService(i)}
              {...reveal}
              transition={{ ...reveal.transition, delay: i * 0.06 }}
            >
              <h3>
                {s.title}
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

      <Journey />

      {/* ---------- ABOUT ---------- */}
      <section className="sk-section" id="about">
        <MaskText className="sk-heading" lines={["Engineer first.", <span className="sk-red">Always shipping.</span>]} />
        <div className="sk-about">
          <motion.figure className="sk-about-media" {...reveal}>
            <div className="sk-about-photo">
              <img src={portrait} alt="Sarthak Kar" />
            </div>
            <figcaption>
              {profile.name} <span>B.Tech CSE (AI & ML), SRMIST, {profile.location}</span>
            </figcaption>
          </motion.figure>
          <motion.div className="sk-about-text" {...reveal}>
            <p>
              I'm a final-year <b>Computer Science (AI & ML)</b> student at <b>SRM Institute of Science and
              Technology</b>. I like problems where the data is messy and the stakes are real — handwritten
              prescriptions, noisy cloud logs, transactions where fraud is 0.17% of the data.
            </p>
            <p>
              My work spans <b>LLM pipelines</b>, <b>deep reinforcement learning</b>, <b>imbalanced
              classification</b> and <b>computer vision</b>. I care about results I can measure and explain,
              and about shipping models behind real APIs and dashboards.
            </p>
            <p>
              Previously: <b>{experience[0].role}</b> at {experience[0].org}. Outside the code I lead
              sponsorship for SRMIST's national cultural festival and TEDxSRMIST.
            </p>
            <div className="sk-row">
              <Link to="/about" className="sk-btn sk-btn-red">
                Full story <FiArrowUpRight />
              </Link>
              <a href={resumePdf} download="Sarthak-Kar-Resume.pdf" className="sk-btn sk-btn-ghost">
                Download résumé <FiDownload />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <HomeNotes />

      {/* ---------- FAQ ---------- */}
      <section className="sk-section" id="faq">
        <MaskText className="sk-heading" lines={["Quick answers."]} />
        <div className="sk-faq-wrap">
          <div className="sk-faq">
            {faqs.map((f, i) => (
              <div className={`sk-faq-item ${openFaq === i ? "is-open" : ""}`} key={f.q}>
                <button onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
                  <span>
                    {f.q}
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
          <motion.aside className="sk-faq-card" {...reveal}>
            <h3>
              Hiring for <span className="sk-red">AI/ML?</span>
            </h3>
            <dl className="lx-facts">
              {facts.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <p>Everything else is on one page of my résumé, or just say hello.</p>
            <div className="sk-row sk-row-tight">
              <a className="sk-link" href={`mailto:${profile.email}`}>
                Email me <FiArrowUpRight />
              </a>
              <a className="pp-code" href={resumePdf} download="Sarthak-Kar-Resume.pdf">
                Download the résumé
              </a>
            </div>
            <button
              className="sk-faq-twin"
              onClick={() => window.dispatchEvent(new CustomEvent("twin:ask", { detail: "Is Sarthak a fit for an ML engineer role?" }))}
            >
              Or ask my AI twin
            </button>
          </motion.aside>
        </div>
      </section>

      {/* ---------- CONTACT ---------- */}
      <section className="sk-section sk-contact" id="contact">
        <MaskText
          className="sk-heading sk-heading-xl"
          lines={[<>Let's <span className="sk-red">build</span></>, "intelligent things", "together."]}
        />
        <div className="cf-layout">
          <ContactForm />
          <div className="cf-side">
            <button
              className="cf-twin"
              onClick={() => window.dispatchEvent(new CustomEvent("twin:ask"))}
              data-cursor="Ask"
            >
              <span>
                <strong>Just exploring?</strong> Ask my AI twin anything about my work.
              </span>
            </button>
            <div className="sk-contact-grid cf-details">
              <a href={`mailto:${profile.email}`}>
                <span className="sk-muted">Email</span>
                <strong>{profile.email}</strong>
              </a>
              <a href={config.socialMedia.linkedin} target="_blank" rel="noreferrer">
                <span className="sk-muted">LinkedIn</span>
                <strong>in/sarthak-kar</strong>
              </a>
              <div>
                <span className="sk-muted">Elsewhere</span>
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
          </div>
        </div>
      </section>

    </main>
  );
}

export default HomeNew;
