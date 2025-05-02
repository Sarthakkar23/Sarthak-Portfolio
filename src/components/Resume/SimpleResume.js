import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Particle from "../Particle";
import { AiOutlineDownload } from "react-icons/ai";
import resumePdf from "../../assets/resume/Sarthak Resume 2.pdf";

function SimpleResume() {
  return (
    <Container fluid className="resume-section">
      <Particle />
      <Container>
        <Row style={{ justifyContent: "center", position: "relative" }}>
          <Button
            variant="primary"
            href={resumePdf}
            target="_blank"
            style={{ maxWidth: "250px" }}
          >
            <AiOutlineDownload />
            &nbsp;Download CV
          </Button>
        </Row>

        <Row className="resume" style={{ justifyContent: "center", paddingTop: "50px" }}>
          <Col md={8}>
            <Card className="quote-card-view">
              <Card.Body>
                <blockquote className="blockquote mb-0">
                  <p style={{ textAlign: "center" }}>
                    My resume is available for download using the button above.
                    <br /><br />
                    It contains details about my:
                  </p>
                  <ul>
                    <li>Education</li>
                    <li>Technical Skills</li>
                    <li>Projects</li>
                    <li>Work Experience</li>
                    <li>Certifications</li>
                  </ul>
                  <p style={{ textAlign: "center", marginTop: "20px" }}>
                    Please click the download button to view my complete resume.
                  </p>
                </blockquote>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row style={{ justifyContent: "center", position: "relative", marginTop: "50px" }}>
          <Button
            variant="primary"
            href={resumePdf}
            target="_blank"
            style={{ maxWidth: "250px" }}
          >
            <AiOutlineDownload />
            &nbsp;Download CV
          </Button>
        </Row>
      </Container>
    </Container>
  );
}

export default SimpleResume;