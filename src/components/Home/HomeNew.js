import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { MaskText, SceneLabel, scrollToId } from "../Cinema/Cinema";
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
import avatar from "../../assets/avatar.webp";
import portrait from "../../assets/portrait.webp";
import resumePdf from "../../assets/resume/Sarthak Kar Resume.pdf";
import ProjectCard from "../Projects/ProjectCard";
import ContactForm from "./ContactForm";
import useGithubProjects from "../../hooks/useGithubProjects";
import { profile, experience } from "../../data/resume";
import config from "../../config";
import "./HomeNew.css";

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

const impact = [
  ["34%", "lower compute cost", "CloudOptima · Deep Q-Network scheduler"],
  ["0.83", "fraud-class F1", "on data that's 0.17% fraud"],
  ["31.2 dB", "PSNR restoration", "ClearPixel AI on Set14"],
  ["1", "SSRN preprint", "co-authored, Jul 2026"],
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
  const { curated, auto, status } = useGithubProjects();
  // Highlights, plus the two newest repos so fresh work shows up on the home page too.
  const homeProjects = [...curated, ...auto.slice(0, 2)];

  // Hero: the title drifts and shrinks, the avatar rises slower, everything fades as you scroll away.
  const heroRef = useRef(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const titleY = useTransform(heroP, [0, 1], ["0%", "35%"]);
  const titleScale = useTransform(heroP, [0, 1], [1, 0.82]);
  const avatarY = useTransform(heroP, [0, 1], ["0%", "-12%"]);
  const heroFade = useTransform(heroP, [0, 0.75], [1, 0]);
  const glowOpacity = useTransform(heroP, [0, 1], [1, 0.2]);

  // Hero: subtle 3D tilt that follows the mouse.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const tiltY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 80, damping: 20 });
  const tiltX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 80, damping: 20 });
  const onHeroMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <main className="sk-home">
      {/* ---------- HERO ---------- */}
      <section className="sk-hero" id="home" ref={heroRef} onMouseMove={onHeroMove}>
        <motion.div className="sk-hero-glow" style={{ opacity: glowOpacity }} />
        <motion.p
          className="sk-hero-kicker"
          initial={{ opacity: 0, y: 12 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          style={{ opacity: heroFade }}
        >
          Sarthak Kar <span>—</span> AI / ML Engineer
        </motion.p>
        <motion.div className="sk-hero-stage" style={{ y: titleY, scale: titleScale, opacity: heroFade }}>
          <h1 className="sk-hero-title" aria-label="Sarthak Kar, AI/ML Engineer. Think Intelligently.">
            {[
              ["Think", "sk-line-white"],
              ["Intelligently", "sk-line-red"],
            ].map(([word, cls], li) => (
              <span className={`sk-line ${cls}`} key={word} aria-hidden="true">
                {word.split("").map((ch, i) => (
                  <span className="cn-mask" key={i}>
                    <motion.span
                      initial={{ y: "105%" }}
                      animate={ready ? { y: 0 } : { y: "105%" }}
                      transition={{ duration: 1.1, delay: 0.1 + li * 0.18 + i * 0.035, ease: [0.76, 0, 0.24, 1] }}
                    >
                      {ch}
                    </motion.span>
                  </span>
                ))}
              </span>
            ))}
          </h1>
        </motion.div>

        <motion.div
          className="sk-hero-avatar-wrap"
          style={{ y: avatarY, rotateX: tiltX, rotateY: tiltY, transformPerspective: 900 }}
        >
          <motion.img
            src={avatar}
            alt="3D avatar of Sarthak Kar"
            className="sk-hero-avatar"
            initial={{ opacity: 0, scale: 1.15, y: 80, filter: "blur(14px)" }}
            animate={ready ? { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 1.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>

        <motion.div
          className="sk-hero-bottom"
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 1.1 }}
          style={{ opacity: heroFade }}
        >
          <p className="sk-hero-tagline">
            I build <b>LLM pipelines</b>, <b>computer vision</b> <br />
            and <b>ML systems</b> that ship — with <br />
            results you can measure.
          </p>
          <div className="sk-hero-cta">
            <span className="sk-status">
              <span className="sk-dot" /> Open to applied AI/ML roles · Graduating May 2027
            </span>
            <div className="sk-row sk-row-tight">
              <a className="sk-btn sk-btn-ghost" href={resumePdf} download="Sarthak-Kar-Resume.pdf">
                Résumé <FiDownload />
              </a>
              <button className="sk-btn sk-btn-red" onClick={() => scrollToId("contact")}>
                Get in touch <FiArrowUpRight />
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="sk-scroll-cue"
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ delay: 1.6 }}
          style={{ opacity: heroFade }}
        >
          <span>Scroll</span>
          <span className="sk-scroll-line" />
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

      {/* ---------- IMPACT ---------- */}
      <section className="sk-section sk-impact-wrap" aria-label="Impact in numbers">
        <div className="sk-impact">
          {impact.map(([v, l, s], i) => (
            <motion.div key={l} {...reveal} transition={{ ...reveal.transition, delay: i * 0.08 }}>
              <strong>{v}</strong>
              <span>{l}</span>
              <small>{s}</small>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------- PROJECTS ---------- */}
      <section className="sk-section" id="work">
        <SceneLabel n={1}>Selected work</SceneLabel>
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

      {/* ---------- EXPERTISE ---------- */}
      <section className="sk-section sk-services" id="services">
        <motion.div className="sk-services-left" {...reveal}>
          <SceneLabel n={2}>Expertise</SceneLabel>
          <MaskText className="sk-heading" lines={["What I bring", <>to your <span className="sk-red">team.</span></>]} />
          <p className="sk-muted">Tools I use day to day</p>
          <div className="sk-tool-grid">
            {tools.map(({ icon: Icon, name }) => (
              <span className="sk-tool" key={name} title={name}>
                <Icon />
              </span>
            ))}
          </div>
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
        <SceneLabel n={3}>About</SceneLabel>
        <MaskText className="sk-heading" lines={["Engineer first.", <span className="sk-red">Always shipping.</span>]} />
        <div className="sk-about">
          <motion.div className="sk-about-photo" {...reveal}>
            <img src={portrait} alt="Sarthak Kar" />
            <div className="sk-about-card">
              <strong>{profile.name}</strong>
              <span>B.Tech CSE (AI & ML) · SRMIST · {profile.location}</span>
            </div>
          </motion.div>
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
            <div className="sk-stats">
              <div>
                <strong>4</strong>
                <span>End-to-end ML projects</span>
              </div>
              <div>
                <strong>1</strong>
                <span>Research preprint</span>
              </div>
              <div>
                <strong>60K+</strong>
                <span>Attendee festival — sponsorship lead</span>
              </div>
            </div>
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

      {/* ---------- FAQ ---------- */}
      <section className="sk-section" id="faq">
        <SceneLabel n={4}>For recruiters</SceneLabel>
        <MaskText className="sk-heading" lines={["Quick answers."]} />
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
              Hiring for <br />
              AI/ML?
            </h3>
            <p>Everything you need is on one page of my résumé — or just say hello.</p>
            <div className="sk-row sk-row-tight">
              <a className="sk-btn sk-btn-white" href={`mailto:${profile.email}`}>
                Email me <FiArrowUpRight />
              </a>
              <a className="sk-btn sk-btn-outline-white" href={resumePdf} download="Sarthak-Kar-Resume.pdf">
                Résumé <FiDownload />
              </a>
            </div>
            <button
              className="sk-faq-twin"
              onClick={() => window.dispatchEvent(new CustomEvent("twin:ask", { detail: "Is Sarthak a fit for an ML engineer role?" }))}
            >
              Or ask my AI twin →
            </button>
          </motion.div>
        </div>
      </section>

      {/* ---------- CONTACT ---------- */}
      <section className="sk-section sk-contact" id="contact">
        <SceneLabel n={5}>Contact</SceneLabel>
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
              <img src={avatar} alt="" />
              <span>
                <strong>Just exploring?</strong>
                <small>Ask my AI twin anything about my work →</small>
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
