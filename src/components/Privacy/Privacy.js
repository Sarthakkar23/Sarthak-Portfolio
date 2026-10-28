import React from "react";
import { MaskText, SceneLabel } from "../Cinema/Cinema";
import "../Home/HomeNew.css";
import "../About/About.css";
import "../Notes/Notes.css";
import "./Privacy.css";

const sections = [
  [
    "What this site is",
    "This is the personal portfolio of Sarthak Kar. It doesn't have accounts, sell anything, or use advertising.",
  ],
  [
    "Analytics",
    "The site uses Vercel Web Analytics to count page views and see which pages are visited. It doesn't use cookies and doesn't build a profile of you across other websites.",
  ],
  [
    "Contact form",
    "If you send a message through the contact form, your name, email, company (if given) and message are emailed to me through the email service Resend. I use them only to reply to you, and you can ask me to delete them at any time.",
  ],
  [
    "AI twin chat",
    "The AI twin runs entirely in your browser and answers from my résumé — your questions aren't sent to this site's server. When you ask about a general topic (for example \"What is LoRA?\"), the topic is looked up on Wikipedia, so Wikipedia receives that search. Please don't type personal or confidential information into the chat.",
  ],
  [
    "GitHub",
    "The projects pages load my public repositories directly from GitHub's API in your browser, so GitHub receives a normal web request from you.",
  ],
  [
    "Stored in your browser",
    "To make the site faster and smoother, your browser's session storage keeps a few things for the current visit only: whether you've seen the intro, a short-lived copy of my GitHub repo list, and your AI-twin conversation. They're cleared when you close the tab.",
  ],
  [
    "Your choices",
    "You can ask me what information I have from you, or ask me to delete it, by emailing sarthakkar05@gmail.com.",
  ],
];

function Privacy() {
  return (
    <main className="sk-home nt-page">
      <article className="nt-article pv-article">
        <SceneLabel n={1}>Privacy</SceneLabel>
        <MaskText as="h1" className="nt-title" lines={["Privacy policy"]} />
        <p className="nt-summary">Short version: I collect very little, and only to run this site and reply to you.</p>
        <div className="nt-body">
          {sections.map(([h, b]) => (
            <React.Fragment key={h}>
              <h2>{h}</h2>
              <p>{b}</p>
            </React.Fragment>
          ))}
          <p className="pv-updated">Last updated: 29 October 2026</p>
        </div>
      </article>
    </main>
  );
}

export default Privacy;
