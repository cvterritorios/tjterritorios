import { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Card,
  Row,
  Col,
  Form,
  InputGroup,
} from "react-bootstrap";
import { MdAddCircleOutline } from "react-icons/md";
import { useFirestore } from "../../hooks/useFirestore";

const MyModal = (modal) => {
  //

  // data Novo Territorio
  const [image, setImage] = useState(null);
  const [myFile, setMyFile] = useState("");
  const [description, setDescription] = useState("");
  const [referencias, setReferencias] = useState([]);
  const [observation, setObservation] = useState("");

  const { setTerritories } = useFirestore();

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

  const insertCreateContent = () => {
    // handleSubmit Novo Territorio
    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log(myFile)

      const territories = {
        description: description, // to validate
        available: true,
        observation: observation,
        references: referencias, // to validate
      };

      // if no description, map, or references, return
      if (!description || !myFile || !referencias) {
        console.log("Preencha todos os campos obrigatórios");
        return;
      }

      // add territories to firestore, if true, add image to storage
      console.log(territories);
      const response = await setTerritories(territories,myFile);
      /* // refresh page
      if (response) window.location.reload();
      else {
        // clear all states
        setImage(null);
        setLinkImg("");
        setDescription("");
        setReferencias([]);
        setObservation("");
      } */
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
                onChange={(e) => setDescription(e.target.value)}
              />

              <div className="p-3 pt-1 pb-1">
                {referencias &&
                  referencias.map((referencia, idx) => (
                    <Row key={idx} className="bg-light p-1 rounded mb-1">
                      {referencia}
                    </Row>
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
        <Modal.Title>{modal.title}</Modal.Title>
      </Modal.Header>

      {modal.type == "create" && insertCreateContent()}
    </>
  );
};

export { MyModal };
