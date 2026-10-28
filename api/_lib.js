// Shared helpers for the serverless functions in /api (files starting with _ are not routes).
const PROFILE = require("./_profile");

const STOP = new Set(
  "a an and are as at be but by did do does for from has have he his how i in is it its me my of on or so tell that the their them this to was what when where which who why will with would you your about sarthak kar".split(
    " "
  )
);

const sections = PROFILE.split("\n## ")
  .slice(1)
  .map((chunk) => {
    const [title, ...rest] = chunk.split("\n");
    return { title: title.trim(), body: rest.join("\n").trim() };
  });

const words = (s) =>
  (s.toLowerCase().match(/[a-z0-9][a-z0-9.+#-]*/g) || []).filter((w) => w.length > 1 && !STOP.has(w));

// Map everyday question words onto the profile's section vocabulary.
const SYNONYMS = {
  study: "education", studies: "education", college: "education", university: "education", degree: "education",
  graduate: "education", graduating: "education", graduation: "education", school: "education", srm: "srmist",
  job: "experience", work: "experience", worked: "experience", intern: "internship", internship: "experience",
  skill: "skills", tech: "skills", stack: "skills", tools: "skills", languages: "skills", know: "skills",
  email: "contact", reach: "contact", hire: "contact", phone: "contact", linkedin: "contact",
  paper: "publication", research: "publication", published: "publication", ssrn: "publication",
  lead: "leadership", leader: "leadership", team: "leadership", sponsorship: "leadership",
  llm: "llms", rag: "llms", vision: "computer", cv: "computer", cloud: "cloudoptima", fraud: "fraud",
  certificate: "certifications", certified: "certifications", certs: "certifications",
};

/** Keyword retrieval over the profile — used when no API key is configured or the API is unavailable. */
function offlineAnswer(question) {
  const q = new Set();
  for (const w of words(question)) {
    q.add(w);
    if (SYNONYMS[w]) q.add(SYNONYMS[w]);
  }
  const scored = sections
    .map((s) => {
      const hay = words(`${s.title} ${s.title} ${s.body}`);
      let score = 0;
      for (const w of hay) if (q.has(w)) score += 1;
      return { s, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);

  if (!scored.length) {
    return (
      "I couldn't find that in Sarthak's profile. Try asking about his projects (AMRIP-India, CloudOptima, " +
      "ClearPixel AI, fraud detection), his skills, education or experience — or email him at sarthakkar05@gmail.com."
    );
  }
  return scored
    .map(({ s }) => {
      const lines = s.body.split("\n").filter(Boolean).slice(0, 4).map((l) => l.replace(/^- /, "• "));
      return `**${s.title}**\n${lines.join("\n")}`;
    })
    .join("\n\n");
}

// Best-effort, per-instance rate limit (serverless instances don't share memory).
const hits = new Map();
function rateLimited(key, limit, windowMs) {
  const now = Date.now();
  const recent = (hits.get(key) || []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > limit;
}

function clientIp(req) {
  const fwd = req.headers["x-forwarded-for"];
  return (Array.isArray(fwd) ? fwd[0] : fwd || "").split(",")[0].trim() || req.socket?.remoteAddress || "unknown";
}

function readJson(req) {
  if (req.body && typeof req.body === "object") return req.body;
  try {
    return JSON.parse(req.body || "{}");
  } catch (e) {
    return {};
  }
}

module.exports = { PROFILE, offlineAnswer, rateLimited, clientIp, readJson };
