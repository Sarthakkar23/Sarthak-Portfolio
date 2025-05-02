import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  AiFillGithub,
  AiOutlineTwitter,
  AiFillInstagram,
} from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
import { MdPrivacyTip } from "react-icons/md";
import "./Footer.css";

function Footer() {
  let date = new Date();
  let year = date.getFullYear();
  return (
    <Container fluid className="footer">
      <Row>
        <Col md="4" className="footer-copywright">
          <h3>Designed and Developed by Sarthak Kar</h3>
        </Col>
        <Col md="4" className="footer-copywright">
          <h3>Copyright © {year} SK</h3>
          <p className="footer-links">
            <Link to="/privacy" className="privacy-link">
              <MdPrivacyTip /> Privacy Policy
            </Link>
          </p>
        </Col>
        <Col md="4" className="footer-body">
          <ul className="footer-icons">
            <li className="social-icons">
              <a
                href="https://github.com/Sarthakkar23"
                style={{ color: "white" }}
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
              >
                <AiFillGithub />
              </a>
            </li>
            <li className="social-icons">
              <a
                href="https://www.instagram.com/sarxthak_23/"
                style={{ color: "white" }}
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Instagram Profile"
              >
                <AiFillInstagram />
              </a>
            </li>
          </ul>
        </Col>
      </Row>
    </Container>
  );
}

export default Footer;