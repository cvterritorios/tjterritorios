import React from "react";
import { Alert } from "react-bootstrap";

const MyAlert = ({ variant, text }) => {
  return <Alert variant={variant}>{text}</Alert>;
};

export { MyAlert };
