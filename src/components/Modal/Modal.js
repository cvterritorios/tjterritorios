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
import { ImCross } from "react-icons/im";
import {
  AssignmentInfo,
  AvailableStatus,
  BoxOfText,
  RefTags,
} from "../../containers/Bandeja/shared";
import { ButtonWithSpinner, TimestampToDate } from "../shared";

// hooks
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useFirestore } from "../../hooks/useFirestore";
import { useAuth } from "../../contexts/AuthContext";
import PdfComp from "../PDFcmp/PdfComp";

const TerritoryModal = ({
  title,
  type,
  loading,
  territory = {},
  closeSelf = undefined,
}) => {
  const [congregacaoSelected, setCongregacaoSelected] = useState("");
  const [image, setImage] = useState(
    territory.id ? <Card.Img src={territory.map} /> : null
  );
  const [myFile, setMyFile] = useState("");
  const [description, setDescription] = useState(
    territory.id ? territory.description : "Território "
  );
  const [referencias, setReferencias] = useState(
    territory.id ? territory.references : []
  );
  const [observation, setObservation] = useState(
    territory.id ? territory.observation : ""
  );

  const { setTerritories, updateTerritories, getDocWhere, deleteTerritory } =
    useFirestore();
  const { getUser } = useLocalStorage();
  const { currentUser } = useAuth();

  useEffect(() => {
    setCongregacaoSelected(currentUser.uid);
  }, [referencias, image]);

  const handleReference = () => {
    const text = document.getElementById("ref-input").value;

    // verifica se a caixa de texto está vazia
    if (text === "") {
      alert("Escreva uma referência");
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
        alert("Preencha todos os campos obrigatórios");
        return;
      }

      if (!territory.id && !myFile) {
        alert("Preencha todos os campos obrigatórios");
        return;
      }

      if (territory.id) {
        await updateTerritories(
          territory.id,
          { ...territories, cid: congregacaoSelected },
          myFile ? myFile : null
        );
      } else {
        await setTerritories(territories, myFile);
      }
    };

    return (
      <>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="m-0">
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
            {loading ? (
              <ButtonWithSpinner variant={"primary"} />
            ) : (
              <Button variant="primary" type="submit">
                Enviar
              </Button>
            )}
          </Modal.Footer>
        </Form>
      </>
    );
  };

  const deleteContent = (territory = {}) => {
    const handleSubmit = async (e) => {
      e.preventDefault();

      if (territory.id) {
        // apagar o territorio
        deleteTerritory(territory.id);
      } else {
        // não é possivel apagar o territorio
        alert("Território inexistente");
        return;
      }
    };

    return (
      <>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="m-0 fs-5">
              Pretende realmente eliminar este território?
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="danger" type="submit">
              Confirmar
            </Button>
            <Button
              variant="secondary"
              onClick={() => closeSelf()}
              className="ml-2"
            >
              Concelar
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
      {type === "delete" && deleteContent(territory)}
    </>
  );
};

const MenuOpcoesModal = ({
  description,
  available = false,
  closeSelf,
  isAdmin,
  show_Read,
  show_Update,
  show_Delete,
}) => {
  const changeModal = (modal) => {
    closeSelf();

    setTimeout(() => {
      modal();
    }, 3000);
  };

  return (
    <>
      <ButtonGroup vertical className="divide-y divide-gray-300 w-full ">
        <Button variant="light" className="text-lg font-semibold py-2" disabled>
          {description}
        </Button>

        <Button
          variant={isAdmin ? "secondary" : "light"}
          disabled={isAdmin}
          className={`text-lg font-medium py-2`}
          onClick={() => alert("se disponivel atribuir, se não desatribuir")}
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
          variant={isAdmin ? "secondary" : "light"}
          disabled={isAdmin}
          className="text-lg font-medium py-2"
          onClick={() => {
            show_Update();
          }}
        >
          Editar
        </Button>

        <Button
          variant={isAdmin ? "secondary" : "light"}
          disabled={isAdmin}
          className="text-lg font-medium py-2"
          onClick={() => {
            show_Delete();
          }}
        >
          Eliminar
        </Button>
      </ButtonGroup>
    </>
  );
};

const DetailsModal = ({ territory, viewImage }) => {
  const {
    description,
    available,
    references,
    observation,
    map,
    requests,
    createdAt,
    updatedAt,
    assignment,
  } = territory;

  return (
    <>
      <Modal.Header closeButton className="flex items-center">
        <Modal.Title className="font-bold mr-6">{description}</Modal.Title>
        <AvailableStatus value={available} />
      </Modal.Header>

      <Modal.Body className="pt-0">
        <div className="md:space-x-2 md:flex md:items-center md:justify-between">
          <div className="h-full space-y-3 md:w-1/2">
            <Card.Img
              onClick={() => viewImage()}
              className="h-full w-full hover:cursor-pointer"
              variant="top"
              src={map}
            ></Card.Img>
            <div className=" flex justify-center w-full">
              <PdfComp territory={territory} />
            </div>
          </div>

          <div className="md:px-3  md:w-1/2">
            <div className="flex items-center my-1 justify-between">
              <h5>Data de inclusão</h5>
              <TimestampToDate
                time={createdAt}
                style={"bg-gray-100 border border-gray-600 px-2 rounded"}
              />
            </div>

            {updatedAt && (
              <div className="flex items-center my-1 justify-between">
                <h5>Ultima atualização</h5>
                <TimestampToDate
                  time={updatedAt}
                  style={"bg-gray-100 border border-gray-600 px-2 rounded"}
                />
              </div>
            )}

            <BoxOfText
              component={<RefTags item={{ references }} noCliquable />}
              title={"Referências"}
            />

            {observation && (
              <BoxOfText text={observation} title={"Observação"} />
            )}

            <div className="flex justify-between">
              <div className="flex items-center space-x-2">
                <h5>Pedidos Mês</h5>
                <div className="bg-gray-100 border border-gray-600 px-2 rounded ">
                  {requests.current}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <h5>Pedidos Total</h5>
                <div className="bg-gray-100 border border-gray-600 px-2 rounded ">
                  {requests.all}
                </div>
              </div>
            </div>

            {!available && (
              <div className="mt-2">
                <AssignmentInfo
                  publisher={assignment?.publisher.name}
                  date={<TimestampToDate time={assignment?.date} />}
                  responsible={assignment?.responsible.name}
                />
              </div>
            )}
          </div>
        </div>
      </Modal.Body>
    </>
  );
};

const ViewImageModal = ({ image, closeSelf }) => {
  return (
    <>
      <Modal.Body className="relative">
        <Button
          variant="transparent"
          className="text-white absolute end-7 top-7 cursor-pointer"
          onClick={closeSelf}
        >
          <ImCross size={30} />
        </Button>

        <Card.Img src={image} />
      </Modal.Body>
    </>
  );
};

export { TerritoryModal, MenuOpcoesModal, DetailsModal, ViewImageModal };
