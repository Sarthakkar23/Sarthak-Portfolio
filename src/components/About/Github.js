import React from "react";
import { Row } from "react-bootstrap";

function Github() {
  return (
    <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
      <h1 className="project-heading" style={{ paddingBottom: "20px" }}>
        Days I <strong className="purple">Code</strong>
      </h1>
      <div className="d-flex justify-content-center">
        <img 
          src={`https://ghchart.rshah.org/00eeff/Sarthakkar23`} 
          alt="Sarthak Kar's Github chart" 
          style={{ width: "100%", maxWidth: "800px" }}
        />
      </div>
    </Row>
  );
}

export default Github;