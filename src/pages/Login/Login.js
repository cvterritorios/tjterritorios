import {
  Button,
  Form,
  Card,
  Container,
  CardTitle,
  Alert,
} from "react-bootstrap";

//hooks
import { useState, useEffect } from "react";
import { useAuthentication } from "../../hooks/useAuthentication";
import { useFirestore } from "../../hooks/useFirestore";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password] = useState("!AlgoPraSaber");
  const [congregacoes, setCongregacoes] = useState("");
  const [accessConde, setAccessConde] = useState("");
  const [error, setError] = useState("");

  const { login, error: authError, loading } = useAuthentication();

  const {
    getCollection,
    error: dataError,
    loading: dataLoading,
  } = useFirestore();

  useEffect(() => {
    if (authError) setError(authError);
    if (dataError) setError(dataError);

    getCongregacoes();
  }, [authError, dataError]);

  const getCongregacoes = async () => {
    const myCon = await getCollection("congregacao");

    console.log(myCon);
    const options = myCon.map((congregacao) => {
      return (
        <option key={congregacao.id} value={congregacao.email}>
          {congregacao.nome}
        </option>
      );
    });

    setCongregacoes(options);
    // console.log(myCon);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const congregacaoUser = {
      email,
      password,
      accessConde,
    };

    // console.log(congregacaoUser);
    await login(congregacaoUser);
  };

  if(dataLoading){
    return(
        <p>Carregando...</p>
    )
  }

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ height: "90vh" }}
    >
      <Card style={{ width: "25rem" }}>
        <Card.Header className="text-center">
          <CardTitle>
            <strong>Entrar</strong>
          </CardTitle>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Congregação</Form.Label>
              <Form.Select
                aria-label="Congregação"
                required
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              >
                <option>Escolha a sua congregação</option>
                {congregacoes}
              </Form.Select>
            </Form.Group>

            <Form.Group className="d-none">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                defaultValue={password}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Codigo de Acesso</Form.Label>
              <Form.Control
                required
                title="Digite o código de acesso"
                defaultValue={accessConde}
                onChange={(e) => {
                  setAccessConde(e.target.value);
                }}
              />
            </Form.Group>

            {!loading && (
              <Button variant="primary" className="w-100 mb-3" type="submit">
                Enviar
              </Button>
            )}
            {loading && (
              <Button variant="primary" className="w-100 mb-3" type="submit">
                Aguarde...
              </Button>
            )}
            {error ? (
              <Alert variant="danger" onClose={() => setError("")} dismissible>
                <p>{error}</p>
              </Alert>
            ) : (
              ""
            )}
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;
