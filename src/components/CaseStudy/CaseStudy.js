import React from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiArrowRight, FiArrowUpRight, FiGithub, FiCornerUpLeft } from "react-icons/fi";
import { caseStudies, caseStudyOrder } from "../../data/caseStudies";
import { curatedProjects } from "../../data/projects";
import { MaskText, SceneLabel } from "../Cinema/Cinema";
import config from "../../config";
import "../Home/HomeNew.css";
import "../About/About.css";
import "./CaseStudy.css";

const rise = {
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
};

function Pipeline({ diagram }) {
  return (
    <figure className="cs-diagram">
      <div className="cs-flow" role="list">
        {diagram.stages.map((s, i) => (
          <React.Fragment key={s.label}>
            {i > 0 && (
              <motion.span
                className="cs-arrow"
                aria-hidden="true"
                initial={{ scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.12 }}
              />
            )}
            <motion.div
              role="listitem"
              className={`cs-node ${s.kind ? `is-${s.kind}` : ""}`}
              initial={{ opacity: 0, y: 24, scale: 0.94 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="cs-node-n">{String(i + 1).padStart(2, "0")}</span>
              <strong>{s.label}</strong>
              <span>{s.detail}</span>
              {s.loop && (
                <em className="cs-loop">
                  <FiCornerUpLeft /> {s.loop}
                </em>
              )}
            </motion.div>
          </React.Fragment>
        ))}
      </div>
      <figcaption>{diagram.caption}</figcaption>
    </figure>
  );
}

function CaseStudy() {
  const { slug } = useParams();
  const cs = caseStudies[slug];
  if (!cs) return <Navigate to="/project" replace />;

  const project = curatedProjects.find((p) => p.slug === slug);
  const repoUrl = project && project.repo ? `https://github.com/${config.github.username}/${project.repo}` : null;
  const idx = caseStudyOrder.indexOf(slug);
  const prev = caseStudies[caseStudyOrder[(idx - 1 + caseStudyOrder.length) % caseStudyOrder.length]];
  const nextSlug = caseStudyOrder[(idx + 1) % caseStudyOrder.length];
  const prevSlug = caseStudyOrder[(idx - 1 + caseStudyOrder.length) % caseStudyOrder.length];
  const next = caseStudies[nextSlug];

  return (
    <main className="sk-home cs-page">
      {/* ---------- Title card ---------- */}
      <section className={`cs-hero sk-art-${cs.art}`}>
        <div className="sk-art-grid" />
        <div className="sk-art-orb" />
        <div className="sk-art-orb sk-art-orb-2" />
        <div className="cs-hero-inner">
          <Link to="/project" className="cs-back">
            <FiArrowLeft /> All projects
          </Link>
          <SceneLabel n={idx + 1}>Case study</SceneLabel>
          <MaskText as="h1" className="cs-name" lines={[cs.name]} />
          <motion.p className="cs-title" {...rise} transition={{ ...rise.transition, delay: 0.3 }}>
            {cs.title}
          </motion.p>
          <motion.div className="cs-meta" {...rise} transition={{ ...rise.transition, delay: 0.45 }}>
            <span>{cs.role}</span>
            <div className="sk-row sk-row-tight">
              {repoUrl && (
                <a className="sk-btn sk-btn-ghost" href={repoUrl} target="_blank" rel="noreferrer">
                  <FiGithub /> Code
                </a>
              )}
              {cs.paper && (
                <a className="sk-btn sk-btn-red" href={cs.paper} target="_blank" rel="noreferrer">
                  Read the paper <FiArrowUpRight />
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------- At a glance ---------- */}
      <section className="sk-section cs-glance">
        <div className="sk-impact">
          {cs.results.metrics.map(([v, l], i) => (
            <motion.div key={l} {...rise} transition={{ ...rise.transition, delay: i * 0.08 }}>
              <strong>{v}</strong>
              <small>{l}</small>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------- Problem ---------- */}
      <section className="sk-section cs-two">
        <div>
          <SceneLabel n={1}>The problem</SceneLabel>
          <MaskText className="sk-heading" lines={["Why it", <span className="sk-red">matters.</span>]} />
        </div>
        <div className="cs-prose">
          {cs.problem.map((p) => (
            <motion.p key={p} {...rise}>
              {p}
            </motion.p>
          ))}
        </div>
      </section>

      {/* ---------- Diagram ---------- */}
      <section className="sk-section">
        <SceneLabel n={2}>Architecture</SceneLabel>
        <MaskText className="sk-heading" lines={["How it", <span className="sk-red">works.</span>]} />
        <Pipeline diagram={cs.diagram} />
      </section>

      {/* ---------- Approach ---------- */}
      <section className="sk-section">
        <SceneLabel n={3}>Approach</SceneLabel>
        <MaskText className="sk-heading" lines={["Key", <span className="sk-red">decisions.</span>]} />
        <div className="cs-decisions">
          {cs.approach.map(([h, b], i) => (
            <motion.div className="ab-card" key={h} {...rise} transition={{ ...rise.transition, delay: (i % 2) * 0.08 }}>
              <span className="cs-dec-n">{String(i + 1).padStart(2, "0")}</span>
              <h3>{h}</h3>
              <p>{b}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------- Results ---------- */}
      <section className="sk-section cs-two">
        <div>
          <SceneLabel n={4}>Results</SceneLabel>
          <MaskText className="sk-heading" lines={["What it", <span className="sk-red">achieved.</span>]} />
        </div>
        <div className="cs-prose">
          <ul className="cs-results">
            {cs.results.metrics.map(([v, l]) => (
              <motion.li key={l} {...rise}>
                <strong>{v}</strong> {l}
              </motion.li>
            ))}
          </ul>
          {cs.results.notes.map((n) => (
            <motion.p className="cs-note" key={n} {...rise}>
              {n}
            </motion.p>
          ))}
        </div>
      </section>

      {/* ---------- Next ---------- */}
      <section className="sk-section cs-two">
        <div>
          <SceneLabel n={5}>What's next</SceneLabel>
          <MaskText className="sk-heading" lines={["Where I'd", <span className="sk-red">take it.</span>]} />
        </div>
        <ol className="cs-next">
          {cs.next.map((n, i) => (
            <motion.li key={n} {...rise} transition={{ ...rise.transition, delay: i * 0.06 }}>
              {n}
            </motion.li>
          ))}
        </ol>
      </section>

      {/* ---------- Stack ---------- */}
      <section className="sk-section">
        <SceneLabel n={6}>Stack</SceneLabel>
        <div className="sk-chips cs-stack">
          {cs.stack.map((t) => (
            <span className="sk-chip" key={t}>
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* ---------- Prev / next ---------- */}
      <nav className="sk-section cs-pager" aria-label="More case studies">
        <Link to={`/work/${prevSlug}`} className="cs-pager-link">
          <span>
            <FiArrowLeft /> Previous
          </span>
          <strong>{prev.name}</strong>
        </Link>
        <Link to={`/work/${nextSlug}`} className="cs-pager-link is-next">
          <span>
            Next <FiArrowRight />
          </span>
          <strong>{next.name}</strong>
        </Link>
      </nav>
    </main>
  );
}

export default CaseStudy;
