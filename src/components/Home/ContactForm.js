import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowUpRight, FiCheck } from "react-icons/fi";

const EMAIL = "sarthakkar05@gmail.com";

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "", website: "" });
  const [state, setState] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const mailtoHref = () =>
    `mailto:${EMAIL}?subject=${encodeURIComponent(`Portfolio: ${form.name}${form.company ? ` (${form.company})` : ""}`)}&body=${encodeURIComponent(
      `${form.message}\n\n— ${form.name}\n${form.email}`
    )}`;

  async function submit(e) {
    e.preventDefault();
    setState("sending");
    setError("");
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await r.json().catch(() => ({}));
      if (r.ok && data.ok) {
        setState("sent");
        return;
      }
      if (data.fallback === "mailto" || !r.headers.get("content-type")?.includes("json")) {
        window.location.href = mailtoHref();
        setState("idle");
        setError("Opening your email app instead — the message is pre-filled.");
        return;
      }
      setState("error");
      setError(data.error || "Something went wrong. Please email me directly.");
    } catch (err) {
      window.location.href = mailtoHref();
      setState("idle");
      setError("Opening your email app instead — the message is pre-filled.");
    }
  }

  return (
    <div className="cf-wrap">
      <AnimatePresence mode="wait">
        {state === "sent" ? (
          <motion.div
            key="sent"
            className="cf-sent"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <span className="cf-check">
              <FiCheck />
            </span>
            <h3>Message sent.</h3>
            <p>Thanks, {form.name.split(" ")[0] || "there"} — it's in Sarthak's inbox, and replies will go to {form.email}.</p>
          </motion.div>
        ) : (
          <motion.form key="form" className="cf-form" onSubmit={submit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="cf-row">
              <label>
                <span>Name</span>
                <input required maxLength={100} value={form.name} onChange={set("name")} autoComplete="name" />
              </label>
              <label>
                <span>Email</span>
                <input required type="email" maxLength={200} value={form.email} onChange={set("email")} autoComplete="email" />
              </label>
            </div>
            <label>
              <span>Company / role (optional)</span>
              <input maxLength={120} value={form.company} onChange={set("company")} autoComplete="organization" />
            </label>
            <label>
              <span>Message</span>
              <textarea
                required
                minLength={10}
                maxLength={5000}
                rows={5}
                value={form.message}
                onChange={set("message")}
                placeholder="Tell me about the role or project…"
              />
            </label>
            {/* Honeypot for bots — hidden from people and screen readers */}
            <input className="cf-hp" tabIndex={-1} autoComplete="off" value={form.website} onChange={set("website")} aria-hidden="true" />
            <div className="cf-foot">
              <button type="submit" className="sk-btn sk-btn-red" disabled={state === "sending"}>
                {state === "sending" ? "Sending…" : "Send message"} <FiArrowUpRight />
              </button>
              {error && <p className={`cf-msg ${state === "error" ? "is-error" : ""}`}>{error}</p>}
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ContactForm;
