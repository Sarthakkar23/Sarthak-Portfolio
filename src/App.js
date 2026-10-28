import React, { useState, useEffect, lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import "./style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import TwinChat from "./components/Twin/TwinChat";
import {
  Intro,
  INTRO_MS,
  FilmOverlay,
  ScrollProgress,
  SmoothScroll,
  Cursor,
  RouteCurtain,
} from "./components/Cinema/Cinema";

// Implement code splitting with lazy loading for better performance
const HomeNew = lazy(() => import("./components/Home/HomeNew"));
const About = lazy(() => import("./components/About/About"));
const Projects = lazy(() => import("./components/Projects/Projects"));
const Resume = lazy(() => import("./components/Resume/Resume"));
const Privacy = lazy(() => import("./components/Privacy/Privacy"));
const CaseStudy = lazy(() => import("./components/CaseStudy/CaseStudy"));
const NotesIndex = lazy(() => import("./components/Notes/Notes").then((m) => ({ default: m.NotesIndex })));
const NotePage = lazy(() => import("./components/Notes/Notes").then((m) => ({ default: m.NotePage })));

// Play the opening sequence once per visit, not on every reload.
const introSeen = () => {
  try {
    return sessionStorage.getItem("sk-intro") === "1";
  } catch (e) {
    return false;
  }
};

function App() {
  const [load, setLoad] = useState(() => !introSeen());

  useEffect(() => {
    if (!load) return;
    const timer = setTimeout(() => {
      setLoad(false);
      try {
        sessionStorage.setItem("sk-intro", "1");
      } catch (e) {}
    }, INTRO_MS);

    return () => clearTimeout(timer);
  }, [load]);

  return (
    <>
      <Intro show={load} />
      <SmoothScroll />
      <FilmOverlay />
      <ScrollProgress />
      <Cursor />
      <RouteCurtain />
      <div className="App" id={load ? "no-scroll" : "scroll"}>
        <Navbar />
        <Suspense fallback={<div className="loading-fallback" />}>
          <Routes>
            <Route path="/" element={<HomeNew ready={!load} />} />
            <Route path="/about" element={<About />} />
            <Route path="/project" element={<Projects />} />
            <Route path="/work/:slug" element={<CaseStudy />} />
            <Route path="/notes" element={<NotesIndex />} />
            <Route path="/notes/:slug" element={<NotePage />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="*" element={<Navigate to="/"/>} />
          </Routes>
        </Suspense>
        <Footer />
      </div>
      <TwinChat />
    </>
  );
}

export default App;
