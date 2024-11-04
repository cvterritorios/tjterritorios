import {
  Container,
  Navbar,
  Modal,
  Button,
  Card,
  Row,
  Col,
  Form,
  Image,
} from "react-bootstrap";
import { NavLink, Navigate } from "react-router-dom";
import { BsQrCodeScan } from "react-icons/bs";
import imagelogo from "../../assets/images/mylogo.png";
import { MdWbSunny } from "react-icons/md";
import { GoMoon } from "react-icons/go";

// hooks
import { useEffect, useState } from "react";
import { useFirestore } from "../../hooks/useFirestore";

// context
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";

// container
import QReader from "../../containers/QReader/QReader";
import { ThemeModeSwitch, toCaptalizer } from "../shared";
import { BiLogOutCircle } from "react-icons/bi";

//"font-size:2.3rem; padding: 0px 8px 0px 8px; background-color:#4A6DA7;"
const NavBar = () => {
  const [show, setShow] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const [changeMode, setChangeMode] = useState(false);

  const { currentUser: user, logout, isAdmin, responsible } = useAuth();

  const { theme, toggleTheme, navbar, navbarText, navbarHover } = useTheme();

  const onDoubleClickHandler = () => {
    setShowMenu(true);
  };

  useEffect(() => {
    // reload when user changes
    return () => {};
  }, [user]);

  return (
    <>
      <Navbar expand="lg" className={navbar + "p-0 justify-content-between"}>
        <Container fluid className="p-0">
          {
            /*Se não tiver usuario*/ !user && (
              <>
                <NavLink to="/">
                  <Image src={imagelogo} alt="Logo" className="w-10 m-0 p-0" />
                </NavLink>
              </>
            )
          }
          {user && (
            <>
              <NavLink to="/" onDoubleClick={onDoubleClickHandler}>
                <Image src={imagelogo} alt="Logo" className="w-10" />
              </NavLink>
            </>
          )}
          <div className="flex align-items-center menu-items">
            {isAdmin && (
              <>
                <NavLink to="/register">Registar</NavLink>
                <NavLink to="/congregacoes">Congregações</NavLink>
              </>
            )}
            {user && (
              <a>
                <BsQrCodeScan
                  className={`${navbarText} ${navbarHover} hover:cursor-pointer m-1`}
                  onClick={() => setShow(true)}
                  size={"1.8rem"}
                />
              </a>
            )}
            {!user && (
              <ThemeModeSwitch
                theme={theme}
                changeMode={changeMode}
                setChangeMode={setChangeMode}
                toggleTheme={toggleTheme}
              />
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
              <Modal.Title className="flex justify-between">
                Informações do perfil{" "}
                <span>
                  <ThemeModeSwitch
                    theme={theme}
                    changeMode={changeMode}
                    setChangeMode={setChangeMode}
                    toggleTheme={toggleTheme}
                  />
                </span>
              </Modal.Title>
              {!isAdmin && (
                <Card>
                  <Card.Body className="flex flex-col justify-center items-center space-y-1">
                    <div className="flex space-x-2">
                      <strong>Congregação:</strong>
                      <span> {user.displayName}</span>
                    </div>
                    <div className="flex space-x-2">
                      <strong>Responsável:</strong>
                      <span> {responsible}</span>
                    </div>

                    <Row>
                      <Col xs={12}>
                        <strong>Email:</strong>
                        <span> {user.email}</span>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              )}

              {isAdmin && (
                <Card className="flex flex-col justify-center items-center space-y-1">
                  <Row>
                    <Col>
                      <strong>Cargo:</strong>
                      <span> {"ADMINISTRADOR"}</span>
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
              <Button
                size="sm"
                variant="danger"
                onClick={logout}
                className="flex items-center my-2"
              >
                <BiLogOutCircle size={15} className="mr-2" /> <span>Sair</span>
              </Button>
            </Modal.Body>
          </Modal>
        </>
      )}
    </>
  );
};

export default NavBar;
