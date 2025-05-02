import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Particle from "../Particle";
import "./Privacy.css";

function Privacy() {
  return (
    <Container fluid className="about-section">
      <Particle />
      <Container>
        <Row style={{ justifyContent: "center", padding: "10px" }}>
          <Col
            md={12}
            style={{
              justifyContent: "center",
              paddingTop: "30px",
              paddingBottom: "50px",
            }}
          >
            <h1 style={{ fontSize: "2.1em", paddingBottom: "20px" }}>
              <strong className="purple">Privacy Policy</strong>
            </h1>
            
            <div className="privacy-content">
              <h2>Introduction</h2>
              <p>
                This Privacy Policy explains how Sarthak Kar ("I", "me", or "my") collects, uses, and protects 
                your information when you visit my portfolio website at sarthakkar.com ("the Website").
              </p>
              
              <h2>Information I Collect</h2>
              <p>
                <strong>Personal Information:</strong> When you contact me through the Website, I may collect 
                your name, email address, and any other information you provide in your message.
              </p>
              <p>
                <strong>Usage Data:</strong> I collect information about how you interact with the Website, 
                including your IP address, browser type, pages visited, time spent on pages, and other browsing actions.
              </p>
              
              <h2>How I Use Your Information</h2>
              <ul>
                <li>To respond to your inquiries and messages</li>
                <li>To improve the Website and user experience</li>
                <li>To analyze usage patterns and traffic</li>
                <li>To protect the Website from unauthorized access</li>
              </ul>
              
              <h2>Cookies and Tracking</h2>
              <p>
                This Website uses cookies and similar tracking technologies to enhance your browsing experience 
                and collect usage information. You can control cookies through your browser settings.
              </p>
              
              <h2>Third-Party Services</h2>
              <p>
                I use the following third-party services that may collect information about you:
              </p>
              <ul>
                <li>Google Analytics - for website traffic analysis</li>
                <li>GitHub API - to display project information</li>
              </ul>
              
              <h2>Data Security</h2>
              <p>
                I implement reasonable security measures to protect your information. However, no method of 
                transmission over the Internet or electronic storage is 100% secure.
              </p>
              
              <h2>Your Rights</h2>
              <p>
                Depending on your location, you may have rights regarding your personal information, including:
              </p>
              <ul>
                <li>The right to access your personal information</li>
                <li>The right to correct inaccurate information</li>
                <li>The right to delete your personal information</li>
                <li>The right to object to processing of your information</li>
              </ul>
              
              <h2>Changes to This Policy</h2>
              <p>
                I may update this Privacy Policy from time to time. The latest version will be posted on this page 
                with the effective date.
              </p>
              
              <h2>Contact Me</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact me at:
                <br />
                Email: contact@sarthakkar.com
              </p>
              
              <p><em>Last updated: August 1, 2023</em></p>
            </div>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Privacy;