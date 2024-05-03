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
  const [password] = useState("!AlgoPraSaber");
  const [congregacoes, setCongregacoes] = useState("");
  const [perfis, setPerfis] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");
  const [congregacaoUser, setCongregacaoUser] = useState("");

  const [congregacao, setCongregacao] = useState("");
  const [perfil, setPerfil] = useState("");

  const [show, setShow] = useState(false);

  const { login, error: authError, loading } = useAuthentication();
  const {
    getCollection,
    getDocWhere,
    updateDocument,
    error: dataError,
    loading: dataLoading,
  } = useFirestore();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    if (authError) setError(authError);
    if (dataError) setError(dataError);

    getCongregacoes();
  }, [authError, dataError]);

  const getCongregacoes = async () => {
    const myCon = await getCollection("users");

    const options = myCon.map((congregacao) => {
      if (congregacao.name !== "ADM") {
        return (
          <option key={congregacao.id} value={congregacao.email}>
            {congregacao.name}
          </option>
        );
      }
    });

    setCongregacoes(options);
    // console.log(myCon);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const adms = [
      "matt",
      "mattkassoll@gmail.com",
      "cvterritorios1958",
      "covilhaterritorios1958@gmail.com",
    ];

    function chooseADM(accessC) {
      for (let n = 0; n < adms.length; n + 2) {
        if (accessC === adms[n]) return adms[n + 1];
      }
    }

    const mEmail = email === "" ? chooseADM(accessCode) : email;

    const congregUser = {
      email: mEmail,
      password,
      accessCode,
    };

    const cong = await getDocWhere("users", {
      attr: "accessCode",
      comp: "==",
      value: congregUser.accessCode,
    });

    if (!cong) {
      console.log("Codigo de acesso incorreto!");
      return;
    }

    if (cong.responsible) {
      const options = cong.responsible.map((responsavel, idx) => {
        return (
          <option key={idx} value={idx}>
            {responsavel.name}
          </option>
        );
      });

      setPerfis(options);
    }

    setCongregacaoUser(congregUser);
    if (cong.name === "ADM") {
      await login(congregUser);
    } else {
      handleShow();
    }
    // console.log(congregacaoUser);
  };

  const entrar = async (e) => {
    e.preventDefault();

    let where = {
      attr: "accessCode",
      comp: "==",
      value: congregacaoUser.accessCode,
    };

    const conON = await getDocWhere("users", where);
    const id = await getDocWhere("users", where, true);

    conON.responsible.map((element) => {
      element.isLoged = false;
    });

    conON.responsible[perfil].isLoged = true;
    // console.log("2", conON);

    await updateDocument("users", id, conON);

    await login(congregacaoUser);
  };

  if (dataLoading) {
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
                defaultValue={accessCode}
                onChange={(e) => {
                  setAccessCode(e.target.value);
                }}
              />
            </Form.Group>

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
        onHide={handleClose}
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
                {perfis}
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
