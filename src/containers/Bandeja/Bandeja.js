import { useEffect, useState } from "react";
import { Container, Card, Row, Col, Badge, Button } from "react-bootstrap";
import { useFirestore } from "../../hooks/useFirestore";
import { GrStatusGood, GrStatusCritical } from "react-icons/gr";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { or } from "firebase/firestore";

const Bandeja = ({
  viewGrid,
  filter = [],
  searching,
  setTag,
  isOrdered = false,
  orderDir,
}) => {
  const [collection, setCollection] = useState([]);
  const [searchTag, setSearchTag] = useState(false);

  const [myOrderBy, setMyOrderBy] = useState({});

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    getCollection,
    getCollectionWhere,
    error: dataError,
    loading: dataLoading,
  } = useFirestore();

  const startBandeja = async () => {
    setLoading(true);

    if (isOrdered) {
      setMyOrderBy({ attr: isOrdered, dir: orderDir });
    }

    if (searching) {
      if (searchTag) {
        const collsT = await getCollectionWhere(
          "territorios",
          {
            attr: "references",
            comp: "array-contains",
            value: searching,
          },
          isOrdered && myOrderBy
        );

        setCollection(collsT);

        console.log(collsT);
        setLoading(false);
        setSearchTag(false);
        return;
      } else {
        const coll = await getCollectionWhere(
          "territorios",
          {
            attr: "description",
            comp: "==",
            value: searching,
          },
          isOrdered && myOrderBy
        );
        setCollection(coll);
        setLoading(false);
        return;
      }
    }

    if (filter[0]) {
      const coll = await getCollectionWhere(
        "territorios",
        {
          attr: "available",
          comp: "==",
          value: true,
        },
        isOrdered ? myOrderBy : false
      );
      setCollection(coll);
    } else if (filter[1]) {
      const coll = await getCollectionWhere(
        "territorios",
        {
          attr: "available",
          comp: "==",
          value: false,
        },
        isOrdered && myOrderBy
      );
      setCollection(coll);
    } else {
      const coll = await getCollection("territorios", isOrdered && myOrderBy);
      setCollection(coll);
    }
    setLoading(false);
  };

  useEffect(() => {
    startBandeja();
    if (error) setError(error);
  }, [error, filter, searching]);

  if (loading) {
    <p>carregando..</p>;
  }

  if (!viewGrid) {
    return (
      <>
        <Container className="flex flex-wrap lg:justify-between justify-center ">
          {collection.map((item, idx) => (
            <div id={item.id} key={idx} className="m-1">
              <Card className="border border-end-0 border-start-0 rounded-0 w-[25rem] h-[6rem]">
                <Card.Body className="text-center ">
                  <Row className="">
                    <Col xs={3} className="p-0 h-full">
                      <Card.Img
                        className="h-16 w-full hover:cursor-pointer"
                        variant="top"
                        src={item.map}
                      ></Card.Img>
                    </Col>
                    <Col className="px-1">
                      <Row className="justify-between flex">
                        <Col
                          xs={5}
                          className="font-bold text-base text-start ml-2 hover:cursor-pointer"
                          name="Description"
                        >
                          {item.description}
                        </Col>
                        <Col className="" name="availeble">
                          <div className="text-start text-base">
                            {item.available ? (
                              <span class="text-success flex items-center">
                                Disponivel <GrStatusGood className="ml-1" />
                              </span>
                            ) : (
                              <span class="text-danger flex items-center">
                                Indisponivel{" "}
                                <GrStatusCritical className="ml-1" />
                              </span>
                            )}
                          </div>
                        </Col>
                        <Col xs={1} className="p-0 h-full" name="dotmenu">
                          <Button
                            variant="outline-light"
                            className="border-0"
                            size="sm"
                          >
                            <HiOutlineDotsVertical size={20} color="black" />
                          </Button>
                        </Col>
                      </Row>
                      <Row className="w-full flex m-2" name="references">
                        {item.references.map((ref, idx) => (
                          <Badge
                            bg="light"
                            text="dark"
                            className={
                              "ml-2 border w-fit hover:cursor-pointer "
                            }
                            title={ref}
                            onClick={() => {
                              setTag(ref);
                              setSearchTag(true);
                            }}
                          >
                            {ref}
                          </Badge>
                        ))}
                      </Row>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </div>
          ))}
        </Container>
      </>
    );
  }

  return (
    <>
      <Container className="flex flex-wrap lg:justify-between justify-center ">
        {collection.map((item, idx) => (
          <div id={item.id} key={idx} className="m-1">
            <Card className="border rounded md:w-[20rem] md:h-[20rem]">
              <Card.Body className="text-center h-full">
                <Row className="h-1/2">
                  <Card.Img
                    className="h-full w-full hover:cursor-pointer"
                    variant="top"
                    src={item.map}
                  ></Card.Img>
                </Row>
                <Row className="justify-between flex my-2 px-2">
                  <Col
                    className="px-1 font-bold text-base text-start hover:cursor-pointer"
                    name="Description"
                  >
                    {item.description}
                  </Col>
                  <Col className="text-base" name="availeble">
                    {item.available ? (
                      <div class="text-success flex items-center ml-9">
                        Disponivel <GrStatusGood className="ml-1" />
                      </div>
                    ) : (
                      <div class="text-danger flex items-center ml-9">
                        Indisponivel <GrStatusCritical className="ml-1" />
                      </div>
                    )}
                  </Col>
                </Row>
                Referências
                <Row className="w-full flex mx-1" name="references">
                  {item.references.map((ref, idx) => (
                    <Badge
                      bg="light"
                      text="dark"
                      className={"ml-2 border w-fit "}
                    >
                      {ref}
                    </Badge>
                  ))}
                </Row>
                Observações
                <Row className="w-full flex mx-1" name="obserations">
                  {item.observation && (
                    <p className="ml-1 text-start">{item.observation}</p>
                  )}
                  {!item.observation && (
                    <p className="ml-1 text-start">Sem observações</p>
                  )}
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
