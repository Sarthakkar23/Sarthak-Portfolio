# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

All four audiences are confirmed; the first two decide most visits.

- **Recruiters and hiring managers** screening candidates for applied AI/ML engineering roles (internships and new-grad; Sarthak graduates May 2027). They skim on a phone or laptop, often in under a minute, and need to know who he is, what he has built, and how to reach him.
- **Engineers and technical interviewers** who open the case studies, notes and GitHub to judge depth before or after an interview.
- **Research collaborators** (professors, labs, co-authors) interested in the SSRN preprint and research-grade projects.
- **Freelance and startup clients** who may hire him for paid AI/ML project work.

## Product Purpose

The personal portfolio of Sarthak Kar, a final-year B.Tech CSE (AI & ML) student at SRMIST, Chennai, seeking applied AI/ML engineering roles.

Success is two things equally:
1. **A lasting impression** of craft and engineering depth that gets him shortlisted.
2. **Effortless contact**: an email, a contact-form message, a LinkedIn message, or a résumé download.

## Positioning

An engineer who builds end-to-end ML systems from messy, real-world data and proves them with measured, explainable results, not demos. The flagship claim no neighbouring portfolio can copy: AMRIP-India, an LLM pipeline that turns photographed Indian prescriptions into ABDM-compliant FHIR R4 records, with a verifier that rejects any field it cannot trace back to the source image. Supported by a co-authored SSRN preprint (CloudOptima) and quantified results across deep RL, imbalanced classification and computer vision.

## Operating Context

- Live at https://sarthak-portfolio-olive.vercel.app (Vercel, auto-deploys from `main` of github.com/Sarthakkar23/Sarthak-Portfolio). The domain may later change to a custom domain.
- Visitors arrive from LinkedIn, résumé links, job applications and GitHub; link previews use `public/og.jpg`.
- Pages: home, About, Projects (synced live from the GitHub API), case studies at `/work/:slug`, Notes at `/notes`, Résumé (PDF viewer), Privacy.
- Built-in AI twin answers questions about Sarthak in the browser from the résumé data plus Wikipedia for general terms; it falls back to his contact details when unsure. No paid AI API is used.
- Contact form posts to a Vercel serverless function that emails via Resend; it falls back to a pre-filled email when not configured.

## Capabilities and Constraints

- Stack (existing): Create React App, React 18, React Router, Framer Motion, Lenis smooth scroll, Bootstrap CSS (legacy), Vercel serverless functions in `/api`. The Three.js and GSAP skills are installed for future work; neither is a dependency yet.
- Content source of truth: `src/data/resume.js`, `src/data/projects.js`, `src/data/caseStudies.js`, `src/data/notes.js`, and the résumé PDF in `src/assets/resume/`.
- New public GitHub repos must keep appearing automatically.
- No paid services may be required for the site to work: the AI twin must stay free, and API keys never go in the public repo.
- Must stay fast and smooth on mid-range phones; smooth scrolling was explicitly tuned and must not regress.
- Undecided: custom domain; whether the case-study "What's next" items and the two Notes are final (written for Sarthak's review).

## Brand Commitments

- Name: Sarthak Kar. Title used publicly: AI / ML Engineer.
- Two approved likenesses: a 3D stylised avatar (`src/assets/avatar.webp`) and a black-and-white graded portrait (`src/assets/portrait.webp`).
- Voice: confident, specific, measured. Lead with numbers and evidence, not adjectives. Third person in the AI twin; first person on the site.
- The user explicitly wants the site to feel luxury and mind-blowing.

## Evidence on Hand

- Résumé PDF (`src/assets/resume/Sarthak Kar Resume.pdf`) and its full content in `src/data/resume.js`.
- Quantified project results: CloudOptima (−34% simulated compute cost, −38% CO₂, R² 0.89/0.84, 99.2% availability), ClearPixel AI (31.2 dB PSNR, 0.914 SSIM, 110–140 ms per 1080p frame), Fraud Detection (F1 0.83, 86.4% precision, 79.8% recall, 3.8 ms per transaction), AMRIP-India (in progress; no final results).
- SSRN preprint: Sahoo, A. A., & Kar, S. (2026), papers.ssrn.com/abstract=6957438.
- Experience: Cloud Computing Intern, CTTC Bhubaneswar (Dec 2025 – Jan 2026). Leadership: Milan festival sponsorship head (60,000+ participants), TEDxSRMIST sponsorship lead.
- **Absent, never fabricate:** project screenshots, demo videos, testimonials, employer logos, press, or AMRIP-India results. Project visuals must be illustrative and clearly labelled as such, derived only from facts above. Any AMRIP-India visual must use obviously synthetic sample documents, never real prescription or patient material.

## Product Principles

1. **Proof over polish.** Every claim the design amplifies must trace to real evidence on hand; spectacle serves the work, never replaces it.
2. **Memorable and effortless together.** The signature moments earn the shortlist; the path to contact or résumé is never more than one obvious step away.
3. **Respect a one-minute visit.** Who he is, what he builds and how to reach him must land fast, for a skimming recruiter on a phone.
4. **Depth on demand.** Technical readers can go deeper (case studies, notes, code) without that depth crowding the first impression.
5. **Free, private, maintainable.** No paid dependencies, no secrets in the repo, and content edits happen in the data files, not in components.

## Accessibility & Inclusion

Target WCAG 2.1 AA: readable contrast for body text, keyboard-reachable navigation, chat and form, and `prefers-reduced-motion` respected by every animation and any WebGL scene.
