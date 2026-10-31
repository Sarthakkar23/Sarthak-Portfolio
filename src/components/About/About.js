import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { FiArrowUpRight, FiDownload, FiPlus, FiMinus } from "react-icons/fi";
import portrait from "../../assets/portrait.webp";
import resumePdf from "../../assets/resume/Sarthak Kar Resume.pdf";
import { MaskText } from "../Cinema/Cinema";
import config from "../../config";
import {
  profile,
  facts,
  education,
  skills,
  projects,
  publication,
  experience,
  leadership,
  certifications,
  timeline,
} from "../../data/resume";
import "../Home/HomeNew.css";
import "./About.css";

const rise = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
};

function Timeline() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <div className="ab-timeline" ref={ref}>
      <div className="ab-timeline-track" />
      <motion.div className="ab-timeline-fill" style={{ scaleY }} />
      {timeline.map(([when, what], i) => (
        <motion.div
          className={`ab-timeline-row ${i % 2 ? "is-right" : ""}`}
          key={when + what}
          initial={{ opacity: 0, x: i % 2 ? 40 : -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="ab-timeline-dot" />
          <div className="ab-timeline-card">
            <span className="ab-timeline-when">{when}</span>
            <p>{what}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function About() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const photoScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const [openProject, setOpenProject] = useState(0);

  return (
    <main className="sk-home ab-page">
      {/* ---------- Opening ---------- */}
      <section className="ab-hero" ref={heroRef}>
        <div className="ab-hero-text">
          <MaskText
            as="h1"
            className="ab-title"
            lines={["The mind", "behind the", <span className="sk-red">models.</span>]}
          />
          <motion.p className="ab-lead" {...rise} transition={{ ...rise.transition, delay: 0.4 }}>
            {profile.summary}
          </motion.p>
          <motion.div className="sk-row" {...rise} transition={{ ...rise.transition, delay: 0.55 }}>
            <Link to="/resume" className="sk-btn sk-btn-red">
              View resume <FiArrowUpRight />
            </Link>
            <a href={resumePdf} download="Sarthak-Kar-Resume.pdf" className="sk-btn sk-btn-ghost">
              Download PDF <FiDownload />
            </a>
          </motion.div>
        </div>
        <motion.div
          className="ab-portrait"
          initial={{ clipPath: "inset(100% 0% 0% 0% round 28px)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0% round 28px)" }}
          transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
        >
          <motion.img src={portrait} alt="Sarthak Kar" style={{ y: photoY, scale: photoScale }} />
          <div className="ab-portrait-tag">
            <strong>{profile.name}</strong>
            <span>AI/ML Engineer · {profile.location}</span>
          </div>
        </motion.div>
      </section>

      {/* ---------- Quick facts ---------- */}
      <section className="sk-section ab-facts-wrap">
        <div className="ab-facts">
          {facts.map(([k, v], i) => (
            <motion.div key={k} {...rise} transition={{ ...rise.transition, delay: i * 0.06 }}>
              <span>{k}</span>
              <strong>{v}</strong>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="ab-ticker" aria-hidden="true">
        <div className="ab-ticker-track">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k}>
              LLMs <i>✦</i> Computer Vision <i>✦</i> Deep RL <i>✦</i> Document AI <i>✦</i> Explainable AI <i>✦</i>{" "}
              MLOps <i>✦</i>{" "}
            </span>
          ))}
        </div>
      </div>

      {/* ---------- Journey ---------- */}
      <section className="sk-section">
        <MaskText className="sk-heading" lines={["How I got", <span className="sk-red">here.</span>]} />
        <Timeline />
      </section>

      {/* ---------- Education + Experience ---------- */}
      <section className="sk-section ab-two">
        <motion.div className="ab-card" {...rise}>
          <h3>{education.school}</h3>
          <p className="ab-card-sub">
            {education.degree} — {education.spec}
          </p>
          <div className="ab-card-meta">
            <span>{education.where}</span>
            <span>{education.when}</span>
          </div>
        </motion.div>
        {experience.map((e) => (
          <motion.div className="ab-card" key={e.role} {...rise} transition={{ ...rise.transition, delay: 0.1 }}>
            <h3>{e.role}</h3>
            <p className="ab-card-sub">{e.org}</p>
            <p>{e.body}</p>
            <div className="ab-card-meta">
              <span>{e.where}</span>
              <span>{e.when}</span>
            </div>
          </motion.div>
        ))}
      </section>

      {/* ---------- Skills ---------- */}
      <section className="sk-section">
        <MaskText className="sk-heading" lines={["The toolkit", <span className="sk-red">I work with.</span>]} />
        <div className="ab-skills">
          {skills.map(([group, items], i) => (
            <motion.div className="ab-skill-row" key={group} {...rise} transition={{ ...rise.transition, delay: i * 0.05 }}>
              <h4>{group}</h4>
              <div className="sk-chips">
                {items.map((it) => (
                  <span className="sk-chip" key={it}>
                    {it}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------- Projects in depth ---------- */}
      <section className="sk-section">
        <MaskText className="sk-heading" lines={["What I've", <span className="sk-red">built.</span>]} />
        <div className="ab-projects">
          {projects.map((p, i) => {
            const open = openProject === i;
            return (
              <motion.div className={`ab-project ${open ? "is-open" : ""}`} key={p.name} {...rise}>
                <button className="ab-project-head" onClick={() => setOpenProject(open ? -1 : i)}>
                  <span className="ab-project-n">0{i + 1}</span>
                  <span className="ab-project-name">
                    {p.name}
                    <small>{p.title}</small>
                  </span>
                  <span className="ab-project-kind">{p.kind}</span>
                  {open ? <FiMinus /> : <FiPlus />}
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      className="ab-project-body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                    >
                      <p className="ab-project-stack">{p.stack}</p>
                      <ul>
                        {p.points.map((pt) => (
                          <li key={pt}>{pt}</li>
                        ))}
                      </ul>
                      {p.link && (
                        <a href={p.link} target="_blank" rel="noreferrer" className="sk-link">
                          View on GitHub <FiArrowUpRight />
                        </a>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ---------- Publication ---------- */}
      <section className="sk-section">
        <motion.a
          className="ab-pub"
          href={publication.link}
          target="_blank"
          rel="noreferrer"
          data-cursor="Read"
          {...rise}
        >
          <h3>{publication.title}</h3>
          <p>
            {publication.cite} <em>{publication.title}</em> {publication.venue}
          </p>
          <span className="ab-pub-link">
            papers.ssrn.com/abstract=6957438 <FiArrowUpRight />
          </span>
        </motion.a>
      </section>

      {/* ---------- Leadership ---------- */}
      <section className="sk-section">
        <MaskText className="sk-heading" lines={["Beyond the", <span className="sk-red">code.</span>]} />
        <div className="ab-two ab-two-tight">
          {leadership.map((l, i) => (
            <motion.div className="ab-card" key={l.role} {...rise} transition={{ ...rise.transition, delay: i * 0.1 }}>
              <span className="ab-card-when">{l.when}</span>
              <h3>{l.role}</h3>
              <p className="ab-card-sub">{l.org}</p>
              <p>{l.body}</p>
            </motion.div>
          ))}
        </div>
        <motion.div className="ab-certs" {...rise}>
          <h4>Certifications</h4>
          {certifications.map((c) => (
            <span key={c}>{c}</span>
          ))}
        </motion.div>
      </section>

      {/* ---------- GitHub activity ---------- */}
      <section className="sk-section">
        <motion.div className="ab-github" {...rise}>
          <img
            src={`https://ghchart.rshah.org/c96b78/${config.github.username}`}
            alt="Sarthak Kar's GitHub contribution chart"
          />
        </motion.div>
      </section>

      {/* ---------- Closing ---------- */}
      <section className="sk-section sk-contact">
        <MaskText
          className="sk-heading sk-heading-xl"
          lines={["Let's make", <span className="sk-red">something real.</span>]}
        />
        <div className="sk-row">
          <a className="sk-btn sk-btn-red" href={`mailto:${profile.email}`}>
            {profile.email} <FiArrowUpRight />
          </a>
          <a className="sk-btn sk-btn-ghost" href={config.socialMedia.linkedin} target="_blank" rel="noreferrer">
            LinkedIn <FiArrowUpRight />
          </a>
        </div>
      </section>
    </main>
  );
}

export default About;
