import React from "react";
import { Spinner } from "react-bootstrap";

const LoadingBox = () => {
  return (
    <Spinner animation="border" role="status" variant="light">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
};

export default LoadingBox;
