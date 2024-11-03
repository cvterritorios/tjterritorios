import { useEffect, useState } from "react";
import { Alert, Container } from "react-bootstrap";

// My Hooks
import { useFirestore } from "../../hooks/useFirestore";

// Components
import { CardCongregacaoFlip } from "../../components/Cards/Cards";
import GenerateQRCode from "../../containers/QReader/generateQRCode";

const Congregacoes = () => {
  const [congregacoesData, setCongregacoesData] = useState([{}]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const {
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
    alert(uid, "Has Deletedd");
  };

  const handleEdit = (uid) => {};

  if (loading || loadingData) {
    return <p>Carregando...</p>;
  }

  return (
    <>
      <Container className="pt-4">
        {congregacoesData.length < 1 && <p>Não tem nenhuma congregação</p>}
        {""}
        {congregacoesData?.map((congregacao) => (
          <CardCongregacaoFlip data={{ ...congregacao }} />
        ))}{" "}
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
