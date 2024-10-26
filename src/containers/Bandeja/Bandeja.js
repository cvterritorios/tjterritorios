import { useEffect, useState } from "react";
import { Container, Card, Row, Col, Badge, Modal } from "react-bootstrap";
import { useFirestore } from "../../hooks/useFirestore";
import { useLocalStorage } from "../../hooks/useLocalStorage";

import {
  DetailsModal,
  MenuOpcoesModal,
  TerritoryModal,
  ViewImageModal,
} from "../../components/Modal/Modal";
import { AvailableStatus, CardsGrid, CardsList, RefTags } from "./shared";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";

const Bandeja = ({
  territoryCollection,
  viewGrid,
  searching,
  setTag,
  setSearchFunction,
  isOrdered,
  orderDir,
  congregacaoId = false,
}) => {
  const [collection, setCollection] = useState([]);
  const [territoryNowData, setTerritoryNowData] = useState({});


  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showOpcoesModal, setShowOpcoesModal] = useState(false);
  const [showViewImageModal, setShowViewImageModal] = useState(false);

  const handleShowOpcoesModal = () => setShowOpcoesModal(true);
  const handleCloseOpcoesModal = () => setShowOpcoesModal(false);
  const handleClosImage = () => setShowViewImageModal(false);

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const { isAdmin } = useAuth();
  const { theme, cardColor } = useTheme();




  useEffect(() => {
    territoryCollection.length > 0 && setCollection(territoryCollection);

    if (isOrdered === "createdAt") {
      ordenarPorData();
    } else if (isOrdered === "description") {
      ordenarPorDescricao();
    } else if (isOrdered === "requests") {
      ordenarPorPedidos();
    }

    error && setError(error);
  }, [
    error,
    searching,
    viewGrid,
    isOrdered,
    orderDir,
    congregacaoId,
    territoryCollection,
  ]);

  const ordenarPorData = () => {
    const collectionOrdenada = [...collection].sort((a, b) => {
      if (orderDir === "asc") {
        return a.createdAt.toMillis() - b.createdAt.toMillis();
      } else {
        return b.createdAt.toMillis() - a.createdAt.toMillis();
      }
    });
    setCollection(collectionOrdenada);
  };

  const ordenarPorDescricao = () => {
    const collectionOrdenada = [...collection].sort((a, b) => {
      if (orderDir === "asc") {
        return a.description.localeCompare(b.description);
      } else {
        return b.description.localeCompare(a.description);
      }
    });
    setCollection(collectionOrdenada);
  };

  const ordenarPorPedidos = () => {
    const collectionOrdenada = [...collection].sort((a, b) => {
      if (orderDir === "asc") {
        return a.requests - b.requests;
      } else {
        return b.requests - a.requests;
      }
    });
    setCollection(collectionOrdenada);
  };

  const myModals = () => {
    return (
      <>
        {/* Menu de Opocoes */}
        <Modal
          size="sm"
          show={showOpcoesModal}
          onHide={() => handleCloseOpcoesModal()}
          centered
        >
          <MenuOpcoesModal
            description={territoryNowData.description}
            available={territoryNowData.available}
            closeSelf={() => handleCloseOpcoesModal()}
            isAdmin={isAdmin}
            /* show Modals opcoes */
            show_Update={() => setShowUpdateModal(true)}
            show_Read={() => setShowDetailsModal(true)}
            show_Delete={() => setShowDeleteModal(true)}
          />
        </Modal>

        {/* Opcao Read - Detalhes */}
        <Modal
          size="lg"
          show={showDetailsModal}
          onHide={() => setShowDetailsModal(false)}
          backdrop="static"
          keyboard={false}
          centered
        >
          <DetailsModal
            title={"Detalhes do Território"}
            territory={territoryNowData}
            viewImage={() => setShowViewImageModal(true)}
          />
        </Modal>

        {/* View Image */}
        <Modal
          className="index-34"
          size="xl"
          show={showViewImageModal}
          onHide={handleClosImage}
          centered
        >
          <ViewImageModal
            image={territoryNowData.map}
            closeSelf={handleClosImage}
          />
        </Modal>

        {/* Opcao Update - Editar */}
        <Modal
          size="sm"
          show={showUpdateModal}
          onHide={() => setShowUpdateModal(false)}
          backdrop="static"
          keyboard={false}
          centered
        >
          <TerritoryModal
            title={"Editar Território"}
            type={"update"}
            territory={territoryNowData}
          />
        </Modal>

        {/* Opcao Delete - Eliminar */}
        <Modal
          size="md"
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          backdrop="static"
          keyboard={false}
          centered
        >
          <TerritoryModal
            title={"Eliminar Território"}
            type={"delete"}
            territory={territoryNowData}
            closeSelf={() => setShowDeleteModal(false)}
          />
        </Modal>
      </>
    );
  };

  return (
    <>
      <Container className="flex flex-wrap lg:justify-evenly justify-center ">
        {collection?.map((item, idx) => (
          <div id={item.id} key={idx} className="m-1">
            {!viewGrid && (
              <CardsList
                item={item}
                handleShowOpcoesModal={handleShowOpcoesModal}
                setTerritoryNowData={setTerritoryNowData}
                setTag={setTag}
                setSearchFunction={setSearchFunction}
                noCliquable={!congregacaoId}
                background={cardColor}
              />
            )}
            {viewGrid && (
              <CardsGrid
                item={item}
                handleShowOpcoesModal={handleShowOpcoesModal}
                setTerritoryNowData={setTerritoryNowData}
                setTag={setTag}
                setSearchFunction={setSearchFunction}
                noCliquable={!congregacaoId}
                background={cardColor}
              />
            )}
          </div>
        ))}
        {!collection.length > 0 && <h1>Nenhum território encontrado</h1>}
      </Container>
      {showOpcoesModal && myModals()}
    </>
  );
};

export default Bandeja;
