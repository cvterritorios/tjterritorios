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

const MyModal = (modal) => {
  //

  // data Novo Territorio
  const [image, setImage] = useState(null);
  const [linkImg, setLinkImg] = useState("");
  const [description, setDescription] = useState("");
  const [referencias, setReferencias] = useState([]);
  const [observation, setObservation] = useState("");

  useEffect(() => {}, [referencias, image]);

  const handleReference = () => {
    const text = document.getElementById("ref-input").value;

    if (text === "") {
      console.log("Escreva uma referência");
      return;
    }

    let myArray = [];

    if (referencias.length > 0) {
      myArray.push(...referencias);
    }

    if (referencias.includes(text)) return;

    myArray.push(text);

    setReferencias(myArray);

    document.getElementById("ref-input").value = "";

    // console.log(referencias.includes(text));
  };

  const handlePreview = (file) => {
    if (file) {
      const reader = new FileReader();

      reader.addEventListener("load", (e) => {
        const readerTarget = e.target;

        setImage(<Card.Img src={readerTarget.result} />);
        setLinkImg(readerTarget.result);
      });

      reader.readAsDataURL(file);
    }
  };

  // handleSubmit Novo Territorio
  const handleSubmit = () => {
    const territories = {
      description: description, // to validate
      available: true,
      map: linkImg, // to validate
      observation: observation,
      references: referencias, // to validate
    };

    // if no description, map, or references, return
    if (!description || !linkImg || !referencias) {
      console.log("Preencha todos os campos obrigatórios");
      return;
    }

    // add territories to firestore, if true, add image to storage

    // clear all states
    setImage(null);
    setLinkImg("");
    setDescription("");
    setReferencias([]);
    setObservation("");

    // refresh page
  };

  const insertCreateContent = () => {
    return (
      <>
        <Form onSubmit={(e) => e.preventDefault()}>
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

              <Form.Control type="text" placeholder="Descrição" />

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
