import React from "react";
import { ListGroup } from "react-bootstrap";

const ListGroupH = (props) => {
  return (
    <ListGroup horizontal>
      {props.list.map((item, idx) => (
        <ListGroup.Item key={idx}>{item.name}</ListGroup.Item>
      ))}{" "}
    </ListGroup>
  );
};

export default ListGroupH;
