import ToolsBar from "../../components/ToolsBar/ToolsBar";
import { Modal } from "react-bootstrap";
import { TerritoryModal } from "../../components/Modal/Modal";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

const Home = () => {
  const { isAuth } = useAuth();
  const [showTerritoryModal_New, setShowTerritoryModal_New] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isAuth) {
    return <h1>Carregando...</h1>; // ou redirecionar para login se não estiver logado.  // return <Redirect to="/login" />  // return <Redirect to={{ pathname: '/login', state: { from: location } }} />  // return <Redirect to="/login?redirect_to=/home" />  // return <Redirect to="/login" state={{ from: location }} />  // return <Redirect to="/login" push />  // return <Redirect to={{ pathname: '/login', state: { from: location } }} push />  // return <Redirect to={{ pathname: '/login', state: { from: location }, search: '?redirect_to=/home' }} push />  // return <Redirect to={{ pathname: '/login', state: { from: location }, search: '?redirect_to=/home', hash: '#section1' }} push />  // return <Redirect
  }

  return (
    <>
      <ToolsBar
        create={() => setShowTerritoryModal_New(true)}
        setLoading={() => setLoading}
        setError={() => setError}
      />

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
          loading={loading}
        />
      </Modal>
    </>
  );
};

export default Home;
