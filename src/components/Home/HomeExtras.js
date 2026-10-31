import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { MaskText } from "../Cinema/Cinema";
import { now, timeline, publication, certifications } from "../../data/resume";
import { notes } from "../../data/notes";

const ease = [0.16, 1, 0.3, 1];

const ago = (iso) => {
  const days = Math.floor((Date.now() - new Date(iso)) / 864e5);
  if (days < 1) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? "a month ago" : `${months} months ago`;
};

/* ---------- Now: what I'm on today, plus the last repo I pushed to (live from GitHub) ---------- */
export function NowBand({ repos }) {
  const latest = repos
    .filter((p) => p.pushedAt && p.repo)
    .sort((a, b) => new Date(b.pushedAt) - new Date(a.pushedAt))[0];
  return (
    <section className="sk-section lx-now" aria-label="What I'm working on now">
      <motion.div
        className="lx-now-inner"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1, ease }}
      >
        <p className="lx-now-word">Now</p>
        <p className="lx-now-text">
          <Link to={now.link}>{now.text}</Link>
        </p>
        <p className="lx-now-meta">
          {latest ? (
            <a href={latest.link} target="_blank" rel="noreferrer">
              <span className="sk-dot" /> Last pushed to <em>{latest.repo.replace(/[-_]+/g, " ")}</em> {ago(latest.pushedAt)}
            </a>
          ) : (
            <span>Updated {now.updated}</span>
          )}
        </p>
      </motion.div>
    </section>
  );
}

/* ---------- The road so far: a timeline whose rule is drawn by the scroll ---------- */
export function Journey() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 65%"] });
  const draw = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const linkFor = (when, what) => {
    if (when === "Now") return { to: now.link };
    if (/SSRN/.test(what)) return { href: publication.link };
    return null;
  };
  return (
    <section className="sk-section lx-journey" id="journey">
      <div className="lx-journey-head">
        <MaskText className="sk-heading" lines={["The road", <span className="sk-red">so far.</span>]} />
        <p className="lx-journey-certs">
          Certifications: {certifications.join(" · ")}
        </p>
      </div>
      <ol className="lx-journey-list" ref={ref}>
        <span className="lx-journey-rule" aria-hidden="true">
          <motion.span style={{ scaleY: draw }} />
        </span>
        {timeline.map(([when, what], i) => {
          const link = linkFor(when, what);
          const isNow = when === "Now";
          const body = link ? (
            link.to ? (
              <Link to={link.to}>
                {what} <FiArrowUpRight />
              </Link>
            ) : (
              <a href={link.href} target="_blank" rel="noreferrer">
                {what} <FiArrowUpRight />
              </a>
            )
          ) : (
            what
          );
          return (
            <motion.li
              key={when + what}
              className={`lx-journey-item ${isNow ? "is-now" : ""}`}
              initial={{ opacity: 0, x: 18, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.9, ease, delay: (i % 3) * 0.05 }}
            >
              <span className="lx-journey-node" aria-hidden="true" />
              <span className="lx-journey-when">{when}</span>
              <span className="lx-journey-what">{body}</span>
            </motion.li>
          );
        })}
      </ol>
    </section>
  );
}

/* ---------- Notes: the latest writing, as a ruled index ---------- */
export function HomeNotes() {
  if (!notes.length) return null;
  const fmt = (d) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  return (
    <section className="sk-section lx-notes" id="notes">
      <div className="sk-heading-row">
        <MaskText className="sk-heading" lines={["Notes from", <span className="sk-red">the work.</span>]} />
        <Link to="/notes" className="sk-link">
          All notes <FiArrowUpRight />
        </Link>
      </div>
      <div className="lx-notes-list">
        {notes.slice(0, 3).map((n) => (
          <motion.div
            key={n.slug}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1, ease }}
          >
            <Link to={`/notes/${n.slug}`} className="lx-note" data-cursor="Read">
              <span className="lx-note-date">{fmt(n.date)}</span>
              <span className="lx-note-title">{n.title}</span>
              <span className="lx-note-summary">{n.summary}</span>
              <FiArrowUpRight className="lx-note-arrow" />
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
