import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowUpRight, FiStar } from "react-icons/fi";
import ProjectVisual from "./ProjectVisual";
import "./ProjectPanels.css";

const rise = {
  initial: { opacity: 0, y: 48 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
};

// Highlight projects (with a case study and an illustration) render as full-width editorial panels;
// repos that arrive automatically from GitHub render as quiet index rows.
function ProjectCard({ p, i = 0 }) {
  const ART = { med: "med", mask: "mask", cloud: "cloud", pixel: "pixel", fraud: "fraud" };
  const hasVisual = Boolean(ART[p.art]);

  if (!hasVisual) {
    return (
      <motion.a className="pp-row" href={p.link} target="_blank" rel="noreferrer" data-cursor="View" {...rise}>
        <span className="pp-row-name">{p.name}</span>
        <span className="pp-row-desc">{p.summary}</span>
        <span className="pp-row-meta">
          {p.badge === "New" && <em>New</em>}
          {p.tags.slice(0, 2).join(" · ")}
          {typeof p.stars === "number" && p.stars > 0 && (
            <>
              {" "}
              · <FiStar /> {p.stars}
            </>
          )}
        </span>
        <FiArrowUpRight className="pp-row-arrow" />
      </motion.a>
    );
  }

  const results = (p.metrics || []).map(([v, l]) => (
    <span key={l}>
      <strong>{v}</strong> {l}
    </span>
  ));

  return (
    <motion.article className={`pp-panel ${i % 2 ? "is-flipped" : ""}`} {...rise}>
      <div className="pp-text">
        <h3 className="pp-name">
          {p.slug ? (
            <Link to={`/work/${p.slug}`} data-cursor="Read">
              {p.name}
            </Link>
          ) : (
            p.name
          )}
        </h3>
        <p className="pp-subtitle">
          {p.subtitle} <span>· {p.badge}</span>
        </p>
        <p className="pp-summary">{p.summary}</p>
        {results.length > 0 && <p className="pp-results">{results}</p>}
        <p className="pp-tags">{p.tags.join(" · ")}</p>
        <div className="pp-links">
          {p.slug && (
            <Link to={`/work/${p.slug}`} className="sk-link">
              Read the case study <FiArrowUpRight />
            </Link>
          )}
          {p.repo && (
            <a href={p.link} target="_blank" rel="noreferrer" className="pp-code">
              Code on GitHub
            </a>
          )}
          {p.demo && (
            <a href={p.demo} target="_blank" rel="noreferrer" className="pp-code">
              Live demo
            </a>
          )}
        </div>
      </div>
      <div className="pp-visual">
        <ProjectVisual kind={ART[p.art]} />
      </div>
    </motion.article>
  );
}

export default ProjectCard;
