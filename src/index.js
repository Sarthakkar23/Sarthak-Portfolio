import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource-variable/bodoni-moda/opsz.css";
import "@fontsource-variable/bodoni-moda/opsz-italic.css";
import "@fontsource-variable/hanken-grotesk/wght.css";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Vercel Web Analytics — the script only exists on Vercel deployments (enable it in the dashboard → Analytics).
if (process.env.NODE_ENV === "production") {
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
  const s = document.createElement("script");
  s.defer = true;
  s.src = "/_vercel/insights/script.js";
  document.head.appendChild(s);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();