import { useEffect, useState } from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import { MdOutlineDelete, MdOutlineEdit } from "react-icons/md";
import ListGroupH from "../ListGroupH/ListGroupH";

const CardCongregacaoFlip = (props) => {
  const [flip, setFlip] = useState(false);

  const handleFlip = () => {
    setFlip(!flip);
  };

  useEffect(() => {
    // console.log(props.congregacoes);
  }, []);
  return (
    <>
      {" "}
      {props.congregacoes.map((congregacao, index) => (
        <Card
          key={index}
          className="text-center my-2 position-relative"
          bg={"secondary"}
          border={"light"}
        >
          {!flip && (
            <Card.Body
              className="mx-5"
              title="Clique para ver mais"
              onClick={handleFlip}
              style={{ cursor: "pointer" }}
            >
              <Card.Title className="mt-2">{congregacao.name}</Card.Title>
            </Card.Body>
          )}

          {flip && (
            <Card.Body
              className="mx-5"
              title="Clique para ver menos"
              style={{ cursor: "pointer" }}
              onClick={handleFlip}
            >
              <Card.Title className="mt-2">{congregacao.name}</Card.Title>
              <Card.Text>
                <Row>
                  <Col>
                    <strong>Informações </strong>
                    <br />
                    <strong>Email: </strong>
                    {congregacao.email} <br />
                    <strong>Codigo de acesso: </strong>
                    {congregacao.accessCode}
                  </Col>
                  <Col>
                    <strong>Responsaveis</strong>
                    <br />
                    {<ListGroupH list={congregacao.responsible} />}
                  </Col>
                </Row>
              </Card.Text>
            </Card.Body>
          )}

          {/* Botoões de ação */}
          <div className="position-absolute d-flex end-0 px-3 pt-1">
            <Row className="bg-" style={{ width: "2.6rem" }}>
              <Button variant="outline-primary" className="btn-sm ">
                <MdOutlineEdit size={20} />
              </Button>{" "}
              <Button variant="outline-danger" className="btn-sm ">
                <MdOutlineDelete size={20} />
              </Button>
            </Row>
          </div>
        </Card>
      ))}
      ;
    </>
  );
};

export { CardCongregacaoFlip };
