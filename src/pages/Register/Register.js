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
import { getAuth, onAuthStateChanged } from "firebase/auth";

// context
import { useAuthValue } from "../../contexts/AuthContext";

//hooks
import { useState, useEffect } from "react";
import { useAuthentication } from "../../hooks/useAuthentication";
import { useFirestore } from "../../hooks/useFirestore";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password] = useState("!AlgoPraSaber");
  const [congregacaoName, setCongregacaoName] = useState("");
  const [responsavelName, setResponsavelName] = useState("");
  const [responsavelPass, setResponsavelPass] = useState("");
  const [responsavelPassConfirm, setResponsavelPassConfirm] = useState("");
  const [accessConde, setAccessConde] = useState("");
  const [accessCondeConfim, setAccessCondeConfim] = useState("");
  const [error, setError] = useState("");
  const [registerLoading, setRegisterLoading] = useState("");

  const { createUser, error: authError, loading } = useAuthentication();
  const { updateDocument } = useFirestore();

  const { user } = useAuthValue();

  const loadingScreen = document.getElementById("loading-screen");

  const auth = getAuth();

  useEffect(() => {
    if (authError) setError(authError);

    onAuthStateChanged(auth, async (user) => {
      if (user && user.displayName === "adm") {
        await updateDocument("adm_now", "9B04i7SLYIpMV9hINolI", {
          email: user.email,
          uid: user.uid,
          name: user.displayName,
        });
      }
    });

    if (registerLoading) {
      loadingScreen.classList.remove("d-none");
      loadingScreen.classList.add("loading");
    }
    if (!registerLoading) {
      loadingScreen.classList.add("d-none");
      loadingScreen.classList.remove("loading");
    }
  }, [authError, registerLoading, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    setRegisterLoading(true);

    if (accessConde !== accessCondeConfim) {
      setError("Confirme o codigo de acesso!");
      return;
    }

    const congregacaoUser = {
      nome: congregacaoName,
      email: email,
      password: password,
      codigoAcesso: accessConde,
      responsaveis: [
        { nome: responsavelName, isLoged: false /* , codigoPerfil:  */ },
      ],
    };

    const res = await createUser(congregacaoUser);
    if (res) setRegisterLoading(false);

    console.log(res);
  };

  if (loading) {
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
                  type="password"
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
                  type="password"
                  required
                  placeholder=" _Codigo de Acesso"
                  title="Confirme o código de acesso"
                  defaultValue={accessCondeConfim}
                  onChange={(e) => {
                    setAccessCondeConfim(e.target.value);
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Responsável</Form.Label>
                <Form.Control
                  required
                  placeholder=" _Nome"
                  title="Nome do Servo de Territórios"
                  defaultValue={responsavelName}
                  onChange={(e) => {
                    setResponsavelName(e.target.value);
                  }}
                />
              </Form.Group>

              <Form.Group className="d-none">
                <Form.Label>Codigo de Perfil</Form.Label>
                <Form.Control
                  type="password"
                  placeholder=" _Codigo de Perfil"
                  title="Confirme o código de acesso"
                  defaultValue={responsavelPass}
                  onChange={(e) => {
                    setResponsavelPass(e.target.value);
                  }}
                />
              </Form.Group>
              <Form.Group className="d-none">
                <Form.Label>Confirma Codigo</Form.Label>
                <Form.Control
                  type="password"
                  placeholder=" _Confirmar Codigo"
                  title="Confirme o código de acesso"
                  defaultValue={responsavelPass}
                  onChange={(e) => {
                    setResponsavelPass(e.target.value);
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
