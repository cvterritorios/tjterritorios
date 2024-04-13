import { useEffect, useState } from "react";
import TableDark from "../../components/Table/Table";
import { useFirestore } from "../../hooks/useFirestore";
import { Alert, Container } from "react-bootstrap";

const Congregacoes = () => {
  const [myList, setMyList] = useState([]);
  const [lines, setLines] = useState([[]]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const {
    getCollectionWhere,
    loading: loadingData,
    error: errorData,
  } = useFirestore();

  const getList = async () => {
    setLoading(true);
    const coll = await getCollectionWhere("congregacao", {
      attr: "nome",
      comp: "!=",
      value: "ADM",
    });
    setMyList(coll);

    let array = [];
    coll.map((item) => {
      let arr = [item.nome, item.email, item.codigoAcesso];
      array.push(arr);
    });

    setLines(array);
    setLoading(false);
  };

  useEffect(() => {
    getList();
    if (errorData) setError(errorData);
  }, [errorData]);

  if (loading || loadingData) {
    return <p>Carregando...</p>;
  }

  return (
    <>
      <Container className="pt-4">
        <TableDark head={["nome", "email", "codigo"]} lines={lines} />
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
