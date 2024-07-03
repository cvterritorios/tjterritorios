import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";

const TableDark = ({ head, lines }) => {
  useEffect(() => {}, []);

  return (
    <Table striped bordered hover variant="dark">
      <thead>
        <tr>
          <th>#</th>
          {head.map((element, index) => (
            <th key={index}>{element}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {lines.map((line, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            {line.map((element, idx) => (
              <td key={idx}>{element}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TableDark;
