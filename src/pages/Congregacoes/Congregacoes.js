import { useEffect, useState } from "react";
import { Alert, Container } from "react-bootstrap";

// My Hooks
import { useFirestore } from "../../hooks/useFirestore";

// Components
import TableDark from "../../components/Table/Table";
import { CardCongregacaoFlip } from "../../components/Cards/Cards";

const Congregacoes = () => {
  const [header] = useState([
    "Nome",
    "Email",
    "Codigo de Acesso",
    "Nº - Responsaveis",
  ]);
  const [lines, setLines] = useState([[]]);
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

    let array = [];
    coll.map((item) => {
      let arr = [
        item.name,
        item.email,
        item.accessCode,
        item.responsible.length + " " + item.responsible.map((e) => e.name),
      ];
      array.push(arr);
    });

    setLines(array);
    setLoading(false);
  };

  useEffect(() => {
    getList();
    if (errorData) setError(errorData);
  }, [errorData]);

  const handleDelete = (uid) => {
    console.log(uid,"Has Deletedd");
  };

  const handleEdit = (uid) => {};

  if (loading || loadingData) {
    return <p>Carregando...</p>;
  }

  return (
    <>
      <Container className="pt-4">
        {lines.length < 1 && <p>Não tem nenhuma congregação</p>}
        {/*  {lines.length > 1 && <TableDark head={header} lines={lines} />} */}
        <CardCongregacaoFlip congregacoes={congregacoesData} onDelete={handleDelete} onEdit={handleEdit} />
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
