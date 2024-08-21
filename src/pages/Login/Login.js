import {
  Button,
  Form,
  Card,
  Modal,
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
  const [password, setPassword] = useState("!AlgoPraSaber");
  const [accessCode, setAccessCode] = useState("");

  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const [logMode, setLogMode] = useState(false);

  const [congregacaoUser, setCongregacaoUser] = useState("");
  const [perfil, setPerfil] = useState("");

  // Options
  const [congregacoesOptions, setCongregacoesOptions] = useState("");
  const [perfisOptions, setPerfisOptions] = useState("");

  // my Hooks
  const { login, error: authError, loading } = useAuthentication();
  const {
    getCollection,
    getDocWhere,
    updateDocument,
    error: dataError,
    loading: dataLoading,
  } = useFirestore();

  useEffect(() => {
    if (authError) setError(authError);
    if (dataError) setError(dataError);

    makeCongregacoesOptions();
  }, [authError, dataError]);

  const makeCongregacoesOptions = async () => {
    const myList = await getCollection("congregacoes");

    const options = myList?.map((congregacao) => {
      return (
        <option key={congregacao.id} value={congregacao.email}>
          {congregacao.name}
        </option>
      );
    });

    setCongregacoesOptions(options);
    // console.log(myCon);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);

    /* 
    console.log(congregacaoUser, await congregacaoId);
    return;
    */

    if (logMode) {
      await login({ email, password, adm: true });
    }

    const congregUser = {
      email,
      password,
      accessCode,
    };

    //buscar congregação pelo codigo de acesso
    const cong = await getDocWhere("congregacoes", {
      attr: "accessCode",
      comp: "==",
      value: congregUser.accessCode,
    });

    // Não encontrado
    if (!cong) {
      console.log("Codigo de acesso incorreto!");
      return;
    }

    // make perfil options - se tiver perfis de responsaveis na congregacao
    if (cong.responsible) {
      const options = cong.responsible.map((responsavel, idx) => {
        return (
          <option key={idx} value={idx}>
            {responsavel.name}
          </option>
        );
      });

      setPerfisOptions(options);
    }

    setCongregacaoUser(congregUser);

    setShow(true);
  };

  const entrar = async (e) => {
    e.preventDefault();

    let where = {
      attr: "accessCode",
      comp: "==",
      value: congregacaoUser.accessCode,
    };

    const congregacaoToLog = await getDocWhere("congregacoes", where);
    const congregacaoId = await getDocWhere("congregacoes", where, true);

    congregacaoToLog.responsible.map((responsavel, idx) => {
      if (idx === perfil) {
        responsavel.isLoged = true;
      } else {
        responsavel.isLoged = false;
      }
    });

    await updateDocument("congregacoes", congregacaoId, congregacaoToLog);

    await login(congregacaoUser);
  };

  const changeLogMod = () => {
    if (logMode) {
      setLogMode(false);
      setEmail("");
    } else {
      setLogMode(true);
      setEmail("");
    }
  };

  if (dataLoading || loading) {
    return <p>Carregando...</p>;
  }

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ height: "90vh" }}
    >
      <Card style={{ width: "25rem" }}>
        <Card.Header className="text-center">
          <CardTitle className="position-relative p-0">
            <strong>{!logMode ? "Entrar" : "Entrar ADM"}</strong>
            <Form.Check // prettier-ignore
              type="switch"
              defaultChecked={logMode}
              id="custom-switch"
              className="position-absolute top-0 end-0"
              onChange={() => changeLogMod()}
            />
          </CardTitle>
        </Card.Header>

        <Card.Body>
          <Form onSubmit={handleSubmit}>
            {logMode && (
              <>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    required
                    type="email"
                    placeholder="Email"
                    defaultValue={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                </Form.Group>

                <Form.Group className="mt-3 mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    required
                    placeholder="Password"
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                </Form.Group>
              </>
            )}
            {!logMode && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Congregação</Form.Label>
                  <Form.Select
                    aria-label="Congregação"
                    required
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  >
                    <option value="">Escolha a sua congregação</option>
                    {congregacoesOptions}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="d-none">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    defaultValue={"!AlgoPraSaber"}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Codigo de Acesso</Form.Label>
                  <Form.Control
                    required
                    title="Digite o código de acesso"
                    defaultValue={accessCode}
                    onChange={(e) => {
                      setAccessCode(e.target.value);
                    }}
                  />
                </Form.Group>
              </>
            )}

            {!loading && (
              <Button variant="primary" className="w-100 mb-3" type="submit">
                Enviar
              </Button>
            )}
            {loading && (
              <Button variant="primary" className="w-100 mb-3 disabled">
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

      <Modal
        show={show}
        onHide={() => {
          setShow(false);
        }}
        keyboard={false}
        backdrop="static"
        centered
        style={{ maxHeight: "100vh" }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Selecione o Perfil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={entrar}>
            <Form.Group className="mb-3">
              <Form.Select
                aria-label="Selecione o Perfil"
                required
                onChange={(e) => {
                  setPerfil(e.target.value);
                }}
              >
                <option>Escolha o seu perfil</option>
                {perfisOptions}
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit">
              Enviar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Login;
