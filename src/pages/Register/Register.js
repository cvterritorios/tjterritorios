import {
  Button,
  Col,
  Form,
  Row,
  Card,
  Container,
  CardTitle,
  Alert,
} from "react-bootstrap";

//hooks
import { useState, useEffect } from "react";
import { useAuthentication } from "../../hooks/useAuthentication";
import { useFirestore } from "../../hooks/useFirestore";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password] = useState("!AlgoPraSaber");
  const [congregacaoName, setCongregacaoName] = useState("");
  const [reponsavelName, setReponsavelName] = useState("");
  const [accessConde, setAccessConde] = useState("");
  const [accessCondeConfim, setAccessCondeConfim] = useState("");
  const [error, setError] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);

  const { createUser, error: authError, loading } = useAuthentication();
  const { setDocument, error: dataError } = useFirestore();

  useEffect(() => {
    if (authError) setError(authError);
    if (dataError) setError(dataError);
  }, [authError, dataError]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);

    if (accessConde !== accessCondeConfim) {
      setError("Confirme o codigo de acesso!");
      return;
    }

    const congregacaoUser = {
      congregacaoName,
      email,
      password,
    };
    setRegisterLoading(true);
    const res = await createUser(congregacaoUser);

    const congregacao = {
      uid: res.uid,
      nome: congregacaoName,
      email: email,
      codigoAcesso: accessConde,
      reponsaveis: [reponsavelName],
    };

    const res2 = await setDocument("congregacao", congregacao);

    console.log(res);
    console.log(congregacao);
    if (res2) setRegisterLoading(false);
  };

  if (registerLoading) {
    return <p>Carregando...</p>;
  }

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ height: "90vh" }}
    >
      <Card style={{ width: "25rem" }}>
        <Card.Header className="text-center">
          <CardTitle>
            <strong>Registar Congregaçao</strong>
          </CardTitle>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                required
                placeholder=" _exemplo@___.com"
                title="Escolha um email confiavel"
                defaultValue={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Congregação</Form.Label>
              <Form.Control
                required
                placeholder=" _Ex: 'Covilhã'"
                title="Escreva o nome da congregação"
                defaultValue={congregacaoName}
                onChange={(e) => {
                  setCongregacaoName(e.target.value);
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Responsável</Form.Label>
              <Form.Control
                required
                placeholder=" _Nome"
                title="Nome do Servo de Territórios"
                defaultValue={reponsavelName}
                onChange={(e) => {
                  setReponsavelName(e.target.value);
                }}
              />
            </Form.Group>

            <Form.Group className="d-none">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                defaultValue={password}
              />
            </Form.Group>

            <Row className="mb-3">
              <Form.Group as={Col} className="mb-3">
                <Form.Label>Codigo de Acesso</Form.Label>
                <Form.Control
                  required
                  placeholder=" _Digite um codigo"
                  title="Este será o código para entrar na App"
                  defaultValue={accessConde}
                  onChange={(e) => {
                    setAccessConde(e.target.value);
                  }}
                />
              </Form.Group>

              <Form.Group as={Col} className="mb-3">
                <Form.Label>Confirme</Form.Label>
                <Form.Control
                  required
                  placeholder=" _Codigo de Acesso"
                  title="Confirme o código de acesso"
                  defaultValue={accessCondeConfim}
                  onChange={(e) => {
                    setAccessCondeConfim(e.target.value);
                  }}
                />
              </Form.Group>
            </Row>

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

export default Register;
