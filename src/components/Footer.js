import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AiFillGithub, AiFillInstagram } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
import config from "../config";
import "./Footer.css";

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="sk-footer">
      <div className="sk-footer-top">
        <div className="sk-footer-col">
          <span>Menu</span>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/project">Projects</Link>
          <Link to="/resume">Resume</Link>
        </div>
        <div className="sk-footer-col">
          <span>Connect</span>
          <div className="sk-footer-socials">
            <a href={config.socialMedia.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile">
              <AiFillGithub />
            </a>
            <a href={config.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile">
              <FaLinkedinIn />
            </a>
            <a href={config.socialMedia.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram Profile">
              <AiFillInstagram />
            </a>
          </div>
        </div>
        <div className="sk-footer-col sk-footer-right">
          <span>© {year} Sarthak Kar</span>
          <Link to="/privacy">Privacy Policy</Link>
        </div>
      </div>
      <motion.div
        className="sk-footer-name"
        aria-hidden="true"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
      >
        {"SARTHAK KAR".split("").map((ch, i) => (
          <span className="cn-mask" key={i}>
            <motion.span
              variants={{ hidden: { y: "100%" }, show: { y: 0 } }}
              transition={{ duration: 1, delay: i * 0.05, ease: [0.76, 0, 0.24, 1] }}
            >
              {ch === " " ? "\u00A0" : ch}
            </motion.span>
          </span>
        ))}
      </motion.div>
    </footer>
  );
}

export default Footer;
