import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Particle from "../Particle";
import { AiOutlineDownload } from "react-icons/ai";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import resumePdf from "../../assets/resume/Sarthak Kar Resume.pdf";
import "./Resume.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function PDFResume() {
  const [width, setWidth] = useState(1200);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    setWidth(window.innerWidth);
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset) {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

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

        <Row className="resume" style={{ justifyContent: "center", padding: "30px 0" }}>
          <Col md={12} style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
            <Document
              file={resumePdf}
              onLoadSuccess={onDocumentLoadSuccess}
              className="d-flex justify-content-center"
            >
              <Page
                pageNumber={pageNumber}
                scale={width > 786 ? 1.7 : 0.6}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>
            
            {numPages > 1 && (
              <div style={{ marginTop: "20px" }}>
                <p style={{ textAlign: "center", color: "white" }}>
                  Page {pageNumber || (numPages ? 1 : "--")} of {numPages || "--"}
                </p>
                <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                  <Button
                    variant="primary"
                    disabled={pageNumber <= 1}
                    onClick={previousPage}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="primary"
                    disabled={pageNumber >= numPages}
                    onClick={nextPage}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </Col>
        </Row>

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
      </Container>
    </Container>
  );
}

export default PDFResume;