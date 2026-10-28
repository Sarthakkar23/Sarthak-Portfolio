import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FiArrowUpRight, FiStar, FiExternalLink } from "react-icons/fi";

function ProjectArt({ kind }) {
  return (
    <div className={`sk-art sk-art-${kind}`} aria-hidden="true">
      <div className="sk-art-grid" />
      <div className="sk-art-orb" />
      <div className="sk-art-orb sk-art-orb-2" />
    </div>
  );
}

function ProjectCard({ p, i = 0 }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const artY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <motion.article
      ref={ref}
      className={`sk-project ${p.badge === "New" ? "is-new" : ""}`}
      data-cursor="View"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: (i % 2) * 0.12 }}
    >
      <a className="sk-project-stretch" href={p.link} target="_blank" rel="noreferrer" aria-label={`${p.name} on GitHub`} />
      <motion.div
        className="sk-project-media"
        initial={{ clipPath: "inset(18% 10% 18% 10% round 24px)" }}
        whileInView={{ clipPath: "inset(0% 0% 0% 0% round 0px)" }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.3, ease: [0.76, 0, 0.24, 1], delay: 0.1 + (i % 2) * 0.12 }}
      >
        <motion.div className="sk-art-parallax" style={{ y: artY }}>
          <ProjectArt kind={p.art} />
        </motion.div>
        <span className="sk-project-badge">{p.badge}</span>
        <span className="sk-project-title-overlay">{p.name}</span>
        <span className="sk-project-arrow">
          <FiArrowUpRight />
        </span>
      </motion.div>
      <div className="sk-project-meta">
        <h3>
          {p.name} <small>{p.subtitle}</small>
        </h3>
        <p className="sk-project-desc">{p.summary}</p>
        {p.metrics && (
          <div className="sk-metrics">
            {p.metrics.map(([v, l]) => (
              <div key={l}>
                <strong>{v}</strong>
                <span>{l}</span>
              </div>
            ))}
          </div>
        )}
        <div className="sk-project-foot">
          <p className="sk-project-tags">{p.tags.join(" · ")}</p>
          <div className="sk-project-links">
            {typeof p.stars === "number" && p.stars > 0 && (
              <span className="sk-project-stars">
                <FiStar /> {p.stars}
              </span>
            )}
            {p.demo && (
              <a href={p.demo} target="_blank" rel="noreferrer" className="sk-project-demo" data-cursor="Demo">
                Live demo <FiExternalLink />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default ProjectCard;
