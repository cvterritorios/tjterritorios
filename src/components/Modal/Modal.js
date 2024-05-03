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
  const [referencias, setReferencias] = useState([]);
  const [image, setImage] = useState(null);

  useEffect(() => {}, [referencias,image]);

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
      });

      reader.readAsDataURL(file);
    }
  };

  const insertContent = () => {
    return (
      <>
        <div className="m-0">
          <Form.Label htmlFor="mapaInput">Imagem Mapa</Form.Label>
          <Form.Label className="picture" htmlFor="mapaInput">
            {image ? image : <span id="picture-text">Escolha a imagem</span>}
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

          <Form.Label htmlFor="numInput">Descrição</Form.Label>
          <Form.Control type="text" id="numInput" placeholder="Território N" />

          <Form.Label
            className="text-start w-100 mb-1 mt-3"
            htmlFor="ref-input"
          >
            Referências
          </Form.Label>

          <div className="p-3 pt-1 pb-1">
            {referencias &&
              referencias.map((referencia, idx) => (
                <Row key={idx} className="bg-light p-1 rounded mb-1">
                  {referencia}
                </Row>
              ))}
          </div>

          <InputGroup className="p-3 input-group-sm w-100 pt-0 pb-3">
            <Form.Control
              type="text"
              className="w-75 m-0"
              placeholder="Uma referência"
              id="ref-input"
            />
            <Button
              className="btn btn-primary btn-sm m-0"
              onClick={handleReference}
            >
              <MdAddCircleOutline size={20} />
            </Button>
          </InputGroup>

          <Form.Label htmlFor="obsInput">Observações</Form.Label>
          <Form.Control
            as="textarea"
            placeholder="Escreva uma observação"
            id="obsInput"
          ></Form.Control>
        </div>
      </>
    );
  };

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>{modal.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{modal.type == "create" && insertContent()}</Modal.Body>
      <Modal.Footer>
        {/*  <Button variant="secondary" onClick={modal.closeButton}>
          Close
        </Button> */}
        <Button variant="primary">Understood</Button>
      </Modal.Footer>
    </>
  );
};

export { MyModal };
