import {
  Button,
  Form,
  Card,
  Modal,
  Container,
  CardTitle,
  Alert,
} from "react-bootstrap";

// contxt
import { useTheme } from "../../contexts/ThemeContext";

//hooks
import { useState, useEffect } from "react";
import { useFirestore } from "../../hooks/useFirestore";
import { useAuth } from "../../contexts/AuthContext";
import { useLoading } from "../../contexts/LoadingContext";
import { useLocalStorage } from "../../hooks/useLocalStorage";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("!AlgoPraSaber");
  const [accessCode, setAccessCode] = useState("");

  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const [logMode, setLogMode] = useState(false);

  const [perfil, setPerfil] = useState("");

  // Options
  const [congregacoesOptions, setCongregacoesOptions] = useState("");
  const [perfisOptions, setPerfisOptions] = useState("");

  // context
  const { login } = useAuth();
  const { backSubColor, textColor, backForm } = useTheme();
  const { startLoading, stopLoading } = useLoading();

  // my Hooks
  const { getCollection, getDocWhere, error: dataError } = useFirestore();
  const { setUserInSession, getUser } = useLocalStorage();

  useEffect(() => {
    // if (authError) setError(authError);
    if (dataError) setError(dataError);

    !congregacoesOptions && !getUser() && makeCongregacoesOptions();
  }, [dataError, show, congregacoesOptions]);

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

    if (logMode) {
      startLoading();
      const res = await login({ email, password });

      if (res.ok) {
        setUserInSession({
          type: "ADM",
          email: email,
          code: password,
        });
      }
      stopLoading();
      return;
    }

    //buscar congregação pelo codigo de acesso
    const cong = await getDocWhere({
      collect: "congregacoes",
      whr: {
        attr: "accessCode",
        comp: "==",
        value: accessCode,
      },
    });

    // Não encontrado
    if (!cong) {
      setError("Código de acesso incorreto!");
      return;
    }

    if (!!cong.responsible) {
      const options = [];

      cong.responsible.map((responsavel, idx) => {
        return options.push(
          <option key={idx} value={idx}>
            {responsavel}
          </option>
        );
      });

      setPerfisOptions(options);
      setShow(true);

      console.log(perfisOptions);
    }
  };

  const entrar = async (e) => {
    e.preventDefault();
    startLoading();

    const res = await login({ email, password });

    if (res.ok) {
      setUserInSession({
        type: "congregacao",
        email: email,
        code: accessCode,
        responsible: perfisOptions[perfil].props.children,
      });
    }

    stopLoading();
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

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ height: "90vh" }}
    >
      <Card className={backSubColor + textColor} style={{ width: "25rem" }}>
        <Card.Header className="text-center">
          <CardTitle className="position-relative p-0">
            <strong>{!logMode ? "Entrar" : "Entrar ADM"}</strong>
            <Form.Check // prettier-ignore
              type="switch"
              defaultChecked={logMode}
              id="custom-switch"
              className={"position-absolute top-0 end-0"}
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
                    className={backForm}
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
                    className={backForm}
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
                    className={backForm}
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
                    defaultValue={"!AlgoPraSaber"}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Codigo de Acesso</Form.Label>
                  <Form.Control
                    required
                    placeholder="Digite o código de acesso"
                    className={backForm}
                    type="password"
                    title="Digite o código de acesso"
                    defaultValue={accessCode}
                    onChange={(e) => {
                      setAccessCode(e.target.value);
                    }}
                  />
                </Form.Group>
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
