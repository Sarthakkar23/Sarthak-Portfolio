import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import ProjectCard from "./ProjectCard";
import useGithubProjects from "../../hooks/useGithubProjects";
import { MaskText } from "../Cinema/Cinema";
import config from "../../config";
import "../Home/HomeNew.css";
import "../About/About.css";
import "./Projects.css";

const FILTERS = ["All", "LLMs", "Vision", "ML Systems", "Web"];

function Projects() {
  const { all, auto, status } = useGithubProjects();
  const [filter, setFilter] = useState("All");
  const available = FILTERS.filter((f) => f === "All" || all.some((p) => p.category === f));
  const shown = filter === "All" ? all : all.filter((p) => p.category === filter);

  return (
    <main className="sk-home pj-page">
      <section className="sk-section pj-head">
        <MaskText
          as="h1"
          className="ab-title pj-title"
          lines={["Real problems.", <span className="sk-red">Measured results.</span>]}
        />
        <motion.p
          className="pj-lead"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Highlighted work with the numbers behind it, followed by everything else on my GitHub — this page
          syncs with my repositories automatically, so new projects appear here as soon as I publish them.
        </motion.p>
        <div className="pj-bar">
          <div className="pj-filters" role="tablist">
            {available.map((f) => (
              <button
                key={f}
                role="tab"
                aria-selected={filter === f}
                className={filter === f ? "is-active" : ""}
                onClick={() => setFilter(f)}
              >
                {f}
                <span>{f === "All" ? all.length : all.filter((p) => p.category === f).length}</span>
              </button>
            ))}
          </div>
          <span className={`pj-sync is-${status}`}>
            <span className="sk-dot" />
            {status === "loading" && "Syncing with GitHub…"}
            {status === "ready" && `Live from GitHub · ${auto.length} more repo${auto.length === 1 ? "" : "s"}`}
            {status === "error" && "GitHub is rate-limiting — showing highlights"}
          </span>
        </div>
      </section>

      <section className="sk-section pj-grid-wrap">
        <div className="sk-projects">
          {shown.map((p, i) => (
            <ProjectCard p={p} i={i} key={p.repo || p.name} />
          ))}
        </div>
        <div className="sk-center">
          <a className="sk-link" href={config.socialMedia.github} target="_blank" rel="noreferrer">
            See everything on GitHub <FiArrowUpRight />
          </a>
        </div>
      </section>
    </main>
  );
}

export default Projects;
