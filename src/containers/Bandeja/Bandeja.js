import { useEffect, useState } from "react";
import { Container, Card, Row, Col, Badge } from "react-bootstrap";
import { useFirestore } from "../../hooks/useFirestore";

const Bandeja = () => {
  const [collection, setCollection] = useState([{}]);

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    getCollection,
    error: dataError,
    loading: dataLoading,
  } = useFirestore();

  const startBandeja = async () => {
    if (!collection) setCollection(await getCollection("territorios"));
  };

  useEffect(() => {
    startBandeja();
    if (dataError) setError(dataError);
    if (dataLoading) setLoading(dataLoading);
  }, [dataError, dataLoading]);

  if (loading) {
    <p>carregando..</p>;
  }

  return (
    <>
      <Container>
        {collection.map((item, idx) => (
          <div className="col-md-auto p-0" id={item.ID} key={idx}>
            <Card
              className="border border-end-0 border-start-0 rounded-0"
              style={{
                width: "23.66rem",
              }}
            >
              <Card.Body className="text-center">
                <Row>
                  <Col xs={2} className="bg-success p-0 d-flex">
                    <Card.Img variant="top" src={item.mapa}></Card.Img>
                  </Col>
                  <Col>{item.titulo}</Col>
                </Row>
              </Card.Body>
            </Card>
          </div>
        ))}
      </Container>
    </>
  );
};

export default Bandeja;

/* props.collection.map((item, idx) => (
          <div className="col-md-auto p-0" id={item.ID}>
            <Card
              className="border border-end-0 border-start-0 rounded-0"
              style={{
                width: "23.66rem",
              }} /* onclick="html_Comp.modal('opcoes',${territorio.num},${
          territorio.disponivel
        },'${territorio.ID}')" 
        >
        <Card.Body>
          <Container className="text-center">
            <Row>
              <div className="col-3 bg-success p-0 d-flex">
                <img class="img-thumb m-0" src={item.mapa} />
              </div>

              <Col className="fs-6">
                <div
                  className="d-flex justify-content-between"
                  style={{ width: "100%" }}
                >
                  <div className="text-start">{item.titulo}</div>
                  <div className="text-end" style={{ fontSize: "16px" }}>
                    {item.disponivel ? (
                      <span class="text-success">Disponivel</span>
                    ) : (
                      <span class="text-danger">Indisponivel</span>
                    )}
                  </div>
                </div>

                <Row className="fs-6 text-start">
                  {item.referencias.map((ref, idx) => (
                    <Badge
                      bg="light"
                      text="dark"
                      className={idx == 0 ? "m-1 border" : "border"}
                    >
                      {ref}
                    </Badge>
                  ))}
                </Row>
              </Col>
            </Row>
          </Container>
        </Card.Body>
      </Card>
      {item.titulo}
    </div>
  )) */
