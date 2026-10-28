import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, useScroll, useSpring, useMotionValue, AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import "./Cinema.css";

export const INTRO_MS = 2600;
const ease = [0.76, 0, 0.24, 1];
const NAME = "SARTHAK KAR";

/* ---------- Opening title sequence ---------- */
export function Intro({ show }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!show) return;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / (INTRO_MS - 700));
      setCount(Math.round(100 * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div className="cn-intro" key="intro" exit={{ opacity: 1 }} transition={{ duration: 1 }}>
          <motion.div
            className="cn-intro-bar cn-intro-top"
            exit={{ y: "-100%" }}
            transition={{ duration: 0.9, ease }}
          />
          <motion.div
            className="cn-intro-bar cn-intro-bottom"
            exit={{ y: "100%" }}
            transition={{ duration: 0.9, ease }}
          />
          <motion.div className="cn-intro-center" exit={{ opacity: 0, scale: 1.08, filter: "blur(8px)" }} transition={{ duration: 0.5 }}>
            <span className="cn-intro-kicker">A portfolio by</span>
            <h1 className="cn-intro-name" aria-label={NAME}>
              {NAME.split("").map((ch, i) => (
                <span className="cn-mask" key={i}>
                  <motion.span
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, delay: 0.25 + i * 0.045, ease }}
                  >
                    {ch === " " ? " " : ch}
                  </motion.span>
                </span>
              ))}
            </h1>
            <motion.div
              className="cn-intro-line"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: count / 100 }}
              transition={{ duration: 0.1 }}
            />
            <div className="cn-intro-meta">
              <span>AI / ML ENGINEER</span>
              <span className="cn-mono">{String(count).padStart(3, "0")}%</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- Film grain + vignette + letterbox edges ---------- */
export function FilmOverlay() {
  return (
    <div className="cn-film" aria-hidden="true">
      <div className="cn-grain" />
      <div className="cn-vignette" />
    </div>
  );
}

/* ---------- Red scroll progress line ---------- */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return <motion.div className="cn-progress" style={{ scaleX }} />;
}

/* ---------- Inertia smooth scrolling ---------- */
export function SmoothScroll() {
  const location = useLocation();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.25, easing: (t) => 1 - Math.pow(1 - t, 4) });
    window.__lenis = lenis;
    let raf;
    const loop = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  useEffect(() => {
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
}

export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: -20 });
  else el.scrollIntoView({ behavior: "smooth" });
}

/* ---------- Custom cursor ---------- */
export function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40 });
  const sy = useSpring(y, { stiffness: 500, damping: 40 });
  const [label, setLabel] = useState("");
  const [hover, setHover] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    setEnabled(fine);
    if (!fine) return;
    document.documentElement.classList.add("cn-has-cursor");
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target.closest ? e.target.closest("a, button, [data-cursor]") : null;
      setHover(!!target);
      setLabel(target?.getAttribute("data-cursor") || "");
    };
    window.addEventListener("pointermove", move);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.classList.remove("cn-has-cursor");
    };
  }, [x, y]);

  if (!enabled) return null;
  return (
    <>
      <motion.div className="cn-cursor-dot" style={{ x, y }} />
      <motion.div
        className={`cn-cursor-ring ${hover ? "is-hover" : ""} ${label ? "has-label" : ""}`}
        style={{ x: sx, y: sy }}
      >
        {label && <span>{label}</span>}
      </motion.div>
    </>
  );
}

/* ---------- Red curtain between pages ---------- */
export function RouteCurtain() {
  const location = useLocation();
  const first = useRef(true);
  const [key, setKey] = useState(null);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setKey(location.pathname + Date.now());
  }, [location.pathname]);

  if (!key) return null;
  return (
    <div className="cn-curtain" key={key} aria-hidden="true">
      <motion.div
        className="cn-curtain-red"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.8, ease, delay: 0.05 }}
      />
      <motion.div
        className="cn-curtain-black"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.8, ease, delay: 0.18 }}
      />
    </div>
  );
}

/* ---------- Line-by-line masked text reveal ---------- */
export function MaskText({ as: Tag = "h2", lines, className = "", delay = 0, play }) {
  const MotionTag = motion[Tag] || motion.h2;
  const controlled = play !== undefined;
  return (
    <MotionTag
      className={className}
      initial="hidden"
      {...(controlled ? { animate: play ? "show" : "hidden" } : { whileInView: "show", viewport: { once: true, amount: 0.4 } })}
    >
      {lines.map((line, i) => (
        <span className="cn-mask cn-mask-line" key={i}>
          <motion.span
            variants={{ hidden: { y: "110%", rotate: 3 }, show: { y: 0, rotate: 0 } }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: delay + i * 0.09 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}

/* ---------- Small "scene" label above section headings ---------- */
export function SceneLabel({ n, children }) {
  return (
    <motion.div
      className="cn-scene"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <span className="cn-scene-n">{String(n).padStart(2, "0")}</span>
      <span className="cn-scene-line" />
      <span>{children}</span>
    </motion.div>
  );
}
