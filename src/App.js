import React, { useState, useEffect, lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import "./style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
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

function App() {
  const [load, setLoad] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoad(false);
    }, INTRO_MS);

    return () => clearTimeout(timer);
  }, []);

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
            <Route path="/resume" element={<Resume />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="*" element={<Navigate to="/"/>} />
          </Routes>
        </Suspense>
        <Footer />
      </div>
    </>
  );
}

export default App;
