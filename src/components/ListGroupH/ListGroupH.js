import React from "react";
import { ListGroup } from "react-bootstrap";

const ListGroupH = ({list}) => {
  return (
    <ListGroup horizontal className="d-flex justify-content-center">
      {list.map((item, idx) => (
        <ListGroup.Item key={idx} className="mx-1">{item.name}</ListGroup.Item>
      ))}{" "}
    </ListGroup>
  );
};

export default ListGroupH;
