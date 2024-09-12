import {
  Container,
  Navbar,
  Modal,
  Button,
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
import { useSessionStorage } from "../../hooks/useSessionStorage";

// context
import { useAuthValue } from "../../contexts/AuthContext";

// container
import QReader from "../../containers/QReader/QReader";

//"font-size:2.3rem; padding: 0px 8px 0px 8px; background-color:#4A6DA7;"
const NavBar = () => {
  const [show, setShow] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [userNow, setUserNow] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const { user } = useAuthValue();
  const { logout, loading: authLoading } = useAuthentication();
  const { getDocWhere, getCollection, loading: dataLoading } = useFirestore();

  const onDoubleClickHandler = () => {
    setShowMenu(true);
  };

  async function getCongregacaoNow() {
    const cong = await getDocWhere("congregacoes", {
      attr: "uid",
      comp: "==",
      value: user.uid,
    });
    console.warn(cong);
    setUserNow(cong);
  }

  useEffect(() => {
    if (user) {
      isAdminNow();
      if (!isAdmin) getCongregacaoNow();
    }
  }, [user]);

  const isAdminNow = async () => {
    const adminList = await getCollection("admins").then((res) => {
      return res[0].list;
    });

    checkAdmInList(adminList);

    function checkAdmInList(list) {
      list.forEach((adm) => {
        if (adm.uid == user?.uid) {
          setIsAdmin(true);
        }
      });
    }
  };

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
            {isAdmin && (
              <>
                <NavLink to="/register" className="navlink">
                  Registar
                </NavLink>
                <NavLink to="/congregacoes" className="navlink">
                  Congregações
                </NavLink>
              </>
            )}
            {user && (
              <a>
                <BsQrCodeScan
                  style={{
                    color: "whitesmoke",
                    margin: "8px",
                    cursor: "pointer",
                  }}
                  onClick={() => setShow(true)}
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
            onHide={() => setShow(false)}
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
            onHide={() => setShowMenu(false)}
            keyboard={false}
            style={{ maxHeight: "100vh" }}
          >
            <Modal.Body>
              <Modal.Title>Informações do perfil</Modal.Title>
              {!isAdmin && (
                <Card>
                  <Row>
                    <Col xs={7} md={5}>
                      <strong>Congregação:</strong>
                      <span> {userNow?.name}</span>
                    </Col>
                    {userNow?.responsible &&
                      userNow?.responsible.map((element, idx) =>
                        element.isLoged ? (
                          <Col xs={7} md={5} key={idx}>
                            <strong>Responsavel:</strong>
                            <span> {element.name}</span>
                          </Col>
                        ) : (
                          ""
                        )
                      )}
                  </Row>
                  <div xs={12} md={8}>
                    <strong>Email:</strong>
                    <span> {userNow?.email}</span>
                  </div>
                </Card>
              )}

              {isAdmin && (
                <Card>
                  <Row>
                    <Col >
                      <strong>Cargo:</strong>
                      <span> {'ADMINISTRADOR'}</span>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={7} md={5}>
                      <strong>Nome:</strong>
                      <span> {user.displayName}</span>
                    </Col>
                  </Row>
                  <div xs={12} md={8}>
                    <strong>Email:</strong>
                    <span> {user.email}</span>
                  </div>
                </Card>
              )}
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
