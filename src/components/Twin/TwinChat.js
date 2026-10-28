import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowUp, FiX, FiMail } from "react-icons/fi";
import avatar from "../../assets/avatar.webp";
import "./TwinChat.css";

const EMAIL = "sarthakkar05@gmail.com";
const SUGGESTIONS = [
  "What did Sarthak build with LangGraph?",
  "What's his strongest project?",
  "Summarise his experience",
  "Is he a fit for an ML engineer role?",
];
const GREETING = {
  role: "assistant",
  content:
    "Hi! I'm Sarthak's AI twin. I answer from his résumé and projects — ask me about his work, skills or experience.",
};
const STORE = "sk-twin-chat";

// Tiny renderer: **bold**, bullet lines and paragraphs. Text only — no HTML from the model is trusted.
function Rich({ text }) {
  return text.split(/\n{2,}/).map((para, i) => {
    const lines = para.split("\n");
    const isList = lines.every((l) => /^\s*([-•*]|\d+\.)\s+/.test(l));
    const inline = (s, k) =>
      s.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
        part.startsWith("**") && part.endsWith("**") ? <strong key={`${k}-${j}`}>{part.slice(2, -2)}</strong> : part
      );
    if (isList) {
      return (
        <ul key={i}>
          {lines.map((l, j) => (
            <li key={j}>{inline(l.replace(/^\s*([-•*]|\d+\.)\s+/, ""), j)}</li>
          ))}
        </ul>
      );
    }
    return (
      <p key={i}>
        {lines.map((l, j) => (
          <React.Fragment key={j}>
            {j > 0 && <br />}
            {inline(l, j)}
          </React.Fragment>
        ))}
      </p>
    );
  });
}

function TwinChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORE));
      if (Array.isArray(saved) && saved.length) return saved;
    } catch (e) {}
    return [GREETING];
  });
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const listRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORE, JSON.stringify(messages.slice(-20)));
    } catch (e) {}
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current && inputRef.current.focus(), 250);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Other parts of the site can open the twin with a question: window.dispatchEvent(new CustomEvent("twin:ask", {detail}))
  useEffect(() => {
    const onAsk = (e) => {
      setOpen(true);
      if (e.detail) ask(e.detail);
    };
    window.addEventListener("twin:ask", onAsk);
    return () => window.removeEventListener("twin:ask", onAsk);
  });

  async function ask(question) {
    const q = question.trim();
    if (!q || busy) return;
    const next = [...messages, { role: "user", content: q }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.filter((m) => m !== GREETING && !m.local) }),
      });
      const data = await r.json().catch(() => ({}));
      const answer =
        data.answer || data.error || `I'm having trouble right now. You can reach Sarthak at ${EMAIL}.`;
      setMessages((m) => [...m, { role: "assistant", content: answer }]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: `I'm offline at the moment. You can reach Sarthak at ${EMAIL}.`, local: true },
      ]);
    } finally {
      setBusy(false);
    }
  }

  const fresh = messages.length <= 1;

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.section
            className="tw-panel"
            role="dialog"
            aria-label="Chat with Sarthak's AI twin"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            data-lenis-prevent
          >
            <header className="tw-head">
              <img src={avatar} alt="" />
              <div>
                <strong>Sarthak's AI twin</strong>
                <span>
                  <span className="sk-dot" /> Answers from his résumé · powered by Claude
                </span>
              </div>
              <button className="tw-icon" onClick={() => setOpen(false)} aria-label="Close chat">
                <FiX />
              </button>
            </header>

            <div className="tw-list" ref={listRef} aria-live="polite">
              {messages.map((m, i) => (
                <div key={i} className={`tw-msg is-${m.role}`}>
                  <Rich text={m.content} />
                </div>
              ))}
              {busy && (
                <div className="tw-msg is-assistant tw-typing" aria-label="Thinking">
                  <span />
                  <span />
                  <span />
                </div>
              )}
              {fresh && (
                <div className="tw-suggest">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} onClick={() => ask(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form
              className="tw-form"
              onSubmit={(e) => {
                e.preventDefault();
                ask(input);
              }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Sarthak…"
                maxLength={800}
                aria-label="Your question"
              />
              <button type="submit" className="tw-send" disabled={!input.trim() || busy} aria-label="Send">
                <FiArrowUp />
              </button>
            </form>
            <a className="tw-mail" href={`mailto:${EMAIL}`}>
              <FiMail /> Prefer a human? Email Sarthak
            </a>
          </motion.section>
        )}
      </AnimatePresence>

      <motion.button
        className={`tw-launch ${open ? "is-open" : ""}`}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={open ? "Close AI twin" : "Ask Sarthak's AI twin"}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <img src={avatar} alt="" />
        <span>
          <strong>Ask my AI twin</strong>
          <small>Recruiter? Ask anything</small>
        </span>
      </motion.button>
    </>
  );
}

export default TwinChat;
