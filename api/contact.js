// POST /api/contact — emails a contact-form message to Sarthak via Resend (https://resend.com).
// Env vars: RESEND_API_KEY (required), CONTACT_TO_EMAIL (defaults to the résumé email),
// CONTACT_FROM_EMAIL (defaults to Resend's shared sender, which only delivers to the Resend account's own email).
const { rateLimited, clientIp, readJson } = require("./_lib");

const TO = process.env.CONTACT_TO_EMAIL || "sarthakkar05@gmail.com";
const FROM = process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const clip = (v, n) => (typeof v === "string" ? v.trim().slice(0, n) : "");
const escapeHtml = (s) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = readJson(req);
  // Honeypot: real visitors never see or fill this field.
  if (clip(body.website, 200)) return res.status(200).json({ ok: true });

  if (rateLimited(`contact:${clientIp(req)}`, 5, 60 * 60 * 1000)) {
    return res.status(429).json({ error: "Too many messages — please try again later or email directly." });
  }

  const name = clip(body.name, 100);
  const email = clip(body.email, 200);
  const company = clip(body.company, 120);
  const message = clip(body.message, 5000);

  if (!name || !EMAIL_RE.test(email) || message.length < 10) {
    return res.status(400).json({ error: "Please add your name, a valid email and a message (10+ characters)." });
  }

  if (!process.env.RESEND_API_KEY) {
    return res.status(503).json({ error: "Email isn't set up yet.", fallback: "mailto" });
  }

  const subject = `Portfolio: ${name}${company ? ` (${company})` : ""}`;
  const text = `${message}\n\n— ${name}\n${email}${company ? `\n${company}` : ""}`;
  const html = `<p style="white-space:pre-wrap">${escapeHtml(message)}</p><hr><p>${escapeHtml(name)}<br>${escapeHtml(
    email
  )}${company ? `<br>${escapeHtml(company)}` : ""}</p>`;

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to: [TO], reply_to: email, subject, text, html }),
    });
    if (!r.ok) {
      console.error("contact: Resend error", r.status, await r.text());
      return res.status(502).json({ error: "Couldn't send right now.", fallback: "mailto" });
    }
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("contact: network error", error);
    return res.status(502).json({ error: "Couldn't send right now.", fallback: "mailto" });
  }
};
