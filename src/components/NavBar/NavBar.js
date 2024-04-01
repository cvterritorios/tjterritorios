import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";

//"font-size:2.3rem; padding: 0px 8px 0px 8px; background-color:#4A6DA7;"
const NavBar = () => {
  return (
    <Navbar expand="lg" className="navbar-dark bg-dark p-0">
      <Container fluid className="p-0">
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
        <Nav
          className="me-auto my-2 my-lg-0"
          style={{ maxHeight: "100px" }}
          navbarScroll
        ></Nav>
        <h1>oi</h1>
      </Container>
    </Navbar>
  );
};

export default NavBar;
