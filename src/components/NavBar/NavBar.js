import {
  Container,
  Navbar,
  Modal,
  Button,
  Nav,
  Card,
  Row,
  Col,
} from "react-bootstrap";
import { NavLink, Navigate } from "react-router-dom";
import { BsQrCodeScan } from "react-icons/bs";

// hooks
import { useEffect, useState } from "react";
import { useAuthentication } from "../../hooks/useAuthentication";
import { useFirestore } from "../../hooks/useFirestore";

// context
import { useAuthValue } from "../../contexts/AuthContext";

// container
import QReader from "../../containers/QReader/QReader";

//"font-size:2.3rem; padding: 0px 8px 0px 8px; background-color:#4A6DA7;"
const NavBar = () => {
  const [show, setShow] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [userNow, setUserNow] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCloseMenu = () => setShowMenu(false);
  const handleShowMenu = () => setShowMenu(true);

  const { user } = useAuthValue();
  const { logout, loading: authLoading } = useAuthentication();
  const { getDocWhere, loading: dataLoading } = useFirestore();

  const onDoubleClickHandler = () => {
    handleShowMenu();
  };

  async function getUserNow() {
    const u = await getDocWhere("congregacao", {
      attr: "uid",
      comp: "==",
      value: user.uid,
    });
    console.warn(u.responsaveis);
    setUserNow(u);
  }

  useEffect(() => {
    if (user) getUserNow();
  }, [user]);

  if (authLoading || dataLoading) {
    return <p>Carregando...</p>;
  }

  return (
    <>
      <Navbar
        expand="lg"
        className="navbar-dark bg-dark p-0 justify-content-between"
      >
        <Container fluid className="p-0">
          {
            /*Se não tiver usuario*/ !user && (
              <>
                <NavLink
                  to="/"
                  style={{
                    fontSize: "2.3rem",
                    padding: "0px 8px",
                    backgroundColor: "#4A6DA7",
                  }}
                  className="navlink"
                >
                  TC
                </NavLink>
              </>
            )
          }
          {
            /*Se tiver usuario*/ user && (
              <>
                <NavLink
                  to="/"
                  style={{
                    fontSize: "2.3rem",
                    padding: "0px 8px",
                    backgroundColor: "#4A6DA7",
                    borderRadius: "0px",
                  }}
                  className="navlink"
                  onDoubleClick={onDoubleClickHandler}
                >
                  TC
                </NavLink>
              </>
            )
          }
          <div className="d-flex align-items-center menu-items">
            {user ? (
              userNow.nome === "adm" || userNow.nome === "ADM" ? (
                <>
                  <NavLink to="/register" className="navlink">
                    Registar
                  </NavLink>
                  <NavLink to="/congregacoes" className="navlink">
                    Congregações
                  </NavLink>
                </>
              ) : (
                ""
              )
            ) : (
              ""
            )}
            {user && (
              <a>
                <BsQrCodeScan
                  style={{
                    color: "whitesmoke",
                    margin: "8px",
                    cursor: "pointer",
                  }}
                  onClick={handleShow}
                  size={"1.8rem"}
                />
              </a>
            )}
          </div>
        </Container>
      </Navbar>

      {user && (
        <>
          {/* Modal QRCode */}
          <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            centered
            style={{ maxHeight: "100vh" }}
          >
            <Modal.Header closeButton>
              <Modal.Title>Ler QRCode</Modal.Title>
            </Modal.Header>
            <QReader />
          </Modal>

          {/* Modal Info */}
          <Modal
            show={showMenu}
            onHide={handleCloseMenu}
            keyboard={false}
            style={{ maxHeight: "100vh" }}
          >
            <Modal.Body>
              <Modal.Title>Informações do perfil</Modal.Title>
              <Card>
                <Row>
                  <Col xs={7} md={5}>
                    <strong>Perfil:</strong>
                    <span> {userNow.nome}</span>
                  </Col>
                  {userNow.responsaveis &&
                    userNow.responsaveis.map((element, idx) =>
                      element.isLoged ? (
                        <Col xs={7} md={5} key={idx}>
                          <strong>Perfil:</strong>
                          <span> {element.nome}</span>
                        </Col>
                      ) : (
                        ""
                      )
                    )}
                </Row>
                <div xs={12} md={8}>
                  <strong>Email:</strong>
                  <span> {userNow.email}</span>
                </div>
              </Card>
              <Button variant="danger" onClick={logout}>
                Sair
              </Button>
            </Modal.Body>
          </Modal>
        </>
      )}
    </>
  );
};

export default NavBar;
