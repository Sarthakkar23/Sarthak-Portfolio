import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiDownload, FiExternalLink, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import resumePdf from "../../assets/resume/Sarthak Kar Resume.pdf";
import { MaskText } from "../Cinema/Cinema";
import "../Home/HomeNew.css";
import "../About/About.css";
import "./Resume.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function PDFResume() {
  const frameRef = useRef(null);
  const [width, setWidth] = useState(900);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    // clientWidth includes the frame's padding on both sides
    const measure = () => {
      if (!frameRef.current) return;
      const pad = window.innerWidth <= 640 ? 20 : 40;
      setWidth(Math.min(frameRef.current.clientWidth - pad, 920));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <main className="sk-home rs-page">
      <section className="sk-section rs-head">
        <div>
          <MaskText as="h1" className="ab-title rs-title" lines={["One page.", <span className="sk-red">Everything.</span>]} />
        </div>
        <motion.div
          className="sk-row rs-actions"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <a className="sk-btn sk-btn-red" href={resumePdf} download="Sarthak-Kar-Resume.pdf">
            Download PDF <FiDownload />
          </a>
          <a className="sk-btn sk-btn-ghost" href={resumePdf} target="_blank" rel="noreferrer">
            Open in new tab <FiExternalLink />
          </a>
        </motion.div>
      </section>

      <section className="sk-section rs-viewer">
        <motion.div
          className="rs-frame"
          ref={frameRef}
          initial={{ opacity: 0, y: 60, rotateX: 8 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformPerspective: 1200 }}
        >
          <Document
            file={resumePdf}
            onLoadSuccess={({ numPages: n }) => {
              setNumPages(n);
              setPageNumber(1);
            }}
            loading={<div className="rs-loading">Loading résumé…</div>}
            error={
              <div className="rs-loading">
                Couldn't preview the PDF here —{" "}
                <a href={resumePdf} target="_blank" rel="noreferrer">
                  open it directly
                </a>
                .
              </div>
            }
          >
            <Page pageNumber={pageNumber} width={width} renderTextLayer={false} renderAnnotationLayer={false} />
          </Document>
        </motion.div>

        {numPages > 1 && (
          <div className="rs-pager">
            <button className="sk-btn sk-btn-ghost" disabled={pageNumber <= 1} onClick={() => setPageNumber(pageNumber - 1)}>
              <FiChevronLeft /> Previous
            </button>
            <span>
              Page {pageNumber} of {numPages}
            </span>
            <button className="sk-btn sk-btn-ghost" disabled={pageNumber >= numPages} onClick={() => setPageNumber(pageNumber + 1)}>
              Next <FiChevronRight />
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default PDFResume;
