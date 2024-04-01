import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

//containers
import Bandeja from "./containers/Bandeja";

//components
import NavBar from "./components/NavBar/NavBar";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Footer from "./components/Footer/Footer";

//pages

const App = () => {
  return (
    <>
      <BrowserRouter>
        <NavBar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
        {/* <Footer/> */}
      </BrowserRouter>
    </>
  );
};

export default App;
