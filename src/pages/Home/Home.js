import ToolsBar from "../../components/ToolsBar/ToolsBar";
import { Modal } from "react-bootstrap";
import { MyModal } from "../../components/Modal/Modal";
import { useState } from "react";
import Bandeja from "../../containers/Bandeja/Bandeja";

const Home = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <ToolsBar create={handleShow} />

      {""}

      <Modal
        size="sm"
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <MyModal
          title={"Novo Território"}
          type={"create"}
          closeButton={handleClose}
        />
      </Modal>
    </>
  );
};

export default Home;
