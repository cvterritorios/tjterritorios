import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <footer
        className="d-flex align-items-center pt-4 justify-content-center"
        style={{
          height: 100,
          flexDirection: "column",
          backgroundColor: "#edf3f6",
        }}
      >
        <p>
          Por Mateus Luis & Marcos Assunção <NavLink to="about">Sobre</NavLink>
        </p>
        <p>TJ Territorios &copy; 2024</p>
      </footer>
    </>
  );
};

export default Footer;
