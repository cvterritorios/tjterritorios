import { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Card,
  Form,
  Col,
  Badge,
  Row,
  InputGroup,
  ButtonGroup,
} from "react-bootstrap";
import { MdAddCircleOutline } from "react-icons/md";
import { useFirestore } from "../../hooks/useFirestore";
import { ImCross } from "react-icons/im";
import { GrStatusGood, GrStatusCritical } from "react-icons/gr";

const TerritoryModal = ({ title, type, territory = {} }) => {
  const [image, setImage] = useState(
    territory.id ? <Card.Img src={territory.map} /> : null
  );
  const [myFile, setMyFile] = useState("");
  const [description, setDescription] = useState(
    territory.id ? territory.description : ""
  );
  const [referencias, setReferencias] = useState(
    territory.id ? territory.references : []
  );
  const [observation, setObservation] = useState(
    territory.id ? territory.observation : ""
  );

  const { setTerritories, updateTerritories } = useFirestore();

  useEffect(() => {}, [referencias, image]);

  const handleReference = () => {
    const text = document.getElementById("ref-input").value;

    // verifica se a caixa de texto está vazia
    if (text === "") {
      console.log("Escreva uma referência");
      return;
    }

    let myArray = [];

    // verifica se já existe referencia, se sim adiciona-as ao novo array
    if (referencias.length > 0) {
      myArray.push(...referencias);
    }

    // verifica se a nova referencia já existe, se sim sai
    if (referencias.includes(text)) return;

    // adiciona a nova referencia ao array
    myArray.push(text);

    // seta o novo array em referencias
    setReferencias(myArray);

    // limpa o input
    document.getElementById("ref-input").value = "";

    // console.log(referencias.includes(text));
  };

  const handlePreview = (file) => {
    if (file) {
      const reader = new FileReader();

      reader.addEventListener("load", (e) => {
        const readerTarget = e.target;

        setImage(<Card.Img src={readerTarget.result} />);
        setMyFile(file);
      });

      reader.readAsDataURL(file);
    }
  };

  const insertContent = (territory = {}) => {
    // handleSubmit Novo Territorio
    const handleSubmit = async (e) => {
      e.preventDefault();

      const territories = {
        description: description, // to validate
        available: territory.id ? territory.available : true,
        observation: observation,
        references: referencias, // to validate
      };

      // if no description, map, or references, return
      if (!description || !referencias) {
        console.log("Preencha todos os campos obrigatórios");
        return;
      }

      if (!territory.id && !myFile) {
        console.log("Preencha todos os campos obrigatórios");
        return;
      }

      // add territories to firestore, if true, add image to storage

      if (territory.id) {
        alert("Go update");
        await updateTerritories(
          territory.id,
          territories,
          myFile ? myFile : null
        );
      } else {
        alert("go create");
        //await setTerritories(territories, myFile);
      }
    };

    return (
      <>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="m-0">
              {/* <Form.Label htmlFor="mapaInput">Imagem Mapa</Form.Label> */}
              <Form.Label className="picture" htmlFor="mapaInput">
                {image ? (
                  image
                ) : (
                  <span id="picture-text">Escolha a imagem</span>
                )}
              </Form.Label>
              <Form.Control
                type="file"
                accept=".jpg,.png,.jpeg"
                className="d-none"
                id="mapaInput"
                onChange={(e) => {
                  handlePreview(e.target.files[0]);
                }}
              />

              <Form.Control
                type="text"
                placeholder="Descrição"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <div className="p-3 pt-1 pb-1">
                {referencias &&
                  referencias.map((referencia, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-200 p-1 flex items-center justify-between  rounded mb-1"
                    >
                      {referencia}
                      <Button
                        size="sm"
                        variant="outline-danger"
                        className=""
                        onClick={() => {
                          const myArray = [...referencias];
                          myArray.splice(idx, 1);
                          setReferencias(myArray);
                        }}
                      >
                        <ImCross size={10} />
                      </Button>
                    </div>
                  ))}
              </div>

              <InputGroup className=" w-100 pt-0 pb-2">
                <Form.Control
                  type="text"
                  className="w-75 m-0"
                  placeholder="Adicionar referência"
                  id="ref-input"
                />
                <Button
                  className="btn btn-primary m-0"
                  onClick={handleReference}
                >
                  <MdAddCircleOutline size={20} />
                </Button>
              </InputGroup>

              <Form.Control
                as="textarea"
                placeholder="Escreva uma observação"
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
              ></Form.Control>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="primary" type="submit">
              Enviar
            </Button>
          </Modal.Footer>
        </Form>
      </>
    );
  };

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      {type === "create" && insertContent()}
      {type === "update" && insertContent(territory)}
    </>
  );
};

const MenuOpcoesModal = ({
  id,
  description,
  available = false,
  closeSelf,
  show_Read,
  show_Update,
  show_Delete,
}) => {
  return (
    <>
      <ButtonGroup vertical className="divide-y divide-gray-300 w-full ">
        <Button variant="light" className="text-lg font-semibold py-2" disabled>
          {description}
        </Button>

        <Button
          variant="light"
          className="text-lg font-medium py-2"
          onclick="se disponivel atribuir, se não desatribuir"
        >
          {available ? (
            <span className="text-success">Atribuir</span>
          ) : (
            <span className="text-danger">Desatribuir</span>
          )}
        </Button>

        <Button
          variant="light"
          className="text-lg font-medium py-2"
          onClick={() => {
            show_Read();
          }}
        >
          Detalhes
        </Button>

        <Button
          variant="light"
          className="text-lg font-medium py-2"
          onClick={() => {
            show_Update();
          }}
        >
          Editar
        </Button>

        <Button
          variant="light"
          className="text-lg font-medium py-2"
          onclick="Abrir moda de delete"
        >
          Eliminar
        </Button>
      </ButtonGroup>
    </>
  );
};

const DetailsModal = ({ title, territory }) => {
  const {
    description,
    available,
    references,
    observation,
    map,
    requests,
    createdAt,
    updatedAt,
  } = territory;
  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body className="flex">
        <Col xs={6}>
          <Row name="image">
            <Card.Img
              className="h-full w-full hover:cursor-pointer"
              variant="top"
              src={map}
            ></Card.Img>
          </Row>
          <Row>
            <Col name="Descrição">{description}</Col>
            <Col name="Disponibilidade">
              {available ? (
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
          <Row name="Referencias">
            {references.map((ref, idx) => (
              <Badge
                bg="light"
                text="dark"
                key={idx}
                className={"ml-2 border w-fit "}
              >
                {ref}
              </Badge>
            ))}
          </Row>
        </Col>

        <Col xs={6} className="text-end">
          <Row name="Observação">{observation}</Row>
          <Row name="Pedidos">
            <Col>
              <h5>Pedidos Mês</h5>
              {requests}
            </Col>
            <Col>
              <h5>Pedidos Total</h5>
              {requests + 10}
            </Col>
          </Row>
          <Row name="Datas">
            {/* {createdAt} */}
           {/*  {updatedAt ? updatedAt : ""} */}
          </Row>
          <Row name="Info de atribuição">
            {!available && (
              <>
                <Row>Nome do Publicador</Row>
                <Row>Data de atribuição</Row>
                <Row>Atribuido por:</Row>
              </>
            )}
          </Row>
        </Col>
      </Modal.Body>
    </>
  );
};

export { TerritoryModal, MenuOpcoesModal, DetailsModal };
