import ToolsBar from "../../components/ToolsBar/ToolsBar";
import { Modal } from "react-bootstrap";
import { TerritoryModal } from "../../components/Modal/Modal";
import { useState } from "react";

const Home = () => {
  const [showTerritoryModal_New, setShowTerritoryModal_New] = useState(false);


  return (
    <>
      <ToolsBar
        create={() => setShowTerritoryModal_New(true)}
      />

      {""}

      <Modal
        size="sm"
        show={showTerritoryModal_New}
        onHide={() => setShowTerritoryModal_New(false)}
        backdrop="static"
        keyboard={false}
        centered
      >
        <TerritoryModal
          title={"Novo Território"}
          type={"create"}
        />
      </Modal>

      
    </>
  );
};

export default Home;
