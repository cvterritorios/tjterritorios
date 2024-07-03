import { useEffect, useState } from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import { MdOutlineDelete, MdOutlineEdit } from "react-icons/md";
import ListGroupH from "../ListGroupH/ListGroupH";

function CardCongregacaoFlip({ data }) {
  const [flip, setFlip] = useState(false);

  const handleFlip = () => {
    setFlip(!flip);
  };

  useEffect(() => {
    // console.log(props.congregacoes);
  }, []);

  return (
    <>
      <Card
        className="text-center my-2 position-relative"
        bg={"light"}
        border={"dark"}
      >
        <Card.Body
          className="mx-5"
          title={flip ? "Mostrar menos":"Clique para ver mais"}
          onClick={handleFlip}
          style={{ cursor: "pointer" }}
        >
          {!flip && <Card.Title className="mt-2">{data.name}</Card.Title>}

          {flip && (
            <Card.Text>
              <Row>
                <Col>
                  <strong>Informações </strong>
                  <br />
                  <strong>Email: </strong>
                  {data.email} <br />
                  <strong>Codigo de acesso: </strong>
                  {data.accessCode}
                </Col>
                <Col>
                  <strong>Responsaveis</strong>
                  <br />
                  {<ListGroupH list={data.responsible} />}
                </Col>
              </Row>
            </Card.Text>
          )}
        </Card.Body>

        {/* Botoões de ação */}
        <div className="position-absolute d-flex end-0 px-3 pt-1">
          <Row
            className="d-flex align-items-center "
            style={{ width: "2.4rem" }}
          >
            <Button variant="outline-primary" className="btn-sm ">
              <MdOutlineEdit size={20} />
            </Button>{" "}
            <Button variant="outline-danger" className="btn-sm ">
              <MdOutlineDelete size={20} />
            </Button>
          </Row>
        </div>
      </Card>
    </>
  );
}

export { CardCongregacaoFlip };
