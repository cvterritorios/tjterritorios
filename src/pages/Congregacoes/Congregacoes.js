import { useEffect, useState } from "react";
import { Alert, Container } from "react-bootstrap";

// My Hooks
import { useFirestore } from "../../hooks/useFirestore";

// Components
import { CardCongregacaoFlip } from "../../components/Cards/Cards";

const Congregacoes = () => {
  const [congregacoesData, setCongregacoesData] = useState([{}]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const {
    getCollectionWhere,
    getCollection,
    loading: loadingData,
    error: errorData,
  } = useFirestore();

  const getList = async () => {
    setLoading(true);
    const coll = await getCollection("congregacoes");
    setCongregacoesData(coll);

    setLoading(false);
  };

  useEffect(() => {
    getList();
    if (errorData) setError(errorData);
  }, [errorData]);

  const handleDelete = (uid) => {
    console.log(uid, "Has Deletedd");
  };

  const handleEdit = (uid) => {};

  if (loading || loadingData) {
    return <p>Carregando...</p>;
  }

  return (
    <>
      <Container className="pt-4">
        {congregacoesData.length < 1 && <p>Não tem nenhuma congregação</p>}
        <CardCongregacaoFlip
          congregacoes={congregacoesData}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
        {error ? (
          <Alert variant="danger" onClose={() => setError("")} dismissible>
            <p>{error}</p>
          </Alert>
        ) : (
          ""
        )}
      </Container>
    </>
  );
};

export default Congregacoes;
