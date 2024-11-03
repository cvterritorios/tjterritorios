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
import { useFirestore } from "../../hooks/useFirestore";
import { useAuth } from "../../contexts/AuthContext";
import { useLoading } from "../../contexts/LoadingContext";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("!AlgoPraSaber");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [name, setName] = useState("");
  const [responsavelName, setResponsavelName] = useState("");
  const [responsavelPass, setResponsavelPass] = useState("");
  const [responsavelPassConfirm, setResponsavelPassConfirm] = useState("");
  const [accessConde, setAccessConde] = useState("");
  const [accessCondeConfim, setAccessCondeConfim] = useState("");
  const [error, setError] = useState("");

  const [regMode, setRegMode] = useState(false);
  const [listaCongregacoes, setListaCongregacoes] = useState([]);

  const { signup } = useAuth();
  const { getDocWhere, setDocWithId } = useFirestore();
  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    const fetchCongregacoes = async () => {
      const congregacoes = await getDocWhere({ collect: "congregacoes" });
      setListaCongregacoes(congregacoes);
    };

    listaCongregacoes.length < 1 && fetchCongregacoes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    // Loading
    setName(name.toLocaleUpperCase());

    // --------- ---------- Validação Email

    const isCongragationEmail = listaCongregacoes.find(
      (congregacao) => congregacao.email === email
    );

    if (isCongragationEmail) {
      setError("Este email já está a ser usado ");
      // Loading false
      return;
    }

    // --------- ---------- Log Adm

    if (regMode) {
      if (password !== passwordConfirm) {
        setError("Confirme a sua palavra passe corretamente!");
        // Loading false
        return;
      }

      startLoading();

      const myNewAdmin = await signup({ email, password, username: name });

      console.log(myNewAdmin.user);

      if (myNewAdmin.ok) {
        const res = await setDocWithId({
          collect: "admins",
          id: myNewAdmin.user.uid,
          data: { displayName: name, email: myNewAdmin.user.email },
        });

        console.log(res);
      }
      stopLoading();
      return;
    }

    // --------- ---------- Validação Codigo de acesso
    if (accessConde !== accessCondeConfim) {
      setError("Confirme o codigo de acesso!");
      // Loading false
      return;
    }

    // --------- ---------- Validação Nome
    const isCongragationName = listaCongregacoes.find(
      (congregacao) => congregacao.name === name
    );

    if (isCongragationName) {
      setError("Já existe uma congregação com este nome");
      // Loading false
      return;
    }

    // --------- ---------- Constante Congregação
    const congregacaoUser = {
      secretkey: "tjterritorios2024",
      name,
      email,
      password,
      accessConde,
      responsible: [
        { name: responsavelName, isLoged: false /* , codigoPerfil:  */ },
      ],
    };

    // --------- ---------- Criar congregação
    const myNewCongregation = await signup({
      name,
      email,
      password,
      accessConde,
    });

    if (myNewCongregation.ok) {
      await setDocWithId({
        collect: "congregacoes",
        id: myNewCongregation.user.uid,
        data: congregacaoUser,
      });

      return;
    }

    // Loading false
  };

  const changeRegMod = () => {
    if (regMode) {
      setRegMode(false);
      setName("");
      setEmail("");
      setAccessConde("");
      setAccessCondeConfim("");
    } else {
      setRegMode(true);
      setName("");
      setEmail("");
      setAccessConde("");
      setAccessCondeConfim("");
    }
  };

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ height: "90vh" }}
    >
      <Card style={{ width: "25rem" }}>
        <Card.Header className="text-center">
          <CardTitle className="position-relative p-0">
            <strong>
              {!regMode ? "Registar Congregaçao" : "Registar ADM"}
            </strong>
            <Form.Check // prettier-ignore
              type="switch"
              defaultChecked={regMode}
              id="custom-switch"
              className="position-absolute top-0 end-0"
              onChange={() => changeRegMod()}
            />
          </CardTitle>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            {!regMode && (
              <>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    required
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
                    title="Escreva o nome da congregação"
                    defaultValue={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                </Form.Group>

                <Form.Group className="d-none">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    defaultValue={"!AlgoPraSaber"}
                  />
                </Form.Group>

                <Row className="mb-3">
                  <Form.Group as={Col} className="mb-3">
                    <Form.Label>Codigo de Acesso</Form.Label>
                    <Form.Control
                      required
                      minLength="8"
                      type="password"
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
                      minLength="8"
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
                      defaultValue={responsavelPassConfirm}
                      onChange={(e) => {
                        setResponsavelPassConfirm(e.target.value);
                      }}
                    />
                  </Form.Group>
                </Row>
              </>
            )}

            {regMode && (
              <>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    required
                    title="Escolha um email confiavel"
                    defaultValue={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control
                    required
                    title="Escreva o nome da congregação"
                    defaultValue={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                </Form.Group>

                <Row className="mb-3">
                  <Form.Group as={Col} className="mb-3">
                    <Form.Label>Palavra passe</Form.Label>
                    <Form.Control
                      required
                      minLength="8"
                      type="password"
                      title="Palavra passe"
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                    />
                  </Form.Group>

                  <Form.Group as={Col} className="mb-3">
                    <Form.Label>Confirme</Form.Label>
                    <Form.Control
                      type="password"
                      minLength="8"
                      required
                      title="Confirme a palavra passe"
                      onChange={(e) => {
                        setPasswordConfirm(e.target.value);
                      }}
                    />
                  </Form.Group>
                </Row>
              </>
            )}
            <Button variant="primary" className="w-100 mb-3" type="submit">
              Enviar
            </Button>

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
