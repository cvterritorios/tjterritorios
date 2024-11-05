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

import northTop from "../../assets/images/north/top.png";
import northRight from "../../assets/images/north/right.png";
import northLeft from "../../assets/images/north/left.png";

// hooks
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useFirestore } from "../../hooks/useFirestore";
import { useAuth } from "../../contexts/AuthContext";
import PdfComp from "../PDFcmp/PdfComp";
import { useTheme } from "../../contexts/ThemeContext";
import { NorthLeftIcon, NorthRightIcon, NorthTopIcon } from "../Icons/MyIcons";

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
  const [location, setLocation] = useState(
    territory.id ? territory.location : ""
  );
  const [northPosition, setNorthPosition] = useState(
    territory.id ? territory.northPosition : "top"
  );
  const [mapLinkGoogle, setMapLinkGoogle] = useState(
    territory.id ? territory.mapLinkGoogle : ""
  );
  const [streets, setStreets] = useState(territory.id ? territory.streets : []);
  const [references, setReferences] = useState(
    territory.id ? territory.references : []
  );
  const [observation, setObservation] = useState(
    territory.id ? territory.observation : ""
  );

  const { setTerritories, updateTerritories, getDocWhere, deleteTerritory } =
    useFirestore();
  const { getUser } = useLocalStorage();
  const { currentUser } = useAuth();
  const { backTextView } = useTheme();

  useEffect(() => {
    setCongregacaoSelected(currentUser.uid);
  }, [references, image]);

  const handleAddLine = (name, id, array, setArray) => {
    const text = document.getElementById(id).value;

    // verifica se a caixa de texto está vazia
    if (text === "") {
      alert(`Escreva uma ${name.toLowerCase()}`);
      return;
    }

    let myArray = [];

    // verifica se já existe referencia, se sim adiciona-as ao novo array
    if (array.length > 0) {
      myArray.push(...array);
    }

    // verifica se a nova referencia já existe, se sim sai
    if (array.includes(text)) return;

    // adiciona a nova referencia ao array
    myArray.push(text);

    // seta o novo array em referencias
    setArray(myArray);

    // limpa o input
    document.getElementById(id).value = "";
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
        northPosition: northPosition,
        streets: streets,
        location: location,
        description: description, // to validate
        available: territory.id ? territory.available : true,
        observation: observation,
        references: references, // to validate
      };

      // if no description, map, or references, return
      if (!description || !references) {
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
                placeholder="Link Google Maps"
                value={mapLinkGoogle}
                onChange={(e) => setMapLinkGoogle(e.target.value)}
              />

              <Form.Control
                type="text"
                placeholder="Descrição"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <Form.Control
                type="text"
                placeholder="Localidade"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />

              <div className="p-3 pt-1 pb-1">
                {streets &&
                  streets.map((street, idx) => (
                    <div
                      key={idx}
                      className={`${backTextView} p-1 flex items-center justify-between rounded mb-1`}
                    >
                      <div></div>
                      {street}
                      <Button
                        size="sm"
                        variant="outline-danger"
                        className=""
                        onClick={() => {
                          const myArray = [...streets];
                          myArray.splice(idx, 1);
                          setStreets(myArray);
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
                  placeholder="Adicionar rua"
                  id="street-input"
                />
                <Button
                  className="btn btn-primary m-0"
                  onClick={() =>
                    handleAddLine("Rua", "street-input", streets, setStreets)
                  }
                >
                  <MdAddCircleOutline size={20} />
                </Button>
              </InputGroup>

              <div className="p-3 pt-1 pb-1">
                {references &&
                  references.map((referencia, idx) => (
                    <div
                      key={idx}
                      className={`${backTextView} p-1 flex items-center justify-between  rounded mb-1`}
                    >
                      <div></div>
                      {referencia}
                      <Button
                        size="sm"
                        variant="outline-danger"
                        className=""
                        onClick={() => {
                          const myArray = [...references];
                          myArray.splice(idx, 1);
                          setReferences(myArray);
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
                  onClick={() =>
                    handleAddLine(
                      "Referência",
                      "ref-input",
                      references,
                      setReferences
                    )
                  }
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

          <Modal.Footer className="border-none">
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

          <Modal.Footer className="border-none">
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
      <Modal.Header className="flex items-center border-none" closeButton>
        <Modal.Title className="text-sm font-semibold">{title}</Modal.Title>
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
  isAdmin,
  show_Read,
  show_Update,
  show_Delete,
  theme,
}) => {
  const VARIANT = theme === "dark" ? "dark" : "light";

  return (
    <>
      <ButtonGroup vertical className="divide-y divide-gray-300 w-full ">
        <Button
          variant={VARIANT}
          className={`text-lg font-bold py-2 bg-${VARIANT} hover:bg-${VARIANT} border-${VARIANT} hover:cursor-default`}
        >
          {description}
        </Button>

        <Button
          variant={isAdmin ? "secondary" : VARIANT}
          disabled={isAdmin}
          className={`text-lg font-medium py-2 border-none`}
          onClick={() => alert("se disponivel atribuir, se não desatribuir")}
        >
          {available ? (
            <span className="text-success">Atribuir</span>
          ) : (
            <span className="text-danger">Desatribuir</span>
          )}
        </Button>

        <Button
          variant={VARIANT}
          className="text-lg font-medium py-2 border-none"
          onClick={() => {
            show_Read();
          }}
        >
          Detalhes
        </Button>

        <Button
          variant={isAdmin ? "secondary" : VARIANT}
          disabled={isAdmin}
          className="text-lg font-medium py-2 border-none"
          onClick={() => {
            show_Update();
          }}
        >
          Editar
        </Button>

        <Button
          variant={isAdmin ? "secondary" : VARIANT}
          disabled={isAdmin}
          className="text-lg font-medium py-2 border-none"
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
    northPosition,
    streets,
    location,
  } = territory;

  const { backTextView } = useTheme();

  return (
    <>
      <Modal.Header closeButton className="flex items-center border-none">
        <div className="flex items-center w-full">
          <div className="w-1/2 flex items-center justify-between">
            <Modal.Title className="font-bold mr-6">{description}</Modal.Title>
            <AvailableStatus value={available} />
            <div>
              {northPosition === "top" && (
                <NorthTopIcon color="white" size={40} title="Norte para cima" />
              )}
              {northPosition === "right" && (
                <NorthRightIcon
                  color="white"
                  size={40}
                  title="Norte para direita"
                />
              )}
              {northPosition === "left" && (
                <NorthLeftIcon
                  color="white"
                  size={40}
                  title="Norte para esquerda"
                />
              )}
            </div>
          </div>
        </div>
      </Modal.Header>

      <Modal.Body className="pt-0">
        <div className="md:space-x-2 md:flex md:items-top md:justify-between">
          <div className="h-full space-y-3 md:w-1/2">
            <Card.Img
              onClick={() => viewImage()}
              className="h-full w-full hover:cursor-pointer"
              variant="top"
              src={map}
            ></Card.Img>
            <div className=" flex justify-center w-full">
              <PdfComp territory={territory} image={map} />
            </div>
          </div>

          <div className="md:px-3  md:w-1/2">
            <div className="flex items-center my-1 justify-between">
              <h5>Localidade</h5>
              <div className={`${backTextView} px-2 rounded `}>{location}</div>
            </div>

            <div className="flex items-center my-1 justify-between">
              <h5>Data de inclusão</h5>
              <TimestampToDate
                time={createdAt}
                style={`${backTextView} px-2 rounded`}
              />
            </div>

            {updatedAt && (
              <div className="flex items-center my-1 justify-between">
                <h5>Ultima atualização</h5>
                <TimestampToDate
                  time={updatedAt}
                  style={`${backTextView} px-2 rounded`}
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
                <div className={`${backTextView} px-2 rounded `}>
                  {requests.current}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <h5>Pedidos Total</h5>
                <div className={`${backTextView} px-2 rounded `}>
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

const MyModal = ({
  show,
  children,
  onHide,
  isStatic = false,
  className = "",
  centered = false,
  size = "md",
  theme,
}) => {
  const mySize =
    size === "xs"
      ? "w-64" //42%
      : size === "sm"
      ? "w-72" //50%
      : size === "md"
      ? "w-80" //58%
      : size === "lg"
      ? "w-96" //66%
      : size;
  const BACKGROUND =
    theme === "light"
      ? "fixed top-0 bottom-0 start-0 end-0 bg-black/60 z-50"
      : "fixed top-0 bottom-0 start-0 end-0 bg-white/10 z-50";
  const CENTERPOSITION = "bottom-1/2 end-1/2 translate-x-1/2 translate-y-1/2";
  const CONTAINER = `fixed rounded-lg ${
    !centered ? "top-0 translate-x-1/2" : ""
  } z-[60] ${theme === "light" ? "bg-white" : "bg-black"} ${mySize} ${
    centered ? CENTERPOSITION : ""
  } `;

  if (show)
    return (
      <>
        <div className={BACKGROUND} onClick={isStatic ? null : onHide}></div>
        <div className={`${CONTAINER} ${className}`}>{children}</div>
      </>
    );

  return null;
};

export {
  TerritoryModal,
  MenuOpcoesModal,
  DetailsModal,
  ViewImageModal,
  MyModal,
};
