import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { FiArrowUpRight, FiMenu, FiX } from "react-icons/fi";
import avatar from "../assets/avatar.webp";
import { scrollToId } from "./Cinema/Cinema";
import "./Navbar.css";

const links = [
  { label: "Work", hash: "work" },
  { label: "Skills", hash: "services" },
  { label: "About", to: "/about" },
  { label: "Projects", to: "/project" },
  { label: "Notes", to: "/notes" },
  { label: "Resume", to: "/resume" },
];

function NavBar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  // Section links live on the home page: go there first, then scroll.
  const goToSection = (hash) => {
    setOpen(false);
    const scroll = () => scrollToId(hash);
    if (location.pathname === "/") scroll();
    else {
      navigate("/");
      setTimeout(scroll, 900);
    }
  };

  return (
    <header className={`sk-nav ${scrolled ? "is-scrolled" : ""} ${open ? "is-open" : ""}`}>
      <Link to="/" className="sk-nav-brand" onClick={() => window.scrollTo({ top: 0 })}>
        <img src={avatar} alt="" />
        <span>Sarthak Kar</span>
      </Link>

      <nav className="sk-nav-links">
        {links.map((l) =>
          l.hash ? (
            <button key={l.label} onClick={() => goToSection(l.hash)}>
              {l.label}
            </button>
          ) : (
            <NavLink key={l.label} to={l.to}>
              {l.label}
            </NavLink>
          )
        )}
      </nav>

      <button className="sk-nav-cta" onClick={() => goToSection("contact")}>
        Contact <FiArrowUpRight />
      </button>

      <button className="sk-nav-toggle" aria-label="Toggle menu" onClick={() => setOpen(!open)}>
        {open ? <FiX /> : <FiMenu />}
      </button>
    </header>
  );
}

export default NavBar;
