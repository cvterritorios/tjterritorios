import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <footer
        className="flex items-center p-4 justify-center bg-gray-100"
        style={{
          height: "100",
          flexDirection: "column",
        }}
      >
        <p>
          <NavLink to="about" className="text-blue-500">
            Sobre
          </NavLink>
        </p>
        <p>TJ Territorios &copy; 2024</p>
      </footer>
    </>
  );
};

export default Footer;
