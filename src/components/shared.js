import React from "react";
import { Button, Modal } from "react-bootstrap";

const MyModal = ({
  isOpen,
  children,
  title,
  close,
  noStatic = false,
  size = "md",
}) => {
  const mySize =
    size == "sm"
      ? "w-1/5"
      : size == "md"
      ? "w-1/4"
      : size == "lg"
      ? "w-1/3"
      : "w-1/2";
  const BACKGROUND = "fixed top-0 bottom-0 start-0 end-0 bg-black/60 z-50";
  const CONTAINER =
    "fixed bottom-1/2 end-1/2 translate-x-1/2 translate-y-1/2 bg-white pt-10 p-2 rounded-lg z-[60] " +
    mySize;

  if (isOpen)
    return (
      <>
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Modal heading
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Centered Modal</h4>
            <p>
              Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
              dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta
              ac consectetur ac, vestibulum at eros.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={props.onHide}>Close</Button>
          </Modal.Footer>
        </Modal>
      </>
    );

  return null;
};

export { MyModal as Modal };
