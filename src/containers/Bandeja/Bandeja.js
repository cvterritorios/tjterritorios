import { useEffect, useState } from "react";
import { Container, Card, Row, Col, Badge, Modal } from "react-bootstrap";
import { useFirestore } from "../../hooks/useFirestore";
import { GrStatusGood, GrStatusCritical } from "react-icons/gr";

import {
  DetailsModal,
  MenuOpcoesModal,
  TerritoryModal,
  ViewImageModal,
} from "../../components/Modal/Modal";
import { AvailableStatus, CardsGrid, CardsList, RefTags } from "./shared";

const Bandeja = ({
  viewGrid,
  filter = [],
  searching,
  setTag,
  isOrdered = false,
  orderDir,
}) => {
  const [collection, setCollection] = useState([]);
  const [territoryNowData, setTerritoryNowData] = useState({});

  const [searchTag, setSearchTag] = useState(false);
  const [myOrderBy, setMyOrderBy] = useState({});

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showOpcoesModal, setShowOpcoesModal] = useState(false);
  const [showViewImageModal, setShowViewImageModal] = useState(false);

  const handleShowOpcoesModal = () => setShowOpcoesModal(true);
  const handleCloseOpcoesModal = () => setShowOpcoesModal(false);

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    getCollection,
    getCollectionWhere,
    error: dataError,
    loading: dataLoading,
  } = useFirestore();

  const startBandeja = async () => {
    setLoading(true);

    if (isOrdered) {
      setMyOrderBy({ attr: isOrdered, dir: orderDir });
    }

    if (searching) {
      if (searchTag) {
        const collsT = await getCollectionWhere(
          "territorios",
          {
            attr: "references",
            comp: "array-contains",
            value: searching,
          },
          isOrdered && myOrderBy
        );

        setCollection(collsT);

        setLoading(false);
        // setSearchTag(false);
        return;
      } else {
        const coll = await getCollectionWhere(
          "territorios",
          {
            attr: "description",
            comp: "==",
            value: searching,
          },
          isOrdered && myOrderBy
        );
        setCollection(coll);
        setLoading(false);
        return;
      }
    }

    if (filter[0]) {
      const coll = await getCollectionWhere(
        "territorios",
        {
          attr: "available",
          comp: "==",
          value: true,
        },
        isOrdered ? myOrderBy : false
      );
      setCollection(coll);
    } else if (filter[1]) {
      const coll = await getCollectionWhere(
        "territorios",
        {
          attr: "available",
          comp: "==",
          value: false,
        },
        isOrdered && myOrderBy
      );
      setCollection(coll);
    } else {
      const coll = await getCollection("territorios", isOrdered && myOrderBy);
      setCollection(coll);
    }
    setLoading(false);
  };

  useEffect(() => {
    startBandeja();
    if (error) setError(error);
  }, [error, filter, searching, viewGrid, isOrdered, orderDir]);

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
            id={territoryNowData.id}
            description={territoryNowData.description}
            available={territoryNowData.available}
            closeSelf={() => handleCloseOpcoesModal()}
            /* show Modals opcoes */
            show_Update={() => setShowUpdateModal(true)}
            show_Read={() => setShowDetailsModal(true)}
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
          onHide={() => setShowViewImageModal(false)}
          centered
        >
          <ViewImageModal image={territoryNowData.map} />
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
              />
            )}
            {viewGrid && (
              <CardsGrid
                item={item}
                handleShowOpcoesModal={handleShowOpcoesModal}
                setTerritoryNowData={setTerritoryNowData}
                setTag={setTag}
                setSearchTag={setSearchTag}
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
