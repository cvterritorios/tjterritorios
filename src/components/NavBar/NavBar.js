import { Container, Navbar, Modal, Button, Nav } from "react-bootstrap";
import { NavLink, Navigate } from "react-router-dom";
import { BsQrCodeScan } from "react-icons/bs";

// hooks
import { useState } from "react";
import { useAuthentication } from "../../hooks/useAuthentication";

// context
import { useAuthValue } from "../../contexts/AuthContext";

// container
import QReader from "../../containers/QReader/QReader";

//"font-size:2.3rem; padding: 0px 8px 0px 8px; background-color:#4A6DA7;"
const NavBar = () => {
  const [show, setShow] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCloseMenu = () => setShowMenu(false);
  const handleShowMenu = () => setShowMenu(true);

  const { user } = useAuthValue();
  const { logout } = useAuthentication();

  const onDoubleClickHandler = () => {
    console.log("You have Clicked Twice");
    handleShowMenu();
  };

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
              user.displayName === "adm" ? (
                <NavLink to="/register" className="navlink">
                  Registar
                </NavLink>
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

          <Modal
            show={showMenu}
            onHide={handleCloseMenu}
            keyboard={false}
            style={{ maxHeight: "100vh" }}
          >
            <Modal.Body>
              <Modal.Title>Ler QRCode</Modal.Title>

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
