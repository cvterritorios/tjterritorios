import { useEffect, useState } from "react";
import { Container, Card, Row, Col, Badge, Modal } from "react-bootstrap";
import { useFirestore } from "../../hooks/useFirestore";
import { useSessionStorage } from "../../hooks/useSessionStorage";

import {
  DetailsModal,
  MenuOpcoesModal,
  TerritoryModal,
  ViewImageModal,
} from "../../components/Modal/Modal";
import { AvailableStatus, CardsGrid, CardsList, RefTags } from "./shared";
import { useAuth } from "../../contexts/AuthContext";

const Bandeja = ({
  collectionSearch,
  viewGrid,
  filter = [],
  searching,
  setTag,
  isOrdered,
  orderDir,
  congregacaoId = false,
  setListaTerritorios,
}) => {
  const [collection, setCollection] = useState([]);
  const [territoryNowData, setTerritoryNowData] = useState({});

  const [searchTag, setSearchTag] = useState(false);
  const [myOrderBy, setMyOrderBy] = useState({});

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

  const {
    getTerritories,
    getTerritoriesWhere,
    error: dataError,
    loading: dataLoading,
  } = useFirestore();
  const { isAdmin } = useAuth();

  const startBandeja = async () => {
    setLoading(true);

    setMyOrderBy({ attr: isOrdered, dir: orderDir });

    function checkCongToAdmin() {
      if (isAdmin && !congregacaoId) {
        alert("Você precisa selecionar uma congregação");
        return true;
      }
      return false;
    }

    if (searchTag) {
      const where = {
        attr: "references",
        comp: "array-contains",
        value: searching,
      };
      const order = { attr: isOrdered, dir: orderDir };

      const collsT = await getTerritoriesWhere({
        whr: where,
        congregacaoId: congregacaoId,
        isAdmin: isAdmin,
        ord: order,
      });

      setCollection(collsT);
      setLoading(false);
      return;
    }

    if (filter[0] && !checkCongToAdmin()) {
      const where = {
        attr: "available",
        comp: "==",
        value: true,
      };

      const order = { attr: isOrdered, dir: orderDir };

      const coll = await getTerritoriesWhere({
        whr: where,
        congregacaoId: congregacaoId,
        isAdmin: isAdmin,
        ord: order,
      });
      setCollection(coll);
    } else if (filter[1] && !checkCongToAdmin()) {
      const where = {
        attr: "available",
        comp: "==",
        value: false,
      };
      const order = { attr: isOrdered, dir: orderDir };

      const coll = await getTerritoriesWhere({
        whr: where,
        congregacaoId: congregacaoId,
        isAdmin: isAdmin,
        ord: order,
      });

      setCollection(coll);
    } else {
      const coll = await getTerritories(
        isOrdered && myOrderBy,
        isAdmin,
        congregacaoId
      );
      setCollection(coll);
      setListaTerritorios(coll);
    }

    setLoading(false);
  };

  useEffect(() => {
    startBandeja();

    if (error) setError(error);
  }, [error, filter, searching, viewGrid, isOrdered, orderDir, congregacaoId]);

  if (loading) {
    <p>carregando..</p>;
  }

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
        {collection.map((item, idx) => (
          <div id={item.id} key={idx} className="m-1">
            {!viewGrid && (
              <CardsList
                item={item}
                handleShowOpcoesModal={handleShowOpcoesModal}
                setTerritoryNowData={setTerritoryNowData}
                setTag={setTag}
                setSearchTag={setSearchTag}
                noCliquable={!congregacaoId}
              />
            )}
            {viewGrid && (
              <CardsGrid
                item={item}
                handleShowOpcoesModal={handleShowOpcoesModal}
                setTerritoryNowData={setTerritoryNowData}
                setTag={setTag}
                setSearchTag={setSearchTag}
                noCliquable={!congregacaoId}
              />
            )}
          </div>
        ))}
      </Container>
      {showOpcoesModal && myModals()}
    </>
  );
};

export default Bandeja;
