import React from "react";
import { Spinner } from "react-bootstrap";

function Preloader(props) {
  return (
    <div id={props.load ? "preloader" : "preloader-none"}>
      <Spinner animation="border" variant="info" />
    </div>
  );
}

export default Preloader;