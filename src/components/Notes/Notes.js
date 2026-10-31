import React from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion";
import { FiArrowLeft, FiArrowUpRight } from "react-icons/fi";
import { notes } from "../../data/notes";
import { MaskText } from "../Cinema/Cinema";
import "../Home/HomeNew.css";
import "../About/About.css";
import "../Projects/Projects.css";
import "../CaseStudy/CaseStudy.css";
import "./Notes.css";

const fmt = (d) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
const minutes = (body) => Math.max(1, Math.round(body.split(/\s+/).length / 220));

// Inline: [links](url), **bold**, *italic*, `code`
function inline(text, key = "i") {
  const out = [];
  const re = /(\[([^\]]+)\]\(([^)]+)\))|(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(`([^`]+)`)/g;
  let last = 0;
  let m;
  let n = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const k = `${key}-${n++}`;
    if (m[1]) {
      const external = /^https?:/.test(m[3]);
      out.push(
        <a key={k} href={m[3]} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
          {inline(m[2], k)}
        </a>
      );
    } else if (m[4]) out.push(<strong key={k}>{m[5]}</strong>);
    else if (m[6]) out.push(<em key={k}>{m[7]}</em>);
    else if (m[8]) out.push(<code key={k}>{m[9]}</code>);
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

// Block-level Markdown subset — enough for writing notes without a dependency.
function Markdown({ source }) {
  const lines = source.trim().split("\n");
  const blocks = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
    } else if (line.startsWith("```")) {
      const code = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) code.push(lines[i++]);
      i++;
      blocks.push(
        <pre key={blocks.length}>
          <code>{code.join("\n")}</code>
        </pre>
      );
    } else if (line.startsWith("## ")) {
      blocks.push(<h2 key={blocks.length}>{inline(line.slice(3))}</h2>);
      i++;
    } else if (line.startsWith("> ")) {
      blocks.push(<blockquote key={blocks.length}>{inline(line.slice(2))}</blockquote>);
      i++;
    } else if (/^(- |\d+\. )/.test(line)) {
      const ordered = /^\d+\. /.test(line);
      const items = [];
      while (i < lines.length && /^(- |\d+\. )/.test(lines[i])) items.push(lines[i++].replace(/^(- |\d+\. )/, ""));
      const Tag = ordered ? "ol" : "ul";
      blocks.push(
        <Tag key={blocks.length}>
          {items.map((it, j) => (
            <li key={j}>{inline(it, `l${j}`)}</li>
          ))}
        </Tag>
      );
    } else {
      const para = [];
      while (i < lines.length && lines[i].trim() && !/^(## |> |- |\d+\. |```)/.test(lines[i])) para.push(lines[i++]);
      blocks.push(<p key={blocks.length}>{inline(para.join(" "))}</p>);
    }
  }
  return <div className="nt-body">{blocks}</div>;
}

export function NotesIndex() {
  return (
    <main className="sk-home nt-page">
      <section className="sk-section nt-head">
        <MaskText as="h1" className="ab-title" lines={["Notes &", <span className="sk-red">write-ups.</span>]} />
        <p className="pj-lead nt-lead">
          Longer explanations of how and why I built things — the decisions behind the projects, in plain language.
        </p>
      </section>
      <section className="sk-section nt-list">
        {notes.map((n, i) => (
          <motion.div
            key={n.slug}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link to={`/notes/${n.slug}`} className="nt-item" data-cursor="Read">
              <div className="nt-item-meta">
                <span>{fmt(n.date)}</span>
                <span>{minutes(n.body)} min read</span>
              </div>
              <h2>{n.title}</h2>
              <p>{n.summary}</p>
              <div className="sk-chips">
                {n.tags.map((t) => (
                  <span className="sk-chip" key={t}>
                    {t}
                  </span>
                ))}
              </div>
              <span className="nt-arrow">
                <FiArrowUpRight />
              </span>
            </Link>
          </motion.div>
        ))}
      </section>
    </main>
  );
}

export function NotePage() {
  const { slug } = useParams();
  const note = notes.find((n) => n.slug === slug);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  if (!note) return <Navigate to="/notes" replace />;
  const others = notes.filter((n) => n.slug !== slug).slice(0, 2);

  return (
    <main className="sk-home nt-page">
      <article className="nt-article">
        <motion.div className="nt-progress" style={{ scaleY: progress }} aria-hidden="true" />
        <Link to="/notes" className="cs-back">
          <FiArrowLeft /> All notes
        </Link>
        <div className="nt-item-meta">
          <span>{fmt(note.date)}</span>
          <span>{minutes(note.body)} min read</span>
          {note.tags.map((t) => (
            <span key={t}>#{t}</span>
          ))}
        </div>
        <MaskText as="h1" className="nt-title" lines={[note.title]} />
        <motion.p
          className="nt-summary"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {note.summary}
        </motion.p>
        <Markdown source={note.body} />
        {note.paper && (
          <a className="sk-btn sk-btn-red nt-paper" href={note.paper} target="_blank" rel="noreferrer">
            Read the paper <FiArrowUpRight />
          </a>
        )}
      </article>
      {others.length > 0 && (
        <section className="sk-section nt-more">
          <div className="nt-list">
            {others.map((n) => (
              <Link key={n.slug} to={`/notes/${n.slug}`} className="nt-item" data-cursor="Read">
                <div className="nt-item-meta">
                  <span>{fmt(n.date)}</span>
                </div>
                <h2>{n.title}</h2>
                <p>{n.summary}</p>
                <span className="nt-arrow">
                  <FiArrowUpRight />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
