import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <>
    <footer className="text-center p-2 bg-body-tertiary">
        <p className="m-0 p-0">Desenvolvido por Mateus Luis & Marcos Assunção <NavLink to='about'>Sobre</NavLink></p>
        <p className="m-0 p-0">TJ Territorios &copy; 2024</p>
    </footer>
    </>
  )
}

export default Footer