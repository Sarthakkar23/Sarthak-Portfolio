import { useEffect, useState } from "react";
import config from "../config";
import { curatedProjects, hiddenRepos } from "../data/projects";

const CACHE_KEY = "sk-gh-repos-v1";
const CACHE_MS = 10 * 60 * 1000;
const NEW_DAYS = 45;
const ARTS = ["gen-a", "gen-b", "gen-c", "gen-d"];

const prettyName = (name) =>
  name
    .replace(/[-_]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const hash = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

function categoryFor(repo) {
  const text = `${repo.name} ${repo.description || ""} ${(repo.topics || []).join(" ")}`.toLowerCase();
  if (/llm|langchain|langgraph|rag|nlp|gpt|transformer|chatbot|agent/.test(text)) return "LLMs";
  if (/vision|image|ocr|opencv|yolo|detection|segmentation|pixel|cnn/.test(text)) return "Vision";
  if (/web|react|next|frontend|website|portfolio|javascript/.test(text)) return "Web";
  return "ML Systems";
}

function fromRepo(repo) {
  const created = new Date(repo.created_at);
  return {
    repo: repo.name,
    name: prettyName(repo.name),
    subtitle: repo.language ? `${repo.language} project` : "Open-source project",
    badge: Date.now() - created < NEW_DAYS * 864e5 ? "New" : "Open source",
    summary: repo.description || "Open-source project on GitHub — see the README for details.",
    tags: [repo.language, ...(repo.topics || [])].filter(Boolean).slice(0, 6),
    metrics: null,
    category: categoryFor(repo),
    art: ARTS[hash(repo.name) % ARTS.length],
    auto: true,
  };
}

function withLive(project, repo) {
  if (!repo) return { ...project, link: config.socialMedia.github };
  return {
    ...project,
    link: repo.html_url,
    demo: repo.homepage || project.demo || "",
    stars: repo.stargazers_count,
    pushedAt: repo.pushed_at,
    createdAt: repo.created_at,
  };
}

function readCache() {
  try {
    const c = JSON.parse(sessionStorage.getItem(CACHE_KEY));
    if (c && Date.now() - c.t < CACHE_MS) return c.repos;
  } catch (e) {}
  return null;
}

/**
 * Curated projects first, then every other public, non-fork repo, newest first.
 * New repos appear on the site as soon as they're pushed — no redeploy needed.
 */
export default function useGithubProjects() {
  const [repos, setRepos] = useState(readCache);
  const [status, setStatus] = useState(repos ? "ready" : "loading");

  useEffect(() => {
    if (repos) return;
    let alive = true;
    fetch(`https://api.github.com/users/${config.github.username}/repos?sort=created&per_page=100`, {
      headers: { Accept: "application/vnd.github+json" },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => {
        if (!alive) return;
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), repos: data }));
        } catch (e) {}
        setRepos(data);
        setStatus("ready");
      })
      .catch(() => alive && setStatus("error"));
    return () => {
      alive = false;
    };
  }, [repos]);

  const list = (repos || []).filter(
    (r) => !r.fork && !r.archived && !hiddenRepos.some((h) => h.toLowerCase() === r.name.toLowerCase())
  );
  const byName = Object.fromEntries(list.map((r) => [r.name.toLowerCase(), r]));
  const curatedNames = curatedProjects.filter((p) => p.repo).map((p) => p.repo.toLowerCase());

  const curated = curatedProjects.map((p) => withLive(p, p.repo && byName[p.repo.toLowerCase()]));
  const auto = list
    .filter((r) => !curatedNames.includes(r.name.toLowerCase()))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .map((r) => withLive(fromRepo(r), r));

  return { curated, auto, all: [...curated, ...auto], status };
}
